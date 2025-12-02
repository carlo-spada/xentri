# Business Module PRD Validation Checklist

> **Entity Type:** Business Module
> **Location:** docs/{category}/{subcategory}/{module}/prd.md
> **Purpose:** Validate PRD for terminal business modules (user-facing feature modules)

---

## 1. Document Structure

### Frontmatter
- [ ] YAML frontmatter present
- [ ] `entity_type: business_module` specified
- [ ] `fr_prefix: FR-{CAT}-{SUB}-{MOD}` correct (e.g., FR-STR-PUL-DAS)
- [ ] `parent_prd: docs/{category}/{subcategory}/prd.md` referenced
- [ ] `inherits_from: docs/{category}/{subcategory}/prd.md` specified
- [ ] `version` field with semver format
- [ ] `status` field present
- [ ] `created` and `updated` dates

### Required Sections
- [ ] Inheritance Context section present
- [ ] Purpose & Scope section present
- [ ] Functional Requirements section present
- [ ] User Stories section present (optional but recommended)
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

### Parent (Coordination Unit) Compliance
- [ ] Parent PRD (subcategory) referenced
- [ ] Within parent coordination scope
- [ ] Adds specificity without contradiction
- [ ] Parent alignment table populated

### Chain Integrity
- [ ] References parent (coordination unit), not grandparent directly
- [ ] No skip-level references
- [ ] Respects zero-trust model (doesn't reference siblings)

---

## 3. Functional Requirements (FR-xxx)

### Format
- [ ] FR prefix matches full path (FR-{CAT}-{SUB}-{MOD}-xxx)
- [ ] Sequential numbering (no gaps)
- [ ] Each FR has actor and capability
- [ ] Clear, testable statements

### Content
- [ ] User-facing capabilities focus
- [ ] Feature requirements specific
- [ ] User jobs-to-be-done addressed
- [ ] Acceptance criteria implicit or explicit

### Altitude Check
- [ ] Module-level granularity (not too broad)
- [ ] Feature-specific (not category or subcategory concerns)
- [ ] Doesn't duplicate parent FRs (references instead)

### Coverage
- [ ] All user workflows covered
- [ ] Error scenarios addressed
- [ ] Edge cases considered
- [ ] Integration with siblings documented if applicable

---

## 4. Business Module-Specific Sections

### User Stories (Recommended)
- [ ] Key user stories documented (if included)
- [ ] User persona identified
- [ ] Acceptance criteria present
- [ ] Linked to FRs

### Sibling Integration (If Applicable)
- [ ] Integration with sibling modules documented
- [ ] Shared data/events identified
- [ ] Coordination patterns clear

---

## 5. Entity-Specific NFRs (If Present)

- [ ] Only module-specific NFRs
- [ ] Beyond parent/grandparent NFRs
- [ ] Performance specific to this module
- [ ] Justified need documented

---

## 6. Traceability

### Parent Alignment
- [ ] Parent (coordination unit) FRs mapped
- [ ] Related parent FRs linked
- [ ] Coverage of parent requirements clear

### Implementation Readiness
- [ ] FRs ready for epic/story breakdown
- [ ] Clear enough for UX design
- [ ] Specific enough for architecture

---

## 7. Quality Standards

- [ ] User-focused language
- [ ] Clear capability statements
- [ ] Testable requirements
- [ ] No vague terms
- [ ] Consistent terminology with parent docs

---

## 8. Terminal Node Checks

Business Modules are TERMINAL nodes in the hierarchy:
- [ ] No child PRDs expected below this
- [ ] Implementation-ready detail level
- [ ] Ready for sprint planning

---

## Validation Result

**Date:** _______________
**Validator:** _______________
**Module Path:** _______________

| Category | Pass | Fail | N/A |
|----------|------|------|-----|
| Document Structure | | | |
| Inheritance Validation | | | |
| Functional Requirements | | | |
| Business Module Sections | | | |
| NFRs | | | |
| Traceability | | | |
| Quality Standards | | | |
| Terminal Node Checks | | | |

**Overall Status:** ☐ PASS ☐ FAIL ☐ NEEDS REVISION

**Notes:**
