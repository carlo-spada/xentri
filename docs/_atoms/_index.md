# SSOT Atom Repository

> **Purpose:** Centralized storage for authoritative content atoms (requirements, decisions, interfaces) that must be referenced consistently across all documentation.

---

## Atom ID Scheme

Atoms use hierarchical IDs that encode their FULL position in the entity tree. The ID IS the lineage — parent relationships are embedded in the ID itself.

```
{ENTITY}.{SEQ}(-{CHILD}.{SEQ})*
```

### ID Components

| Component | Format            | Description                               |
| --------- | ----------------- | ----------------------------------------- |
| ENTITY    | 3 chars uppercase | Entity code (e.g., SYS, SHL, STR)         |
| SEQ       | 3 digits          | Sequential number within entity (001-999) |
| CHILD     | 3 chars uppercase | Child entity code (repeatable)            |

### Entity Codes

| Code | Entity Type          | Path Pattern               |
| ---- | -------------------- | -------------------------- |
| SYS  | Constitution         | `docs/platform/`           |
| SHL  | Shell Module         | `docs/platform/shell/`     |
| UI   | UI Module            | `docs/platform/ui/`        |
| API  | Core API Module      | `docs/platform/core-api/`  |
| TSS  | TS-Schema Module     | `docs/platform/ts-schema/` |
| STR  | Strategy Container   | `docs/strategy/`           |
| MKT  | Marketing Container  | `docs/marketing/`          |
| FIN  | Finance Container    | `docs/finance/`            |
| LEG  | Legal Container      | `docs/legal/`              |
| OPS  | Operations Container | `docs/operations/`         |
| SAL  | Sales Container      | `docs/sales/`              |
| TEM  | Team Container       | `docs/team/`               |

### Examples

```
# Constitution atom #1 (defines Shell module)
docs/_atoms/SYS.001.md

# Constitution atom #2 (defines API module)
docs/_atoms/SYS.002.md

# Constitution atom #3 (defines Strategy category)
docs/_atoms/SYS.003.md

# Shell module atom #1 — child of SYS.001 specifically
docs/_atoms/SYS.001-SHL.001.md

# API module atom #1 — child of SYS.002 specifically
docs/_atoms/SYS.002-API.001.md

# Strategy > Pulse atom #1 — child of SYS.003-STR.001
docs/_atoms/SYS.003-STR.001-PUL.001.md
```

### Full Hierarchical Example

```
SYS.004-STR.001-PUL.001-DAS.001
 │   │    │   │    │   │    │   │
 │   │    │   │    │   │    │   └── Dashboard atom #1
 │   │    │   │    │   │    └────── Dashboard entity
 │   │    │   │    │   └─────────── Pulse atom #1
 │   │    │   │    └────────────── Pulse entity
 │   │    │   └──────────────────── Strategy atom #1
 │   │    └─────────────────────── Strategy entity
 │   └──────────────────────────── System atom #4
 └─────────────────────────────── System (Constitution)
```

Each atom ID encodes its EXACT lineage. `SYS.004-STR.001-PUL.001-DAS.001` is a child of `SYS.004-STR.001-PUL.001`, which is a child of `SYS.004-STR.001`, which is a child of `SYS.004`.

---

## Directory Structure

```
docs/_atoms/
├── _index.md              # This file
├── _schema.yaml           # Atom frontmatter schema
│
├── SYS.001.md             # Constitution atom commissioning Shell
├── SYS.002.md             # Constitution atom commissioning API
├── SYS.003.md             # Constitution atom commissioning Strategy
├── ...
│
├── SYS.001-SHL.001.md     # Shell atom #1 (child of SYS.001)
├── SYS.001-SHL.002.md     # Shell atom #2 (child of SYS.001)
├── SYS.002-API.001.md     # API atom #1 (child of SYS.002)
├── SYS.003-STR.001.md     # Strategy atom #1 (child of SYS.003)
├── SYS.003-STR.001-PUL.001.md  # Pulse atom (child of SYS.003-STR.001)
└── ...
```

---

## Atom Frontmatter Schema

Every atom MUST include this frontmatter:

```yaml
---
id: SYS.001 # Required: Unique atom ID (encodes full lineage)
type: requirement | interface | decision | constraint
title: 'Human-readable title' # Required: Clear, concise
status: draft | approved | deprecated
entity_path: docs/platform/ # Required: Owning entity path
created: 2025-12-04 # Required: ISO date
updated: 2025-12-04 # Required: ISO date
author: BMad Builder # Required: Creating agent/human
tags: [] # Optional: Searchable tags
---
```

### Type Field Values

| Type        | Description                                 |
| ----------- | ------------------------------------------- |
| requirement | Business/product/functional requirements    |
| interface   | System interface contracts                  |
| decision    | Architecture Decision Records (ADRs)        |
| constraint  | Non-functional constraints (security, perf) |

---

## Referencing Atoms

### In Documentation

Use relative links from any doc to reference atoms:

```markdown
See [SYS.001](../_atoms/SYS.001.md) for the Shell module commissioning.
```

### Cross-References Within Atoms

```markdown
This atom depends on [SYS.001](./SYS.001.md).
```

---

## Gate Validation Rules

Five rules enforced at pre-commit and CI:

| Rule | Name          | Description                                          | Severity |
| ---- | ------------- | ---------------------------------------------------- | -------- |
| 1    | Parent Exists | Parent atom (ID prefix) must exist in `docs/_atoms/` | BLOCK    |
| 2    | Entity Valid  | Entity path in atom frontmatter must resolve         | BLOCK    |
| 3    | ID Format     | Atom ID must match `{ENTITY}.{SEQ}(-{CHILD}.{SEQ})*` | BLOCK    |
| 4    | Refs Resolve  | All internal atom refs `./ID.md` must resolve        | BLOCK    |
| 5    | No Deprecated | Cannot reference atoms with `status: deprecated`     | BLOCK    |

---

## CRUD Operations

| Operation     | Script                            | Purpose                 |
| ------------- | --------------------------------- | ----------------------- |
| **Create**    | `scripts/atoms/atom-create.ts`    | Add new atom            |
| **Search**    | `scripts/atoms/atom-search.ts`    | Find atoms by criteria  |
| **Amend**     | `scripts/atoms/atom-amend.ts`     | Modify existing atom    |
| **Deprecate** | `scripts/atoms/atom-deprecate.ts` | Mark atom as deprecated |

Usage:

```bash
pnpm exec tsx scripts/atoms/atom-create.ts --entity SYS --type requirement --title "My Atom"
pnpm exec tsx scripts/atoms/atom-search.ts --entity SHL --status draft
pnpm exec tsx scripts/atoms/atom-amend.ts --id SYS.001 --status approved
pnpm exec tsx scripts/atoms/atom-deprecate.ts --id SYS.001
```

---

## Related Documents

- `docs/manifest.yaml` — Single source of truth for documentation structure
- `docs/document-contracts.yaml` — Entity document structure rules
- `scripts/validation/validate-atoms.ts` — Atom validation + index generation

---

## Atom Index

> **Auto-generated.** Run `pnpm exec tsx scripts/validation/validate-atoms.ts` to regenerate.

| ID              | Type        | Title                                  | Status   | Entity               | Legacy ID |
| --------------- | ----------- | -------------------------------------- | -------- | -------------------- | --------- |
| SYS.001         | requirement | Shell Module Commission                | draft    | docs/platform/       | —         |
| SYS.001-SHL.001 | requirement | Shell Navigation Component             | draft    | docs/platform/shell/ | —         |
| SYS.002         | requirement | Multi-tenant RLS Architecture          | approved | docs/platform/       | PR-001    |
| SYS.003         | requirement | Event Spine Integration                | approved | docs/platform/       | PR-002    |
| SYS.004         | requirement | Authentication Required                | approved | docs/platform/       | PR-003    |
| SYS.005         | requirement | Soul Read-Only Access                  | approved | docs/platform/       | PR-004    |
| SYS.006         | requirement | Permission Primitives                  | approved | docs/platform/       | PR-005    |
| SYS.007         | requirement | Explainable Automation                 | approved | docs/platform/       | PR-006    |
| SYS.008         | requirement | Graceful Module Failure                | approved | docs/platform/       | PR-007    |
| SYS.009         | requirement | Soul-Aware Vocabulary                  | approved | docs/platform/       | PR-008    |
| SYS.010         | interface   | Event Envelope Schema                  | approved | docs/platform/       | IC-001    |
| SYS.011         | interface   | Event Naming Convention                | approved | docs/platform/       | IC-002    |
| SYS.012         | interface   | Module Registration Manifest           | approved | docs/platform/       | IC-003    |
| SYS.013         | interface   | Soul Access API                        | approved | docs/platform/       | IC-004    |
| SYS.014         | interface   | Recommendation Submission Protocol     | approved | docs/platform/       | IC-005    |
| SYS.015         | interface   | Notification Delivery Contract         | approved | docs/platform/       | IC-006    |
| SYS.016         | interface   | Permission Check Protocol              | approved | docs/platform/       | IC-007    |
| SYS.017         | decision    | Universal Soul Orchestration           | approved | docs/platform/       | ADR-001   |
| SYS.018         | decision    | Event Envelope and Schema              | approved | docs/platform/       | ADR-002   |
| SYS.019         | decision    | Multi-Tenant Security (RLS)            | approved | docs/platform/       | ADR-003   |
| SYS.020         | decision    | Kubernetes First (Category Cluster)    | approved | docs/platform/       | ADR-004   |
| SYS.021         | decision    | Tri-State Memory Architecture          | approved | docs/platform/       | ADR-006   |
| SYS.022         | decision    | Federated Soul Registry                | approved | docs/platform/       | ADR-007   |
| SYS.023         | decision    | Python for Agent Layer                 | approved | docs/platform/       | ADR-008   |
| SYS.024         | decision    | Cross-Runtime Contract Strategy        | approved | docs/platform/       | ADR-009   |
| SYS.025         | decision    | Resilience and Graceful Degradation    | approved | docs/platform/       | ADR-010   |
| SYS.026         | decision    | Hierarchical Pulse Architecture        | approved | docs/platform/       | ADR-011   |
| SYS.027         | decision    | Copilot Widget Architecture            | approved | docs/platform/       | ADR-012   |
| SYS.028         | decision    | Narrative Continuity and UX Philosophy | approved | docs/platform/       | ADR-013   |
| SYS.029         | decision    | Module Registration Architecture       | approved | docs/platform/       | ADR-014   |
| SYS.030         | decision    | Permission Enforcement Architecture    | approved | docs/platform/       | ADR-015   |
| SYS.031         | decision    | Soul Access Architecture               | approved | docs/platform/       | ADR-016   |
| SYS.032         | decision    | Notification Delivery Architecture     | approved | docs/platform/       | ADR-017   |
| SYS.033         | decision    | Automated Action Explanation Pattern   | approved | docs/platform/       | ADR-018   |
| SYS.034         | decision    | Sibling Dependency Law                 | approved | docs/platform/       | ADR-020   |
