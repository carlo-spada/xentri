# Shell Routing

> **Module:** shell
> **Pattern:** File-based routing with Astro

---

## Route Structure

```
/                          # Landing page (public)
/sign-in                   # Clerk sign-in
/sign-up                   # Clerk sign-up
/dashboard                 # Main dashboard (auth required)
/strategy                  # Strategy category
/strategy/soul             # Soul editor
/strategy/goals            # Goals & OKRs
/finance                   # Finance category (future)
/settings                  # User/org settings
```

---

## File-Based Routing

Routes are defined by file structure in `src/pages/`:

```
src/pages/
├── index.astro            # /
├── sign-in.astro          # /sign-in
├── sign-up.astro          # /sign-up
├── dashboard.astro        # /dashboard
├── strategy/
│   ├── index.astro        # /strategy
│   ├── soul.astro         # /strategy/soul
│   └── goals.astro        # /strategy/goals
└── settings/
    ├── index.astro        # /settings
    └── organization.astro # /settings/organization
```

---

## Route Protection

### Middleware

```typescript
// src/middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/astro/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/health'
]);

export const onRequest = clerkMiddleware((auth, ctx) => {
  if (!isPublicRoute(ctx.request) && !auth().userId) {
    return auth().redirectToSignIn();
  }
});
```

### Page-Level Guards

```astro
---
// src/pages/dashboard.astro
const { userId, orgId } = Astro.locals.auth();

if (!userId) {
  return Astro.redirect('/sign-in');
}

if (!orgId) {
  return Astro.redirect('/onboarding');
}
---
```

---

## Navigation

### Sidebar Navigation

```typescript
// Navigation structure
const navigation = [
  {
    category: 'Strategy',
    icon: 'compass',
    items: [
      { label: 'Overview', href: '/strategy' },
      { label: 'Soul', href: '/strategy/soul' },
      { label: 'Goals', href: '/strategy/goals' }
    ]
  },
  {
    category: 'Finance',
    icon: 'dollar',
    items: [
      { label: 'Overview', href: '/finance' },
      { label: 'Invoices', href: '/finance/invoices' }
    ]
  }
  // ...
];
```

### Active State

```astro
---
const currentPath = Astro.url.pathname;
---

<a
  href={item.href}
  class:list={[
    'nav-item',
    { 'nav-item--active': currentPath.startsWith(item.href) }
  ]}
>
  {item.label}
</a>
```

---

## Dynamic Routes

For entity-specific pages:

```
src/pages/
├── finance/
│   └── invoices/
│       └── [id].astro     # /finance/invoices/:id
```

```astro
---
// src/pages/finance/invoices/[id].astro
const { id } = Astro.params;

const invoice = await fetch(`/api/v1/invoices/${id}`);
---

<InvoiceDetail invoice={invoice} client:load />
```

---

## API Routes

Server-side API routes:

```
src/pages/api/
├── health.ts              # GET /api/health
└── proxy/
    └── [...path].ts       # Proxy to core-api
```

```typescript
// src/pages/api/health.ts
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({ status: 'ok' }), {
    headers: { 'Content-Type': 'application/json' }
  });
};
```

---

## Transitions

Using Astro View Transitions:

```astro
---
// src/layouts/MainLayout.astro
import { ViewTransitions } from 'astro:transitions';
---

<html>
  <head>
    <ViewTransitions />
  </head>
  <body>
    <slot />
  </body>
</html>
```

Elements can specify transition names:

```astro
<main transition:name="content" transition:animate="slide">
  <slot />
</main>
```
