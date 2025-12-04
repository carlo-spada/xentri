---
id: SYS.030
type: decision
title: 'ADR-015: Permission Enforcement Architecture'
status: approved
entity_path: docs/platform/
created: 2025-11-25
updated: 2025-12-04
author: Architect
tags: [adr, permissions, security, authorization]
legacy_id: ADR-015
---

# ADR-015: Permission Enforcement Architecture (IC-007)

> **Atom ID:** `SYS.030`
> **Type:** decision
> **Status:** Approved
> **Legacy ID:** ADR-015

---

## Summary

Implements 3-Layer Permission Enforcement at Shell (UI), API Gateway, and Database (RLS) levels.

---

## Context

PRD defines four permission primitives (`view`, `edit`, `approve`, `configure`). We need enforcement patterns.

---

## Decision

We implement a **3-Layer Permission Enforcement** pattern:

| Layer              | Responsibility              | Enforcement Point |
| ------------------ | --------------------------- | ----------------- |
| **Shell (UI)**     | Hide/disable UI elements    | Component render  |
| **API Gateway**    | Block unauthorized requests | Middleware        |
| **Database (RLS)** | Prevent data access         | Query execution   |

**Fail-Closed Principle:** Missing permission context = deny.

---

## Consequences

### Positive

- Defense in depth (three enforcement layers)
- Fail-closed prevents accidental exposure
- Consistent enforcement across UI and API

### Negative

- All three layers must be implemented for any protected resource
- Permission context must be available at all layers
- Debugging requires understanding all enforcement points

---

## Implication

All three layers must be implemented for any protected resource.

**Implementation:** See [SYS.016](./SYS.016.md) (IC-007), [SYS.006](./SYS.006.md) (PR-005), and `docs/platform/ui/prd.md` (PermissionGate component).

---

## Dependencies

| Atom ID                        | Relationship | Description                         |
| ------------------------------ | ------------ | ----------------------------------- |
| [SYS.016](./SYS.016.md) IC-007 | implements   | Permission Check Protocol           |
| [SYS.006](./SYS.006.md) PR-005 | implements   | Permission Primitives               |
| —                              | root         | Constitution-level atom (no parent) |

---

## Changelog

| Date       | Author    | Change                                      |
| ---------- | --------- | ------------------------------------------- |
| 2025-11-25 | Architect | Initial creation                            |
| 2025-12-04 | Architect | Extracted to SSOT atom from architecture.md |
