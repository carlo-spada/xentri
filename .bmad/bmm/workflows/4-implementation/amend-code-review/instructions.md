# Amend Code Review - Workflow Instructions

```xml
<critical>The workflow execution engine is governed by: {project-root}/.bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>Generate all documents in {document_output_language}</critical>
<critical>This workflow amends an EXISTING code review - it does NOT create a new review.</critical>
<critical>Preserve the original review content - amendments are ADDITIONS, not replacements (unless explicitly correcting).</critical>

<workflow>

  <step n="0.5" goal="Establish module context">
    <action>Check if {{module}} is already set (inherited from agent session context)</action>
    <check if="module is empty">
      <action>Load {{manifest_file}} and present module list</action>
      <action>Wait for user selection</action>
    </check>
    <action>Parse {{module}} and update path variables</action>
  </step>

  <step n="1" goal="Find story with review to amend">
    <check if="{{story_file}} is provided">
      <action>Use {{story_file}} directly</action>
      <action>Read COMPLETE story file</action>
      <goto>verify_review</goto>
    </check>

    <action>Load {{sprint_status}}</action>
    <action>Find stories with "Senior Developer Review (AI)" sections</action>

    <check if="no stories with reviews found">
      <output>📋 No stories found with code reviews

Run `code-review` first to create a review.
      </output>
      <action>HALT</action>
    </check>

    <check if="multiple stories with reviews">
      <output>📋 Stories with reviews:

{{list_with_review_dates_and_outcomes}}

Select story to amend (number):
      </output>
      <action>Wait for user selection</action>
    </check>

    <action>Load selected story file</action>

    <anchor id="verify_review" />

    <action>Verify "Senior Developer Review (AI)" section exists</action>
    <check if="section not found">
      <output>❌ No review section found. Run `code-review` first.</output>
      <action>HALT</action>
    </check>
  </step>

  <step n="2" goal="Parse existing review">
    <action>Extract complete "Senior Developer Review (AI)" section</action>

    <action>Parse review metadata:
      - Reviewer: {{original_reviewer}}
      - Date: {{original_date}}
      - Outcome: {{original_outcome}}
    </action>

    <action>Parse review content:
      - Summary
      - Key Findings (with counts by severity)
      - AC Coverage table
      - Task Verification table
      - Action Items (with checkbox states)
    </action>

    <output>📋 **Current Review Status**

**Story:** {{story_key}}
**Original Review:** {{original_date}} by {{original_reviewer}}
**Outcome:** {{original_outcome}}

**Findings:** {{high_count}} High, {{med_count}} Medium, {{low_count}} Low
**Action Items:** {{total_items}} total, {{unchecked_items}} pending

**Coverage:**
- ACs Validated: {{ac_count}}
- Tasks Verified: {{task_count}}
    </output>
  </step>

  <step n="3" goal="Determine amendment type">
    <check if="{{amendment_type}} is empty">
      <output>🔧 **What would you like to amend?**

1. **Add Findings** - Add new issues discovered
2. **Update Outcome** - Change review outcome (Approve/Changes Requested/Blocked)
3. **Add Coverage** - Add missing AC or task validation
4. **Add Action Items** - Add new action items
5. **Re-validate** - Re-check specific ACs or tasks with evidence
6. **Mark Items Complete** - Mark action items as resolved
7. **Add Notes** - Add clarifying notes to existing sections
      </output>
      <ask>Select amendment type (1-7 or multiple comma-separated):</ask>
      <action>Parse selection into {{amendment_types}} list</action>
    </check>
  </step>

  <step n="4" goal="Execute amendments - Add Findings">
    <check if="'add_findings' in amendment_types">
      <ask>Describe the new finding(s):
- What issue was found?
- Severity (High/Med/Low)?
- Related AC or file?
      </ask>

      <action>Parse findings into structured format:
        - severity: High/Med/Low
        - description: text
        - related_ac: #N (optional)
        - file_ref: path:line (optional)
      </action>

      <action>Append to Key Findings section under appropriate severity heading</action>

      <action>If finding is actionable, add to Action Items:
        - [ ] [{{severity}}] {{description}} [file: {{file_ref}}]
      </action>
    </check>
  </step>

  <step n="5" goal="Execute amendments - Update Outcome">
    <check if="'update_outcome' in amendment_types">
      <output>Current outcome: **{{original_outcome}}**

New outcome options:
1. Approve - All issues resolved, ready to proceed
2. Changes Requested - Issues found, code needs fixes
3. Blocked - Critical issues prevent progress
      </output>
      <ask>Select new outcome (1-3):</ask>

      <action>Update Outcome in review section</action>

      <action>Add amendment note:
```

**Amendment ({{date}}):** Outcome changed from {{original_outcome}} to {{new_outcome}} by {{user_name}}. Reason: {{reason}}

```
      </action>

      <check if="update_sprint_status == true">
        <action>Update sprint-status.yaml based on new outcome:
          - Approve → status = "done"
          - Changes Requested → status = "in-progress"
          - Blocked → status = "review"
        </action>
      </check>
    </check>
  </step>

  <step n="6" goal="Execute amendments - Add Coverage">
    <check if="'add_coverage' in amendment_types">
      <output>**Add validation coverage:**

1. Add AC validation (missing AC coverage)
2. Add task verification (missing task verification)
      </output>
      <ask>What coverage to add?</ask>

      <check if="adding AC coverage">
        <action>List ACs not in current coverage table</action>
        <ask>Which AC(s) to validate? Provide evidence for each:</ask>

        <action>For each AC:
          1. Validate implementation in code
          2. Gather file:line evidence
          3. Determine status (IMPLEMENTED/PARTIAL/MISSING)
        </action>

        <action>Add rows to AC Coverage table</action>
      </check>

      <check if="adding task verification">
        <action>List tasks not in verification table</action>
        <ask>Which task(s) to verify?</ask>

        <action>For each task:
          1. Verify implementation in code
          2. Gather file:line evidence
          3. Determine status (VERIFIED/QUESTIONABLE/NOT DONE)
        </action>

        <action>Add rows to Task Verification table</action>
      </check>
    </check>
  </step>

  <step n="7" goal="Execute amendments - Add Action Items">
    <check if="'add_action_items' in amendment_types">
      <ask>Describe the action item(s):
- What needs to be done?
- Severity (High/Med/Low)?
- Related AC or file?
      </ask>

      <action>Format as action item:
        - [ ] [{{severity}}] {{description}} (AC #{{ac_num}}) [file: {{file_ref}}]
      </action>

      <action>Add to Action Items section under "Code Changes Required"</action>
    </check>
  </step>

  <step n="8" goal="Execute amendments - Re-validate">
    <check if="'revalidate' in amendment_types">
      <ask>What to re-validate?
1. Specific AC numbers
2. Specific task descriptions
3. Files (will find related ACs/tasks)
      </ask>

      <check if="re-validating ACs">
        <action>For each AC:
          1. Re-read implementation code
          2. Gather fresh evidence
          3. Update Status and Evidence in table
          4. Add note: "(Re-validated {{date}})"
        </action>
      </check>

      <check if="re-validating tasks">
        <action>For each task:
          1. Re-check implementation
          2. Gather fresh evidence
          3. Update Verified As and Evidence in table
          4. Add note: "(Re-verified {{date}})"
        </action>
      </check>
    </check>
  </step>

  <step n="9" goal="Execute amendments - Mark Items Complete">
    <check if="'mark_complete' in amendment_types">
      <action>List unchecked action items:
```

1. [ ] [High] Add input validation...
2. [ ] [Med] Add unit test...
       ...

````
      </action>
      <ask>Which items to mark complete? (numbers, comma-separated):</ask>

      <action>For each selected item:
        1. Change [ ] to [x]
        2. Add resolution note if provided
      </action>
    </check>
  </step>

  <step n="10" goal="Execute amendments - Add Notes">
    <check if="'add_notes' in amendment_types">
      <ask>Which section to add notes to?
1. Summary
2. Architectural Alignment
3. Security Notes
4. Best-Practices and References
5. Other (specify)
      </ask>

      <ask>Notes to add:</ask>

      <action>Append notes to selected section with date stamp</action>
    </check>
  </step>

  <step n="11" goal="Update amendment metadata and save">
    <action>Add Amendment Log entry to review section:
```markdown
---
**Amendment Log:**
| Date | Amended By | Changes |
|------|------------|---------|
| {{date}} | {{user_name}} | {{amendment_summary}} |
````

    </action>

    <action>Update story Change Log:

```
| {{date}} | Review Amendment | {{user_name}} | {{brief_summary}} |
```

    </action>

    <action>Save story file</action>

  </step>

  <step n="12" goal="Optionally run validation">
    <ask>Run review validation to check completeness? (y/n)</ask>

    <check if="yes">
      <action>Invoke validate-code-review workflow</action>
      <action>Report validation results</action>
    </check>

  </step>

  <step n="13" goal="Completion communication">
    <output>**✅ Code Review Amendment Complete, {user_name}!**

**Story:** {{story_key}}
**Amendments Made:**
{{amendment_list}}

**Current Review Status:**

- Outcome: {{current_outcome}}
- Action Items: {{pending_count}} pending
- Coverage: ACs {{ac_percent}}%, Tasks {{task_percent}}%

**Sprint Status:** {{sprint_status_update}}

**Next Steps:**
{{context_appropriate_recommendations}}
</output>
</step>

</workflow>
```
