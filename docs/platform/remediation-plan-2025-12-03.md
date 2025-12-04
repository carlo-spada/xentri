# Platform Documentation Remediation Plan

**Generated:** 2025-12-03
**Updated:** 2025-12-03
**Scope:** All Constitution documents in `docs/platform/`
**Status:** Priority 1 Complete, Priority 2 Mostly Complete, Priority 3 Documented

---

## Decision Made: Soul Terminology Adopted

**Decision:** Adopt "Soul" as the canonical term for the living understanding of the business.

**Rationale:** The evolution from "Brief" to "Soul" reflects a deeper understanding of the concept — it's not just a document users create once, but a living relationship that grows with every interaction.

**Changes Made:**

- ✅ `product-brief.md` → `product-soul.md`
- ✅ IC-004: `GET /api/v1/soul/{section}`
- ✅ All Constitution docs now use "Soul" consistently
- ✅ manifest.yaml updated
- ✅ All cross-references updated

---

## Priority 1: Must Fix Now — ✅ COMPLETE

### 1.1 Adopt Soul Terminology ✅

**Changes:**

- Renamed `product-brief.md` → `product-soul.md`
- Updated all API references to use `/api/v1/soul/{section}`
- Updated all "Brief-Aware" → "Soul-Aware" in ux-design.md
- Updated all "Universal Brief" → "Universal Soul"
- Updated manifest.yaml, index.md, PRD, UX Design, Architecture

### 1.2 Fix product-soul.md Frontmatter ✅

**New frontmatter:**

```yaml
entity_type: constitution
document_type: product_soul
title: 'Xentri Product Soul'
description: 'The foundational vision document for Xentri.'
version: '1.0.0'
status: draft
created: '2025-11-28'
updated: '2025-12-03'
```

### 1.3 Sync PRD Version Numbers ✅

**Result:** Version aligned at "2.2" in both frontmatter and body.

### 1.4 Update pulse.md ✅

**Changes:**

- "brand"/"Brand" → "Marketing" throughout
- "Last Updated" → 2025-12-03
- "Universal Brief" → "Universal Soul"
- Placeholder GitHub links → generic references

### 1.5 Demote All Constitution Docs to Draft ✅

**Decision:** Both PRD and Architecture demoted to `status: draft` until validation reports are generated.

**Changes:**

- `prd.md`: status → draft
- `architecture.md`: status → draft (was already)
- `ux-design.md`: status → draft

---

## Priority 2: Should Plan — MOSTLY COMPLETE

### 2.1 Consolidate PR/IC Definitions ✅

**Changes:**

- `epics.md` now references PRD for definitions
- Only tracks coverage and status, not duplicate definitions
- Added "Single Source of Truth" note with link to PRD

### 2.2 Create Validation Reports Directory ✅

**Created:**

```
docs/platform/validation/
├── README.md                           # Explains validation process
├── prd-validation-report.md            # Status: Pending
├── architecture-validation-report.md   # Status: Pending
└── ux-validation-report.md             # Status: Pending
```

### 2.3 Create Research Directory ✅

**Created:**

```
docs/platform/research/
├── README.md                    # Research index
├── market-research.md           # Status: Pending
├── competitive-analysis.md      # Status: Pending
└── user-research.md             # Status: Pending
```

### 2.4 Regenerate Module Sprint Status Files ⏳

**Status:** Deferred

**Recommendation:** Run `/bmad:bmm:workflows:sprint-planning` for each module when starting active development on that module. Current staleness is acceptable since modules are not in active sprint.

---

## Priority 3: Deferred Improvements — DOCUMENTED

These require tooling investment and should be tracked as tech debt:

| Improvement                    | Effort | Benefit                                       | Tracking            |
| ------------------------------ | ------ | --------------------------------------------- | ------------------- |
| **YAML schema validation**     | Medium | Automated frontmatter compliance              | Create GitHub issue |
| **Pre-commit hooks**           | Medium | Catch inconsistencies before commit           | Create GitHub issue |
| **Link validation in CI**      | Medium | Detect broken cross-references                | Create GitHub issue |
| **Module doc scaffolds**       | High   | Fill TODO items in core-api, shell, etc.      | Epic 2+ backlog     |
| **Single-source event schema** | Medium | Define SystemEvent once, reference everywhere | Architecture ADR    |

---

## Summary of Changes

### Files Modified

- `docs/platform/prd.md` — Soul terminology, status → draft
- `docs/platform/architecture.md` — Soul terminology
- `docs/platform/ux-design.md` — Soul terminology, status → draft
- `docs/platform/epics.md` — Consolidated PR/IC references
- `docs/platform/pulse.md` — Marketing category, date, Soul terminology
- `docs/manifest.yaml` — product-soul.md, document_type
- `docs/index.md` — Product Soul link
- `docs/bmm-workflow-status.yaml` — product-soul references

### Files Created

- `docs/platform/product-soul.md` — New file (renamed from product-brief.md)
- `docs/platform/validation/README.md`
- `docs/platform/validation/prd-validation-report.md`
- `docs/platform/validation/architecture-validation-report.md`
- `docs/platform/validation/ux-validation-report.md`
- `docs/platform/research/README.md`
- `docs/platform/research/market-research.md`
- `docs/platform/research/competitive-analysis.md`
- `docs/platform/research/user-research.md`

### Files Deleted

- `docs/platform/product-brief.md` — Replaced by product-soul.md

---

## Success Criteria — Priority 1-2 ACHIEVED

| Criterion                       | Status                                    |
| ------------------------------- | ----------------------------------------- |
| ✅ Zero terminology conflicts   | "Soul" used consistently                  |
| ✅ Consistent frontmatter       | All Constitution docs follow same pattern |
| ✅ Single source of truth       | PR/IC defined once in PRD                 |
| ✅ No broken references         | All internal links resolve                |
| ✅ No stale dates               | All "Last Updated" fields accurate        |
| ✅ Complete directory structure | validation/, research/ exist              |

---

## Priority 4: SSOT Architecture — NEW (2025-12-03)

### Root Cause Analysis

The terminology and consistency fixes above addressed **symptoms**. The root cause remains:

**Documents were designed as standalone narratives**, each trying to be complete and self-contained. This leads to copy-paste of key concepts (TypeScript interfaces, requirement definitions, architectural patterns) across multiple files.

### Duplication Audit

| Content                      | prd.md          | architecture.md | epics.md    | Severity             |
| ---------------------------- | --------------- | --------------- | ----------- | -------------------- |
| `SystemEvent` interface      | Lines 1043-1077 | Lines 137-161   | -           | **HIGH**             |
| Tri-State Memory explanation | Lines 872-901   | Lines 206-234   | Lines 47-53 | **HIGH**             |
| Pulse filtering logic        | Lines 222-269   | Lines 339-403   | -           | **LOW** (legitimate) |

### Solution: Document Ownership Contracts

Created `docs/platform/document-contracts.yaml` — defines what each document OWNS exclusively:

| Document            | Owns Exclusively                                   | References From                |
| ------------------- | -------------------------------------------------- | ------------------------------ |
| **prd.md**          | PR-xxx, IC-xxx definitions, business rationale     | architecture, ux-design, epics |
| **architecture.md** | ADR-xxx, TypeScript interfaces, technical patterns | prd, epics                     |
| **ux-design.md**    | Colors, typography, components, accessibility      | prd, architecture              |
| **epics.md**        | Story breakdown, traceability matrix, sequencing   | prd, architecture              |

### Implementation Phases

#### Phase 4.1: Reference Blocks (Immediate)

Add authoritative source pointers to existing duplications:

**epics.md** (line ~71):

```markdown
> **Authoritative Source:** [PRD §Platform Requirements Index](./prd.md#platform-requirements-index)
> Requirement DEFINITIONS live exclusively in prd.md. Stories trace by ID only.
```

**prd.md** (before SystemEvent interface):

```markdown
> **Implementation Note:** The authoritative TypeScript specification lives in
> [ADR-002](./architecture.md#adr-002-event-envelope--schema). This is for reader convenience.
```

#### Phase 4.2: Atomic Extraction (Week 2-3)

Extract content that should never be duplicated:

```
docs/platform/
├── _atoms/
│   ├── requirements/
│   │   ├── PR-001.md    # One file per requirement
│   │   └── ...
│   ├── contracts/
│   │   ├── IC-001.md    # SystemEvent interface
│   │   └── ...
│   └── decisions/
│       ├── ADR-001.md
│       └── ...
```

Each atom has frontmatter with `traced_by` links for bidirectional traceability.

#### Phase 4.3: Validation Enforcement (Week 4)

Create `scripts/validation/check-doc-duplication.ts`:

```typescript
const RULES = [
  {
    pattern: /interface\s+\w+\s*\{/g,
    forbiddenIn: ['prd.md'],
    message: 'TS interfaces → architecture.md',
  },
  { pattern: /^###\s+(PR|IC)-\d{3}/gm, forbiddenIn: ['epics.md'], message: 'Definitions → prd.md' },
  {
    pattern: /#[0-9a-fA-F]{6}/g,
    forbiddenIn: ['prd.md', 'architecture.md'],
    message: 'Colors → ux-design.md',
  },
]
```

Add CI workflow and pre-commit hook.

### Success Criteria — Phase 4

| Metric                              | Current   | Target  |
| ----------------------------------- | --------- | ------- |
| Duplicate TypeScript interfaces     | 2+        | 0       |
| Requirement definitions in epics.md | Full text | ID only |
| Documents with reference blocks     | 0         | 4/4     |
| CI validation coverage              | 0%        | 100%    |
| Time to update shared concept       | 2-4 files | 1 file  |

### Created Artifacts

- ✅ `docs/platform/document-contracts.yaml` — Ownership rules
- ⏳ `scripts/validation/check-doc-duplication.ts` — Pending
- ⏳ `.github/workflows/docs-validation.yml` — Pending

---

## Next Actions

1. **Immediate:** Add reference blocks to prd.md and epics.md (Phase 4.1)
2. **This Week:** Create validation script (Phase 4.3)
3. **Next Sprint:** Atomic extraction for IC-001 and ADR-006 (Phase 4.2)
