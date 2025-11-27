import { z } from 'zod';

// ===================
// Organization Settings (Story 1.4 AC5)
// ===================

/**
 * Plan tiers per business model
 * - free: Default on signup
 * - presencia: Digital presence bundle
 * - light_ops: Operations bundle
 * - business_in_motion: Full platform
 */
export const PlanSchema = z.enum(['free', 'presencia', 'light_ops', 'business_in_motion']);
export type Plan = z.infer<typeof PlanSchema>;

/**
 * Feature flags for org capabilities
 * Empty object for free tier, populated as modules are subscribed
 */
export const OrgFeaturesSchema = z.record(z.string(), z.boolean()).default({});
export type OrgFeatures = z.infer<typeof OrgFeaturesSchema>;

/**
 * Org preferences (user-configurable settings)
 * e.g., timezone, locale, notification settings
 */
export const OrgPreferencesSchema = z.record(z.string(), z.unknown()).default({});
export type OrgPreferences = z.infer<typeof OrgPreferencesSchema>;

/**
 * OrgSettings schema - per-org configuration
 * One-to-one with Organization, created during provisioning
 */
export const OrgSettingsSchema = z.object({
  id: z.string(),
  org_id: z.string(),
  plan: PlanSchema.default('free'),
  features: OrgFeaturesSchema,
  preferences: OrgPreferencesSchema,
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
export type OrgSettings = z.infer<typeof OrgSettingsSchema>;

/**
 * Schema for creating org settings (id/timestamps auto-generated)
 */
export const CreateOrgSettingsSchema = OrgSettingsSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});
export type CreateOrgSettingsInput = z.infer<typeof CreateOrgSettingsSchema>;

/**
 * Schema for updating org settings (owner only)
 * Only preferences can be updated by user; plan/features via subscription system
 */
export const UpdateOrgSettingsSchema = z.object({
  preferences: OrgPreferencesSchema.optional(),
});
export type UpdateOrgSettingsInput = z.infer<typeof UpdateOrgSettingsSchema>;

// ===================
// Membership (Story 1.4 AC2, AC3)
// ===================

/**
 * MembershipRole enum - maps to member_role in database
 * Note: Database uses `MemberRole` but API layer uses `MembershipRole` for clarity
 */
export const MembershipRoleSchema = z.enum(['owner', 'admin', 'member']);
export type MembershipRole = z.infer<typeof MembershipRoleSchema>;

/**
 * Membership schema - user-org relationship with role
 */
export const MembershipSchema = z.object({
  id: z.string(),
  org_id: z.string(),
  user_id: z.string(),
  role: MembershipRoleSchema,
  joined_at: z.string().datetime().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
export type Membership = z.infer<typeof MembershipSchema>;

// ===================
// Organization API Types
// ===================

/**
 * Organization with nested settings (for GET /api/v1/orgs/current)
 */
export const OrganizationWithSettingsSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  settings: OrgSettingsSchema.omit({ id: true, org_id: true }),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
export type OrganizationWithSettings = z.infer<typeof OrganizationWithSettingsSchema>;

/**
 * Response for GET /api/v1/orgs/current
 */
export const GetCurrentOrgResponseSchema = z.object({
  org: OrganizationWithSettingsSchema,
});
export type GetCurrentOrgResponse = z.infer<typeof GetCurrentOrgResponseSchema>;

/**
 * Response for PATCH /api/v1/orgs/current/settings
 */
export const UpdateOrgSettingsResponseSchema = z.object({
  settings: OrgSettingsSchema.omit({ id: true, org_id: true }),
});
export type UpdateOrgSettingsResponse = z.infer<typeof UpdateOrgSettingsResponseSchema>;
