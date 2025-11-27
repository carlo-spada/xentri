# Orchestration

> System-wide architecture, cross-cutting concerns, and platform infrastructure.

This module contains **big picture** documentation that spans across all modules. It defines:
- System-wide architectural decisions
- Cross-cutting infrastructure (deployment, observability)
- Platform-level product requirements
- Multi-module coordination patterns

**Important:** This module contains NO module-specific implementation details. Each module (shell, core-api, etc.) has its own documentation folder.

## Contents

| Document | Purpose |
|----------|---------|
| [architecture.md](./architecture.md) | Technical Constitution - system-wide decisions |
| [prd.md](./prd.md) | Platform-level Product Requirements |
| [product-brief.md](./product-brief.md) | Vision, personas, market positioning |
| [epics.md](./epics.md) | Platform-level roadmap (cross-module milestones) |
| [deployment-plan.md](./deployment-plan.md) | Railway deployment guide |
| [incident-response.md](./incident-response.md) | Platform troubleshooting runbook |
| [testing-strategy.md](./testing-strategy.md) | Cross-module test philosophy |
| [backlog.md](./backlog.md) | Future platform capabilities |

## Subfolders

| Folder | Contents |
|--------|----------|
| [architecture/](./architecture/) | ADRs and technical deep-dives |
| [research/](./research/) | Market and competitive research |
| [product/](./product/) | Product concept explorations |
| [ux/](./ux/) | Platform-wide UX prototypes |
| [sprint-artifacts/](./sprint-artifacts/) | Platform infrastructure stories |

## What Belongs Here vs. Module Folders

| Here (Orchestration) | Module Folders |
|---------------------|----------------|
| System-wide architecture | Module-specific architecture |
| Cross-module event contracts | Module API endpoints |
| Deployment infrastructure | Module build configuration |
| Platform-level epics | Module-specific stories |
| RLS and multi-tenancy design | Module data models |

## Current Status

**Epic 1 - Foundation:** Complete (Story 1.7 in review)
**Live API:** https://core-api-production-8016.up.railway.app
