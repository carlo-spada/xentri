# Constitution Ux Checklist

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

## UX Design Document Quality

### Structural Elements

- [ ] **Design System** chosen and documented
- [ ] **Visual Foundation** (colors, typography, spacing)
- [ ] **User Journey Flows** for all critical paths
- [ ] **Component Library** strategy defined
- [ ] **UX Pattern Consistency Rules** established

### Collaborative Design Artifacts

- [ ] Design decisions made WITH user input
- [ ] Color theme selection from presented options
- [ ] Design direction chosen from mockups
- [ ] Decision rationale documented (why each choice was made)

### Visual Foundation

- [ ] Complete color palette (primary, secondary, semantic, neutrals)
- [ ] Typography system (font families, type scale, weights)
- [ ] Spacing system defined (base unit, scale)
- [ ] Layout grid approach documented

### User Journey Coverage

- [ ] All PRD user journeys have UX design
- [ ] Each flow has clear goal and step-by-step documentation
- [ ] Error states and recovery addressed
- [ ] Success states specified

### Responsive & Accessibility

- [ ] Breakpoints defined for target devices
- [ ] WCAG compliance level specified
- [ ] Keyboard navigation addressed
- [ ] Color contrast requirements documented

### Implementation Readiness

- [ ] Component specifications actionable (states, variants, behaviors)
- [ ] Sufficient detail for frontend development
- [ ] Flows implementable with clear steps
- [ ] Pattern consistency enforceable

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

**Date:** ******\_\_\_******
**Validator:** ******\_\_\_******

**Overall Status:** ☐ PASS ☐ FAIL ☐ NEEDS REVISION

**Notes:**
