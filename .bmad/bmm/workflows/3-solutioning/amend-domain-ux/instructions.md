# Domain UX Amendment Workflow

<critical>Amendments must not contradict parent UX or Constitution UX</critical>
<critical>Impact analysis required for changes affecting downstream entities</critical>
<critical>The workflow execution engine is governed by: {project-root}/.bmad/core/tasks/workflow.xml</critical>

<shared-tasks>
  <task name="detect-entity-type" path="{project-root}/.bmad/bmm/tasks/detect-entity-type.xml" />
  <task name="impact-analysis" path="{project-root}/.bmad/bmm/tasks/impact-analysis.xml" />
  <task name="validate-inheritance" path="{project-root}/.bmad/bmm/tasks/validate-inheritance.xml" />
  <task name="save-with-checkpoint" path="{project-root}/.bmad/bmm/tasks/save-with-checkpoint.xml" />
</shared-tasks>

<workflow>

<step n="0" goal="Determine Entity Type and Load UX">
<check if="entity_type is not set">
  <invoke-task name="detect-entity-type">
    <param name="prompt_user">true</param>
  </invoke-task>
</check>

<check if="entity_type == 'constitution'">
  <output>⚠️ Constitution detected. Use amend-system-ux workflow instead.</output>
  <action>Exit workflow</action>
</check>

<action>Load UX Design from {ux_path}</action>

<check if="file not found">
  <output>❌ UX Design not found at {ux_path}

Use create-domain-ux workflow to create it first.</output>
  <action>Exit workflow</action>
</check>

<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 {entity_type_display} UX AMENDMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Amending: {ux_path}
Entity Type: {entity_type_display}
Parent UX: {parent_ux_path}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>
</step>

<step n="1" goal="Identify Amendment Type">
<output>
What type of amendment do you want to make?

1. **Add** - Add new flow, component, or pattern
2. **Modify** - Change existing UX design
3. **Remove** - Remove existing UX element
4. **Other** - Modify states, accessibility, responsive behavior
</output>

<ask>Select amendment type (1-4):</ask>
<action>Store as amendment_type</action>
</step>

<step n="2" goal="Specify Changes">
<check if="amendment_type == 1 (Add)">
  <ask>Describe what you want to add:

Remember:
- Must not contradict parent UX ({parent_ux_path})
- Must not contradict Constitution UX
- Should be appropriate for {entity_type_display}</ask>

  <action>Draft the new content</action>
</check>

<check if="amendment_type == 2 (Modify)">
  <output>Current UX sections:
{list_sections}</output>

  <ask>Which section do you want to modify?</ask>
  <action>Load current content</action>

  <output>Current:
{current_content}</output>

  <ask>What change do you want to make?</ask>
  <action>Draft modification</action>
</check>

<check if="amendment_type == 3 (Remove)">
  <output>Current UX elements:
{list_elements}</output>

  <ask>What do you want to remove?</ask>
  <action>Identify element to remove</action>
</check>

<check if="amendment_type == 4 (Other)">
  <ask>Describe the change:

For {entity_type_display} UX, this might include:
- State updates
- Accessibility improvements
- Responsive behavior changes
- Integration updates</ask>
</check>
</step>

<step n="3" goal="Validate Against Parent">
<invoke-task name="validate-inheritance">
  <param name="document_content">{draft_amendment}</param>
  <param name="document_type">ux-design</param>
  <param name="entity_type">{entity_type}</param>
  <param name="parent_path">{parent_ux_path}</param>
</invoke-task>

<check if="validation.is_valid == false">
  <output>
❌ INHERITANCE VIOLATION

Your proposed amendment contradicts the parent UX or Constitution:
{validation.violations}

You must either:
1. Modify your amendment to not contradict
2. First amend the parent UX (requires higher-level change)
  </output>

  <ask>What would you like to do?
[m] Modify amendment
[c] Cancel</ask>

  <check if="response == 'm'">
    <goto step="2">Re-specify changes</goto>
  </check>
  <check if="response == 'c'">
    <action>Exit workflow</action>
  </check>
</check>
</step>

<step n="4" goal="Impact Analysis" if="entity_type in ['strategic_container', 'coordination_unit']">
<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 RUNNING IMPACT ANALYSIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>

<invoke-task name="impact-analysis">
  <param name="document_path">{ux_path}</param>
  <param name="entity_type">{entity_type}</param>
  <param name="changed_items">{affected_elements}</param>
  <param name="change_type">{amendment_type}</param>
</invoke-task>

<output>
📊 Impact Analysis Results:
{impact_report}
</output>

<check if="impact_severity == 'breaking'">
  <output>⚠️ Breaking changes affect downstream entities.

Affected documents:
{affected_documents}
  </output>

  <ask>Proceed anyway? (yes/no)</ask>
  <check if="response != 'yes'">
    <action>Exit workflow</action>
  </check>
</check>
</step>

<step n="4b" goal="No Impact Analysis Needed" if="entity_type in ['infrastructure_module', 'business_module']">
<output>ℹ️ {entity_type_display} is a terminal node with no downstream dependencies.
No impact analysis required.</output>
</step>

<step n="5" goal="Draft and Review Amendment">
<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 PROPOSED AMENDMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Type:** {amendment_type_display}
**Section:** {affected_section}

**Change:**
{amendment_content}

**Rationale:**
{rationale}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>

<ask>Review the amendment:
[a] Approve and apply
[e] Edit
[c] Cancel</ask>

<check if="response == 'e'">
  <goto step="2">Re-specify</goto>
</check>
<check if="response == 'c'">
  <action>Exit workflow</action>
</check>
</step>

<step n="6" goal="Apply Amendment">
<action>Apply the amendment:
1. Update the relevant section(s)
2. Increment version number
3. Add entry to Document History
4. Update 'updated' date in frontmatter
</action>

<invoke-task name="save-with-checkpoint">
  <param name="file_path">{ux_path}</param>
  <param name="content">{updated_ux}</param>
  <param name="section_name">{entity_type_display} UX Amendment</param>
</invoke-task>
</step>

<step n="7" goal="Summary">
<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ {entity_type_display} UX AMENDED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Updated: {ux_path}

**Changes:**
{amendment_summary}

{if affected_documents}
**Next Steps:**
Update affected downstream documents:
{affected_documents_list}
{end if}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>
</step>

</workflow>
