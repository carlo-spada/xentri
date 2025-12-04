---
id: SYS.027
type: decision
title: 'ADR-012: Copilot Widget Architecture'
status: approved
entity_path: docs/platform/
created: 2025-11-25
updated: 2025-12-04
author: Architect
tags: [adr, copilot, widget, ux, shell]
legacy_id: ADR-012
---

# ADR-012: Copilot Widget Architecture

> **Atom ID:** `SYS.027`
> **Type:** decision
> **Status:** Approved
> **Legacy ID:** ADR-012

---

## Summary

Implements a Context-Aware Copilot Widget as a Shell-level component with collapsed, panel, and full-screen states.

---

## Context

The UX specifies a draggable widget that summons the context-relevant copilot.

---

## Decision

We implement a **Context-Aware Copilot Widget** as a Shell-level component.

| State         | Appearance            | Behavior               |
| ------------- | --------------------- | ---------------------- |
| **Collapsed** | Small icon + badge    | User-positionable      |
| **Panel**     | Right or bottom panel | Shares screen with SPA |
| **Full**      | Replaces main section | Full copilot focus     |

---

## Consequences

### Positive

- Always-available copilot access
- Context-aware (knows current module/page)
- Flexible display modes for different workflows

### Negative

- Shell must track navigation context
- Widget state management complexity
- Potential for distraction if overused

---

## Implication

Shell must track navigation context and pass it to the widget.

**Implementation:** See `docs/platform/shell/ux-design.md` and `docs/platform/ui/epics.md` (Story UI-2.2).

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
