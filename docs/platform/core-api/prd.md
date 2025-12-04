---
entity_type: infrastructure_module
document_type: prd
module: core-api
title: 'Core API Module PRD'
description: 'Requirements for the Core API service - events, agents, Soul management, and multi-tenant isolation.'
version: '2.0'
status: draft
created: '2025-12-03'
updated: '2025-12-03'
inherits_from:
  - 'docs/platform/prd.md'
---

# Core API Module - Product Requirements Document

> **Entity Type:** Infrastructure Module
> **Module:** core-api
> **Package:** `services/core-api`
> **Inherits From:** Constitution (docs/platform/prd.md)

---

## Overview

The Core API is the central backend service providing the Event Backbone, Agent coordination, Soul management, multi-tenant isolation, and the foundation for all domain services.

**What this module builds:**

- Event Backbone implementation (system_events table + Redis Streams)
- RLS middleware for multi-tenant isolation
- Clerk integration for authentication
- Organization provisioning and management
- Soul Gateway API endpoints
- Agent orchestration layer
- Pulse hierarchical filtering engine

**What this module inherits (constraints):**

- Event envelope schema (IC-001, IC-002) from Constitution
- RLS pattern (PR-001, ADR-003) from Constitution Architecture
- Permission primitives (IC-007) from Constitution
- API conventions (Problem Details, versioning) from Constitution

---

## Requirements Index

> **Requirement ID Pattern:** `FR-API-xxx` (Functional Requirement - Core API)

### Functional Requirements

| ID         | Requirement                                                                | Priority | Status |
| ---------- | -------------------------------------------------------------------------- | -------- | ------ |
| FR-API-001 | Core API MUST implement system_events table with org_id and RLS            | P0       | Draft  |
| FR-API-002 | Core API MUST emit events with SystemEvent envelope (IC-001)               | P0       | Draft  |
| FR-API-003 | Core API MUST implement Clerk webhook handler for user/org sync            | P0       | Draft  |
| FR-API-004 | Core API MUST set transaction-scoped org_id for RLS enforcement            | P0       | Draft  |
| FR-API-005 | Core API MUST implement Soul Gateway endpoints (IC-004)                    | P1       | Draft  |
| FR-API-006 | Core API MUST implement recommendation submission endpoint (IC-005)        | P1       | Draft  |
| FR-API-007 | Core API MUST implement permission check middleware (IC-007)               | P0       | Draft  |
| FR-API-008 | Core API MUST implement health check endpoints (/health, /health/ready)    | P0       | Draft  |
| FR-API-009 | Core API MUST return Problem Details format for all errors                 | P1       | Draft  |
| FR-API-010 | Core API MUST propagate trace_id across all requests                       | P1       | Draft  |
| FR-API-011 | Core API MUST implement Redis Streams for real-time event transport        | P1       | Draft  |
| FR-API-012 | Core API MUST implement dual-write pattern (Redis + Postgres) for events   | P1       | Draft  |
| FR-API-013 | Core API MUST implement Pulse hierarchical filtering engine                | P1       | Draft  |
| FR-API-014 | Core API MUST implement Soul Governance (AI-updateable vs human-sovereign) | P1       | Draft  |
| FR-API-015 | Core API MUST implement Tri-State Memory (Semantic, Episodic, Synthetic)   | P2       | Draft  |

---

## Fractal Agency Architecture

> **Migrated from Constitution PRD §Core Architecture Concepts**

**Decision:** Every node in the hierarchy (Category, Sub-Category, Module) is an **autonomous agent** (Logically).

- _Physical Implementation:_ Agents are grouped into **Category Swarms** (Python services) to optimize resources (see `architecture.md`).

### Agent vs. Tool Distinction

- **The Tool:** The deterministic code/API (e.g., `create_invoice()`, `database_table`).
- **The Agent:** The LLM reasoning layer that _uses_ the tool.
- **The Rule:** A Manager Agent (e.g., Finance) **cannot** access the Child's Tools (e.g., Invoicing API) directly. It must ask the Child Agent (Invoicing) to do it.

### Hierarchy of Influence (The "Nudge")

- **Managers do not override; they "nudge".** A Manager sets **Objectives** and **Permissions** for its children, treating them like users.
- **Children have agency.** They receive the objective, check their "Soul" and "Local Context", and decide _how_ to execute.

### Agent Levels

- **Level 1: Strategy (The Orchestrator):** The "Strategy" agent.
- **Level 2: Category (The Executive):** The "Marketing" agent.
- **Level 3: Sub-Category (The Manager):** The "Social Media" agent.
- **Level 4: Module (The Specialist):** The "Content Creation" agent.

### The Triangulation Logic

At any given level, the Agent must balance three distinct inputs to decide how to **ACT**:

1. **Immutable System Context (The Soul):**
   - _Source:_ Xentri Developers.
   - _Content:_ The "Constitution" of the module. What it _is_, what it _can do_, and its unshakeable rules.
   - _Editable by:_ **Xentri Devs ONLY.** (User cannot change this).

2. **Superior Intent (The Strategy):**
   - _Source:_ The Parent (Agent) (e.g., Owner → Orchestrator → Executive → Manager → Specialist).
   - _Content:_ The relevant section of the Soul and Pulse. "We are focusing on growth this quarter."
   - _Editable by:_ **Parent Agent.**

3. **User Reality (The Supervision):**
   - _Source:_ The Human User (different users might have different permissions here).
   - _Content:_ Direct commands, feedback asks, or corrections. "Don't post that today."
   - _Editable by:_ **Users.**

**The Agentic Loop:**
The Agent reads (Soul + Superior Intent + User Reality) → **Synthesizes** → **ACTS** (Configures itself, executes task, emits events, etc.).

The User functions mainly as a **Supervisor** and **Feedback Provider**, NOT a direct **Operator**. The Module functions as an **Employee**, NOT a **Tool**.

---

## Pulse Mechanics (Hierarchical Filtering)

> **Migrated from Constitution PRD §Core Architecture Concepts**

How do we prevent noise? **Hierarchical Filtering.**

### Level 1: Module (Local Context)

- The Module (e.g., Invoicing) detects an event (e.g., "Invoice Overdue").
- It classifies importance (1-5) based on _local_ context (e.g., "Is this a VIP client?").
- It pushes relevant items to the **Sub-Category Pulse**.

### Level 2: Sub-Category (Operational Context)

- The Sub-Category Copilot (e.g., Finance) reviews its Pulse.
- It aggregates and re-classifies (1-5) based on _sub-category_ context (e.g., "We have 10 overdue invoices, let's group them").
- It pushes high-impact items to the **Category Pulse**.

### Level 3: Category (Tactical Context)

- The Category Copilot reviews its Pulse.
- It aggregates and re-classifies (1-5) them based on _category_ goals (e.g., "Cash flow is stable, but this client is critical").
- It pushes strategic items to the **Strategy Pulse**.

### Level 4: Strategy (Strategic Context)

- The Strategy Copilot reviews the Strategy Pulse.
- It makes the final decision based on the _Universal Soul_ (e.g., "Ignore the invoice, call the client to save the relationship").

**Result:** The Owner sees only what survives four layers of intelligent filtering (unless they choose to dig deeper, because the rest of the information is still there, it just might have a lower priority and wasn't able to surface to a higher level filter).

---

## Soul Governance

> **Migrated from Constitution PRD §Core Architecture Concepts**

The Universal Soul contains two types of sections:

| Section Type        | Who Can Modify                | Examples                                       |
| ------------------- | ----------------------------- | ---------------------------------------------- |
| **AI-Updateable**   | Strategy Copilot (auto)       | Revenue model, client mix, operational metrics |
| **Human-Sovereign** | User only (explicit approval) | Vision, values, identity, strategic direction  |

### Recommendation Flow

Category copilots cannot write to the Universal Soul. Instead:

1. Emit `xentri.soul.recommendation.submitted.v1` event
2. Include `target_section`, `recommendation`, `evidence`, `confidence`, `protocol_version: "1.0"`
3. Strategy Copilot evaluates during synthesis
4. If approved, Soul updates and `xentri.soul.updated.v1` emitted

**Exception:** War Room sessions can approve recommendations in real-time with human present.

### Safeguards (via pre-mortem analysis)

- **Against Silent Drift:** Soul is versioned; users can diff any two versions to see evolution
- **Against Recommendation Flood:** Confidence thresholds, decay on flagged items, backpressure signals
- **Tracking:** Soul Stability Index measures change velocity to detect over-reactivity

---

## Tri-State Memory Architecture

> **Migrated from Constitution PRD §User Experience Principles**

To support "Narrative Continuity" without clogging context windows, Xentri employs a **Tri-State Memory System** with **Temporal Compression**:

### 1. Semantic Memory (The Soul)

- _What it is:_ Structured business facts.
- _Example:_ "Client X is a VIP." "Strategy is Growth."
- _Storage:_ Relational DB (The Universal Soul).
- _Usage:_ Cached and loaded on every interaction.

### 2. Episodic Memory (The Journal)

- _What it is:_ Raw, time-based narrative of past experiences.
- _Example:_ "User clicked 'Create Invoice' at 10:00 AM."
- _Storage:_ Vector Database (RAG).
- _Usage:_ On-demand retrieval only ("What did I do last Tuesday?").

### 3. Synthetic Memory (The Persona)

- _What it is:_ Compressed, high-level synthesis of tone, preferences, and recurring patterns.
- _Example:_ "User prefers direct communication and usually works late on Tuesdays."
- _Storage:_ System Prompt / Cached Context.
- _Usage:_ Always present in context window.

### Temporal Compression Strategy (The "Folding" Algorithm)

To prevent context bloat, Episodic Memory is recursively summarized ("folded") into Synthetic/Semantic memory:

- **Hourly:** Raw events → **Day Summary** (24h retention).
- **Daily:** Day Summaries → **Week Summary** (7d retention).
- **Weekly:** Week Summaries → **Month Summary** (4w retention).
- **Monthly:** Month Summaries → **Quarter Summary** (4q retention).
- **Quarterly:** Quarter Summaries → **Year Summary** (Permanent).

**Result:** The agent can answer "What did we achieve in 2025?" (Year Summary) just as easily as "What did I just do?" (Raw Events), without carrying gigabytes of text.

---

## API Type Mandates

> **Migrated from Constitution PRD §Platform Integration Requirements**

**Use the right API for the right purpose:**

| Communication Pattern         | API Type                 | Use Case                                  | Example                    |
| ----------------------------- | ------------------------ | ----------------------------------------- | -------------------------- |
| **CRUD operations**           | REST                     | Standard data operations, module APIs     | `GET /api/v1/deals`        |
| **Complex internal services** | gRPC                     | High-throughput, typed service-to-service | Copilot ↔ Soul service    |
| **Real-time updates**         | WebSocket                | Chat, live collaboration, presence        | War Room, co-editing       |
| **Event streaming**           | Server-Sent Events (SSE) | Notifications, activity feeds             | Operational Pulse delivery |
| **Flexible querying**         | GraphQL                  | Client-driven data needs                  | Consider for v2.0+         |

**Versioning requirement:** All APIs must be versioned (`/api/v1/`, `/api/v2/`). Breaking changes require version bump.

**Error handling:** All APIs return Problem Details format (`application/problem+json`) with `type`, `title`, `status`, `detail`, `trace_id`.

---

## Cross-cutting Capability Requirements

> **Migrated from Constitution PRD §Platform Integration Requirements**

**Every sub-category service must implement:**

| Capability                    | Requirement                                                               |
| ----------------------------- | ------------------------------------------------------------------------- |
| **PR-002: Event emission**    | All mutations emit events with standard envelope (see Event Schema below) |
| **PR-005: Permission checks** | Verify primitives (`view`, `edit`, `approve`, `configure`) before actions |
| **PR-006: Audit logging**     | Log who did what when; include `trace_id` for correlation                 |
| **Soul awareness**            | Read Soul on init; reconfigure on `xentri.soul.updated` events            |
| **PR-007: Error boundaries**  | Fail gracefully; never crash the shell; show meaningful error states      |

---

## Notification Delivery Contract (IC-006)

> **Migrated back from Constitution PRD v2.x**

**How notifications are delivered to users based on priority:**

| Mode          | Priority Level            | Sub-category Responsibility                   | Infrastructure Responsibility  |
| ------------- | ------------------------- | --------------------------------------------- | ------------------------------ |
| **Critical**  | `priority: "critical"`    | Emit event with `notification_version: "1.0"` | Deliver immediately via push   |
| **Digest**    | `priority: "high/medium"` | Emit event with `notification_version: "1.0"` | Batch for scheduled delivery   |
| **Dashboard** | `attention: true`         | Emit all events needing user attention        | Display in Attention Dashboard |

### Notification Event Shape

```typescript
interface NotificationEvent {
  // Standard envelope fields...
  priority: 'critical' | 'high' | 'medium' | 'low';
  attention: boolean; // Show in Attention Dashboard?
  notification_version: '1.0';

  // Notification-specific
  title: string;
  body: string;
  action_url?: string; // Deep link to relevant view
  expires_at?: string; // Auto-dismiss after this time
}
```

### User Preferences

Users can configure per-category:

- **Push notifications:** On/Off (Critical always on)
- **Digest schedule:** Morning (8am) / Evening (6pm) / Both / Off
- **Dashboard filters:** Which categories to show

---

## Soul Access Patterns (IC-004)

> **Migrated from Constitution PRD §Platform Integration Requirements**

### Reading the Soul

| Access Type              | Method                       | Use Case                               |
| ------------------------ | ---------------------------- | -------------------------------------- |
| **Full Soul**            | `GET /api/v1/soul`           | Initial module configuration           |
| **Specific section**     | `GET /api/v1/soul/{section}` | Targeted reads (e.g., `business_type`) |
| **Subscribe to changes** | SSE `/api/v1/soul/stream`    | React to Soul updates in real-time     |

### Writing to the Soul (IC-005)

Sub-categories **never write directly** to the Soul. Instead:

1. Emit `xentri.soul.recommendation.submitted.v1` event
2. Include `target_section`, `recommendation`, `evidence`, `confidence`, `protocol_version: "1.0"`
3. Strategy Copilot evaluates during synthesis
4. If approved, Soul updates and `xentri.soul.updated.v1` emitted

---

## Interfaces Provided

> Interfaces that sibling modules can depend on (per ADR-020 Sibling Dependency Law)

| Interface         | Description                      | Consumers             |
| ----------------- | -------------------------------- | --------------------- |
| `EventEmitter`    | Emit events to Event Backbone    | All services          |
| `SoulGateway`     | Read Soul sections (IC-004)      | All copilots, modules |
| `PermissionCheck` | Verify user permissions (IC-007) | All services          |
| `OrgContext`      | Current organization context     | shell, all services   |
| `PulseEngine`     | Hierarchical filtering API       | shell, copilots       |
| `AgentRegistry`   | Register and coordinate agents   | All agent services    |

### API Endpoints

| Endpoint                            | Method | Description                | IC Reference |
| ----------------------------------- | ------ | -------------------------- | ------------ |
| `GET /api/v1/soul`                  | GET    | Full Soul read             | IC-004       |
| `GET /api/v1/soul/{section}`        | GET    | Section-specific Soul read | IC-004       |
| `SSE /api/v1/soul/stream`           | GET    | Real-time Soul updates     | IC-004       |
| `POST /api/v1/soul/recommendations` | POST   | Submit recommendation      | IC-005       |
| `GET /api/v1/events`                | GET    | Query events (org-scoped)  | IC-001       |
| `GET /api/v1/pulse/{scope}`         | GET    | Get Pulse items for scope  | ADR-011      |
| `GET /health`                       | GET    | Liveness check             | —            |
| `GET /health/ready`                 | GET    | Readiness check (DB)       | —            |
| `POST /webhooks/clerk`              | POST   | Clerk webhook handler      | —            |

---

## Interfaces Consumed

| Interface            | Provider       | Usage                |
| -------------------- | -------------- | -------------------- |
| `SystemEvent` schema | ts-schema      | Event validation     |
| `SoulSchema`         | ts-schema      | Soul data validation |
| `PulseItem` schema   | ts-schema      | Pulse data structure |
| Clerk SDK            | @clerk/fastify | Authentication       |
| Prisma Client        | Generated      | Database access      |
| Redis Client         | ioredis        | Event streaming      |

---

## Traceability

### To Constitution Requirements

| API Requirement | Traces To                 | Notes                              |
| --------------- | ------------------------- | ---------------------------------- |
| FR-API-001      | PR-001                    | All tables include org_id with RLS |
| FR-API-002      | PR-002, IC-001, IC-002    | Events with standard envelope      |
| FR-API-004      | PR-001, ADR-003           | Fail-closed RLS pattern            |
| FR-API-005      | PR-004, IC-004            | Soul access through API only       |
| FR-API-006      | IC-005                    | Recommendation protocol            |
| FR-API-007      | PR-005, IC-007            | Permission enforcement             |
| FR-API-009      | Constitution Architecture | Problem Details format             |
| FR-API-010      | PR-006                    | Observability requirements         |
| FR-API-013      | ADR-011                   | Hierarchical Pulse                 |
| FR-API-014      | PR-004                    | Soul governance rules              |
| FR-API-015      | ADR-006                   | Tri-State Memory                   |

### To Constitution ADRs

| API Implementation  | Implements ADR | Notes                                  |
| ------------------- | -------------- | -------------------------------------- |
| RLS middleware      | ADR-003        | Transaction-scoped context             |
| Redis Streams       | ADR-002        | Event envelope with versioning         |
| Dual-write pattern  | ADR-002        | Redis (real-time) + Postgres (durable) |
| Pulse engine        | ADR-011        | Hierarchical filtering                 |
| Tri-State Memory    | ADR-006        | Memory architecture                    |
| Agent orchestration | ADR-007        | Federated Soul Registry                |

---

## Data Model

### system_events Table

```sql
CREATE TABLE system_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(255) NOT NULL,              -- e.g., "xentri.soul.updated.v1"
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  org_id UUID NOT NULL REFERENCES organizations(id),
  actor_type VARCHAR(50) NOT NULL,         -- "user" | "system" | "copilot"
  actor_id VARCHAR(255) NOT NULL,

  envelope_version VARCHAR(10) NOT NULL DEFAULT '1.0',
  payload_schema VARCHAR(255) NOT NULL,    -- e.g., "soul.updated@1.0"
  payload JSONB NOT NULL,

  priority VARCHAR(20),                    -- "critical" | "high" | "medium" | "low"
  correlation_id UUID,
  trace_id VARCHAR(255),

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS Policy (Fail-Closed)
ALTER TABLE system_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON system_events
USING (
  current_setting('app.current_org_id', true) IS NOT NULL
  AND org_id = current_setting('app.current_org_id', true)::uuid
);
```

---

## Technical Constraints

| Constraint      | Source                    | Notes                          |
| --------------- | ------------------------- | ------------------------------ |
| Fastify 5.x     | Constitution Architecture | Schema-first, high-performance |
| Prisma 7.x      | Constitution Architecture | Typed queries with RLS         |
| PostgreSQL 16.x | Constitution Architecture | RLS, pgvector support          |
| Redis Streams   | Constitution Architecture | Event transport                |

---

## Open Questions

| Question                                     | Owner     | Status |
| -------------------------------------------- | --------- | ------ |
| Redis Streams consumer group configuration?  | Architect | Open   |
| Event retention policy (archival vs. purge)? | Architect | Open   |
| Rate limiting strategy for API endpoints?    | Architect | Open   |
| Vector DB selection for Episodic Memory?     | Architect | Open   |

---

## Document History

| Version | Date       | Author              | Changes                                                                         |
| ------- | ---------- | ------------------- | ------------------------------------------------------------------------------- |
| 1.0     | 2025-12-03 | Winston (Architect) | Initial scaffold for entity document structure                                  |
| 2.0     | 2025-12-03 | Winston (Architect) | Migrated content from Constitution PRD: Agent Architecture, Pulse, Soul, Memory |

---

_This module inherits constraints from the Constitution (docs/platform/prd.md). It can ADD requirements, never CONTRADICT parent constraints._
