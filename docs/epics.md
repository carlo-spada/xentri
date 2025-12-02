# Xentri - Epic Breakdown

**Author:** Carlo
**Date:** 2025-11-28 (revised)
**Status:** Epic 1 Complete, Future Epics Pending Revision

---

## Overview

This document tracks the implementation roadmap for Xentri. Epic 1 (Foundation) is complete. Future epics will be defined after revising the PRD and Architecture documents to reflect current direction.

**Current Status:**
- ✅ **Epic 1: Foundation & Access** — Complete (Stories 1.1-1.7)
- 🔄 **Epic 2+:** Pending PRD and Architecture revision

---

## Epic 1: Foundation & Access (Complete)

**Goal:** Establish the secure, multi-tenant shell, event backbone, and complete user access flow.
**Value:** Users can securely sign up, get their own isolated workspace, and navigate the application shell. The system reliably logs all core events.
**Status:** ✅ Complete

### Story 1.1: Project Initialization & Infrastructure ✅
**As a** Developer,
**I want** the core repository and build system set up,
**So that** we have a stable foundation for development.

**Acceptance Criteria:**
1. Fresh clone runs with `pnpm install && pnpm run dev`
2. Monorepo structure: apps/shell, packages/ui, services/core-api
3. Local Postgres via Docker with RLS enabled
4. CI/CD runs lint/test/build on push
5. Smoke script confirms cross-org isolation

**Technical Notes:**
- Stack: Astro (Shell), React (Islands), Node.js (Backend), Postgres (DB)
- Turborepo for workspace management

---

### Story 1.2: Event Backbone & Database Schema ✅
**As a** System,
**I want** a centralized `system_events` table and RLS policies,
**So that** we have an immutable audit trail and secure multi-tenancy.

**Acceptance Criteria:**
1. `system_events` table with `org_id`, `event_type`, `payload`, `timestamp`
2. RLS enforces org isolation automatically
3. Events are immutable (append-only)
4. v0.1/v0.2 event types registered

**Technical Notes:**
- Postgres RLS policies and migrations
- Shared `ts-schema` package for event types

---

### Story 1.3: User Authentication & Signup ✅
**As a** Founder,
**I want** to sign up with email/password or social auth,
**So that** I can securely access the platform.

**Acceptance Criteria:**
1. Email/password login redirects to shell
2. Google OAuth login works
3. `user_signup` and `user_login` events logged
4. HTTP-only cookies with refresh rotation

---

### Story 1.4: Organization Creation & Provisioning ✅
**As a** New User,
**I want** an Organization created for me automatically upon signup,
**So that** I have a private workspace for my business data.

**Acceptance Criteria:**
1. Organization auto-created on signup
2. User assigned as "Owner"
3. `org_created` event logged

---

### Story 1.5: Application Shell & Navigation ✅
**As a** User,
**I want** a stable sidebar and header,
**So that** I can navigate between Strategy, Brand, and other categories.

**Acceptance Criteria:**
1. Shell shows 7 category icons in sidebar
2. Sidebar expands active category, collapses others
3. Navigation without full page reload
4. Light/Dark toggle persisted
5. Mobile-responsive with PWA manifest

---

### Story 1.6: Thin Vertical Slice (Signup → Brief → Event) ✅
**As a** User,
**I want** a working end-to-end slice from signup to Brief creation,
**So that** I see the product delivering value, not just infrastructure.

**Acceptance Criteria:**
1. User can sign up, land in shell, open Strategy, create Brief draft
2. `brief_created` event visible via org-scoped query
3. Shell shows Brief summary tile
4. Works in dev and CI with production-like RLS

---

### Story 1.7: DevOps, Observability, and Test Readiness ✅
**As a** Developer,
**I want** baseline pipelines, monitoring hooks, and test harness,
**So that** the MVP can ship safely and be observed.

**Acceptance Criteria:**
1. CI runs lint + unit tests + type checks on PRs
2. Structured JSON logging with correlation IDs
3. Smoke test script for shell/Brief slice
4. Zero-downtime deploy pipeline with rollback plan

**Deployment Strategy (ADR-004):**
- Bridge: Railway for bootstrapping → K8s when needed
- Config as Code: `railway.toml` files
- CI/CD: Staging gate and production jobs

---

## Future Epics (Pending Revision)

The following epics will be defined after revising the PRD and Architecture to reflect current direction:

- **Epic 2:** Strategy & Clarity Engine
- **Epic 3:** Digital Presence Builder
- **Epic 4:** Lead Capture & Growth
- **Epic 5:** Brand Intelligence
- **Epic 6:** Data Privacy & Compliance
- **Epic 7:** Roles, Subscription, Conversion

See [PRD](./prd.md) and [Architecture](./architecture.md) for requirements and technical decisions.
