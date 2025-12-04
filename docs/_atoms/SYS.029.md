---
id: SYS.029
type: decision
title: 'ADR-014: Module Registration Architecture'
status: approved
entity_path: docs/platform/
created: 2025-11-25
updated: 2025-12-04
author: Architect
tags: [adr, modules, shell, manifest, registration]
legacy_id: ADR-014
---

# ADR-014: Module Registration Architecture (IC-003)

> **Atom ID:** `SYS.029`
> **Type:** decision
> **Status:** Approved
> **Legacy ID:** ADR-014

---

## Summary

Implements a Declarative Module Manifest system for dynamic module discovery and loading in the Shell.

---

## Context

The Shell must dynamically discover and load modules without hard-coding references.

---

## Decision

We implement a **Declarative Module Manifest** system where each module exposes a YAML manifest at build time.

**Manifest includes:**

- Module identity (id, name, category)
- Routes and navigation
- Permissions required
- Events emitted/consumed
- Soul fields read

---

## Consequences

### Positive

- No hard-coded module references in Shell
- Modules self-describe their capabilities
- Easy to add/remove modules without Shell changes

### Negative

- Every module must include a valid manifest
- Manifest schema versioning needed
- Shell cannot load modules without manifests

---

## Implication

Every module must include a valid `manifest.yaml`. Shell cannot load modules without manifests.

**Implementation:** See [SYS.012](./SYS.012.md) (IC-003: Module Registration Manifest) and `docs/platform/ts-schema/epics.md` (Story TSS-3.1).

---

## Dependencies

| Atom ID                        | Relationship | Description                         |
| ------------------------------ | ------------ | ----------------------------------- |
| [SYS.012](./SYS.012.md) IC-003 | implements   | Module Registration Manifest        |
| —                              | root         | Constitution-level atom (no parent) |

---

## Changelog

| Date       | Author    | Change                                      |
| ---------- | --------- | ------------------------------------------- |
| 2025-11-25 | Architect | Initial creation                            |
| 2025-12-04 | Architect | Extracted to SSOT atom from architecture.md |
