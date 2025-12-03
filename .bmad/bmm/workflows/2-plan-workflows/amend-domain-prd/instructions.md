# Domain PRD Amendment Workflow

<critical>Amendments must not contradict parent PRD or Constitution</critical>
<critical>Impact analysis required for changes affecting downstream</critical>
<critical>The workflow execution engine is governed by: {project-root}/.bmad/core/tasks/workflow.xml</critical>

<shared-tasks>
  <task name="select-entity" path="{project-root}/.bmad/bmm/tasks/select-entity.xml" />
  <task name="detect-entity-type" path="{project-root}/.bmad/bmm/tasks/detect-entity-type.xml" />
  <task name="impact-analysis" path="{project-root}/.bmad/bmm/tasks/impact-analysis.xml" />
  <task name="validate-inheritance" path="{project-root}/.bmad/bmm/tasks/validate-inheritance.xml" />
  <task name="save-with-checkpoint" path="{project-root}/.bmad/bmm/tasks/save-with-checkpoint.xml" />
</shared-tasks>

<workflow>

<step n="0" goal="Determine Entity Type and Load PRD">
  <check if="entity_type is not set">
    <invoke-task name="select-entity">
      <param name="prompt_user">true</param>
    </invoke-task>
  </check>

  <check if="entity_type == 'constitution'">
    <output>⚠️ Constitution detected. Use amend-system-prd workflow instead.</output>
    <action>Exit workflow</action>
  </check>

  <action>Load PRD from {output_folder_resolved}prd.md</action>
  <action>Set prd_path to {output_folder_resolved}prd.md</action>

  <check if="file not found">
    <output>❌ PRD not found at {prd_path}

    Use create-domain-prd workflow to create it first.</output>
    <action>Exit workflow</action>
  </check>

  <output>
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    📝 {entity_type_display} PRD AMENDMENT
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    Amending: {prd_path}
    Entity Type: {entity_type_display}
    Parent PRD: {parent_prd_path}
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>
</step>

<step n="1" goal="Identify Amendment Type">
<output>
What type of amendment do you want to make?

1. **Add** - Add new functional requirements ({fr_prefix}-xxx)
2. **Modify** - Change existing requirements
3. **Remove** - Remove existing requirements
4. **Other** - Modify scope, interfaces, or other sections
</output>

<ask>Select amendment type (1-4):</ask>
<action>Store as amendment_type</action>
</step>

<step n="2" goal="Specify Changes">
<check if="amendment_type == 1 (Add)">
  <ask>Describe the new requirement(s) to add:

Remember:

- Must use prefix {fr_prefix}-xxx
- Must not contradict parent ({parent_prd_path})
- Must not contradict Constitution
</ask>

  <action>Generate next available FR ID</action>
  <action>Draft the new requirement(s)</action>
</check>

<check if="amendment_type == 2 (Modify)">
  <output>Current Functional Requirements:
{list_fr_xxx}</output>

  <ask>Which requirement do you want to modify? (enter ID)</ask>
  <action>Load current content</action>

  <output>Current:
{current_content}</output>

  <ask>What change do you want to make?</ask>
  <action>Draft modification</action>
</check>

<check if="amendment_type == 3 (Remove)">
  <output>Current Functional Requirements:
{list_fr_xxx}</output>

  <ask>Which requirement do you want to remove? (enter ID)</ask>

  <output>You are about to remove:
{current_content}</output>

  <ask>Provide justification:</ask>
</check>

<check if="amendment_type == 4 (Other)">
  <output>Sections available for amendment:
1. Purpose & Scope
2. Entity-specific sections (Interfaces, Coordination, etc.)
3. NFRs
4. Traceability
</output>

  <ask>Which section? Describe the change:</ask>
</check>
</step>

<step n="3" goal="Validate Against Parent">
<invoke-task name="validate-inheritance">
  <param name="document_content">{draft_amendment}</param>
  <param name="entity_type">{entity_type}</param>
  <param name="parent_prd_path">{parent_prd_path}</param>
</invoke-task>

<check if="validation.is_valid == false">
  <output>
❌ INHERITANCE VIOLATION

Your proposed amendment contradicts the parent PRD or Constitution:
{validation.violations}

You must either:

1. Modify your amendment to not contradict
2. First amend the parent PRD (requires higher-level change)
  </output>

  <ask>What would you like to do?
[m] Modify amendment
[c] Cancel
</ask>

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
  <param name="document_path">{prd_path}</param>
  <param name="entity_type">{entity_type}</param>
  <param name="changed_items">{affected_ids}</param>
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

<step n="4b" goal="Sibling Interface Impact Analysis" if="entity_type == 'infrastructure_module'">
<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 SIBLING INTERFACE IMPACT ANALYSIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Infrastructure modules have no downstream children, but other
infrastructure modules may CONSUME interfaces this module EXPOSES.
</output>

<action>Scan sibling infrastructure modules for interface dependencies:

1. Load all docs/platform/{module}/prd.md files
2. Check their "Consumed Interfaces" sections
3. Identify references to this module's exposed interfaces
4. Flag any that reference changed items
</action>

<invoke-task name="impact-analysis">
  <param name="document_path">{prd_path}</param>
  <param name="entity_type">infrastructure_module</param>
  <param name="changed_items">{affected_ids}</param>
  <param name="change_type">{amendment_type}</param>
  <param name="scan_mode">sibling_interfaces</param>
</invoke-task>

<check if="sibling_impacts found">
  <output>
⚠️ Sibling modules consume interfaces you're changing:
{sibling_impact_report}
  </output>
  <ask>Proceed with amendment? (yes/no)</ask>
  <check if="response != 'yes'">
    <action>Exit workflow</action>
  </check>
</check>

<check if="no sibling_impacts">
  <output>✅ No sibling modules consume the interfaces being changed.</output>
</check>
</step>

<step n="4c" goal="No Impact Analysis Needed" if="entity_type == 'business_module'">
<output>ℹ️ Business Module is a terminal node with no downstream or sibling dependencies.
No impact analysis required.</output>
</step>

<step n="5" goal="Draft and Review Amendment">
<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 PROPOSED AMENDMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Type:** {amendment_type_display}
**Affected:** {affected_ids}

**Change:**
{amendment_content}

**Rationale:**
{rationale}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>

<ask>Review the amendment:
[a] Approve and apply
[e] Edit
[c] Cancel
</ask>

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
  <param name="file_path">{prd_path}</param>
  <param name="content">{updated_prd}</param>
  <param name="section_name">{entity_type_display} Amendment</param>
</invoke-task>
</step>

<step n="7" goal="Summary">
<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ {entity_type_display} PRD AMENDED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Updated: {prd_path}

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
