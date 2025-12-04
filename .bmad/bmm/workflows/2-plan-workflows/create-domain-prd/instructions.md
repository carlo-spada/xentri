# Domain PRD Workflow - Federated Requirements

<critical>The workflow execution engine is governed by: {project-root}/.bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>This creates PRDs for: Infrastructure Module, Strategic Container, Coordination Unit, Business Module</critical>
<critical>Communicate all responses in {communication_language}</critical>
<critical>Generate all documents in {document_output_language}</critical>
<critical>LIVING DOCUMENT: Write to PRD.md continuously as you discover - never wait until the end</critical>
<critical>NO TIME ESTIMATES - NEVER mention hours, days, weeks, or any time-based predictions</critical>
<critical>CHECKPOINT PROTOCOL: Use save-with-checkpoint task after each section to ensure user approval</critical>
<critical>INHERITANCE: This PRD MUST NOT contradict its parent PRD or the Constitution</critical>

<shared-tasks>
  <task name="save-with-checkpoint" path="{project-root}/.bmad/bmm/tasks/save-with-checkpoint.xml" />
  <task name="generate-frontmatter" path="{project-root}/.bmad/bmm/tasks/generate-frontmatter.xml" />
  <task name="select-entity" path="{project-root}/.bmad/bmm/tasks/select-entity.xml" />
  <task name="detect-entity-type" path="{project-root}/.bmad/bmm/tasks/detect-entity-type.xml" />
  <task name="validate-inheritance" path="{project-root}/.bmad/bmm/tasks/validate-inheritance.xml" />
</shared-tasks>

<workflow>

<step n="0" goal="Determine Entity Type and Context">
<check if="entity_type is not set or empty">
  <invoke-task name="select-entity">
    <param name="prompt_user">true</param>
  </invoke-task>
  <action>Store returned variables: entity_type, entity_type_display, fr_prefix, output_folder_resolved, parent_prd_path, entity_code</action>
</check>

<check if="entity_type == 'constitution'">
  <output>⚠️ Constitution detected. Use create-system-prd workflow instead.</output>
  <action>Exit and redirect to create-system-prd</action>
</check>

<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 DOMAIN PRD WORKFLOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Entity Type:    {entity_type_display}
Output Path:    {output_folder_resolved}prd.md
FR Prefix:      {fr_prefix}
Parent PRD:     {parent_prd_path}
Constitution:   docs/platform/prd.md

This PRD will:

- Inherit from {parent_prd_path}
- Add requirements specific to this scope
- NOT contradict parent or Constitution
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>

<check if="existing PRD exists at output path">
  <ask>An existing PRD was found at this level. Do you want to:
  [u] Update - Amend the existing PRD
  [r] Replace - Start fresh
  [c] Cancel - Exit workflow</ask>
  <check if="response == 'u'">
    <output>For amendments, please use the amend-domain-prd workflow.</output>
    <action>Exit and suggest amend-domain-prd workflow</action>
  </check>
  <check if="response == 'c'">
    <action>Exit workflow</action>
  </check>
</check>
</step>

<step n="0.5" goal="Load Parent Context and Input Documents">
<invoke-protocol name="discover_inputs" />
<note>Available: {constitution_content}, {parent_prd_content}, {product_brief_content}, {existing_prd_content}</note>

<action>Extract inherited constraints from parent:

1. Load Constitution (docs/platform/prd.md)
   - Extract all PR-xxx (Platform Requirements)
   - Extract all IC-xxx (Integration Contracts)
   - These are INHERITED and cannot be contradicted

2. Load Parent PRD ({parent_prd_path})
   - Extract all FR-xxx from parent
   - Extract scope boundaries
   - Note what parent already covers

3. Summarize inheritance context for user
   </action>

<output>
📜 Inherited Context Summary:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
From Constitution:
- {pr_count} Platform Requirements (PR-xxx)
- {ic_count} Integration Contracts (IC-xxx)

From Parent ({parent_prd_path}):

- {parent_fr_count} Functional Requirements
- Scope: {parent_scope_summary}

You may ADD requirements but not CONTRADICT these.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>
</step>

<step n="1" goal="Entity Purpose and Scope">
<action>Define the purpose of THIS entity within the hierarchy:

For {entity_type_display}, focus on:
</action>

<check if="entity_type == 'infrastructure_module'">
  <action>Infrastructure Module focus:
  - What services does this module provide to the system?
  - What interfaces does it EXPOSE for others to consume?
  - What interfaces does it CONSUME from other modules?
  - What is the implementation scope?
  - How does it support the Constitution's requirements?

Key questions:
"What does this module do for the platform?"
"What APIs or interfaces does it expose?"
"What other modules does it depend on?"
</action>
</check>

<check if="entity_type == 'strategic_container'">
  <action>Strategic Container focus:
  - What business capability does this category provide?
  - How does it align with the overall strategy?
  - What subcategories (Coordination Units) will it contain?
  - How do children coordinate within this category?

Key questions:
"What business outcomes does this category deliver?"
"What are the major subdivisions of this capability?"
"How do you see modules within this category working together?"
</action>
</check>

<check if="entity_type == 'coordination_unit'">
  <action>Coordination Unit focus:
  - What subset of the parent category does this coordinate?
  - What modules will this subcategory contain?
  - How do modules integrate within this unit?
  - What are the shared concerns across child modules?

Key questions:
"What specific aspect of {category} does this handle?"
"What modules will belong to this subcategory?"
"What shared patterns or integrations exist?"
</action>
</check>

<check if="entity_type == 'business_module'">
  <action>Business Module focus:
  - What specific feature or capability does this provide?
  - Who are the users of this module?
  - What user stories or jobs-to-be-done does it address?
  - How does it integrate with sibling modules?

Key questions:
"What does this module do for the user?"
"What problem does it solve?"
"What are the key user workflows?"
</action>
</check>

<action>Generate content for entity_purpose and scope_definition sections</action>

<invoke-task name="save-with-checkpoint">
  <param name="file_path">{default_output_file}</param>
  <param name="content">{entity_purpose_content}</param>
  <param name="section_name">Entity Purpose</param>
</invoke-task>

<invoke-task name="save-with-checkpoint">
  <param name="file_path">{default_output_file}</param>
  <param name="content">{scope_definition_content}</param>
  <param name="section_name">Scope Definition</param>
</invoke-task>
</step>

<step n="2" goal="Functional Requirements Discovery">
<action>Define the Functional Requirements for this {entity_type_display}:

Requirements will use prefix: {fr_prefix}
Example: {fr_prefix}-001, {fr_prefix}-002, etc.

IMPORTANT:

- FRs must be ADDITIVE to parent requirements
- FRs must NOT contradict inherited constraints
- FRs should be at appropriate altitude for this entity type
  </action>

<check if="entity_type == 'infrastructure_module'">
  <action>Infrastructure Module FRs focus on:
  - Exposed interfaces and their capabilities
  - Service behaviors and guarantees
  - Integration points with other modules
  - Implementation of Constitution requirements

Use: FR-{entity_code}-xxx format
</action>
</check>

<check if="entity_type == 'strategic_container'">
  <action>Strategic Container FRs focus on:
  - Category-level capabilities
  - Cross-subcategory coordination rules
  - Shared behaviors for all children
  - Strategic alignment requirements

Use: FR-{entity_code}-xxx format
</action>
</check>

<check if="entity_type == 'coordination_unit'">
  <action>Coordination Unit FRs focus on:
  - Subcategory-level coordination
  - Module orchestration requirements
  - Shared integration patterns
  - Data/event flow between modules

Use: FR-{category_code}-{entity_code}-xxx format
</action>
</check>

<check if="entity_type == 'business_module'">
  <action>Business Module FRs focus on:
  - User-facing capabilities
  - Feature requirements
  - User stories and acceptance criteria
  - Integration with sibling modules

Use: FR-{category_code}-{subcategory_code}-{entity_code}-xxx format
</action>
</check>

<action>Guide requirement discovery:

1. Start with core capabilities
   "What MUST this {entity_type_display} do?"

2. Identify user/system actors
   "Who or what interacts with this?"

3. Define capability areas
   Group related requirements together

4. Write clear, testable FRs
   Format: [Actor] can [capability] [context if needed]
   </action>

<action>Generate content for functional_requirements section</action>

<invoke-task name="save-with-checkpoint">
  <param name="file_path">{default_output_file}</param>
  <param name="content">{functional_requirements_content}</param>
  <param name="section_name">Functional Requirements ({fr_prefix}-xxx)</param>
</invoke-task>
</step>

<step n="3" goal="Entity-Specific Sections" if="entity_type in ['infrastructure_module', 'strategic_container', 'coordination_unit']">

<check if="entity_type == 'infrastructure_module'">
  <action>Document exposed and consumed interfaces:

**Exposed Interfaces:**
What does this module provide to others?

- API endpoints
- Event types emitted
- Shared utilities
- Data schemas

  **Consumed Interfaces:**
  What does this module depend on?

- Other module APIs used
- Events subscribed to
- Shared services used
  </action>

  <invoke-task name="save-with-checkpoint">
    <param name="file_path">{default_output_file}</param>
    <param name="content">{exposed_interfaces_content}</param>
    <param name="section_name">Exposed Interfaces</param>
  </invoke-task>

  <invoke-task name="save-with-checkpoint">
    <param name="file_path">{default_output_file}</param>
    <param name="content">{consumed_interfaces_content}</param>
    <param name="section_name">Consumed Interfaces</param>
  </invoke-task>

</check>

<check if="entity_type == 'strategic_container'">
  <action>Document strategic alignment and child coordination:

**Strategic Alignment:**
How does this category align with platform strategy?

- Business goals supported
- Success metrics
- Strategic priorities

  **Child Coordination:**
  How do subcategories and modules coordinate?

- What gets shared between children?
- What stays isolated?
- Escalation patterns
  </action>

  <invoke-task name="save-with-checkpoint">
    <param name="file_path">{default_output_file}</param>
    <param name="content">{strategic_alignment_content}</param>
    <param name="section_name">Strategic Alignment</param>
  </invoke-task>

  <invoke-task name="save-with-checkpoint">
    <param name="file_path">{default_output_file}</param>
    <param name="content">{child_coordination_content}</param>
    <param name="section_name">Child Coordination</param>
  </invoke-task>

</check>

<check if="entity_type == 'coordination_unit'">
  <action>Document module orchestration and integration:

**Module Orchestration:**
How are child modules coordinated?

- Workflow patterns
- Data flow between modules
- Event choreography

  **Integration Points:**
  Where do modules connect?

- Shared data models
- Event contracts
- API dependencies
  </action>

  <invoke-task name="save-with-checkpoint">
    <param name="file_path">{default_output_file}</param>
    <param name="content">{module_orchestration_content}</param>
    <param name="section_name">Module Orchestration</param>
  </invoke-task>

  <invoke-task name="save-with-checkpoint">
    <param name="file_path">{default_output_file}</param>
    <param name="content">{integration_points_content}</param>
    <param name="section_name">Integration Points</param>
  </invoke-task>

</check>
</step>

<step n="4" goal="Non-Functional Requirements (If Applicable)">
<action>Only document NFRs that are SPECIFIC to this entity.
System-wide NFRs are inherited from Constitution.

Consider:

- Performance requirements beyond system baseline
- Security requirements beyond platform minimum
- Specific scalability needs
- Domain-specific compliance
  </action>

<check if="entity has specific NFRs">
  <invoke-task name="save-with-checkpoint">
    <param name="file_path">{default_output_file}</param>
    <param name="content">{entity_nfrs_content}</param>
    <param name="section_name">Entity-Specific NFRs</param>
  </invoke-task>
</check>
</step>

<step n="5" goal="Validate Inheritance">
<invoke-task name="validate-inheritance">
  <param name="document_content">{generated_content}</param>
  <param name="entity_type">{entity_type}</param>
  <param name="parent_prd_path">{parent_prd_path}</param>
</invoke-task>

<check if="validation.is_valid == false">
  <output>
⚠️ INHERITANCE VIOLATIONS DETECTED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{validation.validation_report}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>
  <action>Work with user to resolve violations before proceeding</action>
</check>

<check if="validation.warnings exist">
  <output>⚠️ Warnings (non-blocking):
{validation.warnings}</output>
</check>
</step>

<step n="6" goal="Generate Frontmatter and Finalize">
<invoke-task name="generate-frontmatter">
  <param name="entity_type">{entity_type}</param>
  <param name="entity_type_display">{entity_type_display}</param>
  <param name="document_type">prd</param>
  <param name="fr_prefix">{fr_prefix}</param>
  <param name="parent_prd_path">{parent_prd_path}</param>
  <param name="title">{entity_name} PRD</param>
</invoke-task>

<action>Assemble the complete Domain PRD with:

- Generated frontmatter with inheritance reference
- Entity purpose and scope
- Functional Requirements ({fr_prefix}-xxx)
- Entity-specific sections
- Entity-specific NFRs (if any)
  </action>

<invoke-task name="save-with-checkpoint">
  <param name="file_path">{default_output_file}</param>
  <param name="content">{complete_document}</param>
  <param name="section_name">Complete {entity_type_display} PRD</param>
  <param name="is_new_file">true</param>
</invoke-task>
</step>

<step n="7" goal="Select and Apply Checklist">
<action>Select appropriate checklist based on entity type:</action>

<check if="entity_type == 'infrastructure_module'">
  <action>Load and apply: {checklist_infrastructure}</action>
</check>
<check if="entity_type == 'strategic_container'">
  <action>Load and apply: {checklist_strategic}</action>
</check>
<check if="entity_type == 'coordination_unit'">
  <action>Load and apply: {checklist_coordination}</action>
</check>
<check if="entity_type == 'business_module'">
  <action>Load and apply: {checklist_business}</action>
</check>

<action>Validate PRD against the selected checklist</action>

<check if="validation fails">
  <output>⚠️ Checklist validation issues:</output>
  <action>List each failed check</action>
  <ask>Address these issues now? (y/n)</ask>
</check>
</step>

<step n="8" goal="Summary and Next Steps">
<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ {entity_type_display} PRD COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Created: {output_folder_resolved}prd.md

Summary:

- {fr_count} Functional Requirements ({fr_prefix}-xxx)
- Inherits from: {parent_prd_path}
- Validated against: Constitution + Parent PRD
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Next Steps:**
</output>

<check if="entity_type == 'infrastructure_module'">
  <output>
1. Create Architecture: `create-architecture` workflow
2. Create Epics: `create-epics` workflow
3. Begin implementation after Architecture + Epics
  </output>
</check>

<check if="entity_type == 'strategic_container'">
  <output>
1. Create child Coordination Units or Business Modules
2. Each child uses `create-domain-prd` workflow
3. Or create this category's Architecture first
  </output>
</check>

<check if="entity_type == 'coordination_unit'">
  <output>
1. Create child Business Module PRDs
2. Each uses `create-domain-prd` workflow
3. Or create this unit's Architecture first
  </output>
</check>

<check if="entity_type == 'business_module'">
  <output>
1. Create Architecture: `create-architecture` workflow
2. Create UX Design: `create-ux` workflow
3. Create Epics: `create-epics` workflow
4. Begin implementation
  </output>
</check>
</step>

</workflow>
