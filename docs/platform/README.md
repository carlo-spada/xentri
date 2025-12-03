# Platform

> Core infrastructure that powers all Xentri capabilities.

The Platform category (meta) contains foundational sub-categories that are always present and required for Xentri to function. These handle authentication, data persistence, event processing, and UI components.

## Sub-categories & Modules

| Sub-category | Module | Purpose | Package | Status |
|--------------|--------|---------|---------|--------|
| [frontend](./frontend/) | [shell](./frontend/shell/) | Astro app shell, routing, islands | `apps/shell` | Active |
| | [ui](./frontend/ui/) | Design system, shared components | `packages/ui` | Active |
| [backend](./backend/) | [core-api](./backend/core-api/) | Auth, events, organizations | `services/core-api` | Active |
| [shared](./shared/) | [ts-schema](./shared/ts-schema/) | TypeScript types and Zod schemas | `packages/ts-schema` | Active |
| [infrastructure](./infrastructure/) | - | Events, auth, billing, brief (planned) | - | Planned |

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         Shell (Astro)                        │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                    React Islands (UI)                    ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Core API (Fastify)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐ │
│  │   Auth   │  │  Events  │  │   Orgs   │  │   Webhooks   │ │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    PostgreSQL + Prisma                       │
│                    (RLS Multi-tenancy)                       │
└─────────────────────────────────────────────────────────────┘
```

## Key Patterns

- **Event Backbone**: All business actions emit events to `system_events` table
- **Multi-tenancy**: Row-Level Security (RLS) enforces org isolation
- **Shared Contracts**: `ts-schema` defines types consumed by all modules
- **Lazy Loading**: React islands loaded on-demand by Astro shell

## Dependencies

Platform modules have no external category dependencies - they ARE the foundation.

---

*See [architecture.md](./architecture.md) for detailed technical decisions.*
