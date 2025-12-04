# Technical Specification Amendment Instructions

<critical>The workflow execution engine is governed by: {project-root}/.bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>Communicate all responses in {communication_language}</critical>
<critical>Generate all document updates in {document_output_language}</critical>

## Purpose

This workflow guides amendments to technical specification documents. Amendments may be triggered by:

1. **Validation Issues** — Fixes from validate-tech-spec workflow
2. **Technical Refinements** — Improvements to approach or implementation details
3. **Scope Changes** — Adjustments to what's included/excluded
4. **Architecture Updates** — Alignment with new architecture decisions
5. **Story Feedback** — Insights from implementation attempts

<workflow>

<step n="0" goal="Entity detection and tech spec verification">
<action>Invoke {select_entity_task} to get user's entity selection</action>
<action>Resolve {output_folder_resolved} from entity selection</action>

<check if="{output_folder_resolved} not resolved">
  <output>
⚠️ **Entity Selection Required**

Please specify which entity's tech spec you want to amend.
</output>
<action>Exit workflow</action>
</check>

<action>Check if {tech_spec_path} exists</action>

<check if="file not found">
  <output>
⚠️ **Tech Spec Not Found**

Cannot amend a document that doesn't exist.

Expected location: {tech_spec_path}

**Action Required:**
Run the `tech-spec` workflow to create the technical specification first.
</output>
<action>Exit workflow</action>
</check>

<action>Load the complete tech spec document</action>
<action>Parse document structure and identify all sections</action>

<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 Tech Spec Amendment
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Entity:      {current_level_name}
Document:    {tech_spec_path}
Amending:    {user_name}
Date:        {date}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Current Document Sections:**
{{section_list}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>
</step>

<step n="1" goal="Identify amendment type and scope">
<action>Present amendment options to user</action>

<output>
**What type of amendment do you need?**

1. **Fix Validation Issues** — Address issues from validation report
2. **Refine Technical Approach** — Update implementation strategy
3. **Adjust Scope** — Add/remove features or change boundaries
4. **Update Stories** — Modify story breakdown or acceptance criteria
5. **Architecture Alignment** — Update for new architecture decisions
6. **Add Details** — Expand sections that need more depth
7. **Full Review** — Walk through entire document for updates

</output>

<ask>Select amendment type (1-7) or describe what you need to change:</ask>

<action>Store amendment_type based on user selection</action>
<action>Initialize amendment_log with type and timestamp</action>
</step>

<step n="2" goal="Gather amendment context" conditional="based on amendment_type">

<check if="amendment_type == 'validation_issues'">
  <action>Check for recent validation report in {output_folder_resolved}</action>
  <check if="validation report found">
    <action>Load validation report and extract issues</action>
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

<check if="amendment_type == 'refine_approach'">
  <output>
**Current Technical Approach:**
{{current_approach_section}}
  </output>
  <ask>What aspects of the technical approach need refinement? What's driving the change?</ask>
</check>

<check if="amendment_type == 'adjust_scope'">
  <output>
**Current Scope:**
{{current_scope_section}}

**Current Change Type:** {{change_type}}
</output>
<ask>What scope changes are needed? (expand, reduce, clarify boundaries)</ask>
</check>

<check if="amendment_type == 'update_stories'">
  <output>
**Current Story Breakdown:**
{{current_stories}}
  </output>
  <ask>What story changes are needed? (add, remove, split, combine, update criteria)</ask>
</check>

<check if="amendment_type == 'architecture_alignment'">
  <ask>What architecture changes need to be reflected? (new ADRs, pattern changes, etc.)</ask>
</check>

<check if="amendment_type == 'add_details'">
  <output>
**Available Sections:**
{{numbered_section_list}}
  </output>
  <ask>Which sections need more detail? What information should be added?</ask>
</check>

<check if="amendment_type == 'full_review'">
  <output>Let's walk through each section of your tech spec.</output>
</check>

<action>Record amendment context and rationale</action>
<template-output>amendment_context</template-output>
</step>

<step n="3" goal="Execute amendments" repeat="until-complete">

<check if="amendment_type == 'validation_issues' OR amendment_type == 'refine_approach' OR amendment_type == 'add_details'">
  <action>For each issue/section:
    1. Show current content
    2. Discuss what needs to change
    3. Draft updated content
    4. Get user approval
    5. Apply change to document
    6. Log the amendment
  </action>
</check>

<check if="amendment_type == 'adjust_scope'">
  <action>For scope changes:
    1. Identify what's being added/removed
    2. Update Scope section
    3. Update related sections (approach, stories, etc.)
    4. Validate change type still appropriate
    5. Log all changes
  </action>
</check>

<check if="amendment_type == 'update_stories'">
  <action>For story updates:
    1. Identify story changes needed
    2. Update story definitions
    3. Update acceptance criteria
    4. Revise dependencies if needed
    5. Ensure total scope remains appropriate
    6. Log changes
  </action>
</check>

<check if="amendment_type == 'architecture_alignment'">
  <action>For architecture alignment:
    1. Identify architecture changes
    2. Update technical approach sections
    3. Update data model sections (if applicable)
    4. Update API sections (if applicable)
    5. Verify no architectural violations
    6. Log changes
  </action>
</check>

<check if="amendment_type == 'full_review'">
  <action>Walk through each section:
    1. Summary/Overview
    2. Scope
    3. Technical Approach
    4. Implementation Details
    5. Story Breakdown (if feature)
    6. Testing Considerations

    For each: Show current → Ask for changes → Apply if needed

  </action>
</check>

<action>After each change, update the living document</action>
<template-output>section_updates</template-output>

<ask>Continue with next change, or are amendments complete?</ask>
</step>

<step n="4" goal="Impact assessment">
<action>Analyze impact of amendments on related artifacts</action>

<check if="scope_significantly_changed OR stories_changed">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ Related Artifacts Impact
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

These amendments may affect:

{{#if stories_exist}}
📋 **Existing Stories** ({output_folder_resolved}/sprint-artifacts/)

- Story scope may need updating
- Acceptance criteria may need revision
  {{/if}}

{{#if epic_context_exists}}
📚 **Epic Tech Context** ({output_folder_resolved}/sprint-artifacts/tech-spec-epic-\*.md)

- Technical context may need refresh
  {{/if}}

**Recommendation:** Review related artifacts after saving.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>
</check>

<template-output>impact_assessment</template-output>
</step>

<step n="5" goal="Save amended document and log">
<action>Save updated tech spec to {tech_spec_path}</action>
<action>Generate amendment log</action>
<action>Save amendment log to {amendment_log_file}</action>

<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Tech Spec Amendment Complete
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Document Updated:** {tech_spec_path}
**Amendment Log:** {amendment_log_file}

**Changes Made:**
{{amendment_summary}}

{{#if related_impact}}
**⚠️ Related Artifacts to Review:**
{{related_artifacts_to_review}}
{{/if}}

**Next Steps:**
{{#if needs_revalidation}}

- Run `validate-tech-spec` to confirm fixes
  {{/if}}
  {{#if stories_impacted}}
- Review and update affected stories
  {{/if}}
- Continue with story generation or implementation when ready

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>
</step>

</workflow>
