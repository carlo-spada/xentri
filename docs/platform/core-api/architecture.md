# Core API Architecture

> **Module:** core-api
> **Type:** Infrastructure Module
> **Parent:** Constitution

---

## Overview

The Core API service is the primary backend for Xentri, handling:

- Event persistence and querying
- Soul data management
- Authentication/authorization enforcement
- Multi-tenant data isolation via RLS

---

## Technology Stack

| Component | Technology | Version  |
| --------- | ---------- | -------- |
| Runtime   | Node.js    | 24.x LTS |
| Framework | Fastify    | 5.x      |
| ORM       | Prisma     | 7.x      |
| Database  | PostgreSQL | 16.x     |
| Auth      | Clerk      | 2.x      |

---

## Service Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Fastify Server                          │
├──────────────┬──────────────┬──────────────┬────────────────┤
│   Routes     │  Middleware  │   Services   │    Plugins     │
│  /api/v1/*   │  orgContext  │  eventService│   cors, auth   │
│              │  authGuard   │  soulService │   swagger      │
└──────┬───────┴──────┬───────┴──────┬───────┴────────────────┘
       │              │              │
       └──────────────┼──────────────┘
                      │
              ┌───────┴───────┐
              │ Prisma Client │
              └───────┬───────┘
                      │
              ┌───────┴───────┐
              │  PostgreSQL   │
              │   (with RLS)  │
              └───────────────┘
```

---

## Key Patterns

### Multi-Tenant Isolation (PR-001)

Every request includes `org_id` from JWT claims:

```typescript
// Middleware extracts org_id from Clerk JWT
const orgId = req.auth.orgId

// All queries automatically scoped
const events = await prisma.systemEvent.findMany({
  where: { org_id: orgId },
})
```

RLS policies enforce isolation at the database level as a defense-in-depth measure.

### Event-First Architecture (PR-002)

All mutations emit events before returning:

```typescript
async function createInvoice(data) {
  // 1. Write to system_events first
  await eventService.emit({
    type: 'xentri.finance.invoice.created.v1',
    payload: data,
  })

  // 2. Then write to domain table
  return prisma.invoice.create({ data })
}
```

### Error Handling

All errors follow Problem Details format (RFC 7807):

```json
{
  "type": "https://xentri.io/errors/not-found",
  "title": "Resource Not Found",
  "status": 404,
  "detail": "Invoice with ID 123 not found",
  "trace_id": "abc-123-def"
}
```

---

## Directory Structure

```
services/core-api/
├── src/
│   ├── routes/           # API route handlers
│   ├── services/         # Business logic
│   ├── middleware/       # Request middleware
│   ├── plugins/          # Fastify plugins
│   └── index.ts          # Server entry point
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── migrations/       # Migration history
└── tests/
    ├── unit/
    └── integration/
```

---

## Related Documents

- [API Reference](./api-reference.md) — Endpoint documentation
- [Events](./events.md) — Event schema definitions
- [Constitution Architecture](../architecture.md) — System-wide decisions
