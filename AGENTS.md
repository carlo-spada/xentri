# Repository Guidelines (Codex)

## Project Status

**Xentri** - A modular Business OS that starts with conversation, not configuration.

**Current Phase:** Epic 1 Foundation complete (Story 1.7 in review)
**Live API:** https://core-api-production-8016.up.railway.app

## Documentation Navigation

Documentation follows a **Five Entity Types** model. Entity type is determined by PURPOSE, not depth.

**Manifest:** `docs/manifest.yaml` — Machine-readable module registry (v4.0)

### Entity Type Detection

At session start, ask: "Which entity are you working on?"

| Entity Type | Path Pattern | Example |
|-------------|--------------|---------|
| **Constitution** | `docs/platform/*.md` | `docs/platform/prd.md` |
| **Infrastructure Module** | `docs/platform/{module}/` | `docs/platform/core-api/` |
| **Strategic Container** | `docs/{category}/` | `docs/strategy/` |
| **Coordination Unit** | `docs/{category}/{subcat}/` | `docs/strategy/pulse/` |
| **Business Module** | `docs/{cat}/{subcat}/{mod}/` | `docs/strategy/pulse/dashboard/` |

```
Infrastructure Modules (platform):
  - shell, ui, core-api, ts-schema, orchestration (active)
  - events, auth, billing, brief (planned)

Strategic Containers (user-facing categories):
  - strategy, marketing, sales, finance, operations, team, legal
```

### Structure

```
docs/
├── index.md                    # Navigation hub
├── manifest.yaml               # Module registry v4.0 (SINGLE SOURCE OF TRUTH)
│
├── platform/                   # META CONTAINER (Constitution + Infrastructure)
│   ├── prd.md                  # CONSTITUTION: System PRD
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
├── marketing/                  # STRATEGIC CONTAINER (planned)
└── {other-categories}/         # Future
```

### Module Management (IMPORTANT)

**NEVER manually edit `docs/manifest.yaml` or create/delete module folders.**

Use the provided scripts:

```bash
# Platform Infrastructure Modules (flat structure)
./scripts/add-module.sh platform events
./scripts/remove-module.sh platform events

# Strategic Containers (categories)
./scripts/add-category.sh analytics "Business Intelligence"
./scripts/remove-category.sh analytics

# Coordination Units (subcategories)
./scripts/add-subcategory.sh strategy copilot "AI strategy conversations"
./scripts/remove-subcategory.sh strategy copilot

# Business Modules (within coordination units)
./scripts/add-module.sh strategy copilot advisor
./scripts/remove-module.sh strategy copilot advisor
```

These scripts maintain `docs/manifest.yaml` as the single source of truth.

## Build & Development Commands

```bash
pnpm install                           # Install dependencies
docker compose up -d postgres redis    # Start infrastructure
pnpm run db:migrate                    # Apply Prisma migrations

pnpm run dev                           # Start all services
pnpm run test                          # Run tests
pnpm run typecheck                     # TypeScript validation
pnpm run build                         # Build all packages
```

## Coding Conventions

- **TypeScript** across all packages; shared types in `packages/ts-schema`
- **2-space indentation**, trailing commas, named exports (no defaults in shared packages)
- **Event-first**: All business actions write to `system_events` before domain tables
- **Multi-tenant**: Every table has `org_id` with Row-Level Security
- Follow event contracts from `docs/platform/orchestration/architecture/event-model-v0.1.md`

## Testing

- Tests alongside code (`*.test.ts` or `__tests__/`)
- Vitest for unit tests, Playwright for E2E
- 25+ tests passing with coverage thresholds
- Run `pnpm run test` before PRs

## Commits & PRs

- Concise imperative messages ("Add...", "Fix...", "Update...")
- Include: summary, linked issue, testing performed
- Call out `ts-schema` changes explicitly

## Key Documentation

| Document | Location |
|----------|----------|
| Hub | `docs/index.md` |
| Manifest | `docs/manifest.yaml` |
| **Constitution PRD** | `docs/platform/prd.md` |
| **Architecture** | `docs/platform/architecture.md` |
| Deployment | `docs/platform/orchestration/deployment-plan.md` |
| Incidents | `docs/platform/orchestration/incident-response.md` |

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
1. Flag the change in your response
2. Provide rationale explaining why
3. Include rationale in commit message

### Zero-Trust Inheritance

All entities inherit from their **direct parent only**:
- Children expose work upward, parents curate what's shared
- No skip-level visibility
- Each level can ADD requirements but NEVER CONTRADICT parent
