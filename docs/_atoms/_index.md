# SSOT Atom Repository

> **Purpose:** Centralized storage for authoritative content atoms — the hierarchical commission pattern that defines what entities exist and what they MUST do.

---

## Atom Model: Hierarchical Commission Pattern

**Each layer contains ONLY:**

1. **Commissions** — Creating entities in the layer below
2. **Essential Requirements** — Minimum rules those entities MUST follow

**Nothing more, nothing less.**

### The Recursive Rule

> **Parent's ESSENTIAL REQUIREMENT becomes Child's COMMISSION**

```
Constitution (SYS.001)
├── Commission: Strategy Category
└── Essential: MUST manage the Soul
                    │
                    ▼
        Strategy (SYS.001-STR.001)
        ├── Commission: Soul Module  ← Parent's essential became this
        └── Essential: MUST provide read API, MUST accept recommendations
                            │
                            ▼
                Soul Module (SYS.001-STR.001-SOL.001)
                ├── Commission: Soul API
                └── Essential: MUST return JSON, MUST respect org_id
                                    │
                                    ▼
                            Implementation (actual code)
                            └── Acceptance criteria from parent's essentials
```

This is **fractal** — same pattern at every level until you hit code.

---

## Atom ID Scheme

Atoms use hierarchical IDs that encode their FULL position in the entity tree. The ID IS the lineage — parent relationships are embedded in the ID itself.

```
{ENTITY}.{SEQ}(-{CHILD}.{SEQ})*
```

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

---

## Atom Types

| Type          | Purpose                   | Examples                       |
| ------------- | ------------------------- | ------------------------------ |
| `commission`  | Creates entity below      | "Strategy Category exists"     |
| `requirement` | What MUST be true         | "All tables must have org_id"  |
| `interface`   | Contract between entities | "Event envelope schema"        |
| `decision`    | Why we chose an approach  | "Why we use Postgres with RLS" |

---

## Constitution Structure (~11 atoms)

### 7 Category Commissions

| Atom    | Commission | Key Essentials                          |
| ------- | ---------- | --------------------------------------- |
| SYS.001 | Strategy   | Soul management, Pulse, recommendations |
| SYS.002 | Marketing  | Brand, content, campaigns               |
| SYS.003 | Finance    | Invoicing, payments, reporting          |
| SYS.004 | Sales      | Pipeline, deals, forecasting            |
| SYS.005 | Operations | Workflows, automation                   |
| SYS.006 | Legal      | Contracts, compliance                   |
| SYS.007 | Team       | HR, hiring, performance                 |

### 4 Infrastructure Module Commissions

| Atom    | Commission | Key Essentials                                       |
| ------- | ---------- | ---------------------------------------------------- |
| SYS.008 | Shell      | Routing, auth integration, islands, graceful failure |
| SYS.009 | Core API   | Event backbone, RLS multi-tenancy, Soul gateway      |
| SYS.010 | UI         | Design system, accessible components                 |
| SYS.011 | TS-Schema  | Shared types, Zod validation, cross-runtime          |

---

## Atom Frontmatter Schema

Every atom MUST include this frontmatter:

```yaml
---
id: SYS.001 # Required: Hierarchical ID encoding lineage
type: commission | requirement | interface | decision
title: 'Human-readable title' # Required: Clear, concise
status: draft | approved | deprecated
entity_path: docs/platform/ # Required: Owning entity path
created: 2025-12-04 # Required: ISO date
updated: 2025-12-04 # Required: ISO date
author: Constitution # Required: Creating agent/human
tags: [] # Optional: Searchable tags
---
```

---

## Gate Validation Rules

| Rule | Description                                         | Severity |
| ---- | --------------------------------------------------- | -------- |
| 1    | Parent atom exists for child atoms                  | BLOCK    |
| 2    | Entity path in frontmatter resolves                 | BLOCK    |
| 3    | ID format matches `{ENTITY}.{SEQ}(-{CHILD}.{SEQ})*` | BLOCK    |
| 4    | All internal references resolve                     | BLOCK    |
| 5    | No references to deprecated atoms                   | BLOCK    |
| 6    | Entity code in ID matches entity_path               | BLOCK    |

---

## Related Documents

- `docs/governance/atom-governance.md` — **Permanent governance rules**
- `docs/governance/migration-plan.md` — **Migration from flat to hierarchical** (temporary)
- `_schema.yaml` — Atom frontmatter JSON schema
- `scripts/validation/validate-atoms.ts` — Enforcement script

---

## Atom Index

> **Auto-generated.** Run `pnpm run validate:atoms` to regenerate.

### Constitution Atoms (SYS.001-011)

| ID      | Type       | Title                          | Status   | Entity         |
| ------- | ---------- | ------------------------------ | -------- | -------------- |
| SYS.001 | commission | Strategy Category Commission   | approved | docs/platform/ |
| SYS.002 | commission | Marketing Category Commission  | approved | docs/platform/ |
| SYS.003 | commission | Finance Category Commission    | approved | docs/platform/ |
| SYS.004 | commission | Sales Category Commission      | approved | docs/platform/ |
| SYS.005 | commission | Operations Category Commission | approved | docs/platform/ |
| SYS.006 | commission | Legal Category Commission      | approved | docs/platform/ |
| SYS.007 | commission | Team Category Commission       | approved | docs/platform/ |
| SYS.008 | commission | Shell Module Commission        | approved | docs/platform/ |
| SYS.009 | commission | Core API Module Commission     | approved | docs/platform/ |
| SYS.010 | commission | UI Module Commission           | approved | docs/platform/ |
| SYS.011 | commission | TS-Schema Module Commission    | approved | docs/platform/ |

### Child Atoms

_Child atoms will be created as essentials are implemented._
