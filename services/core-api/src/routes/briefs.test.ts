import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import Fastify, { type FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import briefsRoutes from './briefs.js';
import {
  setupPostgres,
  teardownPostgres,
  getTestPrismaClient,
} from '../__tests__/helpers/postgres-container.js';

const testOrgId = 'org_brief_test_123';
const testUserId = 'user_brief_test_123';

// Mock Clerk auth for tests
vi.mock('@clerk/fastify', () => ({
  clerkPlugin: vi.fn().mockImplementation(async () => {}),
  getAuth: vi.fn(() => ({
    userId: 'user_brief_test_123',
    sessionId: 'sess_brief_test',
    orgId: 'org_brief_test_123',
    orgRole: 'org:admin',
    orgSlug: 'brief-test-org',
    getToken: vi.fn(),
    has: vi.fn(),
    debug: vi.fn(),
  })),
  clerkClient: {
    users: {
      getOrganizationMembershipList: vi.fn().mockResolvedValue({
        data: [{ organization: { id: 'org_brief_test_123' } }],
      }),
    },
    organizations: {
      getOrganization: vi.fn(),
    },
  },
}));

const RUN_CONTAINERS = process.env.RUN_TESTCONTAINERS === '1';
const describeIf = RUN_CONTAINERS ? describe : describe.skip;

describeIf('Briefs API Routes', () => {
  let app: FastifyInstance;
  let prisma: PrismaClient;

  beforeAll(async () => {
    await setupPostgres();
    prisma = getTestPrismaClient();

    // Create Fastify app with routes
    app = Fastify();
    await app.register(briefsRoutes);

    // Create test org and user
    await prisma.$executeRaw`
      INSERT INTO organizations (id, name, slug)
      VALUES (${testOrgId}, 'Brief Test Org', 'brief-test-org')
      ON CONFLICT (slug) DO NOTHING
    `;

    await prisma.$executeRaw`
      INSERT INTO users (id, email)
      VALUES (${testUserId}, 'brief-test@example.com')
      ON CONFLICT (email) DO NOTHING
    `;

    await prisma.$executeRaw`
      INSERT INTO members (org_id, user_id, role)
      VALUES (${testOrgId}, ${testUserId}, 'owner')
      ON CONFLICT (org_id, user_id) DO NOTHING
    `;
  }, 60000);

  afterAll(async () => {
    await app.close();
    await teardownPostgres();
  });

  beforeEach(async () => {
    // Clear briefs and events before each test
    await prisma.$executeRaw`TRUNCATE briefs RESTART IDENTITY CASCADE`;
    await prisma.$executeRaw`DELETE FROM system_events WHERE event_type LIKE 'xentri.brief.%'`;
  });

  describe('POST /api/v1/briefs', () => {
    it('should create brief and return acknowledgment (AC1)', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/briefs',
        headers: {
          'content-type': 'application/json',
        },
        payload: {
          sections: {
            identity: {
              businessName: 'Test Business',
              tagline: 'Test tagline',
            },
          },
        },
      });

      expect(response.statusCode).toBe(201);
      const body = response.json();
      expect(body.data).toBeDefined();
      expect(body.data.id).toBeDefined();
      expect(body.data.orgId).toBe(testOrgId);
      expect(body.data.userId).toBe(testUserId);
      expect(body.data.sections.identity.businessName).toBe('Test Business');
      expect(body.data.completionStatus).toBe('draft');
    });

    it('should emit brief_created event on creation (AC2)', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/briefs',
        headers: {
          'content-type': 'application/json',
        },
        payload: {
          sections: {
            identity: {
              businessName: 'Event Test Business',
            },
          },
        },
      });

      expect(response.statusCode).toBe(201);
      const body = response.json();

      // Verify event was created
      await prisma.$executeRaw`SELECT set_config('app.current_org_id', ${testOrgId}, true)`;
      const events = await prisma.$queryRaw<Array<{ event_type: string; payload: { brief_id: string } }>>`
        SELECT event_type, payload
        FROM system_events
        WHERE event_type = 'xentri.brief.created.v1'
        AND org_id = ${testOrgId}
      `;

      expect(events.length).toBe(1);
      expect(events[0].payload.brief_id).toBe(body.data.id);
    });

    it('should calculate section status based on content', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/briefs',
        headers: {
          'content-type': 'application/json',
        },
        payload: {
          sections: {
            identity: {
              businessName: 'Filled Business',
              tagline: 'Has content',
            },
            audience: {}, // Empty
          },
        },
      });

      expect(response.statusCode).toBe(201);
      const body = response.json();
      expect(body.data.sectionStatus.identity).toBe('ready');
      expect(body.data.sectionStatus.audience).toBe('draft');
    });

    it('should allow creating empty brief', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/briefs',
        headers: {
          'content-type': 'application/json',
        },
        payload: {},
      });

      expect(response.statusCode).toBe(201);
      const body = response.json();
      expect(body.data.completionStatus).toBe('draft');
    });
  });

  describe('GET /api/v1/briefs/current', () => {
    it('should return null when no brief exists', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/briefs/current',
      });

      expect(response.statusCode).toBe(200);
      const body = response.json();
      expect(body.data).toBeNull();
    });

    it('should return current brief (AC3)', async () => {
      // Create a brief first
      await app.inject({
        method: 'POST',
        url: '/api/v1/briefs',
        headers: { 'content-type': 'application/json' },
        payload: {
          sections: {
            identity: { businessName: 'Current Brief Test' },
          },
        },
      });

      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/briefs/current',
      });

      expect(response.statusCode).toBe(200);
      const body = response.json();
      expect(body.data).not.toBeNull();
      expect(body.data.sections.identity.businessName).toBe('Current Brief Test');
    });
  });

  describe('GET /api/v1/briefs/:id', () => {
    it('should return brief by ID', async () => {
      // Create a brief first
      const createResponse = await app.inject({
        method: 'POST',
        url: '/api/v1/briefs',
        headers: { 'content-type': 'application/json' },
        payload: {
          sections: {
            identity: { businessName: 'Get By ID Test' },
          },
        },
      });

      const briefId = createResponse.json().data.id;

      const response = await app.inject({
        method: 'GET',
        url: `/api/v1/briefs/${briefId}`,
      });

      expect(response.statusCode).toBe(200);
      const body = response.json();
      expect(body.data.id).toBe(briefId);
    });

    it('should return 404 for non-existent brief', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/briefs/00000000-0000-0000-0000-000000000000',
      });

      expect(response.statusCode).toBe(404);
    });
  });

  describe('PATCH /api/v1/briefs/:id', () => {
    it('should update brief sections', async () => {
      // Create a brief first
      const createResponse = await app.inject({
        method: 'POST',
        url: '/api/v1/briefs',
        headers: { 'content-type': 'application/json' },
        payload: {
          sections: {
            identity: { businessName: 'Original Name' },
          },
        },
      });

      const briefId = createResponse.json().data.id;

      const response = await app.inject({
        method: 'PATCH',
        url: `/api/v1/briefs/${briefId}`,
        headers: { 'content-type': 'application/json' },
        payload: {
          sections: {
            identity: { businessName: 'Updated Name', tagline: 'New tagline' },
          },
        },
      });

      expect(response.statusCode).toBe(200);
      const body = response.json();
      expect(body.data.sections.identity.businessName).toBe('Updated Name');
      expect(body.data.sections.identity.tagline).toBe('New tagline');
    });

    it('should emit brief_updated event on update', async () => {
      // Create a brief first
      const createResponse = await app.inject({
        method: 'POST',
        url: '/api/v1/briefs',
        headers: { 'content-type': 'application/json' },
        payload: {
          sections: {
            identity: { businessName: 'Will Update' },
          },
        },
      });

      const briefId = createResponse.json().data.id;

      // Clear events from creation
      await prisma.$executeRaw`DELETE FROM system_events WHERE event_type = 'xentri.brief.updated.v1'`;

      // Update the brief
      await app.inject({
        method: 'PATCH',
        url: `/api/v1/briefs/${briefId}`,
        headers: { 'content-type': 'application/json' },
        payload: {
          sections: {
            identity: { businessName: 'Did Update' },
          },
        },
      });

      // Verify update event was created
      await prisma.$executeRaw`SELECT set_config('app.current_org_id', ${testOrgId}, true)`;
      const events = await prisma.$queryRaw<Array<{ event_type: string; payload: { sections_changed: string[] } }>>`
        SELECT event_type, payload
        FROM system_events
        WHERE event_type = 'xentri.brief.updated.v1'
        AND org_id = ${testOrgId}
      `;

      expect(events.length).toBe(1);
      expect(events[0].payload.sections_changed).toContain('identity');
    });

    it('should return 404 for non-existent brief', async () => {
      const response = await app.inject({
        method: 'PATCH',
        url: '/api/v1/briefs/00000000-0000-0000-0000-000000000000',
        headers: { 'content-type': 'application/json' },
        payload: {
          sections: {
            identity: { businessName: 'Won\'t work' },
          },
        },
      });

      expect(response.statusCode).toBe(404);
    });
  });

  describe('Event Visibility (AC2, AC4)', () => {
    it('should query brief.created events via events API with type filter (AC2)', async () => {
      // Create a brief which emits brief.created event
      const createResponse = await app.inject({
        method: 'POST',
        url: '/api/v1/briefs',
        headers: { 'content-type': 'application/json' },
        payload: {
          sections: {
            identity: {
              businessName: 'Event Query Test',
              tagline: 'Testing event visibility',
            },
            audience: {
              primaryAudience: 'Developers',
            },
          },
        },
      });

      expect(createResponse.statusCode).toBe(201);
      const briefId = createResponse.json().data.id;

      // Query events via direct database (simulating GET /api/v1/events?type=xentri.brief.created.v1)
      await prisma.$executeRaw`SELECT set_config('app.current_org_id', ${testOrgId}, true)`;
      const events = await prisma.$queryRaw<
        Array<{
          id: string;
          event_type: string;
          org_id: string;
          payload: {
            brief_id: string;
            schema_version: string;
            completion_status: string;
            sections_populated: string[];
          };
        }>
      >`
        SELECT id, event_type, org_id, payload
        FROM system_events
        WHERE event_type = 'xentri.brief.created.v1'
        AND org_id = ${testOrgId}
        ORDER BY occurred_at DESC
        LIMIT 1
      `;

      expect(events.length).toBe(1);
      const event = events[0];

      // Verify event payload contains expected Brief data
      expect(event.event_type).toBe('xentri.brief.created.v1');
      expect(event.org_id).toBe(testOrgId);
      expect(event.payload.brief_id).toBe(briefId);
      expect(event.payload.schema_version).toBe('1.0');
      expect(event.payload.completion_status).toBe('draft');
      expect(event.payload.sections_populated).toContain('identity');
      expect(event.payload.sections_populated).toContain('audience');
    });

    it('should not see brief events from other orgs (AC4)', async () => {
      const otherOrgId = 'org_event_isolation_123';

      // Create other org
      await prisma.$executeRaw`
        INSERT INTO organizations (id, name, slug)
        VALUES (${otherOrgId}, 'Event Isolation Org', 'event-isolation-org')
        ON CONFLICT (slug) DO NOTHING
      `;

      // Create brief event directly in other org
      await prisma.$executeRaw`SELECT set_config('app.current_org_id', ${otherOrgId}, true)`;
      await prisma.$executeRaw`
        INSERT INTO system_events (
          event_type, org_id, user_id, actor_type, actor_id,
          payload_schema, payload, source
        ) VALUES (
          'xentri.brief.created.v1',
          ${otherOrgId},
          'user_other',
          'user',
          'user_other',
          'brief.created@1.0',
          '{"brief_id": "hidden-brief", "schema_version": "1.0", "completion_status": "draft", "sections_populated": []}'::jsonb,
          'test'
        )
      `;

      // Query events as testOrgId - should NOT see other org's events
      await prisma.$executeRaw`SELECT set_config('app.current_org_id', ${testOrgId}, true)`;
      const events = await prisma.$queryRaw<Array<{ org_id: string }>>`
        SELECT org_id
        FROM system_events
        WHERE event_type = 'xentri.brief.created.v1'
      `;

      // All returned events should belong to testOrgId
      events.forEach((event) => {
        expect(event.org_id).toBe(testOrgId);
        expect(event.org_id).not.toBe(otherOrgId);
      });
    });
  });

  describe('RLS Cross-Org Isolation (AC4)', () => {
    const otherOrgId = 'org_other_brief_123';
    const otherUserId = 'user_other_brief_123';

    beforeAll(async () => {
      // Create another org for isolation tests
      await prisma.$executeRaw`
        INSERT INTO organizations (id, name, slug)
        VALUES (${otherOrgId}, 'Other Brief Org', 'other-brief-org')
        ON CONFLICT (slug) DO NOTHING
      `;

      await prisma.$executeRaw`
        INSERT INTO users (id, email)
        VALUES (${otherUserId}, 'other-brief@example.com')
        ON CONFLICT (email) DO NOTHING
      `;

      await prisma.$executeRaw`
        INSERT INTO members (org_id, user_id, role)
        VALUES (${otherOrgId}, ${otherUserId}, 'owner')
        ON CONFLICT (org_id, user_id) DO NOTHING
      `;
    });

    it('should not return briefs from another org (GET /current)', async () => {
      // Create brief in other org directly (bypassing API to use other org context)
      await prisma.$executeRaw`SELECT set_config('app.current_org_id', ${otherOrgId}, true)`;
      await prisma.$executeRaw`
        INSERT INTO briefs (org_id, user_id, sections, section_status)
        VALUES (${otherOrgId}, ${otherUserId}, '{"identity": {"businessName": "Other Org Brief"}}'::jsonb, '{}'::jsonb)
      `;

      // Request using testOrgId (mocked auth) - should NOT see other org's brief
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/briefs/current',
      });

      expect(response.statusCode).toBe(200);
      const body = response.json();
      // Should be null since testOrgId has no brief
      expect(body.data).toBeNull();
    });

    it('should not return brief by ID from another org', async () => {
      // Create brief in other org
      await prisma.$executeRaw`SELECT set_config('app.current_org_id', ${otherOrgId}, true)`;
      const insertResult = await prisma.$queryRaw<Array<{ id: string }>>`
        INSERT INTO briefs (org_id, user_id, sections, section_status)
        VALUES (${otherOrgId}, ${otherUserId}, '{"identity": {"businessName": "Hidden Brief"}}'::jsonb, '{}'::jsonb)
        RETURNING id
      `;
      const otherBriefId = insertResult[0].id;

      // Try to fetch using testOrgId context - should NOT find it
      const response = await app.inject({
        method: 'GET',
        url: `/api/v1/briefs/${otherBriefId}`,
      });

      expect(response.statusCode).toBe(404);
    });

    it('should not update brief from another org', async () => {
      // Create brief in other org
      await prisma.$executeRaw`SELECT set_config('app.current_org_id', ${otherOrgId}, true)`;
      const insertResult = await prisma.$queryRaw<Array<{ id: string }>>`
        INSERT INTO briefs (org_id, user_id, sections, section_status)
        VALUES (${otherOrgId}, ${otherUserId}, '{"identity": {"businessName": "Protected Brief"}}'::jsonb, '{}'::jsonb)
        RETURNING id
      `;
      const otherBriefId = insertResult[0].id;

      // Try to update using testOrgId context - should fail
      const response = await app.inject({
        method: 'PATCH',
        url: `/api/v1/briefs/${otherBriefId}`,
        headers: { 'content-type': 'application/json' },
        payload: {
          sections: {
            identity: { businessName: 'Hacked!' },
          },
        },
      });

      expect(response.statusCode).toBe(404);

      // Verify original is unchanged
      await prisma.$executeRaw`SELECT set_config('app.current_org_id', ${otherOrgId}, true)`;
      const unchanged = await prisma.$queryRaw<Array<{ sections: { identity: { businessName: string } } }>>`
        SELECT sections FROM briefs WHERE id = ${otherBriefId}
      `;
      expect(unchanged[0].sections.identity.businessName).toBe('Protected Brief');
    });
  });
});
