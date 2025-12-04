# PRD Creation Router

<critical>This is a ROUTER workflow - it detects entity type and dispatches to the correct implementation</critical>
<critical>The workflow execution engine is governed by: {project-root}/.bmad/core/tasks/workflow.xml</critical>
<critical>Communicate in {communication_language}</critical>

<shared-tasks>
  <task name="select-entity" path="{project-root}/.bmad/bmm/tasks/select-entity.xml" />
  <task name="detect-entity-type" path="{project-root}/.bmad/bmm/tasks/detect-entity-type.xml" />
</shared-tasks>

<workflow>

<step n="1" goal="Determine Entity Type">
  <invoke-task name="select-entity">
    <param name="prompt_user">true</param>
  </invoke-task>
  
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
