# Xentri Architecture

> **Status:** Draft
> **Version:** 1.1.0
> **Last Updated:** 2025-11-26

## 1. Executive Summary

Xentri is a Modular Business OS that starts with a Strategy Co-pilot conversation generating a Universal Brief—the DNA of the business—which then orchestrates downstream modules (Website, CRM, Invoicing). The architecture employs a Turborepo monorepo with an Astro Shell hosting React micro-apps, Node.js microservices communicating via an event-driven "Nervous System" (Redis/n8n), and a multi-tenant Postgres database with Row-Level Security.

### Core Architectural Principles

| Principle | Description |
|-----------|-------------|
| **Decoupled Unity** | Unified Shell (Astro) for seamless UX; isolated Micro-Apps (React) and Microservices (Node.js) for technical independence |
| **Event-Driven Backbone** | Services communicate via immutable events through Redis/n8n—no direct coupling; new modules integrate without rewrites |
| **Multi-Tenancy by Design** | Single Postgres cluster with RLS enforces "Client Zero" data isolation from day one |
| **Reality-In Data** | Ingest messy inputs (voice, text) and progressively structure them—no rigid forms upfront |

---

## 2. High-Level Architecture

We employ a **Monorepo** structure managed by **Turborepo**.

### The Stack

| Layer | Technology | Role |
| :--- | :--- | :--- |
| **Shell** | **Astro** | The container application. Handles routing, auth, layout, and "Islands" orchestration. |
| **Micro-Apps** | **React** | Interactive capabilities (CRM, CMS, etc.) loaded as "Islands" within the Shell. |
| **Backend** | **Node.js** | Dockerized microservices for business logic (Sales, Finance, etc.). |
| **AI Service** | **Python** | Hosts the Co-pilot Swarm (Strategy, Brand, Sales agents). |
| **Data** | **Postgres** | Single cluster with **RLS** for multi-tenancy. |
| **Events** | **Redis** | The "Nervous System" transport layer for high-volume synchronization. |
| **Orchestration** | **n8n** | Self-hosted workflow engine for complex business logic and integrations. |

### Decision Summary Table

| Category | Decision | Version | Rationale |
| :--- | :--- | :--- | :--- |
| Shell | Astro shell with React islands | Astro 5.16.0 / React 19.2.0 | Hybrid SSR/SSG with island hydration; stable React ecosystem for micro-apps. |
| Monorepo Tooling | Turborepo + pnpm workspaces | Turbo 2.6.1 / pnpm 10.23.0 | Fast incremental builds and deterministic installs across apps/services/packages. |
| Backend Runtime & API | Node.js + Fastify REST APIs | Node 24.11.1 LTS / Fastify 5.6.2 | Current LTS for runtime security; schema-first, high-performance JSON APIs. |
| Database & ORM | Postgres with Prisma | Postgres 16.11 / Prisma 7.0.1 | Typed queries with RLS support; aligns with event log and multi-tenant policies. |
| AuthN/AuthZ | Clerk + JWT cookies | @clerk/fastify 3.x / @clerk/astro 1.x | Delegates identity with native Organizations support; email/OAuth/SSO; multi-tenant JWT claims (org_id, role) out of the box. |
| Billing/Subscriptions | Clerk Billing (Stripe-backed) | Clerk Billing 1.x | Unified auth+billing; subscriptions tied to Clerk Organizations; supports module-based pricing model. (v0.4 scope) |
| Events & Transport | Postgres `system_events` log + Upstash Redis Streams | Upstash Redis (managed) | Durable source-of-truth log with pay-per-request streaming; scales from zero to millions. |
| Orchestration | n8n (self-hosted) | n8n 1.121.2 | Visual workflows and retries; separates business logic from app code. |
| File/Object Storage | S3-compatible blobs (prod: AWS S3, local: MinIO) | MinIO 8.0.6 client (server RELEASE.2024-09-30) | Presigned uploads for media/assets; CDN-friendly and infra-portable. |
| Deployment Target | Managed Kubernetes | k8s 1.31.0 | Standardized runtime for services, HPA-ready, secrets and ingress consistency. |
| Observability | OpenTelemetry traces + Pino JSON logs to Loki/Grafana | OTel SDK 1.9.0 / Pino 10.1.0 | Trace propagation across shell/services; structured logs for debugging. |

Version check date: 2025-11-26 (re-verify with WebSearch before releases).

### Version Compatibility Notes

| Technology | Compatibility Consideration |
|------------|----------------------------|
| **Node 24.x → 26.x** | Watch for ESM-only changes in core modules; test `--experimental-*` flags before upgrade |
| **Prisma 7.x** | Breaking: new migration format from v6; run `prisma migrate diff` before upgrading existing DBs |
| **Astro 5.x → 6.x** | Island hydration API may change; audit `client:*` directives |
| **React 19.x** | Concurrent features stable; Actions API replaces some form patterns—audit form handlers |
| **Fastify 5.x** | Plugin API stable; watch for hook signature changes in minors |
| **Redis 8.x** | Streams API stable; ACL syntax changed from v7—update connection configs if upgrading |

**Upgrade Protocol:** Before any major version bump: (1) check release notes for breaking changes, (2) run full test suite in staging, (3) update `ts-schema` contracts if API shapes change.

### System Diagram

```mermaid
graph TD
    User[User Browser] -->|HTTPS| CDN[Edge Network]
    CDN -->|Serves| Shell[Astro App Shell]

    subgraph "Frontend (Browser)"
        Shell -->|Loads| Sidebar[Nano Store UI State]
        Shell -->|Lazy Loads| Brand[React Brand App]
        Shell -->|Lazy Loads| Sales[React Sales App]
    end

    subgraph "Backend (Kubernetes Cluster)"
        Brand -->|API JSON| APIG[API Gateway]
        Sales -->|API JSON| APIG
        
        APIG -->|Route: /api/brand| Svc1[Brand Service Node]
        APIG -->|Route: /api/sales| Svc2[Sales Service Node]
        APIG -->|Route: /api/ai| Svc3[AI Co-pilot Service Python]
    end

    subgraph "The Nervous System (Async)"
        Svc3 -->|Event: xentri.brief.updated| Redis[Redis Streams]
        Redis -->|Transport| N8N[n8n Workflow Engine]
        N8N -->|Trigger| Svc1
        N8N -->|Trigger| Svc2
    end
```

---

## 3. Architecture Decision Records (ADRs)

### ADR-001: Universal Brief Orchestration (Knowledge Hierarchy)

**Context:** How do we ensure the "Universal Brief" effectively powers diverse downstream modules without creating a tight coupling or a "god object"?

**Decision:** We adopt a **Knowledge Hierarchy** pattern.
1.  **Universal Brief:** The shared source of truth (Identity, Offerings, Goals). Accessible by all Category Agents.
2.  **Category Context:** Domain-specific rules derived from the Brief (e.g., Brand Voice, Sales Pipeline). Managed by Category Agents.
3.  **Module Context:** Specific configurations (e.g., Website Pages, Quote Templates). Managed by Subagents.

**Implication:** Agents must first consult the Universal Brief, then their Category Context, before taking action.

### ADR-002: Event Envelope & Schema

**Context:** To prevent the "Nervous System" from becoming a swamp of untyped JSON, we need a strict event contract.

**Decision:** We enforce a strict `SystemEvent` envelope with namespaced types, versioning, and PII hygiene.

```typescript
type ISO8601 = string;

interface SystemEvent<TPayload = unknown> {
  id: string;                        // UUID (immutable)
  type: string;                      // e.g., "xentri.brief.updated"
  occurred_at: ISO8601;              // Business time
  
  org_id: string;                    // Tenant Context
  actor: { 
    type: "user" | "system" | "job"; 
    id: string 
  };

  envelope_version: "1.0";
  payload_schema: string;            // e.g., "brief.updated@2.1"
  payload: TPayload;                 // The facts, not the full DB dump

  // Reliability & Tracing
  dedupe_key?: string;               // Idempotency key
  correlation_id?: string;           // Workflow/Thread ID
  trace_id?: string;                 // Distributed Trace ID

  meta: {
    source: string;                  // e.g., "strategy-co-pilot"
    environment?: "local" | "staging" | "prod";
  };
}
```

**Implication:** All services must use the shared `packages/ts-schema` to validate events before emitting.

### ADR-003: Multi-Tenant Security (RLS & Context)

**Context:** We must ensure strict data isolation between organizations in a shared database.

**Decision:** We use **Postgres Row-Level Security (RLS)** with a **Fail-Closed** transaction pattern.

1.  **Transport:** Client sends `x-org-id` header.
2.  **Gate:** Middleware verifies `user_id` (from JWT) is a member of `x-org-id`. Rejects if false.
3.  **Transaction:** Service executes `SELECT set_config('app.current_org_id', $1, true)` at the start of the transaction. The `true` flag ensures the setting is **transaction-scoped** (equivalent to `SET LOCAL`), preventing connection pool leakage.
4.  **Enforcement:** RLS policies explicitly check for the presence of the variable and fail closed if missing.

```sql
-- Example Policy (Fail Closed)
CREATE POLICY tenant_isolation ON some_table
USING (
  current_setting('app.current_org_id', true) IS NOT NULL
  AND org_id = current_setting('app.current_org_id', true)::uuid
);
```

### ADR-004: Railway Bootstrap Deployment Strategy

**Context:** The architecture specifies Kubernetes as the deployment target, but K8s setup requires 40-80 hours of work before shipping any product value. We need a strategy that balances immediate velocity with long-term scalability.

**Decision:** We adopt a **Bridge Strategy**: deploy to Railway (PaaS) for bootstrapping, migrate to Kubernetes when triggered by spend ($500/mo) or compliance requirements.

**Key Constraints:**
1. **Docker-first:** All services deployed via standard `Dockerfile`, explicitly rejecting Nixpacks. Containers are cloud-portable from day one.
2. **Redis with Volume:** Railway Redis requires attached volume for Streams persistence. Pin version ≥5.0 for Streams invariants.
3. **n8n Queue Mode:** Deploy with separate main + worker services; `N8N_ENCRYPTION_KEY` is a "crown jewel" requiring secure backup.
4. **Config as Code:** All settings in `railway.toml` files—no clickops drift.

**Migration Triggers:**
- Monthly spend > $500
- Compliance requirement (SOC2, GDPR DPA)
- First paying customer (Redis HA becomes critical)
- Any written SLA commitment

**Artifacts:**
- Full decision record: `docs/architecture/adr-004-railway-bootstrap.md`
- Deployment guide: `docs/deployment-plan.md`
- K8s migration runbook: `docs/k8s-migration-runbook.md`

**Implication:** Story 1.7 (DevOps) references these artifacts. K8s migration is a bounded project with IaC (Terraform + Helm), not ongoing hero work.

---

## 4. Project Structure

```text
/xentri
├── /apps/shell              # Astro Shell with React islands
├── /packages
│   ├── /ui                  # Shared Design System
│   └── /ts-schema           # Shared Types, Zod Schemas, Events
├── /services/core-api       # Fastify: Auth, Events, Orgs
└── /docs                    # Hierarchical documentation
```

Future services (brand-engine, sales-engine, ai-service, n8n-host) follow the same pattern.

### Contract Source of Truth

All shared types live in `packages/ts-schema`:
- `api.ts` — API envelope and Problem Details
- `auth.ts` — User and service JWT claims
- `events.ts` — Event envelope and actor/meta

CI runs `tsc` against these definitions to prevent drift.

---

## 5. Deployment & Environments

### Deployment Target
- **Target:** Managed Kubernetes v1.31.0 (GKE/EKS/AKS) with NGINX Ingress, cert-manager (ACME), ExternalDNS, and ExternalSecrets for vault-backed creds.
- **Services:** Each service as a Deployment + HPA (min 2 replicas prod), ConfigMaps for non-secret config, Secrets for JWT keys/webhooks, and dedicated Postgres/Redis managed services.
- **Networking:** Ingress per app domain (`app.xentri.app`, `api.xentri.app`, `n8n.xentri.app`), TLS via cert-manager, service-to-service auth via signed JWT and network policies.

### Environment Plan
- **Local (docker compose):** Postgres 16.11, Redis 8.4.0, n8n 1.121.2, MinIO (S3-compatible). Clerk Auth via hosted project (no local container needed). Command: `docker compose up -d postgres redis n8n minio`.
- **Staging (k8s 1.31):** Managed Postgres (RDS/CloudSQL), managed Redis (ElastiCache/MemoryStore), n8n as k8s Deployment with PVC, MinIO optional (prefer cloud blob). 1-2 replicas per service with HPA, metrics/alerts wired.
- **Production (k8s 1.31):** Same as staging with multi-AZ Postgres/Redis, HPA min 2, PodDisruptionBudgets, and regional buckets/CDN for assets.

### Project Initialization (from scratch, no starter template)
- **Package manager:** pnpm 10.23.0 (via Corepack).
- **Starter:** From scratch (Turborepo + pnpm). Search term for verification: "create turbo pnpm monorepo".
- **Bootstrap commands:**

```bash
# Enable workspace tooling
corepack enable

# Install workspace deps
pnpm install

# Start data plane locally
docker compose up -d postgres redis n8n minio

# Dev servers (run in parallel shells)
pnpm run dev --filter apps/shell
pnpm run dev --filter services/core-api
pnpm run dev --filter packages/ui -- --watch
```

---

## 6. Implementation Patterns

### A. The "Shared Contract"
All data shapes (API responses, Event payloads, DB models) are defined in `/packages/ts-schema`.
*   **Rule:** No service "guesses" the shape of data.
*   **Workflow:** Change DB Schema -> Update `ts-schema` -> Update Service.

### B. Frontend "Islands"
We use Astro's Island Architecture to lazy-load React apps.
*   **Shell:** Handles the "Frame" (Sidebar, Header, Auth).
*   **Navigation:** Hovering a sidebar item pre-fetches the React bundle.
*   **Mounting:** Clicking mounts the React app into the content area.
*   **State:** `Nano Stores` are used for cross-island communication (e.g., a "New Lead" toast triggered by the CRM island).

### C. The "Nervous System" Flow
1.  **Emit:** Service A emits `xentri.lead.created` to Redis.
2.  **Process:** `n8n` subscribes to the event.
3.  **Orchestrate:** `n8n` executes logic (e.g., "If high value, Slack the CEO").
4.  **React:** `n8n` may call Service B (CRM) to update a record.

### D. API & Error Conventions
- **Protocol:** JSON REST over HTTPS; versioned prefix `/api/v1`.
- **Shape:** Envelope with `data`, `error`, `meta` (cursor/paging). Dates in ISO8601 UTC.
- **Errors:** HTTP Problem Details (`application/problem+json`) with `type`, `title`, `status`, `detail`, `trace_id`.
- **Auth:** JWT (Clerk) in HTTP-only cookie via `@clerk/fastify` middleware; services accept `Authorization: Bearer` for service-to-service calls. Org context from JWT `org_id` claim; `x-org-id` header optional for org-switching.
- **Idempotency:** For mutating endpoints that can retry, require `Idempotency-Key` header and persist to dedupe.

### E. Auth Patterns
- **User Auth:** Clerk for sign-in/up with native Organizations support. Access token includes `sub`, `org_id`, `org_role`, `org_permissions`. Session managed via Clerk SDK.
- **Social OAuth:** Multiple providers supported via Clerk (Google, Apple, Microsoft, etc.). Adding providers is a dashboard configuration, not code change. MVP: Google + Apple.
- **Service Auth:** Signed JWT with short TTL; verified per service; propagate `trace_id` and `org_id`.
- **Org Scoping:** Middleware extracts `org_id` from Clerk JWT claims (set when user selects active organization); RLS enforces at DB. Header `x-org-id` used only for org-switching validation.

### F. Naming & Location Patterns
- **API routes:** `/api/v1/{service}/{resource}` (plural nouns). Example: `/api/v1/brand/sites`.
- **Events:** `xentri.{boundedContext}.{action}.{version}` e.g., `xentri.brief.updated.v1`.
- **Database tables:** `snake_case`, always include `org_id`, `id` UUID primary key, `created_at`, `updated_at`.
- **Files:** 
  - Apps: `apps/shell/src/routes/...`, `apps/shell/src/components/...`
  - Services: `services/{svc}/src/routes`, `services/{svc}/src/domain`, `services/{svc}/src/infra`
  - Shared: `packages/ts-schema/src`, `packages/ui/src`, utilities in `packages/lib/src`
- **Tests:** Co-locate as `__tests__` or `*.test.ts` next to source.

### G. Lifecycle Patterns
- **Loading/Error UX:** Skeletons for primary content; inline errors with retry; toast only for non-blocking notices.
- **Retries:** Client retries idempotent GETs with backoff; mutations rely on server idempotency keys.
- **Background Jobs:** n8n flows must be idempotent; retries with exponential backoff; dead-letter to `redis:stream:dlq`.

---

## 7. Cross-Cutting Concerns

*   **Authentication:** Clerk with native Organizations. Unified user identity across all services; org membership and roles managed by Clerk.
*   **Logging:** Centralized structured logging (JSON) with `trace_id` propagation.
*   **Error Handling:** Standardized error responses (Problem Details for HTTP APIs).
*   **Testing:**
    *   Unit Tests: Jest/Vitest per package.
    *   E2E Tests: Playwright running against the full docker-compose stack.
*   **Caching:** 
    *   API: HTTP cache-control for GETs; CDN for public assets; service-layer Redis for hot data with TTL.
    *   Invalidation: Event-driven (Redis Stream) to bust projections; explicit cache tags per resource type.
*   **Object Storage:** S3/MinIO for assets; presigned PUT/GET; store only keys/metadata in DB.
*   **Performance Budgets:** p75 FMP < 2s on 3G for shell; API p95 < 300ms for reads, < 600ms for writes; background jobs complete < 30s or enqueue follow-up.
*   **Observability:** OpenTelemetry traces across shell/services; logs to Loki/Grafana; metrics via Prometheus; `trace_id` propagated through API and events.
*   **n8n Reliability:** Workers run with queue-backed execution; retry with backoff (3 attempts), DLQ to Redis stream `n8n:dlq`; flows must be idempotent and check org context.
*   **Cache/Invalidation Map:**
    *   Brief: key `brief:{org_id}` in Redis; invalidated on `xentri.brief.updated.v1`; projections downstream rehydrate.
    *   Site: key `site:{org_id}:{site_id}` and CDN path `/sites/{site_id}`; purge on `xentri.website.published.v1` or `xentri.page.updated.v1`.
    *   Leads: key `leads:list:{org_id}` with cursor; bust on `xentri.lead.created.v1` and `xentri.lead.updated.v1`; entity cache `lead:{org_id}:{lead_id}` updated in write path.

---

## 8. Deployment & Operations

> **Current Stack:** Railway (PaaS) — See [ADR-004](./architecture/adr-004-railway-bootstrap.md) for rationale
> **Live API:** https://core-api-production-8016.up.railway.app

### Deployment Architecture

```
┌─────────────────── RAILWAY PROJECT ───────────────────┐
│  Shell (Astro)  │  Core API (Fastify)  │  n8n (Queue) │
│     :4321       │       :3000          │    :5678     │
├───────────────────────────────────────────────────────┤
│        PostgreSQL 16.x      │      Redis 7.x         │
└───────────────────────────────────────────────────────┘
         ↓                              ↓
   Cloudflare R2              Clerk (Auth)
   (File Storage)             (OAuth + Sessions)
```

### Key Constraints

| Constraint | Rationale |
|------------|-----------|
| **Docker-first** | All services via Dockerfile—no Nixpacks. Ensures K8s portability. |
| **Redis with Volume** | Streams require persistence. Pin version ≥7.x. |
| **n8n Queue Mode** | Separate main + worker services. `N8N_ENCRYPTION_KEY` is crown jewel. |

### Migration Triggers (Railway → K8s)

- Monthly spend > $500
- Compliance requirement (SOC2, GDPR DPA)
- First paying customer (Redis HA becomes critical)
- Any written SLA commitment

### Testing Strategy

| Category | Framework | Scope | Threshold |
|----------|-----------|-------|-----------|
| **Unit** | Vitest | Pure functions, schemas, utils | 70% coverage |
| **Integration** | Vitest + Testcontainers | DB operations, RLS, API routes | Per-module |
| **Smoke** | Custom (`scripts/smoke-test.ts`) | RLS isolation, event immutability, health | CI gate |
| **E2E** | Playwright (planned) | Full user flows | Future |

**Coverage scope:** `src/lib/**`, `src/middleware/**`, `src/routes/health.ts`. Domain/infra excluded until integration tests mature.

### Observability

| Capability | Implementation |
|------------|----------------|
| **Logging** | Pino JSON with `trace_id`, `org_id`, `user_id`; PII scrubbed |
| **Tracing** | OpenTelemetry auto-instrumentation; `traceparent` header propagation |
| **Errors** | Sentry when `SENTRY_DSN` set; scrubbed headers |
| **Metrics** | `GET /api/v1/metrics` — process uptime, memory, load (CI-only) |

### Health Endpoints

| Endpoint | Purpose |
|----------|---------|
| `GET /health` | Liveness — returns `{"status":"ok"}` |
| `GET /health/ready` | Readiness — includes DB ping |
| `GET /api/v1/metrics` | Process metrics (no auth) |

### Incident Severity

| Level | Response Time | Example |
|-------|---------------|---------|
| **P1** | < 15 min | Service down, data loss |
| **P2** | < 1 hour | Degraded performance |
| **P3** | < 4 hours | Feature broken, workaround exists |
| **P4** | < 24 hours | Minor bug, cosmetic |

### Quick Troubleshooting

```bash
# Check API logs
railway logs --service core-api

# Test DB connection
railway run --service core-api -- npx prisma db pull

# Rollback deployment
railway rollback --deployment <id>
```

---

## 9. Operational Model: Solo Visionary + AI Agent Army

### Development Philosophy

This project is built using **AI-first development** via the BMAD Method. One human visionary (Carlo) directs an army of AI agents who handle implementation. No corners are cut—the architecture is production-grade.

### Why This Architecture Suits AI-First Development

| Architectural Choice | AI Agent Benefit |
|---------------------|------------------|
| **Service boundaries** | Agents work on isolated services without merge conflicts or cross-contamination |
| **`ts-schema` contracts** | Explicit types prevent agents from "guessing" data shapes—compile-time enforcement |
| **Event-driven communication** | Services don't call each other directly—agents can't introduce tight coupling |
| **ADRs with implications** | Agents have clear guidance on architectural intent, not just "what" but "why" |
| **Naming conventions** | Deterministic patterns mean agents produce consistent code across sessions |
| **Co-located tests** | Agents can write and run tests in the same context as the code they're modifying |

### Supervisor Responsibilities (Human)

| Area | Responsibility |
|------|----------------|
| **Vision & Strategy** | Define product direction, prioritize epics, approve PRD/architecture changes |
| **Quality Gates** | Review AI-generated code before merge; run validation workflows |
| **Architectural Decisions** | Make trade-off decisions when agents surface options; approve ADR changes |
| **Security Review** | Audit auth flows, RLS policies, and secrets handling before production |
| **External Integrations** | Configure third-party services (Clerk, cloud providers, payment processors) |
| **Production Operations** | Monitor alerts, handle incidents, approve deployments |

### AI Agent Boundaries

| Scope | Agents Can Independently | Requires Human Review |
|-------|-------------------------|----------------------|
| **Feature implementation** | Write code following established patterns | New patterns or architectural changes |
| **Tests** | Write unit/integration tests, fix failing tests | E2E test strategy changes |
| **Bug fixes** | Fix bugs within existing service boundaries | Fixes requiring cross-service changes |
| **Documentation** | Update inline docs, README sections | Architecture docs, ADRs |
| **Refactoring** | Refactor within a service following conventions | Refactors affecting `ts-schema` contracts |
| **Dependencies** | Update patch versions | Major version upgrades (see compatibility notes) |

### Human Escalation Triggers

Bring in a human specialist (contractor) when:

- **Security audit** — Before first production deployment and annually thereafter
- **Compliance requirements** — GDPR, SOC2, or region-specific regulations (CFDI for Mexico)
- **Performance crisis** — If p95 latencies exceed budgets and AI agents can't diagnose
- **Infrastructure migration** — Moving between cloud providers or major k8s upgrades
- **Legal/financial integrations** — Payment processors, tax APIs, legal document generation

### Scaling Triggers

| Trigger | Action |
|---------|--------|
| **> 100 concurrent users** | Increase HPA min replicas; review Redis connection pooling |
| **> 1,000 orgs** | Consider Postgres read replicas; review RLS policy performance |
| **> 10,000 events/hour** | Scale Redis cluster; add n8n worker pods |
| **Revenue > $10k MRR** | Security audit; consider managed k8s support contract |
| **Adding regulated features** | Engage compliance consultant before implementation |

---

## 10. State Machines for Complex Flows

### Brief Generation Flow

```mermaid
stateDiagram-v2
    [*] --> Initiated: User starts Strategy Co-pilot
    Initiated --> Conversing: Co-pilot asks questions
    Conversing --> Conversing: User answers, Co-pilot refines
    Conversing --> Drafting: User confirms ready
    Drafting --> ReviewPending: AI generates Brief draft
    ReviewPending --> Editing: User requests changes
    Editing --> ReviewPending: User re-submits
    ReviewPending --> Approved: User approves Brief
    Approved --> [*]: xentri.brief.created.v1 emitted
```

**States:**
- `Initiated` — Session started, no data yet
- `Conversing` — Multi-turn Q&A active
- `Drafting` — AI processing, generating sections
- `ReviewPending` — Draft complete, awaiting user review
- `Editing` — User making manual edits
- `Approved` — Final, triggers downstream modules

### Lead Lifecycle Flow

```mermaid
stateDiagram-v2
    [*] --> New: Lead captured (form, import, manual)
    New --> Contacted: First outreach logged
    Contacted --> Qualified: Meets ICP criteria
    Contacted --> Disqualified: Does not fit
    Qualified --> Proposal: Quote/proposal sent
    Proposal --> Won: Deal closed
    Proposal --> Lost: Deal rejected
    Won --> [*]: xentri.deal.won.v1
    Lost --> [*]: xentri.deal.lost.v1
    Disqualified --> [*]: xentri.lead.disqualified.v1
```

**States:**
- `New` — Just captured, no contact yet
- `Contacted` — At least one outreach attempt
- `Qualified` — Confirmed as viable opportunity
- `Disqualified` — Removed from pipeline
- `Proposal` — Active deal negotiation
- `Won/Lost` — Terminal states

### Website Publish Flow

```mermaid
stateDiagram-v2
    [*] --> Draft: Page created/edited
    Draft --> Preview: User requests preview
    Preview --> Draft: User continues editing
    Preview --> Publishing: User clicks Publish
    Publishing --> Live: Build succeeds
    Publishing --> Failed: Build error
    Failed --> Draft: User fixes issues
    Live --> Draft: User edits published page
    Live --> [*]: xentri.website.published.v1
```

**States:**
- `Draft` — Content being edited, not visible publicly
- `Preview` — Rendered for review, not live
- `Publishing` — Build/deploy in progress
- `Live` — Publicly accessible
- `Failed` — Build error, needs intervention

---

## 11. Module Composition Strategy & Roadmap

> **Decision:** [ADR-005 (SPA + Copilot First)](./architecture/adr-005-spa-copilot-first.md)
> **Date:** 2025-11-28

This section is the **single source of truth** for understanding how Xentri's modules are organized, sequenced, and built. Any team member from any module can reference this to understand the high-level platform vision.

### The SPA + Copilot First Strategy

Before building any secondary modules, each category MUST have:

1. **Category SPA** — The primary React micro-app for that domain
2. **Category Copilot** — The AI agent specialized for that domain

### The Foundational Modules

| # | Category | Module | Type | Status | Package/Target |
|---|----------|--------|------|--------|----------------|
| 1 | Platform | **shell** | SPA | **Done** | `apps/shell` |
| 2 | Platform | **core-api** | Backend | **Done** | `services/core-api` |
| 3 | Platform | **ts-schema** | Contracts | **Done** | `packages/ts-schema` |
| 4 | Platform | **ui** | Components | **Done** | `packages/ui` |
| 5 | Strategy | **strategy-app** | SPA | Planned | Epic 2 |
| 6 | Strategy | **strategy-copilot** | Copilot | Planned | Epic 2 |
| 7 | Finance | **finance-app** | SPA | Planned | Epic 3 |
| 8 | Finance | **finance-copilot** | Copilot | Planned | Epic 3 |
| 9 | Brand | **brand-app** | SPA | Planned | Epic 4 |
| 10 | Brand | **brand-copilot** | Copilot | Planned | Epic 4 |
| 11 | Sales | **sales-app** | SPA | Future | TBD |
| 12 | Sales | **sales-copilot** | Copilot | Future | TBD |
| 13 | Operations | **operations-app** | SPA | Future | TBD |
| 14 | Operations | **operations-copilot** | Copilot | Future | TBD |
| 15 | Team | **team-app** | SPA | Future | TBD |
| 16 | Team | **team-copilot** | Copilot | Future | TBD |
| 17 | Legal | **legal-app** | SPA | Future | TBD |
| 18 | Legal | **legal-copilot** | Copilot | Future | TBD |

### Build Sequence

```
Phase 1: Platform (COMPLETE)
├── shell ✅
├── core-api ✅
├── ts-schema ✅
└── ui ✅

Phase 2: Strategy (NEXT)
├── strategy-app
└── strategy-copilot

Phase 3: Finance
├── finance-app
└── finance-copilot

Phase 4: Brand
├── brand-app
└── brand-copilot

Phase 5+: Sales → Operations → Team → Legal
```

### Category Dependency Graph

```mermaid
graph LR
    subgraph "Foundation"
        P[Platform]
    end

    subgraph "Core Value"
        S[Strategy]
        F[Finance]
        B[Brand]
    end

    subgraph "Growth"
        Sa[Sales]
        O[Operations]
    end

    subgraph "Scale"
        T[Team]
        L[Legal]
    end

    P --> S
    S --> F
    S --> B
    F --> Sa
    B --> Sa
    Sa --> O
    O --> T
    T --> L
```

### Why This Sequence?

| Category | Rationale |
|----------|-----------|
| **Strategy** | Universal Brief is the DNA—all other categories read from it |
| **Finance** | Revenue capture (invoicing) proves immediate value and validates event backbone |
| **Brand** | Visible output (website) users can show to others |
| **Sales** | Connects leads → quotes → invoices (depends on Finance + Brand) |
| **Operations** | Job/project management builds on Sales + Finance data |
| **Team** | HR and roles require established org structure |
| **Legal** | Contracts and compliance—lowest urgency for beachhead segments |

### Module Capabilities Summary

| Category | SPA Features | Copilot Capabilities |
|----------|--------------|---------------------|
| **Strategy** | Universal Brief editor, Goals/OKRs, War Room, Decision log | Brief generation, Goal recommendations, Strategic analysis |
| **Finance** | Invoicing, Payment tracking, Expenses, Reports | Revenue analysis, Overdue flagging, Pricing suggestions |
| **Brand** | Website builder, CMS, Lead capture, SEO | Copy generation, Content suggestions, Brand voice |
| **Sales** | CRM, Quote builder, Pipeline, Follow-ups | Lead qualification, Follow-up drafting, Deal recommendations |
| **Operations** | Jobs/Projects, Scheduling, Resources, Delivery | Workflow optimization, Scheduling, Bottleneck detection |
| **Team** | Roles, Permissions, SOPs, Onboarding | Role recommendations, SOP generation, Training suggestions |
| **Legal** | Contracts, Compliance, Licenses, Policies | Contract review, Compliance checks, Risk flagging |

### Secondary Modules

Once a category's SPA + Copilot are complete, secondary modules can be built:

| Category | Example Secondary Modules |
|----------|--------------------------|
| Strategy | North Star tracker, Idea inbox, Decision journal |
| Finance | Tax pack export, Recurring invoices, Multi-currency |
| Brand | Email campaigns, Social scheduler, Reputation manager |
| Sales | WhatsApp bridge, Quote templates, Win/loss analysis |
| Operations | Calendar sync, Dispatch view, Quality checklists |
| Team | Payroll integration, Time tracking, Performance reviews |
| Legal | E-signatures, Compliance calendar, Document templates |

**Rule:** No secondary module can be built until its category's SPA + Copilot pass the [Definition of Done](./architecture/adr-005-spa-copilot-first.md#definition-of-done).

### Integration Patterns

**SPA Integration** — Each Category SPA integrates with the shell via island hydration:

```typescript
// apps/shell/src/pages/strategy/index.astro
---
import StrategyApp from '@xentri/strategy-app';
---
<StrategyApp client:load orgId={orgId} />
```

**Copilot Registration** — Each Category Copilot is registered in the AI service:

```json
{
  "strategy_copilot": {
    "system_prompt": "You are the Strategy Co-pilot...",
    "tools": ["read_brief", "update_brief", "recommend_modules"],
    "model": "gpt-4o",
    "context_scope": ["universal_brief", "strategy_context"]
  }
}
```

### Progress Tracking

- **[Pulse](../../pulse.md)** — Cross-team coordination and system-wide status
- **[Sprint Status](./sprint-artifacts/sprint-status.yaml)** — Epic-level tracking
- **GitHub Issues** — Story-level tracking with `cross-module` label

### How to Propose New Modules

1. **Check category readiness** — Is the SPA + Copilot complete?
2. **Create GitHub Issue** — Use the cross-module request template
3. **Link to Brief/PRD** — How does this serve the product vision?
4. **Estimate dependencies** — What other modules does it need?
5. **Get approval** — ADR required for new foundational modules

See [ADR-005](./architecture/adr-005-spa-copilot-first.md) for full rationale and Definition of Done criteria.

---

## 12. Future Considerations

*   **Secondary Geo Expansion:** Architecture supports adding region-specific compliance modules (e.g., `finance-engine-mx` for CFDI) without altering the core `finance-engine`.
*   **Mobile App:** The API-first design allows a future React Native app to consume the same microservices.
