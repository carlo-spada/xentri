# Xentri Documentation

> A clarity-first Business OS that starts with conversation, not configuration.

**Current Phase:** Epic 1 Foundation (Story 1.7 in review)
**Live API:** https://core-api-production-8016.up.railway.app

---

## Navigation

Documentation is organized by **category** and **module**. Each module is a full BMAD project with its own requirements, architecture, and sprint artifacts.

**Manifest:** [manifest.yaml](./manifest.yaml) — Machine-readable navigation for AI agents

---

## Categories

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

## Platform Sub-categories & Modules (Active)

| Sub-category | Module | Purpose | Package |
|--------------|--------|---------|---------|
| [orchestration](./platform/orchestration/) | - | Cross-cutting concerns, big picture | - |
| [frontend](./platform/frontend/) | [shell](./platform/frontend/shell/) | Astro app shell, routing, React islands | `apps/shell` |
| | [ui](./platform/frontend/ui/) | Design system, shared components | `packages/ui` |
| [backend](./platform/backend/) | [core-api](./platform/backend/core-api/) | Authentication, events, organizations | `services/core-api` |
| [shared](./platform/shared/) | [ts-schema](./platform/shared/ts-schema/) | TypeScript types and Zod schemas | `packages/ts-schema` |
| [infrastructure](./platform/infrastructure/) | - | Events, auth, billing, brief (planned) | - |

---

## Quick Links

### Getting Started
1. [Product Brief](./platform/orchestration/product-brief.md) — Vision and personas
2. [PRD](./platform/orchestration/prd.md) — Product requirements
3. [Architecture](./platform/orchestration/architecture.md) — Technical decisions + Module Roadmap
4. [Epics](./platform/orchestration/epics.md) — Implementation roadmap

### Strategic Decisions
- [ADR-005: SPA + Copilot First](./platform/orchestration/architecture/adr-005-spa-copilot-first.md) — Category build strategy
- [Module Roadmap](./platform/orchestration/architecture.md#11-module-composition-strategy--roadmap) — 16 foundational modules

### Operations
All operations documentation is consolidated in [Architecture § Deployment & Operations](./platform/orchestration/architecture.md#8-deployment--operations).

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

When starting a session, first determine which module you're working on:

1. Read [manifest.yaml](./manifest.yaml) to understand the structure
2. Ask: "Which module are you working on?"
3. Navigate to `docs/{category}/{module}/`
4. All paths resolve relative to the selected module

---

*Last updated: 2025-11-28*
