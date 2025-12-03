# Architecture Creation Router

<critical>This is a ROUTER workflow - detects entity type and dispatches to correct implementation</critical>

<workflow>

<step n="1" goal="Welcome and Context Detection">
<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏗️ ARCHITECTURE CREATION WORKFLOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This workflow creates an Architecture document at the
appropriate level in your federated documentation hierarchy.

Let's determine where this architecture should live.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>

<invoke-task name="detect-entity-type">
  <param name="prompt_user">true</param>
</invoke-task>

<output>
📍 Detected: {entity_type_display}
   Path: {output_folder_resolved}architecture.md
</output>

<ask>Create architecture at this location? (y/n/change)</ask>
<check if="response == 'change'">
  <goto step="1">Re-detect</goto>
</check>
<check if="response == 'n'">
  <action>Exit workflow</action>
</check>
</step>

<step n="2" goal="Route to Appropriate Workflow">
<check if="entity_type == 'constitution'">
  <output>🏛️ **Constitution Architecture**
Routing to System Architecture workflow...</output>
  <invoke-workflow path="{system_architecture_workflow}" />
</check>

<check if="entity_type != 'constitution'">
  <output>📋 **{entity_type_display} Architecture**
Routing to Domain Architecture workflow...</output>
  <invoke-workflow path="{domain_architecture_workflow}">
    <param name="entity_type">{entity_type}</param>
    <param name="entity_type_display">{entity_type_display}</param>
    <param name="output_folder_resolved">{output_folder_resolved}</param>
    <param name="parent_architecture_path">{parent_architecture_path}</param>
  </invoke-workflow>
</check>
</step>

</workflow>
