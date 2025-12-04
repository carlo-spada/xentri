---
id: SYS.033
type: decision
title: 'ADR-018: Automated Action Explanation Pattern'
status: approved
entity_path: docs/platform/
created: 2025-11-25
updated: 2025-12-04
author: Architect
tags: [adr, automation, explainability, transparency]
legacy_id: ADR-018
---

# ADR-018: Automated Action Explanation Pattern (PR-006)

> **Atom ID:** `SYS.033`
> **Type:** decision
> **Status:** Approved
> **Legacy ID:** ADR-018

---

## Summary

Implements an Explainable Action system where every automated action includes what, who, explanation, and reversibility information.

---

## Context

PR-006 mandates that all automated actions be logged with human-readable explanation.

---

## Decision

We implement an **Explainable Action** system where every automated action includes:

- What action was taken
- Who/what took it
- Human-readable explanation (summary + reasoning)
- Reversibility information

---

## Consequences

### Positive

- Full transparency for all automated actions
- Users can understand and trust automation
- Audit trail for compliance

### Negative

- Explanation generation adds latency
- LLM-generated explanations may vary in quality
- Storage overhead for explanation logs

---

## Implication

Copilots and automations must generate explanations before acting.

**Implementation:** See [SYS.007](./SYS.007.md) (PR-006: Automated Action Logging).

---

## Dependencies

| Atom ID                        | Relationship | Description                         |
| ------------------------------ | ------------ | ----------------------------------- |
| [SYS.007](./SYS.007.md) PR-006 | implements   | Automated Action Logging            |
| —                              | root         | Constitution-level atom (no parent) |

---

## Changelog

| Date       | Author    | Change                                      |
| ---------- | --------- | ------------------------------------------- |
| 2025-11-25 | Architect | Initial creation                            |
| 2025-12-04 | Architect | Extracted to SSOT atom from architecture.md |
