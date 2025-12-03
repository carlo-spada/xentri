# Architecture Amendment Router

<workflow>

<step n="1" goal="Detect and Route">
<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔧 ARCHITECTURE AMENDMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>

<invoke-task name="detect-entity-type">
  <param name="prompt_user">true</param>
</invoke-task>

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
