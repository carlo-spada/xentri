---
id: SYS.006
type: requirement
title: 'Permission Primitives'
status: approved
entity_path: docs/platform/
created: 2025-12-04
updated: 2025-12-04
author: PM
tags: [permissions, authorization, rbac, security]
legacy_id: PR-005
---

# Permission Primitives

> **Atom ID:** `SYS.006`
> **Type:** requirement
> **Status:** Approved
> **Legacy ID:** PR-005

---

## Summary

All user actions MUST respect the four permission primitives: view, edit, approve, and configure.

---

## Content

### Requirement Statement

All user actions MUST respect permission primitives (view/edit/approve/configure).

### Rationale

A consistent permission model enables:

1. Fine-grained access control without per-feature complexity
2. Role-based access that scales across modules
3. Audit-friendly authorization decisions
4. Clear mental model for users and administrators

### Permission Primitives

| Primitive     | Meaning                       | Examples                          |
| ------------- | ----------------------------- | --------------------------------- |
| **view**      | Read data and state           | See invoices, read reports        |
| **edit**      | Modify non-critical data      | Update descriptions, add notes    |
| **approve**   | Authorize significant actions | Approve payments, publish content |
| **configure** | Change system behavior        | Modify workflows, set thresholds  |

### Acceptance Criteria

1. Every API endpoint checks at least one permission primitive
2. Permission checks occur before any data access or mutation
3. Permission denials return 403 with clear error message
4. Permission grants are logged for audit purposes
5. UI elements respect permissions (hide/disable unauthorized actions)

### Constraints

- Permissions are additive (users accumulate from all roles)
- No implicit permissions (every action requires explicit grant)
- Permission changes take effect immediately (no caching delay)

### Implementation

**Implemented By:** core-api

**Related Contracts:**

- IC-007: Permission Check Protocol

---

## Dependencies

| Atom ID | Relationship | Description                                |
| ------- | ------------ | ------------------------------------------ |
| —       | root         | Constitution-level requirement (no parent) |

---

## Changelog

| Date       | Author | Change                                 |
| ---------- | ------ | -------------------------------------- |
| 2025-12-04 | PM     | Extracted from Constitution PRD PR-005 |
