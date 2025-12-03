# Domain Architecture Amendment Workflow

<critical>For Infrastructure Module, Strategic Container, Coordination Unit, Business Module architectures</critical>
<critical>Amendments must maintain alignment with parent architecture - no contradictions allowed</critical>

<shared-tasks>
  <task name="select-entity" path="{project-root}/.bmad/bmm/tasks/select-entity.xml" />
  <task name="detect-entity-type" path="{project-root}/.bmad/bmm/tasks/detect-entity-type.xml" />
  <task name="validate-inheritance" path="{project-root}/.bmad/bmm/tasks/validate-inheritance.xml" />
  <task name="impact-analysis" path="{project-root}/.bmad/bmm/tasks/impact-analysis.xml" />
  <task name="save-with-checkpoint" path="{project-root}/.bmad/bmm/tasks/save-with-checkpoint.xml" />
</shared-tasks>

<workflow>

<step n="0" goal="Determine Entity Type">
<check if="entity_type not set">
  <invoke-task name="select-entity">
    <param name="prompt_user">true</param>
  </invoke-task>
</check>

<check if="entity_type == 'constitution'">
  <output>Use amend-system-architecture workflow instead.</output>
  <action>Exit</action>
</check>

<action>Load architecture from {architecture_path}</action>

<check if="architecture not found">
  <output>❌ Architecture not found at {architecture_path}</output>
  <output>Use create-domain-architecture to create it first.</output>
  <action>Exit</action>
</check>

<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔧 {entity_type_display} ARCHITECTURE AMENDMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Document: {architecture_path}
Parent: {parent_architecture_path}
Constitution: docs/platform/architecture.md
Date: {date}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>
</step>

<step n="1" goal="Capture Change Request">
<ask>What architectural changes do you want to make?

Options:

1. Add/modify component design
2. Add/modify API contract
3. Add/modify integration pattern
4. Add/modify local ADR
5. Other (describe)</ask>

<action>Document the proposed change:

- Section to modify
- Current state
- Proposed new state
- Rationale for change
</action>

</step>

<step n="2" goal="Parent Alignment Check">
<action>Load parent architecture</action>
<action>Load Constitution architecture</action>

<invoke-task name="validate-inheritance">
  <param name="document_content">{proposed_state}</param>
  <param name="entity_type">{entity_type}</param>
  <param name="parent_prd_path">{parent_architecture_path}</param>
</invoke-task>

<check if="inheritance_violation detected">
  <output>
  ❌ ALIGNMENT VIOLATION DETECTED

  Your proposed change contradicts parent architecture:
  {violation_details}

  Options:

  1. Modify your change to align
  2. Request parent amendment first
  3. Document as local exception (requires ADR)
  </output>

  <ask>How would you like to proceed? (1/2/3)</ask>
</check>
</step>

<step n="3" goal="Impact Analysis">
<invoke-task name="impact-analysis">
  <param name="document_path">{architecture_path}</param>
  <param name="change_description">{change_description}</param>
  <param name="scope">{entity_type}</param>
</invoke-task>

<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ IMPACT ANALYSIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Direct Impacts:**
{direct_impacts}

**Child Entity Impacts:**
{child_impacts}

**Interface Impacts:**
{interface_impacts}

**Required Updates:**
{required_updates}

**Risk Level:** {risk_level}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>

<check if="risk_level == 'HIGH'">
  <ask>⚠️ HIGH RISK CHANGE detected. Proceed anyway? (y/n)</ask>
</check>
</step>

<step n="4" goal="Local ADR Check">
<check if="change deviates from inherited pattern">
  <output>This change requires a Local ADR to document the exception.</output>
  <action>Generate Local ADR template:
  - Reference to parent decision
  - Justification for deviation
  - Scope limitation
  - Review trigger conditions
  </action>
  <ask>Review the generated Local ADR. Approve to include? (y/n)</ask>
</check>
</step>

<step n="5" goal="Apply Amendment">
<action>Update architecture document with:
1. Apply the change to the target section
2. Update revision history with date and rationale
3. Add Local ADR if generated
4. Ensure checklist compliance maintained
</action>

<invoke-task name="save-with-checkpoint">
  <param name="document_path">{architecture_path}</param>
  <param name="document_type">{entity_type}-architecture</param>
  <param name="change_summary">{change_description}</param>
</invoke-task>
</step>

<step n="6" goal="Log Amendment">
<action>Append to amendment log:
- Date: {date}
- Document: {entity_type_display} Architecture
- Path: {architecture_path}
- Change: {change_description}
- Rationale: {rationale}
- Parent alignment: {alignment_status}
- Impacted children: {child_count}
- Risk level: {risk_level}
</action>
</step>

<step n="7" goal="Child Update Guidance">
<check if="child_count > 0">
  <output>
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  📋 CHILD UPDATE RECOMMENDATIONS
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  The following child architectures may need review:

  {child_update_list}

  **Recommended Actions:**

  1. Review each impacted document for alignment
  2. Use amend-domain-architecture for updates
  3. Validate after all changes complete
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>

</check>

<output>
✅ Architecture amendment complete.
📄 Log updated at: {amendment_log_path}
</output>
</step>

</workflow>
