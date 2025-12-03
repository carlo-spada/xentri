# System Epics Workflow - Constitution Level

<critical>The workflow execution engine is governed by: {project-root}/.bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>This creates the CONSTITUTION EPICS - category-level outcomes ALL entities coordinate around</critical>
<critical>Communicate all responses in {communication_language}</critical>
<critical>Generate all documents in {document_output_language}</critical>
<critical>NO TIME ESTIMATES - NEVER mention hours, days, weeks, or any time-based predictions</critical>
<critical>CHECKPOINT PROTOCOL: Use save-with-checkpoint task after each major section</critical>

<shared-tasks>
  <task name="save-with-checkpoint" path="{project-root}/.bmad/bmm/tasks/save-with-checkpoint.xml" />
  <task name="generate-frontmatter" path="{project-root}/.bmad/bmm/tasks/generate-frontmatter.xml" />
  <task name="verify-traceability" path="{project-root}/.bmad/bmm/tasks/verify-traceability.xml" />
</shared-tasks>

<workflow>

<step n="0" goal="Confirm Constitution Context and Load PRD">
<action>Welcome {user_name} to the Constitution Epics workflow</action>

<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 CONSTITUTION EPICS WORKFLOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Entity Type:    Constitution
Output Path:    docs/platform/epics.md

This is the FOUNDATIONAL epic structure that:
- Defines category-level outcomes coordinating all work
- Maps to Platform Requirements (PR-xxx) and Integration Contracts (IC-xxx)
- Establishes cascading epic IDs for child entities
- Cannot be contradicted by downstream epics
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>

<invoke-protocol name="discover_inputs" />

<check if="constitution_prd_content is empty">
  <output>⚠️ Constitution PRD (docs/platform/prd.md) not found.

Epics should be derived from PRD requirements.
Please create the Constitution PRD first using create-system-prd workflow.</output>
  <ask>Continue anyway? (y/n)</ask>
  <check if="response != 'y'">
    <action>Exit workflow</action>
  </check>
</check>

<check if="existing epics found">
  <ask>Existing epics found. Do you want to:
  [u] Update - Use amend workflow
  [r] Replace - Start fresh
  [c] Cancel</ask>
  <check if="response == 'u'">
    <output>Use amend-system-epics workflow instead.</output>
    <action>Exit workflow</action>
  </check>
  <check if="response == 'c'">
    <action>Exit workflow</action>
  </check>
</check>
</step>

<step n="1" goal="Extract Requirements for Epic Mapping">
<action>Extract all requirements from Constitution PRD:

From PRD, identify:
1. **Platform Requirements (PR-xxx):**
   - PR-001 through PR-xxx
   - Each PR is a system-wide constraint

2. **Integration Contracts (IC-xxx):**
   - IC-001 through IC-xxx
   - Each IC defines a cross-cutting integration pattern

3. **Non-Functional Requirements:**
   - Performance targets
   - Security requirements
   - Scalability goals

Create a Requirements Inventory showing all items that need epic coverage.
</action>

<output>
**Requirements Inventory:**
| ID | Requirement | Type |
|----|-------------|------|
| PR-001 | ... | Platform Requirement |
| IC-001 | ... | Integration Contract |
| NFR-001 | ... | Non-Functional |
</output>

<invoke-task name="save-with-checkpoint">
  <param name="file_path">{default_output_file}</param>
  <param name="content">{requirements_inventory}</param>
  <param name="section_name">Requirements Inventory</param>
</invoke-task>
</step>

<step n="2" goal="Define Epic Structure">
<action>Propose epic structure based on Constitution requirements:

**Constitution Epic Pattern:**
- Epics at Constitution level define CATEGORY-LEVEL outcomes
- Each epic coordinates work across Infrastructure Modules
- Epics map to PR-xxx and IC-xxx requirements

**Epic Naming Convention:**
- Epic 1: Foundation & Infrastructure
- Epic 2: [User Value Area]
- Epic 3: [User Value Area]
- ...

**Critical Principles:**
1. Each epic MUST deliver user value (not just technical capability)
2. Epic 1 is Foundation - acceptable exception for infrastructure
3. Each epic should be independently valuable
4. Epics coordinate across Infrastructure Modules

**Cascading ID Pattern:**
Constitution Epic IDs become the base for child entities:
- Epic 1 → Child entities can have Epic 1-1, Epic 1-2, etc.
- Epic 2 → Child entities can have Epic 2-1, Epic 2-2, etc.

For each proposed epic:
- Epic title with clear value statement
- PR-xxx and IC-xxx coverage
- Which Infrastructure Modules are involved
- Dependencies on other epics
</action>

<invoke-task name="save-with-checkpoint">
  <param name="file_path">{default_output_file}</param>
  <param name="content">{epic_structure}</param>
  <param name="section_name">Epic Structure</param>
</invoke-task>
</step>

<step n="3" goal="Detail Each Epic" repeat="for-each-epic">
<action>For Epic {{N}}, define:

**Epic {{N}}: {{epic_title}}**

**Goal:**
What user value does this epic deliver?

**Scope:**
- Platform Requirements covered: PR-xxx, PR-xxx
- Integration Contracts covered: IC-xxx, IC-xxx
- Infrastructure Modules involved: shell, core-api, etc.

**Stories (Constitution Level):**
At Constitution level, stories represent high-level outcomes:

Story {{N}}.1: [Outcome Name]
- Traces to: PR-xxx
- Coordinates: [modules involved]
- Acceptance: [success criteria]

Story {{N}}.2: [Outcome Name]
- Traces to: IC-xxx
- Coordinates: [modules involved]
- Acceptance: [success criteria]

**Dependencies:**
- Requires: [previous epics]
- Enables: [child entity epics]

**Coordination Points:**
How do Infrastructure Modules coordinate for this epic?
</action>

<invoke-task name="save-with-checkpoint">
  <param name="file_path">{default_output_file}</param>
  <param name="content">{epic_N_content}</param>
  <param name="section_name">Epic {{N}}</param>
</invoke-task>
</step>

<step n="4" goal="Verify Traceability">
<invoke-task name="verify-traceability">
  <param name="prd_path">{output_folder_resolved}prd.md</param>
  <param name="epics_content">{generated_epics}</param>
  <param name="entity_type">constitution</param>
</invoke-task>

<check if="traceability.missing_requirements exists">
  <output>⚠️ The following requirements are not covered by any epic:
{traceability.missing_requirements}

Please add epics or stories to cover these.</output>
  <action>Work with user to resolve gaps</action>
</check>

<output>
**Traceability Matrix:**
| Requirement | Epic | Story |
|-------------|------|-------|
| PR-001 | Epic 1 | Story 1.2 |
| IC-001 | Epic 2 | Story 2.1 |
| ... | ... | ... |
</output>

<invoke-task name="save-with-checkpoint">
  <param name="file_path">{default_output_file}</param>
  <param name="content">{traceability_matrix}</param>
  <param name="section_name">Traceability Matrix</param>
</invoke-task>
</step>

<step n="5" goal="Generate Frontmatter and Finalize">
<invoke-task name="generate-frontmatter">
  <param name="entity_type">constitution</param>
  <param name="document_type">epics</param>
  <param name="title">System Epics - Constitution</param>
</invoke-task>

<action>Assemble the complete Constitution Epics document</action>

<action>Load and apply checklist: {checklist}</action>

<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ CONSTITUTION EPICS COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Created: docs/platform/epics.md

This epic structure now governs ALL downstream entities.
Infrastructure Module epics must align with these outcomes.

**Cascading Epic IDs Available:**
- Epic 1 → Children use Epic 1-x
- Epic 2 → Children use Epic 2-x
- ...

**Next Steps:**
1. Create Infrastructure Module epics using create-domain-epics
2. Reference this document for epic ID inheritance
3. Begin sprint planning at module level
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>
</step>

</workflow>
