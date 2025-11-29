# Xentri Pulse

> **Cross-team coordination and system-wide progress**
> Last Updated: 2025-11-28

---

## System Health

| Indicator | Status | Notes |
|-----------|--------|-------|
| **Live API** | Healthy | https://core-api-production-8016.up.railway.app |
| **Build** | Passing | All CI checks green |
| **Tests** | 25+ passing | Coverage thresholds met |

---

## Current Epic Progress

### Epic 1: Foundation (In Review)

| Module | Stories | Status | Blockers |
|--------|---------|--------|----------|
| orchestration | 1-1, 1-7 | 1-1 done, 1-7 in review | None |
| core-api | 1-2, 1-3, 1-4, 1-6 | All done | None |
| shell | 1-5 | Done | None |
| ts-schema | - | Supporting | None |
| ui | - | Supporting | None |

**Epic Status:** 6/7 stories complete, 1 in review

---

## Module Status Summary

### Platform Category (Active)

| Module | Latest Activity | Next Action | Owner |
|--------|-----------------|-------------|-------|
| **orchestration** | Story 1-7 submitted for review | Complete review, merge | Carlo |
| **core-api** | API deployed to Railway | Begin Epic 2 planning | - |
| **shell** | Navigation working | Await Strategy SPA | - |
| **ts-schema** | Contracts stable | Add Strategy types | - |
| **ui** | Design system ready | Add Strategy components | - |

### Other Categories (Planned)

| Category | Status | Next Milestone |
|----------|--------|----------------|
| strategy | Not started | Epic 2: Strategy SPA + Copilot |
| finance | Not started | After Strategy foundation |
| brand | Not started | After Finance foundation |
| sales | Not started | After Brand foundation |
| operations | Not started | Future |
| team | Not started | Future |
| legal | Not started | Future |

---

## Cross-Module Requests

### Open Requests

| ID | Source | Target | Request | Status | SLA |
|----|--------|--------|---------|--------|-----|
| - | - | - | No open cross-module requests | - | - |

### Recently Resolved

| ID | Source | Target | Request | Resolution |
|----|--------|--------|---------|------------|
| - | - | - | No recent resolutions | - |

*Track cross-module requests via [GitHub Issues](https://github.com/your-org/xentri/issues?q=label%3Across-module)*

---

## Vision Alignment Check

### North Star: Weekly Active Revenue Events per Organization

**Current Status:** Not measurable yet (Finance modules not built)

**Foundation Progress:**
- [x] Event backbone operational
- [x] Multi-tenant RLS enforced
- [x] User authentication working
- [x] Organization provisioning working
- [ ] Universal Brief generation (Epic 2)
- [ ] Invoicing module (Epic 3+)

### Build Sequence Adherence

Following [ADR-005 (SPA + Copilot First)](./platform/orchestration/architecture/adr-005-spa-copilot-first.md):

| Phase | Category | SPA | Copilot | Status |
|-------|----------|-----|---------|--------|
| 1 | Platform | shell (done) | N/A | **Complete** |
| 2 | Strategy | strategy-app | strategy-copilot | Next |
| 3 | Finance | finance-app | finance-copilot | Planned |
| 4 | Brand | brand-app | brand-copilot | Planned |

---

## Upcoming Milestones

| Milestone | Target | Dependencies | Status |
|-----------|--------|--------------|--------|
| Epic 1 Complete | Week of 2025-12-02 | Story 1-7 review | In Progress |
| Epic 2 Planning | After Epic 1 | - | Not Started |
| Strategy SPA | TBD | Epic 2 stories | Not Started |
| Strategy Copilot | TBD | Strategy SPA | Not Started |

---

## Recent Decisions

| Date | Decision | Impact | Reference |
|------|----------|--------|-----------|
| 2025-11-28 | SPA + Copilot First strategy | Build order for all categories | [ADR-005](./platform/orchestration/architecture/adr-005-spa-copilot-first.md) |
| 2025-11-27 | Module Isolation Plan | Cross-module coordination | [Plan](./platform/orchestration/module-isolation-plan.md) |
| 2025-11-26 | Railway Bootstrap | Deploy to Railway before K8s | [ADR-004](./platform/orchestration/architecture/adr-004-railway-bootstrap.md) |

---

## How to Update This Document

### Manual Update (Current)

Run the BMad Master pulse check workflow or manually update sections above.

### Automated Update (Future)

This document should be updated daily via:
1. **GitHub Action** reading `sprint-status.yaml` from all modules
2. **Aggregating** cross-module issues from GitHub
3. **Generating** this markdown file
4. **Committing** with timestamp

**Cron Schedule:** `0 6 * * *` (6 AM daily)

See [Issue #TBD] for automation implementation.

---

## Contact

- **Product Owner:** Carlo
- **Architecture Questions:** See [Architecture](./platform/orchestration/architecture.md)
- **Cross-Module Requests:** Create [GitHub Issue](https://github.com/your-org/xentri/issues/new?template=cross-module-request.yml)

---

*This document is the single source of truth for cross-team coordination. All teams should consult it before starting work to understand system-wide context.*
