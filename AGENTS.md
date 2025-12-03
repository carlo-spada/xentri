# Repository Guidelines (Codex)

## Project Overview

**Xentri** - A modular Business OS that starts with conversation, not configuration.

## Documentation Navigation

Documentation follows a **Five Entity Types** model. Entity type is determined by PURPOSE, not depth.

**Manifest:** `docs/manifest.yaml` — Machine-readable module registry (SINGLE SOURCE OF TRUTH)

### Entity Type Detection

| Entity Type | Path Pattern |
|-------------|--------------|
| **Constitution** | `docs/platform/*.md` |
| **Infrastructure Module** | `docs/platform/{module}/` |
| **Strategic Container** | `docs/{category}/` |
| **Coordination Unit** | `docs/{category}/{subcat}/` |
| **Business Module** | `docs/{cat}/{subcat}/{mod}/` |

### Structure

```
docs/
├── index.md                    # Navigation hub
├── manifest.yaml               # Module registry (SINGLE SOURCE OF TRUTH)
│
├── platform/                   # META CONTAINER (Constitution + Infrastructure)
│   ├── prd.md                  # CONSTITUTION: System PRD
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

## Federated Workflow System

Workflows are tracked **per entity**, not project-wide. Each entity type has its own workflow sequence.

### Workflow Commands

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

## Testing

- Tests alongside code (`*.test.ts` or `__tests__/`)
- Vitest for unit tests, Playwright for E2E
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
