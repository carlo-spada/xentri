# Xentri Architecture

> **Status:** Draft
> **Version:** 2.0.0
> **Last Updated:** 2025-11-30

## 1. Executive Summary

Xentri is a **Fractal Business Operating System** orchestrated by a hierarchical network of autonomous AI agents. It starts with a Strategy Co-pilot conversation generating a Strategy Brief (the DNA of the business), which then guides downstream agents (Marketing, Sales, Finance) who manage their own specialized categories, sub-categories and individual modules/tools. The architecture employs a Turborepo monorepo with an Astro Shell at the core, hosting React SPAs, and a **Hybrid Backend** (Node.js for Tools, Python for Agents, to start with).

### Core Architectural Principles

| Principle | Description |
|-----------|-------------|
| **Decoupled Unity** | Eg. Unified Shell (Astro) for seamless UX; isolated Micro-Apps (React), Tool Services (Node.js), and Agent Services (Python) for technical independence |
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
| **Agent Layer** | **Python** | **Reasoning & Intelligence.** Powers the ~42 complex Agents (7 Category Co-pilots + 35 Sub-Category Agents). |
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

1. **Universal Brief:** The shared source of truth (Identity, Offerings, Goals). Accessible by all Category Agents.
2. **Category Context:** Domain-specific rules derived from the Brief (e.g., Brand Voice, Sales Pipeline). Managed by Category Agents.
3. **Module Context:** Specific configurations (e.g., Website Pages, Quote Templates). Managed by Subagents.

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

1. **Transport:** Client sends `x-org-id` header.
2. **Gate:** Middleware verifies `user_id` (from JWT) is a member of `x-org-id`. Rejects if false.
3. **Transaction:** Service executes `SELECT set_config('app.current_org_id', $1, true)` at the start of the transaction. The `true` flag ensures the setting is **transaction-scoped** (equivalent to `SET LOCAL`), preventing connection pool leakage.
4. **Enforcement:** RLS policies explicitly check for the presence of the variable and fail closed if missing.

```sql
-- Example Policy (Fail Closed)
CREATE POLICY tenant_isolation ON some_table
USING (
  current_setting('app.current_org_id', true) IS NOT NULL
  AND org_id = current_setting('app.current_org_id', true)::uuid
);
```

### ADR-008: Python for Agent Layer

**Context:** The Module Matrix revealed 175 modules. ~130 are standard business tools (CRUD, Lists, Forms), while ~42 are complex AI agents (Category + Sub-Category levels). Using Python for everything kills frontend velocity (no shared types). Using Node for everything kills AI velocity (inferior LLM/Data libs).

**Decision:** We introduce a dedicated **Python Agent Layer** for all complex AI agents.

* **Scope:** Heavy Reasoning, LLM Chains, Data Science, Complex Agents.
* **Why:** Native home of AI (LangChain, PyTorch, Pandas).
* **Example:** `Strategy Co-pilot` (Category), `Soul Agent` (Sub-Category), `Negotiator`.

**Implication:** This creates a clear boundary between business logic (Node.js) and AI logic (Python), allowing each to leverage its ecosystem strengths. Communication between layers is strictly via the "Nervous System" (Redis Streams) and defined API contracts.

### ADR-006: Tri-State Memory Architecture

**Context:** "Context Window" is expensive and ephemeral. Agents need long-term memory that mimics human recall (Facts, Experiences, Persona).

**Decision:** We implement a **Tri-State Memory System**:

1. **Semantic Memory (The Brief):**
    * **What:** Structured facts about the business (Identity, Offerings, Goals).
    * **Storage:** Postgres (JSONB) + Redis Cache.
    * **Access:** Read-Heavy. Every Agent reads this before acting.

2. **Episodic Memory (The Journal):**
    * **What:** Time-series log of *what happened* (decisions, outcomes, conversations).
    * **Storage:** Vector Database (pgvector).
    * **Access:** Search-Heavy. "Have I dealt with this client before?"

3. **Synthetic Memory (The Persona):**
    * **What:** Compressed "Wisdom" derived from episodes.
    * **Storage:** System Prompt (Text).
    * **Access:** Load-Heavy. Injected into every LLM context.

**Implication:** We need a background "Dreaming" process (Python) that runs nightly to compress Episodes into Synthetic Memory (e.g., "Client X prefers email over phone").

### ADR-007: Federated Soul Registry

**Context:** We have 42 Agents. Managing 42 separate system prompts is impossible.

**Decision:** We use a **Federated Prompt Composition** strategy.

* **Layer 1: The Global Soul (DNA):** Universal values (Calm, Clarity, Truth). Shared by ALL agents.
* **Layer 2: The Category Context:** Domain expertise (e.g., "I am a Strategist"). Shared by Category Agents.
* **Layer 3: The Agent Role:** Specific job (e.g., "I analyze KPIs"). Unique to the Agent.

**Composition:** `Final Prompt = Global Soul + Category Context + Agent Role + Universal Brief`.

---

### ADR-004: Kubernetes First (The "Category Cluster" Strategy)

**Context:** We currently have ~42 Agents and ~130 Tools planned. Deploying them as ~175 separate services on a PaaS (Railway) is cost-prohibitive and unmanageable.

**Decision:** We deploy to **Managed Kubernetes** (e.g., GKE) from Day 1.

**Topology: The "Category Consolidation" Pattern**
Instead of 175 microservices, we group workloads by **Category** to balance isolation with management overhead.

1. **Agent Plane (Python):** **7 Deployments** (1 per Category).
    * Each Pod hosts the **Category Co-pilot** + its **5 Sub-Category Agents**.
    * *Example:* `svc-agent-strategy` runs `StrategyCoPilot`, `SoulAgent`, `PulseAgent`, etc.
    * *Scale:* 1 Replica per Category (Vertical Scaling).

2. **Tool Plane (Node.js):** **7 Deployments** (1 per Category).
    * Each Pod hosts the **API endpoints** for that Category's 5 Sub-categories.
    * *Example:* `svc-tool-finance` handles Invoicing, Ledger, Payroll APIs.
    * *Scale:* Horizontal Scaling (HPA) based on traffic.

3. **Frontend Plane:**
    * **Shell:** 1 Deployment (Astro SSR).
    * **Micro-Apps:** Served as static assets via Nginx/CDN.

**Total Services:** ~15 (7 Agents + 7 Tools + 1 Shell).
**Infrastructure Cost:** ~$40-80/mo (3 Nodes).

**Implication:** We need a Helm Chart template that can be instantiated 7 times.

---

## 4. Project Structure

```text
/xentri
├── /apps/shell              # Astro Shell (The Container)
├── /packages
│   ├── /ui                  # Shared React Components
│   └── /ts-schema           # Shared Types (Events, API)
├── /services
│   ├── /core-api            # Node.js: Auth, Orgs, Billing
│   ├── /strategy-copilot    # [NEW] Python: Strategy Agent
│   └── /brand-copilot       # [NEW] Python: Brand Agent
└── /docs                    # Documentation
```

Future services (brand-engine, sales-engine, ai-service, n8n-host) follow the same pattern.

### Contract Source of Truth

All shared types live in `packages/ts-schema`:

* `api.ts` — API envelope and Problem Details
* `auth.ts` — User and service JWT claims
* `events.ts` — Event envelope and actor/meta

CI runs `tsc` against these definitions to prevent drift.

---

## 5. Infrastructure & Operations

### Deployment Architecture (Kubernetes)

We use a **Category-Based Topology** to manage the 175+ modules efficiently.

```mermaid
graph TD
    User -->|HTTPS| Ingress[NGINX Ingress]
    
    subgraph "K8s Cluster (3 Nodes)"
        Ingress --> Shell[Astro Shell]
        
        subgraph "Strategy Category"
            Ingress -->|/api/strategy| ToolStrat[Node: Tool Service]
            ToolStrat -.->|Events| Redis
            Redis -.->|Trigger| AgentStrat[Python: Agent Service]
        end
        
        subgraph "Finance Category"
            Ingress -->|/api/finance| ToolFin[Node: Tool Service]
            ToolFin -.->|Events| Redis
            Redis -.->|Trigger| AgentFin[Python: Agent Service]
        end
        
        subgraph "Shared Infra"
            Redis[Redis Streams]
            Postgres[Postgres RLS]
        end
    end
```

### Service Map

| Service Name | Runtime | Scope | Replicas |
| :--- | :--- | :--- | :--- |
| `shell` | Node/Astro | Global UI Container | 2 (HPA) |
| `svc-tool-strategy` | Node.js | Strategy Tools (Mission, KPIs, OKRs) | 2 (HPA) |
| `svc-agent-strategy` | Python | Strategy Agents (Co-pilot, Soul, Pulse) | 1 (Vertical) |
| `svc-tool-finance` | Node.js | Finance Tools (Invoices, Ledger) | 2 (HPA) |
| `svc-agent-finance` | Python | Finance Agents (CFO, Auditor) | 1 (Vertical) |
| ... (Repeat for all 7 Categories) | | | |

### Deployment Target (GCP Native)

We standardize on **Google Cloud Platform (GCP)** for the "Client Zero" implementation.

* **Compute:** **GKE (Google Kubernetes Engine)** Standard or Autopilot.
  * *Why:* Best-in-class K8s management, auto-upgrades, deep integration.
* **Database:** **Cloud SQL for PostgreSQL** (Private IP).
  * *Why:* Managed backups, HA, automatic patches. **Crucial:** Low latency to GKE via VPC Peering.
* **Events/Cache:** **Cloud Memorystore for Redis** (Private IP).
  * *Why:* Managed high availability for the "Nervous System".
* **Storage:** **Google Cloud Storage (GCS)**.
  * *Why:* Unified permissions (Workload Identity).

**Cost Optimization (Startup):**

* Use **Spot Instances** for the Agent Node Pool (Agents are fault-tolerant).
* Use **Cloud SQL Shared Core** (e.g., `db-f1-micro`) for dev/staging.

### Environment Plan

* **Local (docker compose):** Postgres 16, Redis 7, MinIO.
* **Staging (GCP):** GKE (1 Node), Cloud SQL (Micro), Memorystore (Basic).
* **Production (GCP):** GKE (3 Nodes), Cloud SQL (HA), Memorystore (Standard HA).

### Key Constraints

| Constraint | Rationale |
|------------|-----------|
| **Docker-first** | All services via Dockerfile—no Nixpacks. Ensures K8s portability. |
| **Redis with Volume** | Streams require persistence. Pin version ≥7.x. |
| **n8n Queue Mode** | Separate main + worker services. `N8N_ENCRYPTION_KEY` is crown jewel. |

### Testing Strategy

| Category | Framework | Scope | Threshold |
|----------|-----------|-------|-----------|
| **Unit** | Vitest | Pure functions, schemas, utils | 70% coverage |
| **Integration** | Vitest + Testcontainers | DB operations, RLS, API routes | Per-module |
| **Smoke** | Custom (`scripts/smoke-test.ts`) | RLS isolation, event immutability, health | CI gate |
| **E2E** | Playwright (planned) | Full user flows | Future |

**Coverage scope:** `src/lib/**`, `src/middleware/**`, `src/routes/health.ts`. Domain/infra excluded until integration tests mature.

### Observability

* **Logging:** Pino JSON with `trace_id`, `org_id`, `user_id`; PII scrubbed |
* **Tracing:** OpenTelemetry auto-instrumentation; `traceparent` header propagation |
* **Errors:** Sentry when `SENTRY_DSN` set; scrubbed headers |
* **Metrics:** `GET /api/v1/metrics` — process uptime, memory, load (CI-only) |
* **Logging:** FluentBit -> Loki.
* **Metrics:** Prometheus -> Grafana.
* **Tracing:** OpenTelemetry (critical for tracing Event -> Agent flows).

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

### Project Initialization (from scratch, no starter template)

* **Package manager:** pnpm 10.23.0 (via Corepack).
* **Starter:** From scratch (Turborepo + pnpm). Search term for verification: "create turbo pnpm monorepo".
* **Bootstrap commands:**

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

* **Rule:** No service "guesses" the shape of data.
* **Workflow:** Change DB Schema -> Update `ts-schema` -> Update Service.

### B. Frontend "Islands"

We use Astro's Island Architecture to lazy-load React apps.

* **Shell:** Handles the "Frame" (Sidebar, Header, Auth).
* **Navigation:** Hovering a sidebar item pre-fetches the React bundle.
* **Mounting:** Clicking mounts the React app into the content area.
* **State:** `Nano Stores` are used for cross-island communication (e.g., a "New Lead" toast triggered by the CRM island).

### C. Communication Patterns (The Nervous System)

We prioritize **Indirect Communication** (Stigmergy/Events) to decouple the 175+ modules, but allow **Direct Communication** (RPC or similar) for specific query needs.

**1. Indirect (The Default — "Fire and Forget")**

* **Pattern:** Event-Driven Choreography.
* **Transport:** Redis Streams.
* **Use Case:** State changes, Workflow triggers, Cross-module actions.
* **Example:** `Finance` emits `invoice.paid` -> `Inventory` subscribes and decrements stock. `Finance` does not know `Inventory` exists but `Website` does.

**2. Direct (The Exception — "Ask and Wait")**

* **Pattern:** Synchronous RPC (REST, gRPC, websockets, etc.).
* **Transport:** Preferibly HTTP/2 when possible.
* **Use Case:** Real-time data queries, strict dependencies where eventual consistency is unacceptable.
* **Example:** `Sales` calls `Inventory.check_stock(item_id)` to validate a quote *before* sending it.

**3. Agent-to-Agent (Stigmergy)**

* **Pattern:** Communication via State.
* **Transport:** Database + Events.
* **Use Case:** Collaboration.
* **Example:** `Strategy` updates the Brief. `Marketing` sees the update and acts. They never "talk" directly.

### D. API & Error Conventions

* **Errors:** HTTP Problem Details (`application/problem+json`) with `type`, `title`, `status`, `detail`, `trace_id`.
* **Auth:** JWT (Clerk) in HTTP-only cookie via `@clerk/fastify` middleware; services accept `Authorization: Bearer` for service-to-service calls. Org context from JWT `org_id` claim; `x-org-id` header optional for org-switching.
* **Idempotency:** For mutating endpoints that can retry, require `Idempotency-Key` header and persist to dedupe.

### E. Auth Patterns

* **User Auth:** Clerk for sign-in/up with native Organizations support. Access token includes `sub`, `org_id`, `org_role`, `org_permissions`. Session managed via Clerk SDK.
* **Social OAuth:** Multiple providers supported via Clerk (Google, Apple, Microsoft, etc.). Adding providers is a dashboard configuration, not code change. MVP: Google + Apple.
* **Service Auth:** Signed JWT with short TTL; verified per service; propagate `trace_id` and `org_id`.
* **Org Scoping:** Middleware extracts `org_id` from Clerk JWT claims (set when user selects active organization); RLS enforces at DB. Header `x-org-id` used only for org-switching validation.

### F. Naming & Location Patterns

* **API routes:** `/api/v1/{service}/{resource}` (plural nouns). Example: `/api/v1/brand/sites`.
* **Events:** `xentri.{boundedContext}.{action}.{version}` e.g., `xentri.brief.updated.v1`.
* **Database tables:** `snake_case`, always include `org_id`, `id` UUID primary key, `created_at`, `updated_at`.
* **Files:**
  * Apps: `apps/shell/src/routes/...`, `apps/shell/src/components/...`
  * Services: `services/{svc}/src/routes`, `services/{svc}/src/domain`, `services/{svc}/src/infra`
  * Shared: `packages/ts-schema/src`, `packages/ui/src`, utilities in `packages/lib/src`
* **Tests:** Co-locate as `__tests__` or `*.test.ts` next to source.

### G. Lifecycle Patterns

* **Loading/Error UX:** Skeletons for primary content; inline errors with retry; toast only for non-blocking notices.
* **Retries:** Client retries idempotent GETs with backoff; mutations rely on server idempotency keys.
* **Background Jobs:** n8n flows must be idempotent; retries with exponential backoff; dead-letter to `redis:stream:dlq`.

---

## 7. Cross-Cutting Concerns

* **Authentication:** Clerk with native Organizations. Unified user identity across all services; org membership and roles managed by Clerk.
* **Logging:** Centralized structured logging (JSON) with `trace_id` propagation.
* **Error Handling:** Standardized error responses (Problem Details for HTTP APIs).
* **Testing:**
  * Unit Tests: Jest/Vitest per package.
  * E2E Tests: Playwright running against the full docker-compose stack.
* **Caching:**
  * API: HTTP cache-control for GETs; CDN for public assets; service-layer Redis for hot data with TTL.
  * Invalidation: Event-driven (Redis Stream) to bust projections; explicit cache tags per resource type.
* **Object Storage:** S3/MinIO for assets; presigned PUT/GET; store only keys/metadata in DB.
* **Performance Budgets:** p75 FMP < 2s on 3G for shell; API p95 < 300ms for reads, < 600ms for writes; background jobs complete < 30s or enqueue follow-up.
* **Observability:** OpenTelemetry traces across shell/services; logs to Loki/Grafana; metrics via Prometheus; `trace_id` propagated through API and events.
* **n8n Reliability:** Workers run with queue-backed execution; retry with backoff (3 attempts), DLQ to Redis stream `n8n:dlq`; flows must be idempotent and check org context.
* **Cache/Invalidation Map:**
  * Brief: key `brief:{org_id}` in Redis; invalidated on `xentri.brief.updated.v1`; projections downstream rehydrate.
  * Site: key `site:{org_id}:{site_id}` and CDN path `/sites/{site_id}`; purge on `xentri.website.published.v1` or `xentri.page.updated.v1`.
  * Leads: key `leads:list:{org_id}` with cursor; bust on `xentri.lead.created.v1` and `xentri.lead.updated.v1`; entity cache `lead:{org_id}:{lead_id}` updated in write path.

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

* **Security audit** — Before first production deployment and annually thereafter
* **Compliance requirements** — GDPR, SOC2, or region-specific regulations (CFDI for Mexico)
* **Performance crisis** — If p95 latencies exceed budgets and AI agents can't diagnose
* **Infrastructure migration** — Moving between cloud providers or major k8s upgrades
* **Legal/financial integrations** — Payment processors, tax APIs, legal document generation

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

* `Initiated` — Session started, no data yet
* `Conversing` — Multi-turn Q&A active
* `Drafting` — AI processing, generating sections
* `ReviewPending` — Draft complete, awaiting user review
* `Editing` — User making manual edits
* `Approved` — Final, triggers downstream modules

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

* `New` — Just captured, no contact yet
* `Contacted` — At least one outreach attempt
* `Qualified` — Confirmed as viable opportunity
* `Disqualified` — Removed from pipeline
* `Proposal` — Active deal negotiation
* `Won/Lost` — Terminal states

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

* `Draft` — Content being edited, not visible publicly
* `Preview` — Rendered for review, not live
* `Publishing` — Build/deploy in progress
* `Live` — Publicly accessible
* `Failed` — Build error, needs intervention

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

* **[Pulse](../../pulse.md)** — Cross-team coordination and system-wide status
* **[Sprint Status](./sprint-artifacts/sprint-status.yaml)** — Epic-level tracking
* **GitHub Issues** — Story-level tracking with `cross-module` label

### How to Propose New Modules

1. **Check category readiness** — Is the SPA + Copilot complete?
2. **Create GitHub Issue** — Use the cross-module request template
3. **Link to Brief/PRD** — How does this serve the product vision?
4. **Estimate dependencies** — What other modules does it need?
5. **Get approval** — ADR required for new foundational modules

See [ADR-005](./architecture/adr-005-spa-copilot-first.md) for full rationale and Definition of Done criteria.

---

## 12. Future Considerations

* **Secondary Geo Expansion:** Architecture supports adding region-specific compliance modules (e.g., `finance-engine-mx` for CFDI) without altering the core `finance-engine`.
* **Mobile App:** The API-first design allows a future React Native app to consume the same microservices.
