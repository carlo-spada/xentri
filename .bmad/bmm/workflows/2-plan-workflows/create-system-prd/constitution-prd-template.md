{{frontmatter}}

# System PRD - Constitution

> **Entity Type:** Constitution
> **FR Prefix:** PR-xxx (Platform Requirements), IC-xxx (Integration Contracts)
> **Status:** {{status}}
> **Version:** {{version}}
> **Last Updated:** {{date}}

---

## Executive Summary

{{system_vision}}

---

## Core Principles

{{core_principles}}

These principles are NON-NEGOTIABLE and must be reflected in every decision,
component, and module within the system.

---

## Platform Requirements (PR-xxx)

Platform Requirements define the MUST rules that ALL entities inherit.
No downstream entity may contradict these requirements.

{{platform_requirements}}

### PR Summary

| ID | Requirement | Enforcement |
|----|-------------|-------------|
{{#each platform_requirements_table}}
| {{id}} | {{summary}} | {{enforcement}} |
{{/each}}

---

## Integration Contracts (IC-xxx)

Integration Contracts define the shared interfaces between system components.
All modules MUST implement these contracts as specified.

{{integration_contracts}}

### IC Summary

| ID | Contract | Version |
|----|----------|---------|
{{#each integration_contracts_table}}
| {{id}} | {{name}} | {{version}} |
{{/each}}

---

## System-Wide Non-Functional Requirements

These NFRs apply to ALL components in the system.

{{system_nfrs}}

---

## Governance

### Change Process

{{governance_rules}}

### Protected Documents

The following Constitution documents require explicit flagging and rationale for any changes:

- `docs/platform/prd.md` - This document (System PRD)
- `docs/platform/architecture.md` - System Architecture
- `docs/platform/ux-design.md` - System UX Principles
- `docs/platform/epics.md` - System Epics
- `docs/platform/product-brief.md` - Foundational Vision

### Commit Format

```
docs(constitution): {description}

Rationale: {why this change is necessary}
Impact: {what downstream entities are affected}

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

---

## Document History

| Date | Version | Change | Author |
|------|---------|--------|--------|
| {{date}} | 1.0.0 | Initial Constitution created | {{user_name}} |

---

_This Constitution establishes the foundational rules for the entire system.
All Infrastructure Modules, Strategic Containers, Coordination Units, and
Business Modules inherit from and must not contradict these requirements._
