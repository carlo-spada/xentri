# Platform Documentation Index

> **Entity Type:** Constitution
> **Scope:** System-wide documentation hub

---

## Constitution Documents

Core documents that define system-wide rules ALL entities must follow.

| Document                          | Purpose                                                        | Status   |
| --------------------------------- | -------------------------------------------------------------- | -------- |
| [Product Soul](./product-soul.md) | Foundational vision — the DNA of Xentri                        | Draft    |
| [PRD](./prd.md)                   | Platform Requirements (PR-xxx), Integration Contracts (IC-xxx) | Draft    |
| [Architecture](./architecture.md) | System-wide technology decisions, ADRs, patterns               | Draft    |
| [UX Design](./ux-design.md)       | System-wide UX principles and design system                    | Approved |
| [Epics](./epics.md)               | Cross-cutting initiatives and system-level roadmap             | Approved |
| [Pulse](./pulse.md)               | Cross-team coordination and system-wide progress               | Active   |

---

## Infrastructure Modules

Platform-level modules that implement core infrastructure.

| Module                    | Purpose                                       | Status |
| ------------------------- | --------------------------------------------- | ------ |
| [core-api](./core-api/)   | Core API service with Prisma, RLS, events     | Active |
| [shell](./shell/)         | Astro shell with React islands                | Active |
| [ts-schema](./ts-schema/) | Shared types and Zod schemas (the "Contract") | Active |
| [ui](./ui/)               | Shared design system components               | Active |

---

## Supporting Directories

| Directory                                | Purpose                                    |
| ---------------------------------------- | ------------------------------------------ |
| [validation/](./validation/)             | Validation workflow outputs and reports    |
| [research/](./research/)                 | Market, competitive, and user research     |
| [ux/](./ux/)                             | Interactive UX deliverables (HTML mockups) |
| [sprint-artifacts/](./sprint-artifacts/) | Constitution-level sprint tracking         |

---

## Quick Links

- **Start here:** [Product Soul](./product-soul.md) → [PRD](./prd.md)
- **Technical decisions:** [Architecture](./architecture.md)
- **Design system:** [UX Design](./ux-design.md)
- **Implementation roadmap:** [Epics](./epics.md)

---

_This index provides navigation for the Constitution-level documentation. Each infrastructure module has its own README.md with module-specific details._
