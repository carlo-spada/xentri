# Xentri

> The Operating System for modern businesses.

**Xentri** is a modular **Business OS** that starts with a conversation, not a configuration screen. It unifies Strategy, Marketing, Sales, Finance, and Operations into a single, calm workspace.

It solves "tab fatigue" and "setup paralysis" by using a **Strategy Co-pilot** to generate a **Universal Soul**—the living DNA of your business—which then powers a curated set of tools (Website, CRM, Invoicing) that grow with you.

**Status:** Epic 1 Foundation complete (Story 1.7 in review). Live API deployed on Railway.

**Live API:** https://core-api-production-8016.up.railway.app

**What's Working:**
- Turborepo 2.6.1 monorepo with pnpm workspaces
- Astro 5.16.0 Shell with React 19.2.0 islands
- Core API (Fastify 5.6.2 + Prisma 7.0.1) - deployed on Railway
- PostgreSQL 16.11 with fail-closed RLS policies
- CI/CD pipeline (GitHub Actions)
- Clerk authentication with org-scoped access
- Structured logging (Pino) with trace correlation
- Sentry error tracking integration
- Test infrastructure (Vitest + Playwright)
- 25+ tests passing with coverage thresholds

---

## Quick Start

**Prerequisites:** Docker, Node.js 24+, pnpm 10+

```bash
# 1. Clone the repository
git clone https://github.com/carlo-spada/xentri.git
cd xentri

# 2. Configure Environment
cp .env.example .env

# 3. Install Dependencies (Turborepo + pnpm workspaces)
pnpm install

# 4. Start Infrastructure (Postgres, Redis, MinIO)
docker compose up -d postgres redis minio

# 5. Start Development Servers
pnpm run dev
```

> **Note:** The Astro Shell launches at `http://localhost:4321`. The Core API runs at `http://localhost:3000`.

---

## Technology Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | Astro (Shell) + React (Micro-Apps) + Vite |
| **Backend** | Dockerized Microservices (Node.js, Python) |
| **Data** | Postgres (Multi-tenant via RLS), Redis (Event Bus) |
| **Automation** | n8n (Workflow Orchestration) |
| **Repo** | Turborepo (Monorepo management) |

---

## Documentation

This project is architected to scale from 1 to 1,000,000 users without a rewrite.

- **[Documentation Index](./docs/index.md)** - Complete documentation navigation
- **[Technical Architecture](./docs/platform/orchestration/architecture.md)** - System design, data governance, service boundaries
- **[Deployment Guide](./docs/platform/orchestration/deployment-plan.md)** - Railway deployment instructions
- **[Incident Response](./docs/platform/orchestration/incident-response.md)** - Troubleshooting and runbooks
- **[Product Soul](./docs/platform/product-soul.md)** - Vision, personas, MVP scope

---

## Roadmap

| Phase | Tier | Focus |
|-------|------|-------|
| **v0.1** | Free | **Strategy Co-pilot + Universal Soul**. The entry point that generates business clarity. |
| **v0.2** | Presencia ($10) | **Marketing**. Website Builder, CMS, and Lead Capture auto-configured from the Soul. |
| **v0.3** | Light Ops ($30) | **Sales & Pipeline**. CRM, Quotes, and Follow-ups. |
| **v0.4** | Business in Motion ($90) | **Finance & Accounting**. Invoicing, Payments, and the "Open Loops" view. |

---

## License

*TBD*
