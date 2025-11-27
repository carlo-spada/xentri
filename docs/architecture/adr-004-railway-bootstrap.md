# ADR-004: Railway Bootstrap Deployment Strategy

**Status:** Accepted
**Date:** 2025-11-27
**Deciders:** Carlo (Product Owner), Winston (Architect), John (PM), Amelia (Dev), Murat (TEA), Victor (Strategy)

## Context

Xentri requires a deployment strategy that balances immediate velocity with long-term scalability. The architecture specifies Kubernetes as the target platform, but K8s setup represents 40-80 hours of work before shipping any product value.

## Decision

We adopt a **Bridge Strategy**: deploy to Railway for bootstrapping (Phase 1), migrate to Kubernetes when triggered by spend ($500/mo) or compliance requirements (Phase 2).

---

## Bootstrap SLO / Acceptance Criteria

| Phase | Reliability Expectation |
|-------|------------------------|
| **v0.1 (Pre-Revenue)** | Occasional brief Redis/n8n interruptions acceptable. Redeploy downtime (volume remount) tolerable. Focus is velocity, not uptime. |
| **First Paying Customer** | Redis/n8n outage = **Sev-1**. Trigger Upstash evaluation. Downtime impacts trust and retention. |
| **SLA Commitment (written or marketed)** | Platform reliability is contractual. HA becomes non-negotiable. Advance K8s/managed services migration. |

**Concrete HA Trigger:** First paying customer OR any written SLA commitment (including informal marketing language like "guaranteed uptime"). Either condition flips from "acceptable jank" to "platform reliability matters."

---

## Critical Constraints

### 1. Docker-First Deployment

All services deployed via standard `Dockerfile`, explicitly rejecting Nixpacks. Containers are cloud-portable from day one.

### 2. Redis with Volume (Streams Support)

- Railway Redis is an **unmanaged service** pulled from the official `redis` Docker image—Streams commands (`XADD`, `XREADGROUP`, consumer groups) work normally.
- Operationally **single-instance** by default.
- **Persistence requires a Railway Volume**; volumes have constraints:
  - No replicas when using volumes
  - Small redeploy downtime (Railway prevents two deployments mounting the same volume)
- **Pin Redis image version ≥ 5.0** in `railway.toml` to guarantee Streams invariants.
- **Implement `XTRIM` retention strategy**—Streams grow unbounded without explicit trimming.
- **Do not route large blobs through Redis Streams.** Events contain pointers (IDs/URLs), not payloads.

**Redis Role Assessment:** Redis serves as BOTH event backbone (Streams) AND n8n queue. This is a **critical path dependency**, not a cache. Redis downtime = platform outage.

### 3. n8n on Railway (Queue Mode)

Deploy using Railway's template pattern with separate main + worker services.

**n8n Correctness Constraints:**

| Constraint | Rationale |
|------------|-----------|
| `N8N_ENCRYPTION_KEY` must be identical across main + workers | Credentials encrypted with this key; mismatch = decryption failures |
| **Crown Jewel:** Store `N8N_ENCRYPTION_KEY` in password manager (1Password/Bitwarden) + physical backup | Losing this key = cannot decrypt n8n credentials = effectively irrecoverable. Treat as "building burns down" tier. |
| Set `WEBHOOK_URL` when behind proxy/custom domain | Without it, n8n generates localhost-ish webhook URLs that break externally |
| Configure execution data pruning via env vars | Execution history grows Postgres unbounded; enable retention as part of Production Readiness |
| **No large binary payloads through n8n** | Filesystem binary mode unsupported in queue mode; S3 external storage is Enterprise-only. Design: n8n orchestrates, doesn't transport blobs—use presigned S3 URLs instead. |

### 4. PR Environments OFF by Default

Use persistent staging environment; defer per-PR environments until review/E2E value justifies cost. Revisit when Neon DB branching becomes valuable.

### 5. Config as Code (Reduce Clickops Drift)

All Railway build/deploy settings captured in `railway.toml` or `railway.json` per service. No dashboard-only configuration. Enables:
- Reproducible infrastructure
- AI agent/contractor onboarding without archaeology
- Diff-able configuration changes in PRs

### 6. K8s Migration Runbook

Document Railway→K8s mapping before Phase 2 trigger. Use Terraform for cluster provisioning, Helm for application deployment.

---

## Operational Heartbeat Checks

Even if dashboards aren't implemented day one, these checks shape future observability:

| System | Health Indicators |
|--------|-------------------|
| **Redis** | Stream length per topic, memory usage, connection count, latency |
| **n8n** | Queue backlog depth, worker heartbeat/last-seen, failed execution count |
| **Postgres** | Active connections, disk usage growth (execution history), slow query count |

**Implementation:** Add `/health` endpoints that surface these metrics; wire to alerting when paying customers exist.

---

## CI/CD Pipeline (Staging Gate)

```
PR opened
    ↓
lint + typecheck + unit tests
    ↓
PR approved + merged to main
    ↓
Build all affected services
    ↓
Deploy to STAGING
    ↓
Run smoke tests + E2E against staging
    ↓
Staging green → Production auto-deploy (Railway)
```

**Rationale:** Prevents "production is our integration environment" syndrome. Catches integration issues before users see them.

---

## Railway → Kubernetes Migration Mapping

| Railway Concept | K8s Equivalent |
|-----------------|----------------|
| Service | Deployment + Service |
| Service Variables | ConfigMap + Secret |
| Service Linking (`${{Postgres.DATABASE_URL}}`) | ExternalSecrets or sealed-secrets |
| Volume | PersistentVolumeClaim |
| Custom Domain | Ingress + cert-manager |
| PR Environments | Namespace-per-PR (via ArgoCD ApplicationSet) |
| Health Check Path | `livenessProbe` / `readinessProbe` |
| `railway.toml` | Helm `values.yaml` |

---

## Managed Redis (Upstash as Default)

| Factor | Railway Redis | Upstash Redis |
|--------|---------------|---------------|
| **Simplicity** | Same platform, lowest friction | External service, more config |
| **Latency** | Intra-Railway networking | Cross-network (small penalty) |
| **Streams Support** | Yes (standard Redis) | Yes (explicitly documented) |
| **Persistence** | Manual (Volume required) | Built-in replicated storage |
| **HA/Failover** | None (single-instance) | Automatic (managed) |
| **Pricing Model** | Resource-based | Command-count-based (Streams can be chatty) |

**Bridge-Minded Rule:**
- **v0.1:** Railway Redis (simplicity, tolerate single-instance + occasional downtime)
- **First paying customer:** Evaluate managed Redis (Upstash recommended) for HA

---

## Consequences

**Positive:**
- Ship v0.1 in 2-4 hours instead of 40-80 hours
- Save ~$100/mo and ~20 hours/week DevOps overhead during "zero to one" phase
- Validate product-market fit before investing in infrastructure complexity
- Docker containers portable to any target (Railway, K8s, Fly.io, etc.)
- Config as Code prevents configuration drift and enables reproducibility
- Explicit SLO prevents ambiguity about acceptable reliability

**Negative:**
- Single-instance Redis (no HA until migration)
- Volume constraints on n8n (no replicas, redeploy downtime)
- Manual secrets management (no ExternalSecrets automation)
- n8n binary data limitations require architectural awareness

**Neutral:**
- RLS enforcement identical regardless of deployment target
- Event backbone (Redis Streams) works on Railway with volume attachment
- CI/CD pipeline simpler on Railway, more complex on K8s

---

## Migration Triggers

| Trigger | Action |
|---------|--------|
| Monthly spend > $500 | Initiate K8s migration project |
| Compliance requirement (SOC2, GDPR DPA) | Initiate K8s migration project |
| **First paying customer** | Evaluate managed Redis (Upstash) for HA; Redis/n8n outage becomes Sev-1 |
| **Any SLA commitment (written or marketed)** | HA becomes non-negotiable; advance managed services migration |
| n8n replica/HA requirement | Migrate n8n to VPS or K8s |
| Queue/event backbone requires HA | Move Redis off Railway (Upstash/managed) or advance K8s phase |

---

## Artifacts to Create/Update

1. `docs/deployment-plan.md` — Add n8n queue mode section with env vars
2. `services/core-api/railway.toml` — Docker builder, health check config
3. `apps/shell/railway.toml` — Docker builder config
4. `services/n8n-host/railway.toml` — Main + worker service configs
5. `.github/workflows/ci.yml` — Add staging deploy + smoke/E2E gate
6. `docs/k8s-migration-runbook.md` — Skeleton with mapping table + Terraform/Helm outline
7. `.env.example` — Add `N8N_ENCRYPTION_KEY`, `WEBHOOK_URL` placeholders
