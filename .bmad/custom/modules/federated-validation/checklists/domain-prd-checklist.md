# Entity PRD Validation Checklist

> For validating Infrastructure Module, Strategic Container, Coordination Unit, and Business Module PRDs

## 1. Document Structure

### Frontmatter

- [ ] `entity_type` present and matches one of: `infrastructure_module | strategic_container | coordination_unit | business_module`
- [ ] `doc_type: prd` present
- [ ] `parent` present and references direct parent PRD:
  - Infrastructure Module → `docs/platform/prd.md` (Constitution)
  - Strategic Container → `docs/platform/prd.md` (Constitution)
  - Coordination Unit → `docs/{category}/prd.md` (Strategic Container)
  - Business Module → `docs/{category}/{subcat}/prd.md` (Coordination Unit)
- [ ] `scope` defined (used for FR-{SCOPE}-xxx prefix)

### Required Sections

- [ ] Executive Summary or Overview present
- [ ] Inherited Platform Requirements section (or acknowledgment)
- [ ] Implemented Integration Contracts section
- [ ] Functional Requirements section
- [ ] Scope section (MVP / Growth / Out of Scope)

## 2. Constitution Compliance

### PR Inheritance

- [ ] Acknowledges all relevant PRs from Constitution
- [ ] Documents non-obvious compliance approaches
- [ ] No contradictions with PRs (only additions allowed)

### IC Implementation

- [ ] Lists which ICs this domain implements
- [ ] Distinguishes between producer and consumer roles
- [ ] References IC definitions in Constitution

## 3. Functional Requirements (FR-xxx)

### Naming

- [ ] All FRs use format: `FR-{SCOPE}-xxx`
- [ ] SCOPE matches frontmatter scope value
- [ ] IDs are sequential: FR-SOUL-001, FR-SOUL-002, etc.

### Quality

- [ ] Each FR describes WHAT, not HOW (capabilities, not implementation)
- [ ] Each FR is testable (can write acceptance criteria)
- [ ] Each FR is prioritized (MVP | Growth | Vision)
- [ ] Each FR is scoped to this domain (not system-wide)

### Completeness

- [ ] At least one FR defined for active domains
- [ ] All user-facing capabilities have corresponding FRs
- [ ] Dependencies between FRs noted

## 4. Scope Management

### MVP Definition

- [ ] Clear line drawn for V1/MVP
- [ ] MVP FRs achievable in target timeline
- [ ] MVP provides end-to-end value

### Growth & Vision

- [ ] Growth phase clearly separated from MVP
- [ ] Vision/future items marked as such
- [ ] Out of Scope explicitly listed

## 5. Entity-Type-Specific Checks

### For Infrastructure Module PRDs

- [ ] Defines exposed interfaces (what this module provides)
- [ ] Defines consumed interfaces (what this module requires)
- [ ] Focus on technical boundaries and contracts
- [ ] FRs scope to module-specific implementation

### For Strategic Container PRDs

- [ ] Sets strategic direction for coordination units
- [ ] FRs are high-level, delegating details to children
- [ ] Defines coordination patterns between subcategories
- [ ] May be a brief rather than full PRD

### For Coordination Unit PRDs

- [ ] Full PRD with implementation-ready FRs
- [ ] References Strategic Container direction
- [ ] Orchestrates modules within subcategory
- [ ] Enough detail for Architecture workflow

### For Business Module PRDs

- [ ] May be minimal (module-specific concerns only)
- [ ] FRs trace to Coordination Unit FRs
- [ ] Focus on specific feature implementation
- [ ] Defines user-facing functionality

## 6. Readiness

- [ ] Enough detail for Architecture workflow
- [ ] Enough detail to break into Epics
- [ ] Acceptance criteria are clear for each FR

---

## Validation Summary

| Category             | Items  | Passed | Percentage |
| -------------------- | ------ | ------ | ---------- |
| Structure            | 12     | ?      | ?%         |
| Constitution         | 5      | ?      | ?%         |
| FRs                  | 9      | ?      | ?%         |
| Scope                | 5      | ?      | ?%         |
| Entity-Type-Specific | 4      | ?      | ?%         |
| Readiness            | 3      | ?      | ?%         |
| **Total**            | **38** | **?**  | **?%**     |

**Note:** Entity-Type-Specific section has 4 items per entity type. Only check the items relevant to the document's `entity_type`.

**Minimum to pass:** 80% (30/38 items)
