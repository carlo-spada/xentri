# Epics Validation Router

<critical>This is a ROUTER workflow - detects entity type and dispatches to correct validation workflow</critical>

<workflow>

<step n="1" goal="Welcome and Context Detection">
<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 EPICS VALIDATION WORKFLOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This workflow validates an Epics document at the
appropriate level in your federated documentation hierarchy.

Validation checks:
- Structural completeness
- Traceability to PRD requirements
- Inheritance alignment
- Quality standards

Let's determine which epics to validate.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>

<invoke-task name="detect-entity-type">
  <param name="prompt_user">true</param>
</invoke-task>

<output>
📍 Detected: {entity_type_display}
   Path: {output_folder_resolved}epics.md
</output>

<ask>Validate epics at this location? (y/n/change)</ask>
<check if="response == 'change'">
  <goto step="1">Re-detect</goto>
</check>
<check if="response == 'n'">
  <action>Exit workflow</action>
</check>
</step>

<step n="2" goal="Route to Appropriate Workflow">
<check if="entity_type == 'constitution'">
  <output>🏛️ **Constitution Epics Validation**
Routing to System Epics validation...</output>
  <invoke-workflow path="{system_validate_workflow}" />
</check>

<check if="entity_type != 'constitution'">
  <output>📋 **{entity_type_display} Epics Validation**
Routing to Domain Epics validation...</output>
  <invoke-workflow path="{domain_validate_workflow}">
    <param name="entity_type">{entity_type}</param>
    <param name="entity_type_display">{entity_type_display}</param>
    <param name="output_folder_resolved">{output_folder_resolved}</param>
    <param name="parent_epics_path">{parent_epics_path}</param>
  </invoke-workflow>
</check>
</step>

</workflow>
