# Xentri - Business OS Project Context

## 1. Project Overview

**Xentri** is a modular **Business OS** designed to unify Strategy, Marketing, Sales, Finance, and Operations into a single workspace. It distinguishes itself by starting with a **Strategy Co-pilot** conversation that generates a **Universal Brief**, which then acts as the "DNA" for configuring the rest of the system (website, CRM, invoices, etc.).

### Core Value Proposition
*   **Clarity First:** Starts with a conversation, not configuration.
*   **Universal Brief:** A living document that powers all other modules.
*   **Modular Growth:** Users subscribe to specific capabilities (modules) as they grow.
*   **"Calm" UX:** A unified shell that prevents "tab fatigue".

## 2. Architecture & Tech Stack

The project uses a **Monorepo** structure managed by **Turborepo**, following a "Decoupled Unity" philosophy.

| Layer | Technology | Role |
| :--- | :--- | :--- |
| **Frontend Shell** | **Astro** | The container application. Handles routing, auth, and layout. |
| **Micro-Apps** | **React** | Interactive capabilities (CRM, CMS, etc.) loaded as "Islands" within the Shell. |
| **Backend** | **Node.js** | Dockerized microservices for business logic (Sales, Finance, etc.). |
| **AI Service** | **Python** | Hosts the Co-pilot Swarm (Strategy, Brand, Sales agents). |
| **Data** | **Postgres** | Single cluster with **RLS (Row Level Security)** for multi-tenancy. |
| **Events** | **Redis** | The "Nervous System" for high-volume internal synchronization. |
| **Orchestration** | **n8n** | Self-hosted workflow engine for complex business logic. |

### Key Architectural Patterns
1.  **The "Nervous System":** Services do *not* talk directly to each other. They emit events to Redis/n8n.
2.  **Multi-Tenancy:** Enforced via Postgres RLS. Every table **MUST** have an `organization_id`.
3.  **Lazy Loading:** React micro-apps are loaded on demand by the Astro shell.
4.  **Shared Contract:** Types and Schemas are shared via `/packages/ts-schema`.

## 3. Directory Structure

```text
/Users/carlo/Desktop/Projects/xentri/
├── architecture.md         # Technical Constitution & Data Governance
├── README.md               # Quick Start & Roadmap
├── .agent/                 # Agent workflows and definitions (BMAD framework)
├── .bmad/                  # BMAD framework configuration and manifests
├── docs/                   # Product research, briefs, and architectural deep dives
│   └── product-brief-*.md  # The core product vision and requirements
├── .git/                   # Git repository
└── (Expected Monorepo Structure - based on architecture.md)
    ├── apps/               # shell (Astro)
    ├── packages/           # ui, cms-client, ts-schema
    └── services/           # core-api, brand-engine, ai-service
```

## 4. Development Conventions

### Commands (Inferred)
*   **Setup:** `cp .env.example .env`
*   **Install:** `npm install` (Turborepo handles workspaces)
*   **Infrastructure:** `docker-compose up -d` (Postgres, Redis, n8n)
*   **Dev Server:** `npm run dev` (Starts Astro Shell + React Watchers)

### Coding Standards
*   **Strict Isolation:** No service assumes the existence of another. Use Events.
*   **Type Safety:** Changes to DB schema require updates to `packages/ts-schema`.
*   **No "Magic":** Automated actions must be logged with human-readable explanations.
*   **Agent/Workflow Files:** The `.agent` and `.bmad` directories contain workflow definitions. Respect the existing format when creating new agents or workflows.

## 5. Current Status (v0.1 MVP)
*   **Focus:** Strategy Co-pilot + Universal Brief.
*   **Goal:** Validate that users complete the brief and find value in the conversation.
*   **Next Steps:** Building out the `Brand & Marketing` modules (v0.2).

## 6. AI Agent Guidelines (The "BMAD" Context)
This project appears to utilize the **BMAD** (Business Model Agent Developer?) framework.
*   **Agents:** Defined in `.bmad/_cfg/agents/` or `.gemini/commands/`.
*   **Workflows:** Defined in `.agent/workflows/`.
*   **Manifests:** Check `.bmad/_cfg/manifest.yaml` for installed modules/capabilities.

When asked to work on "agents" or "workflows", refer to these directories and the specific Markdown files within `.agent/workflows/` for context on how tasks are structured.

## 7. User Rules
- **NEVER SKIP AHEAD**: Do not perform tasks or create artifacts without explicit user request.
- **VALIDATION ONLY**: When asked to validate, only check existing files; do not create missing ones.
