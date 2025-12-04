# Infrastructure Architecture Checklist

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

## Architecture Document Quality

### Structural Elements

- [ ] **Executive Summary / Overview** articulating architectural vision
- [ ] **High-Level Architecture** with system/component diagram reference
- [ ] **Technology Stack** with justified choices
- [ ] **Data Architecture** or data model approach
- [ ] **Integration Patterns** for inter-component communication
- [ ] **ADRs** (Architecture Decision Records) for significant decisions

### PRD Alignment

- [ ] Each functional requirement has architectural support
- [ ] Interface contracts have implementation patterns
- [ ] NFRs (performance, security, scalability) addressed architecturally
- [ ] Traceability to PRD requirements present

### ADR Coverage

- [ ] Major technology choices have ADRs
- [ ] Significant pattern decisions documented
- [ ] Trade-offs explicitly stated
- [ ] ADR status maintained (proposed/accepted/deprecated)

### Implementation Readiness

- [ ] All components identified for implementation
- [ ] Dependencies mapped
- [ ] Test strategy implied
- [ ] Deployment considerations noted

---

## Infrastructure-Specific Sections

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

## Entity-Specific NFRs (If Present)

- [ ] Only module-specific NFRs (beyond Constitution)
- [ ] Performance requirements beyond baseline
- [ ] Security beyond platform minimum
- [ ] Justified need for each NFR

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

**Date:** ******\_\_\_******
**Validator:** ******\_\_\_******

**Overall Status:** ☐ PASS ☐ FAIL ☐ NEEDS REVISION

**Notes:**
