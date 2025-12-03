# Architecture Creation Workflow (Unified)

<critical>The workflow execution engine is governed by: {project-root}/.bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>This creates ARCHITECTURE for ANY entity type (Constitution, Infrastructure, Strategic, Coordination, Business)</critical>
<critical>Communicate all responses in {communication_language}</critical>
<critical>Generate all documents in {document_output_language}</critical>
<critical>NO TIME ESTIMATES - NEVER mention hours, days, weeks, or any time-based predictions</critical>
<critical>CHECKPOINT PROTOCOL: Use save-with-checkpoint task after each major section</critical>

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

<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏗️ ARCHITECTURE CREATION WORKFLOW (Unified)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Entity Type:        {entity_type_display}
Output Path:        {output_folder_resolved}architecture.md
Constitution Arch:  docs/platform/architecture.md
Parent Arch:        {parent_architecture_path}

This workflow creates the Architecture document for your entity.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>

<invoke-protocol name="discover_inputs" />

<check if="entity_type == 'constitution'">
  <action>Load Constitution Context:
  - PRD: docs/platform/prd.md
  - Product Brief: docs/platform/product-brief.md
  </action>
</check>

<check if="entity_type != 'constitution'">
  <action>Extract inherited architecture constraints:
  1. From Constitution (docs/platform/architecture.md):
     - Core architectural principles
     - Technology stack decisions
     - Cross-cutting patterns
  2. From Parent ({parent_architecture_path}):
     - Domain-specific decisions
     - Integration patterns
  </action>
</check>
</step>

<step n="1" goal="Architecture Vision and Overview">
<action>Define the architectural vision/overview:</action>

<check if="entity_type == 'constitution'">
  <action>Constitution Vision:
  - Fundamental architectural principles
  - System boundary (C4 Context)
  - High-level architectural style (Microservices, Monolith, etc.)
  </action>
</check>

<check if="entity_type != 'constitution'">
  <action>Entity Overview:
  - How this entity fits into the system
  - Specific architectural focus (Service, UI, Integration, etc.)
  </action>
</check>

<invoke-task name="save-with-checkpoint">
  <param name="file_path">{default_output_file}</param>
  <param name="content">{architecture_vision}</param>
  <param name="section_name">Architecture Vision</param>
</invoke-task>
</step>

<step n="2" goal="Core Architecture Decisions">
<action>Define core decisions based on entity type:</action>

<check if="entity_type == 'constitution'">
  <action>Define System-Wide Standards:
  - Event Backbone Architecture
  - Data Architecture (Multi-tenancy, etc.)
  - Security Architecture (AuthN/AuthZ)
  - Technology Stack (The "Blessed" Stack)
  </action>
</check>

<check if="entity_type != 'constitution'">
  <action>Define Entity-Specific Decisions:
  - Technology choices (deviations/additions to Constitution)
  - Data models owned by this entity
  - Integration patterns (APIs exposed/consumed)
  </action>
</check>

<invoke-task name="save-with-checkpoint">
  <param name="file_path">{default_output_file}</param>
  <param name="content">{core_decisions}</param>
  <param name="section_name">Core Decisions</param>
</invoke-task>
</step>

<step n="3" goal="Entity-Specific Details" if="entity_type != 'constitution'">
<check if="entity_type == 'infrastructure_module'">
  <action>Infrastructure Details:
  - Service boundaries
  - Scaling & Resilience
  </action>
</check>

<check if="entity_type == 'business_module'">
  <action>Business Module Details:
  - UI/UX Architecture
  - State Management
  </action>
</check>

<invoke-task name="save-with-checkpoint">
  <param name="file_path">{default_output_file}</param>
  <param name="content">{entity_details}</param>
  <param name="section_name">Entity Details</param>
</invoke-task>
</step>

<step n="4" goal="Cross-Cutting Concerns">
<action>Document cross-cutting concerns:</action>

<check if="entity_type == 'constitution'">
  <action>Define System Patterns:
  - Observability (Logging, Metrics)
  - Error Handling
  - Configuration Management
  </action>
</check>

<check if="entity_type != 'constitution'">
  <action>Apply System Patterns:
  - How this entity implements observability
  - Specific error handling strategies
  </action>
</check>

<invoke-task name="save-with-checkpoint">
  <param name="file_path">{default_output_file}</param>
  <param name="content">{cross_cutting}</param>
  <param name="section_name">Cross-Cutting Concerns</param>
</invoke-task>
</step>

<step n="5" goal="Validate and Finalize">
<check if="entity_type != 'constitution'">
  <invoke-task name="validate-inheritance">
    <param name="document_content">{generated_content}</param>
    <param name="entity_type">{entity_type}</param>
    <param name="parent_prd_path">{parent_architecture_path}</param>
  </invoke-task>
  
  <check if="validation.is_valid == false">
    <output>⚠️ Architecture violates constraints: {validation.violations}</output>
    <action>Resolve violations</action>
  </check>
</check>

<invoke-task name="generate-frontmatter">
  <param name="entity_type">{entity_type}</param>
  <param name="document_type">architecture</param>
  <param name="title">{entity_name} Architecture</param>
</invoke-task>

<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ ARCHITECTURE COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Created: {output_folder_resolved}architecture.md
Entity:  {entity_type_display}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>
</step>

</workflow>
