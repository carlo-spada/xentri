# Story 1.2: Event Backbone & Database Schema

Status: drafted

## Story

As a **Developer**,
I want **an immutable event backbone with RLS-enforced database schema**,
so that **all system events are securely stored per-org and form the foundation for audit trails, orchestration, and cross-module intelligence**.

## Acceptance Criteria

1. **AC1:** `system_events` table exists with `org_id`, `actor_type`, `actor_id`, `event_type`, `payload`, `meta`, `occurred_at` columns (append-only, partitioned)
2. **AC2:** Queries under an authenticated role enforce RLS automatically; cross-org reads return 0 rows unless `app.is_super_admin` is set
3. **AC3:** Events are immutable (no UPDATE or DELETE allowed)
4. **AC4:** Event types for v0.1/v0.2 registered: `xentri.user.signup.v1`, `xentri.user.login.v1`, `xentri.brief.created.v1`, `xentri.brief.updated.v1`, `xentri.website.published.v1`, `xentri.page.updated.v1`, `xentri.content.published.v1`, `xentri.lead.created.v1`
5. **AC5:** Future hook for `open_loops` projection documented (TODO comment) without implementing logic
6. **AC6:** Org-scoped events endpoint `GET /api/v1/events` allows viewing recent events per org with pagination

## Tasks / Subtasks

- [ ] **Task 1: Create system_events Table Migration** (AC: 1, 3)
  - [ ] 1.1 Create Prisma migration for `system_events` table with schema (Partitioned by RANGE on occurred_at):
    ```sql
    CREATE TABLE system_events (
      id UUID NOT NULL DEFAULT gen_random_uuid(), -- Removed PRIMARY KEY constraint for partitioning compatibility
      org_id UUID NOT NULL,
      actor_type TEXT NOT NULL, -- 'user', 'system', 'job'
      actor_id UUID NOT NULL,
      event_type TEXT NOT NULL,
      payload JSONB NOT NULL DEFAULT '{}',
      meta JSONB NOT NULL DEFAULT '{}', -- Stores environment, source, etc.
      occurred_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      dedupe_key TEXT,
      correlation_id TEXT,
      trace_id TEXT,
      source TEXT NOT NULL, -- Kept for quick access, also in meta
      envelope_version TEXT NOT NULL DEFAULT '1.0',
      payload_schema TEXT NOT NULL,
      
      -- Partitioning requires the partition key to be part of the primary key
      PRIMARY KEY (id, occurred_at)
    ) PARTITION BY RANGE (occurred_at);
    ```
  - [ ] 1.2 Create initial partitions (e.g., current month + next month):
    ```sql
    CREATE TABLE system_events_2025_11 PARTITION OF system_events
      FOR VALUES FROM ('2025-11-01') TO ('2025-12-01');
    CREATE TABLE system_events_2025_12 PARTITION OF system_events
      FOR VALUES FROM ('2025-12-01') TO ('2026-01-01');
    ```
  - [ ] 1.3 Add index: `CREATE INDEX idx_events_org_type_time ON system_events(org_id, event_type, occurred_at DESC)`
  - [ ] 1.4 Add index for dedupe: `CREATE UNIQUE INDEX idx_events_dedupe ON system_events(dedupe_key, occurred_at) WHERE dedupe_key IS NOT NULL`
  - [ ] 1.5 Add observability indexes:
    ```sql
    CREATE INDEX idx_events_trace_id ON system_events(trace_id);
    CREATE INDEX idx_events_correlation_id ON system_events(correlation_id);
    ```

- [ ] **Task 2: Implement RLS for system_events** (AC: 2)
  - [ ] 2.1 Enable RLS: `ALTER TABLE system_events ENABLE ROW LEVEL SECURITY`
  - [ ] 2.2 Create fail-closed SELECT policy with Super Admin bypass:
    ```sql
    CREATE POLICY events_select_isolation ON system_events
      FOR SELECT USING (
        (current_setting('app.is_super_admin', true) = 'true') -- Bypass for System/Admin
        OR
        (
          current_setting('app.current_org_id', true) IS NOT NULL
          AND org_id = current_setting('app.current_org_id', true)::uuid
        )
      );
    ```
  - [ ] 2.3 Create INSERT policy allowing service to write with valid org_id:
    ```sql
    CREATE POLICY events_insert_policy ON system_events
      FOR INSERT WITH CHECK (
        -- Allow system/jobs to insert without org context if needed (e.g. cross-org events), 
        -- OR enforce org_id match. For now, enforce org_id match or super_admin.
        (current_setting('app.is_super_admin', true) = 'true')
        OR
        (
          current_setting('app.current_org_id', true) IS NOT NULL
          AND org_id = current_setting('app.current_org_id', true)::uuid
        )
      );
    ```
  - [ ] 2.4 Write integration test: User A cannot read User B's events; Super Admin can read both.

- [ ] **Task 3: Enforce Event Immutability** (AC: 3)
  - [ ] 3.1 Create UPDATE restriction policy:
    ```sql
    CREATE POLICY events_no_update ON system_events
      FOR UPDATE USING (false);
    ```
  - [ ] 3.2 Create DELETE restriction policy:
    ```sql
    CREATE POLICY events_no_delete ON system_events
      FOR DELETE USING (false);
    ```
  - [ ] 3.3 Write integration test: UPDATE and DELETE on events fail with policy error

- [ ] **Task 4: Register v0.1/v0.2 Event Types** (AC: 4)
  - [ ] 4.1 Create `packages/ts-schema/src/event-types.ts` with Zod schemas:
    - `xentri.user.signup.v1`
    - `xentri.user.login.v1`
    - `xentri.brief.created.v1`
    - `xentri.brief.updated.v1`
    - `xentri.website.published.v1`
    - `xentri.page.updated.v1`
    - `xentri.content.published.v1`
    - `xentri.lead.created.v1`
  - [ ] 4.2 Export event type union from `packages/ts-schema/src/index.ts`
  - [ ] 4.3 Create event registry with payload schemas and validation
  - [ ] 4.4 Write unit tests for each event type schema

- [ ] **Task 5: Document Open Loops Projection Hook** (AC: 5)
  - [ ] 5.1 Add TODO comment in `services/core-api/src/domain/events/` for future `open_loops` projection
  - [ ] 5.2 Document in code: events that contribute to open loops (`brief.created`, `lead.created`, etc.)
  - [ ] 5.3 Create placeholder interface `OpenLoopProjection` in ts-schema (no implementation)

- [ ] **Task 6: Implement Events API Endpoint** (AC: 6)
  - [ ] 6.1 Create `services/core-api/src/routes/events.ts`
  - [ ] 6.2 Implement `GET /api/v1/events` with query params:
    - `type` (optional): Filter by event_type
    - `since` (optional): ISO8601 timestamp for events after this time
    - `limit` (optional, default 50, max 100): Number of events to return
    - `cursor` (optional): Pagination cursor
  - [ ] 6.3 Response format:
    ```json
    {
      "data": [SystemEvent[]],
      "meta": { "cursor": "next_cursor_value", "limit": 50 }
    }
    ```
  - [ ] 6.4 Ensure RLS context is set before query (middleware already handles this from Story 1.1)
  - [ ] 6.5 Write integration tests for events endpoint

- [ ] **Task 7: Create Event Writer Utility** (AC: 1, 4)
  - [ ] 7.1 Create `services/core-api/src/domain/events/event-writer.ts`
  - [ ] 7.2 Implement `writeEvent<T>(event: SystemEvent<T>)` function:
    - Validate payload against Zod schema
    - Generate `dedupe_key` if not provided
    - Map `actor` object to `actor_type` and `actor_id` columns
    - Map `meta` object to `meta` column
    - INSERT into `system_events`
    - Return event_id
  - [ ] 7.3 Add optional Redis outbox publish (stub for future n8n integration)
  - [ ] 7.4 Write unit tests for event writer

- [ ] **Task 8: Testing & Validation** (AC: 1-6)
  - [ ] 8.1 Integration test: Write event, read back, verify all fields (including meta, actor)
  - [ ] 8.2 Integration test: Cross-org isolation (org_a cannot read org_b events)
  - [ ] 8.3 Integration test: Super Admin bypass (can read all)
  - [ ] 8.4 Integration test: Immutability (UPDATE/DELETE blocked)
  - [ ] 8.5 Integration test: Events endpoint pagination
  - [ ] 8.6 Unit test: Event type validation with invalid payloads
  - [ ] 8.7 Verify `pnpm run test` passes all new tests

## Dev Notes

### Architecture Constraints

- **Event Envelope:** Must match `SystemEvent<T>` interface in `packages/ts-schema/src/events.ts` [Source: docs/architecture.md#ADR-002]
- **RLS Pattern:** Fail-closed using `set_config('app.current_org_id', ...)` [Source: docs/architecture.md#ADR-003]
- **Immutability:** Events are append-only, corrections via compensating events [Source: docs/architecture.md#Event-Backbone]

### Existing Code to Reuse

The following types already exist in `packages/ts-schema/src/`:
- `SystemEvent<TPayload>` — Use this, do NOT recreate
- `EventActor`, `EventMeta`, `EventActorType` — Use these types
- `ApiResponse<T>`, `ProblemDetails` — Use for API responses
- `CacheKeys`, `InvalidationEvents` — Reference for cache integration

### Security Requirements (Non-Negotiable)

- Every event MUST have `org_id` [Source: docs/prd.md#FR82]
- RLS enabled with fail-closed policy [Source: docs/prd.md#Critical-Risks]
- No cross-org data leakage under any circumstances (except Super Admin)

### Performance Targets

- Event write latency <100ms [Source: docs/prd.md#NFR5]
- API response (reads) p95 <300ms [Source: docs/architecture.md#Performance]

### Project Structure Notes

**Expected File Locations:**
```
services/core-api/
├── src/
│   ├── routes/
│   │   └── events.ts           # GET /api/v1/events
│   ├── domain/
│   │   └── events/
│   │       ├── event-writer.ts # writeEvent() utility
│   │       └── index.ts        # Domain exports
│   └── infra/
│       └── prisma/
│           └── migrations/     # system_events migration

packages/ts-schema/
├── src/
│   ├── events.ts               # SystemEvent (EXISTS)
│   ├── event-types.ts          # NEW: Event type schemas
│   └── index.ts                # Barrel export
```

### Database Schema Reference

From tech spec, the `system_events` table should include:
- `id`, `org_id`, `actor_type`, `actor_id`, `event_type`, `payload`, `meta`, `occurred_at`, `created_at`
- `dedupe_key`, `correlation_id`, `trace_id` (reliability)
- `source`, `envelope_version`, `payload_schema` (metadata)
- **Partitioned by:** `occurred_at` (Range)

### Learnings from Previous Story

**From Story 1-1-project-initialization-infrastructure (Status: in-progress)**

- Story 1.1 is still in progress — monorepo structure may be partially complete
- Prisma should be initialized in `services/core-api`
- Docker Compose with Postgres should be available
- RLS may already be enabled on base tables (verify before adding)

**Note:** This story builds on Story 1.1 infrastructure. If Story 1.1 is incomplete, some tasks may need to wait for:
- Prisma setup in `services/core-api`
- Docker Compose running Postgres
- Basic Fastify routes structure

[Source: stories/1-1-project-initialization-infrastructure.md]

### References

- [Source: docs/architecture.md#ADR-002] - Event envelope specification
- [Source: docs/architecture.md#ADR-003] - RLS fail-closed pattern
- [Source: docs/sprint-artifacts/tech-spec-epic-1.md#Data-Models] - system_events schema
- [Source: docs/sprint-artifacts/tech-spec-epic-1.md#APIs-and-Interfaces] - Events endpoint spec
- [Source: packages/ts-schema/src/events.ts] - Existing SystemEvent type

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

<!-- To be filled by dev agent -->

### Debug Log References

<!-- To be filled during implementation -->

### Completion Notes List

<!-- To be filled after implementation -->

### File List

<!-- To be filled after implementation -->
<!-- Format: NEW | MODIFIED | DELETED : path/to/file -->

---

## Change Log

| Date | Author | Change |
|------|--------|--------|
| 2025-11-26 | SM Agent (Bob) | Initial draft from Epic 1 tech spec |
| 2025-11-26 | Antigravity | Schema review: Added actor_type/id, meta, partitioning, RLS bypass |
