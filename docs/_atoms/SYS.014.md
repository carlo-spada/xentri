---
id: SYS.014
type: interface
title: 'Recommendation Submission Protocol'
status: approved
entity_path: docs/platform/
created: 2025-12-04
updated: 2025-12-04
author: Architect
tags: [recommendations, copilots, api, core-api]
legacy_id: IC-005
---

# Recommendation Submission Protocol

> **Atom ID:** `SYS.014`
> **Type:** interface
> **Status:** Approved
> **Legacy ID:** IC-005

---

## Summary

Defines how modules and copilots submit recommendations to the central recommendation engine for user presentation and action.

---

## Content

### Contract

```
POST /api/v1/recommendations
```

### Request Schema

```typescript
interface RecommendationSubmission {
  // Source
  source: {
    type: 'copilot' | 'module' | 'automation';
    id: string; // Copilot/module identifier
    category: string; // Business domain
  };

  // Recommendation
  recommendation: {
    type: 'action' | 'insight' | 'alert';
    priority: 'critical' | 'high' | 'medium' | 'low';
    title: string; // Short summary
    description: string; // Detailed explanation
    reasoning: string; // Why this recommendation

    // Optional action
    action?: {
      type: string; // Action type identifier
      label: string; // Button text
      payload: Record<string, unknown>; // Action parameters
    };
  };

  // Context
  context: {
    entities: string[]; // Related entity IDs
    events?: string[]; // Triggering event IDs
    expires_at?: string; // Recommendation expiry
  };
}
```

### Response Format

```typescript
interface RecommendationResponse {
  id: string; // Assigned recommendation ID
  status: 'queued' | 'delivered' | 'rejected';
  rejection_reason?: string; // If rejected
}
```

### Consumers

- Recommendation engine (aggregates and ranks)
- Notification system (delivers to user)
- Attention dashboard (displays pending)

### Providers

- All copilots
- Modules with automated insights
- Background jobs

### Deduplication

Recommendations are deduplicated by:

- Same source + same entity + same type within 24h
- Configurable cooldown per recommendation type

### Version

**v1.0** — Initial protocol definition

### Defined In

**core-api** — `services/core-api/src/routes/recommendations.ts`

---

## Dependencies

| Atom ID | Relationship | Description                                      |
| ------- | ------------ | ------------------------------------------------ |
| SYS.010 | requires     | Recommendations trigger events                   |
| SYS.007 | implements   | Recommendations include human-readable reasoning |

---

## Changelog

| Date       | Author    | Change                                 |
| ---------- | --------- | -------------------------------------- |
| 2025-12-04 | Architect | Extracted from Constitution PRD IC-005 |
