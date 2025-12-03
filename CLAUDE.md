# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Project Overview

**Xentri** is a modular Business OS that starts with conversation, not configuration. It uses a **Strategy Co-pilot** to generate a **Universal Brief** (the DNA of a business), which powers tools organized into 7 capability categories.

## Documentation Navigation

Documentation follows a **Five Entity Types** model:

| Entity Type | Location | Contains |
|-------------|----------|----------|
| **Constitution** | `docs/platform/*.md` | PR-xxx, IC-xxx, system-wide rules |
| **Infrastructure Module** | `docs/platform/{module}/` | Exposed/consumed interfaces |
| **Strategic Container** | `docs/{category}/` | Strategic alignment, child coordination |
| **Coordination Unit** | `docs/{category}/{subcat}/` | Subcategory scope, module orchestration |
| **Business Module** | `docs/{cat}/{subcat}/{mod}/` | Feature FRs, implementation |

### Entity Type Detection

```
docs/platform/*.md              → Constitution
docs/platform/{module}/         → Infrastructure Module
docs/{category}/                → Strategic Container
docs/{category}/{subcat}/       → Coordination Unit
docs/{cat}/{subcat}/{module}/   → Business Module
```

### Documentation Structure

```
docs/
├── index.md                    # Navigation hub
├── manifest.yaml               # Machine-readable registry (SINGLE SOURCE OF TRUTH)
│
├── platform/                   # META CONTAINER (Constitution + Infrastructure)
│   ├── prd.md                  # CONSTITUTION: System PRD (PR-xxx, IC-xxx)
│   ├── architecture.md         # CONSTITUTION: System Architecture
│   ├── ux-design.md            # CONSTITUTION: System UX Principles
│   ├── epics.md                # CONSTITUTION: Cross-cutting Epics
│   ├── product-brief.md        # CONSTITUTION: Foundational Vision
│   │
│   ├── shell/                  # INFRASTRUCTURE MODULE
│   ├── ui/                     # INFRASTRUCTURE MODULE
│   ├── core-api/               # INFRASTRUCTURE MODULE
│   ├── ts-schema/              # INFRASTRUCTURE MODULE
│   └── orchestration/          # INFRASTRUCTURE MODULE
│
├── strategy/                   # STRATEGIC CONTAINER
│   └── {subcat}/               # COORDINATION UNIT
│       └── {module}/           # BUSINESS MODULE
└── {category}/                 # Other strategic containers
```

### Module Management

**NEVER manually edit `docs/manifest.yaml` or create/delete module folders.**

```bash
# Platform Infrastructure Modules
./scripts/add-module.sh platform {module}
./scripts/remove-module.sh platform {module}

# Strategic Containers
./scripts/add-category.sh {category} "Description"
./scripts/remove-category.sh {category}

# Coordination Units
./scripts/add-subcategory.sh {category} {subcat} "Description"
./scripts/remove-subcategory.sh {category} {subcat}

# Business Modules
./scripts/add-module.sh {category} {subcat} {module}
./scripts/remove-module.sh {category} {subcat} {module}
```

## Architecture Philosophy: "Decoupled Unity"

The user sees one calm workspace; under the hood, each capability is an isolated module:

| Layer | Technology | Role |
|-------|------------|------|
| **Shell** | Astro | Container (header + sidebar), routing, auth |
| **Micro-Apps** | React Islands | Interactive SPAs lazy-loaded into Shell |
| **Backend** | Node.js (Fastify) | Microservices per domain |
| **Data** | PostgreSQL | Schema-per-service, RLS for multi-tenancy |
| **Events** | Redis Streams | Async event transport |

**Non-negotiables:**
- Multi-tenant from day zero: every table has `org_id` with Row-Level Security
- Event-first: all business actions write to `system_events` before domain tables
- Visible automation: every automated action logged with human-readable explanation
- Services communicate via events, not direct calls

## Repository Structure

```
/xentri
├── apps/
│   └── shell/                # Astro Shell with React islands
├── packages/
│   ├── ui/                   # Shared Design System
│   └── ts-schema/            # Shared Types & Zod Schemas (the "Contract")
├── services/
│   └── core-api/             # Core API with Prisma, RLS
├── docs/                     # Hierarchical documentation
├── .bmad/                    # BMAD framework
└── .claude/commands/         # Slash commands (/bmad:*)
```

## Development Commands

```bash
# Setup
pnpm install                           # Install all workspace dependencies
docker compose up -d postgres redis    # Start infrastructure
pnpm run db:migrate                    # Apply Prisma migrations with RLS

# Development
pnpm run dev                           # Start all services
pnpm run dev --filter apps/shell       # Shell only
pnpm run dev --filter services/core-api # API only

# Quality
pnpm run test                          # Run tests
pnpm run typecheck                     # TypeScript validation
pnpm run build                         # Build all packages
pnpm run lint                          # Run ESLint
```

## BMAD Framework

| Directory | Purpose |
|-----------|---------|
| `.bmad/bmm/` | BMad Method - product development workflows |
| `.bmad/bmb/` | BMad Builder - agent/workflow creation tools |
| `.bmad/cis/` | Creative & Innovation Suite |
| `.bmad/core/` | Core utilities and brainstorming |
| `.claude/commands/` | Slash commands available via `/bmad:*` |

### Federated Workflow System

Workflows are tracked **per entity**, not project-wide. Each entity type has its own workflow sequence.

```bash
/bmad:bmm:workflows:workflow-init   # Select entity, create status file
/bmad:bmm:workflows:workflow-status  # View progress, get next steps
```

### Workflow Phases

| Phase | Workflows | Status |
|-------|-----------|--------|
| **Discovery** | brainstorm-project, research, product-brief | Optional |
| **Planning** | prd, validate-prd | Required + Recommended |
| **Design** | create-ux, validate-ux | Conditional (if_has_ui) |
| **Solutioning** | architecture, validate-architecture, create-epics-and-stories, validate-epics, test-design, implementation-readiness | Required + Recommended |
| **Implementation** | sprint-planning | Required |

**Validation workflows are RECOMMENDED** to ensure quality gates.

### Workflow Sequence by Entity Type

| Entity Type | Key Differences |
|-------------|-----------------|
| **Constitution** | Full stack including product-brief, system-wide epics |
| **Infrastructure Module** | Inherits from Constitution, module-specific PRD |
| **Strategic Container** | Strategic PRD, no epics (children handle) |
| **Coordination Unit** | Coordination PRD, no epics (children handle) |
| **Business Module** | Full stack with implementation-ready requirements |

## Design Principles

1. **Clarity First** - Universal Brief before tools; AI generates structure, not just content
2. **Calm UX** - One daily view of what matters; no notification flood
3. **Visible, Not Magical** - Every automation logged with explanation
4. **Modular Growth** - Start free, add modules, grow to bundles
5. **Works With Reality** - WhatsApp copy-paste flows, not rigid forms

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
1. **Flag the change** in your response
2. **Provide rationale** explaining why
3. **Include rationale in commit message**

### Zero-Trust Inheritance

All entities inherit from their **direct parent only** (no skip-level):
- Children expose work upward, parents curate what's shared
- Each level can ADD requirements but NEVER CONTRADICT parent

### Requirement ID Syntax

```
{TYPE}-{PATH}-{NUMBER}

TYPE:
  PR = Platform Requirement (Constitution only)
  IC = Integration Contract (Constitution only)
  FR = Functional Requirement (all other entity types)

PATH (for FR only):
  Infrastructure Module:    {MOD}               → FR-SHL-001
  Strategic Container:      {CAT}               → FR-STR-001
  Coordination Unit:        {CAT}-{SUB}         → FR-STR-PUL-001
  Business Module:          {CAT}-{SUB}-{MOD}   → FR-STR-PUL-DAS-001
```

**Uniqueness Rule:** Within any parent, no two children may share the same 3-letter code.
