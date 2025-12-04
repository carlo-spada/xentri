---
id: SYS.013
type: interface
title: 'Soul Access API'
status: approved
entity_path: docs/platform/
created: 2025-12-04
updated: 2025-12-04
author: Architect
tags: [soul, api, read-only, core-api]
legacy_id: IC-004
---

# Soul Access API

> **Atom ID:** `SYS.013`
> **Type:** interface
> **Status:** Approved
> **Legacy ID:** IC-004

---

## Summary

Defines the read-only API for modules to access Soul data. Modules MUST use this API and never write directly to the Soul.

---

## Content

### Contract

```
GET /api/v1/soul/{section}
```

### Endpoints

| Endpoint                      | Description         | Response              |
| ----------------------------- | ------------------- | --------------------- |
| `GET /api/v1/soul`            | Full Soul document  | Complete Soul JSON    |
| `GET /api/v1/soul/{section}`  | Specific section    | Section JSON          |
| `GET /api/v1/soul/vocabulary` | Business vocabulary | Term mappings         |
| `GET /api/v1/soul/context`    | Business context    | Industry, size, stage |

### Request Headers

```
Authorization: Bearer {token}
X-Org-ID: {org_id}
```

### Response Format

```typescript
interface SoulResponse {
  data: Record<string, unknown>;
  metadata: {
    version: string; // Soul version
    updated_at: string; // Last update timestamp
    etag: string; // Cache validation
  };
}
```

### Error Codes

| Code | Description                          |
| ---- | ------------------------------------ |
| 401  | Unauthorized (invalid/missing token) |
| 403  | Forbidden (org_id mismatch)          |
| 404  | Section not found                    |
| 429  | Rate limited                         |

### Consumers

- All copilots (for context-aware responses)
- Modules (for vocabulary and business context)
- UI components (for personalization)

### Providers

- core-api (sole provider)

### Constraints

- Read-only: no PUT/POST/DELETE endpoints
- Soul writes happen only through Strategy Copilot
- Responses are cached with ETag support

### Version

**v1.0** — Initial API definition

### Defined In

**core-api** — `services/core-api/src/routes/soul.ts`

---

## Dependencies

| Atom ID | Relationship | Description                             |
| ------- | ------------ | --------------------------------------- |
| SYS.005 | implements   | Enforces PR-004 (Soul read-only access) |

---

## Changelog

| Date       | Author    | Change                                 |
| ---------- | --------- | -------------------------------------- |
| 2025-12-04 | Architect | Extracted from Constitution PRD IC-004 |
