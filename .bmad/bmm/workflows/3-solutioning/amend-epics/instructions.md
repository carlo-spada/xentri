# Epics Amendment Router

<critical>This is a ROUTER workflow - detects entity type and dispatches to correct amendment workflow</critical>

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
    Output Path:    {output_folder_resolved}epics.md
    Parent Epics:   {parent_epics_path or "N/A (Constitution)"}
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>
</step>

<step n="2" goal="Route to Appropriate Workflow">
<check if="entity_type == 'constitution'">
  <output>🏛️ **Constitution Epics Amendment**
⚠️ Constitution changes require governance review.
Routing to System Epics amendment...</output>
  <invoke-workflow path="{system_amend_workflow}" />
</check>

<check if="entity_type != 'constitution'">
  <output>📝 **{entity_type_display} Epics Amendment**
Routing to Domain Epics amendment...</output>
  <invoke-workflow path="{domain_amend_workflow}">
    <param name="entity_type">{entity_type}</param>
    <param name="entity_type_display">{entity_type_display}</param>
    <param name="output_folder_resolved">{output_folder_resolved}</param>
    <param name="parent_epics_path">{parent_epics_path}</param>
  </invoke-workflow>
</check>
</step>

</workflow>
