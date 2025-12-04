---
id: SYS.018
type: decision
title: 'ADR-002: Event Envelope and Schema'
status: approved
entity_path: docs/platform/
created: 2025-11-25
updated: 2025-12-04
author: Architect
tags: [adr, events, schema, ts-schema]
legacy_id: ADR-002
---

# ADR-002: Event Envelope and Schema

> **Atom ID:** `SYS.018`
> **Type:** decision
> **Status:** Approved
> **Legacy ID:** ADR-002

---

## Summary

Defines the strict SystemEvent envelope with namespaced types, versioning, and PII hygiene for the event-driven backbone.

---

## Context

To prevent the "Nervous System" from becoming a swamp of untyped JSON, we need a strict event contract.

---

## Decision

We enforce a strict `SystemEvent` envelope with namespaced types, versioning, and PII hygiene. All events include:

- Immutable ID and timestamp
- Tenant context (org_id)
- Actor identification
- Envelope version and payload schema reference
- Tracing fields (correlation_id, trace_id, dedupe_key)

---

## Consequences

### Positive

- Type-safe event processing across all services
- Full observability and traceability
- PII hygiene built-in from day one

### Negative

- All services must adopt the schema library
- Schema evolution requires versioning discipline

---

## Implication

All services must use the shared `packages/ts-schema` to validate events before emitting.

**Implementation:** See [SYS.010](./SYS.010.md) (IC-001: Event Envelope Schema).

---

## Dependencies

| Atom ID | Relationship | Description                         |
| ------- | ------------ | ----------------------------------- |
| —       | root         | Constitution-level atom (no parent) |

---

## Changelog

| Date       | Author    | Change                                      |
| ---------- | --------- | ------------------------------------------- |
| 2025-11-25 | Architect | Initial creation                            |
| 2025-12-04 | Architect | Extracted to SSOT atom from architecture.md |
