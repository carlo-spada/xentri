# Xentri Documentation

> A clarity-first Business OS that starts with conversation, not configuration.

**Current Phase:** Epic 1 Foundation (Story 1.7 in review)
**Live API:** https://core-api-production-8016.up.railway.app

---

## Navigation

Documentation follows a **4-level hierarchy**. Each level inherits from above and can only add requirements.

**Manifest:** [manifest.yaml](./manifest.yaml) — Machine-readable navigation for AI agents (v3.0)

---

## Level 0: System Constitution

These documents define system-wide rules that ALL categories must follow.

| Document | Purpose |
|----------|---------|
| [Product Brief](./product-brief.md) | Foundational vision — all work traces here |
| [PRD (Constitution)](./prd.md) | Platform Requirements (PR-xxx), Integration Contracts (IC-xxx) |
| [Architecture](./architecture.md) | System-wide technology decisions and patterns |
| [UX Design](./ux-design.md) | System-wide UX principles and design system |
| [Epics](./epics.md) | Cross-cutting initiatives and system-level roadmap |

---

## Level 1: Categories

| Category | Purpose | Status | Meta |
|----------|---------|--------|------|
| [platform/](./platform/) | Core infrastructure - always present | Active | ✓ |
| [strategy/](./strategy/) | Strategy & Clarity Engine | Planned | |
| [marketing/](./marketing/) | Brand, website, and market presence | Planned | |
| [sales/](./sales/) | Sales & Pipeline | Planned | |
| [finance/](./finance/) | Finance & Accounting | Planned | |
| [operations/](./operations/) | Operations & Projects | Planned | |
| [team/](./team/) | Team & HR | Planned | |
| [legal/](./legal/) | Legal & Compliance | Planned | |

---

## Level 2-3: Platform Sub-categories & Modules (Active)

| Sub-category | Module | Purpose | Package |
|--------------|--------|---------|---------|
| [orchestration](./platform/orchestration/) | - | Platform coordination, deployment | - |
| [frontend](./platform/frontend/) | [shell](./platform/frontend/shell/) | Astro app shell, routing, React islands | `apps/shell` |
| | [ui](./platform/frontend/ui/) | Design system, shared components | `packages/ui` |
| [backend](./platform/backend/) | [core-api](./platform/backend/core-api/) | Authentication, events, organizations | `services/core-api` |
| [shared](./platform/shared/) | [ts-schema](./platform/shared/ts-schema/) | TypeScript types and Zod schemas | `packages/ts-schema` |
| [infrastructure](./platform/infrastructure/) | - | Events, auth, billing, brief (planned) | - |

---

## Quick Links

### Strategic Decisions
- [ADR-005: SPA + Copilot First](./platform/orchestration/architecture/adr-005-spa-copilot-first.md) — Category build strategy
- [Module Roadmap](./architecture.md#11-module-composition-strategy--roadmap) — 16 foundational modules

### Operations
- [Deployment Plan](./platform/orchestration/deployment-plan.md) — Platform deployment strategy
- [Incident Response](./platform/orchestration/incident-response.md) — Platform incident handling

### Sprint Status
- [Pulse](./pulse.md) — Cross-team coordination and system-wide progress
- [Epic Status](./platform/orchestration/sprint-artifacts/sprint-status.yaml) — Overall progress
- [Core API Stories](./platform/backend/core-api/sprint-artifacts/) — API implementation
- [Shell Stories](./platform/frontend/shell/sprint-artifacts/) — Frontend implementation

---

## Key Concepts

| Concept | Description |
|---------|-------------|
| **Universal Brief** | The DNA of a business, generated through AI conversation |
| **Event Backbone** | Immutable event log powering all cross-module intelligence |
| **Calm Prompt** | Daily view of what needs attention |
| **Open Loops** | Invisible commitments made visible |

---

## For AI Agents

When starting a session, first determine which level and area you're working on:

1. Read [manifest.yaml](./manifest.yaml) to understand the 4-level hierarchy
2. Ask: "Which level are you working on?"
   - Level 0 (System): `docs/`
   - Level 1 (Category): `docs/{category}/`
   - Level 2 (Sub-category): `docs/{category}/{subcategory}/`
   - Level 3 (Module): `docs/{category}/{subcategory}/{module}/`
3. Remember: lower levels INHERIT from higher levels

---

*Last updated: 2025-12-01*
