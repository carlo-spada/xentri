# Xentri Architecture

> **Status:** Draft
> **Version:** 1.0.0
> **Last Updated:** 2025-11-25

## 1. Executive Summary

Xentri is a **Modular Business OS** designed to unify Strategy, Marketing, Sales, Finance, and Operations into a single "calm" workspace.

Unlike traditional SaaS ERPs that force a "database-first" structure, Xentri is **"Clarity-First."** It begins with a **Strategy Co-pilot** conversation that generates a **Universal Brief**—the DNA of the business. This Brief orchestrates the configuration of all downstream modules (Website, CRM, Invoicing), ensuring they are personalized to the user's specific context.

### Core Architectural Principles

1.  **Decoupled Unity:** A unified "Shell" (Astro) provides a seamless user experience, while independent "Micro-Apps" (React) and "Microservices" (Node.js) ensure technical isolation and scalability.
2.  **Event-Driven Backbone:** Services do not couple directly. They communicate via a "Nervous System" (Redis/n8n) using a strict, immutable event schema. This allows new modules to be added without rewriting existing ones.
3.  **Multi-Tenancy by Design:** A single-schema Postgres database enforces strict data isolation using Row-Level Security (RLS), ensuring "Client Zero" security from day one.
4.  **Reality-In Data:** The system is designed to ingest messy, unstructured inputs (voice, text) and progressively structure them, rather than demanding perfect forms upfront.

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
| AuthN/AuthZ | Supabase Auth (GoTrue) + JWT cookies | GoTrue JS 2.84.0 | Delegates identity, supports email/OAuth, and keeps services stateless. |
| Events & Transport | Postgres `system_events` log + Redis Streams outbox | Redis 8.4.0 | Durable source-of-truth log with streaming fan-out for cross-service transport. |
| Orchestration | n8n (self-hosted) | n8n 1.121.2 | Visual workflows and retries; separates business logic from app code. |
| File/Object Storage | S3-compatible blobs (prod: AWS S3, local: MinIO) | MinIO 8.0.6 client (server RELEASE.2024-09-30) | Presigned uploads for media/assets; CDN-friendly and infra-portable. |
| Deployment Target | Managed Kubernetes | k8s 1.31.0 | Standardized runtime for services, HPA-ready, secrets and ingress consistency. |
| Observability | OpenTelemetry traces + Pino JSON logs to Loki/Grafana | OTel SDK 1.9.0 / Pino 10.1.0 | Trace propagation across shell/services; structured logs for debugging. |

Version check date: 2025-11-26 (re-verify with WebSearch before releases).

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

---

## 4. Project Structure & FR/Epic Coverage

The repository follows a standard Turborepo monorepo structure:

```text
/xentri-monorepo
├── /apps
│   └── /shell                # Astro: The main container
├── /packages
│   ├── /ui                   # Shared Design System
│   ├── /ts-schema            # Shared Types, Zod Schemas, Event Definitions
│   ├── /cms-client           # React Micro-App: CMS
│   ├── /crm-client           # React Micro-App: CRM
│   └── /...                  # Other Micro-Apps
├── /services
│   ├── /core-api             # Node.js: Auth, Billing, Org Management
│   ├── /brand-engine         # Node.js: Website, CMS Backend
│   ├── /sales-engine         # Node.js: CRM, Quotes Backend
│   ├── /ai-service           # Python: Co-pilot Swarm
│   └── /n8n-host             # Workflow Engine
└── /tooling                  # Shared Configs (ESLint, TSConfig)
```

### Mapping to PRD Functional Requirements (FR) and Epics
- **apps/shell** → FR26-33 (shell UX, navigation, responsive), FR75-78 (notifications UI). Epic 1 (Foundation & Access).
- **packages/ts-schema** → FR33-36 (events), FR16 (Brief schemas), all cross-service contracts. Epic 1 and 2.
- **services/core-api** → FR1-6, FR37 (auth/signup/login events), FR82 (RLS enforcement), FR75-78 (notifications sending), FR5 (account deletion). Epic 1, 6.
- **services/brand-engine** → FR40-59 (website/CMS), FR58 (content_published event). Epic 3.
- **services/sales-engine** → FR60-67 (leads), FR63 (lead_created event). Epic 4.
- **services/ai-service** → FR10-25, FR69-74 (Strategy/Brand co-pilots). Epic 2 and 5.
- **services/n8n-host** → FR33-36 (event-driven flows), FR148 (orchestration readiness). Cross-epic automation.
- **packages/ui** → Shared components for shell/micro-apps (supports FR40-47 UX).
- **packages/cms-client, packages/crm-client** → Frontend micro-apps for brand/sales capabilities (FR40-67).

### Service Interface Summaries (MVP scope)
- **core-api**
  - Endpoints: `POST /api/v1/auth/signup`, `POST /api/v1/auth/login`, `POST /api/v1/orgs` (auto-create), `DELETE /api/v1/account` (FR5).
  - Emits: `xentri.user.signup.v1`, `xentri.user.login.v1`, `xentri.org.created.v1`.
  - Contracts: User, Org, Notification schemas in `packages/ts-schema`.
- **brand-engine**
  - Endpoints: `GET/PUT /api/v1/sites/:id`, `POST /api/v1/sites/:id/publish`, `GET/PUT /api/v1/pages/:id`, `POST /api/v1/media/presign`.
  - Emits: `xentri.website.published.v1`, `xentri.page.updated.v1`, `xentri.content.published.v1`.
  - Contracts: Site, Page, Content, MediaAsset schemas in `packages/ts-schema`.
- **sales-engine**
  - Endpoints: `GET/POST /api/v1/leads`, `GET/PUT /api/v1/leads/:id`, `POST /api/v1/leads/:id/status`.
  - Emits: `xentri.lead.created.v1`, `xentri.lead.updated.v1`, `xentri.followup.scheduled.v1`.
  - Contracts: Lead, FollowUp schemas in `packages/ts-schema`.
- **ai-service**
  - Endpoints: `POST /api/v1/brief/generate` (Strategy Co-pilot), `POST /api/v1/brief/sections/:sectionId/propose`, `POST /api/v1/brand/copy/suggest`.
  - Emits: `xentri.brief.created.v1`, `xentri.brief.updated.v1`, `xentri.ai.proposal.generated.v1`.
  - Contracts: Brief, BriefSectionProposal, BrandCopySuggestion schemas in `packages/ts-schema`.
- **n8n-host**
  - Subscribes: Redis Streams for all `xentri.*` events; runs idempotent flows with org context.
  - Responsibilities: Notifications fan-out, cache invalidation messages, cross-service orchestrations (e.g., `brief.updated` triggers website refresh prompt).

### Contract Source of Truth
- `packages/ts-schema/src/api.ts` — API envelope and Problem Details types.
- `packages/ts-schema/src/auth.ts` — User and service JWT claims.
- `packages/ts-schema/src/events.ts` — Event envelope and actor/meta.
- `packages/ts-schema/src/cache.ts` — Cache keys and invalidation events (brief, site, leads).
- CI: `.github/workflows/schema-check.yml` runs `tsc` against these definitions to prevent drift.

---

## 5. Deployment & Environments

### Deployment Target
- **Target:** Managed Kubernetes v1.31.0 (GKE/EKS/AKS) with NGINX Ingress, cert-manager (ACME), ExternalDNS, and ExternalSecrets for vault-backed creds.
- **Services:** Each service as a Deployment + HPA (min 2 replicas prod), ConfigMaps for non-secret config, Secrets for JWT keys/webhooks, and dedicated Postgres/Redis managed services.
- **Networking:** Ingress per app domain (`app.xentri.app`, `api.xentri.app`, `n8n.xentri.app`), TLS via cert-manager, service-to-service auth via signed JWT and network policies.

### Environment Plan
- **Local (docker compose):** Postgres 16.11, Redis 8.4.0, n8n 1.121.2, MinIO (S3-compatible). Supabase Auth via hosted project or local GoTrue. Command: `docker compose up -d postgres redis n8n minio`.
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
- **Auth:** JWT (Supabase) in HTTP-only cookie; services accept `Authorization: Bearer` for service-to-service calls. All requests require `x-org-id`.
- **Idempotency:** For mutating endpoints that can retry, require `Idempotency-Key` header and persist to dedupe.

### E. Auth Patterns
- **User Auth:** Supabase GoTrue for sign-in/up. Access token includes `sub`, `org_id`, `role`. Refresh via Supabase.
- **Service Auth:** Signed JWT with short TTL; verified per service; propagate `trace_id` and `org_id`.
- **Org Scoping:** Middleware enforces presence of `x-org-id` header matching JWT claims; RLS enforces at DB.

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

*   **Authentication:** Supabase Auth (or equivalent JWT provider). Unified user identity across all services.
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

## 8. Validation Summary

- Architecture Completeness: Mostly Complete — deployment/environments, init commands, caching/storage/perf, n8n reliability, PRD/epic mapping, and service interfaces documented; still need schema-level examples inline with `ts-schema`.
- Version Specificity: Most Verified — stack versions refreshed (2025-11-26 via registry fetch); re-verify before release.
- Pattern Clarity: Clear — API/auth/error, naming/location/lifecycle, file org, and event naming defined.
- AI Agent Readiness: Mostly Ready — conventions and interfaces covered; finalize schema references and cache-topic tables in code.

Critical Issues Found
1. `packages/ts-schema` must formalize schemas and reference them from services (currently examples only).
2. Cache-topic tables and invalidation hooks should be codified in code/config (beyond documentation).
3. Performance/error envelope examples need to live alongside generated types to avoid drift.

Recommended Actions Before Implementation
1. Convert examples into Zod/TS schemas in `packages/ts-schema` and import in services.
2. Implement cache/invalidation config per bounded context (brief, site, leads) and wire to events.
3. Keep API/error/auth envelope definitions source-controlled in `packages/ts-schema` and enforce via CI.

## 9. Future Considerations

*   **Secondary Geo Expansion:** Architecture supports adding region-specific compliance modules (e.g., `finance-engine-mx` for CFDI) without altering the core `finance-engine`.
*   **Mobile App:** The API-first design allows a future React Native app to consume the same microservices.
