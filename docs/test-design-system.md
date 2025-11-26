# Test Design: Epic System - System-Level Testability Review

**Date:** 2025-11-29  
**Author:** Carlo  
**Status:** Draft

---

## Executive Summary

**Scope:** full system-level test design for MVP (v0.1–v0.2) covering the multi-tenant stack (Supabase auth, Postgres RLS, Redis/n8n event backbone, Astro shell + React islands, website/CMS/lead intake).  
**Risk Summary:**

- Total risks identified: 9  
- High-priority risks (≥6): 5  
- Critical categories: SEC, DATA, TECH, OPS

**Coverage Summary:**

- P0 scenarios: 8 (hours: n/a)  
- P1 scenarios: 12 (hours: n/a)  
- P2/P3 scenarios: 14 (hours: n/a)  
- **Total effort**: n/a (hours) (~n/a days)

---

## Risk Assessment

### High-Priority Risks (Score ≥6)

| Risk ID | Category | Description | Probability | Impact | Score | Mitigation | Owner | Timeline |
| ------- | -------- | ----------- | ----------- | ------ | ----- | ---------- | ----- | -------- |
| R-001 | SEC/DATA | RLS or org binding missing on API/events leading to cross-tenant data exposure | 2 | 3 | 6 | Contract tests enforce `org_id` on every query/event; DB RLS policies + fail-closed middleware; negative tests for cross-org access | Eng | Before prod |
| R-002 | TECH/DATA | Event backbone not append-only or losing events (outbox/Redis/n8n pipeline gaps) | 2 | 3 | 6 | Property tests for append-only; idempotent outbox with dedupe keys; replay tests with DLQ; contract tests on required event fields | Eng | Before prod |
| R-003 | SEC | Public lead intake resolves org incorrectly or logs PII in events | 2 | 3 | 6 | Domain-to-org resolution tests; anti-spam + rate limit; redact message body in events; CORS and honeypot validation | Eng | Before prod |
| R-004 | BUS/TECH | Brief → Website publish drift (schema mismatch breaks live site or exposes stale data) | 2 | 3 | 6 | Schema version check in publish; contract tests between Brief and site renderer; publish smoke on default templates | Eng | Before prod |
| R-005 | OPS/SEC | Domain/SSL provisioning misroutes tenants or serves wrong cert | 2 | 3 | 6 | Canary publish to `[org].xentri.app` with tenant assertion; DNS verification tests; certificate host coverage checks | Eng | Before prod |

### Medium-Priority Risks (Score 3-4)

| Risk ID | Category | Description | Probability | Impact | Score | Mitigation | Owner |
| ------- | -------- | ----------- | ----------- | ------ | ----- | ---------- | ----- |
| R-006 | PERF | Shell and published sites exceed perf budgets (NFR1/NFR4) on 3G | 2 | 2 | 4 | Lighthouse/LCP budget tests; asset size guardrails; synthetic checks on 3G profile | Eng |
| R-007 | TECH | Event schema/version drift vs `ts-schema` contracts | 2 | 2 | 4 | Pact/contract tests on event payloads; schema lint in CI; require version bump on breaking change | Eng |
| R-008 | OPS | n8n workflows not idempotent/retry-safe causing duplicate side effects | 2 | 2 | 4 | Replay tests with DLQ; idempotency keys; chaos tests for retry paths | Eng |

### Low-Priority Risks (Score 1-2)

| Risk ID | Category | Description | Probability | Impact | Score | Action |
| ------- | -------- | ----------- | ----------- | ------ | ----- | ------ |
| R-009 | BUS | AI proposals mis-tagged but still gated by user confirmation | 1 | 2 | 2 | Monitor; ensure proposals always require explicit apply |

### Risk Category Legend

- **TECH**: Technical/Architecture (integration, scalability, drift)  
- **SEC**: Security (auth/authz, PII, isolation)  
- **PERF**: Performance (budgets, throughput)  
- **DATA**: Data Integrity (loss, corruption, schema)  
- **BUS**: Business Impact (UX, revenue, correctness)  
- **OPS**: Operations (deploy, DNS/SSL, idempotency)

---

## Test Coverage Plan

### P0 (Critical) - Run on every commit

**Criteria:** Blocks core journey + high risk (≥6) + no workaround

| Requirement | Test Level | Risk Link | Test Count | Owner | Notes |
| ----------- | ---------- | --------- | ---------- | ----- | ----- |
| Org-scoped auth + RLS enforcement (sign-up/login/org creation) | API/E2E | R-001 | 3 | QA | Cross-org negative cases must 403/0 rows |
| Append-only event log with required fields (`brief_*`, `website_published`, `lead_created`) | API | R-002 | 3 | QA | Mutation attempts fail; idempotent write asserted |
| Brief → Website publish safety (schema version check, content source map) | E2E | R-004 | 2 | QA | Publish default template; verify render + events |
| Lead intake public endpoint (org resolution, anti-spam, redaction) | API/E2E | R-003 | 3 | QA | Form submit from public domain; honeypot + rate limit |
| Tenant routing for `[org].xentri.app` + cert host match | E2E | R-005 | 2 | QA | Wrong org access denied; cert CN/SAN matches host |
| Data export + deletion safety (soft delete, purge tombstones events) | API | R-001 | 2 | QA | Export redacts sensitive fields; purge removes org data |
| Event outbox retry/idempotency through Redis/n8n | Integration | R-002 | 2 | QA | Duplicate sends do not create double side effects |
| RLS on notifications and leads lists | API | R-001 | 1 | QA | List endpoints scoped to org only |

**Total P0:** 8 tests, hours: n/a

### P1 (High) - Run on PR to main

**Criteria:** Important features + medium risk (3-4) + common workflows

| Requirement | Test Level | Risk Link | Test Count | Owner | Notes |
| ----------- | ---------- | --------- | ---------- | ----- | ----- |
| Shell navigation resilience (sidebar/category switch no full reload) | E2E | R-006 | 2 | QA | Light/dark persisted; mobile collapse |
| CMS publish pipeline (`content_published` with org scoping) | API/E2E | R-007 | 2 | QA | Draft vs publish; event payload contract |
| Lead status transitions (New/Contacted/Archived) with events | API | R-003 | 2 | QA | Idempotent status changes |
| Notification preferences honored (email toggle + in-app) | API/E2E | R-003 | 2 | QA | Preferences drive delivery |
| n8n workflow idempotency on retries | Integration | R-008 | 2 | QA | Replay same message, side effects once |
| Supabase session renewal keeps org binding intact | API | R-001 | 2 | QA | Refresh token rotation preserves `org_id` |
| Performance budget checks (shell LCP, published site TTFB) | Perf | R-006 | 2 | QA | Synthetic 3G profile |
| Schema/version lint (`ts-schema` vs emitted events) | Integration | R-007 | 2 | QA | Break build on drift |
| Data export completeness (Brief, leads, content) | API | R-001 | 2 | QA | Version header `xentri-export-v1` present |
| Domain verification retry path (DNS pending → later success) | E2E | R-005 | 1 | QA | No wrong-tenant exposure |
| Outbox DLQ replay to Redis/n8n | Integration | R-002 | 1 | QA | Replay restores delivery |
| Observability headers (trace id, server-timing on APIs) | API | R-008 | 1 | QA | Trace propagation verified |

**Total P1:** 12 tests, hours: n/a

### P2 (Medium) - Run nightly/weekly

**Criteria:** Secondary features + low risk (1-2) + edge cases

| Requirement | Test Level | Risk Link | Test Count | Owner | Notes |
| ----------- | ---------- | --------- | ---------- | ----- | ----- |
| CMS tagging/filtering | API | R-007 | 2 | QA | Tag filter, pagination |
| Website template switching preserves overrides | E2E | R-004 | 2 | QA | Warn/reset behavior |
| Lead dedupe (same email within window) | API | R-003 | 2 | QA | Flag duplicates |
| Backup/restore sanity (export/import sample org) | API | R-001 | 2 | QA | PITR simulation |
| PWA offline banner for shell/published site | E2E | R-006 | 2 | QA | Offline mode UX |
| Observability: health endpoint coverage | API | R-008 | 2 | QA | `/api/health` returns dependencies |
| Circuit breaker/fallback for downstream service errors | API/E2E | R-008 | 2 | QA | 500s show graceful UI + retry |

**Total P2:** 14 tests, hours: n/a

### P3 (Low) - Run on-demand

**Criteria:** Nice-to-have + exploratory

| Requirement | Test Level | Test Count | Owner | Notes |
| ----------- | ---------- | ---------- | ----- | ----- |
| SEO meta defaults on published site | E2E | 2 | QA | Non-blocking |
| Optional CMS media edge cases (large image fallback) | API | 2 | QA | Size/format guardrails |
| Analytics placeholders disabled by default | API | 2 | QA | Ensure opt-in |

**Total P3:** 6 tests, hours: n/a

---

## Execution Order

### Smoke Tests (<5 min)

**Purpose:** Fast feedback, catch build-breaking issues

- [ ] Signup → org creation → shell loads (RLS enforced)  
- [ ] Create Brief draft → `brief_created` event visible  
- [ ] Publish default site to `[org].xentri.app` and load homepage

**Total:** 3 scenarios

### P0 Tests (<10 min)

**Purpose:** Critical path validation

- [ ] RLS isolation: cross-org API/event access blocked  
- [ ] Append-only events with required fields  
- [ ] Public lead intake resolves org + redacts PII  
- [ ] Publish site with schema version check  
- [ ] Domain/cert host match per org

**Total:** 5 scenarios

### P1 Tests (<30 min)

**Purpose:** Important feature coverage

- [ ] Shell navigation resilience (desktop/mobile)  
- [ ] CMS publish + event payload contract  
- [ ] Notification preference enforcement  
- [ ] n8n retry/idempotency  
- [ ] Performance budgets (shell/site)

**Total:** 5 scenarios

### P2/P3 Tests (<60 min)

**Purpose:** Full regression coverage

- [ ] Template switching preserves overrides  
- [ ] Lead dedupe and status transitions  
- [ ] Backup/restore sanity  
- [ ] PWA offline behavior  
- [ ] Health endpoint & circuit breaker fallback  
- [ ] SEO/meta defaults

**Total:** 6 scenarios

---

## Resource Estimates

| Priority | Count | Hours/Test | Total Hours | Notes |
| -------- | ----- | ---------- | ----------- | ----- |
| P0 | 8 | n/a | n/a | Focus on isolation, events, tenancy |
| P1 | 12 | n/a | n/a | Navigation, publish, retries, perf |
| P2 | 14 | n/a | n/a | Regression breadth |
| P3 | 6 | n/a | n/a | Exploratory/optional |
| **Total** | **40** | **-** | **n/a** | **n/a** |

### Prerequisites

**Test Data:**

- Org factories with deterministic `org_id`, `user_id`, `site_id`, `lead_id`  
- Brief factory with schema_version and completion status  
- Lead submission fixture with honeypot/rate-limit controls  
- DNS mock/fixture for domain verification flow

**Tooling:**

- Playwright for E2E; contract tests for events (`ts-schema`)  
- k6/Lighthouse synthetic checks for budgets  
- Pact/contract tests for event payloads and APIs  
- DB seed/reset utilities that set `app.current_org_id` per test

**Environment:**

- docker-compose: Postgres (RLS), Redis, n8n, MinIO, Supabase auth (or equivalent)  
- TLS/cert test host for `[org].xentri.app` routing  
- Feature flags for AI proposals (always user-confirmed)

---

## Quality Gate Criteria

- **P0 pass rate:** 100%  
- **P1 pass rate:** ≥95%  
- **High-risk mitigations:** 100% of score ≥6 risks mitigated or waived with approver  
- **Coverage targets:** Critical paths ≥80%; SEC scenarios 100%; event contracts 100%  
- **Non-negotiable:** No cross-tenant data access; no event mutation; publish guarded by schema version

---

## Mitigation Plans

### R-001: RLS/org binding gaps (Score: 6)

**Mitigation Strategy:** Add contract tests enforcing `org_id` on every API/event; fail-closed middleware; RLS policies + negative tests; session refresh preserves org.  
**Owner:** Eng  
**Timeline:** Before prod  
**Verification:** Cross-org reads return 0 rows/403; events always include org/user.

### R-002: Event backbone reliability (Score: 6)

**Mitigation Strategy:** Append-only property tests; outbox dedupe keys; DLQ replay; contract tests on envelope; monitor lag.  
**Owner:** Eng  
**Timeline:** Before prod  
**Verification:** Replay produces single delivery; attempts to update/delete events fail.

### R-003: Lead intake PII leak (Score: 6)

**Mitigation Strategy:** Redact message body in events; rate limiting + honeypot; org resolution from domain/site id only; CORS locked down.  
**Owner:** Eng  
**Timeline:** Before prod  
**Verification:** Events exclude raw message; spam bursts throttled; wrong org submit rejected.

### R-004: Brief → Website drift (Score: 6)

**Mitigation Strategy:** Schema version check during publish; contract tests for section mapping; publish smoke on each template; rollback on failure.  
**Owner:** Eng  
**Timeline:** Before prod  
**Verification:** Publish fails fast on version mismatch; site renders with Brief data or safe defaults.

### R-005: Domain/SSL misrouting (Score: 6)

**Mitigation Strategy:** Tenant assertion middleware on host; DNS verification tests; certificate host match checks; canary publish per org.  
**Owner:** Eng  
**Timeline:** Before prod  
**Verification:** Host header routes to correct org; cert CN/SAN matches; misroute attempts 404/403.

---

## Assumptions and Dependencies

### Assumptions

1. Supabase (or equivalent) provides stable auth tokens with `org_id` claim.  
2. docker-compose stack is available for local/system-level testing (Postgres, Redis, n8n, MinIO, auth).  
3. Event schema definitions live in `packages/ts-schema` and are the single contract source.  
4. AI proposals always require user confirmation (no auto-publish).

### Dependencies

1. `ts-schema` contract availability for events and Brief schemas.  
2. DNS/SSL automation (Caddy/Ingress) ready for test host provisioning.  
3. n8n connected to Redis Streams with DLQ for replay tests.  
4. Fixtures for RLS context (`app.current_org_id`) in DB sessions.

### Risks to Plan

- **Risk:** Lack of deterministic seed/reset could introduce flakiness.  
  **Contingency:** Add idempotent factories + DB reset per test run.  
- **Risk:** Perf budgets may shift with new assets.  
  **Contingency:** Add size budgets + Lighthouse CI thresholds.

---

## Approval

**Test Design Approved By:**

- [ ] Product Manager: __________ Date: __________  
- [ ] Tech Lead: __________ Date: __________  
- [ ] QA Lead: __________ Date: __________

**Comments:**  

---

## Appendix

### Knowledge Base References

- `risk-governance.md` — Risk classification and gate decision patterns  
- `probability-impact.md` — Probability × impact scoring and actions  
- `test-levels-framework.md` — Test level selection (unit/integration/E2E)  
- `test-priorities-matrix.md` — P0–P3 prioritization rules  
- `nfr-criteria.md` — NFR validation (security, performance, reliability, maintainability)

### Related Documents

- PRD: docs/prd.md  
- Epic: docs/epics.md  
- Architecture: docs/architecture.md  
- Tech Spec: n/a (pending)

---

**Generated by:** BMad TEA Agent - Test Architect Module  
**Workflow:** `.bmad/bmm/testarch/test-design`  
**Version:** 4.0 (BMad v6)
