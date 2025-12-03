# Domain Architecture Workflow - Federated Requirements

<critical>The workflow execution engine is governed by: {project-root}/.bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>This creates architecture for: Infrastructure Module, Strategic Container, Coordination Unit, Business Module</critical>
<critical>Communicate all responses in {communication_language}</critical>
<critical>Generate all documents in {document_output_language}</critical>
<critical>NO TIME ESTIMATES - NEVER mention hours, days, weeks, or any time-based predictions</critical>
<critical>CHECKPOINT PROTOCOL: Use save-with-checkpoint task after each section</critical>
<critical>INHERITANCE: Architecture MUST align with Constitution and parent architecture</critical>

<shared-tasks>
  <task name="save-with-checkpoint" path="{project-root}/.bmad/bmm/tasks/save-with-checkpoint.xml" />
  <task name="generate-frontmatter" path="{project-root}/.bmad/bmm/tasks/generate-frontmatter.xml" />
  <task name="detect-entity-type" path="{project-root}/.bmad/bmm/tasks/detect-entity-type.xml" />
  <task name="validate-inheritance" path="{project-root}/.bmad/bmm/tasks/validate-inheritance.xml" />
</shared-tasks>

<workflow>

<step n="0" goal="Determine Entity Type and Load Context">
<check if="entity_type is not set or empty">
  <invoke-task name="detect-entity-type">
    <param name="prompt_user">true</param>
  </invoke-task>
</check>

<check if="entity_type == 'constitution'">
  <output>⚠️ Constitution detected. Use create-system-architecture workflow instead.</output>
  <action>Exit workflow</action>
</check>

<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏗️ DOMAIN ARCHITECTURE WORKFLOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Entity Type:        {entity_type_display}
Output Path:        {output_folder_resolved}architecture.md
Constitution Arch:  docs/platform/architecture.md
Parent Arch:        {parent_architecture_path}

This architecture will:
- Align with Constitution architecture decisions
- Inherit from parent architecture
- Add entity-specific decisions
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>

<invoke-protocol name="discover_inputs" />

<action>Extract inherited architecture constraints:
1. From Constitution (docs/platform/architecture.md):
   - Core architectural principles
   - Technology stack decisions
   - Cross-cutting patterns

2. From Parent ({parent_architecture_path}):
   - Domain-specific decisions
   - Integration patterns
</action>
</step>

<step n="1" goal="Architecture Overview">
<action>Define the architecture overview for this {entity_type_display}:

Based on entity type, focus on:
</action>

<check if="entity_type == 'infrastructure_module'">
  <action>Infrastructure Module architecture focus:
  - Service architecture (internal structure)
  - API design and contracts
  - Data model within this module
  - Integration with other infrastructure modules
  - How this module implements Constitution patterns
  </action>
</check>

<check if="entity_type == 'strategic_container'">
  <action>Strategic Container architecture focus:
  - Category-level architectural patterns
  - Shared infrastructure for child modules
  - Data sharing strategy across subcategories
  - Event flow within category
  </action>
</check>

<check if="entity_type == 'coordination_unit'">
  <action>Coordination Unit architecture focus:
  - Module integration architecture
  - Shared services within subcategory
  - Data flow between child modules
  - Event choreography patterns
  </action>
</check>

<check if="entity_type == 'business_module'">
  <action>Business Module architecture focus:
  - Component architecture
  - UI/UX technical implementation
  - State management approach
  - Integration with sibling modules
  - API consumption patterns
  </action>
</check>

<invoke-task name="save-with-checkpoint">
  <param name="file_path">{default_output_file}</param>
  <param name="content">{architecture_overview}</param>
  <param name="section_name">Architecture Overview</param>
</invoke-task>
</step>

<step n="2" goal="Technology Decisions">
<action>Document technology decisions specific to this entity:

Must align with Constitution tech stack.
Only document DEVIATIONS or ADDITIONS:
- Why standard tech doesn't fit
- What alternative is chosen
- ADR for any deviation

Entity-specific technologies:
- Libraries or frameworks specific to this domain
- Tools unique to this entity's needs
</action>

<invoke-task name="save-with-checkpoint">
  <param name="file_path">{default_output_file}</param>
  <param name="content">{technology_decisions}</param>
  <param name="section_name">Technology Decisions</param>
</invoke-task>
</step>

<step n="3" goal="Data Architecture">
<action>Document data architecture for this entity:

Within Constitution constraints:
- Data models owned by this entity
- Database tables/collections
- Relationships with other entities' data
- Data access patterns
</action>

<invoke-task name="save-with-checkpoint">
  <param name="file_path">{default_output_file}</param>
  <param name="content">{data_architecture}</param>
  <param name="section_name">Data Architecture</param>
</invoke-task>
</step>

<step n="4" goal="Integration Architecture">
<action>Document how this entity integrates:

- APIs exposed (for infrastructure modules)
- APIs consumed
- Events produced
- Events subscribed to
- Sync vs async patterns used
</action>

<invoke-task name="save-with-checkpoint">
  <param name="file_path">{default_output_file}</param>
  <param name="content">{integration_architecture}</param>
  <param name="section_name">Integration Architecture</param>
</invoke-task>
</step>

<step n="5" goal="Entity-Specific Architecture" if="entity has special concerns">
<check if="entity_type == 'infrastructure_module'">
  <action>Document module-specific concerns:
  - Service boundaries
  - Scaling strategy
  - Resilience patterns
  - Monitoring approach
  </action>
</check>

<check if="entity_type == 'business_module'">
  <action>Document UI architecture:
  - Component structure
  - State management
  - Routing approach
  - Performance optimizations
  </action>
</check>

<invoke-task name="save-with-checkpoint">
  <param name="file_path">{default_output_file}</param>
  <param name="content">{entity_specific_architecture}</param>
  <param name="section_name">Entity-Specific Architecture</param>
</invoke-task>
</step>

<step n="6" goal="Validate Constitution Alignment">
<invoke-task name="validate-inheritance">
  <param name="document_content">{generated_content}</param>
  <param name="entity_type">{entity_type}</param>
  <param name="parent_prd_path">{parent_architecture_path}</param>
</invoke-task>

<check if="validation.is_valid == false">
  <output>⚠️ Architecture violates Constitution or parent constraints:
{validation.violations}</output>
  <action>Work with user to resolve</action>
</check>
</step>

<step n="7" goal="Generate Frontmatter and Finalize">
<invoke-task name="generate-frontmatter">
  <param name="entity_type">{entity_type}</param>
  <param name="document_type">architecture</param>
  <param name="title">{entity_name} Architecture</param>
</invoke-task>

<action>Select and apply appropriate checklist based on entity type</action>

<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ {entity_type_display} ARCHITECTURE COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Created: {output_folder_resolved}architecture.md

Aligned with:
- Constitution: docs/platform/architecture.md
- Parent: {parent_architecture_path}

**Next Steps:**
1. Create epics: create-epics workflow
2. Begin implementation based on architecture
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>
</step>

</workflow>
