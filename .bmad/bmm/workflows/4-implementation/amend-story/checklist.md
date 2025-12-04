# Amend Story - Quality Checklist

```xml
<critical>This checklist validates the amend-story workflow executed correctly</critical>

<validation-checklist>

## Workflow Execution Validation

### 1. Story Selection
- [ ] Correct story identified (drafted status)
- [ ] Story file loaded completely
- [ ] Story key extracted correctly

### 2. Context Loading
- [ ] Source documents discovered and loaded
- [ ] Validation report loaded (if exists)
- [ ] Amendment scope determined

### 3. Amendment Planning
- [ ] Clear amendment plan created
- [ ] User confirmed plan before execution
- [ ] Preservation strategy defined (what to keep)

### 4. Acceptance Criteria Amendments
- [ ] ACs match source documents (if AC amendment)
- [ ] New ACs are testable, specific, atomic
- [ ] Citations added for AC sources

### 5. Task/Subtask Amendments
- [ ] All ACs have mapped tasks
- [ ] AC references added to tasks (AC: #X)
- [ ] Testing subtasks present

### 6. Dev Notes Amendments
- [ ] Missing citations added
- [ ] Specific guidance (not generic)
- [ ] Previous story learnings captured (if applicable)

### 7. Structure Validation
- [ ] All required sections present
- [ ] Story statement format correct
- [ ] Dev Agent Record complete

### 8. Change Log
- [ ] Amendment recorded in Change Log
- [ ] Date, author, and summary included

### 9. File Handling
- [ ] Story saved to correct location
- [ ] Old validation report handled

## Amendment Quality Criteria

| Criterion | Requirement |
|-----------|-------------|
| **Source Alignment** | All changes grounded in source docs |
| **Minimal Changes** | Only modified what needed changing |
| **Preserved Context** | Existing valid content retained |
| **Citations Added** | New claims have citations |
| **Traceability** | Changes documented in Change Log |

</validation-checklist>
```
