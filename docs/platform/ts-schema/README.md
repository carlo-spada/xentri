# TS Schema

> Shared TypeScript types and Zod schemas - the contract layer.

**Package:** `packages/ts-schema`
**Entity Type:** Infrastructure Module
**Status:** Active

## Overview

The ts-schema package is the **single source of truth** for:
- TypeScript type definitions used across all packages
- Zod schemas for runtime validation
- API request/response contracts
- Event payload definitions

## Key Principle

> When data crosses a boundary (API call, event emission, package import),
> it MUST be defined in ts-schema.

This ensures:
- Type safety across the entire codebase
- Runtime validation at system boundaries
- Consistent contracts between services

## Contents

```typescript
// Example exports from ts-schema
export { OrganizationSchema, type Organization } from './schemas/organization'
export { BriefEventSchema, type BriefEvent } from './schemas/events'
export { ApiResponseSchema, type ApiResponse } from './schemas/api'
```

## Dependencies

None - this is the foundational package that others depend on.

## Consumed By

| Module | Usage |
|--------|-------|
| `platform/core-api` | Request validation, response typing |
| `platform/shell` | API response typing |
| All future services | Shared contracts |

## Development

```bash
# Build ts-schema
pnpm --filter @xentri/ts-schema build

# Type check
pnpm --filter @xentri/ts-schema run typecheck

# Run tests
pnpm --filter @xentri/ts-schema run test
```

## Documentation Structure

```
docs/platform/ts-schema/
├── README.md              # This file
├── contracts.md           # Schema documentation (TODO)
└── sprint-artifacts/
    └── sprint-status.yaml
```

## Schema Change Protocol

When modifying ts-schema:
1. Update the schema with new/changed fields
2. Run `pnpm run typecheck` across entire repo
3. Fix any type errors in consuming packages
4. Update documentation if contract semantics change

---

*Module documentation to be expanded as development continues.*
