# Validate Story - Workflow Instructions

````xml
<critical>The workflow execution engine is governed by: {project-root}/.bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>Generate all documents in {document_output_language}</critical>
<critical>This workflow validates a drafted story meets quality standards BEFORE development begins.</critical>
<critical>This is a READ-ONLY validation workflow - it does NOT modify the story unless auto_improve is enabled.</critical>

<workflow>

  <step n="0.5" goal="Establish module context">
    <critical>MODULE ISOLATION: Validation must be scoped to a specific module</critical>

    <action>Check if {{module}} is already set (inherited from agent session context):
      - If set: Use inherited value (format: category/module-name, e.g., "platform/core-api")
      - If empty: Proceed to elicit from user
    </action>

    <check if="module is empty">
      <action>Load {{manifest_file}} to get available modules</action>
      <action>Present numbered list of modules to user</action>
      <action>Wait for user input and validate against manifest modules</action>
      <action>Set {{module}} = selected module path</action>
    </check>

    <action>Parse {{module}} to extract {{current_category}} and {{current_module}}</action>
    <action>Update path variables to module scope</action>
  </step>

  <step n="1" goal="Find story to validate" tag="sprint-status">
    <check if="{{story_file}} is provided">
      <action>Use {{story_file}} directly</action>
      <action>Read COMPLETE story file</action>
      <action>Extract story_key from filename or metadata</action>
      <goto>validate_start</goto>
    </check>

    <critical>MUST read COMPLETE sprint-status.yaml file</critical>
    <action>Load the FULL file: {{sprint_status}}</action>
    <action>Parse the development_status section completely</action>

    <action>Find the FIRST story (by reading in order from top to bottom) where:
      - Key matches pattern: number-number-name (e.g., "1-2-user-auth")
      - NOT an epic key or retrospective
      - Status value equals "drafted"
    </action>

    <check if="no drafted story found">
      <output>📋 No drafted stories found in sprint-status.yaml

All stories are either:
- Not yet drafted (run `create-story` first)
- Already validated and ready for dev
- In progress or completed

**Options:**
1. Run `create-story` to draft the next story
2. Specify a story file path directly
3. Check sprint-status.yaml to see current states
      </output>
      <action>HALT</action>
    </check>

    <action>Store the found story_key</action>
    <action>Find matching story file in {{story_dir}}</action>
    <action>Read COMPLETE story file</action>

    <anchor id="validate_start" />
  </step>

  <step n="1.5" goal="Discover and load source documents">
    <invoke-protocol name="discover_inputs" />
    <note>After discovery: {epics_content}, {tech_spec_content}, {architecture_content}, {prd_content}</note>
  </step>

  <step n="2" goal="Extract story metadata and parse sections">
    <action>Parse story sections:
      - Status (should be "drafted")
      - Story statement (As a / I want / so that)
      - Acceptance Criteria (numbered list)
      - Tasks/Subtasks (with checkboxes)
      - Dev Notes (with subsections)
      - Dev Agent Record (Context Reference, etc.)
      - Change Log
    </action>

    <action>Extract from story key:
      - epic_num: first number
      - story_num: second number
      - story_title: remainder
    </action>

    <action>Initialize validation results:
      - critical_issues: []
      - major_issues: []
      - minor_issues: []
      - successes: []
    </action>
  </step>

  <step n="3" goal="Validate previous story continuity">
    <action>Find previous story in sprint-status.yaml (row immediately above current story)</action>

    <check if="previous story exists with status done/review/in-progress">
      <action>Load previous story file: {{story_dir}}/{{previous_story_key}}.md</action>
      <action>Extract Dev Agent Record sections:
        - Completion Notes List
        - File List (NEW/MODIFIED files)
        - Debug Log References
      </action>
      <action>Check for Senior Developer Review section</action>
      <action>Count unchecked [ ] items in Review Action Items</action>

      <action>Validate current story has "Learnings from Previous Story" subsection in Dev Notes</action>
      <check if="subsection MISSING">
        <action>Add to critical_issues: "Missing 'Learnings from Previous Story' subsection - previous story has dev context"</action>
      </check>

      <check if="subsection EXISTS">
        <action>Verify it references:
          - NEW files from previous story
          - Completion notes/warnings
          - Unresolved review items (if any)
        </action>
        <check if="missing references">
          <action>Add to major_issues: "Learnings subsection incomplete - missing [specific items]"</action>
        </check>
      </check>

      <check if="previous story has unchecked review items">
        <action>Verify current story acknowledges them</action>
        <check if="not acknowledged">
          <action>Add to critical_issues: "Previous story has {{count}} unresolved review items not addressed"</action>
        </check>
      </check>
    </check>

    <check if="previous story is backlog/drafted or doesn't exist">
      <action>Add to successes: "First story in sequence or previous not yet implemented - no continuity required"</action>
    </check>
  </step>

  <step n="4" goal="Validate source document coverage">
    <action>Build list of available source documents found in step 1.5</action>

    <check if="tech_spec exists for this epic">
      <action>Search story Dev Notes for tech spec citation</action>
      <check if="not cited">
        <action>Add to critical_issues: "Tech spec exists but not cited in story"</action>
      </check>
    </check>

    <check if="epics_content exists">
      <action>Search story for epics citation</action>
      <check if="not cited">
        <action>Add to critical_issues: "Epics document exists but not cited"</action>
      </check>
    </check>

    <check if="architecture_content exists">
      <action>Assess relevance to this story's scope</action>
      <check if="relevant but not cited">
        <action>Add to major_issues: "Architecture document relevant but not cited"</action>
      </check>
    </check>

    <action>Count total citations in Dev Notes References subsection</action>
    <check if="citations < 3 and multiple source docs exist">
      <action>Add to minor_issues: "Few citations despite multiple available source documents"</action>
    </check>

    <action>Verify cited file paths actually exist</action>
    <check if="invalid citations found">
      <action>Add to major_issues: "Invalid citation paths: [list]"</action>
    </check>
  </step>

  <step n="5" goal="Validate acceptance criteria quality">
    <action>Extract Acceptance Criteria list from story</action>
    <action>Count ACs: {{ac_count}}</action>

    <check if="ac_count == 0">
      <action>Add to critical_issues: "No acceptance criteria defined"</action>
      <action>Skip remaining AC validation</action>
    </check>

    <check if="tech_spec exists">
      <action>Load tech spec and find ACs for this story</action>
      <action>Compare story ACs vs tech spec ACs</action>
      <check if="mismatch without justification">
        <action>Add to major_issues: "ACs don't match tech spec - [details]"</action>
      </check>
    </check>

    <check if="no tech_spec but epics exists">
      <action>Load epics and find this story</action>
      <check if="story not in epics">
        <action>Add to critical_issues: "Story not found in epics.md"</action>
      </check>
      <action>Compare story ACs vs epic ACs</action>
      <check if="mismatch">
        <action>Add to major_issues: "ACs don't match epics - [details]"</action>
      </check>
    </check>

    <action>For each AC, check quality:
      - Is it testable (measurable outcome)?
      - Is it specific (not vague)?
      - Is it atomic (single concern)?
    </action>
    <check if="vague ACs found">
      <action>Add to minor_issues: "Vague acceptance criteria: [list]"</action>
    </check>
  </step>

  <step n="6" goal="Validate task-AC mapping">
    <action>Extract Tasks/Subtasks from story</action>

    <action>For each AC: Search tasks for "(AC: #{{ac_num}})" reference</action>
    <check if="AC has no mapped tasks">
      <action>Add to major_issues: "AC #{{ac_num}} has no mapped tasks"</action>
    </check>

    <action>For each task: Check if it references an AC</action>
    <check if="orphan tasks found (not testing/setup)">
      <action>Add to minor_issues: "Tasks without AC reference: [list]"</action>
    </check>

    <action>Count tasks with testing subtasks</action>
    <check if="testing subtasks < ac_count">
      <action>Add to major_issues: "Insufficient testing subtasks ({{test_count}} for {{ac_count}} ACs)"</action>
    </check>
  </step>

  <step n="7" goal="Validate Dev Notes quality">
    <action>Check required subsections exist:
      - Architecture patterns and constraints
      - References (with citations)
      - Project Structure Notes (if unified-project-structure.md exists)
      - Learnings from Previous Story (if previous story has content)
    </action>
    <check if="missing required subsections">
      <action>Add to major_issues: "Missing Dev Notes subsections: [list]"</action>
    </check>

    <action>Check architecture guidance specificity</action>
    <check if="generic advice like 'follow architecture docs'">
      <action>Add to major_issues: "Dev Notes contain generic advice instead of specific guidance"</action>
    </check>

    <action>Scan for suspicious specifics without citations:
      - API endpoints, schema details, business rules, tech choices
    </action>
    <check if="likely invented details found">
      <action>Add to major_issues: "Potentially invented details without citations: [list]"</action>
    </check>
  </step>

  <step n="8" goal="Validate story structure">
    <action>Check Status = "drafted"</action>
    <check if="status != drafted">
      <action>Add to major_issues: "Story status is '{{status}}' not 'drafted'"</action>
    </check>

    <action>Check Story section has "As a / I want / so that" format</action>
    <check if="malformed">
      <action>Add to major_issues: "Story statement malformed"</action>
    </check>

    <action>Check Dev Agent Record has required sections:
      - Context Reference
      - Agent Model Used
      - Debug Log References
      - Completion Notes List
      - File List
    </action>
    <check if="missing sections">
      <action>Add to major_issues: "Missing Dev Agent Record sections: [list]"</action>
    </check>

    <action>Check Change Log initialized</action>
    <check if="missing">
      <action>Add to minor_issues: "Change Log not initialized"</action>
    </check>

    <action>Verify file in correct location: {{story_dir}}/{{story_key}}.md</action>
  </step>

  <step n="9" goal="Calculate validation outcome">
    <action>Count issues by severity:
      - critical_count = len(critical_issues)
      - major_count = len(major_issues)
      - minor_count = len(minor_issues)
    </action>

    <action>Determine outcome:
      - critical_count > {{critical_threshold}} OR major_count > {{major_threshold}} → FAIL
      - major_count > 0 and major_count <= {{major_threshold}} → PASS_WITH_ISSUES
      - All counts = 0 → PASS
    </action>
  </step>

  <step n="10" goal="Generate validation report and communicate results">
    <action>Generate structured validation report:
```markdown
# Story Validation Report

**Story:** {{story_key}} - {{story_title}}
**Validated:** {{date}}
**Outcome:** {{outcome}} (Critical: {{critical_count}}, Major: {{major_count}}, Minor: {{minor_count}})

## Critical Issues (Blockers)
{{list_each_with_description_and_evidence}}

## Major Issues (Should Fix)
{{list_each_with_description_and_evidence}}

## Minor Issues (Nice to Have)
{{list_each_with_description}}

## Successes
{{list_what_was_done_well}}

## Recommendation
{{recommendation_based_on_outcome}}
````

    </action>

    <check if="generate_report == true">
      <action>Save report to {{story_dir}}/{{story_key}}.validation.md</action>
    </check>

    <output>**📋 Story Validation Complete, {user_name}!**

**Story:** {{story_key}}
**Outcome:** {{outcome}}

**Issues Found:**

- Critical: {{critical_count}}
- Major: {{major_count}}
- Minor: {{minor_count}}

{{top_3_issues_summary}}

**Next Steps:**
{{recommendations}}
</output>

    <check if="outcome == FAIL">
      <check if="auto_improve == true">
        <action>Offer to automatically improve the story</action>
        <action>Re-load source docs and regenerate affected sections</action>
        <action>Re-run validation</action>
      </check>
      <check if="auto_improve == false">
        <output>

**Options:**

1.  Run `amend-story` to fix the issues
2.  Re-run `create-story` to regenerate
3.  Fix manually and re-validate
4.  Accept as-is (not recommended)
    </output>
    </check>
    </check>

        <check if="outcome == PASS_WITH_ISSUES">
          <ask>Would you like to improve the story? (y/n)</ask>
          <check if="yes">
            <action>Enhance story with missing items</action>
            <action>Re-validate</action>
          </check>
        </check>

        <check if="outcome == PASS">
          <output>

    ✅ Story meets all quality standards!

**Ready for:** `story-ready` or `story-context` workflow
</output>
</check>
</step>

</workflow>
```
