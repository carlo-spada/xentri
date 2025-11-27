# Engineering Backlog

This backlog collects cross-cutting or future action items that emerge from reviews and planning.

Routing guidance:

- Use this file for non-urgent optimizations, refactors, or follow-ups that span multiple stories/epics.
- Must-fix items to ship a story belong in that story’s `Tasks / Subtasks`.
- Same-epic improvements may also be captured under the epic Tech Spec `Post-Review Follow-ups` section.

| Date | Story | Epic | Type | Severity | Owner | Status | Notes |
| ---- | ----- | ---- | ---- | -------- | ----- | ------ | ----- |
| 2025-11-26 | 1.2 | 1 | Bug | High | TBD | Open | Enforce org membership/JWT, derive org_id/user_id from verified claims before events (services/core-api/src/middleware/orgContext.ts:62-100; services/core-api/src/routes/events.ts:43-169). |
| 2025-11-26 | 1.2 | 1 | Bug | High | TBD | Open | Rewrite listEvents query with parameterized SQL; remove nested Prisma promises breaking filters/pagination (services/core-api/src/domain/events/EventService.ts:193-201). |
| 2025-11-26 | 1.2 | 1 | Enhancement | Medium | TBD | Open | Bind CreateEvent validation to typed payload schemas per event type; add negative tests (packages/ts-schema/src/events.ts:139-179; services/core-api/src/domain/events/EventService.test.ts:37-94). |
| 2025-11-26 | 1.2 | 1 | Test | Medium | TBD | Open | Add RLS/cross-org API tests and set org context during smoke-test seeding (services/core-api/src/routes/events.test.ts:145-260; scripts/smoke-test.ts:37-129). |
| 2025-11-26 | 1.4 | 1 | Bug | High | TBD | Done | Set org context before organization.created upsert to satisfy RLS (services/core-api/src/routes/webhooks/clerk.ts:123-137; services/core-api/prisma/migrations/20251126093000_clerk_ids_text/migration.sql:45-58). |
| 2025-11-26 | 1.4 | 1 | Bug | Medium | TBD | Done | Enforce owner-only org settings updates using membership role, add negative test (services/core-api/src/routes/orgs.ts:100-166). |
| 2025-11-26 | 1.4 | 1 | Bug | Low | TBD | Done | Deduplicate/transactional emission for `xentri.org.provisioned.v1` to avoid duplicates under concurrent webhooks (services/core-api/src/domain/orgs/OrgProvisioningService.ts:121-135). |
| 2025-11-26 | 1.4 | 1 | Test | Low | TBD | Open | Container runtime unavailable; rerun container suites when Colima/Docker available (`RUN_TESTCONTAINERS=1 pnpm --filter @xentri/core-api test`). |
| 2025-11-28 | 1.6 | 1 | Bug | High | TBD | Done | Strategy/Brief pages wired to authenticated Clerk org; no hardcoded org IDs. |
| 2025-11-28 | 1.6 | 1 | Enhancement | Medium | TBD | Done | Readiness metrics recorded (brief completion time, event success/failure counts, shell FMP). |
| 2025-11-28 | 1.6 | 1 | Bug | Medium | TBD | Done | Toast with retry and error surfacing for brief creation/event failures added. |
| 2025-11-28 | 1.6 | 1 | Enhancement | Medium | TBD | Done | Co-pilot availability check with guided-form fallback messaging added. |
