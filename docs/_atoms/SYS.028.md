---
id: SYS.028
type: decision
title: 'ADR-013: Narrative Continuity and UX Philosophy'
status: approved
entity_path: docs/platform/
created: 2025-11-25
updated: 2025-12-04
author: Architect
tags: [adr, ux, narrative, chronicle, themes]
legacy_id: ADR-013
---

# ADR-013: Narrative Continuity and UX Philosophy

> **Atom ID:** `SYS.028`
> **Type:** decision
> **Status:** Approved
> **Legacy ID:** ADR-013

---

## Summary

Adopts a Narrative-First UX philosophy where users read a "story" of their business rather than checking dashboards.

---

## Context

Users shouldn't feel like they are "checking a dashboard" but rather "reading a story" of their business.

---

## Decision

We adopt a **Narrative-First** UX philosophy:

1. **Chronicle View (Default):** Journal-like feed ("Since yesterday...", "Story Arcs").
2. **Efficiency/Power Toggle:** Dense, list-based view for power users.
3. **No-Scroll Constraint:** The entire app must fit in the viewport.
4. **Theme Architecture:** Multiple themes (Modern, Power, Traditional) via CSS variables.

---

## Consequences

### Positive

- Engaging, human-centered experience
- Reduces cognitive load compared to dashboards
- Story Arcs create meaningful narrative

### Negative

- Story Arcs as a new data entity to manage
- Session Bridging for absence detection adds complexity
- No-scroll constraint limits dense information display

---

## Implication

Story Arcs as a new data entity; Session Bridging for absence detection.

**Implementation:** See `docs/platform/ts-schema/prd.md` for StoryArc schema (FR-TSS-006).

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
