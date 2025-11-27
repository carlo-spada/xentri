# Xentri Deployment Plan

> **Target Stack:** Railway (compute + DB + Redis) + Cloudflare R2 (storage) + Clerk (auth)
>
> **Estimated Setup Time:** 2-4 hours
>
> **Monthly Cost:** ~$5-10 initially, scaling with usage

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                     CLOUDFLARE (your domain)                       │
│                                                                     │
│   DNS: xentri.com → Railway        CNAME: r2.xentri.com → R2       │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        RAILWAY PROJECT                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   ┌─────────────┐  ┌─────────────┐  ┌──────────┐  ┌─────────────┐  │
│   │    Shell    │  │  Core API   │  │ Postgres │  │   Redis     │  │
│   │   (Astro)   │  │  (Fastify)  │  │  16.x    │  │   7.x       │  │
│   │   :4321     │  │   :3000     │  │  :5432   │  │  + Volume   │  │
│   └─────────────┘  └─────────────┘  └──────────┘  └─────────────┘  │
│                                                                     │
│   ┌─────────────┐  ┌─────────────┐                                 │
│   │  n8n Main   │  │ n8n Worker  │  ← Queue Mode (Nervous System)  │
│   │   :5678     │  │  (worker)   │                                 │
│   └─────────────┘  └─────────────┘                                 │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│   CLOUDFLARE R2              │            CLERK                     │
│   (File Storage)             │            (Authentication)          │
│   S3-compatible              │            OAuth + Sessions          │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Pre-Flight Checklist

Before starting, ensure you have:

- [ ] GitHub repository access (for Railway auto-deploy)
- [ ] Cloudflare account with your domain configured
- [ ] Clerk account (development instance already working locally)
- [ ] Credit card (Railway requires one, even for free tier)

---

## Phase 1: Create Accounts & Projects

### 1.1 Railway Account Setup

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub (recommended for easy deploys)
3. Create a new **Project** called `xentri`
4. Note: Railway gives you $5/month free credit

### 1.2 Clerk Production Instance

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Your development instance should already exist
3. Create a new **Production** instance:
   - Name: `xentri-production`
   - Configure the same OAuth providers as development
4. Note the production keys:
   - `CLERK_PUBLISHABLE_KEY` (starts with `pk_live_`)
   - `CLERK_SECRET_KEY` (starts with `sk_live_`)
5. **Important:** Configure production URLs in Clerk:
   - Allowed origins: `https://xentri.com`, `https://api.xentri.com`
   - Redirect URLs: `https://xentri.com/`

### 1.3 Cloudflare R2 Setup

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → R2
2. Create a new bucket: `xentri-assets`
3. Create R2 API credentials:
   - Go to R2 → Manage R2 API Tokens
   - Create token with Object Read & Write permissions
   - Note: `R2_ACCESS_KEY_ID` and `R2_SECRET_ACCESS_KEY`
4. Note your account ID and bucket URL:
   - `R2_ENDPOINT`: `https://<account-id>.r2.cloudflarestorage.com`
   - `R2_BUCKET`: `xentri-assets`

---

## Phase 2: Railway Services Setup

### 2.1 Provision PostgreSQL

1. In Railway project, click **+ New** → **Database** → **PostgreSQL**
2. Wait for provisioning (~30 seconds)
3. Click on the Postgres service → **Variables** tab
4. Note the `DATABASE_URL` (format: `postgresql://user:pass@host:port/db`)

### 2.2 Provision Redis

1. Click **+ New** → **Database** → **Redis**
2. Wait for provisioning
3. Note the `REDIS_URL` (format: `redis://default:pass@host:port`)

**Critical: Redis Operational Requirements**

Railway Redis is an **unmanaged service** (official `redis` Docker image). For our event backbone + n8n queue use case:

| Requirement | Action |
|-------------|--------|
| **Persistence** | Attach a Railway Volume to Redis service (Settings → Volumes) |
| **Pin version** | Set Redis image to `redis:7.x` minimum (Streams require ≥ 5.0) |
| **Stream retention** | Implement `XTRIM` strategy—Streams grow unbounded without explicit trimming |
| **No blobs** | Events contain pointers (IDs/URLs), not payloads. Do not route large files through Streams. |

**Volume constraints to know:**
- No replicas when using volumes
- Small redeploy downtime (Railway prevents two deployments mounting same volume)
- Single-instance only—consider Upstash for HA when you have paying customers

### 2. Strategic Roadmap: The "Bridge" Strategy

We are adopting a **Bridge Strategy** to balance immediate velocity with long-term scalability.

| Phase | Platform | Trigger | Goal |
| :--- | :--- | :--- | :--- |
| **1. Bootstrapping** | **Railway (PaaS)** | Day 0 - Year 1 | **Velocity.** Ship v0.1 immediately without managing infra. |
| **2. Scaling** | **Kubernetes (K8s)** | > $500/mo spend OR Compliance needs | **Control.** Raw compute efficiency, custom networking, and compliance. |

### Why this approach?
*   **Bootstrapping (Railway):** Saves ~$100/mo and ~20 hours/week of DevOps maintenance during the critical "Zero to One" phase.
*   **The Bridge (Docker):** We explicitly **REJECT** Railway's default "Nixpacks" builder. We **MUST** use standard `Dockerfiles`. This ensures that our services are "Cloud Native" artifacts from Day 1. Moving to K8s later will simply mean pushing these same images to a different target.

### Architecture Alignment
*   **Docs:** `docs/architecture.md` correctly identifies K8s as the target.
*   **Reality:** We use Railway as a *temporary managed hosting provider* for our containers until we outgrow it.

---

## 3. Phase 1: Bootstrapping (Railway)

**Constraint:** All services must be deployed via `Dockerfile`. No proprietary builders.

### 3.1 Deploy Core API

1. Click **+ New** → **GitHub Repo**
2. Select `xentri` repository
3. Railway will detect the monorepo - configure:
   - **Root Directory:** `services/core-api`
   - **Build Command:** `pnpm install && pnpm run build`
   - **Start Command:** `pnpm run start`
4. Add environment variables (see Phase 3)
5. Configure health check:
   - **Path:** `/api/v1/health`
   - **Timeout:** 30s
6. Generate domain or add custom domain: `api.xentri.com`

### 3.2 Deploy Shell (Astro)

1. Click **+ New** → **GitHub Repo**
2. Select `xentri` repository again
3. Configure:
   - **Root Directory:** `apps/shell`
   - **Build Command:** `pnpm install && pnpm run build`
   - **Start Command:** `node ./dist/server/entry.mjs`
4. Add environment variables (see Phase 3)
5. Generate domain or add custom domain: `xentri.com`

### 3.3 Deploy n8n (Queue Mode)

n8n is our "Nervous System" orchestration engine. Deploy in **queue mode** with separate main + worker services.

#### 3.3.1 n8n Main Service

1. Click **+ New** → **GitHub Repo** (or use Railway's n8n template)
2. Configure:
   - **Root Directory:** `services/n8n-host` (or template default)
   - **Docker image:** `n8nio/n8n:latest`
3. Add environment variables (see Phase 3.4)
4. Generate domain: `n8n.xentri.com`

#### 3.3.2 n8n Worker Service

1. Click **+ New** → **Docker Image**
2. Configure:
   - **Image:** `n8nio/n8n:latest`
   - **Start Command:** `n8n worker`
3. Add same environment variables as main (critical: same `N8N_ENCRYPTION_KEY`)

#### 3.3.3 n8n Correctness Constraints

| Constraint | Why It Matters |
|------------|----------------|
| `N8N_ENCRYPTION_KEY` identical across main + workers | Credentials encrypted with this key; mismatch = decryption failures |
| **Crown Jewel:** Store key in 1Password + physical backup | Losing key = cannot decrypt credentials = irrecoverable |
| Set `WEBHOOK_URL` for custom domain | Without it, n8n generates localhost-ish URLs that break externally |
| Configure execution data pruning | Execution history grows Postgres unbounded |
| **No large binary payloads** | S3 external storage is Enterprise-only. n8n orchestrates, doesn't transport blobs. |

---

## Phase 3: Environment Variables

### 3.1 Core API Variables

Set these in Railway → Core API service → Variables:

```bash
# Database (Railway provides this automatically if you link services)
DATABASE_URL=${DATABASE_URL}

# Redis (Railway provides this automatically if you link services)
REDIS_URL=${REDIS_URL}

# Server
PORT=3000
HOST=0.0.0.0
NODE_ENV=production
LOG_LEVEL=info

# CORS - Point to your Shell domain
CORS_ORIGIN=https://xentri.com

# Clerk (production keys)
# IMPORTANT: Set BOTH forms - some Clerk SDK components expect different prefixes
CLERK_PUBLISHABLE_KEY=pk_live_xxxxx
PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx
CLERK_SECRET_KEY=sk_live_xxxxx
CLERK_WEBHOOK_SECRET=whsec_xxxxx

# R2 Storage (for file uploads)
R2_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=xxxxx
R2_SECRET_ACCESS_KEY=xxxxx
R2_BUCKET=xentri-assets
```

### 3.2 Shell Variables

Set these in Railway → Shell service → Variables:

```bash
# Server
PORT=4321
HOST=0.0.0.0
NODE_ENV=production

# API URL - Point to your Core API domain
PUBLIC_API_URL=https://api.xentri.com

# Clerk (production keys - same as API)
PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx
CLERK_SECRET_KEY=sk_live_xxxxx
```

### 3.3 Railway Service Linking (Recommended)

Instead of copying DATABASE_URL and REDIS_URL manually:

1. Go to Core API service → Variables
2. Click **+ Add Variable** → **Add Reference**
3. Select PostgreSQL → `DATABASE_URL`
4. Repeat for Redis → `REDIS_URL`

This keeps credentials in sync automatically.

### 3.4 n8n Variables (Queue Mode)

Set these in Railway → n8n Main + Worker services → Variables:

```bash
# Database (shared with Core API - use service linking)
DB_TYPE=postgresdb
DB_POSTGRESDB_HOST=${PGHOST}
DB_POSTGRESDB_PORT=${PGPORT}
DB_POSTGRESDB_DATABASE=${PGDATABASE}
DB_POSTGRESDB_USER=${PGUSER}
DB_POSTGRESDB_PASSWORD=${PGPASSWORD}

# Queue Mode (REQUIRED for main + workers)
EXECUTIONS_MODE=queue
QUEUE_BULL_REDIS_HOST=${REDISHOST}
QUEUE_BULL_REDIS_PORT=${REDISPORT}
QUEUE_BULL_REDIS_PASSWORD=${REDISPASSWORD}

# Encryption (CRITICAL - must be identical across main + workers)
# Generate with: openssl rand -hex 32
N8N_ENCRYPTION_KEY=your-32-byte-hex-key-here

# Webhooks (REQUIRED when behind custom domain/proxy)
WEBHOOK_URL=https://n8n.xentri.com
N8N_HOST=0.0.0.0
N8N_PORT=5678
N8N_PROTOCOL=https

# Execution Data Pruning (prevents unbounded Postgres growth)
EXECUTIONS_DATA_PRUNE=true
EXECUTIONS_DATA_MAX_AGE=168  # hours (7 days)

# Security
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=your-secure-password

# Production settings
NODE_ENV=production
GENERIC_TIMEZONE=UTC
```

**Worker-specific override:**
```bash
# Workers don't need webhook URL or port - they just process jobs
# But they MUST have the same N8N_ENCRYPTION_KEY
```

---

## Phase 4: Database Migration

### 4.1 Run Prisma Migrations

Option A: **Railway CLI (recommended)**

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to project
railway link

# Run migrations against production DB
railway run --service core-api pnpm run db:migrate
```

Option B: **Local with production DATABASE_URL**

```bash
# Get DATABASE_URL from Railway dashboard
export DATABASE_URL="postgresql://..."

# Run migrations
cd services/core-api
pnpm run db:migrate
```

### 4.2 Verify RLS Policies

After migration, verify RLS is enabled:

```bash
railway run --service core-api pnpm run test:smoke
```

Or connect to the database directly:

```sql
-- Check RLS is enabled on tables
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';
```

---

## Phase 5: Domain Configuration

### 5.1 Cloudflare DNS Setup

In Cloudflare Dashboard → DNS:

```
Type    Name    Content                         Proxy
────────────────────────────────────────────────────────
CNAME   @       <railway-shell-domain>          Proxied
CNAME   api     <railway-api-domain>            Proxied
CNAME   r2      <r2-public-bucket-url>          Proxied (optional)
```

Railway domains look like: `core-api-production-8016.up.railway.app`

**Current Live URLs:**
- Core API: https://core-api-production-8016.up.railway.app

### 5.2 Railway Custom Domains

1. Shell service → Settings → Domains → Add Custom Domain: `xentri.com`
2. Core API service → Settings → Domains → Add Custom Domain: `api.xentri.com`
3. Railway will show you the CNAME target to use in Cloudflare

### 5.3 SSL/TLS

- Cloudflare handles SSL automatically when proxied
- Railway also provides SSL for their domains
- Set Cloudflare SSL mode to **Full (strict)**

---

## Phase 6: Clerk Webhook Configuration

### 6.1 Production Webhook

1. Go to Clerk Dashboard → Webhooks
2. Add endpoint: `https://api.xentri.com/api/v1/webhooks/clerk`
3. Select events:
   - `organization.created`
   - `organization.updated`
   - `organization.deleted`
   - `organizationMembership.created`
   - `organizationMembership.deleted`
   - `user.created`
   - `user.updated`
4. Copy the signing secret → Set as `CLERK_WEBHOOK_SECRET` in Railway

---

## Phase 7: CI/CD Integration

### 7.1 Railway Auto-Deploy

Railway automatically deploys when you push to `main`. To configure:

1. Each service → Settings → Source
2. Set **Watch Paths** to only trigger on relevant changes:
   - Shell: `apps/shell/**`, `packages/**`
   - Core API: `services/core-api/**`, `packages/**`

### 7.2 GitHub Actions Extension

Add deployment verification to `.github/workflows/ci.yml`:

```yaml
  deploy-check:
    name: Deployment Ready
    runs-on: ubuntu-latest
    needs: [build, smoke]
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deployment Status
        run: |
          echo "✅ All checks passed - Railway will auto-deploy"
          echo "Monitor at: https://railway.app/project/xentri"
```

### 7.3 Preview Environments (Optional)

Railway supports PR preview environments:

1. Project Settings → Environments
2. Enable **PR Deploys**
3. Each PR gets its own environment with isolated database

---

## Phase 8: Verification Checklist

### 8.1 Core API Health

```bash
curl https://api.xentri.com/api/v1/health
# Expected: {"status":"healthy","timestamp":"..."}
```

### 8.2 Shell Loading

```bash
curl -I https://xentri.com
# Expected: HTTP/2 200
```

### 8.3 Auth Flow

1. Visit `https://xentri.com/sign-in`
2. Sign in with test account
3. Verify redirect to dashboard
4. Check Clerk webhook fired (Clerk Dashboard → Logs)

### 8.4 Database Connectivity

```bash
railway run --service core-api npx prisma db pull
# Should complete without errors
```

### 8.5 RLS Isolation

```bash
railway run --service core-api pnpm run test:smoke
# All tests should pass
```

---

## Cost Projections

### Initial (Pre-Launch)

| Service | Cost |
|---------|------|
| Railway (Shell + API + Postgres + Redis) | $0-5/mo |
| Cloudflare R2 | $0/mo (free tier) |
| Clerk | $0/mo (free tier) |
| **Total** | **$0-5/mo** |

### Growth (1,000 orgs)

| Service | Cost |
|---------|------|
| Railway | $20-40/mo |
| Cloudflare R2 (100GB) | $1.50/mo |
| Clerk (5,000 MAU) | $0/mo |
| **Total** | **~$25-45/mo** |

### Scale (10,000 orgs)

| Service | Cost |
|---------|------|
| Railway | $80-150/mo |
| Cloudflare R2 (1TB) | $15/mo |
| Clerk (50,000 MAU) | $25/mo |
| **Total** | **~$120-190/mo** |

---

## Rollback Procedures

### Database Rollback

```bash
# List migrations
railway run --service core-api npx prisma migrate status

# Rollback (requires manual SQL for Prisma)
# Connect to database and run compensating migration
```

### Service Rollback

Railway keeps deployment history:

1. Service → Deployments
2. Click on previous successful deployment
3. Click **Rollback**

---

## Troubleshooting

### Common Issues

**Build fails on Railway:**
- Check build logs for missing dependencies
- Ensure `pnpm-lock.yaml` is committed
- Verify root directory is set correctly

**Database connection refused:**
- Check DATABASE_URL is set correctly
- Verify service linking in Railway
- Check if migrations have run

**CORS errors:**
- Verify `CORS_ORIGIN` matches Shell domain exactly
- Include protocol: `https://xentri.com` not `xentri.com`

**Clerk auth not working:**
- Verify production keys (not dev keys)
- Check allowed origins in Clerk dashboard
- Verify webhook secret matches
- **CRITICAL:** Set BOTH `CLERK_PUBLISHABLE_KEY` and `PUBLIC_CLERK_PUBLISHABLE_KEY` - different Clerk SDK components read different env var names

**R2 access denied:**
- Check bucket permissions
- Verify API token has correct permissions
- Check endpoint URL format

---

## Next Steps After Deployment

1. [ ] Set up monitoring (Railway provides basic metrics)
2. [ ] Configure alerting for downtime
3. [ ] Set up database backups (Railway has daily backups on paid plans)
4. [ ] Add error tracking (Sentry, etc.)
5. [ ] Configure rate limiting
6. [ ] Set up staging environment

---

## Reference: Environment Variables Summary

### Core API (Production)

| Variable | Example | Required |
|----------|---------|----------|
| `DATABASE_URL` | `postgresql://...` | Yes |
| `REDIS_URL` | `redis://...` | Yes |
| `PORT` | `3000` | Yes |
| `HOST` | `0.0.0.0` | Yes |
| `NODE_ENV` | `production` | Yes |
| `LOG_LEVEL` | `info` | No |
| `CORS_ORIGIN` | `https://xentri.com` | Yes |
| `CLERK_PUBLISHABLE_KEY` | `pk_live_...` | Yes |
| `PUBLIC_CLERK_PUBLISHABLE_KEY` | `pk_live_...` | Yes |
| `CLERK_SECRET_KEY` | `sk_live_...` | Yes |
| `CLERK_WEBHOOK_SECRET` | `whsec_...` | Yes |
| `R2_ENDPOINT` | `https://xxx.r2.cloudflarestorage.com` | Later |
| `R2_ACCESS_KEY_ID` | `...` | Later |
| `R2_SECRET_ACCESS_KEY` | `...` | Later |
| `R2_BUCKET` | `xentri-assets` | Later |

### Shell (Production)

| Variable | Example | Required |
|----------|---------|----------|
| `PORT` | `4321` | Yes |
| `HOST` | `0.0.0.0` | Yes |
| `NODE_ENV` | `production` | Yes |
| `PUBLIC_API_URL` | `https://api.xentri.com` | Yes |
| `PUBLIC_CLERK_PUBLISHABLE_KEY` | `pk_live_...` | Yes |
| `CLERK_SECRET_KEY` | `sk_live_...` | Yes |

### n8n (Production - Queue Mode)

| Variable | Example | Required |
|----------|---------|----------|
| `DB_TYPE` | `postgresdb` | Yes |
| `DB_POSTGRESDB_HOST` | `${PGHOST}` | Yes |
| `DB_POSTGRESDB_PORT` | `${PGPORT}` | Yes |
| `DB_POSTGRESDB_DATABASE` | `${PGDATABASE}` | Yes |
| `DB_POSTGRESDB_USER` | `${PGUSER}` | Yes |
| `DB_POSTGRESDB_PASSWORD` | `${PGPASSWORD}` | Yes |
| `EXECUTIONS_MODE` | `queue` | Yes |
| `QUEUE_BULL_REDIS_HOST` | `${REDISHOST}` | Yes |
| `QUEUE_BULL_REDIS_PORT` | `${REDISPORT}` | Yes |
| `QUEUE_BULL_REDIS_PASSWORD` | `${REDISPASSWORD}` | Yes |
| `N8N_ENCRYPTION_KEY` | `(openssl rand -hex 32)` | **CRITICAL** |
| `WEBHOOK_URL` | `https://n8n.xentri.com` | Yes |
| `N8N_HOST` | `0.0.0.0` | Yes |
| `N8N_PORT` | `5678` | Yes |
| `N8N_PROTOCOL` | `https` | Yes |
| `EXECUTIONS_DATA_PRUNE` | `true` | Recommended |
| `EXECUTIONS_DATA_MAX_AGE` | `168` | Recommended |
| `N8N_BASIC_AUTH_ACTIVE` | `true` | Recommended |
| `N8N_BASIC_AUTH_USER` | `admin` | If auth active |
| `N8N_BASIC_AUTH_PASSWORD` | `secure-password` | If auth active |

---

## Related Documentation

- [ADR-004: Railway Bootstrap Strategy](./architecture/adr-004-railway-bootstrap.md) — Full decision record for this deployment approach
- [Architecture](./architecture.md) — System architecture and K8s target state
- [K8s Migration Runbook](./k8s-migration-runbook.md) — When triggers are met
