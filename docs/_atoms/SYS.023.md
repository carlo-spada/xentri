---
id: SYS.023
type: decision
title: 'ADR-008: Python for Agent Layer'
status: approved
entity_path: docs/platform/
created: 2025-11-25
updated: 2025-12-04
author: Architect
tags: [adr, python, agents, ai, langchain]
legacy_id: ADR-008
---

# ADR-008: Python for Agent Layer

> **Atom ID:** `SYS.023`
> **Type:** decision
> **Status:** Approved
> **Legacy ID:** ADR-008

---

## Summary

Introduces a dedicated Python Agent Layer for all complex AI agents, separate from Node.js business logic.

---

## Context

~130 modules are standard business tools (CRUD). ~42 are complex AI agents. Using Python for everything kills frontend velocity. Using Node for everything kills AI velocity.

---

## Decision

We introduce a dedicated **Python Agent Layer** for all complex AI agents.

- **Scope:** Heavy Reasoning, LLM Chains, Data Science, Complex Agents.
- **Why:** Native home of AI (LangChain, PyTorch, Pandas).

---

## Consequences

### Positive

- AI development uses best-in-class Python ecosystem
- Frontend/business logic uses best-in-class Node.js ecosystem
- Teams can specialize without cross-runtime expertise

### Negative

- Two runtimes to deploy and manage
- Cross-runtime communication overhead
- Schema sharing requires code generation (see ADR-009)

---

## Implication

Clear boundary between business logic (Node.js) and AI logic (Python). Communication via Redis Streams and API contracts.

---

## Dependencies

| Atom ID                         | Relationship | Description                         |
| ------------------------------- | ------------ | ----------------------------------- |
| [SYS.024](./SYS.024.md) ADR-009 | related      | Cross-Runtime Contract Strategy     |
| —                               | root         | Constitution-level atom (no parent) |

---

## Changelog

| Date       | Author    | Change                                      |
| ---------- | --------- | ------------------------------------------- |
| 2025-11-25 | Architect | Initial creation                            |
| 2025-12-04 | Architect | Extracted to SSOT atom from architecture.md |
