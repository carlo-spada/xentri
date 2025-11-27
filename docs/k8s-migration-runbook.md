# Kubernetes Migration Runbook

> **Status:** Skeleton (pre-trigger)
> **Last Updated:** 2025-11-27
> **Related:** [ADR-004: Railway Bootstrap Strategy](./architecture/adr-004-railway-bootstrap.md)

This runbook is executed when migration triggers are met. Do not execute prematurely.

---

## Migration Triggers

Execute this runbook when ANY of these conditions are met:

| Trigger | Threshold | Status |
|---------|-----------|--------|
| Monthly Railway spend | > $500/mo | [ ] Not triggered |
| Compliance requirement | SOC2, GDPR DPA, etc. | [ ] Not triggered |
| First paying customer (HA required) | Revenue > $0 | [ ] Not triggered |
| SLA commitment | Written/marketed uptime guarantee | [ ] Not triggered |

**Current Status:** Pre-trigger (Railway bootstrap phase)

---

## Railway → Kubernetes Mapping

Reference table for translating Railway concepts to K8s equivalents:

| Railway Concept | K8s Equivalent | Notes |
|-----------------|----------------|-------|
| Service | Deployment + Service | One Deployment per Railway service |
| Service Variables | ConfigMap + Secret | Non-sensitive → ConfigMap, sensitive → Secret |
| Service Linking (`${{Postgres.DATABASE_URL}}`) | ExternalSecrets or sealed-secrets | Vault-backed recommended |
| Volume | PersistentVolumeClaim (PVC) | Match storage class to needs |
| Custom Domain | Ingress + cert-manager | NGINX Ingress Controller |
| PR Environments | Namespace-per-PR (ArgoCD ApplicationSet) | Optional, adds complexity |
| Health Check Path | `livenessProbe` / `readinessProbe` | Copy from `railway.toml` |
| `railway.toml` | Helm `values.yaml` | 1:1 mapping of settings |

---

## Pre-Migration Checklist

Before starting migration:

- [ ] **Backup:** Export all Railway environment variables
- [ ] **Secrets:** Document all secrets (do NOT commit values)
- [ ] **Database:** Take Postgres snapshot/backup
- [ ] **Redis:** Document stream state (or accept data loss for queues)
- [ ] **n8n:** Backup `N8N_ENCRYPTION_KEY` and workflow exports
- [ ] **DNS:** Note current CNAME targets for rollback
- [ ] **Monitoring:** Baseline current metrics for comparison

---

## Phase 1: Infrastructure Provisioning (Terraform)

### 1.1 Cluster Setup

```hcl
# terraform/main.tf (skeleton)

provider "google" {  # or aws/azurerm
  project = "xentri-prod"
  region  = "us-central1"
}

# Managed Kubernetes cluster
resource "google_container_cluster" "primary" {
  name     = "xentri-prod"
  location = "us-central1"

  # Start with standard node pool
  initial_node_count = 2

  node_config {
    machine_type = "e2-standard-2"  # 2 vCPU, 8GB RAM
    disk_size_gb = 50
  }
}

# Managed Postgres (Cloud SQL)
resource "google_sql_database_instance" "postgres" {
  name             = "xentri-postgres"
  database_version = "POSTGRES_16"
  region           = "us-central1"

  settings {
    tier = "db-f1-micro"  # Start small, scale later

    backup_configuration {
      enabled = true
    }
  }
}

# Managed Redis (Memorystore)
resource "google_redis_instance" "redis" {
  name           = "xentri-redis"
  tier           = "BASIC"  # or STANDARD_HA for HA
  memory_size_gb = 1
  region         = "us-central1"
  redis_version  = "REDIS_7_0"
}
```

### 1.2 Required Terraform Resources

- [ ] VPC + Subnets
- [ ] GKE/EKS/AKS Cluster
- [ ] Managed Postgres (Cloud SQL/RDS/Azure Database)
- [ ] Managed Redis (Memorystore/ElastiCache/Azure Cache)
- [ ] Cloud Storage bucket (for assets, replacing R2 if needed)
- [ ] Service accounts + IAM bindings

---

## Phase 2: Kubernetes Resources (Helm)

### 2.1 Helm Chart Structure

```
helm/xentri/
├── Chart.yaml
├── values.yaml
├── values-staging.yaml
├── values-production.yaml
└── templates/
    ├── core-api/
    │   ├── deployment.yaml
    │   ├── service.yaml
    │   ├── configmap.yaml
    │   └── hpa.yaml
    ├── shell/
    │   ├── deployment.yaml
    │   ├── service.yaml
    │   └── hpa.yaml
    ├── n8n/
    │   ├── deployment-main.yaml
    │   ├── deployment-worker.yaml
    │   ├── service.yaml
    │   └── pvc.yaml
    ├── ingress.yaml
    └── secrets.yaml  # ExternalSecrets reference
```

### 2.2 Core API Deployment (Template)

```yaml
# helm/xentri/templates/core-api/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: core-api
spec:
  replicas: {{ .Values.coreApi.replicas }}
  selector:
    matchLabels:
      app: core-api
  template:
    metadata:
      labels:
        app: core-api
    spec:
      containers:
        - name: core-api
          image: "{{ .Values.coreApi.image.repository }}:{{ .Values.coreApi.image.tag }}"
          ports:
            - containerPort: 3000
          env:
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: xentri-secrets
                  key: database-url
            - name: REDIS_URL
              valueFrom:
                secretKeyRef:
                  name: xentri-secrets
                  key: redis-url
          livenessProbe:
            httpGet:
              path: /api/v1/health
              port: 3000
            initialDelaySeconds: 30
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /api/v1/health
              port: 3000
            initialDelaySeconds: 5
            periodSeconds: 5
          resources:
            requests:
              cpu: "100m"
              memory: "256Mi"
            limits:
              cpu: "500m"
              memory: "512Mi"
```

### 2.3 Values File (Template)

```yaml
# helm/xentri/values-production.yaml
coreApi:
  replicas: 2
  image:
    repository: gcr.io/xentri-prod/core-api
    tag: latest

shell:
  replicas: 2
  image:
    repository: gcr.io/xentri-prod/shell
    tag: latest

n8n:
  main:
    replicas: 1
  worker:
    replicas: 2
  encryptionKeySecret: n8n-encryption-key

ingress:
  enabled: true
  className: nginx
  hosts:
    - host: xentri.com
      paths:
        - path: /
          service: shell
    - host: api.xentri.com
      paths:
        - path: /
          service: core-api
    - host: n8n.xentri.com
      paths:
        - path: /
          service: n8n
  tls:
    - secretName: xentri-tls
      hosts:
        - xentri.com
        - api.xentri.com
        - n8n.xentri.com
```

---

## Phase 3: Data Migration

### 3.1 Postgres Migration

```bash
# 1. Take Railway Postgres backup
railway run --service postgres pg_dump -Fc > xentri_backup.dump

# 2. Restore to managed Postgres
pg_restore -h <cloud-sql-ip> -U postgres -d xentri xentri_backup.dump

# 3. Verify RLS policies are intact
psql -h <cloud-sql-ip> -U postgres -d xentri -c "
  SELECT tablename, rowsecurity
  FROM pg_tables
  WHERE schemaname = 'public';
"
```

### 3.2 Redis Migration

Redis data is typically ephemeral (queues, cache). Options:

1. **Accept data loss:** Clear queues, let n8n rebuild state
2. **MIGRATE command:** For critical stream data
3. **RDB snapshot:** Export from Railway, import to managed Redis

**Recommendation:** Accept queue data loss during migration window. Ensure no critical jobs are in-flight.

---

## Phase 4: DNS Cutover

### 4.1 Pre-Cutover

```bash
# Verify new endpoints are healthy
curl https://api.xentri.com/api/v1/health  # Should return 200
curl https://xentri.com                     # Should return 200
```

### 4.2 DNS Update (Cloudflare)

```
# Old (Railway)
CNAME   @       xentri-shell-production.up.railway.app
CNAME   api     xentri-api-production.up.railway.app

# New (K8s Ingress)
CNAME   @       k8s-ingress.xentri.com
CNAME   api     k8s-ingress.xentri.com
A       k8s-ingress   <load-balancer-ip>
```

### 4.3 Post-Cutover Verification

- [ ] Shell loads correctly
- [ ] API health check passes
- [ ] Auth flow works (Clerk integration)
- [ ] n8n webhooks receive events
- [ ] RLS smoke tests pass

---

## Phase 5: Rollback Procedure

If migration fails, rollback within DNS TTL window:

1. Revert Cloudflare DNS to Railway CNAMEs
2. Verify Railway services are still running (they should be)
3. Document what failed for retry

**Critical:** Keep Railway services running until K8s is verified stable (at least 48 hours).

---

## Post-Migration Checklist

After successful migration:

- [ ] Monitor error rates for 48 hours
- [ ] Set up K8s-specific alerting (PodCrashLoopBackOff, etc.)
- [ ] Configure HPA for auto-scaling
- [ ] Set up PodDisruptionBudgets for high availability
- [ ] Update CLAUDE.md with new deployment target
- [ ] Archive Railway project (do not delete immediately)
- [ ] Update ADR-004 status to "Migration Complete"

---

## Estimated Timeline

| Phase | Duration | Dependencies |
|-------|----------|--------------|
| Terraform provisioning | 2-4 hours | Cloud account access |
| Helm chart creation | 4-8 hours | Docker images built |
| Data migration | 1-2 hours | Maintenance window |
| DNS cutover | 15 minutes | All services healthy |
| Verification | 2-4 hours | Traffic flowing |
| **Total** | **1-2 days** | — |

---

## Contacts & Resources

- **Terraform Docs:** https://registry.terraform.io/
- **Helm Docs:** https://helm.sh/docs/
- **GKE Docs:** https://cloud.google.com/kubernetes-engine/docs
- **n8n K8s Guide:** https://docs.n8n.io/hosting/installation/server-setups/kubernetes/

---

*This runbook will be expanded with specific details when migration triggers are met.*
