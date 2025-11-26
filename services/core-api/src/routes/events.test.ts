import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import Fastify, { type FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import eventsRoutes from './events.js';
import {
  setupPostgres,
  teardownPostgres,
  getTestPrismaClient,
} from '../__tests__/helpers/postgres-container.js';

describe('Events API Routes', () => {
  let app: FastifyInstance;
  let prisma: PrismaClient;
  const testOrgId = 'e1111111-1111-1111-1111-111111111111';
  const testUserId = 'u1111111-1111-1111-1111-111111111111';

  beforeAll(async () => {
    await setupPostgres();
    prisma = getTestPrismaClient();

    // Create Fastify app with routes
    app = Fastify();
    await app.register(eventsRoutes);

    // Create test org and user
    await prisma.$executeRaw`
      INSERT INTO organizations (id, name, slug)
      VALUES (${testOrgId}::uuid, 'API Test Org', 'api-test-org')
      ON CONFLICT (slug) DO NOTHING
    `;

    await prisma.$executeRaw`
      INSERT INTO users (id, email)
      VALUES (${testUserId}::uuid, 'api-test@example.com')
      ON CONFLICT (email) DO NOTHING
    `;
  }, 60000);

  afterAll(async () => {
    await app.close();
    await teardownPostgres();
  });

  beforeEach(async () => {
    // Clear events before each test
    await prisma.$executeRaw`TRUNCATE system_events RESTART IDENTITY CASCADE`;
  });

  describe('POST /api/v1/events', () => {
    it('should create event and return acknowledgment (AC6)', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/events',
        headers: {
          'x-org-id': testOrgId,
          'content-type': 'application/json',
        },
        payload: {
          type: 'xentri.user.signup.v1',
          org_id: testOrgId,
          actor: { type: 'user', id: testUserId },
          payload_schema: 'user.signup@1.0',
          payload: { email: 'new@example.com' },
          source: 'test',
          envelope_version: '1.0',
        },
      });

      expect(response.statusCode).toBe(201);
      const body = response.json();
      expect(body.acknowledged).toBe(true);
      expect(body.event_id).toBeDefined();
    });

    it('should return 403 when x-org-id is missing', async () => {
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
      });

      expect(response.statusCode).toBe(403);
      const body = response.json();
      expect(body.type).toBe('https://xentri.app/errors/forbidden');
    });

    it('should return 403 when org_id in body mismatches header', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/events',
        headers: {
          'x-org-id': testOrgId,
          'content-type': 'application/json',
        },
        payload: {
          type: 'xentri.user.signup.v1',
          org_id: 'e2222222-2222-2222-2222-222222222222', // Different org
          actor: { type: 'user', id: testUserId },
          payload_schema: 'user.signup@1.0',
          payload: {},
          source: 'test',
          envelope_version: '1.0',
        },
      });

      expect(response.statusCode).toBe(403);
    });

    it('should return 422 for invalid payload (Zod validation)', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/events',
        headers: {
          'x-org-id': testOrgId,
          'content-type': 'application/json',
        },
        payload: {
          type: 'invalid.event.type', // Invalid type
          org_id: testOrgId,
          actor: { type: 'user', id: testUserId },
          payload_schema: 'test@1.0',
          payload: {},
          source: 'test',
          envelope_version: '1.0',
        },
      });

      expect(response.statusCode).toBe(422);
      const body = response.json();
      expect(body.type).toBe('https://xentri.app/errors/validation');
    });
  });

  describe('GET /api/v1/events', () => {
    beforeEach(async () => {
      // Seed test events
      await prisma.$executeRaw`SELECT set_config('app.current_org_id', ${testOrgId}, true)`;

      for (let i = 0; i < 5; i++) {
        await prisma.$executeRaw`
          INSERT INTO system_events (
            org_id, event_type, actor_type, actor_id, payload_schema, payload, source
          ) VALUES (
            ${testOrgId}::uuid,
            'xentri.user.login.v1',
            'user',
            ${testUserId},
            'user.login@1.0',
            '{"email": "test@example.com"}'::jsonb,
            'test'
          )
        `;
      }
    });

    it('should return org-scoped events (AC7)', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/events',
        headers: {
          'x-org-id': testOrgId,
        },
      });

      expect(response.statusCode).toBe(200);
      const body = response.json();
      expect(body.data).toBeDefined();
      expect(Array.isArray(body.data)).toBe(true);
      expect(body.meta).toBeDefined();
      expect(typeof body.meta.has_more).toBe('boolean');
    });

    it('should filter by type parameter', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/events?type=xentri.user.login.v1',
        headers: {
          'x-org-id': testOrgId,
        },
      });

      expect(response.statusCode).toBe(200);
      const body = response.json();
      body.data.forEach((event: { type: string }) => {
        expect(event.type).toBe('xentri.user.login.v1');
      });
    });

    it('should filter by since parameter', async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const response = await app.inject({
        method: 'GET',
        url: `/api/v1/events?since=${yesterday.toISOString()}`,
        headers: {
          'x-org-id': testOrgId,
        },
      });

      expect(response.statusCode).toBe(200);
    });

    it('should respect limit parameter', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/events?limit=2',
        headers: {
          'x-org-id': testOrgId,
        },
      });

      expect(response.statusCode).toBe(200);
      const body = response.json();
      expect(body.data.length).toBeLessThanOrEqual(2);
    });

    it('should support cursor-based pagination', async () => {
      // Get first page
      const page1Response = await app.inject({
        method: 'GET',
        url: '/api/v1/events?limit=2',
        headers: {
          'x-org-id': testOrgId,
        },
      });

      const page1 = page1Response.json();

      if (page1.meta.has_more && page1.meta.cursor) {
        // Get second page
        const page2Response = await app.inject({
          method: 'GET',
          url: `/api/v1/events?limit=2&cursor=${page1.meta.cursor}`,
          headers: {
            'x-org-id': testOrgId,
          },
        });

        expect(page2Response.statusCode).toBe(200);
        const page2 = page2Response.json();

        // Verify no overlap
        const page1Ids = page1.data.map((e: { id: string }) => e.id);
        const page2Ids = page2.data.map((e: { id: string }) => e.id);

        page2Ids.forEach((id: string) => {
          expect(page1Ids).not.toContain(id);
        });
      }
    });

    it('should return 400 for invalid type parameter', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/events?type=invalid.type',
        headers: {
          'x-org-id': testOrgId,
        },
      });

      expect(response.statusCode).toBe(400);
      const body = response.json();
      expect(body.type).toBe('https://xentri.app/errors/bad-request');
    });

    it('should return 403 when x-org-id is missing', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/events',
      });

      expect(response.statusCode).toBe(403);
    });
  });
});
