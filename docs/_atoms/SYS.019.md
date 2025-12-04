---
id: SYS.019
type: decision
title: 'ADR-003: Multi-Tenant Security (RLS)'
status: approved
entity_path: docs/platform/
created: 2025-11-25
updated: 2025-12-04
author: Architect
tags: [adr, security, rls, multi-tenancy, postgres]
legacy_id: ADR-003
---

# ADR-003: Multi-Tenant Security (RLS)

> **Atom ID:** `SYS.019`
> **Type:** decision
> **Status:** Approved
> **Legacy ID:** ADR-003

---

## Summary

Establishes Postgres Row-Level Security (RLS) with Fail-Closed transaction pattern for strict data isolation between organizations.

---

## Context

We must ensure strict data isolation between organizations in a shared database.

---

## Decision

We use **Postgres Row-Level Security (RLS)** with a **Fail-Closed** transaction pattern:

1. **Transport:** Client sends `x-org-id` header.
2. **Gate:** Middleware verifies `user_id` (from JWT) is a member of `x-org-id`. Rejects if false.
3. **Transaction:** Service sets transaction-scoped org_id context before queries.
4. **Enforcement:** RLS policies fail closed if context is missing.

---

## Consequences

### Positive

- Data isolation enforced at database level (defense in depth)
- Cannot accidentally query another tenant's data
- Audit trail for all access attempts

### Negative

- Every table must include org_id column
- Performance overhead from RLS policy evaluation
- Debugging requires understanding RLS context

---

## Implication

Every table must have `org_id` column. Every query runs within RLS context.

**Implementation:** See [SYS.002](./SYS.002.md) (PR-001: Multi-tenant RLS Architecture).

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
