# Proposal: Federated Requirements Model for BMAD

**Author:** Carlo + PM Agent (John)
**Date:** 2025-12-01
**Status:** Draft for BMad Builder Review
**Context:** Adapting BMAD validation for multi-team, hierarchical architectures

---

## Executive Summary

The current BMAD PRD validation assumes a **monolithic requirements model** where all Functional Requirements (FRs) live in a single PRD and all stories trace back to them. This doesn't work for **federated architectures** like Xentri where:

- Multiple independent teams own different parts of the system
- A central "constitution" defines cross-cutting rules
- Each sub-category has its own PRD with domain-specific requirements
- Stories need to trace to both local and platform-level requirements

**Proposal:** Introduce a **Federated Requirements Model** with three requirement types, distinct document types, and appropriate validation checklists for each.

---

## Part 1: The Requirements Hierarchy

### 1.1 Requirement Types

| Type | Prefix | Scope | Owner | Purpose |
|------|--------|-------|-------|---------|
| **Platform Requirement** | `PR-xxx` | System-wide | Orchestration Team | Non-negotiable rules ALL modules must follow |
| **Integration Contract** | `IC-xxx` | Cross-module | Orchestration Team | Defines HOW modules communicate |
| **Functional Requirement** | `FR-{SCOPE}-xxx` | Domain-specific | Sub-category Team | Features within a specific domain |

### 1.2 Requirement Hierarchy Visual

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         ORCHESTRATION LEVEL                              │
│                      (Constitution Document)                             │
│                                                                          │
│   ┌───────────────────────────┐   ┌───────────────────────────────────┐ │
│   │  Platform Requirements    │   │  Integration Contracts            │ │
│   │  (PR-xxx)                 │   │  (IC-xxx)                         │ │
│   │                           │   │                                   │ │
│   │  Rules everyone follows:  │   │  How modules communicate:         │ │
│   │  • Security mandates      │   │  • Event schemas                  │ │
│   │  • Multi-tenancy rules    │   │  • API contracts                  │ │
│   │  • Data governance        │   │  • Registration protocols         │ │
│   │  • UX consistency         │   │  • Authentication flows           │ │
│   └───────────────────────────┘   └───────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
                    ▼               ▼               ▼
┌─────────────────────────┐ ┌─────────────────────────┐ ┌─────────────────────────┐
│   SUB-CATEGORY A        │ │   SUB-CATEGORY B        │ │   SUB-CATEGORY C        │
│   (Domain PRD)          │ │   (Domain PRD)          │ │   (Domain PRD)          │
│                         │ │                         │ │                         │
│ FR-{SCOPE-A}-xxx        │ │ FR-{SCOPE-B}-xxx        │ │ FR-{SCOPE-C}-xxx        │
│                         │ │                         │ │                         │
│ Inherits: PR-xxx        │ │ Inherits: PR-xxx        │ │ Inherits: PR-xxx        │
│ Implements: IC-xxx      │ │ Implements: IC-xxx      │ │ Implements: IC-xxx      │
└─────────────────────────┘ └─────────────────────────┘ └─────────────────────────┘
            │                           │                           │
            ▼                           ▼                           ▼
      epics.md                    epics.md                    epics.md
      Stories trace to:           Stories trace to:           Stories trace to:
      FR-{A} + PR + IC            FR-{B} + PR + IC            FR-{C} + PR + IC
```

### 1.3 Inheritance Rules

1. **All sub-category PRDs inherit ALL Platform Requirements (PR-xxx)**
   - No exceptions, no overrides
   - Sub-categories document WHICH PRs they implement, not WHETHER

2. **Sub-category PRDs declare which Integration Contracts (IC-xxx) they implement**
   - Based on what they consume/produce
   - Must implement contracts relevant to their integration points

3. **Functional Requirements (FR-xxx) are locally scoped**
   - Owned entirely by sub-category team
   - No approval needed from orchestration (as long as PRs are followed)
   - Prefixed with scope identifier: `FR-INFRA-001`, `FR-SHELL-001`, etc.

---

## Part 2: Document Types

### 2.1 Document Type Definitions

| Document Type | Location Pattern | Contains | Validated By |
|---------------|------------------|----------|--------------|
| **Constitution PRD** | `{category}/orchestration/prd.md` | PR-xxx, IC-xxx, philosophy, NFRs | Constitution Checklist |
| **Domain PRD** | `{category}/{subcategory}/prd.md` | FR-xxx, domain context, scope | Domain PRD Checklist |
| **Epic Breakdown** | `{category}/{subcategory}/epics.md` | Epics, stories, traceability | Epic Checklist |

### 2.2 Constitution PRD Structure

```markdown
# {Project} - Platform Constitution

## Executive Summary
## Project Classification
## Product Brief Reference

## Platform Requirements (PR-xxx)
### Security Requirements
- PR-001: ...
- PR-002: ...

### Multi-Tenancy Requirements
- PR-010: ...

### Data Governance Requirements
- PR-020: ...

### UX Consistency Requirements
- PR-030: ...

### Observability Requirements
- PR-040: ...

## Integration Contracts (IC-xxx)
### Event System Contracts
- IC-001: Event Envelope Schema
- IC-002: Event Naming Convention

### API Contracts
- IC-010: Module Registration Manifest
- IC-011: Brief Access API

### Authentication Contracts
- IC-020: Session Token Format
- IC-021: Permission Check Protocol

## Non-Functional Requirements
(System-wide targets)

## Sub-Category PRD Requirements
(What every domain PRD must contain)

## Governance Rules
## Open Questions
## Document History
```

### 2.3 Domain PRD Structure

```markdown
# {Sub-category} - Product Requirements Document

## Overview
- Parent Constitution: `{path-to-constitution}`
- Scope: {what this sub-category covers}
- Team: {owning team}

## Platform Compliance
### Inherited Platform Requirements
- PR-001: {how we comply}
- PR-002: {how we comply}
...

### Implemented Integration Contracts
- IC-001: {we produce events matching this schema}
- IC-010: {we register with shell using this manifest}
...

## Functional Requirements

### {Feature Area 1}
- FR-{SCOPE}-001: ...
- FR-{SCOPE}-002: ...

### {Feature Area 2}
- FR-{SCOPE}-010: ...

## Success Criteria
## Scope (MVP / Growth / Vision)
## Risks & Mitigations
## Open Questions
## Document History
```

### 2.4 Epic Breakdown Structure

```markdown
# {Sub-category} - Epic Breakdown

## Traceability Matrix
| FR | Epic | Stories |
|----|------|---------|
| FR-{SCOPE}-001 | Epic 1 | 1.1, 1.2 |
| FR-{SCOPE}-002 | Epic 1 | 1.3 |
| PR-001 | Epic 1 | 1.1 (RLS setup) |
| IC-001 | Epic 2 | 2.1 (event emission) |

## Epic 1: {Name}
### Story 1.1: {Name}
**Implements:** FR-{SCOPE}-001, PR-001
**Uses Contracts:** IC-010

**As a** {role}...
**Acceptance Criteria:**
1. ...
```

---

## Part 3: Naming Conventions

### 3.1 Requirement ID Format

```
{TYPE}-{SCOPE}-{NUMBER}

TYPE:
  PR = Platform Requirement (constitution-level)
  IC = Integration Contract (constitution-level)
  FR = Functional Requirement (domain-level)

SCOPE (for FR only):
  INFRA = Infrastructure sub-category
  SHELL = Shell (frontend container)
  UI    = UI component library
  API   = Core API
  SCHEMA = Shared schemas
  STRAT = Strategy category
  MKTG  = Marketing category
  SALES = Sales category
  FIN   = Finance category
  OPS   = Operations category
  TEAM  = Team category
  LEGAL = Legal category

NUMBER:
  Three digits, grouped by feature area
  001-009 = Feature area 1
  010-019 = Feature area 2
  ...
```

### 3.2 Examples

| ID | Meaning |
|----|---------|
| `PR-001` | Platform Requirement #1 (e.g., "All tables must have org_id") |
| `IC-010` | Integration Contract #10 (e.g., "Module registration manifest format") |
| `FR-INFRA-001` | Infrastructure functional requirement #1 (e.g., "Brief must support versioning") |
| `FR-SHELL-010` | Shell functional requirement #10 (e.g., "Sidebar must collapse to icons") |
| `FR-SALES-005` | Sales category functional requirement #5 (e.g., "Deal stages must be configurable") |

### 3.3 Cross-Reference Format

In stories and documentation:

```markdown
**Implements:** FR-INFRA-001, FR-INFRA-002, PR-003
**Uses Contracts:** IC-001, IC-010
**Blocked By:** FR-API-005 (different sub-category dependency)
```

---

## Part 4: Validation Strategy

### 4.1 Three Validation Checklists

The current single PRD checklist must be split into three:

| Checklist | Validates | Key Checks |
|-----------|-----------|------------|
| **Constitution Checklist** | Orchestration PRD | PRs complete, ICs defined, NFRs measurable, governance clear |
| **Domain PRD Checklist** | Sub-category PRD | FRs numbered, PRs acknowledged, ICs declared, scope clear |
| **Epic Checklist** | Epic breakdown | FR coverage, traceability matrix, story quality, sequencing |

### 4.2 Constitution Checklist (New)

```markdown
# Constitution PRD Validation Checklist

## 1. Platform Requirements Completeness
- [ ] Security requirements defined (PR-0xx)
- [ ] Multi-tenancy requirements defined (PR-0xx)
- [ ] Data governance requirements defined (PR-0xx)
- [ ] UX consistency requirements defined (PR-0xx)
- [ ] Observability requirements defined (PR-0xx)
- [ ] Each PR is testable and enforceable
- [ ] No domain-specific features in PRs (those belong in sub-category PRDs)

## 2. Integration Contracts Completeness
- [ ] Event system contracts defined (IC-0xx)
- [ ] API contracts defined (IC-0xx)
- [ ] Authentication contracts defined (IC-0xx)
- [ ] Each IC has schema/format specification
- [ ] Each IC has versioning strategy
- [ ] Contracts are implementable by independent teams

## 3. Non-Functional Requirements
- [ ] Performance targets specified
- [ ] Security requirements specified
- [ ] Scalability requirements specified
- [ ] Reliability requirements specified
- [ ] Observability requirements specified

## 4. Governance
- [ ] Sub-category PRD requirements documented
- [ ] Change process for PRs defined
- [ ] Change process for ICs defined
- [ ] Ownership model clear

## 5. Quality
- [ ] No domain-specific FRs (those belong in sub-category PRDs)
- [ ] Language is directive, not suggestive
- [ ] No unfilled placeholders
```

### 4.3 Domain PRD Checklist (Modified)

```markdown
# Domain PRD Validation Checklist

## 1. Constitution Compliance
- [ ] Parent constitution referenced
- [ ] ALL inherited PRs acknowledged with compliance approach
- [ ] Relevant ICs declared with implementation approach
- [ ] No contradiction with constitution

## 2. Functional Requirements Quality
- [ ] Each FR has unique identifier (FR-{SCOPE}-xxx)
- [ ] FRs describe WHAT, not HOW
- [ ] FRs are testable and verifiable
- [ ] FRs are domain-scoped (not platform-level)
- [ ] All MVP features have FRs
- [ ] FRs organized by feature area
- [ ] Priority indicated (MVP/Growth/Vision)

## 3. Scope Management
- [ ] MVP scope defined
- [ ] Growth scope captured
- [ ] Out-of-scope documented

## 4. Readiness
- [ ] Sufficient for architecture decisions
- [ ] Sufficient for epic breakdown
- [ ] Dependencies on other sub-categories documented
```

### 4.4 Epic Checklist (Modified)

```markdown
# Epic Breakdown Validation Checklist

## 1. Traceability (CRITICAL)
- [ ] Traceability matrix present
- [ ] Every FR covered by at least one story
- [ ] Every story references at least one FR
- [ ] PR compliance documented per story (where applicable)
- [ ] IC usage documented per story (where applicable)
- [ ] No orphaned FRs
- [ ] No orphaned stories

## 2. Story Quality
- [ ] User story format used
- [ ] Acceptance criteria numbered and testable
- [ ] Stories are vertically sliced
- [ ] Stories are appropriately sized

## 3. Sequencing
- [ ] Epic 1 establishes foundation (or adapts for brownfield)
- [ ] No forward dependencies
- [ ] Dependencies on other sub-categories explicit
- [ ] Each epic delivers end-to-end value

## 4. Cross-Team Dependencies
- [ ] Dependencies on other sub-category FRs documented
- [ ] Dependencies on platform ICs documented
- [ ] Blocking dependencies flagged
```

---

## Part 5: BMAD Integration Points

### 5.1 Workflow Changes Needed

| Current Workflow | Change Needed |
|------------------|---------------|
| `prd/workflow.yaml` | Add document type detection (constitution vs domain) |
| `prd/checklist.md` | Split into three checklists based on document type |
| `prd/prd-template.md` | Create two templates: constitution and domain |
| `create-epics-and-stories` | Update to include traceability matrix |
| `validate-prd` | Route to appropriate checklist based on document type |

### 5.2 New Workflows Needed

| Workflow | Purpose |
|----------|---------|
| `create-constitution` | Create orchestration-level PRD with PRs and ICs |
| `create-domain-prd` | Create sub-category PRD inheriting from constitution |
| `validate-constitution` | Validate constitution PRD |
| `validate-domain-prd` | Validate domain PRD |
| `cross-reference-check` | Verify all FRs trace to stories across sub-categories |

### 5.3 Template Changes

**New: Constitution PRD Template**
- Platform Requirements section with numbered PR-xxx
- Integration Contracts section with numbered IC-xxx
- Sub-category requirements section
- No Functional Requirements section (that's for domain PRDs)

**New: Domain PRD Template**
- Constitution compliance section
- Functional Requirements section with FR-{SCOPE}-xxx
- Lighter structure (inherits NFRs from constitution)

**Modified: Epic Template**
- Add traceability matrix section
- Add "Implements" and "Uses Contracts" fields to stories
- Add cross-team dependency documentation

### 5.4 Validation Routing Logic

```yaml
# Proposed logic for validate-prd workflow
validation_routing:
  detect_document_type:
    - if: file_path contains "/orchestration/prd.md"
      then: use constitution_checklist
    - if: file contains "Platform Requirements" AND file contains "Integration Contracts"
      then: use constitution_checklist
    - else:
      then: use domain_prd_checklist

  validate_epics:
    - always: use epic_checklist
    - additional: cross_reference_check if multiple sub-categories exist
```

### 5.5 Agent Considerations

| Agent | How They Use This Model |
|-------|------------------------|
| **PM Agent** | Creates constitution PRD for orchestration, domain PRDs for sub-categories |
| **Architect Agent** | Ensures ICs are technically sound, validates PR feasibility |
| **Dev Agent** | Reads PRs and ICs as constraints, implements FRs |
| **SM Agent** | Tracks stories against FRs, manages traceability |

---

## Part 6: Migration Path

### 6.1 For Existing Projects (Like Xentri)

1. **Identify constitution document**
   - Current: `docs/platform/orchestration/prd.md`

2. **Extract PRs from existing content**
   - Security mandates → PR-001 through PR-00x
   - Multi-tenancy rules → PR-010 through PR-01x
   - etc.

3. **Extract ICs from existing content**
   - Event schema → IC-001
   - Module registration → IC-010
   - Brief access API → IC-020
   - etc.

4. **Create domain PRDs for each sub-category**
   - Extract domain-specific requirements
   - Reference constitution
   - Assign FR-{SCOPE}-xxx identifiers

5. **Update epics with traceability**
   - Add traceability matrix
   - Add "Implements" to each story

### 6.2 For New Projects

1. Start with constitution PRD using new template
2. Define PRs and ICs before any domain work
3. Create domain PRDs as sub-categories are identified
4. Epics automatically include traceability

---

## Part 7: Example Application (Xentri)

### 7.1 Constitution (Orchestration PRD)

**Platform Requirements (extracted from current PRD):**

| ID | Requirement | Source Lines |
|----|-------------|--------------|
| PR-001 | All database tables MUST include `org_id` column with RLS policy | 1104-1109 |
| PR-002 | All mutations MUST emit events to Event Spine with standard envelope | 943-950 |
| PR-003 | All API endpoints MUST require authentication except health checks | 1113-1118 |
| PR-004 | All modules MUST read Brief through standard API, never write directly | 1043-1059 |
| PR-005 | All user actions MUST respect permission primitives (view/edit/approve/configure) | 943-948 |
| PR-006 | All automated actions MUST be logged with human-readable explanation | 41, 705 |
| PR-007 | All modules MUST fail gracefully; never crash the shell | 948 |
| PR-008 | All copilots MUST adapt vocabulary to Brief-indicated business type | 984-989 |

**Integration Contracts (extracted from current PRD):**

| ID | Contract | Source Lines |
|----|----------|--------------|
| IC-001 | Event Envelope Schema (SystemEvent interface) | 995-1029 |
| IC-002 | Event Naming Convention (`xentri.{category}.{entity}.{action}.{version}`) | 1032-1039 |
| IC-003 | Module Registration Manifest Format | 900-922 |
| IC-004 | Brief Access API (`GET /api/v1/brief/{section}`) | 1043-1050 |
| IC-005 | Recommendation Submission Protocol | 1052-1059 |
| IC-006 | Notification Delivery Contract | 954-959 |
| IC-007 | Permission Check Protocol | 943-948 |

### 7.2 Domain PRD Example (Infrastructure)

```markdown
# Infrastructure - Product Requirements Document

## Overview
- **Parent Constitution:** `docs/platform/orchestration/prd.md`
- **Scope:** Event Spine, Brief System, Auth, Billing
- **Package:** `services/core-api` (partial), future dedicated services

## Platform Compliance

### Inherited Platform Requirements
| PR | Compliance Approach |
|----|---------------------|
| PR-001 | All tables created with org_id; RLS policies in migrations |
| PR-002 | Event emission helper function; schema validation on write |
| PR-003 | Middleware enforces auth on all routes except `/health` |
| PR-004 | Brief service is the ONLY write path; read API exposed |
| ... | ... |

### Implemented Integration Contracts
| IC | Implementation |
|----|----------------|
| IC-001 | Defines and validates SystemEvent schema |
| IC-004 | Exposes `/api/v1/brief` endpoints |
| IC-005 | Provides recommendation submission endpoint |

## Functional Requirements

### Brief System
- FR-INFRA-001: Brief MUST be stored per organization
- FR-INFRA-002: Brief MUST support AI-updateable and human-sovereign sections
- FR-INFRA-003: Brief MUST be versioned with diff capability between any two versions
- FR-INFRA-004: Brief updates MUST emit `xentri.brief.updated` event

### Event Spine
- FR-INFRA-010: Event Spine MUST accept events matching IC-001 envelope
- FR-INFRA-011: Events MUST be immutable (append-only, no updates/deletes)
- FR-INFRA-012: Events MUST be queryable by org_id, type, and time range
- FR-INFRA-013: Events MUST support priority and attention flags

### Operational Pulse
- FR-INFRA-020: Pulse MUST aggregate events per user-defined schedule
- FR-INFRA-021: Pulse MUST filter events through hierarchical importance logic
- FR-INFRA-022: Pulse MUST deliver via three modes: Critical/Digest/Dashboard

...
```

### 7.3 Traceability Matrix Example

```markdown
## Traceability Matrix

| Requirement | Epic | Stories | Status |
|-------------|------|---------|--------|
| FR-INFRA-001 | 2 | 2.1 | Planned |
| FR-INFRA-002 | 2 | 2.2, 2.3 | Planned |
| FR-INFRA-003 | 2 | 2.4 | Planned |
| FR-INFRA-010 | 1 | 1.2 | Complete |
| FR-INFRA-011 | 1 | 1.2 | Complete |
| PR-001 | 1 | 1.2 | Complete |
| PR-002 | 1 | 1.2, 1.6 | Complete |
| IC-001 | 1 | 1.2 | Complete |
```

---

## Part 8: Open Questions for BMad Builder

1. **Checklist file organization:**
   - Single file with sections, or separate files per document type?
   - Recommendation: Separate files for clarity

2. **Workflow routing:**
   - Auto-detect document type, or ask user?
   - Recommendation: Auto-detect with override option

3. **Cross-sub-category dependencies:**
   - How should BMAD handle FR references across sub-categories?
   - Recommendation: Explicit "Blocked By" field with external FR reference

4. **Constitution updates:**
   - What governance workflow when PRs or ICs change?
   - Recommendation: Special workflow requiring explicit approval

5. **Validation timing:**
   - Validate constitution before allowing domain PRDs?
   - Recommendation: Yes, constitution must pass before domain PRDs can reference it

6. **Backward compatibility:**
   - How to handle projects that don't use this model?
   - Recommendation: Detect based on document structure; fall back to current checklist

---

## Summary

This federated model enables:

- **Independent teams** with domain autonomy (own FRs)
- **Centralized governance** through platform requirements (shared PRs)
- **Clean integration** through explicit contracts (ICs)
- **Full traceability** from constitution → domain PRD → epics → stories
- **Appropriate validation** via document-type-specific checklists

The BMad Builder should review this proposal and determine:
1. Which elements to adopt
2. How to implement in BMAD workflows
3. Whether to make this optional or default for multi-team projects

---

*This proposal was generated during a PRD validation session where the current monolithic checklist failed to account for Xentri's federated architecture. The model is designed to work with BMAD's existing patterns while extending them for enterprise-scale projects.*
