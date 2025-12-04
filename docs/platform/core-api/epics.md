---
entity_type: infrastructure_module
document_type: epics
module: core-api
title: 'Core API Module Epics'
description: 'Implementation stories for the Core API module.'
version: '1.0'
status: draft
created: '2025-12-03'
updated: '2025-12-03'
inherits_from:
  - 'docs/platform/epics.md'
---

# Core API Module - Epics & Stories

> **Entity Type:** Infrastructure Module
> **Module:** core-api
> **Inherits From:** Constitution Epics (docs/platform/epics.md)

---

## Overview

This document contains implementation stories specific to the Core API module. These stories implement the Core API's portion of Constitution-level epic outcomes.

**Key Principle:** Stories here implement FR-API-xxx requirements. They trace back to Constitution Platform Requirements (PR-xxx) and Integration Contracts (IC-xxx) where applicable.

---

## Epic Alignment

| Constitution Epic      | Core API Contribution                          | Status  |
| ---------------------- | ---------------------------------------------- | ------- |
| Epic 1: Foundation     | Event Backbone, Auth integration, RLS          | Planned |
| Epic 2: Soul System    | Soul Gateway API, Recommendation endpoints     | Planned |
| Epic 3: Tool Framework | Module registration API, Notification delivery | Planned |

---

## Core API Stories

### Story API-1.1: Database Schema & RLS Foundation

**Implements:** FR-API-001, FR-API-004
**Traces To:** PR-001, ADR-003, Constitution Epic 1

**Acceptance Criteria:**

- [ ] Prisma schema with `org_id` on all tables
- [ ] RLS policies created via migration
- [ ] `set_config('app.current_org_id', ...)` middleware
- [ ] Fail-closed behavior: missing org_id = empty result
- [ ] Smoke test confirms cross-org isolation

**Technical Notes:**

- Transaction-scoped context setting (not session)
- Prisma middleware sets context before queries

---

### Story API-1.2: Event Backbone (Postgres)

**Implements:** FR-API-002, FR-API-001
**Traces To:** PR-002, IC-001, IC-002, Constitution Epic 1

**Acceptance Criteria:**

- [ ] `system_events` table created with schema from PRD
- [ ] RLS policy enforces org isolation on events
- [ ] `EventEmitter` service emits with SystemEvent envelope
- [ ] Event type follows naming convention: `xentri.{category}.{entity}.{action}.{version}`
- [ ] Events include `trace_id` from request context

**Technical Notes:**

- Events are immutable (append-only)
- Use ts-schema `SystemEvent` type for validation

---

### Story API-1.3: Redis Streams Integration

**Implements:** FR-API-011, FR-API-012
**Traces To:** ADR-002, Constitution Epic 1

**Acceptance Criteria:**

- [ ] Redis client configured (Upstash or local)
- [ ] Consumer groups configured per category
- [ ] Dual-write: event writes to Redis (real-time) + Postgres (durable)
- [ ] Event envelope includes `dedupe_key` for idempotency
- [ ] Retry logic for Redis failures (fallback to Postgres-only)

**Technical Notes:**

- Redis is the "Nervous System" for real-time sync
- Postgres is the durable source of truth

---

### Story API-1.4: Clerk Authentication Integration

**Implements:** FR-API-003
**Traces To:** PR-003, Constitution Epic 1

**Acceptance Criteria:**

- [ ] @clerk/fastify middleware configured
- [ ] JWT verification on all `/api/*` routes
- [ ] Health endpoints excluded from auth
- [ ] Webhook handler for Clerk events (`/webhooks/clerk`)
- [ ] User sync: Clerk user → local users table
- [ ] Org sync: Clerk org → local organizations table

**Technical Notes:**

- Use Clerk Organizations for multi-tenancy
- JWT claims include `org_id`, `org_role`

---

### Story API-1.5: Health Check Endpoints

**Implements:** FR-API-008
**Traces To:** Constitution Epic 1

**Acceptance Criteria:**

- [ ] `GET /health` returns 200 (liveness)
- [ ] `GET /health/ready` checks database connection (readiness)
- [ ] Kubernetes probes configured in Helm chart
- [ ] Response includes version, uptime, timestamp

**Technical Notes:**

- Ready check should have short timeout (2s)
- Don't expose internal errors in response

---

### Story API-1.6: Error Handling & Problem Details

**Implements:** FR-API-009, FR-API-010
**Traces To:** Constitution Architecture, PR-006

**Acceptance Criteria:**

- [ ] All errors return `application/problem+json`
- [ ] Error response includes: type, title, status, detail, trace_id
- [ ] Validation errors include field-level details
- [ ] trace_id propagated from request headers or generated
- [ ] Sensitive data scrubbed from error details

**Technical Notes:**

- Use Fastify error handler plugin
- Log full error internally, return safe response externally

---

### Story API-2.1: Soul Gateway Endpoints

**Implements:** FR-API-005
**Traces To:** PR-004, IC-004, Constitution Epic 2

**Acceptance Criteria:**

- [ ] `GET /api/v1/soul` returns full Soul for org
- [ ] `GET /api/v1/soul/{section}` returns specific section
- [ ] `SSE /api/v1/soul/stream` streams Soul updates
- [ ] Redis cache with 5-minute TTL
- [ ] Cache invalidated on `xentri.soul.updated.v1` event
- [ ] ETag support for conditional requests

**Technical Notes:**

- Soul is read-only through this API
- Updates come through recommendation protocol

---

### Story API-2.2: Recommendation Submission

**Implements:** FR-API-006
**Traces To:** IC-005, Constitution Epic 2

**Acceptance Criteria:**

- [ ] `POST /api/v1/soul/recommendations` endpoint
- [ ] Request schema: `target_section`, `proposed_value`, `evidence`, `confidence`
- [ ] Emits `xentri.soul.recommendation.submitted.v1` event
- [ ] High-confidence (>0.9) + low-impact queued for auto-approve
- [ ] Low-confidence or high-impact flagged for human review
- [ ] Response includes recommendation ID and status

**Technical Notes:**

- Strategy Copilot evaluates during synthesis cycle
- Exception: War Room can approve immediately

---

### Story API-2.3: Permission Check Middleware

**Implements:** FR-API-007
**Traces To:** PR-005, IC-007, Constitution Epic 2

**Acceptance Criteria:**

- [ ] `requirePermission()` decorator/middleware
- [ ] Checks primitives: `view`, `edit`, `approve`, `configure`
- [ ] Permission context from JWT claims
- [ ] Fail-closed: missing permission = 403
- [ ] Permission check logged for audit
- [ ] `has_permission()` Postgres function for RLS integration

**Technical Notes:**

- 3-layer enforcement: UI gating, API middleware, database RLS
- Role → Permission mapping in database

---

## Traceability Matrix

| Story   | FR-API-xxx | PR-xxx | IC-xxx         | ADR     | Status  |
| ------- | ---------- | ------ | -------------- | ------- | ------- |
| API-1.1 | 001, 004   | PR-001 | —              | ADR-003 | Planned |
| API-1.2 | 001, 002   | PR-002 | IC-001, IC-002 | ADR-002 | Planned |
| API-1.3 | 011, 012   | PR-002 | IC-002         | ADR-002 | Planned |
| API-1.4 | 003        | PR-003 | —              | —       | Planned |
| API-1.5 | 008        | —      | —              | —       | Planned |
| API-1.6 | 009, 010   | PR-006 | —              | —       | Planned |
| API-2.1 | 005        | PR-004 | IC-004         | —       | Planned |
| API-2.2 | 006        | —      | IC-005         | —       | Planned |
| API-2.3 | 007        | PR-005 | IC-007         | —       | Planned |

---

## Document History

| Version | Date       | Author              | Changes                                        |
| ------- | ---------- | ------------------- | ---------------------------------------------- |
| 1.0     | 2025-12-03 | Winston (Architect) | Initial scaffold for entity document structure |

---

_Stories in this module implement Core API-specific requirements (FR-API-xxx) and contribute to Constitution-level epic outcomes._
