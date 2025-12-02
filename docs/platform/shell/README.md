# Shell

> Astro application shell - routing, layout, and React island host.

**Package:** `apps/shell`
**Category:** Platform → Frontend
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
| `platform/frontend/ui` | Design system components |
| `platform/shared/ts-schema` | Shared type definitions |
| `platform/backend/core-api` | API calls via TanStack Query |

## Development

```bash
# Start shell only
pnpm run dev --filter apps/shell

# Shell runs at http://localhost:4321
```

## Documentation Structure

```
docs/platform/frontend/shell/
├── README.md           # This file
├── architecture.md     # Shell-specific decisions (TODO)
├── routing.md          # Navigation patterns (TODO)
├── islands.md          # React island documentation (TODO)
└── sprint-artifacts/
    └── sprint-status.yaml
```

---

*Module documentation to be expanded as development continues.*
