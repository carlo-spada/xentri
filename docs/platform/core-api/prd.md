---
entity_type: infrastructure_module
document_type: prd
module: core-api
title: 'Core API Module PRD'
description: 'Requirements for the Core API service - authentication, events, organizations, and webhooks.'
version: '1.0'
status: draft
created: '2025-12-03'
updated: '2025-12-03'
inherits_from:
  - 'docs/platform/prd.md'
---

# Core API Module - Product Requirements Document

> **Entity Type:** Infrastructure Module
> **Module:** core-api
> **Package:** `services/core-api`
> **Inherits From:** Constitution (docs/platform/prd.md)

---

## Overview

The Core API is the central backend service providing authentication, event backbone, organization management, and the foundation for all domain services.

**What this module builds:**

- Event Backbone implementation (system_events table + Redis Streams)
- RLS middleware for multi-tenant isolation
- Clerk integration for authentication
- Organization provisioning and management
- Soul Gateway API endpoints

**What this module inherits (constraints):**

- Event envelope schema (IC-001, IC-002) from Constitution
- RLS pattern (PR-001, ADR-003) from Constitution Architecture
- Permission primitives (IC-007) from Constitution
- API conventions (Problem Details, versioning) from Constitution

---

## Requirements Index

> **Requirement ID Pattern:** `FR-API-xxx` (Functional Requirement - Core API)

### Functional Requirements

| ID         | Requirement                                                              | Priority | Status |
| ---------- | ------------------------------------------------------------------------ | -------- | ------ |
| FR-API-001 | Core API MUST implement system_events table with org_id and RLS          | P0       | Draft  |
| FR-API-002 | Core API MUST emit events with SystemEvent envelope (IC-001)             | P0       | Draft  |
| FR-API-003 | Core API MUST implement Clerk webhook handler for user/org sync          | P0       | Draft  |
| FR-API-004 | Core API MUST set transaction-scoped org_id for RLS enforcement          | P0       | Draft  |
| FR-API-005 | Core API MUST implement Soul Gateway endpoints (IC-004)                  | P1       | Draft  |
| FR-API-006 | Core API MUST implement recommendation submission endpoint (IC-005)      | P1       | Draft  |
| FR-API-007 | Core API MUST implement permission check middleware (IC-007)             | P0       | Draft  |
| FR-API-008 | Core API MUST implement health check endpoints (/health, /health/ready)  | P0       | Draft  |
| FR-API-009 | Core API MUST return Problem Details format for all errors               | P1       | Draft  |
| FR-API-010 | Core API MUST propagate trace_id across all requests                     | P1       | Draft  |
| FR-API-011 | Core API MUST implement Redis Streams for real-time event transport      | P1       | Draft  |
| FR-API-012 | Core API MUST implement dual-write pattern (Redis + Postgres) for events | P1       | Draft  |

<!--
REDISTRIBUTION NOTE:
Content to be moved here from Constitution documents:
- From architecture.md: ADR-003 RLS implementation details, Redis Streams config
- From epics.md: Stories 1.2, 1.3, 1.4, 1.5.1, 1.5.3, 1.5.4 implementation details
-->

---

## Interfaces Provided

> Interfaces that sibling modules can depend on (per ADR-020 Sibling Dependency Law)

| Interface         | Description                      | Consumers             |
| ----------------- | -------------------------------- | --------------------- |
| `EventEmitter`    | Emit events to Event Backbone    | All services          |
| `SoulGateway`     | Read Soul sections (IC-004)      | All copilots, modules |
| `PermissionCheck` | Verify user permissions (IC-007) | All services          |
| `OrgContext`      | Current organization context     | shell, all services   |

### API Endpoints

| Endpoint                            | Method | Description                | IC Reference |
| ----------------------------------- | ------ | -------------------------- | ------------ |
| `GET /api/v1/soul`                  | GET    | Full Soul read             | IC-004       |
| `GET /api/v1/soul/{section}`        | GET    | Section-specific Soul read | IC-004       |
| `SSE /api/v1/soul/stream`           | GET    | Real-time Soul updates     | IC-004       |
| `POST /api/v1/soul/recommendations` | POST   | Submit recommendation      | IC-005       |
| `GET /api/v1/events`                | GET    | Query events (org-scoped)  | IC-001       |
| `GET /health`                       | GET    | Liveness check             | —            |
| `GET /health/ready`                 | GET    | Readiness check (DB)       | —            |
| `POST /webhooks/clerk`              | POST   | Clerk webhook handler      | —            |

---

## Interfaces Consumed

| Interface            | Provider       | Usage                |
| -------------------- | -------------- | -------------------- |
| `SystemEvent` schema | ts-schema      | Event validation     |
| `SoulSchema`         | ts-schema      | Soul data validation |
| Clerk SDK            | @clerk/fastify | Authentication       |
| Prisma Client        | Generated      | Database access      |
| Redis Client         | ioredis        | Event streaming      |

---

## Traceability

### To Constitution Requirements

| API Requirement | Traces To                 | Notes                              |
| --------------- | ------------------------- | ---------------------------------- |
| FR-API-001      | PR-001                    | All tables include org_id with RLS |
| FR-API-002      | PR-002, IC-001, IC-002    | Events with standard envelope      |
| FR-API-004      | PR-001, ADR-003           | Fail-closed RLS pattern            |
| FR-API-005      | PR-004, IC-004            | Soul access through API only       |
| FR-API-006      | IC-005                    | Recommendation protocol            |
| FR-API-007      | PR-005, IC-007            | Permission enforcement             |
| FR-API-009      | Constitution Architecture | Problem Details format             |
| FR-API-010      | PR-006                    | Observability requirements         |

### To Constitution ADRs

| API Implementation | Implements ADR | Notes                                  |
| ------------------ | -------------- | -------------------------------------- |
| RLS middleware     | ADR-003        | Transaction-scoped context             |
| Redis Streams      | ADR-002        | Event envelope with versioning         |
| Dual-write pattern | ADR-002        | Redis (real-time) + Postgres (durable) |

---

## Technical Constraints

| Constraint      | Source                    | Notes                          |
| --------------- | ------------------------- | ------------------------------ |
| Fastify 5.x     | Constitution Architecture | Schema-first, high-performance |
| Prisma 7.x      | Constitution Architecture | Typed queries with RLS         |
| PostgreSQL 16.x | Constitution Architecture | RLS, pgvector support          |
| Redis Streams   | Constitution Architecture | Event transport                |

---

## Data Model

### system_events Table

```sql
CREATE TABLE system_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(255) NOT NULL,              -- e.g., "xentri.soul.updated.v1"
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  org_id UUID NOT NULL REFERENCES organizations(id),
  actor_type VARCHAR(50) NOT NULL,         -- "user" | "system" | "copilot"
  actor_id VARCHAR(255) NOT NULL,

  envelope_version VARCHAR(10) NOT NULL DEFAULT '1.0',
  payload_schema VARCHAR(255) NOT NULL,    -- e.g., "soul.updated@1.0"
  payload JSONB NOT NULL,

  priority VARCHAR(20),                    -- "critical" | "high" | "medium" | "low"
  correlation_id UUID,
  trace_id VARCHAR(255),

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS Policy (Fail-Closed)
ALTER TABLE system_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON system_events
USING (
  current_setting('app.current_org_id', true) IS NOT NULL
  AND org_id = current_setting('app.current_org_id', true)::uuid
);
```

---

## Open Questions

| Question                                     | Owner     | Status |
| -------------------------------------------- | --------- | ------ |
| Redis Streams consumer group configuration?  | Architect | Open   |
| Event retention policy (archival vs. purge)? | Architect | Open   |
| Rate limiting strategy for API endpoints?    | Architect | Open   |

---

## Document History

| Version | Date       | Author              | Changes                                        |
| ------- | ---------- | ------------------- | ---------------------------------------------- |
| 1.0     | 2025-12-03 | Winston (Architect) | Initial scaffold for entity document structure |

---

_This module inherits constraints from the Constitution (docs/platform/prd.md). It can ADD requirements, never CONTRADICT parent constraints._
