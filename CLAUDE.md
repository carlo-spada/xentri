# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Xentri** is a modular Business OS that starts with conversation, not configuration. It uses a **Strategy Co-pilot** to generate a **Universal Brief** (the DNA of a business), which then powers a curated set of tools (Website, CRM, Invoicing) organized into 7 capability categories.

**Status:** Epic 1 Foundation complete (Story 1.7 in review). Live API deployed on Railway.

**Live API:** https://core-api-production-8016.up.railway.app

## Documentation Navigation

Documentation follows a **Five Entity Types** model (not levels):

| Entity Type | Location | Contains | Example |
|-------------|----------|----------|---------|
| **Constitution** | `docs/platform/` | PR-xxx, IC-xxx, system-wide rules | `docs/platform/prd.md` |
| **Infrastructure Module** | `docs/platform/{module}/` | Exposed/consumed interfaces | `docs/platform/core-api/prd.md` |
| **Strategic Container** | `docs/{category}/` | Strategic alignment, child coordination | `docs/strategy/prd.md` |
| **Coordination Unit** | `docs/{category}/{subcat}/` | Subcategory scope, module orchestration | `docs/strategy/pulse/prd.md` |
| **Business Module** | `docs/{cat}/{subcat}/{mod}/` | Feature FRs, implementation | `docs/strategy/pulse/god-view/prd.md` |

### First: Determine Your Entity Type

When starting a session, ask the user which area they're working on:

```
Entity Type Detection (by path pattern):
  docs/platform/*.md              → Constitution
  docs/platform/{module}/         → Infrastructure Module
  docs/{category}/                → Strategic Container
  docs/{category}/{subcat}/       → Coordination Unit
  docs/{cat}/{subcat}/{module}/   → Business Module

Infrastructure Modules (platform):
  - shell, ui, core-api, ts-schema, orchestration (active)
  - events, auth, billing, brief (planned)

Strategic Containers (user-facing categories):
  - strategy, marketing, sales, finance, operations, team, legal
```

Store the selection as `{entity_type}/{path}` and resolve all doc paths accordingly.

### Documentation Structure

```
docs/
├── index.md                    # Navigation hub
├── manifest.yaml               # Machine-readable registry (v4.0)
│
├── platform/                   # META CONTAINER (Constitution + Infrastructure)
│   ├── prd.md                  # CONSTITUTION: System PRD (PR-xxx, IC-xxx)
│   ├── architecture.md         # CONSTITUTION: System Architecture
│   ├── ux-design.md            # CONSTITUTION: System UX Principles
│   ├── epics.md                # CONSTITUTION: Cross-cutting Epics
│   ├── product-brief.md        # CONSTITUTION: Foundational Vision
│   │
│   ├── shell/                  # INFRASTRUCTURE MODULE (apps/shell)
│   ├── ui/                     # INFRASTRUCTURE MODULE (packages/ui)
│   ├── core-api/               # INFRASTRUCTURE MODULE (services/core-api)
│   ├── ts-schema/              # INFRASTRUCTURE MODULE (packages/ts-schema)
│   └── orchestration/          # INFRASTRUCTURE MODULE (cross-cutting)
│
├── strategy/                   # STRATEGIC CONTAINER (planned)
│   └── pulse/                  # COORDINATION UNIT
│       └── god-view/           # BUSINESS MODULE
├── marketing/                  # STRATEGIC CONTAINER (planned)
└── ...                         # Other categories (sales, finance, operations, team, legal)
```

### Key Documentation

| Document | Location | Entity Type |
|----------|----------|-------------|
| Documentation Hub | `docs/index.md` | — |
| Module Manifest | `docs/manifest.yaml` | — |
| **System PRD** | `docs/platform/prd.md` | Constitution |
| **System Architecture** | `docs/platform/architecture.md` | Constitution |
| **System UX Design** | `docs/platform/ux-design.md` | Constitution |
| **System Epics** | `docs/platform/epics.md` | Constitution |
| **Product Brief** | `docs/platform/product-brief.md` | Constitution |
| Platform Deployment | `docs/platform/orchestration/deployment-plan.md` | Infrastructure |
| Incident Response | `docs/platform/orchestration/incident-response.md` | Infrastructure |

### Module Management (IMPORTANT)

**NEVER manually edit `docs/manifest.yaml` or create/delete module folders.**

Use the provided scripts to manage the hierarchy:

```bash
# Platform Infrastructure Modules (flat structure - no subcategories)
./scripts/add-module.sh platform events        # Adds docs/platform/events/
./scripts/remove-module.sh platform events

# Strategic Containers (categories)
./scripts/add-category.sh analytics "Business Intelligence"
./scripts/remove-category.sh analytics

# Coordination Units (subcategories within strategic containers)
./scripts/add-subcategory.sh strategy copilot "AI strategy conversations"
./scripts/remove-subcategory.sh strategy copilot

# Business Modules (within coordination units)
./scripts/add-module.sh strategy copilot advisor  # Adds docs/strategy/copilot/advisor/
./scripts/remove-module.sh strategy copilot advisor
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

### Constitution Changes

**Any change to Constitution documents requires explicit flagging and rationale.**

Protected documents (in `docs/platform/`):
- `prd.md` — System PRD (PR-xxx, IC-xxx)
- `architecture.md` — System Architecture
- `ux-design.md` — System UX Principles
- `epics.md` — Cross-cutting Epics
- `product-brief.md` — Foundational Vision

When modifying these files:
1. **Flag the change** in your response to the user
2. **Provide rationale** explaining why the change is necessary
3. **Include rationale in commit message** when committing

Example commit message:
```
docs(constitution): Update architecture with caching strategy

Rationale: New caching layer needed for performance targets.
See ADR-006 for full decision record.
```

This governance ensures system-wide decisions are traceable and intentional.

### Zero-Trust Inheritance

All entities inherit from their **direct parent only** (no skip-level):
- Children expose work upward, parents curate what's shared
- Business Module → Coordination Unit PRD
- Coordination Unit → Strategic Container PRD
- Strategic Container → Constitution
- Infrastructure Module → Constitution

Each level can ADD requirements but NEVER CONTRADICT parent.

### Requirement ID Syntax

```
{TYPE}-{PATH}-{NUMBER}

TYPE:
  PR = Platform Requirement (Constitution only)
  IC = Integration Contract (Constitution only)
  FR = Functional Requirement (all other entity types)

PATH (for FR only):
  Variable depth, max 3 letters per segment, hyphen-separated

  Infrastructure Module:    {MOD}               → FR-SHL-001
  Strategic Container:      {CAT}               → FR-STR-001
  Coordination Unit:        {CAT}-{SUB}         → FR-STR-PUL-001
  Business Module:          {CAT}-{SUB}-{MOD}   → FR-STR-PUL-DAS-001

NUMBER:
  Three digits (001-999)
```

**Uniqueness Rule:** Within any parent, no two children may share the same 3-letter code.

**Canonical Abbreviations (from manifest.yaml):**

| Entity | Code | Entity | Code |
|--------|------|--------|------|
| shell | SHL | strategy | STR |
| ui | UIC | marketing | MKT |
| core-api | API | sales | SAL |
| ts-schema | TSS | finance | FIN |
| orchestration | ORC | operations | OPS |
| — | — | team | TEA |
| — | — | legal | LEG |
