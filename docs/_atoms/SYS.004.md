---
id: SYS.004
type: requirement
title: 'API Authentication Requirement'
status: approved
entity_path: docs/platform/
created: 2025-12-04
updated: 2025-12-04
author: PM
tags: [security, authentication, api, endpoints]
legacy_id: PR-003
---

# API Authentication Requirement

> **Atom ID:** `SYS.004`
> **Type:** requirement
> **Status:** Approved
> **Legacy ID:** PR-003

---

## Summary

All API endpoints MUST require authentication except explicitly designated health checks.

---

## Content

### Requirement Statement

All API endpoints MUST require authentication except health checks.

### Rationale

Zero-trust security posture requires that every request is authenticated. Health check endpoints are exempted to support infrastructure monitoring (load balancers, orchestrators).

### Acceptance Criteria

1. Every API endpoint returns 401 Unauthorized if no valid token is provided
2. Health check endpoints (`/health`, `/ready`, `/live`) are explicitly exempt
3. Authentication tokens are validated on every request (no session caching)
4. Token validation includes expiration, signature, and issuer checks

### Constraints

- Public endpoints (if any) must be explicitly documented and approved
- Service-to-service communication uses separate authentication mechanism
- Authentication must not leak timing information (constant-time comparison)

### Implementation

**Implemented By:** core-api

---

## Dependencies

| Atom ID | Relationship | Description                                |
| ------- | ------------ | ------------------------------------------ |
| —       | root         | Constitution-level requirement (no parent) |

---

## Changelog

| Date       | Author | Change                                 |
| ---------- | ------ | -------------------------------------- |
| 2025-12-04 | PM     | Extracted from Constitution PRD PR-003 |
