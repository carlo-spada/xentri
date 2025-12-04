---
id: SYS.009
type: commission
title: 'Core API Module Commission'
status: approved
entity_path: docs/platform/
created: 2025-12-04
updated: 2025-12-04
author: Constitution
tags: [infrastructure, api, backend]
---

# Core API Module Commission

> **Atom ID:** `SYS.009`
> **Type:** commission
> **Status:** Approved

---

## Commission

The Constitution hereby commissions the **Core API Module** to exist as an Infrastructure Module providing the event backbone, multi-tenant data access, and Soul gateway.

---

## Essential Requirements

The Core API Module MUST:

1. **Provide Event Backbone** — Event-first architecture with dual-write pattern
2. **Enforce RLS Multi-tenancy** — Every table has `org_id` with Row-Level Security
3. **Serve as Soul Gateway** — Central API for Soul read/write operations
4. **Handle Authentication** — JWT/session validation and user context
5. **Enforce Permissions** — view/edit/approve/configure primitives
6. **Deliver Notifications** — Push, digest, and dashboard notification patterns

---

## Child Commissions

These essentials become commissions for child atoms:

| Essential                 | Becomes Child Commission                 |
| ------------------------- | ---------------------------------------- |
| Provide Event Backbone    | Events Service (`SYS.009-API.xxx`)       |
| Enforce RLS Multi-tenancy | RLS Middleware (`SYS.009-API.xxx`)       |
| Serve as Soul Gateway     | Soul API (`SYS.009-API.xxx`)             |
| Handle Authentication     | Auth Service (`SYS.009-API.xxx`)         |
| Enforce Permissions       | Permission Service (`SYS.009-API.xxx`)   |
| Deliver Notifications     | Notification Service (`SYS.009-API.xxx`) |

---

## Dependencies

| Atom ID | Relationship | Description                         |
| ------- | ------------ | ----------------------------------- |
| —       | root         | Constitution-level atom (no parent) |

---

## Changelog

| Date       | Author       | Change                                                |
| ---------- | ------------ | ----------------------------------------------------- |
| 2025-12-04 | Constitution | Initial creation with hierarchical commission pattern |
