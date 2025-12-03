# Constitution Epics Checklist

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

## Platform Requirements (PR-xxx)

### Completeness

- [ ] Multi-tenancy requirements defined (org_id, RLS, data isolation)
- [ ] Event system requirements defined (event spine, envelope format)
- [ ] Authentication/Authorization baseline defined
- [ ] Data handling requirements defined
- [ ] Error handling standards defined
- [ ] Logging/Observability requirements defined
- [ ] Security baseline defined

### Quality

- [ ] Each PR has unique sequential ID (PR-001, PR-002, ...)
- [ ] Each PR has clear, testable requirement statement
- [ ] Each PR has rationale explaining WHY
- [ ] Each PR has enforcement mechanism specified
- [ ] No gaps in PR numbering
- [ ] No duplicate requirements
- [ ] No contradictions between PRs
- [ ] Language uses MUST/SHALL for mandatory items

## Integration Contracts (IC-xxx)

### Completeness

- [ ] Event envelope schema defined (IC for SystemEvent)
- [ ] Event naming convention defined
- [ ] Module registration format defined
- [ ] API versioning strategy defined
- [ ] Error response format defined
- [ ] Permission check protocol defined

### Quality

- [ ] Each IC has unique sequential ID (IC-001, IC-002, ...)
- [ ] Each IC has clear interface definition
- [ ] Each IC specifies required fields/methods
- [ ] Each IC has version if applicable
- [ ] No gaps in IC numbering
- [ ] No contradictions between ICs
- [ ] Contracts are implementable

## System-Wide NFRs

- [ ] Only truly system-wide NFRs included (not module-specific)
- [ ] Performance baselines measurable
- [ ] Availability targets specified
- [ ] Security standards clear
- [ ] Scalability expectations reasonable
- [ ] Compliance requirements listed if applicable

## Governance

- [ ] Change process documented
- [ ] Who can propose changes specified
- [ ] Approval requirements clear
- [ ] Impact assessment requirements stated
- [ ] Protected documents listed
- [ ] Commit message format specified


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
