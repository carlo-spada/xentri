import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import Fastify from 'fastify';
import { PrismaClient } from '@prisma/client';
import orgsRoutes from './orgs.js';
import {
  setupPostgres,
  teardownPostgres,
  getTestPrismaClient,
} from '../__tests__/helpers/postgres-container.js';
import { getAuth } from '@clerk/fastify';

vi.mock('@clerk/fastify', () => ({
  getAuth: vi.fn(),
}));

const RUN_CONTAINERS = process.env.RUN_TESTCONTAINERS === '1';
const describeIf = RUN_CONTAINERS ? describe : describe.skip;

const testOrgId = 'org_route_123';
const testUserId = 'user_route_123';

describeIf('Org Routes', () => {
  let app: ReturnType<typeof Fastify>;
  let prisma: PrismaClient;

  beforeAll(async () => {
    await setupPostgres();
    prisma = getTestPrismaClient();

    app = Fastify();
    await app.register(orgsRoutes);
    await app.ready();
  }, 120000);

  afterAll(async () => {
    await app.close();
    await teardownPostgres();
  });

  beforeEach(async () => {
    // Reset tables and seed org + settings + member
    await prisma.$executeRaw`TRUNCATE system_events, org_settings, members, organizations, users RESTART IDENTITY CASCADE`;

    await prisma.$executeRaw`
      INSERT INTO organizations (id, name, slug)
      VALUES (${testOrgId}, 'Route Test Org', 'route-test-org')
    `;

    await prisma.$executeRaw`
      INSERT INTO users (id, email)
      VALUES (${testUserId}, 'route-test@example.com')
    `;

    await prisma.$executeRaw`
      INSERT INTO members (org_id, user_id, role)
      VALUES (${testOrgId}, ${testUserId}, 'owner')
    `;

    await prisma.$executeRaw`
      INSERT INTO org_settings (org_id, plan, features, preferences)
      VALUES (${testOrgId}, 'free', '{}'::jsonb, '{}'::jsonb)
      ON CONFLICT (org_id) DO NOTHING
    `;

    vi.mocked(getAuth).mockReturnValue({
      userId: testUserId,
      sessionId: 'sess_test',
      orgId: testOrgId,
      orgRole: 'org:admin',
      orgSlug: 'route-test-org',
      getToken: vi.fn(),
      has: vi.fn(),
      debug: vi.fn(),
    });
  });

  it('returns current org with settings', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/orgs/current',
    });

    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.org.id).toBe(testOrgId);
    expect(body.org.settings.plan).toBe('free');
  });

  it('rejects settings update for non-owner', async () => {
    vi.mocked(getAuth).mockReturnValueOnce({
      userId: testUserId,
      sessionId: 'sess_test',
      orgId: testOrgId,
      orgRole: 'org:member',
      orgSlug: 'route-test-org',
      getToken: vi.fn(),
      has: vi.fn(),
      debug: vi.fn(),
    });

    const response = await app.inject({
      method: 'PATCH',
      url: '/api/v1/orgs/current/settings',
      payload: {
        preferences: { timezone: 'UTC' },
      },
    });

    expect(response.statusCode).toBe(403);
  });

  it('updates preferences for owner', async () => {
    const response = await app.inject({
      method: 'PATCH',
      url: '/api/v1/orgs/current/settings',
      payload: {
        preferences: { timezone: 'UTC' },
      },
    });

    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.settings.preferences.timezone).toBe('UTC');

    const settings = await prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT set_config('app.current_org_id', ${testOrgId}, true)`;
      return tx.orgSettings.findUnique({ where: { orgId: testOrgId } });
    });

    expect(settings?.preferences).toEqual({ timezone: 'UTC' });
  });
});
