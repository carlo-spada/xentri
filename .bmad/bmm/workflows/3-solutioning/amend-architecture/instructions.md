# Architecture Amendment Router

<shared-tasks>
  <task name="select-entity" path="{project-root}/.bmad/bmm/tasks/select-entity.xml" />
  <task name="detect-entity-type" path="{project-root}/.bmad/bmm/tasks/detect-entity-type.xml" />
</shared-tasks>

<workflow>

<step n="1" goal="Detect and Route">
  <invoke-task name="select-entity">
    <param name="prompt_user">true</param>
  </invoke-task>
  
  <output>
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    📍 Entity Type Detected
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    Type:           {entity_type_display}
    Output Path:    {output_folder_resolved}architecture.md
    Parent Arch:    {parent_architecture_path or "N/A (Constitution)"}
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>

  <check if="entity_type == 'constitution'">
    <invoke-workflow path="{system_amend_workflow}" />
  </check>
  <check if="entity_type != 'constitution'">
    <invoke-workflow path="{domain_amend_workflow}">
      <param name="entity_type">{entity_type}</param>
      <param name="entity_type_display">{entity_type_display}</param>
      <param name="output_folder_resolved">{output_folder_resolved}</param>
      <param name="parent_architecture_path">{parent_architecture_path}</param>
    </invoke-workflow>
  </check>
</step>

</workflow>
