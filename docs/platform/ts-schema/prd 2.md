---
entity_type: infrastructure_module
document_type: prd
module: ts-schema
title: 'TS Schema Module PRD'
description: 'Requirements for the shared TypeScript types and Zod schemas - the contract layer.'
version: '1.0'
status: draft
created: '2025-12-03'
updated: '2025-12-03'
inherits_from:
  - 'docs/platform/prd.md'
---

# TS Schema Module - Product Requirements Document

> **Entity Type:** Infrastructure Module
> **Module:** ts-schema
> **Package:** `packages/ts-schema`
> **Inherits From:** Constitution (docs/platform/prd.md)

---

## Overview

The ts-schema package is the **single source of truth** for all data contracts across the Xentri platform. It defines TypeScript types, Zod schemas for runtime validation, and generates JSON Schema for cross-runtime compatibility with Python services.

**What this module builds:**

- SystemEvent envelope schema (IC-001)
- Soul schemas and types
- API request/response contracts
- JSON Schema generation pipeline for Python

**What this module inherits (constraints):**

- Event envelope specification (IC-001, IC-002) from Constitution
- Soul structure requirements from Constitution Architecture
- Cross-runtime contract strategy (ADR-009) from Constitution

---

## Requirements Index

> **Requirement ID Pattern:** `FR-TSS-xxx` (Functional Requirement - TS Schema)

### Functional Requirements

| ID         | Requirement                                                              | Priority | Status |
| ---------- | ------------------------------------------------------------------------ | -------- | ------ |
| FR-TSS-001 | ts-schema MUST define SystemEvent envelope matching IC-001 specification | P0       | Draft  |
| FR-TSS-002 | ts-schema MUST export both Zod schemas and inferred TypeScript types     | P0       | Draft  |
| FR-TSS-003 | ts-schema MUST generate JSON Schema from Zod schemas                     | P0       | Draft  |
| FR-TSS-004 | ts-schema MUST define Soul schema (Semantic Memory structure)            | P1       | Draft  |
| FR-TSS-005 | ts-schema MUST define PulseItem schema per ADR-011                       | P1       | Draft  |
| FR-TSS-006 | ts-schema MUST define StoryArc schema per ADR-013                        | P2       | Draft  |
| FR-TSS-007 | ts-schema MUST define Recommendation schema per IC-005                   | P1       | Draft  |
| FR-TSS-008 | ts-schema MUST define Permission primitives per IC-007                   | P1       | Draft  |
| FR-TSS-009 | ts-schema MUST version all schemas (e.g., `soul@1.0`)                    | P0       | Draft  |
| FR-TSS-010 | ts-schema MUST validate that schema changes don't break consumers        | P1       | Draft  |

<!--
REDISTRIBUTION NOTE:
Content to be moved here from Constitution documents:
- From architecture.md: ADR-002 SystemEvent interface, ADR-011 PulseItem, ADR-013 StoryArc
- From prd.md: IC-001, IC-005, IC-007 schema definitions
-->

---

## Interfaces Provided

> Interfaces that sibling modules can depend on (per ADR-020 Sibling Dependency Law)

| Interface             | Description                    | Consumers              |
| --------------------- | ------------------------------ | ---------------------- |
| `SystemEvent<T>`      | Event envelope type (IC-001)   | core-api, all services |
| `Soul`                | Complete Soul type             | core-api, copilots     |
| `SoulSection`         | Individual Soul section type   | core-api, copilots     |
| `PulseItem`           | Pulse data item                | shell, copilots        |
| `StoryArc`            | Narrative arc type             | shell, copilots        |
| `Recommendation`      | Recommendation submission type | core-api, copilots     |
| `PermissionPrimitive` | Permission enum                | core-api, shell        |

### Exported Schemas

| Schema                 | Usage                           |
| ---------------------- | ------------------------------- |
| `SystemEventSchema`    | Validate events before emission |
| `SoulSchema`           | Validate Soul data              |
| `PulseItemSchema`      | Validate Pulse items            |
| `RecommendationSchema` | Validate recommendations        |

---

## Interfaces Consumed

| Interface | Provider | Usage                     |
| --------- | -------- | ------------------------- |
| None      | —        | ts-schema is foundational |

---

## Traceability

### To Constitution Integration Contracts

| Schema                | Implements IC | Notes                                           |
| --------------------- | ------------- | ----------------------------------------------- |
| `SystemEvent`         | IC-001        | Event envelope schema                           |
| Event naming pattern  | IC-002        | `xentri.{category}.{entity}.{action}.{version}` |
| `ModuleManifest`      | IC-003        | Module registration format                      |
| `SoulAccess` types    | IC-004        | Soul Gateway types                              |
| `Recommendation`      | IC-005        | Recommendation submission                       |
| `NotificationPayload` | IC-006        | Notification delivery                           |
| `PermissionCheck`     | IC-007        | Permission primitives                           |

### To Constitution ADRs

| Schema             | Implements ADR | Notes                           |
| ------------------ | -------------- | ------------------------------- |
| `SystemEvent`      | ADR-002        | Event envelope with versioning  |
| `PulseItem`        | ADR-011        | Hierarchical Pulse architecture |
| `StoryArc`         | ADR-013        | Narrative continuity            |
| JSON Schema bridge | ADR-009        | Cross-runtime contracts         |

---

## Schema Definitions

### SystemEvent (IC-001)

```typescript
interface SystemEvent<TPayload = unknown> {
  // Identity
  id: string; // UUID, immutable
  type: string; // e.g., "xentri.sales.deal.created.v1"
  occurred_at: string; // ISO8601 UTC

  // Tenant context
  org_id: string; // Required for all events
  actor: {
    type: 'user' | 'system' | 'copilot';
    id: string;
  };

  // Schema
  envelope_version: '1.0';
  payload_schema: string; // e.g., "deal.created@1.0"
  payload: TPayload;

  // Routing
  priority?: 'critical' | 'high' | 'medium' | 'low';
  attention?: boolean; // Show in Attention Dashboard?
  searchable?: boolean; // Index for search?
  search_text?: string; // Indexable content

  // Tracing
  correlation_id?: string; // Workflow/thread ID
  trace_id?: string; // Distributed trace
  dedupe_key?: string; // Idempotency key

  // Metadata
  meta: {
    source: string; // e.g., "sales-crm"
    environment: 'local' | 'staging' | 'prod';
  };
}
```

### PulseItem (ADR-011)

```typescript
interface PulseItem {
  id: string;
  scope: PulseScope; // strategy | category.{name} | etc.
  source_event_id: string;
  importance: 1 | 2 | 3 | 4 | 5; // 1 = highest
  title: string;
  summary: string;
  action_required: boolean;
  action_url?: string;
  expires_at?: string;
  created_at: string;
  promoted_from?: string;
}

type PulseScope = 'strategy' | `category.${string}` | `subcategory.${string}` | `module.${string}`;
```

### Recommendation (IC-005)

```typescript
interface Recommendation {
  id: string;
  org_id: string;
  target_section: string; // Soul section to update
  proposed_value: unknown; // The proposed change
  evidence: string; // Why this recommendation
  confidence: number; // 0.0 - 1.0
  source_agent: string; // Which copilot recommended
  protocol_version: '1.0';
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}
```

---

## JSON Schema Generation Pipeline

Per ADR-009, ts-schema generates JSON Schema for Python consumption:

```
ts-schema (Zod)
  → zod-to-json-schema
  → schemas/*.json
  → datamodel-codegen (Python)
  → py-schema/*.py
```

### CI Enforcement

- `pnpm run generate:schemas` runs on any ts-schema change
- JSON Schema diff in CI detects breaking changes
- Breaking changes require version bump and N-1 support

---

## Technical Constraints

| Constraint         | Source                    | Notes                  |
| ------------------ | ------------------------- | ---------------------- |
| Zod 3.x            | Constitution Architecture | Runtime validation     |
| TypeScript 5.x     | Constitution Architecture | Type definitions       |
| zod-to-json-schema | ADR-009                   | JSON Schema generation |

---

## Open Questions

| Question                                    | Owner     | Status |
| ------------------------------------------- | --------- | ------ |
| Soul section structure finalized?           | Architect | Open   |
| How to handle Zod .refine() in JSON Schema? | Architect | Open   |
| Schema registry for version discovery?      | Architect | Open   |

---

## Document History

| Version | Date       | Author              | Changes                                        |
| ------- | ---------- | ------------------- | ---------------------------------------------- |
| 1.0     | 2025-12-03 | Winston (Architect) | Initial scaffold for entity document structure |

---

_This module inherits constraints from the Constitution (docs/platform/prd.md). It can ADD requirements, never CONTRADICT parent constraints._
