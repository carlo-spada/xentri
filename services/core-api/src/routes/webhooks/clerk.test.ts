import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import Fastify from 'fastify'
import { Webhook } from 'svix'
import clerkWebhookRoutes from './clerk.js'

// Mock dependencies
vi.mock('../../infra/db.js', () => ({
  getPrisma: vi.fn(() => ({
    $transaction: vi.fn(async (fn: (tx: any) => Promise<unknown>) => {
      const tx = {
        $executeRaw: vi.fn(),
        organization: {
          upsert: vi.fn().mockResolvedValue({ id: 'org_123', name: 'Test Org', slug: 'test-org' }),
        },
      }
      return fn(tx)
    }),
    user: {
      upsert: vi.fn().mockResolvedValue({ id: 'user_123', email: 'test@example.com' }),
      findUnique: vi.fn().mockResolvedValue({ email: 'test@example.com' }),
    },
    organization: {
      upsert: vi.fn().mockResolvedValue({ id: 'org_123', name: 'Test Org', slug: 'test-org' }),
    },
    member: {
      upsert: vi.fn().mockResolvedValue({ id: 'member_123' }),
      count: vi.fn().mockResolvedValue(1),
    },
  })),
}))

vi.mock('../../domain/events/EventService.js', () => ({
  eventService: {
    createEvent: vi.fn().mockResolvedValue({ event_id: 'evt_123', acknowledged: true }),
  },
}))

vi.mock('../../domain/orgs/OrgProvisioningService.js', () => ({
  orgProvisioningService: {
    provisionOrg: vi.fn().mockResolvedValue({
      orgId: 'org_123',
      settingsId: 'settings_123',
      memberId: 'member_123',
      alreadyProvisioned: false,
    }),
  },
}))

// Mock svix Webhook verification
vi.mock('svix', () => ({
  Webhook: vi.fn().mockImplementation(() => ({
    verify: vi.fn().mockImplementation((payload) => JSON.parse(payload)),
  })),
}))

describe('Clerk Webhook Routes', () => {
  let app: ReturnType<typeof Fastify>

  beforeEach(async () => {
    // Set required env var
    process.env.CLERK_WEBHOOK_SECRET = 'whsec_test_secret'

    app = Fastify()
    await app.register(clerkWebhookRoutes)
    await app.ready()
  })

  afterEach(async () => {
    await app.close()
    vi.clearAllMocks()
  })

  describe('POST /api/v1/webhooks/clerk', () => {
    const validHeaders = {
      'svix-id': 'msg_123',
      'svix-timestamp': '1234567890',
      'svix-signature': 'v1,signature',
      'content-type': 'application/json',
    }

    it('should return 400 if svix headers are missing', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/webhooks/clerk',
        payload: { type: 'user.created', data: {} },
        headers: { 'content-type': 'application/json' },
      })

      expect(response.statusCode).toBe(400)
      expect(JSON.parse(response.body)).toEqual({ error: 'Missing svix headers' })
    })

    it('should handle user.created webhook', async () => {
      const payload = {
        type: 'user.created',
        data: {
          id: 'user_123',
          email_addresses: [{ id: 'email_1', email_address: 'test@example.com' }],
          primary_email_address_id: 'email_1',
          first_name: 'Test',
          last_name: 'User',
          created_at: Date.now(),
        },
      }

      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/webhooks/clerk',
        payload,
        headers: validHeaders,
      })

      expect(response.statusCode).toBe(200)
      expect(JSON.parse(response.body)).toEqual({ received: true })
    })

    it('should handle organization.created webhook', async () => {
      const payload = {
        type: 'organization.created',
        data: {
          id: 'org_123',
          name: 'Test Organization',
          slug: 'test-org',
          created_by: 'user_123',
          created_at: Date.now(),
        },
      }

      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/webhooks/clerk',
        payload,
        headers: validHeaders,
      })

      expect(response.statusCode).toBe(200)
      expect(JSON.parse(response.body)).toEqual({ received: true })
    })

    it('should handle session.created webhook', async () => {
      const payload = {
        type: 'session.created',
        data: {
          id: 'sess_123',
          user_id: 'user_123',
          status: 'active',
          created_at: Date.now(),
          last_active_organization_id: 'org_123',
        },
      }

      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/webhooks/clerk',
        payload,
        headers: validHeaders,
      })

      expect(response.statusCode).toBe(200)
      expect(JSON.parse(response.body)).toEqual({ received: true })
    })

    it('should handle unrecognized event types gracefully', async () => {
      const payload = {
        type: 'unknown.event',
        data: {},
      }

      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/webhooks/clerk',
        payload,
        headers: validHeaders,
      })

      expect(response.statusCode).toBe(200)
      expect(JSON.parse(response.body)).toEqual({ received: true })
    })

    it('should return 500 if webhook secret is not configured', async () => {
      delete process.env.CLERK_WEBHOOK_SECRET

      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/webhooks/clerk',
        payload: { type: 'user.created', data: {} },
        headers: validHeaders,
      })

      expect(response.statusCode).toBe(500)
      expect(JSON.parse(response.body)).toEqual({ error: 'Webhook not configured' })
    })
  })
})
