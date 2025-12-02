# Domain PRD Validation Checklist

## 1. Constitution Compliance

- [ ] **Parent Constitution Referenced**: Does frontmatter point to `docs/prd.md`?
- [ ] **Inherited PRs Acknowledged**: Does it list how it complies with PR-xxx?
- [ ] **ICs Declared**: Does it list which IC-xxx it implements?
- [ ] **No Contradictions**: Are all local rules compatible with the Constitution?

## 2. Functional Requirements Quality

- [ ] **Unique IDs**: `FR-{SCOPE}-xxx` format used?
- [ ] **What, not How**: Focus on capabilities, not implementation details?
- [ ] **Testable**: Can we write a test for it?
- [ ] **Domain Scoped**: Is it strictly within this sub-category's domain?
- [ ] **Prioritized**: MVP vs Growth vs Vision?

## 3. Scope Management

- [ ] **MVP Defined**: Clear line for V1?
- [ ] **Growth Defined**: What comes later?
- [ ] **Out of Scope**: What are we NOT doing?

## 4. Readiness

- [ ] **Architecture Ready**: Enough detail for technical design?
- [ ] **Epic Ready**: Enough detail to break down into epics?
