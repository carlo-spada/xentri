---
id: SYS.017
type: decision
title: 'ADR-001: Universal Soul Orchestration'
status: approved
entity_path: docs/platform/
created: 2025-11-25
updated: 2025-12-04
author: Architect
tags: [adr, soul, knowledge-hierarchy, agents]
legacy_id: ADR-001
---

# ADR-001: Universal Soul Orchestration

> **Atom ID:** `SYS.017`
> **Type:** decision
> **Status:** Approved
> **Legacy ID:** ADR-001

---

## Summary

Establishes the Knowledge Hierarchy pattern for how the Universal Soul powers downstream modules without tight coupling.

---

## Context

How do we ensure the "Universal Soul" effectively powers diverse downstream modules without creating a tight coupling or a "god object"?

---

## Decision

We adopt a **Knowledge Hierarchy** pattern:

1. **Universal Soul:** The shared source of truth (Identity, Offerings, Goals). Accessible by all Category Agents.
2. **Category Context:** Domain-specific rules derived from the Soul (e.g., Brand Voice, Sales Pipeline). Managed by Category Agents.
3. **Module Context:** Specific configurations (e.g., Website Pages, Quote Templates). Managed by Subagents.

---

## Consequences

### Positive

- Clear separation of concerns between global, category, and module context
- Agents can operate independently while staying aligned to the Soul
- Changes to Soul propagate naturally through the hierarchy

### Negative

- Agents must implement context lookup logic
- Potential for stale context if caching is not managed properly

---

## Implication

Agents must first consult the Universal Soul, then their Category Context, before taking action.

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
