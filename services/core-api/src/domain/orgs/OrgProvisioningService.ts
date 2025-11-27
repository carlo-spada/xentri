import type { PrismaClient } from '@prisma/client';
import { getPrisma } from '../../infra/db.js';
import { eventService } from '../events/EventService.js';
import type { OrgProvisionedPayload, Plan } from '@xentri/ts-schema';

const MAX_RETRIES = 3;
const BASE_BACKOFF_MS = 100;

// ===================
// Types
// ===================

export interface ProvisionOrgInput {
  clerkOrgId: string;
  clerkUserId: string;
  orgName: string;
  orgSlug: string;
}

export interface ProvisionOrgResult {
  orgId: string;
  settingsId: string;
  memberId: string;
  alreadyProvisioned: boolean;
}

// ===================
// OrgProvisioningService
// ===================

/**
 * OrgProvisioningService - handles full org setup on signup
 *
 * Responsible for:
 * - Creating org_settings with defaults (AC5)
 * - Creating owner membership (AC2, AC3)
 * - Emitting xentri.org.provisioned.v1 event (AC4)
 * - Idempotency: skip if already provisioned (AC6)
 * - Transaction safety: rollback on failure (AC7)
 */
export class OrgProvisioningService {
  private prisma: PrismaClient;

  constructor(prisma?: PrismaClient) {
    this.prisma = prisma || getPrisma();
  }

  /**
   * Provisions an organization with settings and owner membership.
   *
   * Idempotent: If org_settings already exist for this org, returns early.
   * This handles Clerk webhook replays gracefully.
   *
   * @param input - Organization and user identifiers
   * @returns Provisioning result with IDs and idempotency flag
   */
  async provisionOrg(input: ProvisionOrgInput): Promise<ProvisionOrgResult> {
    const { clerkOrgId, clerkUserId, orgName, orgSlug } = input;
    const preExistingSettings = await this.prisma.orgSettings.findUnique({
      where: { orgId: clerkOrgId },
    });

    let lastError: unknown;
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        // Full provisioning in a transaction (AC7) with healing for partial runs
        const result = await this.prisma.$transaction(async (tx) => {
          await tx.$executeRaw`SELECT set_config('app.current_org_id', ${clerkOrgId}, true)`;

          // 1. Ensure organization exists (idempotent upsert)
          await tx.organization.upsert({
            where: { id: clerkOrgId },
            update: {
              name: orgName,
              slug: orgSlug,
              updatedAt: new Date(),
            },
            create: {
              id: clerkOrgId,
              name: orgName,
              slug: orgSlug,
            },
          });

          // 2. Ensure org_settings exist (heal if partial)
          const settings = await tx.orgSettings.upsert({
            where: { orgId: clerkOrgId },
            update: {
              updatedAt: new Date(),
            },
            create: {
              orgId: clerkOrgId,
              plan: 'free',
              features: {},
              preferences: {},
            },
          });

          // 3. Ensure owner membership exists (heal if missing)
          const membership = await tx.member.upsert({
            where: {
              orgId_userId: {
                orgId: clerkOrgId,
                userId: clerkUserId,
              },
            },
            update: {
              role: 'owner',
              updatedAt: new Date(),
            },
            create: {
              orgId: clerkOrgId,
              userId: clerkUserId,
              role: 'owner',
            },
          });

          return { settings, membership };
        });

        // 4. Emit provisioned event (AC4) if missing or to complete partial run
        const provisionedAt = new Date().toISOString();
        const payload: OrgProvisionedPayload = {
          org_id: clerkOrgId,
          org_name: orgName,
          owner_user_id: clerkUserId,
          plan: 'free' as Plan,
          provisioned_at: provisionedAt,
        };

        const hasProvisionEvent = await this.hasProvisionedEvent(clerkOrgId);
        if (!hasProvisionEvent) {
          await this.emitProvisionedEvent(payload, clerkOrgId);
        }

        console.log(
          `[OrgProvisioning] Provisioned: ${clerkOrgId}, settings: ${result.settings.id}, attempt: ${attempt}`
        );

        return {
          orgId: clerkOrgId,
          settingsId: result.settings.id,
          memberId: result.membership.id,
          alreadyProvisioned: Boolean(preExistingSettings),
        };
      } catch (err) {
        lastError = err;
        if (attempt === MAX_RETRIES) {
          break;
        }
        const delay = BASE_BACKOFF_MS * 2 ** (attempt - 1);
        await this.sleep(delay);
      }
    }

    throw lastError instanceof Error ? lastError : new Error('Provisioning failed');
  }

  /**
   * Gets org settings by org ID.
   * Requires org context to be set for RLS.
   */
  async getOrgSettings(orgId: string) {
    return this.prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT set_config('app.current_org_id', ${orgId}, true)`;
      return tx.orgSettings.findUnique({
        where: { orgId },
      });
    });
  }

  /**
   * Updates org preferences (owner only - enforced at API layer).
   */
  async updateOrgPreferences(orgId: string, preferences: Record<string, unknown>) {
    return this.prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT set_config('app.current_org_id', ${orgId}, true)`;
      return tx.orgSettings.update({
        where: { orgId },
        data: {
          preferences: preferences as object,
          updatedAt: new Date(),
        },
      });
    });
  }

  private async hasProvisionedEvent(orgId: string): Promise<boolean> {
    return this.prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT set_config('app.current_org_id', ${orgId}, true)`;
      const existing = await tx.systemEvent.findFirst({
        where: { orgId, eventType: 'xentri.org.provisioned.v1' },
        select: { id: true },
      });
      return Boolean(existing);
    });
  }

  private async emitProvisionedEvent(payload: OrgProvisionedPayload, orgId: string) {
    await eventService.createEvent(
      {
        type: 'xentri.org.provisioned.v1',
        org_id: orgId,
        user_id: payload.owner_user_id,
        actor: { type: 'system', id: 'org-provisioning-service' },
        payload_schema: 'org.provisioned@1.0',
        payload,
        source: 'org-provisioning-service',
        envelope_version: '1.0',
        dedupe_key: `org-provisioned:${orgId}`,
      },
      orgId
    );
  }

  private async sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const orgProvisioningService = new OrgProvisioningService();
