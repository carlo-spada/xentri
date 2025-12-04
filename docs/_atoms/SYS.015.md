---
id: SYS.015
type: interface
title: 'Notification Delivery Contract'
status: approved
entity_path: docs/platform/
created: 2025-12-04
updated: 2025-12-04
author: Architect
tags: [notifications, delivery, channels, core-api]
legacy_id: IC-006
---

# Notification Delivery Contract

> **Atom ID:** `SYS.015`
> **Type:** interface
> **Status:** Approved
> **Legacy ID:** IC-006

---

## Summary

Defines how notifications are delivered to users across multiple channels (in-app, email, push) with consistent formatting and user preferences.

---

## Content

### Contract

```
POST /api/v1/notifications
```

### Request Schema

```typescript
interface NotificationRequest {
  // Recipient
  recipient: {
    user_id: string;
    org_id: string;
  };

  // Content
  notification: {
    type: 'alert' | 'digest' | 'action_required' | 'info';
    priority: 'critical' | 'high' | 'normal' | 'low';
    title: string;
    body: string;

    // Rich content (optional)
    data?: {
      icon?: string;
      image?: string;
      deep_link?: string; // In-app navigation
      actions?: {
        label: string;
        action: string;
        payload?: Record<string, unknown>;
      }[];
    };
  };

  // Delivery preferences
  channels?: ('in_app' | 'email' | 'push')[]; // Override user prefs
  schedule?: string; // ISO 8601 for delayed delivery
}
```

### Channel Selection

Default channel selection based on priority:

| Priority | Channels                   |
| -------- | -------------------------- |
| critical | in_app + push + email      |
| high     | in_app + push              |
| normal   | in_app                     |
| low      | in_app (batched in digest) |

Users can override via notification preferences.

### Response Format

```typescript
interface NotificationResponse {
  id: string;
  status: 'queued' | 'sent' | 'failed';
  channels: {
    channel: string;
    status: 'pending' | 'sent' | 'failed';
    sent_at?: string;
  }[];
}
```

### Consumers

- User notification center (in-app)
- Email service (transactional emails)
- Push notification service

### Providers

- Recommendation engine
- Copilots (direct user communication)
- System alerts

### Constraints

- Critical notifications cannot be silenced
- Digest notifications are batched (configurable schedule)
- Email requires user email verification

### Version

**v1.0** — Initial delivery contract

### Defined In

**core-api** — `services/core-api/src/routes/notifications.ts`

---

## Dependencies

| Atom ID | Relationship | Description                              |
| ------- | ------------ | ---------------------------------------- |
| —       | root         | Constitution-level interface (no parent) |

---

## Changelog

| Date       | Author    | Change                                 |
| ---------- | --------- | -------------------------------------- |
| 2025-12-04 | Architect | Extracted from Constitution PRD IC-006 |
