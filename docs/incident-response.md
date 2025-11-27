# Incident Response Runbook

> Story 1.7 - Operational Readiness

## Quick Reference

### Health Check Endpoints

| Service | Endpoint | Expected Response |
|---------|----------|-------------------|
| Core API | `GET /health` | `{"status":"ok"}` |
| Core API | `GET /health/ready` | `{"status":"ok","checks":{"database":"ok"}}` |
| Shell | `GET /` | HTML with "Xentri" |

**Live URLs:**
- Core API: https://core-api-production-8016.up.railway.app
- Health: https://core-api-production-8016.up.railway.app/health

### Key Environment Variables

```bash
# Required
DATABASE_URL=postgresql://...
CLERK_SECRET_KEY=sk_...
PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...

# Observability (optional)
SENTRY_DSN=https://...@sentry.io/...
LOG_LEVEL=info|debug|warn|error
```

## Incident Severity Levels

| Level | Description | Response Time | Examples |
|-------|-------------|---------------|----------|
| P1 | Critical | < 15 min | Service down, data loss |
| P2 | High | < 1 hour | Degraded performance, partial outage |
| P3 | Medium | < 4 hours | Feature broken, workaround available |
| P4 | Low | < 24 hours | Minor bug, cosmetic issue |

## Common Incidents

### 1. API Not Responding

**Symptoms:**
- Health check returns 5xx
- Requests timing out

**Investigation:**
```bash
# Check API logs
railway logs --service core-api

# Check database connectivity
railway run --service core-api -- npx prisma db pull

# Check health endpoint
curl https://api.xentri.com/api/v1/health/ready
```

**Resolution:**
1. Check Railway dashboard for service status
2. Restart service if needed
3. Check database connection limits
4. Review recent deployments

### 2. Database Connection Issues

**Symptoms:**
- Health check shows `database: 'error'`
- Prisma connection errors in logs

**Investigation:**
```bash
# Check database status in Railway
railway status

# Test connection
railway run --service core-api -- node -e "require('@prisma/client').PrismaClient().$connect()"
```

**Resolution:**
1. Check DATABASE_URL is correctly set
2. Verify database service is running
3. Check connection pool limits
4. Review for connection leaks

### 3. Authentication Failures

**Symptoms:**
- 401 errors on authenticated routes
- Clerk webhook failures

**Investigation:**
```bash
# Check Clerk dashboard for webhook status
# Review webhook logs in Sentry

# Verify Clerk keys
railway vars --service core-api | grep CLERK
```

**Resolution:**
1. Verify CLERK_SECRET_KEY matches Clerk dashboard
2. Check webhook signing secret
3. Review Clerk status page

### 4. High Latency

**Symptoms:**
- API responses > 300ms
- Shell load > 2s

**Investigation:**
```bash
# Check trace_id in logs for slow requests
# Review Sentry performance data
# Check database query times
```

**Resolution:**
1. Review slow queries in logs
2. Check for N+1 query patterns
3. Verify database indexes
4. Check for resource exhaustion

## Rollback Procedure

### Railway Rollback

```bash
# List recent deployments
railway deployments

# Rollback to specific deployment
railway rollback --deployment <deployment-id>
```

### Database Migration Rollback

```bash
# Check migration status
railway run --service core-api -- npx prisma migrate status

# Rollback last migration (if possible)
railway run --service core-api -- npx prisma migrate resolve --rolled-back <migration-name>
```

## Escalation Path

1. **On-call Developer** - First responder, investigates and resolves P3/P4
2. **Team Lead** - Escalation for P2, coordinates response
3. **CTO** - Escalation for P1, external communication

## Post-Incident

1. **Incident Report** - Document timeline, root cause, resolution
2. **Blameless Retrospective** - What happened, how to prevent recurrence
3. **Action Items** - Create backlog items for improvements

## Docker/pnpm Deployment Issues

### Container Crash: `Cannot find package 'fastify'`

**Root Cause:** pnpm v10 changed `deploy` command behavior. Without `--legacy` flag, pnpm deploy fails for workspaces that don't have `inject-workspace-packages=true`.

**Fix:** Add `--legacy` flag to Dockerfile:
```dockerfile
RUN pnpm --filter @xentri/core-api deploy --legacy --prod /app/deployed
```

### Container Crash: `Cannot find module '.prisma/client/default'`

**Root Cause:** pnpm deploy's postinstall generates Prisma client to workspace root (`/app/node_modules`), not to deployed directory (`/app/deployed/node_modules`).

**Fix:** Copy `.prisma` from workspace root after pnpm deploy:
```dockerfile
RUN cp -r /app/node_modules/.pnpm/@prisma+client*/node_modules/.prisma /app/deployed/node_modules/
```

### Best Practice: Always Build Locally First

Before pushing Docker changes to Railway, test locally:
```bash
docker build -f services/core-api/Dockerfile -t core-api-test .
docker run --rm core-api-test node -e "require('fastify'); require('@prisma/client'); console.log('ok')"
```

## Monitoring Dashboard

- **Railway Dashboard:** https://railway.app/project/xentri
- **Sentry:** https://sentry.io/xentri (configure SENTRY_DSN)
- **Clerk Dashboard:** https://dashboard.clerk.com

## Contact Information

| Role | Contact |
|------|---------|
| On-call | (configure) |
| Team Lead | (configure) |
| Railway Support | support@railway.app |
| Clerk Support | support@clerk.com |
