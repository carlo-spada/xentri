# Brainstorming Session Results

**Session Date:** 2025-12-03
**Facilitator:** BMad Builder
**Participant:** Carlo

## Session Start

**Approach:** Progressive Technique Flow — systematic exploration of 5 key architectural aspects

**Techniques Selected:**

1. First Principles Thinking — for Workflow Architecture
2. Morphological Analysis — for Contract Inheritance Model
3. Structured Mind Mapping — for Reference Block Injection
4. Five Whys + Assumption Reversal — for Validation & Enforcement
5. Resource Constraints — for Parallel Implementation Strategy

## Executive Summary

**Topic:** Full Workflow Integration for SSOT (Single Source of Truth) enforcement across Xentri's federated documentation hierarchy

**Session Goals:**

- Design architecture that enforces SSOT at documentation creation time
- Enable multiple Claude instances to implement in parallel
- Create comprehensive specification document for implementation
- Ensure all 5 entity types follow consistent ownership rules
- **EXPANDED:** Bring ALL BMAD workflows up to speed with federated system

**Techniques Used:** First Principles, Morphological Analysis, Structured Mind Mapping, Five Whys + Assumption Reversal, Resource Constraints

**Total Ideas Generated:** 30+

### Key Themes Identified:

1. **Simplicity over complexity** — ID encodes hierarchy, no separate indexes
2. **Atoms as SSOT** — Documents reference, never define
3. **Gate enforcement** — Hard blocks, no exceptions
4. **Parallel execution** — 3-4 instances with clear dependencies

## Technique Sessions

### Session 1: Workflow Architecture (First Principles Thinking)

#### First Principles Established

| Principle                     | Implication                                                                        |
| ----------------------------- | ---------------------------------------------------------------------------------- |
| **Entity-First Discovery**    | Every workflow begins with "Which entity?" — Step 0 before any other action        |
| **Additive-Only Inheritance** | Parent path contains ALL inherited truth. Children ADD, never CHANGE or DELETE     |
| **Inheritance ≠ Dependency**  | Inheritance is identity (ID chain). Dependency is contract (interfaces)            |
| **Sibling Dependency Law**    | Nodes only declare dependencies on siblings. Cross-branch via ancestor inheritance |

#### Two-Step Guided Entity Selection

**Step 1:** "System (Constitution) or Category {list}?"
**Step 2:** "Category node, Subcategory {list}, or Module {list}?"

Maximum ~26 options at any step. Scalable to 150+ entities.

#### Atom ID Scheme

**Format:** `{ANCESTOR_CHAIN}-{TYPE}-{SEQ}`

**Examples:**

```
SYS-PR-001                    → Constitution Platform Requirement #1
SYS-STR-PR-001                → Strategy Platform Requirement #1 (inherits SYS)
SYS-STR-PUL-FR-001            → Pulse Functional Requirement #1 (inherits SYS-STR)
SYS-STR-PUL-COP-FR-001        → Copilot FR #1 (inherits SYS-STR-PUL)
```

**ID encodes inheritance chain.** Parsing `SYS-STR-PUL` tells you:

- Entity: Pulse (child of Strategy, child of System)
- Inherits from: `SYS-STR` (Strategy) → `SYS` (Constitution)

#### Atom Structure Definition v1.0

```yaml
# =============================================================================
# ATOM STRUCTURE SPECIFICATION
# =============================================================================
# Atoms are the atomic units of requirements/decisions in the SSOT system.
# Each atom has exactly ONE parent (inheritance) but may have multiple
# dependencies on sibling-provided interfaces.
# =============================================================================

---
# -----------------------------------------------------------------------------
# IDENTITY
# -----------------------------------------------------------------------------
id: SYS-STR-PUL-FR-001
  # Format: {ANCESTOR_CHAIN}-{TYPE}-{SEQ}
  # Types: PR (Platform Req), FR (Functional Req), IC (Interface Contract),
  #        ADR (Architecture Decision), NFR (Non-Functional Req)
  # The ID encodes the full inheritance chain

title: "Pulse Dashboard Renders in Strategy SPA"
  # Human-readable title, imperative voice

type: functional_requirement
  # One of: platform_requirement, functional_requirement, interface_contract,
  #         architecture_decision, non_functional_requirement

entity: strategy/pulse
  # The entity path this atom belongs to
  # Used for filesystem filtering: glob(_atoms/SYS-STR-PUL-*.md)

# -----------------------------------------------------------------------------
# INHERITANCE (Single Parent)
# -----------------------------------------------------------------------------
inherits: SYS-STR-PR-001
  # The direct parent atom this inherits from
  # MUST be an atom from the immediate parent entity
  # Can only ADD to parent's requirements, never CHANGE or DELETE

# -----------------------------------------------------------------------------
# DEPENDENCIES - SIBLING INTERFACES (The Sibling Dependency Law)
# -----------------------------------------------------------------------------
requires_interfaces:
  # Interfaces provided by SIBLINGS (same parent) that this atom needs
  # Siblings = other children of the same parent entity
  # Example: Pulse's siblings are Soul, Copilot (all children of Strategy)
  - id: IC-STR-SOUL-001
    name: "Soul Context Provider"
    provider: strategy/soul
    reason: "Pulse needs Soul data to personalize dashboard"
  - id: IC-STR-COP-001
    name: "Copilot Suggestion Stream"
    provider: strategy/copilot
    reason: "Pulse displays Copilot suggestions inline"

# -----------------------------------------------------------------------------
# DEPENDENCIES - INHERITED INTERFACES (From Ancestors)
# -----------------------------------------------------------------------------
inherited_interfaces:
  # Interfaces that ANCESTORS declared via their requires_interfaces
  # These are automatically inherited - you don't re-declare them
  # Workflow auto-populates this by walking the ancestry chain
  - id: IC-SHL-001
    name: "Shell Navigation"
    declared_by: SYS-STR-PR-001    # Strategy declared need for Shell
    reason: "Strategy depends on Shell for navigation"
  - id: IC-SHL-003
    name: "Shell Rendering Context"
    declared_by: SYS-STR-PR-001
    reason: "Strategy depends on Shell for SPA rendering"
  - id: IC-API-003
    name: "Core API Event Bus"
    declared_by: SYS-PR-002        # Constitution declared event backbone
    reason: "All entities inherit event bus access"

# -----------------------------------------------------------------------------
# GOVERNANCE
# -----------------------------------------------------------------------------
status: draft | approved | deprecated
created: 2025-12-03
updated: 2025-12-03
author: Carlo
approved_by: null                  # Required for status: approved

# -----------------------------------------------------------------------------
# TRACEABILITY
# -----------------------------------------------------------------------------
traced_by:
  # Which downstream items implement this atom
  epics: [E-STR-PUL-001]
  stories: [S-STR-PUL-001-01, S-STR-PUL-001-02]
  tests: [T-STR-PUL-001-integration]

---

## Requirement

[Full requirement text here]

## Rationale

[Why this requirement exists]

## Acceptance Criteria

- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3
```

#### Dependency Resolution Algorithm

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
    IF ancestor.inherited_interfaces CONTAINS interface_id:
      RETURN "INHERIT" (add to inherited_interfaces)
    ancestor = ancestor.parent

  # Step 4: No valid path
  RETURN "DENIED" (architectural violation - redesign required)
```

#### Workflow Validation Rules

| Rule                                 | Check                                                          | On Failure                                                                    |
| ------------------------------------ | -------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| **Sibling-Only requires_interfaces** | Each `requires_interfaces` entry must be provided by a sibling | "IC-XXX is not provided by a sibling. Declare at ancestor level or redesign." |
| **Valid Inheritance**                | `inherits` must reference an atom from direct parent entity    | "Cannot inherit from non-parent. Check entity hierarchy."                     |
| **No Contradiction**                 | Atom cannot modify/delete inherited requirements               | "Atoms are additive only. Cannot change inherited requirement."               |
| **ID Format**                        | ID must match `{ANCESTOR_CHAIN}-{TYPE}-{SEQ}` pattern          | "Invalid ID format. Expected: SYS-STR-PUL-FR-001"                             |

#### Filesystem as Index

No separate index files needed. The naming convention IS the metadata:

```bash
# All Strategy atoms
glob: docs/platform/_atoms/SYS-STR-*.md

# All Pulse atoms
glob: docs/platform/_atoms/SYS-STR-PUL-*.md

# All Functional Requirements for Pulse
glob: docs/platform/_atoms/SYS-STR-PUL-FR-*.md

# All Interface Contracts at Constitution level
glob: docs/platform/_atoms/SYS-IC-*.md
```

#### Decisions Captured

| Decision          | Choice                                 | Rationale                                                |
| ----------------- | -------------------------------------- | -------------------------------------------------------- |
| ID Scheme         | Ancestry-encoded hierarchical          | ID = provenance, no separate metadata                    |
| Multi-parent      | NOT SUPPORTED for inheritance          | Inheritance is identity; use interfaces for dependencies |
| Cross-branch deps | Via ancestor inheritance only          | Sibling Dependency Law maintains clean silos             |
| Index files       | NOT NEEDED                             | Filesystem glob + ID convention = index                  |
| Atom storage      | Centralized in `docs/platform/_atoms/` | Single source of truth                                   |

### Session 2: Contract Inheritance Model (Morphological Analysis)

#### Document Contracts Model

**Single Central Contract File:** `docs/platform/document-contracts.yaml`

- Entity type determines rules (no child contract files needed)
- Children inherit CONSTRAINTS, build their own CONTENT
- Every entity has ALL document types

#### Key Decisions

| Decision              | Choice                                    | Rationale                       |
| --------------------- | ----------------------------------------- | ------------------------------- |
| Product Soul Location | `docs/product-soul.md` (system-wide ONLY) | Single vision for entire system |
| Research Location     | `{entity}/research/`                      | Entity-scoped research          |
| Validation Location   | `{entity}/validation/`                    | Per-entity with proper naming   |
| Stories Location      | `{entity}/sprint-artifacts/stories/`      | Entity-scoped sprint work       |
| Amendments            | In-place updates                          | No separate amendments folder   |

#### Complete Document Inventory (BMAD Workflow Outputs Only)

| #                      | Document Type            | Location                                                          | Create                         | Validate                    | Amend                    |
| ---------------------- | ------------------------ | ----------------------------------------------------------------- | ------------------------------ | --------------------------- | ------------------------ |
| **Core Documents**     |
| 1                      | Product Soul             | `docs/product-soul.md`                                            | `product-soul` ✅              | `validate-product-soul` ❌  | `amend-product-soul` ❌  |
| 2                      | PRD                      | `{entity}/prd.md`                                                 | `prd` ✅                       | `validate-prd` ✅           | `amend-prd` ❌           |
| 3                      | Architecture             | `{entity}/architecture.md`                                        | `architecture` ✅              | `validate-architecture` ✅  | `amend-architecture` ❌  |
| 4                      | UX Design                | `{entity}/ux-design.md`                                           | `create-ux` ✅                 | `validate-ux` ✅            | `amend-ux` ❌            |
| 5                      | Epics                    | `{entity}/epics.md`                                               | `create-epics-and-stories` ✅  | `validate-epics` ✅         | `amend-epics` ✅         |
| **Research**           |
| 6                      | Brainstorming            | `{entity}/research/brainstorming-{date}.md`                       | `brainstorm-project` ✅        | —                           | —                        |
| 7                      | Market Research          | `{entity}/research/market-research-{date}.md`                     | `research` ✅                  | —                           | —                        |
| 8                      | Competitive              | `{entity}/research/competitive-{date}.md`                         | `research` ✅                  | —                           | —                        |
| 9                      | User Research            | `{entity}/research/user-research-{date}.md`                       | `research` ✅                  | —                           | —                        |
| 10                     | Domain Research          | `{entity}/research/domain-research-{date}.md`                     | `domain-research` ✅           | —                           | —                        |
| 11                     | Technical Research       | `{entity}/research/technical-research-{date}.md`                  | `research` ✅                  | —                           | —                        |
| 12                     | Design Thinking          | `{entity}/research/design-thinking-{date}.md`                     | `design-thinking` (CIS) ✅     | —                           | —                        |
| 13                     | Innovation Strategy      | `{entity}/research/innovation-strategy-{date}.md`                 | `innovation-strategy` (CIS) ✅ | —                           | —                        |
| 14                     | Problem Solving          | `{entity}/research/problem-solving-{date}.md`                     | `problem-solving` (CIS) ✅     | —                           | —                        |
| 15                     | Storytelling             | `{entity}/research/storytelling-{date}.md`                        | `storytelling` (CIS) ✅        | —                           | —                        |
| **Validation Reports** |
| 16                     | PRD Validation           | `{entity}/validation/prd-{entity}-{date}.md`                      | `validate-prd` ✅              | —                           | —                        |
| 17                     | Architecture Validation  | `{entity}/validation/architecture-{entity}-{date}.md`             | `validate-architecture` ✅     | —                           | —                        |
| 18                     | UX Validation            | `{entity}/validation/ux-{entity}-{date}.md`                       | `validate-ux` ✅               | —                           | —                        |
| 19                     | Epics Validation         | `{entity}/validation/epics-{entity}-{date}.md`                    | `validate-epics` ✅            | —                           | —                        |
| 20                     | Implementation Readiness | `{entity}/validation/impl-readiness-{entity}-{date}.md`           | `implementation-readiness` ✅  | —                           | —                        |
| **Sprint Artifacts**   |
| 21                     | Sprint Status            | `{entity}/sprint-artifacts/sprint-status.yaml`                    | `sprint-planning` ✅           | —                           | —                        |
| 22                     | Tech Spec                | `{entity}/sprint-artifacts/tech-specs/tech-spec-{epic}.md`        | `epic-tech-context` ✅         | `validate-tech-spec` ❌     | `amend-tech-spec` ❌     |
| 23                     | Story                    | `{entity}/sprint-artifacts/stories/{story-id}.md`                 | `create-story` ✅              | `validate-story` ❌         | `amend-story` ❌         |
| 24                     | Story Context            | `{entity}/sprint-artifacts/stories/{story-id}-context.md`         | `story-context` ✅             | `validate-story-context` ❌ | `amend-story-context` ❌ |
| 25                     | Code Review              | `{entity}/sprint-artifacts/reviews/{story-id}-review.md`          | `code-review` ✅               | `validate-code-review` ❌   | `amend-code-review` ❌   |
| 26                     | Test Plan                | `{entity}/sprint-artifacts/test-plans/test-plan-{epic}.md`        | `test-design` ❌               | `validate-test-plan` ❌     | `amend-test-plan` ❌     |
| 27                     | Retrospective            | `{entity}/sprint-artifacts/retrospectives/retro-{epic}-{date}.md` | `retrospective` ✅             | —                           | —                        |
| 28                     | Course Correction        | `{entity}/sprint-artifacts/corrections/correction-{date}.md`      | `correct-course` ✅            | —                           | —                        |
| **Other**              |
| 29                     | Brownfield Docs          | `{entity}/brownfield-docs.md`                                     | `document-project` ✅          | —                           | —                        |

#### Story Lifecycle Workflow Chain

```
create-story → validate-story → story-context → validate-story-context → dev-story → code-review → validate-code-review → story-done
```

#### Missing Workflows (16 Total)

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

#### Governance Rules

1. **All governed documents need:** Create + Validate + Amend workflows
2. **Research outputs:** No validate/amend needed (exploratory, not governed)
3. **Validation reports:** No validate/amend needed (they ARE validation)
4. **Retrospectives/Corrections:** No validate/amend needed (reflection docs)
5. **CIS workflows:** Available at entity level (not just global)

### Session 3: Reference Block Injection (Structured Mind Mapping)

#### Core Insight: Atoms ARE the Reference System

Documents don't "own" requirements — they REFERENCE atoms. The atom ID is self-indexing.

#### Refined Atom ID Format

**Format:** `{ENTITY}.{SEQ}-{CHILD}.{SEQ}-...`

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

**Key decisions:**

- Each level has its own sequence number
- Type (PR, IC, FR, ADR) NOT in ID — content makes it clear
- Entity hierarchy = ownership
- Sequence gaps allowed (no renumbering on deprecation)

#### Centralized Atom Storage

**Location:** `docs/_atoms/{id}.md`

```
docs/_atoms/
├── SYS.001.md
├── SYS.002.md
├── SYS.003.md
├── SYS.004.md
├── SYS.004-STR.001.md
├── SYS.004-STR.001-PUL.001.md
├── SYS.004-STR.001-PUL.001-DAS.001.md
└── ...
```

**Filtering by entity:**

```bash
glob: docs/_atoms/SYS.004-STR.001-PUL.*.md  # All Pulse atoms
glob: docs/_atoms/SYS.004-STR.*.md          # All Strategy atoms
```

#### Reference Pattern

Documents reference atoms via simple links:

```markdown
See [SYS.004-STR.001-PUL.001-DAS.001](../_atoms/SYS.004-STR.001-PUL.001-DAS.001.md)
```

Workflows handle:

1. Creating atom in `docs/_atoms/`
2. Creating document in entity output folder with atom reference

#### Four Atom Operations

| Operation     | Description                             | Sequence Impact              |
| ------------- | --------------------------------------- | ---------------------------- |
| **Create**    | New atom with next available sequence   | Increments sequence          |
| **Search**    | Find atoms by entity, pattern, content  | None                         |
| **Amend**     | Modify existing atom content            | None (ID unchanged)          |
| **Deprecate** | Mark atom as deprecated (preserve file) | Gap remains — no renumbering |

#### Deprecation Model (Soft Delete)

```yaml
---
id: SYS.004-STR.002
title: 'Original requirement'
status: deprecated
deprecated_date: 2025-12-03
deprecated_reason: 'Superseded by SYS.004-STR.005'
superseded_by: SYS.004-STR.005 # optional
---
## Requirement
[Original content preserved for reference]
```

**Benefits:**

- References don't break (file still exists)
- Historical context preserved
- Audit trail maintained
- Validation can warn: "References deprecated atom"

#### Workflow vs Skill Split

| Capability  | Workflow (all agents)    | Skill (Claude)        |
| ----------- | ------------------------ | --------------------- |
| Create atom | Step-by-step guided      | `create-atom` task    |
| Search atom | Glob + grep instructions | `search-atom` task    |
| Amend atom  | Edit workflow            | `amend-atom` task     |
| Deprecate   | Deprecate workflow       | `deprecate-atom` task |

Workflows are self-sufficient for all agents; skills accelerate Claude.

### Session 4: Validation & Enforcement (Five Whys + Assumption Reversal)

#### Five Whys: Root Cause Analysis

| Why | Question                            | Answer                                            |
| --- | ----------------------------------- | ------------------------------------------------- |
| #1  | Why validate atoms and references?  | To catch broken references and orphaned atoms     |
| #2  | Why would references break?         | Documents and atoms evolve independently          |
| #3  | Why don't people update references? | They don't know what references the atom          |
| #4  | Why is there no visibility?         | Traceability is manual (grep entire codebase)     |
| #5  | **Root cause**                      | **No automated bidirectional reference tracking** |

#### Assumption Reversal: Validation Built Into Operations

Instead of validation as a separate step, every operation validates:

- **Atom create** → validates parent exists
- **Atom deprecate** → shows all references, requires resolution
- **Document save** → validates all atom references resolve

#### Key Decision: Gate Model (Hard Block)

**No exceptions. No workarounds. Operations fail if validation fails.**

#### Validation Rules

| Rule                   | Check                                          | On Failure   |
| ---------------------- | ---------------------------------------------- | ------------ |
| **Parent exists**      | `inherits` field points to existing atom       | BLOCK create |
| **Entity valid**       | Entity path exists in manifest                 | BLOCK create |
| **ID format**          | Matches `{ENTITY}.{SEQ}-...` pattern           | BLOCK create |
| **References resolve** | All `[ID](path)` links point to existing atoms | BLOCK save   |
| **No deprecated refs** | No references to `status: deprecated` atoms    | BLOCK save   |

#### Enforcement Layers

| Layer               | When                   | Scope                         |
| ------------------- | ---------------------- | ----------------------------- |
| **Workflow**        | During guided creation | Inline validation before save |
| **Pre-commit hook** | On `git commit`        | Validates ALL atoms/docs      |
| **CI Pipeline**     | On PR                  | Full validation               |

#### Implementation

```typescript
// scripts/validation/validate-atoms.ts

interface ValidationResult {
  valid: boolean;
  errors: ValidationError[]; // Hard block
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

#### What We Rejected

- **Advisory mode** (warns but allows) → No, hard block only
- **Changed-files-only validation** → No, validate ALL (optimize later)
- **Traceability matrix reports** → Overkill, just pass/fail

### Session 5: Parallel Implementation Strategy (Resource Constraints)

#### Constraint: 3-4 Claude Instances

Based on Federated Documentation Audit & Remediation Plan structure.

#### Work Stream Decomposition

| Instance | Persona        | Focus                | Deliverables                                                            |
| -------- | -------------- | -------------------- | ----------------------------------------------------------------------- |
| **1**    | BMad Builder   | Foundation           | `docs/_atoms/`, atom ID scheme, atom template, 4 atom skills            |
| **2**    | Analyst        | Validation           | `validate-atoms.ts`, pre-commit hook, CI workflow                       |
| **3**    | PM + Architect | Workflows            | Entity-first detection, workflow updates, 8 HIGH-priority new workflows |
| **4**    | Tech Writer    | Migration (optional) | Extract existing PR/IC/ADR to atoms, update references                  |

#### Dependency Graph

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

#### Sync Points

1. **After Instance 1 completes:** Instances 2 & 3 can start in parallel
2. **After Instances 2 & 3 complete:** Instance 4 migration can start
3. **Final validation:** All instances verify against Instance 2's validation rules

#### Instance 1: Foundation (BMad Builder)

| Task                            | Output                                |
| ------------------------------- | ------------------------------------- |
| Create `docs/_atoms/` directory | Directory structure                   |
| Document atom ID scheme         | `docs/_atoms/README.md`               |
| Create atom template            | `docs/_atoms/_template.md`            |
| Create `create-atom` skill      | `.bmad/core/tasks/create-atom.xml`    |
| Create `search-atom` skill      | `.bmad/core/tasks/search-atom.xml`    |
| Create `amend-atom` skill       | `.bmad/core/tasks/amend-atom.xml`     |
| Create `deprecate-atom` skill   | `.bmad/core/tasks/deprecate-atom.xml` |
| Update SSOT specification       | `docs/ssot-specification-draft.md`    |

#### Instance 2: Validation (Analyst)

| Task                     | Output                                                                   |
| ------------------------ | ------------------------------------------------------------------------ |
| Create validation script | `scripts/validation/validate-atoms.ts`                                   |
| Implement gate rules     | Parent exists, entity valid, ID format, refs resolve, no deprecated refs |
| Create pre-commit hook   | `.husky/pre-commit`                                                      |
| Create CI workflow       | `.github/workflows/atom-validation.yml`                                  |
| Test with sample atoms   | Validation report                                                        |

#### Instance 3: Workflow Updates (PM + Architect)

| Task                              | Output                        |
| --------------------------------- | ----------------------------- |
| Add entity-first to all workflows | Updated `workflow.yaml` files |
| Update PRD workflow               | Atom creation integrated      |
| Update Architecture workflow      | Atom creation integrated      |
| Update Epics workflow             | Atom referencing integrated   |
| Create `amend-prd`                | New workflow                  |
| Create `amend-architecture`       | New workflow                  |
| Create `amend-ux`                 | New workflow                  |
| Create `validate-story`           | New workflow                  |
| Create `amend-story`              | New workflow                  |
| Create `validate-product-soul`    | New workflow                  |
| Create `amend-product-soul`       | New workflow                  |
| Create `test-design`              | New workflow                  |

#### Instance 4: Migration (Tech Writer) — Optional

| Task                                   | Output                        |
| -------------------------------------- | ----------------------------- |
| Extract PR-xxx from `prd.md`           | Individual atom files         |
| Extract IC-xxx from `prd.md`           | Individual atom files         |
| Extract ADR-xxx from `architecture.md` | Individual atom files         |
| Update document references             | Links point to `docs/_atoms/` |
| Run validation                         | Zero broken references        |

#### Integration with Audit Plan

This SSOT implementation becomes **Phase 0** of the Federated Documentation Audit:

```
PHASE 0: SSOT Foundation (NEW - from this brainstorm)
    │
    ▼
PHASE 1: GROUP A (Foundation Audit)
    │
    ▼
PHASE 2: GROUP B (Secondary Audit)
    │
    ▼
PHASE 3: GROUP C (Cross-Cutting Validation)
    │
    ▼
PHASE 4: GROUP D (Remediation & Finalization)
```

The audit plan's validation tasks (AN-01 through AN-11) will use the atom validation infrastructure built in SSOT Phase 0.

## Idea Categorization

### Immediate Opportunities

_Ideas ready to implement now_

1. **Create `docs/_atoms/` directory** — Zero dependencies, can start immediately
2. **Document atom ID scheme** — Just documentation, no code changes
3. **Create atom template file** — Simple markdown template
4. **Update SSOT specification** — Consolidate all session decisions

### Future Innovations

_Ideas requiring development/research_

1. **4 atom skills** — Requires template finalization first
2. **Validation script** — Requires atom ID scheme finalized
3. **Workflow updates** — Requires skills and validation in place
4. **16 missing workflows** — Build incrementally as needed

### Moonshots

_Ambitious, transformative concepts_

1. **Full atom migration** — Extract ALL existing requirements/decisions to atoms
2. **Cross-entity traceability dashboard** — Visual representation of atom relationships
3. **Auto-generated documentation** — Documents assembled from atom references

### Insights and Learnings

_Key realizations from the session_

1. **Type is redundant** — Entity hierarchy + content make type obvious
2. **Atoms ARE the reference system** — No separate "reference blocks" needed
3. **Sequence gaps are fine** — No renumbering on deprecation
4. **Soft delete > hard delete** — Preserve history with `status: deprecated`
5. **Gate model only** — No advisory warnings, hard blocks enforce discipline
6. **Workflows self-sufficient** — Skills accelerate Claude, but workflows work for all agents

## Action Planning

### Top 3 Priority Ideas

#### #1 Priority: Foundation (Instance 1)

- **Rationale:** Everything depends on atom infrastructure being in place
- **Next steps:**
  1. Create `docs/_atoms/` directory
  2. Write `docs/_atoms/README.md` with ID scheme documentation
  3. Create `docs/_atoms/_template.md` with atom structure
  4. Build 4 atom skills (create/search/amend/deprecate)
- **Resources needed:** 1 Claude instance (BMad Builder persona)

#### #2 Priority: Validation (Instance 2)

- **Rationale:** Gate enforcement prevents debt accumulation from day one
- **Next steps:**
  1. Create `scripts/validation/validate-atoms.ts`
  2. Implement 5 validation rules (parent, entity, ID, refs, deprecated)
  3. Create `.husky/pre-commit` hook
  4. Create `.github/workflows/atom-validation.yml`
- **Resources needed:** 1 Claude instance (Analyst persona)

#### #3 Priority: Workflow Updates (Instance 3)

- **Rationale:** Workflows are how content gets created — they must use atoms
- **Next steps:**
  1. Add entity-first detection to existing workflows
  2. Update PRD/Architecture/Epics workflows to create/reference atoms
  3. Create 8 HIGH-priority missing workflows
- **Resources needed:** 1 Claude instance (PM + Architect personas)

## Reflection and Follow-up

### What Worked Well

1. **Progressive technique flow** — Each session built on the previous
2. **User corrections** — Simplified overengineered proposals (type redundancy, index files)
3. **First principles approach** — Stripped away legacy assumptions
4. **Constraint-based design** — 3-4 instances forced clear decomposition

### Areas for Further Exploration

1. **Atom skill implementation details** — Exact XML structure for BMAD tasks
2. **Validation error messages** — User-friendly guidance on how to fix
3. **Migration strategy for existing content** — Phased vs big-bang

### Recommended Follow-up Techniques

1. **Prototype testing** — Create one atom manually, validate the scheme works
2. **Workflow walkthrough** — Trace a PRD creation end-to-end with atoms

### Questions That Emerged

1. Should atoms support versioning beyond deprecation?
2. How do we handle atom amendments that change meaning vs typo fixes?
3. What's the governance for approving atoms (`approved_by` field)?

### Next Session Planning

- **Suggested topics:** Merge SSOT spec with federated-docs-audit-plan.md
- **Preparation needed:** Update SSOT specification with Session 3-5 findings

---

## Summary

**5 Sessions Completed:**

| Session | Technique                       | Key Output                              |
| ------- | ------------------------------- | --------------------------------------- |
| 1       | First Principles                | Atom ID scheme, inheritance model       |
| 2       | Morphological Analysis          | 29 document types, 16 missing workflows |
| 3       | Structured Mind Mapping         | Reference pattern, 4 atom operations    |
| 4       | Five Whys + Assumption Reversal | Gate validation, enforcement layers     |
| 5       | Resource Constraints            | 4-instance parallel implementation      |

**Total Decisions:** 20+
**Total Workflows Identified:** 16 missing
**Total Atom Operations:** 4 (create, search, amend, deprecate)

---

_Session facilitated using the BMAD CIS brainstorming framework_
