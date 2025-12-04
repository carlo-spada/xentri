# Atom Model v2 — Hierarchical Commission Pattern

> **Status:** APPROVED BY PARTY MODE DISCUSSION (2025-12-04)
> **Context:** 7% context remaining when captured. PRESERVE THIS.

---

## Core Principle

**Each layer contains ONLY:**

1. **Commissions** — Creating entities in the layer below
2. **Essential Requirements** — Minimum rules those entities MUST follow

**Nothing more, nothing less.**

---

## The Recursive Rule

> **Parent's ESSENTIAL REQUIREMENT becomes Child's COMMISSION**

```
Constitution (SYS.001)
├── Commission: Strategy Category
└── Essential: MUST manage the Soul
                    │
                    ▼
        Strategy (SYS.001-STR.001)
        ├── Commission: Soul Module  ← Parent's essential became this
        └── Essential: MUST provide read API, MUST accept recommendations
                            │
                            ▼
                Soul Module (SYS.001-STR.001-SOL.001)
                ├── Commission: Soul API
                └── Essential: MUST return JSON, MUST respect org_id
                                    │
                                    ▼
                            Implementation (actual code)
                            └── Acceptance criteria from parent's essentials
```

This is **fractal** — same pattern at every level until you hit code.

---

## Constitution Structure (~11 atoms)

### 7 Category Commissions

| Atom    | Commission | Key Essentials                          |
| ------- | ---------- | --------------------------------------- |
| SYS.001 | Strategy   | Soul management, Pulse, recommendations |
| SYS.002 | Marketing  | Brand, content, campaigns               |
| SYS.003 | Finance    | Invoicing, payments, reporting          |
| SYS.004 | Sales      | Pipeline, deals, forecasting            |
| SYS.005 | Operations | Workflows, automation                   |
| SYS.006 | Legal      | Contracts, compliance                   |
| SYS.007 | Team       | HR, hiring, performance                 |

### 4 Essential Infrastructure Commissions

| Atom    | Commission | Key Essentials                                       |
| ------- | ---------- | ---------------------------------------------------- |
| SYS.008 | Shell      | Routing, auth integration, islands, graceful failure |
| SYS.009 | Core API   | Event backbone, RLS multi-tenancy, Soul gateway      |
| SYS.010 | UI         | Design system, accessible components                 |
| SYS.011 | TS-Schema  | Shared types, Zod validation, cross-runtime          |

---

## Code Mirrors Documentation

The atom hierarchy IS the code hierarchy:

```
docs/_atoms/SYS.001-STR.001-SOL.001.md
     ↓ maps to ↓
services/strategy/soul/
```

- **Same tree structure**
- **Same IDs for traceability**
- **CI can validate**: Does code implement atom's essentials?

---

## What Current Content Becomes

| Current Location             | New Location         | Rationale                      |
| ---------------------------- | -------------------- | ------------------------------ |
| Constitution PRD essentials  | SYS.001-011 atoms    | These ARE the commissions      |
| PR-001 (RLS)                 | SYS.009-API.xxx      | Core API implementation detail |
| IC-001 (Event Envelope)      | SYS.009-API.xxx      | Core API interface             |
| ADR-001 (Soul Orchestration) | SYS.001-STR.xxx      | Strategy decision              |
| ADR-003 (RLS impl)           | SYS.009-API.xxx      | Core API decision              |
| Module PRDs                  | Become child atoms   | Each module's essentials       |
| Epics/Stories                | REWRITE from scratch | Based on new atom structure    |

---

## Migration Rules

1. **PRD/Architecture IDEAS must be preserved** — migrate content to proper atoms
2. **Epics/Stories can be rewritten** — they derive from atoms anyway
3. **35 current atoms get restructured** — manual rewiring is fine
4. **No code exists yet** — clean slate for code structure

---

## Industry Validation (from Party Discussion)

| Pattern                            | Company | Our Equivalent                                |
| ---------------------------------- | ------- | --------------------------------------------- |
| Cascading OKRs                     | Google  | Commission → Essential → Child Commission     |
| Two-pizza teams with API contracts | Amazon  | Each atom owns its interface                  |
| API Improvement Proposals          | Google  | Atoms ARE the proposals, hierarchical         |
| Infrastructure as Code             | DevOps  | Requirements as Code — atoms ARE architecture |
| Monorepo API boundaries            | Google  | Atom tree = dependency tree                   |

---

## Key Insights to Preserve

1. **Telephone game solved**: Parent's essential IS child's commission — no interpretation
2. **Validation possible**: CI checks code against atom essentials
3. **Test pyramid built-in**: Atom depth = test scope (integration → unit)
4. **Onboarding trivial**: Read atom tree root-to-leaf = full context
5. **Cross-cutting via Sibling Law**: Cross-branch needs declared at common ancestor
6. **Fractal governance**: Same pattern at every level

---

## Next Steps

1. Write 11 Constitution atoms (commissions + essentials)
2. Migrate PRD/Architecture IDEAS into proper child atoms
3. Deprecate flat SYS.002-034 structure
4. Rewrite epics/stories from new atom tree
5. Align future code structure to atom tree

---

## Party Mode Participants (2025-12-04)

Discussed and validated by: Winston (Architect), Mary (Analyst), Victor (Innovation Strategist), John (PM), Dr. Quinn (Problem Solver), Amelia (Dev), Murat (Test Architect), Sophia (Storyteller), Maya (Design Thinking), Carson (Brainstorming), Paige (Tech Writer), BMad Master

**Consensus:** This model is sound, maps to proven industry patterns, and should be implemented.
