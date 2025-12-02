# Entity PRD Validation Checklist

> For validating Infrastructure Module, Strategic Container, Coordination Unit, and Business Module PRDs

## 1. Document Structure

### Frontmatter
- [ ] `entity_type` present and matches one of: `infrastructure_module | strategic_container | coordination_unit | business_module`
- [ ] `doc_type: prd` present
- [ ] `parent: docs/platform/prd.md` present (references Constitution)
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

## 5. Level-Specific Checks

### For Category PRDs (Level 1)
- [ ] Sets strategic direction for subcategories
- [ ] FRs are high-level, delegating details to subcategories
- [ ] May be a brief rather than full PRD

### For Subcategory PRDs (Level 2)
- [ ] Full PRD with implementation-ready FRs
- [ ] References Category direction
- [ ] Enough detail for Architecture workflow

### For Module PRDs (Level 3)
- [ ] May be minimal (module-specific concerns only)
- [ ] FRs trace to Subcategory FRs
- [ ] Focus on specific implementation boundaries

## 6. Readiness

- [ ] Enough detail for Architecture workflow
- [ ] Enough detail to break into Epics
- [ ] Acceptance criteria are clear for each FR

---

## Validation Summary

| Category | Items | Passed | Percentage |
|----------|-------|--------|------------|
| Structure | 9 | ? | ?% |
| Constitution | 5 | ? | ?% |
| FRs | 9 | ? | ?% |
| Scope | 5 | ? | ?% |
| Level-Specific | 3 | ? | ?% |
| Readiness | 3 | ? | ?% |
| **Total** | **34** | **?** | **?%** |

**Minimum to pass:** 80% (27/34 items)
