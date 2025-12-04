# Validate Story - Quality Checklist

```xml
<critical>This checklist validates the validate-story workflow executed correctly</critical>

<validation-checklist>

## Workflow Execution Validation

### 1. Story Discovery
- [ ] Correct story file was identified (drafted status)
- [ ] Story key parsed correctly (epic_num, story_num, story_title)
- [ ] All source documents discovered and loaded

### 2. Previous Story Continuity
- [ ] Previous story identified (or confirmed first in sequence)
- [ ] Previous story content extracted if applicable
- [ ] Continuity requirements correctly assessed

### 3. Source Document Coverage
- [ ] All available source docs catalogued
- [ ] Citation check performed for each relevant doc
- [ ] Citation validity verified (paths exist)

### 4. Acceptance Criteria Validation
- [ ] ACs extracted and counted
- [ ] Source comparison performed (tech spec or epics)
- [ ] Quality assessment completed (testable, specific, atomic)

### 5. Task-AC Mapping
- [ ] All ACs have mapped tasks
- [ ] Orphan tasks identified
- [ ] Testing subtask coverage assessed

### 6. Dev Notes Quality
- [ ] Required subsections checked
- [ ] Specificity validated (no generic advice)
- [ ] Invented details scan performed

### 7. Structure Validation
- [ ] Status field correct
- [ ] Story statement format valid
- [ ] Dev Agent Record sections present
- [ ] File location correct

### 8. Outcome Calculation
- [ ] Issue counts calculated correctly
- [ ] Threshold comparison performed
- [ ] Outcome determined (PASS/PASS_WITH_ISSUES/FAIL)

### 9. Report Generation
- [ ] Validation report generated (if enabled)
- [ ] Results communicated to user
- [ ] Next steps provided

## Severity Reference

| Severity | Description | Examples |
|----------|-------------|----------|
| **CRITICAL** | Blocks development | Missing tech spec citation, no ACs, unresolved review items |
| **MAJOR** | Should fix before dev | Missing arch citations, AC mismatch, generic Dev Notes |
| **MINOR** | Nice to fix | Few citations, orphan tasks, missing Change Log |

## Outcome Thresholds

| Outcome | Criteria |
|---------|----------|
| **PASS** | 0 critical, 0 major, any minor |
| **PASS_WITH_ISSUES** | 0 critical, 1-3 major |
| **FAIL** | Any critical OR >3 major |

</validation-checklist>
```
