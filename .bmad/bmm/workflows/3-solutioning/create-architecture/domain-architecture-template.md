{{frontmatter}}

# {{entity_name}} - Architecture

> **Entity Type:** {{entity_type_display}}
> **Parent Architecture:** {{parent_architecture_path}}
> **Constitution Architecture:** docs/platform/architecture.md
> **Status:** {{status}}
> **Version:** {{version}}
> **Last Updated:** {{date}}

---

## Inheritance Context

This architecture inherits from:

- **Constitution Architecture:** `docs/platform/architecture.md`
  {{#if parent_architecture_path}}
- **Parent Architecture:** `{{parent_architecture_path}}`
  {{/if}}

All Constitution architectural decisions apply.
This document adds entity-specific decisions only.

---

## Architecture Overview

{{architecture_overview}}

---

## Technology Decisions

{{technology_decisions}}

### Deviations from Constitution Stack

| Technology | Constitution Standard | This Entity Uses | Rationale |
| ---------- | --------------------- | ---------------- | --------- |

{{#each tech_deviations}}
| {{area}} | {{standard}} | {{deviation}} | {{rationale}} |
{{/each}}

{{#if no_deviations}}
_No deviations from Constitution technology stack._
{{/if}}

---

## Data Architecture

{{data_architecture}}

### Data Models

{{data_models}}

### Data Relationships

{{data_relationships}}

---

## Integration Architecture

{{integration_architecture}}

### APIs Exposed

{{#if entity_type == 'infrastructure_module'}}
| Endpoint | Method | Purpose | Auth |
|----------|--------|---------|------|
{{#each apis_exposed}}
| {{endpoint}} | {{method}} | {{purpose}} | {{auth}} |
{{/each}}
{{/if}}

### APIs Consumed

| Service | Endpoint | Purpose |
| ------- | -------- | ------- |

{{#each apis_consumed}}
| {{service}} | {{endpoint}} | {{purpose}} |
{{/each}}

### Events

| Event Type | Direction | Purpose |
| ---------- | --------- | ------- |

{{#each events}}
| {{type}} | {{direction}} | {{purpose}} |
{{/each}}

---

{{#if entity_specific_architecture}}

## {{entity_type_display}}-Specific Architecture

{{entity_specific_architecture}}
{{/if}}

---

## Architecture Decisions

{{#each adrs}}

### ADR-{{number}}: {{title}}

**Status:** {{status}}
**Context:** {{context}}
**Decision:** {{decision}}
**Consequences:** {{consequences}}
{{/each}}

---

## Constitution Alignment

| Constitution Decision | How Implemented Here |
| --------------------- | -------------------- |

{{#each constitution_alignment}}
| {{decision}} | {{implementation}} |
{{/each}}

---

## Document History

| Date     | Version | Change                       | Author        |
| -------- | ------- | ---------------------------- | ------------- |
| {{date}} | 1.0.0   | Initial architecture created | {{user_name}} |

---

_This architecture aligns with the Constitution and parent architecture.
Entity-specific decisions are documented with rationale._
