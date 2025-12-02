# Federated Workflows Audit & Upgrade Plan

> **Purpose:** Comprehensive audit and upgrade plan for all BMM workflows to support the Federated Requirements Model with Five Entity Types.
>
> **Date:** 2025-12-02
> **Status:** Phase 0 Complete - Ready for Phase 1
> **Reviewed By:** Party Mode Session (Full Agent Team)

---

## Executive Summary

The Xentri project adopts a **Federated Requirements Model** with **Five Entity Types** (not four levels). This document defines the complete workflow upgrade needed to support this model.

### The Five Entity Types

| Entity Type | Path Pattern | PRD Focus | Example |
|-------------|--------------|-----------|---------|
| **Constitution** | `docs/platform/*.md` | PR/IC, system constraints | `docs/platform/prd.md` |
| **Infrastructure Module** | `docs/platform/{module}/` | Implementation scope, exposed interfaces | `docs/platform/core-api/prd.md` |
| **Strategic Container** | `docs/{category}/` | Strategic alignment, child coordination | `docs/strategy/prd.md` |
| **Coordination Unit** | `docs/{category}/{subcategory}/` | Subcategory scope, module orchestration | `docs/strategy/pulse/prd.md` |
| **Business Module** | `docs/{category}/{subcategory}/{module}/` | Feature FRs | `docs/strategy/pulse/dashboard/prd.md` |

### Key Insight

Entity type is determined by **PURPOSE**, not depth. Platform's L1 modules are **Infrastructure Modules** (terminal nodes). Business category's L1 containers are **Strategic Containers** (have children). Same depth, different entity types.

---

## Structural Model

### Directory Structure

> **Note:** `index.md` and `manifest.yaml` remain at `docs/` root because they are **navigation and meta files**, not Constitution documents. They serve the entire documentation hierarchy, not just the platform level.

```
docs/
├── index.md                            # Navigation hub (stays at root)
├── manifest.yaml                       # Machine-readable registry (stays at root)
│
├── platform/                           # L0 META CONTAINER
│   ├── prd.md                          # Constitution (PR/IC)
│   ├── architecture.md                 # System architecture
│   ├── ux-design.md                    # System UX principles
│   ├── epics.md                        # System epics
│   ├── product-brief.md                # Foundational vision
│   ├── sprint-artifacts/               # System-level sprint tracking
│   │
│   ├── shell/                          # Infrastructure Module
│   │   ├── prd.md
│   │   ├── architecture.md
│   │   ├── epics.md
│   │   └── sprint-artifacts/
│   ├── ui/                             # Infrastructure Module
│   ├── core-api/                       # Infrastructure Module
│   ├── ts-schema/                      # Infrastructure Module
│   └── orchestration/                  # Infrastructure Module
│
├── strategy/                           # Strategic Container
│   ├── prd.md                          # Category-level requirements
│   ├── architecture.md                 # Category-level decisions
│   ├── ux-design.md                    # Category-level UX
│   ├── epics.md                        # Category-level epics
│   │
│   └── pulse/                          # Coordination Unit
│       ├── prd.md                      # Subcategory requirements
│       ├── architecture.md
│       ├── epics.md
│       │
│       └── dashboard/                  # Business Module
│           ├── prd.md                  # Feature FRs
│           ├── architecture.md
│           ├── epics.md
│           └── sprint-artifacts/
│
├── marketing/                          # Strategic Container
├── sales/                              # Strategic Container
├── finance/                            # Strategic Container
├── operations/                         # Strategic Container
├── team/                               # Strategic Container
└── legal/                              # Strategic Container
```

### Zero-Trust Hierarchy Model

**Communication Rules:**
- Children DO work and EXPOSE upward to parent
- Parent CURATES what's shared between siblings
- Children NEVER see siblings directly—only what parent makes available
- No direct sibling negotiation
- No skip-level visibility

**Amendment Flow:**
- Children don't propose amendments (they don't know siblings exist)
- Parents author amendments when they decide to expose/share/integrate
- The amendment workflow IS the escape hatch for cross-cutting changes

**Inheritance Chain:**
- Each level inherits from parent ONLY (L3→L2→L1→L0)
- No direct-to-Constitution references from deep levels
- Each level can ADD specificity but never CONTRADICT parent

### Cascading Epics/Stories

Each level has its OWN epics and stories with cascading references:

| Level | Epic Scope | Example |
|-------|------------|---------|
| L0 | Category-level outcomes | Epic 1: Strategy Category → Story 1-1: Strategy Pulse |
| L1 | Subcategory/Module outcomes | Epic 1-1: Strategy Pulse → Story 1-1-1: Dashboard |
| L2 | Module coordination | Epic 1-1-1: Dashboard → Story 1-1-1-1: Shell Integration |
| L3 | Implementation details | Actual dev tasks |

**Coordination Level = Lowest Common Ancestor:**
- Modules in same subcategory → Coordination Unit coordinates
- Subcategories in same category → Strategic Container coordinates
- Categories → Constitution coordinates

---

## Workflow Categories

### Category A: CREATE Workflows
Workflows that produce documents (PRD, Architecture, Epics, UX).

### Category B: VALIDATE Workflows
Workflows that validate documents against checklists.

### Category C: AMEND Workflows
Workflows that modify existing documents with impact analysis.

### Category D: ROUTER Workflows
UX layer that detects entity type and dispatches to appropriate implementation.

### Category E: PATH UPDATE Workflows
Implementation phase workflows needing federated path updates.

### Category F: LEVEL-AGNOSTIC Workflows
Discovery/utility workflows that don't need federation changes.

---

## Shared Tasks

All workflows COMPOSE these shared tasks (no duplication):

| Task | Location | Purpose |
|------|----------|---------|
| `task-detect-entity-type.md` | `.bmad/bmm/tasks/` | Detect entity type from path/context |
| `task-generate-frontmatter.md` | `.bmad/bmm/tasks/` | Generate level-aware metadata |
| `task-impact-analysis.md` | `.bmad/bmm/tasks/` | Scan downstream for references to changed items |
| `task-validate-inheritance.md` | `.bmad/bmm/tasks/` | Verify parent constraints are not contradicted |
| `task-save-with-checkpoint.md` | `.bmad/bmm/tasks/` | Consistent save protocol with user approval |

### Task: detect-entity-type

```yaml
# Pseudo-logic
input: current_path or output_folder_resolved

if path matches "docs/platform/*.md":
  return "constitution"
elif path matches "docs/platform/{folder}/":
  return "infrastructure_module"
elif path matches "docs/{category}/" and has_children:
  return "strategic_container"
elif path matches "docs/{category}/{subcategory}/" and has_children:
  return "coordination_unit"
elif path matches "docs/{category}/{subcategory}/{module}/":
  return "business_module"
```

---

## Detailed Workflow Specifications

### A1. PRD Creation

#### System PRD (Constitution)

| Aspect | Specification |
|--------|---------------|
| **Workflow** | `create-system-prd/workflow.yaml` |
| **Entity Type** | Constitution |
| **Template** | `constitution-prd-template.md` |
| **Sections** | Platform Requirements (PR-xxx), Integration Contracts (IC-xxx), NFRs |
| **Checklist** | `constitution-prd-checklist.md` |
| **Output** | `docs/platform/prd.md` |

#### Domain PRD (Infrastructure Module, Strategic Container, Coordination Unit, Business Module)

| Aspect | Specification |
|--------|---------------|
| **Workflow** | `create-domain-prd/workflow.yaml` |
| **Entity Types** | All except Constitution |
| **Template** | `domain-prd-template.md` (with conditional sections) |
| **Sections** | Varies by entity type (see below) |
| **Checklist** | Entity-type-specific checklist |
| **Output** | `{output_folder_resolved}/prd.md` |

**Conditional Template Sections:**

| Entity Type | FR Format | Special Sections |
|-------------|-----------|------------------|
| Infrastructure Module | FR-{MOD}-xxx | Exposed Interfaces, Consumed Interfaces |
| Strategic Container | FR-{CAT}-xxx | Strategic Alignment, Child Coordination |
| Coordination Unit | FR-{SUB}-xxx | Module Orchestration, Integration Points |
| Business Module | FR-{MOD}-xxx | Feature Requirements, User Stories |

#### Router: create-prd

| Aspect | Specification |
|--------|---------------|
| **Workflow** | `create-prd/workflow.yaml` |
| **Purpose** | UX layer - detects entity type, dispatches to implementation |
| **Logic** | Invoke `task-detect-entity-type` → route to `create-system-prd` or `create-domain-prd` |

---

### A2. Architecture Creation

#### System Architecture

| Aspect | Specification |
|--------|---------------|
| **Workflow** | `create-system-architecture/workflow.yaml` |
| **Entity Type** | Constitution |
| **Focus** | Cross-cutting decisions, event backbone, auth strategy, multi-tenancy |
| **Checklist** | `constitution-architecture-checklist.md` |
| **Output** | `docs/platform/architecture.md` |

#### Domain Architecture

| Aspect | Specification |
|--------|---------------|
| **Workflow** | `create-domain-architecture/workflow.yaml` |
| **Entity Types** | All except Constitution |
| **Focus** | Domain-scoped decisions inheriting from parent |
| **Checklist** | Entity-type-specific checklist |
| **Output** | `{output_folder_resolved}/architecture.md` |

#### Router: create-architecture

Detects entity type, dispatches appropriately.

---

### A3. Epic Creation

#### System Epics

| Aspect | Specification |
|--------|---------------|
| **Workflow** | `create-system-epics/workflow.yaml` |
| **Entity Type** | Constitution |
| **Traceability** | To PRs and ICs |
| **Format** | Category-level outcomes, coordinates child containers |
| **Output** | `docs/platform/epics.md` |

#### Domain Epics

| Aspect | Specification |
|--------|---------------|
| **Workflow** | `create-domain-epics/workflow.yaml` |
| **Entity Types** | All except Constitution |
| **Traceability** | To parent epics + own FRs |
| **Format** | Cascading epic IDs (1-1-1 pattern) |
| **Output** | `{output_folder_resolved}/epics.md` |

---

### A4. UX Design Creation

#### System UX (Principles)

| Aspect | Specification |
|--------|---------------|
| **Workflow** | `create-system-ux/workflow.yaml` |
| **Entity Type** | Constitution |
| **Focus** | Essential principles, interaction paradigms, accessibility |
| **Output** | `docs/platform/ux-design.md` |

#### Domain UX (Design)

| Aspect | Specification |
|--------|---------------|
| **Workflow** | `create-domain-ux/workflow.yaml` |
| **Entity Types** | All except Constitution |
| **Focus** | Concrete designs inheriting from parent |
| **Inheritance** | Parent-only chain (L3→L2→L1→L0) |
| **Output** | `{output_folder_resolved}/ux-design.md` |

---

### B. Validation Workflows

Each CREATE workflow has a corresponding VALIDATE workflow:

| Document Type | System Validation | Domain Validation |
|---------------|-------------------|-------------------|
| PRD | `validate-system-prd/` | `validate-domain-prd/` |
| Architecture | `validate-system-architecture/` | `validate-domain-architecture/` |
| Epics | `validate-system-epics/` | `validate-domain-epics/` |
| UX | `validate-system-ux/` | `validate-domain-ux/` |

**Validation Enhancements:**

1. **Cascade Awareness:** Validation reports include coverage map showing downstream references
2. **Inheritance Check:** Invokes `task-validate-inheritance` to ensure no parent contradictions
3. **Traceability Section:** Generates traceability matrix as part of validation report

**Validation Report Naming:**
```
{document_type}-validation-{scope}-{date}.md
Example: prd-validation-shell-2025-12-02.md
```

---

### C. Amendment Workflows

**Critical addition identified during party review.**

| Document Type | System Amendment | Domain Amendment |
|---------------|------------------|------------------|
| PRD | `amend-system-prd/` | `amend-domain-prd/` |
| Architecture | `amend-system-architecture/` | `amend-domain-architecture/` |
| Epics | `amend-system-epics/` | `amend-domain-epics/` |
| UX | `amend-system-ux/` | `amend-domain-ux/` |

**Amendment Workflow Steps:**

1. Load current document
2. Identify what's changing (add/modify/remove)
3. **Impact Analysis:** Invoke `task-impact-analysis` to scan downstream for references
4. Present impact report to user
5. Draft amendment with rationale
6. Validate against appropriate checklist
7. Flag for governance review (Constitution changes are protected)

**Amendment Output:**
- Updated document with change tracked
- Amendment log entry in document or separate changelog

---

### D. Router Workflows

| Router | Detects | Dispatches To |
|--------|---------|---------------|
| `create-prd` | Entity type | `create-system-prd` or `create-domain-prd` |
| `create-architecture` | Entity type | `create-system-architecture` or `create-domain-architecture` |
| `create-epics` | Entity type | `create-system-epics` or `create-domain-epics` |
| `create-ux` | Entity type | `create-system-ux` or `create-domain-ux` |
| `validate-prd` | Entity type | `validate-system-prd` or `validate-domain-prd` |
| `validate-architecture` | Entity type | `validate-system-architecture` or `validate-domain-architecture` |
| `validate-epics` | Entity type | `validate-system-epics` or `validate-domain-epics` |
| `validate-ux` | Entity type | `validate-system-ux` or `validate-domain-ux` |
| `amend-prd` | Entity type | `amend-system-prd` or `amend-domain-prd` |
| `amend-architecture` | Entity type | `amend-system-architecture` or `amend-domain-architecture` |
| `amend-epics` | Entity type | `amend-system-epics` or `amend-domain-epics` |
| `amend-ux` | Entity type | `amend-system-ux` or `amend-domain-ux` |

**Router Logic:**
```yaml
steps:
  - invoke: task-detect-entity-type
  - if entity_type == "constitution":
      invoke: {system-workflow}
    else:
      invoke: {domain-workflow}
```

---

### E. Path Update Workflows

Implementation phase workflows needing federated path updates:

| Workflow | Current Path Logic | Required Update |
|----------|-------------------|-----------------|
| `create-story` | `{output_folder}/sprint-artifacts/` | `{output_folder_resolved}/sprint-artifacts/` |
| `dev-story` | Hardcoded paths | Use `{output_folder_resolved}` |
| `story-context` | Searches `{output_folder}` | Search `{output_folder_resolved}` + parent levels |
| `sprint-planning` | Global status file | Hierarchical status files |
| `code-review` | Fixed paths | Entity-aware paths |
| `epic-tech-context` | Fixed paths | Entity-aware paths |

**Sprint Status Location Rules:**
- Module sprints: `{entity_path}/sprint-artifacts/sprint-status.yaml`
- Coordination sprints: At coordinating level (lowest common ancestor)
- System sprints: `docs/platform/sprint-artifacts/sprint-status.yaml`

---

### F. Level-Agnostic Workflows (No Changes Needed)

| Workflow | Reason |
|----------|--------|
| `product-brief` | Discovery workflow, outputs wherever specified |
| `research` | Discovery workflow |
| `domain-research` | Discovery workflow |
| `brainstorm-project` | Discovery workflow |
| `create-diagram` | Utility, location-independent |
| `create-wireframe` | Utility |
| `create-flowchart` | Utility |
| `create-dataflow` | Utility |
| `workflow-status` | Orchestration |
| `workflow-init` | Orchestration |
| `document-project` | Brownfield discovery |
| `testarch/*` | Testing workflows |

---

## Checklists

### Checklist Matrix

| Document Type | Constitution | Infrastructure Module | Strategic Container | Coordination Unit | Business Module |
|---------------|--------------|----------------------|---------------------|-------------------|-----------------|
| PRD | `constitution-prd-checklist.md` | `infrastructure-prd-checklist.md` | `strategic-prd-checklist.md` | `coordination-prd-checklist.md` | `business-prd-checklist.md` |
| Architecture | `constitution-arch-checklist.md` | `infrastructure-arch-checklist.md` | `strategic-arch-checklist.md` | `coordination-arch-checklist.md` | `business-arch-checklist.md` |
| Epics | `constitution-epics-checklist.md` | `infrastructure-epics-checklist.md` | `strategic-epics-checklist.md` | `coordination-epics-checklist.md` | `business-epics-checklist.md` |
| UX | `constitution-ux-checklist.md` | `infrastructure-ux-checklist.md` | `strategic-ux-checklist.md` | `coordination-ux-checklist.md` | `business-ux-checklist.md` |

**Total: 20 checklists**

### Checklist Structure

Each checklist shares a base structure with entity-type-specific sections:

```markdown
# {Entity Type} {Document Type} Validation Checklist

## 1. Document Structure (Shared)
- [ ] Frontmatter present with required fields
- [ ] All sections properly formatted
- [ ] No unfilled template variables

## 2. Entity-Type-Specific Requirements
{Varies by entity type}

## 3. Inheritance Validation (Domain only)
- [ ] Parent document referenced
- [ ] No contradictions with parent constraints
- [ ] Properly scoped to this level

## 4. Quality Standards (Shared)
- [ ] Language is clear and specific
- [ ] Measurable criteria used
- [ ] Professional tone
```

---

## Agent Menu Updates

### PM Agent (`pm.md`)

```xml
<menu>
  <item cmd="*help">Show numbered menu</item>
  <item cmd="*create-prd" workflow="...create-prd/workflow.yaml">Create PRD (auto-detects level)</item>
  <item cmd="*validate-prd" workflow="...validate-prd/workflow.yaml">Validate PRD</item>
  <item cmd="*amend-prd" workflow="...amend-prd/workflow.yaml">Amend PRD with impact analysis</item>
  <item cmd="*create-epics" workflow="...create-epics/workflow.yaml">Create Epics</item>
  <item cmd="*validate-epics" workflow="...validate-epics/workflow.yaml">Validate Epics</item>
  <item cmd="*amend-epics" workflow="...amend-epics/workflow.yaml">Amend Epics</item>
  <!-- Other existing items -->
</menu>
```

### Architect Agent (`architect.md`)

```xml
<menu>
  <item cmd="*create-architecture" workflow="...create-architecture/workflow.yaml">Create Architecture (auto-detects level)</item>
  <item cmd="*validate-architecture" workflow="...validate-architecture/workflow.yaml">Validate Architecture</item>
  <item cmd="*amend-architecture" workflow="...amend-architecture/workflow.yaml">Amend Architecture</item>
  <!-- Other existing items -->
</menu>
```

### UX Designer Agent (`ux-designer.md`)

```xml
<menu>
  <item cmd="*create-ux" workflow="...create-ux/workflow.yaml">Create UX Design (auto-detects level)</item>
  <item cmd="*validate-ux" workflow="...validate-ux/workflow.yaml">Validate UX Design</item>
  <item cmd="*amend-ux" workflow="...amend-ux/workflow.yaml">Amend UX Design</item>
  <!-- Other existing items -->
</menu>
```

---

## Implementation Plan

### Phase 0: Migration (Pre-requisite) ✅ COMPLETE

| # | Task | Status |
|---|------|--------|
| 0.1 | Move Constitution docs (`docs/*.md` → `docs/platform/*.md`) | ✅ Done |
| 0.2 | Flatten platform modules (remove frontend/backend/shared subcategories) | ✅ Done |
| 0.3 | Update manifest.yaml to v4.0 with Five Entity Types | ✅ Done |
| 0.4 | Update CLAUDE.md navigation paths | ✅ Done |
| 0.5 | Update GEMINI.md and AGENTS.md | ✅ Done |
| 0.6 | Update docs/index.md | ✅ Done |
| 0.7 | Fix cross-references in module READMEs | ✅ Done |
| 0.8 | Update federated-validation module | ✅ Done |
| 0.9 | Remove orphaned infrastructure/ folder | ✅ Done |

**Completed:** 2025-12-02

### Phase 1: Foundation

| # | Task | Description |
|---|------|-------------|
| 1.1 | Create shared tasks | 5 tasks in `.bmad/bmm/tasks/` |
| 1.2 | Create system PRD workflow | `create-system-prd/` |
| 1.3 | Create domain PRD workflow | `create-domain-prd/` |
| 1.4 | Create PRD router | `create-prd/` |
| 1.5 | Create PRD validation workflows | `validate-system-prd/`, `validate-domain-prd/` |
| 1.6 | Create PRD amendment workflows | `amend-system-prd/`, `amend-domain-prd/` |
| 1.7 | Create PRD checklists | 5 entity-type checklists |
| 1.8 | Update PM agent menu | Add new commands |

### Phase 2: Architecture

| # | Task | Description |
|---|------|-------------|
| 2.1 | Create system architecture workflow | `create-system-architecture/` |
| 2.2 | Create domain architecture workflow | `create-domain-architecture/` |
| 2.3 | Create architecture router | `create-architecture/` |
| 2.4 | Create architecture validation workflows | Both system and domain |
| 2.5 | Create architecture amendment workflows | Both system and domain |
| 2.6 | Create architecture checklists | 5 entity-type checklists |
| 2.7 | Update Architect agent menu | Add new commands |

### Phase 3: Epics

| # | Task | Description |
|---|------|-------------|
| 3.1 | Create system epics workflow | `create-system-epics/` |
| 3.2 | Create domain epics workflow | `create-domain-epics/` |
| 3.3 | Create epics router | `create-epics/` |
| 3.4 | Create epics validation workflows | Both system and domain |
| 3.5 | Create epics amendment workflows | Both system and domain |
| 3.6 | Create epics checklists | 5 entity-type checklists |

### Phase 4: UX

| # | Task | Description |
|---|------|-------------|
| 4.1 | Create system UX workflow | `create-system-ux/` |
| 4.2 | Create domain UX workflow | `create-domain-ux/` |
| 4.3 | Create UX router | `create-ux/` |
| 4.4 | Create UX validation workflows | Both system and domain |
| 4.5 | Create UX amendment workflows | Both system and domain |
| 4.6 | Create UX checklists | 5 entity-type checklists |
| 4.7 | Update UX Designer agent menu | Add new commands |

### Phase 5: Implementation Workflows

| # | Task | Description |
|---|------|-------------|
| 5.1 | Update create-story paths | Use `{output_folder_resolved}` |
| 5.2 | Update sprint-planning | Hierarchical status files |
| 5.3 | Audit other Phase 4 workflows | dev-story, story-context, etc. |

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Zero hierarchy conflicts | 0 violations | Validation reports show no parent contradictions |
| Parent-curated visibility works | All cross-module coordination via parent | Audit amendment logs |
| Time to create new module | < 30 minutes | Time from `add-module.sh` to first PRD draft |
| Workflow composition | 0 duplicated logic | All workflows compose shared tasks |

---

## Deliverables Summary

| Category | Count | Items |
|----------|-------|-------|
| Shared Tasks | 5 | detect-entity-type, generate-frontmatter, impact-analysis, validate-inheritance, save-with-checkpoint |
| CREATE Workflows | 8 | 2 per doc type (system + domain) |
| VALIDATE Workflows | 8 | 2 per doc type (system + domain) |
| AMEND Workflows | 8 | 2 per doc type (system + domain) |
| ROUTER Workflows | 12 | 3 per doc type (create + validate + amend) |
| Checklists | 20 | 5 entity types × 4 doc types |
| **Total** | **61** | |

---

## Migration Checklist

### Immediate (Before Phase 1) ✅ COMPLETE

- [x] Move `docs/prd.md` → `docs/platform/prd.md`
- [x] Move `docs/architecture.md` → `docs/platform/architecture.md`
- [x] Move `docs/ux-design.md` → `docs/platform/ux-design.md`
- [x] Move `docs/epics.md` → `docs/platform/epics.md`
- [x] Move `docs/product-brief.md` → `docs/platform/product-brief.md`
- [x] Move `docs/pulse.md` → `docs/platform/orchestration/pulse.md`
- [x] Move `docs/module_matrix.md` → `docs/platform/orchestration/module_matrix.md`
- [x] Flatten platform modules (shell, ui, core-api, ts-schema directly under platform/)
- [x] Remove empty subcategory folders (frontend/, backend/, shared/)
- [x] Remove orphaned infrastructure/ folder
- [x] Update `docs/index.md` with new paths
- [x] Update `docs/manifest.yaml` to v4.0 with Five Entity Types
- [x] Update `CLAUDE.md` navigation section
- [x] Update `GEMINI.md` for Five Entity Types model
- [x] Update `AGENTS.md` for Five Entity Types model
- [x] Update module READMEs (core-api, ts-schema, shell, ui)
- [x] Update sprint artifact references
- [x] Update federated-validation module workflows and checklists

### Future (Brownfield Migration)

- [ ] Document `migrate-to-federation` workflow for future use
- [ ] Create script to scan and add frontmatter

---

## Appendix: Entity Type Detection Logic

```yaml
# task-detect-entity-type.md pseudo-logic

given: path (e.g., "docs/platform/core-api/")

steps:
  1. Normalize path (remove trailing slash, resolve to absolute)

  2. Check for Constitution:
     - If path matches "docs/platform/*.md" → return "constitution"

  3. Check for Infrastructure Module:
     - If path matches "docs/platform/{folder}/"
       AND folder is not a file
       → return "infrastructure_module"

  4. Check for Business hierarchy:
     - Parse path segments after "docs/"
     - If segment_count == 1 AND has_subdirectories:
       → return "strategic_container"
     - If segment_count == 2 AND has_subdirectories:
       → return "coordination_unit"
     - If segment_count >= 2 AND no_subdirectories:
       → return "business_module"

  5. Edge case - platform is special:
     - "docs/platform/" itself is Constitution level (files)
     - "docs/platform/{folder}/" is Infrastructure Module

  6. Default: return "business_module" (safest assumption)
```

---

## Document History

| Date | Change | Author |
|------|--------|--------|
| 2025-12-02 | Initial audit created | BMad Builder |
| 2025-12-02 | Party review - 13 items addressed | Full Agent Team |
| 2025-12-02 | Five Entity Types model adopted | Carlo + Team |
| 2025-12-02 | Clarifications resolved, ready for implementation | Carlo |
| 2025-12-02 | **Phase 0 Migration Complete** - Constitution docs moved, platform flattened, all config files updated | Claude Code |
