import { z } from 'zod';

// ===================
// Event Types (AC4)
// ===================

/**
 * v0.1/v0.2 Event Types following pattern: xentri.{boundedContext}.{action}.{version}
 * Per ADR-002 and Story 1.2 AC4
 */
export const EventTypeSchema = z.enum([
  'xentri.user.signup.v1',
  'xentri.user.login.v1',
  'xentri.org.created.v1',
  'xentri.org.provisioned.v1',
  'xentri.brief.created.v1',
  'xentri.brief.updated.v1',
  'xentri.website.published.v1',
  'xentri.page.updated.v1',
  'xentri.content.published.v1',
  'xentri.lead.created.v1',
]);

export type EventType = z.infer<typeof EventTypeSchema>;

// ===================
// Actor Types
// ===================

export const EventActorTypeSchema = z.enum(['user', 'system', 'job']);
export type EventActorType = z.infer<typeof EventActorTypeSchema>;

export const EventActorSchema = z.object({
  type: EventActorTypeSchema,
  id: z.string(),
});
export type EventActor = z.infer<typeof EventActorSchema>;

// ===================
// Event Metadata
// ===================

export const EventMetaSchema = z.object({
  source: z.string(),
  environment: z.enum(['local', 'staging', 'prod']).optional(),
}).passthrough();

export type EventMeta = z.infer<typeof EventMetaSchema>;

// ===================
// Typed Payloads (AC4 - subtask 3.2)
// ===================

// User Events
export const UserSignupPayloadSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  auth_provider: z.enum(['email', 'google', 'github']).optional(),
});
export type UserSignupPayload = z.infer<typeof UserSignupPayloadSchema>;

export const UserLoginPayloadSchema = z.object({
  email: z.string().email(),
  method: z.enum(['email', 'google', 'github', 'refresh']).optional(),
});
export type UserLoginPayload = z.infer<typeof UserLoginPayloadSchema>;

// Organization Events
export const OrgCreatedPayloadSchema = z.object({
  name: z.string(),
  slug: z.string(),
  owner_id: z.string(),
});
export type OrgCreatedPayload = z.infer<typeof OrgCreatedPayloadSchema>;

/**
 * OrgProvisionedPayload - emitted after full org provisioning completes (AC4)
 * Differs from org.created: this indicates settings + membership are ready
 */
export const OrgProvisionedPayloadSchema = z.object({
  org_id: z.string(),
  org_name: z.string(),
  owner_user_id: z.string(),
  plan: z.enum(['free', 'presencia', 'light_ops', 'business_in_motion']),
  provisioned_at: z.string().datetime(),
});
export type OrgProvisionedPayload = z.infer<typeof OrgProvisionedPayloadSchema>;

// Brief Events
export const BriefCreatedPayloadSchema = z.object({
  brief_id: z.string(),
  title: z.string().optional(),
});
export type BriefCreatedPayload = z.infer<typeof BriefCreatedPayloadSchema>;

export const BriefUpdatedPayloadSchema = z.object({
  brief_id: z.string(),
  sections_changed: z.array(z.string()).optional(),
  version: z.number().int().positive().optional(),
});
export type BriefUpdatedPayload = z.infer<typeof BriefUpdatedPayloadSchema>;

// Website Events
export const WebsitePublishedPayloadSchema = z.object({
  site_id: z.string(),
  domain: z.string().optional(),
  pages_count: z.number().int().nonnegative().optional(),
});
export type WebsitePublishedPayload = z.infer<typeof WebsitePublishedPayloadSchema>;

export const PageUpdatedPayloadSchema = z.object({
  page_id: z.string(),
  site_id: z.string(),
  slug: z.string().optional(),
});
export type PageUpdatedPayload = z.infer<typeof PageUpdatedPayloadSchema>;

export const ContentPublishedPayloadSchema = z.object({
  content_id: z.string(),
  content_type: z.string().optional(),
});
export type ContentPublishedPayload = z.infer<typeof ContentPublishedPayloadSchema>;

// Lead Events
export const LeadCreatedPayloadSchema = z.object({
  lead_id: z.string(),
  source: z.string().optional(),
  form_id: z.string().optional(),
});
export type LeadCreatedPayload = z.infer<typeof LeadCreatedPayloadSchema>;

// Payload schema map for type-safe event creation
export const EventPayloadSchemas: Record<EventType, z.ZodTypeAny> = {
  'xentri.user.signup.v1': UserSignupPayloadSchema,
  'xentri.user.login.v1': UserLoginPayloadSchema,
  'xentri.org.created.v1': OrgCreatedPayloadSchema,
  'xentri.org.provisioned.v1': OrgProvisionedPayloadSchema,
  'xentri.brief.created.v1': BriefCreatedPayloadSchema,
  'xentri.brief.updated.v1': BriefUpdatedPayloadSchema,
  'xentri.website.published.v1': WebsitePublishedPayloadSchema,
  'xentri.page.updated.v1': PageUpdatedPayloadSchema,
  'xentri.content.published.v1': ContentPublishedPayloadSchema,
  'xentri.lead.created.v1': LeadCreatedPayloadSchema,
};

/**
 * Validates that the payload matches the expected schema for the given event type.
 * Returns an error message if validation fails, undefined if valid.
 */
export function validateEventPayload(type: EventType, payload: unknown): string | undefined {
  const schema = EventPayloadSchemas[type];
  if (!schema) {
    return `No payload schema registered for event type: ${type}`;
  }

  const result = schema.safeParse(payload);
  if (!result.success) {
    return result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; ');
  }

  return undefined;
}

// ===================
// System Event Envelope (AC4 - subtask 3.3)
// ===================

/**
 * SystemEvent Zod schema per ADR-002
 * Generic over payload type for type-safe event handling
 */
export const SystemEventSchema = z.object({
  id: z.string(),
  type: EventTypeSchema,
  occurred_at: z.string().datetime(), // ISO8601
  created_at: z.string().datetime().optional(),
  org_id: z.string(),
  user_id: z.string().nullable().optional(),
  actor: EventActorSchema,
  payload_schema: z.string(), // e.g., "user.signup@1.0"
  payload: z.record(z.unknown()),
  meta: EventMetaSchema.optional(),
  dedupe_key: z.string().optional(),
  correlation_id: z.string().optional(),
  trace_id: z.string().optional(),
  source: z.string(),
  envelope_version: z.literal('1.0'),
});

export type SystemEvent<TPayload = Record<string, unknown>> = Omit<
  z.infer<typeof SystemEventSchema>,
  'payload'
> & {
  payload: TPayload;
};

/**
 * Schema for creating a new event (id and timestamps auto-generated)
 * Includes refinement to validate payload against type-specific schema (AC6)
 */
export const CreateEventSchema = SystemEventSchema.omit({
  id: true,
  created_at: true,
}).extend({
  occurred_at: z.string().datetime().optional(), // defaults to now()
}).refine(
  (data) => {
    const error = validateEventPayload(data.type, data.payload);
    return error === undefined;
  },
  (data) => ({
    message: validateEventPayload(data.type, data.payload) || 'Invalid payload for event type',
    path: ['payload'],
  })
);

export type CreateEventInput<TPayload = Record<string, unknown>> = Omit<
  z.infer<typeof CreateEventSchema>,
  'payload'
> & {
  payload: TPayload;
};

// ===================
// Event Response Types
// ===================

export const EventAckResponseSchema = z.object({
  event_id: z.string().uuid(),
  acknowledged: z.literal(true),
});
export type EventAckResponse = z.infer<typeof EventAckResponseSchema>;

export const EventListMetaSchema = z.object({
  cursor: z.string().optional(),
  has_more: z.boolean(),
});
export type EventListMeta = z.infer<typeof EventListMetaSchema>;

export const EventListResponseSchema = z.object({
  data: z.array(SystemEventSchema),
  meta: EventListMetaSchema,
});
export type EventListResponse = z.infer<typeof EventListResponseSchema>;

// ===================
// Open Loops Projection (AC5)
// ===================

/**
 * OpenLoopsProjection placeholder type
 *
 * TODO: Implement Open Loops business logic in future epic
 *
 * Open Loops represent actionable items derived from events:
 * - Pending follow-ups from lead events
 * - Unpublished drafts from content events
 * - Incomplete brief sections from brief events
 *
 * This projection will be materialized from system_events
 * and power the "Calm Prompt" daily summary feature.
 *
 * Future implementation:
 * - Materialized view or projection table
 * - Event handlers to update projection on new events
 * - Query API for dashboard display
 */
export interface OpenLoopsProjection {
  org_id: string;
  user_id?: string;
  loop_type: 'follow_up' | 'unpublished_draft' | 'incomplete_brief' | 'pending_action';
  entity_type: string;
  entity_id: string;
  title: string;
  description?: string;
  priority: 'high' | 'medium' | 'low';
  due_date?: string;
  source_event_id: string;
  created_at: string;
  resolved_at?: string;
}

// Placeholder schema (not yet validated against DB)
export const OpenLoopsProjectionSchema = z.object({
  org_id: z.string().uuid(),
  user_id: z.string().uuid().optional(),
  loop_type: z.enum(['follow_up', 'unpublished_draft', 'incomplete_brief', 'pending_action']),
  entity_type: z.string(),
  entity_id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  priority: z.enum(['high', 'medium', 'low']),
  due_date: z.string().datetime().optional(),
  source_event_id: z.string().uuid(),
  created_at: z.string().datetime(),
  resolved_at: z.string().datetime().optional(),
});

// ===================
// Type Guards & Utilities
// ===================

/**
 * Type guard for validating event type
 */
export function isValidEventType(type: string): type is EventType {
  return EventTypeSchema.safeParse(type).success;
}

/**
 * Validate and parse a system event
 */
export function parseSystemEvent(data: unknown): SystemEvent {
  return SystemEventSchema.parse(data) as SystemEvent;
}

/**
 * Safe parse that returns result object
 */
export function safeParseSystemEvent(data: unknown) {
  return SystemEventSchema.safeParse(data);
}
