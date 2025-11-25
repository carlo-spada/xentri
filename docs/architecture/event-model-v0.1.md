# Event Backbone v0.1 – Architecture & Schema

## 1. Overview

The **Event Backbone** is the nervous system of Xentri OS.  
Instead of only storing “current state” (deals, invoices, etc.), Xentri records **what happened** as a stream of events.

For v0.1, we implement this as a **log-based architecture** using an append-only table in Postgres.  
Future versions can project this log into other systems (Redis, Kafka, n8n), but the core contract stays the same. This keeps the Postgres log as the **system of record**, while aligning with the broader architecture’s two-layer event system (Redis Streams for transport, n8n for orchestration) via an outbox-style publisher.

**Key invariants:**

- Events are **append-only**: no in-place updates, no logical deletes.
- Corrections happen by **emitting new events**, not editing history.
- Every event is **scoped to an org** and references a primary entity.

---

## 2. Core Event Schema

Every event in the system must conform to this structure.

### 2.1 Database Schema (Postgres)

Table: `system_events`

| Column               | Type        | Description                                       |
|----------------------|-------------|---------------------------------------------------|
| `id`                 | UUID        | Unique event ID                                   |
| `org_id`             | UUID        | Multi-tenant isolation                            |
| `event_type`         | VARCHAR     | e.g. `lead_created`, `quote_sent`                |
| `occurred_at`        | TIMESTAMPTZ | When the event actually happened (business time)  |
| `actor_id`           | UUID        | User/System/Client ID that caused it             |
| `actor_type`         | VARCHAR     | `user`, `system`, or `client`                    |
| `primary_entity_id`  | UUID        | ID of the main object (deal, invoice, client…)   |
| `primary_entity_type`| VARCHAR     | e.g. `deal`, `invoice`, `client`, `followup`     |
| `payload`            | JSONB       | Context-specific details                          |
| `created_at`         | TIMESTAMPTZ | When the record was inserted (storage time)      |

**Indexing (v0.1):**

- `idx_system_events_org_occurred_at (org_id, occurred_at DESC)`
- `idx_system_events_entity (primary_entity_type, primary_entity_id, occurred_at DESC)`
- `idx_system_events_type (event_type, org_id)`

These support:

- org-wide feeds / analytics,
- per-entity timelines,
- loop detection (by event type).

### 2.2 TypeScript Contract

(To be shared via `packages/ts-schema`)

```typescript
export type EventActorType = 'user' | 'system' | 'client';

export type PrimaryEntityType =
  | 'deal'
  | 'invoice'
  | 'client'
  | 'followup'; // extend as new modules are added

export type EventType =
  | 'brief_created'
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
  | 'note_added'; // from Inbox

export interface SystemEvent<T = any> {
  id: string;
  org_id: string;
  event_type: EventType;
  occurred_at: string; // ISO8601 timestamp (business time)
  actor: {
    id: string;
    type: EventActorType;
  };
  primary_entity: {
    id: string;
    type: PrimaryEntityType;
  };
  payload: T;
  created_at?: string; // storage time, optional for most clients
}

Notes:
	•	Clients should normally care about occurred_at (business time).
	•	created_at is mostly useful for debugging ingestion delays.

⸻

3. Initial Event Catalog (v0.1)

This catalog covers the minimum needed for:
	•	Xentri Inbox v0.1 (tagging leads / quote requests, adding notes),
	•	Calm Prompt & Open Loops v0.1 (quotes, decisions, invoices, follow-ups).

3.1 Lead & Deal Events
	•	lead_created
New potential client identified (from website form, Inbox, manual entry).
	•	quote_requested
Client asks for pricing/scope (often from Inbox tagging or form).
	•	quote_sent
Proposal / quote delivered to client (email, PDF, etc.).
	•	quote_accepted
Deal won (client has explicitly accepted).
	•	quote_rejected
Deal lost (client declined or request withdrawn).

3.2 Invoice & Payment Events
	•	invoice_issued
Official demand for payment sent to client.
	•	payment_received
Payment recorded (automatically via integration or manually).

3.3 Communication & Follow-up Events
	•	followup_scheduled
System or user plans a future touchpoint (e.g. “remind tomorrow”).
	•	followup_sent
Follow-up message actually delivered.
	•	followup_dismissed
Follow-up intentionally cancelled / marked as not needed.
	•	note_added
Note added to a client/deal/follow-up timeline (often from Inbox).

Future versions will extend this catalog with:
	•	message_ingested, support_ticket_created, booking_requested, etc.

⸻

4. Read API Patterns

These APIs will power timelines, feeds, and the Calm Prompt.

4.1 Get Events by Org

GET /api/v1/events?start_date=...&end_date=...
	•	Scope: current org inferred from auth token.
	•	Use cases:
	•	Activity feeds,
	•	Analytics / reporting,
	•	Debugging “what happened yesterday?”.

Optional parameters:
	•	event_type
	•	limit / cursor

4.2 Get Events by Entity

GET /api/v1/events?entity_type=deal&entity_id=...
	•	Use cases:
	•	Deal Timeline view,
	•	Client history,
	•	Invoice-specific audit.

Variants (for clarity later):
	•	GET /api/v1/entities/:entity_type/:entity_id/events

The Calm Prompt / LoopService will generally not call these directly; it will typically rely on precomputed projections or dedicated queries, but the patterns above define the baseline.

⸻

5. Technical Implementation Plan (v0.1)
	1.	Create migration for system_events table
	•	Schema as in §2.1.
	•	Include indexes listed there.
	2.	Create EventService in Core API
	•	Responsibilities:
	•	Validate incoming events (org, event_type, primary_entity).
	•	Insert into system_events table.
	•	Optionally emit hooks to internal subscribers (e.g. LoopService) later.
	•	Provide a simple emitEvent() function used across services.
	3.	Wire up initial event emitters
	•	From Xentri Inbox (v0.1):
	•	On “Mark as Lead” → emit lead_created.
	•	On “Mark as Quote Request” → emit quote_requested.
	•	On “Add Note” → emit note_added.
	•	From Deals/Quotes module:
	•	On quote creation/send → emit quote_sent.
	•	On accept/reject → emit quote_accepted / quote_rejected.
	•	From Invoicing module:
	•	On invoice creation/send → emit invoice_issued.
	•	On payment record → emit payment_received.
	•	From Follow-up logic:
	•	Scheduling → followup_scheduled.
	•	Sending → followup_sent.
	•	Cancelling/ignoring → followup_dismissed.
	4.	Expose initial read endpoints
	•	Implement endpoints described in §4.1 and §4.2.
	•	Use them to power:
	•	per-entity timelines in the UI,
	•	initial LoopService / Calm Prompt implementation.
	5.	Document usage guidelines
	•	Short dev note:
	•	“When you change important business state, also emit an event.”
	•	“Never modify or delete existing events; emit compensating events instead.”
	6.	Publish to the transport layer (per architecture)
	•	Outbox pattern from Postgres → Redis Streams for cross-service transport.
	•	n8n subscribes as the logic layer; Postgres remains the source of truth.
