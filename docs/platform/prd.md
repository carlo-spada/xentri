---
entity_type: constitution
document_type: prd
title: 'Xentri System PRD (Constitution)'
description: 'System-wide product requirements, platform requirements (PR-xxx), and integration contracts (IC-xxx) that all entities must follow.'
version: '5.0'
status: draft
created: '2025-11-25'
updated: '2025-12-03'
---

<!--
CONSTITUTION DOCUMENT

This PRD defines WHAT the product requires at the system level. For implementation details:
- Agent architecture, Pulse mechanics, Soul governance: docs/platform/core-api/prd.md
- Shell layout, Copilot Widget, navigation: docs/platform/shell/prd.md
- Event schemas, type contracts: docs/platform/ts-schema/prd.md
- Component specifications: docs/platform/ui/prd.md
-->

# Xentri - Product Requirements Document (System Constitution)

**Author:** Carlo
**Date:** 2025-12-03
**Version:** 4.0
**Level:** System (applies to ALL categories)

---

## Executive Summary

### The Problem

Small business owners and founders don't suffer from missing features — they suffer from being the **human router**. They're the only one who remembers that the late invoice affects the client relationship, which affects the sales pipeline, which contradicts the strategic pivot, which means they need to rethink hiring.

The result is chronic, low-grade anxiety: _"Something is probably dropping right now, and I don't know what."_

### The Solution

Xentri is an **agent-orchestrated Fractal Business Operating System** that eliminates the human router role entirely.

Seven AI copilots — **Strategy, Marketing, Sales, Finance, Operations, Team, and Legal** — form a **fractal agent network** that reasons across domains with shared context:

- **Strategy Copilot (Orchestrator):** Reads all category souls, writes only to the Universal Soul. Synthesizes cross-domain patterns into strategic insight.
- **Category Copilots (7):** Each owns its domain soul. Reads the Universal Soul for alignment. Manages specialized knowledge and tools.
- **Module Sub-agents:** Specialized in specific integrations (OAuth, MCP, APIs) within their parent category.

The copilots don't just collect information in silos or display it in dashboards. They **connect the dots**:

> _"Invoice #247 is 30 days overdue. This client is 40% of your revenue. Your strategy soul says reduce client concentration risk. You have a new lead in a different vertical. **Recommendation:** Follow up on the invoice, but prioritize the new lead — you're over-indexed on this client anyway."_

That's cross-domain reasoning. Not a feature. Not a workflow. An architecture.

### The Outcome

**Business confidence, not business anxiety.**

Not _"I hope nothing is dropping."_ But _"I know nothing is dropping — because the system would have told me."_

### What Makes This Special

**Agent-orchestrated, not AI-augmented.** The copilots aren't features — they're the foundation. The Universal Soul isn't a document — it's the business's living memory. The automation isn't magical — it's explainable.

**The positioning:**

- _"Stop being your business's human router."_
- _"Business confidence, not business anxiety."_
- _"The business that runs itself — and explains why."_

---

## Platform Requirements Index

> **Governance:** These are Constitution-level requirements. All Infrastructure Modules, Strategic Containers, Coordination Units, and Business Modules MUST comply. Changes require explicit rationale and governance review.

### Platform Requirements (PR-xxx)

| ID         | Requirement                                                                       | Implemented By |
| ---------- | --------------------------------------------------------------------------------- | -------------- |
| **PR-001** | All database tables MUST include `org_id` column with RLS policy                  | core-api       |
| **PR-002** | All mutations MUST emit events to Event Spine with standard envelope              | core-api       |
| **PR-003** | All API endpoints MUST require authentication except health checks                | core-api       |
| **PR-004** | All modules MUST read Soul through standard API, never write directly             | core-api       |
| **PR-005** | All user actions MUST respect permission primitives (view/edit/approve/configure) | core-api       |
| **PR-006** | All automated actions MUST be logged with human-readable explanation              | core-api       |
| **PR-007** | All modules MUST fail gracefully; never crash the shell                           | shell          |
| **PR-008** | All copilots MUST adapt vocabulary to Soul-indicated business type                | core-api       |

### Integration Contracts (IC-xxx)

| ID         | Contract                                                                  | Version | Defined In |
| ---------- | ------------------------------------------------------------------------- | ------- | ---------- |
| **IC-001** | Event Envelope Schema — `SystemEvent` interface definition                | v1.0    | ts-schema  |
| **IC-002** | Event Naming Convention — `xentri.{category}.{entity}.{action}.{version}` | v1.0    | ts-schema  |
| **IC-003** | Module Registration Manifest — Format for registering modules with shell  | v1.0    | shell      |
| **IC-004** | Soul Access API — `GET /api/v1/soul/{section}`                            | v1.0    | core-api   |
| **IC-005** | Recommendation Submission Protocol — How modules submit recommendations   | v1.0    | core-api   |
| **IC-006** | Notification Delivery Contract — How notifications are delivered to users | v1.0    | core-api   |
| **IC-007** | Permission Check Protocol — Permission primitives definition              | v1.0    | core-api   |

---

## Project Classification

**Technical Type:** SaaS B2B Platform (Agent-Orchestrated)
**Domain:** General (SMB Business Operations)
**Complexity Level:** Very High

### Classification Rationale

| Dimension         | Assessment | Notes                                                                                                                                                                         |
| ----------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Regulatory**    | Low        | No heavy compliance at platform level; domain-specific (CFDI, HIPAA) handled per module                                                                                       |
| **Architectural** | Very High  | Agent orchestration, event-driven backbone, multi-tenant RLS, hierarchical brief system. Requires solving novel problems in stateful agent memory and cross-domain reasoning. |
| **Feature**       | High       | Standard SaaS patterns built on sophisticated agent infrastructure with deep interconnectivity.                                                                               |

**This PRD's scope:** System-wide "big picture" requirements. Each module will have its own PRD managed by specialized agent teams.

---

## Product Soul Reference

**Path:** `docs/platform/product-soul.md`

### Key Elements Carried Forward

| Element                 | From Soul                                                                       |
| ----------------------- | ------------------------------------------------------------------------------- |
| **Vision**              | Modular Business OS — conversation first, not configuration                     |
| **Target Users**        | Service businesses, founders, agencies, creators, SMB owners                    |
| **Entry Point**         | Free Strategy Co-pilot + Universal Soul                                         |
| **Pricing Model**       | 5-tier personalized system ($0 → $10 → $30 → $90 → $270) + $5/module à la carte |
| **North Star**          | Weekly Active Revenue Events per Organization                                   |
| **Key Differentiators** | Clarity-first, visible automation, modular growth, personalized recommendations |

---

## Core Architecture Concepts

_Note: Implementation details live in module PRDs. This section defines product concepts only._

### The Three-Layer Fractal Architecture

| Layer                 | Cadence        | Question It Answers         | Nature                                         |
| --------------------- | -------------- | --------------------------- | ---------------------------------------------- |
| **Event Spine**       | Real-time      | "What happened?"            | Raw, immutable, complete — every action logged |
| **Operational Pulse** | User-scheduled | "What needs attention now?" | Synthesized, actionable — the calm daily view  |
| **Strategic Soul**    | Nightly        | "Who are we becoming?"      | Distilled patterns — the business DNA          |

### The Attention System

| Mode                    | Trigger             | Experience                                 |
| ----------------------- | ------------------- | ------------------------------------------ |
| **Critical Alert**      | P0 threshold breach | Immediate interrupt — phone buzzes         |
| **Daily Digest**        | User-scheduled time | Morning summary — "3 items need attention" |
| **Attention Dashboard** | On-demand           | Browse what's brewing — always current     |

### Implementation Details

> **For full implementation specifications, see:**
>
> - **Agent Architecture, Triangulation Logic, Pulse Mechanics:** `docs/platform/core-api/prd.md`
> - **Soul Governance, Tri-State Memory:** `docs/platform/core-api/prd.md`
> - **Hierarchical Pulse Views, Copilot Widget, War Room:** `docs/platform/shell/prd.md`

---

## Success Criteria

### MVP Success (v0.1–v0.9): Client Zero Validation

**The question:** Can Xentri run Xentri?

| Criterion                                   | Validation                                                        |
| ------------------------------------------- | ----------------------------------------------------------------- |
| Xentri's operations run on Xentri           | The team uses the product daily for actual work                   |
| Strategy Soul describes the Xentri business | Complete, current, actively referenced                            |
| Operational Pulse surfaces action items     | Team receives and acts on system-generated insights               |
| All categories have active modules          | At least one module per category (beyond copilots) in regular use |

### Growth Success (v1.0+): User-Driven Growth

| Metric                    | Target                           | Why It Matters                                                   |
| ------------------------- | -------------------------------- | ---------------------------------------------------------------- |
| **Referral Rate**         | >20% of new users from referrals | Users stake their reputation — strongest signal of value         |
| **Net Revenue Retention** | >100%                            | Expansion exceeds churn — product becomes more central, not less |
| **Monthly Active Orgs**   | Sustained unicorn-level growth   | Market pull, not just marketing push                             |

### Vision Success (v2.0+): Category Leadership

| Criterion            | Target                                                        |
| -------------------- | ------------------------------------------------------------- |
| Category recognition | Xentri recognized as "Business OS" leader in target segments  |
| Geographic presence  | Multi-geography — at least three continents                   |
| Center of operations | 20%+ of SMB users describe Xentri as their operational center |

---

## Product Scope

### Structural Model

```text
Shell (Astro)
└── Category (7 total)
    └── Sub-category (up to 10 per category) → SPA (React)
        └── Module (up to 10 per sub-category) → Tab within SPA
```

**Maximum theoretical scope:** 7 × 10 × 10 = 700 modules

### Infrastructure Module Structure (v4.0)

| Module    | Location             | PRD                              | Purpose                        |
| --------- | -------------------- | -------------------------------- | ------------------------------ |
| Shell     | `apps/shell`         | `docs/platform/shell/prd.md`     | Astro shell with React islands |
| Core API  | `services/core-api`  | `docs/platform/core-api/prd.md`  | Fastify + Prisma + RLS         |
| TS Schema | `packages/ts-schema` | `docs/platform/ts-schema/prd.md` | Shared contracts               |
| UI        | `packages/ui`        | `docs/platform/ui/prd.md`        | Design system                  |

### What's Explicitly Out of Scope

| Item                                       | Reason                       | Revisit When                    |
| ------------------------------------------ | ---------------------------- | ------------------------------- |
| Native mobile apps                         | PWA sufficient for MVP       | User demand signals need        |
| Enterprise features (SSO, audit logs)      | Not needed for SMB focus     | Enterprise segment emerges      |
| Industry-specific compliance (HIPAA, etc.) | Handled per-module if needed | Specific verticals targeted     |
| White-labeling                             | Complexity vs. value         | Partnership opportunities arise |

---

## Innovation & Validation

### The Core Innovation

**In one line:** _Fractal Agents that triangulate User Reality, Superior Intent, and Immutable Soul._

Most agents optimize for one thing: User Intent ("Do what the user asked").
Xentri agents optimize for **Alignment**: "Do what the user asked, _unless_ it violates the Strategy or the Soul."

### Validation Plan

| Phase      | Validation Method                                   |
| ---------- | --------------------------------------------------- |
| **MVP**    | Client Zero — Xentri runs Xentri                    |
| **Growth** | 3+ diverse business types validate generalizability |
| **Vision** | Market recognition as "Business OS" category leader |

---

## Personalization Principle

> **Migrated back from Constitution PRD v2.x**

**Xentri is not one-size-fits-all. It's the most personalized Business OS in the market.**

### The Problem with Traditional SaaS

Every CRM looks the same. Every invoicing tool has the same fields. Every project manager assumes the same workflow. Users spend hours configuring tools to match their business — or worse, they bend their business to match the tool.

A young doctor's practice, a boutique hotel, and a tech startup all need a "CRM" — but they need _completely different_ CRMs:

| Business    | Pipeline                                          | Key Fields                           | Workflow           |
| ----------- | ------------------------------------------------- | ------------------------------------ | ------------------ |
| **Doctor**  | Inquiry → Consultation → Treatment → Ongoing Care | Patient history, insurance, referral | Appointment-driven |
| **Hotel**   | Inquiry → Booking → Stay → Review                 | Room type, dates, guest preferences  | Reservation-driven |
| **Startup** | Lead → Qualified → Demo → Proposal → Close        | Company size, budget, decision maker | Deal-driven        |

They share one thing: they all need intelligent orchestration to run their business better.

### Soul-Aware Modules

**Modules configure themselves based on business context.**

```text
User completes Soul → Copilot reads Soul → Copilot configures module → User confirms or adjusts
```

The user's first experience isn't "fill out this form to configure your CRM." It's:

> _"Based on your Soul, I've set up your CRM with these stages: Inquiry → Consultation → Treatment Plan → Ongoing Care. Does this match how you work?"_

**One question, not fifty.** If it's wrong, they adjust. But the default is _intelligent_, not generic.

### Architectural Implications

| Aspect            | Traditional SaaS                | Xentri                                        |
| ----------------- | ------------------------------- | --------------------------------------------- |
| **Schema**        | Fixed tables, fixed columns     | Flexible — adapts to business type            |
| **Pipelines**     | Generic stages everyone shares  | Soul-informed stages based on business model  |
| **Fields**        | Same for everyone               | Copilot-configured based on context           |
| **Onboarding**    | "Choose your industry" dropdown | Soul already knows — auto-configures          |
| **Customization** | User builds from scratch        | User confirms or adjusts intelligent defaults |

### What Copilots Can Configure

Copilots don't just change labels — they **structurally configure** the system based on the Soul.

| Configuration              | What It Means                           | Examples                                                        |
| -------------------------- | --------------------------------------- | --------------------------------------------------------------- |
| **Pipeline stages**        | Define the workflow stages for a module | Doctor: Inquiry → Consultation → Treatment → Ongoing Care       |
| **Flexible fields**        | Add/remove entity attributes            | Doctor adds "Insurance Provider", Hotel adds "Room Preferences" |
| **Role suggestions**       | Recommend team roles based on business  | Restaurant: Chef, Server, Host, Manager                         |
| **Module recommendations** | Suggest which modules to activate       | Service business → Scheduling module                            |
| **Default settings**       | Pre-configure module behavior           | Invoice payment terms based on industry norms                   |
| **Workflow rules**         | Set up automation triggers              | Auto-remind after X days (based on industry patterns)           |

**The Principle:** Intelligent defaults, not locked constraints. Users can always override.

### The Competitive Moat

**Competitors compete on features. Xentri competes on fit.**

> _"The CRM that already knows your business."_

Every other tool makes you configure it. Xentri's tools configure themselves because they read your Soul.

### Design Mandate

**Every module must be Soul-aware.**

When designing any module, ask:

1. What does the Soul tell us about how this business works?
2. How can the copilot configure intelligent defaults?
3. What's the one question we ask instead of fifty?
4. How does the user adjust if we got it wrong?

Modules that can't answer these questions don't belong in Xentri.

---

## User Experience Principles

### The UX Hierarchy

| **Level**       | **Principle**          | **What It Means**                                                     |
| --------------- | ---------------------- | --------------------------------------------------------------------- |
| **Foundation**  | Calm, not noisy        | The system respects attention. Surface what matters when it matters.  |
| **Spatial**     | No-scroll, full-screen | The entire application fits the viewport. Zero scrolling.             |
| **Interaction** | Conversational-first   | Default is dialogue. Talk to accomplish, don't navigate to configure. |
| **Trust**       | Explain, don't hide    | Every automated action comes with "here's why."                       |
| **Continuity**  | Narrative awareness    | Each session continues the story. The system remembers where you are. |

### Implementation Details

> **For full UX specifications, see:**
>
> - **Layout, Sidebar, Copilot Widget:** `docs/platform/shell/ux-design.md`
> - **Chronicle/Efficiency Views:** `docs/platform/shell/ux-design.md`
> - **Design Tokens, Components:** `docs/platform/ui/ux-design.md`
> - **UX Principles, Themes:** `docs/platform/ux-design.md`

---

## SaaS Platform Requirements

### Subscription Model

| Tier                   | Price        | Nature                                                        |
| ---------------------- | ------------ | ------------------------------------------------------------- |
| **Free**               | $0/mo        | Strategy Copilot + Soul — prove value before asking for money |
| **Presencia**          | $20/mo       | Personalized ~3 module bundle                                 |
| **Light Ops**          | $60/mo       | Personalized ~8 module bundle                                 |
| **Professional**       | $180/mo      | Personalized ~24 module bundle                                |
| **Business in Motion** | $540/mo      | Personalized ~72 module bundle                                |
| **À la carte**         | $5/module/mo | Any module individually                                       |

### The Trust Moat

| Aspect              | Approach                                                                              |
| ------------------- | ------------------------------------------------------------------------------------- |
| **Data export**     | Always available, always complete. Users can leave anytime.                           |
| **Context lock-in** | The Soul, the copilot understanding, the configured modules — this can't be exported. |
| **Trust equation**  | The easier it is to leave, the more confident they are to stay.                       |

---

## Non-Functional Requirements

### Performance Requirements

| Operation                  | Target                           | Hard Limit         |
| -------------------------- | -------------------------------- | ------------------ |
| Navigation / route changes | Instant (< 100ms)                | < 500ms            |
| Standard CRUD operations   | Fast (< 300ms)                   | < 1s               |
| Copilot initial response   | Acceptable (< 1s to first token) | Streaming required |
| Soul context loading       | Instant (cached)                 | < 200ms from cache |

### Security Requirements

| Requirement                | Implementation                                                |
| -------------------------- | ------------------------------------------------------------- |
| **PR-001**: Data isolation | RLS on all tables; `org_id` required                          |
| Fail closed                | Missing org context = empty result, not error leak            |
| **PR-003**: Auth required  | All API endpoints require authentication except health checks |

### Reliability Requirements

| Tier         | Features                         | Target | Phase  |
| ------------ | -------------------------------- | ------ | ------ |
| **Critical** | Auth, Soul read, core navigation | 99.9%  | MVP    |
| **High**     | CRUD operations, event emission  | 99.5%  | MVP    |
| **Standard** | Copilot conversations, synthesis | 99%    | Growth |

### Observability Requirements

| What                 | Required Fields                                                         |
| -------------------- | ----------------------------------------------------------------------- |
| All API requests     | `trace_id`, `org_id`, `user_id`, `method`, `path`, `status`, `duration` |
| All events           | `event_id`, `type`, `org_id`, `actor`, `occurred_at`                    |
| Copilot interactions | `session_id`, `org_id`, `tokens_used`, `duration`                       |

### Compliance Requirements

| Requirement       | Implementation                      |
| ----------------- | ----------------------------------- |
| Right to access   | User can export all their data      |
| Right to deletion | User can request full data deletion |
| Data minimization | Collect only what's needed          |

---

## Risks & Mitigations

### Technical Risks

| Risk                                                               | Impact | Mitigation                                                    |
| ------------------------------------------------------------------ | ------ | ------------------------------------------------------------- |
| **Silent Drift** — Soul becomes generic                            | High   | Version diffs, Soul Stability Index, human-sovereign sections |
| **Context Latency** — "Magic" becomes frustration                  | High   | Aggressive caching, pre-computation, warm context             |
| **Agent Coherence** — Different copilots give contradictory advice | High   | Shared Soul as single source of truth                         |

### Product Risks

| Risk                                                    | Impact | Mitigation                                           |
| ------------------------------------------------------- | ------ | ---------------------------------------------------- |
| **Onboarding Cliff** — Users bounce before seeing value | High   | Progressive Soul, "first 5 minutes" design focus     |
| **Feature Creep** — Scope expands, MVP never ships      | High   | Strict "Xentri runs Xentri" scope, Client Zero first |

---

## Governance

### Protected Documents

| Document            | Location                        | Purpose                                                        |
| ------------------- | ------------------------------- | -------------------------------------------------------------- |
| System PRD          | `docs/platform/prd.md`          | Platform Requirements (PR-xxx), Integration Contracts (IC-xxx) |
| System Architecture | `docs/platform/architecture.md` | Technology decisions, patterns, ADRs                           |
| System UX Design    | `docs/platform/ux-design.md`    | UX principles, design system foundations                       |
| System Epics        | `docs/platform/epics.md`        | Cross-cutting initiatives, traceability matrix                 |
| Product Soul        | `docs/platform/product-soul.md` | Foundational vision, business DNA                              |

### Change Process

1. **Propose** — Create a PR with the proposed change and explicit rationale
2. **Flag** — Mark the change as constitutional: `docs(constitution): <description>`
3. **Review** — Required reviewers must approve before merge
4. **Document** — Update Document History with version bump and change summary

### Approval Requirements

| Change Type           | Required Reviewers                      |
| --------------------- | --------------------------------------- |
| New PR-xxx or IC-xxx  | PM + Architect                          |
| Modify existing PR/IC | PM + Architect + affected module owners |
| Governance changes    | Carlo (Owner)                           |

---

## Document History

| Version | Date       | Author               | Changes                                                                                                                                                                                       |
| ------- | ---------- | -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.0     | 2025-11-25 | Carlo + AI           | Initial PRD                                                                                                                                                                                   |
| 2.0     | 2025-11-28 | Carlo + BMAD Team    | Complete rewrite with party mode collaboration                                                                                                                                                |
| 2.1     | 2025-12-01 | Carlo + Winston      | Integrated UX review: hierarchical Pulse views, no-scroll constraint, copilot widget                                                                                                          |
| 2.2     | 2025-12-02 | Carlo + BMad Builder | Added Platform Requirements Index (PR-001 to PR-008, IC-001 to IC-007)                                                                                                                        |
| 3.0     | 2025-12-03 | Winston (Architect)  | Entity document structure: Added module doc references in header comment                                                                                                                      |
| 4.0     | 2025-12-03 | Winston (Architect)  | **Constitutional Redistribution:** Migrated implementation details to module PRDs (core-api, shell, ui, ts-schema). Constitution now contains PR/IC definitions and high-level concepts only. |
| 5.0     | 2025-12-03 | Winston (Architect)  | **Restored missing content:** Personalization Principle section (Soul-aware modules, competitive moat, design mandate). IC-006 restored to core-api/prd.md.                                   |

---

## Appendix: Glossary

| Term                  | Definition                                                                                                                  |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **Universal Soul**    | The living document describing a business's identity, strategy, and current state — the "DNA" that all copilots read        |
| **Category Copilot**  | AI agent specialized in one of the seven business categories (Strategy, Marketing, Sales, Finance, Operations, Team, Legal) |
| **Event Spine**       | Real-time log of all business events — the raw truth of what happened                                                       |
| **Operational Pulse** | Synthesized view of what needs attention — delivered on user's schedule                                                     |
| **Strategic Soul**    | Nightly synthesis of patterns into business DNA — the "who are we becoming" layer                                           |
| **War Room**          | Collaboration space where all copilots are present for cross-domain decisions                                               |
| **Client Zero**       | Xentri itself — the first customer, validating the architecture on a real business                                          |
| **Soul-aware**        | Modules that configure themselves based on business context from the Soul                                                   |
| **Human-sovereign**   | Soul sections that only the user can modify (vision, values, identity)                                                      |
| **AI-updateable**     | Soul sections that Strategy Copilot can modify automatically (operational metrics)                                          |

---

_This PRD is the constitution for the Xentri platform. All module PRDs inherit from and must comply with the requirements defined here. Implementation details live in module-specific PRDs._
