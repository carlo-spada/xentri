# Atom Governance

> **Status:** APPROVED (Party Mode Discussion 2025-12-04)
> **Purpose:** Permanent rules for the hierarchical atom system. This document STAYS after migration.

---

## Core Principle

**Each layer contains ONLY:**

1. **Commissions** — Creating entities in the layer below
2. **Essential Requirements** — Minimum rules those entities MUST follow

**Nothing more, nothing less.**

---

## The Recursive Rule

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

### 4 Essential Infrastructure Commissions

| Atom    | Commission | Key Essentials                                       |
| ------- | ---------- | ---------------------------------------------------- |
| SYS.008 | Shell      | Routing, auth integration, islands, graceful failure |
| SYS.009 | Core API   | Event backbone, RLS multi-tenancy, Soul gateway      |
| SYS.010 | UI         | Design system, accessible components                 |
| SYS.011 | TS-Schema  | Shared types, Zod validation, cross-runtime          |

---

## Code Mirrors Documentation

The atom hierarchy IS the code hierarchy:

```
docs/_atoms/SYS.001-STR.001-SOL.001.md
     ↓ maps to ↓
services/strategy/soul/
```

- **Same tree structure**
- **Same IDs for traceability**
- **CI can validate**: Does code implement atom's essentials?

---

## Atom Types

| Type          | Purpose                   | Examples                       |
| ------------- | ------------------------- | ------------------------------ |
| `commission`  | Creates entity below      | "Strategy Category exists"     |
| `requirement` | What MUST be true         | "All tables must have org_id"  |
| `interface`   | Contract between entities | "Event envelope schema"        |
| `decision`    | Why we chose an approach  | "Why we use Postgres with RLS" |

---

## Inheritance Rules

### Rule 1: Single Parent

Every atom has EXACTLY ONE parent (except root SYS atoms).

### Rule 2: Can Add, Cannot Contradict

Child atoms can ADD requirements but CANNOT CONTRADICT parent atoms.

### Rule 3: Sibling Dependencies Only (ADR-020)

An atom can only depend on SIBLINGS (atoms with the same parent), not cousins.
Cross-branch needs must be declared at the common ancestor level.

---

## Validation Rules

The `scripts/validation/validate-atoms.ts` script enforces:

| Rule | Description                                         | Severity |
| ---- | --------------------------------------------------- | -------- |
| 1    | Parent atom exists for child atoms                  | BLOCK    |
| 2    | Entity path in frontmatter resolves                 | BLOCK    |
| 3    | ID format matches `{ENTITY}.{SEQ}(-{CHILD}.{SEQ})*` | BLOCK    |
| 4    | All internal references resolve                     | BLOCK    |
| 5    | No references to deprecated atoms                   | BLOCK    |
| 6    | Entity code in ID matches entity_path               | BLOCK    |

---

## Entity Codes

| Code | Entity Type          | Path                       |
| ---- | -------------------- | -------------------------- |
| SYS  | Constitution         | `docs/platform/`           |
| SHL  | Shell Module         | `docs/platform/shell/`     |
| UI   | UI Module            | `docs/platform/ui/`        |
| API  | Core API Module      | `docs/platform/core-api/`  |
| TSS  | TS-Schema Module     | `docs/platform/ts-schema/` |
| STR  | Strategy Container   | `docs/strategy/`           |
| MKT  | Marketing Container  | `docs/marketing/`          |
| FIN  | Finance Container    | `docs/finance/`            |
| SAL  | Sales Container      | `docs/sales/`              |
| OPS  | Operations Container | `docs/operations/`         |
| LEG  | Legal Container      | `docs/legal/`              |
| TEM  | Team Container       | `docs/team/`               |

---

## Industry Validation

This model maps to proven patterns:

| Pattern                            | Company | Our Equivalent                            |
| ---------------------------------- | ------- | ----------------------------------------- |
| Cascading OKRs                     | Google  | Commission → Essential → Child Commission |
| Two-pizza teams with API contracts | Amazon  | Each atom owns its interface              |
| API Improvement Proposals          | Google  | Atoms ARE the proposals, hierarchical     |
| Infrastructure as Code             | DevOps  | Requirements as Code                      |
| Monorepo API boundaries            | Google  | Atom tree = dependency tree               |

---

## Key Insights

1. **Telephone game solved**: Parent's essential IS child's commission — no interpretation
2. **Validation possible**: CI checks code against atom essentials
3. **Test pyramid built-in**: Atom depth = test scope (integration → unit)
4. **Onboarding trivial**: Read atom tree root-to-leaf = full context
5. **Cross-cutting via Sibling Law**: Cross-branch needs declared at common ancestor
6. **Fractal governance**: Same pattern at every level

---

## Related Documents

- `docs/governance/migration-plan.md` — Transition plan (temporary)
- `docs/_atoms/_index.md` — Atom registry
- `docs/_atoms/_schema.yaml` — Frontmatter schema
- `scripts/validation/validate-atoms.ts` — Enforcement script
