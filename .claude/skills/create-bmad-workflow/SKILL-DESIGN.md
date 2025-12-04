# Claude Code Skill Design: `create-bmad-workflow`

> **Status:** DESIGN DOCUMENT — Pending Review
> **Version:** 0.1.0
> **Date:** 2025-12-04

---

## 1. Executive Summary

This skill standardizes BMAD workflow creation by automatically applying the **Federated Documentation System** patterns. When Claude detects workflow creation intent, this skill activates to ensure:

- Entity-first detection is properly integrated
- Inheritance validation follows the correct hierarchy
- Checklists are composed from the right primitives
- Output paths resolve correctly per entity type
- All BMAD conventions are enforced

---

## 2. Skill Metadata

```yaml
---
name: create-bmad-workflow
description: >
  Standardize BMAD workflow creation following the Federated Documentation System.
  Use when creating new workflows, standardizing existing workflows, or adding
  entity-first detection. Enforces Five Entity Types model, inheritance validation,
  composable checklists, and BMAD v6 conventions. Triggers on: "create workflow",
  "new workflow", "standardize workflow", "add entity detection", "BMM workflow".
allowed-tools:
  - Read
  - Write
  - Edit
  - Glob
  - Grep
---
```

---

## 3. Trigger Keywords

Claude should activate this skill when detecting:

| Category            | Keywords/Phrases                                                            |
| ------------------- | --------------------------------------------------------------------------- |
| **Creation**        | "create workflow", "new workflow", "build workflow", "make workflow"        |
| **Standardization** | "standardize workflow", "update workflow", "fix workflow", "align workflow" |
| **Entity-First**    | "add entity detection", "entity-first", "select-entity", "detect-entity"    |
| **BMAD-Specific**   | "BMM workflow", "BMAD workflow", "federated workflow"                       |
| **Patterns**        | "workflow pattern", "workflow template", "workflow structure"               |

---

## 4. Core Concepts

### 4.1 Five Entity Types (by PURPOSE, not depth)

| Entity Type               | Path Pattern                 | Defines                            | Inherits From       |
| ------------------------- | ---------------------------- | ---------------------------------- | ------------------- |
| **Constitution**          | `docs/platform/*.md`         | Categories + their requirements    | None (root)         |
| **Infrastructure Module** | `docs/platform/{module}/`    | Implementation (terminal)          | Constitution        |
| **Strategic Container**   | `docs/{category}/`           | Subcategories + their requirements | Constitution        |
| **Coordination Unit**     | `docs/{category}/{subcat}/`  | Modules + their requirements       | Strategic Container |
| **Business Module**       | `docs/{cat}/{subcat}/{mod}/` | Implementation (terminal)          | Coordination Unit   |

**Key Insight:** Platform modules are **meta-categories** that directly implement — they don't have subcategories or modules.

### 4.2 Inheritance Chain

```
Constitution (PR-xxx, IC-xxx)
├── Infrastructure Modules (FR-{CODE}-xxx) — Terminal, implements directly
└── Strategic Containers (defines subcategories)
    └── Coordination Units (defines modules)
        └── Business Modules (FR-{CAT}-{SUB}-{MOD}-xxx) — Terminal, implements directly
```

**Inheritance Rule:** Each entity inherits from `{parent_path}` only. Can ADD requirements, never CONTRADICT.

### 4.3 Requirement ID Formats

| Entity Type           | Format                     | Example            |
| --------------------- | -------------------------- | ------------------ |
| Constitution          | `PR-xxx`, `IC-xxx`         | PR-001, IC-004     |
| Infrastructure Module | `FR-{CODE}-xxx`            | FR-SHL-001         |
| Strategic Container   | `FR-{CAT}-xxx`             | FR-STR-001         |
| Coordination Unit     | `FR-{CAT}-{SUB}-xxx`       | FR-STR-PUL-001     |
| Business Module       | `FR-{CAT}-{SUB}-{MOD}-xxx` | FR-STR-PUL-GOD-001 |

---

## 5. Workflow Patterns to Enforce

### 5.1 Entity-First Detection Pattern

Every workflow that operates on documentation entities MUST include:

```yaml
# In workflow.yaml
shared_tasks:
  select_entity: '{project-root}/.bmad/bmm/tasks/select-entity.xml'
  detect_entity_type: '{project-root}/.bmad/bmm/tasks/detect-entity-type.xml'

# Variables returned by entity detection
entity_type: '{entity_type}' # constitution, infrastructure_module, strategic_container, coordination_unit, business_module
entity_type_display: '{entity_type_display}' # Human-readable name
entity_path: '{entity_path}' # Resolved path to entity
output_folder_resolved: '{output_folder_resolved}' # Output location
fr_prefix: '{fr_prefix}' # Requirement ID prefix
parent_path: '{parent_path}' # Path to parent entity (for inheritance)
constitution_path: '{constitution_path}' # Always docs/platform/prd.md
entity_code: '{entity_code}' # 3-letter code (SHL, API, STR, etc.)
```

### 5.2 Instructions Pattern for Entity Selection

```xml
<step n="0" goal="Select target entity">
<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 ENTITY SELECTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>

<invoke-task name="select-entity">
  <param name="prompt_user">true</param>
</invoke-task>

<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Entity Selected
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Type:           {entity_type_display}
Path:           {entity_path}
FR Prefix:      {fr_prefix}
Parent:         {parent_path}
Constitution:   {constitution_path}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>
</step>
```

### 5.3 Inheritance Validation Pattern

```xml
<step n="X" goal="Validate inheritance" if="entity_type != constitution">
<action>Load parent document from {parent_path}</action>
<action>Extract parent requirements (FR-xxx or PR/IC if Constitution)</action>
<action>Verify this entity's requirements:
  - Do NOT duplicate parent requirements
  - Do NOT contradict parent requirements
  - CAN add new requirements specific to this entity's scope
</action>
<invoke-task name="validate-inheritance" if="validate_inheritance_task exists">
  <param name="parent_path">{parent_path}</param>
  <param name="entity_path">{entity_path}</param>
</invoke-task>
</step>
```

### 5.4 Conditional Content by Entity Type

```xml
<!-- Constitution-specific sections -->
<check if="entity_type == constitution">
  <action>Include PR-xxx (Platform Requirements) section</action>
  <action>Include IC-xxx (Integration Contracts) section</action>
  <action>Include Governance section</action>
  <action>Include System-Wide NFRs section</action>
</check>

<!-- Container entities (define children) -->
<check if="entity_type == strategic_container">
  <action>Include Subcategory Definitions section</action>
  <action>Include Coordination Requirements section</action>
  <action>Include Strategic Alignment section</action>
</check>

<check if="entity_type == coordination_unit">
  <action>Include Module Definitions section</action>
  <action>Include Orchestration Requirements section</action>
</check>

<!-- Terminal entities (implement directly) -->
<check if="entity_type == infrastructure_module OR entity_type == business_module">
  <action>Include FR-xxx (Functional Requirements) section</action>
  <action>Include Implementation Details section</action>
  <action>Include Interface Definitions section</action>
</check>
```

### 5.5 Checklist Composition Pattern

Checklists are composed from primitives based on:

- **Entity Type** → entity-specific sections
- **Document Type** → doc-specific sections
- **Inheritance** → inheritance checks (if not Constitution)

```
checklist = [
  primitives/frontmatter-base.md,
  primitives/inheritance-checks.md,  # Only if has_inheritance
  doc-specific/{doc_type}-sections.md,
  entity-specific/{entity_type}-sections.md,
  primitives/quality-standards.md,
  primitives/document-structure.md
]
```

**Generated checklists live at:** `.bmad/bmm/checklists/{entity}-{doc}-checklist.md`

---

## 6. Skill File Structure

```
.claude/skills/create-bmad-workflow/
├── SKILL.md                      # Main skill definition
├── data/
│   ├── entity-types.yaml         # Five entity types reference
│   ├── workflow-patterns.yaml    # Standard patterns for each workflow category
│   ├── checklist-composition.yaml # How to compose checklists
│   └── requirement-formats.yaml  # ID formats per entity type
├── templates/
│   ├── workflow.yaml.template    # Standard workflow.yaml structure
│   ├── instructions.md.template  # Standard instructions structure
│   └── entity-step.xml.template  # Entity selection step template
└── references/
    ├── entity-menu-format.md     # entity-menu.yaml structure
    ├── inheritance-rules.md      # Inheritance validation rules
    └── router-pattern.md         # Router workflow pattern (validate-prd style)
```

---

## 7. SKILL.md Content Outline

### Section 1: Purpose

- What this skill does
- When Claude should use it
- Key outcomes

### Section 2: The Five Entity Types

- Complete table with paths, purposes, inheritance
- Visual hierarchy diagram
- Requirement ID formats

### Section 3: Entity-First Detection

- When to include entity detection
- Complete workflow.yaml snippet
- Complete instructions.md step template
- Variables returned and their uses

### Section 4: Inheritance Validation

- The inheritance chain
- Parent path resolution per entity type
- Validation rules (ADD, never CONTRADICT)
- Code pattern for inheritance checking

### Section 5: Conditional Formatting

- Constitution-specific sections
- Container entity sections (Strategic, Coordination)
- Terminal entity sections (Infrastructure, Business)
- Dynamic section generation

### Section 6: Checklist Composition

- Primitive files and their purposes
- Composition algorithm
- Generated checklist locations
- Regeneration command

### Section 7: Workflow Categories

- Document workflows (PRD, Architecture, UX, Epics)
- Action workflows (no template)
- Router workflows (detect → dispatch)
- Meta workflows (coordinate others)

### Section 8: Standard Patterns

- Entity selection UI (standardized greeting)
- Output path resolution
- Status file integration
- Discovery phase handling

### Section 9: Quick Reference

- Entity detection task paths
- Checklist paths
- Template paths
- Validation commands

---

## 8. Integration Points

### 8.1 Related Skills

| Skill                         | Relationship                                          |
| ----------------------------- | ----------------------------------------------------- |
| `validate-sibling-dependency` | Validates ADR-020 after workflow creates dependencies |

### 8.2 Related BMAD Components

| Component            | Path                                                        | Purpose                           |
| -------------------- | ----------------------------------------------------------- | --------------------------------- |
| Entity Menu          | `.bmad/bmm/data/entity-menu.yaml`                           | Lightweight entity selection data |
| Entity Detection     | `.bmad/bmm/tasks/detect-entity-type.xml`                    | Runtime type detection            |
| Entity Selection     | `.bmad/bmm/tasks/select-entity.xml`                         | Standardized selection UI         |
| Entity Workflows     | `.bmad/bmm/workflows/workflow-status/entity-workflows.yaml` | Per-entity workflow sequences     |
| Checklist Primitives | `.bmad/bmm/checklists/primitives/`                          | Composable checklist fragments    |
| Workflow Engine      | `.bmad/core/tasks/workflow.xml`                             | Core execution engine             |

### 8.3 Related Scripts

| Script                            | Purpose                                   |
| --------------------------------- | ----------------------------------------- |
| `scripts/generate-checklists.py`  | Regenerate all 20 composed checklists     |
| `scripts/generate-entity-menu.js` | Regenerate entity-menu.yaml from manifest |

---

## 9. Example Usage Scenarios

### Scenario 1: Create a New PRD Validation Workflow

```
User: "Create a workflow to validate PRDs"

Claude activates skill → Determines this needs:
- Entity-first detection (to know which PRD)
- Router pattern (Constitution vs Domain PRD)
- Inheritance validation (Domain PRDs inherit from parent)
- Correct checklist based on entity type
```

### Scenario 2: Standardize an Existing Workflow

```
User: "Update create-architecture to use entity detection"

Claude activates skill → Adds:
- shared_tasks section with select-entity, detect-entity-type
- Step 0 with entity selection UI
- Conditional template selection based on entity type
- Inheritance validation step
```

### Scenario 3: Create Amend Workflow for Epics

```
User: "Create amend-epics workflow"

Claude activates skill → Creates:
- Router workflow that detects entity type
- Routes to amend-system-epics or amend-domain-epics
- Both sub-workflows include inheritance validation
- Uses entity-appropriate checklist
```

---

## 10. Validation Checklist for Generated Workflows

When this skill generates or modifies a workflow, validate:

- [ ] `workflow.yaml` includes `shared_tasks` with entity detection tasks
- [ ] `instructions.md` has entity selection step (usually Step 0 or 1)
- [ ] Entity type display includes standardized greeting box
- [ ] Non-Constitution entities have inheritance validation step
- [ ] Conditional sections match entity type capabilities
- [ ] Checklist reference uses correct `{entity_type}-{doc_type}-checklist.md`
- [ ] Output path uses `{output_folder_resolved}` from entity detection
- [ ] Requirement IDs use correct `{fr_prefix}` format
- [ ] `standalone: true/false` is explicitly set
- [ ] Router workflows properly dispatch to type-specific sub-workflows

---

## 11. Open Questions for Review

1. **Skill Scope:** Should this skill also handle BMB (BMAD Builder) workflows, or focus only on BMM (BMAD Method) workflows?

2. **Checklist Generation:** Should the skill invoke `scripts/generate-checklists.py` when new checklists are needed, or just document the manual process?

3. **Router Pattern:** Should ALL validation/amend workflows be routers, or allow simpler single workflows for specific entity types?

4. **Web Bundle:** Should the skill auto-generate `web_bundle` configuration, or leave that as a separate concern?

5. **allowed-tools:** Current design restricts to Read/Write/Edit/Glob/Grep. Should Bash be included for script execution?

---

## 12. Next Steps

1. **Review this design document** — Confirm patterns and structure
2. **Create SKILL.md** — Implement the main skill file
3. **Create data files** — Entity types, patterns, composition rules
4. **Create templates** — Reusable workflow structure templates
5. **Create references** — Detailed documentation for complex patterns
6. **Test with sample workflows** — Validate the skill works correctly

---

**End of Design Document**
