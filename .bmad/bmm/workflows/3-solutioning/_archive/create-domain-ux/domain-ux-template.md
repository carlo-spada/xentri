# {{entity_name}} UX Design

{{frontmatter}}

---

## Executive Summary

{{ux_purpose}}

---

## 1. UX Context

### 1.1 Entity Scope

{{scope_definition}}

### 1.2 Inherited UX Foundation

| Inherited From | Key Elements                 |
| -------------- | ---------------------------- |
| Constitution   | {{constitution_inheritance}} |
| Parent         | {{parent_inheritance}}       |

---

{{#if entity_type in ['strategic_container', 'coordination_unit', 'business_module']}}

## 2. User Personas

{{user_personas}}

---

{{/if}}

## 3. User Flows

{{user_flows}}

{{#if design_directions_html}}
**Interactive Mockups:**

- Design Direction Showcase: [ux-design-directions.html](./ux-design-directions.html)
  {{/if}}

---

{{#if entity_type == 'infrastructure_module'}}

## 4. Exposed Components

{{exposed_components}}

---

{{/if}}

{{#if entity_type == 'strategic_container'}}

## 4. Category UX Coordination

### 4.1 Design Direction

{{category_design_direction}}

### 4.2 Child Coordination Guidelines

{{child_coordination}}

### 4.3 Navigation Strategy

{{navigation_strategy}}

---

{{/if}}

{{#if entity_type == 'coordination_unit'}}

## 4. Module Integration UX

### 4.1 Module Orchestration

{{module_orchestration}}

### 4.2 Shared Components

{{shared_components}}

### 4.3 Integration Patterns

{{integration_patterns}}

---

{{/if}}

{{#if entity_type == 'business_module'}}

## 4. Screen Designs

{{screen_designs}}

---

## 5. Component Specifications

{{component_specifications}}

---

{{/if}}

## 6. States and Interactions

### 6.1 Loading States

{{loading_states}}

### 6.2 Error States

{{error_states}}

### 6.3 Empty States

{{empty_states}}

### 6.4 Success States

{{success_states}}

### 6.5 Transitions

{{transitions}}

---

## 7. Accessibility Implementation

{{accessibility_implementation}}

---

## 8. Responsive Behavior

{{responsive_behavior}}

---

## Appendix

### Related Documents

- Parent UX: `{{parent_ux_path}}`
- Constitution UX: `docs/platform/ux-design.md`
- Entity PRD: `{{output_folder_resolved}}prd.md`
- Entity Architecture: `{{output_folder_resolved}}architecture.md`

### Visual Artifacts

{{#if color_themes_html}}

- **Color Theme Customization**: {{color_themes_html}}
  {{/if}}
  {{#if design_directions_html}}
- **Design Direction Mockups**: {{design_directions_html}}
  {{/if}}

### Version History

| Date     | Version | Changes                                   | Author        |
| -------- | ------- | ----------------------------------------- | ------------- |
| {{date}} | 1.0     | Initial {{entity_type_display}} UX Design | {{user_name}} |

---

_This UX Design inherits from and does not contradict parent UX or Constitution UX. Any changes require amendment through the amend-domain-ux workflow._
