---
id: SYS.010
type: interface
title: 'Event Envelope Schema'
status: approved
entity_path: docs/platform/
created: 2025-12-04
updated: 2025-12-04
author: Architect
tags: [events, schema, ts-schema, event-spine]
legacy_id: IC-001
---

# Event Envelope Schema

> **Atom ID:** `SYS.010`
> **Type:** interface
> **Status:** Approved
> **Legacy ID:** IC-001

---

## Summary

Defines the `SystemEvent` interface — the standard envelope format for all events flowing through the Event Spine.

---

## Content

### Contract

All events in Xentri MUST conform to the `SystemEvent` interface:

```typescript
interface SystemEvent {
  id: string; // UUID v7 (time-ordered)
  type: string; // Event type (see IC-002)
  version: string; // Schema version (semver)
  timestamp: string; // ISO 8601 timestamp
  org_id: string; // Tenant identifier
  actor: {
    type: 'user' | 'system' | 'copilot';
    id: string;
    name?: string;
  };
  payload: Record<string, unknown>; // Event-specific data
  metadata: {
    correlation_id?: string; // Request tracing
    causation_id?: string; // Parent event ID
    source: string; // Originating service
  };
}
```

### Consumers

- All modules reading from Event Spine
- Analytics and reporting systems
- Audit trail processors
- Copilots tracking domain changes

### Providers

- core-api (primary event producer)
- All modules emitting domain events

### Version

**v1.0** — Initial schema definition

### Defined In

**ts-schema** — `packages/ts-schema/src/events/system-event.ts`

---

## Dependencies

| Atom ID | Relationship | Description                              |
| ------- | ------------ | ---------------------------------------- |
| —       | root         | Constitution-level interface (no parent) |

---

## Changelog

| Date       | Author    | Change                                 |
| ---------- | --------- | -------------------------------------- |
| 2025-12-04 | Architect | Extracted from Constitution PRD IC-001 |
