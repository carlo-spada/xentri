---
entity_type: "{{entity_type}}"
document_type: epics
title: "{{entity_name}} - Epics"
version: "1.0"
date: "{{date}}"
author: "{{user_name}}"
status: draft
parent_epics: "{{parent_epics_path}}"
constitution_epics: "docs/platform/epics.md"
---

# {{entity_name}} Epics

> **Entity Type:** {{entity_type_display}}
> **Scope:** {{entity_scope_description}}
> **Inherits From:** {{parent_epics_path}}
> **Traceability:** Maps to {{fr_pattern}} requirements

---

## Overview

This document defines the epic structure for {{entity_name}}, inheriting from and aligning with the Constitution epics and parent entity epics.

**Cascading Epic Pattern:**
- Parent Epic ID: {{parent_epic_base}}
- This entity uses: Epic {{parent_epic_base}}-x

---

## Requirements Inventory

### Functional Requirements

| ID | Requirement | Epic Coverage |
|----|-------------|---------------|
{{#each functional_requirements}}
| {{id}} | {{description}} | Epic {{epic_ref}} |
{{/each}}

---

## Parent Epic Mapping

| Constitution Epic | Parent Epic | This Entity Epic | Contribution |
|-------------------|-------------|------------------|--------------|
{{#each epic_mapping}}
| Epic {{constitution_id}} | Epic {{parent_id}} | Epic {{local_id}} | {{contribution}} |
{{/each}}

---

## Epic Summary

| Epic ID | Title | Goal | FR Coverage |
|---------|-------|------|-------------|
{{#each epics}}
| {{id}} | {{title}} | {{goal}} | {{fr_coverage}} |
{{/each}}

---

{{#each epics}}
## Epic {{id}}: {{title}}

**Inherits From:** Constitution Epic {{constitution_epic}}
**Goal:** {{goal}}

**Scope:**
- Functional Requirements: {{fr_coverage}}
- Components Involved: {{components}}

**Dependencies:** {{dependencies}}

### Stories

{{#each stories}}
#### Story {{../id}}.{{number}}: {{title}}

As a {{user_type}},
I want {{capability}},
So that {{value_benefit}}.

**Acceptance Criteria:**

**Given** {{given}}
**When** {{when}}
**Then** {{then}}

{{#if and_criteria}}
**And** {{and_criteria}}
{{/if}}

**Prerequisites:** {{prerequisites}}

**Technical Notes:** {{technical_notes}}

---

{{/each}}

### Coordination Points

{{coordination_notes}}

---

{{/each}}

## Traceability Matrix

| FR ID | Description | Epic | Story | Status |
|-------|-------------|------|-------|--------|
{{#each traceability}}
| {{fr_id}} | {{description}} | Epic {{epic}} | Story {{story}} | {{status}} |
{{/each}}

---

## Inheritance Validation

### Constitution Alignment

| Constitution Epic | This Entity Contribution | Alignment Status |
|-------------------|-------------------------|------------------|
{{#each constitution_alignment}}
| Epic {{constitution_id}} | {{contribution}} | {{status}} |
{{/each}}

### Parent Alignment

| Parent Epic | This Entity Extension | Alignment Status |
|-------------|----------------------|------------------|
{{#each parent_alignment}}
| Epic {{parent_id}} | {{extension}} | {{status}} |
{{/each}}

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | {{date}} | {{user_name}} | Initial epic structure |

---

_This is a {{entity_type_display}} epic structure. Child entities (if any) must inherit from and align with this document._
