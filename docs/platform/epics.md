---
entity_type: constitution
document_type: epics
title: 'Xentri System Epics'
description: 'System-wide epic structure based on Understanding + Action framework. Category/Module epics emerge organically.'
version: '3.0'
status: approved
created: '2025-11-28'
updated: '2025-12-03'
---

<!--
CONSTITUTION DOCUMENT

This document defines SYSTEM-LEVEL epic outcomes that coordinate multiple Infrastructure Modules.
Stories here specify WHAT the system achieves; module epics specify HOW each module contributes.

For module-specific implementation stories:
- Shell: docs/platform/shell/epics.md (FR-SHL-xxx stories)
- Core API: docs/platform/core-api/epics.md (FR-API-xxx stories)
- UI: docs/platform/ui/epics.md (FR-UI-xxx stories)
- TS Schema: docs/platform/ts-schema/epics.md (FR-TSS-xxx stories)

Module stories INHERIT from Constitution epics and trace to both PR-xxx/IC-xxx and module FRs.
-->

# Xentri - System Epics (Constitution)

> **Entity Type:** Constitution
> **Scope:** System-wide outcomes coordinating all Infrastructure Modules
> **Traceability:** Maps to PRD Platform Requirements (PR-xxx) and Integration Contracts (IC-xxx)
> **Philosophy:** Understanding + Action — each epic adds new understanding AND new action capability

---

## Overview

This document defines the epic structure for Xentri at the Constitution level. Unlike traditional feature-driven epics, Xentri's epics follow an **Understanding + Action** framework:

- **Understanding (Soul):** What Xentri learns about the business
- **Action (Tools):** What Xentri can do with that understanding
- **Loop:** Actions feed back to deepen understanding

**Key Insight:** Xentri will take years to "complete." The goal isn't feature completeness — it's sustainable value delivery where:

```
Running Costs < Revenue < Value Delivered
```

**Organic Growth Model:**

- Constitution Epics (1-4) define the **platform that builds modules**
- Category/Module Epics emerge **organically** when the Soul identifies the next need
- We don't pre-plan 170+ modules; we build them as they become necessary

---

## Epic Philosophy

### The Soul Concept

What we call the "Soul" is a **living understanding** — the Soul of the business. It's not a document users create once; it's a relationship that grows with every interaction.

**Tri-State Memory Architecture:**

1. **Semantic Memory:** Structured facts (identity, offerings, goals)
2. **Episodic Memory:** What happened (decisions, outcomes, conversations)
3. **Synthetic Memory:** Compressed wisdom derived from episodes

### The Sense-and-Respond Loop

```
Soul (Understanding)  ←──────┐
        ↓                    │
    Copilot                  │
        ↓                    │
 "You need X"                │
        ↓                    │
    Tool X  ──→ Action ──→ Result
                              ↓
                        Feeds back
```

Each epic must prove this loop works for its scope.

---

## Requirements Traceability

> **Single Source of Truth:** Platform Requirements live in [`docs/_atoms/`](../_atoms/_index.md). Legacy PR-xxx IDs are mapped to atom IDs in [PRD §Platform Requirements Index](./prd.md#platform-requirements-index). This section tracks epic coverage and implementation status only.

### Platform Requirements Coverage

| Atom ID                           | Legacy | Epic Coverage     | Status   |
| --------------------------------- | ------ | ----------------- | -------- |
| [`SYS.002`](../_atoms/SYS.002.md) | PR-001 | Epic 1            | Complete |
| [`SYS.003`](../_atoms/SYS.003.md) | PR-002 | Epic 1 → Epic 1.5 | Partial  |
| [`SYS.004`](../_atoms/SYS.004.md) | PR-003 | Epic 1            | Complete |
| [`SYS.005`](../_atoms/SYS.005.md) | PR-004 | Epic 2            | Planned  |
| [`SYS.006`](../_atoms/SYS.006.md) | PR-005 | Epic 1 → Epic 1.5 | Partial  |
| [`SYS.007`](../_atoms/SYS.007.md) | PR-006 | Epic 2            | Planned  |
| [`SYS.008`](../_atoms/SYS.008.md) | PR-007 | Epic 1            | Complete |
| [`SYS.009`](../_atoms/SYS.009.md) | PR-008 | Epic 3            | Planned  |

### Integration Contracts Coverage

| ID     | Epic Coverage     | Status   |
| ------ | ----------------- | -------- |
| IC-001 | Epic 1            | Complete |
| IC-002 | Epic 1 → Epic 1.5 | Partial  |
| IC-003 | Epic 3            | Planned  |
| IC-004 | Epic 2            | Planned  |
| IC-005 | Epic 2            | Planned  |
| IC-006 | Epic 3            | Planned  |
| IC-007 | Epic 1.5          | Planned  |

---

## Epic Summary

| Epic | Title                    | Goal                               | Understanding          | Action                    | Status              |
| ---- | ------------------------ | ---------------------------------- | ---------------------- | ------------------------- | ------------------- |
| 1    | Foundation (v1)          | Secure multi-tenant infrastructure | —                      | Infrastructure runs       | ✅ Ready for Review |
| 1.5  | Infrastructure Migration | Bridge v1 to v2 architecture       | —                      | v2 infrastructure ready   | Planned             |
| 2    | Soul System              | Xentri understands "who you are"   | Identity + Offerings   | First Copilot operational | Planned             |
| 3    | Tool Framework           | Any module can integrate with Soul | Configuration patterns | Modules auto-personalize  | Planned             |
| 4    | Fractal Proof            | End-to-end loop validated          | Need detection         | First tool delivers value | Planned             |

---

## Epic 1: Foundation (v1)

**Goal:** Establish the secure, multi-tenant shell, event backbone, and complete user access flow.

**Status:** ✅ Ready for Review (all v1 stories complete; v2 gaps addressed in Epic 1.5)

**Scope:**

- Platform Requirements: SYS.002 (PR-001), SYS.003 (PR-002, partial), SYS.004 (PR-003), SYS.006 (PR-005, partial), SYS.008 (PR-007)
- Integration Contracts: IC-001, IC-002 (partial)
- Infrastructure Modules: shell, core-api, ts-schema, ui

**Dependencies:** None (foundation)

### Audit Summary (v1 → v2)

| Story                | Original | v2 Validity | Gap Category                       |
| -------------------- | -------- | ----------- | ---------------------------------- |
| 1.1 Project Init     | Complete | 70% Valid   | Missing Python layer, Redis        |
| 1.2 Event Backbone   | Complete | 60% Valid   | Missing Redis Streams transport    |
| 1.3 User Auth        | Complete | 80% Valid   | Missing Clerk Organizations        |
| 1.4 Org Provisioning | Complete | 50% Valid   | Missing permission primitives      |
| 1.5 Shell & Nav      | Complete | 60% Valid   | Missing Pulse/Copilot architecture |
| 1.6 Thin Slice       | Complete | 20% Valid   | Soul concept established           |
| 1.7 DevOps           | Complete | 30% Valid   | Railway → GKE migration            |

**Decision:** Keep Epic 1 as historical foundation. Gaps addressed in Epic 1.5.

### Stories (Original — For Reference)

#### Story 1.1: Project Initialization & Infrastructure

**Traces to:** [SYS.002](../_atoms/SYS.002.md) (PR-001)
**Coordinates:** core-api, shell

**Acceptance Criteria:**

- Fresh clone runs with `pnpm install && pnpm run dev`
- Monorepo structure: apps/shell, packages/ui, services/core-api
- Local Postgres via Docker with RLS enabled
- CI/CD runs lint/test/build on push
- Smoke script confirms cross-org isolation

**Status:** Complete (with v2 gaps)

---

#### Story 1.2: Event Backbone & Database Schema

**Traces to:** [SYS.003](../_atoms/SYS.003.md) (PR-002), IC-001, IC-002
**Coordinates:** core-api, ts-schema

**Acceptance Criteria:**

- `system_events` table with `org_id`, `event_type`, `payload`, `timestamp`
- RLS enforces org isolation automatically
- Events are immutable (append-only)
- Event types registered in ts-schema

**Status:** Complete (missing Redis transport)

---

#### Story 1.3: User Authentication & Signup

**Traces to:** [SYS.004](../_atoms/SYS.004.md) (PR-003)
**Coordinates:** core-api, shell

**Acceptance Criteria:**

- Email/password login redirects to shell
- Google OAuth login works
- `user_signup` and `user_login` events logged
- HTTP-only cookies with refresh rotation

**Status:** Complete (missing Clerk Organizations)

---

#### Story 1.4: Organization Creation & Provisioning

**Traces to:** [SYS.002](../_atoms/SYS.002.md) (PR-001), [SYS.006](../_atoms/SYS.006.md) (PR-005)
**Coordinates:** core-api

**Acceptance Criteria:**

- Organization auto-created on signup
- User assigned as "Owner"
- `org_created` event logged

**Status:** Complete (missing permission primitives IC-007)

---

#### Story 1.5: Application Shell & Navigation

**Traces to:** [SYS.008](../_atoms/SYS.008.md) (PR-007)
**Coordinates:** shell, ui

**Acceptance Criteria:**

- Shell shows 7 category icons in sidebar
- Sidebar expands active category, collapses others
- Navigation without full page reload
- Light/Dark toggle persisted
- Mobile-responsive with PWA manifest

**Status:** Complete (missing Pulse/Copilot/Theme architecture)

---

#### Story 1.6: Thin Vertical Slice

**Traces to:** [SYS.003](../_atoms/SYS.003.md) (PR-002)
**Coordinates:** shell, core-api

**Acceptance Criteria:**

- User can sign up, land in shell, open Strategy, create Soul draft
- `soul_created` event visible via org-scoped query
- Shell shows Soul summary tile
- Works in dev and CI with production-like RLS

**Status:** Obsolete (incorporated into Soul paradigm)

---

#### Story 1.7: DevOps, Observability, and Test Readiness

**Traces to:** [SYS.007](../_atoms/SYS.007.md) (PR-006)
**Coordinates:** platform (DevOps)

**Acceptance Criteria:**

- CI runs lint + unit tests + type checks on PRs
- Structured JSON logging with correlation IDs
- Smoke test script for shell/Soul slice
- Zero-downtime deploy pipeline with rollback plan

**Status:** Partial (Railway → GKE migration required)

---

## Epic 1.5: Infrastructure Migration (v1 → v2)

**Goal:** Bridge the v1 infrastructure to v2 architecture requirements so all subsequent epics can assume modern infrastructure.

**Understanding Added:** —
**Action Enabled:** v2 infrastructure operational (Redis Streams, Python services, GKE, Permission system)

**Scope:**

- Platform Requirements: SYS.003 (PR-002, complete), SYS.006 (PR-005, complete)
- Integration Contracts: IC-002 (complete), IC-007
- Infrastructure Modules: core-api, ts-schema

**Dependencies:** Epic 1 (foundation exists)

### Stories

#### Story 1.5.1: Redis Streams + Dual-Write Pattern

**Traces to:** [SYS.003](../_atoms/SYS.003.md) (PR-002), IC-002
**Coordinates:** core-api

**Acceptance Criteria:**

- Redis service added to docker-compose.yaml
- Redis Streams configured with consumer groups
- Dual-write pattern: events write to Redis (real-time) + Postgres (durable log)
- Event envelope includes: `envelope_version`, `payload_schema`, `dedupe_key`
- Existing event emissions migrated to new transport

**Technical Notes:**

- Architecture §2: Redis is the "Nervous System" transport
- ADR-002: Event envelope schema with versioning

---

#### Story 1.5.2: Python Service Scaffold

**Traces to:** ADR-008
**Coordinates:** ts-schema

**Acceptance Criteria:**

- Python service template at `services/strategy-copilot/`
- `pyproject.toml` with FastAPI, LangChain, pytest dependencies
- CI pipeline includes Python linting (ruff) and tests (pytest)
- JSON Schema generation pipeline: ts-schema → JSON → Python types
- Service communicates via Redis Streams (not direct HTTP)

**Technical Notes:**

- ADR-008: Python for Agent Layer (LLM chains, data science)
- ADR-009: Cross-runtime contract strategy via JSON Schema bridge

---

#### Story 1.5.3: Permission Primitives (IC-007)

**Traces to:** [SYS.006](../_atoms/SYS.006.md) (PR-005), IC-007
**Coordinates:** core-api, ts-schema

**Acceptance Criteria:**

- Permission primitives defined: `view`, `edit`, `approve`, `configure`
- `PermissionGrant` interface in ts-schema
- Role → Permission mapping table in database
- `has_permission()` Postgres function for RLS integration
- API middleware: `requirePermission()` decorator
- 3-layer enforcement: UI gating, API middleware, database RLS

**Technical Notes:**

- ADR-015: Permission Enforcement Architecture
- Fail-closed behavior: missing context = deny

---

#### Story 1.5.4: Clerk Organizations Sync

**Traces to:** [SYS.004](../_atoms/SYS.004.md) (PR-003), [SYS.006](../_atoms/SYS.006.md) (PR-005)
**Coordinates:** core-api

**Acceptance Criteria:**

- Clerk Organizations as source of truth for org membership
- JWT claims include: `org_id`, `org_role`, `org_permissions`
- Webhook handler syncs Clerk org changes to local database
- Apple OAuth added (Architecture: "MVP: Google + Apple")
- Owner role correctly maps to all permission primitives

**Technical Notes:**

- Architecture §6.E: Clerk with native Organizations support

---

#### Story 1.5.5: GKE Deployment Foundation

**Traces to:** ADR-004
**Coordinates:** platform (DevOps)

**Acceptance Criteria:**

- Helm chart scaffold at `infra/helm/`
- Category Cluster topology defined (7 Agent + 7 Tool services pattern)
- GKE Autopilot configuration for staging environment
- Dockerfile for Python services (no Nixpacks)
- CI/CD pipeline deploys to GKE staging
- Rollback procedure documented and tested

**Technical Notes:**

- ADR-004: Kubernetes First (Category Cluster Strategy)
- Architecture §5: GKE Autopilot for "Solo Visionary" team

---

#### Story 1.5.6: Contract Testing Pipeline

**Traces to:** ADR-009
**Coordinates:** ts-schema

**Acceptance Criteria:**

- JSON Schema diff runs in CI on ts-schema changes
- Pact consumer-driven contract tests for Node ↔ Python boundary
- Integration test: Node emits → Redis → Python consumes → validates
- Schema parity check: generated Python types match TypeScript
- CI gate: schema mismatch = build failure

**Technical Notes:**

- ADR-009: Cross-Runtime Contract Strategy
- Custom Zod validators (.refine()) require manual integration tests

---

## Epic 2: Soul System

**Goal:** Xentri understands "who you are" and can act on that understanding.

**Understanding Added:** Identity, Offerings, Goals (Semantic Memory)
**Action Enabled:** Strategy Copilot responds with personalized guidance

**Scope:**

- Platform Requirements: PR-004, PR-006
- Integration Contracts: IC-004, IC-005
- Infrastructure Modules: core-api, ts-schema, strategy-copilot (new)

**Dependencies:** Epic 1.5 (Redis Streams, Python scaffold, Permissions)

### Stories

#### Story 2.0: Brief→Soul Code Refactoring

**Traces to:** Terminology alignment with Constitution documents
**Coordinates:** core-api, ts-schema, shell

**Rationale:** The Constitution documents (PRD, Architecture, UX Design, Epics) now use "Soul" terminology consistently. The existing codebase from Epic 1 still uses "Brief" naming. This story aligns the implementation with the evolved terminology before building new Soul features.

**Acceptance Criteria:**

- [ ] Rename `packages/ts-schema/src/brief.ts` → `packages/ts-schema/src/soul.ts`
- [ ] Update all Zod schemas: `BriefSchema` → `SoulSchema`, `BriefSectionSchema` → `SoulSectionSchema`
- [ ] Rename `services/core-api/src/domain/briefs/` → `services/core-api/src/domain/souls/`
- [ ] Rename `BriefService.ts` → `SoulService.ts`, update class name
- [ ] Rename `services/core-api/src/routes/briefs.ts` → `services/core-api/src/routes/souls.ts`
- [ ] Update API routes: `/api/v1/briefs/*` → `/api/v1/souls/*`
- [ ] Rename `apps/shell/src/stores/brief.ts` → `apps/shell/src/stores/soul.ts`
- [ ] Update event names: `xentri.brief.*` → `xentri.soul.*`
- [ ] Update database table if exists: `briefs` → `souls`
- [ ] Update all imports across codebase
- [ ] All existing tests pass after refactoring
- [ ] TypeScript compiles without errors

**Files to Modify:**

```
packages/ts-schema/src/brief.ts → soul.ts
packages/ts-schema/src/index.ts (update exports)
services/core-api/src/domain/briefs/ → souls/
services/core-api/src/routes/briefs.ts → souls.ts
services/core-api/src/routes/briefs.test.ts → souls.test.ts
services/core-api/src/routes/index.ts (update imports)
apps/shell/src/stores/brief.ts → soul.ts
```

**Migration Notes:**

- No database migration needed if table doesn't exist in production yet
- If `briefs` table exists, create migration: `ALTER TABLE briefs RENAME TO souls`
- Event schema version stays v1; the event type name changes

**Status:** Not Started

---

#### Story 2.1: Tri-State Memory Foundation

**Traces to:** ADR-006
**Coordinates:** core-api, ts-schema

**Acceptance Criteria:**

- Semantic Memory schema: identity, offerings, goals sections in database
- Episodic Memory: `soul_episodes` table with vector embeddings (pgvector)
- Synthetic Memory: `soul_synthesis` table for compressed wisdom
- Soul Gateway Service: `GET /api/v1/soul`, `GET /api/v1/soul/{section}`
- Caching: Redis with 5-minute TTL, invalidated on `xentri.soul.updated.v1`
- ETag support for conditional requests

**Technical Notes:**

- ADR-006: Tri-State Memory Architecture
- ADR-016: Soul Access Architecture

---

#### Story 2.2: Strategy Copilot MVP

**Traces to:** [SYS.005](../_atoms/SYS.005.md) (PR-004), [SYS.009](../_atoms/SYS.009.md) (PR-008)
**Coordinates:** strategy-copilot, core-api

**Acceptance Criteria:**

- Strategy Copilot Python service operational
- Copilot reads Semantic Memory via Soul Gateway API
- Multi-turn conversation flow (State Machine: Initiated → Conversing → Drafting)
- Copilot responds using vocabulary adapted to business type
- Responses include human-readable reasoning (PR-006)
- Conversation history stored in Episodic Memory

**Technical Notes:**

- State Machine §10: Soul Generation Flow
- ADR-007: Federated Soul Registry (Global Soul + Category Context + Agent Role)

---

#### Story 2.3: Recommendation Protocol

**Traces to:** IC-005
**Coordinates:** strategy-copilot, core-api

**Acceptance Criteria:**

- Recommendation submission endpoint: `POST /api/v1/soul/recommendations`
- Recommendation event shape per IC-005: target_section, proposed_value, evidence, confidence
- Strategy Copilot queues recommendations for synthesis cycle
- High-confidence (>0.9) + low-impact = auto-approve pathway
- Low-confidence or high-impact = flag for human review
- `xentri.soul.recommendation.submitted.v1` event emitted

**Technical Notes:**

- ADR-016: Recommendation Submission Protocol
- Exception: War Room sessions can approve immediately with human present

---

#### Story 2.4: Soul Learning Loop

**Traces to:** ADR-006
**Coordinates:** strategy-copilot, core-api

**Acceptance Criteria:**

- User actions write to Episodic Memory automatically
- Background "Dreaming" process (nightly) compresses episodes to Synthetic Memory
- Dreaming process: 3 retries with exponential backoff, P3 alert on failure
- Synthetic Memory injected into Copilot system prompts
- Proof: Copilot demonstrates recall of previous conversations

**Technical Notes:**

- ADR-006: Dreaming Process Specification
- Trigger: Nightly cron (02:00 local), managed by Category Copilot

---

## Epic 3: Tool Framework

**Goal:** Any module can register, read the Soul, and deliver Soul-aware value automatically.

**Understanding Added:** Module usage patterns
**Action Enabled:** Modules auto-configure from Soul; notifications flow consistently

**Scope:**

- Platform Requirements: PR-008
- Integration Contracts: IC-003, IC-006
- Infrastructure Modules: shell, ui, core-api, ts-schema

**Dependencies:** Epic 2 (Soul System operational)

### Stories

#### Story 3.1: Module Manifest v2

**Traces to:** IC-003
**Coordinates:** shell, ts-schema

**Acceptance Criteria:**

- Module manifest schema v2 with Soul integration fields
- `soul_fields_read`: which Soul sections the module consumes
- `soul_fields_contribute`: which Soul sections the module can recommend updates to
- Build-time manifest collection into `shell/src/manifests/`
- CI validation: missing required fields = build failure
- Shell lazy-loads module bundles based on manifest

**Technical Notes:**

- ADR-014: Module Registration Architecture
- Validation: JSON Schema + circular dependency check

---

#### Story 3.2: Soul-Aware Configuration

**Traces to:** [SYS.005](../_atoms/SYS.005.md) (PR-004)
**Coordinates:** core-api, ui

**Acceptance Criteria:**

- Modules auto-configure from Soul on first load
- Example: CRM pipeline stages derived from Soul's sales_cycle_length
- Configuration persisted per-org with Soul version reference
- Re-configuration triggered when Soul section updates
- UI shows "Configured from your Soul" indicator

**Technical Notes:**

- Modules read Soul via standard API (never direct database access)

---

#### Story 3.3: Vocabulary Adaptation

**Traces to:** [SYS.009](../_atoms/SYS.009.md) (PR-008)
**Coordinates:** ui, ts-schema, strategy-copilot

**Acceptance Criteria:**

- Vocabulary mapping system in ts-schema
- Industry-specific term mappings (healthcare: "customer" → "patient")
- `useVocabulary()` React hook for UI components
- Copilots receive vocabulary context in system prompts
- User can override terms in Settings (custom_terms in Soul)
- All user-facing text uses vocabulary system (hard-coded terms = bug)

**Technical Notes:**

- ADR-019: Vocabulary Adaptation Architecture

---

#### Story 3.4: Notification Delivery

**Traces to:** IC-006
**Coordinates:** core-api, shell, ui

**Acceptance Criteria:**

- Notification event shape per IC-006: title, body, priority, scope
- Priority-based routing: critical (immediate), high/medium (digest), low (in-app only)
- Delivery channels: Push, Email, In-app (priority determines which)
- User preferences: mute category, change delivery, quiet hours
- Notification Router processes all `notification` events
- Pulse dashboard shows notifications by scope

**Technical Notes:**

- ADR-017: Notification Delivery Architecture
- Modules emit events with notification metadata; infrastructure handles routing

---

## Epic 4: Fractal Proof

**Goal:** Prove the full Understanding → Recommend → Tool → Learn loop works end-to-end.

**Understanding Added:** "You need visibility" detection
**Action Enabled:** First tool (Website Builder MVP) delivers real value

**Scope:**

- Platform Requirements: All PRs validated end-to-end
- Integration Contracts: All ICs operational
- Infrastructure Modules: shell, ui, core-api, marketing-copilot (new), website-builder (new)

**Dependencies:** Epic 3 (Tool Framework operational)

### Stories

#### Story 4.1: Need Detection ("You need visibility")

**Traces to:** [SYS.005](../_atoms/SYS.005.md) (PR-004), IC-005
**Coordinates:** strategy-copilot

**Acceptance Criteria:**

- Strategy Copilot analyzes Soul and identifies "visibility gap"
- Detection triggers when: business has offerings but no web presence
- Copilot generates recommendation: "You should get visible online"
- Recommendation includes confidence score and evidence
- Recommendation surfaces in Operational Pulse

**Technical Notes:**

- This proves: Soul → Copilot → Recommendation pathway

---

#### Story 4.2: Website Builder MVP

**Traces to:** IC-003, PR-004
**Coordinates:** shell, marketing-copilot, website-builder

**Acceptance Criteria:**

- Website Builder module registered via manifest
- Module auto-configures from Soul (business name, offerings, brand voice)
- User can create single-page website through guided flow
- Website published to public URL
- `xentri.marketing.website.published.v1` event emitted
- Marketing Copilot provides copy suggestions based on Soul

**Technical Notes:**

- This proves: Recommendation → Tool → Action pathway
- Module should feel "already configured" because of Soul

---

#### Story 4.3: Tool → Soul Feedback

**Traces to:** ADR-006
**Coordinates:** website-builder, core-api

**Acceptance Criteria:**

- Website creation writes to Episodic Memory
- Soul learns: "has_website: true", "website_url: ..."
- Future copilot interactions reference this fact
- Proof: Copilot says "Since you launched your website..."

**Technical Notes:**

- This proves: Action → Soul feedback loop

---

#### Story 4.4: Cross-Domain Trigger

**Traces to:** All PRs, All ICs
**Coordinates:** strategy-copilot, marketing-copilot, sales-copilot

**Acceptance Criteria:**

- Website generates leads (lead capture form)
- Lead creation event triggers Strategy Copilot analysis
- Strategy Copilot detects: "You have leads, you need to track them"
- Recommendation surfaces: "Let's set up your CRM"
- This proves: Tool A → Event → Copilot → Recommend Tool B

**Technical Notes:**

- This is the ultimate Fractal Proof: cross-domain orchestration works
- Validates entire architecture in production use

---

## Traceability Matrix

| Requirement | Type     | Epic    | Story         | Status              |
| ----------- | -------- | ------- | ------------- | ------------------- |
| PR-001      | Platform | 1       | 1.1, 1.2, 1.4 | Complete            |
| PR-002      | Platform | 1 → 1.5 | 1.2, 1.5.1    | Partial → Planned   |
| PR-003      | Platform | 1, 1.5  | 1.3, 1.5.4    | Complete → Enhanced |
| PR-004      | Platform | 2       | 2.1, 2.2      | Planned             |
| PR-005      | Platform | 1 → 1.5 | 1.4, 1.5.3    | Partial → Planned   |
| PR-006      | Platform | 2       | 2.2, 2.3      | Planned             |
| PR-007      | Platform | 1       | 1.5           | Complete            |
| PR-008      | Platform | 3       | 3.3           | Planned             |
| IC-001      | Contract | 1       | 1.2           | Complete            |
| IC-002      | Contract | 1 → 1.5 | 1.2, 1.5.1    | Partial → Planned   |
| IC-003      | Contract | 3       | 3.1           | Planned             |
| IC-004      | Contract | 2       | 2.1           | Planned             |
| IC-005      | Contract | 2       | 2.3           | Planned             |
| IC-006      | Contract | 3       | 3.4           | Planned             |
| IC-007      | Contract | 1.5     | 1.5.3         | Planned             |

---

## Coordination Model

### Infrastructure Module Coordination

| Epic | shell   | ui      | core-api | ts-schema | strategy-copilot |
| ---- | ------- | ------- | -------- | --------- | ---------------- |
| 1    | Primary | Support | Primary  | Support   | —                |
| 1.5  | —       | —       | Primary  | Primary   | Setup            |
| 2    | —       | Support | Primary  | Primary   | Primary          |
| 3    | Primary | Primary | Primary  | Primary   | Support          |
| 4    | Primary | Primary | Support  | Support   | Primary          |

**Legend:** Primary = major changes, Support = minor changes, — = no changes

---

## Organic Growth: Beyond Epic 4

After Epic 4, the Constitution Epics are **complete**. The platform is operational.

Future epics emerge **organically** based on what the Soul identifies as the next need:

```
Soul Analysis → Copilot Recommendation → New Module Epic
```

**Example Organic Emergence:**

| Soul Observation                          | Copilot Recommendation         | Emergent Epic                  |
| ----------------------------------------- | ------------------------------ | ------------------------------ |
| "User has leads but no sales tracking"    | "Let's set up your CRM"        | Sales → CRM Module             |
| "User closing deals but not getting paid" | "Time to invoice"              | Finance → Invoicing Module     |
| "User overwhelmed by manual work"         | "Let's automate your workflow" | Operations → Automation Module |

**No need to pre-plan 170+ modules.** They emerge when the Soul says they're needed.

---

## Child Entity Epic Inheritance

When creating epics for Infrastructure Modules or Categories, use cascading IDs:

| Constitution Epic | Child Epic Pattern | Example                          |
| ----------------- | ------------------ | -------------------------------- |
| Epic 1            | Epic 1-SHL-x       | Epic 1-SHL-1 (Shell-specific)    |
| Epic 2            | Epic 2-API-x       | Epic 2-API-1 (Core API-specific) |
| Epic 3            | Epic 3-x           | Epic 3-1, Epic 3-2               |
| Organic           | Epic O-{CAT}-x     | Epic O-SAL-1 (Sales organic)     |

---

## Success Criteria

**Epic 4 Complete = MVP Validated when:**

1. Strategy Copilot identifies a need from Soul analysis
2. Copilot recommends appropriate tool
3. Tool auto-configures from Soul
4. User takes action with tool
5. Action enriches Soul
6. Next recommendation is informed by enriched Soul

**Economics Gate:**

```
Running Cost per Org < Monthly Revenue per Org
```

Until this gate passes, we're not sustainable. Features don't matter; unit economics do.

---

## Revision History

| Version | Date       | Author            | Changes                                                                                                                                 |
| ------- | ---------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| 1.0     | 2025-11-28 | Carlo + AI        | Initial epic structure                                                                                                                  |
| 2.0     | 2025-12-02 | Carlo + BMAD Team | Complete restructure: Understanding + Action framework, Soul concept introduced, Epic 1 audit, Epic 1.5 migration, organic growth model |
| 3.0     | 2025-12-03 | Carlo + Winston   | Constitutional Review: Added header clarifying Constitution vs module epic roles, references to module-specific implementation stories  |

---

_This is the Constitution-level epic structure. Infrastructure Module epics inherit from this document and define module-specific implementation stories. See header comment for module epic locations._
