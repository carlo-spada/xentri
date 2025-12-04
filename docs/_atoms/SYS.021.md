---
id: SYS.021
type: decision
title: 'ADR-006: Tri-State Memory Architecture'
status: approved
entity_path: docs/platform/
created: 2025-11-25
updated: 2025-12-04
author: Architect
tags: [adr, memory, agents, ai, postgres, redis]
legacy_id: ADR-006
---

# ADR-006: Tri-State Memory Architecture

> **Atom ID:** `SYS.021`
> **Type:** decision
> **Status:** Approved
> **Legacy ID:** ADR-006

---

## Summary

Implements a three-tier memory system for agents: Semantic Memory (facts), Episodic Memory (experiences), and Synthetic Memory (compressed wisdom).

---

## Context

Agents need long-term memory that mimics human recall (Facts, Experiences, Persona).

---

## Decision

We implement a **Tri-State Memory System**:

1. **Semantic Memory (The Soul):** Structured facts about the business. Storage: Postgres (JSONB) + Redis Cache.
2. **Episodic Memory (The Journal):** Time-series log of what happened. Storage: pgvector.
3. **Synthetic Memory (The Persona):** Compressed wisdom derived from episodes. Storage: System Prompt.

---

## Consequences

### Positive

- Agents have persistent, contextual memory across sessions
- Memory compression prevents unbounded growth
- Different memory types serve different use cases efficiently

### Negative

- Complex memory management infrastructure
- Background "Dreaming" process adds operational overhead
- pgvector dependency for episodic storage

---

## Implication

A background "Dreaming" process runs nightly to compress Episodes into Synthetic Memory.

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
