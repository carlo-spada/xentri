# Domain Architecture Validation Workflow

<critical>Validates architecture for: Infrastructure Module, Strategic Container, Coordination Unit, Business Module</critical>
<critical>Key validation: ALIGNMENT with Constitution and parent architecture</critical>

<workflow>

<step n="0" goal="Determine Entity Type">
<check if="entity_type not set">
  <invoke-task name="detect-entity-type">
    <param name="prompt_user">true</param>
  </invoke-task>
</check>

<check if="entity_type == 'constitution'">
  <output>Use validate-system-architecture workflow instead.</output>
  <action>Exit</action>
</check>

<action>Load architecture from {architecture_path}</action>

<check if="architecture not found">
  <output>❌ Architecture not found at {architecture_path}</output>
  <action>Exit</action>
</check>

<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 {entity_type_display} ARCHITECTURE VALIDATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Validating: {architecture_path}
Constitution: docs/platform/architecture.md
Parent: {parent_architecture_path}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>
</step>

<step n="1" goal="Load Parent Context">
<action>Load Constitution architecture</action>
<action>Load parent architecture if applicable</action>
<action>Extract inherited decisions and constraints</action>
</step>

<step n="2" goal="Constitution Alignment">
<invoke-task name="validate-inheritance">
  <param name="document_content">{architecture_content}</param>
  <param name="entity_type">{entity_type}</param>
  <param name="parent_prd_path">{parent_architecture_path}</param>
</invoke-task>

<action>Verify:
- No tech stack deviations without ADR
- Alignment with Constitution patterns
- No contradictions to parent decisions
</action>
</step>

<step n="3" goal="Structural Validation">
<action>Select appropriate checklist</action>
<action>Validate required sections present</action>
<action>Check for unfilled templates</action>
</step>

<step n="4" goal="Entity-Specific Validation">
<check if="entity_type == 'infrastructure_module'">
  <action>Validate: APIs documented, Integration patterns, Service boundaries</action>
</check>
<check if="entity_type == 'business_module'">
  <action>Validate: Component architecture, State management, UI patterns</action>
</check>
</step>

<step n="5" goal="Generate Report">
<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 VALIDATION REPORT: {entity_type_display}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
| Status | Count |
|--------|-------|
| ✅ PASS | {pass_count} |
| ❌ FAIL | {fail_count} |
| ⚠️ WARN | {warn_count} |

**Constitution Alignment: {alignment_status}**
**Overall: {overall_status}**

{detailed_results}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>
</step>

</workflow>
