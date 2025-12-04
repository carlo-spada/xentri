---
id: SYS.032
type: decision
title: 'ADR-017: Notification Delivery Architecture'
status: approved
entity_path: docs/platform/
created: 2025-11-25
updated: 2025-12-04
author: Architect
tags: [adr, notifications, pulse, delivery]
legacy_id: ADR-017
---

# ADR-017: Notification Delivery Architecture (IC-006)

> **Atom ID:** `SYS.032`
> **Type:** decision
> **Status:** Approved
> **Legacy ID:** ADR-017

---

## Summary

Implements a Priority-Based Notification Router that respects user attention with different delivery channels based on priority.

---

## Context

The Operational Pulse requires a unified notification system that respects user attention.

---

## Decision

We implement a **Priority-Based Notification Router**:

| Priority     | Delivery    | Channel               |
| ------------ | ----------- | --------------------- |
| **critical** | Immediate   | Push + Email + In-app |
| **high**     | Digest      | Email digest + In-app |
| **medium**   | Digest      | Email digest + In-app |
| **low**      | In-app only | Dashboard only        |

---

## Consequences

### Positive

- Users only interrupted for critical items
- Digest reduces notification fatigue
- Consistent delivery across all modules

### Negative

- Priority classification logic needed in each module
- Digest timing configuration complexity
- Email delivery infrastructure required

---

## Implication

Modules emit events with notification metadata. Infrastructure handles routing.

**Implementation:** See [SYS.015](./SYS.015.md) (IC-006: Notification Delivery Contract).

---

## Dependencies

| Atom ID                        | Relationship | Description                         |
| ------------------------------ | ------------ | ----------------------------------- |
| [SYS.015](./SYS.015.md) IC-006 | implements   | Notification Delivery Contract      |
| —                              | root         | Constitution-level atom (no parent) |

---

## Changelog

| Date       | Author    | Change                                      |
| ---------- | --------- | ------------------------------------------- |
| 2025-11-25 | Architect | Initial creation                            |
| 2025-12-04 | Architect | Extracted to SSOT atom from architecture.md |
