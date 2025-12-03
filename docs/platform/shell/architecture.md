# Shell Architecture

> **Module:** shell
> **Type:** Infrastructure Module
> **Parent:** Constitution

---

## Overview

The Shell is the Astro-based container application that:
- Provides the main navigation and layout
- Handles authentication flows via Clerk
- Orchestrates React "islands" for interactive features
- Manages global state via Nano Stores

---

## Technology Stack

| Component | Technology | Version |
|-----------|------------|---------|
| Framework | Astro | 5.x |
| Islands | React | 19.x |
| State | Nano Stores | 0.11.x |
| Auth | Clerk Astro | 2.x |
| Styling | Tailwind CSS | 4.x |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser                               │
├─────────────────────────────────────────────────────────────┤
│                    Astro Shell (SSR/SSG)                    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                   Layout Component                    │   │
│  │  ┌─────────┐  ┌──────────────────────────────────┐  │   │
│  │  │ Sidebar │  │         Main Content Area         │  │   │
│  │  │ (Astro) │  │  ┌────────────────────────────┐  │  │   │
│  │  │         │  │  │     React Island           │  │  │   │
│  │  │  • Nav  │  │  │  (client:visible)          │  │  │   │
│  │  │  • User │  │  │                            │  │  │   │
│  │  │         │  │  └────────────────────────────┘  │  │   │
│  │  └─────────┘  └──────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│                    Nano Stores (State)                       │
│        $user  |  $org  |  $soul  |  $notifications          │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Patterns

### Island Architecture

React components hydrate only when needed:

```astro
---
// Static Astro component
import { StrategySPA } from '../islands/StrategySPA';
---

<main>
  <!-- Static content rendered at build time -->
  <h1>Strategy</h1>

  <!-- React island hydrates on visibility -->
  <StrategySPA client:visible />
</main>
```

Hydration strategies:
- `client:load` — Hydrate immediately on page load
- `client:visible` — Hydrate when scrolled into view
- `client:idle` — Hydrate when browser is idle
- `client:only="react"` — Client-only, no SSR

### Global State

Nano Stores provide reactive state across islands:

```typescript
// stores/user.ts
import { atom } from 'nanostores';

export const $user = atom<User | null>(null);
export const $org = atom<Organization | null>(null);

// In any React island
import { useStore } from '@nanostores/react';
import { $user } from '../stores/user';

function UserMenu() {
  const user = useStore($user);
  return <span>{user?.name}</span>;
}
```

### Authentication Flow

```
User visits /dashboard
       │
       ▼
┌──────────────────┐
│ Clerk middleware │──No auth──▶ Redirect to /sign-in
└────────┬─────────┘
         │ Has auth
         ▼
┌──────────────────┐
│  Extract claims  │
│  (user, org_id)  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Populate stores │
│  $user, $org     │
└────────┬─────────┘
         │
         ▼
    Render page
```

---

## Directory Structure

```
apps/shell/
├── src/
│   ├── layouts/          # Astro layouts
│   │   └── MainLayout.astro
│   ├── pages/            # File-based routing
│   │   ├── index.astro
│   │   ├── dashboard.astro
│   │   └── strategy/
│   ├── components/       # Astro components
│   │   ├── Sidebar.astro
│   │   └── Header.astro
│   ├── islands/          # React islands
│   │   ├── StrategySPA.tsx
│   │   └── NotificationBell.tsx
│   └── stores/           # Nano Stores
│       ├── user.ts
│       └── soul.ts
├── public/               # Static assets
└── astro.config.mjs      # Astro configuration
```

---

## Related Documents

- [Routing](./routing.md) — Navigation patterns
- [Islands](./islands.md) — React island documentation
- [Constitution UX Design](../ux-design.md) — Design system
