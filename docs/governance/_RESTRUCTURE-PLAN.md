# Atom Restructure Plan

> **Status:** Draft for Review
> **Problem:** Current atoms are a flat list at Constitution level. They should follow the commissioning hierarchy.

---

## Core Principle

**Each layer contains ONLY:**

1. **Commissions** — Creating the entities in the layer below
2. **Essential requirements** — Minimum rules those entities MUST follow

**Nothing more, nothing less.**

---

## Constitution Level (SYS.xxx)

Constitution commissions Infrastructure Modules and Strategic Containers, plus their essential requirements.

### Infrastructure Module Commissions

| Atom ID | Commission       | Essential Requirements                                          |
| ------- | ---------------- | --------------------------------------------------------------- |
| SYS.001 | Shell Module     | Routing, auth integration, React islands, graceful failure      |
| SYS.002 | Core API Module  | Event backbone, RLS multi-tenancy, authentication, Soul gateway |
| SYS.003 | UI Module        | Design system, accessible components, theming                   |
| SYS.004 | TS-Schema Module | Shared types, Zod validation, cross-runtime contracts           |

### Strategic Container Commissions

| Atom ID | Commission          | Essential Requirements                  |
| ------- | ------------------- | --------------------------------------- |
| SYS.005 | Strategy Category   | Soul management, Pulse, recommendations |
| SYS.006 | Marketing Category  | Brand, content, campaigns               |
| SYS.007 | Finance Category    | Invoicing, payments, reporting          |
| SYS.008 | Sales Category      | Pipeline, deals, forecasting            |
| SYS.009 | Operations Category | Workflows, automation, monitoring       |
| SYS.010 | Legal Category      | Contracts, compliance, documents        |
| SYS.011 | Team Category       | HR, hiring, performance                 |

### Cross-Cutting Essentials (Apply to ALL commissioned entities)

These are requirements that every commissioned entity must follow:

| Atom ID | Essential                                           | Applies To                 |
| ------- | --------------------------------------------------- | -------------------------- |
| SYS.012 | Multi-tenant isolation (org_id + RLS)               | All modules storing data   |
| SYS.013 | Event-first (emit before write)                     | All modules with mutations |
| SYS.014 | Authentication required                             | All API endpoints          |
| SYS.015 | Permission primitives (view/edit/approve/configure) | All user actions           |
| SYS.016 | Explainable automation                              | All AI/automated actions   |
| SYS.017 | Graceful degradation                                | All modules                |

---

## Module Level (SYS.xxx-{MODULE}.xxx)

Each module then defines HOW it implements the Constitution essentials, plus commissions for its own children.

### Core API Module (SYS.002-API.xxx)

| Atom ID         | Type           | Content                                 |
| --------------- | -------------- | --------------------------------------- |
| SYS.002-API.001 | implementation | RLS via Prisma middleware (was ADR-003) |
| SYS.002-API.002 | interface      | Event envelope schema (was IC-001)      |
| SYS.002-API.003 | interface      | Event naming convention (was IC-002)    |
| SYS.002-API.004 | interface      | Soul Access API (was IC-004)            |
| SYS.002-API.005 | interface      | Recommendation protocol (was IC-005)    |
| SYS.002-API.006 | interface      | Notification delivery (was IC-006)      |
| SYS.002-API.007 | interface      | Permission check protocol (was IC-007)  |
| SYS.002-API.008 | decision       | Dual-write pattern (was ADR-002)        |
| SYS.002-API.009 | decision       | Tri-State Memory (was ADR-006)          |
| SYS.002-API.010 | decision       | Hierarchical Pulse (was ADR-011)        |

### Shell Module (SYS.001-SHL.xxx)

| Atom ID         | Type      | Content                                        |
| --------------- | --------- | ---------------------------------------------- |
| SYS.001-SHL.001 | interface | Module registration manifest (was IC-003)      |
| SYS.001-SHL.002 | decision  | Copilot widget architecture (was ADR-012)      |
| SYS.001-SHL.003 | decision  | Module registration architecture (was ADR-014) |

### TS-Schema Module (SYS.004-TSS.xxx)

| Atom ID         | Type     | Content                                       |
| --------------- | -------- | --------------------------------------------- |
| SYS.004-TSS.001 | decision | Cross-runtime contract strategy (was ADR-009) |

### Strategy Category (SYS.005-STR.xxx)

| Atom ID         | Type     | Content                                    |
| --------------- | -------- | ------------------------------------------ |
| SYS.005-STR.001 | decision | Universal Soul orchestration (was ADR-001) |
| SYS.005-STR.002 | decision | Federated Soul registry (was ADR-007)      |
| SYS.005-STR.003 | decision | Soul access architecture (was ADR-016)     |
| SYS.005-STR.004 | decision | Narrative continuity (was ADR-013)         |

---

## What Happens to Current Atoms

| Current ID | Current Content     | New Location             | Rationale               |
| ---------- | ------------------- | ------------------------ | ----------------------- |
| SYS.001    | Shell Commission    | SYS.001                  | Correct ✓               |
| SYS.002    | PR-001 RLS          | SYS.012 (essential)      | Cross-cutting essential |
| SYS.003    | PR-002 Events       | SYS.013 (essential)      | Cross-cutting essential |
| SYS.004    | PR-003 Auth         | SYS.014 (essential)      | Cross-cutting essential |
| SYS.005    | PR-004 Soul Read    | SYS.005-STR.xxx          | Strategy-specific       |
| SYS.006    | PR-005 Permissions  | SYS.015 (essential)      | Cross-cutting essential |
| SYS.007    | PR-006 Explainable  | SYS.016 (essential)      | Cross-cutting essential |
| SYS.008    | PR-007 Graceful     | SYS.017 (essential)      | Cross-cutting essential |
| SYS.009    | PR-008 Vocabulary   | SYS.005-STR.xxx          | Strategy-specific       |
| SYS.010    | IC-001 Envelope     | SYS.002-API.002          | Core API interface      |
| SYS.011    | IC-002 Naming       | SYS.002-API.003          | Core API interface      |
| SYS.012    | IC-003 Manifest     | SYS.001-SHL.001          | Shell interface         |
| SYS.013    | IC-004 Soul API     | SYS.002-API.004          | Core API interface      |
| SYS.014    | IC-005 Recommend    | SYS.002-API.005          | Core API interface      |
| SYS.015    | IC-006 Notify       | SYS.002-API.006          | Core API interface      |
| SYS.016    | IC-007 Permission   | SYS.002-API.007          | Core API interface      |
| SYS.017    | ADR-001 Soul        | SYS.005-STR.001          | Strategy decision       |
| SYS.018    | ADR-002 Events      | SYS.002-API.008          | Core API decision       |
| SYS.019    | ADR-003 RLS         | SYS.002-API.001          | Core API implementation |
| SYS.020    | ADR-004 K8s         | SYS.002-API.xxx or infra | Infrastructure decision |
| SYS.021    | ADR-006 Memory      | SYS.002-API.009          | Core API decision       |
| SYS.022    | ADR-007 Registry    | SYS.005-STR.002          | Strategy decision       |
| SYS.023    | ADR-008 Python      | Agents module (future)   | Agent layer decision    |
| SYS.024    | ADR-009 Contract    | SYS.004-TSS.001          | TS-Schema decision      |
| SYS.025    | ADR-010 Resilience  | SYS.017 (essential)      | Cross-cutting essential |
| SYS.026    | ADR-011 Pulse       | SYS.002-API.010          | Core API decision       |
| SYS.027    | ADR-012 Copilot     | SYS.001-SHL.002          | Shell decision          |
| SYS.028    | ADR-013 Narrative   | SYS.005-STR.004          | Strategy decision       |
| SYS.029    | ADR-014 Module Reg  | SYS.001-SHL.003          | Shell decision          |
| SYS.030    | ADR-015 Permissions | SYS.002-API.xxx          | Core API decision       |
| SYS.031    | ADR-016 Soul Access | SYS.005-STR.003          | Strategy decision       |
| SYS.032    | ADR-017 Notify      | SYS.002-API.xxx          | Core API decision       |
| SYS.033    | ADR-018 Explain     | SYS.016 (essential)      | Part of essential       |
| SYS.034    | ADR-020 Sibling     | SYS.xxx (essential)      | Governance essential    |

---

## Migration Steps

1. **Create new Constitution structure** — Commissions + cross-cutting essentials
2. **Create module-level atoms** — Move IC/ADR content to proper modules
3. **Update all document references** — Point to new atom IDs
4. **Deprecate old atoms** — Mark as deprecated with redirect
5. **Remove legacy_id field** — Pure atom IDs only

---

## Open Questions

1. Should cross-cutting essentials be separate atoms (SYS.012-017) or embedded in each commission?
2. Where do infrastructure decisions (K8s, Python agents) live?
3. How do we handle atoms that affect multiple modules?
