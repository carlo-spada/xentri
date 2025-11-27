# Repository Guidelines (Codex)

## Project Status

**Xentri** - A modular Business OS that starts with conversation, not configuration.

**Current Phase:** Epic 1 Foundation complete (Story 1.7 in review)
**Live API:** https://core-api-production-8016.up.railway.app

## Documentation Navigation

Documentation is organized by **category** and **module**. Always determine which module you're working on first.

**Manifest:** `docs/manifest.yaml` — Machine-readable module registry

### Module Context Prompt

At session start, ask: "Which module are you working on?"

```
Categories:
1. platform (orchestration, shell, core-api, ts-schema, ui)
2. strategy, brand, sales, finance, operations, team, legal (future)
```

All paths resolve to: `docs/{category}/{module}/`

### Structure

```
docs/
├── index.md                    # Navigation hub
├── manifest.yaml               # Module registry
├── platform/
│   ├── orchestration/          # System-wide architecture (big picture)
│   ├── shell/                  # apps/shell docs
│   ├── core-api/               # services/core-api docs
│   ├── ts-schema/              # packages/ts-schema docs
│   └── ui/                     # packages/ui docs
└── {other-categories}/         # Future modules
```

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
