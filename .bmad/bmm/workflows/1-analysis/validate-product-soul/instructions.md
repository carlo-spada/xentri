# Product Soul Validation Instructions

<critical>The workflow execution engine is governed by: {project-root}/.bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>Product Soul is Constitution-level ONLY - lives at docs/product-soul.md</critical>
<critical>Communicate all responses in {communication_language}</critical>

## Purpose

The Product Soul is the foundational vision document that transcends the platform. It defines the "why" and "what" at the highest level, guiding all downstream documents (PRD, Architecture, Epics, UX Design).

This validation workflow ensures the Product Soul:

1. Contains all required sections
2. Provides sufficient clarity for PRD creation
3. Aligns with BMAD standards
4. Has no placeholder or incomplete content

<workflow>

<step n="0" goal="Verify Product Soul exists">
<action>Check if {product_soul_path} exists</action>

<check if="file not found">
  <output>
⚠️ **Product Soul Not Found**

Expected location: {product_soul_path}

The Product Soul document must exist before validation.

**Options:**

1. Run the `product-brief` workflow to create it
2. Manually create the document at the expected location

  </output>
  <action>Exit workflow</action>
</check>

<action>Load the complete Product Soul document</action>
<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌟 Product Soul Validation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Document: {product_soul_path}
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
    - Document has proper frontmatter (Date, Author, Context)
    - No placeholder values ({{variable}}, [TODO], etc.)
  </check>

  <check name="required-sections">
    - Executive Summary exists and is substantive
    - Problem Statement is clearly articulated
    - Proposed Solution describes the approach
    - Target Users are specifically defined
    - MVP Scope / Core Features are listed
  </check>

  <check name="formatting">
    - Markdown headers are properly structured (## for main sections)
    - No orphaned sections or broken structure
    - Cross-references are accurate
  </check>
</validation-checks>

<action>Record structural findings</action>
<template-output>structural_findings</template-output>
</step>

<step n="2" goal="Content Quality Validation">
<action>Evaluate content depth and clarity</action>

<validation-checks>
  <check name="executive-summary">
    - Product concept explained in 1-2 clear sentences
    - Primary problem identified
    - Value proposition is compelling and differentiated
    - Summary reflects full document content
  </check>

  <check name="problem-statement">
    - Pain points are specific (not generic)
    - Impact is quantified where possible
    - Explanation of why existing solutions fall short
    - Problem is validated with evidence or reasoning
  </check>

  <check name="solution-definition">
    - Core approach is clear (no implementation details)
    - Key differentiators identified
    - Solution aligns with stated problems
    - Vision paints clear user experience
  </check>

  <check name="target-users">
    - Avoids generic personas ("busy professionals")
    - Specific behaviors and workflows documented
    - Pain points tied to user segments
    - User goals clearly articulated
  </check>

  <check name="mvp-scope">
    - Core features are true must-haves
    - Each feature has rationale
    - Out of scope items listed
    - Scope is genuinely minimal and viable
  </check>
</validation-checks>

<action>Record content quality findings</action>
<template-output>content_findings</template-output>
</step>

<step n="3" goal="Strategic Alignment Validation">
<action>Assess strategic coherence</action>

<validation-checks>
  <check name="internal-consistency">
    - Problem → Solution → Users → Features flow logically
    - No contradictions between sections
    - Terminology is used consistently
  </check>

  <check name="completeness-for-downstream">
    - Sufficient detail for PRD creation
    - Clear enough for architecture decisions
    - User needs defined for UX design
  </check>

  <check name="language-quality">
    - Clear, jargon-free language
    - Professional tone appropriate for context
    - No ambiguous statements
  </check>
</validation-checks>

<action>Record strategic alignment findings</action>
<template-output>strategic_findings</template-output>
</step>

<step n="4" goal="Generate Validation Report">
<action>Compile all findings into validation report</action>

<action>Calculate validation score:

- PASS: All required sections present, no critical issues
- CONDITIONAL PASS: Minor issues that don't block PRD creation
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
✅ **Product Soul Validated Successfully**

Your Product Soul document is ready to guide downstream workflows.

**Next Steps:**

- Proceed to PRD workflow (`/bmad:bmm:workflows:prd`)
- The PRD will transform this vision into detailed requirements

**Report saved:** {default_output_file}
</output>
</check>

<check if="validation_status == 'CONDITIONAL PASS'">
  <output>
⚠️ **Product Soul Conditionally Validated**

Minor issues identified but not blocking.

**Recommended Actions:**
{{recommended_actions}}

**Options:**

1. Fix issues now using `amend-product-soul` workflow
2. Proceed to PRD (issues can be addressed during PRD creation)

**Report saved:** {default_output_file}
</output>
</check>

<check if="validation_status == 'FAIL'">
  <output>
❌ **Product Soul Validation Failed**

Critical issues must be resolved before proceeding.

**Required Actions:**
{{required_actions}}

**Next Step:**
Run `amend-product-soul` workflow to address issues.

**Report saved:** {default_output_file}
</output>
</check>
</step>

</workflow>
