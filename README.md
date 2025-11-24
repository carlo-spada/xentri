# Business OS

> An "Operating System" for modern businesses.

**Business OS** is an opinionated platform that unifies disparate business tools—CRM, ERP, AI Agents, and Legal Automation—into a single, high-performance PWA. It solves "tab fatigue" by providing a unified shell while maintaining the scalability of microservices.

**Status:** Early-stage, not production-ready (API and CRM MVP under active development).

---

## Quick Start

**Prerequisites:** Docker, Node.js 20+

```bash
# 1. Clone the repository
git clone https://github.com/your-org/business-os-monorepo.git
cd business-os-monorepo

# 2. Configure Environment
cp .env.example .env

# 3. Install Dependencies (Turborepo handles all workspaces)
npm install

# 4. Start Infrastructure (Postgres, Redis, n8n, Backend Services)
# First run may take a few minutes to build Docker images.
docker-compose up -d

# 5. Start Frontend (Astro Shell + React Watch Mode)
npm run dev
```

> **Note:** The App Shell will launch at `http://localhost:3000`. The API Gateway will be available at `http://localhost:8080`.

---

## Technology Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | Astro (Shell) + React (Micro-Apps) + Vite |
| **Backend** | Dockerized Microservices (Node.js, Python, Go) |
| **Data** | Postgres (Multi-tenant via RLS), Redis (Event Bus) |
| **Automation** | n8n (Workflow Orchestration) |
| **Repo** | Turborepo (Monorepo management) |

---

## Documentation

This project is architected to scale from 1 to 1,000,000 users without a rewrite.

- **[Technical Architecture](./architecture.md)** - Deep dive into the "Nervous System," Data Governance, and Frontend Lazy Loading strategies.
- **Service Boundaries** - Which service owns what data? (See Architecture doc appendix)
- **Contributing Guide** - Branch naming and code style. *(Coming soon)*

---

## Roadmap

| Phase | Focus |
|-------|-------|
| **Current** | CRM MVP + Core API + WhatsApp Bot Processor |
| **Next** | ERP Engine (Invoicing) and Multi-tenant Billing Integration |
| **Future** | Marketing Automation Module and Client-Facing Automation Builder |

---

## License

*TBD*
