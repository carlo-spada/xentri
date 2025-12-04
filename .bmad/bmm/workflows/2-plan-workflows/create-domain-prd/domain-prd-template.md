{{frontmatter}}

# {{entity_name}} - Product Requirements Document

> **Entity Type:** {{entity_type_display}}
> **FR Prefix:** {{fr_prefix}}
> **Parent PRD:** {{parent_prd_path}}
> **Status:** {{status}}
> **Version:** {{version}}
> **Last Updated:** {{date}}

---

## Inheritance Context

This PRD inherits from:

- **Constitution:** `docs/platform/prd.md`
  {{#if parent_prd_path}}
- **Parent PRD:** `{{parent_prd_path}}`
  {{/if}}

All Platform Requirements (PR-xxx) and Integration Contracts (IC-xxx) from the Constitution apply.
{{#if parent_fr_summary}}
Parent FRs inherited: {{parent_fr_summary}}
{{/if}}

---

## Purpose & Scope

{{entity_purpose}}

### Scope Definition

{{scope_definition}}

---

## Functional Requirements

{{functional_requirements}}

### FR Summary

| ID  | Requirement | Priority |
| --- | ----------- | -------- |

{{#each functional_requirements_table}}
| {{id}} | {{summary}} | {{priority}} |
{{/each}}

---

{{#if entity_type == 'infrastructure_module'}}

## Exposed Interfaces

{{exposed_interfaces}}

## Consumed Interfaces

{{consumed_interfaces}}
{{/if}}

{{#if entity_type == 'strategic_container'}}

## Strategic Alignment

{{strategic_alignment}}

## Child Coordination

{{child_coordination}}
{{/if}}

{{#if entity_type == 'coordination_unit'}}

## Module Orchestration

{{module_orchestration}}

## Integration Points

{{integration_points}}
{{/if}}

{{#if entity_type == 'business_module'}}
{{#if user_stories}}

## User Stories

{{user_stories}}
{{/if}}
{{/if}}

---

{{#if entity_nfrs}}

## Non-Functional Requirements

These are specific to this {{entity_type_display}}, beyond inherited system-wide NFRs.

{{entity_nfrs}}
{{/if}}

---

## Traceability

### Constitution Alignment

| Platform Requirement | How Addressed |
| -------------------- | ------------- |

{{#each constitution_alignment}}
| {{pr_id}} | {{implementation}} |
{{/each}}

### Parent PRD Alignment

| Parent FR | Related FRs Here |
| --------- | ---------------- |

{{#each parent_alignment}}
| {{parent_fr}} | {{child_frs}} |
{{/each}}

---

## Document History

| Date     | Version | Change              | Author        |
| -------- | ------- | ------------------- | ------------- |
| {{date}} | 1.0.0   | Initial PRD created | {{user_name}} |

---

_This {{entity_type_display}} PRD inherits from {{parent_prd_path}} and the Constitution.
It adds requirements specific to this scope without contradicting parent constraints._
