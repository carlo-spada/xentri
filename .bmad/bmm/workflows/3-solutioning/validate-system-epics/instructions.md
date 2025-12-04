# System Epics Validation Workflow

<critical>This validates Constitution-level epics against quality standards and traceability requirements</critical>
<critical>Communicate all responses in {communication_language}</critical>

<shared-tasks>
  <task name="verify-traceability" path="{project-root}/.bmad/bmm/tasks/verify-traceability.xml" />
</shared-tasks>

<workflow>

<step n="1" goal="Load Epics and PRD">
<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 CONSTITUTION EPICS VALIDATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Validating: docs/platform/epics.md
Against: docs/platform/prd.md
Checklist: constitution-epics-checklist.md
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>

<invoke-protocol name="discover_inputs" />

<check if="epics_to_validate is empty">
  <output>❌ No epics document found at docs/platform/epics.md
Please create epics first using create-system-epics workflow.</output>
  <action>Exit workflow</action>
</check>
</step>

<step n="2" goal="Structural Validation">
<action>Validate document structure against checklist:

Load {checklist} and check:

**Structural Completeness:**

- [ ] Frontmatter present with entity_type: constitution
- [ ] Requirements Inventory section
- [ ] Epic Summary section
- [ ] Each epic has goal, scope, stories
- [ ] Traceability Matrix section
- [ ] Coordination Model section

Record findings for each item.
</action>

<output>
**Structural Validation Results:**
| Check | Status | Notes |
|-------|--------|-------|
| Frontmatter | ✅/❌ | ... |
| Requirements Inventory | ✅/❌ | ... |
| ... | ... | ... |
</output>
</step>

<step n="3" goal="Traceability Validation">
<invoke-task name="verify-traceability">
  <param name="prd_path">{output_folder_resolved}prd.md</param>
  <param name="epics_content">{epics_content}</param>
  <param name="entity_type">constitution</param>
</invoke-task>

<output>
**Traceability Validation:**

**PR Coverage:**
| PR ID | Covered | Epic | Story |
|-------|---------|------|-------|
| PR-001 | ✅/❌ | ... | ... |
| ... | ... | ... | ... |

**IC Coverage:**
| IC ID | Covered | Epic | Story |
|-------|---------|------|-------|
| IC-001 | ✅/❌ | ... | ... |
| ... | ... | ... | ... |

**Missing Coverage:** {list_uncovered_requirements}
</output>
</step>

<step n="4" goal="Quality Validation">
<action>Check epic quality standards:

**Epic Quality:**

- [ ] Each epic has clear user value statement
- [ ] Epic goals are measurable
- [ ] Dependencies are valid (no forward dependencies)
- [ ] Cascading ID pattern is correct

**Story Quality:**

- [ ] Stories follow BDD format (Given/When/Then)
- [ ] Acceptance criteria are testable
- [ ] Prerequisites reference valid previous stories
- [ ] Technical notes provide implementation guidance

**Coordination Quality:**

- [ ] Infrastructure Module coordination is defined
- [ ] Child inheritance pattern is documented
      </action>

<output>
**Quality Validation Results:**
| Category | Pass | Fail | Warn |
|----------|------|------|------|
| Epic Quality | X | X | X |
| Story Quality | X | X | X |
| Coordination | X | X | X |
</output>
</step>

<step n="5" goal="Generate Validation Report">
<action>Compile complete validation report</action>

<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 CONSTITUTION EPICS VALIDATION REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Document: docs/platform/epics.md
Date: {date}
Validator: {user_name}

**Overall Status:** ✅ PASS / ⚠️ WARN / ❌ FAIL

**Summary:**
| Category | Pass | Fail | Warn |
|----------|------|------|------|
| Structural | X | X | X |
| Traceability | X | X | X |
| Quality | X | X | X |
| **TOTAL** | X | X | X |

**Critical Issues:** {list_critical_issues}

**Recommendations:** {list_recommendations}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>

<ask>Save validation report to file? (y/n)</ask>
<check if="response == 'y'">
<action>Save report to {validation_report_path}epics-validation-constitution-{date}.md</action>
</check>
</step>

</workflow>
