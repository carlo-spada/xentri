import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { OrgProvisioningService } from './OrgProvisioningService.js';
import {
  setupPostgres,
  teardownPostgres,
  getTestPrismaClient,
  setOrgContext,
  clearOrgContext,
} from '../../__tests__/helpers/postgres-container.js';

const RUN_CONTAINERS = process.env.RUN_TESTCONTAINERS === '1';
const describeIf = RUN_CONTAINERS ? describe : describe.skip;

describeIf('OrgProvisioningService', () => {
  let prisma: PrismaClient;
  let service: OrgProvisioningService;

  // Test data
  const orgA = {
    id: 'org_test_a_001',
    name: 'Test Org A',
    slug: 'test-org-a',
  };
  const orgB = {
    id: 'org_test_b_001',
    name: 'Test Org B',
    slug: 'test-org-b',
  };
  const userA = {
    id: 'user_test_a_001',
    email: 'user-a@test.com',
  };
  const userB = {
    id: 'user_test_b_001',
    email: 'user-b@test.com',
  };

  beforeAll(async () => {
    await setupPostgres();
    prisma = getTestPrismaClient();
    service = new OrgProvisioningService(prisma);

    // Create test users (required before org provisioning)
    await prisma.user.createMany({
      data: [
        { id: userA.id, email: userA.email },
        { id: userB.id, email: userB.email },
      ],
      skipDuplicates: true,
    });
  }, 120000);

  afterAll(async () => {
    await teardownPostgres();
  });

  describe('provisionOrg', () => {
    it('should create org settings with default values (AC5)', async () => {
      // First create the org (normally done by webhook)
      await prisma.organization.create({
        data: { id: orgA.id, name: orgA.name, slug: orgA.slug },
      });

      const result = await service.provisionOrg({
        clerkOrgId: orgA.id,
        clerkUserId: userA.id,
        orgName: orgA.name,
        orgSlug: orgA.slug,
      });

      expect(result.orgId).toBe(orgA.id);
      expect(result.settingsId).toBeDefined();
      expect(result.memberId).toBeDefined();
      expect(result.alreadyProvisioned).toBe(false);

      // Verify settings have correct defaults
      const settings = await prisma.orgSettings.findUnique({
        where: { orgId: orgA.id },
      });

      expect(settings).not.toBeNull();
      expect(settings!.plan).toBe('free');
      expect(settings!.features).toEqual({});
      expect(settings!.preferences).toEqual({});
    });

    it('should create owner membership (AC2, AC3)', async () => {
      // Verify membership was created with owner role
      const membership = await prisma.member.findUnique({
        where: {
          orgId_userId: {
            orgId: orgA.id,
            userId: userA.id,
          },
        },
      });

      expect(membership).not.toBeNull();
      expect(membership!.role).toBe('owner');
    });

    it('should be idempotent - no duplicates on replay (AC6)', async () => {
      // Call provisionOrg again for the same org
      const result = await service.provisionOrg({
        clerkOrgId: orgA.id,
        clerkUserId: userA.id,
        orgName: orgA.name,
        orgSlug: orgA.slug,
      });

      expect(result.alreadyProvisioned).toBe(true);

      // Verify no duplicates
      const settingsCount = await prisma.orgSettings.count({
        where: { orgId: orgA.id },
      });
      const memberCount = await prisma.member.count({
        where: { orgId: orgA.id, userId: userA.id },
      });

      expect(settingsCount).toBe(1);
      expect(memberCount).toBe(1);
    });
  });

  describe('RLS Isolation - org_settings (AC5 - Task 3.5)', () => {
    beforeAll(async () => {
      // Create and provision org B
      await prisma.organization.create({
        data: { id: orgB.id, name: orgB.name, slug: orgB.slug },
      });

      await service.provisionOrg({
        clerkOrgId: orgB.id,
        clerkUserId: userB.id,
        orgName: orgB.name,
        orgSlug: orgB.slug,
      });
    });

    it('should only see own org settings with org context set', async () => {
      // Set context to org A
      await setOrgContext(orgA.id);

      const settings = await prisma.orgSettings.findMany();

      // Should only see org A's settings
      expect(settings.length).toBe(1);
      expect(settings[0].orgId).toBe(orgA.id);
    });

    it('should return empty when org context not set', async () => {
      await clearOrgContext();

      const settings = await prisma.orgSettings.findMany();

      // Fail-closed: empty result without context
      expect(settings.length).toBe(0);
    });

    it('org A cannot see org B settings', async () => {
      await setOrgContext(orgA.id);

      // Try to find org B's settings
      const settings = await prisma.orgSettings.findUnique({
        where: { orgId: orgB.id },
      });

      // Should not be visible
      expect(settings).toBeNull();
    });

    it('org B cannot see org A settings', async () => {
      await setOrgContext(orgB.id);

      // Try to find org A's settings
      const settings = await prisma.orgSettings.findUnique({
        where: { orgId: orgA.id },
      });

      // Should not be visible
      expect(settings).toBeNull();
    });
  });

  describe('RLS Isolation - members (Task 2.6)', () => {
    it('should only see own org members with org context set', async () => {
      await setOrgContext(orgA.id);

      const members = await prisma.member.findMany();

      // Should only see org A's members
      expect(members.length).toBeGreaterThan(0);
      members.forEach((member) => {
        expect(member.orgId).toBe(orgA.id);
      });
    });

    it('org A cannot see org B members', async () => {
      await setOrgContext(orgA.id);

      // Query specifically for org B member
      const member = await prisma.member.findUnique({
        where: {
          orgId_userId: {
            orgId: orgB.id,
            userId: userB.id,
          },
        },
      });

      // Should not be visible
      expect(member).toBeNull();
    });

    it('org B cannot see org A members', async () => {
      await setOrgContext(orgB.id);

      // Query specifically for org A member
      const member = await prisma.member.findUnique({
        where: {
          orgId_userId: {
            orgId: orgA.id,
            userId: userA.id,
          },
        },
      });

      // Should not be visible
      expect(member).toBeNull();
    });
  });

  describe('Resilience and healing', () => {
    it('heals missing membership and re-emits provisioned event on replay', async () => {
      // Remove membership and events to simulate partial provisioning
      await prisma.$transaction(async (tx) => {
        await tx.$executeRaw`SELECT set_config('app.current_org_id', ${orgA.id}, true)`;
        await tx.member.deleteMany({ where: { orgId: orgA.id } });
      });
      await prisma.$executeRaw`TRUNCATE system_events`;

      const result = await service.provisionOrg({
        clerkOrgId: orgA.id,
        clerkUserId: userA.id,
        orgName: orgA.name,
        orgSlug: orgA.slug,
      });

      expect(result.alreadyProvisioned).toBe(true);

      const memberCount = await prisma.member.count({
        where: { orgId: orgA.id, userId: userA.id },
      });
      expect(memberCount).toBe(1);

      const provisionedEvents = await prisma.$transaction(async (tx) => {
        await tx.$executeRaw`SELECT set_config('app.current_org_id', ${orgA.id}, true)`;
        return tx.systemEvent.count({
          where: { orgId: orgA.id, eventType: 'xentri.org.provisioned.v1' },
        });
      });
      expect(provisionedEvents).toBeGreaterThanOrEqual(1);
    });

    it('rolls back when membership creation fails (no partial state)', async () => {
      const failingOrg = {
        id: 'org_fail_001',
        name: 'Fail Org',
        slug: 'fail-org',
      };

      const servicePrisma = (service as unknown as { prisma: PrismaClient }).prisma;
      const memberUpsertSpy = vi
        .spyOn(servicePrisma.member, 'upsert')
        .mockImplementationOnce(() => {
          throw new Error('forced failure');
        });

      await expect(
        service.provisionOrg({
          clerkOrgId: failingOrg.id,
          clerkUserId: userA.id,
          orgName: failingOrg.name,
          orgSlug: failingOrg.slug,
        })
      ).rejects.toThrow('forced failure');

      memberUpsertSpy.mockRestore();

      const settings = await prisma.orgSettings.findUnique({
        where: { orgId: failingOrg.id },
      });
      expect(settings).toBeNull();

      const membership = await prisma.member.findUnique({
        where: {
          orgId_userId: {
            orgId: failingOrg.id,
            userId: userA.id,
          },
        },
      });
      expect(membership).toBeNull();

      const provisionedEvents = await prisma.$transaction(async (tx) => {
        await tx.$executeRaw`SELECT set_config('app.current_org_id', ${failingOrg.id}, true)`;
        return tx.systemEvent.count({
          where: { orgId: failingOrg.id, eventType: 'xentri.org.provisioned.v1' },
        });
      });
      expect(provisionedEvents).toBe(0);
    });
  });

  describe('getOrgSettings', () => {
    it('should return settings for valid org', async () => {
      const settings = await service.getOrgSettings(orgA.id);

      expect(settings).not.toBeNull();
      expect(settings!.orgId).toBe(orgA.id);
      expect(settings!.plan).toBe('free');
    });

    it('should return null for non-existent org', async () => {
      const settings = await service.getOrgSettings('non-existent-org');

      expect(settings).toBeNull();
    });
  });

  describe('updateOrgPreferences', () => {
    it('should update preferences', async () => {
      const newPreferences = {
        timezone: 'America/New_York',
        locale: 'en-US',
      };

      const updated = await service.updateOrgPreferences(orgA.id, newPreferences);

      expect(updated.preferences).toEqual(newPreferences);
    });

    it('should preserve other fields when updating preferences', async () => {
      const settings = await service.getOrgSettings(orgA.id);

      expect(settings!.plan).toBe('free'); // Plan unchanged
      expect(settings!.features).toEqual({}); // Features unchanged
    });
  });
});
