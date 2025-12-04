---
id: SYS.005
type: requirement
title: 'Soul Read-Only Access'
status: approved
entity_path: docs/platform/
created: 2025-12-04
updated: 2025-12-04
author: PM
tags: [soul, api, read-only, modules]
legacy_id: PR-004
---

# Soul Read-Only Access

> **Atom ID:** `SYS.005`
> **Type:** requirement
> **Status:** Approved
> **Legacy ID:** PR-004

---

## Summary

All modules MUST read Soul through the standard API and are prohibited from writing directly to Soul storage.

---

## Content

### Requirement Statement

All modules MUST read Soul through standard API, never write directly.

### Rationale

The Soul is the business's living memory and DNA. Direct writes would:

1. Bypass validation and governance rules
2. Create inconsistent state across the system
3. Prevent proper audit trails
4. Break the copilot orchestration model

Only the Strategy Copilot (Orchestrator) has authority to modify the Universal Soul.

### Acceptance Criteria

1. Modules access Soul exclusively via `GET /api/v1/soul/{section}` (IC-004)
2. No module has direct database access to Soul tables
3. Soul write attempts from non-authorized services are rejected with 403
4. All Soul reads are logged for audit purposes

### Constraints

- Category Copilots may write to their own Category Soul, but not the Universal Soul
- Soul caching at module level must respect TTL and invalidation signals
- Soul data must never be persisted in module-local storage

### Implementation

**Implemented By:** core-api

**Related Contracts:**

- IC-004: Soul Access API

---

## Dependencies

| Atom ID | Relationship | Description                                |
| ------- | ------------ | ------------------------------------------ |
| —       | root         | Constitution-level requirement (no parent) |

---

## Changelog

| Date       | Author | Change                                 |
| ---------- | ------ | -------------------------------------- |
| 2025-12-04 | PM     | Extracted from Constitution PRD PR-004 |
