# UX Design Creation Workflow (Unified)

<critical>The workflow execution engine is governed by: {project-root}/.bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>This creates UX DESIGN for ANY entity type (Constitution, Infrastructure, Strategic, Coordination, Business)</critical>
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
🎨 UX DESIGN CREATION WORKFLOW (Unified)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Entity Type:        {entity_type_display}
Output Path:        {output_folder_resolved}ux-design.md
Constitution UX:    docs/platform/ux-design.md
Parent UX:          {parent_ux_path}

This workflow creates the UX Design document for your entity.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>

<invoke-protocol name="discover_inputs" />

<check if="entity_type == 'constitution'">
  <action>Load Constitution Context:
  - PRD: docs/platform/prd.md
  - Product Brief: docs/platform/product-brief.md
  - Architecture: docs/platform/architecture.md
  </action>
</check>

<check if="entity_type != 'constitution'">
  <action>Extract inherited UX context:
  1. From Constitution (docs/platform/ux-design.md):
     - Design System Foundation
     - Color System
     - UX Patterns
     - Accessibility Requirements
  2. From Parent ({parent_ux_path}):
     - Parent Design Direction
     - Scope Boundaries
  </action>
</check>
</step>

<step n="1" goal="UX Vision and Purpose">
<action>Define UX Vision/Purpose:</action>

<check if="entity_type == 'constitution'">
  <action>Constitution Vision:
  - Platform-wide UX Principles (5-7 core principles)
  - Design System Selection (Material, Shadcn, etc.)
  - Visual Foundation (Colors, Typography, Spacing)
  </action>
</check>

<check if="entity_type != 'constitution'">
  <action>Entity Purpose:
  - Specific UX focus for this entity
  - User Personas (if applicable)
  - Alignment with Parent Vision
  </action>
</check>

<invoke-task name="save-with-checkpoint">
  <param name="file_path">{default_output_file}</param>
  <param name="content">{ux_vision}</param>
  <param name="section_name">UX Vision</param>
</invoke-task>
</step>

<step n="2" goal="Core Design Decisions">
<action>Define core design decisions:</action>

<check if="entity_type == 'constitution'">
  <action>Define System Standards:
  - Platform-Wide UX Patterns (Buttons, Forms, Modals)
  - Accessibility Strategy (WCAG Level)
  - Responsive Strategy (Breakpoints)
  </action>
</check>

<check if="entity_type != 'constitution'">
  <action>Define Entity Patterns:
  - User Flows & Screens
  - Entity-Specific Components
  - States & Interactions (Loading, Error, Empty)
  </action>
</check>

<invoke-task name="save-with-checkpoint">
  <param name="file_path">{default_output_file}</param>
  <param name="content">{core_decisions}</param>
  <param name="section_name">Core Decisions</param>
</invoke-task>
</step>

<step n="3" goal="Detailed Design Specification" if="entity_type != 'constitution'">
<check if="entity_type == 'business_module'">
  <action>Business Module Details:
  - Detailed Component Specs
  - Visual Mockup Directions (HTML generation)
  </action>
</check>

<check if="entity_type == 'infrastructure_module'">
  <action>Infrastructure Details:
  - Exposed UI Components
  - Developer Experience UX
  </action>
</check>

<invoke-task name="save-with-checkpoint">
  <param name="file_path">{default_output_file}</param>
  <param name="content">{detailed_design}</param>
  <param name="section_name">Detailed Design</param>
</invoke-task>
</step>

<step n="4" goal="Accessibility & Responsive Implementation">
<action>Document implementation details:</action>

<check if="entity_type == 'constitution'">
  <action>Define Requirements:
  - Keyboard Navigation Standards
  - Focus Management Rules
  - Touch Target Minimums
  </action>
</check>

<check if="entity_type != 'constitution'">
  <action>Apply Requirements:
  - How this entity meets accessibility goals
  - Specific responsive adaptations
  </action>
</check>

<invoke-task name="save-with-checkpoint">
  <param name="file_path">{default_output_file}</param>
  <param name="content">{implementation_details}</param>
  <param name="section_name">Implementation Details</param>
</invoke-task>
</step>

<step n="5" goal="Validate and Finalize">
<check if="entity_type != 'constitution'">
  <invoke-task name="validate-inheritance">
    <param name="document_content">{generated_content}</param>
    <param name="document_type">ux-design</param>
    <param name="entity_type">{entity_type}</param>
    <param name="parent_path">{parent_ux_path}</param>
    <param name="constitution_path">{constitution_ux_path}</param>
  </invoke-task>

  <check if="validation.is_valid == false">
    <output>⚠️ UX violates constraints: {validation.violations}</output>
    <action>Resolve violations</action>
  </check>
</check>

<invoke-task name="generate-frontmatter">
  <param name="entity_type">{entity_type}</param>
  <param name="document_type">ux-design</param>
  <param name="title">{entity_name} UX Design</param>
</invoke-task>

<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ UX DESIGN COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Created: {output_folder_resolved}ux-design.md
Entity:  {entity_type_display}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>
</step>

</workflow>
