---
id: SYS.020
type: decision
title: 'ADR-004: Kubernetes First (Category Cluster)'
status: approved
entity_path: docs/platform/
created: 2025-11-25
updated: 2025-12-04
author: Architect
tags: [adr, kubernetes, deployment, infrastructure]
legacy_id: ADR-004
---

# ADR-004: Kubernetes First (Category Cluster Strategy)

> **Atom ID:** `SYS.020`
> **Type:** decision
> **Status:** Approved
> **Legacy ID:** ADR-004

---

## Summary

Establishes Managed Kubernetes with Category Consolidation pattern for cost-effective deployment of ~42 Agents and ~130 Tools.

---

## Context

We have ~42 Agents and ~130 Tools planned. Deploying as ~175 separate services on a PaaS is cost-prohibitive.

---

## Decision

We deploy to **Managed Kubernetes** with a **Category Consolidation** pattern:

- **Agent Plane (Python):** 7 Deployments (1 per Category), each hosting Category Co-pilot + Sub-Category Agents.
- **Tool Plane (Node.js):** 7 Deployments (1 per Category), each hosting API endpoints for that Category.
- **Frontend Plane:** 1 Shell Deployment + static assets via CDN.

**Total Services:** ~15 (7 Agents + 7 Tools + 1 Shell).

---

## Consequences

### Positive

- Cost-effective: ~15 deployments vs ~175
- Category-aligned scaling (HPA per category)
- Clear separation of Agent and Tool planes

### Negative

- Requires Helm Chart templates per category
- Intra-category services share pod resources
- More complex debugging within consolidated pods

---

## Implication

We need Helm Chart templates that can be instantiated per category.

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
