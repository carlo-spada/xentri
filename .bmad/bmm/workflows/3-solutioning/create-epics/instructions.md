# Epics Creation Router

<critical>This is a ROUTER workflow - detects entity type and dispatches to correct implementation</critical>

<workflow>

<step n="1" goal="Welcome and Context Detection">
<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 EPICS CREATION WORKFLOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This workflow creates an Epics document at the
appropriate level in your federated documentation hierarchy.

Epics define the work breakdown structure with:
- Category-level outcomes (Constitution)
- Cascading epic IDs for child entities
- FR-to-story traceability

Let's determine where these epics should live.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>

<invoke-task name="detect-entity-type">
  <param name="prompt_user">true</param>
</invoke-task>

<output>
📍 Detected: {entity_type_display}
   Path: {output_folder_resolved}epics.md
</output>

<ask>Create epics at this location? (y/n/change)</ask>
<check if="response == 'change'">
  <goto step="1">Re-detect</goto>
</check>
<check if="response == 'n'">
  <action>Exit workflow</action>
</check>
</step>

<step n="2" goal="Route to Appropriate Workflow">
<check if="entity_type == 'constitution'">
  <output>🏛️ **Constitution Epics**
Routing to System Epics workflow...</output>
  <invoke-workflow path="{system_epics_workflow}" />
</check>

<check if="entity_type != 'constitution'">
  <output>📋 **{entity_type_display} Epics**
Routing to Domain Epics workflow...</output>
  <invoke-workflow path="{domain_epics_workflow}">
    <param name="entity_type">{entity_type}</param>
    <param name="entity_type_display">{entity_type_display}</param>
    <param name="output_folder_resolved">{output_folder_resolved}</param>
    <param name="parent_epics_path">{parent_epics_path}</param>
  </invoke-workflow>
</check>
</step>

</workflow>
