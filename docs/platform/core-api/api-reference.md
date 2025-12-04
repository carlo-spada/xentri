# Core API Reference

> **Module:** core-api
> **Base URL:** `/api/v1`

---

## Authentication

All endpoints require authentication except `/health`.

```http
Authorization: Bearer <clerk_jwt>
```

JWT must include `org_id` claim for multi-tenant isolation.

---

## Endpoints

### Health

```http
GET /health
```

Returns service health status. No authentication required.

**Response:**

```json
{
  "status": "healthy",
  "version": "0.1.0",
  "timestamp": "2025-12-03T12:00:00Z"
}
```

---

### Events

#### List Events

```http
GET /api/v1/events
```

Returns events for the authenticated organization.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `type` | string | Filter by event type pattern |
| `since` | ISO8601 | Events after timestamp |
| `limit` | number | Max results (default: 100) |
| `cursor` | string | Pagination cursor |

**Response:**

```json
{
  "events": [
    {
      "id": "evt_123",
      "type": "xentri.finance.invoice.created.v1",
      "payload": { ... },
      "created_at": "2025-12-03T12:00:00Z"
    }
  ],
  "next_cursor": "abc123"
}
```

#### Create Event

```http
POST /api/v1/events
```

Emits a new event to the event spine.

**Request Body:**

```json
{
  "type": "xentri.{category}.{entity}.{action}.v1",
  "payload": { ... },
  "idempotency_key": "optional-dedupe-key"
}
```

**Response:** `201 Created`

```json
{
  "id": "evt_456",
  "type": "xentri.finance.invoice.created.v1",
  "created_at": "2025-12-03T12:00:00Z"
}
```

---

### Soul (IC-004)

#### Get Full Soul

```http
GET /api/v1/soul
```

Returns the complete Soul for the authenticated organization.

**Headers:**

- `If-None-Match: <etag>` — For conditional requests

**Response:**

```json
{
  "version": "1.0.0",
  "updated_at": "2025-12-03T12:00:00Z",
  "etag": "abc123",
  "sections": {
    "identity": { ... },
    "offerings": { ... },
    "goals": { ... }
  }
}
```

#### Get Soul Section

```http
GET /api/v1/soul/{section}
```

Returns a specific Soul section.

**Path Parameters:**

- `section` — One of: `identity`, `offerings`, `goals`, `operational`

---

### Organizations

#### Get Current Organization

```http
GET /api/v1/orgs/current
```

Returns the organization from JWT context.

**Response:**

```json
{
  "id": "org_123",
  "name": "Acme Corp",
  "created_at": "2025-12-01T00:00:00Z"
}
```

---

## Error Responses

All errors use Problem Details format:

```json
{
  "type": "https://xentri.io/errors/{error-type}",
  "title": "Human-readable title",
  "status": 400,
  "detail": "Detailed error message",
  "trace_id": "request-trace-id"
}
```

### Common Errors

| Status | Type               | Description               |
| ------ | ------------------ | ------------------------- |
| 400    | `validation-error` | Request validation failed |
| 401    | `unauthorized`     | Missing or invalid auth   |
| 403    | `forbidden`        | Insufficient permissions  |
| 404    | `not-found`        | Resource not found        |
| 409    | `conflict`         | Duplicate or conflict     |
| 500    | `internal-error`   | Server error              |

---

## Rate Limits

| Tier | Requests/min | Burst |
| ---- | ------------ | ----- |
| Free | 60           | 10    |
| Paid | 600          | 100   |

Rate limit headers included in responses:

- `X-RateLimit-Limit`
- `X-RateLimit-Remaining`
- `X-RateLimit-Reset`
