# Federated Documentation Audit & Remediation Plan

> **Purpose:** Comprehensive audit and remediation of all documentation artifacts to ensure alignment with the redesigned Federated Workflow System, Five Entity Types model, Zero-Trust Inheritance rules, and **SSOT Atom Architecture**.

---

## Document Governance

| Attribute        | Value                                                                                       |
| ---------------- | ------------------------------------------------------------------------------------------- |
| **Version**      | 6.8                                                                                         |
| **Status**       | In Progress — Phase 0 COMPLETE, Phase 1 COMPLETE, Phase 2 COMPLETE, Phase 3 IN PROGRESS     |
| **Owner**        | Platform Team                                                                               |
| **DRI**          | BMad Builder (Phase 0), Architect (Phase 2), Analyst (Phases 3-6) ([Glossary](#2-glossary)) |
| **Created**      | 2025-12-03                                                                                  |
| **Last Updated** | 2025-12-04                                                                                  |
| **Review Cycle** | After each micro-phase completion                                                           |
| **Approval**     | Phase 0 Gate PASSED, Phase 1 Gate PASSED, Phase 2 Gate PASSED — all validation scripts pass |

### Change Log

| Version | Date       | Author       | Changes                                                                                                                                                                                                                                                                         |
| ------- | ---------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 6.8     | 2025-12-04 | PM           | Phase 3.09 COMPLETE. Audited Constitution PRD against checklist. Fixed version mismatch (5.0 → 5.1). All PR/IC requirements validated, SSOT atom links verified. 3 non-blocking gaps documented.                                                                                |
| 6.7     | 2025-12-04 | Analyst      | Phase 3.04 COMPLETE. Generated manifest vs structure diff. Found: 10 `*_recovered.md` duplicates to delete, 6 undeclared platform dirs (OK), all Constitution/Infrastructure/Strategic entities COMPLIANT. Report: `docs/platform/validation/manifest-structure-diff-report.md` |
| 6.6     | 2025-12-04 | Analyst      | Phase 2.05 COMPLETE. Migration Validation passed: 35 atoms valid, 198 links validated, 90 files checked, zero errors. Phase 2 (Migration) now fully complete.                                                                                                                   |
| 6.5     | 2025-12-04 | Tech Writer  | Phase 2.04 COMPLETE. Updated all major docs to link to atoms. Constitution epics IC table, core-api PRD/architecture/events/api-reference, atom index with 35 entries. All validations pass (198 links, 90 files).                                                              |
| 6.4     | 2025-12-04 | Architect    | Phase 2.03 COMPLETE. Extracted 18 ADRs to atoms (SYS.017-SYS.034). Updated architecture.md with ADR Index table. 35 total atoms, all validations pass.                                                                                                                          |
| 6.3     | 2025-12-04 | BMad Builder | Phase 1.08 COMPLETE. Context + Research workflows: 8 NEW (validate/amend for tech-spec, epic-tech-context, story-context, research). Phase 1 now fully complete with 107 total workflows.                                                                                       |
| 6.2     | 2025-12-04 | Architect    | Phase 2.02 COMPLETE. Extracted 7 IC contracts to atoms (SYS.010-SYS.016). Updated Constitution PRD IC table + atom index. 17 total atoms, all validations pass.                                                                                                                 |
| 6.1     | 2025-12-04 | PM           | Phase 2.01 COMPLETE. Extracted 8 PR requirements to atoms (SYS.002-SYS.009). Updated Constitution PRD + Epics with atom references. All validations pass.                                                                                                                       |
| 6.0     | 2025-12-04 | BMad Builder | Phase 1.07 COMPLETE. Story/Dev workflows: 5 NEW (validate-story, amend-story, amend-code, validate-code-review, amend-code-review) + 3 updated with atom integration (create-story, dev-story, code-review).                                                                    |
| 5.9     | 2025-12-04 | BMad Builder | Phase 1.06 COMPLETE. Product-Soul Triad created: validate-product-soul + amend-product-soul workflows. Constitution-only (no routing needed).                                                                                                                                   |
| 5.8     | 2025-12-04 | BMad Builder | Phase 1.05 COMPLETE. Epics Triad verified: entity-first detection already implemented. All 8 epics workflows have proper routing and Five Entity Types support.                                                                                                                 |
| 5.7     | 2025-12-04 | BMad Builder | Phase 1.04 COMPLETE. UX Triad audit: entity-first detection already implemented. All 5 entity-specific UX checklists verified.                                                                                                                                                  |
| 5.6     | 2025-12-04 | BMad Builder | Phase 1.03 COMPLETE. Upgraded Architecture Triad: restored create-system-architecture, added entity-first detection, renamed to create-architecture.                                                                                                                            |
| 5.5     | 2025-12-04 | BMad Builder | Phase 1.01 COMPLETE. Verified all 92 workflows (85 active + 6 archived + 1 template). Added detailed inventory tables with status and update requirements.                                                                                                                      |
| 5.4     | 2025-12-04 | BMad Builder | Phase 1.02 COMPLETE. PRD Triad audit: entity-first detection already implemented. Deferred: checklist files creation, entity-menu.yaml verification.                                                                                                                            |
| 5.3     | 2025-12-04 | Analyst      | Phase 0 COMPLETE. Created validate-atoms.ts (0.04), implemented 5 gate rules (0.05), reviewed Product Soul (0.06), updated pre-commit (0.07) and CI (0.08).                                                                                                                     |
| 5.2     | 2025-12-04 | BMad Builder | Phase 0.01-0.03 complete. Changed atom CRUD from XML tasks to TypeScript scripts (scalability). Simplified atom ID (no type prefix). Auto-generated index.                                                                                                                      |
| 5.1     | 2025-12-04 | Claude Code  | Clarified: Product Soul special location, 92+15=107 workflow target, Phase 0 create/review pattern                                                                                                                                                                              |
| 5.0     | 2025-12-04 | Claude Code  | Major revision: fixed workflow inventory (92 total), unified taxonomy, sequential micro-phases, added coordination protocol, corrected product-soul location                                                                                                                    |
| 4.0     | 2025-12-04 | Claude Code  | Major refactor: consolidated duplicates, unified task IDs, added conventions, restructured sections                                                                                                                                                                             |
| 3.4     | 2025-12-04 | Claude Code  | Party mode review: Fixed workflow counts, research triad, BMM patterns, 47 micro-phases                                                                                                                                                                                         |
| 3.0     | 2025-12-03 | Claude Code  | Merged Platform Remediation + SSOT Specification + Workflow Gap Analysis                                                                                                                                                                                                        |
| 2.0     | 2025-12-02 | BMad Builder | Added Phase 0, SSOT Atom System, Gate Validation                                                                                                                                                                                                                                |
| 1.0     | 2025-12-01 | Analyst      | Initial audit plan creation                                                                                                                                                                                                                                                     |

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

> **Implementation Decision (v5.2):** CRUD operations implemented as TypeScript scripts rather than XML agent tasks.
>
> **Rationale:** Agent-based XML tasks would require reading all atom files into context for search/validation operations. With potentially hundreds of atoms, this approach:
>
> - Bloats context windows unnecessarily
> - Creates non-deterministic behavior
> - Scales poorly
>
> TypeScript scripts use file system operations directly, enabling efficient searching without LLM overhead.

| Operation     | Script                            | Purpose                 |
| ------------- | --------------------------------- | ----------------------- |
| **Create**    | `scripts/atoms/atom-create.ts`    | Add new atom            |
| **Search**    | `scripts/atoms/atom-search.ts`    | Find atoms by criteria  |
| **Amend**     | `scripts/atoms/atom-amend.ts`     | Modify existing atom    |
| **Deprecate** | `scripts/atoms/atom-deprecate.ts` | Mark atom as deprecated |

Usage:

```bash
pnpm exec tsx scripts/atoms/atom-create.ts --entity SYS --type requirement --title "My Atom"
pnpm exec tsx scripts/atoms/atom-search.ts --entity SHL --status draft
pnpm exec tsx scripts/atoms/atom-amend.ts --id SYS.001 --status approved
pnpm exec tsx scripts/atoms/atom-deprecate.ts --id SYS.001
```

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

1. Script-based validation during atom CRUD operations
2. Pre-commit hook: `.husky/pre-commit`
3. CI pipeline: `.github/workflows/docs-validation.yml`

> **Implementation Decision (v5.2):** Index auto-generation moved to `validate-atoms.ts`.
>
> **Rationale:** Manual index maintenance is error-prone and creates drift. The validation script regenerates `docs/_atoms/_index.md` on each run, ensuring the index always reflects actual atom state.

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

| ID   | Name                   | Owner | Action | Exit Criteria                                                                  | Status      |
| ---- | ---------------------- | ----- | ------ | ------------------------------------------------------------------------------ | ----------- |
| 0.01 | Atom Directory Setup   | BB    | Create | `docs/_atoms/` exists with ID scheme                                           | ✅ COMPLETE |
| 0.02 | Atom Template Creation | BB    | Create | Template + index section                                                       | ✅ COMPLETE |
| 0.03 | Atom CRUD Scripts      | BB    | Create | All 4 scripts functional                                                       | ✅ COMPLETE |
| 0.04 | Validation Script      | AN    | Create | `validate-atoms.ts` validates format + regenerates index                       | ✅ COMPLETE |
| 0.05 | Gate Validation Rules  | AN    | Create | 5 rules implemented in validate-atoms.ts                                       | ✅ COMPLETE |
| 0.06 | Product Soul Template  | AN    | Review | `docs/product-soul.md` follows template                                        | ✅ COMPLETE |
| 0.07 | Pre-commit Hook        | AN    | Review | `.husky/pre-commit` exists; add atom validation if missing                     | ✅ COMPLETE |
| 0.08 | CI Pipeline            | AN    | Review | `.github/workflows/docs-validation.yml` exists; add atom validation if missing | ✅ COMPLETE |

**Phase 0.01-0.03 Completion Notes (2025-12-04):**

| Deliverable    | Location                  | Notes                                                          |
| -------------- | ------------------------- | -------------------------------------------------------------- |
| Atom directory | `docs/_atoms/`            | Created with `_index.md`, `_schema.yaml`, `_template.md`       |
| ID scheme docs | `docs/_atoms/_index.md`   | Hierarchical IDs encode full lineage (no separate type prefix) |
| CRUD scripts   | `scripts/atoms/atom-*.ts` | TypeScript instead of XML (see Section 10.3 rationale)         |

**Key Design Decisions:**

1. **No type prefix in atom IDs** — The hierarchical ID itself (`SYS.001-SHL.001`) encodes the entity lineage. Adding `PR-`, `IC-`, `ADR-` prefixes would be redundant since the `type` field in frontmatter already captures this.

2. **TypeScript scripts over XML tasks** — Agents reading hundreds of atoms for search operations is computationally wasteful and bloats context. Scripts use file system operations directly.

3. **Auto-generated index** — The `_index.md` Atom Index table will be regenerated by `validate-atoms.ts` rather than manually maintained, preventing drift.

**Existing Infrastructure (as of 2025-12-04):**

- `.husky/pre-commit` — EXISTS (runs lint-staged + atom validation)
- `.github/workflows/docs-validation.yml` — EXISTS (runs validate:links + validate:docs + validate:atoms)
- `scripts/validation/validate-docs.js` — EXISTS
- `scripts/validation/validate-links.js` — EXISTS
- `scripts/validation/validate-dependencies.ts` — EXISTS
- `scripts/validation/validate-atoms.ts` — EXISTS (created 0.04)
- `scripts/atoms/atom-create.ts` — EXISTS (created 0.03)
- `scripts/atoms/atom-search.ts` — EXISTS (created 0.03)
- `scripts/atoms/atom-amend.ts` — EXISTS (created 0.03)
- `scripts/atoms/atom-deprecate.ts` — EXISTS (created 0.03)

**Phase 0.04-0.08 Completion Notes (2025-12-04):**

| Deliverable       | Location                                       | Notes                                                  |
| ----------------- | ---------------------------------------------- | ------------------------------------------------------ |
| Validation script | `scripts/validation/validate-atoms.ts`         | Implements all 5 gate rules                            |
| NPM script        | `package.json`                                 | Added `validate:atoms` command                         |
| Pre-commit hook   | `.husky/pre-commit`                            | Conditional atom validation on staged files            |
| CI pipeline       | `.github/workflows/docs-validation.yml`        | Added validate:atoms step + fixed product-soul.md path |
| Sample atoms      | `docs/_atoms/SYS.001.md`, `SYS.001-SHL.001.md` | Created for validation testing                         |

**Gate Validation Rules (0.05):**

| Rule | Name          | Description                                  | Severity |
| ---- | ------------- | -------------------------------------------- | -------- |
| 1    | Parent Exists | Parent atom (ID prefix) must exist           | BLOCK    |
| 2    | Entity Valid  | Entity path in frontmatter must resolve      | BLOCK    |
| 3    | ID Format     | ID matches `{ENTITY}.{SEQ}(-{CHILD}.{SEQ})*` | BLOCK    |
| 4    | Refs Resolve  | All internal `./ID.md` refs must resolve     | BLOCK    |
| 5    | No Deprecated | Cannot reference deprecated atoms            | BLOCK    |

**Phase 0 Gate Validation — PASSED:**

```
✅ pnpm run validate:docs
✅ pnpm run validate:links (54 links, 57 files)
✅ pnpm run validate:atoms (2 atoms, 0 errors)
```

### 11.3 Phase 1: Workflow Updates (8 micro-phases)

> **Strategy:** Keep all 92 existing workflows. Update those needing entity-first detection. Create 15 new workflows.

| ID   | Name                         | Action | Exit Criteria                           | Status      |
| ---- | ---------------------------- | ------ | --------------------------------------- | ----------- |
| 1.01 | Inventory Current Workflows  | Audit  | All 92 workflows catalogued with status | ✅ COMPLETE |
| 1.02 | PRD Triad Upgrade            | Audit  | Entity-first detection verified         | ✅ COMPLETE |
| 1.03 | Architecture Triad Upgrade   | Update | Entity-first detection added            | ✅ COMPLETE |
| 1.04 | UX Triad Upgrade             | Audit  | Entity-first detection verified         | ✅ COMPLETE |
| 1.05 | Epics Triad Upgrade          | Audit  | Entity-first detection verified         | ✅ COMPLETE |
| 1.06 | Product-Soul Triad           | Create | 2 NEW workflows (validate + amend)      | ✅ COMPLETE |
| 1.07 | Story/Dev Workflows          | Mixed  | 5 NEW + 3 updated with atom integration | ✅ COMPLETE |
| 1.08 | Context + Research Workflows | Mixed  | 8 NEW workflows created                 | ✅ COMPLETE |

**Phase 1.01 Completion Notes (2025-12-04):**

| Metric                                   | Value |
| ---------------------------------------- | ----- |
| Total workflows verified                 | 92    |
| Active workflows                         | 86    |
| Archived workflows                       | 6     |
| Workflows needing entity-first detection | 33    |
| Workflows needing atom integration       | 9     |
| Total workflows needing updates          | 42    |

**Breakdown by Module:**

| Module                      | Active | Archived | Template |
| --------------------------- | ------ | -------- | -------- |
| BMB                         | 9      | 0        | 1        |
| BMM 1-Analysis              | 4      | 0        | 0        |
| BMM 2-Plan                  | 12     | 0        | 0        |
| BMM 3-Solutioning           | 24     | 6        | 0        |
| BMM 4-Implementation        | 11     | 0        | 0        |
| BMM Diagrams                | 4      | 0        | 0        |
| BMM Testarch                | 8      | 0        | 0        |
| BMM Other                   | 4      | 0        | 0        |
| CIS                         | 4      | 0        | 0        |
| Core                        | 2      | 0        | 0        |
| Custom/Federated-Validation | 3      | 0        | 0        |
| **Total**                   | **85** | **6**    | **1**    |

> **Note:** The 85 active + 6 archived + 1 template = 92 total. The `workflow-status/init` is counted within BMM Other (4 workflows).

**Verified Workflow Inventory (1.01):**

<details>
<summary>BMB Module (9 active + 1 template)</summary>

| Workflow                          | Path                                                     | Status   | Needs Update? |
| --------------------------------- | -------------------------------------------------------- | -------- | ------------- |
| audit-workflow                    | `.bmad/bmb/workflows/audit-workflow/`                    | Active   | No            |
| convert-legacy                    | `.bmad/bmb/workflows/convert-legacy/`                    | Active   | No            |
| create-agent                      | `.bmad/bmb/workflows/create-agent/`                      | Active   | No            |
| create-module                     | `.bmad/bmb/workflows/create-module/`                     | Active   | No            |
| create-workflow                   | `.bmad/bmb/workflows/create-workflow/`                   | Active   | No            |
| create-workflow/workflow-template | `.bmad/bmb/workflows/create-workflow/workflow-template/` | Template | No            |
| edit-agent                        | `.bmad/bmb/workflows/edit-agent/`                        | Active   | No            |
| edit-module                       | `.bmad/bmb/workflows/edit-module/`                       | Active   | No            |
| edit-workflow                     | `.bmad/bmb/workflows/edit-workflow/`                     | Active   | No            |
| module-brief                      | `.bmad/bmb/workflows/module-brief/`                      | Active   | No            |

</details>

<details>
<summary>BMM 1-Analysis (4 active)</summary>

| Workflow           | Path                                                 | Status | Needs Update?    |
| ------------------ | ---------------------------------------------------- | ------ | ---------------- |
| brainstorm-project | `.bmad/bmm/workflows/1-analysis/brainstorm-project/` | Active | No               |
| domain-research    | `.bmad/bmm/workflows/1-analysis/domain-research/`    | Active | No               |
| product-brief      | `.bmad/bmm/workflows/1-analysis/product-brief/`      | Active | No               |
| research           | `.bmad/bmm/workflows/1-analysis/research/`           | Active | Atom integration |

</details>

<details>
<summary>BMM 2-Plan (12 active)</summary>

| Workflow            | Path                                                        | Status | Needs Update?    |
| ------------------- | ----------------------------------------------------------- | ------ | ---------------- |
| amend-domain-prd    | `.bmad/bmm/workflows/2-plan-workflows/amend-domain-prd/`    | Active | Entity-first     |
| amend-prd           | `.bmad/bmm/workflows/2-plan-workflows/amend-prd/`           | Active | Entity-first     |
| amend-system-prd    | `.bmad/bmm/workflows/2-plan-workflows/amend-system-prd/`    | Active | Entity-first     |
| create-domain-prd   | `.bmad/bmm/workflows/2-plan-workflows/create-domain-prd/`   | Active | Entity-first     |
| create-prd          | `.bmad/bmm/workflows/2-plan-workflows/create-prd/`          | Active | Entity-first     |
| create-system-prd   | `.bmad/bmm/workflows/2-plan-workflows/create-system-prd/`   | Active | Entity-first     |
| create-ux-design    | `.bmad/bmm/workflows/2-plan-workflows/create-ux-design/`    | Active | Entity-first     |
| prd                 | `.bmad/bmm/workflows/2-plan-workflows/prd/`                 | Active | Entity-first     |
| tech-spec           | `.bmad/bmm/workflows/2-plan-workflows/tech-spec/`           | Active | Atom integration |
| validate-domain-prd | `.bmad/bmm/workflows/2-plan-workflows/validate-domain-prd/` | Active | Entity-first     |
| validate-prd        | `.bmad/bmm/workflows/2-plan-workflows/validate-prd/`        | Active | Entity-first     |
| validate-system-prd | `.bmad/bmm/workflows/2-plan-workflows/validate-system-prd/` | Active | Entity-first     |

</details>

<details>
<summary>BMM 3-Solutioning (24 active, 6 archived)</summary>

| Workflow                             | Path                                                              | Status   | Needs Update? |
| ------------------------------------ | ----------------------------------------------------------------- | -------- | ------------- |
| amend-architecture                   | `.bmad/bmm/workflows/3-solutioning/amend-architecture/`           | Active   | Entity-first  |
| amend-domain-architecture            | `.bmad/bmm/workflows/3-solutioning/amend-domain-architecture/`    | Active   | Entity-first  |
| amend-domain-epics                   | `.bmad/bmm/workflows/3-solutioning/amend-domain-epics/`           | Active   | Entity-first  |
| amend-domain-ux                      | `.bmad/bmm/workflows/3-solutioning/amend-domain-ux/`              | Active   | Entity-first  |
| amend-epics                          | `.bmad/bmm/workflows/3-solutioning/amend-epics/`                  | Active   | Entity-first  |
| amend-system-architecture            | `.bmad/bmm/workflows/3-solutioning/amend-system-architecture/`    | Active   | Entity-first  |
| amend-system-epics                   | `.bmad/bmm/workflows/3-solutioning/amend-system-epics/`           | Active   | Entity-first  |
| amend-system-ux                      | `.bmad/bmm/workflows/3-solutioning/amend-system-ux/`              | Active   | Entity-first  |
| amend-ux                             | `.bmad/bmm/workflows/3-solutioning/amend-ux/`                     | Active   | Entity-first  |
| architecture                         | `.bmad/bmm/workflows/3-solutioning/architecture/`                 | Active   | Entity-first  |
| create-architecture                  | `.bmad/bmm/workflows/3-solutioning/create-architecture/`          | Active   | Entity-first  |
| create-epics-and-stories             | `.bmad/bmm/workflows/3-solutioning/create-epics-and-stories/`     | Active   | Entity-first  |
| create-epics                         | `.bmad/bmm/workflows/3-solutioning/create-epics/`                 | Active   | Entity-first  |
| create-ux                            | `.bmad/bmm/workflows/3-solutioning/create-ux/`                    | Active   | Entity-first  |
| implementation-readiness             | `.bmad/bmm/workflows/3-solutioning/implementation-readiness/`     | Active   | No            |
| validate-architecture                | `.bmad/bmm/workflows/3-solutioning/validate-architecture/`        | Active   | Entity-first  |
| validate-domain-architecture         | `.bmad/bmm/workflows/3-solutioning/validate-domain-architecture/` | Active   | Entity-first  |
| validate-domain-epics                | `.bmad/bmm/workflows/3-solutioning/validate-domain-epics/`        | Active   | Entity-first  |
| validate-domain-ux                   | `.bmad/bmm/workflows/3-solutioning/validate-domain-ux/`           | Active   | Entity-first  |
| validate-epics                       | `.bmad/bmm/workflows/3-solutioning/validate-epics/`               | Active   | Entity-first  |
| validate-system-architecture         | `.bmad/bmm/workflows/3-solutioning/validate-system-architecture/` | Active   | Entity-first  |
| validate-system-epics                | `.bmad/bmm/workflows/3-solutioning/validate-system-epics/`        | Active   | Entity-first  |
| validate-system-ux                   | `.bmad/bmm/workflows/3-solutioning/validate-system-ux/`           | Active   | Entity-first  |
| validate-ux                          | `.bmad/bmm/workflows/3-solutioning/validate-ux/`                  | Active   | Entity-first  |
| \_archive/create-domain-architecture | `.bmad/bmm/workflows/3-solutioning/_archive/`                     | Archived | N/A           |
| \_archive/create-domain-epics        | `.bmad/bmm/workflows/3-solutioning/_archive/`                     | Archived | N/A           |
| \_archive/create-domain-ux           | `.bmad/bmm/workflows/3-solutioning/_archive/`                     | Archived | N/A           |
| \_archive/create-system-architecture | `.bmad/bmm/workflows/3-solutioning/_archive/`                     | Archived | N/A           |
| \_archive/create-system-epics        | `.bmad/bmm/workflows/3-solutioning/_archive/`                     | Archived | N/A           |
| \_archive/create-system-ux           | `.bmad/bmm/workflows/3-solutioning/_archive/`                     | Archived | N/A           |

</details>

<details>
<summary>BMM 4-Implementation (11 active)</summary>

| Workflow          | Path                                                      | Status | Needs Update?    |
| ----------------- | --------------------------------------------------------- | ------ | ---------------- |
| code-review       | `.bmad/bmm/workflows/4-implementation/code-review/`       | Active | Atom integration |
| correct-course    | `.bmad/bmm/workflows/4-implementation/correct-course/`    | Active | No               |
| create-story      | `.bmad/bmm/workflows/4-implementation/create-story/`      | Active | Atom integration |
| dev-story         | `.bmad/bmm/workflows/4-implementation/dev-story/`         | Active | Atom integration |
| epic-tech-context | `.bmad/bmm/workflows/4-implementation/epic-tech-context/` | Active | Atom integration |
| retrospective     | `.bmad/bmm/workflows/4-implementation/retrospective/`     | Active | No               |
| sprint-planning   | `.bmad/bmm/workflows/4-implementation/sprint-planning/`   | Active | No               |
| sprint-rollup     | `.bmad/bmm/workflows/4-implementation/sprint-rollup/`     | Active | No               |
| story-context     | `.bmad/bmm/workflows/4-implementation/story-context/`     | Active | Atom integration |
| story-done        | `.bmad/bmm/workflows/4-implementation/story-done/`        | Active | No               |
| story-ready       | `.bmad/bmm/workflows/4-implementation/story-ready/`       | Active | No               |

</details>

<details>
<summary>BMM Diagrams (4 active)</summary>

| Workflow         | Path                                             | Status | Needs Update? |
| ---------------- | ------------------------------------------------ | ------ | ------------- |
| create-dataflow  | `.bmad/bmm/workflows/diagrams/create-dataflow/`  | Active | No            |
| create-diagram   | `.bmad/bmm/workflows/diagrams/create-diagram/`   | Active | No            |
| create-flowchart | `.bmad/bmm/workflows/diagrams/create-flowchart/` | Active | No            |
| create-wireframe | `.bmad/bmm/workflows/diagrams/create-wireframe/` | Active | No            |

</details>

<details>
<summary>BMM Testarch (8 active)</summary>

| Workflow    | Path                                        | Status | Needs Update? |
| ----------- | ------------------------------------------- | ------ | ------------- |
| atdd        | `.bmad/bmm/workflows/testarch/atdd/`        | Active | No            |
| automate    | `.bmad/bmm/workflows/testarch/automate/`    | Active | No            |
| ci          | `.bmad/bmm/workflows/testarch/ci/`          | Active | No            |
| framework   | `.bmad/bmm/workflows/testarch/framework/`   | Active | No            |
| nfr-assess  | `.bmad/bmm/workflows/testarch/nfr-assess/`  | Active | No            |
| test-design | `.bmad/bmm/workflows/testarch/test-design/` | Active | No            |
| test-review | `.bmad/bmm/workflows/testarch/test-review/` | Active | No            |
| trace       | `.bmad/bmm/workflows/testarch/trace/`       | Active | No            |

</details>

<details>
<summary>BMM Other (4 active)</summary>

| Workflow              | Path                                         | Status | Needs Update? |
| --------------------- | -------------------------------------------- | ------ | ------------- |
| document-project      | `.bmad/bmm/workflows/document-project/`      | Active | No            |
| migrate-to-federation | `.bmad/bmm/workflows/migrate-to-federation/` | Active | No            |
| workflow-status       | `.bmad/bmm/workflows/workflow-status/`       | Active | Entity-first  |
| workflow-status/init  | `.bmad/bmm/workflows/workflow-status/init/`  | Active | Entity-first  |

</details>

<details>
<summary>CIS Module (4 active)</summary>

| Workflow            | Path                                       | Status | Needs Update? |
| ------------------- | ------------------------------------------ | ------ | ------------- |
| design-thinking     | `.bmad/cis/workflows/design-thinking/`     | Active | No            |
| innovation-strategy | `.bmad/cis/workflows/innovation-strategy/` | Active | No            |
| problem-solving     | `.bmad/cis/workflows/problem-solving/`     | Active | No            |
| storytelling        | `.bmad/cis/workflows/storytelling/`        | Active | No            |

</details>

<details>
<summary>Core Module (2 active)</summary>

| Workflow      | Path                                  | Status | Needs Update? |
| ------------- | ------------------------------------- | ------ | ------------- |
| brainstorming | `.bmad/core/workflows/brainstorming/` | Active | No            |
| party-mode    | `.bmad/core/workflows/party-mode/`    | Active | No            |

</details>

<details>
<summary>Custom/Federated-Validation (3 active)</summary>

| Workflow              | Path                                                                         | Status | Needs Update? |
| --------------------- | ---------------------------------------------------------------------------- | ------ | ------------- |
| validate-constitution | `.bmad/custom/modules/federated-validation/workflows/validate-constitution/` | Active | No            |
| validate-domain-prd   | `.bmad/custom/modules/federated-validation/workflows/validate-domain-prd/`   | Active | No            |
| validate-epic         | `.bmad/custom/modules/federated-validation/workflows/validate-epic/`         | Active | No            |

</details>

**Workflows Requiring Updates Summary:**

| Update Type               | Count  | Target Phases |
| ------------------------- | ------ | ------------- |
| Entity-first detection    | 33     | 1.02-1.05     |
| Atom integration          | 9      | 1.07-1.08     |
| **Total needing updates** | **42** |               |

**Phase 1.02 Completion Notes (2025-12-04):**

**Result: NO UPGRADE NEEDED — Entity-first detection already implemented.**

The PRD Triad uses a sophisticated two-tier routing architecture:

| Workflow               | Type             | Entity Detection                                                          |
| ---------------------- | ---------------- | ------------------------------------------------------------------------- |
| `prd/`                 | Unified Creation | Federated hierarchy variables (`output_folder_resolved`, `current_level`) |
| `validate-prd/`        | Router           | `select-entity.xml` → `detect-entity-type.xml` → routes to system/domain  |
| `amend-prd/`           | Router           | `select-entity.xml` → `detect-entity-type.xml` → routes to system/domain  |
| `validate-system-prd/` | System-specific  | Fixed Constitution path                                                   |
| `validate-domain-prd/` | Domain-specific  | Entity-specific checklists per type                                       |
| `amend-system-prd/`    | System-specific  | Constitution amendment                                                    |
| `amend-domain-prd/`    | Domain-specific  | Inheritance-aware amendment                                               |

**Key Components Verified:**

| Component                 | Path                                       | Status                                |
| ------------------------- | ------------------------------------------ | ------------------------------------- |
| Entity Detection Task     | `.bmad/bmm/tasks/detect-entity-type.xml`   | ✅ Five entity types, manifest lookup |
| Entity Selection Task     | `.bmad/bmm/tasks/select-entity.xml`        | ✅ Lightweight menu, fuzzy matching   |
| Inheritance Validation    | `.bmad/bmm/tasks/validate-inheritance.xml` | ✅ Referenced in workflows            |
| Traceability Verification | `.bmad/bmm/tasks/verify-traceability.xml`  | ✅ Referenced in workflows            |

**Deferred Items (Non-blocking):**

| Item                       | Severity | Phase | Notes                                                                                                                                             |
| -------------------------- | -------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Entity-specific checklists | LOW      | 3-4   | `infrastructure-prd-checklist.md`, `strategic-prd-checklist.md`, `coordination-prd-checklist.md`, `business-prd-checklist.md` — may need creation |
| `entity-menu.yaml`         | LOW      | 3-4   | Verify exists at `.bmad/bmm/data/entity-menu.yaml`                                                                                                |

**Phase 1.03 Completion Notes (2025-12-04):**

**Result: UPGRADED — Entity-first detection added to create-architecture.**

The Architecture Triad was upgraded from Constitution-specific to entity-agnostic:

| Before                                            | After                                     |
| ------------------------------------------------- | ----------------------------------------- |
| `create-system-architecture/` (Constitution-only) | `create-architecture/` (Entity-first)     |
| Hardcoded `entity_type: constitution`             | Runtime detection via `select-entity.xml` |
| Single template                                   | Two templates: constitution + domain      |

**Changes Made:**

1. **Restored** `create-system-architecture/` from archive
2. **Updated** `workflow.yaml`:
   - Removed hardcoded Constitution entity type
   - Added entity-first detection variables
   - Added `select_entity_task` reference
   - Added `templates.constitution` and `templates.domain`
   - Added `checklists.constitution` and `checklists.domain`
   - Added `parent_architecture_path` for inheritance validation
   - Added `validate_inheritance_task` reference
3. **Rewrote** `instructions.md`:
   - Step 0: Entity detection via `select-entity` task
   - Conditional logic: Constitution vs Domain-specific sections
   - Inheritance validation for non-Constitution entities
   - Dynamic template and checklist selection
4. **Copied** `domain-architecture-template.md` from archive
5. **Created** shared resource files:
   - `decision-catalog.yaml` — architectural decision options
   - `architecture-patterns.yaml` — pattern reference catalog
   - `pattern-categories.csv` — pattern classification data
6. **Renamed** folder to `create-architecture/`

**Final Structure:**

```
.bmad/bmm/workflows/3-solutioning/create-architecture/
├── architecture-patterns.yaml
├── constitution-architecture-template.md
├── decision-catalog.yaml
├── domain-architecture-template.md
├── instructions.md
├── pattern-categories.csv
└── workflow.yaml
```

**Triad Status:**

| Workflow                        | Entity-First      | Status       |
| ------------------------------- | ----------------- | ------------ |
| `create-architecture/`          | ✅ Yes            | UPGRADED     |
| `validate-architecture/`        | ✅ Yes (router)   | Already had  |
| `amend-architecture/`           | ✅ Yes (router)   | Already had  |
| `validate-system-architecture/` | Constitution-only | Sub-workflow |
| `validate-domain-architecture/` | Domain-specific   | Sub-workflow |
| `amend-system-architecture/`    | Constitution-only | Sub-workflow |
| `amend-domain-architecture/`    | Domain-specific   | Sub-workflow |

**Phase 1.04 Completion Notes (2025-12-04):**

**Result: NO UPGRADE NEEDED — Entity-first detection already implemented.**

The UX Triad uses the identical two-tier routing architecture as the PRD Triad:

| Workflow              | Type             | Entity Detection                               |
| --------------------- | ---------------- | ---------------------------------------------- |
| `create-ux/`          | Unified Creation | `select-entity.xml` → `detect-entity-type.xml` |
| `validate-ux/`        | Router           | `select-entity.xml` → routes to system/domain  |
| `amend-ux/`           | Router           | `select-entity.xml` → routes to system/domain  |
| `validate-system-ux/` | System-specific  | Fixed Constitution path                        |
| `validate-domain-ux/` | Domain-specific  | Entity-specific checklists per type            |
| `amend-system-ux/`    | System-specific  | Constitution UX amendment                      |
| `amend-domain-ux/`    | Domain-specific  | Inheritance-aware amendment                    |

**Entity-Specific UX Checklists Verified:**

| Checklist      | Path                                                  | Status    |
| -------------- | ----------------------------------------------------- | --------- |
| Constitution   | `.bmad/bmm/checklists/constitution-ux-checklist.md`   | ✅ EXISTS |
| Infrastructure | `.bmad/bmm/checklists/infrastructure-ux-checklist.md` | ✅ EXISTS |
| Strategic      | `.bmad/bmm/checklists/strategic-ux-checklist.md`      | ✅ EXISTS |
| Coordination   | `.bmad/bmm/checklists/coordination-ux-checklist.md`   | ✅ EXISTS |
| Business       | `.bmad/bmm/checklists/business-ux-checklist.md`       | ✅ EXISTS |

**Key Observations:**

1. **Unified Creation Workflow** — `create-ux/` handles ALL entity types with conditional logic for Constitution vs domain entities
2. **Inheritance Validation** — Non-Constitution entities invoke `validate-inheritance.xml` before finalization
3. **Template Selection** — Two templates: `constitution-ux-template.md` and `domain-ux-template.md`
4. **Full Coverage** — All 5 entity-specific checklists exist (unlike PRD Triad which has deferred items)

**Comparison to PRD Triad:**

| Feature                    | PRD Triad   | UX Triad    |
| -------------------------- | ----------- | ----------- |
| Entity-first detection     | ✅          | ✅          |
| Router workflows           | ✅          | ✅          |
| Entity-specific checklists | ⚠️ Deferred | ✅ Complete |
| Inheritance validation     | ✅          | ✅          |

**Phase 1.05 Completion Notes (2025-12-04):**

**Result: NO UPGRADE NEEDED — Entity-first detection already implemented.**

The Epics Triad has full entity-first detection with a sophisticated three-tier architecture:

| Workflow                    | Type             | Entity Detection                                        |
| --------------------------- | ---------------- | ------------------------------------------------------- |
| `create-epics/`             | Unified Creation | `select-entity.xml` → conditional logic per entity type |
| `create-epics-and-stories/` | Unified          | Federated hierarchy via `output_folder_resolved`        |
| `validate-epics/`           | Router           | `select-entity.xml` → routes to system/domain           |
| `amend-epics/`              | Router           | `select-entity.xml` → routes to system/domain           |
| `validate-system-epics/`    | System-specific  | Fixed Constitution path                                 |
| `validate-domain-epics/`    | Domain-specific  | Entity-specific checklists + inheritance validation     |
| `amend-system-epics/`       | System-specific  | Impact analysis on downstream entities                  |
| `amend-domain-epics/`       | Domain-specific  | Inheritance-aware amendment                             |

**Key Implementation Features:**

1. **Five Entity Types Support** — `create-epics/` has explicit conditional blocks for all five entity types:
   - Constitution: PR-xxx, IC-xxx, NFR-xxx extraction
   - Infrastructure Module: FR-{MOD}-xxx + interface documentation
   - Strategic Container: FR-{CAT}-xxx + strategic alignment
   - Coordination Unit: FR-{CAT}-{SUB}-xxx + orchestration requirements
   - Business Module: FR-{CAT}-{SUB}-{MOD}-xxx + feature requirements

2. **Two-Tier Routing** — Router workflows (`validate-epics/`, `amend-epics/`) invoke:
   - `select-entity.xml` for lightweight entity selection
   - `detect-entity-type.xml` for manifest.yaml lookup (when needed)

3. **Inheritance Validation** — All non-Constitution entities invoke `validate-inheritance.xml` (step 4)

4. **Traceability Verification** — `verify-traceability.xml` ensures PRD→Epic coverage (step 4)

5. **Entity-Specific Checklists** — `validate-domain-epics/` references:
   - `.bmad/bmm/checklists/infrastructure-epics-checklist.md`
   - `.bmad/bmm/checklists/strategic-epics-checklist.md`
   - `.bmad/bmm/checklists/coordination-epics-checklist.md`
   - `.bmad/bmm/checklists/business-epics-checklist.md`

**Triad Comparison Summary:**

| Triad        | Entity-First       | Router Pattern | Checklists  | Inheritance |
| ------------ | ------------------ | -------------- | ----------- | ----------- |
| PRD          | ✅                 | ✅             | ⚠️ Deferred | ✅          |
| Architecture | ✅ (upgraded 1.03) | ✅             | ✅          | ✅          |
| UX           | ✅                 | ✅             | ✅ Complete | ✅          |
| **Epics**    | ✅                 | ✅             | ✅ Complete | ✅          |

**Phase 1.01-1.05 Cumulative Progress:**

| Triad        | Workflows Audited | Upgrades Needed            | Status |
| ------------ | ----------------- | -------------------------- | ------ |
| PRD          | 12                | 0 (already implemented)    | ✅     |
| Architecture | 7                 | 1 (`create-architecture/`) | ✅     |
| UX           | 7                 | 0 (already implemented)    | ✅     |
| Epics        | 8                 | 0 (already implemented)    | ✅     |
| **Total**    | **34**            | **1**                      | ✅     |

**Phase 1.06 Completion Notes (2025-12-04):**

**Result: 2 NEW WORKFLOWS CREATED — Product-Soul Triad now complete.**

Product Soul is unique among BMAD artifacts:

- Lives at special root location: `docs/product-soul.md`
- Constitution-level ONLY (no entity variants)
- No routing workflows needed (unlike PRD/Architecture/UX/Epics)

**New Workflows Created:**

| Workflow                | Path                                                    | Components                                                                  |
| ----------------------- | ------------------------------------------------------- | --------------------------------------------------------------------------- |
| `validate-product-soul` | `.bmad/bmm/workflows/1-analysis/validate-product-soul/` | workflow.yaml, instructions.md, checklist.md, validation-report-template.md |
| `amend-product-soul`    | `.bmad/bmm/workflows/1-analysis/amend-product-soul/`    | workflow.yaml, instructions.md, amendment-log-template.md                   |

**Product-Soul Triad Summary:**

| Workflow                 | Purpose                                           | Status  |
| ------------------------ | ------------------------------------------------- | ------- |
| `product-brief` (create) | Interactive discovery → Product Soul creation     | Existed |
| `validate-product-soul`  | Validate against BMAD standards + checklist       | **NEW** |
| `amend-product-soul`     | Guided amendments with downstream impact analysis | **NEW** |

**Key Design Decisions:**

1. **No routing needed** — Product Soul is Constitution-only, so no entity detection/routing required
2. **Downstream impact awareness** — Amendment workflow warns about PRD/Architecture/Epics/UX impact
3. **Validation report** — Generates structured report with PASS/CONDITIONAL PASS/FAIL status
4. **Amendment log** — Tracks all changes with before/after content and rationale

**Phase 1.01-1.06 Cumulative Progress:**

| Triad        | Workflows | Created | Updated | Status |
| ------------ | --------- | ------- | ------- | ------ |
| PRD          | 12        | 0       | 0       | ✅     |
| Architecture | 7         | 0       | 1       | ✅     |
| UX           | 7         | 0       | 0       | ✅     |
| Epics        | 8         | 0       | 0       | ✅     |
| Product-Soul | 3         | **2**   | 0       | ✅     |
| **Total**    | **37**    | **2**   | **1**   | ✅     |

**Phase 1.07 Completion Notes (2025-12-04):**

**Result: 5 NEW WORKFLOWS CREATED + 3 UPDATED with SSOT Atom Integration**

This phase completes the Story/Dev workflow cycle with validate/amend patterns and integrates the SSOT Atom System into the implementation phase.

**New Workflows Created:**

| Workflow               | Path                                                         | Purpose                                          | Components                                   |
| ---------------------- | ------------------------------------------------------------ | ------------------------------------------------ | -------------------------------------------- |
| `validate-story`       | `.bmad/bmm/workflows/4-implementation/validate-story/`       | Validates drafted stories meet quality standards | workflow.yaml, instructions.md, checklist.md |
| `amend-story`          | `.bmad/bmm/workflows/4-implementation/amend-story/`          | Amends drafted stories before development        | workflow.yaml, instructions.md, checklist.md |
| `amend-code`           | `.bmad/bmm/workflows/4-implementation/amend-code/`           | Targeted code changes (review fixes, tech debt)  | workflow.yaml, instructions.md, checklist.md |
| `validate-code-review` | `.bmad/bmm/workflows/4-implementation/validate-code-review/` | Validates code review thoroughness               | workflow.yaml, instructions.md, checklist.md |
| `amend-code-review`    | `.bmad/bmm/workflows/4-implementation/amend-code-review/`    | Updates/amends existing code reviews             | workflow.yaml, instructions.md, checklist.md |

**Workflows Updated with Atom Integration:**

| Workflow       | Changes                                                                                                                                            |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `create-story` | Added atoms_dir, atom_search_script, atom_entity_filter. New step 1.6 for atom search. Dev Notes includes "SSOT Atom References" subsection.       |
| `dev-story`    | Added atom integration variables. New step 0.6 to load atom references from story. Step 2 includes atom compliance checking during implementation. |
| `code-review`  | Added atom integration. New step 4C.5 for SSOT Atom Compliance Validation. Review report includes "SSOT Atom Compliance" section.                  |

**Story/Dev Workflow Lifecycle (Complete):**

```
create-story → validate-story → story-ready → story-context
                    ↓                             ↓
               amend-story              dev-story (with atoms)
                                              ↓
                                    code-review (with atoms)
                                         ↓        ↓
                              validate-code-review  amend-code-review
                                         ↓              ↓
                                    amend-code → story-done
```

**Phase 1.01-1.07 Cumulative Progress:**

| Area         | Workflows | Created | Updated | Status |
| ------------ | --------- | ------- | ------- | ------ |
| PRD          | 12        | 0       | 0       | ✅     |
| Architecture | 7         | 0       | 1       | ✅     |
| UX           | 7         | 0       | 0       | ✅     |
| Epics        | 8         | 0       | 0       | ✅     |
| Product-Soul | 3         | 2       | 0       | ✅     |
| Story/Dev    | 13        | **5**   | **3**   | ✅     |
| **Total**    | **50**    | **7**   | **4**   | ✅     |

**Phase 1.08 Completion Notes (2025-12-04):**

**Result: 8 NEW WORKFLOWS CREATED — Context + Research Triads Complete**

This phase completes the validation and amendment workflows for context and research artifacts, establishing complete triad coverage.

**New Workflows Created:**

| Workflow                     | Path                                                               | Purpose                                              | Components                                                                  |
| ---------------------------- | ------------------------------------------------------------------ | ---------------------------------------------------- | --------------------------------------------------------------------------- |
| `validate-tech-spec`         | `.bmad/bmm/workflows/2-plan-workflows/validate-tech-spec/`         | Validates tech specs for completeness and accuracy   | workflow.yaml, instructions.md, checklist.md, validation-report-template.md |
| `amend-tech-spec`            | `.bmad/bmm/workflows/2-plan-workflows/amend-tech-spec/`            | Amends tech specs with scope/approach changes        | workflow.yaml, instructions.md, amendment-log-template.md                   |
| `validate-epic-tech-context` | `.bmad/bmm/workflows/4-implementation/validate-epic-tech-context/` | Validates epic technical context for story readiness | workflow.yaml, instructions.md, checklist.md                                |
| `amend-epic-tech-context`    | `.bmad/bmm/workflows/4-implementation/amend-epic-tech-context/`    | Amends epic context with story/approach changes      | workflow.yaml, instructions.md, amendment-log-template.md                   |
| `validate-story-context`     | `.bmad/bmm/workflows/4-implementation/validate-story-context/`     | Validates story context XML for dev readiness        | workflow.yaml, instructions.md, checklist.md                                |
| `amend-story-context`        | `.bmad/bmm/workflows/4-implementation/amend-story-context/`        | Amends/refreshes story context XML                   | workflow.yaml, instructions.md                                              |
| `validate-research`          | `.bmad/bmm/workflows/1-analysis/validate-research/`                | Validates research for sources and actionability     | workflow.yaml, instructions.md, checklist.md                                |
| `amend-research`             | `.bmad/bmm/workflows/1-analysis/amend-research/`                   | Amends research with fresh data and sources          | workflow.yaml, instructions.md, amendment-log-template.md                   |

**Triad Coverage Summary:**

| Artifact Type     | Create            | Validate                       | Amend                       | Status |
| ----------------- | ----------------- | ------------------------------ | --------------------------- | ------ |
| Tech Spec         | tech-spec         | **validate-tech-spec**         | **amend-tech-spec**         | ✅     |
| Epic Tech Context | epic-tech-context | **validate-epic-tech-context** | **amend-epic-tech-context** | ✅     |
| Story Context     | story-context     | **validate-story-context**     | **amend-story-context**     | ✅     |
| Research          | research          | **validate-research**          | **amend-research**          | ✅     |

**Phase 1 Complete — All 8 Micro-Phases Done:**

| Area             | Workflows | Created | Updated | Status |
| ---------------- | --------- | ------- | ------- | ------ |
| PRD              | 12        | 0       | 0       | ✅     |
| Architecture     | 7         | 0       | 1       | ✅     |
| UX               | 7         | 0       | 0       | ✅     |
| Epics            | 8         | 0       | 0       | ✅     |
| Product-Soul     | 3         | 2       | 0       | ✅     |
| Story/Dev        | 13        | 5       | 3       | ✅     |
| Context/Research | 12        | **8**   | 0       | ✅     |
| **Total**        | **62**    | **15**  | **4**   | ✅     |

**Phase 1 Gate: PASSED**

- 92 existing workflows audited and updated as needed
- 15 new workflows created (target achieved)
- Total: 107 workflows (92 + 15)

### 11.4 Phase 2: Migration (5 micro-phases)

| ID   | Name                 | Exit Criteria           | Status      |
| ---- | -------------------- | ----------------------- | ----------- |
| 2.01 | Extract PR-xxx       | All PR atoms extracted  | ✅ COMPLETE |
| 2.02 | Extract IC-xxx       | All IC atoms extracted  | ✅ COMPLETE |
| 2.03 | Extract ADR-xxx      | All ADR atoms extracted | ✅ COMPLETE |
| 2.04 | Update References    | All docs link to atoms  | ✅ COMPLETE |
| 2.05 | Migration Validation | Zero broken refs        | ✅ COMPLETE |

**Phase 2.01 Completion Notes (2025-12-04):**

| Deliverable | Location                 | Notes                                  |
| ----------- | ------------------------ | -------------------------------------- |
| SYS.002     | `docs/_atoms/SYS.002.md` | PR-001: Multi-tenant RLS Architecture  |
| SYS.003     | `docs/_atoms/SYS.003.md` | PR-002: Event Spine Emission           |
| SYS.004     | `docs/_atoms/SYS.004.md` | PR-003: API Authentication Requirement |
| SYS.005     | `docs/_atoms/SYS.005.md` | PR-004: Soul Read-Only Access          |
| SYS.006     | `docs/_atoms/SYS.006.md` | PR-005: Permission Primitives          |
| SYS.007     | `docs/_atoms/SYS.007.md` | PR-006: Automated Action Logging       |
| SYS.008     | `docs/_atoms/SYS.008.md` | PR-007: Graceful Module Failure        |
| SYS.009     | `docs/_atoms/SYS.009.md` | PR-008: Soul-Aware Vocabulary          |

**Documents Updated:**

| Document                 | Changes                                                          |
| ------------------------ | ---------------------------------------------------------------- |
| `docs/platform/prd.md`   | Added Atom ID column to PR table, linked to atoms                |
| `docs/platform/epics.md` | Updated traceability table, all story traces now reference atoms |

**Validation Results:**

```
✅ pnpm run validate:atoms — 10 atoms, 0 errors
✅ pnpm run validate:links — 89 links, 65 files
```

**Phase 2.02 Completion Notes (2025-12-04):**

| Deliverable | Location                 | Notes                                      |
| ----------- | ------------------------ | ------------------------------------------ |
| SYS.010     | `docs/_atoms/SYS.010.md` | IC-001: Event Envelope Schema              |
| SYS.011     | `docs/_atoms/SYS.011.md` | IC-002: Event Naming Convention            |
| SYS.012     | `docs/_atoms/SYS.012.md` | IC-003: Module Registration Manifest       |
| SYS.013     | `docs/_atoms/SYS.013.md` | IC-004: Soul Access API                    |
| SYS.014     | `docs/_atoms/SYS.014.md` | IC-005: Recommendation Submission Protocol |
| SYS.015     | `docs/_atoms/SYS.015.md` | IC-006: Notification Delivery Contract     |
| SYS.016     | `docs/_atoms/SYS.016.md` | IC-007: Permission Check Protocol          |

**Documents Updated:**

| Document                | Changes                                                        |
| ----------------------- | -------------------------------------------------------------- |
| `docs/platform/prd.md`  | Added Atom column to IC table, linked all 7 contracts to atoms |
| `docs/_atoms/_index.md` | Updated index with all 17 atoms including Legacy ID column     |

**Validation Results:**

```
✅ pnpm run validate:atoms — 17 atoms, 0 errors
✅ pnpm run validate:links — 96 links, 72 files
```

**Phase 2.03 Completion Notes (2025-12-04):**

| Deliverable | Location                 | Notes                                              |
| ----------- | ------------------------ | -------------------------------------------------- |
| SYS.017     | `docs/_atoms/SYS.017.md` | ADR-001: Universal Soul Orchestration              |
| SYS.018     | `docs/_atoms/SYS.018.md` | ADR-002: Event Envelope & Schema                   |
| SYS.019     | `docs/_atoms/SYS.019.md` | ADR-003: Multi-Tenant Security (RLS)               |
| SYS.020     | `docs/_atoms/SYS.020.md` | ADR-004: Kubernetes First (Category Cluster)       |
| SYS.021     | `docs/_atoms/SYS.021.md` | ADR-006: Tri-State Memory Architecture             |
| SYS.022     | `docs/_atoms/SYS.022.md` | ADR-007: Federated Soul Registry                   |
| SYS.023     | `docs/_atoms/SYS.023.md` | ADR-008: Python for Agent Layer                    |
| SYS.024     | `docs/_atoms/SYS.024.md` | ADR-009: Cross-Runtime Contract Strategy           |
| SYS.025     | `docs/_atoms/SYS.025.md` | ADR-010: Resilience & Graceful Degradation         |
| SYS.026     | `docs/_atoms/SYS.026.md` | ADR-011: Hierarchical Pulse Architecture           |
| SYS.027     | `docs/_atoms/SYS.027.md` | ADR-012: Copilot Widget Architecture               |
| SYS.028     | `docs/_atoms/SYS.028.md` | ADR-013: Narrative Continuity & UX Philosophy      |
| SYS.029     | `docs/_atoms/SYS.029.md` | ADR-014: Module Registration Architecture (IC-003) |
| SYS.030     | `docs/_atoms/SYS.030.md` | ADR-015: Permission Enforcement Architecture       |
| SYS.031     | `docs/_atoms/SYS.031.md` | ADR-016: Soul Access Architecture (IC-004, IC-005) |
| SYS.032     | `docs/_atoms/SYS.032.md` | ADR-017: Notification Delivery Architecture        |
| SYS.033     | `docs/_atoms/SYS.033.md` | ADR-018: Automated Action Explanation Pattern      |
| SYS.034     | `docs/_atoms/SYS.034.md` | ADR-020: Sibling Dependency Law                    |

> **Note:** ADR-005 and ADR-019 are reserved for future use.

**Documents Updated:**

| Document                        | Changes                                                 |
| ------------------------------- | ------------------------------------------------------- |
| `docs/platform/architecture.md` | Added ADR Index table with atom links before ADR detail |
| `docs/_atoms/_index.md`         | Auto-regenerated with 35 total atoms                    |

**Validation Results:**

```
✅ pnpm run validate:atoms — 35 atoms, 0 errors
```

**Phase 2.04 Completion Notes (2025-12-04):**

Updated all documentation to link to SSOT atoms when referencing Constitution-level requirements.

**Documents Updated:**

| Document                                  | Changes                                                                                                |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `docs/platform/epics.md`                  | Added Atom ID column to IC Coverage table, linked all 7 ICs to atoms                                   |
| `docs/_atoms/_index.md`                   | Updated index with 35 atoms including all ADRs (SYS.017-034)                                           |
| `docs/platform/core-api/prd.md`           | Added atom links to inherited constraints, FR table, capability table, interfaces, traceability tables |
| `docs/platform/core-api/architecture.md`  | Added atom links to PR-001, PR-002 section headings                                                    |
| `docs/platform/core-api/events.md`        | Added atom links to IC-001, IC-002, IC-005 references                                                  |
| `docs/platform/core-api/api-reference.md` | Added atom link to IC-004 Soul section heading                                                         |

**Validation Results:**

```
✅ pnpm run validate:atoms — 35 atoms, 0 errors
✅ pnpm run validate:links — 198 links, 90 files
```

**Phase 2.05 Completion Notes (2025-12-04):**

Final migration validation confirming all SSOT atom infrastructure is complete and fully operational.

**Validation Suite Results:**

| Validation Script | Result    | Details                                                |
| ----------------- | --------- | ------------------------------------------------------ |
| `validate:atoms`  | ✅ PASSED | 35 atoms checked, 0 errors, 0 warnings                 |
| `validate:links`  | ✅ PASSED | 198 links validated, 90 files checked                  |
| `validate:docs`   | ✅ PASSED | Constitution docs, sprint status, cross-refs all valid |

**Exit Criteria Verified:**

| Criterion             | Status    | Evidence                           |
| --------------------- | --------- | ---------------------------------- |
| Zero broken refs      | ✅ PASSED | All 198 links resolve correctly    |
| All atoms valid       | ✅ PASSED | 35 atoms pass schema validation    |
| Cross-refs consistent | ✅ PASSED | Constitution → Atom links verified |

**Phase 2 Summary:**

| Micro-Phase | Deliverable           | Count     |
| ----------- | --------------------- | --------- |
| 2.01        | PR atoms extracted    | 8         |
| 2.02        | IC atoms extracted    | 7         |
| 2.03        | ADR atoms extracted   | 18        |
| 2.04        | References updated    | 6 docs    |
| 2.05        | Migration validated   | 3 scripts |
| **Total**   | **Atoms in registry** | **35**    |

> **PHASE 2 GATE: PASSED** — All migration tasks complete. Ready for Phase 3 (Audit Group A).

### 11.5 Phase 3: Audit Group A (PM Tasks)

**Phase 3.09 Completion Notes (2025-12-04):**

Task 3.09 audits the Constitution PRD (`docs/platform/prd.md`) against the `constitution-prd-checklist.md`.

| Category                | Status    | Findings                                                                      |
| ----------------------- | --------- | ----------------------------------------------------------------------------- |
| **Frontmatter**         | ✅ PASSED | All required fields present. Fixed version mismatch (5.0 → 5.1 synced).       |
| **PR-xxx Requirements** | ✅ PASSED | 8 PRs (PR-001 to PR-008), sequential, no gaps, all linked to SSOT atoms.      |
| **IC-xxx Contracts**    | ✅ PASSED | 7 ICs (IC-001 to IC-007), sequential, versioned, all linked to SSOT atoms.    |
| **NFRs**                | ✅ PASSED | Performance, Security, Reliability, Observability, Compliance all measurable. |
| **Governance**          | ✅ PASSED | Change process, approval requirements, protected documents all documented.    |
| **Language Standards**  | ✅ PASSED | MUST/SHALL used, no vague terms, no unfilled variables.                       |
| **Traceability**        | ✅ PASSED | Document history updated with 7 versions tracked.                             |

**Gaps Identified (Non-blocking):**

| Gap                      | Severity | Recommendation                                                     |
| ------------------------ | -------- | ------------------------------------------------------------------ |
| No IC for Error Response | LOW      | Consider adding IC-008 for standardized error response format.     |
| No explicit API Version  | LOW      | Consider adding IC-009 for API versioning strategy.                |
| No scalability NFR       | LOW      | Consider adding explicit scalability targets if needed for Growth. |

**Remediation Applied:**

- Fixed version mismatch: frontmatter 5.0 → 5.1, body 4.0 → 5.1
- Updated `updated` date to 2025-12-04
- Added version 5.1 entry to Document History

> **Task 3.09: COMPLETE** — Constitution PRD passes all checklist items. Gaps are recommendations for future enhancement, not blockers.

### 11.6 Phases 3-6: Audit Groups

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

- [x] **0.01** Atom Directory Setup — `docs/_atoms/` created with `_index.md`, `_schema.yaml`
- [x] **0.02** Atom Template Creation — `docs/_atoms/_template.md` created
- [x] **0.03** Atom CRUD Scripts — 4 TypeScript scripts in `scripts/atoms/` (not XML tasks)
- [ ] **0.04** Create `validate-atoms.ts` script (includes index auto-generation)
- [ ] **0.05** Gate Validation Rules
- [ ] **0.06** Product Soul Template
- [ ] **0.07** Pre-commit Hook Setup
- [ ] **0.08** CI Pipeline Setup
- [ ] **Gate:** All validation scripts pass

### Phase 1: Workflow Updates

- [x] **1.01** Inventory all 92 current workflows — VERIFIED: 85 active + 6 archived + 1 template = 92 total
- [x] **1.02-1.05** Update existing triads (entity-first detection) — PRD, Architecture, UX, Epics all verified/updated
- [x] **1.06** Create 2 NEW Product-Soul workflows — validate-product-soul + amend-product-soul CREATED
- [x] **1.07-1.08** Create 13 NEW workflows + update existing — COMPLETE (see 6.0, 6.3)
- [x] **Gate:** 92 existing + 15 new = 107 total workflows functional ✅

### Phase 2: Migration

- [x] **2.01** Extract PR-xxx atoms — 8 atoms created (SYS.002-SYS.009)
- [x] **2.02** Extract IC-xxx atoms — 7 atoms created (SYS.010-SYS.016)
- [x] **2.03** Extract ADR-xxx atoms — 18 atoms created (SYS.017-SYS.034)
- [x] **2.04** Update references — all docs link to atoms (198 links, 90 files)
- [x] **2.05** Validation — zero broken refs ✅
- [x] **Gate:** All atoms migrated (35 atoms) ✅

### Phase 3: Audit Group A (Primary Audit)

**Analyst Tasks (3.04-3.08):**

- [x] **3.04** Generate manifest.yaml vs actual structure diff — Report: `docs/platform/validation/manifest-structure-diff-report.md`
- [ ] **3.05** Identify orphaned files (10 `*_recovered.md` found per 3.04)
- [ ] **3.06** Identify missing files (none — planned modules correctly absent per 3.04)
- [ ] **3.07** Validate entity_type consistency across all docs
- [ ] **3.08** Run validate-dependencies.ts for ADR-020 compliance

**BMad Builder Tasks (3.01-3.03):**

- [ ] **3.01** Audit all workflow.yaml files for proper structure
- [ ] **3.02** Verify workflow phases align correctly
- [ ] **3.03** Validate agent menu items reference existing workflows

**PM Tasks (3.09-3.12):**

- [ ] **3.09** Audit Constitution PRD
- [ ] **3.10** Audit Infrastructure Module PRDs
- [ ] **3.11** Audit Constitution Epics
- [ ] **3.12** Remove duplicate files (`*_recovered.md`)

**Architect Tasks (3.13-3.15):**

- [ ] **3.13** Audit Constitution Architecture
- [ ] **3.14** Audit Infrastructure Module architectures
- [ ] **3.15** Verify ADR-020 is properly integrated

**UX Designer Tasks (3.16-3.18):**

- [ ] **3.16** Audit Constitution UX Design
- [ ] **3.17** Audit Infrastructure Module UX designs
- [ ] **3.18** Remove duplicate files (`*_recovered.md`)

**Tech Writer Tasks (3.19-3.21):**

- [x] **3.19** DELETE all README.md files in docs/ — Already clean ✅
- [x] **3.20** DELETE all index.md files EXCEPT docs/index.md — Already clean ✅
- [ ] **3.21** Update docs/index.md as single navigation hub

**Dev Tasks (3.22-3.23):**

- [ ] **3.22** Audit sprint-artifacts folder structure
- [ ] **3.23** Validate story file format compliance

**SM Tasks (3.24-3.25):**

- [ ] **3.24** Audit existing sprint-status.yaml files
- [ ] **3.25** Validate status enum values

### Phase 4: Audit Group B (Secondary Audit)

- [ ] **Phase 4** (Group B) — 16 tasks pending (4.01-4.16)

### Phase 5: Audit Group C (Cross-Cutting)

- [ ] **Phase 5** (Group C) — 8 tasks pending (requires Phase 3+4)

### Phase 6: Audit Group D (Finalization)

- [ ] **Phase 6** (Group D) — 4 tasks pending (sequential)
- [ ] **Gate:** All validation scripts pass

### Post-Flight

- [ ] Run `pnpm run validate:docs` — MUST PASS
- [ ] Run `pnpm run validate:links` — MUST PASS
- [ ] Run dependency validation — MUST PASS
- [ ] Generate final validation report
- [ ] Commit with descriptive message

---

## Appendix A: Files Flagged for Immediate Attention

### Duplicate Files (DELETE) — Updated 2025-12-04

> **Status:** Original `* 2.md` files have been cleaned. New `*_recovered.md` duplicates found.

**Recovered Files (10 total) — DELETE:**

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

### Files to DELETE (Navigation Policy) — COMPLIANT ✅

```
docs/**/README.md          # ✅ CLEAN — No README.md files found
docs/**/index.md           # ✅ CLEAN — Only docs/index.md exists
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

### Atom CRUD Operations (Phase 0.03)

```bash
# Create a new atom
pnpm exec tsx scripts/atoms/atom-create.ts --entity SYS --type requirement --title "My Atom"
pnpm exec tsx scripts/atoms/atom-create.ts --entity SHL --type interface --title "Shell API" --parent SYS.001

# Search atoms
pnpm exec tsx scripts/atoms/atom-search.ts --entity SHL
pnpm exec tsx scripts/atoms/atom-search.ts --type requirement --status approved
pnpm exec tsx scripts/atoms/atom-search.ts --title auth --json

# Amend atom metadata
pnpm exec tsx scripts/atoms/atom-amend.ts --id SYS.001 --status approved
pnpm exec tsx scripts/atoms/atom-amend.ts --id SYS.001 --title "New Title"
pnpm exec tsx scripts/atoms/atom-amend.ts --id SYS.001 --add-tag security

# Deprecate atom (with safety checks)
pnpm exec tsx scripts/atoms/atom-deprecate.ts --id SYS.001
pnpm exec tsx scripts/atoms/atom-deprecate.ts --id SYS.001 --force  # Skip safety checks
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

| File                                                           | Purpose                            |
| -------------------------------------------------------------- | ---------------------------------- |
| `docs/platform/architecture/adr-020-sibling-dependency-law.md` | Sibling Dependency Law definition  |
| `docs/document-contracts.yaml`                                 | Entity document structure rules    |
| `scripts/validation/validate-dependencies.ts`                  | Dependency validation script       |
| `.claude/skills/validate-sibling-dependency/SKILL.md`          | Claude skill for ADR-020           |
| `docs/manifest.yaml`                                           | Documentation structure SSOT       |
| `docs/product-soul.md`                                         | Constitution Product Soul          |
| `docs/_atoms/_index.md`                                        | Atom repository index + ID scheme  |
| `docs/_atoms/_schema.yaml`                                     | Atom frontmatter JSON schema       |
| `docs/_atoms/_template.md`                                     | Template for creating new atoms    |
| `scripts/atoms/atom-create.ts`                                 | Create new atoms                   |
| `scripts/atoms/atom-search.ts`                                 | Search atoms by criteria           |
| `scripts/atoms/atom-amend.ts`                                  | Modify atom frontmatter            |
| `scripts/atoms/atom-deprecate.ts`                              | Deprecate atoms with safety checks |

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

### PRD Triad Infrastructure (Phase 1.02)

| Item                           | Path                                                 | Effort | Notes                                                                                                                                 |
| ------------------------------ | ---------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| Entity-specific PRD checklists | `.bmad/bmm/checklists/`                              | Low    | Create: `infrastructure-prd-checklist.md`, `strategic-prd-checklist.md`, `coordination-prd-checklist.md`, `business-prd-checklist.md` |
| Entity menu data file          | `.bmad/bmm/data/entity-menu.yaml`                    | Low    | Verify exists; referenced by `select-entity.xml` for lightweight entity selection                                                     |
| Constitution PRD checklist     | `.bmad/bmm/checklists/constitution-prd-checklist.md` | Low    | Verify exists; referenced by `validate-system-prd`                                                                                    |

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
