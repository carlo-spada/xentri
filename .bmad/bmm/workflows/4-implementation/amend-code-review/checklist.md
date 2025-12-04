# Amend Code Review - Quality Checklist

```xml
<critical>This checklist validates the amend-code-review workflow executed correctly</critical>

<validation-checklist>

## Workflow Execution Validation

### 1. Review Discovery
- [ ] Story with review section identified
- [ ] Review parsed completely
- [ ] Original metadata preserved

### 2. Amendment Type Selection
- [ ] Amendment type(s) determined
- [ ] User confirmed amendment scope

### 3. Add Findings (if applicable)
- [ ] Findings have severity levels
- [ ] Related AC/file references included
- [ ] Action items added for actionable findings

### 4. Update Outcome (if applicable)
- [ ] New outcome selected and applied
- [ ] Reason documented
- [ ] Sprint status updated

### 5. Add Coverage (if applicable)
- [ ] ACs/tasks validated with evidence
- [ ] Tables updated with new rows
- [ ] File:line references provided

### 6. Add Action Items (if applicable)
- [ ] Items properly formatted
- [ ] Checkboxes included
- [ ] Severity and file refs included

### 7. Re-validate (if applicable)
- [ ] Fresh evidence gathered
- [ ] Tables updated
- [ ] Re-validation noted with date

### 8. Mark Complete (if applicable)
- [ ] Checkboxes changed [ ] → [x]
- [ ] Resolution notes added (optional)

### 9. Add Notes (if applicable)
- [ ] Notes added to correct section
- [ ] Date stamped

### 10. Metadata Updates
- [ ] Amendment Log added/updated
- [ ] Story Change Log updated
- [ ] File saved

## Amendment Quality Criteria

| Criterion | Requirement |
|-----------|-------------|
| **Preservation** | Original review content preserved |
| **Traceability** | All amendments logged with date/author |
| **Completeness** | All selected amendments executed |
| **Evidence** | New validations have file:line refs |
| **Formatting** | Consistent with original review format |

## Amendment Types Reference

| Type | Purpose | Updates |
|------|---------|---------|
| add_findings | New issues found | Key Findings, Action Items |
| update_outcome | Change review result | Outcome, Sprint Status |
| add_coverage | Missing validation | AC/Task tables |
| add_action_items | New required actions | Action Items |
| revalidate | Re-check with evidence | AC/Task tables |
| mark_complete | Resolve action items | Checkboxes |
| add_notes | Clarify sections | Various sections |

</validation-checklist>
```
