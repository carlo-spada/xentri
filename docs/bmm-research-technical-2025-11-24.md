# Technical Research Report: The Event Backbone

**Date:** 2025-11-24
**Prepared by:** Analyst (Mary)
**Focus:** Defining the "Event Backbone" and "Open Loop" Data Model.

---

## Executive Summary

**Headline:** A "Boring" Postgres Event Store is the secret weapon.
**Key Insight:** We don't need Kafka or complex Event Stores. A single Postgres table with `JSONB` payloads and `BRIN` indexes is sufficient for millions of events and allows for "Time Travel" debugging and "Calm View" generation.

---

## 1. The Event Backbone (Postgres)

**Objective:** Create an append-only log of *everything* that happens, with Postgres as the system of record and an outbox path to the architecture’s transport layer (Redis Streams → n8n).

### Schema Design (Finalized to match v0.1 contract)
We will use a single `system_events` table, aligned to the Event Model v0.1.

```sql
CREATE TABLE system_events (
  id UUID PRIMARY KEY,
  org_id UUID NOT NULL,
  event_type VARCHAR(64) NOT NULL, -- e.g., 'lead_created', 'quote_sent'
  occurred_at TIMESTAMPTZ NOT NULL, -- business time
  actor_id UUID NOT NULL,
  actor_type VARCHAR(16) NOT NULL, -- 'user' | 'system' | 'client'
  primary_entity_id UUID NOT NULL,
  primary_entity_type VARCHAR(32) NOT NULL, -- e.g., 'deal', 'invoice', 'client', 'followup'
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Time-range + org queries
CREATE INDEX idx_system_events_org_occurred_at ON system_events (org_id, occurred_at DESC);
-- Per-entity timelines
CREATE INDEX idx_system_events_entity ON system_events (primary_entity_type, primary_entity_id, occurred_at DESC);
-- Type-based filtering
CREATE INDEX idx_system_events_type ON system_events (event_type, org_id);
```

**Why this wins:**
1.  **Simplicity:** No new infrastructure (just Postgres) while supporting the architectural transport layer via an outbox publisher to Redis Streams.
2.  **Audit Trail:** We get a perfect history of *who* did *what* and *when* for free, per org.
3.  **Performance:** Targeted B-Tree indexes cover org, entity, and type queries; Postgres remains append-only for predictability.

---

## 2. The "Open Loop" Data Model (CQRS)

**Objective:** Derive "what needs attention" from events + entity data, while keeping Calm Prompt stateless and optionally materializing a projection for fast reads.

**Pattern:** **Transactional Outbox / Async Projections**
1.  **Write:** Event is written to `system_events`.
2.  **Project:** A worker (or trigger) updates a separate `open_loops` projection (read model).
3.  **Read:** The UI queries `open_loops` (fast, denormalized); the source of truth remains the event log + entities.

**The `open_loops` Projection (aligned with product loop types):**
*   `id`: UUID
*   `org_id`: UUID
*   `type`: `quote_needed` | `decision_pending` | `invoice_overdue` | `followup_due` | `new_lead`
*   `entity_type`: `deal` | `invoice` | `client` | `followup`
*   `entity_id`: UUID
*   `due_at`: TIMESTAMPTZ (when this loop becomes critical)
*   `severity`: `high` | `medium`
*   `suggested_action`: short code (e.g., `draft_quote`, `resend_invoice`, `check_in`)
*   `status`: `active` | `dismissed` | `resolved`
*   `created_at` / `updated_at`

---

## 3. TypeScript / API Contract

**Objective:** Type-safe events from Frontend to DB, mirroring the Postgres schema and shared event catalog.

**Pattern:** Discriminated Unions + Zod

```typescript
type EventActorType = 'user' | 'system' | 'client';

type PrimaryEntityType = 'deal' | 'invoice' | 'client' | 'followup';

type EventType =
  | 'lead_created'
  | 'quote_requested'
  | 'quote_sent'
  | 'quote_accepted'
  | 'quote_rejected'
  | 'invoice_issued'
  | 'payment_received'
  | 'followup_scheduled'
  | 'followup_sent'
  | 'followup_dismissed'
  | 'note_added';

type SystemEvent<T = Record<string, unknown>> = {
  id: string;
  org_id: string;
  event_type: EventType;
  occurred_at: string;
  actor: { id: string; type: EventActorType };
  primary_entity: { id: string; type: PrimaryEntityType };
  payload: T;
  created_at?: string;
};

const SystemEventSchema = z.object({
  id: z.string().uuid(),
  org_id: z.string().uuid(),
  event_type: z.enum([
    'lead_created',
    'quote_requested',
    'quote_sent',
    'quote_accepted',
    'quote_rejected',
    'invoice_issued',
    'payment_received',
    'followup_scheduled',
    'followup_sent',
    'followup_dismissed',
    'note_added',
  ]),
  occurred_at: z.string().datetime(),
  actor: z.object({
    id: z.string().uuid(),
    type: z.enum(['user', 'system', 'client']),
  }),
  primary_entity: z.object({
    id: z.string().uuid(),
    type: z.enum(['deal', 'invoice', 'client', 'followup']),
  }),
  payload: z.record(z.any()),
  created_at: z.string().datetime().optional(),
});
```

**Why this wins:**
*   **Compiler Safety:** You can't write an event with an unknown type/entity.
*   **Runtime Safety:** Zod catches bad data at the API gate.
*   **Autocomplete:** Shared types line up with the event catalog and DB schema.

---

**Sources:**
-   *Postgres Event Sourcing Patterns (JSONB + BRIN)*
-   *TypeScript Discriminated Unions Best Practices*
-   *CQRS Read Model Performance Analysis*
