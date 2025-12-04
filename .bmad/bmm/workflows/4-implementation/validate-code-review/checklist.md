# Validate Code Review - Quality Checklist

```xml
<critical>This checklist validates the validate-code-review workflow executed correctly</critical>

<validation-checklist>

## Workflow Execution Validation

### 1. Story and Review Discovery
- [ ] Story with review section identified
- [ ] Review section parsed completely
- [ ] All subsections extracted

### 2. Structure Completeness
- [ ] Required sections checked
- [ ] Optional sections noted
- [ ] Missing sections catalogued

### 3. AC Coverage Validation
- [ ] Total ACs counted from story
- [ ] Validated ACs counted from review
- [ ] Coverage percentage calculated
- [ ] Evidence quality checked for each AC

### 4. Task Verification Validation
- [ ] Completed tasks counted from story
- [ ] Verified tasks counted from review
- [ ] Coverage percentage calculated
- [ ] False completions detection verified

### 5. Findings and Action Items
- [ ] Findings have severity levels
- [ ] Action items present (if issues found)
- [ ] Action items properly formatted
- [ ] Checkboxes present for tracking

### 6. Evidence Quality
- [ ] File references validated
- [ ] Line numbers within bounds
- [ ] Evidence density calculated

### 7. Outcome Calculation
- [ ] Issues categorized by severity
- [ ] Outcome determined correctly
- [ ] Report generated (if enabled)

## Review Quality Standards

| Standard | Requirement |
|----------|-------------|
| **AC Coverage** | 100% of ACs validated |
| **Task Verification** | 100% of completed tasks verified |
| **Evidence** | file:line for implementations |
| **Action Items** | Checkboxes + severity + file refs |
| **False Completions** | Prominently highlighted |

## Outcome Criteria

| Outcome | Criteria |
|---------|----------|
| **PASS** | Full coverage, good evidence, complete structure |
| **PASS_WITH_ISSUES** | Coverage met but quality issues |
| **FAIL** | Missing coverage or critical sections |

</validation-checklist>
```
