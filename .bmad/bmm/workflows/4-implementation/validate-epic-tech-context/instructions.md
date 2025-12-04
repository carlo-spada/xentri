# Epic Tech Context Validation Instructions

<critical>The workflow execution engine is governed by: {project-root}/.bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>Communicate all responses in {communication_language}</critical>

## Purpose

Epic Tech Context documents provide the technical specification and implementation guidance for a specific epic. They bridge high-level epics with actionable stories.

This validation workflow ensures the epic tech context:

1. Contains all required sections for story generation
2. Aligns with the PRD and architecture
3. Provides sufficient detail for story creation
4. Has no placeholder or incomplete content

<workflow>

<step n="0" goal="Entity detection and epic selection">
<action>Invoke {select_entity_task} to get user's entity selection</action>
<action>Resolve {output_folder_resolved} from entity selection</action>

<check if="{output_folder_resolved} not resolved">
  <output>
⚠️ **Entity Selection Required**

Please specify which entity contains the epic tech context to validate.
</output>
<action>Exit workflow</action>
</check>

<action>List available epic tech context files in {sprint_artifacts}</action>
<output>
**Available Epic Tech Contexts:**
{{epic_tech_context_list}}
</output>

<ask>Which epic tech context would you like to validate? (Enter epic ID, e.g., "1" for epic-1)</ask>
<action>Store {epic_id} from user input</action>
<action>Resolve {epic_tech_context_path}</action>

<check if="file not found">
  <output>
⚠️ **Epic Tech Context Not Found**

Expected location: {epic_tech_context_path}

The epic tech context document must exist before validation.

**Options:**

1. Run the `epic-tech-context` workflow to create it
2. Verify the epic ID is correct

  </output>
  <action>Exit workflow</action>
</check>

<action>Load the complete epic tech context document</action>
<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Epic Tech Context Validation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Entity: {current_level_name}
Epic: {epic_id}
Document: {epic_tech_context_path}
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
    - Document has proper frontmatter
    - Epic ID matches file name
    - No placeholder values remain
  </check>

  <check name="required-sections">
    - Epic summary exists and matches epics.md
    - Technical approach documented
    - Story breakdown included
    - Acceptance criteria defined per story
  </check>

  <check name="formatting">
    - Markdown headers properly structured
    - Code examples use proper syntax
    - No orphaned sections
  </check>
</validation-checks>

<action>Record structural findings</action>
<template-output>structural_findings</template-output>
</step>

<step n="2" goal="PRD Alignment Validation">
<action>Load PRD from {prd_path} (if exists)</action>

<check if="prd_exists">
  <validation-checks>
    <check name="requirement-coverage">
      - All referenced requirements exist in PRD
      - Requirement IDs are correct format
      - No requirements missed for this epic
    </check>

    <check name="scope-alignment">
      - Epic scope matches PRD scope
      - No scope creep beyond PRD
      - Feature boundaries respected
    </check>

  </validation-checks>
</check>

<check if="!prd_exists">
  <output>ℹ️ No PRD found — skipping PRD alignment checks</output>
</check>

<action>Record PRD alignment findings</action>
<template-output>prd_findings</template-output>
</step>

<step n="3" goal="Architecture Alignment Validation">
<action>Load architecture from {architecture_path} (if exists)</action>

<check if="architecture_exists">
  <validation-checks>
    <check name="technical-decisions">
      - Technology choices align with architecture
      - No architectural violations
      - ADR references are accurate
    </check>

    <check name="integration-patterns">
      - Data patterns match architecture
      - API patterns follow standards
      - Event patterns are consistent
    </check>

    <check name="security-multi-tenancy">
      - Security requirements addressed
      - Multi-tenancy considerations included
    </check>

  </validation-checks>
</check>

<check if="!architecture_exists">
  <output>ℹ️ No architecture found — skipping architecture alignment checks</output>
</check>

<action>Record architecture alignment findings</action>
<template-output>architecture_findings</template-output>
</step>

<step n="4" goal="Story Readiness Validation">
<action>Evaluate story breakdown quality</action>

<validation-checks>
  <check name="story-completeness">
    - Each story has clear title and description
    - Stories are appropriately sized
    - Acceptance criteria are specific and testable
    - Dependencies between stories identified
  </check>

  <check name="implementation-guidance">
    - Technical approach clear enough to start coding
    - Key implementation decisions documented
    - Known complexities called out
    - Testing approach identified
  </check>
</validation-checks>

<action>Record story readiness findings</action>
<template-output>story_findings</template-output>
</step>

<step n="5" goal="Generate Validation Report">
<action>Compile all findings into validation report</action>

<action>Calculate validation score:

- PASS: All required sections present, aligns with PRD/architecture
- CONDITIONAL PASS: Minor issues that don't block story creation
- FAIL: Missing sections, misalignment, or critical issues
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

<step n="6" goal="Save Report and Provide Next Steps">
<action>Save validation report to {default_output_file}</action>

<check if="validation_status == 'PASS'">
  <output>
✅ **Epic Tech Context Validated Successfully**

Epic {epic_id} is ready for story creation.

**Next Steps:**

- Create stories using `create-story` workflow
- Begin implementation planning

**Report saved:** {default_output_file}
</output>
</check>

<check if="validation_status == 'CONDITIONAL PASS'">
  <output>
⚠️ **Epic Tech Context Conditionally Validated**

Minor issues identified but not blocking.

**Recommended Actions:**
{{recommended_actions}}

**Options:**

1. Fix issues using `amend-epic-tech-context` workflow
2. Proceed with story creation with awareness of issues

**Report saved:** {default_output_file}
</output>
</check>

<check if="validation_status == 'FAIL'">
  <output>
❌ **Epic Tech Context Validation Failed**

Critical issues must be resolved before proceeding.

**Required Actions:**
{{required_actions}}

**Next Step:**
Run `amend-epic-tech-context` workflow to address issues.

**Report saved:** {default_output_file}
</output>
</check>
</step>

</workflow>
