# SSOT Specification Draft

> **Purpose:** Complete specification for Single Source of Truth (SSOT) enforcement across Xentri's federated documentation system.
>
> **Status:** Draft (All 5 sessions complete)
>
> **Generated:** 2025-12-03
>
> **IMPORTANT:** This document must be merged with `federated-docs-audit-plan.md` before implementation.

---

## Table of Contents

1. [Overview](#1-overview)
2. [Session 1: Workflow Architecture](#2-session-1-workflow-architecture)
3. [Session 2: Contract Inheritance Model](#3-session-2-contract-inheritance-model)
4. [Session 3: Reference Block Injection](#4-session-3-reference-block-injection)
5. [Session 4: Validation & Enforcement](#5-session-4-validation--enforcement)
6. [Session 5: Parallel Implementation Strategy](#6-session-5-parallel-implementation-strategy)
7. [Implementation Checklist](#7-implementation-checklist)

---

## 1. Overview

### Problem Statement

Documentation duplication creates maintenance burden and drift risk. Documents were designed as standalone narratives, each trying to be complete and self-contained. This leads to copy-paste of key concepts across multiple files.

### Solution

Transform documentation from "prose documents" into a "composable content system" with:

- **Atoms:** Single source of truth for requirements/decisions
- **Contracts:** Explicit ownership rules per document type
- **Workflows:** Enforcement at creation time (not just validation)
- **Inheritance:** Zero-trust, single-parent, additive-only

### Scope

- **Entity Types:** Constitution, Infrastructure Module, Strategic Container, Coordination Unit, Business Module
- **Workflows:** ALL BMAD workflows (BMM, CIS, BMB)
- **Documents:** 29 document types produced by BMAD workflows

---

## 2. Session 1: Workflow Architecture

### First Principles

| Principle                     | Implication                                                                        |
| ----------------------------- | ---------------------------------------------------------------------------------- |
| **Entity-First Discovery**    | Every workflow begins with "Which entity?" — Step 0 before any other action        |
| **Additive-Only Inheritance** | Parent path contains ALL inherited truth. Children ADD, never CHANGE or DELETE     |
| **Inheritance ≠ Dependency**  | Inheritance is identity (ID chain). Dependency is contract (interfaces)            |
| **Sibling Dependency Law**    | Nodes only declare dependencies on siblings. Cross-branch via ancestor inheritance |

### Two-Step Guided Entity Selection

**Step 1:** "System (Constitution) or Category {list}?"
**Step 2:** "Category node, Subcategory {list}, or Module {list}?"

Maximum ~26 options at any step. Scalable to 150+ entities.

### Atom ID Scheme (UPDATED in Session 3)

**Format:** `{ENTITY}.{SEQ}-{CHILD}.{SEQ}-...`

```
SYS.001                       → System atom #1
SYS.004-STR.001               → Strategy atom #1 (inherits SYS.004)
SYS.004-STR.001-PUL.001       → Pulse atom #1 (inherits SYS.004-STR.001)
SYS.004-STR.001-PUL.001-DAS.001 → Dashboard atom #1 (inherits Pulse)
```

**Key change from Session 1:** Type (PR, IC, FR, ADR) NOT in ID — content makes type clear. Each level has its own sequence number.

### Atom Structure Definition v2.0 (UPDATED in Session 3)

```yaml
---
id: SYS.004-STR.001-PUL.001-DAS.001
title: "Dashboard renders personalized metrics"
entity: strategy/pulse/dashboard

# INHERITANCE (Single Parent)
inherits: SYS.004-STR.001-PUL.001

# GOVERNANCE
status: draft | approved | deprecated
created: 2025-12-03
updated: 2025-12-03
author: Carlo

# For deprecated atoms only:
# deprecated_date: 2025-12-03
# deprecated_reason: "Superseded by SYS.004-STR.005"
# superseded_by: SYS.004-STR.005
---

## Requirement
[Full requirement text — content makes type obvious]

## Rationale
[Why this requirement exists]

## Acceptance Criteria
- [ ] Criterion 1
```

**Simplified from v1.0:** Removed `type`, `requires_interfaces`, `inherited_interfaces`, `approved_by`, `traced_by`. Content determines type. Dependencies tracked elsewhere.

### Dependency Resolution Algorithm

```
FUNCTION resolve_dependency(node, interface_id):
  # Step 1: Does node itself provide this interface?
  IF node.provides CONTAINS interface_id:
    RETURN "PROVIDE" (direct access)

  # Step 2: Does a sibling provide this interface?
  siblings = get_children(node.parent) - node
  FOR sibling IN siblings:
    IF sibling.provides CONTAINS interface_id:
      RETURN "SIBLING" (declare in requires_interfaces)

  # Step 3: Does an ancestor have access?
  ancestor = node.parent
  WHILE ancestor != null:
    IF ancestor.requires_interfaces CONTAINS interface_id:
      RETURN "INHERIT" (add to inherited_interfaces)
    ancestor = ancestor.parent

  # Step 4: No valid path
  RETURN "DENIED" (architectural violation)
```

### Filesystem as Index

No separate index files needed. The naming convention IS the metadata:

```bash
glob: docs/_atoms/SYS.004-STR.*.md           # All Strategy atoms
glob: docs/_atoms/SYS.004-STR.001-PUL.*.md   # All Pulse atoms
```

**Location:** `docs/_atoms/` (not `docs/platform/_atoms/`)

---

## 3. Session 2: Contract Inheritance Model

### Document Contracts Model

**Single Central Contract File:** `docs/platform/document-contracts.yaml`

- Entity type determines rules (no child contract files needed)
- Children inherit CONSTRAINTS, build their own CONTENT
- Every entity has ALL document types

### Key Decisions

| Decision              | Choice                                    | Rationale                       |
| --------------------- | ----------------------------------------- | ------------------------------- |
| Product Soul Location | `docs/product-soul.md` (system-wide ONLY) | Single vision for entire system |
| Research Location     | `{entity}/research/`                      | Entity-scoped research          |
| Validation Location   | `{entity}/validation/`                    | Per-entity with proper naming   |
| Stories Location      | `{entity}/sprint-artifacts/stories/`      | Entity-scoped sprint work       |
| Amendments            | In-place updates                          | No separate amendments folder   |

### Complete Document Inventory (29 Types)

#### Core Documents (5)

| Document     | Location                   | Create | Validate   | Amend      |
| ------------ | -------------------------- | ------ | ---------- | ---------- |
| Product Soul | `docs/product-soul.md`     | ✅     | ❌ MISSING | ❌ MISSING |
| PRD          | `{entity}/prd.md`          | ✅     | ✅         | ❌ MISSING |
| Architecture | `{entity}/architecture.md` | ✅     | ✅         | ❌ MISSING |
| UX Design    | `{entity}/ux-design.md`    | ✅     | ✅         | ❌ MISSING |
| Epics        | `{entity}/epics.md`        | ✅     | ✅         | ✅         |

#### Research (10) — No validate/amend needed

| Document            | Location                                          | Workflow                    |
| ------------------- | ------------------------------------------------- | --------------------------- |
| Brainstorming       | `{entity}/research/brainstorming-{date}.md`       | `brainstorm-project`        |
| Market Research     | `{entity}/research/market-research-{date}.md`     | `research`                  |
| Competitive         | `{entity}/research/competitive-{date}.md`         | `research`                  |
| User Research       | `{entity}/research/user-research-{date}.md`       | `research`                  |
| Domain Research     | `{entity}/research/domain-research-{date}.md`     | `domain-research`           |
| Technical Research  | `{entity}/research/technical-research-{date}.md`  | `research`                  |
| Design Thinking     | `{entity}/research/design-thinking-{date}.md`     | `design-thinking` (CIS)     |
| Innovation Strategy | `{entity}/research/innovation-strategy-{date}.md` | `innovation-strategy` (CIS) |
| Problem Solving     | `{entity}/research/problem-solving-{date}.md`     | `problem-solving` (CIS)     |
| Storytelling        | `{entity}/research/storytelling-{date}.md`        | `storytelling` (CIS)        |

#### Validation Reports (5) — Created by validate workflows

| Document                 | Location                                                | Workflow                   |
| ------------------------ | ------------------------------------------------------- | -------------------------- |
| PRD Validation           | `{entity}/validation/prd-{entity}-{date}.md`            | `validate-prd`             |
| Architecture Validation  | `{entity}/validation/architecture-{entity}-{date}.md`   | `validate-architecture`    |
| UX Validation            | `{entity}/validation/ux-{entity}-{date}.md`             | `validate-ux`              |
| Epics Validation         | `{entity}/validation/epics-{entity}-{date}.md`          | `validate-epics`           |
| Implementation Readiness | `{entity}/validation/impl-readiness-{entity}-{date}.md` | `implementation-readiness` |

#### Sprint Artifacts (8)

| Document          | Location                                                          | Create     | Validate   | Amend      |
| ----------------- | ----------------------------------------------------------------- | ---------- | ---------- | ---------- |
| Sprint Status     | `{entity}/sprint-artifacts/sprint-status.yaml`                    | ✅         | —          | —          |
| Tech Spec         | `{entity}/sprint-artifacts/tech-specs/tech-spec-{epic}.md`        | ✅         | ❌ MISSING | ❌ MISSING |
| Story             | `{entity}/sprint-artifacts/stories/{story-id}.md`                 | ✅         | ❌ MISSING | ❌ MISSING |
| Story Context     | `{entity}/sprint-artifacts/stories/{story-id}-context.md`         | ✅         | ❌ MISSING | ❌ MISSING |
| Code Review       | `{entity}/sprint-artifacts/reviews/{story-id}-review.md`          | ✅         | ❌ MISSING | ❌ MISSING |
| Test Plan         | `{entity}/sprint-artifacts/test-plans/test-plan-{epic}.md`        | ❌ MISSING | ❌ MISSING | ❌ MISSING |
| Retrospective     | `{entity}/sprint-artifacts/retrospectives/retro-{epic}-{date}.md` | ✅         | —          | —          |
| Course Correction | `{entity}/sprint-artifacts/corrections/correction-{date}.md`      | ✅         | —          | —          |

#### Other (1)

| Document        | Location                      | Workflow           |
| --------------- | ----------------------------- | ------------------ |
| Brownfield Docs | `{entity}/brownfield-docs.md` | `document-project` |

### Story Lifecycle Workflow Chain

```
create-story → validate-story → story-context → validate-story-context → dev-story → code-review → validate-code-review → story-done
```

### Missing Workflows (16 Total)

| Workflow                 | Type     | Priority |
| ------------------------ | -------- | -------- |
| `validate-product-soul`  | Validate | HIGH     |
| `amend-product-soul`     | Amend    | MEDIUM   |
| `amend-prd`              | Amend    | HIGH     |
| `amend-architecture`     | Amend    | HIGH     |
| `amend-ux`               | Amend    | HIGH     |
| `validate-tech-spec`     | Validate | MEDIUM   |
| `amend-tech-spec`        | Amend    | MEDIUM   |
| `validate-story`         | Validate | HIGH     |
| `amend-story`            | Amend    | HIGH     |
| `validate-story-context` | Validate | MEDIUM   |
| `amend-story-context`    | Amend    | MEDIUM   |
| `validate-code-review`   | Validate | MEDIUM   |
| `amend-code-review`      | Amend    | MEDIUM   |
| `test-design`            | Create   | MEDIUM   |
| `validate-test-plan`     | Validate | LOW      |
| `amend-test-plan`        | Amend    | LOW      |

### Governance Rules

1. **All governed documents need:** Create + Validate + Amend workflows
2. **Research outputs:** No validate/amend needed (exploratory)
3. **Validation reports:** No validate/amend needed (they ARE validation)
4. **Retrospectives/Corrections:** No validate/amend needed (reflection docs)
5. **CIS workflows:** Available at entity level (not just global)
6. **BMB workflows:** Stay global (create BMAD infrastructure)

---

## 4. Session 3: Reference Block Injection

### Core Insight

**Atoms ARE the reference system.** Documents reference atoms via simple links. No separate "reference block" templates needed.

### Refined Atom ID Format

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

### Centralized Storage

**Location:** `docs/_atoms/{id}.md`

```
docs/_atoms/
├── SYS.001.md
├── SYS.002.md
├── SYS.004.md
├── SYS.004-STR.001.md
├── SYS.004-STR.001-PUL.001.md
└── SYS.004-STR.001-PUL.001-DAS.001.md
```

### Reference Pattern

```markdown
See [SYS.004-STR.001-PUL.001-DAS.001](../_atoms/SYS.004-STR.001-PUL.001-DAS.001.md)
```

### Four Atom Operations

| Operation     | Description                            | Sequence Impact              |
| ------------- | -------------------------------------- | ---------------------------- |
| **Create**    | New atom with next available sequence  | Increments sequence          |
| **Search**    | Find atoms by entity, pattern, content | None                         |
| **Amend**     | Modify existing atom content           | None (ID unchanged)          |
| **Deprecate** | Mark as deprecated (preserve file)     | Gap remains — no renumbering |

### Deprecation Model (Soft Delete)

```yaml
---
id: SYS.004-STR.002
title: 'Original requirement'
status: deprecated
deprecated_date: 2025-12-03
deprecated_reason: 'Superseded by SYS.004-STR.005'
superseded_by: SYS.004-STR.005
---
```

### Workflow vs Skill Split

| Capability  | Workflow (all agents)    | Skill (Claude)        |
| ----------- | ------------------------ | --------------------- |
| Create atom | Step-by-step guided      | `create-atom` task    |
| Search atom | Glob + grep instructions | `search-atom` task    |
| Amend atom  | Edit workflow            | `amend-atom` task     |
| Deprecate   | Deprecate workflow       | `deprecate-atom` task |

---

## 5. Session 4: Validation & Enforcement

### Root Cause (Five Whys)

| Why                | Answer                                            |
| ------------------ | ------------------------------------------------- |
| Why validate?      | Catch broken references and orphaned atoms        |
| Why do refs break? | Documents and atoms evolve independently          |
| Why no updates?    | No visibility into what references an atom        |
| Why no visibility? | Traceability is manual                            |
| **Root cause**     | **No automated bidirectional reference tracking** |

### Key Decision: Gate Model

**Hard block. No exceptions. Operations fail if validation fails.**

### Validation Rules

| Rule               | Check                                       | On Failure   |
| ------------------ | ------------------------------------------- | ------------ |
| Parent exists      | `inherits` points to existing atom          | BLOCK create |
| Entity valid       | Entity path exists in manifest              | BLOCK create |
| ID format          | Matches `{ENTITY}.{SEQ}-...` pattern        | BLOCK create |
| References resolve | All atom links point to existing files      | BLOCK save   |
| No deprecated refs | No references to `status: deprecated` atoms | BLOCK save   |

### Enforcement Layers

| Layer               | When                   | Scope                         |
| ------------------- | ---------------------- | ----------------------------- |
| **Workflow**        | During guided creation | Inline validation before save |
| **Pre-commit hook** | On `git commit`        | Validates ALL atoms/docs      |
| **CI Pipeline**     | On PR                  | Full validation               |

### Implementation

```typescript
// scripts/validation/validate-atoms.ts
interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

function validateAtomCreate(atom: Atom): ValidationResult;
function validateAtomDeprecate(atomId: string): ValidationResult;
function validateDocumentSave(doc: Document): ValidationResult;
```

```bash
# .husky/pre-commit
npx tsx scripts/validation/validate-atoms.ts --all
if [ $? -ne 0 ]; then
  echo "❌ Atom validation failed. Commit blocked."
  exit 1
fi
```

### Rejected Options

- Advisory mode (warns but allows) → **No**
- Changed-files-only validation → **No** (validate ALL)
- Traceability matrix reports → **Overkill**

---

## 6. Session 5: Parallel Implementation Strategy

### Constraint: 3-4 Claude Instances

### Work Stream Decomposition

| Instance | Persona        | Focus      | Deliverables                                              |
| -------- | -------------- | ---------- | --------------------------------------------------------- |
| **1**    | BMad Builder   | Foundation | `docs/_atoms/`, atom ID scheme, 4 atom skills             |
| **2**    | Analyst        | Validation | `validate-atoms.ts`, pre-commit, CI workflow              |
| **3**    | PM + Architect | Workflows  | Entity-first detection, workflow updates, 8 new workflows |
| **4**    | Tech Writer    | Migration  | Extract PR/IC/ADR to atoms, update references             |

### Dependency Graph

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
└──────┬──────┘      └──────┬──────┘
       │                    │
       └────────┬───────────┘
                ▼
           INSTANCE 4
        ┌─────────────┐
        │ Migration   │
        └─────────────┘
```

### Sync Points

1. **After Instance 1:** Instances 2 & 3 start in parallel
2. **After 2 & 3:** Instance 4 migration starts
3. **Final:** All verify against Instance 2's validation

### Integration with Audit Plan

This becomes **Phase 0** of the Federated Documentation Audit:

```
PHASE 0: SSOT Foundation (this spec)
    ▼
PHASE 1-4: Audit Groups A-D (federated-docs-audit-plan.md)
```

---

## 7. Implementation Checklist

### Pre-Implementation

- [x] Complete Sessions 1-5 of brainstorming
- [ ] Merge this spec with `federated-docs-audit-plan.md`
- [ ] Review combined plan for conflicts/gaps
- [ ] Assign agents to work streams (Instance 1-4)

### Instance 1: Foundation (BMad Builder)

- [ ] Create `docs/_atoms/` directory
- [ ] Write `docs/_atoms/README.md` with ID scheme
- [ ] Create `docs/_atoms/_template.md`
- [ ] Create `create-atom` skill (`.bmad/core/tasks/create-atom.xml`)
- [ ] Create `search-atom` skill
- [ ] Create `amend-atom` skill
- [ ] Create `deprecate-atom` skill

### Instance 2: Validation (Analyst)

- [ ] Create `scripts/validation/validate-atoms.ts`
- [ ] Implement 5 gate validation rules
- [ ] Create `.husky/pre-commit` hook
- [ ] Create `.github/workflows/atom-validation.yml`
- [ ] Test validation with sample atoms

### Instance 3: Workflow Updates (PM + Architect)

- [ ] Add entity-first detection to existing workflows
- [ ] Update PRD workflow for atom creation
- [ ] Update Architecture workflow for atom creation
- [ ] Update Epics workflow for atom referencing
- [ ] Create `amend-prd` workflow
- [ ] Create `amend-architecture` workflow
- [ ] Create `amend-ux` workflow
- [ ] Create `validate-story` workflow
- [ ] Create `amend-story` workflow
- [ ] Create `validate-product-soul` workflow
- [ ] Create `amend-product-soul` workflow
- [ ] Create `test-design` workflow

### Instance 4: Migration (Tech Writer) — Optional

- [ ] Extract existing PR-xxx to atoms
- [ ] Extract existing IC-xxx to atoms
- [ ] Extract existing ADR-xxx to atoms
- [ ] Update document references
- [ ] Run validation (zero broken refs)

### Post-Implementation

- [ ] Update CLAUDE.md, GEMINI.md, AGENTS.md
- [ ] Run full audit per `federated-docs-audit-plan.md`
- [ ] Final validation pass

---

## Appendix: Key Files

| File                                               | Purpose                       |
| -------------------------------------------------- | ----------------------------- |
| `docs/_atoms/`                                     | Centralized atom storage      |
| `docs/_atoms/README.md`                            | Atom ID scheme documentation  |
| `docs/_atoms/_template.md`                         | Atom template                 |
| `docs/platform/document-contracts.yaml`            | Ownership rules               |
| `docs/brainstorming-session-results-2025-12-03.md` | Full brainstorming transcript |
| `federated-docs-audit-plan.md`                     | Audit plan (merge target)     |
| `scripts/validation/validate-atoms.ts`             | Atom validation script        |
| `.husky/pre-commit`                                | Pre-commit hook               |
| `.github/workflows/atom-validation.yml`            | CI workflow                   |

---

_Generated by BMad Builder during SSOT Architecture brainstorming session (Sessions 1-5 complete)_
