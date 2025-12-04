# Shell Architecture

> **Module:** shell
> **Type:** Infrastructure Module
> **Parent:** Constitution Architecture (docs/platform/architecture.md)
> **Version:** 2.0

---

## Overview

The Shell is the Astro-based container application that:

- Provides the main navigation and layout
- Handles authentication flows via Clerk
- Orchestrates React "islands" for interactive features
- Manages global state via Nano Stores
- Handles offline sync and first-run experience

---

## Technology Stack

| Component | Technology    | Version |
| --------- | ------------- | ------- |
| Framework | Astro         | 5.x     |
| Islands   | React         | 19.x    |
| State     | Nano Stores   | 0.11.x  |
| Auth      | Clerk Astro   | 2.x     |
| Styling   | Tailwind CSS  | 4.x     |
| Offline   | Dexie.js      | 4.x     |
| i18n      | astro-i18next | —       |

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

> **Migrated from Constitution Architecture §6.B**

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

**Hydration Strategies:**

| Strategy              | When to Use                      |
| --------------------- | -------------------------------- |
| `client:load`         | Hydrate immediately on page load |
| `client:visible`      | Hydrate when scrolled into view  |
| `client:idle`         | Hydrate when browser is idle     |
| `client:only="react"` | Client-only, no SSR              |

**Shell Responsibilities:**

- **Frame:** Sidebar, Header, Auth
- **Navigation:** Hovering a sidebar item pre-fetches the React bundle
- **Mounting:** Clicking mounts the React app into the content area
- **State:** Nano Stores for cross-island communication (e.g., a "New Lead" toast triggered by CRM island)

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

## Offline & Sync Patterns

> **Migrated from Constitution Architecture §6.H**

**Context:** Latin American beachhead users often have unreliable connectivity. The architecture must support intermittent offline use without data loss.

### Offline Scope

| Can Edit Offline                        | Requires Connectivity   |
| --------------------------------------- | ----------------------- |
| Soul drafts (in progress)               | Soul approval/publish   |
| Form data (leads, invoices in progress) | Payment processing      |
| Notes and comments                      | Cross-module operations |
| Local settings/preferences              | User/org management     |

### Pattern: Optimistic UI + Local Queue

```
┌─────────────────────────────────────────────────────────────┐
│                         Shell (Browser)                     │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │  Dexie.js   │◄──►│ Sync Queue  │◄──►│ Nano Store  │     │
│  │ (IndexedDB) │    │ (Pending)   │    │ (UI State)  │     │
│  └─────────────┘    └──────┬──────┘    └─────────────┘     │
└────────────────────────────┼────────────────────────────────┘
                             │ Online?
                             ▼
                     ┌───────────────┐
                     │   Core API    │
                     └───────────────┘
```

### Sync States (User-Visible)

| State         | Indicator       | Meaning                      |
| ------------- | --------------- | ---------------------------- |
| `saved-local` | Gray cloud      | Saved locally, not synced    |
| `syncing`     | Animated cloud  | Uploading to server          |
| `synced`      | Green checkmark | Confirmed on server          |
| `conflict`    | Yellow warning  | Server has different version |

**Global Indicator:** Shell header displays overall sync status. Users glance there before closing tab.

**Offline Banner:** When connectivity drops, show subtle banner: "Working offline. Changes will sync when you're back online."

### Conflict Resolution

**Strategy:** Last-write-wins with user notification.

When conflict detected:

1. Show diff preview (local vs server versions)
2. User chooses: "Keep mine" / "Keep server" / "Merge manually"
3. Decision logged in event spine for audit

### Implementation

| Component              | Technology                                                 |
| ---------------------- | ---------------------------------------------------------- |
| **Storage**            | Dexie.js for IndexedDB (better indexing than `idb-keyval`) |
| **State**              | Nano Store atoms for sync status                           |
| **Background Sync**    | Service Worker when supported                              |
| **Safari Fallback**    | Poll on `visibilitychange` + `online` events               |
| **Conflict Detection** | Hash payload; compare `local_hash` vs `server_hash`        |

### Performance Budget

| Operation                     | Target  |
| ----------------------------- | ------- |
| Local save                    | < 50ms  |
| Sync initiation (when online) | < 100ms |
| Conflict detection            | < 20ms  |

---

## Settings & First-Run Experience

> **Migrated from Constitution Architecture §6.I**

**Context:** Settings is a core Shell feature, not a module. It's the first content new users see after signup.

### First-Run Flow

New users see a guided setup wizard on first login:

```
Step 1: Profile → Step 2: Organization → Step 3: Language & Region → Dashboard
```

**Data captured:**

- Profile: Name, email (pre-filled from Clerk), phone (optional)
- Organization: Name, industry, size (Solo / 2-10 / 11-50 / 51+)
- Language & Region: Language, timezone, currency

### Settings Page Structure

Accessible via ⚙️ icon in Shell header. Always available regardless of module access.

| Section               | Contents                                        | Storage                         |
| --------------------- | ----------------------------------------------- | ------------------------------- |
| **Profile**           | Name, email, phone, avatar, password change     | Clerk (synced)                  |
| **Organization**      | Org name, industry, size, logo, billing email   | Clerk Org + our DB              |
| **Subscription**      | Current plan, usage metrics, upgrade/downgrade  | Clerk Billing portal (redirect) |
| **Language & Region** | Language, timezone, date format, currency       | User preferences table          |
| **Notifications**     | Email preferences, in-app notification settings | User preferences table          |
| **Team**              | Invite members, manage roles                    | Clerk Organizations (future)    |
| **Integrations**      | Connected apps, API keys                        | Our DB (future)                 |
| **Danger Zone**       | Export data, delete account                     | Requires confirmation           |

### Billing UX (Hybrid Clerk)

| Action                | Implementation                       |
| --------------------- | ------------------------------------ |
| View current plan     | Display from Clerk subscription data |
| Compare plans         | Our UI with plan features matrix     |
| Upgrade/downgrade     | Redirect to Clerk Billing Portal     |
| View invoices         | Redirect to Clerk Billing Portal     |
| Update payment method | Redirect to Clerk Billing Portal     |

**Rationale:** We control the plan selection experience (branding, messaging), but never touch credit card data. Clerk handles PCI compliance.

---

## Internationalization (i18n)

> **Migrated from Constitution Architecture §7**

### Stack

| Layer         | Solution                         |
| ------------- | -------------------------------- |
| Shell (Astro) | `astro-i18next` — SSR-compatible |
| React Islands | `react-i18next` — same ecosystem |

### Language Resolution Order

| Priority | Source                     | Example                          |
| -------- | -------------------------- | -------------------------------- |
| 1        | User's explicit preference | User chose "Español" in Settings |
| 2        | Browser `Accept-Language`  | `es-MX,es;q=0.9,en;q=0.8`        |
| 3        | IP geolocation             | Mexico IP → Spanish              |
| 4        | Org's default language     | Org configured for Spanish       |
| 5        | Fallback                   | English                          |

### Language Rollout

| Phase       | Languages             | Rationale                          |
| ----------- | --------------------- | ---------------------------------- |
| **MVP**     | English, Spanish      | Beachhead: Mexico, Colombia, LatAm |
| **Scale 1** | + German              | Strong SMB market, high ARPU       |
| **Scale 2** | + French              | France + Francophone Africa        |
| **Scale 3** | + Italian, Portuguese | Southern Europe, Brazil            |

### Translation Workflow

```
1. Developer writes: t('settings.profile.title')
2. English string added to locales/en.json
3. CI runs DeepL translation script → locales/es.json auto-generated
4. (Optional) Human review for brand voice
5. PR merged with all locale files
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
│   │   ├── settings/     # Settings pages
│   │   │   ├── index.astro
│   │   │   ├── profile.astro
│   │   │   └── organization.astro
│   │   └── strategy/
│   ├── components/       # Astro components
│   │   ├── Sidebar.astro
│   │   ├── Header.astro
│   │   └── SyncIndicator.astro
│   ├── islands/          # React islands
│   │   ├── StrategySPA.tsx
│   │   ├── NotificationBell.tsx
│   │   └── FirstRunWizard.tsx
│   ├── stores/           # Nano Stores
│   │   ├── user.ts
│   │   ├── soul.ts
│   │   └── sync.ts
│   └── lib/              # Utilities
│       ├── offline.ts    # Dexie.js setup
│       └── i18n.ts       # i18next config
├── locales/              # Translation files
│   ├── en.json
│   └── es.json
├── public/               # Static assets
└── astro.config.mjs      # Astro configuration
```

---

## Related Documents

- [Shell PRD](./prd.md) — Functional requirements
- [Shell UX Design](./ux-design.md) — Layout and navigation specifications
- [Shell Epics](./epics.md) — Implementation stories
- [Constitution Architecture](../architecture.md) — System-wide decisions
- [UI Design Tokens](../ui/ux-design.md) — Design system tokens

---

## Document History

| Version | Date       | Author  | Changes                                                              |
| ------- | ---------- | ------- | -------------------------------------------------------------------- |
| 1.0     | 2025-12-03 | —       | Initial scaffold                                                     |
| 2.0     | 2025-12-03 | Winston | Migrated Offline/Sync, Settings, i18n from Constitution Architecture |
