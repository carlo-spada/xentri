# Federated Documentation Audit & Remediation Plan

> **Purpose:** Comprehensive audit and remediation of all documentation artifacts to ensure alignment with the redesigned Federated Workflow System, Five Entity Types model, Zero-Trust Inheritance rules, and **SSOT Atom Architecture**.

**Generated:** 2025-12-03
**Version:** 2.0
**Status:** Ready for Execution
**Updated:** Merged with SSOT Specification (Sessions 1-5) — adds Phase 0 atom infrastructure

> **Related Documents:**
>
> - `docs/ssot-specification-draft.md` — Complete SSOT technical specification
> - `docs/brainstorming-session-results-2025-12-03.md` — Architecture decisions transcript

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Scope & Objectives](#2-scope--objectives)
3. [Agent Assignment Matrix](#3-agent-assignment-matrix)
4. [Work Streams by Agent Persona](#4-work-streams-by-agent-persona)
5. [**Phase 0: SSOT Foundation**](#5-phase-0-ssot-foundation) ← NEW
6. [Parallel Execution Groups](#6-parallel-execution-groups)
7. [Dependencies & Sequencing](#7-dependencies--sequencing)
8. [Validation Criteria](#8-validation-criteria)
9. [Execution Checklist](#9-execution-checklist)

**Appendices:**

- [A: Files Flagged for Immediate Attention](#appendix-a-files-flagged-for-immediate-attention)
- [B: Agent Activation Commands](#appendix-b-agent-activation-commands)
- [C: Validation Workflow Commands](#appendix-c-validation-workflow-commands)
- [D: Critical Files for Recent Changes](#appendix-d-critical-files-for-recent-changes)
- [E: Missing Workflows (Phase 0)](#appendix-e-missing-workflows-phase-0) ← NEW
- [F: Gate Validation Rules](#appendix-f-gate-validation-rules) ← NEW

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

### Key Recent Changes to Validate Against

| Change Area                     | Description                                                                                                                                                                                              |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Five Entity Types**           | Constitution, Infrastructure Module, Strategic Container, Coordination Unit, Business Module                                                                                                             |
| **Workflow Phases**             | 1-Analysis → 2-Plan → 3-Solutioning → 4-Implementation                                                                                                                                                   |
| **Inheritance Rules**           | Zero-Trust: Children inherit from direct parent ONLY, can ADD but never CONTRADICT. Children can only depend on SIBLING interfaces. Cross-branch dependencies must be declared at common ancestor level. |
| **Requirement IDs**             | PR-xxx/IC-xxx (Constitution), FR-{CODE}-xxx (all others)                                                                                                                                                 |
| **Entity Detection**            | Determined by PURPOSE, not folder depth                                                                                                                                                                  |
| **ADR-020**                     | Sibling Dependency Law: single-parent inheritance, sibling-only dependencies                                                                                                                             |
| **Entity Document Structure**   | ALL entities have ALL 5 document types (prd.md, architecture.md, ux-design.md, epics.md, product-soul.md)                                                                                                |
| **Requirement/Interface Files** | New `*.requirement.yaml` and `*.interface.yaml` formats for structured contracts                                                                                                                         |
| **document-contracts.yaml**     | Updated with `entity_documents` section defining per-level document rules                                                                                                                                |
| **Hooks System**                | `.claude/hooks/` for automatic validation enforcement                                                                                                                                                    |
| **Architecture v3.0**           | Refactored to decisions-only; implementation details delegated to modules                                                                                                                                |
| **SSOT Atom System**            | NEW: Centralized atoms in `docs/_atoms/` with ID format `SYS.001-STR.001-...`                                                                                                                            |
| **Atom Operations**             | NEW: 4 operations (create, search, amend, deprecate) with gate validation                                                                                                                                |
| **Gate Validation**             | NEW: Hard block on invalid atoms, deprecated refs, broken links                                                                                                                                          |
| **16 Missing Workflows**        | NEW: amend-prd, amend-architecture, validate-story, etc.                                                                                                                                                 |

---

## 2. Scope & Objectives

### 2.1 In Scope

| Category                   | Items                                                                               |
| -------------------------- | ----------------------------------------------------------------------------------- |
| **Constitution**           | `docs/platform/*.md` (5 protected documents)                                        |
| **Infrastructure Modules** | 4 active (shell, ui, core-api, ts-schema), 4 planned (events, auth, billing, brief) |
| **Strategic Containers**   | 7 categories (strategy, marketing, sales, finance, operations, team, legal)         |
| **Coordination Units**     | 35 subcategories across all strategic containers                                    |
| **BMAD Workflows**         | 70+ workflow.yaml files in `.bmad/bmm/workflows/`                                   |
| **BMAD Agents**            | 9 agents in `.bmad/bmm/agents/`                                                     |

### 2.2 Objectives

1. **Identify Gaps** — Missing files, broken references, orphaned documents
2. **Flag Inconsistencies** — Entity types, frontmatter, inheritance violations
3. **Remediate Issues** — Update/create/delete files to achieve compliance
4. **Establish Baselines** — Create workflow status files for federated tracking

### 2.3 Deliverables

- [ ] Gap Analysis Report (per entity type)
- [ ] Remediation Actions Log
- [ ] Updated Documentation Files
- [ ] Workflow Status Files (per entity)
- [ ] Final Validation Report

---

## 3. Agent Assignment Matrix

| Agent                   | Persona                  | Primary Responsibility                     | Document Types                |
| ----------------------- | ------------------------ | ------------------------------------------ | ----------------------------- |
| **BMad Builder**        | Module/Workflow Expert   | BMAD system files, workflow.yaml, agent.md | `.bmad/**/*`                  |
| **Analyst (Mary)**      | Requirements Expert      | Gap analysis, research, validation reports | All (read-only analysis)      |
| **PM (John)**           | Product Strategist       | PRDs, Epics, requirement IDs               | `prd.md`, `epics.md`          |
| **Architect (Winston)** | Technical Design Leader  | Architecture docs, ADRs, diagrams          | `architecture.md`, `adr-*.md` |
| **UX Designer (Sally)** | User Experience          | UX design documents, wireframes            | `ux-design.md`, `ux/**/*`     |
| **Tech Writer (Paige)** | Documentation Specialist | READMEs, formatting, cross-references      | `README.md`, `index.md`       |
| **Dev (Amelia)**        | Implementation           | Sprint artifacts, story files              | `sprint-artifacts/**/*`       |
| **SM**                  | Scrum Master             | Status tracking, sprint planning           | `sprint-status.yaml`          |

---

## 4. Work Streams by Agent Persona

### 4.1 BMad Builder Work Stream

**Focus:** BMAD system integrity and workflow compliance

#### Tasks

| ID    | Task                                                                               | Priority | Parallel Group |
| ----- | ---------------------------------------------------------------------------------- | -------- | -------------- |
| BB-01 | Audit all workflow.yaml files for proper structure                                 | HIGH     | A              |
| BB-02 | Verify workflow phases align (1-Analysis, 2-Plan, 3-Solutioning, 4-Implementation) | HIGH     | A              |
| BB-03 | Check archived workflows in `_archive/` for removal or migration                   | MEDIUM   | B              |
| BB-04 | Validate agent menu items reference existing workflows                             | HIGH     | A              |
| BB-05 | Ensure detect-entity-type task is properly integrated                              | HIGH     | A              |
| BB-06 | Audit BMB workflows (create-workflow, create-agent, etc.)                          | MEDIUM   | B              |
| BB-07 | Verify config.yaml settings align with manifest.yaml                               | HIGH     | A              |

#### Files to Audit

```
.bmad/bmm/workflows/**/*.yaml
.bmad/bmm/agents/*.md
.bmad/bmm/config.yaml
.bmad/bmb/workflows/**/*.yaml
.bmad/core/workflows/**/*.yaml
```

#### Validation Workflow

```
/bmad:bmb:workflows:audit-workflow
```

---

### 4.2 Analyst (Mary) Work Stream

**Focus:** Gap analysis and cross-cutting validation

#### Tasks

| ID    | Task                                                                         | Priority | Parallel Group  |
| ----- | ---------------------------------------------------------------------------- | -------- | --------------- |
| AN-01 | Generate manifest.yaml vs actual structure diff report                       | HIGH     | A               |
| AN-02 | Identify orphaned files (exist but not in manifest)                          | HIGH     | A               |
| AN-03 | Identify missing files (in manifest but don't exist)                         | HIGH     | A               |
| AN-04 | Validate entity_type consistency across all docs                             | HIGH     | A               |
| AN-05 | Check requirement ID format compliance (PR-xxx, IC-xxx, FR-{CODE}-xxx)       | MEDIUM   | B               |
| AN-06 | Audit frontmatter for required fields                                        | MEDIUM   | B               |
| AN-07 | Validate inheritance chains (no skip-level, no contradictions)               | HIGH     | C               |
| AN-08 | Produce consolidated Gap Analysis Report                                     | HIGH     | D (after A,B,C) |
| AN-09 | Run validate-dependencies.ts for Sibling Dependency Law (ADR-020) compliance | HIGH     | A               |
| AN-10 | Audit document-contracts.yaml entity_documents section compliance            | HIGH     | A               |
| AN-11 | Verify each entity has ALL 5 document types per document-contracts.yaml      | HIGH     | C               |

#### Outputs

- `docs/platform/validation/gap-analysis-report.md`
- `docs/platform/validation/orphaned-files-report.md`
- `docs/platform/validation/inheritance-audit.md`
- `docs/platform/validation/sibling-dependency-audit.md`
- `docs/platform/validation/entity-documents-audit.md`

#### Files to Audit

```
docs/platform/document-contracts.yaml
scripts/validation/validate-dependencies.ts
scripts/validation/requirement.schema.json
docs/platform/examples/*.requirement.yaml
docs/platform/examples/*.interface.yaml
.claude/hooks/*.sh
.claude/settings.local.json
```

---

### 4.3 PM (John) Work Stream

**Focus:** PRD and Epic document compliance

#### Tasks

| ID    | Task                                                              | Priority | Parallel Group |
| ----- | ----------------------------------------------------------------- | -------- | -------------- |
| PM-01 | Audit Constitution PRD (`docs/platform/prd.md`)                   | HIGH     | A              |
| PM-02 | Audit Infrastructure Module PRDs (shell, ui, core-api, ts-schema) | HIGH     | A              |
| PM-03 | Validate all PRDs have proper entity_type frontmatter             | HIGH     | A              |
| PM-04 | Check requirement ID uniqueness and format                        | MEDIUM   | B              |
| PM-05 | Audit Constitution Epics (`docs/platform/epics.md`)               | HIGH     | A              |
| PM-06 | Audit Infrastructure Module Epics                                 | HIGH     | A              |
| PM-07 | Validate epic-to-PRD traceability                                 | HIGH     | C              |
| PM-08 | Remove duplicate files (`prd 2.md`, `epics 2.md`)                 | HIGH     | A              |
| PM-09 | Create placeholder PRDs for planned Infrastructure Modules        | MEDIUM   | B              |

#### Files to Audit

```
docs/platform/prd.md
docs/platform/epics.md
docs/platform/*/prd.md
docs/platform/*/epics.md
docs/platform/**/prd\ 2.md (DELETE)
docs/platform/**/epics\ 2.md (DELETE)
```

#### Validation Workflow

```
/bmad:bmm:workflows:validate-prd
/bmad:bmm:workflows:validate-epics
```

---

### 4.4 Architect (Winston) Work Stream

**Focus:** Architecture document compliance

#### Tasks

| ID    | Task                                                                 | Priority | Parallel Group |
| ----- | -------------------------------------------------------------------- | -------- | -------------- |
| AR-01 | Audit Constitution Architecture (`docs/platform/architecture.md`)    | HIGH     | A              |
| AR-02 | Audit Infrastructure Module architectures                            | HIGH     | A              |
| AR-03 | Validate ADR numbering and format (`adr-xxx-*.md`)                   | MEDIUM   | B              |
| AR-04 | Check architecture-to-PRD traceability                               | HIGH     | C              |
| AR-05 | Validate technology stack declarations                               | MEDIUM   | B              |
| AR-06 | Audit Event Model documentation                                      | MEDIUM   | B              |
| AR-07 | Verify "Decoupled Unity" principles documented                       | HIGH     | A              |
| AR-08 | Verify ADR-020 (Sibling Dependency Law) is properly integrated       | HIGH     | A              |
| AR-09 | Validate architecture.md v3.0 delegation to modules (decisions-only) | MEDIUM   | B              |

#### Files to Audit

```
docs/platform/architecture.md
docs/platform/*/architecture.md
docs/platform/architecture/adr-*.md
docs/platform/architecture/adr-020-sibling-dependency-law.md
docs/platform/document-contracts.yaml
```

#### Validation Workflow

```
/bmad:bmm:workflows:validate-architecture
```

---

### 4.5 UX Designer (Sally) Work Stream

**Focus:** UX design document compliance

#### Tasks

| ID    | Task                                                        | Priority | Parallel Group |
| ----- | ----------------------------------------------------------- | -------- | -------------- |
| UX-01 | Audit Constitution UX Design (`docs/platform/ux-design.md`) | HIGH     | A              |
| UX-02 | Audit Infrastructure Module UX designs (shell, ui)          | HIGH     | A              |
| UX-03 | Remove duplicate files (`ux-design 2.md`)                   | HIGH     | A              |
| UX-04 | Validate UX-to-PRD traceability                             | HIGH     | C              |
| UX-05 | Audit `docs/platform/ux/` HTML mockups                      | MEDIUM   | B              |
| UX-06 | Check design system consistency                             | MEDIUM   | B              |

#### Files to Audit

```
docs/platform/ux-design.md
docs/platform/*/ux-design.md
docs/platform/ux/**/*
docs/platform/**/ux-design\ 2.md (DELETE)
```

#### Validation Workflow

```
/bmad:bmm:workflows:validate-ux
```

---

### 4.6 Tech Writer (Paige) Work Stream

**Focus:** Documentation quality and formatting

#### Tasks

| ID    | Task                                        | Priority | Parallel Group |
| ----- | ------------------------------------------- | -------- | -------------- |
| TW-01 | Audit all README.md files for consistency   | HIGH     | A              |
| TW-02 | Validate index.md navigation files          | HIGH     | A              |
| TW-03 | Check cross-reference links (internal docs) | HIGH     | B              |
| TW-04 | Validate CommonMark compliance              | MEDIUM   | B              |
| TW-05 | Audit table of contents accuracy            | MEDIUM   | B              |
| TW-06 | Check heading hierarchy consistency         | MEDIUM   | B              |
| TW-07 | Verify manifest.yaml path references        | HIGH     | A              |
| TW-08 | Audit research folder documentation         | LOW      | C              |

#### Files to Audit

```
docs/**/README.md
docs/**/index.md
docs/index.md
docs/manifest.yaml
CLAUDE.md, GEMINI.md, AGENTS.md
```

#### Existing Scripts to Use

```bash
pnpm run validate:docs
pnpm run validate:links
```

---

### 4.7 Dev (Amelia) Work Stream

**Focus:** Sprint artifacts and story files

#### Tasks

| ID    | Task                                    | Priority | Parallel Group |
| ----- | --------------------------------------- | -------- | -------------- |
| DV-01 | Audit sprint-artifacts folder structure | HIGH     | A              |
| DV-02 | Validate story file format compliance   | HIGH     | A              |
| DV-03 | Check story-to-epic traceability        | HIGH     | C              |
| DV-04 | Verify task/subtask structure           | MEDIUM   | B              |
| DV-05 | Audit tech-spec documents               | MEDIUM   | B              |

#### Files to Audit

```
docs/platform/sprint-artifacts/**/*
docs/platform/*/sprint-artifacts/**/*
```

---

### 4.8 SM (Scrum Master) Work Stream

**Focus:** Workflow status tracking

#### Tasks

| ID    | Task                                                            | Priority | Parallel Group |
| ----- | --------------------------------------------------------------- | -------- | -------------- |
| SM-01 | Audit existing sprint-status.yaml files                         | HIGH     | A              |
| SM-02 | Create missing workflow status files for Constitution           | HIGH     | B              |
| SM-03 | Create missing workflow status files for Infrastructure Modules | HIGH     | B              |
| SM-04 | Validate status enum values (pending, in_progress, completed)   | MEDIUM   | A              |
| SM-05 | Check phase progression accuracy                                | MEDIUM   | C              |

#### Workflow

```
/bmad:bmm:workflows:workflow-init
/bmad:bmm:workflows:workflow-status
```

---

### 4.9 Cross-Cutting Tasks (ALL Agents)

**Focus:** Universal compliance checks that apply to all document types

#### Tasks

| ID     | Task                                                                    | Priority | Parallel Group | Assigned To                |
| ------ | ----------------------------------------------------------------------- | -------- | -------------- | -------------------------- |
| ALL-01 | Verify each entity has ALL 5 document types per document-contracts.yaml | HIGH     | C              | All agents in their domain |
| ALL-02 | Validate \*.requirement.yaml files follow schema                        | HIGH     | B              | PM + Analyst               |
| ALL-03 | Validate \*.interface.yaml files follow schema                          | HIGH     | B              | Architect + Analyst        |
| ALL-04 | Check hooks enforcement is active for validation                        | MEDIUM   | A              | BMad Builder               |

#### Rationale

Per the Entity Document Structure change, **every entity level** (Constitution, Infrastructure Module, Strategic Container, Coordination Unit, Business Module) must have ALL 5 document types:

- `prd.md`
- `architecture.md`
- `ux-design.md`
- `epics.md`
- `product-soul.md`

This is a breaking change from the previous model where only Constitution had all 5.

---

## 5. Phase 0: SSOT Foundation

> **NEW SECTION** — Must complete BEFORE Groups A-D can execute effectively.
>
> **Source:** `docs/ssot-specification-draft.md` (Sessions 1-5)

Phase 0 establishes the atom infrastructure that all subsequent audit phases will use for validation.

### 5.1 Why Phase 0?

The audit plan's validation tasks (AN-01 through AN-11) need atom infrastructure to:

- Validate references point to existing atoms
- Check for deprecated atom references
- Ensure atom ID format compliance
- Enforce gate validation rules

### 5.2 Phase 0 Work Streams (3-4 Claude Instances)

```
        INSTANCE 1 (Foundation)
        ┌───────────────────┐
        │ Atom ID scheme    │
        │ docs/_atoms/      │
        │ Atom skills       │
        └────────┬──────────┘
                 │
        ┌────────┴────────┐
        ▼                 ▼
INSTANCE 2            INSTANCE 3
┌─────────────┐      ┌─────────────┐
│ Validation  │      │ Workflows   │
│ scripts     │      │ updates     │
└──────┬──────┘      └──────┬──────┘
       │                    │
       └────────┬───────────┘
                ▼
           INSTANCE 4
        ┌─────────────┐
        │ Migration   │
        │ (optional)  │
        └─────────────┘
```

### 5.3 Instance 1: Foundation (BMad Builder)

| ID      | Task                               | Output                                | Priority |
| ------- | ---------------------------------- | ------------------------------------- | -------- |
| P0-F-01 | Create `docs/_atoms/` directory    | Directory structure                   | HIGH     |
| P0-F-02 | Write atom ID scheme documentation | `docs/_atoms/README.md`               | HIGH     |
| P0-F-03 | Create atom template               | `docs/_atoms/_template.md`            | HIGH     |
| P0-F-04 | Create `create-atom` skill         | `.bmad/core/tasks/create-atom.xml`    | HIGH     |
| P0-F-05 | Create `search-atom` skill         | `.bmad/core/tasks/search-atom.xml`    | MEDIUM   |
| P0-F-06 | Create `amend-atom` skill          | `.bmad/core/tasks/amend-atom.xml`     | MEDIUM   |
| P0-F-07 | Create `deprecate-atom` skill      | `.bmad/core/tasks/deprecate-atom.xml` | MEDIUM   |

### 5.4 Instance 2: Validation (Analyst)

| ID      | Task                              | Output                                  | Priority |
| ------- | --------------------------------- | --------------------------------------- | -------- |
| P0-V-01 | Create atom validation script     | `scripts/validation/validate-atoms.ts`  | HIGH     |
| P0-V-02 | Implement parent-exists rule      | Gate validation                         | HIGH     |
| P0-V-03 | Implement entity-valid rule       | Gate validation                         | HIGH     |
| P0-V-04 | Implement ID-format rule          | Gate validation                         | HIGH     |
| P0-V-05 | Implement refs-resolve rule       | Gate validation                         | HIGH     |
| P0-V-06 | Implement no-deprecated-refs rule | Gate validation                         | HIGH     |
| P0-V-07 | Create pre-commit hook            | `.husky/pre-commit`                     | MEDIUM   |
| P0-V-08 | Create CI workflow                | `.github/workflows/atom-validation.yml` | MEDIUM   |

### 5.5 Instance 3: Workflow Updates (PM + Architect)

| ID      | Task                           | Output                      | Priority |
| ------- | ------------------------------ | --------------------------- | -------- |
| P0-W-01 | Add entity-first detection     | Updated workflow.yaml files | HIGH     |
| P0-W-02 | Update PRD workflow            | Atom creation integrated    | HIGH     |
| P0-W-03 | Update Architecture workflow   | Atom creation integrated    | HIGH     |
| P0-W-04 | Update Epics workflow          | Atom referencing integrated | HIGH     |
| P0-W-05 | Create `amend-prd`             | New workflow                | HIGH     |
| P0-W-06 | Create `amend-architecture`    | New workflow                | HIGH     |
| P0-W-07 | Create `amend-ux`              | New workflow                | HIGH     |
| P0-W-08 | Create `validate-story`        | New workflow                | HIGH     |
| P0-W-09 | Create `amend-story`           | New workflow                | HIGH     |
| P0-W-10 | Create `validate-product-soul` | New workflow                | HIGH     |
| P0-W-11 | Create `amend-product-soul`    | New workflow                | MEDIUM   |
| P0-W-12 | Create `test-design`           | New workflow                | MEDIUM   |

### 5.6 Instance 4: Migration (Tech Writer) — Optional

| ID      | Task                                 | Output                  | Priority |
| ------- | ------------------------------------ | ----------------------- | -------- |
| P0-M-01 | Extract PR-xxx from prd.md           | Individual atom files   | MEDIUM   |
| P0-M-02 | Extract IC-xxx from prd.md           | Individual atom files   | MEDIUM   |
| P0-M-03 | Extract ADR-xxx from architecture.md | Individual atom files   | MEDIUM   |
| P0-M-04 | Update document references           | Links to `docs/_atoms/` | MEDIUM   |
| P0-M-05 | Run validation                       | Zero broken refs        | HIGH     |

### 5.7 Phase 0 Sync Points

1. **After Instance 1 completes:** Instances 2 & 3 can start in parallel
2. **After Instances 2 & 3 complete:** Instance 4 migration can start
3. **After Phase 0 complete:** Groups A-D can begin with atom validation enabled

### 5.8 Atom ID Format Reference

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

---

## 6. Parallel Execution Groups

Work can be parallelized across agents AND within agent work streams.

### Group A: Foundation Audit (No Dependencies)

**Can run in parallel:**

| Agent        | Tasks                                     |
| ------------ | ----------------------------------------- |
| BMad Builder | BB-01, BB-02, BB-04, BB-05, BB-07, ALL-04 |
| Analyst      | AN-01, AN-02, AN-03, AN-04, AN-09, AN-10  |
| PM           | PM-01, PM-02, PM-03, PM-05, PM-06, PM-08  |
| Architect    | AR-01, AR-02, AR-07, AR-08                |
| UX Designer  | UX-01, UX-02, UX-03                       |
| Tech Writer  | TW-01, TW-02, TW-07                       |
| Dev          | DV-01, DV-02                              |
| SM           | SM-01, SM-04                              |

**Estimated Parallel Lanes:** 8 agents working simultaneously

---

### Group B: Secondary Audit (Group A partial dependencies)

**Can run in parallel after Group A starts:**

| Agent        | Tasks                              | Depends On      |
| ------------ | ---------------------------------- | --------------- |
| BMad Builder | BB-03, BB-06                       | BB-01 started   |
| Analyst      | AN-05, AN-06                       | AN-01 completed |
| PM           | PM-04, PM-09, ALL-02               | PM-01 completed |
| Architect    | AR-03, AR-05, AR-06, AR-09, ALL-03 | AR-01 completed |
| UX Designer  | UX-05, UX-06                       | UX-01 completed |
| Tech Writer  | TW-03, TW-04, TW-05, TW-06         | TW-01 completed |
| Dev          | DV-04, DV-05                       | DV-01 completed |

---

### Group C: Cross-Cutting Validation (Group A must complete)

**Requires Group A outputs:**

| Agent       | Tasks                            | Depends On          |
| ----------- | -------------------------------- | ------------------- |
| Analyst     | AN-07, AN-11                     | AN-04, AN-10, PM-03 |
| PM          | PM-07, ALL-01 (for PRD/Epics)    | PM-05, PM-06        |
| Architect   | AR-04, ALL-01 (for Architecture) | AR-01, PM-01        |
| UX Designer | UX-04, ALL-01 (for UX Design)    | UX-01, PM-01        |
| Dev         | DV-03                            | DV-02, PM-06        |
| SM          | SM-05                            | SM-01, SM-02        |

---

### Group D: Remediation & Status Setup (Group C must complete)

**Final phase:**

| Agent       | Tasks              | Depends On   |
| ----------- | ------------------ | ------------ |
| Analyst     | AN-08 (Gap Report) | All AN tasks |
| SM          | SM-02, SM-03       | AN-08        |
| Tech Writer | TW-08              | AN-08        |

---

## 7. Dependencies & Sequencing

```
┌─────────────────────────────────────────────────────────────────────┐
│                          PHASE 0: SSOT FOUNDATION                   │
│  ┌────────────┐                                                     │
│  │ Instance 1 │  Foundation (atoms, skills)                         │
│  └─────┬──────┘                                                     │
│        │                                                            │
│  ┌─────┴──────┬────────────┐                                        │
│  ▼            ▼            │                                        │
│  Instance 2   Instance 3   │  (parallel after Instance 1)           │
│  Validation   Workflows    │                                        │
│  └─────┬──────┴─────┬──────┘                                        │
│        │            │                                               │
│        └─────┬──────┘                                               │
│              ▼                                                      │
│        Instance 4 (Optional Migration)                              │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          PHASE 1: GROUP A                           │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ │
│  │BMad    │ │Analyst │ │PM      │ │Architect│ │UX      │ │Tech    │ │
│  │Builder │ │        │ │        │ │        │ │Designer│ │Writer  │ │
│  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘ └────────┘ │
│  ┌────────┐ ┌────────┐                                              │
│  │Dev     │ │SM      │                                              │
│  └────────┘ └────────┘                                              │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          PHASE 2: GROUP B                           │
│  (Same agents, secondary tasks - can start as Group A progresses)   │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          PHASE 3: GROUP C                           │
│  Cross-cutting validation requiring outputs from multiple agents    │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          PHASE 4: GROUP D                           │
│  Final remediation, status file creation, consolidated reporting    │
└─────────────────────────────────────────────────────────────────────┘
```

### Critical Path

1. **Analyst AN-01** (manifest diff) → Unlocks most remediation decisions
2. **PM PM-08** (remove duplicates) → Required before any PRD edits
3. **Analyst AN-08** (gap report) → Required before SM status file creation
4. **All Group C tasks** → Required before final validation

---

## 8. Validation Criteria

### 8.1 Structural Compliance

| Criterion                                           | Validation Method                                                       |
| --------------------------------------------------- | ----------------------------------------------------------------------- |
| All manifest.yaml paths resolve to existing files   | `pnpm run validate:docs`                                                |
| No orphaned files outside manifest                  | Analyst AN-02                                                           |
| Correct entity_type in frontmatter                  | Analyst AN-04                                                           |
| Correct folder structure per entity type            | Analyst AN-01                                                           |
| Sibling Dependency Law (ADR-020) compliance         | `pnpm exec tsx scripts/validation/validate-dependencies.ts --path docs` |
| Entity has ALL 5 document types                     | Analyst AN-11 + ALL-01                                                  |
| document-contracts.yaml entity_documents compliance | Analyst AN-10                                                           |
| \*.requirement.yaml schema compliance               | ALL-02                                                                  |
| \*.interface.yaml schema compliance                 | ALL-03                                                                  |

#### Validation Scripts

```bash
# Standard validation
pnpm run validate:docs
pnpm run validate:links

# Sibling Dependency Law validation (ADR-020)
pnpm exec tsx scripts/validation/validate-dependencies.ts --path docs

# Document contracts validation (if script exists)
# Checks entity_documents structure compliance
```

### 8.2 Atom System Compliance (NEW)

| Criterion                                    | Validation Method                       |
| -------------------------------------------- | --------------------------------------- |
| `docs/_atoms/` directory exists              | Pre-flight check                        |
| Atom ID format valid (`SYS.001-STR.001-...`) | `scripts/validation/validate-atoms.ts`  |
| All atom parents exist                       | Gate validation (P0-V-02)               |
| All atom references resolve                  | Gate validation (P0-V-05)               |
| No references to deprecated atoms            | Gate validation (P0-V-06)               |
| Pre-commit hook installed                    | `.husky/pre-commit` exists              |
| CI workflow active                           | `.github/workflows/atom-validation.yml` |

### 8.3 Workflow Status Alignment

| Criterion                              | Validation Method |
| -------------------------------------- | ----------------- |
| Status files exist for active entities | SM SM-02, SM-03   |
| Status enum values valid               | SM SM-04          |
| Phase progression logical              | SM SM-05          |

### 8.4 Content Quality

| Criterion                                | Validation Method             |
| ---------------------------------------- | ----------------------------- |
| PRDs have required sections              | PM validation workflow        |
| Architecture docs have required sections | Architect validation workflow |
| UX docs have required sections           | UX validation workflow        |
| Links resolve correctly                  | `pnpm run validate:links`     |
| Frontmatter complete                     | Analyst AN-06                 |

### 8.5 Inheritance Compliance

| Criterion                             | Validation Method |
| ------------------------------------- | ----------------- |
| Children reference direct parent only | Analyst AN-07     |
| No contradictions to parent           | Analyst AN-07     |
| Additions clearly marked              | Analyst AN-07     |

---

## 9. Execution Checklist

### Pre-Flight

- [ ] Ensure all agents have access to `docs/manifest.yaml`
- [ ] Verify existing validation scripts work (`pnpm run validate:docs`, `pnpm run validate:links`)
- [ ] Verify sibling dependency validation works (`pnpm exec tsx scripts/validation/validate-dependencies.ts --path docs`)
- [ ] Verify `docs/platform/document-contracts.yaml` exists and has `entity_documents` section
- [ ] Verify `.claude/hooks/` enforcement is configured
- [ ] Create backup of current documentation state
- [ ] Establish communication channel for cross-agent coordination
- [ ] **NEW:** Review `docs/ssot-specification-draft.md` for Phase 0 requirements
- [ ] **NEW:** Review `docs/brainstorming-session-results-2025-12-03.md` for architectural decisions

### Phase 0: SSOT Foundation (NEW — Must Complete First)

- [ ] **Instance 1 (BMad Builder):** Complete P0-F-01 through P0-F-07
  - [ ] Create `docs/_atoms/` directory
  - [ ] Write `docs/_atoms/README.md`
  - [ ] Create `docs/_atoms/_template.md`
  - [ ] Create 4 atom skills (create, search, amend, deprecate)
- [ ] **Gate:** Instance 1 complete before starting Instances 2 & 3
- [ ] **Instance 2 (Analyst):** Complete P0-V-01 through P0-V-08
  - [ ] Create `scripts/validation/validate-atoms.ts`
  - [ ] Implement 5 gate validation rules
  - [ ] Create `.husky/pre-commit` hook
  - [ ] Create `.github/workflows/atom-validation.yml`
- [ ] **Instance 3 (PM + Architect):** Complete P0-W-01 through P0-W-12
  - [ ] Add entity-first detection to workflows
  - [ ] Update PRD/Architecture/Epics workflows
  - [ ] Create 8 HIGH-priority missing workflows
- [ ] **Gate:** Instances 2 & 3 complete before Instance 4
- [ ] **Instance 4 (Tech Writer):** Complete P0-M-01 through P0-M-05 (optional)
  - [ ] Extract existing PR/IC/ADR to atoms
  - [ ] Update document references
- [ ] **Gate:** Phase 0 complete before Groups A-D

### Phase 1: Group A (Parallel Foundation)

- [ ] **BMad Builder**: Start BB-01, BB-02, BB-04, BB-05, BB-07, ALL-04
- [ ] **Analyst**: Start AN-01, AN-02, AN-03, AN-04, AN-09, AN-10
- [ ] **PM**: Start PM-01, PM-02, PM-03, PM-05, PM-06, PM-08
- [ ] **Architect**: Start AR-01, AR-02, AR-07, AR-08
- [ ] **UX Designer**: Start UX-01, UX-02, UX-03
- [ ] **Tech Writer**: Start TW-01, TW-02, TW-07
- [ ] **Dev**: Start DV-01, DV-02
- [ ] **SM**: Start SM-01, SM-04

### Phase 2: Group B (Secondary - Staggered Start)

- [ ] **All agents**: Progress to Group B tasks as Group A items complete

### Phase 3: Group C (Cross-Cutting Validation)

- [ ] **Gate**: Confirm all Group A tasks completed
- [ ] **Analyst**: Execute AN-07 (inheritance audit), AN-11 (5 doc types compliance)
- [ ] **PM**: Execute PM-07 (epic traceability), ALL-01 (5 doc types for PRD/Epics)
- [ ] **Architect**: Execute AR-04 (architecture traceability), ALL-01 (5 doc types for Architecture)
- [ ] **UX Designer**: Execute UX-04 (UX traceability), ALL-01 (5 doc types for UX)
- [ ] **Dev**: Execute DV-03 (story traceability)
- [ ] **SM**: Execute SM-05 (phase progression)

### Phase 4: Group D (Remediation & Finalization)

- [ ] **Gate**: Confirm all Group C tasks completed
- [ ] **Analyst**: Produce AN-08 (consolidated gap report)
- [ ] **SM**: Create SM-02, SM-03 (workflow status files)
- [ ] **All agents**: Apply remediation actions based on gap report
- [ ] **Tech Writer**: Final documentation polish

### Post-Flight

- [ ] Run `pnpm run validate:docs` — MUST PASS
- [ ] Run `pnpm run validate:links` — MUST PASS
- [ ] Run `pnpm exec tsx scripts/validation/validate-dependencies.ts --path docs` — MUST PASS (Sibling Dependency Law)
- [ ] Verify ALL entities have ALL 5 document types
- [ ] Generate final validation report
- [ ] Commit all changes with descriptive message
- [ ] Update CLAUDE.md, GEMINI.md, AGENTS.md if needed

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
docs/platform/ux-design 2.md
```

### Orphaned/Misplaced Files (REVIEW)

```
docs/brainstorming-session-results-2025-12-03.md (should be in research?)
docs/platform/remediation-plan-2025-12-03.md (should be in validation-reports?)
docs/platform/pulse.md (not in manifest)
docs/platform/index.md (duplicate of README?)
```

### Missing Files (CREATE)

```
docs/strategy/README.md
docs/strategy/prd.md
docs/marketing/prd.md
docs/sales/prd.md
docs/finance/prd.md
docs/operations/prd.md
docs/team/prd.md
docs/legal/prd.md
(and subcategory PRDs)
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

## Appendix C: Validation Workflow Commands

| Validation Type | Command                                     |
| --------------- | ------------------------------------------- |
| PRD             | `/bmad:bmm:workflows:validate-prd`          |
| Architecture    | `/bmad:bmm:workflows:validate-architecture` |
| Epics           | `/bmad:bmm:workflows:validate-epics`        |
| UX Design       | `/bmad:bmm:workflows:validate-ux`           |
| Workflow Status | `/bmad:bmm:workflows:workflow-status`       |
| BMAD Workflows  | `/bmad:bmb:workflows:audit-workflow`        |

### Script-Based Validation Commands

```bash
# Standard documentation validation
pnpm run validate:docs
pnpm run validate:links

# Sibling Dependency Law (ADR-020) validation
pnpm exec tsx scripts/validation/validate-dependencies.ts --path docs

# Document contracts validation (entity_documents compliance)
# Validates that each entity has all 5 required document types
```

---

## Appendix D: Critical Files for Recent Changes

These files contain the authoritative definitions for the recent architectural changes:

| File                                                           | Purpose                              |
| -------------------------------------------------------------- | ------------------------------------ |
| `docs/platform/architecture/adr-020-sibling-dependency-law.md` | Sibling Dependency Law definition    |
| `docs/platform/document-contracts.yaml`                        | Entity document structure rules      |
| `scripts/validation/validate-dependencies.ts`                  | Dependency validation script         |
| `scripts/validation/requirement.schema.json`                   | Schema for \*.requirement.yaml files |
| `.claude/hooks/*.sh`                                           | Validation enforcement hooks         |
| `.claude/settings.local.json`                                  | Hook configuration                   |
| `docs/platform/examples/*.requirement.yaml`                    | Requirement file format examples     |
| `docs/platform/examples/*.interface.yaml`                      | Interface file format examples       |

### SSOT Atom System Files (NEW)

| File                                               | Purpose                               |
| -------------------------------------------------- | ------------------------------------- |
| `docs/_atoms/`                                     | Centralized atom storage directory    |
| `docs/_atoms/README.md`                            | Atom ID scheme documentation          |
| `docs/_atoms/_template.md`                         | Template for new atom files           |
| `docs/ssot-specification-draft.md`                 | Complete SSOT technical specification |
| `docs/brainstorming-session-results-2025-12-03.md` | Architecture decisions transcript     |
| `scripts/validation/validate-atoms.ts`             | Atom validation script (Phase 0)      |
| `scripts/validation/check-doc-duplication.ts`      | Document ownership validation         |
| `.bmad/core/tasks/create-atom.xml`                 | Atom creation skill                   |
| `.bmad/core/tasks/search-atom.xml`                 | Atom search skill                     |
| `.bmad/core/tasks/amend-atom.xml`                  | Atom amendment skill                  |
| `.bmad/core/tasks/deprecate-atom.xml`              | Atom deprecation skill                |
| `.husky/pre-commit`                                | Gate validation hook (Phase 0)        |
| `.github/workflows/atom-validation.yml`            | CI atom validation (Phase 0)          |

---

## Appendix E: Missing Workflows (Phase 0)

These 16 workflows were identified during brainstorming as missing from the current BMAD system:

### Amendment Workflows (HIGH Priority)

| Workflow             | Purpose                                     | Owner       |
| -------------------- | ------------------------------------------- | ----------- |
| `amend-prd`          | Structured PRD amendments with traceability | PM          |
| `amend-architecture` | Architecture updates with ADR integration   | Architect   |
| `amend-ux`           | UX design amendments                        | UX Designer |
| `amend-story`        | Story modifications during sprint           | Dev         |
| `amend-product-soul` | Product soul updates                        | PM          |

### Validation Workflows (HIGH Priority)

| Workflow                | Purpose                                   | Owner |
| ----------------------- | ----------------------------------------- | ----- |
| `validate-story`        | Story completeness and traceability check | Dev   |
| `validate-product-soul` | Product soul consistency validation       | PM    |

### Design Workflows (MEDIUM Priority)

| Workflow      | Purpose                             | Owner |
| ------------- | ----------------------------------- | ----- |
| `test-design` | Test strategy and coverage planning | Dev   |

### Entity Management Workflows (to be created in Phase 0)

| Workflow               | Purpose                                    | Task ID |
| ---------------------- | ------------------------------------------ | ------- |
| Entity-first detection | Detect entity type before workflow start   | P0-W-01 |
| PRD atom integration   | Integrate atom creation into PRD workflow  | P0-W-02 |
| Arch atom integration  | Integrate atom creation into Arch workflow | P0-W-03 |
| Epic atom referencing  | Integrate atom refs into Epics workflow    | P0-W-04 |

---

## Appendix F: Gate Validation Rules

Five rules enforced at pre-commit and CI (Phase 0):

| Rule | Name          | Description                                          | Severity |
| ---- | ------------- | ---------------------------------------------------- | -------- |
| 1    | Parent Exists | Atom parent ID must exist in `docs/_atoms/`          | BLOCK    |
| 2    | Entity Valid  | Entity path in atom frontmatter must resolve         | BLOCK    |
| 3    | ID Format     | Atom ID must match `{ENTITY}.{SEQ}(-{CHILD}.{SEQ})*` | BLOCK    |
| 4    | Refs Resolve  | All `[text](../atoms/{id}.md)` must resolve          | BLOCK    |
| 5    | No Deprecated | Cannot reference atoms with `status: deprecated`     | BLOCK    |

**Enforcement Layers:**

1. **Workflow inline:** Validation during atom CRUD operations
2. **Pre-commit hook:** `.husky/pre-commit` runs `validate-atoms.ts` on ALL files
3. **CI pipeline:** `.github/workflows/atom-validation.yml` runs on all PRs

---

**End of Document**
