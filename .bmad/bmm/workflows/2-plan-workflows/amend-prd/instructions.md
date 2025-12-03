# PRD Amendment Router

<critical>This is a ROUTER workflow - detects entity type and dispatches to correct amendment workflow</critical>

<shared-tasks>
  <task name="select-entity" path="{project-root}/.bmad/bmm/tasks/select-entity.xml" />
  <task name="detect-entity-type" path="{project-root}/.bmad/bmm/tasks/detect-entity-type.xml" />
</shared-tasks>

<workflow>

<step n="1" goal="Detect Entity Type">
  <invoke-task name="select-entity">
    <param name="prompt_user">true</param>
  </invoke-task>
  
  <output>
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    📍 Entity Type Detected
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    Type:           {entity_type_display}
    Output Path:    {output_folder_resolved}prd.md
    Parent PRD:     {parent_prd_path or "N/A (Constitution)"}
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>
</step>

<step n="2" goal="Route to Appropriate Amendment Workflow">
<check if="entity_type == 'constitution'">
  <output>
⚠️ CONSTITUTION AMENDMENT

You are about to amend the System Constitution.
This affects ALL downstream entities.

Routing to Constitution amendment workflow...
  </output>
  <invoke-workflow path="{system_amend_workflow}" />
</check>

<check if="entity_type != 'constitution'">
  <output>📝 Routing to {entity_type_display} amendment workflow...</output>
  <invoke-workflow path="{domain_amend_workflow}">
    <param name="entity_type">{entity_type}</param>
    <param name="entity_type_display">{entity_type_display}</param>
    <param name="fr_prefix">{fr_prefix}</param>
    <param name="output_folder_resolved">{output_folder_resolved}</param>
    <param name="parent_prd_path">{parent_prd_path}</param>
  </invoke-workflow>
</check>
</step>

</workflow>
