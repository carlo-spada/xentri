# Domain UX Design Workflow - Federated Requirements

<critical>The workflow execution engine is governed by: {project-root}/.bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>This creates UX Design for: Infrastructure Module, Strategic Container, Coordination Unit, Business Module</critical>
<critical>Communicate all responses in {communication_language}</critical>
<critical>Generate all documents in {document_output_language}</critical>
<critical>LIVING DOCUMENT: Write to ux-design.md continuously as you discover - never wait until the end</critical>
<critical>NO TIME ESTIMATES - NEVER mention hours, days, weeks, or any time-based predictions</critical>
<critical>CHECKPOINT PROTOCOL: Use save-with-checkpoint task after each section to ensure user approval</critical>
<critical>INHERITANCE: This UX Design MUST NOT contradict parent UX or Constitution UX</critical>
<critical>VISUAL COLLABORATION: Generate HTML visualizations for design decisions</critical>

<shared-tasks>
  <task name="save-with-checkpoint" path="{project-root}/.bmad/bmm/tasks/save-with-checkpoint.xml" />
  <task name="generate-frontmatter" path="{project-root}/.bmad/bmm/tasks/generate-frontmatter.xml" />
  <task name="detect-entity-type" path="{project-root}/.bmad/bmm/tasks/detect-entity-type.xml" />
  <task name="validate-inheritance" path="{project-root}/.bmad/bmm/tasks/validate-inheritance.xml" />
</shared-tasks>

<workflow>

<step n="0" goal="Determine Entity Type and Context">
<check if="entity_type is not set or empty">
  <action>Entity type not provided - invoke detection task</action>
  <invoke-task name="detect-entity-type">
    <param name="prompt_user">true</param>
  </invoke-task>
  <action>Store returned variables: entity_type, entity_type_display, output_folder_resolved, parent_ux_path, entity_code</action>
</check>

<check if="entity_type == 'constitution'">
  <output>⚠️ Constitution detected. Use create-system-ux workflow instead.</output>
  <action>Exit and redirect to create-system-ux</action>
</check>

<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎨 DOMAIN UX DESIGN WORKFLOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Entity Type:    {entity_type_display}
Output Path:    {output_folder_resolved}ux-design.md
Parent UX:      {parent_ux_path}
Constitution:   docs/platform/ux-design.md

This UX Design will:

- Inherit from {parent_ux_path}
- Inherit Constitution UX principles
- Add designs specific to this scope
- NOT contradict parent or Constitution
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>

<check if="existing UX exists at output path">
  <ask>An existing UX Design was found at this level. Do you want to:
  [u] Update - Amend the existing UX
  [r] Replace - Start fresh
  [c] Cancel - Exit workflow</ask>
  <check if="response == 'u'">
    <output>For amendments, please use the amend-domain-ux workflow.</output>
    <action>Exit and suggest amend-domain-ux workflow</action>
  </check>
  <check if="response == 'c'">
    <action>Exit workflow</action>
  </check>
</check>
</step>

<step n="0.5" goal="Load Parent Context and Input Documents">
<invoke-protocol name="discover_inputs" />
<note>Available: {constitution_ux_content}, {parent_ux_content}, {entity_prd_content}, {entity_architecture_content}, {existing_ux_content}</note>

<action>Extract inherited UX context:

1. Load Constitution UX (docs/platform/ux-design.md)
   - Design system foundation
   - Color system
   - UX patterns
   - Accessibility requirements
   - These are INHERITED

2. Load Parent UX ({parent_ux_path})
   - Parent's design direction
   - Parent's customizations
   - Scope boundaries

3. Load Entity PRD
   - Features requiring UX design
   - User flows
   - Functional requirements

4. Summarize inheritance context for user
   </action>

<output>
📜 Inherited UX Context Summary:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
From Constitution:
- Design System: {design_system}
- Color Palette: {color_summary}
- UX Patterns: {pattern_count} patterns defined
- Accessibility: WCAG {wcag_level}

From Parent ({parent_ux_path}):

- Design Direction: {parent_direction}
- Custom Patterns: {parent_customizations}

You may ADD UX designs but not CONTRADICT these.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>
</step>

<step n="1" goal="Entity UX Purpose and Scope">
<action>Define the UX purpose of THIS entity within the hierarchy:

For {entity_type_display}, focus on:
</action>

<check if="entity_type == 'infrastructure_module'">
  <action>Infrastructure Module UX focus:
  - What interfaces does this module expose?
  - What components does it provide to other modules?
  - What error states need UX design?
  - How does it follow Constitution patterns?

Key questions:
"What UI components does this module provide?"
"What loading/error states need design?"
"What developer experience considerations exist?"
</action>
</check>

<check if="entity_type == 'strategic_container'">
  <action>Strategic Container UX focus:
  - Who are the users of this category?
  - What is the category-level experience goal?
  - What design direction fits this category?
  - How do children within this category share UX patterns?

Key questions:
"What business outcomes does this category's UX deliver?"
"What unifies the experience across child modules?"
"What user personas use this category?"
</action>
</check>

<check if="entity_type == 'coordination_unit'">
  <action>Coordination Unit UX focus:
  - How do modules within this subcategory integrate visually?
  - What shared user flows span modules?
  - What component patterns are shared?
  - How does navigation work between modules?

Key questions:
"How do users flow between modules in this subcategory?"
"What shared UI patterns exist?"
"What coordination is needed between module UIs?"
</action>
</check>

<check if="entity_type == 'business_module'">
  <action>Business Module UX focus:
  - What screens does this feature need?
  - What are the user flows?
  - What states (loading, error, empty) need design?
  - What custom components are needed?

Key questions:
"What does the user see when using this feature?"
"What is the step-by-step flow?"
"What feedback do users get at each step?"
</action>
</check>

<action>Generate content for ux_purpose and scope_definition sections</action>

<invoke-task name="save-with-checkpoint">
  <param name="file_path">{default_output_file}</param>
  <param name="content">{ux_purpose_content}</param>
  <param name="section_name">UX Purpose</param>
</invoke-task>
</step>

<step n="2" goal="User Context" if="entity_type in ['strategic_container', 'coordination_unit', 'business_module']">
<action>Define the users of this entity:

For user-facing entities, understand:

- Primary user personas
- User goals and motivations
- User skill levels
- Device preferences
- Pain points to address
  </action>

<ask>Who are the primary users of this {entity_type_display}?

Describe:

- Who they are
- What they're trying to accomplish
- Their technical comfort level
- When/where they use this</ask>

<invoke-task name="save-with-checkpoint">
  <param name="file_path">{default_output_file}</param>
  <param name="content">{user_personas_content}</param>
  <param name="section_name">User Personas</param>
</invoke-task>
</step>

<step n="3" goal="User Flows and Screens">
<action>Design the user flows for this entity:

Based on PRD requirements at this level, identify:

- Primary user journeys
- Screen sequence for each journey
- Decision points and branching
- Error handling
- Success states
  </action>

<check if="entity_type == 'infrastructure_module'">
  <action>For infrastructure, focus on:
  - Component showcase (if UI module)
  - Error state gallery
  - Loading state patterns
  - Developer documentation UX
  </action>
</check>

<check if="entity_type == 'strategic_container'">
  <action>For strategic container, focus on:
  - Category entry experience
  - Overview/dashboard pattern
  - Navigation between subcategories
  - Cross-cutting workflows
  </action>
</check>

<check if="entity_type == 'coordination_unit'">
  <action>For coordination unit, focus on:
  - Module switching UX
  - Shared workflows
  - Data handoff between modules
  - Subcategory-level navigation
  </action>
</check>

<check if="entity_type == 'business_module'">
  <action>For business module, focus on:
  - Feature screens (list, detail, create, edit)
  - Complete user flows
  - All states (loading, error, empty, success)
  - Transitions and feedback
  </action>

<action>Generate design direction mockups:
Create: {design_directions_html}

Show 3-4 approaches for key screens with:

- Different layout options
- Information hierarchy variations
- Interaction pattern alternatives
  </action>

<output>🎨 Design Direction Mockups Created!

Open: {design_directions_html}

Explore the design approaches and tell me which resonates.</output>

<ask>Which design direction works for this module?</ask>
</check>

<invoke-task name="save-with-checkpoint">
  <param name="file_path">{default_output_file}</param>
  <param name="content">{user_flows_content}</param>
  <param name="section_name">User Flows</param>
</invoke-task>
</step>

<step n="4" goal="Component Specifications" if="entity_type == 'business_module'">
<action>Specify custom components needed for this module:

For components not covered by the design system:

- Component purpose
- Anatomy (elements)
- States (default, hover, focus, disabled, loading, error)
- Variants (sizes, styles)
- Props/configuration
- Accessibility requirements
- Usage examples
  </action>

<invoke-task name="save-with-checkpoint">
  <param name="file_path">{default_output_file}</param>
  <param name="content">{component_specs_content}</param>
  <param name="section_name">Component Specifications</param>
</invoke-task>
</step>

<step n="4b" goal="Entity-Specific Patterns">
<check if="entity_type == 'infrastructure_module'">
  <action>Document exposed UX components:

**Exposed Components:**
What components does this module provide?

- Component API
- Theme integration
- Accessibility features
- Usage guidelines

**Consumed Patterns:**
What Constitution patterns does this module use?
</action>

  <invoke-task name="save-with-checkpoint">
    <param name="file_path">{default_output_file}</param>
    <param name="content">{exposed_components_content}</param>
    <param name="section_name">Exposed Components</param>
  </invoke-task>
</check>

<check if="entity_type == 'strategic_container'">
  <action>Document category-level UX coordination:

**Category Design Direction:**
Visual approach for this business domain

**Child Coordination Guidelines:**
How children should share UX patterns

**Navigation Strategy:**
How users move within this category
</action>

  <invoke-task name="save-with-checkpoint">
    <param name="file_path">{default_output_file}</param>
    <param name="content">{category_ux_content}</param>
    <param name="section_name">Category UX Coordination</param>
  </invoke-task>
</check>

<check if="entity_type == 'coordination_unit'">
  <action>Document module integration UX:

**Module Orchestration:**
How modules appear and flow together

**Shared Components:**
Components used across child modules

**Integration Patterns:**
UX for cross-module workflows
</action>

  <invoke-task name="save-with-checkpoint">
    <param name="file_path">{default_output_file}</param>
    <param name="content">{module_integration_content}</param>
    <param name="section_name">Module Integration UX</param>
  </invoke-task>
</check>
</step>

<step n="5" goal="States and Interactions">
<action>Document all states and interaction patterns:

For this {entity_type_display}, specify:

- Loading states (skeletons, spinners, progress)
- Error states (inline, modal, page-level)
- Empty states (first use, no results, cleared)
- Success states (confirmation, next steps)
- Transitions (enter, exit, between states)
  </action>

<invoke-task name="save-with-checkpoint">
  <param name="file_path">{default_output_file}</param>
  <param name="content">{states_interactions_content}</param>
  <param name="section_name">States and Interactions</param>
</invoke-task>
</step>

<step n="6" goal="Accessibility Implementation">
<action>Document accessibility implementation for this entity:

Based on Constitution WCAG {wcag_level} requirement:

- Keyboard navigation for all interactions
- Focus management
- ARIA labels
- Screen reader considerations
- Color contrast verification
- Touch target sizes
  </action>

<invoke-task name="save-with-checkpoint">
  <param name="file_path">{default_output_file}</param>
  <param name="content">{accessibility_content}</param>
  <param name="section_name">Accessibility Implementation</param>
</invoke-task>
</step>

<step n="7" goal="Responsive Behavior">
<action>Document responsive behavior for this entity:

Based on Constitution breakpoints:

- Desktop behavior
- Tablet adaptation
- Mobile adaptation
- Content priority changes
- Navigation changes
  </action>

<invoke-task name="save-with-checkpoint">
  <param name="file_path">{default_output_file}</param>
  <param name="content">{responsive_content}</param>
  <param name="section_name">Responsive Behavior</param>
</invoke-task>
</step>

<step n="8" goal="Validate Inheritance">
<invoke-task name="validate-inheritance">
  <param name="document_content">{generated_content}</param>
  <param name="document_type">ux-design</param>
  <param name="entity_type">{entity_type}</param>
  <param name="parent_path">{parent_ux_path}</param>
  <param name="constitution_path">{constitution_ux_path}</param>
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
</step>

<step n="9" goal="Generate Frontmatter and Finalize">
<invoke-task name="generate-frontmatter">
  <param name="entity_type">{entity_type}</param>
  <param name="entity_type_display">{entity_type_display}</param>
  <param name="document_type">ux-design</param>
  <param name="parent_path">{parent_ux_path}</param>
  <param name="title">{entity_name} UX Design</param>
</invoke-task>

<action>Assemble the complete Domain UX Design with:

- Generated frontmatter with inheritance reference
- UX purpose and scope
- User personas (if applicable)
- User flows and screens
- Component specifications (if applicable)
- Entity-specific patterns
- States and interactions
- Accessibility implementation
- Responsive behavior
  </action>

<invoke-task name="save-with-checkpoint">
  <param name="file_path">{default_output_file}</param>
  <param name="content">{complete_document}</param>
  <param name="section_name">Complete {entity_type_display} UX Design</param>
  <param name="is_new_file">true</param>
</invoke-task>
</step>

<step n="10" goal="Select and Apply Checklist">
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

<action>Validate UX Design against the selected checklist</action>

<check if="validation fails">
  <output>⚠️ Checklist validation issues:</output>
  <action>List each failed check</action>
  <ask>Address these issues now? (y/n)</ask>
</check>
</step>

<step n="11" goal="Summary and Next Steps">
<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ {entity_type_display} UX DESIGN COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Created: {output_folder_resolved}ux-design.md

Summary:

- {flow_count} User Flows documented
- {component_count} Component Specifications
- Inherits from: {parent_ux_path}
- Validated against: Constitution + Parent UX
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Next Steps:**
</output>

<check if="entity_type == 'infrastructure_module'">
  <output>
1. Create Epics: `create-epics` workflow
2. Begin implementation after Epics
  </output>
</check>

<check if="entity_type == 'strategic_container'">
  <output>
1. Create child Coordination Units or Business Modules
2. Each child uses `create-domain-ux` workflow
3. Or create Epics for category-level work
  </output>
</check>

<check if="entity_type == 'coordination_unit'">
  <output>
1. Create child Business Module UX Designs
2. Each uses `create-domain-ux` workflow
3. Or create Epics for coordination-level work
  </output>
</check>

<check if="entity_type == 'business_module'">
  <output>
1. Create Epics: `create-epics` workflow
2. Generate wireframes or prototypes (optional)
3. Begin implementation
  </output>
</check>
</step>

</workflow>
