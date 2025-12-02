---
title: Infrastructure PRD
level: subcategory
doc_type: domain_prd
parent: docs/prd.md
scope: INFRA
---

# Infrastructure - Product Requirements Document

## Overview

- **Parent Constitution:** `docs/prd.md`
- **Scope:** Event Spine, Brief System, Auth, Billing
- **Package:** `services/core-api` (partial), future dedicated services

## Platform Compliance

### Inherited Platform Requirements

| PR | Compliance Approach |
|----|---------------------|
| **PR-001** | All tables created with org_id; RLS policies in migrations |
| **PR-002** | Event emission helper function; schema validation on write |
| **PR-003** | Middleware enforces auth on all routes except `/health` |
| **PR-004** | Brief service is the ONLY write path; read API exposed |

### Implemented Integration Contracts

| IC | Implementation |
|----|----------------|
| **IC-001** | Defines and validates SystemEvent schema |
| **IC-004** | Exposes `/api/v1/brief` endpoints |
| **IC-005** | Provides recommendation submission endpoint |

## Functional Requirements

### Brief System

- **FR-INFRA-001**: Brief MUST be stored per organization
- **FR-INFRA-002**: Brief MUST support AI-updateable and human-sovereign sections
- **FR-INFRA-003**: Brief MUST be versioned with diff capability between any two versions
- **FR-INFRA-004**: Brief updates MUST emit `xentri.brief.updated` event

### Event Spine

- **FR-INFRA-010**: Event Spine MUST accept events matching IC-001 envelope
- **FR-INFRA-011**: Events MUST be immutable (append-only, no updates/deletes)
- **FR-INFRA-012**: Events MUST be queryable by org_id, type, and time range
- **FR-INFRA-013**: Events MUST support priority and attention flags

### Operational Pulse

- **FR-INFRA-020**: Pulse MUST aggregate events per user-defined schedule
- **FR-INFRA-021**: Pulse MUST filter events through hierarchical importance logic
- **FR-INFRA-022**: Pulse MUST deliver via three modes: Critical/Digest/Dashboard

## Success Criteria

- Brief system handles concurrent updates without data loss
- Event spine processes 1000 events/sec with <100ms latency
- Pulse generates daily digests for all active users

## Scope (MVP / Growth / Vision)

- **MVP**: Core Brief, Basic Event Spine, Email Pulse
- **Growth**: Advanced Pulse filtering, Webhooks
- **Vision**: Predictive Pulse (AI forecasting)
