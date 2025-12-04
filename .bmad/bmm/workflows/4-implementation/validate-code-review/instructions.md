# Validate Code Review - Workflow Instructions

````xml
<critical>The workflow execution engine is governed by: {project-root}/.bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>Generate all documents in {document_output_language}</critical>
<critical>This workflow validates that a code review was THOROUGH and COMPLETE.</critical>
<critical>A valid review must: validate ALL ACs with evidence, verify ALL completed tasks, provide actionable items.</critical>

<workflow>

  <step n="0.5" goal="Establish module context">
    <action>Check if {{module}} is already set (inherited from agent session context)</action>
    <check if="module is empty">
      <action>Load {{manifest_file}} and present module list</action>
      <action>Wait for user selection</action>
    </check>
    <action>Parse {{module}} and update path variables</action>
  </step>

  <step n="1" goal="Find story with review to validate">
    <check if="{{story_file}} is provided">
      <action>Use {{story_file}} directly</action>
      <action>Read COMPLETE story file</action>
      <goto>validate_review</goto>
    </check>

    <action>Load {{sprint_status}}</action>
    <action>Find stories with status "review" or "done" (states where review should exist)</action>

    <action>For each candidate story, check if "Senior Developer Review (AI)" section exists</action>

    <check if="no stories with review section found">
      <output>📋 No stories found with code review sections

**Options:**
1. Run `code-review` on a completed story first
2. Specify a story file path directly
      </output>
      <action>HALT</action>
    </check>

    <check if="multiple stories with reviews found">
      <output>📋 Multiple stories have reviews:

{{list_stories_with_review_dates}}

Select story to validate (number):
      </output>
      <action>Wait for user selection</action>
    </check>

    <action>Load selected story file</action>

    <anchor id="validate_review" />
  </step>

  <step n="2" goal="Parse review section">
    <action>Extract "Senior Developer Review (AI)" section</action>

    <check if="section not found">
      <output>❌ No "Senior Developer Review (AI)" section found in story

This story has not been reviewed yet. Run `code-review` first.
      </output>
      <action>HALT</action>
    </check>

    <action>Parse review subsections:
      - Reviewer
      - Date
      - Outcome (Approve/Changes Requested/Blocked)
      - Summary
      - Key Findings (by severity)
      - Acceptance Criteria Coverage (table)
      - Task Completion Validation (table)
      - Test Coverage and Gaps
      - Architectural Alignment
      - Security Notes
      - Best-Practices and References
      - Action Items (with checkboxes)
    </action>

    <action>Initialize validation results:
      - missing_sections: []
      - quality_issues: []
      - evidence_issues: []
      - coverage_issues: []
    </action>
  </step>

  <step n="3" goal="Validate review structure completeness">
    <action>Check required sections present:
      - Summary → if missing: add to missing_sections
      - Outcome → if missing: add to missing_sections (CRITICAL)
      - Key Findings → if missing: add to missing_sections
      - Acceptance Criteria Coverage → if missing: add to missing_sections (CRITICAL if require_ac_coverage)
      - Task Completion Validation → if missing: add to missing_sections (CRITICAL if require_task_verification)
      - Action Items → if missing AND outcome != Approve: add to missing_sections
    </action>

    <action>Check optional sections (note if missing but don't fail):
      - Test Coverage and Gaps
      - Architectural Alignment
      - Security Notes
      - Best-Practices and References
    </action>
  </step>

  <step n="4" goal="Validate AC coverage">
    <check if="require_ac_coverage == true">
      <action>Extract Acceptance Criteria from story (before review section)</action>
      <action>Count total ACs: {{total_ac_count}}</action>

      <action>Extract AC Coverage table from review</action>
      <action>Count ACs validated in table: {{validated_ac_count}}</action>

      <action>Calculate coverage: {{validated_ac_count}} / {{total_ac_count}} * 100</action>

      <check if="coverage < min_ac_coverage_percent">
        <action>Add to coverage_issues: "AC coverage {{coverage}}% below required {{min_ac_coverage_percent}}%"</action>
        <action>List missing ACs</action>
      </check>

      <action>For each AC in coverage table:
        1. Check Status column (IMPLEMENTED/PARTIAL/MISSING)
        2. Check Evidence column for file:line references
      </action>

      <check if="require_evidence == true">
        <action>Count ACs with file:line evidence</action>
        <check if="ACs without evidence found">
          <action>Add to evidence_issues: "{{count}} ACs lack file:line evidence"</action>
        </check>
      </check>
    </check>
  </step>

  <step n="5" goal="Validate task verification">
    <check if="require_task_verification == true">
      <action>Extract completed tasks from story ([x] items)</action>
      <action>Count total completed tasks: {{total_task_count}}</action>

      <action>Extract Task Completion Validation table from review</action>
      <action>Count tasks verified: {{verified_task_count}}</action>

      <action>Calculate coverage: {{verified_task_count}} / {{total_task_count}} * 100</action>

      <check if="coverage < min_task_verification_percent">
        <action>Add to coverage_issues: "Task verification {{coverage}}% below required {{min_task_verification_percent}}%"</action>
      </check>

      <action>Check for "falsely marked complete" findings:
        - Search for tasks marked as "NOT DONE" or "QUESTIONABLE" in Verified As column
      </action>

      <check if="false completions found but not highlighted">
        <action>Add to quality_issues: "False completions found but not prominently flagged"</action>
      </check>

      <check if="require_evidence == true">
        <action>Count tasks with file:line evidence</action>
        <check if="tasks without evidence">
          <action>Add to evidence_issues: "{{count}} tasks lack verification evidence"</action>
        </check>
      </check>
    </check>
  </step>

  <step n="6" goal="Validate findings and action items">
    <action>Extract Key Findings section</action>

    <action>Check findings have severity levels (High/Med/Low)</action>
    <check if="findings without severity">
      <action>Add to quality_issues: "Findings missing severity classification"</action>
    </check>

    <action>Extract Action Items section</action>

    <check if="outcome != 'Approve' and require_action_items == true">
      <check if="no action items present">
        <action>Add to quality_issues: "Review has issues but no action items provided"</action>
      </check>
    </check>

    <action>Check action item format:
      - Has checkbox [ ] or [x]
      - Has severity tag [High]/[Med]/[Low]
      - Has file reference where applicable
    </action>

    <check if="action items poorly formatted">
      <action>Add to quality_issues: "Action items missing required format (checkboxes, severity, file refs)"</action>
    </check>

    <action>Verify action items are actionable (imperative phrasing)</action>
  </step>

  <step n="7" goal="Validate evidence quality">
    <check if="require_evidence == true">
      <action>Extract all file:line references from review</action>

      <action>Validate references exist:
        1. Parse file path
        2. Check file exists
        3. Verify line number is within file bounds
      </action>

      <check if="invalid references found">
        <action>Add to evidence_issues: "Invalid file references: {{list}}"</action>
      </check>

      <action>Check evidence density:
        - Count total claims requiring evidence (AC implementations, task completions)
        - Count claims with evidence
        - Calculate evidence rate
      </action>

      <check if="evidence rate < 80%">
        <action>Add to evidence_issues: "Low evidence density ({{rate}}%) - review may be superficial"</action>
      </check>
    </check>
  </step>

  <step n="8" goal="Calculate validation outcome">
    <action>Categorize issues:
      - critical_issues: missing required sections, <100% AC/task coverage
      - major_issues: missing evidence, poor formatting, missing action items
      - minor_issues: optional sections missing, low evidence density
    </action>

    <action>Determine outcome:
      - Any critical issues → FAIL (review is incomplete)
      - Major issues only → PASS_WITH_ISSUES (review has quality problems)
      - No issues → PASS (review meets standards)
    </action>
  </step>

  <step n="9" goal="Generate report and communicate results">
    <check if="generate_report == true">
      <action>Generate validation report:
```markdown
# Code Review Validation Report

**Story:** {{story_key}}
**Review Date:** {{review_date}}
**Validated:** {{date}}
**Outcome:** {{outcome}}

## Review Completeness

| Criterion | Status | Details |
|-----------|--------|---------|
| AC Coverage | {{ac_coverage}}% | {{ac_details}} |
| Task Verification | {{task_coverage}}% | {{task_details}} |
| Evidence Quality | {{evidence_rate}}% | {{evidence_details}} |
| Action Items | {{action_item_status}} | {{action_details}} |

## Issues Found

### Critical
{{critical_issues_list}}

### Major
{{major_issues_list}}

### Minor
{{minor_issues_list}}

## Recommendations
{{recommendations}}
````

      </action>
      <action>Save to {{story_dir}}/{{story_key}}.review-validation.md</action>
    </check>

    <output>**📋 Code Review Validation Complete, {user_name}!**

**Story:** {{story_key}}
**Review Outcome:** {{review_outcome}}
**Validation Outcome:** {{validation_outcome}}

**Review Quality:**

- AC Coverage: {{ac_coverage}}%
- Task Verification: {{task_coverage}}%
- Evidence Quality: {{evidence_rate}}%

{{issues_summary}}

**Recommendations:**
{{recommendations}}
</output>

    <check if="outcome == FAIL">
      <output>

❌ Review does not meet quality standards.

**Required Actions:**

1. Re-run `code-review` with more thorough validation
2. Ensure ALL ACs are validated with file:line evidence
3. Verify ALL completed tasks were actually done

The review should be re-done before proceeding.
</output>
</check>

    <check if="outcome == PASS_WITH_ISSUES">
      <output>

⚠️ Review has quality issues but is usable.

Consider improving:
{{issues_to_improve}}
</output>
</check>

    <check if="outcome == PASS">
      <output>

✅ Review meets all quality standards!

The review is thorough and complete.
</output>
</check>
</step>

</workflow>
```
