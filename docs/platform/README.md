# Platform

> Core infrastructure that powers all Xentri capabilities.

The Platform category (meta) contains foundational sub-categories that are always present and required for Xentri to function. These handle authentication, data persistence, event processing, and UI components.

## Modules

Platform modules are flat (no subcategories) — terminal nodes with implementation only.

| Module                    | Purpose                             | Package              | Status  |
| ------------------------- | ----------------------------------- | -------------------- | ------- |
| [shell](./shell/)         | Astro app shell, routing, islands   | `apps/shell`         | Active  |
| [ui](./ui/)               | Design system, shared components    | `packages/ui`        | Active  |
| [core-api](./core-api/)   | Auth, events, organizations         | `services/core-api`  | Active  |
| [ts-schema](./ts-schema/) | TypeScript types and Zod schemas    | `packages/ts-schema` | Active  |
| events                    | Event Spine and Operational Pulse   | —                    | Planned |
| auth                      | Authentication and permissions      | —                    | Planned |
| billing                   | Subscription and payment processing | —                    | Planned |
| soul                      | Soul system storage and synthesis   | —                    | Planned |

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

_See [architecture.md](./architecture.md) for detailed technical decisions._
