# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Xentri** is a modular Business OS that starts with conversation, not configuration. It uses a **Strategy Co-pilot** to generate a **Universal Brief** (the DNA of a business), which then powers a curated set of tools (Website, CRM, Invoicing) organized into 7 capability categories.

**Status:** Epic 1 Foundation complete (Story 1.7 in review). Live API deployed on Railway.

**Live API:** https://core-api-production-8016.up.railway.app

## Documentation Navigation

Documentation follows a **hierarchical structure** organized by category and module.

### First: Determine Your Module Context

When starting a session, ask the user which area they're working on:

```
Categories → Sub-categories:
1. platform (meta)
   - orchestration (cross-cutting, big picture)
   - infrastructure (events, auth, billing, brief)
   - frontend (shell, ui)
   - backend (core-api)
   - shared (ts-schema)
2. strategy (future)
3. marketing (future) — formerly "brand"
4. sales (future)
5. finance (future)
6. operations (future)
7. team (future)
8. legal (future)
```

Store the selection as `{category}/{subcategory}/{module}` and resolve all doc paths accordingly.

### Documentation Structure

```
docs/
├── index.md                    # Navigation hub
├── manifest.yaml               # Machine-readable module registry (v2.0)
├── platform/                   # META CATEGORY: Core infrastructure
│   ├── orchestration/          # Sub-category: Cross-cutting, big picture
│   ├── infrastructure/         # Sub-category: Events, auth, billing, brief
│   ├── frontend/               # Sub-category: User interface layer
│   │   ├── shell/              # Module: Astro container (apps/shell)
│   │   └── ui/                 # Module: Component library (packages/ui)
│   ├── backend/                # Sub-category: API and services
│   │   └── core-api/           # Module: Primary API (services/core-api)
│   └── shared/                 # Sub-category: Cross-module contracts
│       └── ts-schema/          # Module: Types & schemas (packages/ts-schema)
├── strategy/                   # Strategy & Clarity Engine (planned)
├── marketing/                  # Brand & Marketing (planned) — renamed from "brand"
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

### Module Management (IMPORTANT)

**NEVER manually edit `docs/manifest.yaml` or create/delete module folders.**

Use the provided scripts to manage the hierarchy:

```bash
# Add a new module (within a sub-category)
./scripts/add-module.sh <category> <subcategory> <module-name>
./scripts/add-module.sh platform infrastructure events

# Add a new sub-category
./scripts/add-subcategory.sh <category> <subcategory> "<purpose>"
./scripts/add-subcategory.sh strategy copilot "AI strategy conversations"

# Add a new category (rare)
./scripts/add-category.sh <category> "<purpose>"
./scripts/add-category.sh analytics "Business Intelligence"

# Remove operations (use corresponding remove scripts)
./scripts/remove-module.sh <category> <subcategory> <module-name>
./scripts/remove-subcategory.sh <category> <subcategory>
./scripts/remove-category.sh <category>
```

These scripts update `docs/manifest.yaml` (the single source of truth), create/delete folder structures, and manage GitHub labels. All BMM agents read from the manifest dynamically.

## Architecture Philosophy: "Decoupled Unity"

The user sees one calm workspace; under the hood, each capability is an isolated module:

| Layer | Technology | Role |
|-------|------------|------|
| **Shell** | Astro | Stable container (header + sidebar), handles routing and auth |
| **Micro-Apps** | React Islands | Interactive SPAs lazy-loaded into the Shell |
| **Backend** | Node.js (Docker) | Microservices per domain (core-api, sales-engine, finance-engine) |
| **AI Service** | Python | Co-pilot Swarm host (Strategy, Marketing, Sales, Finance agents) |
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

## Governance Rules

### Orchestration Document Changes

**Any change to orchestration-level documents requires explicit flagging and rationale.**

Protected documents (in `docs/platform/orchestration/`):
- `prd.md` — Product Requirements
- `architecture.md` — System Architecture (includes Module Roadmap)
- `epics.md` — Implementation Roadmap
- `product-brief.md` — Product Vision

When modifying these files:
1. **Flag the change** in your response to the user
2. **Provide rationale** explaining why the change is necessary
3. **Include rationale in commit message** when committing

Example commit message:
```
docs(orchestration): Update architecture with caching strategy

Rationale: New caching layer needed for performance targets.
See ADR-006 for full decision record.
```

This governance ensures architectural decisions are traceable and intentional.
