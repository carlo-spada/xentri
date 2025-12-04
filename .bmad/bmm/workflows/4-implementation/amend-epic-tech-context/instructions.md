# Epic Tech Context Amendment Instructions

<critical>The workflow execution engine is governed by: {project-root}/.bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>Communicate all responses in {communication_language}</critical>
<critical>Generate all document updates in {document_output_language}</critical>

## Purpose

This workflow guides amendments to epic technical context documents. Amendments may be triggered by:

1. **Validation Issues** — Fixes from validate-epic-tech-context workflow
2. **Story Updates** — Changes to story breakdown or acceptance criteria
3. **Technical Refinements** — Updates to technical approach
4. **Architecture Changes** — Alignment with new architecture decisions
5. **PRD Changes** — Updates based on requirement changes
6. **Implementation Feedback** — Insights from development

<workflow>

<step n="0" goal="Entity detection and epic selection">
<action>Invoke {select_entity_task} to get user's entity selection</action>
<action>Resolve {output_folder_resolved} from entity selection</action>

<check if="{output_folder_resolved} not resolved">
  <output>
⚠️ **Entity Selection Required**

Please specify which entity contains the epic tech context to amend.
</output>
<action>Exit workflow</action>
</check>

<action>List available epic tech context files in {sprint_artifacts}</action>
<output>
**Available Epic Tech Contexts:**
{{epic_tech_context_list}}
</output>

<ask>Which epic tech context would you like to amend? (Enter epic ID)</ask>
<action>Store {epic_id} from user input</action>
<action>Resolve {epic_tech_context_path}</action>

<check if="file not found">
  <output>
⚠️ **Epic Tech Context Not Found**

Cannot amend a document that doesn't exist.

Expected location: {epic_tech_context_path}

**Action Required:**
Run the `epic-tech-context` workflow to create it first.
</output>
<action>Exit workflow</action>
</check>

<action>Load the complete epic tech context document</action>
<action>Parse document structure and identify all sections</action>

<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 Epic Tech Context Amendment
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Entity:      {current_level_name}
Epic:        {epic_id}
Document:    {epic_tech_context_path}
Amending:    {user_name}
Date:        {date}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Current Document Sections:**
{{section_list}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>
</step>

<step n="1" goal="Identify amendment type">
<action>Present amendment options to user</action>

<output>
**What type of amendment do you need?**

1. **Fix Validation Issues** — Address issues from validation report
2. **Update Stories** — Modify story breakdown or acceptance criteria
3. **Refine Technical Approach** — Update implementation details
4. **Architecture Alignment** — Reflect architecture changes
5. **PRD Changes** — Update for requirement changes
6. **Add Traceability** — Link stories to requirements
7. **Full Review** — Walk through entire document

</output>

<ask>Select amendment type (1-7) or describe what you need to change:</ask>

<action>Store amendment_type based on user selection</action>
<action>Initialize amendment_log</action>
</step>

<step n="2" goal="Gather amendment context" conditional="based on amendment_type">

<check if="amendment_type == 'validation_issues'">
  <action>Check for recent validation report in {sprint_artifacts}</action>
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

<check if="amendment_type == 'update_stories'">
  <output>
**Current Stories:**
{{current_story_list}}
  </output>
  <ask>What story changes are needed? (add, remove, split, combine, update criteria)</ask>
</check>

<check if="amendment_type == 'refine_approach'">
  <output>
**Current Technical Approach:**
{{current_approach}}
  </output>
  <ask>What aspects of the technical approach need refinement?</ask>
</check>

<check if="amendment_type == 'architecture_alignment'">
  <ask>What architecture changes need to be reflected?</ask>
</check>

<check if="amendment_type == 'prd_changes'">
  <ask>What PRD changes need to be reflected in this epic?</ask>
</check>

<check if="amendment_type == 'add_traceability'">
  <output>
**Stories Without Requirement Links:**
{{untraced_stories}}
  </output>
  <ask>Let's add traceability. Which requirements do these stories fulfill?</ask>
</check>

<check if="amendment_type == 'full_review'">
  <output>Let's walk through each section of the epic tech context.</output>
</check>

<action>Record amendment context</action>
</step>

<step n="3" goal="Execute amendments" repeat="until-complete">

<action>For each change:

1. Show current content
2. Discuss needed changes
3. Draft updated content
4. Get user approval
5. Apply change
6. Log amendment
   </action>

<action>After each change, update the document</action>
<template-output>section_updates</template-output>

<ask>Continue with next change, or are amendments complete?</ask>
</step>

<step n="4" goal="Impact assessment">
<action>Analyze impact on related artifacts</action>

<check if="stories_changed">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ Story Impact Assessment
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Story changes may affect:

{{#if existing_story_files}}
📋 **Existing Story Files** ({sprint_artifacts}/)

- Story files may need updating or deletion
  {{/if}}

{{#if sprint_status_exists}}
📊 **Sprint Status** ({sprint_artifacts}/sprint-status.yaml)

- Story status tracking may need updating
  {{/if}}

**Recommendation:** Review story files after saving.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>
</check>

<template-output>impact_assessment</template-output>
</step>

<step n="5" goal="Save amended document and log">
<action>Save updated epic tech context to {epic_tech_context_path}</action>
<action>Generate amendment log</action>
<action>Save amendment log to {amendment_log_file}</action>

<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Epic Tech Context Amendment Complete
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Document Updated:** {epic_tech_context_path}
**Amendment Log:** {amendment_log_file}

**Changes Made:**
{{amendment_summary}}

{{#if story_impact}}
**⚠️ Story Files to Review:**
{{story_files_to_review}}
{{/if}}

**Next Steps:**
{{#if needs_revalidation}}

- Run `validate-epic-tech-context` to confirm fixes
  {{/if}}
  {{#if stories_impacted}}
- Update affected story files
  {{/if}}
- Continue with story creation or implementation

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>
</step>

</workflow>
