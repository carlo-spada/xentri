# Migrate to Federation Workflow

<critical>The workflow execution engine is governed by: {project-root}/.bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>Communicate all responses in {communication_language}</critical>

<workflow>

<overview>
This workflow migrates existing documentation to the Five Entity Types federated model:

| Entity Type | Path Pattern | Purpose |
|-------------|--------------|---------|
| Constitution | `docs/platform/*.md` | System-wide rules (PR/IC) |
| Infrastructure Module | `docs/platform/{module}/` | Platform services |
| Strategic Container | `docs/{category}/` | Business category coordination |
| Coordination Unit | `docs/{cat}/{subcat}/` | Subcategory orchestration |
| Business Module | `docs/{cat}/{subcat}/{mod}/` | Feature implementation |

**Migration adds:**
- Proper frontmatter with entity type, parent references
- Inheritance validation markers
- Requirement ID prefixes (FR-xxx, PR-xxx, IC-xxx)
</overview>

<step n="1" goal="Greet and explain migration scope">

<output>
**Federation Migration Workflow**

Hello {user_name}! I'll help migrate your documentation to the Five Entity Types model.

**What this workflow does:**
1. Scans `{output_folder}` for existing documentation
2. Detects entity type for each document based on path
3. Adds/updates frontmatter with proper metadata
4. Validates inheritance chains (child never contradicts parent)
5. Generates comprehensive migration report

**Documents scanned:** `prd.md`, `architecture.md`, `ux-design.md`, `epics.md`
</output>

<ask>Ready to begin the scan? (y/n)</ask>

<check if="n">
  <output>Migration cancelled. Run this workflow when ready.</output>
  <action>Exit workflow</action>
</check>

</step>

<step n="2" goal="Load manifest and constitution">

<action>Load manifest from: {manifest_path}</action>
<action>Parse manifest to understand registered modules, categories, subcategories</action>

<check if="manifest not found or invalid">
  <output>**Warning:** Could not load manifest.yaml. Entity detection will use path heuristics only.</output>
  <action>Set manifest_available = false</action>
</check>

<check if="manifest valid">
  <action>Set manifest_available = true</action>
  <action>Extract registered entities: {{modules}}, {{categories}}, {{subcategories}}</action>
  <output>Manifest loaded: {{module_count}} modules, {{category_count}} categories registered.</output>
</check>

<action>Verify constitution documents exist at {constitution_path}</action>
<action>Check for: prd.md, architecture.md, ux-design.md, epics.md</action>

<output>
**Constitution Status:**
- PRD: {{constitution_prd_exists ? 'Found' : 'MISSING'}}
- Architecture: {{constitution_arch_exists ? 'Found' : 'MISSING'}}
- UX Design: {{constitution_ux_exists ? 'Found' : 'MISSING'}}
- Epics: {{constitution_epics_exists ? 'Found' : 'MISSING'}}
</output>

<check if="any constitution doc missing">
  <output>**Critical:** Constitution documents are the root of the hierarchy. Missing docs should be created first.</output>
  <ask>Continue migration anyway? (y/n)</ask>
  <check if="n">
    <output>Run the system PRD workflow first to establish constitution.</output>
    <action>Exit workflow</action>
  </check>
</check>

</step>

<step n="3" goal="Scan documentation tree">

<output>Scanning documentation tree under `{output_folder}`...</output>

<action>Recursively scan {output_folder} for document_types: prd.md, architecture.md, ux-design.md, epics.md</action>
<action>For each document found, record: path, filename, last_modified, size</action>
<action>Group documents by directory (each directory = potential entity)</action>

<output>
**Scan Results:**

| Location | Documents Found | Entity Type (Detected) |
|----------|-----------------|------------------------|
{{#each scanned_locations}}
| {{path}} | {{doc_count}} | {{detected_entity_type}} |
{{/each}}

**Total:** {{total_docs}} documents in {{total_locations}} locations
</output>

</step>

<step n="4" goal="Classify entities and detect frontmatter gaps">

<output>Analyzing each document for frontmatter and entity classification...</output>

<action>For each document:</action>
<action>1. Invoke {detect_entity_task} with document path</action>
<action>2. Check if frontmatter exists (YAML between --- markers)</action>
<action>3. If frontmatter exists, validate required fields: entity_type, parent, fr_prefix</action>
<action>4. Record status: COMPLIANT, MISSING_FRONTMATTER, INCOMPLETE_FRONTMATTER, WRONG_ENTITY_TYPE</action>

<output>
**Frontmatter Analysis:**

| Document | Entity Type | Status | Issues |
|----------|-------------|--------|--------|
{{#each analyzed_docs}}
| {{path}} | {{entity_type}} | {{status}} | {{issues}} |
{{/each}}

**Summary:**
- Compliant: {{compliant_count}}
- Missing frontmatter: {{missing_count}}
- Incomplete frontmatter: {{incomplete_count}}
- Wrong entity type: {{wrong_type_count}}
</output>

<check if="all compliant">
  <output>All documents are already federation-compliant! No migration needed.</output>
  <action>Generate summary report</action>
  <action>Skip to step 7</action>
</check>

</step>

<step n="5" goal="Preview migration changes">

<output>
**Proposed Migration Changes:**
</output>

<action>For each non-compliant document, generate preview of frontmatter to add/update</action>

<output>
{{#each migration_previews}}
---
**{{path}}**

Current: {{current_frontmatter || 'None'}}

Proposed:
```yaml
---
entity_type: {{proposed_entity_type}}
entity_type_display: {{proposed_display_name}}
parent: {{proposed_parent_path}}
fr_prefix: {{proposed_fr_prefix}}
created: {{created_date}}
migrated: {{migration_date}}
---
```
---
{{/each}}
</output>

<ask>
Review the proposed changes above.

Options:
1. **Apply all changes** - Migrate all documents
2. **Selective migration** - Choose which documents to migrate
3. **Dry run only** - Generate report without modifying files
4. **Cancel** - Exit without changes

Your choice [1/2/3/4]:
</ask>

<check if="user selects 4">
  <output>Migration cancelled.</output>
  <action>Exit workflow</action>
</check>

<check if="user selects 3">
  <action>Set dry_run = true</action>
  <output>Dry run mode - no files will be modified.</output>
  <action>Skip to step 7</action>
</check>

<check if="user selects 2">
  <action>Present list of documents with checkboxes</action>
  <ask>Select documents to migrate (comma-separated numbers or 'all'):</ask>
  <action>Store selected_docs</action>
</check>

<check if="user selects 1">
  <action>Set selected_docs = all non-compliant docs</action>
</check>

</step>

<step n="6" goal="Apply migration changes">

<output>**Applying Migration Changes...**</output>

<check if="options.backup_before_modify == true">
  <action>Create backup folder: {backup_folder}</action>
  <action>Copy all selected documents to backup folder</action>
  <output>Backup created at: {backup_folder}</output>
</check>

<action>For each selected document:</action>

<substep n="6.1" goal="Add/update frontmatter">
  <action>Read current document content</action>
  <action>Check if frontmatter exists</action>

  <check if="no frontmatter">
    <action>Invoke {frontmatter_task} to generate new frontmatter</action>
    <action>Prepend frontmatter to document content</action>
  </check>

  <check if="incomplete frontmatter">
    <action>Parse existing frontmatter</action>
    <action>Add missing required fields</action>
    <action>Preserve existing fields</action>
    <action>Add migration timestamp</action>
  </check>
</substep>

<substep n="6.2" goal="Validate inheritance">
  <action>Invoke {validate_inheritance_task} with document and parent</action>

  <check if="inheritance violations found">
    <action>Record violations in migration report</action>
    <output>**Warning:** {{path}} has inheritance violations: {{violations}}</output>

    <check if="options.fix_inheritance_violations == true">
      <action>Attempt automatic fix</action>
    </check>
    <check if="options.fix_inheritance_violations == false">
      <action>Mark for manual review</action>
    </check>
  </check>
</substep>

<substep n="6.3" goal="Save document">
  <action>Invoke {save_task} with updated content</action>
  <action>Record migration result: SUCCESS or FAILED</action>
</substep>

<output>
**Migration Progress:**
{{#each migration_results}}
- {{path}}: {{status}} {{#if error}}({{error}}){{/if}}
{{/each}}

Completed: {{success_count}}/{{total_count}}
</output>

</step>

<step n="7" goal="Generate migration report">

<action>Create migration report at: {migration_report_path}</action>

<output>
**Generating Migration Report...**
</output>

<action>Write report with sections:</action>
<action>1. Executive Summary</action>
<action>2. Pre-Migration State</action>
<action>3. Changes Applied</action>
<action>4. Inheritance Validation Results</action>
<action>5. Manual Review Items</action>
<action>6. Next Steps</action>

<template name="migration-report">
# Federation Migration Report

**Date:** {date}
**Migrated By:** {user_name}
**Mode:** {{dry_run ? 'Dry Run (no changes made)' : 'Full Migration'}}

---

## Executive Summary

| Metric | Count |
|--------|-------|
| Documents Scanned | {{total_scanned}} |
| Already Compliant | {{already_compliant}} |
| Migrated Successfully | {{migrated_count}} |
| Failed | {{failed_count}} |
| Manual Review Needed | {{review_count}} |

## Entity Type Distribution

| Entity Type | Count |
|-------------|-------|
| Constitution | {{constitution_count}} |
| Infrastructure Module | {{infrastructure_count}} |
| Strategic Container | {{strategic_count}} |
| Coordination Unit | {{coordination_count}} |
| Business Module | {{business_count}} |

## Changes Applied

{{#each changes}}
### {{path}}

**Entity Type:** {{entity_type}}
**Parent:** {{parent}}
**FR Prefix:** {{fr_prefix}}
**Status:** {{status}}

{{#if violations}}
**Inheritance Violations:**
{{#each violations}}
- {{this}}
{{/each}}
{{/if}}

---
{{/each}}

## Manual Review Items

{{#if review_items}}
{{#each review_items}}
- [ ] {{path}}: {{issue}}
{{/each}}
{{else}}
No manual review items.
{{/if}}

## Next Steps

1. Review any inheritance violations listed above
2. Run validation workflows to ensure compliance:
   - `/bmad:bmm:workflows:validate-prd`
   - `/bmad:bmm:workflows:validate-architecture`
3. Update any documents that need manual fixes
4. Commit changes to version control

---

*Generated by migrate-to-federation workflow*
</template>

<action>Save report to {migration_report_path}</action>

<output>
**Migration Complete!**

Report saved to: {migration_report_path}

**Summary:**
- Scanned: {{total_scanned}} documents
- Migrated: {{migrated_count}} documents
- Failures: {{failed_count}}
- Review needed: {{review_count}}

{{#if backup_folder}}
Backup available at: {backup_folder}
{{/if}}
</output>

</step>

</workflow>
