---
id: SYS.016
type: interface
title: 'Permission Check Protocol'
status: approved
entity_path: docs/platform/
created: 2025-12-04
updated: 2025-12-04
author: Architect
tags: [permissions, authorization, rbac, core-api]
legacy_id: IC-007
---

# Permission Check Protocol

> **Atom ID:** `SYS.016`
> **Type:** interface
> **Status:** Approved
> **Legacy ID:** IC-007

---

## Summary

Defines the permission primitives and the protocol for checking user permissions across the Xentri platform.

---

## Content

### Permission Primitives

All user actions are governed by four permission primitives:

| Primitive   | Description               | Example                   |
| ----------- | ------------------------- | ------------------------- |
| `view`      | Read access to data       | View invoice list         |
| `edit`      | Modify existing data      | Update invoice amount     |
| `approve`   | Authorize actions/changes | Approve payment           |
| `configure` | Modify system settings    | Change notification rules |

### Contract

```
GET /api/v1/permissions/check
POST /api/v1/permissions/check (batch)
```

### Request Schema

```typescript
// Single check
interface PermissionCheckRequest {
  user_id: string;
  org_id: string;
  resource: {
    type: string; // Entity type (e.g., 'invoice')
    id?: string; // Specific resource ID (optional)
  };
  action: 'view' | 'edit' | 'approve' | 'configure';
}

// Batch check
interface BatchPermissionCheckRequest {
  user_id: string;
  org_id: string;
  checks: {
    resource: { type: string; id?: string };
    action: 'view' | 'edit' | 'approve' | 'configure';
  }[];
}
```

### Response Format

```typescript
interface PermissionCheckResponse {
  allowed: boolean;
  reason?: string; // If denied, why
  constraints?: {
    field_restrictions?: string[]; // Fields user cannot access
    row_filter?: string; // RLS-style filter
  };
}

interface BatchPermissionCheckResponse {
  results: {
    resource: { type: string; id?: string };
    action: string;
    allowed: boolean;
    reason?: string;
  }[];
}
```

### Permission Inheritance

Permissions follow a hierarchy:

```
configure > approve > edit > view
```

A user with `configure` permission implicitly has all lower permissions.

### Consumers

- All API endpoints (authorization middleware)
- UI components (conditional rendering)
- Copilots (action validation)

### Providers

- core-api (permission service)

### Role Mapping

| Role    | view | edit | approve | configure |
| ------- | ---- | ---- | ------- | --------- |
| Viewer  | ✅   | ❌   | ❌      | ❌        |
| Editor  | ✅   | ✅   | ❌      | ❌        |
| Manager | ✅   | ✅   | ✅      | ❌        |
| Admin   | ✅   | ✅   | ✅      | ✅        |

### Version

**v1.0** — Initial permission protocol

### Defined In

**core-api** — `services/core-api/src/routes/permissions.ts`

---

## Dependencies

| Atom ID | Relationship | Description                             |
| ------- | ------------ | --------------------------------------- |
| SYS.006 | implements   | Enforces PR-005 (permission primitives) |

---

## Changelog

| Date       | Author    | Change                                 |
| ---------- | --------- | -------------------------------------- |
| 2025-12-04 | Architect | Extracted from Constitution PRD IC-007 |
