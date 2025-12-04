---
entity_type: infrastructure_module
document_type: epics
module: ts-schema
title: 'TS Schema Module Epics'
description: 'Implementation stories for the TS Schema module.'
version: '1.0'
status: draft
created: '2025-12-03'
updated: '2025-12-03'
inherits_from:
  - 'docs/platform/epics.md'
---

# TS Schema Module - Epics & Stories

> **Entity Type:** Infrastructure Module
> **Module:** ts-schema
> **Inherits From:** Constitution Epics (docs/platform/epics.md)

---

## Overview

This document contains implementation stories specific to the TS Schema module. These stories implement the contract layer that all other modules depend on.

**Key Principle:** Stories here implement FR-TSS-xxx requirements. They trace back to Constitution Integration Contracts (IC-xxx) and ADRs.

---

## Epic Alignment

| Constitution Epic      | TS Schema Contribution                     | Status  |
| ---------------------- | ------------------------------------------ | ------- |
| Epic 1: Foundation     | SystemEvent schema, base types             | Planned |
| Epic 2: Soul System    | Soul schema, Recommendation schema         | Planned |
| Epic 3: Tool Framework | ModuleManifest schema, Notification schema | Planned |

---

## TS Schema Stories

### Story TSS-1.1: Project Setup & Build Pipeline

**Implements:** FR-TSS-002, FR-TSS-003
**Traces To:** Constitution Epic 1

**Acceptance Criteria:**

- [ ] Package scaffolded at `packages/ts-schema`
- [ ] Zod as runtime validation library
- [ ] TypeScript compilation configured
- [ ] Export both schemas and inferred types
- [ ] `pnpm run build` produces dist/
- [ ] `pnpm run typecheck` passes

**Technical Notes:**

- Use `z.infer<typeof Schema>` for type inference
- Export patterns: `export { SchemaName, type SchemaType }`

---

### Story TSS-1.2: SystemEvent Schema (IC-001)

**Implements:** FR-TSS-001, FR-TSS-009
**Traces To:** IC-001, IC-002, ADR-002, Constitution Epic 1

**Acceptance Criteria:**

- [ ] `SystemEventSchema` with all fields from IC-001
- [ ] Generic `TPayload` type parameter
- [ ] Event type pattern validation: `xentri.{category}.{entity}.{action}.{version}`
- [ ] Schema version field: `envelope_version: "1.0"`
- [ ] Payload schema reference: `payload_schema: "entity.action@1.0"`
- [ ] Export `SystemEvent<T>` type

**Technical Notes:**

- Use Zod `.refine()` for event type pattern validation
- Include `dedupe_key` for idempotency

---

### Story TSS-1.3: JSON Schema Generation Pipeline

**Implements:** FR-TSS-003, FR-TSS-010
**Traces To:** ADR-009, Constitution Epic 1

**Acceptance Criteria:**

- [ ] Install `zod-to-json-schema` dependency
- [ ] `pnpm run generate:schemas` script
- [ ] Output to `schemas/*.json`
- [ ] CI runs generation on ts-schema changes
- [ ] JSON Schema diff report in PR comments
- [ ] Breaking change detection (field removal, type change)

**Technical Notes:**

- Custom Zod validators (.refine()) don't auto-translate
- Document which schemas require manual Python tests

---

### Story TSS-1.4: Base API Types

**Implements:** FR-TSS-002
**Traces To:** Constitution Epic 1

**Acceptance Criteria:**

- [ ] `ApiResponse<T>` wrapper type
- [ ] `ProblemDetails` error type (RFC 7807)
- [ ] `PaginatedResponse<T>` for list endpoints
- [ ] Common field types: `UUID`, `ISO8601`, `Email`
- [ ] Export all types

**Technical Notes:**

- ProblemDetails: type, title, status, detail, trace_id
- Use branded types for UUID, ISO8601 if needed

---

### Story TSS-2.1: Soul Schema

**Implements:** FR-TSS-004
**Traces To:** PR-004, IC-004, ADR-006, Constitution Epic 2

**Acceptance Criteria:**

- [ ] `SoulSchema` with sections: identity, offerings, goals
- [ ] `SoulSectionSchema` for individual sections
- [ ] Version field for Soul updates
- [ ] Human-sovereign vs AI-updateable section markers
- [ ] Export `Soul` and `SoulSection` types

**Technical Notes:**

- Based on Tri-State Memory Architecture (ADR-006)
- Semantic Memory structure

---

### Story TSS-2.2: PulseItem Schema

**Implements:** FR-TSS-005
**Traces To:** ADR-011, Constitution Epic 2

**Acceptance Criteria:**

- [ ] `PulseItemSchema` with all fields from ADR-011
- [ ] `PulseScope` union type
- [ ] Importance levels 1-5
- [ ] `promoted_from` for escalation tracking
- [ ] Export `PulseItem` and `PulseScope` types

**Technical Notes:**

- Scope patterns: strategy, category.{name}, subcategory.{name}, module.{name}

---

### Story TSS-2.3: Recommendation Schema (IC-005)

**Implements:** FR-TSS-007
**Traces To:** IC-005, Constitution Epic 2

**Acceptance Criteria:**

- [ ] `RecommendationSchema` with IC-005 fields
- [ ] `protocol_version: "1.0"` field
- [ ] Confidence range 0.0 - 1.0
- [ ] Status enum: pending, approved, rejected
- [ ] Export `Recommendation` type

**Technical Notes:**

- Used by copilots to submit Soul recommendations
- Evaluated by Strategy Copilot during synthesis

---

### Story TSS-2.4: Permission Schema (IC-007)

**Implements:** FR-TSS-008
**Traces To:** PR-005, IC-007, Constitution Epic 2

**Acceptance Criteria:**

- [ ] `PermissionPrimitive` enum: view, edit, approve, configure
- [ ] `PermissionGrant` schema for role → permission mapping
- [ ] `permission_version: "1.0"` field
- [ ] Export all permission types

**Technical Notes:**

- Primitives compose into roles per organization
- Used by core-api middleware and shell UI gating

---

### Story TSS-3.1: ModuleManifest Schema (IC-003)

**Implements:** FR-TSS-002
**Traces To:** IC-003, Constitution Epic 3

**Acceptance Criteria:**

- [ ] `ModuleManifestSchema` with IC-003 structure
- [ ] `manifest_version: "1.0"` field
- [ ] Routes, navigation, permissions_required arrays
- [ ] Events emitted/consumed declarations
- [ ] Soul fields read/contribute declarations
- [ ] Export `ModuleManifest` type

**Technical Notes:**

- Used by shell to lazy-load modules
- Validated at build time

---

### Story TSS-3.2: StoryArc Schema

**Implements:** FR-TSS-006
**Traces To:** ADR-013, Constitution Epic 3

**Acceptance Criteria:**

- [ ] `StoryArcSchema` with ADR-013 structure
- [ ] Arc types: deal, goal, project, improvement, custom
- [ ] Progress types: timeline, percentage, milestone
- [ ] Status: active, paused, completed, abandoned
- [ ] Export `StoryArc` type

**Technical Notes:**

- Supports Narrative Continuity UX
- Tracked across sessions

---

### Story TSS-3.3: Notification Schema (IC-006)

**Implements:** FR-TSS-002
**Traces To:** IC-006, Constitution Epic 3

**Acceptance Criteria:**

- [ ] `NotificationPayloadSchema` with IC-006 fields
- [ ] Priority: critical, high, medium, low
- [ ] `notification_version: "1.0"` field
- [ ] Scope for targeting
- [ ] Export `NotificationPayload` type

**Technical Notes:**

- Used by modules to emit notification events
- Infrastructure handles delivery routing

---

## Traceability Matrix

| Story   | FR-TSS-xxx | IC-xxx         | ADR     | Status  |
| ------- | ---------- | -------------- | ------- | ------- |
| TSS-1.1 | 002, 003   | —              | —       | Planned |
| TSS-1.2 | 001, 009   | IC-001, IC-002 | ADR-002 | Planned |
| TSS-1.3 | 003, 010   | —              | ADR-009 | Planned |
| TSS-1.4 | 002        | —              | —       | Planned |
| TSS-2.1 | 004        | IC-004         | ADR-006 | Planned |
| TSS-2.2 | 005        | —              | ADR-011 | Planned |
| TSS-2.3 | 007        | IC-005         | —       | Planned |
| TSS-2.4 | 008        | IC-007         | —       | Planned |
| TSS-3.1 | 002        | IC-003         | —       | Planned |
| TSS-3.2 | 006        | —              | ADR-013 | Planned |
| TSS-3.3 | 002        | IC-006         | —       | Planned |

---

## Document History

| Version | Date       | Author              | Changes                                        |
| ------- | ---------- | ------------------- | ---------------------------------------------- |
| 1.0     | 2025-12-03 | Winston (Architect) | Initial scaffold for entity document structure |

---

_Stories in this module implement TS Schema-specific requirements (FR-TSS-xxx) and contribute to Constitution-level epic outcomes._
