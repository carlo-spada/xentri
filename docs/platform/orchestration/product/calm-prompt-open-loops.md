# Calm Prompt & Open Loops (v0.1) – Product Definition

## 1. Concept

The **Calm Prompt** is the owner’s (and ops manager’s) single source of truth for:

> “What actually needs my attention right now?”

Instead of relying on memory, sticky notes, and dozens of tabs, Xentri derives an explicit list of **Open Loops** from the Event Backbone and presents them in a calm, prioritized view.

The Calm Prompt:

- **Does not** store its own state.
- **Does** derive state from events and entity data (deals, invoices, follow-ups).
- Is deliberately minimal – one screen that reduces open-loop anxiety.
- Implementation detail: the derived loops may be **materialized** into an `open_loops` projection table for fast reads, but the source of truth remains the event log + entity tables.

---

## 2. Defining “Open Loops” (v0.1)

An **Open Loop** is a *derived state* that:

1. Can be expressed in terms of events + current entity fields.
2. Requires some form of resolution (an action or an explicit dismissal).
3. Is important enough to justify attention from the owner/ops role.

For v0.1 we focus on the five loop categories defined in the Product Brief.

### 2.1 Loop Categories (Initial Set)

| Category            | Trigger Condition                                      | Resolution Condition                                 | Default Severity |
|---------------------|--------------------------------------------------------|------------------------------------------------------|------------------|
| **New Lead**        | `lead_created` exists, **no** interaction events yet  | `quote_requested` OR `followup_scheduled` OR `note_added` | Medium           |
| **Quote Pending**   | `quote_requested` exists and **no** `quote_sent`      | `quote_sent` emitted for the same deal              | High             |
| **Invoice Overdue** | `invoice_issued` exists, `due_date < now`, **no** `payment_received` | `payment_received` emitted for that invoice | High             |
| **Follow-up Due**   | `followup_scheduled` date ≤ now, **no** `followup_sent` / `followup_dismissed` | `followup_sent` OR `followup_dismissed` emitted | Medium           |
| **Brief Incomplete**| No `brief_created` (or latest brief payload marks `status: incomplete`) | `brief_completed` (or `brief_updated` with `status: complete`) | Medium           |

Notes:

- Loop state is **fully recomputable** from the underlying events and entity data.
- Severity can later be enriched (e.g. amount, client tier), but v0.1 uses fixed defaults.

---

## 3. Owner Home Wireframe (Low-fi)

The Calm Prompt surfaces Open Loops in two main sections.

### 3.1 Section 1 – Today’s Critical Loops (“Calm Prompt”)

Top of screen. A small, card-based list of **highest-severity, time-sensitive** loops.

Example cards:

> **Sarah / ACME Co**  
> 🔴 Quote Pending (Due: Tomorrow – Board Meeting)  
> [Draft Quote] [Dismiss]

> **Project Alpha / Invoice #102**  
> 🟠 Invoice Overdue (3 days)  
> [Resend Invoice] [Mark Paid]

> **Your Business Brief**  
> 🟡 Brief Incomplete (Finish to unlock bundles)  
> [Complete Brief] [Remind Me Later]

Principles:

- Max 5–7 items visible here by default (no scrolling stress).
- Actions:
  - **Primary**: push the loop forward (e.g. “Draft Quote”, “Resend Invoice”).
  - **Secondary**: allow explicit dismissal (`followup_dismissed`, “ignore for now”, etc.).

### 3.2 Section 2 – Upcoming (Next 7 Days)

Below the critical section, lighter-weight list.

Examples:

- **Tomorrow:** Quote Pending – Client B (Requested today, board review tomorrow)  
- **Wed:** Invoice #103 Due (Client C, $1,200)
- **New Lead:** "Client D" (Needs acknowledgement)

This section helps the owner/ops see *what’s coming* without it competing with today’s fires.

---

## 4. API Definition

The Calm Prompt UI consumes a dedicated API that operates on a projection of the **Event Backbone** (e.g. `system_events` + precomputed views).

### 4.1 Endpoint: `GET /api/v1/owner/open-loops`

This endpoint:

- Accepts the current user/org context (e.g. via JWT).
- Applies the loop rules in §2.1.
- Returns two main buckets: `critical` and `upcoming`.

**Response (example):**

```json
{
  "critical": [
    {
      "id": "loop_123",
      "type": "quote_pending",
      "client_name": "Sarah / ACME Co",
      "entity_type": "deal",
      "entity_id": "deal_456",
      "due_at": "2025-11-25T10:00:00Z",
      "severity": "high",
      "suggested_action": "draft_quote"
    },
    {
      "id": "loop_124",
      "type": "invoice_overdue",
      "client_name": "Project Alpha / Client X",
      "entity_type": "invoice",
      "entity_id": "inv_102",
      "due_at": "2025-11-20T00:00:00Z",
      "severity": "high",
      "suggested_action": "resend_invoice"
    }
  ],
  "upcoming": [
    {
      "id": "loop_200",
      "type": "brief_incomplete",
      "entity_type": "brief",
      "entity_id": "org_brief",
      "due_at": "2025-11-26T10:00:00Z",
      "severity": "medium",
      "suggested_action": "complete_brief"
    }
  ]
}

Later extensions might include:
	•	Pagination / cursor support.
	•	Filters by loop type, client, amount.
	•	Separate endpoints for different roles (e.g. owner vs team member).

5. Implementation Strategy (v0.1)

5.1 Backend – LoopService
	•	Reads from:
	•	system_events (append-only event log)
	•	Core entities (deals, invoices, followups) in the Core API.
	•	Applies the loop rules from §2.1:
	•	Evaluates trigger + resolution conditions.
	•	Computes due_at, severity, and suggested_action (simple mapping table).
	•	Exposes:
	•	GET /api/v1/owner/open-loops (as above).

The LoopService does not mutate core entities; it purely derives and aggregates.

5.2 Frontend – Calm Prompt Dashboard
	•	A single dashboard component in the Shell (Owner Home).
	•	Responsibilities:
	•	Call GET /api/v1/owner/open-loops.
	•	Render:
	•	“Today’s Critical Loops” cards.
	•	“Upcoming (Next 7 Days)” list.
	•	Dispatch actions to other modules:
	•	e.g. “Draft Quote” opens the Deals/Quotes UI.
	•	“Resend Invoice” calls the Billing module.
	•	“Dismiss” emits a followup_dismissed or equivalent event.

The Calm Prompt itself remains visually calm and functionally thin – it orchestrates attention, not business logic.

⸻

6. Extensibility (Future Loops, v0.2+)

v0.1 intentionally ships with a small, high-impact set of Open Loops.

Future versions can add more categories, for example:
	•	Onboarding Stuck: client created but no first project started within N days.
	•	Project at Risk: project with overdue tasks and high value.
	•	Retention Risk: key client with no interaction in N days.

All future loops must follow the same pattern:

Define in terms of events + entity state → derive → show → resolve via explicit actions.
