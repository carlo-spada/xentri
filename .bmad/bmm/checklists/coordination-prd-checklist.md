# Coordination Unit PRD Validation Checklist

> **Entity Type:** Coordination Unit
> **Location:** docs/{category}/{subcategory}/prd.md
> **Purpose:** Validate PRD for subcategory coordination units (e.g., strategy/pulse, marketing/brand)

---

## 1. Document Structure

### Frontmatter
- [ ] YAML frontmatter present
- [ ] `entity_type: coordination_unit` specified
- [ ] `fr_prefix: FR-{CAT}-{SUB}` correct (e.g., FR-STR-PUL)
- [ ] `parent_prd: docs/{category}/prd.md` referenced
- [ ] `inherits_from: docs/{category}/prd.md` specified
- [ ] `version` field with semver format
- [ ] `status` field present
- [ ] `created` and `updated` dates

### Required Sections
- [ ] Inheritance Context section present
- [ ] Purpose & Scope section present
- [ ] Functional Requirements section present
- [ ] Module Orchestration section present
- [ ] Integration Points section present
- [ ] Traceability section present
- [ ] Document History section present

### Formatting
- [ ] All sections have proper heading levels
- [ ] No unfilled template variables
- [ ] Tables properly formatted

---

## 2. Inheritance Validation

### Constitution Alignment
- [ ] Constitution reference present
- [ ] No contradictions with PR-xxx
- [ ] No contradictions with IC-xxx

### Parent (Strategic Container) Compliance
- [ ] Parent PRD (category) referenced
- [ ] Within parent scope boundaries
- [ ] Adds specificity without contradiction
- [ ] Parent alignment table populated

### Chain Integrity
- [ ] References parent, not Constitution directly (unless through parent)
- [ ] No skip-level to grandparent or siblings

---

## 3. Functional Requirements (FR-xxx)

### Format
- [ ] FR prefix matches path (FR-{CAT}-{SUB}-xxx)
- [ ] Sequential numbering (no gaps)
- [ ] Each FR has actor and capability
- [ ] Clear, testable statements

### Content
- [ ] Subcategory-level coordination focus
- [ ] Module orchestration requirements
- [ ] Shared patterns across child modules
- [ ] Integration requirements between modules

### Altitude Check
- [ ] Requirements are coordination-level (not individual module features)
- [ ] Leaves room for module specialization
- [ ] Doesn't duplicate parent category FRs

---

## 4. Coordination Unit-Specific Sections

### Module Orchestration
- [ ] Section present and populated
- [ ] Child modules listed (planned or existing)
- [ ] Workflow patterns between modules documented
- [ ] Data flow between modules described
- [ ] Event choreography documented

### Integration Points
- [ ] Section present and populated
- [ ] Shared data models documented
- [ ] Event contracts between modules listed
- [ ] API dependencies mapped
- [ ] Common patterns identified

---

## 5. Entity-Specific NFRs (If Present)

- [ ] Only subcategory-specific NFRs
- [ ] Apply to all child modules
- [ ] Beyond parent category NFRs
- [ ] Justified need documented

---

## 6. Traceability

### Parent Alignment
- [ ] Parent (category) FRs mapped
- [ ] Related parent FRs linked

### Child Readiness
- [ ] Scope clear for module PRDs
- [ ] FR IDs allow module prefix extension

---

## 7. Quality Standards

- [ ] Coordination focus maintained
- [ ] Not too implementation-specific
- [ ] Clear boundaries for modules
- [ ] Consistent with parent terminology

---

## Validation Result

**Date:** _______________
**Validator:** _______________
**Category/Subcategory:** _______________

| Category | Pass | Fail | N/A |
|----------|------|------|-----|
| Document Structure | | | |
| Inheritance Validation | | | |
| Functional Requirements | | | |
| Coordination Sections | | | |
| NFRs | | | |
| Traceability | | | |
| Quality Standards | | | |

**Overall Status:** ☐ PASS ☐ FAIL ☐ NEEDS REVISION

**Notes:**
