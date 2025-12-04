# System PRD Validation Workflow

<critical>This validates the Constitution PRD at docs/platform/prd.md</critical>
<critical>The workflow execution engine is governed by: {project-root}/.bmad/core/tasks/workflow.xml</critical>

<workflow>

<step n="1" goal="Load Constitution PRD">
<action>Load the System PRD from {prd_path}</action>

<check if="file not found">
  <output>❌ Constitution PRD not found at docs/platform/prd.md

Use create-system-prd workflow to create it first.</output>
<action>Exit workflow</action>
</check>

<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 CONSTITUTION PRD VALIDATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Validating: docs/platform/prd.md
Entity Type: Constitution
Date: {date}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>
</step>

<step n="2" goal="Structural Validation">
<action>Load checklist: {checklist}</action>

<action>Check document structure:

1. Frontmatter present with required fields
2. All required sections present
3. No unfilled template variables
4. Proper markdown formatting
   </action>

<action>Record results for each check:

- PASS: Check satisfied
- FAIL: Check failed with reason
- WARN: Non-critical issue
  </action>
  </step>

<step n="3" goal="Platform Requirements Validation">
<action>Validate PR-xxx requirements:

For each Platform Requirement found:

1. Has unique PR-xxx identifier
2. Has clear, testable requirement statement
3. Has rationale explaining WHY
4. Has enforcement mechanism (how verified)
5. Sequential numbering (no gaps)

Also check:

- Minimum coverage of key areas (multi-tenancy, events, auth, etc.)
- No contradictions between PRs
- No duplicate requirements
  </action>
  </step>

<step n="4" goal="Integration Contracts Validation">
<action>Validate IC-xxx contracts:

For each Integration Contract found:

1. Has unique IC-xxx identifier
2. Has clear interface definition
3. Specifies required fields/methods
4. Has version if applicable
5. Sequential numbering (no gaps)

Also check:

- Core contracts defined (event envelope, module registration, etc.)
- No contradictions between ICs
- Contracts are implementable
  </action>
  </step>

<step n="5" goal="Governance Validation">
<action>Check governance section:

1. Change process documented
2. Protected documents listed
3. Commit format specified
4. Approval requirements clear
   </action>
   </step>

<step n="6" goal="Downstream Coverage Check">
<action>Scan for downstream documents that reference this Constitution:

1. Find all PRDs in docs/ hierarchy
2. Check each references Constitution correctly
3. Identify any orphan references to non-existent PR/IC
4. Generate coverage map
   </action>

<output>
📊 Downstream Coverage
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{coverage_map}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>
</step>

<step n="6b" goal="Traceability Check (Optional)">
<action>Check if system-level epics.md exists</action>

<check if="docs/platform/epics.md exists">
  <invoke-task name="verify-traceability">
    <param name="prd_path">{prd_path}</param>
    <param name="epics_path">docs/platform/epics.md</param>
    <param name="entity_type">constitution</param>
    <param name="fr_prefix">PR/IC</param>
  </invoke-task>

  <output>
📊 Constitution Traceability Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PR-xxx Coverage: {traceability.pr_coverage_percent}%
IC-xxx Coverage: {traceability.ic_coverage_percent}%
Orphaned PRs: {traceability.orphaned_prs}
Orphaned ICs: {traceability.orphaned_ics}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>
</check>

<check if="docs/platform/epics.md does not exist">
  <output>ℹ️ No system epics.md found - traceability check skipped.

Note: Constitution epics (docs/platform/epics.md) should trace
PR-xxx and IC-xxx to system-level implementation work.
</output>
</check>
</step>

<step n="7" goal="Generate Validation Report">
<action>Compile all validation results into report:

Structure:

1. Executive Summary (PASS/FAIL/WARN counts)
2. Structural Checks
3. PR-xxx Validation
4. IC-xxx Validation
5. Governance Validation
6. Downstream Coverage
7. Traceability (if applicable)
8. Recommendations
   </action>

<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 VALIDATION REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Document: docs/platform/prd.md
Date: {date}

**Summary**
| Status | Count |
|--------|-------|
| ✅ PASS | {pass_count} |
| ❌ FAIL | {fail_count} |
| ⚠️ WARN | {warn_count} |

**Overall: {overall_status}**

{detailed_results}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>

<check if="fail_count > 0">
  <ask>Would you like to address the failed checks now? (y/n)</ask>
  <check if="response == 'y'">
    <action>Guide user through fixing each failure</action>
  </check>
</check>

<ask>Save validation report to {validation_report_path}? (y/n)</ask>
<check if="response == 'y'">
<action>Create validation-reports directory if needed</action>
<action>Save report to file</action>
<output>✅ Report saved: {validation_report_path}</output>
</check>
</step>

</workflow>
