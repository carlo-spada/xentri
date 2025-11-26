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

    subgraph "Backend (Docker Swarm / K8s)"
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

## 4. Project Structure

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

---

## 5. Implementation Patterns

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

---

## 6. Cross-Cutting Concerns

*   **Authentication:** Supabase Auth (or equivalent JWT provider). Unified user identity across all services.
*   **Logging:** Centralized structured logging (JSON) with `trace_id` propagation.
*   **Error Handling:** Standardized error responses (Problem Details for HTTP APIs).
*   **Testing:**
    *   Unit Tests: Jest/Vitest per package.
    *   E2E Tests: Playwright running against the full docker-compose stack.

## 7. Future Considerations

*   **Secondary Geo Expansion:** Architecture supports adding region-specific compliance modules (e.g., `finance-engine-mx` for CFDI) without altering the core `finance-engine`.
*   **Mobile App:** The API-first design allows a future React Native app to consume the same microservices.
