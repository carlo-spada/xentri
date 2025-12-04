---
id: SYS.026
type: decision
title: 'ADR-011: Hierarchical Pulse Architecture'
status: approved
entity_path: docs/platform/
created: 2025-11-25
updated: 2025-12-04
author: Architect
tags: [adr, pulse, ux, hierarchy, filtering]
legacy_id: ADR-011
---

# ADR-011: Hierarchical Pulse Architecture

> **Atom ID:** `SYS.026`
> **Type:** decision
> **Status:** Approved
> **Legacy ID:** ADR-011

---

## Summary

Implements a Fractal Pulse System where each hierarchy level produces and consumes its own Pulse view.

---

## Context

The UX requires that every hierarchy level exposes its own Pulse view.

---

## Decision

We implement a **Fractal Pulse System** where each level produces and consumes Pulse data.

| Level            | Pulse View                              | Audience          |
| ---------------- | --------------------------------------- | ----------------- |
| **Strategy**     | What survived all 4 layers of filtering | Owner/Founder     |
| **Category**     | What's happening in that category       | Category managers |
| **Sub-category** | What's happening in that sub-category   | Team leads        |
| **Module**       | What's happening in that module         | Module users      |

---

## Consequences

### Positive

- Appropriate information at each level
- Natural filtering as data bubbles up
- Each level can have its own cadence

### Negative

- Each agent level must implement Pulse output generation
- Coordination needed to prevent redundant notifications
- UX complexity to navigate between levels

---

## Implication

Each agent level must implement Pulse output generation.

**Implementation:** See `docs/platform/ts-schema/prd.md` for PulseItem schema (FR-TSS-005).

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
