# Shared

> Cross-module contracts and types - the foundation of type safety.

**Category:** Platform (meta)
**Sub-category:** Shared
**Status:** Active

## Purpose

The Shared sub-category contains modules that define contracts used across all other modules. These are foundational packages with no dependencies on other modules.

## Modules

| Module | Purpose | Package | Status |
|--------|---------|---------|--------|
| [ts-schema](./ts-schema/) | TypeScript types and Zod schemas | `packages/ts-schema` | Active |

## Key Principle

> When data crosses a boundary (API call, event emission, package import),
> it MUST be defined in ts-schema.

This ensures:
- Type safety across the entire codebase
- Runtime validation at system boundaries
- Consistent contracts between services

## Consumed By

All modules in the platform consume ts-schema:
- `platform/backend/core-api`
- `platform/frontend/shell`
- All future services and micro-apps

---

*See individual module READMEs for detailed documentation.*
