# Frontend

> User interface layer - shell, components, and micro-apps.

**Category:** Platform (meta)
**Sub-category:** Frontend
**Status:** Active

## Purpose

The Frontend sub-category contains modules that handle all user-facing UI concerns. This includes the application shell, design system, and future micro-app implementations.

## Modules

| Module | Purpose | Package | Status |
|--------|---------|---------|--------|
| [shell](./shell/) | Astro container application | `apps/shell` | Active |
| [ui](./ui/) | Shared component library | `packages/ui` | Active |

## Architecture

The frontend follows an **Island Architecture** pattern:
- **Shell** (Astro) provides the stable container with header, sidebar, and routing
- **React Islands** load dynamically for interactive content
- **UI Components** are pure and stateless, shared across all islands

## Dependencies

| Depends On | Relationship |
|------------|--------------|
| `platform/shared/ts-schema` | Type definitions |
| `platform/backend/core-api` | API calls |

---

*See individual module READMEs for detailed documentation.*
