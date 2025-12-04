import { z } from 'zod'

// ===================
// Theme Preferences
// ===================

/**
 * Valid theme preference values.
 */
export const ThemePreferenceSchema = z.enum(['light', 'dark', 'system'])
export type ThemePreference = z.infer<typeof ThemePreferenceSchema>

// ===================
// Email Notification Preferences
// ===================

/**
 * Email notification settings per category.
 */
export const EmailNotificationsSchema = z.object({
  lead_created: z.boolean().optional().default(true),
  system: z.boolean().optional().default(true),
})
export type EmailNotifications = z.infer<typeof EmailNotificationsSchema>

// ===================
// User Preferences Model
// ===================

/**
 * Complete user preferences object.
 */
export const UserPreferencesSchema = z.object({
  theme: ThemePreferenceSchema.default('dark'),
  email_notifications: EmailNotificationsSchema.optional(),
})
export type UserPreferences = z.infer<typeof UserPreferencesSchema>

// ===================
// API Request/Response Schemas
// ===================

/**
 * Request body for PATCH /api/v1/users/me/preferences
 */
export const UpdateUserPreferencesRequestSchema = z.object({
  theme: ThemePreferenceSchema.optional(),
  email_notifications: EmailNotificationsSchema.optional(),
})
export type UpdateUserPreferencesRequest = z.infer<typeof UpdateUserPreferencesRequestSchema>

/**
 * Response for user preferences endpoints.
 */
export const UserPreferencesResponseSchema = z.object({
  preferences: UserPreferencesSchema,
})
export type UserPreferencesResponse = z.infer<typeof UserPreferencesResponseSchema>
