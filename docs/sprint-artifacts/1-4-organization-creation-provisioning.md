# Story 1.4: Organization Creation & Provisioning

Status: drafted

## Story

As a **New User**,
I want **an Organization created for me automatically upon signup with proper provisioning**,
so that **I have a private, fully-configured workspace for my business data**.

## Acceptance Criteria

1. **AC1:** On new user signup, an Organization record is automatically created with default settings (FR6)
2. **AC2:** New user is assigned as "Owner" of that org with full permissions (FR6)
3. **AC3:** Local `memberships` table links user to org with `role: 'owner'` (FR6)
4. **AC4:** `xentri.org.provisioned.v1` event logged after full provisioning completes (FR37)
5. **AC5:** Org settings initialized with defaults: `plan: 'free'`, `features: {}`, `preferences: {}` (FR6)
6. **AC6:** Provisioning is idempotent—replaying the webhook does not create duplicate orgs or memberships (FR6)
7. **AC7:** Failed provisioning triggers retry with exponential backoff; partial state is recoverable (FR6)

## Tasks / Subtasks

- [ ] **Task 1: Create org provisioning service** (AC: 1, 5, 6, 7)
  - [ ] 1.1 Create `services/core-api/src/domain/orgs/OrgProvisioningService.ts`
  - [ ] 1.2 Implement `provisionOrg(clerkOrgId, clerkUserId, orgName)` method
  - [ ] 1.3 Add idempotency check: if org exists with same Clerk ID, skip creation
  - [ ] 1.4 Initialize `org_settings` record with defaults (`plan: 'free'`, `features: {}`, `preferences: {}`)
  - [ ] 1.5 Wrap provisioning in transaction with rollback on failure
  - [ ] 1.6 Write unit tests for OrgProvisioningService (idempotency, defaults, rollback)

- [ ] **Task 2: Create memberships table and model** (AC: 2, 3, 6)
  - [ ] 2.1 Add Prisma migration: `memberships` table with `org_id`, `user_id`, `role`, `joined_at`
  - [ ] 2.2 Add RLS policy: users can only see memberships for orgs they belong to
  - [ ] 2.3 Add unique constraint: `(org_id, user_id)` to prevent duplicate memberships
  - [ ] 2.4 Create `MembershipRole` enum: `owner`, `admin`, `member`
  - [ ] 2.5 Add `memberships` model to Prisma schema with relation to `users` and `organizations`
  - [ ] 2.6 Write RLS isolation test for memberships

- [ ] **Task 3: Create org_settings table and model** (AC: 5, 6)
  - [ ] 3.1 Add Prisma migration: `org_settings` table with `org_id`, `plan`, `features` (JSONB), `preferences` (JSONB)
  - [ ] 3.2 Add RLS policy: org members can read, owners can write
  - [ ] 3.3 Add unique constraint: one settings record per org
  - [ ] 3.4 Add `org_settings` model to Prisma schema with relation to `organizations`
  - [ ] 3.5 Write RLS isolation test for org_settings

- [ ] **Task 4: Enhance Clerk webhook handler** (AC: 1, 2, 3, 4, 6, 7)
  - [ ] 4.1 Update `organization.created` webhook to call `OrgProvisioningService.provisionOrg()`
  - [ ] 4.2 Create local membership record (owner role) after org provisioning
  - [ ] 4.3 Emit `xentri.org.provisioned.v1` event after full provisioning (not just sync)
  - [ ] 4.4 Add idempotency: check if membership already exists before creating
  - [ ] 4.5 Handle `organization.membership.created` webhook for future multi-user support
  - [ ] 4.6 Add error handling with retry queue for failed provisioning
  - [ ] 4.7 Write tests for enhanced webhook handlers

- [ ] **Task 5: Add org provisioning API endpoints** (AC: 1, 5)
  - [ ] 5.1 Create `GET /api/v1/orgs/current` - returns current org with settings
  - [ ] 5.2 Create `PATCH /api/v1/orgs/current/settings` - update org preferences (owner only)
  - [ ] 5.3 Add Clerk auth middleware to org routes
  - [ ] 5.4 Add Zod schemas for org settings request/response to `ts-schema`
  - [ ] 5.5 Write integration tests for org endpoints

- [ ] **Task 6: Update ts-schema with org types** (AC: 4, 5)
  - [ ] 6.1 Add `OrgSettings` schema to `packages/ts-schema/src/orgs.ts`
  - [ ] 6.2 Add `MembershipRole` enum to `packages/ts-schema/src/orgs.ts`
  - [ ] 6.3 Add `xentri.org.provisioned.v1` event type to `packages/ts-schema/src/events.ts`
  - [ ] 6.4 Export new types from `packages/ts-schema/src/index.ts`
  - [ ] 6.5 Run typecheck to verify no regressions

- [ ] **Task 7: Testing and validation** (AC: 1-7)
  - [ ] 7.1 Write integration test: new user signup triggers full provisioning flow
  - [ ] 7.2 Write integration test: replaying webhook is idempotent
  - [ ] 7.3 Write integration test: partial failure rolls back cleanly
  - [ ] 7.4 Write RLS test: org_settings isolated by org
  - [ ] 7.5 Write RLS test: memberships isolated by org
  - [ ] 7.6 Verify all existing tests pass (12+ Clerk tests from 1.3)

## Dev Notes

### Architecture Constraints

- **Clerk-First:** Org creation is triggered by Clerk webhook, not direct API call [Source: docs/architecture.md#Auth-Patterns]
- **Event Backbone:** All provisioning actions emit events to `system_events` [Source: docs/architecture.md#ADR-002]
- **RLS Enforcement:** New tables must have fail-closed RLS policies [Source: docs/architecture.md#ADR-003]
- **Idempotency:** Webhook handlers must be idempotent per Clerk retry behavior [Source: docs/sprint-artifacts/1-3-user-authentication-signup.md#Edge-Cases]

### Technical Specifications

**Provisioning Flow:**
```
1. Clerk `user.created` webhook → Creates Clerk Organization → Triggers `organization.created` webhook
2. `organization.created` webhook → OrgProvisioningService.provisionOrg()
3. provisionOrg() → Transaction:
   a. Upsert organization record (idempotent)
   b. Create org_settings with defaults
   c. Create membership (owner role)
   d. Emit xentri.org.provisioned.v1
```

**New Database Tables:**

```sql
-- memberships table
CREATE TABLE memberships (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  org_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member', -- owner, admin, member
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(org_id, user_id)
);

-- org_settings table
CREATE TABLE org_settings (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  org_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE UNIQUE,
  plan TEXT NOT NULL DEFAULT 'free', -- free, presencia, light_ops, business_in_motion
  features JSONB NOT NULL DEFAULT '{}',
  preferences JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**RLS Policies:**

```sql
-- memberships: users see only their org's memberships
CREATE POLICY memberships_tenant_isolation ON memberships
USING (
  current_setting('app.current_org_id', true) IS NOT NULL
  AND org_id = current_setting('app.current_org_id', true)
);

-- org_settings: org members can read, owners can write
CREATE POLICY org_settings_tenant_isolation ON org_settings
USING (
  current_setting('app.current_org_id', true) IS NOT NULL
  AND org_id = current_setting('app.current_org_id', true)
);
```

**Event Payload:**

```typescript
interface OrgProvisionedPayload {
  org_id: string;
  org_name: string;
  owner_user_id: string;
  plan: 'free' | 'presencia' | 'light_ops' | 'business_in_motion';
  provisioned_at: string; // ISO8601
}
```

[Source: docs/architecture.md#ADR-002]

### Project Structure Notes

**Files to create:**
```
services/core-api/
├── src/
│   ├── domain/
│   │   └── orgs/
│   │       ├── OrgProvisioningService.ts     (new)
│   │       └── OrgProvisioningService.test.ts (new)
│   └── routes/
│       ├── orgs.ts                           (new - /api/v1/orgs endpoints)
│       └── orgs.test.ts                      (new)
├── prisma/
│   └── migrations/
│       └── YYYYMMDDHHMMSS_org_provisioning/  (new)
│           └── migration.sql

packages/ts-schema/src/
├── orgs.ts                                   (new)
└── index.ts                                  (modify - export orgs)
└── events.ts                                 (modify - add provisioned event)
```

**Files to modify:**
```
services/core-api/src/routes/webhooks/clerk.ts  (enhance provisioning)
services/core-api/src/server.ts                 (register orgs routes)
packages/ts-schema/src/events.ts                (add event type)
packages/ts-schema/src/index.ts                 (export orgs)
```

### Learnings from Previous Story

**From Story 1-3-user-authentication-signup (Status: done)**

- **Clerk Webhook Architecture:** `organization.created` webhook already syncs org to local `organizations` table. This story extends that to full provisioning (settings, membership).
  [Source: docs/sprint-artifacts/1-3-user-authentication-signup.md#Completion-Notes]

- **Event Emission Pattern:** Use existing `EventService.createEvent()` for `xentri.org.provisioned.v1`. The service is at `services/core-api/src/domain/events/EventService.ts`.
  [Source: docs/sprint-artifacts/1-3-user-authentication-signup.md#Learnings-from-Previous-Story]

- **String IDs:** User and Organization tables use Clerk string IDs (not UUIDs). New tables must follow this pattern.
  [Source: docs/sprint-artifacts/1-3-user-authentication-signup.md#Senior-Developer-Review-3]

- **Webhook Handler Location:** Existing handlers at `services/core-api/src/routes/webhooks/clerk.ts` - extend these rather than creating new files.
  [Source: docs/sprint-artifacts/1-3-user-authentication-signup.md#File-List]

- **RLS Policy Pattern:** Use `current_setting('app.current_org_id', true)` without `::uuid` cast since we now use text IDs.
  [Source: docs/sprint-artifacts/1-3-user-authentication-signup.md#Senior-Developer-Review-3]

- **Test Count:** 12+ Clerk tests passing from Story 1.3 - ensure no regressions.

### Edge Cases

- **Webhook Retry:** Clerk retries failed webhooks - handlers MUST be idempotent
- **Partial Provisioning:** If org created but settings/membership fails, transaction rolls back
- **Existing Membership:** If user already member of org (Clerk invite flow), don't create duplicate
- **Org Name Collision:** Clerk enforces unique org slugs, local table doesn't need to
- **Deleted User Signup:** If user was soft-deleted and signs up again, new org is created (don't reuse)

### Dependencies

- Story 1.1 (infrastructure): Complete
- Story 1.2 (events): Complete - EventService available
- Story 1.3 (auth): Complete - Clerk webhooks, auth middleware available

### References

- [Source: docs/architecture.md#ADR-003] - Multi-Tenant Security (RLS & Context)
- [Source: docs/architecture.md#Auth-Patterns] - Clerk Organizations
- [Source: docs/epics.md#Story-1.4] - Acceptance criteria
- [Source: docs/sprint-artifacts/tech-spec-epic-1.md] - Epic Technical Specification
- [Source: docs/sprint-artifacts/1-3-user-authentication-signup.md] - Previous story context

### AC Refinement Note
This story refines the high-level requirements from `tech-spec-epic-1.md`. While the Tech Spec mentions `org_created`, this story explicitly defines the `xentri.org.provisioned.v1` event and detailed provisioning logic (settings, memberships) to ensure a complete setup flow.

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

---

## Change Log

| Date | Author | Change |
|------|--------|--------|
| 2025-11-26 | SM Agent (Bob) | Initial draft created from Epic 1 requirements, architecture.md, and Story 1.3 learnings |
