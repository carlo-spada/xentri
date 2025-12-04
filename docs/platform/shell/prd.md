---
entity_type: infrastructure_module
document_type: prd
module: shell
title: 'Shell Module PRD'
description: 'Requirements for the Astro application shell - routing, layout, React island host, and Copilot Widget.'
version: '2.0'
status: draft
created: '2025-12-03'
updated: '2025-12-03'
inherits_from:
  - 'docs/platform/prd.md'
---

# Shell Module - Product Requirements Document

> **Entity Type:** Infrastructure Module
> **Module:** shell
> **Package:** `apps/shell`
> **Inherits From:** Constitution (docs/platform/prd.md)

---

## Overview

The Shell is the container application that hosts all micro-apps. It provides stable chrome (header, sidebar), authentication integration, React island orchestration, and the Copilot Widget.

**What this module builds:**

- Persistent navigation chrome (header, sidebar)
- React island orchestration with error boundaries
- Copilot Widget component and context resolution
- Hierarchical Pulse view navigation
- Module manifest registration (IC-003)

**What this module inherits (constraints):**

- Design tokens from Constitution UX-Design
- Security model from Constitution Architecture (Clerk auth, RLS context)
- API conventions from Constitution Architecture
- No-scroll viewport constraint from Constitution UX-Design

---

## Requirements Index

> **Requirement ID Pattern:** `FR-SHL-xxx` (Functional Requirement - Shell)

### Functional Requirements

| ID         | Requirement                                                                            | Priority | Status |
| ---------- | -------------------------------------------------------------------------------------- | -------- | ------ |
| FR-SHL-001 | Shell MUST render persistent header and sidebar across all views                       | P0       | Draft  |
| FR-SHL-002 | Shell MUST lazy-load React islands via `client:only="react"`                           | P0       | Draft  |
| FR-SHL-003 | Shell MUST integrate Clerk authentication and maintain auth state                      | P0       | Draft  |
| FR-SHL-004 | Shell MUST implement accordion sidebar (one category expanded at a time)               | P1       | Draft  |
| FR-SHL-005 | Shell MUST support sidebar collapse to icon-only mode                                  | P1       | Draft  |
| FR-SHL-006 | Shell MUST implement error boundaries to prevent micro-app crashes from breaking shell | P0       | Draft  |
| FR-SHL-007 | Shell MUST support hover prefetching for instant navigation                            | P1       | Draft  |
| FR-SHL-008 | Shell MUST host the Copilot Widget component with context awareness                    | P1       | Draft  |
| FR-SHL-009 | Shell MUST pass org_id context to all API calls                                        | P0       | Draft  |
| FR-SHL-010 | Shell MUST support light/dark theme toggle with persistence                            | P2       | Draft  |
| FR-SHL-011 | Shell MUST implement hierarchical Pulse view navigation                                | P1       | Draft  |
| FR-SHL-012 | Shell MUST register modules via manifest format (IC-003)                               | P0       | Draft  |
| FR-SHL-013 | Shell MUST implement no-scroll viewport constraint                                     | P0       | Draft  |
| FR-SHL-014 | Shell MUST support Chronicle (narrative) and Efficiency (list) view toggle             | P2       | Draft  |

---

## No-Scroll Design Constraint

> **Migrated from Constitution PRD §User Experience Principles**

**Decision:** The entire application is a full-screen experience with zero scrolling.

**Rationale:** Scrolling creates cognitive overhead and hides information. A calm system shows everything that matters in a single view.

**Implications:**

| Component        | Constraint                                                                       |
| ---------------- | -------------------------------------------------------------------------------- |
| **Sidebar**      | Only one category expanded at a time; collapsible to icons for maximum SPA space |
| **Content area** | All Pulse views, forms, and content must fit viewport                            |
| **Module tabs**  | Overflow handling required (if 10+ modules, show most-used + "more" overflow)    |
| **Mobile**       | Fundamentally different layout required (separate design needed)                 |

**Exception:** Long-form content (documentation, legal text, detailed reports) may scroll within a dedicated content area, but the shell frame remains fixed.

---

## Sidebar Behavior

> **Migrated from Constitution PRD §User Experience Principles**

1. Categories only in sidebar (7 items max)
2. Click category → sub-categories expand inline (shows only recommended + owned)
3. Click sub-category → SPA loads with module tabs at top
4. Only ONE category expanded at a time (accordion pattern)
5. Sidebar can collapse to icon-only mode for maximum SPA space

---

## Hierarchical Pulse Views

> **Migrated from Constitution PRD §Core Architecture Concepts**

**Decision:** Every level of the hierarchy exposes its own Pulse view.

| Level            | Pulse View         | Content                                  | Who Sees It                      |
| ---------------- | ------------------ | ---------------------------------------- | -------------------------------- |
| **Strategy**     | Strategy Pulse     | What survived all 4 layers of filtering  | Owner/Founder — the CEO briefing |
| **Category**     | Category Pulse     | What's happening in that category        | Category managers                |
| **Sub-category** | Sub-category Pulse | What's happening in that sub-category    | Team leads                       |
| **Module**       | Module Pulse       | What's happening in that specific module | Module users                     |

### Landing Logic

- User lands on their **highest-level available** Pulse based on permissions
- Multi-scope users land on **most recently used** scope
- Owner lands on Strategy Pulse by default

### Drilling Down

Users can always drill down from any Pulse to see more detail:

- Strategy Pulse → Click category → Category Pulse → Click sub-category → Sub-category Pulse → Click module → Module Pulse

Each level shows what was promoted from below, with links to the source for context.

---

## Context-Aware Copilot Widget

> **Migrated from Constitution PRD §Core Architecture Concepts**

**Decision:** A draggable widget that summons the context-relevant copilot.

### Widget States

| State         | Appearance                      | Function                             |
| ------------- | ------------------------------- | ------------------------------------ |
| **Collapsed** | Small icon + notification badge | User-positionable anywhere on screen |
| **Panel**     | Right or bottom panel           | Shares screen with SPA content       |
| **Full**      | Replaces main content area      | Full copilot focus, SPA hidden       |

### Context Awareness

The widget shows the copilot relevant to the current view:

- Viewing Strategy Pulse → Strategy Copilot
- Viewing Finance category → Finance Copilot
- Viewing Invoicing module → Invoicing Sub-agent

### Response Modes

| Mode                 | When                              | Experience                       |
| -------------------- | --------------------------------- | -------------------------------- |
| **Quick Answer**     | Short question, collapsed widget  | Streaming text in small overlay  |
| **Full Interaction** | Complex question, expanded widget | Full chat with history and tools |

**Notification Badge:** Shows count of unread copilot suggestions and pending recommendations for the current scope.

### Position Persistence

- Collapsed position stored in localStorage
- Default: bottom-right corner
- Constraints: 48px from edges minimum

---

## Narrative-First Philosophy (Chronicle View)

> **Migrated from Constitution PRD §User Experience Principles**

**Decision:** The default experience is a journal-like "Chronicle" that tells the business story, not a dashboard of widgets.

**Core Elements:**

- **Chronicle View (Default):** "Since yesterday...", "Story Arcs", "Here's what developed."
- **Efficiency Toggle:** Power users can switch to a dense, list-based view.
- **Session Bridging:** System detects absence duration and generates a narrative recap on return.
- **Story Arcs:** Persistent threads that evolve across sessions (e.g., "Deal Negotiation - Day 3").

**Theme Architecture:**

- **Modern (Default):** Conversational, immersive, gradient accents.
- **Power:** High density, high contrast, speed-focused.
- **Traditional:** Professional, balanced, business-like.

---

## Module Registration Manifest (IC-003)

> **Migrated from Constitution PRD §Sub-category Integration Contracts**

Every sub-category/module must register with the Shell via manifest format:

```yaml
# IC-003: Module Registration Manifest v1.0
manifest_version: '1.0'
name: 'sales-crm'
category: 'sales'
subcategory: 'pipeline'
routes:
  - path: '/sales/pipeline'
    component: 'PipelineView'
navigation:
  label: 'Pipeline'
  icon: 'funnel'
  parent: 'sales'
permissions_required:
  - 'sales.pipeline.view'
events_emitted:
  - 'xentri.sales.deal.created'
  - 'xentri.sales.deal.updated'
events_consumed:
  - 'xentri.soul.updated'
soul_fields_read:
  - 'business_type'
  - 'sales_cycle_length'
```

Shell responsibilities:

- Parse and validate manifests at build time
- Generate navigation from registered modules
- Enforce permission checks before loading islands
- Subscribe to declared event types

---

## Interfaces Provided

> Interfaces that sibling modules can depend on (per ADR-020 Sibling Dependency Law)

| Interface           | Description                                          | Consumers                  |
| ------------------- | ---------------------------------------------------- | -------------------------- |
| `ShellContext`      | Provides current route, user, org context to islands | All micro-apps             |
| `NavigationAPI`     | Programmatic navigation for micro-apps               | All micro-apps             |
| `CopilotWidgetSlot` | Slot for copilot widget integration                  | core-api (copilot service) |
| `PulseNavigation`   | Navigate between Pulse views                         | All micro-apps             |
| `ManifestRegistry`  | Registered module manifests                          | All micro-apps             |

---

## Interfaces Consumed

| Interface      | Provider             | Usage                            |
| -------------- | -------------------- | -------------------------------- |
| `AuthState`    | Clerk (@clerk/astro) | User authentication state        |
| `DesignTokens` | ui module            | Theme tokens and base components |
| `ApiClient`    | core-api module      | API calls via TanStack Query     |
| `PulseItem`    | ts-schema            | Pulse data structure             |

---

## Traceability

### To Constitution Requirements

| Shell Requirement | Traces To | Notes                                    |
| ----------------- | --------- | ---------------------------------------- |
| FR-SHL-003        | PR-003    | All API endpoints require authentication |
| FR-SHL-006        | PR-007    | Modules must fail gracefully             |
| FR-SHL-009        | PR-001    | All database tables include org_id       |
| FR-SHL-013        | PR-007    | No-scroll constraint                     |

### To Constitution Integration Contracts

| Shell Implementation         | Implements IC | Notes                        |
| ---------------------------- | ------------- | ---------------------------- |
| Module manifest registration | IC-003        | Module Registration Manifest |
| Notification badge           | IC-006        | Notification delivery        |

### To Constitution ADRs

| Shell Implementation | Implements ADR | Notes                       |
| -------------------- | -------------- | --------------------------- |
| Copilot widget       | ADR-012        | Context-aware widget states |
| Theme toggle         | ADR-013        | Theme architecture          |
| Pulse navigation     | ADR-011        | Hierarchical Pulse          |

---

## Technical Constraints

| Constraint         | Source                    | Notes                           |
| ------------------ | ------------------------- | ------------------------------- |
| Astro 5.x          | Constitution Architecture | Island architecture requirement |
| React 19.x         | Constitution Architecture | Micro-app runtime               |
| No-scroll viewport | Constitution UX-Design    | Full-screen experience          |
| Nano Stores        | Constitution Architecture | Cross-island state              |

---

## Open Questions

| Question                                             | Owner     | Status |
| ---------------------------------------------------- | --------- | ------ |
| How does copilot widget integrate with shell layout? | Architect | Closed |
| PWA manifest requirements for mobile?                | UX        | Open   |
| Chronicle view content generation?                   | Architect | Open   |

---

## Document History

| Version | Date       | Author              | Changes                                                               |
| ------- | ---------- | ------------------- | --------------------------------------------------------------------- |
| 1.0     | 2025-12-03 | Winston (Architect) | Initial scaffold for entity document structure                        |
| 2.0     | 2025-12-03 | Winston (Architect) | Migrated content from Constitution PRD: Copilot Widget, Pulse, IC-003 |

---

_This module inherits constraints from the Constitution (docs/platform/prd.md). It can ADD requirements, never CONTRADICT parent constraints._
