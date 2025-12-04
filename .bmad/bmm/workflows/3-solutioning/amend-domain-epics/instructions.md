# Domain Epics Amendment Workflow

<critical>This amends domain-level epics with impact analysis and inheritance validation</critical>
<critical>Communicate all responses in {communication_language}</critical>
<critical>INHERITANCE: Amendments must not violate Constitution or parent constraints</critical>

<shared-tasks>
  <task name="select-entity" path="{project-root}/.bmad/bmm/tasks/select-entity.xml" />
  <task name="detect-entity-type" path="{project-root}/.bmad/bmm/tasks/detect-entity-type.xml" />
  <task name="impact-analysis" path="{project-root}/.bmad/bmm/tasks/impact-analysis.xml" />
  <task name="validate-inheritance" path="{project-root}/.bmad/bmm/tasks/validate-inheritance.xml" />
  <task name="save-with-checkpoint" path="{project-root}/.bmad/bmm/tasks/save-with-checkpoint.xml" />
</shared-tasks>

<workflow>

<step n="1" goal="Detect Entity Type and Load Context">
<check if="entity_type is not set or empty">
  <invoke-task name="select-entity">
    <param name="prompt_user">true</param>
  </invoke-task>
</check>

<check if="entity_type == 'constitution'">
  <output>⚠️ Constitution detected. Use amend-system-epics workflow instead.</output>
  <action>Exit workflow</action>
</check>

<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 {entity_type_display} EPICS AMENDMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Amending: {output_folder_resolved}epics.md
Parent: {parent_epics_path}
Constitution: docs/platform/epics.md
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>

<invoke-protocol name="discover_inputs" />

<check if="current_epics is empty">
  <output>❌ No epics document found. Use create-domain-epics first.</output>
  <action>Exit workflow</action>
</check>

<output>
**Current Epic Structure:**
{display_current_epic_summary}
</output>

<ask>What type of amendment?

1. **ADD** - Add new epic or story
2. **MODIFY** - Change existing epic or story
3. **REMOVE** - Remove epic or story
4. **REORDER** - Change epic/story sequence

Enter choice (1-4):</ask>
</step>

<step n="2" goal="Specify Amendment Details">
<check if="amendment_type == 'ADD'">
  <ask>What are you adding?
  - [e] New Epic (must inherit from Constitution/parent epic)
  - [s] New Story to existing Epic

Enter choice:</ask>

<action>Gather details:

- For epic: parent epic ID, local ID, title, goal, FR coverage
- For story: which epic, title, acceptance criteria

  Validate cascading ID pattern:

- New epic ID must follow {parent_id}-{local_id} pattern
  </action>

</check>

<check if="amendment_type == 'MODIFY'">
  <ask>Which epic or story to modify?</ask>

<action>Gather modification details:

- What is changing?
- Why is this change needed?
- New content
  </action>

</check>

<check if="amendment_type == 'REMOVE'">
  <ask>Which epic or story to remove?</ask>

<output>⚠️ Removing items may affect child entities (if any).</output>
</check>

<check if="amendment_type == 'REORDER'">
  <ask>How should items be reordered?</ask>
</check>
</step>

<step n="3" goal="Validate Against Inheritance">
<invoke-task name="validate-inheritance">
  <param name="document_content">{proposed_changes}</param>
  <param name="entity_type">{entity_type}</param>
  <param name="parent_path">{parent_epics_path}</param>
</invoke-task>

<check if="validation.is_valid == false">
  <output>❌ Amendment violates inheritance constraints:
{validation.violations}

The amendment cannot contradict Constitution or parent epics.
Please revise the amendment.</output>
<goto step="2">Revise amendment</goto>
</check>

<output>✅ Amendment passes inheritance validation</output>
</step>

<step n="4" goal="Perform Impact Analysis">
<invoke-task name="impact-analysis">
  <param name="document_path">{output_folder_resolved}epics.md</param>
  <param name="change_type">{amendment_type}</param>
  <param name="change_details">{amendment_details}</param>
  <param name="entity_type">{entity_type}</param>
</invoke-task>

<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 IMPACT ANALYSIS REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Change:** {amendment_summary}

**Child Entity Impact:**
{list_child_impacts}

**Sprint/Story Impact:**
{list_sprint_impacts}

**Traceability Impact:**
{list_traceability_changes}

**Risk Assessment:** 🟢 LOW / 🟡 MEDIUM / 🔴 HIGH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>

<ask>Proceed with amendment? (y/n)</ask>
<check if="response != 'y'">
<action>Exit workflow</action>
</check>
</step>

<step n="5" goal="Document Rationale and Apply">
<ask>Please provide rationale for this change:</ask>

<action>Apply the amendment:

1. Make the requested change
2. Maintain cascading ID integrity
3. Update traceability matrix
4. Add changelog entry
   </action>

<invoke-task name="save-with-checkpoint">
  <param name="file_path">{default_output_file}</param>
  <param name="content">{amended_content}</param>
  <param name="section_name">Amendment Applied</param>
</invoke-task>
</step>

<step n="6" goal="Generate Amendment Summary">
<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ {entity_type_display} EPICS AMENDED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Document: {output_folder_resolved}epics.md
Amendment: {amendment_summary}
Rationale: {user_rationale}

**Inheritance Status:**

- Constitution alignment: ✅
- Parent alignment: ✅

**Changelog Entry Added:**

| Date   | Author      | Change   | Rationale   |
| ------ | ----------- | -------- | ----------- |
| {date} | {user_name} | {change} | {rationale} |

**Follow-up Actions:**
{list_followup_actions}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>
</step>

</workflow>
