# Repository Guidelines (Codex)

## Project Status

**Xentri** - A modular Business OS that starts with conversation, not configuration.

**Current Phase:** Epic 1 Foundation complete (Story 1.7 in review)
**Live API:** https://core-api-production-8016.up.railway.app

## Project Structure

```
/xentri
├── apps/
│   └── shell/                # Astro 5.16 Shell with React islands
├── packages/
│   ├── ui/                   # Shared Design System (Tailwind v4, shadcn/ui)
│   └── ts-schema/            # Shared Types & Zod Schemas
├── services/
│   └── core-api/             # Fastify 5.6 + Prisma 7.0, deployed on Railway
├── docs/                     # All documentation (see docs/index.md)
├── .bmad/                    # BMAD framework (agents, workflows)
└── .claude/commands/         # Slash commands for Claude Code
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
- Follow event contracts from `docs/architecture/event-model-v0.1.md`

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

- `docs/index.md` - Documentation hub
- `docs/architecture.md` - Technical decisions
- `docs/deployment-plan.md` - Railway deployment
- `docs/incident-response.md` - Troubleshooting
