---
id: {ENTITY}.{SEQ}
type: requirement | interface | decision | constraint
title: "{TITLE}"
status: draft
entity_path: {ENTITY_PATH}
created: {DATE}
updated: {DATE}
author: {AUTHOR}
tags: []
---

# {TITLE}

> **Atom ID:** `{ENTITY}.{SEQ}`
> **Type:** {TYPE}
> **Status:** Draft

---

## Summary

{Brief 1-2 sentence description of what this atom represents}

---

## Content

{Main authoritative content goes here}

### For Requirements

- **Rationale:** Why this requirement exists
- **Acceptance Criteria:** How to verify compliance
- **Constraints:** Any limitations or boundaries

### For Interfaces

- **Contract:** The interface specification
- **Consumers:** Who/what uses this interface
- **Providers:** Who/what implements this interface

### For Decisions (ADRs)

- **Context:** What prompted this decision
- **Decision:** What was decided
- **Consequences:** Positive and negative outcomes
- **Alternatives Considered:** What else was evaluated

### For Constraints

- **Scope:** Where this constraint applies
- **Enforcement:** How compliance is verified
- **Exceptions:** Any permitted exceptions

---

## Dependencies

| Atom ID      | Relationship | Description                          |
| ------------ | ------------ | ------------------------------------ |
| {PARENT_ID}  | parent       | {Why this atom inherits from parent} |
| {SIBLING_ID} | requires     | {Why this atom depends on sibling}   |

---

## Changelog

| Date   | Author   | Change           |
| ------ | -------- | ---------------- |
| {DATE} | {AUTHOR} | Initial creation |
