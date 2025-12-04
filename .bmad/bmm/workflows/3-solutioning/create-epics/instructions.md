# Epics Creation Workflow (Unified)

<critical>The workflow execution engine is governed by: {project-root}/.bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>This creates EPICS for ANY entity type (Constitution, Infrastructure, Strategic, Coordination, Business)</critical>
<critical>Communicate all responses in {communication_language}</critical>
<critical>Generate all documents in {document_output_language}</critical>
<critical>NO TIME ESTIMATES - NEVER mention hours, days, weeks, or any time-based predictions</critical>
<critical>CHECKPOINT PROTOCOL: Use save-with-checkpoint task after each major section</critical>

<shared-tasks>
  <task name="save-with-checkpoint" path="{project-root}/.bmad/bmm/tasks/save-with-checkpoint.xml" />
  <task name="generate-frontmatter" path="{project-root}/.bmad/bmm/tasks/generate-frontmatter.xml" />
  <task name="select-entity" path="{project-root}/.bmad/bmm/tasks/select-entity.xml" />
  <task name="detect-entity-type" path="{project-root}/.bmad/bmm/tasks/detect-entity-type.xml" />
  <task name="validate-inheritance" path="{project-root}/.bmad/bmm/tasks/validate-inheritance.xml" />
  <task name="verify-traceability" path="{project-root}/.bmad/bmm/tasks/verify-traceability.xml" />
</shared-tasks>

<workflow>

<step n="0" goal="Determine Entity Type and Load Context">
<check if="entity_type is not set or empty">
  <invoke-task name="select-entity">
    <param name="prompt_user">true</param>
  </invoke-task>
</check>

<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 EPICS CREATION WORKFLOW (Unified)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Entity Type:        {entity_type_display}
Output Path:        {output_folder_resolved}epics.md
Constitution Epics: docs/platform/epics.md
Parent Epics:       {parent_epics_path}

This workflow creates the Epic structure for your entity.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>

<invoke-protocol name="discover_inputs" />

<check if="entity_type == 'constitution'">
  <action>Load Constitution Context:
  - PRD: docs/platform/prd.md
  - Architecture: docs/platform/architecture.md
  - Product Brief: docs/platform/product-brief.md
  </action>
</check>

<check if="entity_type != 'constitution'">
  <action>Extract inherited epic context:
  1. From Constitution (docs/platform/epics.md):
     - Epic structure and IDs
     - PR-xxx and IC-xxx mappings
  2. From Parent ({parent_epics_path}):
     - Parent epic IDs to inherit from
     - Scope boundaries
  </action>
</check>
</step>

<step n="1" goal="Extract Requirements">
<action>Extract requirements from this entity's PRD:</action>

<check if="entity_type == 'constitution'">
  <action>Constitution PRD extraction:
  - Platform Requirements (PR-xxx)
  - Integration Contracts (IC-xxx)
  - Non-Functional Requirements (NFR-xxx)
  </action>
</check>

<check if="entity_type == 'infrastructure_module'">
  <action>Infrastructure Module FR extraction:
  - FR-{MOD}-xxx requirements
  - Exposed/Consumed interfaces
  </action>
</check>

<check if="entity_type == 'strategic_container'">
  <action>Strategic Container FR extraction:
  - FR-{CAT}-xxx requirements
  - Strategic alignment goals
  </action>
</check>

<check if="entity_type == 'coordination_unit'">
  <action>Coordination Unit FR extraction:
  - FR-{CAT}-{SUB}-xxx requirements
  - Module orchestration requirements
  </action>
</check>

<check if="entity_type == 'business_module'">
  <action>Business Module FR extraction:
  - FR-{CAT}-{SUB}-{MOD}-xxx requirements
  - Feature-level requirements
  </action>
</check>

<output>
**Requirements Inventory:**
| ID | Requirement | Type |
|----|-------------|------|
| ... | ... | ... |
</output>

<invoke-task name="save-with-checkpoint">
  <param name="file_path">{default_output_file}</param>
  <param name="content">{requirements_inventory}</param>
  <param name="section_name">Requirements Inventory</param>
</invoke-task>
</step>

<step n="2" goal="Define Epic Structure">
<action>Propose epic structure based on entity type:</action>

<check if="entity_type == 'constitution'">
  <action>Constitution Epic Pattern:
  - Category-level outcomes
  - Maps to PR-xxx and IC-xxx
  - Establishes cascading ID roots (Epic 1, Epic 2...)
  </action>
</check>

<check if="entity_type != 'constitution'">
  <action>Child Entity Epic Pattern:
  - Inherits from Parent Epic IDs (e.g., Parent Epic 1-1 -> Child Epic 1-1-1)
  - Maps to entity-specific FRs
  </action>
</check>

<invoke-task name="save-with-checkpoint">
  <param name="file_path">{default_output_file}</param>
  <param name="content">{epic_structure}</param>
  <param name="section_name">Epic Structure</param>
</invoke-task>
</step>

<step n="3" goal="Detail Each Epic" repeat="for-each-epic">
<action>For Epic {{id}}, define:

**Epic {{id}}: {{title}}**

**Goal:** What value does this deliver?

**Scope/Traceability:**

- Covers: [PR-xxx, IC-xxx, FR-xxx]

**Stories:**

- Story {{id}}.1: [Title]
- Story {{id}}.2: [Title]

**Coordination:**

- Dependencies and integration points
  </action>

<invoke-task name="save-with-checkpoint">
  <param name="file_path">{default_output_file}</param>
  <param name="content">{epic_content}</param>
  <param name="section_name">Epic {{id}}</param>
</invoke-task>
</step>

<step n="4" goal="Verify Traceability and Inheritance">
<invoke-task name="verify-traceability">
  <param name="prd_path">{output_folder_resolved}prd.md</param>
  <param name="epics_content">{generated_epics}</param>
  <param name="entity_type">{entity_type}</param>
</invoke-task>

<check if="entity_type != 'constitution'">
  <invoke-task name="validate-inheritance">
    <param name="document_content">{generated_epics}</param>
    <param name="entity_type">{entity_type}</param>
    <param name="parent_path">{parent_epics_path}</param>
  </invoke-task>
</check>

<check if="validation.is_valid == false">
  <output>⚠️ Epics violate constraints: {validation.violations}</output>
  <action>Resolve violations</action>
</check>

<check if="traceability.missing_requirements exists">
  <output>⚠️ Missing coverage: {traceability.missing_requirements}</output>
  <action>Add stories to cover gaps</action>
</check>

<invoke-task name="save-with-checkpoint">
  <param name="file_path">{default_output_file}</param>
  <param name="content">{traceability_matrix}</param>
  <param name="section_name">Traceability Matrix</param>
</invoke-task>
</step>

<step n="5" goal="Finalize">
<invoke-task name="generate-frontmatter">
  <param name="entity_type">{entity_type}</param>
  <param name="document_type">epics</param>
  <param name="title">{entity_name} Epics</param>
</invoke-task>

<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ EPICS COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Created: {output_folder_resolved}epics.md
Entity:  {entity_type_display}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>
</step>

</workflow>
