# Documentation Migration Plan

> **Status:** IN PROGRESS
> **Purpose:** Track migration from flat atom structure to hierarchical commission pattern. DELETE this file when migration is complete.

---

## Document Governance

| Attribute        | Value                          |
| ---------------- | ------------------------------ |
| **Version**      | 2.0                            |
| **Status**       | In Progress                    |
| **Owner**        | Platform Team                  |
| **Created**      | 2025-12-04                     |
| **Last Updated** | 2025-12-05                     |
| **Supersedes**   | `federated-docs-audit-plan.md` |

---

## Context: What Changed

On 2025-12-04, a Party Mode discussion established a new atom model:

**Old Model (DEPRECATED):**

- 35 flat atoms at Constitution level (SYS.002-034)
- Legacy IDs (PR-xxx, IC-xxx, ADR-xxx) mapped to sequential atom IDs
- No hierarchy, just a numbered list

**New Model (APPROVED):**

- 11 Constitution atoms (7 category commissions + 4 infrastructure commissions)
- Parent's essential requirement becomes child's commission (recursive)
- Code structure mirrors atom hierarchy

See `docs/governance/governance.md` for the permanent rules.

---

## Completed Work

### From Original Audit Plan (Phases 0-2)

| Phase   | Status      | What Was Done                                       |
| ------- | ----------- | --------------------------------------------------- |
| Phase 0 | ✅ COMPLETE | SSOT infrastructure, validate-atoms.ts, gate rules  |
| Phase 1 | ✅ COMPLETE | 107 workflows updated for Five Entity Types         |
| Phase 2 | ✅ COMPLETE | 35 atoms extracted — NOW RESTRUCTURED into 11 atoms |

### From New Migration Plan

| Phase   | Status      | What Was Done                                  |
| ------- | ----------- | ---------------------------------------------- |
| Phase A | ✅ COMPLETE | 11 Constitution atoms written (SYS.001-011)    |
| Phase C | ✅ COMPLETE | Old atoms (SYS.012-034) deleted, index updated |

---

## Remaining Phases

### Phase B: Migrate PRD/Architecture Content

Extract IDEAS from existing docs into proper child atoms:

| Source                    | Content                    | Destination              |
| ------------------------- | -------------------------- | ------------------------ |
| Constitution PRD          | Universal Soul concept     | SYS.001 essentials       |
| Constitution PRD          | PR-001 to PR-008           | Child atoms under SYS.\* |
| Constitution PRD          | IC-001 to IC-007           | SYS.009-API.xxx          |
| Constitution Architecture | ADR-001 Soul Orchestration | SYS.001-STR.xxx          |
| Constitution Architecture | ADR-002 Event Envelope     | SYS.009-API.xxx          |
| Constitution Architecture | All other ADRs             | Appropriate child atoms  |
| Module PRDs               | Core API specifics         | SYS.009-API.xxx          |
| Module PRDs               | Shell specifics            | SYS.008-SHL.xxx          |
| Module PRDs               | TS-Schema specifics        | SYS.011-TSS.xxx          |
| Module PRDs               | UI specifics               | SYS.010-UI.xxx           |
| UX Design                 | Pulse patterns             | SYS.001-STR.xxx          |
| UX Design                 | Shell patterns             | SYS.008-SHL.xxx          |

**Exit Criteria:** All valuable content from PRD/Architecture migrated to atoms

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

| Action | Files                                       |
| ------ | ------------------------------------------- |
| Delete | This file (`migration.md`)                  |
| Delete | Any `*_recovered.md` files (see list below) |
| Keep   | `docs/governance/governance.md` (permanent) |

**Exit Criteria:** Clean governance folder with only permanent docs

---

## Content Preservation Checklist

**CRITICAL: Do not lose these ideas:**

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

## Files to Delete (Cleanup Tasks)

### Recovered Duplicates (10 files)

```
docs/platform/shell/epics_recovered.md
docs/platform/shell/prd_recovered.md
docs/platform/shell/ux-design_recovered.md
docs/platform/ui/epics_recovered.md
docs/platform/ui/prd_recovered.md
docs/platform/ui/ux-design_recovered.md
docs/platform/core-api/epics_recovered.md
docs/platform/core-api/prd_recovered.md
docs/platform/ts-schema/epics_recovered.md
docs/platform/ts-schema/prd_recovered.md
```

### Governance Folder Cleanup (after this migration)

```
docs/governance/federated-docs-audit-plan.md  # Superseded by this file
docs/governance/atom-governance.md            # Merged into governance.md
docs/governance/_ATOM-MODEL-V2.md             # Content merged
docs/governance/_CONTENT-TO-MIGRATE.md        # Content merged
docs/governance/_RESTRUCTURE-PLAN.md          # Superseded
docs/governance/migration-plan.md             # Superseded by this file
```

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

## Historical Reference

The original `federated-docs-audit-plan.md` (v6.8) contained:

- 70 micro-phases across 7 phases
- 107 workflow inventory
- Detailed completion notes for Phases 0-2
- Agent coordination protocols (now in governance.md)

Key accomplishments preserved:

- Phase 0: Atom infrastructure created
- Phase 1: 107 workflows (92 existing + 15 new)
- Phase 2: 35 atoms extracted (later restructured to 11)
- Phase 3.04: Manifest structure validated
- Phase 3.09: Constitution PRD audited

---

## Related Documents

- `docs/governance/governance.md` — Permanent rules (STAYS)
- `docs/_atoms/_index.md` — Atom registry
- `docs/_atoms/_schema.yaml` — Frontmatter schema
