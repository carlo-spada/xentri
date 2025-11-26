import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { EventService } from './EventService.js';
import {
  setupPostgres,
  teardownPostgres,
  getTestPrismaClient,
} from '../../__tests__/helpers/postgres-container.js';

describe('EventService', () => {
  let prisma: PrismaClient;
  let eventService: EventService;
  let testOrgId: string;
  let testUserId: string;

  beforeAll(async () => {
    await setupPostgres();
    prisma = getTestPrismaClient();
    eventService = new EventService(prisma);

    // Create test organization and user
    testOrgId = 'e0000000-0000-0000-0000-000000000001';
    testUserId = 'u0000000-0000-0000-0000-000000000001';

    await prisma.$executeRaw`
      INSERT INTO organizations (id, name, slug)
      VALUES (${testOrgId}::uuid, 'Test Org', 'test-org')
      ON CONFLICT (slug) DO NOTHING
    `;

    await prisma.$executeRaw`
      INSERT INTO users (id, email)
      VALUES (${testUserId}::uuid, 'test@example.com')
      ON CONFLICT (email) DO NOTHING
    `;
  }, 60000);

  afterAll(async () => {
    await teardownPostgres();
  });

  describe('createEvent', () => {
    it('should create an event and return acknowledgment', async () => {
      const input = {
        type: 'xentri.user.signup.v1' as const,
        org_id: testOrgId,
        user_id: testUserId,
        actor: { type: 'user' as const, id: testUserId },
        payload_schema: 'user.signup@1.0',
        payload: { email: 'test@example.com', name: 'Test User' },
        source: 'test',
        envelope_version: '1.0' as const,
      };

      const result = await eventService.createEvent(input, testOrgId);

      expect(result.acknowledged).toBe(true);
      expect(result.event_id).toBeDefined();
      expect(typeof result.event_id).toBe('string');
    });

    it('should generate dedupe_key if not provided', async () => {
      const input = {
        type: 'xentri.org.created.v1' as const,
        org_id: testOrgId,
        actor: { type: 'system' as const, id: 'test-system' },
        payload_schema: 'org.created@1.0',
        payload: { name: 'New Org', slug: 'new-org', owner_id: testUserId },
        source: 'test',
        envelope_version: '1.0' as const,
      };

      const result = await eventService.createEvent(input, testOrgId);
      expect(result.acknowledged).toBe(true);
    });

    it('should reject invalid event type', async () => {
      const input = {
        type: 'invalid.event.type' as 'xentri.user.signup.v1',
        org_id: testOrgId,
        actor: { type: 'user' as const, id: testUserId },
        payload_schema: 'invalid@1.0',
        payload: {},
        source: 'test',
        envelope_version: '1.0' as const,
      };

      await expect(eventService.createEvent(input, testOrgId)).rejects.toThrow();
    });
  });

  describe('listEvents', () => {
    beforeAll(async () => {
      // Seed some test events
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
            ${{ email: 'test@example.com' }}::jsonb,
            'test'
          )
        `;
      }
    });

    it('should list events with default pagination', async () => {
      const result = await eventService.listEvents(testOrgId);

      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.meta).toBeDefined();
      expect(typeof result.meta.has_more).toBe('boolean');
    });

    it('should filter by event type', async () => {
      const result = await eventService.listEvents(testOrgId, {
        type: 'xentri.user.login.v1',
      });

      expect(result.data.length).toBeGreaterThan(0);
      result.data.forEach((event) => {
        expect(event.type).toBe('xentri.user.login.v1');
      });
    });

    it('should filter by since timestamp', async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const result = await eventService.listEvents(testOrgId, {
        since: yesterday,
      });

      result.data.forEach((event) => {
        expect(new Date(event.occurred_at).getTime()).toBeGreaterThanOrEqual(
          yesterday.getTime()
        );
      });
    });

    it('should respect limit parameter', async () => {
      const result = await eventService.listEvents(testOrgId, { limit: 2 });

      expect(result.data.length).toBeLessThanOrEqual(2);
    });

    it('should support cursor-based pagination', async () => {
      // Get first page
      const page1 = await eventService.listEvents(testOrgId, { limit: 2 });

      if (page1.meta.has_more && page1.meta.cursor) {
        // Get second page
        const page2 = await eventService.listEvents(testOrgId, {
          limit: 2,
          cursor: page1.meta.cursor,
        });

        // Events should not overlap
        const page1Ids = page1.data.map((e) => e.id);
        const page2Ids = page2.data.map((e) => e.id);

        page2Ids.forEach((id) => {
          expect(page1Ids).not.toContain(id);
        });
      }
    });
  });
});
