---
entity_type: infrastructure_module
document_type: epics
module: shell
title: 'Shell Module Epics'
description: 'Implementation stories for the Shell module.'
version: '1.0'
status: draft
created: '2025-12-03'
updated: '2025-12-03'
inherits_from:
  - 'docs/platform/epics.md'
---

# Shell Module - Epics & Stories

> **Entity Type:** Infrastructure Module
> **Module:** shell
> **Inherits From:** Constitution Epics (docs/platform/epics.md)

---

## Overview

This document contains implementation stories specific to the Shell module. These stories implement the Shell's portion of Constitution-level epic outcomes.

**Key Principle:** Stories here implement FR-SHL-xxx requirements. They trace back to Constitution Platform Requirements (PR-xxx) where applicable.

---

## Epic Alignment

| Constitution Epic      | Shell Contribution                            | Status  |
| ---------------------- | --------------------------------------------- | ------- |
| Epic 1: Foundation     | Shell chrome, navigation, auth integration    | Planned |
| Epic 2: Soul System    | Copilot widget hosting                        | Planned |
| Epic 3: Tool Framework | Module manifest loading, island orchestration | Planned |

---

## Shell Stories

### Story SHL-1.1: Shell Chrome Foundation

**Implements:** FR-SHL-001, FR-SHL-004, FR-SHL-005
**Traces To:** Constitution Epic 1

**Acceptance Criteria:**

- [ ] Astro 5.x project scaffolded at `apps/shell/`
- [ ] Persistent header renders on all routes
- [ ] Sidebar renders with 7 category icons
- [ ] Accordion behavior: only one category expanded at a time
- [ ] Sidebar collapse button toggles to icon-only mode
- [ ] Layout persists across client-side navigation

**Technical Notes:**

- Use Astro layouts for persistent chrome
- Nano Stores for sidebar state (collapsed/expanded, active category)

---

### Story SHL-1.2: React Island Architecture

**Implements:** FR-SHL-002, FR-SHL-006
**Traces To:** Constitution Epic 1, PR-007

**Acceptance Criteria:**

- [ ] React islands load via `client:only="react"` directive
- [ ] Islands receive ShellContext (route, user, org)
- [ ] Error boundary wraps each island
- [ ] Island crash shows error UI, doesn't break shell
- [ ] Loading state shown during island hydration

**Technical Notes:**

- TanStack Query for server state within islands
- Nano Stores for cross-island client state

---

### Story SHL-1.3: Authentication Integration

**Implements:** FR-SHL-003, FR-SHL-009
**Traces To:** PR-003, Constitution Epic 1

**Acceptance Criteria:**

- [ ] Clerk integration via @clerk/astro
- [ ] Protected routes redirect to sign-in
- [ ] User session available in ShellContext
- [ ] org_id extracted from Clerk Organizations
- [ ] All API calls include org_id header

**Technical Notes:**

- Use Clerk middleware for route protection
- JWT claims include org_id, org_role

---

### Story SHL-1.4: Navigation & Prefetching

**Implements:** FR-SHL-007
**Traces To:** Constitution Epic 1

**Acceptance Criteria:**

- [ ] Hover prefetching enabled for sidebar links
- [ ] View transitions for smooth navigation
- [ ] Back/forward browser navigation works correctly
- [ ] Deep links work (share URL → lands on correct view)

**Technical Notes:**

- Astro View Transitions API
- Prefetch on hover with 100ms debounce

---

### Story SHL-2.1: Copilot Widget Integration

**Implements:** FR-SHL-008
**Traces To:** Constitution Epic 2, ADR-012

**Acceptance Criteria:**

- [ ] Widget slot rendered in shell layout
- [ ] Widget receives current navigation context
- [ ] Widget supports collapsed/panel/full states
- [ ] Widget position persisted in localStorage
- [ ] Notification badge shows pending items

**Technical Notes:**

- Widget component from ui package
- Context resolution based on current route

---

### Story SHL-1.5: Theme Support

**Implements:** FR-SHL-010
**Traces To:** ADR-013 (Theme Architecture)

**Acceptance Criteria:**

- [ ] Light/dark theme toggle in header
- [ ] Theme preference persisted
- [ ] System preference detection as default
- [ ] Theme tokens from ui package applied

**Technical Notes:**

- CSS variables for theming
- prefers-color-scheme media query

---

## Traceability Matrix

| Story   | FR-SHL-xxx    | PR-xxx | IC-xxx | Status  |
| ------- | ------------- | ------ | ------ | ------- |
| SHL-1.1 | 001, 004, 005 | —      | —      | Planned |
| SHL-1.2 | 002, 006      | PR-007 | —      | Planned |
| SHL-1.3 | 003, 009      | PR-003 | —      | Planned |
| SHL-1.4 | 007           | —      | —      | Planned |
| SHL-2.1 | 008           | —      | —      | Planned |
| SHL-1.5 | 010           | —      | —      | Planned |

---

## Document History

| Version | Date       | Author              | Changes                                        |
| ------- | ---------- | ------------------- | ---------------------------------------------- |
| 1.0     | 2025-12-03 | Winston (Architect) | Initial scaffold for entity document structure |

---

_Stories in this module implement Shell-specific requirements (FR-SHL-xxx) and contribute to Constitution-level epic outcomes._
