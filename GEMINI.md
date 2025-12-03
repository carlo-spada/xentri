# Xentri - Business OS Project Context (Gemini)

## Project Overview

**Xentri** is a modular **Business OS** that unifies Strategy, Marketing, Sales, Finance, and Operations. It starts with a **Strategy Co-pilot** conversation that generates a **Universal Brief** - the "DNA" that configures all other modules.

### Core Value Proposition
- **Clarity First:** Starts with conversation, not configuration
- **Universal Brief:** Living document that powers all modules
- **Modular Growth:** Subscribe to capabilities as you grow
- **Calm UX:** Unified shell preventing "tab fatigue"

## Documentation Navigation

### Five Entity Types Model

Documentation follows a **Five Entity Types** model. Entity type is determined by **PURPOSE**, not depth.

| Entity Type | Path Pattern | PRD Focus |
|-------------|--------------|-----------|
| **Constitution** | `docs/platform/*.md` | PR/IC, system constraints |
| **Infrastructure Module** | `docs/platform/{module}/` | Implementation, interfaces |
| **Strategic Container** | `docs/{category}/` | Strategic alignment |
| **Coordination Unit** | `docs/{category}/{subcat}/` | Module orchestration |
| **Business Module** | `docs/{cat}/{subcat}/{mod}/` | Feature FRs |

### Entity Type Detection

```
docs/platform/*.md              → Constitution
docs/platform/{module}/         → Infrastructure Module
docs/{category}/                → Strategic Container
docs/{category}/{subcat}/       → Coordination Unit
docs/{cat}/{subcat}/{module}/   → Business Module
```

### Documentation Structure

```
docs/
├── index.md                    # Navigation hub
├── manifest.yaml               # Machine-readable registry (SINGLE SOURCE OF TRUTH)
│
├── platform/                   # META CONTAINER (Constitution + Infrastructure)
│   ├── prd.md                  # CONSTITUTION: System PRD (PR-xxx, IC-xxx)
│   ├── architecture.md         # CONSTITUTION: System Architecture
│   ├── ux-design.md            # CONSTITUTION: System UX Principles
│   ├── epics.md                # CONSTITUTION: Cross-cutting Epics
│   ├── product-brief.md        # CONSTITUTION: Foundational Vision
│   │
│   ├── shell/                  # INFRASTRUCTURE MODULE
│   ├── ui/                     # INFRASTRUCTURE MODULE
│   ├── core-api/               # INFRASTRUCTURE MODULE
│   ├── ts-schema/              # INFRASTRUCTURE MODULE
│   └── orchestration/          # INFRASTRUCTURE MODULE
│
├── strategy/                   # STRATEGIC CONTAINER
│   └── {subcat}/               # COORDINATION UNIT
│       └── {module}/           # BUSINESS MODULE
└── {category}/                 # Other strategic containers
```

### Module Management

**NEVER manually edit `docs/manifest.yaml` or create/delete module folders.**

```bash
# Platform Infrastructure Modules
./scripts/add-module.sh platform {module}
./scripts/remove-module.sh platform {module}

# Strategic Containers
./scripts/add-category.sh {category} "Description"
./scripts/remove-category.sh {category}

# Coordination Units
./scripts/add-subcategory.sh {category} {subcat} "Description"
./scripts/remove-subcategory.sh {category} {subcat}

# Business Modules
./scripts/add-module.sh {category} {subcat} {module}
./scripts/remove-module.sh {category} {subcat} {module}
```

## Architecture & Tech Stack

Monorepo managed by **Turborepo**, following "Decoupled Unity" philosophy.

| Layer | Technology | Role |
|-------|------------|------|
| **Shell** | Astro | Container app - routing, auth, layout |
| **Micro-Apps** | React Islands | Interactive capabilities loaded on demand |
| **Backend** | Fastify + Prisma | Core API |
| **Data** | PostgreSQL | RLS for multi-tenancy |
| **Events** | Redis Streams | Async event transport |

### Key Patterns
1. **Event Backbone:** Services emit events to `system_events`, not direct calls
2. **Multi-Tenancy:** Postgres RLS - every table has `org_id`
3. **Lazy Loading:** React micro-apps loaded on demand by Astro shell
4. **Shared Contract:** Types in `packages/ts-schema`

## Development Commands

```bash
# Setup
pnpm install                           # Install dependencies
docker compose up -d postgres redis    # Start infrastructure
pnpm run db:migrate                    # Apply Prisma migrations

# Development
pnpm run dev                           # Start all services
pnpm run dev --filter apps/shell       # Shell only
pnpm run dev --filter services/core-api # API only

# Quality
pnpm run test                          # Run tests
pnpm run typecheck                     # TypeScript validation
pnpm run build                         # Build all packages
```

## Coding Standards

- **Strict Isolation:** Services communicate via events, not direct calls
- **Type Safety:** Schema changes require `packages/ts-schema` updates
- **No Magic:** Automated actions logged with human-readable explanations
- **BMAD Workflows:** Use `/bmad:bmm:workflows:*` for development tasks

## Federated Workflow System

Workflows are tracked **per entity**, not project-wide. Each entity type has its own workflow sequence.

### Workflow Commands

```bash
/bmad:bmm:workflows:workflow-init   # Select entity, create status file
/bmad:bmm:workflows:workflow-status  # View progress, get next steps
```

### Workflow Phases

| Phase | Workflows | Status |
|-------|-----------|--------|
| **Discovery** | brainstorm-project, research, product-brief | Optional |
| **Planning** | prd, validate-prd | Required + Recommended |
| **Design** | create-ux, validate-ux | Conditional (if_has_ui) |
| **Solutioning** | architecture, validate-architecture, create-epics-and-stories, validate-epics, test-design, implementation-readiness | Required + Recommended |
| **Implementation** | sprint-planning | Required |

**Validation workflows are RECOMMENDED** to ensure quality gates.

### Workflow Sequence by Entity Type

| Entity Type | Key Differences |
|-------------|-----------------|
| **Constitution** | Full stack including product-brief, system-wide epics |
| **Infrastructure Module** | Inherits from Constitution, module-specific PRD |
| **Strategic Container** | Strategic PRD, no epics (children handle) |
| **Coordination Unit** | Coordination PRD, no epics (children handle) |
| **Business Module** | Full stack with implementation-ready requirements |

## User Rules

- **NEVER SKIP AHEAD:** Do not perform tasks without explicit request
- **VALIDATION ONLY:** When asked to validate, check existing files only
- **ENTITY CONTEXT:** Always determine which entity type before starting work
- **DOCUMENTATION:** See `docs/index.md` for complete navigation

## Governance Rules

### Constitution Changes

**Any change to Constitution documents requires explicit flagging and rationale.**

Protected documents (in `docs/platform/`):
- `prd.md` — System PRD (PR-xxx, IC-xxx)
- `architecture.md` — System Architecture
- `ux-design.md` — System UX Principles
- `epics.md` — Cross-cutting Epics
- `product-brief.md` — Foundational Vision

When modifying these files:
1. Flag the change in your response
2. Provide rationale explaining why
3. Include rationale in commit message

### Zero-Trust Inheritance

All entities inherit from their **direct parent only** (no skip-level):
- Children expose work upward, parents curate what's shared
- Each level can ADD requirements but NEVER CONTRADICT parent
