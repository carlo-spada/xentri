# Domain Epics Workflow - Federated Requirements

<critical>The workflow execution engine is governed by: {project-root}/.bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>This creates epics for: Infrastructure Module, Strategic Container, Coordination Unit, Business Module</critical>
<critical>Communicate all responses in {communication_language}</critical>
<critical>Generate all documents in {document_output_language}</critical>
<critical>NO TIME ESTIMATES - NEVER mention hours, days, weeks, or any time-based predictions</critical>
<critical>CHECKPOINT PROTOCOL: Use save-with-checkpoint task after each section</critical>
<critical>INHERITANCE: Epics MUST align with Constitution and parent epics - use cascading IDs</critical>

<shared-tasks>
  <task name="save-with-checkpoint" path="{project-root}/.bmad/bmm/tasks/save-with-checkpoint.xml" />
  <task name="generate-frontmatter" path="{project-root}/.bmad/bmm/tasks/generate-frontmatter.xml" />
  <task name="detect-entity-type" path="{project-root}/.bmad/bmm/tasks/detect-entity-type.xml" />
  <task name="validate-inheritance" path="{project-root}/.bmad/bmm/tasks/validate-inheritance.xml" />
  <task name="verify-traceability" path="{project-root}/.bmad/bmm/tasks/verify-traceability.xml" />
</shared-tasks>

<workflow>

<step n="0" goal="Determine Entity Type and Load Context">
<check if="entity_type is not set or empty">
  <invoke-task name="detect-entity-type">
    <param name="prompt_user">true</param>
  </invoke-task>
</check>

<check if="entity_type == 'constitution'">
  <output>⚠️ Constitution detected. Use create-system-epics workflow instead.</output>
  <action>Exit workflow</action>
</check>

<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 DOMAIN EPICS WORKFLOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Entity Type:        {entity_type_display}
Output Path:        {output_folder_resolved}epics.md
Constitution Epics: docs/platform/epics.md
Parent Epics:       {parent_epics_path}

This epic structure will:

- Align with Constitution epic outcomes
- Inherit cascading IDs from parent
- Add entity-specific stories and details
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>

<invoke-protocol name="discover_inputs" />

<action>Extract inherited epic context:

1. From Constitution (docs/platform/epics.md):
   - Epic structure and IDs
   - PR-xxx and IC-xxx mappings
   - Coordination requirements

2. From Parent ({parent_epics_path}):
   - Parent epic IDs to inherit from
   - Scope boundaries
     </action>
     </step>

<step n="1" goal="Extract Entity Requirements">
<action>Extract requirements from this entity's PRD:

Based on entity type:
</action>

<check if="entity_type == 'infrastructure_module'">
  <action>Infrastructure Module FR extraction:
  - FR-{MOD}-xxx requirements
  - Exposed interfaces to implement
  - Consumed interfaces to integrate
  - Technical implementation scope
  </action>
</check>

<check if="entity_type == 'strategic_container'">
  <action>Strategic Container FR extraction:
  - FR-{CAT}-xxx requirements
  - Strategic alignment goals
  - Child coordination requirements
  - Category-level outcomes
  </action>
</check>

<check if="entity_type == 'coordination_unit'">
  <action>Coordination Unit FR extraction:
  - FR-{CAT}-{SUB}-xxx requirements
  - Module orchestration requirements
  - Integration points between children
  - Subcategory-level outcomes
  </action>
</check>

<check if="entity_type == 'business_module'">
  <action>Business Module FR extraction:
  - FR-{CAT}-{SUB}-{MOD}-xxx requirements
  - Feature-level requirements
  - User-facing functionality
  - Implementation details
  </action>
</check>

<output>
**Entity Requirements Inventory:**
| ID | Requirement | Type |
|----|-------------|------|
| FR-xxx | ... | Functional |
| ... | ... | ... |
</output>

<invoke-task name="save-with-checkpoint">
  <param name="file_path">{default_output_file}</param>
  <param name="content">{requirements_inventory}</param>
  <param name="section_name">Requirements Inventory</param>
</invoke-task>
</step>

<step n="2" goal="Map to Parent Epic Structure">
<action>Determine which parent epics this entity contributes to:

**Cascading Epic ID Pattern:**

- Constitution Epic 1 → This entity uses Epic 1-x
- Constitution Epic 2 → This entity uses Epic 2-x
- Parent Epic 1-1 → This entity uses Epic 1-1-x

For each entity FR, identify:

1. Which Constitution epic it relates to
2. What cascading ID to use
3. What stories are needed

Example mapping:

- FR-API-001 relates to Constitution Epic 2 (User Authentication)
- This entity creates Epic 2-1 with implementation stories
  </action>

<invoke-task name="save-with-checkpoint">
  <param name="file_path">{default_output_file}</param>
  <param name="content">{epic_mapping}</param>
  <param name="section_name">Epic Mapping</param>
</invoke-task>
</step>

<step n="3" goal="Define Entity Epic Structure">
<action>Propose epic structure for this {entity_type_display}:

Based on entity type, structure epics appropriately:
</action>

<check if="entity_type == 'infrastructure_module'">
  <action>Infrastructure Module epic focus:
  - Implementation epics for Constitution requirements
  - Service/API development epics
  - Integration epics with other modules
  - Each epic delivers working infrastructure
  </action>
</check>

<check if="entity_type == 'strategic_container'">
  <action>Strategic Container epic focus:
  - Category-level outcome epics
  - Child coordination epics
  - Strategic alignment validation
  - Each epic enables child module work
  </action>
</check>

<check if="entity_type == 'coordination_unit'">
  <action>Coordination Unit epic focus:
  - Subcategory outcome epics
  - Module integration epics
  - Shared service epics
  - Each epic coordinates child modules
  </action>
</check>

<check if="entity_type == 'business_module'">
  <action>Business Module epic focus:
  - Feature development epics
  - User-facing functionality epics
  - UI/UX implementation epics
  - Each epic delivers user value

**CRITICAL: User Value Check**
Every epic must answer: "What can users DO after this epic?"

- ❌ WRONG: "Database layer complete"
- ✅ RIGHT: "Users can create and manage content"
  </action>
  </check>

<invoke-task name="save-with-checkpoint">
  <param name="file_path">{default_output_file}</param>
  <param name="content">{epic_structure}</param>
  <param name="section_name">Epic Structure</param>
</invoke-task>
</step>

<step n="4" goal="Detail Each Epic with Stories" repeat="for-each-epic">
<action>For Epic {{parent_id}}-{{local_id}}, define:

**Epic {{parent_id}}-{{local_id}}: {{epic_title}}**

**Inherits From:** Constitution Epic {{parent_id}}
**Goal:** What does this epic deliver for this entity?

**FR Coverage:**

- FR-xxx, FR-xxx mapped to this epic

**Stories:**

Story {{parent_id}}-{{local_id}}.1: {{story_title}}
As a [user type],
I want [capability],
So that [value/benefit].

**Acceptance Criteria (BDD):**
Given [precondition]
When [action]
Then [expected outcome]

**Prerequisites:** [previous stories]
**Technical Notes:** [implementation guidance]

Story {{parent_id}}-{{local_id}}.2: ...
[Continue for all stories]

**Coordination Points:**

- How does this epic interact with siblings?
- What does parent need to know?
  </action>

<invoke-task name="save-with-checkpoint">
  <param name="file_path">{default_output_file}</param>
  <param name="content">{epic_content}</param>
  <param name="section_name">Epic {{parent_id}}-{{local_id}}</param>
</invoke-task>
</step>

<step n="5" goal="Verify Traceability and Inheritance">
<invoke-task name="verify-traceability">
  <param name="prd_path">{output_folder_resolved}prd.md</param>
  <param name="epics_content">{generated_epics}</param>
  <param name="entity_type">{entity_type}</param>
</invoke-task>

<invoke-task name="validate-inheritance">
  <param name="document_content">{generated_epics}</param>
  <param name="entity_type">{entity_type}</param>
  <param name="parent_path">{parent_epics_path}</param>
</invoke-task>

<check if="validation.is_valid == false">
  <output>⚠️ Epics violate Constitution or parent constraints:
{validation.violations}</output>
  <action>Work with user to resolve</action>
</check>

<check if="traceability.missing_requirements exists">
  <output>⚠️ The following FRs are not covered by any epic:
{traceability.missing_requirements}</output>
  <action>Add stories to cover missing FRs</action>
</check>

<invoke-task name="save-with-checkpoint">
  <param name="file_path">{default_output_file}</param>
  <param name="content">{traceability_matrix}</param>
  <param name="section_name">Traceability Matrix</param>
</invoke-task>
</step>

<step n="6" goal="Generate Frontmatter and Finalize">
<invoke-task name="generate-frontmatter">
  <param name="entity_type">{entity_type}</param>
  <param name="document_type">epics</param>
  <param name="title">{entity_name} Epics</param>
</invoke-task>

<action>Select and apply appropriate checklist based on entity type</action>

<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ {entity_type_display} EPICS COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Created: {output_folder_resolved}epics.md

Aligned with:

- Constitution: docs/platform/epics.md
- Parent: {parent_epics_path}

**Cascading IDs Used:**

- Epic {{parent_id}}-1, Epic {{parent_id}}-2, ...

**Next Steps:**

1. Create stories: create-story workflow
2. Begin sprint planning
3. Start implementation with dev-story workflow
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   </output>
   </step>

</workflow>
