# PRD Creation Router

<critical>This is a ROUTER workflow - it detects entity type and dispatches to the correct implementation</critical>
<critical>The workflow execution engine is governed by: {project-root}/.bmad/core/tasks/workflow.xml</critical>
<critical>Communicate in {communication_language}</critical>

<workflow>

<step n="1" goal="Welcome and Context Detection">
<action>Welcome {user_name} to the PRD creation workflow</action>

<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 PRD CREATION WORKFLOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This workflow helps you create a Product Requirements
Document at the appropriate level in your federated
documentation hierarchy.

Let's determine where this PRD should live.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>

<action>Check for context clues:
1. Current working directory (if in a docs/ subfolder)
2. Recent workflow context (workflow-status.yaml)
3. User's stated intent
</action>

<check if="context suggests specific path">
  <output>Based on context, it looks like you want to create a PRD at:
  **Path:** {detected_path}
  </output>
  <ask>Is this correct? (y/n)</ask>
  <check if="response == 'y'">
    <action>Use detected_path for entity detection</action>
    <goto step="2">Detect entity type</goto>
  </check>
</check>
</step>

<step n="2" goal="Detect Entity Type">
<invoke-task name="detect-entity-type">
  <param name="path">{target_path or prompt_user}</param>
</invoke-task>

<action>Store all returned variables:
- entity_type
- entity_type_display
- fr_prefix
- output_folder_resolved
- parent_prd_path
- constitution_path
- entity_code
</action>

<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Entity Type Detected
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Type:           {entity_type_display}
Output Path:    {output_folder_resolved}
FR Prefix:      {fr_prefix}
Parent PRD:     {parent_prd_path or "N/A (Constitution)"}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>

<ask>Proceed with this location? (y/n/change)</ask>
<check if="response == 'change'">
  <action>Clear detected values</action>
  <goto step="2">Re-detect with new path</goto>
</check>
<check if="response == 'n'">
  <action>Exit workflow</action>
</check>
</step>

<step n="3" goal="Route to Appropriate Workflow">
<check if="entity_type == 'constitution'">
  <output>
🏛️ **Constitution PRD**
Routing to System PRD workflow...
This will create/update: docs/platform/prd.md
  </output>
  <invoke-workflow path="{system_prd_workflow}">
    <pass-through>All context variables</pass-through>
  </invoke-workflow>
</check>

<check if="entity_type != 'constitution'">
  <output>
📋 **{entity_type_display} PRD**
Routing to Domain PRD workflow...
This will create: {output_folder_resolved}prd.md
  </output>
  <invoke-workflow path="{domain_prd_workflow}">
    <param name="entity_type">{entity_type}</param>
    <param name="entity_type_display">{entity_type_display}</param>
    <param name="fr_prefix">{fr_prefix}</param>
    <param name="output_folder_resolved">{output_folder_resolved}</param>
    <param name="parent_prd_path">{parent_prd_path}</param>
    <param name="constitution_path">{constitution_path}</param>
    <param name="entity_code">{entity_code}</param>
  </invoke-workflow>
</check>
</step>

</workflow>

<notes>
This router provides a unified entry point for PRD creation.
Users can call `create-prd` without knowing whether they need
the system or domain variant - the router figures it out.

The Five Entity Types:
1. Constitution → create-system-prd
2. Infrastructure Module → create-domain-prd
3. Strategic Container → create-domain-prd
4. Coordination Unit → create-domain-prd
5. Business Module → create-domain-prd
</notes>
