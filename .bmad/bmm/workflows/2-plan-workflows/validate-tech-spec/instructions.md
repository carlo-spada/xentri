# Technical Specification Validation Instructions

<critical>The workflow execution engine is governed by: {project-root}/.bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>Communicate all responses in {communication_language}</critical>

## Purpose

Technical specifications bridge the gap between product requirements and implementation. They define the "how" at a level of detail that enables story generation and development.

This validation workflow ensures the tech spec:

1. Contains all required sections for the scope
2. Provides sufficient technical clarity for story generation
3. Aligns with existing architecture (if applicable)
4. Has no placeholder or incomplete content

<workflow>

<step n="0" goal="Entity detection and tech spec verification">
<action>Invoke {select_entity_task} to get user's entity selection</action>
<action>Resolve {output_folder_resolved} from entity selection</action>

<check if="{output_folder_resolved} not resolved">
  <output>
⚠️ **Entity Selection Required**

Please specify which entity's tech spec you want to validate.
</output>
<action>Exit workflow</action>
</check>

<action>Check if {tech_spec_path} exists</action>

<check if="file not found">
  <output>
⚠️ **Tech Spec Not Found**

Expected location: {tech_spec_path}

The technical specification document must exist before validation.

**Options:**

1. Run the `tech-spec` workflow to create it
2. Manually create the document at the expected location

  </output>
  <action>Exit workflow</action>
</check>

<action>Load the complete tech spec document</action>
<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Tech Spec Validation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Entity: {current_level_name}
Document: {tech_spec_path}
Validator: {user_name}
Date: {date}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>
</step>

<step n="1" goal="Structural Validation">
<action>Load {checklist}</action>
<action>Check document against structural requirements</action>

<validation-checks>
  <check name="frontmatter">
    - Document has proper frontmatter (Title, Date, Author, Change Type)
    - No placeholder values ({{variable}}, [TODO], etc.)
    - Change type specified (simple-change OR feature)
  </check>

  <check name="required-sections">
    - Summary/Overview exists and is substantive
    - Scope section clearly defines boundaries
    - Technical approach documented
    - Story breakdown included (if feature type)
    - Acceptance criteria defined
  </check>

  <check name="formatting">
    - Markdown headers are properly structured
    - Code blocks use proper syntax highlighting
    - No orphaned sections or broken structure
  </check>
</validation-checks>

<action>Record structural findings</action>
<template-output>structural_findings</template-output>
</step>

<step n="2" goal="Technical Content Validation">
<action>Evaluate technical depth and clarity</action>

<validation-checks>
  <check name="summary-overview">
    - Purpose clearly articulated
    - Scope is well-bounded
    - Dependencies identified
  </check>

  <check name="technical-approach">
    - Approach is feasible and practical
    - Rationale provided for key decisions
    - Aligns with existing architecture (if exists)
    - No over-engineering for scope
  </check>

  <check name="implementation-details">
    - Level of detail appropriate for scope
    - Data structures defined (if applicable)
    - API contracts specified (if applicable)
    - Error handling considered
  </check>

  <check name="story-breakdown" conditional="change_type == 'feature'">
    - Stories are appropriately sized
    - Each story has clear acceptance criteria
    - Dependencies between stories identified
    - Logical ordering for implementation
  </check>
</validation-checks>

<action>Record technical findings</action>
<template-output>technical_findings</template-output>
</step>

<step n="3" goal="Architecture Alignment" conditional="architecture_exists">
<action>Check tech spec alignment with architecture document</action>

<validation-checks>
  <check name="architecture-consistency">
    - Technology choices match architecture ADRs
    - Data model aligns with schema conventions
    - API patterns follow established standards
    - No architectural violations
  </check>

  <check name="integration-points">
    - Integration with existing systems documented
    - Event patterns follow architecture guidelines
    - Security requirements addressed
  </check>
</validation-checks>

<action>Record architecture alignment findings</action>
<template-output>architecture_findings</template-output>
</step>

<step n="4" goal="Generate Validation Report">
<action>Compile all findings into validation report</action>

<action>Calculate validation score:

- PASS: All required sections present, no critical issues
- CONDITIONAL PASS: Minor issues that don't block story generation
- FAIL: Missing required sections or critical quality issues
  </action>

<template-output>validation_summary</template-output>

<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Validation Results
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Overall Status:** {{validation_status}}

### Critical Issues (Must Fix)

{{critical_issues or "None identified"}}

### Warnings (Should Fix)

{{warnings or "None identified"}}

### Recommendations (Nice to Have)

{{recommendations or "None"}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>
</step>

<step n="5" goal="Save Report and Provide Next Steps">
<action>Save validation report to {default_output_file}</action>

<check if="validation_status == 'PASS'">
  <output>
✅ **Tech Spec Validated Successfully**

Your technical specification is ready for story generation.

**Next Steps:**

- Generate stories using `create-story` workflow
- Or proceed directly to implementation

**Report saved:** {default_output_file}
</output>
</check>

<check if="validation_status == 'CONDITIONAL PASS'">
  <output>
⚠️ **Tech Spec Conditionally Validated**

Minor issues identified but not blocking.

**Recommended Actions:**
{{recommended_actions}}

**Options:**

1. Fix issues now using `amend-tech-spec` workflow
2. Proceed to story generation (issues can be addressed during development)

**Report saved:** {default_output_file}
</output>
</check>

<check if="validation_status == 'FAIL'">
  <output>
❌ **Tech Spec Validation Failed**

Critical issues must be resolved before proceeding.

**Required Actions:**
{{required_actions}}

**Next Step:**
Run `amend-tech-spec` workflow to address issues.

**Report saved:** {default_output_file}
</output>
</check>
</step>

</workflow>
