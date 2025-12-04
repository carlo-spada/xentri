---
id: SYS.009
type: requirement
title: 'Soul-Aware Vocabulary'
status: approved
entity_path: docs/platform/
created: 2025-12-04
updated: 2025-12-04
author: PM
tags: [personalization, soul, vocabulary, copilot]
legacy_id: PR-008
---

# Soul-Aware Vocabulary

> **Atom ID:** `SYS.009`
> **Type:** requirement
> **Status:** Approved
> **Legacy ID:** PR-008

---

## Summary

All copilots MUST adapt their vocabulary and terminology to match the business type indicated in the Soul.

---

## Content

### Requirement Statement

All copilots MUST adapt vocabulary to Soul-indicated business type.

### Rationale

Xentri is not one-size-fits-all. A doctor's practice, a boutique hotel, and a tech startup use completely different terminology:

| Generic Term | Doctor       | Hotel            | Startup      |
| ------------ | ------------ | ---------------- | ------------ |
| Customer     | Patient      | Guest            | Client       |
| Sale         | Consultation | Booking          | Deal         |
| Product      | Treatment    | Room             | Solution     |
| Pipeline     | Care Journey | Reservation Flow | Sales Funnel |

Copilots that speak the user's language build trust and reduce cognitive load.

### Acceptance Criteria

1. Copilots read business type from Soul at interaction start
2. All generated text uses industry-appropriate terminology
3. Vocabulary mappings are configurable per business type
4. Users can override default vocabulary in their Soul
5. Consistency across all copilots (same term everywhere)

### Vocabulary Sources

1. **Business Type** — Primary industry classification from Soul
2. **Custom Overrides** — User-defined term replacements
3. **Regional Variants** — Locale-specific terminology (UK vs US English)

### Constraints

- Vocabulary changes must not affect data model (labels only)
- Search must work with both generic and custom terms
- Exports may need generic terms for interoperability

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
| 2025-12-04 | PM     | Extracted from Constitution PRD PR-008 |
