---
entity_type: constitution
document_type: epics
title: "{{project_name}} - System Epics"
version: "1.0"
date: "{{date}}"
author: "{{user_name}}"
status: draft
---

# System Epics - Constitution

> **Entity Type:** Constitution
> **Scope:** System-wide outcomes coordinating all Infrastructure Modules
> **Traceability:** Maps to PRD Platform Requirements (PR-xxx) and Integration Contracts (IC-xxx)

---

## Overview

This document defines the epic structure for {{project_name}} at the Constitution level. These epics represent category-level outcomes that coordinate work across all Infrastructure Modules.

**Cascading Epic Pattern:**
- Constitution epics use simple IDs: Epic 1, Epic 2, Epic 3...
- Child entities inherit: Epic 1-1, Epic 1-2, Epic 2-1...

---

## Requirements Inventory

### Platform Requirements (PR-xxx)

| ID | Requirement | Epic Coverage |
|----|-------------|---------------|
{{#each platform_requirements}}
| {{id}} | {{description}} | Epic {{epic_ref}} |
{{/each}}

### Integration Contracts (IC-xxx)

| ID | Contract | Epic Coverage |
|----|----------|---------------|
{{#each integration_contracts}}
| {{id}} | {{description}} | Epic {{epic_ref}} |
{{/each}}

---

## Epic Summary

| Epic | Title | Goal | PR/IC Coverage |
|------|-------|------|----------------|
{{#each epics}}
| {{number}} | {{title}} | {{goal}} | {{coverage}} |
{{/each}}

---

{{#each epics}}
## Epic {{number}}: {{title}}

**Goal:** {{goal}}

**Scope:**
- Platform Requirements: {{pr_coverage}}
- Integration Contracts: {{ic_coverage}}
- Infrastructure Modules: {{modules_involved}}

**Dependencies:** {{dependencies}}

### Stories

{{#each stories}}
#### Story {{../number}}.{{number}}: {{title}}

**Traces to:** {{traces_to}}
**Coordinates:** {{modules}}

**Acceptance Criteria:**
{{#each acceptance_criteria}}
- {{this}}
{{/each}}

**Technical Notes:** {{technical_notes}}

{{/each}}

---

{{/each}}

## Traceability Matrix

| Requirement | Type | Epic | Story | Status |
|-------------|------|------|-------|--------|
{{#each traceability}}
| {{requirement_id}} | {{type}} | Epic {{epic}} | Story {{story}} | {{status}} |
{{/each}}

---

## Coordination Model

### Infrastructure Module Coordination

| Epic | shell | ui | core-api | ts-schema | orchestration |
|------|-------|-----|----------|-----------|---------------|
{{#each coordination_matrix}}
| Epic {{epic}} | {{shell}} | {{ui}} | {{core_api}} | {{ts_schema}} | {{orchestration}} |
{{/each}}

---

## Child Entity Epic Inheritance

When creating epics for Infrastructure Modules, use cascading IDs:

| Constitution Epic | Child Epic Pattern | Example |
|-------------------|-------------------|---------|
| Epic 1 | Epic 1-x | Epic 1-1, Epic 1-2 |
| Epic 2 | Epic 2-x | Epic 2-1, Epic 2-2 |
| Epic 3 | Epic 3-x | Epic 3-1, Epic 3-2 |

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | {{date}} | {{user_name}} | Initial epic structure |

---

_This is the Constitution-level epic structure. Infrastructure Module epics must inherit from and align with this document._
