# Domain PRD Validation Workflow

<critical>This validates PRDs for: Infrastructure Module, Strategic Container, Coordination Unit, Business Module</critical>
<critical>The workflow execution engine is governed by: {project-root}/.bmad/core/tasks/workflow.xml</critical>
<critical>Key validation: INHERITANCE - PRD must not contradict parent or Constitution</critical>

<workflow>

<step n="0" goal="Determine Entity Type and Load PRD">
<check if="entity_type is not set">
  <invoke-task name="detect-entity-type">
    <param name="prompt_user">true</param>
  </invoke-task>
</check>

<check if="entity_type == 'constitution'">
  <output>⚠️ Constitution detected. Use validate-system-prd workflow instead.</output>
  <action>Exit workflow</action>
</check>

<action>Load PRD from {prd_path}</action>

<check if="file not found">
  <output>❌ PRD not found at {prd_path}

Use create-domain-prd workflow to create it first.</output>
  <action>Exit workflow</action>
</check>

<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 {entity_type_display} PRD VALIDATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Validating: {prd_path}
Entity Type: {entity_type_display}
Parent PRD: {parent_prd_path}
Date: {date}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>
</step>

<step n="1" goal="Load Parent Context">
<action>Load Constitution from {constitution_path}</action>
<action>Extract all PR-xxx and IC-xxx</action>

<check if="parent_prd_path is not empty">
  <action>Load Parent PRD from {parent_prd_path}</action>
  <action>Extract parent's FR-xxx requirements</action>
  <action>Extract parent's scope boundaries</action>
</check>
</step>

<step n="2" goal="Structural Validation">
<action>Select appropriate checklist based on entity type:</action>

<check if="entity_type == 'infrastructure_module'">
  <action>Load: {checklist_infrastructure}</action>
</check>
<check if="entity_type == 'strategic_container'">
  <action>Load: {checklist_strategic}</action>
</check>
<check if="entity_type == 'coordination_unit'">
  <action>Load: {checklist_coordination}</action>
</check>
<check if="entity_type == 'business_module'">
  <action>Load: {checklist_business}</action>
</check>

<action>Check document structure:
1. Frontmatter present with required fields
   - entity_type matches expected
   - parent_prd referenced
   - fr_prefix correct
2. All required sections present for entity type
3. No unfilled template variables
4. Proper markdown formatting
</action>
</step>

<step n="3" goal="Inheritance Validation">
<invoke-task name="validate-inheritance">
  <param name="document_path">{prd_path}</param>
  <param name="document_content">{prd_content}</param>
  <param name="entity_type">{entity_type}</param>
  <param name="parent_prd_path">{parent_prd_path}</param>
</invoke-task>

<check if="validation.is_valid == false">
  <output>
❌ INHERITANCE VIOLATIONS DETECTED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{validation.validation_report}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>
  <action>Mark as CRITICAL FAIL</action>
</check>

<check if="validation.warnings exist">
  <output>⚠️ Inheritance Warnings:
{validation.warnings}</output>
</check>
</step>

<step n="4" goal="Functional Requirements Validation">
<action>Validate FR-xxx requirements:

For each Functional Requirement:
1. Has correct prefix format ({fr_prefix}-xxx)
2. Sequential numbering (no gaps)
3. Clear, testable requirement statement
4. Actor and capability specified
5. Not duplicating parent FRs (should reference instead)
6. Not contradicting parent FRs

Coverage check:
- Adequate requirements for entity scope
- Key capability areas addressed
</action>
</step>

<step n="5" goal="Entity-Specific Validation">

<check if="entity_type == 'infrastructure_module'">
  <action>Validate Infrastructure Module specifics:
  1. Exposed Interfaces section present
  2. Consumed Interfaces section present
  3. Implementation scope clear
  4. Integration with other modules documented
  </action>
</check>

<check if="entity_type == 'strategic_container'">
  <action>Validate Strategic Container specifics:
  1. Strategic Alignment section present
  2. Child Coordination section present
  3. Category-level focus (not too granular)
  4. Subcategory guidance provided
  </action>
</check>

<check if="entity_type == 'coordination_unit'">
  <action>Validate Coordination Unit specifics:
  1. Module Orchestration section present
  2. Integration Points section present
  3. Subcategory-level focus
  4. Module coordination patterns clear
  </action>
</check>

<check if="entity_type == 'business_module'">
  <action>Validate Business Module specifics:
  1. User-facing requirements present
  2. User stories or acceptance criteria
  3. Module-level granularity (not too broad)
  4. Integration with siblings documented if applicable
  </action>
</check>
</step>

<step n="6" goal="Traceability Check" optional="true">
<action>Check if epics.md exists for this entity</action>

<check if="epics file exists">
  <invoke-task name="verify-traceability">
    <param name="prd_path">{prd_path}</param>
    <param name="epics_path">{output_folder_resolved}epics.md</param>
    <param name="entity_type">{entity_type}</param>
    <param name="fr_prefix">{fr_prefix}</param>
  </invoke-task>

  <output>
📊 Traceability Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Coverage: {traceability.coverage_percent}%
Orphaned FRs: {traceability.orphaned_frs}
Orphaned Stories: {traceability.orphaned_stories}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>
</check>

<check if="epics file does not exist">
  <output>ℹ️ No epics.md found - traceability check skipped</output>
</check>
</step>

<step n="7" goal="Generate Validation Report">
<action>Compile all validation results:

Structure:
1. Executive Summary
2. Inheritance Validation (CRITICAL)
3. Structural Checks
4. FR-xxx Validation
5. Entity-Specific Checks
6. Traceability (if applicable)
7. Recommendations
</action>

<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 VALIDATION REPORT: {entity_type_display}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Document: {prd_path}
Date: {date}

**Summary**
| Status | Count |
|--------|-------|
| ✅ PASS | {pass_count} |
| ❌ FAIL | {fail_count} |
| ⚠️ WARN | {warn_count} |

**Overall: {overall_status}**

**Inheritance: {inheritance_status}**

{detailed_results}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>

<check if="fail_count > 0">
  <ask>Would you like to address the failed checks now? (y/n)</ask>
  <check if="response == 'y'">
    <action>Guide user through fixing each failure</action>
  </check>
</check>

<ask>Save validation report? (y/n)</ask>
<check if="response == 'y'">
  <action>Create validation-reports directory if needed</action>
  <action>Save report to {validation_report_path}</action>
  <output>✅ Report saved: {validation_report_path}</output>
</check>
</step>

</workflow>
