# Xentri Governance

> **Status:** APPROVED
> **Purpose:** Single source of truth for project rules, architecture, and conventions.
> **Generates:** `CLAUDE.md`, `GEMINI.md`, `AGENTS.md` — run `pnpm run sync:agents` after editing.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture](#2-architecture)
3. [Repository Structure](#3-repository-structure)
4. [Documentation Structure](#4-documentation-structure)
5. [Core Principles](#5-core-principles)
6. [Constitution Structure](#6-constitution-structure)
7. [Inheritance Rules](#7-inheritance-rules)
8. [Atom System](#8-atom-system)
9. [Validation Rules](#9-validation-rules)
10. [Conventions](#10-conventions)
11. [Federated Workflow System](#11-federated-workflow-system)
12. [Agent Coordination](#12-agent-coordination)
13. [Development](#13-development)
14. [Glossary](#14-glossary)

---

## 1. Project Overview

**Xentri** is a modular Business OS that starts with conversation, not configuration. A **Strategy Co-pilot** generates a **Universal Soul** (the living DNA of a business), which powers tools organized into 7 capability categories.

---

## 2. Architecture

### 2.1 Decoupled Unity

| Layer          | Technology       | Role                                  |
| -------------- | ---------------- | ------------------------------------- |
| **Shell**      | Astro            | Container, routing, auth              |
| **Micro-Apps** | React Islands    | Interactive SPAs, lazy-loaded         |
| **Backend**    | Fastify + Prisma | Microservices per domain              |
| **Data**       | PostgreSQL       | Schema-per-service, RLS multi-tenancy |
| **Events**     | Redis Streams    | Async event transport                 |

### 2.2 Non-Negotiables

- **Multi-tenant:** Every table has `org_id` with Row-Level Security
- **Event-first:** Business actions write to `system_events` before domain tables
- **Visible automation:** Every automated action logged with explanation
- **Event-driven communication:** Services communicate via events, not direct calls

### 2.3 Industry Validation

| Pattern                            | Company | Our Equivalent                            |
| ---------------------------------- | ------- | ----------------------------------------- |
| Cascading OKRs                     | Google  | Commission → Essential → Child Commission |
| Two-pizza teams with API contracts | Amazon  | Each atom owns its interface              |
| API Improvement Proposals          | Google  | Atoms ARE the proposals, hierarchical     |
| Infrastructure as Code             | DevOps  | Requirements as Code                      |
| Monorepo API boundaries            | Google  | Atom tree = dependency tree               |

---

## 3. Repository Structure

```
/xentri
├── apps/shell/           # Astro Shell with React islands
├── packages/ui/          # Shared Design System
├── packages/ts-schema/   # Shared Types & Zod Schemas (the "Contract")
├── services/core-api/    # Core API with Prisma, RLS
├── docs/                 # Hierarchical documentation
├── .bmad/                # BMAD framework
└── .claude/commands/     # Slash commands (/bmad:*)
```

---

## 4. Documentation Structure

Documentation follows a **Five Entity Types** model (determined by PURPOSE, not depth):

| Entity Type               | Path Pattern                 | Contains                          |
| ------------------------- | ---------------------------- | --------------------------------- |
| **Constitution**          | `docs/platform/*.md`         | PR-xxx, IC-xxx, system-wide rules |
| **Infrastructure Module** | `docs/platform/{module}/`    | Interfaces, implementation        |
| **Strategic Container**   | `docs/{category}/`           | Strategic alignment               |
| **Coordination Unit**     | `docs/{category}/{subcat}/`  | Module orchestration              |
| **Business Module**       | `docs/{cat}/{subcat}/{mod}/` | Feature FRs                       |

```
docs/
├── index.md                    # Navigation hub
├── manifest.yaml               # SINGLE SOURCE OF TRUTH
├── platform/                   # Constitution + Infrastructure
│   ├── prd.md, architecture.md, ux-design.md, epics.md, product-soul.md
│   ├── shell/, ui/, core-api/, ts-schema/
│   ├── ux/                     # UX artifacts (HTML mockups)
│   └── sprint-artifacts/       # Constitution-level sprint tracking
├── strategy/                   # Strategic Container
│   └── {subcat}/{module}/      # Coordination Unit → Business Module
└── {category}/                 # Other strategic containers
```

**Module Management:** NEVER manually edit `manifest.yaml`. Use scripts:

```bash
./scripts/add-module.sh platform {module}
./scripts/add-category.sh {category} "Description"
./scripts/add-subcategory.sh {category} {subcat} "Description"
./scripts/add-module.sh {category} {subcat} {module}
```

---

## 5. Core Principles

### 5.1 Hierarchical Commissions

Each layer contains ONLY:

1. **Commissions** — Creating entities in the layer below
2. **Essential Requirements** — Minimum rules those entities MUST follow

Nothing more, nothing less.

### 5.2 The Recursive Rule

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

### 5.3 Code Mirrors Documentation

The atom hierarchy IS the code hierarchy:

```
docs/_atoms/SYS.001-STR.001-SOL.001.md
     ↓ maps to ↓
services/strategy/soul/
```

- Same tree structure
- Same IDs for traceability
- CI validates: Does code implement atom's essentials?

---

## 6. Constitution Structure

### 6.1 Category Commissions (7)

| Atom    | Commission | Key Essentials                          |
| ------- | ---------- | --------------------------------------- |
| SYS.001 | Strategy   | Soul management, Pulse, recommendations |
| SYS.002 | Marketing  | Brand, content, campaigns               |
| SYS.003 | Finance    | Invoicing, payments, reporting          |
| SYS.004 | Sales      | Pipeline, deals, forecasting            |
| SYS.005 | Operations | Workflows, automation                   |
| SYS.006 | Legal      | Contracts, compliance                   |
| SYS.007 | Team       | HR, hiring, performance                 |

### 6.2 Infrastructure Commissions (4)

| Atom    | Commission | Key Essentials                                       |
| ------- | ---------- | ---------------------------------------------------- |
| SYS.008 | Shell      | Routing, auth integration, islands, graceful failure |
| SYS.009 | Core API   | Event backbone, RLS multi-tenancy, Soul gateway      |
| SYS.010 | UI         | Design system, accessible components                 |
| SYS.011 | TS-Schema  | Shared types, Zod validation, cross-runtime          |

---

## 7. Inheritance Rules

### Rule 1: Single Parent

Every atom has EXACTLY ONE parent (except root SYS atoms).

### Rule 2: Can Add, Cannot Contradict

Child atoms can ADD requirements but CANNOT CONTRADICT parent atoms.

### Rule 3: Sibling Dependencies Only (ADR-020)

An atom can only depend on SIBLINGS (atoms with the same parent), not cousins. Cross-branch needs must be declared at the common ancestor level.

See: `docs/platform/architecture/adr-020-sibling-dependency-law.md`

---

## 8. Atom System

### 8.1 Atom Types

| Type          | Purpose                   | Examples                       |
| ------------- | ------------------------- | ------------------------------ |
| `commission`  | Creates entity below      | "Strategy Category exists"     |
| `requirement` | What MUST be true         | "All tables must have org_id"  |
| `interface`   | Contract between entities | "Event envelope schema"        |
| `decision`    | Why we chose an approach  | "Why we use Postgres with RLS" |

### 8.2 Entity Codes

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

### 8.3 Atom ID Format

```
{ENTITY}.{SEQ}(-{CHILD}.{SEQ})*
```

Examples:

- `SYS.001` — Constitution atom
- `SYS.001-STR.001` — Strategy child of SYS.001
- `SYS.001-STR.001-SOL.001` — Soul child of Strategy

### 8.4 Requirement ID Format

| Scope        | Format             | Example                    |
| ------------ | ------------------ | -------------------------- |
| Constitution | `PR-xxx`, `IC-xxx` | PR-001, IC-004             |
| All Others   | `FR-{CODE}-xxx`    | FR-SHL-001, FR-STR-PUL-001 |

### 8.5 Critical Files

| File                       | Purpose                      |
| -------------------------- | ---------------------------- |
| `docs/_atoms/_index.md`    | Atom registry + ID scheme    |
| `docs/_atoms/_schema.yaml` | Atom frontmatter schema      |
| `docs/manifest.yaml`       | Documentation structure SSOT |

---

## 9. Validation Rules

The `scripts/validation/validate-atoms.ts` script enforces:

| Rule | Description                           | Severity |
| ---- | ------------------------------------- | -------- |
| 1    | Parent atom exists for child atoms    | BLOCK    |
| 2    | Entity path in frontmatter resolves   | BLOCK    |
| 3    | ID format matches specification       | BLOCK    |
| 4    | All internal references resolve       | BLOCK    |
| 5    | No references to deprecated atoms     | BLOCK    |
| 6    | Entity code in ID matches entity_path | BLOCK    |

**Enforcement Layers:**

1. Script-based validation during atom CRUD operations
2. Pre-commit hook: `.husky/pre-commit`
3. CI pipeline: `.github/workflows/docs-validation.yml`

---

## 10. Conventions

### 10.1 Document Status Values

| Status       | Meaning                                  |
| ------------ | ---------------------------------------- |
| `draft`      | Work in progress, not yet validated      |
| `pending`    | Awaiting review or approval              |
| `approved`   | Validated and ready for use              |
| `deprecated` | No longer authoritative, pending removal |

### 10.2 Workflow Status Values

| Status        | Meaning                          |
| ------------- | -------------------------------- |
| `pending`     | Not yet started                  |
| `in_progress` | Currently being executed         |
| `completed`   | Successfully finished            |
| `blocked`     | Cannot proceed due to dependency |

### 10.3 Coding Standards

- **TypeScript** everywhere; shared types in `packages/ts-schema`
- **2-space indent**, trailing commas, named exports
- **Event-first**: `system_events` before domain tables
- **Multi-tenant**: `org_id` + RLS on every table
- Tests: `*.test.ts` alongside code, Vitest + Playwright

### 10.4 Constitution Changes

Protected documents (`docs/platform/*.md`): prd, architecture, ux-design, epics, product-soul

When modifying: **Flag change → Provide rationale → Include in commit message**

---

## 11. Federated Workflow System

Workflows tracked **per entity** (not project-wide). Each entity type has its own sequence.

```bash
/bmad:bmm:workflows:workflow-init    # Select entity, create status
/bmad:bmm:workflows:workflow-status  # View progress, next steps
```

### 11.1 Workflow Phases

| Phase              | Workflows                                                                                                            | Status                  |
| ------------------ | -------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| **Discovery**      | brainstorm-project, research, product-soul                                                                           | Optional                |
| **Planning**       | prd, validate-prd                                                                                                    | Required + Recommended  |
| **Design**         | create-ux, validate-ux                                                                                               | Conditional (if_has_ui) |
| **Solutioning**    | architecture, validate-architecture, create-epics-and-stories, validate-epics, test-design, implementation-readiness | Required + Recommended  |
| **Implementation** | sprint-planning                                                                                                      | Required                |

**Validation workflows are RECOMMENDED** to ensure quality gates.

### 11.2 Entity Type Differences

| Entity Type               | Key Differences                              |
| ------------------------- | -------------------------------------------- |
| **Constitution**          | Full stack, product-soul, system-wide epics  |
| **Infrastructure Module** | Inherits Constitution, module-specific PRD   |
| **Strategic Container**   | Strategic PRD, no epics (children handle)    |
| **Coordination Unit**     | Coordination PRD, no epics (children handle) |
| **Business Module**       | Full stack, implementation-ready             |

---

## 12. Agent Coordination

### 12.1 Agent Assignment Matrix

| Agent            | Primary Responsibility       | Document Types                |
| ---------------- | ---------------------------- | ----------------------------- |
| **BMad Builder** | BMAD system files            | `.bmad/**/*`                  |
| **Analyst**      | Gap analysis, validation     | All (read-only)               |
| **PM**           | PRDs, Epics, requirement IDs | `prd.md`, `epics.md`          |
| **Architect**    | Architecture docs, ADRs      | `architecture.md`, `adr-*.md` |
| **UX Designer**  | UX design, wireframes        | `ux-design.md`, `ux/**/*`     |
| **Tech Writer**  | Formatting, cross-references | `docs/index.md`               |
| **Dev**          | Sprint artifacts, stories    | `sprint-artifacts/**/*`       |
| **SM**           | Status tracking              | `sprint-status.yaml`          |

### 12.2 Agent Activation

| Agent        | Slash Command                   |
| ------------ | ------------------------------- |
| BMad Builder | `/bmad:bmb:agents:bmad-builder` |
| Analyst      | `/bmad:bmm:agents:analyst`      |
| PM           | `/bmad:bmm:agents:pm`           |
| Architect    | `/bmad:bmm:agents:architect`    |
| UX Designer  | `/bmad:bmm:agents:ux-designer`  |
| Tech Writer  | `/bmad:bmm:agents:tech-writer`  |
| Dev          | `/bmad:bmm:agents:dev`          |
| SM           | `/bmad:bmm:agents:sm`           |

### 12.3 Handoff Protocol

| From      | To        | Trigger               | Gate                           |
| --------- | --------- | --------------------- | ------------------------------ |
| PM        | Architect | PRD approved          | `validate-prd` passes          |
| Architect | UX        | Architecture approved | `validate-architecture` passes |
| UX        | Dev       | UX approved           | `validate-ux` passes           |
| PM        | SM        | Epics created         | `validate-epics` passes        |

---

## 13. Development

### 13.1 Quick Start

```bash
pnpm install
docker compose up -d postgres redis
pnpm run db:migrate
pnpm run dev
```

### 13.2 Common Commands

```bash
pnpm run dev          # All services
pnpm run test         # Tests
pnpm run typecheck    # TypeScript
pnpm run build        # Build
```

### 13.3 Validation Commands

```bash
pnpm run validate:docs        # Documentation structure
pnpm run validate:links       # Link integrity
pnpm run validate:atoms       # Atom structure
pnpm exec tsx scripts/validation/validate-dependencies.ts --path docs  # ADR-020
```

### 13.4 Atom CRUD Operations

```bash
# Create
pnpm exec tsx scripts/atoms/atom-create.ts --entity SYS --type requirement --title "My Atom"
pnpm exec tsx scripts/atoms/atom-create.ts --entity SHL --type interface --title "Shell API" --parent SYS.001

# Search
pnpm exec tsx scripts/atoms/atom-search.ts --entity SHL
pnpm exec tsx scripts/atoms/atom-search.ts --type requirement --status approved

# Amend
pnpm exec tsx scripts/atoms/atom-amend.ts --id SYS.001 --status approved
pnpm exec tsx scripts/atoms/atom-amend.ts --id SYS.001 --add-tag security

# Deprecate
pnpm exec tsx scripts/atoms/atom-deprecate.ts --id SYS.001
```

### 13.5 Workflow-Based Validation

| Type         | Command                                     |
| ------------ | ------------------------------------------- |
| PRD          | `/bmad:bmm:workflows:validate-prd`          |
| Architecture | `/bmad:bmm:workflows:validate-architecture` |
| Epics        | `/bmad:bmm:workflows:validate-epics`        |
| UX Design    | `/bmad:bmm:workflows:validate-ux`           |

---

## 14. Glossary

| Term                       | Definition                                                                                        |
| -------------------------- | ------------------------------------------------------------------------------------------------- |
| **Atom**                   | Smallest unit of authoritative content. Lives in `docs/_atoms/`, referenced by ID.                |
| **SSOT**                   | Single Source of Truth — each piece of information has exactly one authoritative location.        |
| **Constitution**           | Root entity (`docs/platform/`) containing system-wide rules.                                      |
| **Infrastructure Module**  | Platform-level modules (`docs/platform/{module}/`) providing foundational services.               |
| **Strategic Container**    | Category-level entities (`docs/{category}/`) representing business domains.                       |
| **Coordination Unit**      | Subcategory-level entities (`docs/{category}/{subcategory}/`) orchestrating modules.              |
| **Business Module**        | Feature-level entities (`docs/{cat}/{subcat}/{mod}/`) where functionality is implemented.         |
| **Zero-Trust Inheritance** | Entities inherit ONLY from direct parent, can ADD requirements but never CONTRADICT.              |
| **Sibling Dependency Law** | ADR-020: Dependencies only on siblings. Cross-branch requires ancestor declaration.               |
| **Triad**                  | Complete set of three workflows: create, validate, amend.                                         |
| **DRI**                    | Directly Responsible Individual — single person accountable for a deliverable.                    |
| **Entity-first Detection** | Workflows determine entity type at runtime before applying type-specific templates.               |
| **Gate Validation**        | Hard-block rules at pre-commit/CI preventing invalid atoms, broken refs, deprecated dependencies. |

---

## Related Documents

- [`migration.md`](./migration.md) — Active migration tracking (transient, delete when done)
- `docs/_atoms/_index.md` — Atom registry
- `docs/platform/architecture/adr-020-sibling-dependency-law.md` — Sibling Dependency Law
