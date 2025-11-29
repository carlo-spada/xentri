# Backend

> API and services layer - authentication, events, and business logic.

**Category:** Platform (meta)
**Sub-category:** Backend
**Status:** Active

## Purpose

The Backend sub-category contains all API services that handle business logic, data persistence, and external integrations. Currently this includes the Core API, with future services to be added as the platform grows.

## Modules

| Module | Purpose | Package | Status |
|--------|---------|---------|--------|
| [core-api](./core-api/) | Primary Fastify API service | `services/core-api` | Active |

## Architecture

All backend services follow these patterns:
- **Event-First**: Business actions emit to `system_events` before domain tables
- **RLS Multi-tenancy**: Every query scoped by `org_id`
- **Structured Logging**: JSON logs with trace correlation

## Dependencies

| Depends On | Relationship |
|------------|--------------|
| `platform/shared/ts-schema` | Request/response contracts |

---

*See individual module READMEs for detailed documentation.*
