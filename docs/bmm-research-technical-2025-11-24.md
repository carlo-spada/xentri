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

**Objective:** Create an append-only log of *everything* that happens.

### Schema Design (Finalized)
We will use a single `system_events` table.

```sql
CREATE TABLE system_events (
  id BIGSERIAL PRIMARY KEY,
  stream_id UUID NOT NULL, -- The Entity ID (e.g., Invoice ID)
  stream_type VARCHAR(32) NOT NULL, -- e.g., 'invoice', 'lead'
  event_type VARCHAR(64) NOT NULL, -- e.g., 'invoice.created'
  version INTEGER NOT NULL, -- Optimistic concurrency control
  payload JSONB NOT NULL, -- The data
  metadata JSONB, -- Actor ID, IP, Correlation ID
  occurred_at TIMESTAMPTZ DEFAULT NOW()
);

-- BRIN Index for high-speed time-range queries (Audit Log)
CREATE INDEX idx_events_occurred_at ON system_events USING BRIN (occurred_at);

-- B-Tree Index for fast Entity lookups (Rehydration)
CREATE INDEX idx_events_stream ON system_events (stream_id, version);
```

**Why this wins:**
1.  **Simplicity:** No new infrastructure (just Postgres).
2.  **Audit Trail:** We get a perfect history of *who* did *what* and *when* for free.
3.  **Performance:** `BRIN` indexes are tiny and fast for append-only logs.

---

## 2. The "Open Loop" Data Model (CQRS)

**Objective:** How do we derive "What's Next?"

**Pattern:** **Transactional Outbox / Async Projections**
1.  **Write:** Event is written to `system_events`.
2.  **Project:** A worker (or trigger) updates a separate `open_loops` table (Read Model).
3.  **Read:** The UI queries `open_loops` (fast, denormalized).

**The `open_loops` Table:**
*   `id`: UUID
*   `owner_id`: UUID (User)
*   `entity_id`: UUID (Link to source)
*   `title`: "Send Invoice to Acme Corp"
*   `status`: 'urgent' | 'waiting' | 'snoozed'
*   `score`: Integer (AI-calculated priority)

---

## 3. TypeScript / API Contract

**Objective:** Type-safe events from Frontend to DB.

**Pattern:** Discriminated Unions + Zod

```typescript
// 1. Define Event Types
type InvoiceCreated = {
  type: 'invoice.created';
  payload: { amount: number; due_date: string };
};

type InvoiceSent = {
  type: 'invoice.sent';
  payload: { sent_at: string; method: 'email' };
};

// 2. The Union
type SystemEvent = InvoiceCreated | InvoiceSent;

// 3. Zod Validator (Runtime Safety)
const SystemEventSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('invoice.created'), payload: ... }),
  z.object({ type: z.literal('invoice.sent'), payload: ... }),
]);
```

**Why this wins:**
*   **Compiler Safety:** You can't write an invalid event.
*   **Runtime Safety:** Zod catches bad data at the API gate.
*   **Autocomplete:** Developers get perfect suggestions for event payloads.

---

**Sources:**
-   *Postgres Event Sourcing Patterns (JSONB + BRIN)*
-   *TypeScript Discriminated Unions Best Practices*
-   *CQRS Read Model Performance Analysis*
