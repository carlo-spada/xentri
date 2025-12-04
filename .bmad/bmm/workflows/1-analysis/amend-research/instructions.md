# Research Amendment Instructions

<critical>The workflow execution engine is governed by: {project-root}/.bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>Communicate all responses in {communication_language}</critical>
<critical>Generate all document updates in {document_output_language}</critical>
<critical>Web research is ENABLED for fact-checking and source updates</critical>

## Purpose

This workflow guides amendments to research documents. Amendments may be triggered by:

1. **Validation Issues** — Fixes from validate-research workflow
2. **Source Updates** — Fixing broken links or adding citations
3. **Content Refresh** — Updating stale data with current information
4. **Accuracy Fixes** — Correcting factual errors
5. **Enrichment** — Adding more depth to specific sections
6. **Insight Updates** — Refining recommendations based on new information

<workflow>

<step n="0" goal="Research document selection">
<action>List available research documents matching {research_path_pattern}</action>

<check if="no research documents found">
  <output>
⚠️ **No Research Documents Found**

Cannot amend a document that doesn't exist.

**Action Required:**
Run the `research` workflow to create one first.
</output>
<action>Exit workflow</action>
</check>

<output>
**Available Research Documents:**
{{research_doc_list}}
</output>

<ask>Which research document would you like to amend?</ask>
<action>Store selected document path</action>
<action>Determine {research_type} from filename</action>
<action>Load the complete research document</action>
<action>Parse document structure</action>

<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 Research Amendment
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Document:    {{selected_document}}
Type:        {research_type}
Amending:    {user_name}
Date:        {date}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Current Sections:**
{{section_list}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>
</step>

<step n="1" goal="Identify amendment type">
<action>Present amendment options to user</action>

<output>
**What type of amendment do you need?**

1. **Fix Validation Issues** — Address issues from validation report
2. **Update Sources** — Fix broken links, add missing citations
3. **Refresh Data** — Update statistics and market data
4. **Correct Inaccuracies** — Fix factual errors
5. **Add Depth** — Expand sections that need more detail
6. **Refine Insights** — Update recommendations and conclusions
7. **Full Refresh** — Comprehensive update with new research

</output>

<ask>Select amendment type (1-7) or describe what you need to change:</ask>

<action>Store amendment_type based on user selection</action>
<action>Initialize amendment_log</action>
</step>

<step n="2" goal="Gather amendment context" conditional="based on amendment_type">

<check if="amendment_type == 'validation_issues'">
  <action>Check for recent validation report</action>
  <check if="validation report found">
    <output>
**Issues from Validation Report:**
{{validation_issues}}

Let's address these one by one.
</output>
</check>
<check if="validation report not found">
<ask>No recent validation report found. What specific issues need to be fixed?</ask>
</check>
</check>

<check if="amendment_type == 'update_sources'">
  <output>
**Current Sources:**
{{current_sources}}
  </output>
  <ask>Which sources need updating? (broken links, missing citations, outdated sources)</ask>
</check>

<check if="amendment_type == 'refresh_data'">
  <output>
**Sections with Data:**
{{data_sections}}
  </output>
  <ask>Which data needs refreshing? I can search for current information.</ask>
</check>

<check if="amendment_type == 'correct_inaccuracies'">
  <ask>What inaccuracies need to be corrected? Please describe the errors.</ask>
</check>

<check if="amendment_type == 'add_depth'">
  <output>
**Available Sections:**
{{numbered_section_list}}
  </output>
  <ask>Which sections need more depth? What information should be added?</ask>
</check>

<check if="amendment_type == 'refine_insights'">
  <output>
**Current Key Findings:**
{{current_findings}}

**Current Recommendations:**
{{current_recommendations}}
</output>
<ask>What insights need refining based on new information?</ask>
</check>

<check if="amendment_type == 'full_refresh'">
  <output>
⚠️ **Full Refresh**

This will update multiple sections with fresh research.
Web research is enabled for fact-checking.

  </output>
  <ask>What areas should be prioritized in the refresh?</ask>
</check>

<action>Record amendment context</action>
</step>

<step n="3" goal="Execute amendments" repeat="until-complete">

<check if="requires_web_research">
  <action>Perform web research to gather current information</action>
  <action>Verify facts and update data</action>
  <action>Document new sources</action>
</check>

<action>For each change:

1. Show current content
2. Present updated content (with sources if applicable)
3. Highlight what changed
4. Get user approval
5. Apply change
6. Log amendment with source references
   </action>

<action>Ensure all new claims have citations</action>
<action>Verify source URLs are accessible</action>

<template-output>section_updates</template-output>

<ask>Continue with next change, or are amendments complete?</ask>
</step>

<step n="4" goal="Source verification">
<action>Verify all sources and links in amended document</action>

<validation-checks>
  <check name="all-claims-cited">
    - New statistics have sources
    - New claims are supported
    - Source URLs are accessible
  </check>
</validation-checks>

<check if="source_issues_found">
  <output>
⚠️ **Source Issues Found**

{{source_issues}}

Please address before saving.
</output>
<action>Return to step 3</action>
</check>

<output>
✅ All sources verified
</output>
</step>

<step n="5" goal="Save amended document and log">
<action>Update document date/metadata</action>
<action>Save updated research document</action>
<action>Generate amendment log</action>
<action>Save amendment log to {amendment_log_file}</action>

<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Research Amendment Complete
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Document Updated:** {{selected_document}}
**Amendment Log:** {amendment_log_file}

**Changes Made:**
{{amendment_summary}}

**Sources Added/Updated:**
{{source_changes}}

**Next Steps:**
{{#if needs_revalidation}}

- Run `validate-research` to confirm fixes
  {{/if}}
- Use updated research to inform decisions

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>
</step>

</workflow>
