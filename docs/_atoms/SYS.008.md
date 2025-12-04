---
id: SYS.008
type: requirement
title: 'Graceful Module Failure'
status: approved
entity_path: docs/platform/
created: 2025-12-04
updated: 2025-12-04
author: PM
tags: [resilience, fault-tolerance, shell, modules]
legacy_id: PR-007
---

# Graceful Module Failure

> **Atom ID:** `SYS.008`
> **Type:** requirement
> **Status:** Approved
> **Legacy ID:** PR-007

---

## Summary

All modules MUST fail gracefully and never crash the shell or affect other modules.

---

## Content

### Requirement Statement

All modules MUST fail gracefully; never crash the shell.

### Rationale

The shell is the user's primary interface. A bug in one module (e.g., Finance) must never:

1. Crash the entire application
2. Block navigation to other modules
3. Corrupt shared state
4. Require a full page refresh to recover

Each module operates in isolation with defined boundaries.

### Acceptance Criteria

1. Module JavaScript errors are caught at the island boundary
2. Failed modules display a graceful error state (not blank or broken UI)
3. Error states include "Retry" and "Report Issue" options
4. Module failures are logged with full stack trace for debugging
5. Shell navigation remains functional when any module fails
6. Other modules continue operating normally during failure

### Error State Requirements

- Clear indication that something went wrong
- No technical jargon in user-facing messages
- Option to retry the operation
- Option to report the issue (with context auto-attached)
- Suggestion to refresh if retry fails repeatedly

### Constraints

- Modules cannot catch errors outside their boundary
- Error boundaries must not swallow errors silently
- Recovery attempts must be rate-limited (prevent infinite loops)

### Implementation

**Implemented By:** shell

---

## Dependencies

| Atom ID | Relationship | Description                                |
| ------- | ------------ | ------------------------------------------ |
| —       | root         | Constitution-level requirement (no parent) |

---

## Changelog

| Date       | Author | Change                                 |
| ---------- | ------ | -------------------------------------- |
| 2025-12-04 | PM     | Extracted from Constitution PRD PR-007 |
