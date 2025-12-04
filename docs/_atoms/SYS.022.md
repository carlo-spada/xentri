---
id: SYS.022
type: decision
title: 'ADR-007: Federated Soul Registry'
status: approved
entity_path: docs/platform/
created: 2025-11-25
updated: 2025-12-04
author: Architect
tags: [adr, agents, prompts, soul, composition]
legacy_id: ADR-007
---

# ADR-007: Federated Soul Registry

> **Atom ID:** `SYS.022`
> **Type:** decision
> **Status:** Approved
> **Legacy ID:** ADR-007

---

## Summary

Establishes a Federated Prompt Composition strategy for managing 42 agent system prompts through layered composition.

---

## Context

We have 42 Agents. Managing 42 separate system prompts is impossible.

---

## Decision

We use a **Federated Prompt Composition** strategy:

- **Layer 1 (Global Soul):** Universal values shared by ALL agents.
- **Layer 2 (Category Context):** Domain expertise shared by Category Agents.
- **Layer 3 (Agent Role):** Specific job unique to each Agent.

**Composition:** `Final Prompt = Global Soul + Category Context + Agent Role + Universal Soul`

---

## Consequences

### Positive

- Single source of truth for shared values
- Changes to Global Soul propagate to all agents automatically
- Category-specific context reusable across agents in same category
- Individual agent roles remain focused and maintainable

### Negative

- Prompt composition adds runtime complexity
- Debugging requires understanding all layers
- Cache invalidation when layers change

---

## Implication

All agents must be built using the layered composition pattern.

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
