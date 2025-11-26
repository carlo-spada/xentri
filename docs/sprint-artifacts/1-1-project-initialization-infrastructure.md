# Story 1.1: Project Initialization & Infrastructure

Status: ready-for-dev

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

- [ ] **Task 1: Initialize Turborepo Monorepo** (AC: 1, 2)
  - [ ] 1.1 Run `corepack enable` and initialize pnpm 10.23.0
  - [ ] 1.2 Create root `package.json` with workspaces config
  - [ ] 1.3 Create `turbo.json` with pipeline for dev/build/test/lint
  - [ ] 1.4 Create `.npmrc` with `strict-peer-dependencies=false`
  - [ ] 1.5 Create `.nvmrc` or `.node-version` pinning Node 24.11.1 LTS

- [ ] **Task 2: Scaffold apps/shell (Astro)** (AC: 1, 2)
  - [ ] 2.1 Initialize Astro 5.16.0 project in `apps/shell`
  - [ ] 2.2 Configure Astro for React islands (`@astrojs/react`)
  - [ ] 2.3 Create minimal index page that renders "Xentri Shell"
  - [ ] 2.4 Add `dev` script that runs on port 4321
  - [ ] 2.5 Verify `pnpm run dev --filter apps/shell` starts successfully

- [ ] **Task 3: Scaffold packages/ts-schema** (AC: 2)
  - [ ] 3.1 Create `packages/ts-schema` with TypeScript + Zod
  - [ ] 3.2 Export placeholder `SystemEvent` interface per ADR-002
  - [ ] 3.3 Export placeholder `User`, `Organization` types
  - [ ] 3.4 Configure `tsconfig.json` with strict mode
  - [ ] 3.5 Add build script outputting to `dist/`

- [ ] **Task 4: Scaffold packages/ui** (AC: 2)
  - [ ] 4.1 Create `packages/ui` with React 19.2.0
  - [ ] 4.2 Initialize shadcn/ui with Tailwind CSS
  - [ ] 4.3 Add Xentri design tokens from UX spec (colors, layers)
  - [ ] 4.4 Export at least one component (Button) for testing
  - [ ] 4.5 Verify apps/shell can import from `@xentri/ui`

- [ ] **Task 5: Scaffold services/core-api** (AC: 2)
  - [ ] 5.1 Create `services/core-api` with Node.js + Fastify 5.6.2
  - [ ] 5.2 Add health check endpoint `GET /health` returning `{status: "ok"}`
  - [ ] 5.3 Add Prisma 7.0.1 with empty schema
  - [ ] 5.4 Configure dev script with hot reload (tsx watch)
  - [ ] 5.5 Verify `pnpm run dev --filter services/core-api` starts on port 3000

- [ ] **Task 6: Docker Compose for Local Dev** (AC: 3)
  - [ ] 6.1 Create `docker-compose.yml` with Postgres 16.11 service
  - [ ] 6.2 Add Redis 8.4.0 service (for future event transport)
  - [ ] 6.3 Add MinIO service (for future asset storage)
  - [ ] 6.4 Create `.env.example` with required variables
  - [ ] 6.5 Document startup in README: `docker compose up -d postgres redis minio`
  - [ ] 6.6 Verify Postgres starts with `ALTER SYSTEM SET row_security = on`

- [ ] **Task 7: Database Schema with RLS** (AC: 3, 5)
  - [ ] 7.1 Create Prisma schema with `users`, `organizations`, `members` tables
  - [ ] 7.2 Add `org_id` column to all tenant-scoped tables
  - [ ] 7.3 Write raw SQL migration enabling RLS on all tables
  - [ ] 7.4 Implement fail-closed RLS policy per ADR-003:
    ```sql
    CREATE POLICY tenant_isolation ON organizations
      FOR ALL USING (
        current_setting('app.current_org_id', true) IS NOT NULL
        AND id = current_setting('app.current_org_id', true)::uuid
      );
    ```
  - [ ] 7.5 Add `pnpm run db:migrate` script

- [ ] **Task 8: CI/CD Pipeline** (AC: 4)
  - [ ] 8.1 Create `.github/workflows/ci.yml`
  - [ ] 8.2 Add job: `lint` (ESLint across all packages)
  - [ ] 8.3 Add job: `typecheck` (tsc --noEmit across all packages)
  - [ ] 8.4 Add job: `test` (Vitest unit tests)
  - [ ] 8.5 Add job: `build` (turbo run build)
  - [ ] 8.6 Configure branch protection requiring CI pass

- [ ] **Task 9: Smoke Test Script** (AC: 5)
  - [ ] 9.1 Create `scripts/smoke-test.ts`
  - [ ] 9.2 Seed two orgs (org_a, org_b) with test users
  - [ ] 9.3 Attempt cross-org query as user_a → assert 0 rows returned
  - [ ] 9.4 Verify shell loads (HTTP 200 from localhost:4321)
  - [ ] 9.5 Add `pnpm run test:smoke` script to root package.json
  - [ ] 9.6 Integrate smoke test into CI as final job

- [ ] **Task 10: Testing Infrastructure** (AC: 4, 5)
  - [ ] 10.1 Add Vitest to root with workspace config
  - [ ] 10.2 Configure test containers for Postgres integration tests
  - [ ] 10.3 Add Playwright for future E2E tests (config only)
  - [ ] 10.4 Create first unit test in `packages/ts-schema`
  - [ ] 10.5 Verify `pnpm run test` runs across all packages

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

<!-- To be filled by dev agent -->

### Debug Log References

<!-- To be filled during implementation -->

### Completion Notes List

<!-- To be filled after implementation -->

### File List

<!-- To be filled after implementation -->
<!-- Format: NEW | MODIFIED | DELETED : path/to/file -->

---

## Change Log

| Date | Author | Change |
|------|--------|--------|
| 2025-11-26 | SM Agent (Bob) | Initial draft created from Epic 1 tech spec |
| 2025-11-26 | SM Agent (Bob) | Context XML generated, status changed to ready-for-dev |
