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
