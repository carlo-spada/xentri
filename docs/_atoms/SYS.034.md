---
id: SYS.034
type: decision
title: 'ADR-020: Sibling Dependency Law'
status: approved
entity_path: docs/platform/
created: 2025-12-03
updated: 2025-12-04
author: Architect
tags: [adr, dependencies, inheritance, entities, governance]
legacy_id: ADR-020
---

# ADR-020: Sibling Dependency Law

> **Atom ID:** `SYS.034`
> **Type:** decision
> **Status:** Approved
> **Legacy ID:** ADR-020
> **Full Document:** `docs/platform/architecture/adr-020-sibling-dependency-law.md`

---

## Summary

Implements Zero-Trust Inheritance with Sibling Interface Dependencies — entities inherit from single parent only, and can only declare dependencies on siblings (same parent).

---

## Context

As Xentri grows, we need to prevent dependency spaghetti while maintaining the "Decoupled Unity" architecture. Unrestricted cross-module dependencies create hidden coupling and make silos meaningless.

After architectural review, we determined that:

1. Multi-parent **inheritance** is problematic and should be avoided
2. Multi-parent **dependency** is different — it's natural for modules to _use_ interfaces from multiple sources
3. The solution is to separate inheritance (identity) from dependency (usage)

---

## Decision

We adopt the **Sibling Dependency Law** with three core principles:

### 1. Single-Parent Inheritance

Every requirement has exactly one parent. Identity flows down a single chain encoded in the requirement ID.

```
SYS-001                    → Constitution: Platform must have Shell
SYS-002                    → Constitution: Platform must have Strategy category
SYS-002-STR-001            → Strategy inherits from Constitution, must have Pulse
SYS-002-STR-001-PUL-001    → Pulse inherits from Strategy, needs Dashboard
```

### 2. Sibling-Only Dependencies

A node may only declare `requires_interfaces` on **siblings** (nodes sharing the same parent).

```yaml
# ✅ VALID - Pulse depending on sibling within Strategy
id: SYS-002-STR-001-PUL-001
requires_interfaces:
  - id: IC-STR-002          # Strategy's Event Bus - sibling at STR level

# ❌ INVALID - Pulse reaching across to Shell branch
id: SYS-002-STR-001-PUL-001
requires_interfaces:
  - id: IC-SHL-001          # Shell Navigation - NOT a sibling
```

### 3. Inherited Access

Cross-branch interface access must be declared by a **common ancestor**. Descendants inherit that access automatically.

---

## Dependency Resolution Algorithm

For any node N to access interface I:

1. **Provide**: N itself provides I → direct access
2. **Sibling**: A sibling of N provides I → declare `requires_interfaces`
3. **Inherit**: An ancestor of N has access to I → use via `inherited_interfaces`
4. **Denied**: None of above → **architectural violation**, redesign required

---

## Entity Types

| Type                      | Path Pattern                 | Description            |
| ------------------------- | ---------------------------- | ---------------------- |
| **Constitution**          | `docs/platform/*.md`         | System-wide rules      |
| **Infrastructure Module** | `docs/platform/{module}/`    | Platform services      |
| **Strategic Container**   | `docs/{category}/`           | User-facing categories |
| **Coordination Unit**     | `docs/{category}/{subcat}/`  | Subcategory scope      |
| **Business Module**       | `docs/{cat}/{subcat}/{mod}/` | Feature implementation |

---

## Consequences

### Positive

- **Dependency graph is always a tree**, never a web
- **Silo isolation is enforceable** and verifiable via CI
- **Forces architectural decisions to appropriate level**
- **Teams only need to understand their branch** — parent chain + siblings
- **Matches event-driven architecture** — events bubble up, so should dependencies

### Negative

- **More ceremony** to add cross-branch dependencies
- **May require restructuring** existing requirements
- **Escape hatch needed** for legacy/third-party integrations

---

## Enforcement

| Layer          | Mechanism                                     | Behavior                         |
| -------------- | --------------------------------------------- | -------------------------------- |
| **CI**         | `scripts/validation/validate-dependencies.ts` | Block PR if sibling law violated |
| **Pre-commit** | Husky hook (optional)                         | Local validation before commit   |
| **Review**     | Architecture Review process                   | New sibling dependencies flagged |

---

## Escape Hatch

For genuine exceptions (legacy systems, third-party integrations):

```yaml
requires_interfaces:
  - id: IC-LEGACY-001
    exception: true
    approved_by: 'ADR-021'
    justification: 'Legacy billing system, migration planned Q3'
```

---

## Related ADRs

| Atom ID                 | ADR     | Relationship        |
| ----------------------- | ------- | ------------------- |
| [SYS.017](./SYS.017.md) | ADR-001 | Knowledge Hierarchy |
| [SYS.018](./SYS.018.md) | ADR-002 | Event Envelope      |
| [SYS.029](./SYS.029.md) | ADR-014 | Module Registration |

---

## Dependencies

| Atom ID | Relationship | Description                         |
| ------- | ------------ | ----------------------------------- |
| —       | root         | Constitution-level atom (no parent) |

---

## Changelog

| Date       | Author    | Change                                      |
| ---------- | --------- | ------------------------------------------- |
| 2025-12-03 | Architect | Initial creation                            |
| 2025-12-04 | Architect | Extracted to SSOT atom from architecture.md |
