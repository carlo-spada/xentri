# Strategic Container PRD Validation Checklist

> **Entity Type:** Strategic Container
> **Location:** docs/{category}/prd.md
> **Purpose:** Validate PRD for business category containers (strategy, marketing, sales, etc.)

---

## 1. Document Structure

### Frontmatter
- [ ] YAML frontmatter present
- [ ] `entity_type: strategic_container` specified
- [ ] `fr_prefix: FR-{CAT}` correct (e.g., FR-STR, FR-MKT)
- [ ] `parent_prd: docs/platform/prd.md` referenced
- [ ] `inherits_from: docs/platform/prd.md` specified
- [ ] `version` field with semver format
- [ ] `status` field present
- [ ] `created` and `updated` dates

### Required Sections
- [ ] Inheritance Context section present
- [ ] Purpose & Scope section present
- [ ] Functional Requirements section present
- [ ] Strategic Alignment section present
- [ ] Child Coordination section present
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
- [ ] Constitution alignment table populated

### Parent Compliance
- [ ] Parent PRD is Constitution (docs/platform/prd.md)
- [ ] Category scope clear
- [ ] Appropriate altitude (category-level, not module-level)

---

## 3. Functional Requirements (FR-xxx)

### Format
- [ ] FR prefix matches category code (FR-{CAT}-xxx)
- [ ] Sequential numbering (no gaps)
- [ ] Each FR has actor and capability
- [ ] Clear, testable statements

### Content
- [ ] Category-level capabilities (not too granular)
- [ ] Business outcomes focused
- [ ] Shared behaviors for all children
- [ ] Strategic alignment reflected

### Altitude Check
- [ ] Requirements are category-level (not subcategory or module)
- [ ] Leaves room for child specialization
- [ ] Doesn't duplicate Constitution

---

## 4. Strategic Container-Specific Sections

### Strategic Alignment
- [ ] Section present and populated
- [ ] Business goals supported documented
- [ ] Success metrics defined
- [ ] Strategic priorities listed
- [ ] Alignment with platform vision clear

### Child Coordination
- [ ] Section present and populated
- [ ] Planned subcategories listed
- [ ] What gets shared between children defined
- [ ] What stays isolated defined
- [ ] Escalation patterns documented
- [ ] Zero-trust model respected (parent curates)

---

## 5. Entity-Specific NFRs (If Present)

- [ ] Only category-specific NFRs (beyond Constitution)
- [ ] Justified for entire category
- [ ] Not overly prescriptive for children

---

## 6. Traceability

### Constitution Alignment Table
- [ ] Relevant PRs mapped
- [ ] Relevant ICs mapped

### Child Readiness
- [ ] Scope clear enough for child PRDs to reference
- [ ] FR IDs allow child prefix extension (FR-STR → FR-STR-PUL)

---

## 7. Quality Standards

- [ ] Strategic language appropriate
- [ ] Business outcomes focused
- [ ] Clear boundaries for children
- [ ] No implementation details

---

## Validation Result

**Date:** _______________
**Validator:** _______________
**Category:** _______________

| Category | Pass | Fail | N/A |
|----------|------|------|-----|
| Document Structure | | | |
| Inheritance Validation | | | |
| Functional Requirements | | | |
| Strategic Sections | | | |
| NFRs | | | |
| Traceability | | | |
| Quality Standards | | | |

**Overall Status:** ☐ PASS ☐ FAIL ☐ NEEDS REVISION

**Notes:**
