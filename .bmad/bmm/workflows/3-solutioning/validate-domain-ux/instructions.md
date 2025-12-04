# Domain UX Validation Workflow

<critical>The workflow execution engine is governed by: {project-root}/.bmad/core/tasks/workflow.xml</critical>
<critical>This validates UX Design for: Infrastructure Module, Strategic Container, Coordination Unit, Business Module</critical>
<critical>Communicate all responses in {communication_language}</critical>

<shared-tasks>
  <task name="select-entity" path="{project-root}/.bmad/bmm/tasks/select-entity.xml" />
  <task name="detect-entity-type" path="{project-root}/.bmad/bmm/tasks/detect-entity-type.xml" />
  <task name="validate-inheritance" path="{project-root}/.bmad/bmm/tasks/validate-inheritance.xml" />
</shared-tasks>

<workflow>

<step n="0" goal="Determine Entity Type">
<check if="entity_type is not set">
  <invoke-task name="select-entity">
    <param name="prompt_user">true</param>
  </invoke-task>
</check>

<check if="entity_type == 'constitution'">
  <output>⚠️ Constitution detected. Use validate-system-ux workflow instead.</output>
  <action>Exit workflow</action>
</check>

<action>Load the UX Design from {ux_path}</action>

<check if="file not found">
  <output>❌ UX Design not found at {ux_path}

Use create-domain-ux workflow to create it first.</output>
<action>Exit workflow</action>
</check>

<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎨 {entity_type_display} UX VALIDATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Validating: {ux_path}
Entity Type: {entity_type_display}
Parent UX: {parent_ux_path}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>
</step>

<step n="1" goal="Select and Load Checklist">
<check if="entity_type == 'infrastructure_module'">
  <action>Load checklist: {checklist_infrastructure}</action>
</check>
<check if="entity_type == 'strategic_container'">
  <action>Load checklist: {checklist_strategic}</action>
</check>
<check if="entity_type == 'coordination_unit'">
  <action>Load checklist: {checklist_coordination}</action>
</check>
<check if="entity_type == 'business_module'">
  <action>Load checklist: {checklist_business}</action>
</check>
</step>

<step n="2" goal="Structural Validation">
<action>Check structural completeness per entity type:
- Frontmatter with correct entity_type
- Required sections present
- No missing mandatory content
</action>

<action>Record pass/fail for each item</action>
</step>

<step n="3" goal="Parent Alignment Validation">
<action>Check parent alignment:
- Inherits parent design direction
- Uses parent's design patterns appropriately
- Navigation integrates with parent
- No contradictions to parent UX decisions
</action>

<action>Record pass/fail for each item</action>
</step>

<step n="4" goal="Constitution Alignment Validation">
<action>Check Constitution alignment:
- Design system traceable to Constitution
- Follows inherited UX principles
- Accessibility compatible with system
- Pattern usage consistent with platform
</action>

<invoke-task name="validate-inheritance">
  <param name="document_content">{ux_content}</param>
  <param name="document_type">ux-design</param>
  <param name="entity_type">{entity_type}</param>
  <param name="parent_path">{parent_ux_path}</param>
</invoke-task>

<action>Record pass/fail for each item</action>
</step>

<step n="5" goal="Entity-Specific Validation">
<check if="entity_type == 'infrastructure_module'">
  <action>Validate Infrastructure-specific sections:
  - Exposed components documented
  - Consumed patterns documented
  - Component API specified
  - Error state gallery (if UI module)
  </action>
</check>

<check if="entity_type == 'strategic_container'">
  <action>Validate Strategic Container sections:
  - User personas defined
  - Category design direction
  - Child coordination guidelines
  - Navigation within category
  </action>
</check>

<check if="entity_type == 'coordination_unit'">
  <action>Validate Coordination Unit sections:
  - Module orchestration UX
  - Shared components
  - Integration patterns
  - Cross-module flows
  </action>
</check>

<check if="entity_type == 'business_module'">
  <action>Validate Business Module sections:
  - User flows complete
  - Screen designs for all views
  - Component specifications
  - All states documented (loading, error, empty, success)
  - Accessibility implementation
  - Responsive behavior
  </action>
</check>

<action>Record pass/fail for each item</action>
</step>

<step n="6" goal="Content Quality Validation">
<action>Check content quality:
- No unfilled template placeholders
- All referenced designs exist
- Design decisions have rationale
- Revision history present
</action>

<action>Record pass/fail for each item</action>
</step>

<step n="7" goal="Generate Validation Report">
<action>Calculate results:
- Total items checked
- Items passed
- Items failed
- Items with warnings
- Pass rate percentage
</action>

<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 {entity_type_display} UX VALIDATION RESULTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

| Category               | Pass         | Fail         | Warn         |
| ---------------------- | ------------ | ------------ | ------------ |
| Structural             | {pass}       | {fail}       | {warn}       |
| Parent Alignment       | {pass}       | {fail}       | {warn}       |
| Constitution Alignment | {pass}       | {fail}       | {warn}       |
| Entity-Specific        | {pass}       | {fail}       | {warn}       |
| Content Quality        | {pass}       | {fail}       | {warn}       |
| **TOTAL**              | {total_pass} | {total_fail} | {total_warn} |

**Pass Rate:** {pass_rate}%
**Status:** {status}
**Parent Alignment:** {parent_status}
**Constitution Alignment:** {constitution_status}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>

<check if="pass_rate < 80">
  <output>
⚠️ VALIDATION FAILED

Issues requiring attention:
{failed_items_list}
</output>
<ask>Would you like to address these issues now? (y/n)</ask>
</check>

<check if="pass_rate >= 80">
  <output>✅ Validation passed!</output>
</check>

<action>Save validation report to {validation_report_path}</action>
</step>

</workflow>
