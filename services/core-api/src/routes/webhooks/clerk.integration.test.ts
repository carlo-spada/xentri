import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import Fastify from 'fastify';
import { PrismaClient } from '@prisma/client';
import clerkWebhookRoutes from './clerk.js';
import {
  setupPostgres,
  teardownPostgres,
  getTestPrismaClient,
  setOrgContext,
  clearOrgContext,
} from '../../__tests__/helpers/postgres-container.js';

vi.mock('svix', () => ({
  Webhook: vi.fn().mockImplementation(() => ({
    verify: vi.fn().mockImplementation((payload) => JSON.parse(payload)),
  })),
}));

const svixHeaders = {
  'svix-id': 'msg_test',
  'svix-timestamp': `${Date.now()}`,
  'svix-signature': 'v1,test',
  'content-type': 'application/json',
};

const RUN_CONTAINERS = process.env.RUN_TESTCONTAINERS === '1';
const describeIf = RUN_CONTAINERS ? describe : describe.skip;

describeIf('Clerk Webhook Integration - organization.created', () => {
  let app: ReturnType<typeof Fastify>;
  let prisma: PrismaClient;

  beforeAll(async () => {
    const connectionString = await setupPostgres();
    process.env.DATABASE_URL = connectionString;
    process.env.CLERK_WEBHOOK_SECRET = 'whsec_test_secret';

    prisma = getTestPrismaClient();

    app = Fastify();
    await app.register(clerkWebhookRoutes);
    await app.ready();
  }, 120000);

  afterAll(async () => {
    await app.close();
    await teardownPostgres();
  });

  beforeEach(async () => {
    await prisma.$executeRaw`TRUNCATE system_events, org_settings, members, organizations, users RESTART IDENTITY CASCADE`;
    await clearOrgContext();
  });

  it('provisions org, membership, settings, and emits provisioned event', async () => {
    const payload = {
      type: 'organization.created',
      data: {
        id: 'org_webhook_001',
        name: 'Webhook Org',
        slug: 'webhook-org',
        created_by: 'user_webhook_001',
        created_at: Date.now(),
      },
    };

    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/webhooks/clerk',
      payload,
      headers: svixHeaders,
    });

    expect(response.statusCode).toBe(200);

    // Org exists
    const org = await prisma.organization.findUnique({ where: { id: 'org_webhook_001' } });
    expect(org).not.toBeNull();

    // Settings exist
    const settings = await prisma.orgSettings.findUnique({ where: { orgId: 'org_webhook_001' } });
    expect(settings).not.toBeNull();
    expect(settings?.plan).toBe('free');

    // Membership exists with owner role (RLS context required)
    await setOrgContext('org_webhook_001');
    const membership = await prisma.member.findUnique({
      where: { orgId_userId: { orgId: 'org_webhook_001', userId: 'user_webhook_001' } },
    });
    expect(membership).not.toBeNull();
    expect(membership?.role).toBe('owner');

    // Provisioned event emitted (RLS context required)
    const provisionedEvents = await prisma.systemEvent.count({
      where: { orgId: 'org_webhook_001', eventType: 'xentri.org.provisioned.v1' },
    });
    expect(provisionedEvents).toBe(1);
  });

  it('is idempotent on replay and heals missing membership/event', async () => {
    const payload = {
      type: 'organization.created',
      data: {
        id: 'org_webhook_002',
        name: 'Webhook Org 2',
        slug: 'webhook-org-2',
        created_by: 'user_webhook_002',
        created_at: Date.now(),
      },
    };

    // First call
    await app.inject({ method: 'POST', url: '/api/v1/webhooks/clerk', payload, headers: svixHeaders });

    // Simulate partial state: drop membership and provisioned event
    await setOrgContext('org_webhook_002');
    await prisma.member.deleteMany({ where: { orgId: 'org_webhook_002' } });
    await prisma.systemEvent.deleteMany({ where: { orgId: 'org_webhook_002', eventType: 'xentri.org.provisioned.v1' } });

    // Replay webhook
    const replay = await app.inject({ method: 'POST', url: '/api/v1/webhooks/clerk', payload, headers: svixHeaders });
    expect(replay.statusCode).toBe(200);

    // Membership healed
    const membership = await prisma.member.findUnique({
      where: { orgId_userId: { orgId: 'org_webhook_002', userId: 'user_webhook_002' } },
    });
    expect(membership).not.toBeNull();

    // Provisioned event restored (deduped to 1)
    const provisionedEvents = await prisma.systemEvent.count({
      where: { orgId: 'org_webhook_002', eventType: 'xentri.org.provisioned.v1' },
    });
    expect(provisionedEvents).toBe(1);
  });
});
