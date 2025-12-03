# Xentri Documentation

> A clarity-first Business OS that starts with conversation, not configuration.

**Current Phase:** Epic 1 Foundation (Story 1.7 in review)
**Live API:** https://core-api-production-8016.up.railway.app

---

## Navigation

Documentation follows a **Five Entity Types** model. Each entity inherits from its parent and can only add requirements.

**Manifest:** [manifest.yaml](./manifest.yaml) — Machine-readable navigation for AI agents (v4.0)

---

## Constitution

These documents define system-wide rules that ALL entities must follow. Located in `docs/platform/`.

| Document | Purpose |
|----------|---------|
| [Product Soul](./platform/product-soul.md) | Foundational vision — all work traces here |
| [PRD](./platform/prd.md) | Platform Requirements (PR-xxx), Integration Contracts (IC-xxx) |
| [Architecture](./platform/architecture.md) | System-wide technology decisions and patterns |
| [UX Design](./platform/ux-design.md) | System-wide UX principles and design system |
| [Epics](./platform/epics.md) | Cross-cutting initiatives and system-level roadmap |

---

## Infrastructure Modules (Platform)

Platform modules are flat (no subcategories) — terminal nodes with implementation only.

| Module | Purpose | Package | Status |
|--------|---------|---------|--------|
| [shell](./platform/shell/) | Astro app container, routing, React islands | `apps/shell` | Active |
| [ui](./platform/ui/) | Design system, shared components | `packages/ui` | Active |
| [core-api](./platform/core-api/) | Authentication, events, organizations | `services/core-api` | Active |
| [ts-schema](./platform/ts-schema/) | TypeScript types and Zod schemas | `packages/ts-schema` | Active |
| [orchestration](./platform/orchestration/) | Platform coordination, deployment | — | Active |
| events | Event Spine and Operational Pulse | — | Planned |
| auth | Authentication and permissions | — | Planned |
| billing | Subscription and payment processing | — | Planned |
| brief | Brief system storage and synthesis | — | Planned |

---

## Strategic Containers (Categories)

User-facing business categories with coordination units and business modules.

| Category | Codename | Purpose | Status |
|----------|----------|---------|--------|
| [strategy/](./strategy/) | Bridge | The Command Center — connection between vision and reality | Planned |
| [marketing/](./marketing/) | Stage | The Platform — amplifying the voice | Planned |
| [sales/](./sales/) | Exchange | The Marketplace — value for value | Planned |
| [finance/](./finance/) | Vault | The Storehouse — managing resources | Planned |
| [operations/](./operations/) | Engine | The Machine — execution and delivery | Planned |
| [team/](./team/) | Guild | The People — culture and growth | Planned |
| [legal/](./legal/) | Shield | The Protection — risk and compliance | Planned |

---

## Quick Links

### Strategic Decisions
- [ADR-005: SPA + Copilot First](./platform/orchestration/architecture/adr-005-spa-copilot-first.md) — Category build strategy
- [Module Roadmap](./platform/architecture.md#11-module-composition-strategy--roadmap) — 16 foundational modules

### Operations
- [Deployment Plan](./platform/orchestration/deployment-plan.md) — Platform deployment strategy
- [Incident Response](./platform/orchestration/incident-response.md) — Platform incident handling

### Sprint Status
- [Pulse](./platform/orchestration/pulse.md) — Cross-team coordination and system-wide progress
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

When starting a session, first determine which entity type you're working on:

1. Read [manifest.yaml](./manifest.yaml) to understand the Five Entity Types
2. Ask: "Which entity are you working on?"
3. Detect entity type from path:
   - `docs/platform/*.md` → Constitution
   - `docs/platform/{module}/` → Infrastructure Module
   - `docs/{category}/` → Strategic Container
   - `docs/{category}/{subcat}/` → Coordination Unit
   - `docs/{cat}/{subcat}/{mod}/` → Business Module
4. Remember: entities inherit from their **direct parent only** (Zero-Trust)

---

*Last updated: 2025-12-02*
