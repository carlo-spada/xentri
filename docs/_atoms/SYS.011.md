---
id: SYS.011
type: interface
title: 'Event Naming Convention'
status: approved
entity_path: docs/platform/
created: 2025-12-04
updated: 2025-12-04
author: Architect
tags: [events, naming, conventions, event-spine]
legacy_id: IC-002
---

# Event Naming Convention

> **Atom ID:** `SYS.011`
> **Type:** interface
> **Status:** Approved
> **Legacy ID:** IC-002

---

## Summary

Defines the standard naming pattern for all event types in the Xentri Event Spine.

---

## Content

### Contract

All event type names MUST follow this pattern:

```
xentri.{category}.{entity}.{action}.{version}
```

### Components

| Component  | Description            | Examples                         |
| ---------- | ---------------------- | -------------------------------- |
| `xentri`   | Fixed namespace prefix | Always `xentri`                  |
| `category` | Business domain        | `finance`, `sales`, `strategy`   |
| `entity`   | Domain object          | `invoice`, `lead`, `soul`        |
| `action`   | What happened          | `created`, `updated`, `approved` |
| `version`  | Schema version         | `v1`, `v2`                       |

### Examples

```
xentri.finance.invoice.created.v1
xentri.sales.lead.qualified.v1
xentri.strategy.soul.section_updated.v1
xentri.operations.task.completed.v1
```

### Rules

1. All components are lowercase
2. Use underscores for multi-word components (snake_case)
3. Actions should be past tense (describes what happened)
4. Version is required and follows `v{n}` format

### Consumers

- Event routing infrastructure
- Event handlers and subscribers
- Analytics systems (for event categorization)

### Providers

- All modules emitting events

### Version

**v1.0** — Initial convention definition

### Defined In

**ts-schema** — `packages/ts-schema/src/events/event-types.ts`

---

## Dependencies

| Atom ID | Relationship | Description                                   |
| ------- | ------------ | --------------------------------------------- |
| SYS.010 | requires     | Events follow the SystemEvent envelope schema |

---

## Changelog

| Date       | Author    | Change                                 |
| ---------- | --------- | -------------------------------------- |
| 2025-12-04 | Architect | Extracted from Constitution PRD IC-002 |
