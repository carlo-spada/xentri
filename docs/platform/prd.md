---
level: system
doc_type: constitution
title: "Xentri System PRD (Constitution)"
description: "System-wide product requirements, platform requirements (PR-xxx), and integration contracts (IC-xxx) that all categories must follow."
---

# Xentri - Product Requirements Document (System Constitution)

**Author:** Carlo
**Date:** 2025-12-02
**Version:** 2.2
**Level:** System (applies to ALL categories)

---

## Executive Summary

### The Problem

Small business owners and founders don't suffer from missing features — they suffer from being the **human router**. They're the only one who remembers that the late invoice affects the client relationship, which affects the sales pipeline, which contradicts the strategic pivot, which means they need to rethink hiring.

The result is chronic, low-grade anxiety: *"Something is probably dropping right now, and I don't know what."*

### The Solution

Xentri is an **agent-orchestrated Fractal Business Operating System** that eliminates the human router role entirely.

Seven AI copilots — **Strategy, Marketing, Sales, Finance, Operations, Team, and Legal** — form a **fractal agent network** that reasons across domains with shared context:

- **Strategy Copilot (Orchestrator):** Reads all category briefs, writes only to the Universal Brief. Synthesizes cross-domain patterns into strategic insight.
- **Category Copilots (7):** Each owns its domain brief. Reads the Universal Brief for alignment. Manages specialized knowledge and tools.
- **Module Sub-agents:** Specialized in specific integrations (OAuth, MCP, APIs) within their parent category.

The copilots don't just collect information in silos or display it in dashboards. They **connect the dots**:

> *"Invoice #247 is 30 days overdue. This client is 40% of your revenue. Your strategy brief says reduce client concentration risk. You have a new lead in a different vertical. **Recommendation:** Follow up on the invoice, but prioritize the new lead — you're over-indexed on this client anyway."*

That's cross-domain reasoning. Not a feature. Not a workflow. An architecture.

### The Outcome

**Business confidence, not business anxiety.**

Not *"I hope nothing is dropping."* But *"I know nothing is dropping — because the system would have told me."*

### What Makes This Special

**Agent-orchestrated, not AI-augmented.** The copilots aren't features — they're the foundation. The Universal Brief isn't a document — it's the business's living memory. The automation isn't magical — it's explainable.

**The positioning:**

- *"Stop being your business's human router."*
- *"Business confidence, not business anxiety."*
- *"The business that runs itself — and explains why."*

---

## Platform Requirements Index

> **Governance:** These are Constitution-level requirements. All Infrastructure Modules, Strategic Containers, Coordination Units, and Business Modules MUST comply. Changes require explicit rationale and governance review.

### Platform Requirements (PR-xxx)

| ID | Requirement | Section Reference |
|----|-------------|-------------------|
| **PR-001** | All database tables MUST include `org_id` column with RLS policy | [Security Requirements](#security-requirements) |
| **PR-002** | All mutations MUST emit events to Event Spine with standard envelope | [Cross-cutting Capabilities](#cross-cutting-capability-requirements) |
| **PR-003** | All API endpoints MUST require authentication except health checks | [Security Requirements](#security-requirements) |
| **PR-004** | All modules MUST read Brief through standard API, never write directly | [Brief Access Patterns](#brief-access-patterns) |
| **PR-005** | All user actions MUST respect permission primitives (view/edit/approve/configure) | [Permission Model](#permission-model) |
| **PR-006** | All automated actions MUST be logged with human-readable explanation | [Observability Requirements](#observability-requirements) |
| **PR-007** | All modules MUST fail gracefully; never crash the shell | [Cross-cutting Capabilities](#cross-cutting-capability-requirements) |
| **PR-008** | All copilots MUST adapt vocabulary to Brief-indicated business type | [Context-Aware Interaction](#context-aware-interaction) |

### Integration Contracts (IC-xxx)

| ID | Contract | Section Reference |
|----|----------|-------------------|
| **IC-001** | Event Envelope Schema — `SystemEvent` interface definition | [Event Schema Requirements](#event-schema-requirements) |
| **IC-002** | Event Naming Convention — `xentri.{category}.{entity}.{action}.{version}` | [Event Schema Requirements](#event-schema-requirements) |
| **IC-003** | Module Registration Manifest — Format for registering modules with shell | [Sub-category Integration Contracts](#sub-category-integration-contracts) |
| **IC-004** | Brief Access API — `GET /api/v1/brief/{section}` | [Brief Access Patterns](#brief-access-patterns) |
| **IC-005** | Recommendation Submission Protocol — How modules submit recommendations | [Brief Access Patterns](#brief-access-patterns) |
| **IC-006** | Notification Delivery Contract — How notifications are delivered to users | [Cross-cutting Capabilities](#cross-cutting-capability-requirements) |
| **IC-007** | Permission Check Protocol — Permission primitives definition | [Permission Model](#permission-model) |

---

## Project Classification

**Technical Type:** SaaS B2B Platform (Agent-Orchestrated)
**Domain:** General (SMB Business Operations)
**Complexity Level:** Very High

### Classification Rationale

| Dimension | Assessment | Notes |
|-----------|------------|-------|
| **Regulatory** | Low | No heavy compliance at platform level; domain-specific (CFDI, HIPAA) handled per module |
| **Architectural** | Very High | Agent orchestration, event-driven backbone, multi-tenant RLS, hierarchical brief system. Requires solving novel problems in stateful agent memory and cross-domain reasoning. |
| **Feature** | High | Standard SaaS patterns built on sophisticated agent infrastructure with deep interconnectivity. |

**Project Type Signals:**

- Multi-tenant SaaS with organization hierarchy
- Subscription tiers with modular add-ons
- Dashboard-driven UI with calm, focused UX
- **AI agent orchestration as core architecture** (not bolt-on)
- Event-driven backend with explainability requirements

**This PRD's scope:** System-wide "big picture" requirements. Each module (CRM, Invoicing, Website Builder, etc.) will have its own PRD managed by specialized agent teams within each category.

---

## Product Brief Reference

**Path:** `docs/platform/orchestration/product-brief.md`

### Key Elements Carried Forward

| Element | From Brief |
|---------|------------|
| **Vision** | Modular Business OS — conversation first, not configuration |
| **Target Users** | Service businesses, founders, agencies, creators, SMB owners |
| **Entry Point** | Free Strategy Co-pilot + Universal Brief |
| **Pricing Model** | 5-tier personalized system ($0 → $10 → $30 → $90 → $270) + $5/module à la carte |
| **North Star** | Weekly Active Revenue Events per Organization |
| **Key Differentiators** | Clarity-first, visible automation, modular growth, personalized recommendations |

### Domain Brief

**Path:** N/A — General SMB domain, no specialized compliance requirements at platform level.

### Research Documents

| Document | Status |
|----------|--------|
| Market Research | Pending |
| Competitive Analysis | Pending |
| User Research | Pending |

---

## Core Architecture Concepts

*Note: Technical implementation details belong in `architecture.md`. This section defines the product concepts that drive the architecture.*

### The Three-Layer Fractal Architecture

Xentri processes business information through three layers, applied fractally at every level of the system:

| Layer | Cadence | Question It Answers | Nature |
|-------|---------|---------------------|--------|
| **Event Spine** | Real-time | "What happened?" | Raw, immutable, complete — every action logged |
| **Operational Pulse** | User-scheduled | "What needs attention now?" | Synthesized, actionable — the calm daily view |
| **Strategic Brief** | Nightly | "Who are we becoming?" | Distilled patterns — the business DNA |

**User experience:** These layers are invisible infrastructure. The user experiences one calm system that knows when to interrupt, when to summarize, when to act, and when to wait.

### The Attention System

The Operational Pulse delivers information through three modes:

| Mode | Trigger | Experience |
|------|---------|------------|
| **Critical Alert** | P0 threshold breach | Immediate interrupt — phone buzzes |
| **Daily Digest** | User-scheduled time | Morning summary — "3 items need attention" |
| **Attention Dashboard** | On-demand | Browse what's brewing — always current |

**Design principle:** The intelligence is in the *timing*, not in hiding information. Calm comes from trusting the system to surface what matters when it matters.

### The Fractal Agency Architecture

**Decision:** Every node in the hierarchy (Category, Sub-Category, Module) is an **autonomous agent** (Logically).

- *Physical Implementation:* Agents are grouped into **Category Swarms** (Python services) to optimize resources (see `architecture.md`).

**Crucial Distinction: Agent vs. Tool**

- **The Tool:** The deterministic code/API (e.g., `create_invoice()`, `database_table`).
- **The Agent:** The LLM reasoning layer that *uses* the tool.
- **The Rule:** A Manager Agent (e.g., Finance) **cannot** access the Child's Tools (e.g., Invoicing API) directly. It must ask the Child Agent (Invoicing) to do it.

**Hierarchy of Influence (The "Nudge"):**

- **Managers do not override; they "nudge".** A Manager sets **Objectives** and **Permissions** for its children, treating them like users.
- **Children have agency.** They receive the objective, check their "Soul" and "Local Context", and decide *how* to execute.

- **Level 1: Strategy (The Orchestrator):** The "Strategy" agent.
- **Level 2: Category (The Executive):** The "Marketing" agent.
- **Level 3: Sub-Category (The Manager):** The "Social Media" agent.
- **Level 4: Module (The Specialist):** The "Content Creation" agent.

**The Triangulation Logic:**
At any given level, the Agent must balance three distinct inputs to decide how to **ACT**:

1. **Immutable System Context (The Soul):**
    - *Source:* Xentri Developers (me).
    - *Content:* The "Constitution" of the module. What it *is*, what it *can do*, and its unshakeable rules.
    - *Editable by:* **Xentri Devs ONLY.** (User cannot change this).

2. **Superior Intent (The Strategy):**
    - *Source:* The Parent (Agent) (e.g., Owner → Orchestrator → Executive → Manager → Specialist).
    - *Content:* The relevant section of the Brief and Pulse. "We are focusing on growth this quarter."
    - *Editable by:* **Parent Agent.**

3. **User Reality (The Supervision):**
    - *Source:* The Human User (different users might have different permissions here).
    - *Content:* Direct commands, feedback asks, or corrections. "Don't post that today."
    - *Editable by:* **Users.**

**The Agentic Loop:**
The Agent reads (Soul + Superior Intent + User Reality) → **Synthesizes** → **ACTS** (Configures itself, executes task, emits events, etc.).

The User functions mainly as a **Supervisor** and **Feedback Provider**, NOT a direct **Operator**. The Module functions as an **Employee**, NOT a **Tool**.

### The Pulse Mechanics (Hierarchical Filtering)

How do we prevent noise? **Hierarchical Filtering.**

1. **Module Level (Local Context):**
    - The Module (e.g., Invoicing) detects an event (e.g., "Invoice Overdue").
    - It classifies importance (1-5) based on *local* context (e.g., "Is this a VIP client?").
    - It pushes relevant items to the **Sub-Category Pulse**.

2. **Sub-Category Level (Operational Context):**
    - The Sub-Category Copilot (e.g., Finance) reviews its Pulse.
    - It aggregates and re-classifies (1-5) based on *sub-category* context (e.g., "We have 10 overdue invoices, let's group them").
    - It pushes high-impact items to the **Category Pulse**.

3. **Category Level (Tactical Context):**
    - The Category Copilot reviews its Pulse.
    - It aggregates and re-classifies (1-5) them based on *category* goals (e.g., "Cash flow is stable, but this client is critical").
    - It pushes strategic items to the **Strategy Pulse**.

4. **Strategy Level (Strategic Context):**
    - The Strategy Copilot reviews the Strategy Pulse.
    - It makes the final decision based on the *Universal Brief* (e.g., "Ignore the invoice, call the client to save the relationship").

**Result:** The Owner sees only what survives four layers of intelligent filtering (unless they choose to dig deeper, because the rest of the information is still there, it just might have a lower priority and wasn't able to surface to a higher level filter).

### Hierarchical Pulse Views

**Decision:** Every level of the hierarchy exposes its own Pulse view.

| Level | Pulse View | Content | Who Sees It |
|-------|------------|---------|-------------|
| **Strategy** | Strategy Pulse | What survived all 4 layers of filtering | Owner/Founder — the CEO briefing |
| **Category** | Category Pulse | What's happening in that category | Category managers |
| **Sub-category** | Sub-category Pulse | What's happening in that sub-category | Team leads |
| **Module** | Module Pulse | What's happening in that specific module | Module users |

**Landing Logic:**

- User lands on their **highest-level available** Pulse based on permissions
- Multi-scope users land on **most recently used** scope
- Owner lands on Strategy Pulse by default

**Drilling Down:**

Users can always drill down from any Pulse to see more detail:

- Strategy Pulse → Click category → Category Pulse → Click sub-category → Sub-category Pulse → Click module → Module Pulse

Each level shows what was promoted from below, with links to the source for context.

### Context-Aware Copilot Widget

**Decision:** A draggable widget that summons the context-relevant copilot.

**Behavior:**

| State | Appearance | Function |
|-------|------------|----------|
| **Collapsed** | Small icon + notification badge | User-positionable anywhere on screen |
| **Panel** | Right or bottom panel | Shares screen with SPA content |
| **Full** | Replaces main content area | Full copilot focus, SPA hidden |

**Context Awareness:**

The widget shows the copilot relevant to the current view:

- Viewing Strategy Pulse → Strategy Copilot
- Viewing Finance category → Finance Copilot
- Viewing Invoicing module → Invoicing Sub-agent

**Response Modes:**

| Mode | When | Experience |
|------|------|------------|
| **Quick Answer** | Short question, collapsed widget | Streaming text in small overlay |
| **Full Interaction** | Complex question, expanded widget | Full chat with history and tools |

**Notification Badge:** Shows count of unread copilot suggestions and pending recommendations for the current scope.

### The War Room

A dedicated collaboration space where all category copilots are "present" — reading all briefs, contributing in real-time to cross-domain decisions.

**Use cases:**

- Quarterly planning — "What should we focus on next quarter?"
- Crisis response — "We just lost our biggest client. What do we do?"
- Opportunity evaluation — "Should we expand into this market?"

**Closing the loop:** War Room sessions generate a report distributed to all agents. During nightly synthesis, agents update their briefs based on decisions made. This is how cross-cutting decisions change the business DNA.

### Brief Governance

The Universal Brief contains two types of sections:

| Section Type | Who Can Modify | Examples |
|--------------|----------------|----------|
| **AI-Updateable** | Strategy Copilot (auto) | Revenue model, client mix, operational metrics |
| **Human-Sovereign** | User only (explicit approval) | Vision, values, identity, strategic direction |

**Recommendation flow:** Category copilots cannot write to the Universal Brief. They emit recommendation events that Strategy evaluates during nightly synthesis. High-impact or low-confidence recommendations are flagged for human decision.

**Safeguards identified via pre-mortem analysis:**

- **Against Silent Drift:** Brief is versioned; users can diff any two versions to see evolution
- **Against Recommendation Flood:** Confidence thresholds, decay on flagged items, backpressure signals
- **Tracking:** Brief Stability Index measures change velocity to detect over-reactivity

---

## Success Criteria

*These are honest metrics that reflect genuine value, not vanity. If users are referring, retaining, and expanding, the product is working.*

### MVP Success (v0.1–v0.9): Client Zero Validation

**The question:** Can Xentri run Xentri?

Before external customers, Xentri must prove the architecture works on a real business — its own.

| Criterion | Validation |
|-----------|------------|
| Xentri's operations run on Xentri | The team uses the product daily for actual work |
| Strategy Brief describes the Xentri business | Complete, current, actively referenced |
| Operational Pulse surfaces action items | Team receives and acts on system-generated insights |
| All categories have active modules | At least one module per category (beyond copilots) in regular use |

**Why Client Zero:** If an agent-orchestrated Business OS can't run a software business with strategy, marketing, sales, finance, operations, team, and legal needs — the architecture is theater.

### Growth Success (v1.0+): User-Driven Growth

**The question:** Are users getting genuine value?

| Metric | Target | Why It Matters |
|--------|--------|----------------|
| **Referral Rate** | >20% of new users from referrals | Users stake their reputation — strongest signal of value |
| **Net Revenue Retention** | >100% | Expansion exceeds churn — product becomes more central, not less |
| **Monthly Active Orgs** | Sustained unicorn-level growth | Market pull, not just marketing push |

**Philosophy:** These metrics are hard to game. Referrals require belief. Retention requires utility. Expansion requires increasing value.

### Vision Success (v2.0+): Category Leadership

**The question:** Is "Business OS" a real category, and do we own it?

| Criterion | Target |
|-----------|--------|
| Category recognition | Xentri recognized as "Business OS" leader in target segments |
| Geographic presence | Multi-geography — at least three continents |
| Center of operations | 20%+ of SMB users describe Xentri as their operational center |

**The ultimate measure:** Not market share. *Identity*. When SMBs think "how do I run my business?" — Xentri is the answer.

---

## Product Scope

### Structural Model

Xentri follows a hierarchical fractal architecture:

```text
Shell (Astro)
└── Category (7 total)
    └── Sub-category (up to 10 per category) → SPA (React)
        └── Module (up to 10 per sub-category) → Tab within SPA
```

**Maximum theoretical scope:** 7 × 10 × 10 = 700 modules

**MVP scope:** The modules Xentri needs to run itself as a business.

### Current Platform Status

**Epic 1 (Foundation) — Partially Complete, Needs Revision:**

| Component | Status | Notes |
|-----------|--------|-------|
| Astro Shell | ✅ Scaffolded | `apps/shell` — needs completion and deployment |
| Core API | ✅ Scaffolded | `services/core-api` — Fastify + Prisma |
| Shared Contracts | ✅ Scaffolded | `packages/ts-schema` — types and schemas |
| UI Components | ✅ Started | `packages/ui` — needs expansion |
| Deployment | ⚠️ Planned | **GCP Native (K8s)** — See `architecture.md` ADR-004 |
| Stack Validation | ✅ Complete | Hybrid Node/Python + K8s Topology confirmed |
| Event Spine | ⚠️ Partial | Needs review against three-layer architecture |

**Before new module development:** Epic 1 requires revision, recalibration, and validation. The foundation must be solid before building on it.

### MVP Scope (v0.1–v0.9)

**Philosophy:** Build the modules Xentri needs to operate as a business. Client Zero defines the scope organically — not a predetermined roadmap.

**Architectural requirements (Fractal Validation):**

- Full Shell → SPA → Module flow working end-to-end
- Full 4-Level Hierarchy operational (Strategy → Category → Sub-Category → Module)
- **Deep Validation:** One vertical fully implemented to Level 4 (Marketing → Website → Builder)
- **Wide Validation:** A second category active to Level 2/4 (Sales → CRM) to prove cross-category orchestration.
- Three-layer architecture functional (Event Spine → Operational Pulse → Strategic Brief) in all four levels
- War Room operational for cross-domain collaboration

**Example MVP Modules (The "Fractal Spike"):**

| Category | Sub-Category | Module | Purpose |
|----------|--------------|--------|---------|
| **Strategy** | *Orchestration* | **War Room** | Cross-domain reasoning |
| **Marketing** | **Website** | **Builder** | **Wide Check:** Proves Strategy can orchestrate multiple categories |
| **Sales** | **CRM** | **Lead Management** | **Deep Spike:** Proves Level 4 fractal logic (Local → Sub → Cat → Strat) |

**Estimated timeline:** <6 months (Focusing on depth over breadth allows this timeline despite fractal complexity).

**MVP is complete when:** Xentri runs entirely on Xentri (Client Zero validation checklist passes).

### Growth Scope (v1.0–v1.9)

**Trigger:** Client Zero validation complete; ready for external users.

**Focus:**

- Expand modules based on user demand, not predetermined roadmap
- Deepen each category with additional sub-categories
- Refine based on retention and expansion signals
- Add integrations users request (payment processors, external tools)

**Growth is successful when:** Referral, retention, and expansion metrics hit targets.

### Vision Scope (v2.0+)

**The full Business OS:**

- All seven categories richly populated
- Sub-categories covering major business functions
- Modules for specialized needs within each sub-category
- Multi-geography support (localization, compliance)
- Category leadership in target segments

**Vision is realized when:** 20%+ of SMB users describe Xentri as their center of operations across three continents.

### What's Explicitly Out of Scope

| Item | Reason | Revisit When |
|------|--------|--------------|
| Native mobile apps | PWA sufficient for MVP | User demand signals need |
| Enterprise features (SSO, audit logs) | Not needed for SMB focus | Enterprise segment emerges |
| Industry-specific compliance (HIPAA, etc.) | Handled per-module if needed | Specific verticals targeted |
| White-labeling | Complexity vs. value | Partnership opportunities arise |

---

## Innovation & Validation

### The Core Innovation

**In one line:** *Fractal Agents that triangulate User Reality, Superior Intent, and Immutable Soul.*

Everything else — Event Spine, nightly synthesis, War Room — is implementation of that core idea.

### The Innovation: Triangulation

Most agents optimize for one thing: User Intent ("Do what the user asked").
Xentri agents optimize for **Alignment**: "Do what the user asked, *unless* it violates the Strategy or the Soul."

**Defining "The Soul" (Immutable Context):**
This is the "Constitution" of the agent, provided by Xentri developers. It is technically implemented via:

1. **System Prompts:** The unchangeable core instructions (e.g., "You are a CFO. You prioritize solvency over growth. etc.").
2. **Hard-Coded Guardrails:** Logic the LLM cannot override (e.g., "Cannot transfer funds >$5k without 2FA").
3. **Fine-Tuning (Future):** Specialized models baked with domain expertise (e.g., a "Legal" model trained on contract law).

This "Soul" ensures the agent remains a professional employee, not just a compliant chatbot.

**Why this matters:**

| Pattern | Flow | State |
|---------|------|-------|
| **Traditional AI** | User → Query → AI → Response | Stateless — each conversation starts from zero |
| **Xentri Copilots** | User ↔ Copilot ↔ Brief ↔ Other Copilots | Stateful — memory accumulates and propagates |

Most AI tools are one-directional: you ask, they answer. Xentri's copilots read AND write to a shared memory structure. That's agent orchestration, not chatbot augmentation.

The Brief isn't a database. It's a shared consciousness that agents both consume and shape.

### The BMAD Validation

Xentri is being built using BMAD. Xentri's copilots are inspired by BMAD's agent architecture. This is not coincidence — this is the innovation testing itself.

**The proof:**

- BMAD agents orchestrate the *building* of Xentri (code, PRDs, architecture)
- Xentri copilots will orchestrate the *running* of businesses (strategy, sales, finance)
- Same pattern, different domain

If BMAD can build Xentri, then Xentri's copilots can run a business.

**The meta-validation:** This PRD was created through multi-agent collaboration — PM driving, Architect challenging, Analyst validating, Designer advocating for users. The pattern works. We're living proof.

### What We're NOT Innovating On

**Principle:** Innovate on orchestration. Use boring technology for tools.

| Component | Approach |
|-----------|----------|
| Website Builder | Evaluate existing solutions (GrapesJS, Craft.js) before building |
| CRM functionality | Standard patterns — contacts, deals, pipeline |
| Invoicing | Standard patterns — line items, taxes, PDF generation |
| Authentication | Use established providers (Clerk, Auth0) |
| Database | Postgres with RLS — proven, reliable |

The innovation is in how these tools *connect and reason together* — not in the tools themselves.

### The Data Flywheel (Moat)

The architecture enables a compounding advantage:

```text
More usage → Richer Brief → Better copilot performance → More usage
```

Competitors can copy the architecture. They cannot copy accumulated business context. The flywheel is the moat.

---

## Personalization Principle

**Xentri is not one-size-fits-all. It's the most personalized Business OS in the market.**

### The Problem with Traditional SaaS

Every CRM looks the same. Every invoicing tool has the same fields. Every project manager assumes the same workflow. Users spend hours configuring tools to match their business — or worse, they bend their business to match the tool.

A young doctor's practice, a boutique hotel, and a tech startup all need a "CRM" — but they need *completely different* CRMs:

| Business | Pipeline | Key Fields | Workflow |
|----------|----------|------------|----------|
| **Doctor** | Inquiry → Consultation → Treatment → Ongoing Care | Patient history, insurance, referral source | Appointment-driven |
| **Hotel** | Inquiry → Booking → Stay → Review | Room type, dates, guest preferences | Reservation-driven |
| **Startup** | Lead → Qualified → Demo → Proposal → Close | Company size, budget, decision maker | Deal-driven |

They share one thing: they all need intelligent orchestration to run their business better.

### Xentri's Approach: Brief-Aware Modules

**Modules configure themselves based on business context.**

```text
User completes Brief → Copilot reads Brief → Copilot configures module → User confirms or adjusts
```

The user's first experience isn't "fill out this form to configure your CRM." It's:

> *"Based on your Brief, I've set up your CRM with these stages: Inquiry → Consultation → Treatment Plan → Ongoing Care. Does this match how you work?"*

**One question, not fifty.**

If it's wrong, they adjust. But the default is *intelligent*, not generic.

### Architectural Implications

| Aspect | Traditional SaaS | Xentri |
|--------|------------------|--------|
| **Schema** | Fixed tables, fixed columns | Flexible — adapts to business type |
| **Pipelines** | Generic stages everyone shares | Brief-informed stages based on business model |
| **Fields** | Same for everyone | Copilot-configured based on context |
| **Onboarding** | "Choose your industry" dropdown | Brief already knows — auto-configures |
| **Customization** | User builds from scratch | User confirms or adjusts intelligent defaults |

**Technical approach:**

- Flexible entity schemas (JSON columns, configurable fields)
- Template system for module configurations
- Brief → Module Config mapping driven by copilots
- User override always available — intelligent defaults, not locked constraints

### What Copilots Can Configure

Copilots don't just change labels — they **structurally configure** the system based on the Brief.

| Configuration | What It Means | Examples |
|---------------|---------------|----------|
| **Pipeline stages** | Define the workflow stages for a module | Doctor: Inquiry → Consultation → Treatment → Ongoing Care<br>Hotel: Inquiry → Booking → Stay → Review<br>Startup: Lead → Qualified → Demo → Proposal → Close |
| **Flexible fields** | Add/remove entity attributes | Doctor adds "Insurance Provider", Hotel adds "Room Preferences", Startup adds "Company Size" |
| **Role suggestions** | Recommend team roles based on business type | Restaurant: Chef, Server, Host, Manager<br>Agency: Account Manager, Creative Director, Developer |
| **Module recommendations** | Suggest which modules to activate | Service business → Scheduling module<br>E-commerce → Inventory module |
| **Default settings** | Pre-configure module behavior | Invoice payment terms based on industry norms<br>Follow-up timing based on sales cycle |
| **Workflow rules** | Set up automation triggers | Auto-remind after X days (based on industry patterns)<br>Escalation rules based on client importance |

**The Principle:** Intelligent defaults, not locked constraints. Users can always override what the copilot configured.

**The Experience:**

```
User completes Brief
    → Copilot reads Brief
    → Copilot configures module (pipeline, fields, settings)
    → User sees: "I've set up your CRM with these stages: [stages]. Does this match how you work?"
    → User confirms, adjusts, or asks for alternatives
```

**One question, not fifty.** The copilot does the configuration work. The user validates.

### The Competitive Moat

**Competitors compete on features. Xentri competes on fit.**

> *"The CRM that already knows your business."*

Every other tool makes you configure it. Xentri's tools configure themselves because they read your Brief. This requires the entire **Fractal Brief Architecture** to work — it's not a feature you can bolt on.

### Design Mandate

**Every module must be Brief-aware.**

When designing any module, ask:

1. What does the Brief tell us about how this business works?
2. How can the copilot configure intelligent defaults?
3. What's the one question we ask instead of fifty?
4. How does the user adjust if we got it wrong?

Modules that can't answer these questions don't belong in Xentri.

---

## SaaS Platform Requirements

**Design mandate:** The buying experience IS part of the product. Personalization doesn't stop at modules — it shapes every interaction, including pricing.

### Multi-Tenancy

**Decision:** Multi-user architecture from day one.

Even solo operators get the architecture that supports growth. When they're ready to add team members, the foundation is already there.

| Principle | Implementation |
|-----------|----------------|
| Complete isolation | Organizations never see each other's data |
| Org-scoped everything | Every record, event, and brief belongs to exactly one org |
| Seamless growth | Adding first team member is a simple invite, not a migration |

### Permission Model

**Decision:** Primitives + owner-defined roles. No generic global roles.

**IC-007: Permission primitives:**

| Primitive | Meaning |
|-----------|---------|
| `view` | See data and reports |
| `edit` | Modify records and content |
| `approve` | Sign off on actions (refunds, discounts, publishes) |
| `configure` | Change module settings and workflows |

**Owner-defined roles:** Each organization composes primitives into roles that match *their* business.

| Example: Hotel | Permissions |
|----------------|-------------|
| Front Desk | view bookings, edit guest info, approve late checkout |
| Manager | all above + configure room types, approve refunds |
| Owner | full access + configure roles, manage billing |

| Example: Startup | Permissions |
|------------------|-------------|
| Sales Rep | view pipeline, edit deals, configure own templates |
| Sales Lead | all above + approve discounts, view team metrics |
| Founder | full access + configure roles, manage billing |

**Brief-aware defaults:** When a new user is invited, the copilot suggests an appropriate role based on the Brief and the inviter's description of their responsibilities.

### Subscription Model

**Decision:** Brief-informed recommendations primary. À la carte as escape hatch. Never a generic pricing grid.

**The flow:**

```text
User completes Brief
    → Copilot analyzes business needs
    → "Based on your Brief, you need Marketing and Finance modules. That's Light Ops at $60/mo."
    → User accepts, adjusts, or explores à la carte
```

**Tier structure (from Product Brief):**

| Tier | Price | Nature |
|------|-------|--------|
| **Free** | $0/mo | Strategy Copilot + Brief — prove value before asking for money |
| **Presencia** | $20/mo | Personalized ~3 module bundle |
| **Light Ops** | $60/mo | Personalized ~8 module bundle |
| **Professional** | $180/mo | Personalized ~24 module bundle |
| **Business in Motion** | $540/mo | Personalized ~72 module bundle |

| **À la carte** | $5/module/mo | Any module individually |

**Key principle:** The tier recommendation comes from the Brief, not a comparison table. Users see "here's what you need" not "here are your options."

**Billing activation:** Billing infrastructure built for v1.0 (Growth phase). Client Zero (v0.1–v0.9) operates without payment processing.

### The Trust Moat

**Statement:** "Perpetually improving symbiosis" — context portability is impossible. Easy data export builds trust.

| Aspect | Approach |
|--------|----------|
| **Data export** | Always available, always complete. Users can leave anytime. |
| **Context lock-in** | The Brief, the copilot understanding, the configured modules — this can't be exported. |
| **Trust equation** | The easier it is to leave, the more confident they are to stay. |

Competitors can import your contacts. They can't import the understanding that "this client represents 40% of revenue and your strategy says reduce concentration risk."

### Key Integrations

**Philosophy:** Integrate where users already live. Don't force them into Xentri for everything.

| Phase | Integrations | Rationale |
|-------|--------------|-----------|
| **MVP** | Authentication (Clerk), Email (transactional), basic file storage | Foundation only |
| **Growth** | Payment processors (Stripe), Calendar sync, Communication tools | User-demanded |
| **Vision** | Accounting systems, Industry-specific tools, WhatsApp Business API | Category expansion |

**Integration principle:** Xentri is the orchestration layer. It connects to tools, it doesn't replace all of them.

---

## User Experience Principles

**Philosophy:** Every session should feel like a chapter of a life-long story, not a transaction.

When the user opens Xentri, they're not "checking their dashboard." They're continuing *their* story. The system acknowledges continuity:

> *"Good morning. Yesterday you sent that proposal to Acme Corp. They haven't responded yet, but based on past patterns, they typically take 3 days. Nothing to do yet — I'll flag it if it goes quiet."*

That's not a notification. That's **narrative awareness**. The system knows where they are in their story.

### The UX Hierarchy

From foundation to polish:

| **Level** | **Principle** | **What It Means** |
|---|---|---|
| **Foundation** | Calm, not noisy | The system respects attention. Surface what matters when it matters. |
| **Spatial** | No-scroll, full-screen | The entire application fits the viewport. Zero scrolling. Content density respects screen real estate. |
| **Interaction** | Conversational-first | Default is dialogue. Talk to accomplish, don't navigate to configure. |
| **Fallback** | Forms when needed | Never force one pattern. Some users prefer structure. |
| **Trust** | Explain, don't hide | Every automated action comes with "here's why." |
| **Growth** | Progressive disclosure | Simple defaults for new users. Complexity on demand for power users. |
| **Coherence** | One unified voice | All copilots feel like Xentri. Different expertise, same personality. |
| **Adaptation** | Context-aware interaction | Language, tone, and terminology adapt to the business type. |
| **Continuity** | Narrative awareness | Each session continues the story. The system remembers where you are. |
| **Polish** | Delight in details | Micro-interactions that make users feel understood. "How did it know that?" moments. |
| **Aesthetics** | Theme-aware | Multiple themes (Modern, Power, Traditional) to match user preference. |

### No-Scroll Design Constraint

**Decision:** The entire application is a full-screen experience with zero scrolling.

**Rationale:** Scrolling creates cognitive overhead and hides information. A calm system shows everything that matters in a single view.

**Implications:**

| Component | Constraint |
|-----------|------------|
| **Sidebar** | Only one category expanded at a time; collapsible to icons for maximum SPA space |
| **Content area** | All Pulse views, forms, and content must fit viewport |
| **Module tabs** | Overflow handling required (if 10+ modules, show most-used + "more" overflow) |
| **Mobile** | Fundamentally different layout required (separate design needed) |

**Sidebar Behavior:**

1. Categories only in sidebar (7 items max)
2. Click category → sub-categories expand inline (shows only recommended + owned)
3. Click sub-category → SPA loads with module tabs at top
4. Only ONE category expanded at a time (accordion pattern)
5. Sidebar can collapse to icon-only mode for maximum SPA space

**Exception:** Long-form content (documentation, legal text, detailed reports) may scroll within a dedicated content area, but the shell frame remains fixed.

### Narrative-First Philosophy (Chronicle View)

**Decision:** The default experience is a journal-like "Chronicle" that tells the business story, not a dashboard of widgets.

**Core Elements:**

- **Chronicle View (Default):** "Since yesterday...", "Story Arcs", "Here's what developed."
- **Efficiency Toggle:** Power users can switch to a dense, list-based view.
- **Session Bridging:** System detects absence duration and generates a narrative recap on return.
- **Story Arcs:** Persistent threads that evolve across sessions (e.g., "Deal Negotiation - Day 3").

**Theme Architecture:**

- **Modern (Default):** Conversational, immersive, gradient accents.
- **Power:** High density, high contrast, speed-focused.
- **Traditional:** Professional, balanced, business-like.

### Context-Aware Interaction

The Brief doesn't just configure modules — it configures *language*.

| Business Type | Instead of... | The copilot says... |
|---------------|---------------|---------------------|
| Medical practice | "Your sales funnel" | "Your patient pipeline" |
| Hotel | "Your leads" | "Your booking inquiries" |
| Startup | "Your customers" | "Your users" or "your accounts" |
| Agency | "Your projects" | "Your client engagements" |

The copilot's vocabulary adapts to the user's world. This isn't just field labels — it's the entire interaction layer speaking the user's language.

### Narrative Continuity

Each session is a chapter, not a transaction.

**What this requires:**

- The copilot knows what happened since last session
- The copilot knows what's pending and why
- The copilot knows patterns ("they typically respond in 3 days")
- The copilot acknowledges the arc ("you've been focused on reducing client concentration")

**Example interaction:**

> *User opens Xentri on Tuesday morning.*
>
> **Copilot:** "Good morning. Quick update: Acme Corp responded to your proposal — they want to discuss pricing. I've drafted a reply based on your usual approach. Want to review it?
>
> Also, that invoice to Beta Inc hit 30 days today. Given they're a good client with no history of late payment, I'd suggest a friendly nudge rather than a formal notice. Want me to draft that too?"

This is not a dashboard. This is a *briefing*. The system knows the story.

### Architectural Requirement

**None of this UX is possible with stateless copilots.**

The "magic" depends on memory and continuously improving context engineering.

| Requirement | What It Means |
|-------------|---------------|
| **Session memory** | Conversation history persisted and retrievable |
| **Brief context** | Cached and loaded on every interaction |
| **Event awareness** | Recent events summarized and available |
| **Pattern recognition** | Historical analysis for "they typically take 3 days" |
| **Long-term synthesis** | RAG or similar for retrieving relevant past context |
| **Agent personality** | BMAD-style prompts defining behavior, tone, expertise per copilot |

**Performance requirement:** Context must be warm, not cold. Pre-computation and aggressive caching ensure the copilot responds quickly despite rich context. If context loading adds latency, the magic becomes frustration.

**The honest truth:** This is state-of-the-art context engineering. It's the hardest part of the product. It's also the part that makes everything else possible.

### The "Real Memory" Architecture

To support "Narrative Continuity" without clogging context windows, Xentri employs a **Tri-State Memory System** with **Temporal Compression**:

1. **Semantic Memory (The Brief):**
    - *What it is:* Structured business facts.
    - *Example:* "Client X is a VIP." "Strategy is Growth."
    - *Storage:* Relational DB (The Universal Brief).
    - *Usage:* Cached and loaded on every interaction.

2. **Episodic Memory (The Journal):**
    - *What it is:* Raw, time-based narrative of past experiences.
    - *Example:* "User clicked 'Create Invoice' at 10:00 AM."
    - *Storage:* Vector Database (RAG).
    - *Usage:* On-demand retrieval only ("What did I do last Tuesday?").

3. **Synthetic Memory (The Persona):**
    - *What it is:* Compressed, high-level synthesis of tone, preferences, and recurring patterns.
    - *Example:* "User prefers direct communication and usually works late on Tuesdays."
    - *Storage:* System Prompt / Cached Context.
    - *Usage:* Always present in context window.

**Temporal Compression Strategy (The "Folding" Algorithm):**
To prevent context bloat, Episodic Memory is recursively summarized ("folded") into Synthetic/Semantic memory:

- **Hourly:** Raw events → **Day Summary** (24h retention).
- **Daily:** Day Summaries → **Week Summary** (7d retention).
- **Weekly:** Week Summaries → **Month Summary** (4w retention).
- **Monthly:** Month Summaries → **Quarter Summary** (4q retention).
- **Quarterly:** Quarter Summaries → **Year Summary** (Permanent).

**Result:** The agent can answer "What did we achieve in 2025?" (Year Summary) just as easily as "What did I just do?" (Raw Events), without carrying gigabytes of text.

---

## Platform Integration Requirements

*This section defines the "constitution" — the rules and interfaces that all sub-categories must follow. Implementation details belong in sub-category PRDs.*

### PRD Hierarchy

| PRD Location | What It Contains |
|--------------|------------------|
| `platform/prd.md` | Constitution - system-wide rules, interfaces, integration contracts (this document) |
| `platform/orchestration/prd.md` | Cross-cutting coordination, deployment, DevOps |
| `platform/core-api/prd.md` | Core API endpoints, service architecture |
| `platform/shell/prd.md` | Shell implementation, routing, islands |
| `platform/ui/prd.md` | UI component specs, design system |
| `platform/ts-schema/prd.md` | Type definitions, validation schemas |

### The "Federated Soul" Registry

**Requirement:** The Platform must provide a mechanism to compose "Souls" (System Prompts) from two sources:

1. **Global DNA (Centralized):** Company values, tone, and core rules (managed by Strategy/User).
2. **Local Expertise (Decentralized):** Domain-specific instructions (managed by the Module Developer).

**Runtime:** The Agent boots with `Soul = Global_DNA + Local_Expertise`.

Each sub-category PRD inherits from this constitution and adds specific implementation requirements.

### Sub-category Integration Contracts

**Every sub-category must:**

| Requirement | Contract |
|-------------|----------|
| **Register with Shell** | Expose manifest with routes, navigation, permissions required |
| **Emit events** | All state changes emit to Event Spine with standard envelope |
| **Consume events** | Subscribe only to declared event types; handle gracefully if unavailable |
| **PR-004: Read Brief** | Access Brief through standard API; never write directly (use recommendation events) |
| **Respect permissions** | Check user permissions before every action; fail closed if unclear |
| **Authenticate users** | Use platform auth; never implement custom auth flows |

**IC-003: Module registration manifest:**

```yaml
# Example: What a sub-category provides to the shell
name: "sales-crm"
category: "sales"
subcategory: "pipeline"
routes:
  - path: "/sales/pipeline"
    component: "PipelineView"
navigation:
  label: "Pipeline"
  icon: "funnel"
  parent: "sales"
permissions_required:
  - "sales.pipeline.view"
events_emitted:
  - "xentri.sales.deal.created"
  - "xentri.sales.deal.updated"
events_consumed:
  - "xentri.brief.updated"
brief_fields_read:
  - "business_type"
  - "sales_cycle_length"
```

### API Type Mandates

**Use the right API for the right purpose:**

| Communication Pattern | API Type | Use Case | Example |
|-----------------------|----------|----------|---------|
| **CRUD operations** | REST | Standard data operations, module APIs | `GET /api/v1/deals` |
| **Complex internal services** | gRPC | High-throughput, typed service-to-service | Copilot ↔ Brief service |
| **Real-time updates** | WebSocket | Chat, live collaboration, presence | War Room, co-editing |
| **Event streaming** | Server-Sent Events (SSE) | Notifications, activity feeds | Operational Pulse delivery |
| **Flexible querying** | GraphQL | Client-driven data needs | Consider for v2.0+ |

**Versioning requirement:** All APIs must be versioned (`/api/v1/`, `/api/v2/`). Breaking changes require version bump.

**Error handling:** All APIs return Problem Details format (`application/problem+json`) with `type`, `title`, `status`, `detail`, `trace_id`.

### Cross-cutting Capability Requirements

**Every sub-category must implement:**

| Capability | Requirement |
|------------|-------------|
| **PR-002: Event emission** | All mutations emit events with standard envelope (see Event Schema below) |
| **PR-005: Permission checks** | Verify primitives (`view`, `edit`, `approve`, `configure`) before actions |
| **PR-006: Audit logging** | Log who did what when; include `trace_id` for correlation |
| **Brief awareness** | Read Brief on init; reconfigure on `xentri.brief.updated` events |
| **PR-007: Error boundaries** | Fail gracefully; never crash the shell; show meaningful error states |

**IC-006: Notification delivery contract:**

| Mode | Sub-category Responsibility | Infrastructure Responsibility |
|------|----------------------------|-------------------------------|
| **Critical** | Emit event with `priority: "critical"` | Deliver immediately via push |
| **Digest** | Emit event with `priority: "high"` or `"medium"` | Batch for scheduled delivery |
| **Dashboard** | Emit all events with `attention: true` | Display in Attention Dashboard |

**Search indexing:**

Sub-categories that produce searchable content must:

- Emit events with `searchable: true` flag
- Include `search_text` field with indexable content
- Update search index on create/update/delete

### UX Consistency Patterns

**Orchestration defines patterns. Sub-categories implement them.**

| Pattern | Orchestration Mandate | Sub-category Implementation |
|---------|----------------------|----------------------------|
| **Navigation** | Accordion menu: Category → Sub-category → Module | Shell builds; SPAs register |
| **Copilot interaction** | Conversational-first, form fallback, explain actions | Each copilot follows pattern |
| **Notifications** | 3 modes: Critical, Digest, Dashboard | Infrastructure delivers; modules emit |
| **Loading states** | Skeleton states; optimistic updates preferred | UI components provide |
| **Error states** | Meaningful message + retry option + support path | Standard error component |
| **Empty states** | Helpful prompt + action to populate | Module-specific content |

**Copilot interaction contract:**

All copilots must:

- Greet contextually (acknowledge continuity)
- Offer conversational path first
- Provide form/structured fallback on request
- Explain every automated action
- PR-008: Adapt vocabulary to Brief-indicated business type

### Event Schema Requirements

**Standard event envelope:**

```typescript
// IC-001: Event Envelope Schema
interface SystemEvent<TPayload = unknown> {
  // Identity
  id: string;                              // UUID, immutable
  type: string;                            // e.g., "xentri.sales.deal.created"
  occurred_at: string;                     // ISO8601 UTC

  // Tenant context
  org_id: string;                          // Required for all events
  actor: {
    type: "user" | "system" | "copilot";
    id: string;
  };

  // Schema
  envelope_version: "1.0";
  payload_schema: string;                  // e.g., "deal.created@1.0"
  payload: TPayload;

  // Routing
  priority?: "critical" | "high" | "medium" | "low";
  attention?: boolean;                     // Show in Attention Dashboard?
  searchable?: boolean;                    // Index for search?
  search_text?: string;                    // Indexable content

  // Tracing
  correlation_id?: string;                 // Workflow/thread ID
  trace_id?: string;                       // Distributed trace

  // Metadata
  meta: {
    source: string;                        // e.g., "sales-crm"
    environment: "local" | "staging" | "prod";
  };
}
```

**IC-002: Event naming convention:** `xentri.{category}.{entity}.{action}.{version}`

Examples:

- `xentri.sales.deal.created.v1`
- `xentri.finance.invoice.paid.v1`
- `xentri.brief.recommendation.submitted.v1`

### Brief Access Patterns

**IC-004: Reading the Brief:**

| Access Type | Method | Use Case |
|-------------|--------|----------|
| **Full Brief** | `GET /api/v1/brief` | Initial module configuration |
| **Specific section** | `GET /api/v1/brief/{section}` | Targeted reads (e.g., `business_type`) |
| **Subscribe to changes** | SSE `/api/v1/brief/stream` | React to Brief updates in real-time |

**Writing to the Brief:**

**IC-005: Recommendation Protocol**
Sub-categories **never write directly** to the Brief. Instead:

1. Emit `xentri.brief.recommendation.submitted` event
2. Include `target_section`, `recommendation`, `evidence`, `confidence`
3. Strategy Copilot evaluates during synthesis
4. If approved, Brief updates and `xentri.brief.updated` emitted

**Exception:** War Room sessions can approve recommendations in real-time with human present.

---

## Non-Functional Requirements

*Format: Principles + indicative ranges + hard limits + phase markers. This avoids false precision while providing clear guidance.*

### Performance Requirements

**Principle:** Users should never wait for the system without feedback.

**Response time budgets (by experience):**

| Experience | Target | User Perception |
|------------|--------|-----------------|
| **Instant** | < 100ms | No perception of delay |
| **Fast** | 100–300ms | Acknowledged, not annoying |
| **Acceptable** | 300ms–1s | Brief wait, loading indicator shown |
| **Slow** | 1–3s | Progress indication required |
| **Broken** | > 3s without feedback | **Defect** — unacceptable |

**By operation type:**

| Operation | Target | Hard Limit |
|-----------|--------|------------|
| Navigation / route changes | Instant (< 100ms) | < 500ms |
| Standard CRUD operations | Fast (< 300ms) | < 1s |
| Search queries | Fast (< 300ms) | < 1s |
| Copilot initial response | Acceptable (< 1s to first token) | Streaming required |
| Complex copilot operations | Slow with progress | Must show activity |
| Brief context loading | Instant (cached) | < 200ms from cache |

**Hard limits (defects):**

- Any operation > 3s without visual feedback = defect
- Any operation > 10s total = defect (must be backgrounded)
- Copilot response without streaming indication = defect

### Security Requirements

**Principle:** Security is binary. There is no "good enough."

**Multi-tenant isolation (MANDATE):**

| Requirement | Implementation |
|-------------|----------------|
| **PR-001**: Data isolation | RLS on all tables; `org_id` required |
| Fail closed | Missing org context = empty result, not error leak |
| No cross-tenant queries | Impossible by design, not by convention |
| Audit trail | All data access logged with `org_id`, `user_id`, `trace_id` |

**Authentication/authorization (MANDATE):**

| Requirement | Implementation |
|-------------|----------------|
| **PR-003**: Auth required | All API endpoints require authentication except health checks |
| Permission checks | Every action validates permission primitives |
| Session management | Secure, HTTP-only cookies; short-lived access tokens |
| No custom auth | Use platform auth only; no module-level auth implementations |

**Data handling (MANDATE):**

| Requirement | Implementation |
|-------------|----------------|
| Encryption at rest | All PII and business data encrypted |
| Encryption in transit | TLS 1.3 minimum for all connections |
| Secrets management | No secrets in code; environment variables or vault |
| PII handling | Scrub from logs; mask in error messages |

### Scalability Requirements

**Principle:** Build for today, design for tomorrow, revisit at triggers.

**MVP capacity targets (v0.1–v0.9):**

| Dimension | Target | Notes |
|-----------|--------|-------|
| Organizations | 1 (Client Zero) | Single-tenant behavior, multi-tenant architecture |
| Users per org | 10 | Foundation for team features |
| Events per day | 1,000 | Light operational load |
| Brief size | 100KB | Generous for single business |
| Concurrent copilot sessions | 5 | One per active user |

**Growth capacity (v1.0+):**

| Dimension | Target | Architecture Review Trigger |
|-----------|--------|----------------------------|
| Organizations | 1,000 | At 500 |
| Users per org | 50 | At 30 average |
| Events per day | 100,000 | At 50,000 |
| Brief size | 500KB | At 200KB average |
| Concurrent copilot sessions | 500 | At 250 |

**Scaling triggers (revisit architecture when):**

- Monthly infrastructure cost > $500
- p95 latency degrading trend over 2 weeks
- Database connection pool > 80% utilization
- Event processing backlog > 5 minutes

### Reliability Requirements

**Principle:** Different features have different criticality. Graceful degradation is acceptable.

**Availability tiers:**

| Tier | Features | Target | Phase |
|------|----------|--------|-------|
| **Critical** | Auth, Brief read, core navigation | 99.9% | MVP |
| **High** | CRUD operations, event emission | 99.5% | MVP |
| **Standard** | Copilot conversations, synthesis | 99% | Growth |
| **Best-effort** | Background jobs, analytics | 95% | Growth |

**Data durability (MANDATE):**

| Data Type | Durability | Recovery |
|-----------|------------|----------|
| Brief | 99.999% | Point-in-time recovery, versioned |
| Events | 99.99% | Immutable, replayable |
| User data | 99.99% | Daily backups, 30-day retention |
| Session/cache | Best-effort | Reconstructable from source |

**Graceful degradation rules:**

| Scenario | Acceptable Degradation |
|----------|----------------------|
| Copilot service down | Fall back to manual forms; show "assistant unavailable" |
| Event processing delayed | Queue events; process on recovery; show "syncing" |
| Search index stale | Show stale results with timestamp; async reindex |
| Third-party integration down | Cache last known state; retry with backoff |

**Hard limits:**

- Brief data loss = critical incident
- Auth failure allowing unauthorized access = critical incident
- Cross-tenant data leak = critical incident + immediate disclosure

### Observability Requirements

**Principle:** If it's not observable, it's not operable.

**Logging (MANDATE):**

| What | Required Fields |
|------|-----------------|
| All API requests | `trace_id`, `org_id`, `user_id`, `method`, `path`, `status`, `duration` |
| All events | `event_id`, `type`, `org_id`, `actor`, `occurred_at` |
| All errors | `trace_id`, `error_type`, `message`, `stack` (scrubbed) |
| Copilot interactions | `session_id`, `org_id`, `tokens_used`, `duration` |

**Tracing (MANDATE):**

| Requirement | Implementation |
|-------------|----------------|
| Distributed tracing | `trace_id` propagated across all services |
| Span hierarchy | Parent-child relationships for nested operations |
| Cross-service correlation | Same `trace_id` from shell to API to copilot |

**Metrics (MANDATE):**

| Metric | Purpose |
|--------|---------|
| Request latency (p50, p95, p99) | Performance monitoring |
| Error rate by endpoint | Reliability monitoring |
| Active sessions | Capacity planning |
| Event processing lag | Queue health |
| Copilot token usage | Cost monitoring |

### Testability Requirements

**Principle:** If it can't be tested in isolation, it shouldn't be deployed.

**Sub-category isolation (MANDATE):**

| Requirement | Implementation |
|-------------|----------------|
| Independent deployment | Each sub-category deployable without others |
| Mock dependencies | All external dependencies mockable |
| Contract tests | API contracts tested independently |
| Local development | Full sub-category runnable locally |

**Testing mandates:**

| Test Type | Requirement | Phase |
|-----------|-------------|-------|
| Unit tests | All business logic | MVP |
| Contract tests | All API boundaries | MVP |
| Integration tests | All database operations | MVP |
| E2E tests | Critical user flows | Growth |
| Load tests | Capacity validation | Growth |

**Coverage expectations:**

| Component | Target | Hard Limit |
|-----------|--------|------------|
| Business logic | 80% | 60% minimum |
| API routes | 90% | 70% minimum |
| UI components | 70% | 50% minimum |

### Compliance Requirements

**Principle:** Compliance is table stakes, not a feature.

**GDPR basics (MANDATE from MVP):**

| Requirement | Implementation |
|-------------|----------------|
| Right to access | User can export all their data |
| Right to deletion | User can request full data deletion |
| Data minimization | Collect only what's needed |
| Consent tracking | Record what user agreed to and when |
| Breach notification | Process for 72-hour disclosure |

**Data retention:**

| Data Type | Retention | Deletion |
|-----------|-----------|----------|
| Active org data | Indefinite while subscribed | 90 days after org deletion request |
| Event history | 2 years | Archived, then purged |
| Audit logs | 7 years | Legal requirement |
| Session data | 30 days | Auto-purge |

**Data export commitment:**

| Principle | Implementation |
|-----------|----------------|
| Full export | All user data exportable in standard formats (JSON, CSV) |
| No hostage data | Export always available, regardless of subscription status |
| Brief portability | Brief exportable in documented schema |

**The trust equation:** Easy export builds confidence to stay. Data hostage tactics erode trust.

---

## Risks & Mitigations

**Format:** Risk → Impact → Likelihood → Mitigation → Phase

### Technical Risks

| Risk | Impact | Likelihood | Mitigation | Phase |
|------|--------|------------|------------|-------|
| **Silent Drift** — Brief becomes generic, loses value | High | Medium | Version diffs, Brief Stability Index, human-sovereign sections | MVP |
| **Recommendation Flood** — Users ignore system, trust erodes | Medium | Medium | Confidence thresholds, decay, backpressure | MVP |
| **Context Latency** — "Magic" becomes frustration | High | High | Aggressive caching, pre-computation, warm context | MVP |
| **Copilot Dependency** — AI cost spike or degradation breaks UX | Medium | Medium | Fallback forms, graceful degradation, model abstraction | MVP |
| **Agent Coherence** — Different copilots give contradictory advice | High | Medium | Shared Brief as single source of truth, War Room for conflicts, orchestration synthesis | MVP |

### Product Risks

| Risk | Impact | Likelihood | Mitigation | Phase |
|------|--------|------------|------------|-------|
| **Client Zero Bias** — Modules fit software, not diverse SMBs | High | High | Early Growth validation with 3+ diverse business types | Growth |
| **Onboarding Cliff** — Users bounce before seeing value | High | High | Progressive Brief, "first 5 minutes" design focus | MVP |
| **Feature Creep** — Scope expands, MVP never ships | High | High | Strict "Xentri runs Xentri" scope, Client Zero validation before Growth features | MVP |
| **Hierarchy Complexity** — Category/Sub-category/Module confuses users | Low | Low | Clear navigation, copilot guides, never expose internal structure | MVP |

### Market Risks

| Risk | Impact | Likelihood | Mitigation | Phase |
|------|--------|------------|------------|-------|
| **Market Timing** — Too early = educate for competitors; too late = second mover | High | Medium | Client Zero validates fast, Growth phase tests market | Growth |
| **Commoditization** — Big players copy Brief concept | Medium | Medium | Data flywheel moat, first-mover context accumulation, personalization depth | Growth |

---

## Open Questions

### Decisions Made

| Question | Decision | Rationale |
|----------|----------|-----------|
| **Copilot architecture** | Fine-tuned over prompt-engineered | Better quality > faster implementation |
| **AI model selection** | Quality-first, cost-aware | Best available model within unit economics (can't have $100 API bill for $5/mo subscription on average) |
| **Geographic strategy** | English → Spanish → German → others | By market size; English regions first, then European languages |
| **Pricing for MVP** | Use existing tier table for internal reference | Finalize before v1.0 |
| **Tech stack validation** | Architect decides during architecture.md revision | Before Epic 2 |

### Questions by Decision Timeline

**Decide Before Epic 2:**

| Question | Owner | Notes |
|----------|-------|-------|
| Tech stack validation | Architect | Decide when revising architecture.md |
| Brief structure — sections, AI-updateable vs human-sovereign | Infrastructure team | Core architectural decision |

**Decide During Epic 2:**

| Question | Owner | Notes |
|----------|-------|-------|
| First sub-category name within Strategy | Strategy team | "Strategy Copilot" is placeholder — open to creative alternatives |
| Long-term memory approach (RAG vs alternatives) | AI/Infrastructure team | Technical spike needed |

**Decide Before Growth (v1.0):**

| Question | Owner | Notes |
|----------|-------|-------|
| Pricing finalization — tier boundaries, bundles | PM + Finance | Existing table as starting point |
| Module prioritization beyond Client Zero | PM | Consider user voting/demand system |
| "Quick start" onboarding path design | UX + PM | Critical for conversion |

### Explicitly Deferred

| Item | Revisit When |
|------|--------------|
| Enterprise features (SSO, audit logs) | Enterprise segment emerges |
| Native mobile apps | User demand signals need |
| Industry-specific compliance (HIPAA, etc.) | Specific verticals targeted |

---

## Next Steps

**Critical insight:** We've reached a point where multiple teams can work in parallel. Strategy team getting stuck doesn't block Marketing or Sales. This is the power of the constitution model — teams can move independently as long as they follow the contracts defined here.

### Immediate (This Week)

| Task | Owner | Notes |
|------|-------|-------|
| Finalize and approve this PRD | Carlo | Review, adjust, commit |
| Execute internal hierarchy restructuring | Carlo | Separate document, implementation underway |
| Review and recalibrate Epic 1 completion status | Architect (review) → Senior Dev (implement) → Carlo (coordinate) | Critical path item |

### Short-term (Next 2-4 Weeks)

**Infrastructure track:**

- Create infrastructure sub-category PRD (events, auth, billing, brief)
- Validate tech stack against revised vision
- Begin Brief system design

**Frontend track:**

- Create frontend sub-category PRD (shell, ui)
- Navigation pattern finalization
- First 5 Minutes Design Sprint — onboarding flow

**Strategy track:**

- Create Strategy sub-category PRD
- Define MVP modules for Strategy Copilot
- Brief Creation UX Prototype

### Medium-term (MVP Phase)

| Milestone | Description |
|-----------|-------------|
| **Copilot MVP** | Strategy Copilot operational and in use |
| **Brief system live** | Users can create and maintain Briefs |
| **Module development** | Continue implementing modules across categories |
| **Client Zero active** | Xentri actually runs on Xentri |

### UX-Specific Next Steps

| Initiative | Priority | Risk Addressed |
|------------|----------|----------------|
| **First 5 Minutes Design Sprint** | Critical | Onboarding Cliff |
| **Brief Creation UX Prototype** | High | "How does a user go from 'I have a business' to 'I have a Brief'?" — must feel organic - never an 'aha' moment|
| **Navigation Pattern Specs** | Medium | Hierarchy Complexity — improve on previous version |

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-11-25 | Carlo + AI | Initial PRD (superseded) |
| 2.0 | 2025-11-28 | Carlo + BMAD Team | Complete rewrite with party mode collaboration |
| 2.1 | 2025-12-01 | Carlo + Winston | Integrated UX review: hierarchical Pulse views, no-scroll constraint, copilot widget, sidebar behavior, expanded Brief-aware personalization |
| 2.2 | 2025-12-02 | Carlo + BMad Builder | Added Platform Requirements Index (PR-001 to PR-008, IC-001 to IC-007) — consolidated from scattered references per Federated Workflows Phase 6 |

### Contributors

This PRD was created through multi-agent collaboration using the BMAD method:

- **John (PM)** — Workflow driver, requirement synthesis
- **Winston (Architect)** — Technical validation, architecture implications
- **Mary (Analyst)** — Evidence requirements, validation criteria
- **Sally (UX Designer)** — User experience advocacy, interaction patterns
- **Victor (Innovation Strategist)** — Strategic differentiation, market positioning
- **Dr. Quinn (Problem Solver)** — Pre-mortem analysis, risk identification
- **Murat (Test Architect)** — Testability requirements, quality gates
- **Carson (Brainstorming Coach)** — War Room concept development
- **Sophia (Storyteller)** — Narrative framing
- **Maya (Design Thinking Coach)** — Empathy perspective

**Meta-validation:** This document is proof that the BMAD pattern works. The same agent orchestration we used to build this PRD is the pattern Xentri will use to run businesses.

---

## Appendix: Glossary

| Term | Definition |
|------|------------|
| **Universal Brief** | The living document describing a business's identity, strategy, and current state — the "DNA" that all copilots read |
| **Category Copilot** | AI agent specialized in one of the seven business categories (Strategy, Marketing, Sales, Finance, Operations, Team, Legal) |
| **Event Spine** | Real-time log of all business events — the raw truth of what happened |
| **Operational Pulse** | Synthesized view of what needs attention — delivered on user's schedule |
| **Strategic Brief** | Nightly synthesis of patterns into business DNA — the "who are we becoming" layer |
| **War Room** | Collaboration space where all copilots are present for cross-domain decisions |
| **Client Zero** | Xentri itself — the first customer, validating the architecture on a real business |
| **Brief-aware** | Modules that configure themselves based on business context from the Brief |
| **Human-sovereign** | Brief sections that only the user can modify (vision, values, identity) |
| **AI-updateable** | Brief sections that Strategy Copilot can modify automatically (operational metrics) |

---

*This PRD is the constitution for the Xentri platform. All sub-category PRDs inherit from and must comply with the requirements defined here.*
