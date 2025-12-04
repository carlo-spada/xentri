# Core API

> Core API service - authentication, events, organizations, and webhooks.

**Package:** `services/core-api`
**Entity Type:** Infrastructure Module
**Status:** Active
**Live URL:** https://core-api-production-8016.up.railway.app

## Overview

The Core API is the central backend service that provides:

- Authentication via Clerk integration
- Organization provisioning and management
- Event Backbone (system_events table)
- Webhook handlers for external services
- Health check endpoints

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  Core API (Fastify 5.6)                  │
├─────────────────────────────────────────────────────────┤
│  Routes                                                  │
│  ├── /health, /health/ready    (Health checks)          │
│  ├── /api/v1/auth/*            (Auth endpoints)         │
│  ├── /api/v1/orgs/*            (Organization CRUD)      │
│  ├── /api/v1/events/*          (Event queries)          │
│  └── /webhooks/*               (Clerk webhooks)         │
├─────────────────────────────────────────────────────────┤
│  Middleware                                              │
│  ├── Auth (Clerk verification)                          │
│  ├── Logging (Pino + trace_id)                          │
│  └── Error handling (Sentry)                            │
├─────────────────────────────────────────────────────────┤
│  Prisma 7.0 + PostgreSQL 16.11                          │
│  (Row-Level Security for multi-tenancy)                 │
└─────────────────────────────────────────────────────────┘
```

## Key Patterns

- **Event-First**: All business actions emit to `system_events` before domain tables
- **RLS Enforcement**: Every query scoped to `org_id` via Prisma middleware
- **Structured Logging**: JSON logs with `trace_id`, `org_id`, `user_id`
- **Webhook Verification**: Clerk signature validation

## Dependencies

| Module               | Relationship                 |
| -------------------- | ---------------------------- |
| `platform/ts-schema` | Shared Zod schemas and types |

## Development

```bash
# Start core-api only
pnpm run dev --filter services/core-api

# API runs at http://localhost:3000

# Health check
curl http://localhost:3000/health
curl http://localhost:3000/health/ready
```

## API Reference

| Endpoint          | Method | Description                   |
| ----------------- | ------ | ----------------------------- |
| `/health`         | GET    | Basic liveness check          |
| `/health/ready`   | GET    | Readiness with database check |
| `/api/v1/brief`   | POST   | Create Brief event            |
| `/webhooks/clerk` | POST   | Clerk webhook handler         |

## Documentation Structure

```
docs/platform/core-api/
├── README.md              # This file
├── architecture.md        # Service architecture and patterns
├── api-reference.md       # API endpoint documentation
├── events.md              # Event schemas and contracts
└── sprint-artifacts/
    ├── sprint-status.yaml
    └── {story-files}.md
```

---

## Related Documents

- [Architecture](./architecture.md) — Service design and patterns
- [API Reference](./api-reference.md) — Endpoint documentation
- [Events](./events.md) — Event schemas (IC-001, IC-002)
