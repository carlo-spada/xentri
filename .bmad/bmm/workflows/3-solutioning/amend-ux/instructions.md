# UX Design Amendment Router

<critical>This is a ROUTER workflow - detects entity type and dispatches to correct amendment workflow</critical>

<workflow>

<step n="1" goal="Detect Entity Type">
<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 UX DESIGN AMENDMENT WORKFLOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This workflow amends existing UX Designs with impact analysis.

Let's determine which UX Design to amend.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>

<invoke-task name="detect-entity-type">
  <param name="prompt_user">true</param>
</invoke-task>

<output>
📍 Detected: {entity_type_display}
   Path: {output_folder_resolved}ux-design.md
</output>

<ask>Amend this UX Design? (y/n/change)</ask>
<check if="response == 'change'">
  <goto step="1">Re-detect</goto>
</check>
<check if="response == 'n'">
  <action>Exit workflow</action>
</check>
</step>

<step n="2" goal="Route to Appropriate Amendment Workflow">
<check if="entity_type == 'constitution'">
  <output>
⚠️ CONSTITUTION UX AMENDMENT

You are about to amend the System UX Design.
This affects ALL downstream entities' UX patterns.

Routing to Constitution UX amendment workflow...
  </output>
  <invoke-workflow path="{system_amend_workflow}" />
</check>

<check if="entity_type != 'constitution'">
  <output>🎨 Routing to {entity_type_display} UX amendment workflow...</output>
  <invoke-workflow path="{domain_amend_workflow}">
    <param name="entity_type">{entity_type}</param>
    <param name="entity_type_display">{entity_type_display}</param>
    <param name="output_folder_resolved">{output_folder_resolved}</param>
    <param name="parent_prd_path">{parent_prd_path}</param>
  </invoke-workflow>
</check>
</step>

</workflow>
