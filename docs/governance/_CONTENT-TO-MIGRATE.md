# Content to Migrate — DO NOT LOSE

> **Purpose:** Index of valuable content from existing PRD/Architecture that MUST be migrated to new atom structure.
> **Warning:** This represents days of work. Migrate, don't delete.

---

## From Constitution PRD (`docs/platform/prd.md`)

### Ideas to Preserve → Destination

| Section                                | Content Summary                                       | Migrates To                         |
| -------------------------------------- | ----------------------------------------------------- | ----------------------------------- |
| Universal Soul concept                 | Business DNA, AI-readable/writable                    | SYS.001 (Strategy commission)       |
| 7 Categories definition                | Marketing, Finance, Sales, Ops, Legal, Team, Strategy | SYS.001-007 commissions             |
| Platform Requirements PR-001 to PR-008 | Multi-tenancy, events, auth, permissions              | Essentials in relevant commissions  |
| Integration Contracts IC-001 to IC-007 | Event envelope, Soul API, notifications               | Child atoms under Core API          |
| Fractal Agency Architecture            | Agents at every level                                 | SYS.001 (Strategy) or cross-cutting |
| Tri-State Memory                       | Semantic, Episodic, Synthetic                         | SYS.009 (Core API) child atom       |
| Soul Governance                        | AI-updateable vs human-sovereign                      | SYS.001-STR (Strategy) child atom   |

### Specific PRD Sections Worth Preserving

- **§Project Classification** — Keep as Constitution context
- **§Platform Integration Requirements** — Becomes essentials across commissions
- **§Notification Delivery Contract** — SYS.009-API child atom
- **§Soul Access Patterns** — SYS.001-STR child atom
- **§Pulse Hierarchical Model** — SYS.001-STR child atom

---

## From Constitution Architecture (`docs/platform/architecture.md`)

### ADRs to Migrate → Destination

| ADR                             | Decision                    | Migrates To                  |
| ------------------------------- | --------------------------- | ---------------------------- |
| ADR-001 Soul Orchestration      | Knowledge hierarchy pattern | SYS.001-STR.xxx              |
| ADR-002 Event Envelope          | Schema + dual-write         | SYS.009-API.xxx              |
| ADR-003 RLS Multi-tenant        | Postgres RLS pattern        | SYS.009-API.xxx              |
| ADR-004 K8s First               | Deployment strategy         | Infrastructure atom (TBD)    |
| ADR-006 Tri-State Memory        | Memory architecture         | SYS.009-API.xxx              |
| ADR-007 Federated Soul Registry | Prompt composition          | SYS.001-STR.xxx              |
| ADR-008 Python for Agents       | Language choice             | Agent layer atom (TBD)       |
| ADR-009 Cross-Runtime Contracts | TS→Python bridge            | SYS.011-TSS.xxx              |
| ADR-010 Resilience              | Graceful degradation        | Cross-cutting essential      |
| ADR-011 Hierarchical Pulse      | Filtering architecture      | SYS.001-STR.xxx              |
| ADR-012 Copilot Widget          | Shell integration           | SYS.008-SHL.xxx              |
| ADR-013 Narrative Continuity    | UX philosophy               | SYS.001-STR.xxx or UX        |
| ADR-014 Module Registration     | Shell manifest              | SYS.008-SHL.xxx              |
| ADR-015 Permission Enforcement  | Auth architecture           | SYS.009-API.xxx              |
| ADR-016 Soul Access             | API patterns                | SYS.009-API.xxx              |
| ADR-017 Notification Delivery   | Push/digest/dashboard       | SYS.009-API.xxx              |
| ADR-018 Explainable Automation  | Transparency pattern        | Cross-cutting essential      |
| ADR-020 Sibling Dependency Law  | Governance rule             | Constitution-level essential |

### Architecture Sections Worth Preserving

- **§Technology Stack** — Reference in relevant commissions
- **§Layer Diagram** — Visual for Constitution overview
- **§State Machines** — Soul generation, recommendation flows
- **§Data Models** — system_events, organizations, etc.

---

## From Module PRDs

| Module    | File                             | Key Content             | Migrates To           |
| --------- | -------------------------------- | ----------------------- | --------------------- |
| Core API  | `docs/platform/core-api/prd.md`  | API endpoints, RLS impl | SYS.009-API.xxx atoms |
| Shell     | `docs/platform/shell/prd.md`     | Routing, islands        | SYS.008-SHL.xxx atoms |
| TS-Schema | `docs/platform/ts-schema/prd.md` | Type contracts          | SYS.011-TSS.xxx atoms |
| UI        | `docs/platform/ui/prd.md`        | Design system           | SYS.010-UI.xxx atoms  |

---

## From UX Design (`docs/platform/ux-design.md`)

- **Pulse visual hierarchy** — SYS.001-STR (Strategy) child
- **Copilot widget patterns** — SYS.008-SHL (Shell) child
- **Navigation structure** — SYS.008-SHL (Shell) child
- **Chronicle/Themes concept** — SYS.001-STR (Strategy) child

---

## What CAN Be Discarded

- Current epics.md — Will rewrite from atoms
- Current stories — Will rewrite from atoms
- Validation reports — Historical, not needed
- \*\_recovered.md files — Backups, content already in main files

---

## Migration Checklist

- [ ] Read Constitution PRD, extract ideas to atom drafts
- [ ] Read Constitution Architecture, extract ADRs to atom drafts
- [ ] Read each module PRD, extract to child atom drafts
- [ ] Read UX Design, extract patterns to appropriate atoms
- [ ] Write 11 Constitution atoms with extracted essentials
- [ ] Write child atoms for each module
- [ ] Verify no valuable content lost
- [ ] Deprecate old flat atom structure
- [ ] Rewrite epics from new atom tree
