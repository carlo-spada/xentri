# Xentri Governance

> **Status:** APPROVED
> **Purpose:** Permanent rules for how we work, document, and code within Xentri. This document STAYS.

---

## 1. Core Principle: Hierarchical Commissions

**Each layer contains ONLY:**

1. **Commissions** — Creating entities in the layer below
2. **Essential Requirements** — Minimum rules those entities MUST follow

**Nothing more, nothing less.**

---

## 2. The Recursive Rule

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

## 3. Constitution Structure (11 Atoms)

### 3.1 Category Commissions (7)

| Atom    | Commission | Key Essentials                          |
| ------- | ---------- | --------------------------------------- |
| SYS.001 | Strategy   | Soul management, Pulse, recommendations |
| SYS.002 | Marketing  | Brand, content, campaigns               |
| SYS.003 | Finance    | Invoicing, payments, reporting          |
| SYS.004 | Sales      | Pipeline, deals, forecasting            |
| SYS.005 | Operations | Workflows, automation                   |
| SYS.006 | Legal      | Contracts, compliance                   |
| SYS.007 | Team       | HR, hiring, performance                 |

### 3.2 Infrastructure Commissions (4)

| Atom    | Commission | Key Essentials                                       |
| ------- | ---------- | ---------------------------------------------------- |
| SYS.008 | Shell      | Routing, auth integration, islands, graceful failure |
| SYS.009 | Core API   | Event backbone, RLS multi-tenancy, Soul gateway      |
| SYS.010 | UI         | Design system, accessible components                 |
| SYS.011 | TS-Schema  | Shared types, Zod validation, cross-runtime          |

---

## 4. Inheritance Rules

### Rule 1: Single Parent

Every atom has EXACTLY ONE parent (except root SYS atoms).

### Rule 2: Can Add, Cannot Contradict

Child atoms can ADD requirements but CANNOT CONTRADICT parent atoms.

### Rule 3: Sibling Dependencies Only (ADR-020)

An atom can only depend on SIBLINGS (atoms with the same parent), not cousins.
Cross-branch needs must be declared at the common ancestor level.

---

## 5. Atom Types

| Type          | Purpose                   | Examples                       |
| ------------- | ------------------------- | ------------------------------ |
| `commission`  | Creates entity below      | "Strategy Category exists"     |
| `requirement` | What MUST be true         | "All tables must have org_id"  |
| `interface`   | Contract between entities | "Event envelope schema"        |
| `decision`    | Why we chose an approach  | "Why we use Postgres with RLS" |

---

## 6. Entity Codes

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

## 7. Validation Rules

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

## 8. Glossary

| Term                       | Definition                                                                                 |
| -------------------------- | ------------------------------------------------------------------------------------------ |
| **Atom**                   | Smallest unit of authoritative content. Lives in `docs/_atoms/`, referenced by ID.         |
| **SSOT**                   | Single Source of Truth — each piece of information has exactly one authoritative location. |
| **Constitution**           | Root entity (`docs/platform/`) containing system-wide rules.                               |
| **Infrastructure Module**  | Platform-level modules (`docs/platform/{module}/`) providing foundational services.        |
| **Strategic Container**    | Category-level entities (`docs/{category}/`) representing business domains.                |
| **Coordination Unit**      | Subcategory-level entities (`docs/{category}/{subcategory}/`) orchestrating modules.       |
| **Business Module**        | Feature-level entities (`docs/{cat}/{subcat}/{mod}/`) where functionality is implemented.  |
| **Zero-Trust Inheritance** | Entities inherit ONLY from direct parent, can ADD requirements but never CONTRADICT.       |
| **Sibling Dependency Law** | ADR-020: Dependencies only on siblings. Cross-branch requires ancestor declaration.        |
| **Triad**                  | Complete set of three workflows: create, validate, amend.                                  |
| **DRI**                    | Directly Responsible Individual — single person accountable for a deliverable.             |

---

## 9. Conventions

### 9.1 Document Status Values

| Status       | Meaning                                  |
| ------------ | ---------------------------------------- |
| `draft`      | Work in progress, not yet validated      |
| `pending`    | Awaiting review or approval              |
| `approved`   | Validated and ready for use              |
| `deprecated` | No longer authoritative, pending removal |

### 9.2 Workflow Status Values

| Status        | Meaning                          |
| ------------- | -------------------------------- |
| `pending`     | Not yet started                  |
| `in_progress` | Currently being executed         |
| `completed`   | Successfully finished            |
| `blocked`     | Cannot proceed due to dependency |

### 9.3 Requirement ID Format

| Scope        | Format             | Example                    |
| ------------ | ------------------ | -------------------------- |
| Constitution | `PR-xxx`, `IC-xxx` | PR-001, IC-004             |
| All Others   | `FR-{CODE}-xxx`    | FR-SHL-001, FR-STR-PUL-001 |

---

## 10. Agent Assignment Matrix

| Agent                   | Primary Responsibility                 | Document Types                | File Lock Scope                     |
| ----------------------- | -------------------------------------- | ----------------------------- | ----------------------------------- |
| **BMad Builder**        | BMAD system files, workflow.yaml       | `.bmad/**/*`                  | `.bmad/`                            |
| **Analyst (Mary)**      | Gap analysis, cross-cutting validation | All (read-only analysis)      | None (read-only)                    |
| **PM (John)**           | PRDs, Epics, requirement IDs           | `prd.md`, `epics.md`          | `**/prd.md`, `**/epics.md`          |
| **Architect (Winston)** | Architecture docs, ADRs                | `architecture.md`, `adr-*.md` | `**/architecture.md`, `**/adr-*.md` |
| **UX Designer (Sally)** | UX design documents, wireframes        | `ux-design.md`, `ux/**/*`     | `**/ux-design.md`, `**/ux/`         |
| **Tech Writer (Paige)** | Formatting, cross-references           | `docs/index.md`               | `docs/index.md`                     |
| **Dev (Amelia)**        | Sprint artifacts, story files          | `sprint-artifacts/**/*`       | `**/sprint-artifacts/`              |
| **SM (Bob)**            | Status tracking, sprint planning       | `sprint-status.yaml`          | `**/sprint-status.yaml`             |

---

## 11. Agent Coordination Protocol

### 11.1 File Locking Strategy

1. **Exclusive Lock:** Agent announces intent before modifying files in their lock scope
2. **Lock Duration:** Maximum 30 minutes per file/directory
3. **Lock Release:** Explicit release or automatic after commit
4. **Conflict Resolution:** First to announce gets priority; others wait or work on different files

### 11.2 Handoff Procedures

| From Agent | To Agent  | Handoff Point         | Validation Before Handoff      |
| ---------- | --------- | --------------------- | ------------------------------ |
| PM         | Architect | PRD approved          | `validate-prd` passes          |
| Architect  | UX        | Architecture approved | `validate-architecture` passes |
| UX         | Dev       | UX approved           | `validate-ux` passes           |
| PM         | SM        | Epics created         | `validate-epics` passes        |

---

## 12. Validation Commands

```bash
# Standard validation
pnpm run validate:docs
pnpm run validate:links
pnpm run validate:atoms

# Sibling Dependency Law (ADR-020)
pnpm exec tsx scripts/validation/validate-dependencies.ts --path docs
```

---

## 13. Critical Files Reference

| File                                          | Purpose                           |
| --------------------------------------------- | --------------------------------- |
| `docs/manifest.yaml`                          | Documentation structure SSOT      |
| `docs/product-soul.md`                        | Constitution Product Soul         |
| `docs/_atoms/_index.md`                       | Atom registry + ID scheme         |
| `docs/_atoms/_schema.yaml`                    | Atom frontmatter schema           |
| `docs/governance/governance.md`               | This file (permanent rules)       |
| `scripts/validation/validate-atoms.ts`        | Atom validation                   |
| `scripts/validation/validate-dependencies.ts` | ADR-020 enforcement               |
| `.claude/skills/validate-sibling-dependency/` | Claude skill for dependency check |

---

## 14. Code Mirrors Documentation

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

## 15. Industry Validation

This model maps to proven patterns:

| Pattern                            | Company | Our Equivalent                            |
| ---------------------------------- | ------- | ----------------------------------------- |
| Cascading OKRs                     | Google  | Commission → Essential → Child Commission |
| Two-pizza teams with API contracts | Amazon  | Each atom owns its interface              |
| API Improvement Proposals          | Google  | Atoms ARE the proposals, hierarchical     |
| Infrastructure as Code             | DevOps  | Requirements as Code                      |
| Monorepo API boundaries            | Google  | Atom tree = dependency tree               |

---

## Related Documents

- `docs/governance/migration.md` — Active migration plan (temporary)
- `docs/_atoms/_index.md` — Atom registry
- `docs/_atoms/_schema.yaml` — Frontmatter schema
