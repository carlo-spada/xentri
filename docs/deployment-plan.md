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
│   │    Shell    │  │  Core API   │  │ Postgres │  │    Redis    │  │
│   │   (Astro)   │  │  (Fastify)  │  │  16.x    │  │    7.x      │  │
│   │   :4321     │  │   :3000     │  │  :5432   │  │   :6379     │  │
│   └─────────────┘  └─────────────┘  └──────────┘  └─────────────┘  │
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

### 2.3 Deploy Core API

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

### 2.4 Deploy Shell (Astro)

1. Click **+ New** → **GitHub Repo**
2. Select `xentri` repository again
3. Configure:
   - **Root Directory:** `apps/shell`
   - **Build Command:** `pnpm install && pnpm run build`
   - **Start Command:** `node ./dist/server/entry.mjs`
4. Add environment variables (see Phase 3)
5. Generate domain or add custom domain: `xentri.com`

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
CLERK_PUBLISHABLE_KEY=pk_live_xxxxx
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

Railway domains look like: `xentri-shell-production.up.railway.app`

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
