# Documentation Migration Plan

> **Status:** IN PROGRESS
> **Purpose:** Transition from flat atom structure to hierarchical commission pattern. This document is TEMPORARY — delete after migration complete.
> **Supersedes:** `federated-docs-audit-plan.md` (Phases 3-6 are now obsolete)

---

## Document Governance

| Attribute        | Value                              |
| ---------------- | ---------------------------------- |
| **Version**      | 1.0                                |
| **Status**       | In Progress                        |
| **Owner**        | Platform Team                      |
| **Created**      | 2025-12-04                         |
| **Last Updated** | 2025-12-04                         |
| **Approved By**  | Party Mode Discussion (all agents) |

---

## Context: What Changed

On 2025-12-04, a Party Mode discussion established a new atom model:

**Old Model (DEPRECATED):**

- 35 flat atoms at Constitution level (SYS.002-034)
- Legacy IDs (PR-xxx, IC-xxx, ADR-xxx) mapped to sequential atom IDs
- No hierarchy, just a numbered list

**New Model (APPROVED):**

- ~11 Constitution atoms (7 category commissions + 4 infrastructure commissions)
- Parent's essential requirement becomes child's commission (recursive)
- Code structure mirrors atom hierarchy
- Legacy naming completely removed

See `docs/governance/atom-governance.md` for the permanent rules.

---

## What Completed Before This Plan

From `federated-docs-audit-plan.md`:

| Phase    | Status      | What Was Done                                      |
| -------- | ----------- | -------------------------------------------------- |
| Phase 0  | ✅ COMPLETE | SSOT infrastructure, validate-atoms.ts, gate rules |
| Phase 1  | ✅ COMPLETE | 107 workflows updated for Five Entity Types        |
| Phase 2  | ✅ COMPLETE | 35 atoms extracted (PR, IC, ADR) — NOW OBSOLETE    |
| Phase 3+ | ❌ OBSOLETE | Original audit tasks superseded by this plan       |

---

## New Migration Phases

### Phase A: Write Constitution Atoms (11 atoms) ✅ COMPLETE

Create the proper commission structure:

| Atom    | Commission          | Status      |
| ------- | ------------------- | ----------- |
| SYS.001 | Strategy Category   | ✅ Complete |
| SYS.002 | Marketing Category  | ✅ Complete |
| SYS.003 | Finance Category    | ✅ Complete |
| SYS.004 | Sales Category      | ✅ Complete |
| SYS.005 | Operations Category | ✅ Complete |
| SYS.006 | Legal Category      | ✅ Complete |
| SYS.007 | Team Category       | ✅ Complete |
| SYS.008 | Shell Module        | ✅ Complete |
| SYS.009 | Core API Module     | ✅ Complete |
| SYS.010 | UI Module           | ✅ Complete |
| SYS.011 | TS-Schema Module    | ✅ Complete |

**Exit Criteria:** ✅ 11 atoms exist with commissions + essential requirements

### Phase B: Migrate PRD/Architecture Content

Extract IDEAS from existing docs into proper child atoms:

| Source                    | Content                    | Destination                        |
| ------------------------- | -------------------------- | ---------------------------------- |
| Constitution PRD          | Universal Soul concept     | SYS.001 essentials                 |
| Constitution PRD          | 7 Categories definition    | SYS.001-007 commissions            |
| Constitution PRD          | PR-001 to PR-008           | Essentials in relevant commissions |
| Constitution PRD          | IC-001 to IC-007           | SYS.009-API.xxx child atoms        |
| Constitution Architecture | ADR-001 Soul Orchestration | SYS.001-STR.xxx                    |
| Constitution Architecture | ADR-002 Event Envelope     | SYS.009-API.xxx                    |
| Constitution Architecture | ADR-003 RLS                | SYS.009-API.xxx                    |
| Constitution Architecture | All other ADRs             | Appropriate child atoms            |
| Module PRDs               | Core API specifics         | SYS.009-API.xxx                    |
| Module PRDs               | Shell specifics            | SYS.008-SHL.xxx                    |
| Module PRDs               | TS-Schema specifics        | SYS.011-TSS.xxx                    |
| Module PRDs               | UI specifics               | SYS.010-UI.xxx                     |
| UX Design                 | Pulse patterns             | SYS.001-STR.xxx                    |
| UX Design                 | Shell patterns             | SYS.008-SHL.xxx                    |

**Exit Criteria:** All valuable content from PRD/Architecture migrated to atoms

### Phase C: Deprecate Old Atoms ✅ COMPLETE

| Action | Files                                                              | Status     |
| ------ | ------------------------------------------------------------------ | ---------- |
| Delete | `docs/_atoms/SYS.012.md` through `SYS.034.md` (old flat structure) | ✅ Deleted |
| Delete | `docs/_atoms/_RESTRUCTURE-PLAN.md` (superseded)                    | ✅ Deleted |
| Delete | `docs/_atoms/_ATOM-MODEL-V2.md` (merged into governance)           | ✅ Deleted |
| Delete | `docs/_atoms/_CONTENT-TO-MIGRATE.md` (used during migration)       | ✅ Deleted |
| Delete | `docs/_atoms/_GOVERNANCE.md` (moved to governance/)                | ✅ Deleted |
| Keep   | `docs/_atoms/_index.md` (regenerate)                               | ✅ Updated |
| Keep   | `docs/_atoms/_schema.yaml` (update if needed)                      | ✅ Updated |

**Exit Criteria:** ✅ Only new hierarchical atoms remain (SYS.001-011)

### Phase D: Rewrite Epics & Stories

| Action                   | Rationale                                                |
| ------------------------ | -------------------------------------------------------- |
| Delete all current epics | They reference old atom structure                        |
| Rewrite from atom tree   | Each module's essentials become epic acceptance criteria |
| Generate stories         | From new atom-based epics                                |

**Exit Criteria:** Epics/stories trace to new atom IDs

### Phase E: Update All References

| Document Type             | Action                           |
| ------------------------- | -------------------------------- |
| Constitution PRD          | Update to reference new atom IDs |
| Constitution Architecture | Update ADR references            |
| Module PRDs               | Update to reference parent atoms |
| CLAUDE.md                 | Update atom documentation        |
| Validation scripts        | Update entity code mappings      |

**Exit Criteria:** `pnpm run validate:links` passes

### Phase F: Cleanup

| Action  | Files                                               |
| ------- | --------------------------------------------------- |
| Delete  | `federated-docs-audit-plan.md` (superseded by this) |
| Delete  | This file (`migration-plan.md`)                     |
| Archive | Any \*\_recovered.md files                          |
| Keep    | `docs/governance/atom-governance.md` (permanent)    |

**Exit Criteria:** Clean governance folder with only permanent docs

---

## Content Preservation Checklist

**CRITICAL: Do not lose these ideas (days of work):**

### From Constitution PRD

- [ ] Universal Soul concept
- [ ] 7 Categories with descriptions
- [ ] Fractal Agency Architecture
- [ ] Tri-State Memory model
- [ ] Soul Governance (AI vs human-sovereign)
- [ ] Platform Integration Requirements
- [ ] Notification Delivery patterns
- [ ] Soul Access patterns

### From Constitution Architecture

- [ ] ADR-001: Soul Orchestration / Knowledge Hierarchy
- [ ] ADR-002: Event Envelope / Dual-write
- [ ] ADR-003: RLS Multi-tenant pattern
- [ ] ADR-004: K8s deployment strategy
- [ ] ADR-006: Tri-State Memory implementation
- [ ] ADR-007: Federated Soul Registry
- [ ] ADR-008: Python for Agent layer
- [ ] ADR-009: Cross-runtime contracts
- [ ] ADR-010: Resilience / Graceful degradation
- [ ] ADR-011: Hierarchical Pulse
- [ ] ADR-012: Copilot Widget
- [ ] ADR-013: Narrative Continuity
- [ ] ADR-014: Module Registration
- [ ] ADR-015: Permission Enforcement
- [ ] ADR-016: Soul Access patterns
- [ ] ADR-017: Notification Delivery
- [ ] ADR-018: Explainable Automation
- [ ] ADR-020: Sibling Dependency Law

### From Module PRDs

- [ ] Core API: endpoints, RLS impl, event handling
- [ ] Shell: routing, islands, module manifest
- [ ] TS-Schema: type contracts, Zod schemas
- [ ] UI: design system, components

### From UX Design

- [ ] Pulse visual hierarchy
- [ ] Copilot widget patterns
- [ ] Navigation structure
- [ ] Chronicle/Themes concept

---

## Execution Order

```
Phase A (Constitution atoms)
    ↓
Phase B (Migrate content)
    ↓
Phase C (Delete old atoms)
    ↓
Phase D (Rewrite epics)
    ↓
Phase E (Update references)
    ↓
Phase F (Cleanup)
```

**Estimated effort:** 1-2 focused sessions per phase

---

## Validation Commands

```bash
# Check atom structure
pnpm run validate:atoms

# Check all links
pnpm run validate:links

# Check manifest alignment
pnpm run validate:docs
```

---

## Related Documents

- `docs/governance/atom-governance.md` — Permanent rules (STAYS)
- `docs/_atoms/_index.md` — Atom registry
- `federated-docs-audit-plan.md` — Original plan (TO BE DELETED)
