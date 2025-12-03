# System Architecture Workflow - Constitution Level

<critical>The workflow execution engine is governed by: {project-root}/.bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>This creates the CONSTITUTION ARCHITECTURE - cross-cutting decisions ALL entities follow</critical>
<critical>Communicate all responses in {communication_language}</critical>
<critical>Generate all documents in {document_output_language}</critical>
<critical>NO TIME ESTIMATES - NEVER mention hours, days, weeks, or any time-based predictions</critical>
<critical>CHECKPOINT PROTOCOL: Use save-with-checkpoint task after each major section</critical>

<shared-tasks>
  <task name="save-with-checkpoint" path="{project-root}/.bmad/bmm/tasks/save-with-checkpoint.xml" />
  <task name="generate-frontmatter" path="{project-root}/.bmad/bmm/tasks/generate-frontmatter.xml" />
</shared-tasks>

<workflow>

<step n="0" goal="Confirm Constitution Context and Load PRD">
<action>Welcome {user_name} to the Constitution Architecture workflow</action>

<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏗️ CONSTITUTION ARCHITECTURE WORKFLOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Entity Type:    Constitution
Output Path:    docs/platform/architecture.md

This is the FOUNDATIONAL architecture that:
- Defines cross-cutting technical decisions
- Establishes system-wide patterns and constraints
- Defines integration architecture (event backbone, APIs)
- Sets technology stack decisions
- Cannot be contradicted by downstream architectures
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>

<invoke-protocol name="discover_inputs" />

<check if="constitution_prd_content is empty">
  <output>⚠️ Constitution PRD (docs/platform/prd.md) not found.

The architecture should be based on the PRD requirements.
Please create the Constitution PRD first using create-system-prd workflow.</output>
  <ask>Continue anyway? (y/n)</ask>
  <check if="response != 'y'">
    <action>Exit workflow</action>
  </check>
</check>

<check if="existing architecture found">
  <ask>Existing architecture found. Do you want to:
  [u] Update - Use amend workflow
  [r] Replace - Start fresh
  [c] Cancel</ask>
  <check if="response == 'u'">
    <output>Use amend-system-architecture workflow instead.</output>
    <action>Exit workflow</action>
  </check>
  <check if="response == 'c'">
    <action>Exit workflow</action>
  </check>
</check>
</step>

<step n="1" goal="Architecture Vision and Principles">
<action>Define the architectural vision aligned with Constitution PRD:

"Let's establish the architectural vision for the entire system.
What are the fundamental architectural principles that will guide all decisions?"

Extract from PRD:
- Core principles that affect architecture
- PR-xxx that have architectural implications
- IC-xxx that define integration architecture

Key questions:
- What architectural style best supports the vision? (microservices, modular monolith, etc.)
- What are the non-negotiable architectural constraints?
- What trade-offs are we making and why?
</action>

<action>Document:
- Architectural vision statement
- Core architectural principles (3-7 principles)
- Key trade-offs and rationale
</action>

<invoke-task name="save-with-checkpoint">
  <param name="file_path">{default_output_file}</param>
  <param name="content">{architecture_vision}</param>
  <param name="section_name">Architecture Vision</param>
</invoke-task>
</step>

<step n="2" goal="System Context and Boundaries">
<action>Define the system context:

"Let's map out what's inside our system vs external."

Document:
- System boundary (what's in scope)
- External systems and integrations
- User types and access points
- Data flows in and out of system
</action>

<action>Create a C4-style context diagram description:
- System as central element
- External actors (users, external systems)
- Key interactions
</action>

<invoke-task name="save-with-checkpoint">
  <param name="file_path">{default_output_file}</param>
  <param name="content">{system_context}</param>
  <param name="section_name">System Context</param>
</invoke-task>
</step>

<step n="3" goal="High-Level Architecture">
<action>Define the high-level architecture:

Load {architecture_patterns} and {pattern_categories} for reference.

Key decisions:
1. **Architectural Style** - Microservices, modular monolith, hybrid?
2. **Deployment Model** - Cloud, on-prem, hybrid?
3. **Data Architecture** - Single DB, polyglot, event-sourced?
4. **Integration Pattern** - Sync, async, event-driven?

For each decision:
- State the decision clearly
- Provide rationale
- Note alternatives considered
- Document trade-offs
</action>

<action>Create architecture decision records (ADR format) for major decisions</action>

<invoke-task name="save-with-checkpoint">
  <param name="file_path">{default_output_file}</param>
  <param name="content">{high_level_architecture}</param>
  <param name="section_name">High-Level Architecture</param>
</invoke-task>
</step>

<step n="4" goal="Event Backbone Architecture">
<action>Define the event-driven architecture (per Constitution IC requirements):

Based on IC-xxx from PRD:
- Event envelope schema
- Event naming conventions
- Event routing and transport
- Event persistence and replay

Document:
- Event spine technology choice
- Event categories and types
- Producer/consumer patterns
- Error handling and DLQ strategy
</action>

<invoke-task name="save-with-checkpoint">
  <param name="file_path">{default_output_file}</param>
  <param name="content">{event_architecture}</param>
  <param name="section_name">Event Architecture</param>
</invoke-task>
</step>

<step n="5" goal="Data Architecture">
<action>Define the data architecture:

Based on PR-xxx from PRD (especially multi-tenancy):
- Database technology choices
- Schema strategy (per-tenant, shared with RLS, etc.)
- Data isolation approach
- Backup and recovery strategy

Document:
- Primary data stores and purposes
- Caching strategy
- Data flow between services
- Data governance rules
</action>

<invoke-task name="save-with-checkpoint">
  <param name="file_path">{default_output_file}</param>
  <param name="content">{data_architecture}</param>
  <param name="section_name">Data Architecture</param>
</invoke-task>
</step>

<step n="6" goal="Security Architecture">
<action>Define the security architecture:

Based on PR-xxx security requirements:
- Authentication strategy
- Authorization model (RBAC, ABAC, etc.)
- API security
- Data encryption (at rest, in transit)

Document:
- Identity provider integration
- Token strategy (JWT, sessions, etc.)
- Permission model
- Audit logging approach
</action>

<invoke-task name="save-with-checkpoint">
  <param name="file_path">{default_output_file}</param>
  <param name="content">{security_architecture}</param>
  <param name="section_name">Security Architecture</param>
</invoke-task>
</step>

<step n="7" goal="Technology Stack">
<action>Define the core technology stack:

For each layer, document choice and rationale:
- Frontend technologies
- Backend technologies
- Database technologies
- Infrastructure/DevOps
- Observability stack

This becomes the "blessed" stack that modules should use.
Deviations require Architecture Decision Record.
</action>

<invoke-task name="save-with-checkpoint">
  <param name="file_path">{default_output_file}</param>
  <param name="content">{technology_stack}</param>
  <param name="section_name">Technology Stack</param>
</invoke-task>
</step>

<step n="8" goal="Cross-Cutting Concerns">
<action>Document cross-cutting architectural concerns:

- Observability (logging, metrics, tracing)
- Error handling patterns
- Configuration management
- Feature flags strategy
- API versioning strategy
- Testing architecture

These patterns apply to ALL modules.
</action>

<invoke-task name="save-with-checkpoint">
  <param name="file_path">{default_output_file}</param>
  <param name="content">{cross_cutting}</param>
  <param name="section_name">Cross-Cutting Concerns</param>
</invoke-task>
</step>

<step n="9" goal="Generate Frontmatter and Finalize">
<invoke-task name="generate-frontmatter">
  <param name="entity_type">constitution</param>
  <param name="document_type">architecture</param>
  <param name="title">System Architecture - Constitution</param>
</invoke-task>

<action>Assemble the complete Constitution Architecture document</action>

<action>Load and apply checklist: {checklist}</action>

<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ CONSTITUTION ARCHITECTURE COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Created: docs/platform/architecture.md

This architecture now governs ALL downstream entities.
Module architectures must align with these decisions.

**Next Steps:**
1. Create module-specific architectures using create-domain-architecture
2. Reference this document for technology and pattern decisions
3. Create ADRs for any deviations from established patterns
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>
</step>

</workflow>
