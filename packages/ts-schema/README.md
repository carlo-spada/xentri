# ts-schema Contracts (Examples)

This package houses shared types and schemas for APIs, events, and auth. Below are concrete examples for quick reference.

## API Envelope

```json
{
  "data": {
    "id": "lead_123",
    "name": "Acme Plumbing",
    "email": "owner@acme.test"
  },
  "error": null,
  "meta": {
    "cursor": "eyJvZmZzZXQiOjEwMH0=",
    "limit": 50
  },
  "trace_id": "2f4a3b0c-dc2d-4a1e-9e8f-3c1bcb8b1c85"
}
```

## Problem Details (RFC 9457)

```json
{
  "type": "https://api.xentri.app/errors/validation",
  "title": "Invalid input",
  "status": 422,
  "detail": "Field \"email\" must be a valid email address",
  "instance": "/api/v1/leads",
  "trace_id": "7c33ac7d-5c37-4cb8-9f1c-3e43896f2b0f",
  "errors": [
    {
      "field": "email",
      "message": "Must be a valid email address"
    }
  ]
}
```

## Auth Claims (Supabase JWT)

```json
{
  "sub": "user_123",
  "email": "owner@acme.test",
  "org_id": "org_789",
  "role": "owner",
  "iss": "supabase",
  "aud": "authenticated",
  "exp": 1732598400,
  "iat": 1732594800
}
```

## Service-to-Service Token (JWT)

```json
{
  "sub": "svc-core-api",
  "iss": "xentri-platform",
  "aud": "xentri-services",
  "org_id": "org_789",
  "scope": ["events:write", "leads:read"],
  "trace_id": "9f7d4c0b-1c77-4c0f-86c6-1a3a71c81f6c",
  "exp": 1732596600,
  "iat": 1732594800
}
```

## Event Envelope (REST/Emit)

```json
{
  "id": "evt_abc",
  "type": "xentri.lead.created.v1",
  "occurred_at": "2025-11-26T04:45:00Z",
  "org_id": "org_789",
  "actor": { "type": "user", "id": "user_123" },
  "payload_schema": "lead.created@1.0",
  "payload": {
    "lead_id": "lead_123",
    "source": "website",
    "email": "owner@acme.test"
  },
  "meta": { "source": "brand-engine" },
  "trace_id": "2f4a3b0c-dc2d-4a1e-9e8f-3c1bcb8b1c85",
  "envelope_version": "1.0"
}
```
