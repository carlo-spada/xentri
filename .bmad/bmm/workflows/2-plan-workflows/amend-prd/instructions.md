# PRD Amendment Router

<critical>This is a ROUTER workflow - detects entity type and dispatches to correct amendment workflow</critical>

<workflow>

<step n="1" goal="Detect Entity Type">
<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 PRD AMENDMENT WORKFLOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This workflow amends existing PRDs with impact analysis.

Let's determine which PRD to amend.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>

<invoke-task name="detect-entity-type">
  <param name="prompt_user">true</param>
</invoke-task>

<output>
📍 Detected: {entity_type_display}
   Path: {output_folder_resolved}prd.md
</output>

<ask>Amend this PRD? (y/n/change)</ask>
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
