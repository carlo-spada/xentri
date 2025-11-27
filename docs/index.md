# Xentri Documentation Index

Project documentation for Xentri - a clarity-first Business OS that starts with conversation, not configuration.

**Current Phase:** Epic 1 Foundation (Story 1.7 in review)
**Live API:** https://core-api-production-8016.up.railway.app

---

## Core Documents

Primary artifacts defining the product vision, requirements, and architecture.

| Document | Purpose |
|----------|---------|
| [product-brief-Xentri-2025-11-24.md](./product-brief-Xentri-2025-11-24.md) | Complete product vision, personas, and market positioning |
| [prd.md](./prd.md) | Product Requirements Document for v0.1-v0.2 MVP |
| [architecture.md](./architecture.md) | Technical architecture decisions and system design |
| [epics.md](./epics.md) | Epic and story breakdown for implementation |
| [ux-design-specification.md](./ux-design-specification.md) | UX patterns, flows, and component specifications |
| [backlog.md](./backlog.md) | Product backlog and future items |

---

## DevOps & Operations

Deployment, operations, and incident response documentation.

| Document | Purpose |
|----------|---------|
| [deployment-plan.md](./deployment-plan.md) | Railway deployment guide with step-by-step instructions |
| [incident-response.md](./incident-response.md) | Incident runbook and troubleshooting guide |
| [k8s-migration-runbook.md](./k8s-migration-runbook.md) | Kubernetes migration triggers and checklist |
| [testing-strategy.md](./testing-strategy.md) | Test categories, coverage requirements, CI integration |

---

## Architecture Documents

Technical architecture deep-dives.

| Document | Purpose |
|----------|---------|
| [architecture/adr-004-railway-bootstrap.md](./architecture/adr-004-railway-bootstrap.md) | ADR: Railway Bootstrap Strategy decision |
| [architecture/event-model-v0.1.md](./architecture/event-model-v0.1.md) | Event Backbone schema and patterns |

---

## Sprint Artifacts

Implementation artifacts for current sprint (Epic 1).

**Status File:** [sprint-artifacts/sprint-status.yaml](./sprint-artifacts/sprint-status.yaml)

### Story Files

| Story | Status | Description |
|-------|--------|-------------|
| [1-1-project-initialization-infrastructure.md](./sprint-artifacts/1-1-project-initialization-infrastructure.md) | Done | Turborepo, CI/CD, base infrastructure |
| [1-2-event-backbone-database-schema.md](./sprint-artifacts/1-2-event-backbone-database-schema.md) | Done | Prisma schema, RLS policies |
| [1-3-user-authentication-signup.md](./sprint-artifacts/1-3-user-authentication-signup.md) | Done | Clerk integration, auth middleware |
| [1-4-organization-creation-provisioning.md](./sprint-artifacts/1-4-organization-creation-provisioning.md) | Done | Org webhooks, provisioning |
| [1-5-application-shell-navigation.md](./sprint-artifacts/1-5-application-shell-navigation.md) | Done | Astro shell, React islands |
| [1-6-thin-vertical-slice-signup-brief-event.md](./sprint-artifacts/1-6-thin-vertical-slice-signup-brief-event.md) | Done | End-to-end signup → Brief flow |
| [1-7-devops-observability-test-readiness.md](./sprint-artifacts/1-7-devops-observability-test-readiness.md) | Review | Logging, CI gates, Railway deploy |

### Tech Specs

| Document | Purpose |
|----------|---------|
| [sprint-artifacts/tech-spec-epic-1.md](./sprint-artifacts/tech-spec-epic-1.md) | Technical specification for Epic 1 |

---

## Research Documents

Market, competitive, and technical research conducted during discovery.

All research docs are in [bmm-research/](./bmm-research/):

| Document | Purpose |
|----------|---------|
| [brainstorming-session-results-2025-11-24.md](./bmm-research/brainstorming-session-results-2025-11-24.md) | Initial product brainstorming |
| [bmm-research-market-2025-11-24.md](./bmm-research/bmm-research-market-2025-11-24.md) | Market size and trends |
| [bmm-research-competitive-2025-11-24.md](./bmm-research/bmm-research-competitive-2025-11-24.md) | Competitive landscape |
| [bmm-research-technical-2025-11-24.md](./bmm-research/bmm-research-technical-2025-11-24.md) | Technical feasibility |
| [bmm-research-customer-2025-11-24.md](./bmm-research/bmm-research-customer-2025-11-24.md) | Customer segments |
| [bmm-research-industry-2025-11-24.md](./bmm-research/bmm-research-industry-2025-11-24.md) | Industry context |
| [bmm-research-deep-prompts-2025-11-24.md](./bmm-research/bmm-research-deep-prompts-2025-11-24.md) | Deep research prompts |

---

## Product Concepts

Feature designs and product explorations.

| Document | Purpose |
|----------|---------|
| [product/calm-prompt-open-loops.md](./product/calm-prompt-open-loops.md) | Open Loops and Calm Prompt design |
| [product/xentri-inbox-v0.1.md](./product/xentri-inbox-v0.1.md) | Unified inbox concept |

---

## UX Design Artifacts

Visual prototypes and wireframes.

| File | Description |
|------|-------------|
| [ux-color-themes-v2.html](./ux-color-themes-v2.html) | Color palette exploration |
| [ux-daily-loop-wireframes-v2.html](./ux-daily-loop-wireframes-v2.html) | Daily Loop dashboard wireframes |
| [ux-journey-1-ftu.html](./ux-journey-1-ftu.html) | First-time user journey wireframes |

---

## Validation & Readiness

Quality checks and readiness assessments.

| Document | Purpose |
|----------|---------|
| [implementation-readiness-report-2025-11-26.md](./implementation-readiness-report-2025-11-26.md) | Pre-implementation readiness check |
| [validation-report-20251128T140500Z.md](./validation-report-20251128T140500Z.md) | PRD validation |
| [test-design-system.md](./test-design-system.md) | Design system test specs |

---

## Workflow Status

- [bmm-workflow-status.yaml](./bmm-workflow-status.yaml) - BMAD workflow progress tracker

---

## Quick Links

**Start Here:**
1. [Product Brief](./product-brief-Xentri-2025-11-24.md) - Understand the vision
2. [PRD](./prd.md) - See MVP requirements
3. [Architecture](./architecture.md) - Technical decisions
4. [Epics](./epics.md) - Implementation roadmap

**Operations:**
1. [Deployment Plan](./deployment-plan.md) - Deploy to Railway
2. [Incident Response](./incident-response.md) - Troubleshooting guide
3. [Testing Strategy](./testing-strategy.md) - Run tests

**Key Concepts:**
- **Universal Brief:** The DNA of a business, generated through AI conversation
- **Event Backbone:** Immutable event log powering all cross-module intelligence
- **Calm Prompt:** Daily view of what needs attention
- **Open Loops:** Invisible commitments made visible

---

*Last updated: 2025-11-27*
