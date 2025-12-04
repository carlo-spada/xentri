# Epic Breakdown Validation Checklist

> For validating Epic files with traceability matrix

## 1. Traceability Matrix (CRITICAL)

### Matrix Exists

- [ ] "Traceability Matrix" section present
- [ ] Table format with columns: Requirement | Epic | Stories | Status

### Coverage

- [ ] Every PR from Constitution appears in matrix (for system epics)
- [ ] Every IC from Constitution appears in matrix (for system epics)
- [ ] Every FR from domain PRD appears in matrix (for domain epics)
- [ ] No orphaned requirements (requirements without stories)
- [ ] No orphaned stories (stories without requirements)

### Accuracy

- [ ] Story references match actual story IDs
- [ ] Status reflects current reality (Complete, In Progress, Planned)
- [ ] Epic numbers are sequential and consistent

## 2. Epic Quality

### Structure

- [ ] Each Epic has clear goal statement
- [ ] Each Epic has value proposition
- [ ] Each Epic has defined scope

### Sequencing

- [ ] Foundation/infrastructure epics come first
- [ ] No forward dependencies (Epic N doesn't need Epic N+1)
- [ ] Cross-team dependencies identified

## 3. Story Quality

### Format

- [ ] User Story format: "As a... I want... So that..."
- [ ] Each story has numbered Acceptance Criteria
- [ ] Each story is a vertical slice (end-to-end value)

### Sizing

- [ ] Stories are sprint-sized (can complete in one sprint)
- [ ] Large stories broken into smaller ones
- [ ] No "mega-stories" spanning multiple sprints

### Traceability

- [ ] Each story links to at least one requirement (FR/PR/IC)
- [ ] Requirement type noted (FR-xxx, PR-xxx, or IC-xxx)
- [ ] Cross-cutting PRs mentioned where relevant

## 4. PR/IC Coverage (for System Epics)

### Platform Requirements

- [ ] PR-001 (RLS/Multi-tenancy) covered by at least one story
- [ ] PR-002 (Event emission) covered
- [ ] PR-003 (Auth required) covered
- [ ] PR-005 (Permissions) covered
- [ ] PR-006 (Audit logging) covered
- [ ] PR-007 (Error boundaries) covered

### Integration Contracts

- [ ] IC-001 (Event envelope) covered
- [ ] IC-002 (Event naming) covered
- [ ] IC-003 (Module registration) covered

## 5. Completeness

- [ ] All planned epics have at least story placeholders
- [ ] Completed epics have all stories resolved
- [ ] Blocked items identified with blockers noted

---

## Validation Summary

| Category       | Items  | Passed | Percentage |
| -------------- | ------ | ------ | ---------- |
| Matrix         | 8      | ?      | ?%         |
| Epic Quality   | 6      | ?      | ?%         |
| Story Quality  | 8      | ?      | ?%         |
| PR/IC Coverage | 9      | ?      | ?%         |
| Completeness   | 3      | ?      | ?%         |
| **Total**      | **34** | **?**  | **?%**     |

**Minimum to pass:** 80% (27/34 items)

---

## Traceability Matrix Template

If the matrix is missing, add this template:

```markdown
## Traceability Matrix

| Requirement | Epic | Stories  | Status   |
| ----------- | ---- | -------- | -------- |
| PR-001      | 1    | 1.2      | Complete |
| PR-002      | 1    | 1.2, 1.6 | Complete |
| PR-003      | 1    | 1.3      | Complete |
| IC-001      | 1    | 1.2      | Complete |
| IC-002      | 1    | 1.2      | Complete |
| FR-XXX-001  | 2    | 2.1      | Planned  |
```
