# System PRD Amendment Workflow

<critical>Constitution amendments affect ALL downstream entities</critical>
<critical>Impact analysis is MANDATORY before any change</critical>
<critical>Governance rules require explicit flagging and rationale</critical>
<critical>The workflow execution engine is governed by: {project-root}/.bmad/core/tasks/workflow.xml</critical>

<workflow>

<step n="1" goal="Load Constitution and Confirm Intent">
<action>Load the System PRD from {prd_path}</action>

<check if="file not found">
  <output>❌ Constitution PRD not found. Use create-system-prd first.</output>
  <action>Exit workflow</action>
</check>

<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ CONSTITUTION AMENDMENT WORKFLOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
You are about to amend the SYSTEM CONSTITUTION.

This is the foundational document that governs ALL
entities in the system. Changes here will cascade
to Infrastructure Modules, Strategic Containers,
Coordination Units, and Business Modules.

**Impact: SYSTEM-WIDE**

Proceed with caution.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>

<ask>Do you understand this will affect all downstream entities? (yes/no)</ask>
<check if="response != 'yes'">
  <output>Amendment cancelled for safety.</output>
  <action>Exit workflow</action>
</check>
</step>

<step n="2" goal="Identify Amendment Type">
<output>
What type of amendment do you want to make?

1. **Add** - Add new PR-xxx or IC-xxx
2. **Modify** - Change existing PR-xxx or IC-xxx
3. **Remove** - Remove existing PR-xxx or IC-xxx
4. **Other** - Modify other sections (NFRs, Governance, etc.)
</output>

<ask>Select amendment type (1-4):</ask>
<action>Store as amendment_type</action>

<check if="amendment_type == 3">
  <output>
⚠️ REMOVAL WARNING

Removing Platform Requirements or Integration Contracts
is a BREAKING CHANGE. Downstream entities may depend on
these requirements.

Impact analysis will identify all affected documents.
  </output>
</check>
</step>

<step n="3" goal="Specify Changes">
<action>Gather details about the amendment:</action>

<check if="amendment_type == 1 (Add)">
  <ask>Describe the new requirement or contract to add:

- For PR-xxx: What rule must ALL entities follow?
- For IC-xxx: What interface contract must be implemented?

Include rationale for why this is needed.</ask>

  <action>Generate next available ID (PR-xxx or IC-xxx)</action>
  <action>Draft the new requirement/contract</action>
</check>

<check if="amendment_type == 2 (Modify)">
  <output>Current Platform Requirements:
{list_pr_xxx}</output>
  <output>Current Integration Contracts:
{list_ic_xxx}</output>

  <ask>Which item do you want to modify? (enter ID)</ask>
  <action>Load current content for that ID</action>

  <output>Current content:
{current_content}</output>

  <ask>What change do you want to make?</ask>
  <action>Draft the modification</action>
</check>

<check if="amendment_type == 3 (Remove)">
  <output>Current Platform Requirements:
{list_pr_xxx}</output>
  <output>Current Integration Contracts:
{list_ic_xxx}</output>

  <ask>Which item do you want to remove? (enter ID)</ask>
  <action>Load current content for that ID</action>

  <output>You are about to remove:
{current_content}</output>

  <ask>Provide justification for removal:</ask>
</check>

<check if="amendment_type == 4 (Other)">
  <ask>Which section do you want to modify?
1. System-Wide NFRs
2. Governance Rules
3. Other (specify)</ask>

  <action>Load relevant section</action>
  <ask>Describe the change:</ask>
</check>
</step>

<step n="4" goal="Impact Analysis">
<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 RUNNING IMPACT ANALYSIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>

<invoke-task name="impact-analysis">
  <param name="document_path">{prd_path}</param>
  <param name="entity_type">constitution</param>
  <param name="changed_items">{affected_ids}</param>
  <param name="change_type">{amendment_type}</param>
</invoke-task>

<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 IMPACT ANALYSIS RESULTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{impact_report}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>

<check if="impact_severity == 'breaking'">
  <output>
❌ BREAKING CHANGES DETECTED

The following downstream documents will be affected:
{affected_documents}

You must:
1. Review each affected document
2. Plan updates to maintain consistency
3. Consider staged rollout
  </output>

  <ask>Do you still want to proceed? (yes/no)</ask>
  <check if="response != 'yes'">
    <output>Amendment cancelled.</output>
    <action>Exit workflow</action>
  </check>
</check>
</step>

<step n="5" goal="Draft Amendment">
<action>Create the amendment with:
1. Change description
2. Rationale (WHY this change is necessary)
3. Affected items (PR-xxx/IC-xxx IDs)
4. Impact summary
5. Implementation notes
</action>

<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 PROPOSED AMENDMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Type:** {amendment_type_display}
**Affected:** {affected_ids}
**Impact Severity:** {impact_severity}

**Change:**
{amendment_content}

**Rationale:**
{rationale}

**Downstream Impact:**
- {affected_count} documents affected
- Breaking: {breaking_count}
- Requiring Update: {update_count}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>

<ask>Review the amendment. Options:
[a] Approve and apply
[e] Edit the amendment
[c] Cancel
</ask>

<check if="response == 'e'">
  <ask>What changes do you want to make?</ask>
  <action>Update amendment</action>
  <goto step="5">Re-display for review</goto>
</check>

<check if="response == 'c'">
  <output>Amendment cancelled.</output>
  <action>Exit workflow</action>
</check>
</step>

<step n="6" goal="Apply Amendment">
<action>Apply the amendment to Constitution PRD:

1. Update the relevant section
2. Update version number
3. Add entry to Document History
4. Update the 'updated' date in frontmatter
</action>

<invoke-task name="save-with-checkpoint">
  <param name="file_path">{prd_path}</param>
  <param name="content">{updated_prd}</param>
  <param name="section_name">Constitution Amendment</param>
</invoke-task>
</step>

<step n="7" goal="Update Amendment Log">
<action>Append to amendment log:

## Amendment {amendment_number} - {date}

**Type:** {amendment_type_display}
**Items:** {affected_ids}
**Impact:** {impact_severity}

**Change:**
{amendment_summary}

**Rationale:**
{rationale}

**Affected Downstream:**
{affected_documents_summary}

**Author:** {user_name}
</action>

<action>Save amendment log to {amendment_log_path}</action>
</step>

<step n="8" goal="Generate Commit Message">
<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ CONSTITUTION AMENDED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Updated: docs/platform/prd.md
Amendment logged: docs/platform/amendment-log.md

**Suggested Commit Message:**
```
docs(constitution): {amendment_summary}

Rationale: {rationale}
Impact: {affected_count} downstream documents

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

**Next Steps:**
1. Review affected downstream documents:
{affected_documents_list}

2. Update each document to maintain consistency

3. Run validation:
   `validate-prd` for each affected PRD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>
</step>

</workflow>
