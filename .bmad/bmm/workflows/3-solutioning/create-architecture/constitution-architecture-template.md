{{frontmatter}}

# System Architecture - Constitution

> **Entity Type:** Constitution
> **Status:** {{status}}
> **Version:** {{version}}
> **Last Updated:** {{date}}

---

## Executive Summary

{{architecture_vision}}

---

## Core Architectural Principles

{{architectural_principles}}

These principles are NON-NEGOTIABLE and guide all architectural decisions
across the entire system.

---

## System Context

{{system_context}}

### Context Diagram

```
[Description of C4 Context Diagram]
{{context_diagram_description}}
```

---

## High-Level Architecture

{{high_level_architecture}}

### Architectural Style

{{architectural_style}}

### Key Architecture Decisions

| Decision | Choice | Rationale | Alternatives Considered |
| -------- | ------ | --------- | ----------------------- |

{{#each architecture_decisions}}
| {{name}} | {{choice}} | {{rationale}} | {{alternatives}} |
{{/each}}

---

## Event Architecture

{{event_architecture}}

### Event Envelope Schema

```typescript
{
  {
    event_envelope_schema
  }
}
```

### Event Categories

| Category | Pattern | Examples |
| -------- | ------- | -------- |

{{#each event_categories}}
| {{category}} | {{pattern}} | {{examples}} |
{{/each}}

---

## Data Architecture

{{data_architecture}}

### Data Stores

| Store | Technology | Purpose | Tenancy Model |
| ----- | ---------- | ------- | ------------- |

{{#each data_stores}}
| {{name}} | {{technology}} | {{purpose}} | {{tenancy}} |
{{/each}}

### Multi-Tenancy Strategy

{{multi_tenancy_strategy}}

---

## Security Architecture

{{security_architecture}}

### Authentication

{{authentication_strategy}}

### Authorization

{{authorization_model}}

### API Security

{{api_security}}

---

## Technology Stack

{{technology_stack}}

### Stack Summary

| Layer | Technology | Version | Rationale |
| ----- | ---------- | ------- | --------- |

{{#each tech_stack}}
| {{layer}} | {{technology}} | {{version}} | {{rationale}} |
{{/each}}

---

## Cross-Cutting Concerns

### Observability

{{observability}}

### Error Handling

{{error_handling}}

### Configuration Management

{{configuration_management}}

### API Versioning

{{api_versioning}}

---

## Architecture Decision Records

{{#each adrs}}

### ADR-{{number}}: {{title}}

**Status:** {{status}}
**Date:** {{date}}

**Context:** {{context}}

**Decision:** {{decision}}

**Consequences:** {{consequences}}
{{/each}}

---

## Document History

| Date     | Version | Change                       | Author        |
| -------- | ------- | ---------------------------- | ------------- |
| {{date}} | 1.0.0   | Initial architecture created | {{user_name}} |

---

_This Constitution Architecture establishes the technical foundation for the entire system.
All module architectures must align with and not contradict these decisions._
