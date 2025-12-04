# Federated Documentation Audit & Remediation Plan

> **Purpose:** Comprehensive audit and remediation of all documentation artifacts to ensure alignment with the redesigned Federated Workflow System, Five Entity Types model, Zero-Trust Inheritance rules, and **SSOT Atom Architecture**.

---

## Document Governance

| Attribute        | Value                                                                  |
| ---------------- | ---------------------------------------------------------------------- |
| **Version**      | 5.1                                                                    |
| **Status**       | Draft — Pending Implementation                                         |
| **Owner**        | Platform Team                                                          |
| **DRI**          | BMad Builder (Phase 0), Analyst (Phases 1-6) ([Glossary](#2-glossary)) |
| **Created**      | 2025-12-03                                                             |
| **Last Updated** | 2025-12-04                                                             |
| **Review Cycle** | After each micro-phase completion                                      |
| **Approval**     | Pending — requires validation of Phase 0 deliverables                  |

### Change Log

| Version | Date       | Author       | Changes                                                                                                                                                      |
| ------- | ---------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 5.1     | 2025-12-04 | Claude Code  | Clarified: Product Soul special location, 92+15=107 workflow target, Phase 0 create/review pattern                                                           |
| 5.0     | 2025-12-04 | Claude Code  | Major revision: fixed workflow inventory (92 total), unified taxonomy, sequential micro-phases, added coordination protocol, corrected product-soul location |
| 4.0     | 2025-12-04 | Claude Code  | Major refactor: consolidated duplicates, unified task IDs, added conventions, restructured sections                                                          |
| 3.4     | 2025-12-04 | Claude Code  | Party mode review: Fixed workflow counts, research triad, BMM patterns, 47 micro-phases                                                                      |
| 3.0     | 2025-12-03 | Claude Code  | Merged Platform Remediation + SSOT Specification + Workflow Gap Analysis                                                                                     |
| 2.0     | 2025-12-02 | BMad Builder | Added Phase 0, SSOT Atom System, Gate Validation                                                                                                             |
| 1.0     | 2025-12-01 | Analyst      | Initial audit plan creation                                                                                                                                  |

> **Related Documents:**
>
> - `docs/platform/document-contracts.yaml` — Ownership rules (SSOT authority)
> - `docs/manifest.yaml` — Single source of truth for documentation structure
> - `CLAUDE.md` — Project context and coding standards

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Glossary](#2-glossary)
3. [Conventions](#3-conventions)
4. [Planned Remediation](#4-planned-remediation)
5. [Scope & Objectives](#5-scope--objectives)
6. [Risk Assessment & Mitigation](#6-risk-assessment--mitigation)
7. [Agent Assignment Matrix](#7-agent-assignment-matrix)
8. [Agent Coordination Protocol](#8-agent-coordination-protocol)
9. [Work Streams by Agent Persona](#9-work-streams-by-agent-persona)
10. [SSOT Atom System Specification](#10-ssot-atom-system-specification)
11. [Execution Plan](#11-execution-plan)
12. [Validation Criteria](#12-validation-criteria)
13. [Execution Checklist](#13-execution-checklist)

**Appendices:**

- [A: Files Flagged for Immediate Attention](#appendix-a-files-flagged-for-immediate-attention)
- [B: Agent Activation Commands](#appendix-b-agent-activation-commands)
- [C: Validation Commands](#appendix-c-validation-commands)
- [D: Critical Files Reference](#appendix-d-critical-files-reference)
- [E: Complete Workflow Inventory](#appendix-e-complete-workflow-inventory)
- [F: Deferred Improvements (Tech Debt)](#appendix-f-deferred-improvements-tech-debt)
- [G: Rollback & Recovery Procedures](#appendix-g-rollback--recovery-procedures)

---

## 1. Executive Summary

This plan coordinates a **full-spectrum audit** of the Xentri documentation ecosystem, covering:

- **BMAD System Files** (`.bmad/` folder structure, workflows, agents)
- **Documentation Artifacts** (`docs/` — PRDs, architecture, epics, UX design, etc.)
- **Alignment Verification** between manifest.yaml and actual file structure

The audit addresses three dimensions:

1. **Structural Compliance** — Files exist where manifest.yaml declares them
2. **Workflow Status Alignment** — Status files reflect actual progress
3. **Content Quality** — Documents contain required sections per entity type

### Key Changes to Validate Against

| Change Area                | Description                                                                                  |
| -------------------------- | -------------------------------------------------------------------------------------------- |
| **Five Entity Types**      | Constitution, Infrastructure Module, Strategic Container, Coordination Unit, Business Module |
| **Workflow Phases**        | 1-Analysis → 2-Plan → 3-Solutioning → 4-Implementation                                       |
| **Zero-Trust Inheritance** | Children inherit from direct parent ONLY, can ADD but never CONTRADICT                       |
| **Sibling Dependency Law** | ADR-020: Entities depend only on siblings; cross-branch at ancestor level                    |
| **Entity Detection**       | Determined by PURPOSE, not folder depth                                                      |
| **SSOT Atom System**       | Centralized atoms in `docs/_atoms/` with hierarchical IDs                                    |
| **Gate Validation**        | Hard block on invalid atoms, deprecated refs, broken links                                   |
| **Workflow Strategy**      | 92 existing workflows (keep all) + 15 new workflows to create = 107 total target             |

---

## 2. Glossary

| Term                       | Definition                                                                                                            |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **Atom**                   | Smallest unit of authoritative content (requirement, decision, interface). Lives in `docs/_atoms/`, referenced by ID. |
| **SSOT**                   | Single Source of Truth — each piece of information has exactly one authoritative location.                            |
| **Constitution**           | Root entity (`docs/platform/`) containing system-wide rules (PR-xxx, IC-xxx, ADR-xxx).                                |
| **Infrastructure Module**  | Platform-level modules (`docs/platform/{module}/`) providing foundational services.                                   |
| **Strategic Container**    | Category-level entities (`docs/{category}/`) representing business domains.                                           |
| **Coordination Unit**      | Subcategory-level entities (`docs/{category}/{subcategory}/`) orchestrating modules.                                  |
| **Business Module**        | Feature-level entities (`docs/{cat}/{subcat}/{mod}/`) where functionality is implemented.                             |
| **Zero-Trust Inheritance** | Entities inherit ONLY from direct parent, can ADD requirements but never CONTRADICT.                                  |
| **Sibling Dependency Law** | ADR-020: Dependencies only on siblings (same parent). Cross-branch requires ancestor declaration.                     |
| **Gate Validation**        | Hard-block rules at pre-commit/CI preventing invalid atoms, broken refs, deprecated dependencies.                     |
| **Triad**                  | Complete set of three workflows: create, validate, amend.                                                             |
| **DRI**                    | Directly Responsible Individual — single person accountable for a deliverable.                                        |
| **Entity-first Detection** | Workflows determine entity type at runtime before applying type-specific templates.                                   |

---

## 3. Conventions

### 3.1 Document Status Values

| Status       | Meaning                                  |
| ------------ | ---------------------------------------- |
| `draft`      | Work in progress, not yet validated      |
| `pending`    | Awaiting review or approval              |
| `approved`   | Validated and ready for use              |
| `deprecated` | No longer authoritative, pending removal |

### 3.2 Workflow Status Values

| Status        | Meaning                          |
| ------------- | -------------------------------- |
| `pending`     | Not yet started                  |
| `in_progress` | Currently being executed         |
| `completed`   | Successfully finished            |
| `blocked`     | Cannot proceed due to dependency |

### 3.3 Task ID Format

All tasks use unified hierarchical IDs matching the micro-phase structure:

```
{Phase}.{Sequence}
```

| Component | Values                                                                        |
| --------- | ----------------------------------------------------------------------------- |
| Phase     | `0` (Foundation), `1` (Workflow), `2` (Migration), `3`-`6` (Audit Groups A-D) |
| Sequence  | Two-digit number (01-99), sequential within phase                             |

**Examples:**

- `0.01` = Phase 0, Micro-phase 1 (Atom Directory Setup)
- `3.07` = Phase 3 (Group A), Micro-phase 7

### 3.4 Requirement ID Format

| Scope        | Format             | Example                    |
| ------------ | ------------------ | -------------------------- |
| Constitution | `PR-xxx`, `IC-xxx` | PR-001, IC-004             |
| All Others   | `FR-{CODE}-xxx`    | FR-SHL-001, FR-STR-PUL-001 |

---

## 4. Planned Remediation

> **Status:** All items below are PENDING implementation. Nothing has been executed yet.

### 4.1 Soul Terminology (Pending)

- [ ] Verify `product-brief.md` → `product-soul.md` rename complete
- [ ] IC-004: `GET /api/v1/soul/{section}` documented
- [ ] All Constitution docs use "Soul" consistently

### 4.2 Structure & Format (Pending)

- [ ] Frontmatter aligned across all Constitution docs
- [ ] "brand"/"Brand" → "Marketing" in all references
- [ ] Create `docs/platform/validation/` directory
- [ ] Create `docs/platform/research/` directory
- [ ] Create/update `docs/platform/document-contracts.yaml`

### 4.3 Navigation Policy (Pending)

> **IMPORTANT:** Only ONE index file shall exist at `docs/index.md`. NO README.md files anywhere in `docs/`. NO index.md files in subdirectories.

- [ ] DELETE all `docs/**/README.md` files
- [ ] DELETE all `docs/**/index.md` files (except `docs/index.md`)
- [ ] Update `docs/index.md` as single navigation hub

### 4.4 Constitution Documents (Pending)

> **Special Case:** Product Soul lives at `docs/product-soul.md` (root level) because it represents the foundational vision that transcends the platform. All other Constitution documents live under `docs/platform/`.

| Document     | Correct Location                | Status                          |
| ------------ | ------------------------------- | ------------------------------- |
| Product Soul | `docs/product-soul.md`          | ✅ Exists (special: root level) |
| PRD          | `docs/platform/prd.md`          | Verify                          |
| Architecture | `docs/platform/architecture.md` | Verify                          |
| UX Design    | `docs/platform/ux-design.md`    | Create if missing               |
| Epics        | `docs/platform/epics.md`        | Verify                          |

---

## 5. Scope & Objectives

### 5.1 In Scope

| Category                   | Items                                                                   |
| -------------------------- | ----------------------------------------------------------------------- |
| **Constitution**           | `docs/product-soul.md` + `docs/platform/*.md` (5 protected documents)   |
| **Infrastructure Modules** | 4 active (shell, ui, core-api, ts-schema), 4 planned                    |
| **Strategic Containers**   | 7 categories                                                            |
| **Coordination Units**     | 35 subcategories                                                        |
| **BMAD Workflows**         | 92 existing (keep all, update as needed) + 15 new to create = 107 total |
| **BMAD Agents**            | 9 agents in `.bmad/bmm/agents/`                                         |

### 5.2 Objectives

1. **Identify Gaps** — Missing files, broken references, orphaned documents
2. **Flag Inconsistencies** — Entity types, frontmatter, inheritance violations
3. **Remediate Issues** — Update existing files, create missing files to achieve compliance
4. **Establish Baselines** — Create workflow status files for federated tracking

### 5.3 Deliverables

- [ ] Gap Analysis Report (per entity type)
- [ ] Remediation Actions Log
- [ ] Updated Documentation Files
- [ ] Workflow Status Files (per entity)
- [ ] Final Validation Report

---

## 6. Risk Assessment & Mitigation

### 6.1 Critical Risks

| Risk ID | Description                  | Likelihood | Impact   | Mitigation                                                       |
| ------- | ---------------------------- | ---------- | -------- | ---------------------------------------------------------------- |
| R-01    | Phase 0 Foundation Failure   | Medium     | Critical | Backup before Phase 0; clear acceptance criteria                 |
| R-02    | Parallel Execution Conflicts | High       | High     | Branch-per-category; clear file ownership; coordination protocol |
| R-03    | Migration Data Loss          | Medium     | Critical | Full backup; validate atom count matches source                  |
| R-04    | Broken Cross-References      | High       | Medium   | Run `validate:links` before/after each phase                     |
| R-05    | Scope Creep                  | High       | Medium   | Document new issues in Appendix F; defer non-critical            |

### 6.2 Success Criteria

| Phase          | Success Criteria                               | Validation                      |
| -------------- | ---------------------------------------------- | ------------------------------- |
| **Phase 0**    | Atom directory + validation scripts functional | `pnpm run validate:docs` passes |
| **Phases 1-2** | Workflows updated/created; atoms migrated      | Zero broken refs                |
| **Phases 3-6** | All audit tasks complete                       | All validation scripts pass     |

### 6.3 Rollback Triggers

Rollback procedures (see [Appendix G](#appendix-g-rollback--recovery-procedures)) are triggered when:

| Trigger                   | Threshold                       | Action                                        |
| ------------------------- | ------------------------------- | --------------------------------------------- |
| `validate:docs` failures  | > 10 errors                     | Pause, investigate, rollback if unrecoverable |
| `validate:links` failures | > 5 broken refs in single phase | Revert phase changes, forward-fix             |
| Critical file deletion    | Any protected document deleted  | Immediate rollback from checkpoint            |
| Merge conflict            | Unresolvable after 2 attempts   | Escalate to DRI, serialize work               |
| CI pipeline failure       | Blocking for > 30 minutes       | Rollback to last checkpoint                   |

---

## 7. Agent Assignment Matrix

| Agent                   | Primary Responsibility                 | Document Types                | File Lock Scope                     |
| ----------------------- | -------------------------------------- | ----------------------------- | ----------------------------------- |
| **BMad Builder**        | BMAD system files, workflow.yaml       | `.bmad/**/*`                  | `.bmad/`                            |
| **Analyst (Mary)**      | Gap analysis, cross-cutting validation | All (read-only analysis)      | None (read-only)                    |
| **PM (John)**           | PRDs, Epics, requirement IDs           | `prd.md`, `epics.md`          | `**/prd.md`, `**/epics.md`          |
| **Architect (Winston)** | Architecture docs, ADRs                | `architecture.md`, `adr-*.md` | `**/architecture.md`, `**/adr-*.md` |
| **UX Designer (Sally)** | UX design documents, wireframes        | `ux-design.md`, `ux/**/*`     | `**/ux-design.md`, `**/ux/`         |
| **Tech Writer (Paige)** | Formatting, cross-references           | `docs/index.md`               | `docs/index.md`                     |
| **Dev (Amelia)**        | Sprint artifacts, story files          | `sprint-artifacts/**/*`       | `**/sprint-artifacts/`              |
| **SM (Bob)**            | Status tracking, sprint planning       | `sprint-status.yaml`          | `**/sprint-status.yaml`             |

---

## 8. Agent Coordination Protocol

### 8.1 File Locking Strategy

To prevent parallel execution conflicts, agents must respect file locks:

1. **Exclusive Lock:** Agent announces intent in coordination channel before modifying files in their lock scope
2. **Lock Duration:** Maximum 30 minutes per file/directory
3. **Lock Release:** Explicit release or automatic after commit
4. **Conflict Resolution:** First to announce gets priority; others wait or work on different files

### 8.2 Conflict Resolution Hierarchy

When agent tasks conflict:

| Conflict Type                 | Resolution                                      |
| ----------------------------- | ----------------------------------------------- |
| Same file, different sections | Serialize: higher phase number waits            |
| Same file, same section       | Escalate to DRI (Analyst for Phases 1-6)        |
| Cross-file dependency         | Complete upstream file first                    |
| Merge conflict                | Attempt manual merge; if failed, DRI arbitrates |

### 8.3 Communication Protocol

```
1. ANNOUNCE: "Starting [Task ID] - locking [file pattern]"
2. EXECUTE:  Perform task
3. VALIDATE: Run relevant validation scripts
4. COMMIT:   Commit with task ID in message
5. RELEASE:  "Completed [Task ID] - releasing [file pattern]"
```

### 8.4 Handoff Procedures

When one agent's output is another's input:

| From Agent | To Agent  | Handoff Point         | Validation Before Handoff      |
| ---------- | --------- | --------------------- | ------------------------------ |
| PM         | Architect | PRD approved          | `validate-prd` passes          |
| Architect  | UX        | Architecture approved | `validate-architecture` passes |
| UX         | Dev       | UX approved           | `validate-ux` passes           |
| PM         | SM        | Epics created         | `validate-epics` passes        |

---

## 9. Work Streams by Agent Persona

### 9.1 BMad Builder

| ID   | Task                                                    | Phase |
| ---- | ------------------------------------------------------- | ----- |
| 0.01 | Create `docs/_atoms/` directory structure               | 0     |
| 0.02 | Document atom ID scheme in template                     | 0     |
| 0.03 | Create atom CRUD skills (create/search/amend/deprecate) | 0     |
| 3.01 | Audit all workflow.yaml files for proper structure      | 3     |
| 3.02 | Verify workflow phases align correctly                  | 3     |
| 3.03 | Validate agent menu items reference existing workflows  | 3     |
| 4.01 | Review archived workflows for potential restoration     | 4     |
| 4.02 | Audit BMB workflows (create-workflow, create-agent)     | 4     |

### 9.2 Analyst (Mary)

| ID   | Task                                                 | Phase |
| ---- | ---------------------------------------------------- | ----- |
| 0.04 | Create atom validation script (`validate-atoms.ts`)  | 0     |
| 0.05 | Implement gate validation rules (5 rules)            | 0     |
| 3.04 | Generate manifest.yaml vs actual structure diff      | 3     |
| 3.05 | Identify orphaned files (exist but not in manifest)  | 3     |
| 3.06 | Identify missing files (in manifest but don't exist) | 3     |
| 3.07 | Validate entity_type consistency across all docs     | 3     |
| 3.08 | Run validate-dependencies.ts for ADR-020 compliance  | 3     |
| 4.03 | Check requirement ID format compliance               | 4     |
| 4.04 | Audit frontmatter for required fields                | 4     |
| 5.01 | Validate inheritance chains (no skip-level)          | 5     |
| 5.02 | Verify entity documents per BMM patterns             | 5     |
| 6.01 | Produce consolidated Gap Analysis Report             | 6     |

### 9.3 PM (John)

| ID   | Task                                              | Phase |
| ---- | ------------------------------------------------- | ----- |
| 3.09 | Audit Constitution PRD (`docs/platform/prd.md`)   | 3     |
| 3.10 | Audit Infrastructure Module PRDs                  | 3     |
| 3.11 | Audit Constitution Epics                          | 3     |
| 3.12 | Remove duplicate files (`prd 2.md`, `epics 2.md`) | 3     |
| 4.05 | Check requirement ID uniqueness                   | 4     |
| 4.06 | Create placeholder PRDs for planned modules       | 4     |
| 5.03 | Validate epic-to-PRD traceability                 | 5     |

### 9.4 Architect (Winston)

| ID   | Task                                      | Phase |
| ---- | ----------------------------------------- | ----- |
| 3.13 | Audit Constitution Architecture           | 3     |
| 3.14 | Audit Infrastructure Module architectures | 3     |
| 3.15 | Verify ADR-020 is properly integrated     | 3     |
| 4.07 | Validate ADR numbering and format         | 4     |
| 4.08 | Audit Event Model documentation           | 4     |
| 5.04 | Check architecture-to-PRD traceability    | 5     |

### 9.5 UX Designer (Sally)

| ID   | Task                                      | Phase |
| ---- | ----------------------------------------- | ----- |
| 3.16 | Audit Constitution UX Design              | 3     |
| 3.17 | Audit Infrastructure Module UX designs    | 3     |
| 3.18 | Remove duplicate files (`ux-design 2.md`) | 3     |
| 4.09 | Audit `docs/platform/ux/` HTML mockups    | 4     |
| 5.05 | Validate UX-to-PRD traceability           | 5     |

### 9.6 Tech Writer (Paige)

| ID   | Task                                           | Phase |
| ---- | ---------------------------------------------- | ----- |
| 3.19 | DELETE all README.md files in docs/            | 3     |
| 3.20 | DELETE all index.md files EXCEPT docs/index.md | 3     |
| 3.21 | Update docs/index.md as single navigation hub  | 3     |
| 4.10 | Check cross-reference links                    | 4     |
| 4.11 | Validate CommonMark compliance                 | 4     |
| 6.02 | Verify manifest.yaml path references           | 6     |

### 9.7 Dev (Amelia)

| ID   | Task                                    | Phase |
| ---- | --------------------------------------- | ----- |
| 3.22 | Audit sprint-artifacts folder structure | 3     |
| 3.23 | Validate story file format compliance   | 3     |
| 4.12 | Verify task/subtask structure           | 4     |
| 5.06 | Check story-to-epic traceability        | 5     |

### 9.8 SM (Bob)

| ID   | Task                                                  | Phase |
| ---- | ----------------------------------------------------- | ----- |
| 3.24 | Audit existing sprint-status.yaml files               | 3     |
| 3.25 | Validate status enum values                           | 3     |
| 4.13 | Create missing workflow status files for Constitution | 4     |
| 4.14 | Create status files for Infrastructure Modules        | 4     |
| 5.07 | Check phase progression accuracy                      | 5     |

### 9.9 Cross-Cutting (ALL Agents)

| ID   | Task                                                 | Phase | Assigned To         |
| ---- | ---------------------------------------------------- | ----- | ------------------- |
| 5.08 | Verify entity documents per BMM required/recommended | 5     | All (their domain)  |
| 4.15 | Validate `*.requirement.yaml` files follow schema    | 4     | PM + Analyst        |
| 4.16 | Validate `*.interface.yaml` files follow schema      | 4     | Architect + Analyst |

---

## 10. SSOT Atom System Specification

### 10.1 Purpose

The atom system provides centralized storage for authoritative content (requirements, decisions, interfaces) that must be referenced consistently across all documentation.

### 10.2 Atom ID Format

```
SYS.004-STR.001-PUL.001-DAS.001
 │   │    │   │    │   │    │   │
 │   │    │   │    │   │    │   └── Dashboard atom #1
 │   │    │   │    │   │    └────── Dashboard entity
 │   │    │   │    │   └─────────── Pulse atom #1
 │   │    │   │    └────────────── Pulse entity
 │   │    │   └──────────────────── Strategy atom #1
 │   │    └─────────────────────── Strategy entity
 │   └──────────────────────────── System atom #4
 └─────────────────────────────── System (Constitution)
```

**Location:** `docs/_atoms/{id}.md`

### 10.3 Atom Operations

| Operation     | Skill File                            | Purpose                 |
| ------------- | ------------------------------------- | ----------------------- |
| **Create**    | `.bmad/core/tasks/create-atom.xml`    | Add new atom            |
| **Search**    | `.bmad/core/tasks/search-atom.xml`    | Find atoms by criteria  |
| **Amend**     | `.bmad/core/tasks/amend-atom.xml`     | Modify existing atom    |
| **Deprecate** | `.bmad/core/tasks/deprecate-atom.xml` | Mark atom as deprecated |

### 10.4 Gate Validation Rules

Five rules enforced at pre-commit and CI:

| Rule | Name          | Description                                          | Severity |
| ---- | ------------- | ---------------------------------------------------- | -------- |
| 1    | Parent Exists | Atom parent ID must exist in `docs/_atoms/`          | BLOCK    |
| 2    | Entity Valid  | Entity path in atom frontmatter must resolve         | BLOCK    |
| 3    | ID Format     | Atom ID must match `{ENTITY}.{SEQ}(-{CHILD}.{SEQ})*` | BLOCK    |
| 4    | Refs Resolve  | All `[text](../atoms/{id}.md)` must resolve          | BLOCK    |
| 5    | No Deprecated | Cannot reference atoms with `status: deprecated`     | BLOCK    |

**Enforcement Layers:**

1. Workflow inline validation during atom CRUD
2. Pre-commit hook: `.husky/pre-commit`
3. CI pipeline: `.github/workflows/atom-validation.yml`

---

## 11. Execution Plan

### 11.1 Phase Overview

| Phase | Name             | Micro-Phases | Description                         |
| ----- | ---------------- | ------------ | ----------------------------------- |
| 0     | SSOT Foundation  | 0.01 - 0.08  | Atom infrastructure setup           |
| 1     | Workflow Updates | 1.01 - 1.08  | Update existing, create new unified |
| 2     | Migration        | 2.01 - 2.05  | Extract PR/IC/ADR to atoms          |
| 3     | Audit Group A    | 3.01 - 3.25  | Primary audit tasks (parallel)      |
| 4     | Audit Group B    | 4.01 - 4.16  | Secondary audit tasks (parallel)    |
| 5     | Audit Group C    | 5.01 - 5.08  | Cross-cutting validation            |
| 6     | Audit Group D    | 6.01 - 6.04  | Finalization                        |

**Total: 70 micro-phases**

### 11.2 Phase 0: SSOT Foundation (8 micro-phases)

> **Note:** For existing infrastructure, tasks follow "create if not exist, review if exists" pattern.

| ID   | Name                   | Owner | Action | Exit Criteria                                                                  |
| ---- | ---------------------- | ----- | ------ | ------------------------------------------------------------------------------ |
| 0.01 | Atom Directory Setup   | BB    | Create | `docs/_atoms/` exists with ID scheme                                           |
| 0.02 | Atom Template Creation | BB    | Create | Template + index section                                                       |
| 0.03 | Atom CRUD Skills       | BB    | Create | All 4 skills functional                                                        |
| 0.04 | Validation Script      | AN    | Create | `validate-atoms.ts` validates format                                           |
| 0.05 | Gate Validation Rules  | AN    | Create | 5 rules implemented in validate-atoms.ts                                       |
| 0.06 | Product Soul Template  | BB    | Review | `docs/product-soul.md` follows template                                        |
| 0.07 | Pre-commit Hook        | BB    | Review | `.husky/pre-commit` exists; add atom validation if missing                     |
| 0.08 | CI Pipeline            | BB    | Review | `.github/workflows/docs-validation.yml` exists; add atom validation if missing |

**Existing Infrastructure (as of 2025-12-04):**

- `.husky/pre-commit` — EXISTS (runs lint-staged + typecheck)
- `.github/workflows/docs-validation.yml` — EXISTS (runs validate:links + validate:docs)
- `scripts/validation/validate-docs.js` — EXISTS
- `scripts/validation/validate-links.js` — EXISTS
- `scripts/validation/validate-dependencies.ts` — EXISTS
- `scripts/validation/validate-atoms.ts` — DOES NOT EXIST (create in 0.04)

### 11.3 Phase 1: Workflow Updates (8 micro-phases)

> **Strategy:** Keep all 92 existing workflows. Update those needing entity-first detection. Create 15 new workflows.

| ID   | Name                         | Action | Exit Criteria                           |
| ---- | ---------------------------- | ------ | --------------------------------------- |
| 1.01 | Inventory Current Workflows  | Audit  | All 92 workflows catalogued with status |
| 1.02 | PRD Triad Upgrade            | Update | Entity-first detection added            |
| 1.03 | Architecture Triad Upgrade   | Update | Entity-first detection added            |
| 1.04 | UX Triad Upgrade             | Update | Entity-first detection added            |
| 1.05 | Epics Triad Upgrade          | Update | Entity-first detection added            |
| 1.06 | Product-Soul Triad           | Create | 2 NEW workflows (validate + amend)      |
| 1.07 | Story/Dev Workflows          | Mixed  | 5 NEW + update existing                 |
| 1.08 | Context + Research Workflows | Mixed  | 8 NEW + update existing                 |

### 11.4 Phase 2: Migration (5 micro-phases)

| ID   | Name                 | Exit Criteria           |
| ---- | -------------------- | ----------------------- |
| 2.01 | Extract PR-xxx       | All PR atoms extracted  |
| 2.02 | Extract IC-xxx       | All IC atoms extracted  |
| 2.03 | Extract ADR-xxx      | All ADR atoms extracted |
| 2.04 | Update References    | All docs link to atoms  |
| 2.05 | Migration Validation | Zero broken refs        |

### 11.5 Phases 3-6: Audit Groups

| Phase | Group | Tasks       | Parallelism                 |
| ----- | ----- | ----------- | --------------------------- |
| 3     | A     | 3.01 - 3.25 | 25 tasks, parallel by agent |
| 4     | B     | 4.01 - 4.16 | 16 tasks, parallel by agent |
| 5     | C     | 5.01 - 5.08 | 8 tasks (requires 3+4)      |
| 6     | D     | 6.01 - 6.04 | 4 tasks, sequential         |

### 11.6 Dependencies Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                    PHASE 0: SSOT FOUNDATION (0.01-0.08)             │
│  0.01 ──► 0.02 ──► 0.03                                             │
│  0.01 ──────────► 0.04 ──► 0.05                                     │
│                      └──► 0.06                                      │
│  0.05 ──► 0.07 ──► 0.08                                             │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│              PHASE 1: WORKFLOW UPDATES (1.01-1.08)                  │
│  1.01 ──┬──► 1.02-1.08 (parallel after inventory)                   │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    PHASE 2: MIGRATION (2.01-2.05)                   │
│  2.01, 2.02, 2.03 (parallel) ──► 2.04 ──► 2.05                      │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│  PHASE 3: GROUP A │ PHASE 4: GROUP B │ PHASE 5: GROUP C │ PHASE 6  │
│   (25 parallel)   │   (16 parallel)  │  (requires 3+4)  │  (seq)   │
└─────────────────────────────────────────────────────────────────────┘
```

### 11.7 Critical Path

1. **0.08** (CI Setup) → Gate for Phase 1
2. **1.01** (Inventory) → Gate for workflow updates
3. **2.05** (Migration Validation) → Gate for Phase 3
4. **5.x** (Cross-cutting) → Requires Phase 3+4 outputs
5. **6.01** (Gap Report) → Required before final validation

---

## 12. Validation Criteria

### 12.1 Structural Compliance

| Criterion                          | Validation Method                                                       |
| ---------------------------------- | ----------------------------------------------------------------------- |
| All manifest.yaml paths resolve    | `pnpm run validate:docs`                                                |
| No orphaned files outside manifest | Task 3.05                                                               |
| Correct entity_type in frontmatter | Task 3.07                                                               |
| Sibling Dependency Law compliance  | `pnpm exec tsx scripts/validation/validate-dependencies.ts --path docs` |
| Entity documents per BMM patterns  | Tasks 5.02, 5.08                                                        |

### 12.2 Atom System Compliance

| Criterion                       | Validation Method                      |
| ------------------------------- | -------------------------------------- |
| `docs/_atoms/` directory exists | Pre-flight check                       |
| Atom ID format valid            | `scripts/validation/validate-atoms.ts` |
| All atom parents exist          | Gate validation rule 1                 |
| All atom references resolve     | Gate validation rule 4                 |
| No deprecated atom references   | Gate validation rule 5                 |

### 12.3 Workflow Status Alignment

| Criterion                       | Validation Method |
| ------------------------------- | ----------------- |
| Status files exist for entities | Tasks 4.13, 4.14  |
| Status enum values valid        | Task 3.25         |
| Phase progression logical       | Task 5.07         |

---

## 13. Execution Checklist

### Pre-Flight

- [ ] Verify `docs/manifest.yaml` accessible
- [ ] Run `pnpm run validate:docs` — baseline check
- [ ] Run `pnpm run validate:links` — baseline check
- [ ] Verify `docs/platform/document-contracts.yaml` exists
- [ ] Create backup: `git checkout -b backup/audit-$(date +%Y%m%d-%H%M%S)`
- [ ] Confirm `docs/_atoms/` does not exist (or is empty)

### Phase 0: SSOT Foundation

- [ ] **0.01** Atom Directory Setup
- [ ] **0.02** Atom Template Creation
- [ ] **0.03** Atom CRUD Skills
- [ ] **0.04** Create `validate-atoms.ts` script
- [ ] **0.05** Gate Validation Rules
- [ ] **0.06** Product Soul Template
- [ ] **0.07** Pre-commit Hook Setup
- [ ] **0.08** CI Pipeline Setup
- [ ] **Gate:** All validation scripts pass

### Phase 1: Workflow Updates

- [ ] **1.01** Inventory all 92 current workflows
- [ ] **1.02-1.05** Update existing triads (entity-first detection)
- [ ] **1.06** Create 2 NEW Product-Soul workflows
- [ ] **1.07-1.08** Create 13 NEW workflows + update existing
- [ ] **Gate:** 92 existing + 15 new = 107 total workflows functional

### Phase 2: Migration

- [ ] **2.01-2.03** Extract PR/IC/ADR atoms
- [ ] **2.04** Update references
- [ ] **2.05** Validation — zero broken refs
- [ ] **Gate:** All atoms migrated

### Phases 3-6: Audit Groups

- [ ] **Phase 3** (Group A) — Primary audit
- [ ] **Phase 4** (Group B) — Secondary audit
- [ ] **Phase 5** (Group C) — Cross-cutting validation
- [ ] **Phase 6** (Group D) — Finalization
- [ ] **Gate:** All validation scripts pass

### Post-Flight

- [ ] Run `pnpm run validate:docs` — MUST PASS
- [ ] Run `pnpm run validate:links` — MUST PASS
- [ ] Run dependency validation — MUST PASS
- [ ] Generate final validation report
- [ ] Commit with descriptive message

---

## Appendix A: Files Flagged for Immediate Attention

### Duplicate Files (DELETE)

```
docs/platform/shell/prd 2.md
docs/platform/shell/epics 2.md
docs/platform/shell/ux-design 2.md
docs/platform/core-api/prd 2.md
docs/platform/core-api/epics 2.md
docs/platform/ts-schema/prd 2.md
docs/platform/ts-schema/epics 2.md
docs/platform/ui/prd 2.md
docs/platform/ui/epics 2.md
docs/platform/ui/ux-design 2.md
docs/platform/ux/ux-design 2.md
```

### Files to DELETE (Navigation Policy)

```
docs/**/README.md          # DELETE all README.md files in docs/
docs/**/index.md           # DELETE all index.md files EXCEPT docs/index.md
```

---

## Appendix B: Agent Activation Commands

| Agent        | Slash Command                   |
| ------------ | ------------------------------- |
| BMad Builder | `/bmad:bmb:agents:bmad-builder` |
| Analyst      | `/bmad:bmm:agents:analyst`      |
| PM           | `/bmad:bmm:agents:pm`           |
| Architect    | `/bmad:bmm:agents:architect`    |
| UX Designer  | `/bmad:bmm:agents:ux-designer`  |
| Tech Writer  | `/bmad:bmm:agents:tech-writer`  |
| Dev          | `/bmad:bmm:agents:dev`          |
| SM           | `/bmad:bmm:agents:sm`           |

---

## Appendix C: Validation Commands

### Script-Based

```bash
# Standard validation
pnpm run validate:docs
pnpm run validate:links

# Sibling Dependency Law (ADR-020)
pnpm exec tsx scripts/validation/validate-dependencies.ts --path docs

# Atom validation (after Phase 0.04)
pnpm exec tsx scripts/validation/validate-atoms.ts
```

### Workflow-Based

| Type         | Command                                     |
| ------------ | ------------------------------------------- |
| PRD          | `/bmad:bmm:workflows:validate-prd`          |
| Architecture | `/bmad:bmm:workflows:validate-architecture` |
| Epics        | `/bmad:bmm:workflows:validate-epics`        |
| UX Design    | `/bmad:bmm:workflows:validate-ux`           |

---

## Appendix D: Critical Files Reference

| File                                                           | Purpose                           |
| -------------------------------------------------------------- | --------------------------------- |
| `docs/platform/architecture/adr-020-sibling-dependency-law.md` | Sibling Dependency Law definition |
| `docs/platform/document-contracts.yaml`                        | Entity document structure rules   |
| `scripts/validation/validate-dependencies.ts`                  | Dependency validation script      |
| `.claude/skills/validate-sibling-dependency/SKILL.md`          | Claude skill for ADR-020          |
| `docs/manifest.yaml`                                           | Documentation structure SSOT      |
| `docs/product-soul.md`                                         | Constitution Product Soul         |

---

## Appendix E: Complete Workflow Inventory

### Current Workflows (92 total: 86 active, 6 archived)

#### BMB Module (9 active)

| Workflow                          | Path                                                     | Status |
| --------------------------------- | -------------------------------------------------------- | ------ |
| audit-workflow                    | `.bmad/bmb/workflows/audit-workflow/`                    | Active |
| convert-legacy                    | `.bmad/bmb/workflows/convert-legacy/`                    | Active |
| create-agent                      | `.bmad/bmb/workflows/create-agent/`                      | Active |
| create-module                     | `.bmad/bmb/workflows/create-module/`                     | Active |
| create-workflow                   | `.bmad/bmb/workflows/create-workflow/`                   | Active |
| create-workflow/workflow-template | `.bmad/bmb/workflows/create-workflow/workflow-template/` | Active |
| edit-agent                        | `.bmad/bmb/workflows/edit-agent/`                        | Active |
| edit-module                       | `.bmad/bmb/workflows/edit-module/`                       | Active |
| edit-workflow                     | `.bmad/bmb/workflows/edit-workflow/`                     | Active |
| module-brief                      | `.bmad/bmb/workflows/module-brief/`                      | Active |

#### BMM Module - 1-Analysis (4 active)

| Workflow           | Path                                                 | Status |
| ------------------ | ---------------------------------------------------- | ------ |
| brainstorm-project | `.bmad/bmm/workflows/1-analysis/brainstorm-project/` | Active |
| domain-research    | `.bmad/bmm/workflows/1-analysis/domain-research/`    | Active |
| product-brief      | `.bmad/bmm/workflows/1-analysis/product-brief/`      | Active |
| research           | `.bmad/bmm/workflows/1-analysis/research/`           | Active |

#### BMM Module - 2-Plan (12 active)

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

#### BMM Module - 3-Solutioning (24 active, 6 archived)

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

#### BMM Module - 4-Implementation (11 active)

| Workflow          | Path                                                      | Status |
| ----------------- | --------------------------------------------------------- | ------ |
| code-review       | `.bmad/bmm/workflows/4-implementation/code-review/`       | Active |
| correct-course    | `.bmad/bmm/workflows/4-implementation/correct-course/`    | Active |
| create-story      | `.bmad/bmm/workflows/4-implementation/create-story/`      | Active |
| dev-story         | `.bmad/bmm/workflows/4-implementation/dev-story/`         | Active |
| epic-tech-context | `.bmad/bmm/workflows/4-implementation/epic-tech-context/` | Active |
| retrospective     | `.bmad/bmm/workflows/4-implementation/retrospective/`     | Active |
| sprint-planning   | `.bmad/bmm/workflows/4-implementation/sprint-planning/`   | Active |
| sprint-rollup     | `.bmad/bmm/workflows/4-implementation/sprint-rollup/`     | Active |
| story-context     | `.bmad/bmm/workflows/4-implementation/story-context/`     | Active |
| story-done        | `.bmad/bmm/workflows/4-implementation/story-done/`        | Active |
| story-ready       | `.bmad/bmm/workflows/4-implementation/story-ready/`       | Active |

#### BMM Module - Diagrams (4 active)

| Workflow         | Path                                             | Status |
| ---------------- | ------------------------------------------------ | ------ |
| create-dataflow  | `.bmad/bmm/workflows/diagrams/create-dataflow/`  | Active |
| create-diagram   | `.bmad/bmm/workflows/diagrams/create-diagram/`   | Active |
| create-flowchart | `.bmad/bmm/workflows/diagrams/create-flowchart/` | Active |
| create-wireframe | `.bmad/bmm/workflows/diagrams/create-wireframe/` | Active |

#### BMM Module - Testarch (8 active)

| Workflow    | Path                                        | Status |
| ----------- | ------------------------------------------- | ------ |
| atdd        | `.bmad/bmm/workflows/testarch/atdd/`        | Active |
| automate    | `.bmad/bmm/workflows/testarch/automate/`    | Active |
| ci          | `.bmad/bmm/workflows/testarch/ci/`          | Active |
| framework   | `.bmad/bmm/workflows/testarch/framework/`   | Active |
| nfr-assess  | `.bmad/bmm/workflows/testarch/nfr-assess/`  | Active |
| test-design | `.bmad/bmm/workflows/testarch/test-design/` | Active |
| test-review | `.bmad/bmm/workflows/testarch/test-review/` | Active |
| trace       | `.bmad/bmm/workflows/testarch/trace/`       | Active |

#### BMM Module - Other (4 active)

| Workflow              | Path                                         | Status |
| --------------------- | -------------------------------------------- | ------ |
| document-project      | `.bmad/bmm/workflows/document-project/`      | Active |
| migrate-to-federation | `.bmad/bmm/workflows/migrate-to-federation/` | Active |
| workflow-status       | `.bmad/bmm/workflows/workflow-status/`       | Active |
| workflow-status/init  | `.bmad/bmm/workflows/workflow-status/init/`  | Active |

#### CIS Module (4 active)

| Workflow            | Path                                       | Status |
| ------------------- | ------------------------------------------ | ------ |
| design-thinking     | `.bmad/cis/workflows/design-thinking/`     | Active |
| innovation-strategy | `.bmad/cis/workflows/innovation-strategy/` | Active |
| problem-solving     | `.bmad/cis/workflows/problem-solving/`     | Active |
| storytelling        | `.bmad/cis/workflows/storytelling/`        | Active |

#### Core Module (2 active)

| Workflow      | Path                                  | Status |
| ------------- | ------------------------------------- | ------ |
| brainstorming | `.bmad/core/workflows/brainstorming/` | Active |
| party-mode    | `.bmad/core/workflows/party-mode/`    | Active |

#### Custom/Federated-Validation (3 active)

| Workflow              | Path                                                                         | Status |
| --------------------- | ---------------------------------------------------------------------------- | ------ |
| validate-constitution | `.bmad/custom/modules/federated-validation/workflows/validate-constitution/` | Active |
| validate-domain-prd   | `.bmad/custom/modules/federated-validation/workflows/validate-domain-prd/`   | Active |
| validate-epic         | `.bmad/custom/modules/federated-validation/workflows/validate-epic/`         | Active |

### New Workflows to Create (15)

> **Strategy:** Keep all 92 existing workflows. Update those that need entity-first detection or atom integration. Create only the workflows that don't exist yet.

#### Product-Soul Triad (2 NEW)

| Workflow                | Action     | Notes                |
| ----------------------- | ---------- | -------------------- |
| `validate-product-soul` | Create NEW | No existing workflow |
| `amend-product-soul`    | Create NEW | No existing workflow |

#### Story/Dev Cycle (5 NEW)

| Workflow               | Action     | Notes                |
| ---------------------- | ---------- | -------------------- |
| `validate-story`       | Create NEW | No existing workflow |
| `amend-story`          | Create NEW | No existing workflow |
| `amend-code`           | Create NEW | No existing workflow |
| `validate-code-review` | Create NEW | No existing workflow |
| `amend-code-review`    | Create NEW | No existing workflow |

#### Other Workflows (8 NEW)

| Category       | Workflows                                                                                                | Notes                |
| -------------- | -------------------------------------------------------------------------------------------------------- | -------------------- |
| Tech Specs (2) | `validate-tech-spec`, `amend-tech-spec`                                                                  | `tech-spec` exists   |
| Context (4)    | `validate-epic-tech-context`, `amend-epic-tech-context`, `validate-story-context`, `amend-story-context` | Base workflows exist |
| Research (2)   | `validate-research`, `amend-research`                                                                    | `research` exists    |

#### Summary

| Category                      | Count   |
| ----------------------------- | ------- |
| Existing workflows (keep all) | 92      |
| New workflows to create       | 15      |
| **Total After Audit**         | **107** |

#### Existing Workflows Requiring Updates

These existing workflows need entity-first detection and/or atom integration:

| Workflow                                                      | Update Needed          |
| ------------------------------------------------------------- | ---------------------- |
| `prd`, `validate-prd`, `amend-prd`                            | Entity-first detection |
| `architecture`, `validate-architecture`, `amend-architecture` | Entity-first detection |
| `create-ux`, `validate-ux`, `amend-ux`                        | Entity-first detection |
| `create-epics`, `validate-epics`, `amend-epics`               | Entity-first detection |
| `create-story`, `dev-story`, `code-review`                    | Atom integration       |
| `tech-spec`, `epic-tech-context`, `story-context`             | Atom integration       |
| `workflow-init`, `workflow-status`                            | Entity-first detection |
| `research`                                                    | Atom integration       |

---

## Appendix F: Deferred Improvements (Tech Debt)

### Automation & Tooling

| Improvement                | Effort | Tracking            |
| -------------------------- | ------ | ------------------- |
| YAML schema validation     | Medium | Create GitHub issue |
| Single-source event schema | Medium | Architecture ADR    |

### Content Scaffolding

| Improvement                | Effort | Tracking        |
| -------------------------- | ------ | --------------- |
| Module doc scaffolds       | High   | Epic 2+ backlog |
| Sprint status regeneration | Low    | Per-module      |

---

## Appendix G: Rollback & Recovery Procedures

### Pre-Execution Backup

```bash
git checkout -b backup/audit-$(date +%Y%m%d-%H%M%S)
git push origin backup/audit-$(date +%Y%m%d-%H%M%S)
git checkout main
```

### Phase-Specific Rollback

| Phase     | Trigger                  | Rollback Procedure                          |
| --------- | ------------------------ | ------------------------------------------- |
| Phase 0   | Atom validation fails    | `git reset --hard backup/audit-*`           |
| Phase 1   | Critical workflow broken | `git checkout backup -- .bmad/`             |
| Phase 2   | References broken        | Run `validate:links`; revert specific files |
| Phase 3-5 | Structural issues        | Document in Gap Report; forward fix         |

### Rollback Trigger Thresholds

| Metric                       | Threshold                     | Action                 |
| ---------------------------- | ----------------------------- | ---------------------- |
| `validate:docs` errors       | > 10                          | Pause and investigate  |
| `validate:links` broken refs | > 5 per phase                 | Revert phase           |
| Critical file deletion       | Any                           | Immediate rollback     |
| Merge conflicts              | Unresolvable after 2 attempts | Serialize work         |
| CI pipeline blocked          | > 30 minutes                  | Rollback to checkpoint |

### Recovery Checkpoints

```bash
# After each gate
git tag checkpoint/phase{N}-complete
git push origin checkpoint/phase{N}-complete
```

### Validation Before Proceeding

```bash
# Must pass ALL before marking phase complete
pnpm run validate:docs
pnpm run validate:links
pnpm exec tsx scripts/validation/validate-dependencies.ts --path docs
```

---

**End of Document**
