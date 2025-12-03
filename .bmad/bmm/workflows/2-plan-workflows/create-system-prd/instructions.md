# System PRD Workflow - Constitution Level

<critical>The workflow execution engine is governed by: {project-root}/.bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>This creates the CONSTITUTION PRD - the foundational document ALL entities inherit from</critical>
<critical>Communicate all responses in {communication_language}</critical>
<critical>Generate all documents in {document_output_language}</critical>
<critical>LIVING DOCUMENT: Write to PRD.md continuously as you discover - never wait until the end</critical>
<critical>NO TIME ESTIMATES - NEVER mention hours, days, weeks, or any time-based predictions</critical>
<critical>CHECKPOINT PROTOCOL: Use save-with-checkpoint task after each section to ensure user approval</critical>

<shared-tasks>
  <task name="save-with-checkpoint" path="{project-root}/.bmad/bmm/tasks/save-with-checkpoint.xml" />
  <task name="generate-frontmatter" path="{project-root}/.bmad/bmm/tasks/generate-frontmatter.xml" />
</shared-tasks>

<workflow>

<step n="0" goal="Confirm Constitution Context">
<action>Welcome {user_name} to the Constitution PRD creation workflow</action>

<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏛️ CONSTITUTION PRD WORKFLOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Entity Type:    Constitution
Output Path:    docs/platform/prd.md
FR Prefix:      PR-xxx (Platform Requirements)
                IC-xxx (Integration Contracts)

This is the FOUNDATIONAL document that:
- Defines system-wide rules ALL entities must follow
- Establishes Platform Requirements (PR-xxx)
- Defines Integration Contracts (IC-xxx)
- Cannot be contradicted by ANY downstream entity
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>

<check if="existing PRD exists at output path">
  <ask>An existing Constitution PRD was found. Do you want to:
  [u] Update - Amend the existing PRD (preserves structure)
  [r] Replace - Start fresh (creates new PRD)
  [c] Cancel - Exit workflow</ask>
  <action>WAIT for user response</action>
  <check if="response == 'c'">
    <action>Exit workflow</action>
  </check>
  <check if="response == 'u'">
    <output>For amendments, please use the amend-system-prd workflow instead.</output>
    <action>Exit and suggest amend-system-prd workflow</action>
  </check>
</check>
</step>

<step n="0.5" goal="Discover and load input documents">
<invoke-protocol name="discover_inputs" />
<note>After discovery: {product_brief_content}, {existing_prd_content} available</note>
</step>

<step n="1" goal="Vision & System Purpose">
<action>Begin discovery conversation focused on SYSTEM-LEVEL concerns:

"Let's define the foundational vision for the entire system.
Tell me about the overarching purpose - what is this platform meant to achieve?"

Key questions for Constitution:
- What is the core mission of this platform?
- What fundamental principles must ALL components follow?
- What are the non-negotiable system behaviors?
- What makes this platform unique at its core?
</action>

<action>Capture the SYSTEM VISION:
- Platform mission and purpose
- Core value proposition
- Fundamental principles
- What success looks like at the system level
</action>

<action>Generate content for system_vision and core_principles sections</action>

<invoke-task name="save-with-checkpoint">
  <param name="file_path">{default_output_file}</param>
  <param name="content">{system_vision_content}</param>
  <param name="section_name">System Vision</param>
</invoke-task>

<invoke-task name="save-with-checkpoint">
  <param name="file_path">{default_output_file}</param>
  <param name="content">{core_principles_content}</param>
  <param name="section_name">Core Principles</param>
</invoke-task>
</step>

<step n="2" goal="Platform Requirements (PR-xxx)">
<action>Define Platform Requirements - the MUST rules for all entities:

"Now let's establish the Platform Requirements. These are the non-negotiable
rules that EVERY module, service, and component must follow."

Guide the discovery:
- Multi-tenancy rules (org_id, RLS, data isolation)
- Event system requirements (event spine, envelope format)
- Authentication/Authorization requirements
- Data handling requirements
- Error handling requirements
- Logging and observability requirements
- Performance baselines
- Security baselines

For each requirement:
- Assign PR-xxx identifier (sequential)
- Write clear, testable requirement
- Explain WHY it's a platform requirement
- Note enforcement mechanism if applicable
</action>

<example>
**Well-formed Platform Requirements:**

PR-001: All database tables MUST include `org_id` column with Row-Level Security policy
- Rationale: Multi-tenant data isolation from day zero
- Enforcement: Schema validation, migration checks

PR-002: All mutations MUST emit events to Event Spine with standard envelope format
- Rationale: Event-first architecture enables audit trail and async processing
- Enforcement: Middleware validation, integration tests

PR-003: All API endpoints MUST require authentication except designated health checks
- Rationale: Zero-trust security posture
- Enforcement: Auth middleware, penetration tests
</example>

<action>Generate content for platform_requirements section</action>

<invoke-task name="save-with-checkpoint">
  <param name="file_path">{default_output_file}</param>
  <param name="content">{platform_requirements_content}</param>
  <param name="section_name">Platform Requirements (PR-xxx)</param>
</invoke-task>
</step>

<step n="3" goal="Integration Contracts (IC-xxx)">
<action>Define Integration Contracts - the interfaces between system components:

"Now let's establish the Integration Contracts. These define HOW components
communicate with each other - the shared interfaces and protocols."

Key contract areas:
- Event envelope schema and naming conventions
- API versioning strategy
- Module registration format
- Shared data access patterns
- Notification delivery protocol
- Permission check protocol
- Error response format

For each contract:
- Assign IC-xxx identifier (sequential)
- Define the interface clearly
- Specify required fields/methods
- Note version if applicable
</action>

<example>
**Well-formed Integration Contracts:**

IC-001: Event Envelope Schema
- All events MUST use SystemEvent interface
- Required fields: id, type, timestamp, orgId, payload, metadata
- Type format: `xentri.{category}.{entity}.{action}.{version}`

IC-002: Module Registration Manifest
- Modules register via manifest.yaml with required fields
- Required: name, version, code (3-letter), routes, permissions

IC-003: Brief Access API
- All modules access Brief via `GET /api/v1/brief/{section}`
- Modules MUST NOT write to Brief directly
- Response format: BriefSection interface
</example>

<action>Generate content for integration_contracts section</action>

<invoke-task name="save-with-checkpoint">
  <param name="file_path">{default_output_file}</param>
  <param name="content">{integration_contracts_content}</param>
  <param name="section_name">Integration Contracts (IC-xxx)</param>
</invoke-task>
</step>

<step n="4" goal="System-Wide NFRs">
<action>Define Non-Functional Requirements that apply system-wide:

These are the quality attributes ALL components must achieve:
- Performance baselines (latency, throughput)
- Availability targets
- Security standards
- Compliance requirements
- Accessibility standards
- Scalability expectations

Only include NFRs that are truly SYSTEM-WIDE.
Module-specific NFRs belong in their own PRDs.
</action>

<action>Generate content for system_nfrs section</action>

<invoke-task name="save-with-checkpoint">
  <param name="file_path">{default_output_file}</param>
  <param name="content">{system_nfrs_content}</param>
  <param name="section_name">System-Wide NFRs</param>
</invoke-task>
</step>

<step n="5" goal="Governance & Change Process">
<action>Define how the Constitution itself can be changed:

"The Constitution is protected. Let's define how changes are proposed and approved."

Document:
- What triggers a Constitution change
- Who can propose changes
- Approval process
- Impact assessment requirements
- Version control and changelog requirements
- Commit message format for Constitution changes
</action>

<action>Generate content for governance_rules section</action>

<invoke-task name="save-with-checkpoint">
  <param name="file_path">{default_output_file}</param>
  <param name="content">{governance_rules_content}</param>
  <param name="section_name">Governance & Change Process</param>
</invoke-task>
</step>

<step n="6" goal="Generate Frontmatter and Finalize">
<invoke-task name="generate-frontmatter">
  <param name="entity_type">constitution</param>
  <param name="document_type">prd</param>
  <param name="fr_prefix">PR/IC</param>
  <param name="title">System PRD - Constitution</param>
</invoke-task>

<action>Assemble the complete Constitution PRD with:
- Generated frontmatter
- System vision and principles
- Platform Requirements (PR-xxx)
- Integration Contracts (IC-xxx)
- System-wide NFRs
- Governance rules
</action>

<invoke-task name="save-with-checkpoint">
  <param name="file_path">{default_output_file}</param>
  <param name="content">{complete_document}</param>
  <param name="section_name">Complete Constitution PRD</param>
  <param name="is_new_file">true</param>
</invoke-task>
</step>

<step n="7" goal="Validation and Summary">
<action>Load and apply checklist: {checklist}</action>
<action>Validate the Constitution PRD against the checklist</action>

<check if="validation fails">
  <output>⚠️ Validation issues found:</output>
  <action>List each failed check</action>
  <ask>Address these issues now? (y/n)</ask>
</check>

<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ CONSTITUTION PRD COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Created: docs/platform/prd.md

Summary:
- {pr_count} Platform Requirements (PR-xxx)
- {ic_count} Integration Contracts (IC-xxx)
- System-wide NFRs documented
- Governance rules established

This Constitution now governs ALL downstream entities.
Any new Infrastructure Module, Strategic Container,
Coordination Unit, or Business Module MUST inherit
from and not contradict these requirements.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Next Steps:**
1. Create Infrastructure Module PRDs (docs/platform/{module}/prd.md)
2. Create Strategic Container PRDs (docs/{category}/prd.md)

Use `create-domain-prd` workflow for these.
</output>
</step>

</workflow>
