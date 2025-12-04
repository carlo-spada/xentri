# Amend Story - Workflow Instructions

```xml
<critical>The workflow execution engine is governed by: {project-root}/.bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>Generate all documents in {document_output_language}</critical>
<critical>This workflow amends a DRAFTED story - it should NOT be used for stories already in development.</critical>
<critical>Preserve existing content where possible - only modify what needs to change.</critical>

<workflow>

  <step n="0.5" goal="Establish module context">
    <critical>MODULE ISOLATION: Amendment must be scoped to a specific module</critical>

    <action>Check if {{module}} is already set (inherited from agent session context):
      - If set: Use inherited value
      - If empty: Elicit from user via manifest module list
    </action>

    <action>Parse {{module}} to extract {{current_category}} and {{current_module}}</action>
    <action>Update path variables to module scope</action>
  </step>

  <step n="1" goal="Find story to amend" tag="sprint-status">
    <check if="{{story_file}} is provided">
      <action>Use {{story_file}} directly</action>
      <action>Read COMPLETE story file</action>
      <action>Extract story_key from filename or metadata</action>
      <goto>load_context</goto>
    </check>

    <critical>MUST read COMPLETE sprint-status.yaml file</critical>
    <action>Load the FULL file: {{sprint_status}}</action>
    <action>Parse development_status section</action>

    <action>Find stories with status "drafted" (amendable state)</action>

    <check if="multiple drafted stories found">
      <action>Present numbered list to user:
```

📝 Multiple drafted stories available for amendment:

1. {{story_key_1}} - {{story_title_1}}
2. {{story_key_2}} - {{story_title_2}}
   ...

Enter number to select story:

```
      </action>
      <action>Wait for user selection</action>
    </check>

    <check if="one drafted story found">
      <action>Use that story</action>
    </check>

    <check if="no drafted stories found">
      <output>📋 No drafted stories available for amendment

Stories must be in "drafted" status to be amended.

**Current story states:**
{{list_story_statuses}}

**Options:**
1. Run `create-story` to draft a new story
2. If a story is "ready-for-dev", it should be developed, not amended
3. If a story is "in-progress", use `correct-course` instead
      </output>
      <action>HALT</action>
    </check>

    <action>Find matching story file in {{story_dir}}</action>
    <action>Read COMPLETE story file</action>

    <anchor id="load_context" />
  </step>

  <step n="1.5" goal="Discover and load source documents">
    <invoke-protocol name="discover_inputs" />
    <note>After discovery: {epics_content}, {tech_spec_content}, {architecture_content}, {prd_content}</note>
  </step>

  <step n="2" goal="Load validation report if available">
    <action>Check for validation report at: {{story_dir}}/{{story_key}}.validation.md</action>

    <check if="validation report exists">
      <action>Read validation report</action>
      <action>Extract issues by severity:
        - critical_issues: []
        - major_issues: []
        - minor_issues: []
      </action>
      <output>📋 Found validation report with issues to address:

**Critical:** {{critical_count}}
**Major:** {{major_count}}
**Minor:** {{minor_count}}

Would you like to:
1. Fix all issues from validation report
2. Select specific issues to fix
3. Make different changes (ignore validation report)
      </output>
      <action>Store user choice as {{amendment_mode}}</action>
    </check>

    <check if="no validation report">
      <output>📋 No validation report found for {{story_key}}

What would you like to amend?
1. Acceptance Criteria
2. Tasks/Subtasks
3. Dev Notes
4. Story statement
5. Add missing source citations
6. Update from latest source documents
7. Other (describe changes)
      </output>
      <action>Wait for user input</action>
      <action>Store selection as {{amendment_targets}}</action>
    </check>
  </step>

  <step n="3" goal="Plan amendments">
    <action>Based on {{amendment_mode}} or {{amendment_targets}}, build amendment plan:
```

Amendment Plan for {{story_key}}:

1. [Section] - [Change Description]
2. [Section] - [Change Description]
   ...

Sections to preserve unchanged:

- [List]

````
    </action>

    <check if="amendment_scope == 'full'">
      <action>Plan to regenerate affected sections from source documents</action>
    </check>

    <check if="amendment_scope == 'targeted'">
      <action>Plan minimal changes to fix specific issues</action>
    </check>

    <ask>Proceed with this amendment plan? (y/n/modify)</ask>
    <check if="modify">
      <action>Adjust plan based on user feedback</action>
    </check>
  </step>

  <step n="4" goal="Execute amendments - Acceptance Criteria">
    <check if="ACs in amendment plan">
      <action>Load current ACs from story</action>
      <action>Load ACs from source (tech_spec or epics)</action>

      <check if="fixing AC mismatch">
        <action>Compare source ACs with current story ACs</action>
        <action>Identify gaps and discrepancies</action>
        <action>Update story ACs to match source (preserve valid additions)</action>
      </check>

      <check if="adding new ACs">
        <action>Validate new ACs are sourced from PRD/tech_spec/epics</action>
        <action>Format as testable, specific, atomic criteria</action>
        <action>Add to AC section with proper numbering</action>
      </check>

      <check if="refining existing ACs">
        <action>Improve clarity while preserving intent</action>
        <action>Add source citations</action>
      </check>
    </check>
  </step>

  <step n="5" goal="Execute amendments - Tasks/Subtasks">
    <check if="Tasks in amendment plan">
      <action>Load current tasks from story</action>

      <check if="fixing task-AC mapping">
        <action>For each AC, ensure mapped tasks exist</action>
        <action>Add "(AC: #X)" references to tasks</action>
        <action>Add missing testing subtasks</action>
      </check>

      <check if="adding new tasks">
        <action>Validate task directly supports an AC</action>
        <action>Add task with proper formatting and AC reference</action>
        <action>Include testing subtasks</action>
      </check>

      <check if="refining task descriptions">
        <action>Improve clarity</action>
        <action>Add implementation hints from architecture docs</action>
      </check>
    </check>
  </step>

  <step n="6" goal="Execute amendments - Dev Notes">
    <check if="Dev Notes in amendment plan">
      <action>Load current Dev Notes from story</action>

      <check if="adding missing citations">
        <action>Identify source documents not yet cited</action>
        <action>Add citations with specific section references</action>
        <action>Format: [Source: path/to/file.md#section]</action>
      </check>

      <check if="adding architecture guidance">
        <action>Extract relevant patterns from architecture docs</action>
        <action>Add specific guidance (not generic advice)</action>
        <action>Include file paths and component names</action>
      </check>

      <check if="adding Learnings from Previous Story">
        <action>Load previous story file</action>
        <action>Extract:
          - NEW files created
          - Completion notes
          - Architectural decisions
          - Unresolved review items
        </action>
        <action>Add "Learnings from Previous Story" subsection:
```markdown
### Learnings from Previous Story

**From Story {{previous_story_key}} (Status: {{previous_status}})**

- **New Service Created**: `ServiceName` at `path/to/file` - use `method()`
- **Architectural Change**: [description]
- **Technical Debt**: [items to address]
- **Pending Review Items**: [if any]

[Source: stories/{{previous_story_key}}.md#Dev-Agent-Record]
````

        </action>
      </check>

      <check if="fixing generic advice">
        <action>Identify vague statements</action>
        <action>Replace with specific guidance from source docs</action>
        <action>Add citations for all technical claims</action>
      </check>
    </check>

  </step>

  <step n="7" goal="Execute amendments - Story Statement and Structure">
    <check if="Story statement in amendment plan">
      <action>Load current story statement</action>
      <action>Validate/fix "As a / I want / so that" format</action>
      <action>Ground in PRD/epics requirements</action>
    </check>

    <check if="Structure fixes in amendment plan">
      <action>Ensure all required sections present:
        - Status
        - Story
        - Acceptance Criteria
        - Tasks / Subtasks
        - Dev Notes
        - Dev Agent Record (with subsections)
        - Change Log
      </action>
      <action>Add missing sections with proper formatting</action>
    </check>

  </step>

  <step n="8" goal="Update Change Log and save">
    <action>Add Change Log entry:
```markdown
| {{date}} | Amended | {{user_name}} | [Amendment summary: what changed and why] |
```
    </action>

    <action>Save the amended story file</action>
    <action>Preserve file location: {{story_dir}}/{{story_key}}.md</action>

  </step>

  <step n="9" goal="Optionally re-validate">
    <ask>Run validation on amended story? (recommended) (y/n)</ask>

    <check if="yes">
      <action>Invoke validate-story workflow</action>
      <action>Report validation results</action>
    </check>

  </step>

  <step n="10" goal="Completion communication">
    <output>**✅ Story Amendment Complete, {user_name}!**

**Story:** {{story_key}}
**Amendments Made:**
{{list_amendments}}

**Files Modified:**

- {{story_dir}}/{{story_key}}.md

**Next Steps:**

1. Review the amended story
2. Run `validate-story` if not already done
3. Run `story-ready` or `story-context` when ready for development
</output>

  <check if="validation report existed">
    <action>Delete or archive old validation report</action>
  </check>
</step>

</workflow>
```
