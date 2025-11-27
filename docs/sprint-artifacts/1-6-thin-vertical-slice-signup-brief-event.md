# Story 1.6: Thin Vertical Slice (Signup → Brief → Event)

Status: ready-for-dev

## Story

As a **User**,
I want **a working end-to-end slice from signup to Brief creation**,
so that **I see the product delivering value, not just infrastructure**.

## Acceptance Criteria

1. **AC1:** From a fresh environment, a user can sign up, land in shell, open Strategy category, and create a Brief draft (FR1, FR6, FR10, FR11)
2. **AC2:** `brief_created` event is written to `system_events` and visible via org-scoped event query (FR33, FR34, FR35, FR36, FR37)
3. **AC3:** Shell shows Brief summary tile post-creation in the Strategy category (FR26, FR12)
4. **AC4:** Slice runs in dev and CI environment; uses production-like RLS (FR82)
5. **AC5:** Readiness metrics tracked: brief completion time, event write reliability, shell FMP budget (NFR1, NFR5)
6. **AC6:** Event write failures surface visibly to user with retry option (edge case)
7. **AC7:** Fallback to guided form if Co-pilot unavailable (FR11, FR25)

## Tasks / Subtasks

- [ ] **Task 1: Create Brief data model and storage** (AC: 1, 2)
  - [ ] 1.1 Create `briefs` table in Prisma schema with `org_id`, `user_id`, `schema_version`, `sections` (JSONB), `completion_status`, timestamps
  - [ ] 1.2 Add RLS policy for `briefs` table using fail-closed pattern
  - [ ] 1.3 Create Zod schemas in `packages/ts-schema/src/brief.ts` for Brief structure (7 sections: Identity, Audience, Offerings, Positioning, Operations, Goals, Proof)
  - [ ] 1.4 Create Brief service in `services/core-api/src/domain/briefs/BriefService.ts`
  - [ ] 1.5 Run Prisma migration and generate client

- [ ] **Task 2: Create Brief API endpoints** (AC: 1, 2, 6)
  - [ ] 2.1 Create `POST /api/v1/briefs` endpoint to create new Brief draft (requires auth, uses org context)
  - [ ] 2.2 Create `GET /api/v1/briefs/:id` endpoint to fetch Brief by ID
  - [ ] 2.3 Create `GET /api/v1/briefs/current` endpoint to fetch current org's Brief
  - [ ] 2.4 Create `PATCH /api/v1/briefs/:id` endpoint to update Brief sections
  - [ ] 2.5 Emit `xentri.brief.created.v1` event on Brief creation with proper payload schema
  - [ ] 2.6 Add error handling with visible error messages for event write failures
  - [ ] 2.7 Write integration tests for Brief endpoints with RLS verification

- [ ] **Task 3: Create Strategy category landing page** (AC: 1, 3)
  - [ ] 3.1 Create `apps/shell/src/pages/strategy/index.astro` as Strategy category landing
  - [ ] 3.2 Create `apps/shell/src/components/strategy/BriefSummaryTile.tsx` React island showing Brief status/summary
  - [ ] 3.3 Create `apps/shell/src/components/strategy/CreateBriefCTA.tsx` for empty state (no Brief yet)
  - [ ] 3.4 Wire BriefSummaryTile to `GET /api/v1/briefs/current` with TanStack Query
  - [ ] 3.5 Add Strategy category as active in sidebar (first subscribed category for MVP)

- [ ] **Task 4: Create Brief creation form (guided form fallback)** (AC: 1, 7)
  - [ ] 4.1 Create `apps/shell/src/pages/strategy/brief/new.astro` Brief creation page
  - [ ] 4.2 Create `apps/shell/src/components/strategy/BriefForm.tsx` React island with 7-section wizard
  - [ ] 4.3 Implement section-by-section form: Identity (business name, tagline), Audience, Offerings (services list), Positioning, Operations, Goals, Proof
  - [ ] 4.4 Add form validation using Zod schemas from ts-schema
  - [ ] 4.5 On submit: call `POST /api/v1/briefs`, handle success/error, redirect to Brief view
  - [ ] 4.6 Add "Save Draft" functionality for partial completion

- [ ] **Task 5: Create Brief view page** (AC: 3)
  - [ ] 5.1 Create `apps/shell/src/pages/strategy/brief/[id].astro` Brief detail page
  - [ ] 5.2 Create `apps/shell/src/components/strategy/BriefView.tsx` React island showing all 7 sections
  - [ ] 5.3 Display section completion status (draft vs ready)
  - [ ] 5.4 Add "Edit Section" buttons linking back to form
  - [ ] 5.5 Style using shadcn/ui components and UX design system

- [ ] **Task 6: Verify events visible in org-scoped query** (AC: 2, 4)
  - [ ] 6.1 Create `GET /api/v1/events?type=xentri.brief.created.v1` query filter
  - [ ] 6.2 Create simple events timeline component in Strategy page showing recent Brief events
  - [ ] 6.3 Verify RLS prevents cross-org event visibility
  - [ ] 6.4 Write integration test: create Brief in Org A, verify Org B cannot see event

- [ ] **Task 7: E2E vertical slice test** (AC: 1, 2, 3, 4)
  - [ ] 7.1 Create Playwright E2E test: fresh signup → navigate to Strategy → create Brief → verify event logged
  - [ ] 7.2 Add test to CI pipeline
  - [ ] 7.3 Verify shell FMP < 2s on 3G throttling (NFR1)
  - [ ] 7.4 Verify event write latency < 100ms (NFR5)
  - [ ] 7.5 Measure and log brief completion time for readiness tracking

- [ ] **Task 8: Error handling and edge cases** (AC: 6, 7)
  - [ ] 8.1 Implement toast notification for event write failures with retry button
  - [ ] 8.2 Add graceful degradation: if Brief API fails, show error state in tile
  - [ ] 8.3 Implement offline detection: show offline banner when creating Brief offline
  - [ ] 8.4 Test fallback form works when Co-pilot route is unavailable (stub Co-pilot for future Epic 2)

## Dev Notes

### Architecture Constraints

- **Event Backbone:** Brief creation MUST emit `xentri.brief.created.v1` event to `system_events` table [Source: docs/architecture.md#ADR-002]
- **RLS Enforcement:** All Brief queries must use fail-closed RLS pattern with `set_config('app.current_org_id', ...)` [Source: docs/architecture.md#ADR-003]
- **Astro + React Islands:** Strategy pages are Astro SSG with React islands for interactive Brief components [Source: docs/architecture.md#Implementation-Patterns-B]
- **ts-schema Contracts:** Brief schema defined in `packages/ts-schema` and consumed by both shell and core-api [Source: docs/architecture.md#Implementation-Patterns-A]

### Technical Specifications

**Brief Schema (7 Sections):**
```typescript
// packages/ts-schema/src/brief.ts
import { z } from 'zod';

export const BriefSectionStatus = z.enum(['draft', 'ready']);

export const IdentitySection = z.object({
  businessName: z.string().optional(),
  tagline: z.string().optional(),
  foundingStory: z.string().optional(),
  coreValues: z.array(z.string()).optional(),
});

export const AudienceSection = z.object({
  primaryAudience: z.string().optional(),
  painPoints: z.array(z.string()).optional(),
  demographics: z.string().optional(),
});

export const OfferingsSection = z.object({
  services: z.array(z.object({
    name: z.string(),
    description: z.string().optional(),
    price: z.string().optional(),
  })).optional(),
  products: z.array(z.object({
    name: z.string(),
    description: z.string().optional(),
  })).optional(),
});

// ... Positioning, Operations, Goals, Proof sections

export const BriefSchema = z.object({
  id: z.string().uuid(),
  orgId: z.string(),
  userId: z.string(),
  schemaVersion: z.string().default('1.0'),
  sections: z.object({
    identity: IdentitySection,
    audience: AudienceSection,
    offerings: OfferingsSection,
    positioning: z.object({}).passthrough(),
    operations: z.object({}).passthrough(),
    goals: z.object({}).passthrough(),
    proof: z.object({}).passthrough(),
  }),
  sectionStatus: z.record(z.string(), BriefSectionStatus),
  completionStatus: z.enum(['draft', 'complete']),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
```

**Event Payload (brief.created.v1):**
```typescript
// packages/ts-schema/src/events.ts
export const BriefCreatedPayload = z.object({
  briefId: z.string().uuid(),
  schemaVersion: z.string(),
  completionStatus: z.enum(['draft', 'complete']),
  sectionsPopulated: z.array(z.string()), // e.g., ['identity', 'offerings']
});
```

**Database Table:**
```sql
-- services/core-api/prisma/migrations/xxx_add_briefs_table/migration.sql
CREATE TABLE briefs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  schema_version TEXT NOT NULL DEFAULT '1.0',
  sections JSONB NOT NULL DEFAULT '{}',
  section_status JSONB NOT NULL DEFAULT '{}',
  completion_status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS Policy (fail-closed)
ALTER TABLE briefs ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON briefs
  FOR ALL
  USING (
    current_setting('app.current_org_id', true) IS NOT NULL
    AND org_id = current_setting('app.current_org_id', true)
  );

CREATE INDEX idx_briefs_org ON briefs(org_id);
```

### Project Structure Notes

**Files to Create:**
```
packages/ts-schema/src/
├── brief.ts                               (new - Brief schemas)

services/core-api/
├── src/
│   ├── domain/briefs/
│   │   ├── BriefService.ts                (new - Brief business logic)
│   │   └── index.ts                       (new - exports)
│   └── routes/
│       └── briefs.ts                      (new - Brief API endpoints)
├── prisma/
│   └── migrations/xxx_add_briefs_table/
│       └── migration.sql                  (new - briefs table)

apps/shell/src/
├── pages/
│   └── strategy/
│       ├── index.astro                    (new - Strategy landing)
│       └── brief/
│           ├── new.astro                  (new - Create Brief page)
│           └── [id].astro                 (new - View Brief page)
├── components/strategy/
│   ├── BriefSummaryTile.tsx              (new - React island)
│   ├── CreateBriefCTA.tsx                (new - React island)
│   ├── BriefForm.tsx                     (new - React island)
│   └── BriefView.tsx                     (new - React island)
└── stores/
    └── brief.ts                          (new - Nanostore for Brief state)
```

**Files to Modify:**
```
packages/ts-schema/src/index.ts            (export brief module)
packages/ts-schema/src/events.ts           (add BriefCreatedPayload)
services/core-api/src/server.ts            (register briefs routes)
services/core-api/prisma/schema.prisma     (add Brief model)
apps/shell/src/stores/navigation.ts        (mark Strategy as active)
```

### Learnings from Previous Story

**From Story 1-5-application-shell-navigation (Status: done)**

- **AppShell Layout Available:** Use existing `AppShell.astro` layout for Strategy pages
  [Source: docs/sprint-artifacts/1-5-application-shell-navigation.md#File-List]

- **Nano Stores Pattern:** Follow existing pattern in `stores/navigation.ts` for Brief state management
  [Source: docs/sprint-artifacts/1-5-application-shell-navigation.md#Task-2]

- **React Islands Pattern:** Use `client:only="react"` for interactive Brief components
  [Source: docs/sprint-artifacts/1-5-application-shell-navigation.md#Architecture-Constraints]

- **API Pattern:** Follow route structure in `services/core-api/src/routes/users.ts` for Brief endpoints
  [Source: docs/sprint-artifacts/1-5-application-shell-navigation.md#Task-4]

- **Theme & Offline:** Theme toggle and offline banner already implemented - reuse for Brief pages
  [Source: docs/sprint-artifacts/1-5-application-shell-navigation.md#Task-3]

- **Test Count:** 26 tests passing (ui:10, ts-schema:3, core-api:13). Add Brief tests without regression.
  [Source: docs/sprint-artifacts/1-5-application-shell-navigation.md#Task-8]

- **Clerk IDs:** Use Clerk text IDs for user_id and org_id references (not UUIDs)
  [Source: docs/sprint-artifacts/1-5-application-shell-navigation.md#Learnings-from-Previous-Story]

- **RLS Context:** Use `$executeRaw(Prisma.sql\`SELECT set_config('app.current_org_id', ${orgId}, true)\`)` before Brief queries
  [Source: docs/sprint-artifacts/1-5-application-shell-navigation.md#Learnings-from-Previous-Story]

### UX Design Alignment

- **Strategy Category:** Management & Strategy is the first category; Brief is the core deliverable [Source: docs/ux-design-specification.md#4.1]
- **Empty State:** Show "Create your Universal Brief" CTA when no Brief exists [Source: docs/ux-design-specification.md#8.2]
- **Form Pattern:** Use progressive disclosure for Brief sections - don't overwhelm with all 7 at once [Source: docs/ux-design-specification.md#1.3]
- **Toast Pattern:** Use undo-first toasts for Brief save success [Source: docs/ux-design-specification.md#5.2]
- **Color System:** Use Surface layer for Brief cards, Primary color for CTAs [Source: docs/ux-design-specification.md#3.2]

### Edge Cases

- **Event Write Failure:** Show toast with retry button; Brief record still created locally, event retried
- **Offline Brief Creation:** Cache form input locally; on reconnect, prompt to submit or discard
- **Concurrent Edits:** Last-write-wins for MVP; warn if Brief updated since load
- **Empty Sections:** Allow saving Brief with empty sections (status: draft)
- **Schema Migration:** Include `schema_version` for future Brief schema evolution

### Dependencies

- Story 1.1 (infrastructure): Complete ✓
- Story 1.2 (events): Complete ✓ - `system_events` table ready
- Story 1.3 (auth): Complete ✓ - Clerk session available
- Story 1.4 (orgs): Complete ✓ - org context available
- Story 1.5 (shell): Complete ✓ - AppShell layout and navigation ready

### NFR Alignment

| NFR | Target | How Achieved |
|-----|--------|--------------|
| NFR1 | Shell load <2s on 3G | Astro SSG, lazy Brief islands |
| NFR5 | Event write <100ms | Single INSERT, async event emission |
| NFR9 | RLS isolation | Fail-closed policy on briefs table |
| NFR29 | >70% test coverage | Integration tests for Brief CRUD + RLS |

### References

- [Source: docs/architecture.md#ADR-002] - Event Envelope Schema
- [Source: docs/architecture.md#ADR-003] - Multi-Tenant RLS Pattern
- [Source: docs/sprint-artifacts/tech-spec-epic-1.md#Story-1.6] - Acceptance Criteria
- [Source: docs/prd.md#FR10-FR17] - Universal Brief FRs
- [Source: docs/prd.md#FR33-FR37] - Event Backbone FRs
- [Source: docs/ux-design-specification.md#4.1] - First-Time User Journey
- [Source: docs/epics.md#Story-1.6] - Story Definition
- [Source: docs/sprint-artifacts/1-5-application-shell-navigation.md] - Previous Story Learnings

## Dev Agent Record

### Context Reference

- `docs/sprint-artifacts/1-6-thin-vertical-slice-signup-brief-event.context.xml`

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

---

## Change Log

| Date | Author | Change |
|------|--------|--------|
| 2025-11-26 | SM Agent (Bob) | Initial draft created in #yolo mode from tech-spec-epic-1, architecture.md, PRD, UX design spec, and Story 1.5 learnings |
| 2025-11-26 | SM Agent (Bob) | Story context generated, status updated to ready-for-dev |
