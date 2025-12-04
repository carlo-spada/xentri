# Schema Contracts

> **Module:** ts-schema
> **Purpose:** Shared types and Zod schemas across the monorepo

---

## Overview

The `ts-schema` package defines the "contract" between frontend and backend:

- TypeScript interfaces for compile-time safety
- Zod schemas for runtime validation
- Shared constants and enums

---

## Package Structure

```
packages/ts-schema/
├── src/
│   ├── events/           # Event schemas (IC-001)
│   │   ├── envelope.ts   # SystemEvent base
│   │   └── types/        # Event-specific schemas
│   ├── soul/             # Soul schemas
│   │   ├── identity.ts
│   │   ├── offerings.ts
│   │   └── goals.ts
│   ├── api/              # API request/response schemas
│   │   ├── events.ts
│   │   └── soul.ts
│   └── index.ts          # Public exports
└── package.json
```

---

## Core Schemas

### SystemEvent (IC-001)

```typescript
// src/events/envelope.ts
import { z } from 'zod'

export const SystemEventSchema = z.object({
  id: z.string().uuid(),
  type: z.string().regex(/^xentri\.[a-z]+\.[a-z_]+\.[a-z_]+\.v\d+$/),
  payload: z.unknown(),
  org_id: z.string().uuid(),
  actor_id: z.string(),
  actor_type: z.enum(['user', 'system', 'copilot']),
  correlation_id: z.string().uuid().optional(),
  causation_id: z.string().uuid().optional(),
  trace_id: z.string(),
  version: z.string(),
  created_at: z.string().datetime(),
  idempotency_key: z.string().optional(),
})

export type SystemEvent<T = unknown> = z.infer<typeof SystemEventSchema> & {
  payload: T
}
```

### Soul Schemas

```typescript
// src/soul/identity.ts
import { z } from 'zod'

export const IdentitySectionSchema = z.object({
  business_name: z.string().min(1),
  business_type: z.enum(['service', 'product', 'hybrid']),
  industry: z.string(),
  founding_date: z.string().optional(),
  mission: z.string().optional(),
  values: z.array(z.string()).optional(),
})

export type IdentitySection = z.infer<typeof IdentitySectionSchema>

// src/soul/index.ts
export const SoulSchema = z.object({
  version: z.string(),
  updated_at: z.string().datetime(),
  sections: z.object({
    identity: IdentitySectionSchema,
    offerings: OfferingsSectionSchema,
    goals: GoalsSectionSchema,
    operational: OperationalSectionSchema,
  }),
})

export type Soul = z.infer<typeof SoulSchema>
```

---

## API Schemas

### Request Schemas

```typescript
// src/api/events.ts
export const CreateEventRequestSchema = z.object({
  type: z.string(),
  payload: z.record(z.unknown()),
  idempotency_key: z.string().optional(),
})

export type CreateEventRequest = z.infer<typeof CreateEventRequestSchema>

export const ListEventsQuerySchema = z.object({
  type: z.string().optional(),
  since: z.string().datetime().optional(),
  limit: z.coerce.number().min(1).max(1000).default(100),
  cursor: z.string().optional(),
})

export type ListEventsQuery = z.infer<typeof ListEventsQuerySchema>
```

### Response Schemas

```typescript
// src/api/events.ts
export const EventResponseSchema = z.object({
  id: z.string().uuid(),
  type: z.string(),
  payload: z.unknown(),
  created_at: z.string().datetime(),
})

export const ListEventsResponseSchema = z.object({
  events: z.array(EventResponseSchema),
  next_cursor: z.string().nullable(),
})
```

---

## Using Schemas

### In Backend (Fastify)

```typescript
import { CreateEventRequestSchema } from '@xentri/ts-schema'
import { z } from 'zod'

// Route validation
app.post('/api/v1/events', {
  schema: {
    body: CreateEventRequestSchema,
  },
  handler: async (req, reply) => {
    const event = req.body // Type-safe!
    // ...
  },
})
```

### In Frontend (React)

```typescript
import { Soul, SoulSchema } from '@xentri/ts-schema'

async function fetchSoul(): Promise<Soul> {
  const response = await fetch('/api/v1/soul')
  const data = await response.json()

  // Runtime validation
  return SoulSchema.parse(data)
}
```

### Form Validation

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { IdentitySectionSchema } from '@xentri/ts-schema'

function IdentityForm() {
  const form = useForm({
    resolver: zodResolver(IdentitySectionSchema),
    defaultValues: {
      business_name: '',
      business_type: 'service',
      industry: '',
    },
  })

  // Form is type-safe and validated
}
```

---

## Constants & Enums

```typescript
// src/constants.ts
export const CATEGORIES = [
  'strategy',
  'marketing',
  'sales',
  'finance',
  'operations',
  'team',
  'legal',
] as const

export type Category = (typeof CATEGORIES)[number]

export const AUTONOMY_LEVELS = ['manual', 'assisted', 'supervised', 'autonomous'] as const

export type AutonomyLevel = (typeof AUTONOMY_LEVELS)[number]

export const TIERS = [
  'free',
  'presencia',
  'light_ops',
  'professional',
  'business',
  'enterprise',
] as const

export type Tier = (typeof TIERS)[number]
```

---

## Versioning

Schema changes follow these rules:

1. **Additive changes** (new optional fields) — No version bump
2. **Breaking changes** — Create new version (`v2`)
3. **Deprecations** — Mark as deprecated, remove in next major

```typescript
// Versioned schemas
export const SoulSchemaV1 = z.object({ ... });
export const SoulSchemaV2 = z.object({ ... }); // Breaking changes

// API versioning
app.get('/api/v1/soul', handleV1);
app.get('/api/v2/soul', handleV2);
```

---

## Testing Schemas

```typescript
// src/soul/__tests__/identity.test.ts
import { IdentitySectionSchema } from '../identity'

describe('IdentitySectionSchema', () => {
  it('validates valid identity', () => {
    const valid = {
      business_name: 'Acme Corp',
      business_type: 'service',
      industry: 'consulting',
    }

    expect(() => IdentitySectionSchema.parse(valid)).not.toThrow()
  })

  it('rejects invalid business_type', () => {
    const invalid = {
      business_name: 'Acme Corp',
      business_type: 'invalid',
      industry: 'consulting',
    }

    expect(() => IdentitySectionSchema.parse(invalid)).toThrow()
  })
})
```

---

## Related Documents

- [Core API Events](../core-api/events.md) — Event implementations
- [PRD IC-001](../prd.md#integration-contracts-ic-xxx) — Event envelope contract
