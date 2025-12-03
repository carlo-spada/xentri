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
