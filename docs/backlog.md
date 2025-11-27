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
| 2025-11-28 | 1.6 | 1 | Bug | High | TBD | Open | Strategy/Brief pages hardcode `org_demo_1`; wire to authenticated Clerk org and propagate session to API/E2E (apps/shell/src/pages/strategy/index.astro:5-13; apps/shell/src/pages/strategy/brief/new.astro:5-15; apps/shell/src/pages/strategy/brief/[id].astro:7-23; services/core-api/src/middleware/orgContext.ts:83-145; e2e/vertical-slice-brief.spec.ts:33-111). |
| 2025-11-28 | 1.6 | 1 | Enhancement | Medium | TBD | Open | Add readiness metrics (brief completion time, event write latency, shell FMP) in BriefForm/BriefService per AC5 (apps/shell/src/components/strategy/BriefForm.tsx; services/core-api/src/domain/briefs/BriefService.ts). |
| 2025-11-28 | 1.6 | 1 | Bug | Medium | TBD | Open | Implement toast/undo+retry UX and safe retries for brief creation/event failures per AC6 (apps/shell/src/components/strategy/BriefForm.tsx:96-136; services/core-api/src/routes/briefs.ts:33-154). |
| 2025-11-28 | 1.6 | 1 | Enhancement | Medium | TBD | Open | Add co-pilot availability detection and guided-form fallback messaging per AC7 (apps/shell/src/components/strategy/BriefForm.tsx). |
