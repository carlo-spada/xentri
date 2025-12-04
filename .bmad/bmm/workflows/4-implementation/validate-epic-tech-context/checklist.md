# Epic Tech Context Validation Checklist

> This checklist is used by the validate-epic-tech-context workflow to assess document quality.

## Document Structure

- [ ] Frontmatter present (Epic ID, Title, Date)
- [ ] Epic ID matches filename
- [ ] No placeholder text remains (`{{variable}}`, `[TODO]`)
- [ ] Markdown headers properly structured
- [ ] Sections logically ordered

## Epic Summary

- [ ] Epic title matches epics.md definition
- [ ] Epic scope clearly summarized
- [ ] Business value articulated
- [ ] Dependencies on other epics noted

## Technical Approach

- [ ] Overall approach clearly explained
- [ ] Key technical decisions documented with rationale
- [ ] Aligns with architecture document (if exists)
- [ ] No architectural violations
- [ ] Data model changes described (if applicable)
- [ ] API changes described (if applicable)
- [ ] Event patterns described (if applicable)

## Requirement Traceability

- [ ] All stories trace to PRD requirements
- [ ] Requirement IDs use correct format
- [ ] No requirements missed for this epic
- [ ] No scope creep beyond PRD

## Story Breakdown

- [ ] Stories are appropriately sized (1-3 day effort)
- [ ] Each story has clear title
- [ ] Each story has description
- [ ] Dependencies between stories identified
- [ ] Stories ordered for logical implementation
- [ ] Story count appropriate for epic scope

## Acceptance Criteria

- [ ] Each story has specific acceptance criteria
- [ ] Criteria are testable (pass/fail determination)
- [ ] Criteria cover happy path
- [ ] Edge cases considered
- [ ] Error scenarios included where appropriate

## Implementation Guidance

- [ ] Technical approach clear enough to start coding
- [ ] Key implementation decisions documented
- [ ] Known complexities called out
- [ ] Risks identified with mitigation
- [ ] Testing approach identified

## Architecture Alignment (If Architecture Exists)

- [ ] Technology choices match architecture ADRs
- [ ] Data patterns follow established conventions
- [ ] API design follows platform standards
- [ ] Security requirements addressed
- [ ] Multi-tenancy considerations included (org_id, RLS)
- [ ] Event patterns follow architecture guidelines

## Quality Assessment

### Critical Issues (blocks story creation):

- [ ] None identified

### Warnings (should address):

- [ ] None identified

### Ready for Story Creation:

- [ ] Yes, epic tech context is validated
- [ ] No, requires amendments (see issues above)
