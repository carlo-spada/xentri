# Product Soul Amendment Instructions

<critical>The workflow execution engine is governed by: {project-root}/.bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>Product Soul is Constitution-level ONLY - lives at docs/product-soul.md</critical>
<critical>Communicate all responses in {communication_language}</critical>
<critical>Generate all document updates in {document_output_language}</critical>
<critical>⚠️ CONSTITUTION IMPACT: Product Soul changes affect ALL downstream documents (PRD, Architecture, Epics, UX)</critical>

## Purpose

This workflow guides amendments to the Product Soul document. Amendments may be triggered by:

1. **Validation Issues** — Fixes from validate-product-soul workflow
2. **Scope Changes** — Adjustments to MVP scope or features
3. **Vision Refinements** — Clarifications to problem/solution/users
4. **Strategic Pivots** — Significant direction changes

<workflow>

<step n="0" goal="Verify Product Soul exists and load current state">
<action>Check if {product_soul_path} exists</action>

<check if="file not found">
  <output>
⚠️ **Product Soul Not Found**

Cannot amend a document that doesn't exist.

Expected location: {product_soul_path}

**Action Required:**
Run the `product-brief` workflow to create the Product Soul first.
</output>
<action>Exit workflow</action>
</check>

<action>Load the complete Product Soul document</action>
<action>Parse document structure and identify all sections</action>

<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 Product Soul Amendment
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Document:    {product_soul_path}
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
2. **Refine Section** — Improve clarity or depth of specific section
3. **Add Missing Content** — Add new section or expand existing
4. **Scope Change** — Adjust MVP scope, add/remove features
5. **Strategic Pivot** — Significant change to problem/solution/users
6. **Full Review** — Walk through entire document for updates

</output>

<ask>Select amendment type (1-6) or describe what you need to change:</ask>

<action>Store amendment_type based on user selection</action>
<action>Initialize amendment_log with type and timestamp</action>
</step>

<step n="2" goal="Gather amendment context" conditional="based on amendment_type">

<check if="amendment_type == 'validation_issues'">
  <action>Check for recent validation report in {output_folder}</action>
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

<check if="amendment_type == 'refine_section'">
  <output>
**Available Sections:**
{{numbered_section_list}}
  </output>
  <ask>Which section needs refinement? What specifically should be improved?</ask>
</check>

<check if="amendment_type == 'add_content'">
  <ask>What content needs to be added? Is this a new section or expansion of existing content?</ask>
</check>

<check if="amendment_type == 'scope_change'">
  <output>
**Current MVP Scope:**
{{current_core_features}}

**Current Out of Scope:**
{{current_out_of_scope}}
</output>
<ask>What scope changes are needed? (add features, remove features, or move between in/out of scope)</ask>
</check>

<check if="amendment_type == 'strategic_pivot'">
  <output>
⚠️ **Strategic Pivot Warning**

A strategic pivot affects the foundation of your product vision.
This will likely require updates to:

- PRD (if exists)
- Architecture (if exists)
- Epics (if exists)
- UX Design (if exists)

  </output>
  <ask>Describe the strategic change. What's driving this pivot?</ask>
</check>

<check if="amendment_type == 'full_review'">
  <output>Let's walk through each section of your Product Soul.</output>
</check>

<action>Record amendment context and rationale</action>
<template-output>amendment_context</template-output>
</step>

<step n="3" goal="Execute amendments" repeat="until-complete">

<check if="amendment_type == 'validation_issues' OR amendment_type == 'refine_section' OR amendment_type == 'add_content'">
  <action>For each issue/section:
    1. Show current content
    2. Discuss what needs to change
    3. Draft updated content
    4. Get user approval
    5. Apply change to document
    6. Log the amendment
  </action>
</check>

<check if="amendment_type == 'scope_change'">
  <action>For scope changes:
    1. Identify features to add/remove/move
    2. Update Core Features section
    3. Update Out of Scope section
    4. Update related sections (Success Metrics, etc.)
    5. Log all changes
  </action>
</check>

<check if="amendment_type == 'strategic_pivot'">
  <action>For strategic pivots:
    1. Understand the new direction
    2. Update Problem Statement
    3. Update Solution Definition
    4. Review and update Target Users
    5. Revise MVP Scope
    6. Update Executive Summary
    7. Flag downstream documents for update
  </action>
</check>

<check if="amendment_type == 'full_review'">
  <action>Walk through each section:
    1. Executive Summary
    2. Problem Statement
    3. Solution Definition
    4. Target Users
    5. MVP Scope
    6. (Any additional sections)

    For each: Show current → Ask for changes → Apply if needed

  </action>
</check>

<action>After each change, update the living document</action>
<template-output>section_updates</template-output>

<ask>Continue with next change, or are amendments complete?</ask>
</step>

<step n="4" goal="Impact assessment">
<action>Analyze impact of amendments on downstream documents</action>

<check if="amendment_type == 'strategic_pivot' OR significant_changes_detected">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ Downstream Impact Assessment
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

These amendments may affect:

{{#if prd_exists}}
📋 **PRD** ({output_folder}/platform/prd.md)

- Requirements may need updating
- Feature priorities may shift
  {{/if}}

{{#if architecture_exists}}
🏗️ **Architecture** ({output_folder}/platform/architecture.md)

- Technical decisions may need review
- Component scope may change
  {{/if}}

{{#if epics_exists}}
📚 **Epics** ({output_folder}/platform/epics.md)

- Epic priorities may shift
- Stories may need adjustment
  {{/if}}

{{#if ux_design_exists}}
🎨 **UX Design** ({output_folder}/platform/ux-design.md)

- User flows may need updates
- Feature scope may change
  {{/if}}

**Recommendation:** Review downstream documents after saving.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>
</check>

<template-output>impact_assessment</template-output>
</step>

<step n="5" goal="Save amended document and log">
<action>Save updated Product Soul to {product_soul_path}</action>
<action>Generate amendment log</action>
<action>Save amendment log to {amendment_log_file}</action>

<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Product Soul Amendment Complete
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Document Updated:** {product_soul_path}
**Amendment Log:** {amendment_log_file}

**Changes Made:**
{{amendment_summary}}

{{#if downstream_impact}}
**⚠️ Downstream Review Needed:**
{{downstream_documents_to_review}}
{{/if}}

**Next Steps:**
{{#if needs_revalidation}}

- Run `validate-product-soul` to confirm fixes
  {{/if}}
  {{#if downstream_impact}}
- Review and update affected downstream documents
  {{/if}}
- Continue with PRD workflow when ready

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>
</step>

</workflow>
