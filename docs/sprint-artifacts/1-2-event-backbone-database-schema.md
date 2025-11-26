# Story 1.2: Event Backbone & Database Schema

Status: review

## Story

As a **System**,
I want **a centralized `system_events` table with RLS policies and an org-scoped events API**,
so that **we have an immutable audit trail and secure multi-tenancy from which all orchestration flows**.

## Acceptance Criteria

1. **AC1:** `system_events` table exists with `id`, `org_id`, `user_id`, `event_type`, `payload` (JSONB), `occurred_at`, `created_at`, `dedupe_key`, `correlation_id`, `trace_id`, `source`, `envelope_version`, `payload_schema` columns (append-only)
2. **AC2:** RLS policy enforces fail-closed tenant isolation: queries without valid `app.current_org_id` return 0 rows; cross-org reads are blocked
3. **AC3:** Events are immutable—UPDATE and DELETE operations are blocked at the policy level
4. **AC4:** Event types for v0.1/v0.2 are registered in `ts-schema`: `xentri.user.signup.v1`, `xentri.user.login.v1`, `xentri.brief.created.v1`, `xentri.brief.updated.v1`, `xentri.website.published.v1`, `xentri.page.updated.v1`, `xentri.content.published.v1`, `xentri.lead.created.v1`, `xentri.org.created.v1`
5. **AC5:** Future hook for `open_loops` projection is documented (placeholder comment/type) without implementing business logic
6. **AC6:** `POST /api/v1/events` endpoint accepts SystemEvent payloads, validates via Zod schema, and returns `{event_id, acknowledged: true}`
7. **AC7:** `GET /api/v1/events` endpoint returns org-scoped events with query params: `?type=`, `?since=`, `?limit=`; supports cursor-based pagination

## Tasks / Subtasks

- [x] **Task 1: Create system_events table migration** (AC: 1, 3)
  - [x] 1.1 Add Prisma schema for `system_events` table with all columns per tech spec
  - [x] 1.2 Write raw SQL migration to create table with proper indexes
  - [x] 1.3 Add `idx_events_org_type_time` composite index for common queries
  - [x] 1.4 Add CHECK constraint or trigger preventing UPDATE/DELETE (immutability)

- [x] **Task 2: Implement RLS policies for system_events** (AC: 2, 3)
  - [x] 2.1 Enable RLS on `system_events` table
  - [x] 2.2 Create `tenant_isolation` policy with fail-closed pattern:
    ```sql
    CREATE POLICY tenant_isolation ON system_events
      FOR ALL USING (
        current_setting('app.current_org_id', true) IS NOT NULL
        AND org_id = current_setting('app.current_org_id', true)::uuid
      );
    ```
  - [x] 2.3 Create INSERT-only policy (block UPDATE/DELETE at policy level)
  - [x] 2.4 Write integration test: user_a cannot read user_b's events

- [x] **Task 3: Define event types in ts-schema** (AC: 4, 5)
  - [x] 3.1 Add `EventType` union type with all v0.1/v0.2 event types
  - [x] 3.2 Add typed payload interfaces for each event type
  - [x] 3.3 Add `SystemEvent<TPayload>` generic Zod schema with validation
  - [x] 3.4 Add `OpenLoopsProjection` placeholder type with TODO comment for future implementation
  - [x] 3.5 Export all types from `packages/ts-schema/src/events.ts`

- [x] **Task 4: Create EventService in core-api** (AC: 6, 7)
  - [x] 4.1 Create `services/core-api/src/domain/events/EventService.ts`
  - [x] 4.2 Implement `createEvent(payload: SystemEvent)` method with:
    - Zod validation
    - Dedupe key generation (if not provided)
    - Transaction-scoped `set_config('app.current_org_id', ...)` call
    - INSERT into system_events
  - [x] 4.3 Implement `listEvents(orgId, options)` method with:
    - Type filtering
    - Since timestamp filtering
    - Cursor-based pagination (limit + cursor)
  - [x] 4.4 Write unit tests for EventService methods

- [x] **Task 5: Create events API routes** (AC: 6, 7)
  - [x] 5.1 Create `POST /api/v1/events` route in core-api
  - [x] 5.2 Create `GET /api/v1/events` route with query param parsing
  - [x] 5.3 Add auth middleware to extract user_id from JWT
  - [x] 5.4 Add org scoping middleware to verify x-org-id header
  - [x] 5.5 Return Problem Details format for errors (400, 401, 403, 500)
  - [x] 5.6 Write integration tests for both endpoints

- [x] **Task 6: Shell timeline panel (vertical slice)** (AC: 7)
  - [x] 6.1 Create minimal React component `EventTimeline` in shell
  - [x] 6.2 Fetch events from `/api/v1/events?limit=10` on mount
  - [x] 6.3 Display event_type, occurred_at, source in simple list format
  - [x] 6.4 Style with existing Xentri design tokens from packages/ui

- [x] **Task 7: Testing and validation** (AC: 1-7)
  - [x] 7.1 Write RLS isolation test: seed org_a and org_b events, verify cross-org blocked
  - [x] 7.2 Write immutability test: attempt UPDATE/DELETE, verify blocked
  - [x] 7.3 Write API integration test: POST event → GET event visible
  - [x] 7.4 Add smoke test case for events to existing smoke-test.ts
  - [x] 7.5 Verify all tests pass: `pnpm run test`

## Dev Notes

### Architecture Constraints

- **Event Envelope:** Must implement `SystemEvent<T>` interface per ADR-002 [Source: docs/architecture.md#ADR-002]
- **RLS Pattern:** Fail-closed using `set_config('app.current_org_id', ...)` per ADR-003 [Source: docs/architecture.md#ADR-003]
- **Immutability:** Events are append-only; no UPDATE/DELETE allowed [Source: docs/sprint-artifacts/tech-spec-epic-1.md#Data-Models]
- **Event Naming:** `xentri.{boundedContext}.{action}.{version}` pattern [Source: docs/architecture.md#Naming-Location-Patterns]

### Technical Specifications

**System Events Table Schema:**
```sql
CREATE TABLE system_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  user_id UUID,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}',
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  dedupe_key TEXT,
  correlation_id TEXT,
  trace_id TEXT,
  source TEXT NOT NULL,
  envelope_version TEXT NOT NULL DEFAULT '1.0',
  payload_schema TEXT NOT NULL
);

CREATE INDEX idx_events_org_type_time ON system_events(org_id, event_type, occurred_at DESC);
```
[Source: docs/sprint-artifacts/tech-spec-epic-1.md#Data-Models-and-Contracts]

**Event Types (v0.1/v0.2):**
- `xentri.user.signup.v1`
- `xentri.user.login.v1`
- `xentri.org.created.v1`
- `xentri.brief.created.v1`
- `xentri.brief.updated.v1`
- `xentri.website.published.v1`
- `xentri.page.updated.v1`
- `xentri.content.published.v1`
- `xentri.lead.created.v1`

[Source: docs/sprint-artifacts/tech-spec-epic-1.md#Story-1.2]

### API Contracts

**POST /api/v1/events:**
- Request: `SystemEvent` payload (validated via Zod)
- Response: `{ event_id: string, acknowledged: true }`
- Errors: 400 (validation), 401 (unauthenticated), 403 (wrong org)

**GET /api/v1/events:**
- Query params: `?type=`, `?since=ISO8601`, `?limit=number`, `?cursor=string`
- Response: `{ data: SystemEvent[], meta: { cursor?: string, has_more: boolean } }`
- Events scoped to authenticated org via RLS

[Source: docs/sprint-artifacts/tech-spec-epic-1.md#APIs-and-Interfaces]

### Performance Targets

- Event write latency: <100ms [Source: docs/prd.md#NFR5]
- API read response: p95 <300ms [Source: docs/architecture.md#Performance]

### Project Structure Notes

**Files to create/modify:**
```
services/core-api/
├── prisma/
│   └── migrations/
│       └── [timestamp]_add_system_events/
│           └── migration.sql
├── src/
│   ├── domain/
│   │   └── events/
│   │       ├── EventService.ts
│   │       └── EventService.test.ts
│   └── routes/
│       ├── events.ts
│       └── events.test.ts

packages/ts-schema/src/
├── events.ts (extend existing)
└── index.ts (re-export)

apps/shell/src/
└── components/
    └── EventTimeline.tsx
```

### Learnings from Previous Story

**From Story 1-1-project-initialization-infrastructure (Status: done)**

- **RLS Infrastructure Ready**: Fail-closed RLS pattern already implemented in `scripts/init-db.sql` and verified by smoke test - use same pattern for `system_events` [Source: docs/sprint-artifacts/1-1-project-initialization-infrastructure.md#Dev-Agent-Record]
- **Prisma Setup**: Prisma 7.0.1 schema exists at `services/core-api/prisma/schema.prisma` with `users`, `organizations`, `members` tables - extend this schema [Source: docs/sprint-artifacts/1-1-project-initialization-infrastructure.md#File-List]
- **ts-schema Patterns**: Event envelope `SystemEvent<T>` interface already exists in `packages/ts-schema/src/events.ts` - extend with specific event types [Source: docs/sprint-artifacts/1-1-project-initialization-infrastructure.md#Completion-Notes]
- **Test Infrastructure**: Vitest workspace + Postgres test container ready at `services/core-api/src/__tests__/helpers/postgres-container.ts` - reuse for RLS tests [Source: docs/sprint-artifacts/1-1-project-initialization-infrastructure.md#File-List]
- **Health Endpoint Pattern**: Follow `services/core-api/src/routes/health.ts` pattern for new event routes [Source: docs/sprint-artifacts/1-1-project-initialization-infrastructure.md#Completion-Notes]
- **CI Pipeline**: Smoke test runs in CI - add events tests to existing suite [Source: docs/sprint-artifacts/1-1-project-initialization-infrastructure.md#Task-9]
- **Advisory Note**: Consider refactoring `services/core-api/src/server.ts` to avoid side-effects on import (from review) [Source: docs/sprint-artifacts/1-1-project-initialization-infrastructure.md#Senior-Developer-Review]

### References

- [Source: docs/architecture.md#ADR-002] - Event Envelope & Schema
- [Source: docs/architecture.md#ADR-003] - Multi-Tenant Security (RLS)
- [Source: docs/sprint-artifacts/tech-spec-epic-1.md#Story-1.2] - Acceptance criteria
- [Source: docs/sprint-artifacts/tech-spec-epic-1.md#Data-Models-and-Contracts] - Table schemas
- [Source: docs/prd.md#FR33-38] - Event functional requirements
- [Source: docs/prd.md#FR82] - RLS enforcement requirement
- [Source: docs/sprint-artifacts/1-1-project-initialization-infrastructure.md] - Previous story context

## Dev Agent Record

### Context Reference

- `docs/sprint-artifacts/1-2-event-backbone-database-schema.context.xml`

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

---

## Change Log

| Date | Author | Change |
|------|--------|--------|
| 2025-11-26 | SM Agent (Bob) | Initial draft created from Epic 1 tech spec, epics.md, and Story 1.1 learnings |
