# Platform

> Core infrastructure that powers all Xentri capabilities.

The Platform category contains foundational modules that are always present and required for Xentri to function. These modules handle authentication, data persistence, event processing, UI components, and system-wide orchestration.

## Modules

| Module | Purpose | Package | Status |
|--------|---------|---------|--------|
| [orchestration](./orchestration/) | System-wide architecture, cross-cutting concerns | - | Active |
| [shell](./shell/) | Astro application shell, routing, React islands | `apps/shell` | Active |
| [core-api](./core-api/) | Authentication, events, organizations | `services/core-api` | Active |
| [ts-schema](./ts-schema/) | Shared TypeScript types and Zod schemas | `packages/ts-schema` | Active |
| [ui](./ui/) | Design system, shared components | `packages/ui` | Active |

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

*See [orchestration/architecture.md](./orchestration/architecture.md) for detailed technical decisions.*
