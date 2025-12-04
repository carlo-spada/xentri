---
id: SYS.024
type: decision
title: 'ADR-009: Cross-Runtime Contract Strategy'
status: approved
entity_path: docs/platform/
created: 2025-11-25
updated: 2025-12-04
author: Architect
tags: [adr, schema, typescript, python, contracts]
legacy_id: ADR-009
---

# ADR-009: Cross-Runtime Contract Strategy

> **Atom ID:** `SYS.024`
> **Type:** decision
> **Status:** Approved
> **Legacy ID:** ADR-009

---

## Summary

Uses JSON Schema Bridge to enable TypeScript contracts (ts-schema) to be consumed by Python services.

---

## Context

`ts-schema` is our contract source of truth, but Python services can't consume TypeScript directly.

---

## Decision

We use a **JSON Schema Bridge** for cross-runtime contract enforcement:

```
ts-schema (Zod) → zod-to-json-schema → schemas/*.json → datamodel-codegen → py-schema/*.py
```

**Schema Versioning Protocol:**

1. Bump version on breaking changes
2. N-1 support during migration window
3. 30 days deprecation notice

---

## Consequences

### Positive

- Single source of truth (TypeScript) for all contracts
- Python gets typed models automatically
- Schema changes are validated at build time

### Negative

- Code generation adds build complexity
- Generated Python code may need manual adjustments
- Version drift if generation not automated

---

## Implication

CI enforces schema generation on any ts-schema change.

**Implementation:** See `docs/platform/ts-schema/epics.md` (Story TSS-1.3).

---

## Dependencies

| Atom ID                         | Relationship | Description                         |
| ------------------------------- | ------------ | ----------------------------------- |
| [SYS.023](./SYS.023.md) ADR-008 | related      | Python Agent Layer decision         |
| —                               | root         | Constitution-level atom (no parent) |

---

## Changelog

| Date       | Author    | Change                                      |
| ---------- | --------- | ------------------------------------------- |
| 2025-11-25 | Architect | Initial creation                            |
| 2025-12-04 | Architect | Extracted to SSOT atom from architecture.md |
