# Business Epics Checklist

> **Auto-generated** from primitives. Do not edit directly.

> Run `python scripts/generate-checklists.py` to regenerate.

---

## 1. Document Structure

### Frontmatter

- [ ] YAML frontmatter present at top of document
- [ ] `title` field populated
- [ ] `document_type` specified correctly
- [ ] `entity_type` specified correctly
- [ ] `version` field with semver format
- [ ] `status` field (draft/review/approved)
- [ ] `created` and `updated` dates


---

## Inheritance Validation

### Constitution Alignment

- [ ] Constitution reference present
- [ ] No contradictions with PR-xxx
- [ ] No contradictions with IC-xxx
- [ ] Constitution alignment table populated

### Parent Compliance

- [ ] Parent PRD referenced correctly
- [ ] Scope within parent boundaries
- [ ] No skip-level references (direct only to Constitution)


---

## Epics Document Quality

### Structural Elements

- [ ] **Overview section** with scope description
- [ ] **Requirements Inventory** with FR-xxx listings
- [ ] **Epic Summary** table with all epics
- [ ] **Each epic** has goal, scope, and stories
- [ ] **Traceability Matrix** linking requirements to stories

### PRD Traceability

- [ ] Every FR-xxx has at least one story
- [ ] All integration points have stories
- [ ] NFRs addressed in appropriate epics
- [ ] Traceability matrix is complete and accurate

### Epic Quality

- [ ] **USER VALUE CHECK**: Each epic answers "What can users DO after this?"
- [ ] No technical-layer-only epics (database, API, frontend separately)
- [ ] Vertically sliced epics (each delivers complete functionality)
- [ ] Epic IDs are sequential
- [ ] Dependencies between epics documented

### Story Quality

- [ ] Stories follow user story format (As a... I want... So that...)
- [ ] **BDD Acceptance Criteria** (Given/When/Then)
- [ ] Stories are vertically sliced (not horizontal layers)
- [ ] Story IDs follow {epic}.{story} pattern
- [ ] Prerequisites are valid (no forward dependencies)

### Implementation Readiness

- [ ] Stories sized for single dev session
- [ ] Technical dependencies identified
- [ ] Test scenarios derivable from acceptance criteria
- [ ] Ready for sprint planning


---

## Business-Specific Sections

### User Capabilities

- [ ] User stories / Jobs-to-be-done defined
- [ ] User roles identified
- [ ] Key workflows mapped

### Integration

- [ ] Integration with sibling modules defined


---

## Quality Standards

### Language

- [ ] Requirements use clear, unambiguous language
- [ ] MUST/SHALL for mandatory, SHOULD for recommended
- [ ] No vague terms ("good", "fast", "easy")
- [ ] Technical terms defined or consistent with glossary

### Traceability

- [ ] Document history tracks changes


---

### Formatting

- [ ] All sections have proper heading levels
- [ ] No unfilled template variables ({{variable}})
- [ ] Tables properly formatted
- [ ] No broken markdown


---

## Validation Result

**Date:** _______________
**Validator:** _______________

**Overall Status:** ☐ PASS ☐ FAIL ☐ NEEDS REVISION

**Notes:**
