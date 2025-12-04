# Amend Code - Quality Checklist

```xml
<critical>This checklist validates the amend-code workflow executed correctly</critical>

<validation-checklist>

## Workflow Execution Validation

### 1. Amendment Source
- [ ] Amendment source determined (review/story/adhoc/techdebt)
- [ ] Correct context loaded for source type
- [ ] Amendment tasks identified and confirmed

### 2. Planning
- [ ] All affected files identified
- [ ] Changes clearly described
- [ ] Test requirements understood
- [ ] User confirmed plan

### 3. Implementation
- [ ] Changes implemented per plan
- [ ] Coding standards followed
- [ ] Error handling appropriate
- [ ] Files tracked (modified/created/deleted)

### 4. Testing
- [ ] Tests run (if enabled)
- [ ] All tests pass
- [ ] Linting/quality checks pass
- [ ] No regressions introduced

### 5. Story/Review Update
- [ ] Relevant checkboxes marked [x]
- [ ] Completion notes added
- [ ] File List updated
- [ ] Change Log entry added

### 6. Backlog Update (if techdebt)
- [ ] Backlog items marked complete
- [ ] Resolution notes added

## Amendment Quality Criteria

| Criterion | Requirement |
|-----------|-------------|
| **Focused Changes** | Only modified what was needed |
| **Standards Compliance** | Follows architecture/coding standards |
| **Test Coverage** | Changes have tests |
| **Documentation** | Updates tracked in story/backlog |
| **No Regressions** | Existing tests still pass |

## Common Issues to Avoid

- [ ] Scope creep (changing more than needed)
- [ ] Missing test updates
- [ ] Forgetting to mark checkboxes in story
- [ ] Not updating File List
- [ ] Breaking existing functionality

</validation-checklist>
```
