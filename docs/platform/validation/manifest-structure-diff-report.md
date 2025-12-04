# Manifest vs Actual Structure Diff Report

> **Phase 3.04 Deliverable** — Generated 2025-12-04
>
> **Analyst:** Mary (Business Analyst)
> **Status:** Complete

---

## Executive Summary

This report compares the declared structure in `docs/manifest.yaml` against the actual file system structure. The analysis reveals:

| Category                                   | Count | Severity       |
| ------------------------------------------ | ----- | -------------- |
| Orphaned Files (not in manifest)           | 17    | Medium         |
| Missing Directories (planned, not created) | 4     | Low (expected) |
| Duplicate/Recovered Files                  | 10    | Medium         |
| Extra Platform Directories                 | 6     | Low            |
| Navigation Policy Compliant                | ✅    | N/A            |

---

## 1. Constitution Documents

### Manifest Declaration

| Document        | Declared Path                   | Required |
| --------------- | ------------------------------- | -------- |
| prd.md          | `docs/platform/prd.md`          | Yes      |
| architecture.md | `docs/platform/architecture.md` | Yes      |
| ux-design.md    | `docs/platform/ux-design.md`    | Yes      |
| epics.md        | `docs/platform/epics.md`        | Yes      |
| product-soul.md | `docs/product-soul.md`          | Yes      |

### Actual State

| Document                        | Exists | Status |
| ------------------------------- | ------ | ------ |
| `docs/platform/prd.md`          | ✅     | OK     |
| `docs/platform/architecture.md` | ✅     | OK     |
| `docs/platform/ux-design.md`    | ✅     | OK     |
| `docs/platform/epics.md`        | ✅     | OK     |
| `docs/product-soul.md`          | ✅     | OK     |

**Result: COMPLIANT** — All Constitution documents exist.

---

## 2. Infrastructure Modules

### Active Modules (Declared status: active)

| Module    | Declared Path              | Actual State |
| --------- | -------------------------- | ------------ |
| shell     | `docs/platform/shell/`     | ✅ Exists    |
| ui        | `docs/platform/ui/`        | ✅ Exists    |
| core-api  | `docs/platform/core-api/`  | ✅ Exists    |
| ts-schema | `docs/platform/ts-schema/` | ✅ Exists    |

**Result: COMPLIANT** — All active infrastructure modules exist.

### Planned Modules (Declared status: planned)

| Module  | Declared Path            | Actual State                 |
| ------- | ------------------------ | ---------------------------- |
| events  | `docs/platform/events/`  | ⏳ Does not exist (expected) |
| auth    | `docs/platform/auth/`    | ⏳ Does not exist (expected) |
| billing | `docs/platform/billing/` | ⏳ Does not exist (expected) |
| brief   | `docs/platform/brief/`   | ⏳ Does not exist (expected) |

**Result: COMPLIANT** — Planned modules don't exist yet (expected behavior).

---

## 3. Strategic Containers

### Declared Categories

| Category   | Codename | Declared Path      | Actual State |
| ---------- | -------- | ------------------ | ------------ |
| strategy   | Bridge   | `docs/strategy/`   | ✅ Exists    |
| marketing  | Stage    | `docs/marketing/`  | ✅ Exists    |
| sales      | Exchange | `docs/sales/`      | ✅ Exists    |
| finance    | Vault    | `docs/finance/`    | ✅ Exists    |
| operations | Engine   | `docs/operations/` | ✅ Exists    |
| team       | Guild    | `docs/team/`       | ✅ Exists    |
| legal      | Shield   | `docs/legal/`      | ✅ Exists    |

**Result: COMPLIANT** — All 7 strategic containers exist.

### Subcategories (Coordination Units)

#### Strategy (5 subcategories)

| Subcategory  | Declared Path                 | Actual State      |
| ------------ | ----------------------------- | ----------------- |
| soul         | `docs/strategy/soul/`         | ✅ Exists (empty) |
| pulse        | `docs/strategy/pulse/`        | ✅ Exists (empty) |
| horizon      | `docs/strategy/horizon/`      | ✅ Exists (empty) |
| map          | `docs/strategy/map/`          | ✅ Exists (empty) |
| constitution | `docs/strategy/constitution/` | ✅ Exists (empty) |

#### Marketing (5 subcategories)

| Subcategory | Declared Path               | Actual State      |
| ----------- | --------------------------- | ----------------- |
| marquee     | `docs/marketing/marquee/`   | ✅ Exists (empty) |
| studio      | `docs/marketing/studio/`    | ✅ Exists (empty) |
| broadcast   | `docs/marketing/broadcast/` | ✅ Exists (empty) |
| applause    | `docs/marketing/applause/`  | ✅ Exists (empty) |
| tribe       | `docs/marketing/tribe/`     | ✅ Exists (empty) |

#### Sales (5 subcategories)

| Subcategory | Declared Path           | Actual State      |
| ----------- | ----------------------- | ----------------- |
| magnet      | `docs/sales/magnet/`    | ✅ Exists (empty) |
| hunt        | `docs/sales/hunt/`      | ✅ Exists (empty) |
| flow        | `docs/sales/flow/`      | ✅ Exists (empty) |
| handshake   | `docs/sales/handshake/` | ✅ Exists (empty) |
| register    | `docs/sales/register/`  | ✅ Exists (empty) |

#### Finance (5 subcategories)

| Subcategory | Declared Path            | Actual State      |
| ----------- | ------------------------ | ----------------- |
| inflow      | `docs/finance/inflow/`   | ✅ Exists (empty) |
| outflow     | `docs/finance/outflow/`  | ✅ Exists (empty) |
| treasury    | `docs/finance/treasury/` | ✅ Exists (empty) |
| ledger      | `docs/finance/ledger/`   | ✅ Exists (empty) |
| forecast    | `docs/finance/forecast/` | ✅ Exists (empty) |

#### Operations (5 subcategories)

| Subcategory | Declared Path                | Actual State      |
| ----------- | ---------------------------- | ----------------- |
| workshop    | `docs/operations/workshop/`  | ✅ Exists (empty) |
| supply      | `docs/operations/supply/`    | ✅ Exists (empty) |
| habitat     | `docs/operations/habitat/`   | ✅ Exists (empty) |
| concierge   | `docs/operations/concierge/` | ✅ Exists (empty) |
| grid        | `docs/operations/grid/`      | ✅ Exists (empty) |

#### Team (5 subcategories)

| Subcategory | Declared Path        | Actual State      |
| ----------- | -------------------- | ----------------- |
| draft       | `docs/team/draft/`   | ✅ Exists (empty) |
| welcome     | `docs/team/welcome/` | ✅ Exists (empty) |
| admin       | `docs/team/admin/`   | ✅ Exists (empty) |
| growth      | `docs/team/growth/`  | ✅ Exists (empty) |
| spirit      | `docs/team/spirit/`  | ✅ Exists (empty) |

#### Legal (5 subcategories)

| Subcategory | Declared Path        | Actual State      |
| ----------- | -------------------- | ----------------- |
| entity      | `docs/legal/entity/` | ✅ Exists (empty) |
| pacts       | `docs/legal/pacts/`  | ✅ Exists (empty) |
| moat        | `docs/legal/moat/`   | ✅ Exists (empty) |
| code        | `docs/legal/code/`   | ✅ Exists (empty) |
| guard       | `docs/legal/guard/`  | ✅ Exists (empty) |

**Result: COMPLIANT** — All 35 subcategories exist (all empty as expected for planned status).

---

## 4. Orphaned Files (Exist but NOT in Manifest)

### Platform-Level Orphans

| File/Directory           | Path                                    | Recommendation                                      |
| ------------------------ | --------------------------------------- | --------------------------------------------------- |
| document-contracts.yaml  | `docs/platform/document-contracts.yaml` | **KEEP** — Referenced in audit plan                 |
| pulse/                   | `docs/platform/pulse/`                  | **REVIEW** — Contains `pulse.md`, purpose unclear   |
| research/                | `docs/platform/research/`               | **KEEP** — Contains research templates              |
| architecture/            | `docs/platform/architecture/`           | **REVIEW** — Contains ADR-020, should be subfolder? |
| examples/                | `docs/platform/examples/`               | **REVIEW** — Contains example YAML files            |
| ux/                      | `docs/platform/ux/`                     | **KEEP** — Contains UX HTML mockups                 |
| validation/              | `docs/platform/validation/`             | **KEEP** — Contains validation reports              |
| validation-reports/      | `docs/platform/validation-reports/`     | **KEEP** — Historical validation reports            |
| sprint-artifacts/        | `docs/platform/sprint-artifacts/`       | **KEEP** — Constitution-level sprint tracking       |
| bmm-workflow-status.yaml | `docs/bmm-workflow-status.yaml`         | **KEEP** — BMM workflow tracking                    |

### Files Inside Infrastructure Modules (Not Declared)

| File             | Location                   | Recommendation                 |
| ---------------- | -------------------------- | ------------------------------ |
| islands.md       | `docs/platform/shell/`     | **REVIEW** — Supplementary doc |
| routing.md       | `docs/platform/shell/`     | **REVIEW** — Supplementary doc |
| components.md    | `docs/platform/ui/`        | **REVIEW** — Supplementary doc |
| theming.md       | `docs/platform/ui/`        | **REVIEW** — Supplementary doc |
| contracts.md     | `docs/platform/ts-schema/` | **REVIEW** — Supplementary doc |
| api-reference.md | `docs/platform/core-api/`  | **KEEP** — API documentation   |
| events.md        | `docs/platform/core-api/`  | **KEEP** — Event documentation |

---

## 5. Duplicate/Recovered Files (Cleanup Required)

| File                   | Path                       | Recommendation         |
| ---------------------- | -------------------------- | ---------------------- |
| epics_recovered.md     | `docs/platform/shell/`     | **DELETE** — Duplicate |
| prd_recovered.md       | `docs/platform/shell/`     | **DELETE** — Duplicate |
| ux-design_recovered.md | `docs/platform/shell/`     | **DELETE** — Duplicate |
| epics_recovered.md     | `docs/platform/ui/`        | **DELETE** — Duplicate |
| prd_recovered.md       | `docs/platform/ui/`        | **DELETE** — Duplicate |
| ux-design_recovered.md | `docs/platform/ui/`        | **DELETE** — Duplicate |
| epics_recovered.md     | `docs/platform/core-api/`  | **DELETE** — Duplicate |
| prd_recovered.md       | `docs/platform/core-api/`  | **DELETE** — Duplicate |
| epics_recovered.md     | `docs/platform/ts-schema/` | **DELETE** — Duplicate |
| prd_recovered.md       | `docs/platform/ts-schema/` | **DELETE** — Duplicate |

**Total: 10 files to delete**

---

## 6. Navigation Policy Compliance

| Check                       | Status       |
| --------------------------- | ------------ |
| No README.md files in docs/ | ✅ COMPLIANT |
| Only docs/index.md exists   | ✅ COMPLIANT |
| No other index.md files     | ✅ COMPLIANT |

**Result: FULLY COMPLIANT**

---

## 7. Atoms Directory

| Check                 | Status                                         |
| --------------------- | ---------------------------------------------- |
| `docs/_atoms/` exists | ✅                                             |
| `_index.md` exists    | ✅                                             |
| `_schema.yaml` exists | ✅                                             |
| `_template.md` exists | ✅                                             |
| Total atoms           | 36 (SYS.001 through SYS.034 + SYS.001-SHL.001) |

**Result: COMPLIANT** — Atom system properly set up.

---

## 8. Summary of Findings

### Critical Issues (Block)

None.

### Medium Issues (Action Required)

1. **10 `*_recovered.md` files** need deletion (Phase 3.12/3.18 related)
2. **`docs/platform/pulse/`** — Contains `pulse.md` but not declared in manifest
3. **`docs/platform/architecture/`** — Contains ADR-020, structure unclear

### Low Issues (For Review)

1. Supplementary module docs (islands.md, routing.md, etc.) not in manifest
2. Platform extras (research/, examples/) not formally declared

### Compliant Areas

- All Constitution documents present
- All 4 active infrastructure modules present
- All 7 strategic containers present
- All 35 coordination units present
- Navigation policy fully compliant
- Atom system fully operational

---

## 9. Recommended Actions

### Immediate (Phase 3 Tasks)

1. **3.05** — Flag the 10 `*_recovered.md` files as orphaned
2. **3.06** — No missing files detected (planned modules correctly absent)
3. **3.12/3.18** — Delete `*_recovered.md` files (PM/UX tasks)

### Deferred (Tech Debt)

1. Update manifest to formally declare:
   - `docs/platform/ux/` — UX mockups directory
   - `docs/platform/validation/` — Validation reports
   - `docs/platform/research/` — Research templates
   - `docs/platform/architecture/` — ADR subdirectory
2. Review `docs/platform/pulse/` — determine if this should exist or be removed
3. Consider adding supplementary docs to module declarations

---

## Appendix: File Tree Comparison

### Manifest Structure (Expected)

```
docs/
├── index.md                     ✅
├── manifest.yaml                ✅
├── product-soul.md              ✅
├── platform/
│   ├── prd.md                   ✅
│   ├── architecture.md          ✅
│   ├── ux-design.md             ✅
│   ├── epics.md                 ✅
│   ├── shell/                   ✅
│   ├── ui/                      ✅
│   ├── core-api/                ✅
│   ├── ts-schema/               ✅
│   ├── events/                  ⏳ (planned)
│   ├── auth/                    ⏳ (planned)
│   ├── billing/                 ⏳ (planned)
│   └── brief/                   ⏳ (planned)
├── strategy/                    ✅
│   ├── soul/                    ✅
│   ├── pulse/                   ✅
│   ├── horizon/                 ✅
│   ├── map/                     ✅
│   └── constitution/            ✅
├── marketing/                   ✅
├── sales/                       ✅
├── finance/                     ✅
├── operations/                  ✅
├── team/                        ✅
└── legal/                       ✅
```

### Actual Structure (Additional Items)

```
docs/
├── _atoms/                      ➕ Not in manifest (OK - system dir)
├── bmm-workflow-status.yaml     ➕ Not in manifest
├── platform/
│   ├── document-contracts.yaml  ➕ Not in manifest
│   ├── pulse/                   ➕ Not in manifest (contains pulse.md)
│   ├── research/                ➕ Not in manifest
│   ├── architecture/            ➕ Not in manifest (contains ADR-020)
│   ├── examples/                ➕ Not in manifest
│   ├── ux/                      ➕ Not in manifest (HTML mockups)
│   ├── validation/              ➕ Not in manifest
│   ├── validation-reports/      ➕ Not in manifest
│   ├── sprint-artifacts/        ➕ Not in manifest
│   ├── shell/*_recovered.md     ⚠️ Delete (10 files total)
│   ├── ui/*_recovered.md        ⚠️ Delete
│   ├── core-api/*_recovered.md  ⚠️ Delete
│   └── ts-schema/*_recovered.md ⚠️ Delete
```

---

**Report Complete.** This analysis feeds into Phase 3.05 (orphaned files) and Phase 3.06 (missing files) tasks.
