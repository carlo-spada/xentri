# UX Design Validation Router

<critical>This is a ROUTER workflow - detects entity type and dispatches to correct validation workflow</critical>

<workflow>

<step n="1" goal="Detect Entity Type">
<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 UX DESIGN VALIDATION WORKFLOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This workflow validates a UX Design at any level in the
federated documentation hierarchy.

Let's determine which UX Design to validate.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>

<invoke-task name="detect-entity-type">
  <param name="prompt_user">true</param>
</invoke-task>

<output>
📍 Detected: {entity_type_display}
   Path: {output_folder_resolved}ux-design.md
</output>

<ask>Validate this UX Design? (y/n/change)</ask>
<check if="response == 'change'">
  <goto step="1">Re-detect</goto>
</check>
<check if="response == 'n'">
  <action>Exit workflow</action>
</check>
</step>

<step n="2" goal="Route to Appropriate Validation">
<check if="entity_type == 'constitution'">
  <output>🏛️ Routing to Constitution UX Design validation...</output>
  <invoke-workflow path="{system_validate_workflow}" />
</check>

<check if="entity_type != 'constitution'">
  <output>🎨 Routing to {entity_type_display} UX Design validation...</output>
  <invoke-workflow path="{domain_validate_workflow}">
    <param name="entity_type">{entity_type}</param>
    <param name="entity_type_display">{entity_type_display}</param>
    <param name="output_folder_resolved">{output_folder_resolved}</param>
    <param name="parent_prd_path">{parent_prd_path}</param>
  </invoke-workflow>
</check>
</step>

</workflow>
