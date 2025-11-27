# Repository Guidelines

## Project Structure & Module Organization
- Current footprint is documentation-first (`architecture.md`, `docs/architecture`, `docs/product`). Treat these as the source of truth for architecture and product intent.
- Planned monorepo (see `architecture.md`): `apps/` (Astro shell + React micro-apps), `packages/` (shared UI, `ts-schema` contracts), `services/` (Dockerized backends), `tooling/` (shared configs). Mirror this layout when adding code.
- Keep new assets and specs co-located with their module (e.g., `services/core-api/docs`, `packages/ts-schema/README.md`).
- **BMAD Files**: Remember that all BMAD files are located in the `.bmad` folder.

## Build, Test, and Development Commands
- `npm install` — install workspace dependencies (Turborepo layout anticipated).
- `docker-compose up -d` — start Postgres, Redis, n8n, and backend services locally.
- `npm run dev` — run the Astro shell + React watch mode.
- When services/packages exist, prefer module-scoped scripts (e.g., `npm run dev --workspace apps/shell`).

## Coding Style & Naming Conventions
- Prefer TypeScript across frontend/backends; keep interfaces/types in `packages/ts-schema` and update on schema changes.
- 2-space indentation, trailing commas where language allows, and descriptive, domain-oriented naming (e.g., `emitEvent`, `LoopService`).
- Use named exports for shared utilities; avoid default exports in shared packages.
- Follow event model contracts from `docs/architecture/event-model-v0.1.md` for any event payloads.

## Testing Guidelines
- Target: add tests alongside code (`__tests__/` or `*.test.ts` next to source) per module. No test harness exists yet—adopt the framework natural to the stack (Vitest/Playwright for frontend, Jest/TS-Jest for Node services).
- Name tests after behavior, not implementation (e.g., `events.spec.ts` covering append-only invariants).
- Run the full test suite before PRs (`npm test` once introduced); block merges on red.

## Commit & Pull Request Guidelines
- Commit messages: concise imperative (see history: “Add…”, “Align…”, “Update…”). Group related doc/code changes together.
- PRs should include: summary of changes, linked issue/story, testing performed, and any schema/contract updates (call out `ts-schema` changes explicitly).
- Add screenshots or sample payloads when touching UI or APIs. For migrations/events, include the migration file path and a brief rollback note.

## Architecture Overview (Essentials)
- The system is “Decoupled Unity”: Astro shell hosts lazy-loaded React micro-apps; backend services communicate through APIs and an event backbone (Postgres log → outbox to Redis Streams → n8n for orchestration).
- Every table/event must be org-scoped; emit events instead of mutating history. Keep modules isolated and talk through contracts, not ad-hoc calls.
