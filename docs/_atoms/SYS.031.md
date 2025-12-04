---
id: SYS.031
type: decision
title: 'ADR-016: Soul Access Architecture'
status: approved
entity_path: docs/platform/
created: 2025-11-25
updated: 2025-12-04
author: Architect
tags: [adr, soul, api, recommendations]
legacy_id: ADR-016
---

# ADR-016: Soul Access Architecture (IC-004, IC-005)

> **Atom ID:** `SYS.031`
> **Type:** decision
> **Status:** Approved
> **Legacy ID:** ADR-016

---

## Summary

Implements a Soul Gateway Service that mediates all Soul access with read-only APIs and recommendation submission protocol.

---

## Context

Modules need to read Soul data and submit recommendations for updates.

---

## Decision

We implement a **Soul Gateway Service** that mediates all Soul access.

- **IC-004:** Read-only access via `GET /api/v1/soul` endpoints with caching.
- **IC-005:** Recommendation submission via event protocol. High-confidence + low-impact = auto-approve.

---

## Consequences

### Positive

- Modules can influence Soul but never write directly
- Caching improves read performance
- Auto-approve path reduces friction for safe changes

### Negative

- Gateway adds latency to all Soul reads
- Recommendation review process needed for complex changes
- Cache invalidation complexity

---

## Implication

Modules can influence Soul but never write directly.

**Implementation:** See [SYS.013](./SYS.013.md) (IC-004), [SYS.014](./SYS.014.md) (IC-005), and `docs/platform/core-api/prd.md` (FR-API-005, FR-API-006).

---

## Dependencies

| Atom ID                        | Relationship | Description                         |
| ------------------------------ | ------------ | ----------------------------------- |
| [SYS.013](./SYS.013.md) IC-004 | implements   | Soul Access API                     |
| [SYS.014](./SYS.014.md) IC-005 | implements   | Recommendation Submission Protocol  |
| [SYS.005](./SYS.005.md) PR-004 | enforces     | Modules read Soul through API only  |
| —                              | root         | Constitution-level atom (no parent) |

---

## Changelog

| Date       | Author    | Change                                      |
| ---------- | --------- | ------------------------------------------- |
| 2025-11-25 | Architect | Initial creation                            |
| 2025-12-04 | Architect | Extracted to SSOT atom from architecture.md |
