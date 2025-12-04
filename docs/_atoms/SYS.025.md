---
id: SYS.025
type: decision
title: 'ADR-010: Resilience and Graceful Degradation'
status: approved
entity_path: docs/platform/
created: 2025-11-25
updated: 2025-12-04
author: Architect
tags: [adr, resilience, chaos-testing, rate-limiting]
legacy_id: ADR-010
---

# ADR-010: Resilience and Graceful Degradation

> **Atom ID:** `SYS.025`
> **Type:** decision
> **Status:** Approved
> **Legacy ID:** ADR-010

---

## Summary

Implements a 3-tier resilience strategy with rate limiting, graceful degradation, and chaos testing.

---

## Context

The architecture assumes everything works. We need patterns for when things fail.

---

## Decision

We implement a 3-tier resilience strategy:

1. **Rate Limiting:** API Gateway (per org), Service Layer (per endpoint), Copilot Layer (token budget).
2. **Graceful Degradation:** Tools must work without Agents. Events may delay but CRUD must work.
3. **Chaos Testing:** Weekly Redis/Agent tests; monthly Postgres/Network tests.

---

## Consequences

### Positive

- System remains functional when AI layer fails
- Rate limiting prevents runaway costs
- Chaos testing finds failures before production

### Negative

- Graceful degradation logic in every module
- Chaos testing requires infrastructure investment
- Rate limit tuning requires ongoing attention

---

## Key Principle

**Tools must never depend on Agents to function.**

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
