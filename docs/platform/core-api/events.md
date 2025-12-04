# Event Schemas

> **Module:** core-api
> **Contract:** [IC-001](../../_atoms/SYS.010.md), [IC-002](../../_atoms/SYS.011.md)

---

## Event Envelope ([IC-001](../../_atoms/SYS.010.md))

All events use the `SystemEvent` envelope:

```typescript
interface SystemEvent<TPayload = unknown> {
  // Identity
  id: string; // UUID v7 (time-ordered)
  type: string; // Event type (IC-002/SYS.011 format)

  // Payload
  payload: TPayload; // Event-specific data

  // Context
  org_id: string; // Tenant isolation
  actor_id: string; // Who triggered (user or system)
  actor_type: 'user' | 'system' | 'copilot';

  // Tracing
  correlation_id?: string; // Links related events
  causation_id?: string; // Event that caused this
  trace_id: string; // Distributed tracing

  // Metadata
  version: string; // Schema version (e.g., "v1")
  created_at: string; // ISO8601 timestamp
  idempotency_key?: string; // For deduplication
}
```

---

## Event Naming Convention ([IC-002](../../_atoms/SYS.011.md))

Format: `xentri.{category}.{entity}.{action}.{version}`

| Component  | Description       | Example                          |
| ---------- | ----------------- | -------------------------------- |
| `xentri`   | Namespace prefix  | Always "xentri"                  |
| `category` | Business category | `finance`, `sales`, `strategy`   |
| `entity`   | Domain entity     | `invoice`, `deal`, `soul`        |
| `action`   | What happened     | `created`, `updated`, `approved` |
| `version`  | Schema version    | `v1`, `v2`                       |

**Examples:**

- `xentri.finance.invoice.created.v1`
- `xentri.sales.deal.stage_changed.v1`
- `xentri.strategy.soul.updated.v1`

---

## Core Events

### Soul Events

#### `xentri.strategy.soul.created.v1`

Emitted when a new Soul is created for an organization.

```typescript
interface SoulCreatedPayload {
  soul_id: string;
  business_type: string;
  industry: string;
  sections_initialized: string[];
}
```

#### `xentri.strategy.soul.updated.v1`

Emitted when Soul content changes.

```typescript
interface SoulUpdatedPayload {
  soul_id: string;
  section: string; // Which section changed
  previous_version: string;
  new_version: string;
  change_source: 'user' | 'copilot' | 'recommendation';
}
```

#### `xentri.strategy.soul.recommendation.submitted.v1`

Emitted when a module suggests a Soul update ([IC-005](../../_atoms/SYS.014.md)).

```typescript
interface RecommendationPayload {
  target_section: string;
  recommendation: string;
  evidence: string[];
  confidence: number; // 0.0 - 1.0
  source_module: string;
}
```

---

### Organization Events

#### `xentri.platform.org.created.v1`

```typescript
interface OrgCreatedPayload {
  org_id: string;
  name: string;
  owner_id: string;
  tier: 'free' | 'presencia' | 'light_ops' | 'professional' | 'business' | 'enterprise';
}
```

#### `xentri.platform.org.member.added.v1`

```typescript
interface MemberAddedPayload {
  org_id: string;
  user_id: string;
  role: string;
  invited_by: string;
}
```

---

### System Events

#### `xentri.platform.module.registered.v1`

```typescript
interface ModuleRegisteredPayload {
  module_id: string;
  module_name: string;
  category: string;
  version: string;
  capabilities: string[];
}
```

---

## Event Storage

Events are stored in the `system_events` table:

```sql
CREATE TABLE system_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  payload JSONB NOT NULL,
  org_id UUID NOT NULL REFERENCES organizations(id),
  actor_id TEXT NOT NULL,
  actor_type TEXT NOT NULL,
  correlation_id UUID,
  causation_id UUID REFERENCES system_events(id),
  trace_id TEXT NOT NULL,
  version TEXT NOT NULL,
  idempotency_key TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT unique_idempotency UNIQUE (org_id, idempotency_key)
);

-- RLS Policy
ALTER TABLE system_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY org_isolation ON system_events
  USING (org_id = current_setting('app.org_id')::UUID);

-- Indexes
CREATE INDEX idx_events_type ON system_events(type);
CREATE INDEX idx_events_org_created ON system_events(org_id, created_at DESC);
CREATE INDEX idx_events_correlation ON system_events(correlation_id);
```

---

## Subscribing to Events

Modules subscribe to events via Redis Streams (future) or polling:

```typescript
// Polling approach (current)
const events = await fetch('/api/v1/events?type=xentri.finance.*&since=...');

// Redis Streams (planned)
XREAD STREAMS xentri:events:org_123 $
```
