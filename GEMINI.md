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

### Module Context Selection

At session start, determine which module you're working on:

```
Categories:
1. platform (orchestration, shell, core-api, ts-schema, ui)
2. strategy (future)
3. brand (future)
4. sales, finance, operations, team, legal (future)
```

Store selection and resolve paths to: `docs/{category}/{module}/`

### Documentation Structure

```
docs/
├── index.md                    # Navigation hub
├── manifest.yaml               # Machine-readable module registry
├── platform/                   # Core infrastructure (active)
│   ├── orchestration/          # System-wide "big picture"
│   │   ├── architecture.md
│   │   ├── prd.md
│   │   ├── epics.md
│   │   └── sprint-artifacts/
│   ├── shell/                  # apps/shell
│   ├── core-api/               # services/core-api
│   ├── ts-schema/              # packages/ts-schema
│   └── ui/                     # packages/ui
├── strategy/                   # Future
├── brand/                      # Future
└── ...                         # Other categories
```

Each module is a **full BMAD project** with its own:
- README.md, prd.md, architecture.md, epics.md
- sprint-artifacts/ folder with stories and status

### Module Management (IMPORTANT)

**NEVER manually edit `docs/manifest.yaml` or create/delete module folders.**

Use the provided scripts to manage modules and categories:

```bash
# Add/remove modules
./scripts/add-module.sh <category> <module>      # e.g., strategy copilot
./scripts/remove-module.sh <category> <module>

# Add/remove categories (rare)
./scripts/add-category.sh <category> "<purpose>"
./scripts/remove-category.sh <category>          # Must be empty first
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
- **MODULE CONTEXT:** Always determine which module before starting work
- **DOCUMENTATION:** See `docs/index.md` for complete navigation
