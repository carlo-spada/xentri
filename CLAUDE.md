# CLAUDE.md

> **Self-contained context.** This file contains complete project context. Do NOT read GEMINI.md or AGENTS.md — they contain identical information for their respective agents.
>
> **Sync requirement.** If you modify this file, you MUST apply the same changes to GEMINI.md and AGENTS.md. All three files must remain identical (except for filename in header).

## Project Overview

**Xentri** is a modular Business OS that starts with conversation, not configuration. A **Strategy Co-pilot** generates a **Universal Soul** (the living DNA of a business), which powers tools organized into 7 capability categories.

## Documentation Structure

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

## Architecture: "Decoupled Unity"

| Layer          | Technology       | Role                                  |
| -------------- | ---------------- | ------------------------------------- |
| **Shell**      | Astro            | Container, routing, auth              |
| **Micro-Apps** | React Islands    | Interactive SPAs, lazy-loaded         |
| **Backend**    | Fastify + Prisma | Microservices per domain              |
| **Data**       | PostgreSQL       | Schema-per-service, RLS multi-tenancy |
| **Events**     | Redis Streams    | Async event transport                 |

**Non-negotiables:**

- Multi-tenant: every table has `org_id` with Row-Level Security
- Event-first: business actions write to `system_events` before domain tables
- Visible automation: every automated action logged with explanation
- Services communicate via events, not direct calls

## Repository Structure

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

## Development Commands

```bash
pnpm install && docker compose up -d postgres redis && pnpm run db:migrate
pnpm run dev                    # All services
pnpm run test                   # Tests
pnpm run typecheck              # TypeScript
pnpm run build                  # Build
```

## Federated Workflow System

Workflows tracked **per entity** (not project-wide). Each entity type has its own sequence.

```bash
/bmad:bmm:workflows:workflow-init   # Select entity, create status
/bmad:bmm:workflows:workflow-status  # View progress, next steps
```

| Phase              | Workflows                                                                                                            | Status                  |
| ------------------ | -------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| **Discovery**      | brainstorm-project, research, product-soul                                                                           | Optional                |
| **Planning**       | prd, validate-prd                                                                                                    | Required + Recommended  |
| **Design**         | create-ux, validate-ux                                                                                               | Conditional (if_has_ui) |
| **Solutioning**    | architecture, validate-architecture, create-epics-and-stories, validate-epics, test-design, implementation-readiness | Required + Recommended  |
| **Implementation** | sprint-planning                                                                                                      | Required                |

**Validation workflows are RECOMMENDED** to ensure quality gates.

| Entity Type               | Key Differences                              |
| ------------------------- | -------------------------------------------- |
| **Constitution**          | Full stack, product-soul, system-wide epics  |
| **Infrastructure Module** | Inherits Constitution, module-specific PRD   |
| **Strategic Container**   | Strategic PRD, no epics (children handle)    |
| **Coordination Unit**     | Coordination PRD, no epics (children handle) |
| **Business Module**       | Full stack, implementation-ready             |

## Coding Standards

- **TypeScript** everywhere; shared types in `packages/ts-schema`
- **2-space indent**, trailing commas, named exports
- **Event-first**: `system_events` before domain tables
- **Multi-tenant**: `org_id` + RLS on every table
- Tests: `*.test.ts` alongside code, Vitest + Playwright

## Governance

### Constitution Changes

Protected documents (`docs/platform/*.md`): prd, architecture, ux-design, epics, product-soul

When modifying: **Flag change → Provide rationale → Include in commit message**

### Zero-Trust Inheritance

Entities inherit from **direct parent only**. Can ADD requirements, never CONTRADICT parent.

### Requirement IDs

```
PR-xxx / IC-xxx     → Constitution only
FR-{CODE}-xxx       → All other entities (e.g., FR-SHL-001, FR-STR-PUL-001)
```
