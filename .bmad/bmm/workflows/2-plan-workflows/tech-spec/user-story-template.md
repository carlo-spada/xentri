---
module: {{module}}
story_id: {{N}}-{{M}}-{{story_slug}}
status: draft
dependencies: []
# dependencies:
#   - module: platform/ts-schema
#     request: "Description of what you need"
#     issue: "#123"
#     status: pending  # pending | approved | rejected | implemented
---

# Story {{N}}.{{M}}: {{story_title}}

---

## User Story

As a {{user_type}},
I want {{capability}},
So that {{value_benefit}}.

---

## Acceptance Criteria

**Given** {{precondition}}
**When** {{action}}
**Then** {{expected_outcome}}

**And** {{additional_criteria}}

---

## Implementation Details

### Tasks / Subtasks

{{tasks_subtasks}}

### Technical Summary

{{technical_summary}}

### Project Structure Notes

- **Files to modify:** {{files_to_modify}}
- **Expected test locations:** {{test_locations}}
- **Estimated effort:** {{story_points}} story points ({{time_estimate}})
- **Prerequisites:** {{dependencies}}

### Key Code References

{{existing_code_references}}

---

## Context References

**Tech-Spec:** [tech-spec.md](../tech-spec.md) - Primary context document containing:

- Brownfield codebase analysis (if applicable)
- Framework and library details with versions
- Existing patterns to follow
- Integration points and dependencies
- Complete implementation guidance

**Architecture:** {{architecture_references}}

<!-- Additional context XML paths will be added here if story-context workflow is run -->

---

## Dev Agent Record

### Agent Model Used

<!-- Will be populated during dev-story execution -->

### Debug Log References

<!-- Will be populated during dev-story execution -->

### Completion Notes

<!-- Will be populated during dev-story execution -->

### Files Modified

<!-- Will be populated during dev-story execution -->

### Test Results

<!-- Will be populated during dev-story execution -->

---

## Review Notes

<!-- Will be populated during code review -->
