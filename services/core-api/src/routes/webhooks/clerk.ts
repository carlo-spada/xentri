import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { Webhook } from 'svix';
import type { WebhookEvent } from '@clerk/fastify';
import { getPrisma } from '../../infra/db.js';
import { eventService } from '../../domain/events/EventService.js';
import { orgProvisioningService } from '../../domain/orgs/OrgProvisioningService.js';
import type { UserSignupPayload, UserLoginPayload, OrgCreatedPayload } from '@xentri/ts-schema';

// ===================
// Types
// ===================

interface ClerkWebhookBody {
  data: Record<string, unknown>;
  object: string;
  type: string;
}

interface UserCreatedData {
  id: string;
  email_addresses: Array<{
    id: string;
    email_address: string;
  }>;
  primary_email_address_id: string;
  first_name: string | null;
  last_name: string | null;
  created_at: number;
}

interface OrganizationCreatedData {
  id: string;
  name: string;
  slug: string;
  created_by: string;
  created_at: number;
}

interface SessionCreatedData {
  id: string;
  user_id: string;
  status: string;
  created_at: number;
  last_active_organization_id: string | null;
}

// ===================
// Webhook Handlers
// ===================

/**
 * Handles Clerk `user.created` webhook.
 *
 * Actions:
 * 1. Sync user to local `users` table
 * 2. Create a personal organization for the user via Clerk Backend API
 * 3. Emit `xentri.user.signup.v1` event
 *
 * Note: Organization creation is handled by Clerk's org webhook or can be
 * triggered here. For MVP, we create org synchronously.
 */
async function handleUserCreated(data: UserCreatedData): Promise<void> {
  const prisma = getPrisma();

  const primaryEmail = data.email_addresses.find(
    (e) => e.id === data.primary_email_address_id
  );

  if (!primaryEmail) {
    throw new Error(`User ${data.id} has no primary email`);
  }

  const email = primaryEmail.email_address;
  const emailDomain = email.split('@')[1];

  // Sync user to local database
  await prisma.user.upsert({
    where: { id: data.id },
    update: {
      email,
      updatedAt: new Date(),
    },
    create: {
      id: data.id,
      email,
      emailVerified: true, // Clerk handles verification
      createdAt: new Date(data.created_at),
    },
  });

  // Note: Organization creation happens via organization.created webhook
  // or can be triggered here via Clerk Backend API if auto-create is needed.
  // For MVP, we assume the frontend triggers org creation after signup.

  // Emit signup event (org_id will be set when org is created)
  // For now, use user ID as placeholder org_id until org is created
  const signupPayload: UserSignupPayload = {
    email,
    name: [data.first_name, data.last_name].filter(Boolean).join(' ') || undefined,
    auth_provider: 'email', // Default, could be detected from webhook metadata
  };

  // Note: We'll emit the event once org is created in organization.created handler
  // This prevents emitting events without valid org_id
  console.log(`[Clerk Webhook] User created: ${data.id}, email: ${email}`);
}

/**
 * Handles Clerk `organization.created` webhook.
 *
 * Actions:
 * 1. Sync org to local `organizations` table
 * 2. Full provisioning via OrgProvisioningService (AC1, AC2, AC3, AC5, AC6)
 *    - Creates org_settings with defaults
 *    - Creates owner membership (idempotent)
 *    - Emits `xentri.org.provisioned.v1` event (AC4)
 * 3. Emit `xentri.org.created.v1` event
 * 4. Emit `xentri.user.signup.v1` event (if this is the user's first org)
 */
async function handleOrganizationCreated(data: OrganizationCreatedData): Promise<void> {
  const prisma = getPrisma();

  // Sync organization to local database first (before provisioning) with org context set for RLS
  await prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT set_config('app.current_org_id', ${data.id}, true)`;

    await tx.organization.upsert({
      where: { id: data.id },
      update: {
        name: data.name,
        slug: data.slug,
        updatedAt: new Date(),
      },
      create: {
        id: data.id,
        name: data.name,
        slug: data.slug,
        createdAt: new Date(data.created_at),
      },
    });
  });

  // Full provisioning: org_settings + membership + provisioned event (AC1-AC7)
  // This is idempotent - safe for webhook replays
  const provisionResult = await orgProvisioningService.provisionOrg({
    clerkOrgId: data.id,
    clerkUserId: data.created_by,
    orgName: data.name,
    orgSlug: data.slug,
  });

  // Emit org created event (separate from provisioned event)
  const orgPayload: OrgCreatedPayload = {
    name: data.name,
    slug: data.slug,
    owner_id: data.created_by,
  };

  await eventService.createEvent(
    {
      type: 'xentri.org.created.v1',
      org_id: data.id,
      user_id: data.created_by,
      actor: { type: 'user', id: data.created_by },
      payload_schema: 'org.created@1.0',
      payload: orgPayload,
      source: 'clerk-webhook',
      envelope_version: '1.0',
    },
    data.id
  );

  // Check if this is the user's first org (signup completion)
  // Only emit signup event if not already provisioned (prevents duplicate on replay)
  if (!provisionResult.alreadyProvisioned) {
    const memberCount = await prisma.member.count({
      where: { userId: data.created_by },
    });

    if (memberCount === 1) {
      const user = await prisma.user.findUnique({
        where: { id: data.created_by },
        select: { email: true },
      });

      if (user) {
        // First org = signup complete, emit signup event
        const signupPayload: UserSignupPayload = {
          email: user.email,
          auth_provider: 'email',
        };

        await eventService.createEvent(
          {
            type: 'xentri.user.signup.v1',
            org_id: data.id,
            user_id: data.created_by,
            actor: { type: 'user', id: data.created_by },
            payload_schema: 'user.signup@1.0',
            payload: signupPayload,
            source: 'clerk-webhook',
            envelope_version: '1.0',
          },
          data.id
        );
      }
    }
  }

  console.log(`[Clerk Webhook] Organization created & provisioned: ${data.id}, slug: ${data.slug}, alreadyProvisioned: ${provisionResult.alreadyProvisioned}`);
}

/**
 * Handles Clerk `session.created` webhook.
 *
 * Actions:
 * 1. Emit `xentri.user.login.v1` event
 *
 * Note: This is optional - login events can also be tracked client-side.
 */
async function handleSessionCreated(data: SessionCreatedData): Promise<void> {
  const prisma = getPrisma();

  // Only emit login event if user has an active organization
  if (!data.last_active_organization_id) {
    console.log(`[Clerk Webhook] Session created for user ${data.user_id} without org context`);
    return;
  }

  // Fetch user email for event payload
  const user = await prisma.user.findUnique({
    where: { id: data.user_id },
    select: { email: true },
  });

  if (!user) {
    console.log(`[Clerk Webhook] Session created for unknown user ${data.user_id}`);
    return;
  }

  const loginPayload: UserLoginPayload = {
    email: user.email,
    method: 'email', // Could be detected from session metadata
  };

  await eventService.createEvent(
    {
      type: 'xentri.user.login.v1',
      org_id: data.last_active_organization_id,
      user_id: data.user_id,
      actor: { type: 'user', id: data.user_id },
      payload_schema: 'user.login@1.0',
      payload: loginPayload,
      source: 'clerk-webhook',
      envelope_version: '1.0',
    },
    data.last_active_organization_id
  );

  console.log(`[Clerk Webhook] Session created: ${data.id}, user: ${data.user_id}`);
}

// ===================
// Route Registration
// ===================

export default async function clerkWebhookRoutes(fastify: FastifyInstance): Promise<void> {
  /**
   * POST /api/v1/webhooks/clerk
   *
   * Clerk webhook endpoint. Verifies signature via svix and dispatches
   * to appropriate handler based on event type.
   */
  fastify.post(
    '/api/v1/webhooks/clerk',
    {
      config: {
        rawBody: true,
      },
    },
    async (
      request: FastifyRequest<{ Body: ClerkWebhookBody }>,
      reply: FastifyReply
    ) => {
      const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

      if (!webhookSecret) {
        fastify.log.error('CLERK_WEBHOOK_SECRET not configured');
        return reply.status(500).send({ error: 'Webhook not configured' });
      }

      // Get svix headers for signature verification
      const svixId = request.headers['svix-id'] as string;
      const svixTimestamp = request.headers['svix-timestamp'] as string;
      const svixSignature = request.headers['svix-signature'] as string;

      if (!svixId || !svixTimestamp || !svixSignature) {
        return reply.status(400).send({ error: 'Missing svix headers' });
      }

      // Verify webhook signature using raw body
      const wh = new Webhook(webhookSecret);
      let event: WebhookEvent;

      try {
        const rawBody =
          // rawBody is provided by fastify-raw-body
          (request as FastifyRequest & { rawBody?: Buffer }).rawBody?.toString('utf8') ||
          (typeof request.body === 'string'
            ? request.body
            : JSON.stringify(request.body));

        event = wh.verify(rawBody, {
          'svix-id': svixId,
          'svix-timestamp': svixTimestamp,
          'svix-signature': svixSignature,
        }) as WebhookEvent;
      } catch (err) {
        fastify.log.error({ err }, 'Webhook signature verification failed');
        return reply.status(401).send({ error: 'Invalid signature' });
      }

      // Dispatch to appropriate handler
      try {
        switch (event.type) {
          case 'user.created':
            await handleUserCreated(event.data as unknown as UserCreatedData);
            break;

          case 'organization.created':
            await handleOrganizationCreated(event.data as unknown as OrganizationCreatedData);
            break;

          case 'session.created':
            await handleSessionCreated(event.data as unknown as SessionCreatedData);
            break;

          default:
            fastify.log.info(`Unhandled webhook event type: ${event.type}`);
        }

        return reply.status(200).send({ received: true });
      } catch (err) {
        fastify.log.error({ err, eventType: event.type }, 'Webhook handler failed');
        // Return 200 to prevent Clerk from retrying (we logged the error)
        // For critical failures, return 500 to trigger retry
        return reply.status(500).send({ error: 'Handler failed' });
      }
    }
  );
}
