# Atom Model V2 Migration

> **Status:** IN PROGRESS
> **Purpose:** Track migration from flat atom structure to hierarchical commission pattern.
> **Lifecycle:** DELETE this file when migration is complete.

---

## Document Governance

| Attribute        | Value                          |
| ---------------- | ------------------------------ |
| **Version**      | 3.0                            |
| **Status**       | In Progress                    |
| **Owner**        | Platform Team                  |
| **Created**      | 2025-12-04                     |
| **Last Updated** | 2025-12-05                     |
| **Supersedes**   | `federated-docs-audit-plan.md` |

---

## 1. Context

On 2025-12-04, a Party Mode discussion established a new atom model.

**Old Model (DEPRECATED):**

- 35 flat atoms at Constitution level (SYS.002-034)
- Legacy IDs (PR-xxx, IC-xxx, ADR-xxx) mapped to sequential atom IDs
- No hierarchy, just a numbered list

**New Model (APPROVED):**

- 11 Constitution atoms (7 category commissions + 4 infrastructure commissions)
- Parent's essential requirement becomes child's commission (recursive)
- Code structure mirrors atom hierarchy

See [`governance.md`](./governance.md) for the permanent rules.

---

## 2. Migration Phases

| Phase   | Status      | Description                                         |
| ------- | ----------- | --------------------------------------------------- |
| Phase 0 | COMPLETE    | SSOT infrastructure, validate-atoms.ts, gate rules  |
| Phase 1 | COMPLETE    | 107 workflows updated for Five Entity Types         |
| Phase 2 | COMPLETE    | 35 atoms extracted — NOW RESTRUCTURED into 11 atoms |
| Phase A | COMPLETE    | 11 Constitution atoms written (SYS.001-011)         |
| Phase B | **PENDING** | Migrate PRD/Architecture content to child atoms     |
| Phase C | COMPLETE    | Old atoms (SYS.012-034) deleted, index updated      |
| Phase D | **PENDING** | Rewrite Epics & Stories from atom tree              |
| Phase E | **PENDING** | Update all references to new atom IDs               |
| Phase F | **PENDING** | Final cleanup                                       |

---

## 3. Phase B: Migrate PRD/Architecture Content

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

---

## 4. Phase D: Rewrite Epics & Stories

| Action                   | Rationale                                                |
| ------------------------ | -------------------------------------------------------- |
| Delete all current epics | They reference old atom structure                        |
| Rewrite from atom tree   | Each module's essentials become epic acceptance criteria |
| Generate stories         | From new atom-based epics                                |

**Exit Criteria:** Epics/stories trace to new atom IDs

---

## 5. Phase E: Update All References

| Document Type             | Action                           |
| ------------------------- | -------------------------------- |
| Constitution PRD          | Update to reference new atom IDs |
| Constitution Architecture | Update ADR references            |
| Module PRDs               | Update to reference parent atoms |
| CLAUDE.md                 | Update atom documentation        |
| Validation scripts        | Update entity code mappings      |

**Exit Criteria:** `pnpm run validate:links` passes

---

## 6. Phase F: Cleanup

| Action | Files                                       |
| ------ | ------------------------------------------- |
| Delete | This file (`migration.md`)                  |
| Delete | Any `*_recovered.md` files (see list below) |
| Keep   | `governance.md` (permanent)                 |

**Exit Criteria:** Clean governance folder with only permanent docs

---

## 7. Content Preservation Checklist

**CRITICAL: Do not lose these ideas during migration.**

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

## 8. Files to Delete

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

---

## 9. Risk Assessment

| Risk ID | Description                  | Likelihood | Impact   | Mitigation                                           |
| ------- | ---------------------------- | ---------- | -------- | ---------------------------------------------------- |
| R-01    | Foundation Failure           | Medium     | Critical | Backup before changes; clear acceptance criteria     |
| R-02    | Parallel Execution Conflicts | High       | High     | Branch-per-category; clear file ownership            |
| R-03    | Migration Data Loss          | Medium     | Critical | Full backup; validate atom count matches source      |
| R-04    | Broken Cross-References      | High       | Medium   | Run `validate:links` before/after each phase         |
| R-05    | Scope Creep                  | High       | Medium   | Document new issues in Tech Debt; defer non-critical |

---

## 10. Rollback Procedures

### Pre-Execution Backup

```bash
git checkout -b backup/migration-$(date +%Y%m%d-%H%M%S)
git push origin backup/migration-$(date +%Y%m%d-%H%M%S)
git checkout main
```

### Rollback Triggers

| Metric                       | Threshold                     | Action                 |
| ---------------------------- | ----------------------------- | ---------------------- |
| `validate:docs` errors       | > 10                          | Pause and investigate  |
| `validate:links` broken refs | > 5 per phase                 | Revert phase           |
| Critical file deletion       | Any                           | Immediate rollback     |
| Merge conflicts              | Unresolvable after 2 attempts | Serialize work         |
| CI pipeline blocked          | > 30 minutes                  | Rollback to checkpoint |

### Phase-Specific Rollback

| Phase   | Trigger           | Rollback Procedure                              |
| ------- | ----------------- | ----------------------------------------------- |
| Phase B | Content loss      | `git checkout backup -- docs/_atoms/`           |
| Phase D | Epics broken      | `git checkout backup -- docs/platform/epics.md` |
| Phase E | References broken | Run `validate:links`; revert specific files     |
| Phase F | Premature cleanup | Restore from backup                             |

### Recovery Checkpoints

```bash
# After each phase
git tag checkpoint/phase-{letter}-complete
git push origin checkpoint/phase-{letter}-complete
```

---

## 11. Tech Debt Backlog

Items discovered during migration but deferred to avoid scope creep.

### Automation & Tooling

| Improvement                | Effort | Notes               |
| -------------------------- | ------ | ------------------- |
| YAML schema validation     | Medium | Create GitHub issue |
| Single-source event schema | Medium | Architecture ADR    |

### Content Scaffolding

| Improvement                | Effort | Notes           |
| -------------------------- | ------ | --------------- |
| Module doc scaffolds       | High   | Epic 2+ backlog |
| Sprint status regeneration | Low    | Per-module      |

### PRD Triad Infrastructure

| Item                           | Path                                                 | Effort | Notes                                           |
| ------------------------------ | ---------------------------------------------------- | ------ | ----------------------------------------------- |
| Entity-specific PRD checklists | `.bmad/bmm/checklists/`                              | Low    | Create: `infrastructure-prd-checklist.md`, etc. |
| Entity menu data file          | `.bmad/bmm/data/entity-menu.yaml`                    | Low    | Verify exists                                   |
| Constitution PRD checklist     | `.bmad/bmm/checklists/constitution-prd-checklist.md` | Low    | Verify exists                                   |

---

## 12. Workflow Inventory

**Total: 107 workflows** (92 existing + 15 new)

### Summary by Module

| Module               | Count | Notes                                         |
| -------------------- | ----- | --------------------------------------------- |
| BMB                  | 10    | Builder workflows                             |
| BMM 1-Analysis       | 8     | Research, product-soul                        |
| BMM 2-Plan           | 14    | PRD, tech-spec                                |
| BMM 3-Solutioning    | 30    | Architecture, epics, UX (includes 6 archived) |
| BMM 4-Implementation | 20    | Stories, code review, sprint                  |
| BMM Diagrams         | 4     | Excalidraw generators                         |
| BMM Testarch         | 8     | Testing workflows                             |
| BMM Other            | 4     | Document, migrate, status                     |
| CIS                  | 4     | Creative workflows                            |
| Core                 | 2     | Brainstorming, party-mode                     |
| Custom               | 3     | Federated validation                          |

### Detailed Inventory

<details>
<summary>BMB Module (10 workflows)</summary>

| Workflow          | Path                                                     | Status   |
| ----------------- | -------------------------------------------------------- | -------- |
| audit-workflow    | `.bmad/bmb/workflows/audit-workflow/`                    | Active   |
| convert-legacy    | `.bmad/bmb/workflows/convert-legacy/`                    | Active   |
| create-agent      | `.bmad/bmb/workflows/create-agent/`                      | Active   |
| create-module     | `.bmad/bmb/workflows/create-module/`                     | Active   |
| create-workflow   | `.bmad/bmb/workflows/create-workflow/`                   | Active   |
| workflow-template | `.bmad/bmb/workflows/create-workflow/workflow-template/` | Template |
| edit-agent        | `.bmad/bmb/workflows/edit-agent/`                        | Active   |
| edit-module       | `.bmad/bmb/workflows/edit-module/`                       | Active   |
| edit-workflow     | `.bmad/bmb/workflows/edit-workflow/`                     | Active   |
| module-brief      | `.bmad/bmb/workflows/module-brief/`                      | Active   |

</details>

<details>
<summary>BMM 1-Analysis (8 workflows)</summary>

| Workflow              | Path                                                    | Status |
| --------------------- | ------------------------------------------------------- | ------ |
| brainstorm-project    | `.bmad/bmm/workflows/1-analysis/brainstorm-project/`    | Active |
| domain-research       | `.bmad/bmm/workflows/1-analysis/domain-research/`       | Active |
| product-brief         | `.bmad/bmm/workflows/1-analysis/product-brief/`         | Active |
| research              | `.bmad/bmm/workflows/1-analysis/research/`              | Active |
| validate-product-soul | `.bmad/bmm/workflows/1-analysis/validate-product-soul/` | Active |
| amend-product-soul    | `.bmad/bmm/workflows/1-analysis/amend-product-soul/`    | Active |
| validate-research     | `.bmad/bmm/workflows/1-analysis/validate-research/`     | Active |
| amend-research        | `.bmad/bmm/workflows/1-analysis/amend-research/`        | Active |

</details>

<details>
<summary>BMM 2-Plan (14 workflows)</summary>

| Workflow            | Path                                                        | Status |
| ------------------- | ----------------------------------------------------------- | ------ |
| amend-domain-prd    | `.bmad/bmm/workflows/2-plan-workflows/amend-domain-prd/`    | Active |
| amend-prd           | `.bmad/bmm/workflows/2-plan-workflows/amend-prd/`           | Active |
| amend-system-prd    | `.bmad/bmm/workflows/2-plan-workflows/amend-system-prd/`    | Active |
| create-domain-prd   | `.bmad/bmm/workflows/2-plan-workflows/create-domain-prd/`   | Active |
| create-prd          | `.bmad/bmm/workflows/2-plan-workflows/create-prd/`          | Active |
| create-system-prd   | `.bmad/bmm/workflows/2-plan-workflows/create-system-prd/`   | Active |
| create-ux-design    | `.bmad/bmm/workflows/2-plan-workflows/create-ux-design/`    | Active |
| prd                 | `.bmad/bmm/workflows/2-plan-workflows/prd/`                 | Active |
| tech-spec           | `.bmad/bmm/workflows/2-plan-workflows/tech-spec/`           | Active |
| validate-domain-prd | `.bmad/bmm/workflows/2-plan-workflows/validate-domain-prd/` | Active |
| validate-prd        | `.bmad/bmm/workflows/2-plan-workflows/validate-prd/`        | Active |
| validate-system-prd | `.bmad/bmm/workflows/2-plan-workflows/validate-system-prd/` | Active |
| validate-tech-spec  | `.bmad/bmm/workflows/2-plan-workflows/validate-tech-spec/`  | Active |
| amend-tech-spec     | `.bmad/bmm/workflows/2-plan-workflows/amend-tech-spec/`     | Active |

</details>

<details>
<summary>BMM 3-Solutioning (30 workflows)</summary>

| Workflow                             | Path                                                              | Status   |
| ------------------------------------ | ----------------------------------------------------------------- | -------- |
| amend-architecture                   | `.bmad/bmm/workflows/3-solutioning/amend-architecture/`           | Active   |
| amend-domain-architecture            | `.bmad/bmm/workflows/3-solutioning/amend-domain-architecture/`    | Active   |
| amend-domain-epics                   | `.bmad/bmm/workflows/3-solutioning/amend-domain-epics/`           | Active   |
| amend-domain-ux                      | `.bmad/bmm/workflows/3-solutioning/amend-domain-ux/`              | Active   |
| amend-epics                          | `.bmad/bmm/workflows/3-solutioning/amend-epics/`                  | Active   |
| amend-system-architecture            | `.bmad/bmm/workflows/3-solutioning/amend-system-architecture/`    | Active   |
| amend-system-epics                   | `.bmad/bmm/workflows/3-solutioning/amend-system-epics/`           | Active   |
| amend-system-ux                      | `.bmad/bmm/workflows/3-solutioning/amend-system-ux/`              | Active   |
| amend-ux                             | `.bmad/bmm/workflows/3-solutioning/amend-ux/`                     | Active   |
| architecture                         | `.bmad/bmm/workflows/3-solutioning/architecture/`                 | Active   |
| create-architecture                  | `.bmad/bmm/workflows/3-solutioning/create-architecture/`          | Active   |
| create-epics-and-stories             | `.bmad/bmm/workflows/3-solutioning/create-epics-and-stories/`     | Active   |
| create-epics                         | `.bmad/bmm/workflows/3-solutioning/create-epics/`                 | Active   |
| create-ux                            | `.bmad/bmm/workflows/3-solutioning/create-ux/`                    | Active   |
| implementation-readiness             | `.bmad/bmm/workflows/3-solutioning/implementation-readiness/`     | Active   |
| validate-architecture                | `.bmad/bmm/workflows/3-solutioning/validate-architecture/`        | Active   |
| validate-domain-architecture         | `.bmad/bmm/workflows/3-solutioning/validate-domain-architecture/` | Active   |
| validate-domain-epics                | `.bmad/bmm/workflows/3-solutioning/validate-domain-epics/`        | Active   |
| validate-domain-ux                   | `.bmad/bmm/workflows/3-solutioning/validate-domain-ux/`           | Active   |
| validate-epics                       | `.bmad/bmm/workflows/3-solutioning/validate-epics/`               | Active   |
| validate-system-architecture         | `.bmad/bmm/workflows/3-solutioning/validate-system-architecture/` | Active   |
| validate-system-epics                | `.bmad/bmm/workflows/3-solutioning/validate-system-epics/`        | Active   |
| validate-system-ux                   | `.bmad/bmm/workflows/3-solutioning/validate-system-ux/`           | Active   |
| validate-ux                          | `.bmad/bmm/workflows/3-solutioning/validate-ux/`                  | Active   |
| \_archive/create-domain-architecture | `.bmad/bmm/workflows/3-solutioning/_archive/`                     | Archived |
| \_archive/create-domain-epics        | `.bmad/bmm/workflows/3-solutioning/_archive/`                     | Archived |
| \_archive/create-domain-ux           | `.bmad/bmm/workflows/3-solutioning/_archive/`                     | Archived |
| \_archive/create-system-architecture | `.bmad/bmm/workflows/3-solutioning/_archive/`                     | Archived |
| \_archive/create-system-epics        | `.bmad/bmm/workflows/3-solutioning/_archive/`                     | Archived |
| \_archive/create-system-ux           | `.bmad/bmm/workflows/3-solutioning/_archive/`                     | Archived |

</details>

<details>
<summary>BMM 4-Implementation (20 workflows)</summary>

| Workflow                   | Path                                                               | Status |
| -------------------------- | ------------------------------------------------------------------ | ------ |
| code-review                | `.bmad/bmm/workflows/4-implementation/code-review/`                | Active |
| correct-course             | `.bmad/bmm/workflows/4-implementation/correct-course/`             | Active |
| create-story               | `.bmad/bmm/workflows/4-implementation/create-story/`               | Active |
| dev-story                  | `.bmad/bmm/workflows/4-implementation/dev-story/`                  | Active |
| epic-tech-context          | `.bmad/bmm/workflows/4-implementation/epic-tech-context/`          | Active |
| retrospective              | `.bmad/bmm/workflows/4-implementation/retrospective/`              | Active |
| sprint-planning            | `.bmad/bmm/workflows/4-implementation/sprint-planning/`            | Active |
| sprint-rollup              | `.bmad/bmm/workflows/4-implementation/sprint-rollup/`              | Active |
| story-context              | `.bmad/bmm/workflows/4-implementation/story-context/`              | Active |
| story-done                 | `.bmad/bmm/workflows/4-implementation/story-done/`                 | Active |
| story-ready                | `.bmad/bmm/workflows/4-implementation/story-ready/`                | Active |
| validate-story             | `.bmad/bmm/workflows/4-implementation/validate-story/`             | Active |
| amend-story                | `.bmad/bmm/workflows/4-implementation/amend-story/`                | Active |
| amend-code                 | `.bmad/bmm/workflows/4-implementation/amend-code/`                 | Active |
| validate-code-review       | `.bmad/bmm/workflows/4-implementation/validate-code-review/`       | Active |
| amend-code-review          | `.bmad/bmm/workflows/4-implementation/amend-code-review/`          | Active |
| validate-epic-tech-context | `.bmad/bmm/workflows/4-implementation/validate-epic-tech-context/` | Active |
| amend-epic-tech-context    | `.bmad/bmm/workflows/4-implementation/amend-epic-tech-context/`    | Active |
| validate-story-context     | `.bmad/bmm/workflows/4-implementation/validate-story-context/`     | Active |
| amend-story-context        | `.bmad/bmm/workflows/4-implementation/amend-story-context/`        | Active |

</details>

<details>
<summary>Other Modules (25 workflows)</summary>

**BMM Diagrams (4):**

- create-dataflow, create-diagram, create-flowchart, create-wireframe

**BMM Testarch (8):**

- atdd, automate, ci, framework, nfr-assess, test-design, test-review, trace

**BMM Other (4):**

- document-project, migrate-to-federation, workflow-status, workflow-status/init

**CIS (4):**

- design-thinking, innovation-strategy, problem-solving, storytelling

**Core (2):**

- brainstorming, party-mode

**Custom/Federated-Validation (3):**

- validate-constitution, validate-domain-prd, validate-epic

</details>

---

## Related Documents

- [`governance.md`](./governance.md) — Permanent rules (immutable)
- `docs/_atoms/_index.md` — Atom registry
- `docs/platform/architecture/adr-020-sibling-dependency-law.md` — Sibling Dependency Law
