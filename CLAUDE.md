# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Xentri** is a modular Business OS that starts with conversation, not configuration. It uses a **Strategy Co-pilot** to generate a **Universal Brief** (the DNA of a business), which then powers a curated set of tools (Website, CRM, Invoicing) organized into 7 capability categories.

**Status:** Foundation complete (Epic 1 - Story 1.1 done). Infrastructure established with multi-tenant RLS, CI/CD, and 14 tests passing.

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
│   └── shell/                # Astro 5.16.0 Shell with React islands ✓
├── packages/
│   ├── ui/                   # Shared Design System (Tailwind v4, shadcn/ui) ✓
│   ├── ts-schema/            # Shared Types & Zod Schemas (the "Contract") ✓
│   ├── cms-client/           # React CMS UI (planned)
│   ├── crm-client/           # React CRM UI (planned)
│   └── erp-client/           # React ERP UI (planned)
├── services/
│   ├── core-api/             # Fastify 5.6.2 + Prisma 7.0.1, RLS ✓
│   ├── brand-engine/         # Website, CMS (planned)
│   ├── sales-engine/         # CRM, Quotes (planned)
│   ├── finance-engine/       # Invoicing, Payments (planned)
│   ├── ai-service/           # Python Co-pilot Swarm (planned)
│   └── n8n-host/             # Self-hosted workflow automation (planned)
├── scripts/
│   ├── init-db.sql           # Database initialization ✓
│   └── smoke-test.ts         # RLS isolation tests ✓
├── docker-compose.yml        # Postgres 16.11, Redis 8.0, MinIO ✓
├── turbo.json                # Turborepo 2.6.1 config ✓
└── .github/workflows/ci.yml  # CI/CD pipeline ✓
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
pnpm run test                          # Run all unit tests (14 tests)
pnpm run test:smoke                    # Run RLS isolation smoke tests
pnpm run typecheck                     # TypeScript validation

# Build
pnpm run build                         # Build all packages
pnpm run lint                          # Run ESLint
```

## Key Technical Patterns

### Event Backbone
- All events stored in `system_events` table (append-only, immutable)
- Events power: timelines, audit trails, Open Loops/Calm Prompt, cross-module intelligence
- Corrections via compensating events, never edit history
- Outbox pattern: Postgres → Redis Streams for cross-service transport

### Frontend Architecture
- Shell loads instantly (~15kb), sidebar/header persist across navigation
- React SPAs lazy-loaded via `client:only="react"` with hover prefetching
- Cross-app state via Nano Stores, server state via TanStack Query
- Error boundaries prevent "white screen of death"

### AI Co-pilots
- Swarm model: one `ai-service` hosts all co-pilots as configured runtimes
- Stateless: spin up per request with system prompt + tools + model config
- Scaffolding only: AI proposes, user confirms—no auto-publish
- Each category has a specialized co-pilot that unlocks with first module subscription

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

Workflow status tracked in `docs/bmm-workflow-status.yaml`.

## Key Documentation

| Document | Purpose |
|----------|---------|
| `architecture.md` | Technical Constitution - data governance, service boundaries |
| `docs/product-brief-*.md` | Complete product vision, personas, MVP scope |
| `docs/architecture/event-model-v0.1.md` | Event Backbone schema and patterns |
| `docs/bmm-workflow-status.yaml` | Current workflow progress |

## Design Principles

1. **Clarity First** - Universal Brief before tools; AI generates structure, not just content
2. **Calm UX** - One daily view of what matters; no notification flood
3. **Visible, Not Magical** - Every automation logged with explanation
4. **Modular Growth** - Start free, add $5 modules, grow to bundles
5. **Works With Reality** - WhatsApp copy-paste flows, not rigid forms

## Current Phase

**Epic 1 - Foundation (Story 1.1 Complete):**
- Turborepo 2.6.1 monorepo with pnpm workspaces
- Astro 5.16.0 Shell with React 19.2.0 islands
- Core API (Fastify 5.6.2 + Prisma 7.0.1)
- PostgreSQL 16.11 with fail-closed RLS policies
- CI/CD pipeline with GitHub branch protection
- 14 tests passing (ts-schema: 3, ui: 10, core-api: 1)

**Next:** Story 1.3 (User Authentication with Clerk) — Story 1.2 (Event Backbone) in review
