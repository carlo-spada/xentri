# Infrastructure Module PRD Validation Checklist

> **Entity Type:** Infrastructure Module
> **Location:** docs/platform/{module}/prd.md
> **Purpose:** Validate PRD for platform infrastructure modules (shell, ui, core-api, ts-schema, etc.)

---

## 1. Document Structure

### Frontmatter
- [ ] YAML frontmatter present
- [ ] `entity_type: infrastructure_module` specified
- [ ] `fr_prefix: FR-{CODE}` correct (e.g., FR-SHL, FR-API)
- [ ] `parent_prd: docs/platform/prd.md` referenced
- [ ] `inherits_from: docs/platform/prd.md` specified
- [ ] `version` field with semver format
- [ ] `status` field present
- [ ] `created` and `updated` dates

### Required Sections
- [ ] Inheritance Context section present
- [ ] Purpose & Scope section present
- [ ] Functional Requirements section present
- [ ] Exposed Interfaces section present
- [ ] Consumed Interfaces section present
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
- [ ] Scope within parent boundaries
- [ ] No skip-level references (direct only to Constitution)

---

## 3. Functional Requirements (FR-xxx)

### Format
- [ ] FR prefix matches entity code (FR-{CODE}-xxx)
- [ ] Sequential numbering (no gaps)
- [ ] Each FR has actor and capability
- [ ] Clear, testable statements

### Content
- [ ] Core module capabilities documented
- [ ] Service behaviors and guarantees specified
- [ ] Not duplicating Constitution requirements
- [ ] Appropriate altitude (WHAT not HOW)

### Coverage
- [ ] All module responsibilities have FRs
- [ ] Integration points have FRs
- [ ] Error scenarios addressed

---

## 4. Infrastructure-Specific Sections

### Exposed Interfaces
- [ ] Section present and populated
- [ ] API endpoints documented
- [ ] Event types emitted listed
- [ ] Shared utilities described
- [ ] Data schemas referenced

### Consumed Interfaces
- [ ] Section present and populated
- [ ] Other module APIs listed
- [ ] Events subscribed to listed
- [ ] Shared services used documented
- [ ] Dependencies clear

---

## 5. Entity-Specific NFRs (If Present)

- [ ] Only module-specific NFRs (beyond Constitution)
- [ ] Performance requirements beyond baseline
- [ ] Security beyond platform minimum
- [ ] Justified need for each NFR

---

## 6. Traceability

### Constitution Alignment Table
- [ ] Relevant PRs mapped to implementation
- [ ] Relevant ICs mapped to implementation

### Quality
- [ ] Each FR traceable to module purpose
- [ ] No orphan requirements

---

## 7. Quality Standards

- [ ] Clear, unambiguous language
- [ ] Implementation-agnostic (WHAT not HOW)
- [ ] No vague terms
- [ ] Consistent terminology

---

## Validation Result

**Date:** _______________
**Validator:** _______________
**Module:** _______________

| Category | Pass | Fail | N/A |
|----------|------|------|-----|
| Document Structure | | | |
| Inheritance Validation | | | |
| Functional Requirements | | | |
| Infrastructure Sections | | | |
| NFRs | | | |
| Traceability | | | |
| Quality Standards | | | |

**Overall Status:** ☐ PASS ☐ FAIL ☐ NEEDS REVISION

**Notes:**
