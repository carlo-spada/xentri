---
entity_type: infrastructure_module
document_type: prd
module: shell
title: 'Shell Module PRD'
description: 'Requirements for the Astro application shell - routing, layout, and React island host.'
version: '1.0'
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

The Shell is the container application that hosts all micro-apps. It provides stable chrome (header, sidebar), authentication integration, and React island orchestration.

**What this module builds:**

- Module-specific interfaces (navigation, layout, copilot widget)
- Module-specific screens (shell chrome, error boundaries)
- Module-specific patterns (island hydration, prefetching)

**What this module inherits (constraints):**

- Design tokens from Constitution UX-Design
- Security model from Constitution Architecture (Clerk auth, RLS context)
- API conventions from Constitution Architecture

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
| FR-SHL-008 | Shell MUST host the Copilot Widget component                                           | P1       | Draft  |
| FR-SHL-009 | Shell MUST pass org_id context to all API calls                                        | P0       | Draft  |
| FR-SHL-010 | Shell MUST support light/dark theme toggle with persistence                            | P2       | Draft  |

<!--
REDISTRIBUTION NOTE:
Content to be moved here from Constitution documents:
- From architecture.md: Shell-specific implementation details
- From epics.md: Story 1.5 (Application Shell & Navigation) details
- From ux-design.md: No-scroll constraint implementation, sidebar behavior specs
-->

---

## Interfaces Provided

> Interfaces that sibling modules can depend on (per ADR-020 Sibling Dependency Law)

| Interface           | Description                                          | Consumers                  |
| ------------------- | ---------------------------------------------------- | -------------------------- |
| `ShellContext`      | Provides current route, user, org context to islands | All micro-apps             |
| `NavigationAPI`     | Programmatic navigation for micro-apps               | All micro-apps             |
| `CopilotWidgetSlot` | Slot for copilot widget integration                  | core-api (copilot service) |

---

## Interfaces Consumed

| Interface      | Provider             | Usage                            |
| -------------- | -------------------- | -------------------------------- |
| `AuthState`    | Clerk (@clerk/astro) | User authentication state        |
| `DesignTokens` | ui module            | Theme tokens and base components |
| `ApiClient`    | core-api module      | API calls via TanStack Query     |

---

## Traceability

### To Constitution Requirements

| Shell Requirement | Traces To | Notes                                    |
| ----------------- | --------- | ---------------------------------------- |
| FR-SHL-003        | PR-003    | All API endpoints require authentication |
| FR-SHL-006        | PR-007    | Modules must fail gracefully             |
| FR-SHL-009        | PR-001    | All database tables include org_id       |

### To Constitution Integration Contracts

| Shell Implementation         | Implements IC | Notes                        |
| ---------------------------- | ------------- | ---------------------------- |
| Island manifest registration | IC-003        | Module Registration Manifest |

---

## Technical Constraints

| Constraint         | Source                    | Notes                           |
| ------------------ | ------------------------- | ------------------------------- |
| Astro 5.x          | Constitution Architecture | Island architecture requirement |
| React 19.x         | Constitution Architecture | Micro-app runtime               |
| No-scroll viewport | Constitution UX-Design    | Full-screen experience          |

---

## Open Questions

| Question                                             | Owner     | Status |
| ---------------------------------------------------- | --------- | ------ |
| How does copilot widget integrate with shell layout? | Architect | Open   |
| PWA manifest requirements for mobile?                | UX        | Open   |

---

## Document History

| Version | Date       | Author              | Changes                                        |
| ------- | ---------- | ------------------- | ---------------------------------------------- |
| 1.0     | 2025-12-03 | Winston (Architect) | Initial scaffold for entity document structure |

---

_This module inherits constraints from the Constitution (docs/platform/prd.md). It can ADD requirements, never CONTRADICT parent constraints._
