# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Xentri** is a modular Business OS that starts with conversation, not configuration. It uses a **Strategy Co-pilot** to generate a **Universal Brief** (the DNA of a business), which then powers a curated set of tools (Website, CRM, Invoicing) organized into 7 capability categories.

**Status:** Epic 1 Foundation complete (Story 1.7 in review). Live API deployed on Railway.

**Live API:** https://core-api-production-8016.up.railway.app

## Documentation Navigation

Documentation follows a **hierarchical structure** organized by category and module.

### First: Determine Your Module Context

When starting a session, ask the user which module they're working on:

```
Categories:
1. platform (orchestration, shell, core-api, ts-schema, ui)
2. strategy (future)
3. brand (future)
4. sales (future)
5. finance (future)
6. operations (future)
7. team (future)
8. legal (future)
```

Store the selection as `{current_category}/{current_module}` and resolve all doc paths accordingly.

### Documentation Structure

```
docs/
├── index.md                    # Navigation hub
├── manifest.yaml               # Machine-readable module registry
├── platform/                   # Core infrastructure
│   ├── orchestration/          # System-wide "big picture"
│   ├── shell/                  # apps/shell
│   ├── core-api/               # services/core-api
│   ├── ts-schema/              # packages/ts-schema
│   └── ui/                     # packages/ui
├── strategy/                   # Strategy & Clarity Engine (planned)
├── brand/                      # Brand & Marketing (planned)
└── ...                         # Other categories
```

### Key Documentation

| Document | Location |
|----------|----------|
| Documentation Hub | `docs/index.md` |
| Module Manifest | `docs/manifest.yaml` |
| System Architecture | `docs/platform/orchestration/architecture.md` |
| Product Requirements | `docs/platform/orchestration/prd.md` |
| Deployment Guide | `docs/platform/orchestration/deployment-plan.md` |
| Incident Response | `docs/platform/orchestration/incident-response.md` |

## Architecture Philosophy: "Decoupled Unity"

The user sees one calm workspace; under the hood, each capability is an isolated module:

| Layer | Technology | Role |
|-------|------------|------|
| **Shell** | Astro | Stable container (header + sidebar), handles routing and auth |
| **Micro-Apps** | React Islands | Interactive SPAs lazy-loaded into the Shell |
| **Backend** | Node.js (Docker) | Microservices per domain (core-api, sales-engine, finance-engine) |
| **AI Service** | Python | Co-pilot Swarm host (Strategy, Brand, Sales, Finance agents) |
| **Data** | Postgres | Single cluster, schema-per-service, RLS for multi-tenancy |
| **Events** | Redis Streams → n8n | "Nervous System" for async event transport and workflow orchestration |

**Non-negotiables:**
- Multi-tenant from day zero: every table has `org_id` with Row-Level Security
- Event-first: all business actions write to `system_events` before domain tables
- Visible automation: every automated action logged with human-readable explanation
- Services communicate via events, not direct calls

## Repository Structure (Turborepo Monorepo)

```
/xentri
├── apps/
│   └── shell/                # Astro 5.16.0 Shell with React islands
├── packages/
│   ├── ui/                   # Shared Design System (Tailwind v4, shadcn/ui)
│   └── ts-schema/            # Shared Types & Zod Schemas (the "Contract")
├── services/
│   └── core-api/             # Fastify 5.6.2 + Prisma 7.0.1, RLS
├── docs/                     # Hierarchical documentation (see above)
├── .bmad/                    # BMAD framework
└── .claude/commands/         # Slash commands (/bmad:*)
```

## Development Commands

```bash
# Setup
pnpm install                           # Install all workspace dependencies
docker compose up -d postgres redis    # Start Postgres 16.11 + Redis 8.0
pnpm run db:migrate                    # Apply Prisma migrations with RLS

# Development
pnpm run dev                           # Start all services (Astro + Core API)
pnpm run dev --filter apps/shell       # Start shell only (port 4321)
pnpm run dev --filter services/core-api # Start API only (port 3000)

# Testing
pnpm run test                          # Run all unit tests
pnpm run test -- --coverage            # Run tests with coverage report
pnpm run typecheck                     # TypeScript validation

# Build & Quality
pnpm run build                         # Build all packages
pnpm run lint                          # Run ESLint

# Health Checks
curl http://localhost:3000/health       # API liveness
curl http://localhost:3000/health/ready # API readiness with DB check
```

## BMAD Framework

This project uses BMAD for AI-assisted development workflows:

| Directory | Purpose |
|-----------|---------|
| `.bmad/bmm/` | BMad Method - product development workflows |
| `.bmad/bmb/` | BMad Builder - agent/workflow creation tools |
| `.bmad/cis/` | Creative & Innovation Suite |
| `.bmad/core/` | Core utilities and brainstorming |
| `.claude/commands/` | Slash commands available via `/bmad:*` |

Key workflows:
- `/bmad:bmm:workflows:prd` - Create PRD from Product Brief
- `/bmad:bmm:workflows:architecture` - Technical architecture decisions
- `/bmad:bmm:workflows:create-story` - Create user stories
- `/bmad:bmm:workflows:dev-story` - Implement stories

## Design Principles

1. **Clarity First** - Universal Brief before tools; AI generates structure, not just content
2. **Calm UX** - One daily view of what matters; no notification flood
3. **Visible, Not Magical** - Every automation logged with explanation
4. **Modular Growth** - Start free, add modules, grow to bundles
5. **Works With Reality** - WhatsApp copy-paste flows, not rigid forms

## Current Phase

**Epic 1 - Foundation (Complete, Story 1.7 in Review):**
- ✅ Story 1.1: Project initialization & infrastructure (orchestration)
- ✅ Story 1.2: Event backbone & database schema (core-api)
- ✅ Story 1.3: User authentication (core-api)
- ✅ Story 1.4: Organization creation & provisioning (core-api)
- ✅ Story 1.5: Application shell & navigation (shell)
- ✅ Story 1.6: Thin vertical slice (core-api)
- 🔄 Story 1.7: DevOps, observability, test readiness (orchestration)

**Next:** Epic 2 - Strategy & Clarity Engine (Universal Brief, Strategy Co-pilot)
