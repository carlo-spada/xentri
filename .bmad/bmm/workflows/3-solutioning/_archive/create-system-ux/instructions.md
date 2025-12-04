# System UX Design Workflow - Constitution Level

<critical>The workflow execution engine is governed by: {project-root}/.bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>This creates the CONSTITUTION UX DESIGN - the foundational UX document ALL entities inherit from</critical>
<critical>Communicate all responses in {communication_language}</critical>
<critical>Generate all documents in {document_output_language}</critical>
<critical>LIVING DOCUMENT: Write to ux-design.md continuously as you discover - never wait until the end</critical>
<critical>NO TIME ESTIMATES - NEVER mention hours, days, weeks, or any time-based predictions</critical>
<critical>CHECKPOINT PROTOCOL: Use save-with-checkpoint task after each section to ensure user approval</critical>
<critical>VISUAL COLLABORATION: Generate HTML visualizations for color and design decisions</critical>

<shared-tasks>
  <task name="save-with-checkpoint" path="{project-root}/.bmad/bmm/tasks/save-with-checkpoint.xml" />
  <task name="generate-frontmatter" path="{project-root}/.bmad/bmm/tasks/generate-frontmatter.xml" />
</shared-tasks>

<workflow>

<step n="0" goal="Confirm Constitution Context">
<action>Welcome {user_name} to the Constitution UX Design workflow</action>

<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎨 CONSTITUTION UX DESIGN WORKFLOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Entity Type:    Constitution
Output Path:    docs/platform/ux-design.md

This is the FOUNDATIONAL UX document that:

- Establishes platform-wide UX principles
- Defines the design system foundation
- Sets interaction paradigms for ALL entities
- Cannot be contradicted by ANY downstream entity
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>

<check if="existing UX exists at output path">
  <ask>An existing Constitution UX Design was found. Do you want to:
  [u] Update - Amend the existing UX (preserves structure)
  [r] Replace - Start fresh (creates new UX design)
  [c] Cancel - Exit workflow</ask>
  <action>WAIT for user response</action>
  <check if="response == 'c'">
    <action>Exit workflow</action>
  </check>
  <check if="response == 'u'">
    <output>For amendments, please use the amend-system-ux workflow instead.</output>
    <action>Exit and suggest amend-system-ux workflow</action>
  </check>
</check>
</step>

<step n="0.5" goal="Discover and load input documents">
<invoke-protocol name="discover_inputs" />
<note>After discovery: {product_brief_content}, {constitution_prd_content}, {constitution_architecture_content}, {existing_ux_content} available</note>

<action>Extract context from loaded documents:

1. From Product Brief:
   - Brand personality
   - Target users
   - Platform ambitions

2. From Constitution PRD:
   - Platform Requirements (PR-xxx) with UX implications
   - Integration Contracts (IC-xxx) affecting interfaces
   - NFRs (accessibility, performance perception)

3. From Architecture:
   - Technology stack (for design system compatibility)
   - Platform structure (shell, modules)
   - Multi-tenancy implications
     </action>
     </step>

<step n="1" goal="UX Vision and Principles">
<action>Begin discovery focused on PLATFORM-LEVEL UX:

"Let's establish the foundational UX vision for the entire platform.
This will guide every interface decision across all modules."

Key questions for Constitution UX:

- What should users FEEL when using this platform?
- What are the non-negotiable UX principles?
- What differentiates this platform's experience?
- What accessibility standards must we meet?
  </action>

<action>Define 5-7 core UX principles:
Each principle should:

- Be actionable (testable in reviews)
- Apply platform-wide
- Guide trade-off decisions
- Have clear rationale

Example principles:

- "Clarity over cleverness" - Prefer obvious UI over innovative but unclear patterns
- "Progressive disclosure" - Show essentials first, details on demand
- "Visible automation" - Never act without explanation
  </action>

<invoke-task name="save-with-checkpoint">
  <param name="file_path">{default_output_file}</param>
  <param name="content">{ux_vision_content}</param>
  <param name="section_name">UX Vision</param>
</invoke-task>

<invoke-task name="save-with-checkpoint">
  <param name="file_path">{default_output_file}</param>
  <param name="content">{ux_principles_content}</param>
  <param name="section_name">Core UX Principles</param>
</invoke-task>
</step>

<step n="2" goal="Design System Foundation">
<action>Establish the design system that ALL entities will use:

"Now let's choose and configure the design system foundation.
This decision affects every component across the platform."

Present options based on architecture tech stack:

- shadcn/ui (if React/Tailwind detected)
- Material UI
- Chakra UI
- Custom design system (if strong brand requirements)

For each option, explain:

- Component coverage
- Accessibility built-in
- Theming capabilities
- Maintenance implications
  </action>

<action>Research current design system status:
<WebSearch>{design_system} latest version accessibility features 2025</WebSearch>
</action>

<ask>Which design system approach fits the platform vision?

Consider:

- Team familiarity
- Customization needs
- Brand requirements
- Maintenance capacity</ask>

<action>Document design system decision:

- System chosen
- Version (if applicable)
- Rationale
- Customization approach
- Extension strategy
  </action>

<invoke-task name="save-with-checkpoint">
  <param name="file_path">{default_output_file}</param>
  <param name="content">{design_system_content}</param>
  <param name="section_name">Design System Foundation</param>
</invoke-task>
</step>

<step n="3" goal="Visual Foundation - Colors">
<action>Define the platform color system:

"The color palette establishes visual identity and semantic meaning
across ALL platform interfaces."
</action>

<check if="existing brand colors">
  <ask>Do you have existing brand guidelines or colors? (y/n)

If yes, share your brand colors (hex codes preferred).
If no, I'll generate theme options based on platform personality.</ask>
</check>

<check if="no existing brand">
  <action>Generate 3-4 color theme directions:
  Based on platform personality from Product Brief:

1. Theme Name (Personality) - Color Strategy
2. Theme Name (Personality) - Color Strategy
3. Theme Name (Personality) - Color Strategy
4. Theme Name (Personality) - Color Strategy
   </action>

<action>Generate HTML color theme visualizer:

Create: {color_themes_html}

For each theme:

- Full color palette with swatches
- Semantic colors (success, warning, error)
- UI component examples
- Side-by-side comparison
- Light/dark mode if applicable
  </action>

<output>🎨 Color Theme Visualizer Created!

Open: {color_themes_html}

Explore the themes and tell me which direction resonates.</output>

<ask>Which color theme direction works for the platform?</ask>
</check>

<action>Document complete color system:

- Primary palette
- Secondary palette
- Semantic colors (success, warning, error, info)
- Neutral scale
- Usage guidelines
- Contrast requirements for accessibility
  </action>

<invoke-task name="save-with-checkpoint">
  <param name="file_path">{default_output_file}</param>
  <param name="content">{color_system_content}</param>
  <param name="section_name">Color System</param>
</invoke-task>
</step>

<step n="4" goal="Visual Foundation - Typography and Spacing">
<action>Define platform typography:

Based on design system choice and brand:

- Font families (heading, body, monospace)
- Type scale (h1-h6, body sizes)
- Font weights and usage
- Line heights
- Font loading strategy
  </action>

<action>Define spacing system:

- Base unit (4px or 8px)
- Spacing scale (xs, sm, md, lg, xl, 2xl, etc.)
- Layout grid approach
- Container widths
- Breakpoint definitions
  </action>

<invoke-task name="save-with-checkpoint">
  <param name="file_path">{default_output_file}</param>
  <param name="content">{typography_spacing_content}</param>
  <param name="section_name">Typography and Spacing</param>
</invoke-task>
</step>

<step n="5" goal="Platform-Wide UX Patterns">
<action>Define the UX patterns that apply across ALL entities:

"These patterns ensure users have a consistent experience
regardless of which module they're using."

REQUIRED PATTERNS to define:

1. **Button Hierarchy**
   - Primary, secondary, tertiary, destructive
   - When to use each

2. **Feedback Patterns**
   - Success, error, warning, info
   - Loading states
   - Toast vs inline vs modal

3. **Form Patterns**
   - Label position
   - Validation timing
   - Error display
   - Help text approach

4. **Modal Patterns**
   - Size variants
   - Dismiss behavior
   - Focus management

5. **Navigation Patterns**
   - Active state indication
   - Breadcrumb usage
   - Back button behavior

6. **Empty State Patterns**
   - First use guidance
   - No results
   - Cleared content

7. **Confirmation Patterns**
   - When to confirm
   - Destructive action handling

8. **Notification Patterns**
   - Placement
   - Duration
   - Priority levels
     </action>

<ask>For each pattern category, I'll present options and recommendations.
Do you want to:

1. Go through each pattern category one by one (thorough)
2. Let me recommend smart defaults and override where needed (efficient)
3. Focus on patterns most critical for your platform (focused)</ask>

<action>Based on approach, facilitate pattern decisions with appropriate depth</action>

<invoke-task name="save-with-checkpoint">
  <param name="file_path">{default_output_file}</param>
  <param name="content">{ux_patterns_content}</param>
  <param name="section_name">Platform-Wide UX Patterns</param>
</invoke-task>
</step>

<step n="6" goal="Accessibility Strategy">
<action>Define platform accessibility requirements:

"Accessibility ensures the platform works for everyone.
This section defines requirements ALL entities must meet."

Key decisions:

- WCAG compliance level (A, AA, or AAA)
- Color contrast requirements
- Keyboard navigation standards
- Focus indicator approach
- ARIA usage guidelines
- Screen reader considerations
- Touch target minimums
- Testing strategy
  </action>

<ask>Based on your deployment context (internal tool, public-facing, government, etc.),
what WCAG compliance level should the platform target?

[A] Level A - Basic accessibility
[AA] Level AA - Standard for most public sites (recommended)
[AAA] Level AAA - Highest standard</ask>

<action>Document complete accessibility strategy</action>

<invoke-task name="save-with-checkpoint">
  <param name="file_path">{default_output_file}</param>
  <param name="content">{accessibility_content}</param>
  <param name="section_name">Accessibility Strategy</param>
</invoke-task>
</step>

<step n="7" goal="Responsive Strategy">
<action>Define platform responsive design approach:

"The responsive strategy defines how the platform adapts
across devices - this applies to ALL modules."

Key decisions:

- Breakpoint definitions
- Desktop layout approach
- Tablet adaptation
- Mobile adaptation
- Navigation patterns per device
- Touch optimization
- Content priority at each size
  </action>

<invoke-task name="save-with-checkpoint">
  <param name="file_path">{default_output_file}</param>
  <param name="content">{responsive_content}</param>
  <param name="section_name">Responsive Strategy</param>
</invoke-task>
</step>

<step n="8" goal="Inheritance Guidelines">
<action>Define how child entities can extend or customize:

"Since this is the Constitution, we need to specify
what downstream entities can customize and what they cannot."

Define for each area:

- Design system: What can children customize?
- Colors: Can children add accent colors?
- Typography: Extension allowed?
- Patterns: Override permitted?
- Accessibility: Minimum is set, can they exceed?
  </action>

<invoke-task name="save-with-checkpoint">
  <param name="file_path">{default_output_file}</param>
  <param name="content">{inheritance_content}</param>
  <param name="section_name">Inheritance Guidelines</param>
</invoke-task>
</step>

<step n="9" goal="Generate Frontmatter and Finalize">
<invoke-task name="generate-frontmatter">
  <param name="entity_type">constitution</param>
  <param name="document_type">ux-design</param>
  <param name="title">System UX Design - Constitution</param>
</invoke-task>

<action>Assemble the complete Constitution UX Design with:

- Generated frontmatter
- UX vision and principles
- Design system foundation
- Visual foundation (colors, typography, spacing)
- Platform-wide UX patterns
- Accessibility strategy
- Responsive strategy
- Inheritance guidelines
  </action>

<invoke-task name="save-with-checkpoint">
  <param name="file_path">{default_output_file}</param>
  <param name="content">{complete_document}</param>
  <param name="section_name">Complete Constitution UX Design</param>
  <param name="is_new_file">true</param>
</invoke-task>
</step>

<step n="10" goal="Validation and Summary">
<action>Load and apply checklist: {checklist}</action>
<action>Validate the Constitution UX Design against the checklist</action>

<check if="validation fails">
  <output>⚠️ Validation issues found:</output>
  <action>List each failed check</action>
  <ask>Address these issues now? (y/n)</ask>
</check>

<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ CONSTITUTION UX DESIGN COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Created: docs/platform/ux-design.md

Summary:

- {principle_count} Core UX Principles
- Design System: {design_system_choice}
- {pattern_count} Platform-Wide UX Patterns
- Accessibility: WCAG {wcag_level}
- Responsive: {breakpoint_count} Breakpoints

Visual Artifacts:

- Color Themes: {color_themes_html}
- Design Directions: {design_directions_html} (if created)

This Constitution UX Design now governs ALL downstream entities.
Any Infrastructure Module, Strategic Container, Coordination Unit,
or Business Module MUST inherit from and not contradict these decisions.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Next Steps:**

1. Create Infrastructure Module UX (docs/platform/{module}/ux-design.md)
2. Create Strategic Container UX (docs/{category}/ux-design.md)

Use `create-domain-ux` workflow for these.
</output>
</step>

</workflow>
