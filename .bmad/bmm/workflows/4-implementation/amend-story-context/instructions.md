# Story Context Amendment Instructions

<critical>The workflow execution engine is governed by: {project-root}/.bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>Communicate all responses in {communication_language}</critical>
<critical>Generate all document updates in {document_output_language}</critical>

## Purpose

This workflow guides amendments to story context documents (XML format). Amendments may be triggered by:

1. **Validation Issues** — Fixes from validate-story-context workflow
2. **Stale Content** — Updates when source documents change
3. **Context Enrichment** — Adding more implementation guidance
4. **Code Reference Updates** — Reflecting codebase changes
5. **Regeneration** — Complete refresh from current sources

<workflow>

<step n="0" goal="Entity detection and story selection">
<action>Invoke {select_entity_task} to get user's entity selection</action>
<action>Resolve {output_folder_resolved} from entity selection</action>

<check if="{output_folder_resolved} not resolved">
  <output>
⚠️ **Entity Selection Required**

Please specify which entity contains the story context to amend.
</output>
<action>Exit workflow</action>
</check>

<action>List available story context files in {sprint_artifacts}</action>
<output>
**Available Story Contexts:**
{{story_context_list}}
</output>

<ask>Which story context would you like to amend? (Enter story ID)</ask>
<action>Store {story_id} from user input</action>
<action>Resolve {story_context_path}</action>

<check if="file not found">
  <output>
⚠️ **Story Context Not Found**

Cannot amend a document that doesn't exist.

Expected location: {story_context_path}

**Action Required:**
Run the `story-context` workflow to create it first.
</output>
<action>Exit workflow</action>
</check>

<action>Create backup at {amendment_backup}</action>
<action>Load the complete story context document (XML)</action>
<action>Parse XML structure</action>

<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 Story Context Amendment
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Entity:      {current_level_name}
Story:       {story_id}
Document:    {story_context_path}
Amending:    {user_name}
Date:        {date}
Backup:      {amendment_backup}
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
2. **Refresh Documentation** — Update from changed source docs
3. **Update Code References** — Reflect codebase changes
4. **Add Context** — Enrich with additional guidance
5. **Remove Stale Content** — Clean up outdated information
6. **Full Regeneration** — Rebuild from scratch using current sources

</output>

<ask>Select amendment type (1-6) or describe what you need to change:</ask>

<action>Store amendment_type based on user selection</action>
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

<check if="amendment_type == 'refresh_documentation'">
  <output>
**Current Documentation Sources:**
{{current_doc_sources}}
  </output>
  <ask>Which documentation sources have changed? What needs refreshing?</ask>
</check>

<check if="amendment_type == 'update_code_refs'">
  <output>
**Current Code References:**
{{current_code_refs}}
  </output>
  <ask>What code references need updating? (file moves, new code, removed code)</ask>
</check>

<check if="amendment_type == 'add_context'">
  <ask>What additional context should be added? (patterns, examples, guidance)</ask>
</check>

<check if="amendment_type == 'remove_stale'">
  <ask>What content is stale and should be removed?</ask>
</check>

<check if="amendment_type == 'full_regeneration'">
  <output>
⚠️ **Full Regeneration**

This will rebuild the story context from scratch.
The current version will be preserved as backup.

  </output>
  <ask>Confirm regeneration? (yes/no)</ask>
</check>

<action>Record amendment context</action>
</step>

<step n="3" goal="Execute amendments" repeat="until-complete">

<check if="amendment_type != 'full_regeneration'">
  <action>For each change:
    1. Show current XML section
    2. Discuss needed changes
    3. Draft updated XML
    4. Validate XML is well-formed
    5. Get user approval
    6. Apply change
  </action>
</check>

<check if="amendment_type == 'full_regeneration'">
  <action>
    1. Load all current source documents
    2. Rebuild story context following template
    3. Include all relevant sections
    4. Validate XML structure
    5. Show summary of regenerated content
  </action>
</check>

<action>After each change, validate XML remains well-formed</action>
<template-output>section_updates</template-output>

<ask>Continue with next change, or are amendments complete?</ask>
</step>

<step n="4" goal="Final validation">
<action>Validate complete XML document is well-formed</action>
<action>Verify all required sections present</action>

<check if="xml_invalid">
  <output>
⚠️ **XML Validation Error**

The document has structural issues:
{{xml_errors}}

Please fix before saving.
</output>
<action>Return to step 3</action>
</check>

<output>
✅ XML structure validated
</output>
</step>

<step n="5" goal="Save amended document">
<action>Update timestamp in story context</action>
<action>Save updated story context to {story_context_path}</action>

<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Story Context Amendment Complete
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Document Updated:** {story_context_path}
**Backup Preserved:** {amendment_backup}

**Changes Made:**
{{amendment_summary}}

**Next Steps:**
{{#if needs_revalidation}}

- Run `validate-story-context` to confirm fixes
  {{/if}}
- Continue with `dev-story` workflow for implementation

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>
</step>

</workflow>
