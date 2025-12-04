# Research Validation Instructions

<critical>The workflow execution engine is governed by: {project-root}/.bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>Communicate all responses in {communication_language}</critical>

## Purpose

Research documents inform strategic and technical decisions. They must be accurate, well-sourced, and provide actionable insights.

This validation workflow ensures research documents:

1. Have proper citations and sources
2. Present accurate, verifiable information
3. Provide actionable insights
4. Are current and relevant

<workflow>

<step n="0" goal="Research document selection">
<action>List available research documents matching {research_path_pattern}</action>

<check if="no research documents found">
  <output>
⚠️ **No Research Documents Found**

No research documents found in {output_folder}

**Options:**

1. Run the `research` workflow to create one
2. Verify the output folder is correct

  </output>
  <action>Exit workflow</action>
</check>

<output>
**Available Research Documents:**
{{research_doc_list}}
</output>

<ask>Which research document would you like to validate?</ask>
<action>Store selected document path</action>
<action>Determine {research_type} from filename</action>
<action>Load the complete research document</action>

<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Research Validation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Document:   {{selected_document}}
Type:       {research_type}
Validator:  {user_name}
Date:       {date}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>
</step>

<step n="1" goal="Structural Validation">
<action>Load {checklist}</action>
<action>Check document against structural requirements</action>

<validation-checks>
  <check name="frontmatter">
    - Document has proper frontmatter
    - Research type indicated
    - Date of research documented
    - No placeholder values
  </check>

  <check name="required-sections">
    - Executive summary exists
    - Key findings section present
    - Sources/references section exists
    - Recommendations or insights included
  </check>

  <check name="formatting">
    - Markdown headers properly structured
    - Lists and tables formatted correctly
    - Links are valid
  </check>
</validation-checks>

<action>Record structural findings</action>
<template-output>structural_findings</template-output>
</step>

<step n="2" goal="Source Quality Validation">
<action>Evaluate source quality and citations</action>

<validation-checks>
  <check name="citation-presence">
    - Key claims have citations
    - Statistics have sources
    - Quotes are attributed
  </check>

  <check name="source-quality">
    - Sources are credible (not random blogs)
    - Primary sources used where possible
    - Multiple sources for critical claims
    - Source dates are recent enough
  </check>

  <check name="link-validity">
    - Source URLs are accessible
    - Links resolve correctly
    - No broken references
  </check>
</validation-checks>

<action>Record source quality findings</action>
<template-output>source_findings</template-output>
</step>

<step n="3" goal="Content Accuracy Validation">
<action>Spot-check factual claims</action>

<validation-checks>
  <check name="factual-accuracy">
    - Statistics are plausible
    - Claims match cited sources
    - No obvious contradictions
    - Data is internally consistent
  </check>

  <check name="timeliness">
    - Information is current (not outdated)
    - Market data is recent
    - Technology references are current
    - Competitive landscape is up to date
  </check>

  <check name="completeness">
    - Research scope is covered
    - Key questions are addressed
    - No obvious gaps
    - Methodology explained (if applicable)
  </check>
</validation-checks>

<action>Record accuracy findings</action>
<template-output>accuracy_findings</template-output>
</step>

<step n="4" goal="Actionability Validation">
<action>Evaluate whether insights are actionable</action>

<validation-checks>
  <check name="insights-quality">
    - Findings lead to clear implications
    - Recommendations are specific
    - Action items are identified
    - Risks and opportunities noted
  </check>

  <check name="relevance">
    - Research addresses stated goals
    - Insights are relevant to project
    - Information is usable for decisions
  </check>
</validation-checks>

<action>Record actionability findings</action>
<template-output>actionability_findings</template-output>
</step>

<step n="5" goal="Generate Validation Report">
<action>Compile all findings</action>

<action>Calculate validation score:

- PASS: Well-sourced, accurate, actionable
- CONDITIONAL PASS: Minor issues with sources or clarity
- FAIL: Missing sources, inaccurate claims, or not actionable
  </action>

<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Validation Results
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Overall Status:** {{validation_status}}

### Critical Issues (Must Fix)

{{critical_issues or "None identified"}}

### Warnings (Should Fix)

{{warnings or "None identified"}}

### Recommendations

{{recommendations or "None"}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>
</step>

<step n="6" goal="Save Report and Provide Next Steps">
<action>Save validation report to {default_output_file}</action>

<check if="validation_status == 'PASS'">
  <output>
✅ **Research Validated Successfully**

This research document is ready to inform decisions.

**Next Steps:**

- Use insights to inform PRD or architecture
- Reference in downstream documents as needed

**Report saved:** {default_output_file}
</output>
</check>

<check if="validation_status == 'CONDITIONAL PASS'">
  <output>
⚠️ **Research Conditionally Validated**

Minor issues identified but usable with caution.

**Recommended Actions:**
{{recommended_actions}}

**Options:**

1. Fix issues using `amend-research` workflow
2. Proceed with awareness of limitations

**Report saved:** {default_output_file}
</output>
</check>

<check if="validation_status == 'FAIL'">
  <output>
❌ **Research Validation Failed**

Critical issues affect reliability.

**Required Actions:**
{{required_actions}}

**Next Step:**
Run `amend-research` workflow to address issues.

**Report saved:** {default_output_file}
</output>
</check>
</step>

</workflow>
