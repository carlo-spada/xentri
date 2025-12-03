# System Architecture Amendment Workflow

<critical>For Constitution Architecture amendments only (docs/platform/architecture.md)</critical>
<critical>Constitution changes cascade to ALL downstream entities - full impact analysis required</critical>

<workflow>

<step n="1" goal="Load Current State">
<action>Load architecture from {architecture_path}</action>

<check if="architecture not found">
  <output>❌ Constitution Architecture not found. Use create-system-architecture first.</output>
  <action>Exit workflow</action>
</check>

<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔧 CONSTITUTION ARCHITECTURE AMENDMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Document: docs/platform/architecture.md
Date: {date}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>

<ask>What architectural changes do you want to make?

Options:
1. Add/modify tech stack decision
2. Add/modify architectural principle
3. Add/modify system pattern
4. Add/modify ADR
5. Other (describe)</ask>
</step>

<step n="2" goal="Capture Change Details">
<action>Document the proposed change:
- Section to modify
- Current state
- Proposed new state
- Rationale for change
</action>

<output>
**Proposed Change:**
{change_description}

**Section:** {target_section}
**Current:** {current_state}
**Proposed:** {proposed_state}
**Rationale:** {rationale}
</output>
</step>

<step n="3" goal="Impact Analysis">
<invoke-task name="impact-analysis">
  <param name="document_path">{architecture_path}</param>
  <param name="change_description">{change_description}</param>
  <param name="scope">constitution</param>
</invoke-task>

<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ IMPACT ANALYSIS: CONSTITUTION CHANGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Direct Impacts:**
{direct_impacts}

**Downstream Impacts (Infrastructure Modules):**
{infrastructure_impacts}

**Downstream Impacts (Strategic Containers):**
{strategic_impacts}

**Required Updates:**
{required_updates}

**Risk Level:** {risk_level}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>

<check if="risk_level == 'HIGH'">
  <ask>⚠️ HIGH RISK CHANGE detected. Proceed anyway? (y/n)</ask>
</check>
</step>

<step n="4" goal="ADR Requirement Check">
<check if="change requires ADR">
  <output>This change requires an Architecture Decision Record (ADR).</output>
  <action>Generate ADR template with:
  - Title matching change
  - Context from current state
  - Decision from proposed state
  - Consequences from impact analysis
  </action>
  <ask>Review the generated ADR. Approve to include? (y/n)</ask>
</check>
</step>

<step n="5" goal="Apply Amendment">
<action>Update architecture document with:
1. Apply the change to the target section
2. Update revision history with date and rationale
3. Add ADR if generated
4. Ensure checklist compliance maintained
</action>

<invoke-task name="save-with-checkpoint">
  <param name="document_path">{architecture_path}</param>
  <param name="document_type">constitution-architecture</param>
  <param name="change_summary">{change_description}</param>
</invoke-task>
</step>

<step n="6" goal="Log Amendment">
<action>Append to amendment log:
- Date: {date}
- Document: Constitution Architecture
- Change: {change_description}
- Rationale: {rationale}
- Impacted entities: {impacted_count}
- Risk level: {risk_level}
</action>
</step>

<step n="7" goal="Propagation Plan">
<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 PROPAGATION PLAN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The following downstream architectures may need updates:

**Infrastructure Modules:**
{infrastructure_update_list}

**Strategic Containers:**
{strategic_update_list}

**Recommended Actions:**
1. Review each impacted document
2. Use amend-domain-architecture for updates
3. Validate alignment after changes
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>

<ask>Would you like to proceed with propagation now? (y/n)</ask>
</step>

</workflow>
