# System UX Amendment Workflow - Constitution Level

<critical>The workflow execution engine is governed by: {project-root}/.bmad/core/tasks/workflow.xml</critical>
<critical>Constitution UX amendments affect ALL downstream entities</critical>
<critical>All changes require explicit rationale and impact assessment</critical>
<critical>Communicate all responses in {communication_language}</critical>

<shared-tasks>
  <task name="impact-analysis" path="{project-root}/.bmad/bmm/tasks/impact-analysis.xml" />
  <task name="save-with-checkpoint" path="{project-root}/.bmad/bmm/tasks/save-with-checkpoint.xml" />
</shared-tasks>

<workflow>

<step n="0" goal="Load Constitution UX">
<action>Load the Constitution UX Design from {ux_path}</action>

<check if="file not found">
  <output>❌ Constitution UX Design not found at {ux_path}

Use create-system-ux workflow to create it first.</output>
<action>Exit workflow</action>
</check>

<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏛️ CONSTITUTION UX AMENDMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Amending: docs/platform/ux-design.md
Entity Type: Constitution

⚠️ WARNING: This is a protected document.
Changes affect ALL downstream entities.
Rationale is REQUIRED for all changes.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>
</step>

<step n="1" goal="Identify Amendment Type">
<output>
What type of amendment do you want to make?

1. **Add** - Add new UX principle, pattern, or guideline
2. **Modify** - Change existing UX decision
3. **Remove** - Remove existing UX element
4. **Other** - Modify design system, colors, typography, etc.
   </output>

<ask>Select amendment type (1-4):</ask>
<action>Store as amendment_type</action>
</step>

<step n="2" goal="Specify Changes">
<check if="amendment_type == 1 (Add)">
  <ask>Describe what you want to add:

Consider:

- Is this truly platform-wide?
- Should it apply to ALL entities?
- What's the rationale for adding this?</ask>

  <action>Draft the new content</action>
  </check>

<check if="amendment_type == 2 (Modify)">
  <output>Current UX sections available for modification:
1. Core UX Principles
2. Design System Foundation
3. Color System
4. Typography
5. Spacing System
6. Platform-Wide UX Patterns
7. Accessibility Strategy
8. Responsive Strategy
9. Inheritance Guidelines</output>

<ask>Which section do you want to modify?</ask>
<action>Load current content of selected section</action>

<output>Current:
{current_content}</output>

<ask>What change do you want to make? Explain WHY this change is needed.</ask>
<action>Draft modification</action>
</check>

<check if="amendment_type == 3 (Remove)">
  <output>Current UX elements that could be removed:
(List principles, patterns, guidelines)</output>

<ask>What do you want to remove and WHY?

Note: Removing Constitution elements may break downstream entities.</ask>
</check>

<check if="amendment_type == 4 (Other)">
  <ask>Describe the change you want to make.

For Constitution UX, this might include:

- Design system change
- Color palette update
- Typography change
- Accessibility level change</ask>
  </check>
  </step>

<step n="3" goal="Impact Analysis">
<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 RUNNING IMPACT ANALYSIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>

<invoke-task name="impact-analysis">
  <param name="document_path">{ux_path}</param>
  <param name="entity_type">constitution</param>
  <param name="changed_items">{affected_elements}</param>
  <param name="change_type">{amendment_type}</param>
  <param name="scan_scope">all_entities</param>
</invoke-task>

<output>
📊 Impact Analysis Results:

**Affected Entity Types:**
{affected_entity_types}

**Affected Documents:**
{affected_documents_count} documents may need updates

**Breaking Changes:**
{breaking_changes_list}

**Downstream Impact:**
{downstream_impact_summary}
</output>

<check if="breaking_changes exist">
  <output>
⚠️ BREAKING CHANGES DETECTED

This amendment will require updates to:
{affected_documents_list}

These entities currently depend on what you're changing.
</output>

<ask>Proceed with this breaking change? (yes/no)</ask>
<check if="response != 'yes'">
<action>Exit workflow</action>
</check>
</check>
</step>

<step n="4" goal="Document Rationale">
<ask>Provide the rationale for this Constitution UX change:

This rationale will be:

1. Recorded in the document history
2. Required in the commit message
3. Available for future reference

Why is this change necessary?</ask>

<action>Store rationale</action>
</step>

<step n="5" goal="Draft and Review Amendment">
<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 PROPOSED CONSTITUTION UX AMENDMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Type:** {amendment_type_display}
**Affected Section:** {affected_section}

**Change:**
{amendment_content}

**Rationale:**
{rationale}

**Impact:**

- {affected_entity_count} entity types affected
- {affected_documents_count} documents may need updates
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>

<ask>Review the amendment:
[a] Approve and apply
[e] Edit
[c] Cancel</ask>

<check if="response == 'e'">
  <goto step="2">Re-specify changes</goto>
</check>
<check if="response == 'c'">
  <action>Exit workflow</action>
</check>
</step>

<step n="6" goal="Apply Amendment">
<action>Apply the amendment:
1. Update the relevant section(s)
2. Increment version number
3. Add entry to Document History with rationale
4. Update 'updated' date in frontmatter
</action>

<invoke-task name="save-with-checkpoint">
  <param name="file_path">{ux_path}</param>
  <param name="content">{updated_ux}</param>
  <param name="section_name">Constitution UX Amendment</param>
</invoke-task>
</step>

<step n="7" goal="Summary and Next Steps">
<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ CONSTITUTION UX AMENDED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Updated: docs/platform/ux-design.md

**Changes:**
{amendment_summary}

**Rationale:**
{rationale}

**Commit Message Format:**

```
docs(constitution): {short_description}

Rationale: {rationale}
Impact: {affected_entity_count} entity types affected
```

**Next Steps:**
Update affected downstream UX documents:
{affected_documents_list}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>
</step>

</workflow>
