# Deployment State and Fix Plan (2025-11-27)

## Current Condition
- Monorepo with Astro shell + core-api only; deployments on Railway repeatedly failing.
- Failures observed:
  - Missing Prisma client (`Cannot find module '.prisma/client/default'`) in core-api runtime.
  - Missing runtime deps (`fastify` not found) due to incomplete install/prune in images.
  - pnpm script approvals skipped (ignored build scripts warning).
  - Attempted workspace-wide deploys with filters/prune caused cascading module resolution issues.
- Docker builds were using full repo context and pnpm filters; prune/ignored scripts stripped needed artifacts.

## Likely Causes
- Deploying without per-service isolation; copying whole workspace into image and filtering installs led to missing deps.
- Pruning/production-only installs removed dev tools needed for Prisma generate.
- pnpm “ignored build scripts” blocked Prisma engines when using script approval defaults.
- Missing shared package build (`@xentri/ts-schema`) in image build stage.

## Consensus Fix (Agents)
- Winston (Architect): Per-service Dockerfiles with minimal context and explicit dependency resolution; avoid workspace magic.
- Murat (Test Architect): Add deterministic build + health checks per image before deploy.
- Amelia (Developer): Install/build scoped deps, build shared package, generate Prisma, build service; copy dist + node_modules.
- PM/Analyst: Standardize process and document; measure success by isolated image builds/health.
- Tech Writer: Document per-service Docker template, env vars, build/run commands, Railway steps.

## Proposed Path Forward
1. Use per-service Dockerfiles:
   - Copy root manifests + required shared packages + service source.
   - `pnpm install --filter <shared> --filter <service> --frozen-lockfile` (full deps so Prisma can run).
   - Build shared package(s).
   - Generate Prisma client in service.
   - Build service.
   - Runner stage copies only service `dist`, `node_modules`, `package.json`.
2. Shell Dockerfile remains service-scoped; ensure it only installs/builds shell deps.
3. CI: `docker build` per service + containerized health check before Railway deploy.
4. Railway: deploy per service (no workspace prune), using service Dockerfile; pass required envs.

## Next Actions
- Update core-api Dockerfile to scoped install/build and redeploy.
- Verify deploy by tailing logs and curling health from Railway shell.
- Apply same pattern to other services as they are added; keep docs updated.
