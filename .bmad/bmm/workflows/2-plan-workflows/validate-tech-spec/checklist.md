# Tech Spec Validation Checklist

> This checklist is used by the validate-tech-spec workflow to assess document quality.

## Document Structure

- [ ] Frontmatter present (Title, Date, Author)
- [ ] Change type specified (simple-change OR feature)
- [ ] No placeholder text remains (`{{variable}}`, `[TODO]`, `[NEEDS CONFIRMATION]`)
- [ ] Markdown headers properly structured
- [ ] Sections logically ordered

## Summary/Overview

- [ ] Purpose clearly articulated in 1-2 sentences
- [ ] Scope explicitly defined (what's included/excluded)
- [ ] Dependencies and prerequisites identified
- [ ] Triggering context explained (why now, what prompted this)

## Technical Approach

- [ ] Approach is feasible with current stack
- [ ] Rationale provided for key technical decisions
- [ ] Alternatives considered and dismissed (if applicable)
- [ ] No over-engineering for the stated scope
- [ ] Aligns with architecture standards (if architecture exists)

## Implementation Details

### For Simple Changes

- [ ] Change location identified (files, modules)
- [ ] Expected behavior clearly described
- [ ] Edge cases considered
- [ ] Rollback plan identified (if applicable)

### For Features (Multi-Story)

- [ ] Data model changes documented (if applicable)
- [ ] API contracts specified (if applicable)
- [ ] UI/UX changes referenced (if applicable)
- [ ] Event handling defined (if applicable)
- [ ] Error scenarios documented
- [ ] Performance considerations noted (if relevant)

## Story Breakdown (Feature Type Only)

- [ ] Stories are appropriately sized (1-3 day effort each)
- [ ] Each story has clear title and description
- [ ] Acceptance criteria defined per story
- [ ] Dependencies between stories identified
- [ ] Stories ordered for logical implementation
- [ ] Total scope matches 1 story (simple) or 2-5 stories (feature)

## Testing Considerations

- [ ] Test approach identified (unit, integration, e2e)
- [ ] Key test scenarios listed
- [ ] Edge cases included in test scope
- [ ] Acceptance criteria are testable

## Architecture Alignment (If Architecture Exists)

- [ ] Technology choices match architecture ADRs
- [ ] Data patterns follow established conventions
- [ ] API design follows platform standards
- [ ] Security requirements addressed
- [ ] Multi-tenancy considerations included (org_id, RLS)
- [ ] Event patterns follow architecture guidelines

## Quality Assessment

### Critical Issues (blocks story generation):

- [ ] None identified

### Warnings (should address):

- [ ] None identified

### Ready for Story Generation:

- [ ] Yes, tech spec is validated
- [ ] No, requires amendments (see issues above)
