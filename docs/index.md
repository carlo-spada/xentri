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

| Category | Purpose | Status |
|----------|---------|--------|
| [platform/](./platform/) | Core infrastructure - always present | Active |
| [strategy/](./strategy/) | Strategy & Clarity Engine | Planned |
| [brand/](./brand/) | Brand & Marketing | Planned |
| [sales/](./sales/) | Sales & Pipeline | Planned |
| [finance/](./finance/) | Finance & Accounting | Planned |
| [operations/](./operations/) | Operations & Projects | Planned |
| [team/](./team/) | Team & HR | Planned |
| [legal/](./legal/) | Legal & Compliance | Planned |

---

## Platform Modules (Active)

| Module | Purpose | Package |
|--------|---------|---------|
| [orchestration](./platform/orchestration/) | System-wide architecture, cross-cutting concerns | - |
| [shell](./platform/shell/) | Astro app shell, routing, React islands | `apps/shell` |
| [core-api](./platform/core-api/) | Authentication, events, organizations | `services/core-api` |
| [ts-schema](./platform/ts-schema/) | Shared TypeScript types and Zod schemas | `packages/ts-schema` |
| [ui](./platform/ui/) | Design system, shared components | `packages/ui` |

---

## Quick Links

### Getting Started
1. [Product Brief](./platform/orchestration/product-brief.md) — Vision and personas
2. [PRD](./platform/orchestration/prd.md) — Product requirements
3. [Architecture](./platform/orchestration/architecture.md) — Technical decisions
4. [Epics](./platform/orchestration/epics.md) — Implementation roadmap

### Operations
1. [Deployment Plan](./platform/orchestration/deployment-plan.md) — Railway deployment
2. [Incident Response](./platform/orchestration/incident-response.md) — Troubleshooting
3. [Testing Strategy](./platform/orchestration/testing-strategy.md) — Test philosophy

### Sprint Status
- [Epic Status](./platform/orchestration/sprint-artifacts/sprint-status.yaml) — Overall progress
- [Core API Stories](./platform/core-api/sprint-artifacts/) — API implementation
- [Shell Stories](./platform/shell/sprint-artifacts/) — Frontend implementation

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

*Last updated: 2025-11-27*
