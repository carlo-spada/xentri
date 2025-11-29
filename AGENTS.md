# Repository Guidelines (Codex)

## Project Status

**Xentri** - A modular Business OS that starts with conversation, not configuration.

**Current Phase:** Epic 1 Foundation complete (Story 1.7 in review)
**Live API:** https://core-api-production-8016.up.railway.app

## Documentation Navigation

Documentation is organized by **category** and **module**. Always determine which module you're working on first.

**Manifest:** `docs/manifest.yaml` — Machine-readable module registry

### Module Context Prompt

At session start, ask: "Which area are you working on?"

```
Categories → Sub-categories:
1. platform (meta)
   - orchestration (cross-cutting, big picture)
   - infrastructure (events, auth, billing, brief) - planned
   - frontend (shell, ui)
   - backend (core-api)
   - shared (ts-schema)
2. strategy (future)
3. marketing (future) — formerly "brand"
4. sales, finance, operations, team, legal (future)
```

All paths resolve to: `docs/{category}/{subcategory}/{module}/`

### Structure

```
docs/
├── index.md                    # Navigation hub
├── manifest.yaml               # Module registry v2.0 (SINGLE SOURCE OF TRUTH)
├── platform/                   # META CATEGORY: Core infrastructure
│   ├── orchestration/          # Sub-category: Cross-cutting, big picture
│   ├── infrastructure/         # Sub-category: Events, auth, billing (planned)
│   ├── frontend/               # Sub-category: User interface layer
│   │   ├── shell/              # Module: apps/shell
│   │   └── ui/                 # Module: packages/ui
│   ├── backend/                # Sub-category: API and services
│   │   └── core-api/           # Module: services/core-api
│   └── shared/                 # Sub-category: Cross-module contracts
│       └── ts-schema/          # Module: packages/ts-schema
├── marketing/                  # Future (renamed from "brand")
└── {other-categories}/         # Future
```

### Module Management (IMPORTANT)

**NEVER manually edit `docs/manifest.yaml` or create/delete module folders.**

Use the provided scripts:

```bash
# Modules (within sub-categories)
./scripts/add-module.sh <category> <subcategory> <module>
./scripts/remove-module.sh <category> <subcategory> <module>

# Sub-categories
./scripts/add-subcategory.sh <category> <subcategory> "<purpose>" [--meta]
./scripts/remove-subcategory.sh <category> <subcategory>

# Categories (rare)
./scripts/add-category.sh <category> "<purpose>"
./scripts/remove-category.sh <category>
```

These scripts maintain `docs/manifest.yaml` as the single source of truth.

## Build & Development Commands

```bash
pnpm install                           # Install dependencies
docker compose up -d postgres redis    # Start infrastructure
pnpm run db:migrate                    # Apply Prisma migrations

pnpm run dev                           # Start all services
pnpm run test                          # Run tests
pnpm run typecheck                     # TypeScript validation
pnpm run build                         # Build all packages
```

## Coding Conventions

- **TypeScript** across all packages; shared types in `packages/ts-schema`
- **2-space indentation**, trailing commas, named exports (no defaults in shared packages)
- **Event-first**: All business actions write to `system_events` before domain tables
- **Multi-tenant**: Every table has `org_id` with Row-Level Security
- Follow event contracts from `docs/platform/orchestration/architecture/event-model-v0.1.md`

## Testing

- Tests alongside code (`*.test.ts` or `__tests__/`)
- Vitest for unit tests, Playwright for E2E
- 25+ tests passing with coverage thresholds
- Run `pnpm run test` before PRs

## Commits & PRs

- Concise imperative messages ("Add...", "Fix...", "Update...")
- Include: summary, linked issue, testing performed
- Call out `ts-schema` changes explicitly

## Key Documentation

| Document | Location |
|----------|----------|
| Hub | `docs/index.md` |
| Manifest | `docs/manifest.yaml` |
| Architecture | `docs/platform/orchestration/architecture.md` |
| Deployment | `docs/platform/orchestration/deployment-plan.md` |
| Incidents | `docs/platform/orchestration/incident-response.md` |

## Governance Rules

### Orchestration Document Changes

**Any change to orchestration-level documents requires explicit flagging and rationale.**

Protected documents (in `docs/platform/orchestration/`):
- `prd.md`, `architecture.md` (includes Module Roadmap), `epics.md`, `product-brief.md`

When modifying these files:
1. Flag the change in your response
2. Provide rationale explaining why
3. Include rationale in commit message
