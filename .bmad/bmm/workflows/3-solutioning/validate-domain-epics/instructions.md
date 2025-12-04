# Domain Epics Validation Workflow

<critical>This validates domain-level epics against quality standards, traceability, and inheritance</critical>
<critical>Communicate all responses in {communication_language}</critical>
<critical>INHERITANCE: Must validate alignment with Constitution and parent epics</critical>

<shared-tasks>
  <task name="select-entity" path="{project-root}/.bmad/bmm/tasks/select-entity.xml" />
  <task name="detect-entity-type" path="{project-root}/.bmad/bmm/tasks/detect-entity-type.xml" />
  <task name="validate-inheritance" path="{project-root}/.bmad/bmm/tasks/validate-inheritance.xml" />
  <task name="verify-traceability" path="{project-root}/.bmad/bmm/tasks/verify-traceability.xml" />
</shared-tasks>

<workflow>

<step n="1" goal="Detect Entity Type and Load Context">
<check if="entity_type is not set or empty">
  <invoke-task name="select-entity">
    <param name="prompt_user">true</param>
  </invoke-task>
</check>

<check if="entity_type == 'constitution'">
  <output>⚠️ Constitution detected. Use validate-system-epics workflow instead.</output>
  <action>Exit workflow</action>
</check>

<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 {entity_type_display} EPICS VALIDATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Validating: {output_folder_resolved}epics.md
Against PRD: {output_folder_resolved}prd.md
Parent: {parent_epics_path}
Constitution: docs/platform/epics.md
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>

<invoke-protocol name="discover_inputs" />

<check if="epics_to_validate is empty">
  <output>❌ No epics document found at {output_folder_resolved}epics.md
Please create epics first using create-domain-epics workflow.</output>
  <action>Exit workflow</action>
</check>
</step>

<step n="2" goal="Structural Validation">
<action>Select appropriate checklist based on entity type:
- Infrastructure Module: {checklist_infrastructure}
- Strategic Container: {checklist_strategic}
- Coordination Unit: {checklist_coordination}
- Business Module: {checklist_business}

Validate document structure against selected checklist.
</action>

<output>
**Structural Validation Results:**
| Check | Status | Notes |
|-------|--------|-------|
| Frontmatter | ✅/❌ | entity_type: {entity_type} |
| Requirements Inventory | ✅/❌ | ... |
| Parent Mapping | ✅/❌ | ... |
| Epic Structure | ✅/❌ | ... |
| ... | ... | ... |
</output>
</step>

<step n="3" goal="Inheritance Validation">
<invoke-task name="validate-inheritance">
  <param name="document_content">{epics_content}</param>
  <param name="entity_type">{entity_type}</param>
  <param name="parent_path">{parent_epics_path}</param>
</invoke-task>

<output>
**Inheritance Validation:**

**Constitution Alignment:**

| Constitution Epic | This Entity Contribution | Status |
| ----------------- | ------------------------ | ------ |
| Epic 1            | ...                      | ✅/❌  |
| ...               | ...                      | ...    |

**Parent Alignment:**

| Parent Epic | This Entity Extension | Status |
| ----------- | --------------------- | ------ |
| Epic X-Y    | Epic X-Y-Z            | ✅/❌  |
| ...         | ...                   | ...    |

**Cascading ID Validation:**

- [ ] All epic IDs follow {parent_id}-{local_id} pattern
- [ ] No skip-level references
- [ ] Parent epic IDs are valid

**Violations:** {list_violations}
</output>
</step>

<step n="4" goal="Traceability Validation">
<invoke-task name="verify-traceability">
  <param name="prd_path">{output_folder_resolved}prd.md</param>
  <param name="epics_content">{epics_content}</param>
  <param name="entity_type">{entity_type}</param>
</invoke-task>

<output>
**Traceability Validation:**

**FR Coverage:**

| FR ID  | Description | Epic | Story | Status |
| ------ | ----------- | ---- | ----- | ------ |
| FR-xxx | ...         | ...  | ...   | ✅/❌  |
| ...    | ...         | ...  | ...   | ...    |

**Coverage Summary:**

- Total FRs: X
- Covered: X
- Missing: X

**Missing Coverage:** {list_uncovered_requirements}
</output>
</step>

<step n="5" goal="Quality Validation">
<action>Check entity-specific quality standards:

**Epic Quality (Entity-Specific):**
</action>

<check if="entity_type == 'infrastructure_module'">
  <action>Infrastructure Module checks:
  - [ ] Epics implement Constitution PR/IC requirements
  - [ ] Service boundaries are clear
  - [ ] API development stories are complete
  - [ ] Integration points defined
  </action>
</check>

<check if="entity_type == 'strategic_container'">
  <action>Strategic Container checks:
  - [ ] Category-level outcomes defined
  - [ ] Child coordination is clear
  - [ ] Strategic alignment documented
  </action>
</check>

<check if="entity_type == 'coordination_unit'">
  <action>Coordination Unit checks:
  - [ ] Module orchestration defined
  - [ ] Integration points between children
  - [ ] Shared services identified
  </action>
</check>

<check if="entity_type == 'business_module'">
  <action>Business Module checks:
  - [ ] Each epic delivers USER VALUE
  - [ ] Stories are vertically sliced
  - [ ] UI/UX implementation details present
  - [ ] No technical-layer-only epics
  </action>
</check>

<output>
**Quality Validation Results:**
| Category | Pass | Fail | Warn |
|----------|------|------|------|
| Epic Quality | X | X | X |
| Story Quality | X | X | X |
| Entity-Specific | X | X | X |
</output>
</step>

<step n="6" goal="Generate Validation Report">
<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 {entity_type_display} EPICS VALIDATION REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Document: {output_folder_resolved}epics.md
Date: {date}
Validator: {user_name}

**Overall Status:** ✅ PASS / ⚠️ WARN / ❌ FAIL

**Summary:**

| Category     | Pass | Fail | Warn |
| ------------ | ---- | ---- | ---- |
| Structural   | X    | X    | X    |
| Inheritance  | X    | X    | X    |
| Traceability | X    | X    | X    |
| Quality      | X    | X    | X    |
| **TOTAL**    | X    | X    | X    |

**Critical Issues:** {list_critical_issues}

**Recommendations:** {list_recommendations}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>

<ask>Save validation report to file? (y/n)</ask>
<check if="response == 'y'">
<action>Save report to {validation_report_path}epics-validation-{entity_name}-{date}.md</action>
</check>
</step>

</workflow>
