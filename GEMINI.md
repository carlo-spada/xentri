# Xentri - Business OS Project Context (Gemini)

## 1. Project Overview

**Xentri** is a modular **Business OS** that unifies Strategy, Marketing, Sales, Finance, and Operations. It starts with a **Strategy Co-pilot** conversation that generates a **Universal Brief** - the "DNA" that configures all other modules.

**Current Phase:** Epic 1 Foundation complete (Story 1.7 in review)
**Live API:** https://core-api-production-8016.up.railway.app

### Core Value Proposition
- **Clarity First:** Starts with conversation, not configuration
- **Universal Brief:** Living document that powers all modules
- **Modular Growth:** Subscribe to capabilities as you grow
- **Calm UX:** Unified shell preventing "tab fatigue"

## 2. Documentation Navigation

### Five Entity Types Model

Documentation follows a **Five Entity Types** model (not levels). Entity type is determined by **PURPOSE**, not depth.

| Entity Type | Path Pattern | PRD Focus | Example |
|-------------|--------------|-----------|---------|
| **Constitution** | `docs/platform/*.md` | PR/IC, system constraints | `docs/platform/prd.md` |
| **Infrastructure Module** | `docs/platform/{module}/` | Implementation, interfaces | `docs/platform/core-api/prd.md` |
| **Strategic Container** | `docs/{category}/` | Strategic alignment | `docs/strategy/prd.md` |
| **Coordination Unit** | `docs/{category}/{subcat}/` | Module orchestration | `docs/strategy/pulse/prd.md` |
| **Business Module** | `docs/{cat}/{subcat}/{mod}/` | Feature FRs | `docs/strategy/pulse/dashboard/prd.md` |

### Entity Type Detection

At session start, determine which entity you're working on:

```
Entity Type Detection (by path pattern):
  docs/platform/*.md              → Constitution
  docs/platform/{module}/         → Infrastructure Module
  docs/{category}/                → Strategic Container
  docs/{category}/{subcat}/       → Coordination Unit
  docs/{cat}/{subcat}/{module}/   → Business Module

Infrastructure Modules (platform):
  - shell, ui, core-api, ts-schema, orchestration (active)
  - events, auth, billing, brief (planned)

Strategic Containers (user-facing categories):
  - strategy, marketing, sales, finance, operations, team, legal
```

Store selection as `{entity_type}/{path}` and resolve paths accordingly.

### Documentation Structure

```
docs/
├── index.md                    # Navigation hub
├── manifest.yaml               # Machine-readable registry (v4.0)
│
├── platform/                   # META CONTAINER (Constitution + Infrastructure)
│   ├── prd.md                  # CONSTITUTION: System PRD (PR-xxx, IC-xxx)
│   ├── architecture.md         # CONSTITUTION: System Architecture
│   ├── ux-design.md            # CONSTITUTION: System UX Principles
│   ├── epics.md                # CONSTITUTION: Cross-cutting Epics
│   ├── product-brief.md        # CONSTITUTION: Foundational Vision
│   │
│   ├── shell/                  # INFRASTRUCTURE MODULE (apps/shell)
│   ├── ui/                     # INFRASTRUCTURE MODULE (packages/ui)
│   ├── core-api/               # INFRASTRUCTURE MODULE (services/core-api)
│   ├── ts-schema/              # INFRASTRUCTURE MODULE (packages/ts-schema)
│   └── orchestration/          # INFRASTRUCTURE MODULE (cross-cutting)
│
├── strategy/                   # STRATEGIC CONTAINER (planned)
│   └── pulse/                  # COORDINATION UNIT
│       └── god-view/           # BUSINESS MODULE
├── marketing/                  # STRATEGIC CONTAINER (planned)
└── ...                         # Other categories (sales, finance, operations, team, legal)
```

Each module has its own: README.md, prd.md, architecture.md, epics.md, sprint-artifacts/

### Module Management (IMPORTANT)

**NEVER manually edit `docs/manifest.yaml` or create/delete module folders.**

Use the provided scripts:

```bash
# Platform Infrastructure Modules (flat structure - no subcategories)
./scripts/add-module.sh platform events        # Adds docs/platform/events/
./scripts/remove-module.sh platform events

# Strategic Containers (categories)
./scripts/add-category.sh analytics "Business Intelligence"
./scripts/remove-category.sh analytics

# Coordination Units (subcategories within strategic containers)
./scripts/add-subcategory.sh strategy copilot "AI strategy conversations"
./scripts/remove-subcategory.sh strategy copilot

# Business Modules (within coordination units)
./scripts/add-module.sh strategy copilot advisor  # Adds docs/strategy/copilot/advisor/
./scripts/remove-module.sh strategy copilot advisor
```

These scripts maintain `docs/manifest.yaml` (single source of truth), manage folder structures, and handle GitHub labels automatically.

## 3. Architecture & Tech Stack

Monorepo managed by **Turborepo 2.6**, following "Decoupled Unity" philosophy.

| Layer | Technology | Role |
|-------|------------|------|
| **Shell** | Astro 5.16 | Container app - routing, auth, layout |
| **Micro-Apps** | React 19.2 | Interactive capabilities loaded as Islands |
| **Backend** | Fastify 5.6 + Prisma 7.0 | Core API deployed on Railway |
| **Data** | PostgreSQL 16.11 | RLS for multi-tenancy |
| **Auth** | Clerk | Organization-scoped authentication |
| **Events** | Redis Streams | Async event transport |

### Key Patterns
1. **Event Backbone:** Services emit events to `system_events`, not direct calls
2. **Multi-Tenancy:** Postgres RLS - every table has `org_id`
3. **Lazy Loading:** React micro-apps loaded on demand by Astro shell
4. **Shared Contract:** Types in `packages/ts-schema`

## 4. Development Commands

```bash
# Setup
pnpm install                           # Install dependencies
docker compose up -d postgres redis    # Start infrastructure
pnpm run db:migrate                    # Apply Prisma migrations

# Development
pnpm run dev                           # Start all services
pnpm run dev --filter apps/shell       # Shell only (port 4321)
pnpm run dev --filter services/core-api # API only (port 3000)

# Quality
pnpm run test                          # Run tests (25+ passing)
pnpm run typecheck                     # TypeScript validation
pnpm run build                         # Build all packages
```

## 5. Coding Standards

- **Strict Isolation:** Services communicate via events, not direct calls
- **Type Safety:** Schema changes require `packages/ts-schema` updates
- **No Magic:** Automated actions logged with human-readable explanations
- **BMAD Workflows:** Use `/bmad:bmm:workflows:*` for development tasks

## 6. Current Status

**Epic 1 - Foundation:**
- orchestration: 1-1 (done), 1-7 (review)
- core-api: 1-2, 1-3, 1-4, 1-6 (all done)
- shell: 1-5 (done)

**Next:** Epic 2 - Strategy & Clarity Engine (Universal Brief, Strategy Co-pilot)

## 7. User Rules

- **NEVER SKIP AHEAD:** Do not perform tasks without explicit request
- **VALIDATION ONLY:** When asked to validate, check existing files only
- **ENTITY CONTEXT:** Always determine which entity type before starting work
- **DOCUMENTATION:** See `docs/index.md` for complete navigation

## 8. Governance Rules

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
- Business Module → Coordination Unit PRD
- Coordination Unit → Strategic Container PRD
- Strategic Container → Constitution
- Infrastructure Module → Constitution

Each level can ADD requirements but NEVER CONTRADICT parent.
