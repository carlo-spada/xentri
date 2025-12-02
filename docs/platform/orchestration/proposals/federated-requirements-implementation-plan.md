# Federated Requirements Model - Implementation Plan

**Date:** 2025-12-01
**Status:** Phase 1 Complete, Pending Review
**Authors:** Carlo + BMad Builder

---

## Executive Summary

This document outlines the implementation plan for adopting a **Federated Requirements Model** across Xentri's documentation hierarchy. The model introduces a 4-level structure where system-wide rules (Platform Requirements, Integration Contracts) live at the root, and each level below can add—but never contradict—requirements from above.

**Phase 1 (Completed):** Constitutional document migration to `docs/` root
**Phase 2 (Pending):** Naming convention and checklist implementation
**Phase 3 (Future):** Full BMAD workflow integration

---

## What We've Done (Phase 1)

### 1.1 Structural Migration

| Action | Status |
|--------|--------|
| Moved `prd.md` from orchestration to `docs/` root | ✅ Complete |
| Moved `architecture.md` to `docs/` root | ✅ Complete |
| Moved `ux-design.md` to `docs/` root | ✅ Complete |
| Moved `epics.md` to `docs/` root | ✅ Complete |
| Moved `product-brief.md` to `docs/` root | ✅ Complete |
| Added frontmatter to all moved docs (level: system) | ✅ Complete |
| Updated `manifest.yaml` to v3.0 with system section | ✅ Complete |
| Updated `CLAUDE.md` with 4-level navigation | ✅ Complete |
| Updated `docs/index.md` with new structure | ✅ Complete |
| Updated orchestration `README.md` | ✅ Complete |

### 1.2 New 4-Level Hierarchy

```
Level 0 - System (Constitution): docs/
├── prd.md                 # PR-xxx, IC-xxx (system-wide rules)
├── architecture.md        # System-wide tech decisions
├── ux-design.md           # System-wide UX principles
├── epics.md               # Cross-cutting initiatives
└── product-brief.md       # Foundational vision

Level 1 - Category: docs/{category}/
├── prd.md                 # FR-{CAT}-xxx (category requirements)
├── architecture.md        # Category decisions
└── epics.md               # Category roadmap

Level 2 - Sub-category: docs/{category}/{subcategory}/
├── prd.md                 # FR-{SUB}-xxx (sub-category requirements)
├── architecture.md        # Sub-category decisions
└── epics.md               # Implementation roadmap

Level 3 - Module: docs/{category}/{subcategory}/{module}/
├── prd.md                 # FR-{MOD}-xxx (module requirements)
└── sprint-artifacts/      # Implementation tracking
```

### 1.3 Inheritance Model

Each level **inherits** all constraints from above:
- Module inherits: System PRs + Category FRs + Sub-category FRs
- Sub-category inherits: System PRs + Category FRs
- Category inherits: System PRs

**Critical rule:** Lower levels can ADD requirements but NEVER contradict higher-level rules.

---

## What Remains (Phase 2)

### 2.1 Requirement Naming Convention

**Not yet implemented.** The current system PRD contains requirements but doesn't use the PR/IC/FR naming convention.

#### Proposed Naming

| Type | Prefix | Scope | Example |
|------|--------|-------|---------|
| Platform Requirement | PR-xxx | System-wide, non-negotiable | PR-001: All tables must have org_id |
| Integration Contract | IC-xxx | How modules communicate | IC-001: Event envelope schema |
| Functional Requirement | FR-{SCOPE}-xxx | Domain-specific features | FR-SHELL-001: Sidebar must collapse |

#### Scope Identifiers

| Scope | Level | Example |
|-------|-------|---------|
| PLAT | Platform category | FR-PLAT-001 |
| ORCH | Orchestration sub-category | FR-ORCH-001 |
| INFRA | Infrastructure sub-category | FR-INFRA-001 |
| FRONT | Frontend sub-category | FR-FRONT-001 |
| BACK | Backend sub-category | FR-BACK-001 |
| SHARED | Shared sub-category | FR-SHARED-001 |
| SHELL | Shell module | FR-SHELL-001 |
| UI | UI module | FR-UI-001 |
| API | Core-API module | FR-API-001 |
| SCHEMA | ts-schema module | FR-SCHEMA-001 |

### 2.2 Retrofit System PRD with PR/IC Labels

**Action needed:** Go through `docs/prd.md` and:
1. Identify platform-wide mandates → Label as PR-xxx
2. Identify integration contracts → Label as IC-xxx
3. Keep domain-specific features → Will become FR-xxx in category PRDs

#### Candidate PRs (from current PRD)

| Proposed ID | Requirement | Current Location |
|-------------|-------------|------------------|
| PR-001 | All tables must have org_id with RLS | Lines ~1104-1109 |
| PR-002 | All mutations must emit events with standard envelope | Lines ~943-950 |
| PR-003 | All API endpoints must require auth except health | Lines ~1113-1118 |
| PR-004 | All modules must read Brief via API, never write directly | Lines ~1043-1059 |
| PR-005 | All user actions must respect permission primitives | Lines ~943-948 |
| PR-006 | All automated actions must be logged with explanation | Lines ~41, 705 |
| PR-007 | All modules must fail gracefully, never crash shell | Line ~948 |
| PR-008 | All copilots must adapt vocabulary to Brief | Lines ~984-989 |

#### Candidate ICs (from current PRD)

| Proposed ID | Contract | Current Location |
|-------------|----------|------------------|
| IC-001 | Event Envelope Schema (SystemEvent interface) | Lines ~995-1029 |
| IC-002 | Event Naming Convention | Lines ~1032-1039 |
| IC-003 | Module Registration Manifest Format | Lines ~900-922 |
| IC-004 | Brief Access API | Lines ~1043-1050 |
| IC-005 | Recommendation Submission Protocol | Lines ~1052-1059 |
| IC-006 | Notification Delivery Contract | Lines ~954-959 |
| IC-007 | Permission Check Protocol | Lines ~943-948 |

### 2.3 Traceability Matrix in Epics

**Action needed:** Add a traceability matrix to `docs/epics.md`:

```markdown
## Traceability Matrix

| Requirement | Epic | Stories | Status |
|-------------|------|---------|--------|
| PR-001 | 1 | 1.2 | Complete |
| PR-002 | 1 | 1.2, 1.6 | Complete |
| IC-001 | 1 | 1.2 | Complete |
```

### 2.4 Constitution Checklist

**Action needed:** Create `.bmad/bmm/workflows/2-plan-workflows/prd/constitution-checklist.md`:

```markdown
# Constitution PRD Validation Checklist

## 1. Platform Requirements Completeness
- [ ] Security requirements defined (PR-0xx)
- [ ] Multi-tenancy requirements defined (PR-0xx)
- [ ] Data governance requirements defined
- [ ] UX consistency requirements defined
- [ ] Observability requirements defined
- [ ] Each PR is testable and enforceable

## 2. Integration Contracts Completeness
- [ ] Event system contracts defined (IC-0xx)
- [ ] API contracts defined
- [ ] Each IC has schema/format specification
- [ ] Each IC has versioning strategy

## 3. Scope
- [ ] No domain-specific FRs (those belong in category PRDs)
- [ ] Language is directive, not suggestive
```

### 2.5 Document Type Detection

**Action needed:** Update BMAD workflow routing to use frontmatter:

```yaml
# In workflow.yaml
validation_routing:
  detect_document_type:
    - check: frontmatter.level == "system"
      then: use constitution_checklist
    - check: frontmatter.level in ["category", "subcategory", "module"]
      then: use domain_prd_checklist
    - fallback: use legacy_prd_checklist
```

---

## Open Questions for Review

### Question 1: Granularity of Naming

Should every requirement at every level have a formal ID?

| Option | Pros | Cons |
|--------|------|------|
| **A: Full formal IDs everywhere** | Complete traceability | Bureaucratic overhead |
| **B: Formal IDs for System + Sub-category only** | Balanced | Modules may have orphaned requirements |
| **C: Formal IDs for System only** | Minimal overhead | Lose traceability at lower levels |

**Current recommendation:** Option B - Formal IDs at System (PR/IC) and Sub-category (FR-{SUB}). Modules can use informal requirements.

### Question 2: Migration Path for Existing Epics

Epic 1 is complete. How do we handle retroactive traceability?

| Option | Approach |
|--------|----------|
| **A: Full retrofit** | Go back and add traceability to completed stories |
| **B: Forward-only** | Only new epics use traceability |
| **C: Incremental** | Add traceability as we touch stories |

**Current recommendation:** Option C - Add traceability incrementally.

### Question 3: Category PRDs

When a new category starts (e.g., Strategy), should we require a full Category PRD before sub-category work?

| Option | Approach |
|--------|----------|
| **A: Mandatory Category PRD** | Category PRD required before any sub-category |
| **B: Optional Category PRD** | Sub-categories can start with just system inheritance |
| **C: Lightweight Category Brief** | Simple category brief, not full PRD |

**Current recommendation:** Option C - Categories start with a brief, full PRD comes later if needed.

### Question 4: Validation Workflow Changes

Should we modify existing BMAD workflows or create new ones?

| Option | Approach |
|--------|----------|
| **A: Modify existing** | Update prd/workflow.yaml with routing |
| **B: Create new workflows** | New validate-constitution, validate-domain-prd |
| **C: Add new checklist only** | Keep workflow, add constitution-checklist.md |

**Current recommendation:** Option C first, then B if needed.

### Question 5: Integration Contracts and Code

ICs define contracts (event schemas, API formats). Should IC definitions:

| Option | Approach |
|--------|----------|
| **A: Live only in PRD** | ICs are documentation only |
| **B: Reference code** | ICs point to canonical code (e.g., `packages/ts-schema`) |
| **C: Be machine-readable** | ICs defined in YAML/JSON, code generates from them |

**Current recommendation:** Option B - ICs reference canonical code definitions.

---

## Risks and Mitigations

### Risk 1: Over-Engineering

**Risk:** The federated model adds complexity without proportional value.

**Mitigation:**
- Start with naming convention only (Phase 2)
- Measure: Does traceability catch gaps? Does it slow us down?
- Only add more if value proven

### Risk 2: Inconsistent Adoption

**Risk:** Some modules use the model, others don't.

**Mitigation:**
- Make it opt-in initially
- Add validation to CI only after model is proven
- Document clear examples

### Risk 3: Breaking Existing References

**Risk:** External tools or links reference old paths.

**Mitigation:**
- Constitutional docs moved via git mv (history preserved)
- Old paths now 404 (no silent failures)
- Update all known references

### Risk 4: Agent Confusion

**Risk:** AI dev agents don't understand the new hierarchy.

**Mitigation:**
- `manifest.yaml` is the source of truth
- `CLAUDE.md` updated with clear hierarchy
- Frontmatter on every doc declares its level

---

## Proposed Phase 2 Implementation Steps

### Step 1: Retrofit System PRD (Low Effort)
- [ ] Add PR-xxx labels to existing platform mandates
- [ ] Add IC-xxx labels to existing integration contracts
- [ ] Add "Platform Requirements" section to PRD
- [ ] Add "Integration Contracts" section to PRD

### Step 2: Add Traceability Matrix (Low Effort)
- [ ] Add matrix to `docs/epics.md`
- [ ] Map completed stories to PRs and ICs
- [ ] Verify no orphaned requirements

### Step 3: Create Constitution Checklist (Medium Effort)
- [ ] Write `constitution-checklist.md`
- [ ] Test against current system PRD
- [ ] Document gaps found

### Step 4: Update Proposal Document (Low Effort)
- [ ] Reflect 4-level model in federated-requirements-model.md
- [ ] Archive or supersede original proposal
- [ ] Document decisions made

### Step 5: Pilot on New Sub-category (Medium Effort)
- [ ] When infrastructure/events starts, use full federated model
- [ ] Create infrastructure PRD with FR-INFRA-xxx
- [ ] Create epics with traceability matrix
- [ ] Retrospective: Was this valuable?

---

## Success Criteria

| Criterion | Measurement |
|-----------|-------------|
| **Clarity** | Any dev agent can determine which rules apply to their module by reading manifest + frontmatter |
| **Traceability** | Every FR can be traced to a story, every story to an FR |
| **Inheritance** | Lower-level docs explicitly reference inherited PRs |
| **Validation** | Constitution checklist catches missing PRs/ICs |
| **Velocity** | Model doesn't slow down development (measure sprint completion rate) |

---

## Next Actions

1. **Review this document** with Carlo
2. **Decide on open questions** (1-5 above)
3. **Execute Phase 2** starting with Step 1 (retrofit naming)
4. **Commit and push** Phase 1 changes

---

*This document was generated during a BMad Builder consultation session on 2025-12-01.*
