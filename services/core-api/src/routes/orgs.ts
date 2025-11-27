import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { getAuth } from '@clerk/fastify';
import { getPrisma } from '../infra/db.js';
import { orgProvisioningService } from '../domain/orgs/OrgProvisioningService.js';
import {
  UpdateOrgSettingsSchema,
  type GetCurrentOrgResponse,
  type UpdateOrgSettingsResponse,
} from '@xentri/ts-schema';

// ===================
// Types
// ===================

interface AuthenticatedRequest extends FastifyRequest {
  auth: {
    userId: string;
    orgId: string;
    orgRole: string;
  };
}

// ===================
// Route Handlers
// ===================

/**
 * GET /api/v1/orgs/current
 *
 * Returns the current organization with its settings.
 * Requires Clerk authentication with active organization context.
 */
async function getCurrentOrg(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<GetCurrentOrgResponse | void> {
  const auth = getAuth(request);

  if (!auth.userId || !auth.orgId) {
    return reply.status(401).send({
      error: 'Unauthorized',
      message: 'Valid authentication with organization context required',
    });
  }

  const prisma = getPrisma();

  // Fetch org with settings in transaction with RLS context
  const result = await prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT set_config('app.current_org_id', ${auth.orgId}, true)`;

    const org = await tx.organization.findUnique({
      where: { id: auth.orgId },
      include: { settings: true },
    });

    return org;
  });

  if (!result) {
    return reply.status(404).send({
      error: 'Not Found',
      message: 'Organization not found',
    });
  }

  // Handle case where settings don't exist (shouldn't happen after provisioning)
  const settings = result.settings || {
    plan: 'free',
    features: {},
    preferences: {},
    createdAt: result.createdAt,
    updatedAt: result.updatedAt,
  };

  return {
    org: {
      id: result.id,
      name: result.name,
      slug: result.slug,
      settings: {
        plan: settings.plan as 'free' | 'presencia' | 'light_ops' | 'business_in_motion',
        features: settings.features as Record<string, boolean>,
        preferences: settings.preferences as Record<string, unknown>,
        created_at: settings.createdAt.toISOString(),
        updated_at: settings.updatedAt.toISOString(),
      },
      created_at: result.createdAt.toISOString(),
      updated_at: result.updatedAt.toISOString(),
    },
  };
}

/**
 * PATCH /api/v1/orgs/current/settings
 *
 * Updates the current organization's preferences.
 * Only owners can update settings.
 */
async function updateOrgSettings(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<UpdateOrgSettingsResponse | void> {
  const auth = getAuth(request);
  const prisma = getPrisma();

  if (!auth.userId || !auth.orgId) {
    return reply.status(401).send({
      error: 'Unauthorized',
      message: 'Valid authentication with organization context required',
    });
  }

  // Extract validated auth values (TypeScript narrowing)
  const { userId, orgId } = auth;

  // Validate request body
  const parseResult = UpdateOrgSettingsSchema.safeParse(request.body);
  if (!parseResult.success) {
    return reply.status(400).send({
      error: 'Bad Request',
      message: 'Invalid request body',
      details: parseResult.error.errors,
    });
  }

  const { preferences } = parseResult.data;

  // Verify membership role from DB (owner-only)
  const membership = await prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT set_config('app.current_org_id', ${orgId}, true)`;
    return tx.member.findUnique({
      where: {
        orgId_userId: {
          orgId,
          userId,
        },
      },
      select: { role: true },
    });
  });

  if (!membership || membership.role !== 'owner') {
    return reply.status(403).send({
      error: 'Forbidden',
      message: 'Only organization owners can update settings',
    });
  }

  // Nothing to update
  if (!preferences || Object.keys(preferences).length === 0) {
    // Return current settings
    const currentSettings = await orgProvisioningService.getOrgSettings(auth.orgId);
    if (!currentSettings) {
      return reply.status(404).send({
        error: 'Not Found',
        message: 'Organization settings not found',
      });
    }

    return {
      settings: {
        plan: currentSettings.plan as 'free' | 'presencia' | 'light_ops' | 'business_in_motion',
        features: currentSettings.features as Record<string, boolean>,
        preferences: currentSettings.preferences as Record<string, unknown>,
        created_at: currentSettings.createdAt.toISOString(),
        updated_at: currentSettings.updatedAt.toISOString(),
      },
    };
  }

  // Update preferences
  const updated = await orgProvisioningService.updateOrgPreferences(auth.orgId, preferences);

  return {
    settings: {
      plan: updated.plan as 'free' | 'presencia' | 'light_ops' | 'business_in_motion',
      features: updated.features as Record<string, boolean>,
      preferences: updated.preferences as Record<string, unknown>,
      created_at: updated.createdAt.toISOString(),
      updated_at: updated.updatedAt.toISOString(),
    },
  };
}

// ===================
// Route Registration
// ===================

export default async function orgsRoutes(fastify: FastifyInstance): Promise<void> {
  // GET /api/v1/orgs/current
  fastify.get('/api/v1/orgs/current', getCurrentOrg);

  // PATCH /api/v1/orgs/current/settings
  fastify.patch('/api/v1/orgs/current/settings', updateOrgSettings);
}
