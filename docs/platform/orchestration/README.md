# Orchestration

> Platform-specific coordination, deployment, and operational concerns.

**Note:** System-wide constitutional documents (PRD, Architecture, UX Design, Epics, Product Brief) have moved to `docs/` root. See [docs/index.md](../../index.md) for the 4-level hierarchy.

This sub-category contains **platform-specific** documentation:
- Platform deployment and operations
- Platform-specific coordination
- Platform incident response
- Platform UX prototypes and research

## System Constitution (Level 0) — Now at docs/ root

| Document | New Location |
|----------|--------------|
| System PRD | [docs/prd.md](../../prd.md) |
| System Architecture | [docs/architecture.md](../../architecture.md) |
| System UX Design | [docs/ux-design.md](../../ux-design.md) |
| System Epics | [docs/epics.md](../../epics.md) |
| Product Brief | [docs/product-brief.md](../../product-brief.md) |

## Platform Operations (Level 2) — Remains Here

| Document | Purpose |
|----------|---------|
| [deployment-plan.md](./deployment-plan.md) | Platform deployment guide |
| [incident-response.md](./incident-response.md) | Platform troubleshooting runbook |
| [module_matrix.md](./module_matrix.md) | Platform module overview |

## Subfolders

| Folder | Contents |
|--------|----------|
| [architecture/](./architecture/) | Platform ADRs and technical deep-dives |
| [research/](./research/) | Platform research artifacts |
| [proposals/](./proposals/) | Platform proposals (e.g., federated requirements model) |
| [ux/](./ux/) | Platform UX prototypes |
| [sprint-artifacts/](./sprint-artifacts/) | Platform infrastructure stories |

## What Belongs Where

| Level 0 (docs/ root) | Level 2 (orchestration/) |
|---------------------|--------------------------|
| System-wide PRD (PR-xxx, IC-xxx) | Platform deployment |
| System architecture | Platform incident response |
| System UX principles | Platform UX prototypes |
| Cross-cutting epics | Platform-specific research |

## Current Status

**Epic 1 - Foundation:** Complete (Story 1.7 in review)
**Live API:** https://core-api-production-8016.up.railway.app
