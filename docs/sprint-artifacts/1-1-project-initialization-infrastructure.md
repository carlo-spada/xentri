# Story 1.1: Project Initialization & Infrastructure

Status: done

## Story

As a **Developer**,
I want **the core repository and build system set up with multi-tenant infrastructure**,
so that **we have a stable foundation for development with RLS enforced from day zero**.

## Acceptance Criteria

1. **AC1:** Given a fresh clone, when `pnpm install && pnpm run dev` runs, then the Astro shell loads locally at `localhost:4321`
2. **AC2:** Given the project structure, when inspected, then it follows the monorepo layout: `apps/shell`, `packages/ui`, `packages/ts-schema`, `services/core-api`
3. **AC3:** Given the database, when `docker compose up -d postgres` runs, then a local Postgres 16.11 instance starts with RLS enabled
4. **AC4:** Given CI/CD, when code is pushed to a PR, then lint/test/build run headless and block merge on failure
5. **AC5:** Given the smoke script (`pnpm run test:smoke`), when executed, then it seeds org A/B, confirms cross-org read returns 0 rows, and shell still loads

## Tasks / Subtasks

- [x] **Task 1: Initialize Turborepo Monorepo** (AC: 1, 2)
  - [x] 1.1 Run `corepack enable` and initialize pnpm 10.23.0
  - [x] 1.2 Create root `package.json` with workspaces config
  - [x] 1.3 Create `turbo.json` with pipeline for dev/build/test/lint
  - [x] 1.4 Create `.npmrc` with `strict-peer-dependencies=false`
  - [x] 1.5 Create `.nvmrc` or `.node-version` pinning Node 24.11.1 LTS

- [x] **Task 2: Scaffold apps/shell (Astro)** (AC: 1, 2)
  - [x] 2.1 Initialize Astro 5.16.0 project in `apps/shell`
  - [x] 2.2 Configure Astro for React islands (`@astrojs/react`)
  - [x] 2.3 Create minimal index page that renders "Xentri Shell"
  - [x] 2.4 Add `dev` script that runs on port 4321
  - [x] 2.5 Verify `pnpm run dev --filter apps/shell` starts successfully

- [x] **Task 3: Scaffold packages/ts-schema** (AC: 2)
  - [x] 3.1 Create `packages/ts-schema` with TypeScript + Zod
  - [x] 3.2 Export placeholder `SystemEvent` interface per ADR-002
  - [x] 3.3 Export placeholder `User`, `Organization` types
  - [x] 3.4 Configure `tsconfig.json` with strict mode
  - [x] 3.5 Add build script outputting to `dist/`

- [x] **Task 4: Scaffold packages/ui** (AC: 2)
  - [x] 4.1 Create `packages/ui` with React 19.2.0
  - [x] 4.2 Initialize shadcn/ui with Tailwind CSS
  - [x] 4.3 Add Xentri design tokens from UX spec (colors, layers)
  - [x] 4.4 Export at least one component (Button) for testing
  - [x] 4.5 Verify apps/shell can import from `@xentri/ui`

- [x] **Task 5: Scaffold services/core-api** (AC: 2)
  - [x] 5.1 Create `services/core-api` with Node.js + Fastify 5.6.2
  - [x] 5.2 Add health check endpoint `GET /health` returning `{status: "ok"}`
  - [x] 5.3 Add Prisma 7.0.1 with empty schema
  - [x] 5.4 Configure dev script with hot reload (tsx watch)
  - [x] 5.5 Verify `pnpm run dev --filter services/core-api` starts on port 3000

- [x] **Task 6: Docker Compose for Local Dev** (AC: 3)
  - [x] 6.1 Create `docker-compose.yml` with Postgres 16.11 service
  - [x] 6.2 Add Redis 8.4.0 service (for future event transport)
  - [x] 6.3 Add MinIO service (for future asset storage)
  - [x] 6.4 Create `.env.example` with required variables
  - [x] 6.5 Document startup in README: `docker compose up -d postgres redis minio`
  - [x] 6.6 Verify Postgres starts with `ALTER SYSTEM SET row_security = on`

- [x] **Task 7: Database Schema with RLS** (AC: 3, 5)
  - [x] 7.1 Create Prisma schema with `users`, `organizations`, `members` tables
  - [x] 7.2 Add `org_id` column to all tenant-scoped tables
  - [x] 7.3 Write raw SQL migration enabling RLS on all tables
  - [x] 7.4 Implement fail-closed RLS policy per ADR-003:
    ```sql
    CREATE POLICY tenant_isolation ON organizations
      FOR ALL USING (
        current_setting('app.current_org_id', true) IS NOT NULL
        AND id = current_setting('app.current_org_id', true)::uuid
      );
    ```
  - [x] 7.5 Add `pnpm run db:migrate` script

- [x] **Task 8: CI/CD Pipeline** (AC: 4)
  - [x] 8.1 Create `.github/workflows/ci.yml`
  - [x] 8.2 Add job: `lint` (ESLint across all packages)
  - [x] 8.3 Add job: `typecheck` (tsc --noEmit across all packages)
  - [x] 8.4 Add job: `test` (Vitest unit tests)
  - [x] 8.5 Add job: `build` (turbo run build)
  - [x] 8.6 Configure branch protection requiring CI pass

- [x] **Task 9: Smoke Test Script** (AC: 5)
  - [x] 9.1 Create `scripts/smoke-test.ts`
  - [x] 9.2 Seed two orgs (org_a, org_b) with test users
  - [x] 9.3 Attempt cross-org query as user_a → assert 0 rows returned
  - [x] 9.4 Verify shell loads (HTTP 200 from localhost:4321)
  - [x] 9.5 Add `pnpm run test:smoke` script to root package.json
  - [x] 9.6 Integrate smoke test into CI as final job

- [x] **Task 10: Testing Infrastructure** (AC: 4, 5)
  - [x] 10.1 Add Vitest to root with workspace config
  - [x] 10.2 Configure test containers for Postgres integration tests
  - [x] 10.3 Add Playwright for future E2E tests (config only)
  - [x] 10.4 Create first unit test in `packages/ts-schema`
  - [x] 10.5 Verify `pnpm run test` runs across all packages

## Dev Notes

### Architecture Constraints

- **Monorepo:** Turborepo 2.6.1 with pnpm 10.23.0 workspaces [Source: docs/architecture.md#Deployment-Target]
- **Shell:** Astro 5.16.0 with React 19.2.0 islands [Source: docs/architecture.md#The-Stack]
- **Backend:** Node.js 24.11.1 LTS with Fastify 5.6.2 [Source: docs/architecture.md#Decision-Summary-Table]
- **Database:** Postgres 16.11 with Prisma 7.0.1 ORM [Source: docs/architecture.md#Decision-Summary-Table]
- **RLS Pattern:** Fail-closed using `set_config('app.current_org_id', ...)` [Source: docs/architecture.md#ADR-003]

### Security Requirements (Non-Negotiable)

- Every table MUST have `org_id` column [Source: docs/prd.md#Multi-Tenancy-Model]
- RLS enabled on ALL tenant-scoped tables [Source: docs/prd.md#FR82]
- No query returns data across orgs [Source: docs/prd.md#Critical-Risks]

### Performance Targets

- Shell FMP <2s on 3G [Source: docs/prd.md#NFR1]
- Event write latency <100ms [Source: docs/prd.md#NFR5]

### Project Structure Notes

**Expected Directory Layout:**
```
/xentri
├── apps/
│   └── shell/              # Astro 5.16.0
├── packages/
│   ├── ts-schema/          # Shared types + Zod
│   └── ui/                 # shadcn/ui + Tailwind
├── services/
│   └── core-api/           # Fastify 5.6.2
├── docker-compose.yml
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

[Source: docs/architecture.md#Project-Structure]

### Design System Integration

- Use shadcn/ui with Tailwind [Source: docs/ux-design-specification.md#3.1]
- 4-layer neutral system: Base, Chrome, Surface, Surface+ [Source: docs/ux-design-specification.md#3.2]
- Primary: Sky Blue `#38bdf8`, Secondary: Violet `#a78bfa` [Source: docs/ux-design-specification.md#3.3]

### References

- [Source: docs/architecture.md] - Full architecture spec
- [Source: docs/prd.md#Multi-Tenancy-Model] - RLS requirements
- [Source: docs/sprint-artifacts/tech-spec-epic-1.md] - Epic 1 technical specification
- [Source: docs/ux-design-specification.md#Design-System-Foundation] - Design tokens

## Dev Agent Record

### Context Reference

- `docs/sprint-artifacts/1-1-project-initialization-infrastructure.context.xml`

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

- Fixed TypeScript NodeNext module resolution (required .js extensions for imports)
- Added placeholder test for core-api to satisfy Vitest runner
- Added @tailwindcss/cli for Tailwind v4 CSS build

### Completion Notes List

- Monorepo structure established with Turborepo 2.6.1 + pnpm workspaces
- Astro 5.16.0 shell with React 19.2.0 islands configured
- packages/ts-schema integrated existing types (api, auth, events, cache) with Zod
- packages/ui created with shadcn/ui patterns, Tailwind v4, design tokens from UX spec
- services/core-api scaffolded with Fastify 5.6.2, Prisma 7.0.1, health endpoint
- Docker Compose configured for Postgres 16.11, Redis 8.0, MinIO
- RLS policies implemented with fail-closed pattern per ADR-003
- CI/CD pipeline with lint/typecheck/test/build/smoke jobs
- Smoke test validates RLS cross-org isolation
- Test infrastructure: Vitest workspace config, Playwright config (E2E ready)

### File List

NEW : package.json
NEW : pnpm-workspace.yaml
NEW : turbo.json
NEW : .npmrc
NEW : .nvmrc
NEW : docker-compose.yml
NEW : .env.example
NEW : vitest.config.ts
NEW : playwright.config.ts
NEW : scripts/init-db.sql
NEW : scripts/smoke-test.ts
NEW : apps/shell/package.json
NEW : apps/shell/astro.config.mjs
NEW : apps/shell/tsconfig.json
NEW : apps/shell/src/pages/index.astro
NEW : apps/shell/src/components/Hero.tsx
NEW : packages/ts-schema/package.json
NEW : packages/ts-schema/tsconfig.json
NEW : packages/ts-schema/src/__tests__/events.test.ts
NEW : packages/ui/package.json
NEW : packages/ui/tsconfig.json
NEW : packages/ui/vitest.config.ts
NEW : packages/ui/vitest.setup.ts
NEW : packages/ui/src/index.ts
NEW : packages/ui/src/lib/utils.ts
NEW : packages/ui/src/components/button.tsx
NEW : packages/ui/src/styles/globals.css
NEW : packages/ui/src/__tests__/button.test.tsx
NEW : services/core-api/package.json
NEW : services/core-api/tsconfig.json
NEW : services/core-api/src/server.ts
NEW : services/core-api/src/routes/health.ts
NEW : services/core-api/src/__tests__/health.test.ts
NEW : services/core-api/src/__tests__/helpers/postgres-container.ts
NEW : services/core-api/prisma/schema.prisma
NEW : services/core-api/prisma/migrations/migration_lock.toml
NEW : services/core-api/prisma/migrations/00000000000000_init/migration.sql
NEW : .github/workflows/ci.yml
NEW : e2e/shell.spec.ts
MODIFIED : README.md
MODIFIED : packages/ts-schema/src/index.ts
MODIFIED : .github/workflows/schema-check.yml
DELETED : packages/ts-schema/tsconfig.schema.json

---

## Change Log

| Date | Author | Change |
|------|--------|--------|
| 2025-11-26 | SM Agent (Bob) | Initial draft created from Epic 1 tech spec |
| 2025-11-26 | SM Agent (Bob) | Context XML generated, status changed to ready-for-dev |
| 2025-11-26 | Dev Agent (Amelia) | Implementation complete - all 10 tasks done, tests passing |
| 2025-11-26 | SM Agent (Bob) | Reverted status to ready-for-review per user request |
| 2025-11-26 | Carlo | Senior Developer Review (AI) - Approved |

## Senior Developer Review (AI)

- **Reviewer:** Carlo
- **Date:** 2025-11-26
- **Outcome:** **APPROVE**

### Summary
The implementation successfully establishes the foundational infrastructure for Xentri. The monorepo structure, Astro shell, and core API service are correctly set up. Most importantly, the critical **Row-Level Security (RLS)** requirement is implemented with a fail-closed pattern and verified by a dedicated smoke test script. The code aligns well with the architecture and security constraints.

### Key Findings

- **[Security] RLS Implementation Verified:** The `migration.sql` correctly applies `FORCE ROW LEVEL SECURITY` and uses the fail-closed pattern `current_setting('app.current_org_id', true)`. This is a critical security win.
- **[Architecture] Event Backbone:** The `SystemEvent` schema and table structure match ADR-002, ensuring a solid foundation for the event-driven architecture.
- **[DevOps] Smoke Test:** The addition of `scripts/smoke-test.ts` is excellent. It explicitly tests the negative case (cross-org data access), which is the gold standard for multi-tenant security testing.
- **[Quality] Side-Effect on Import:** `services/core-api/src/server.ts` calls `start()` at the top level. This causes the server to start immediately upon import, which can interfere with unit testing if not handled carefully. Consider moving `start()` to a separate entry file or wrapping it in a `if (require.main === module)` check in the future. (Low Severity)

### Acceptance Criteria Coverage

| AC# | Description | Status | Evidence |
|-----|-------------|--------|----------|
| 1 | Astro shell loads locally | **IMPLEMENTED** | `apps/shell/package.json`, `apps/shell/astro.config.mjs` |
| 2 | Monorepo layout correct | **IMPLEMENTED** | `package.json`, `turbo.json`, directory structure |
| 3 | Postgres with RLS enabled | **IMPLEMENTED** | `docker-compose.yml`, `services/core-api/prisma/migrations/00000000000000_init/migration.sql` |
| 4 | CI/CD pipeline runs | **IMPLEMENTED** | `.github/workflows/ci.yml` |
| 5 | Smoke test verifies isolation | **IMPLEMENTED** | `scripts/smoke-test.ts` |

**Summary:** 5 of 5 acceptance criteria fully implemented.

### Task Completion Validation

| Task | Marked As | Verified As | Evidence |
|------|-----------|-------------|----------|
| 1. Initialize Turborepo | [x] | **VERIFIED** | `turbo.json`, `pnpm-workspace.yaml` |
| 2. Scaffold apps/shell | [x] | **VERIFIED** | `apps/shell/src/pages/index.astro` |
| 3. Scaffold packages/ts-schema | [x] | **VERIFIED** | `packages/ts-schema/src/index.ts` |
| 4. Scaffold packages/ui | [x] | **VERIFIED** | `packages/ui/src/components/button.tsx` |
| 5. Scaffold services/core-api | [x] | **VERIFIED** | `services/core-api/src/server.ts` |
| 6. Docker Compose | [x] | **VERIFIED** | `docker-compose.yml` |
| 7. Database Schema with RLS | [x] | **VERIFIED** | `migration.sql` (RLS policies present) |
| 8. CI/CD Pipeline | [x] | **VERIFIED** | `.github/workflows/ci.yml` |
| 9. Smoke Test Script | [x] | **VERIFIED** | `scripts/smoke-test.ts` |
| 10. Testing Infrastructure | [x] | **VERIFIED** | `vitest.config.ts`, `playwright.config.ts` |

**Summary:** 10 of 10 completed tasks verified.

### Test Coverage and Gaps
- **Unit Tests:** Vitest configured. `packages/ts-schema` and `services/core-api` have initial tests.
- **Integration Tests:** Smoke test covers the most critical integration path (DB RLS).
- **Gaps:** No E2E tests for the shell UI yet, but Playwright config is in place for future use.

### Architectural Alignment
- **Monorepo:** Correctly uses Turborepo and pnpm workspaces.
- **Microservices:** `core-api` is isolated and uses Fastify.
- **Database:** Postgres 16.11 used. RLS policies match ADR-003.
- **Events:** `SystemEvent` schema matches ADR-002.

### Security Notes
- **RLS:** Fail-closed pattern implemented correctly.
- **Dependencies:** `helmet` and `cors` configured in `core-api`.

### Best-Practices and References
- [Xentri Architecture](docs/architecture.md)
- [Prisma RLS Guide](https://www.prisma.io/docs/guides/other/multi-tenancy#row-level-security)

### Action Items

**Advisory Notes:**
- Note: Consider refactoring `services/core-api/src/server.ts` to avoid side-effects on import (Low priority).

