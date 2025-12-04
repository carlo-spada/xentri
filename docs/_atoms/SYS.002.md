---
id: SYS.002
type: requirement
title: 'Multi-tenant RLS Architecture'
status: approved
entity_path: docs/platform/
created: 2025-12-04
updated: 2025-12-04
author: PM
tags: [multi-tenancy, security, database, rls]
legacy_id: PR-001
---

# Multi-tenant RLS Architecture

> **Atom ID:** `SYS.002`
> **Type:** requirement
> **Status:** Approved
> **Legacy ID:** PR-001

---

## Summary

All database tables MUST include an `org_id` column with Row-Level Security (RLS) policy to ensure complete tenant isolation.

---

## Content

### Requirement Statement

All database tables MUST include `org_id` column with RLS policy.

### Rationale

Multi-tenancy is foundational to Xentri's architecture. Every piece of data belongs to exactly one organization, and RLS ensures that even with application bugs or misconfigurations, data cannot leak between tenants.

### Acceptance Criteria

1. Every table in the schema has an `org_id` column of type `UUID`
2. Every table has an RLS policy that enforces `org_id = current_setting('app.current_org_id')::uuid`
3. No query can return data from multiple organizations in a single result set
4. The `org_id` cannot be modified after row creation (immutable)

### Constraints

- RLS must be enabled at database level, not application level
- System tables (migrations, audit logs) may be exempt if properly justified
- Foreign keys across organizations are prohibited

### Implementation

**Implemented By:** core-api

---

## Dependencies

| Atom ID | Relationship | Description                                |
| ------- | ------------ | ------------------------------------------ |
| —       | root         | Constitution-level requirement (no parent) |

---

## Changelog

| Date       | Author | Change                                 |
| ---------- | ------ | -------------------------------------- |
| 2025-12-04 | PM     | Extracted from Constitution PRD PR-001 |
