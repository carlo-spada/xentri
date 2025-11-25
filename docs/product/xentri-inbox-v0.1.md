# Xentri Inbox (v0.1) – Product Definition

## 1. Overview

Xentri Inbox is **one of the first wedge modules** for Xentri OS.  
Its job is to be the entry point for **messy, conversational reality** (messages, form submissions, copy-pasted WhatsApp/email) and turn it into structured events the OS can understand.

Inbox does **not** try to be a full CRM. It is a **classification surface**:

> Messages in → human tagging → events out → Open Loops updated.

It complements the **Website + CMS** module (which creates leads via forms and pages) by centralizing and structuring incoming messages.

---

## 2. Scope (v0.1)

For v0.1, Xentri Inbox focuses on **manual ingestion and classification** with minimal automation.

### 2.1 Inputs

- **Website Contact Form (from Xentri Site/CMS):**
  - New form submissions are stored in a `messages` table and appear in Inbox automatically.
- **Manual Entry:**
  - “Log a message” flow where the user can paste:
    - WhatsApp messages
    - Email content
    - Notes from a call

Future versions (v0.2+) may add **direct connectors** (WhatsApp, email, Instagram, etc.), but v0.1 assumes manual copy-paste for non-site channels.

### 2.2 Core Actions (Tagging Flow)

The user reads a message and chooses an action. Each action emits an event into the Event Backbone.

1. **"Mark as Lead"**
   - If the sender is new:
     - Creates a `Client` entity (via Core API).
   - Emits: `lead_created`
   - Links message → client.

2. **"Mark as Quote Request"**
   - Opens a simple “Draft Deal” modal:
     - client (pre-filled if known),
     - short description,
     - optional value/notes.
   - On save:
     - Emits: `quote_requested`
     - Optionally creates a `Deal` entity via Core API.

3. **"Add Note"**
   - Adds a note attached to the client/message context.
   - Emits: `note_added` (for the client timeline)
   - Does **not** create an open loop by itself.

4. **"Ignore / Archive"**
   - Marks the message as handled with no event emission.
   - Used for spam, irrelevant or resolved messages.

(If we keep a `Log Task` action for v0.1, we can add: `task_created` here as a 5th action; otherwise leave tasks for a later iteration.)

---

## 3. Mapping Inbox → Events → Open Loops

Inbox **only** emits events.  
The **Calm Prompt / Open Loops service** interprets those events to derive what needs attention.

| User Action in Inbox         | Event Emitted     | Resulting Open Loop (Calm Prompt)         |
|------------------------------|-------------------|-------------------------------------------|
| Click "Mark as Quote Request"| `quote_requested` | **Quote Needed** (appears as open loop)   |
| Click "Mark as Lead"        | `lead_created`    | **New Lead** (in lists / upcoming)        |
| Click "Add Note"            | `note_added`      | None (enriches timeline only)             |
| Click "Ignore / Archive"    | —                 | None                                      |

Later versions can extend this mapping (e.g. `support_request_created`, `booking_requested`, etc.), but v0.1 stays focused on **leads and quote requests**.

---

## 4. UI Sketch (Owner / Team View)

### 4.1 Layout: 2-Pane Split

- **Left Pane – Conversation / Message List**
  - Tabs or filters:
    - All
    - New
    - Leads
    - Quote Requests
    - Archived
  - Each item shows:
    - Sender / client name (or “Unknown”)
    - Source (Website, Manual)
    - Time
    - Status (Tagged / Untagged)

- **Right Pane – Message Detail + Action Bar**
  - Full message content (body, form fields, any attachments metadata)
  - Context:
    - Linked client (if exists)
    - Past messages from same client (optional v0.1.5+)
  - **Action Bar** at the top:
    > [Mark as Lead] [Mark as Quote Request] [Add Note] [Archive]

  - Optional UX detail:
    - When the user selects text in the message, the relevant actions highlight, but v0.1 can work without selection awareness.

The goal is to let the owner (or team) clear the Inbox by **turning messages into events or archiving them**, without leaving this screen.

---

## 5. Module Boundaries

To keep Xentri Inbox focused and maintainable:

- **Inbox Module:**
  - **Reads from:** `messages` table (raw inputs from Website forms + manual entries).
  - **Writes to:** `system_events` (via Core API).
  - Does **not**:
    - implement deal pipelines,
    - implement invoicing logic,
    - own the client schema.

- **Core API / Other Modules:**
  - Own the actual `Client`, `Deal`, `Invoice` entities.
  - Compute and expose:
    - Open Loops (through a dedicated endpoint),
    - timelines per client/deal,
    - capacity or financial views.

Inbox is intentionally a **thin wedge**:  
it’s the UI where messy messages first become structured events, feeding the Event Backbone and, through that, the Calm Prompt and other Xentri OS capabilities.