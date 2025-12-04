import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest'
import Fastify, { type FastifyInstance } from 'fastify'
import { PrismaClient } from '@prisma/client'
import eventsRoutes from './events.js'
import {
  setupPostgres,
  teardownPostgres,
  getTestPrismaClient,
} from '../__tests__/helpers/postgres-container.js'

const testOrgId = 'org_test_123'
const testUserId = 'user_test_123'

// Clerk auth is required by events routes; mock getAuth for tests
vi.mock('@clerk/fastify', () => ({
  clerkPlugin: vi.fn().mockImplementation(async () => {}),
  getAuth: vi.fn(() => ({
    userId: 'user_test_123',
    sessionId: 'sess_test',
    orgId: 'org_test_123',
    orgRole: 'org:admin',
    orgSlug: 'api-test-org',
    getToken: vi.fn(),
    has: vi.fn(),
    debug: vi.fn(),
  })),
  clerkClient: {
    users: {
      getOrganizationMembershipList: vi.fn().mockResolvedValue({
        data: [{ organization: { id: 'org_test_123' } }],
      }),
    },
    organizations: {
      getOrganization: vi.fn(),
    },
  },
}))

const RUN_CONTAINERS = process.env.RUN_TESTCONTAINERS === '1'
const describeIf = RUN_CONTAINERS ? describe : describe.skip

describeIf('Events API Routes', () => {
  let app: FastifyInstance
  let prisma: PrismaClient

  beforeAll(async () => {
    await setupPostgres()
    prisma = getTestPrismaClient()

    // Create Fastify app with routes
    app = Fastify()
    await app.register(eventsRoutes)

    // Create test org and user
    await prisma.$executeRaw`
      INSERT INTO organizations (id, name, slug)
      VALUES (${testOrgId}, 'API Test Org', 'api-test-org')
      ON CONFLICT (slug) DO NOTHING
    `

    await prisma.$executeRaw`
      INSERT INTO users (id, email)
      VALUES (${testUserId}, 'api-test@example.com')
      ON CONFLICT (email) DO NOTHING
    `

    await prisma.$executeRaw`
      INSERT INTO members (org_id, user_id, role)
      VALUES (${testOrgId}, ${testUserId}, 'owner')
      ON CONFLICT (org_id, user_id) DO NOTHING
    `
  }, 60000)

  afterAll(async () => {
    await app.close()
    await teardownPostgres()
  })

  beforeEach(async () => {
    // Clear events before each test
    await prisma.$executeRaw`TRUNCATE system_events RESTART IDENTITY CASCADE`
  })

  describe('POST /api/v1/events', () => {
    it('should create event and return acknowledgment (AC6)', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/events',
        headers: {
          'content-type': 'application/json',
        },
        payload: {
          type: 'xentri.user.signup.v1',
          org_id: testOrgId,
          user_id: testUserId,
          actor: { type: 'user', id: testUserId },
          payload_schema: 'user.signup@1.0',
          payload: { email: 'new@example.com' },
          source: 'test',
          envelope_version: '1.0',
        },
      })

      expect(response.statusCode).toBe(201)
      const body = response.json()
      expect(body.acknowledged).toBe(true)
      expect(body.event_id).toBeDefined()
    })

    it('should use Clerk org context when x-org-id is missing', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/events',
        headers: {
          'content-type': 'application/json',
        },
        payload: {
          type: 'xentri.user.signup.v1',
          org_id: testOrgId,
          actor: { type: 'user', id: testUserId },
          payload_schema: 'user.signup@1.0',
          payload: {},
          source: 'test',
          envelope_version: '1.0',
        },
      })

      expect(response.statusCode).toBe(201)
    })

    it('should return 403 when org_id in body mismatches header', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/events',
        headers: {
          'content-type': 'application/json',
        },
        payload: {
          type: 'xentri.user.signup.v1',
          org_id: 'e2222222-2222-2222-2222-222222222222', // Different org
          user_id: testUserId,
          actor: { type: 'user', id: testUserId },
          payload_schema: 'user.signup@1.0',
          payload: {},
          source: 'test',
          envelope_version: '1.0',
        },
      })

      expect(response.statusCode).toBe(403)
    })

    it.skip('should return 401 when x-user-id is missing (handled by Clerk auth)', () => {})

    it.skip('should return 403 when user is not a member of the org (requires Clerk membership mock)', () => {})

    it('should return 422 for invalid payload (Zod validation)', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/events',
        headers: {
          'content-type': 'application/json',
        },
        payload: {
          type: 'invalid.event.type', // Invalid type
          org_id: testOrgId,
          user_id: testUserId,
          actor: { type: 'user', id: testUserId },
          payload_schema: 'test@1.0',
          payload: {},
          source: 'test',
          envelope_version: '1.0',
        },
      })

      expect(response.statusCode).toBe(422)
      const body = response.json()
      expect(body.type).toBe('https://xentri.app/errors/validation')
    })
  })

  describe('GET /api/v1/events', () => {
    beforeEach(async () => {
      // Seed test events
      await prisma.$executeRaw`SELECT set_config('app.current_org_id', ${testOrgId}, true)`

      for (let i = 0; i < 5; i++) {
        await prisma.$executeRaw`
          INSERT INTO system_events (
            org_id, event_type, actor_type, actor_id, payload_schema, payload, source
          ) VALUES (
            ${testOrgId},
            'xentri.user.login.v1',
            'user',
            ${testUserId},
            'user.login@1.0',
            '{"email": "test@example.com"}'::jsonb,
            'test'
          )
        `
      }
    })

    it('should return org-scoped events (AC7)', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/events',
      })

      expect(response.statusCode).toBe(200)
      const body = response.json()
      expect(body.data).toBeDefined()
      expect(Array.isArray(body.data)).toBe(true)
      expect(body.meta).toBeDefined()
      expect(typeof body.meta.has_more).toBe('boolean')
    })

    it('should filter by type parameter', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/events?type=xentri.user.login.v1',
      })

      expect(response.statusCode).toBe(200)
      const body = response.json()
      body.data.forEach((event: { type: string }) => {
        expect(event.type).toBe('xentri.user.login.v1')
      })
    })

    it('should filter by since parameter', async () => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)

      const response = await app.inject({
        method: 'GET',
        url: `/api/v1/events?since=${yesterday.toISOString()}`,
      })

      expect(response.statusCode).toBe(200)
    })

    it('should respect limit parameter', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/events?limit=2',
      })

      expect(response.statusCode).toBe(200)
      const body = response.json()
      expect(body.data.length).toBeLessThanOrEqual(2)
    })

    it('should support cursor-based pagination', async () => {
      // Get first page
      const page1Response = await app.inject({
        method: 'GET',
        url: '/api/v1/events?limit=2',
      })

      const page1 = page1Response.json()

      if (page1.meta.has_more && page1.meta.cursor) {
        // Get second page
        const page2Response = await app.inject({
          method: 'GET',
          url: `/api/v1/events?limit=2&cursor=${page1.meta.cursor}`,
        })

        expect(page2Response.statusCode).toBe(200)
        const page2 = page2Response.json()

        // Verify no overlap
        const page1Ids = page1.data.map((e: { id: string }) => e.id)
        const page2Ids = page2.data.map((e: { id: string }) => e.id)

        page2Ids.forEach((id: string) => {
          expect(page1Ids).not.toContain(id)
        })
      }
    })

    it('should return 400 for invalid type parameter', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/events?type=invalid.type',
      })

      expect(response.statusCode).toBe(400)
      const body = response.json()
      expect(body.type).toBe('https://xentri.app/errors/bad-request')
    })

    it.skip('should return 401 when unauthenticated (handled by Clerk auth)', () => {})

    it.skip('should return 403 when user is not a member of the org (requires Clerk membership mock)', () => {})

    it('should allow requests without x-org-id by using Clerk org context', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/events',
      })

      expect(response.statusCode).toBe(200)
    })

    it('should not return events from another org (RLS cross-org isolation)', async () => {
      const otherOrgId = 'org_other_123'

      // Create other org
      await prisma.$executeRaw`
        INSERT INTO organizations (id, name, slug)
        VALUES (${otherOrgId}, 'Other Org', 'other-org')
        ON CONFLICT (slug) DO NOTHING
      `

      // Seed event for other org (with proper RLS context)
      await prisma.$executeRaw`SELECT set_config('app.current_org_id', ${otherOrgId}, true)`
      await prisma.$executeRaw`
        INSERT INTO system_events (
          org_id, event_type, actor_type, actor_id, payload_schema, payload, source
        ) VALUES (
          ${otherOrgId},
          'xentri.user.signup.v1',
          'system',
          'test',
          'user.signup@1.0',
          '{"email": "other@example.com"}'::jsonb,
          'test'
        )
      `

      // Request events using testOrgId header - should NOT see otherOrgId events
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/events',
        headers: {
          'x-org-id': testOrgId,
        },
      })

      expect(response.statusCode).toBe(200)
      const body = response.json()

      // Verify no events from other org leaked
      body.data.forEach((event: { org_id: string }) => {
        expect(event.org_id).toBe(testOrgId)
        expect(event.org_id).not.toBe(otherOrgId)
      })
    })
  })

  describe('Payload Validation (AC6)', () => {
    it('should reject invalid payload shape for user.signup event', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/events',
        headers: {
          'content-type': 'application/json',
        },
        payload: {
          type: 'xentri.user.signup.v1',
          org_id: testOrgId,
          actor: { type: 'user', id: testUserId },
          payload_schema: 'user.signup@1.0',
          payload: { invalid_field: 'no email' }, // Missing required 'email'
          source: 'test',
          envelope_version: '1.0',
        },
      })

      expect(response.statusCode).toBe(422)
      const body = response.json()
      expect(body.detail).toContain('email')
    })

    it('should reject malformed email in user.signup payload', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/events',
        headers: {
          'content-type': 'application/json',
        },
        payload: {
          type: 'xentri.user.signup.v1',
          org_id: testOrgId,
          actor: { type: 'user', id: testUserId },
          payload_schema: 'user.signup@1.0',
          payload: { email: 'not-an-email' }, // Invalid email format
          source: 'test',
          envelope_version: '1.0',
        },
      })

      expect(response.statusCode).toBe(422)
      const body = response.json()
      expect(body.detail).toContain('email')
    })

    it('should accept valid payload matching event type schema', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/events',
        headers: {
          'content-type': 'application/json',
        },
        payload: {
          type: 'xentri.user.signup.v1',
          org_id: testOrgId,
          actor: { type: 'user', id: testUserId },
          payload_schema: 'user.signup@1.0',
          payload: { email: 'valid@example.com', name: 'Test User' },
          source: 'test',
          envelope_version: '1.0',
        },
      })

      expect(response.statusCode).toBe(201)
      const body = response.json()
      expect(body.acknowledged).toBe(true)
    })

    it('should reject org.created payload missing required fields', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/events',
        headers: {
          'x-org-id': testOrgId,
          'x-user-id': testUserId,
          'content-type': 'application/json',
        },
        payload: {
          type: 'xentri.org.created.v1',
          org_id: testOrgId,
          actor: { type: 'system', id: 'bootstrap' },
          payload_schema: 'org.created@1.0',
          payload: { name: 'Test' }, // Missing required 'slug' and 'owner_id'
          source: 'test',
          envelope_version: '1.0',
        },
      })

      expect(response.statusCode).toBe(422)
    })
  })
})
