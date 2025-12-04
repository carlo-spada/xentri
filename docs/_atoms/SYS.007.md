---
id: SYS.007
type: requirement
title: 'Automated Action Logging'
status: approved
entity_path: docs/platform/
created: 2025-12-04
updated: 2025-12-04
author: PM
tags: [automation, logging, explainability, audit]
legacy_id: PR-006
---

# Automated Action Logging

> **Atom ID:** `SYS.007`
> **Type:** requirement
> **Status:** Approved
> **Legacy ID:** PR-006

---

## Summary

All automated actions MUST be logged with a human-readable explanation of why the action was taken.

---

## Content

### Requirement Statement

All automated actions MUST be logged with human-readable explanation.

### Rationale

"Visible automation" is a core Xentri principle. Users must never wonder "why did the system do that?" Every automated action — from copilot recommendations to scheduled tasks — must be explainable.

This builds trust and enables:

1. User confidence in automation
2. Debugging and troubleshooting
3. Compliance and audit requirements
4. Continuous improvement of automation rules

### Acceptance Criteria

1. Every automated action creates an audit log entry
2. Log entries include human-readable `reason` field (not just action type)
3. Reasons reference the triggering condition (e.g., "Invoice overdue by 30 days")
4. Users can view automation history for any entity
5. Explanations are localized to user's preferred language

### Explanation Format

```
{
  "action": "sent_reminder_email",
  "entity_type": "invoice",
  "entity_id": "inv_123",
  "reason": "Invoice #247 is 30 days overdue. Automatic reminder sent per your collection policy.",
  "triggered_by": "scheduled_job:invoice_reminders",
  "timestamp": "2025-12-04T10:30:00Z"
}
```

### Constraints

- Explanations must be understandable by non-technical users
- Batch operations must log individually or with clear aggregation
- Explanations must not expose sensitive data

### Implementation

**Implemented By:** core-api

---

## Dependencies

| Atom ID | Relationship | Description                                |
| ------- | ------------ | ------------------------------------------ |
| —       | root         | Constitution-level requirement (no parent) |

---

## Changelog

| Date       | Author | Change                                 |
| ---------- | ------ | -------------------------------------- |
| 2025-12-04 | PM     | Extracted from Constitution PRD PR-006 |
