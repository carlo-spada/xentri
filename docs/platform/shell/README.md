# Shell

> Astro application shell - routing, layout, and React island host.

**Package:** `apps/shell`
**Entity Type:** Infrastructure Module
**Status:** Active

## Overview

The Shell is the container application that provides:
- Stable header and sidebar across all views
- Client-side routing via Astro
- React island hosting for interactive micro-apps
- Authentication state management (Clerk)

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Shell (Astro 5.16)                    │
├─────────────────────────────────────────────────────────┤
│  Header (persistent)                                     │
├──────────────┬──────────────────────────────────────────┤
│   Sidebar    │         React Island (lazy-loaded)        │
│  (persistent)│                                          │
│              │   ┌──────────────────────────────────┐   │
│              │   │      Micro-App Content            │   │
│              │   │      (CRM, CMS, etc.)             │   │
│              │   └──────────────────────────────────┘   │
└──────────────┴──────────────────────────────────────────┘
```

## Key Patterns

- **Island Architecture**: React components loaded via `client:only="react"`
- **Hover Prefetching**: Anticipate navigation for instant page loads
- **Error Boundaries**: Prevent white screen of death from micro-app errors
- **Cross-app State**: Nano Stores for client state, TanStack Query for server state

## Dependencies

| Module | Relationship |
|--------|--------------|
| `platform/ui` | Design system components |
| `platform/ts-schema` | Shared type definitions |
| `platform/core-api` | API calls via TanStack Query |

## Development

```bash
# Start shell only
pnpm run dev --filter apps/shell

# Shell runs at http://localhost:4321
```

## Documentation Structure

```
docs/platform/shell/
├── README.md           # This file
├── architecture.md     # Shell architecture and patterns
├── routing.md          # File-based routing documentation
├── islands.md          # React island documentation
└── sprint-artifacts/
    └── sprint-status.yaml
```

---

## Related Documents

- [Architecture](./architecture.md) — Shell design and patterns
- [Routing](./routing.md) — Navigation and route protection
- [Islands](./islands.md) — React island hydration strategies
