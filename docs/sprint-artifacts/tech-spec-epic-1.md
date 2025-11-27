# Epic Technical Specification: Foundation & Access (MVP)

Date: 2025-11-26
Author: Carlo
Epic ID: 1
Status: Draft

---

## Overview

Epic 1 establishes the secure, multi-tenant foundation for Xentri's Business OS. This is the load-bearing infrastructure that all downstream capabilities depend on. The epic delivers three critical pillars: (1) a Turborepo monorepo with Astro shell and React islands, (2) an Event Backbone powered by Postgres `system_events` table with RLS enforcement, and (3) a complete user access flow from signup through organization provisioning.

The architectural philosophy is "Decoupled Unity"—a unified shell providing seamless UX while independent services maintain technical isolation. Every table enforces `org_id` via Row-Level Security from day zero. Events are immutable and append-only, forming the audit trail and orchestration backbone for all future modules.

## Objectives and Scope

### In Scope (v0.1 MVP)

- **Infrastructure:** Turborepo monorepo with Astro shell, React islands architecture, Docker-compose local dev environment
- **Multi-tenancy:** Postgres RLS policies on all tables, `org_id` enforcement, fail-closed transaction pattern
- **Event Backbone:** `system_events` table, v0.1 event types (`user_signup`, `user_login`, `brief_created`, `brief_updated`), org-scoped query API
- **Authentication:** Clerk (email/password + Social OAuth via Google, Apple), HTTP-only cookies, session management via Clerk SDK
- **Organization Creation:** Auto-provisioning on signup, Owner role assignment, `org_created` event
- **Shell UX:** 7-category sidebar, expand/collapse behavior, light/dark mode, responsive mobile layout
- **Notifications Infrastructure:** Transactional email setup (Resend/Postmark), in-app notification feed, preferences storage
- **DevOps:** CI/CD pipeline (lint/test/build), structured logging, correlation IDs, smoke test harness
- **Vertical Slice:** End-to-end flow from signup → Brief creation → event logged

### Out of Scope

- Strategy Co-pilot and Universal Brief (Epic 2)
- Website Builder and CMS (Epic 3)
- Lead Capture (Epic 4)
- Payment/billing integration (Future v0.4)
- Multi-user roles beyond Owner (Future v0.4)
- CFDI/SII compliance (Future v0.5+)

## System Architecture Alignment

This epic implements the foundational layers defined in `architecture.md`:

| Component | Architecture Reference | Epic 1 Deliverable |
|-----------|----------------------|-------------------|
| **Shell** | Astro container with React islands | `apps/shell` with sidebar, header, auth |
| **Shared Contract** | `packages/ts-schema` | Event envelope, User/Org schemas, API types |
| **Backend** | Node.js microservices | `services/core-api` for auth, orgs, events |
| **Data** | Postgres with RLS | Schema migrations, RLS policies |
| **Events** | Postgres `system_events` + Redis transport | v0.1 event types, outbox pattern stub |
| **Observability** | OpenTelemetry + Pino | Structured logging, trace propagation |

**ADR Alignment:**
- ADR-002 (Event Envelope): Implement `SystemEvent<T>` interface in `packages/ts-schema`
- ADR-003 (Multi-Tenant Security): Implement fail-closed RLS with `set_config('app.current_org_id', ...)` pattern
- ADR-004 (Railway Bootstrap Strategy): Deploy via Railway for bootstrapping; K8s when triggers fire. See `docs/architecture/adr-004-railway-bootstrap.md`

---

## Detailed Design

### Services and Modules

| Service/Package | Responsibility | Inputs | Outputs | Owner |
|-----------------|----------------|--------|---------|-------|
| `apps/shell` | Astro container, routing, auth UI, sidebar/header | User session, nav state | Rendered HTML, mounted React islands | Frontend |
| `packages/ts-schema` | Shared TypeScript types, Zod schemas, event definitions | None | Exported types consumed by all | Shared |
| `packages/ui` | shadcn/ui components with Xentri design tokens | Design spec | Reusable React components | Frontend |
| `services/core-api` | Auth endpoints, org management, event ingestion, notifications | HTTP requests | JSON responses, events | Backend |
| Database | Postgres 16.11 with RLS | SQL queries | Query results (org-scoped) | Infrastructure |

### Data Models and Contracts

**Users Table:**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ  -- Soft delete
);
```

**Organizations Table:**
```sql
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  owner_id UUID REFERENCES users(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ  -- Soft delete with 30-day recovery
);
```

**Members Table (Org-User Junction):**
```sql
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) NOT NULL,
  user_id UUID REFERENCES users(id) NOT NULL,
  role TEXT NOT NULL DEFAULT 'owner',  -- MVP: only 'owner'
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(org_id, user_id)
);
```

**System Events Table:**
```sql
CREATE TABLE system_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,  -- RLS key
  user_id UUID,  -- Nullable for system events
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}',
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Reliability fields
  dedupe_key TEXT,
  correlation_id TEXT,
  trace_id TEXT,

  -- Metadata
  source TEXT NOT NULL,
  envelope_version TEXT NOT NULL DEFAULT '1.0',
  payload_schema TEXT NOT NULL
);

-- Immutability: No UPDATE or DELETE policies
-- Index for common queries
CREATE INDEX idx_events_org_type_time ON system_events(org_id, event_type, occurred_at DESC);
```

**RLS Policy (Fail-Closed):**
```sql
ALTER TABLE system_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON system_events
  FOR ALL
  USING (
    current_setting('app.current_org_id', true) IS NOT NULL
    AND org_id = current_setting('app.current_org_id', true)::uuid
  );
```

**Notifications Table:**
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  user_id UUID REFERENCES users(id) NOT NULL,
  type TEXT NOT NULL,  -- 'lead_created', 'system', etc.
  title TEXT NOT NULL,
  body TEXT,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

**User Preferences Table:**
```sql
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL UNIQUE,
  theme TEXT DEFAULT 'dark',  -- 'light' | 'dark'
  email_notifications JSONB DEFAULT '{"lead_created": true, "system": true}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### APIs and Interfaces

**Authentication Endpoints (core-api):**

| Method | Path | Request | Response | Events |
|--------|------|---------|----------|--------|
| POST | `/api/v1/auth/signup` | `{email, password, name}` | `{user, org, access_token}` | `xentri.user.signup.v1`, `xentri.org.created.v1` |
| POST | `/api/v1/auth/login` | `{email, password}` | `{user, access_token}` | `xentri.user.login.v1` |
| POST | `/api/v1/auth/oauth/google` | OAuth callback | `{user, access_token}` | `xentri.user.signup.v1` or `xentri.user.login.v1` |
| POST | `/api/v1/auth/logout` | - | `{success: true}` | - |
| POST | `/api/v1/auth/refresh` | Refresh token cookie | `{access_token}` | - |
| POST | `/api/v1/auth/reset-password` | `{email}` | `{success: true}` | - |

**User/Profile Endpoints:**

| Method | Path | Request | Response |
|--------|------|---------|----------|
| GET | `/api/v1/users/me` | - | `{user, org, preferences}` |
| PATCH | `/api/v1/users/me` | `{name?, avatar_url?}` | `{user}` |
| DELETE | `/api/v1/users/me` | - | `{success: true}` |

**Events Endpoint:**

| Method | Path | Request | Response |
|--------|------|---------|----------|
| POST | `/api/v1/events` | `SystemEvent` payload | `{event_id, acknowledged: true}` |
| GET | `/api/v1/events` | `?type=&since=&limit=` | `{data: SystemEvent[], meta: {cursor}}` |

**Notifications Endpoints:**

| Method | Path | Request | Response |
|--------|------|---------|----------|
| GET | `/api/v1/notifications` | `?unread_only=` | `{data: Notification[], meta}` |
| PATCH | `/api/v1/notifications/:id/read` | - | `{notification}` |
| PATCH | `/api/v1/users/me/preferences` | `{theme?, email_notifications?}` | `{preferences}` |

**Error Response Format (Problem Details):**
```json
{
  "type": "https://xentri.app/errors/validation",
  "title": "Validation Error",
  "status": 422,
  "detail": "Email is required",
  "trace_id": "abc123"
}
```

### Workflows and Sequencing

**Signup → Organization Provisioning Flow:**

```
1. User submits signup form (email/password or OAuth) via Clerk components
2. Clerk creates user record; webhook fires to core-api
3. Webhook handler (user.created):
4.   → Sync user to local `users` table (id from Clerk)
5.   → Create Clerk Organization via API (name from email domain or user name)
6.   → Clerk auto-assigns user as org admin
7.   → Emit xentri.user.signup.v1 event
8.   → Emit xentri.org.created.v1 event
9. Clerk session established (HTTP-only cookie managed by Clerk)
10. Redirect to shell with authenticated session
```

**Request → RLS Enforcement Flow:**

```
1. Client sends request with x-org-id header
2. Middleware extracts user_id from JWT
3. Middleware verifies user is member of x-org-id
4. If not member → 403 Forbidden
5. Begin database transaction
6. Execute: SELECT set_config('app.current_org_id', $org_id, true)
7. Execute business logic queries (RLS auto-filters by org_id)
8. Commit transaction
9. Return response
```

**Event Write Flow:**

```
1. Service prepares SystemEvent payload
2. Validate against Zod schema (ts-schema)
3. Generate dedupe_key if not provided
4. INSERT into system_events (append-only)
5. Optionally: LPUSH to Redis outbox stream (for n8n consumption)
6. Return event_id to caller
```

---

## Non-Functional Requirements

### Performance

| Metric | Target | Source |
|--------|--------|--------|
| Shell initial load (FMP) | <2s on 3G | NFR1 |
| Module/category switch | <500ms | NFR2 |
| Event write latency | <100ms | NFR5 |
| API response (reads) | p95 <300ms | Architecture |
| API response (writes) | p95 <600ms | Architecture |

**Implementation:**
- Astro SSG for shell HTML (minimal JS)
- React islands lazy-loaded with hover prefetch
- Connection pooling for Postgres (PgBouncer)
- Event writes are single INSERT, no complex joins

### Security

| Requirement | Implementation | Source |
|-------------|----------------|--------|
| TLS 1.3 | Ingress/CDN termination, internal mTLS | NFR7 |
| Encryption at rest | Postgres encryption, encrypted backups | NFR8 |
| Multi-tenant isolation | RLS on all tables, `org_id` enforcement | NFR9, FR82 |
| Secure tokens | HTTP-only cookies, short-lived JWTs, refresh rotation | NFR10 |
| No PII in logs | Scrub email/name from application logs | NFR11 |
| SQL injection prevention | Parameterized queries via Prisma | NFR12 |
| XSS prevention | CSP headers, output encoding | NFR13 |

### Reliability/Availability

| Metric | Target | Source |
|--------|--------|--------|
| System availability | 99.5% uptime | NFR19 |
| Data durability | Zero data loss | NFR20 |
| Backup frequency | Daily full + continuous WAL | NFR21 |
| RTO | <4 hours | NFR22 |
| RPO | <1 hour | NFR23 |

**Implementation:**
- Managed Postgres with automated failover
- Point-in-time recovery enabled
- Event log is append-only (no accidental deletes)

### Observability

| Requirement | Implementation | Source |
|-------------|----------------|--------|
| Structured logging | Pino JSON logs with correlation IDs | NFR24 |
| Error tracking | Exception capture with stack traces | NFR25 |
| Performance monitoring | OpenTelemetry traces, p50/p95/p99 dashboards | NFR26 |
| Alerting | PagerDuty/Slack for critical issues | NFR28 |

**Logging Format:**
```json
{
  "level": "info",
  "time": "2025-11-26T10:00:00.000Z",
  "trace_id": "abc123",
  "org_id": "org_xyz",
  "user_id": "user_abc",
  "msg": "Event created",
  "event_type": "xentri.user.signup.v1"
}
```

---

## Dependencies and Integrations

### External Dependencies

| Dependency | Version | Purpose |
|------------|---------|---------|
| Astro | 5.16.0 | Shell framework |
| React | 19.2.0 | Islands/micro-apps |
| Node.js | 24.11.1 LTS | Backend runtime |
| Fastify | 5.6.2 | API framework |
| Prisma | 7.0.1 | Database ORM |
| Postgres | 16.11 | Primary database |
| Redis | 8.4.0 | Event transport, caching |
| Clerk | @clerk/fastify 3.x, @clerk/astro 1.x | Authentication with native Organizations |
| Turborepo | 2.6.1 | Monorepo tooling |
| pnpm | 10.23.0 | Package manager |

### Internal Packages

| Package | Purpose |
|---------|---------|
| `packages/ts-schema` | Shared types, Zod schemas, event definitions |
| `packages/ui` | shadcn/ui components with Xentri design tokens |

### Transactional Email (Notification Delivery)

| Provider | Purpose |
|----------|---------|
| Resend or Postmark | Welcome email, password reset, lead notifications |

---

## Acceptance Criteria (Authoritative)

### Story 1.1: Project Initialization & Infrastructure
1. **Given** a fresh clone, **When** `npm install && npm run dev` runs, **Then** the Astro shell loads locally
2. **Given** the project structure, **When** inspected, **Then** it follows the monorepo layout (`apps/shell`, `packages/ui`, `services/core-api`)
3. **Given** the database, **When** initialized, **Then** it runs a local Postgres instance via Docker with RLS enabled
4. **Given** CI/CD, **When** code is pushed, **Then** lint/test/build run headless
5. **Given** the smoke script, **When** executed, **Then** it seeds org A/B and confirms cross-org read is blocked while shell still loads

### Story 1.2: Event Backbone & Database Schema
1. `system_events` table exists with `org_id`, `event_type`, `payload`, `timestamp` (append-only)
2. Queries under an authenticated role enforce RLS automatically; cross-org reads return 0 rows
3. Events are immutable (no updates/deletes) and include `user_id` when present
4. Event types for v0.1/v0.2 registered: `user_signup`, `user_login`, `brief_created`, `brief_updated`, `website_published`, `page_updated`, `content_published`, `lead_created`
5. Future hook recorded for `open_loops` projection without implementing logic
6. Org-scoped events endpoint allows viewing recent events per org

### Story 1.3: User Authentication & Signup
1. Email/password login redirects to shell on success
2. Social OAuth login (Google, Apple, or other configured providers) succeeds and redirects to shell
3. `user_signup` and `user_login` events log with `org_id` + `user_id`
4. Sessions use HTTP-only cookies; session managed by Clerk SDK

### Story 1.4: Organization Creation & Provisioning
1. On new user signup, an Organization record is automatically created
2. New user is assigned as "Owner" of that org
3. `org_created` event is logged

### Story 1.5: Application Shell & Navigation
1. Shell shows 7 category icons in the sidebar
2. Sidebar expands active category and collapses others on click
3. Navigation switches panels without full page reload; state preserved
4. User menu allows Light/Dark toggle persisted per user
5. Mobile: sidebar uses touch-safe targets (44px) and shows graceful offline banner

### Story 1.6: Thin Vertical Slice
1. From a fresh environment, a user can sign up, land in shell, open Strategy, and create a Brief draft
2. `brief_created` event is written and visible via org-scoped event query
3. Shell shows Brief summary tile post-creation
4. Slice runs in dev and CI environment; uses production-like RLS

### Story 1.7: DevOps, Observability, and Test Readiness
1. CI runs lint + unit tests + type checks on PRs; fails gate merges
2. Logging uses structured JSON with correlation IDs; error tracking hooked
3. Minimal load test or smoke test script for shell/Brief slice
4. Deployment pipeline supports zero-downtime deploys

**Deployment Artifacts (ADR-004):**
- `docs/architecture/adr-004-railway-bootstrap.md` — Bridge Strategy decision record
- `docs/deployment-plan.md` — Step-by-step Railway deployment guide
- `docs/k8s-migration-runbook.md` — K8s migration when triggers fire
- `services/core-api/railway.toml` — Config as Code for core-api
- `apps/shell/railway.toml` — Config as Code for shell
- `.github/workflows/ci.yml` — Staging gate and production-ready jobs

## Post-Review Follow-ups

### Story 1.2 (Resolved)
- ~~Story 1.2: Enforce org membership/JWT before setting org context for events~~ → Membership check implemented; JWT binding deferred to Story 1.3
- ~~Story 1.2: Rewrite listEvents query with parameterized SQL~~ → Implemented with Prisma.sql fragments
- ~~Story 1.2: Tie CreateEvent validation to typed payload schemas~~ → Implemented with schema refinement
- ~~Story 1.2: Add RLS/cross-org API coverage~~ → Integration tests added

### Story 1.3 (CRITICAL - from Story 1.2 deferral)
- **[HIGH] Story 1.3 MUST implement JWT-backed org/user verification** before any deployment. Current events API trusts x-user-id header without JWT binding, creating cross-tenant exposure risk. (services/core-api/src/middleware/orgContext.ts:52-99; services/core-api/src/routes/events.ts:15-58)
- **[MEDIUM] Story 1.3 should add auth spoof tests** to verify JWT binding prevents header spoofing (services/core-api/src/routes/events.test.ts)

### Story 1.4 (Resolved 2025-11-26)
- **[HIGH] Set org context before organization.upsert in organization.created webhook** to satisfy RLS and allow provisioning under non-superuser roles (services/core-api/src/routes/webhooks/clerk.ts:123-137; services/core-api/prisma/migrations/20251126093000_clerk_ids_text/migration.sql:45-58).
- **[MEDIUM] Enforce owner-only org settings updates** by checking membership role (MemberRole.owner) instead of trusting `orgRole` string; add negative test (services/core-api/src/routes/orgs.ts:100-166).
- **[LOW] Deduplicate/transactional provisioned event emission** to avoid duplicate `xentri.org.provisioned.v1` events on concurrent webhook replays (services/core-api/src/domain/orgs/OrgProvisioningService.ts:121-135).

### Story 1.6 (Resolved 2025-11-28)
- Strategy/Brief flows use authenticated Clerk org context; brief events emitted under RLS; readiness metrics recorded; failure UX with retry and co-pilot fallback added. E2E updated to require session cookie and org envs.

---

## Traceability Mapping

| AC# | Spec Section | Component(s) | Test Idea |
|-----|--------------|--------------|-----------|
| 1.1.1 | Bootstrap commands | `apps/shell`, `docker-compose` | E2E: fresh clone → dev server starts |
| 1.1.2 | Project Structure | All packages | Unit: directory structure matches spec |
| 1.1.3 | Data Models | Database, RLS policies | Integration: RLS enabled check |
| 1.1.5 | RLS Enforcement | Database | Integration: cross-org query returns 0 |
| 1.2.1 | Data Models (system_events) | Database | Unit: table schema validation |
| 1.2.2 | RLS Policy | Database | Integration: org isolation test |
| 1.2.3 | Event immutability | Database | Unit: UPDATE/DELETE blocked |
| 1.3.1-2 | Auth APIs | `core-api` | E2E: signup → shell redirect |
| 1.3.3 | Event Write Flow | `core-api`, events table | Integration: event logged on login |
| 1.4.1-3 | Signup Flow | `core-api`, triggers | Integration: org auto-created |
| 1.5.1-4 | Shell UX | `apps/shell`, `packages/ui` | E2E: sidebar behavior, theme toggle |
| 1.6.1-3 | End-to-end slice | All | E2E: signup → Brief → event visible |
| 1.7.1-4 | CI/CD, Observability | GitHub Actions, logging | CI: pipeline runs on PR |

---

## Risks, Assumptions, Open Questions

### Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| **R1:** RLS bypass creates data leak | Critical | Paranoid testing; fail-closed pattern; code review checklist |
| **R2:** Auth token leakage | High | HTTP-only cookies; short TTL; refresh rotation |
| **R3:** Event table grows unbounded | Medium | Partitioning strategy; archival policy (defer to v0.3) |
| **R4:** Apple Silicon Docker quirks | Low | Document env prerequisites; test on M1/M2 |

### Assumptions

| ID | Assumption |
|----|------------|
| **A1:** | Clerk Auth is sufficient for MVP (no custom auth server needed) |
| **A2:** | Single Postgres cluster handles MVP load (no read replicas yet) |
| **A3:** | Event throughput <1000/sec is sufficient for MVP |
| **A4:** | Mobile PWA is acceptable (no native app for v0.1) |

### Open Questions

| ID | Question | Owner | Decision |
|----|----------|-------|----------|
| **Q1:** | Which transactional email provider? | Backend | **Resend** — Modern API, React Email templates, great DX |
| **Q2:** | Redis hosting approach? | DevOps | **Upstash** — Pay-per-request (cheap at start), auto-scales to millions, zero ops |
| **Q3:** | How to handle OAuth callback state edge cases? | Backend | Document during Story 1.3 implementation |

---

## Test Strategy Summary

### Test Levels

| Level | Scope | Framework | Coverage Target |
|-------|-------|-----------|-----------------|
| **Unit** | Functions, utilities, schemas | Vitest | >70% for core modules |
| **Integration** | Database, RLS, API routes | Vitest + Postgres test container | All RLS policies |
| **E2E** | Full user flows | Playwright | Critical paths (signup, auth, shell nav) |

### Priority Test Cases

1. **RLS Isolation:** User A cannot read User B's events/data
2. **Signup Flow:** Email/password and OAuth both create org correctly
3. **Event Immutability:** Cannot UPDATE or DELETE events
4. **Shell Navigation:** Category switch preserves state, no reload
5. **Theme Persistence:** Light/dark toggle persists across sessions
6. **Cross-Org Smoke:** Seeded orgs are isolated; shell loads correctly

### Test Data Strategy

- **Unit:** Mock data, in-memory
- **Integration:** Test containers with seeded fixtures
- **E2E:** Fresh database per test run, factory functions for users/orgs
