# Amend Code - Workflow Instructions

```xml
<critical>The workflow execution engine is governed by: {project-root}/.bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>Communicate all responses in {communication_language} tailored to {user_skill_level}</critical>
<critical>Generate all documents in {document_output_language}</critical>
<critical>This workflow makes TARGETED code amendments - it does NOT replace dev-story for full implementation.</critical>
<critical>Focus on specific changes: review fixes, technical debt, bug fixes, or user-specified amendments.</critical>

<workflow>

  <step n="0.5" goal="Establish module context">
    <critical>MODULE ISOLATION: Code amendments must be scoped to a specific module</critical>

    <action>Check if {{module}} is already set (inherited from agent session context):
      - If set: Use inherited value
      - If empty: Elicit from user via manifest module list
    </action>

    <action>Parse {{module}} to extract {{current_category}} and {{current_module}}</action>
    <action>Resolve {{module_code_path}} from manifest (e.g., "services/core-api")</action>
    <action>Update path variables to module scope</action>
  </step>

  <step n="1" goal="Determine amendment source and scope">
    <check if="{{amendment_source}} is empty">
      <output>🔧 **Code Amendment Mode**

How would you like to specify the amendments?

1. **From Code Review** - Fix action items from a code review
2. **From Story Tasks** - Complete specific unchecked tasks
3. **Ad-hoc Changes** - Specify files and changes directly
4. **Technical Debt** - Address backlog technical debt items
      </output>
      <ask>Select mode (1-4):</ask>
      <action>Set {{amendment_source}} based on selection</action>
    </check>
  </step>

  <step n="2" goal="Load amendment context based on source">
    <check if="amendment_source == 'review'">
      <action>Find stories with "Senior Developer Review (AI)" section</action>
      <check if="{{review_section}} is empty">
        <action>Search {{story_dir}} for stories with review sections containing unchecked items</action>
        <check if="multiple found">
          <action>Present list to user for selection</action>
        </check>
        <check if="one found">
          <action>Use that story</action>
        </check>
        <check if="none found">
          <output>No stories found with pending review items.

**Options:**
1. Run `code-review` on a completed story first
2. Switch to ad-hoc mode
          </output>
          <action>HALT or switch mode</action>
        </check>
      </check>

      <action>Load story file</action>
      <action>Extract "Senior Developer Review (AI)" section</action>
      <action>Parse Action Items with checkboxes</action>
      <action>Filter by {{action_items_filter}}:
        - unchecked: Only [ ] items
        - high: Only [High] severity items
        - medium: [High] and [Med] items
        - all: All items regardless of state
      </action>
      <action>Store as {{pending_amendments}}</action>

      <output>📋 Found {{count}} review items to address:

{{list_items_with_severity}}

Select items to fix (comma-separated numbers, 'all', or 'q' to quit):
      </output>
      <action>Wait for user selection</action>
      <action>Store selected items as {{amendment_tasks}}</action>
    </check>

    <check if="amendment_source == 'story'">
      <action>Find story in "in-progress" or "review" status</action>
      <check if="{{story_file}} is empty">
        <action>Load sprint-status.yaml</action>
        <action>Find first story with unchecked tasks</action>
      </check>

      <action>Load story file</action>
      <action>Parse Tasks/Subtasks section</action>
      <action>Extract unchecked [ ] tasks</action>

      <output>📋 Found {{count}} unchecked tasks:

{{list_tasks}}

Select tasks to complete (comma-separated numbers, 'all', or 'q' to quit):
      </output>
      <action>Store selected as {{amendment_tasks}}</action>
    </check>

    <check if="amendment_source == 'adhoc'">
      <check if="{{target_files}} is empty">
        <ask>What files should be amended? (paths or glob patterns):</ask>
        <action>Parse input into {{target_files}} list</action>
      </check>

      <check if="{{amendment_description}} is empty">
        <ask>What changes should be made?</ask>
        <action>Store as {{amendment_description}}</action>
      </check>

      <action>Build amendment task from user input:
        - files: {{target_files}}
        - description: {{amendment_description}}
      </action>
      <action>Store as {{amendment_tasks}}</action>
    </check>

    <check if="amendment_source == 'techdebt'">
      <action>Load backlog.md from {{output_folder_resolved}}</action>
      <action>Extract open technical debt items</action>
      <action>Present to user for selection</action>
      <action>Store selected as {{amendment_tasks}}</action>
    </check>
  </step>

  <step n="2.5" goal="Load architecture and context">
    <invoke-protocol name="discover_inputs" />
    <note>Architecture and tech spec now available for implementation guidance</note>
  </step>

  <step n="3" goal="Plan amendments">
    <action>For each item in {{amendment_tasks}}:
      1. Identify affected files
      2. Understand current implementation
      3. Plan specific changes
      4. Identify test requirements
    </action>

    <action>Generate amendment plan:
```

Amendment Plan:

1. [Task/Item Description]
   - Files: [list]
   - Changes: [description]
   - Tests: [required tests]

2. [Next item...]

```
    </action>

    <ask>Proceed with this plan? (y/n/modify)</ask>
  </step>

  <step n="4" goal="Execute amendments">
    <action>For each amendment task:
      1. Read current file content
      2. Implement the specific change
      3. Follow coding standards from architecture docs
      4. Handle error cases appropriately
    </action>

    <action>Track changes made:
      - files_modified: []
      - files_created: []
      - files_deleted: []
    </action>

    <check if="implementation fails">
      <action>Log error to debug notes</action>
      <action>Ask user how to proceed:
        1. Retry with different approach
        2. Skip this item
        3. HALT workflow
      </action>
    </check>
  </step>

  <step n="5" goal="Run tests and validation">
    <check if="run_tests_after == true">
      <action>Determine test command for this repo</action>
      <action>Run affected tests</action>
      <action>Run linting/code quality checks</action>

      <check if="tests fail">
        <action>Analyze failure</action>
        <action>Attempt fix</action>
        <check if="fix fails after 2 attempts">
          <action>Report failure and ask user how to proceed</action>
        </check>
      </check>

      <check if="tests pass">
        <action>Record test success</action>
      </check>
    </check>
  </step>

  <step n="6" goal="Update story and review tracking">
    <check if="amendment_source == 'review' and update_story_on_complete == true">
      <action>Open story file</action>

      <action>For each completed review item:
        1. Find matching item in "Senior Developer Review (AI) → Action Items"
        2. Mark checkbox [x]
        3. Find matching task in "Tasks/Subtasks → Review Follow-ups (AI)" if present
        4. Mark that checkbox [x] as well
      </action>

      <action>Add to Dev Agent Record → Completion Notes:
        "✅ Resolved review finding [{{severity}}]: {{description}}"
      </action>

      <action>Update File List with modified files</action>

      <action>Add Change Log entry:
        "| {{date}} | Amendment | {{user_name}} | Fixed {{count}} review items |"
      </action>

      <action>Save story file</action>
    </check>

    <check if="amendment_source == 'story' and update_story_on_complete == true">
      <action>Open story file</action>

      <action>For each completed task:
        1. Find task in Tasks/Subtasks section
        2. Mark checkbox [x]
        3. Mark related subtasks [x]
      </action>

      <action>Update Dev Agent Record:
        - Add completion notes
        - Update File List
      </action>

      <action>Add Change Log entry</action>
      <action>Save story file</action>
    </check>

    <check if="amendment_source == 'techdebt'">
      <action>Update backlog.md:
        - Mark completed items
        - Add resolution notes
        - Update date
      </action>
    </check>
  </step>

  <step n="7" goal="Completion communication">
    <output>**✅ Code Amendment Complete, {user_name}!**

**Amendments Made:** {{count}}

**Files Modified:**
{{files_modified_list}}

**Files Created:**
{{files_created_list}}

**Tests:** {{test_status}}

**Story Updated:** {{story_update_status}}

**Next Steps:**
{{context_appropriate_next_steps}}
    </output>

    <check if="amendment_source == 'review'">
      <action>Check if all review items now resolved</action>
      <check if="all resolved">
        <output>
All review items addressed! Consider re-running `code-review` for final validation.
        </output>
      </check>
      <check if="items remaining">
        <output>
{{remaining_count}} review items still pending. Run `amend-code` again to address them.
        </output>
      </check>
    </check>
  </step>

</workflow>
```
