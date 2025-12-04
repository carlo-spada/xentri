# System UX Validation Workflow - Constitution Level

<critical>The workflow execution engine is governed by: {project-root}/.bmad/core/tasks/workflow.xml</critical>
<critical>This validates the Constitution UX Design at docs/platform/ux-design.md</critical>
<critical>Communicate all responses in {communication_language}</critical>

<workflow>

<step n="0" goal="Load Document and Checklist">
<action>Load the Constitution UX Design from {ux_path}</action>

<check if="file not found">
  <output>❌ Constitution UX Design not found at {ux_path}

Use create-system-ux workflow to create it first.</output>
<action>Exit workflow</action>
</check>

<action>Load the validation checklist from {checklist}</action>

<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎨 CONSTITUTION UX VALIDATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Validating: docs/platform/ux-design.md
Entity Type: Constitution

This validation checks:

- Structural completeness
- UX pattern coverage
- Visual foundation completeness
- Accessibility strategy
- Inheritance guidelines
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>
  </step>

<step n="1" goal="Structural Validation">
<action>Check each item in the Structural Completeness section:
- Frontmatter present with entity_type: constitution
- Executive Summary present
- Design Principles section
- Design System Foundation
- Visual Foundation
- Interaction Paradigms
- Accessibility Standards
- Responsive Strategy
- UX Pattern Registry
</action>

<action>Record pass/fail for each item</action>
</step>

<step n="2" goal="Content Quality Validation">
<action>Check content quality:
- No unfilled template placeholders
- Visual artifacts referenced exist
- Design system choice has rationale
- Principles are actionable
- Revision history present
</action>

<action>Record pass/fail for each item</action>
</step>

<step n="3" goal="Platform Patterns Validation">
<action>Check all required platform-wide patterns are defined:
- Button hierarchy
- Feedback patterns
- Form patterns
- Modal patterns
- Navigation patterns
- Empty state patterns
- Notification patterns

For each pattern, verify:

- Clear specification
- Usage guidance
- Accessibility considerations
- Example implementation
  </action>

<action>Record pass/fail for each item</action>
</step>

<step n="4" goal="Accessibility Validation">
<action>Check accessibility strategy:
- WCAG level specified
- Color contrast ratios defined
- Keyboard navigation requirements
- Focus indicator standards
- ARIA requirements
- Screen reader considerations
- Touch target minimums
</action>

<action>Record pass/fail for each item</action>
</step>

<step n="5" goal="Visual Foundation Validation">
<action>Check visual foundation completeness:

Color System:

- Complete palette
- Semantic color usage
- Accessibility considerations
- Dark mode strategy (if applicable)

Typography:

- Font families with fallbacks
- Type scale defined
- Font weights documented
- Line heights specified

Spacing:

- Base unit defined
- Spacing scale documented
- Layout grid approach
  </action>

<action>Record pass/fail for each item</action>
</step>

<step n="6" goal="Inheritance Guidelines Validation">
<action>Check inheritance guidelines:
- What children can customize
- What cannot be overridden
- Extension points documented
- Constraints explicit
- Pattern customization boundaries
</action>

<action>Record pass/fail for each item</action>
</step>

<step n="7" goal="Visual Artifacts Validation">
<action>Check visual artifacts:
- Color theme visualizer exists
- Design direction mockups exist
- Artifacts align with documented decisions
</action>

<action>Record pass/fail for each item</action>
</step>

<step n="8" goal="Generate Validation Report">
<action>Calculate results:
- Total items checked
- Items passed
- Items failed
- Items with warnings
- Pass rate percentage
</action>

<output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 CONSTITUTION UX VALIDATION RESULTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

| Category          | Pass         | Fail         | Warn         |
| ----------------- | ------------ | ------------ | ------------ |
| Structural        | {pass}       | {fail}       | {warn}       |
| Content           | {pass}       | {fail}       | {warn}       |
| Platform Patterns | {pass}       | {fail}       | {warn}       |
| Accessibility     | {pass}       | {fail}       | {warn}       |
| Visual Foundation | {pass}       | {fail}       | {warn}       |
| Inheritance       | {pass}       | {fail}       | {warn}       |
| Visual Artifacts  | {pass}       | {fail}       | {warn}       |
| **TOTAL**         | {total_pass} | {total_fail} | {total_warn} |

**Pass Rate:** {pass_rate}%
**Status:** {status}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</output>

<check if="pass_rate < 80">
  <output>
⚠️ VALIDATION FAILED

Issues requiring attention:
{failed_items_list}
</output>
<ask>Would you like to address these issues now? (y/n)</ask>
</check>

<check if="pass_rate >= 80">
  <output>✅ Validation passed!</output>
</check>

<action>Save validation report to {validation_report_path}</action>
</step>

</workflow>
