# Business Ux Checklist

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
