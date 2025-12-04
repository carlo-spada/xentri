# Architecture Creation Workflow

<critical>The workflow execution engine is governed by: {project-root}/.bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>This workflow uses ENTITY-FIRST DETECTION - determine entity type before proceeding</critical>
<critical>Communicate all responses in {communication_language}</critical>
<critical>Generate all documents in {document_output_language}</critical>
<critical>NO TIME ESTIMATES - NEVER mention hours, days, weeks, or any time-based predictions</critical>
<critical>CHECKPOINT PROTOCOL: Use save-with-checkpoint task after each major section</critical>

<shared-tasks>
  <task name="select-entity" path="{project-root}/.bmad/bmm/tasks/select-entity.xml" />
  <task name="detect-entity-type" path="{project-root}/.bmad/bmm/tasks/detect-entity-type.xml" />
  <task name="save-with-checkpoint" path="{project-root}/.bmad/bmm/tasks/save-with-checkpoint.xml" />
  <task name="generate-frontmatter" path="{project-root}/.bmad/bmm/tasks/generate-frontmatter.xml" />
  <task name="validate-inheritance" path="{project-root}/.bmad/bmm/tasks/validate-inheritance.xml" />
</shared-tasks>

<workflow>

<step n="0" goal="Entity Detection and Context Setup">
<action>Welcome {user_name} to the Architecture Creation workflow</action>

<invoke-task name="select-entity">
  <param name="prompt_user">true</param>
</invoke-task>

<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏗️ ARCHITECTURE CREATION WORKFLOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Entity Type:    {entity_type_display}
Output Path:    {output_folder_resolved}architecture.md
Parent Arch:    {parent_architecture_path or "N/A (Constitution)"}
FR Prefix:      {fr_prefix}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>

<action>Select template and checklist based on entity_type:
<check if="entity_type == 'constitution'">
<set var="active_template">{templates.constitution}</set>
<set var="active_checklist">{checklists.constitution}</set>
</check>
<check if="entity_type != 'constitution'">
<set var="active_template">{templates.domain}</set>
<set var="active_checklist">{checklists.domain}</set>
</check>
</action>
</step>

<step n="0.5" goal="Load Input Documents and Validate Prerequisites">
<invoke-protocol name="discover_inputs" />

<check if="entity_prd_content is empty">
  <output>⚠️ PRD for {entity_type_display} not found at {output_folder_resolved}prd.md

The architecture should be based on the PRD requirements.
Please create the PRD first using create-prd workflow.</output>
<ask>Continue anyway? (y/n)</ask>
<check if="response != 'y'">
<action>Exit workflow</action>
</check>
</check>

<check if="entity_type != 'constitution' AND parent_architecture_content is empty">
  <output>⚠️ Parent architecture not found at {parent_architecture_path}

Domain architectures should inherit from their parent.
This {entity_type_display} should reference its parent's architectural decisions.</output>
<ask>Continue without parent architecture? (y/n)</ask>
<check if="response != 'y'">
<action>Exit workflow</action>
</check>
</check>

<check if="existing_architecture_content is not empty">
  <ask>Existing architecture found. Do you want to:
  [u] Update - Use amend-architecture workflow
  [r] Replace - Start fresh
  [c] Cancel</ask>
  <check if="response == 'u'">
    <output>Use amend-architecture workflow instead.</output>
    <action>Exit workflow</action>
  </check>
  <check if="response == 'c'">
    <action>Exit workflow</action>
  </check>
</check>
</step>

<step n="1" goal="Architecture Vision and Principles">
<action>Define the architectural vision aligned with {entity_type_display} PRD:

<check if="entity_type == 'constitution'">
"Let's establish the architectural vision for the entire system.
What are the fundamental architectural principles that will guide all decisions?"

Extract from PRD:

- Core principles that affect architecture
- PR-xxx that have architectural implications
- IC-xxx that define integration architecture
  </check>

<check if="entity_type != 'constitution'">
"Let's define how this {entity_type_display} implements the parent architecture.
What specific architectural decisions are needed for this scope?"

Extract from PRD:

- FR-{entity_code}-xxx requirements with architectural implications
- How this entity extends/specializes parent architecture
- Any deviations that need ADR documentation
  </check>

Key questions:

- What architectural style best supports the vision?
- What are the non-negotiable architectural constraints?
- What trade-offs are we making and why?
  </action>

<action>Document:

- Architectural vision statement
- Core architectural principles (3-7 principles)
- Key trade-offs and rationale
  <check if="entity_type != 'constitution'">
- Inheritance from parent architecture
- Deviations with justification
  </check>
  </action>

<invoke-task name="save-with-checkpoint">
  <param name="file_path">{default_output_file}</param>
  <param name="content">{architecture_vision}</param>
  <param name="section_name">Architecture Vision</param>
</invoke-task>
</step>

<step n="2" goal="System/Module Context and Boundaries">
<action>Define the context and boundaries:

<check if="entity_type == 'constitution'">
"Let's map out what's inside our system vs external."

Document:

- System boundary (what's in scope)
- External systems and integrations
- User types and access points
- Data flows in and out of system

Create a C4-style context diagram description.
</check>

<check if="entity_type != 'constitution'">
"Let's define this {entity_type_display}'s boundaries within the larger system."

Document:

- Module boundary (what's in scope for THIS entity)
- Dependencies on other modules/services
- APIs exposed and consumed
- Data ownership and flows
  </check>
  </action>

<invoke-task name="save-with-checkpoint">
  <param name="file_path">{default_output_file}</param>
  <param name="content">{context_boundaries}</param>
  <param name="section_name">Context and Boundaries</param>
</invoke-task>
</step>

<step n="3" goal="High-Level Architecture">
<action>Define the high-level architecture:

Load {architecture_patterns} and {pattern_categories} for reference.

<check if="entity_type == 'constitution'">
Key decisions (system-wide):
1. **Architectural Style** - Microservices, modular monolith, hybrid?
2. **Deployment Model** - Cloud, on-prem, hybrid?
3. **Data Architecture** - Single DB, polyglot, event-sourced?
4. **Integration Pattern** - Sync, async, event-driven?
</check>

<check if="entity_type != 'constitution'">
Key decisions (module-specific):
1. **Component Structure** - How is this module organized internally?
2. **Data Model** - What data does this module own?
3. **API Design** - What interfaces does this module expose?
4. **Integration** - How does this module integrate with others?

IMPORTANT: Reference parent architecture for system-wide decisions.
Only document decisions SPECIFIC to this {entity_type_display}.
</check>

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

<step n="4" goal="Data Architecture" conditional="entity_type == 'constitution' OR module_has_data">
<action>Define the data architecture:

<check if="entity_type == 'constitution'">
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
  </check>

<check if="entity_type != 'constitution'">
Based on FR-{entity_code}-xxx from PRD:
- Data models owned by this module
- Database schema design
- Relationships to other modules' data
- Data access patterns

INHERIT from parent:

- Database technology (use parent's choice)
- Multi-tenancy strategy (follow parent's pattern)
- Caching approach (follow parent's pattern)
  </check>
  </action>

<invoke-task name="save-with-checkpoint">
  <param name="file_path">{default_output_file}</param>
  <param name="content">{data_architecture}</param>
  <param name="section_name">Data Architecture</param>
</invoke-task>
</step>

<step n="5" goal="Security Architecture" conditional="entity_type == 'constitution' OR module_has_security">
<action>Define the security architecture:

<check if="entity_type == 'constitution'">
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
  </check>

<check if="entity_type != 'constitution'">
Based on FR-{entity_code}-xxx from PRD:
- Module-specific permissions
- Data access controls
- Sensitive data handling

INHERIT from parent:

- Authentication mechanism
- Token format and validation
- Encryption standards
  </check>
  </action>

<invoke-task name="save-with-checkpoint">
  <param name="file_path">{default_output_file}</param>
  <param name="content">{security_architecture}</param>
  <param name="section_name">Security Architecture</param>
</invoke-task>
</step>

<step n="6" goal="Technology Stack" conditional="entity_type == 'constitution'">
<note>This step is Constitution-only. Domain entities inherit the tech stack.</note>

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

<step n="7" goal="Cross-Cutting Concerns">
<action>Document cross-cutting architectural concerns:

<check if="entity_type == 'constitution'">
Define system-wide patterns:
- Observability (logging, metrics, tracing)
- Error handling patterns
- Configuration management
- Feature flags strategy
- API versioning strategy
- Testing architecture

These patterns apply to ALL modules.
</check>

<check if="entity_type != 'constitution'">
Document how this module implements parent patterns:
- Logging format and levels used
- Error codes and handling
- Configuration sources
- Testing approach

Note any module-specific patterns not covered by parent.
</check>
</action>

<invoke-task name="save-with-checkpoint">
  <param name="file_path">{default_output_file}</param>
  <param name="content">{cross_cutting}</param>
  <param name="section_name">Cross-Cutting Concerns</param>
</invoke-task>
</step>

<step n="8" goal="Validate Inheritance" conditional="entity_type != 'constitution'">
<invoke-task name="validate-inheritance">
  <param name="document_type">architecture</param>
  <param name="entity_path">{output_folder_resolved}</param>
  <param name="parent_path">{parent_architecture_path}</param>
</invoke-task>

<check if="inheritance_violations found">
  <output>⚠️ Inheritance violations detected:
  {inheritance_violations}

Domain architectures can ADD to parent but cannot CONTRADICT.</output>
<ask>Fix violations before continuing? (y/n)</ask>
<check if="response == 'y'">
<action>Return to relevant step to fix violations</action>
</check>
</check>
</step>

<step n="9" goal="Generate Frontmatter and Finalize">
<invoke-task name="generate-frontmatter">
  <param name="entity_type">{entity_type}</param>
  <param name="document_type">architecture</param>
  <param name="title">{entity_type_display} Architecture</param>
</invoke-task>

<action>Assemble the complete architecture document</action>

<action>Load and apply checklist: {active_checklist}</action>

<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ {entity_type_display} ARCHITECTURE COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Created: {default_output_file}

<check if="entity_type == 'constitution'">
This architecture now governs ALL downstream entities.
Module architectures must align with these decisions.

**Next Steps:**

1. Create module-specific architectures for Infrastructure Modules
2. Reference this document for technology and pattern decisions
3. Create ADRs for any deviations from established patterns
   </check>

<check if="entity_type != 'constitution'">
This architecture inherits from: {parent_architecture_path}

**Next Steps:**

1. Validate alignment with parent architecture
2. Create epics and stories based on this architecture
3. Create ADRs for any approved deviations
   </check>
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   </output>
   </step>

</workflow>
