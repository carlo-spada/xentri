# System Epics Amendment Workflow

<critical>This amends Constitution-level epics with IMPACT ANALYSIS on downstream entities</critical>
<critical>Communicate all responses in {communication_language}</critical>
<critical>GOVERNANCE: Constitution changes require explicit rationale and flagging</critical>

<shared-tasks>
  <task name="impact-analysis" path="{project-root}/.bmad/bmm/tasks/impact-analysis.xml" />
  <task name="save-with-checkpoint" path="{project-root}/.bmad/bmm/tasks/save-with-checkpoint.xml" />
</shared-tasks>

<workflow>

<step n="1" goal="Load Current Epics and Identify Changes">
<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 CONSTITUTION EPICS AMENDMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ GOVERNANCE NOTICE: Constitution changes affect
ALL downstream entities and require explicit rationale.

Amending: docs/platform/epics.md
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>

<invoke-protocol name="discover_inputs" />

<check if="current_epics is empty">
  <output>❌ No epics document found. Use create-system-epics first.</output>
  <action>Exit workflow</action>
</check>

<output>
**Current Epic Structure:**
{display_current_epic_summary}
</output>

<ask>What type of amendment?
1. **ADD** - Add new epic or story
2. **MODIFY** - Change existing epic or story
3. **REMOVE** - Remove epic or story
4. **REORDER** - Change epic/story sequence

Enter choice (1-4):</ask>
</step>

<step n="2" goal="Specify Amendment Details">
<check if="amendment_type == 'ADD'">
  <ask>What are you adding?
  - [e] New Epic
  - [s] New Story to existing Epic

  Enter choice:</ask>

  <action>Gather details for new item:
  - For epic: title, goal, PR/IC coverage, stories
  - For story: which epic, title, acceptance criteria
  </action>
</check>

<check if="amendment_type == 'MODIFY'">
  <ask>Which epic or story to modify?
  List current items and accept selection.</ask>

  <action>Gather modification details:
  - What is changing?
  - Why is this change needed?
  - New content for the item
  </action>
</check>

<check if="amendment_type == 'REMOVE'">
  <ask>Which epic or story to remove?
  List current items and accept selection.</ask>

  <output>⚠️ Removing items may break downstream references.</output>
</check>

<check if="amendment_type == 'REORDER'">
  <ask>How should items be reordered?
  Show current order and accept new sequence.</ask>
</check>
</step>

<step n="3" goal="Perform Impact Analysis">
<invoke-task name="impact-analysis">
  <param name="document_path">{output_folder_resolved}epics.md</param>
  <param name="change_type">{amendment_type}</param>
  <param name="change_details">{amendment_details}</param>
  <param name="entity_type">constitution</param>
</invoke-task>

<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 IMPACT ANALYSIS REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Change:** {amendment_summary}

**Downstream Impact:**

| Entity | Document | Impact | Action Required |
|--------|----------|--------|-----------------|
| shell | epics.md | {impact} | {action} |
| core-api | epics.md | {impact} | {action} |
| ... | ... | ... | ... |

**Cascading ID Changes:**
{list_id_changes}

**Traceability Impact:**
{list_traceability_changes}

**Risk Assessment:** 🟢 LOW / 🟡 MEDIUM / 🔴 HIGH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>

<ask>Proceed with amendment? (y/n)</ask>
<check if="response != 'y'">
  <action>Exit workflow</action>
</check>
</step>

<step n="4" goal="Document Rationale">
<ask>Please provide rationale for this Constitution change:
(This will be recorded for governance tracking)</ask>

<action>Record amendment in changelog:
- Date: {date}
- Author: {user_name}
- Change: {amendment_summary}
- Rationale: {user_rationale}
- Impact: {impact_summary}
</action>
</step>

<step n="5" goal="Apply Amendment">
<action>Apply the amendment to the document:

1. Make the requested change
2. Update cascading IDs if needed
3. Update traceability matrix
4. Add changelog entry
</action>

<invoke-task name="save-with-checkpoint">
  <param name="file_path">{default_output_file}</param>
  <param name="content">{amended_content}</param>
  <param name="section_name">Amendment Applied</param>
</invoke-task>
</step>

<step n="6" goal="Generate Amendment Summary">
<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ CONSTITUTION EPICS AMENDED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Document: docs/platform/epics.md
Amendment: {amendment_summary}
Rationale: {user_rationale}

**Downstream Actions Required:**
{list_required_downstream_actions}

**Changelog Entry Added:**
| Date | Author | Change | Rationale |
|------|--------|--------|-----------|
| {date} | {user_name} | {change} | {rationale} |

⚠️ Remember to update downstream entities that reference
modified epics. Use amend-domain-epics workflow for each.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>
</step>

</workflow>
