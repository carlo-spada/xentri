# Xentri - Product Requirements Document

**Author:** Carlo
**Date:** 2025-11-25
**Version:** 1.0

---

## Executive Summary

Xentri is a **clarity-first Business OS** that starts with a conversation, not a configuration screen.

The core thesis: most small businesses and founders don't suffer from a lack of tools—they suffer from tools that don't agree with each other, and more fundamentally, from never having articulated what their business actually *is*. Ideas live in notes apps, client info in WhatsApp, invoices in spreadsheets, and critical context in the owner's head.

**Xentri's approach:**
1. Start free with the **Strategy Co-pilot**—an AI that helps you think through your business, not just produce content
2. Generate a **Universal Brief**—the living DNA of your business that powers everything else
3. Unlock **personalized module bundles** based on your Brief, not a one-size-fits-all feature catalog
4. Grow the operational backbone underneath you—one module at a time—without a big-bang migration

**This PRD covers v0.1-v0.2 (MVP):**
- **v0.1 (Free):** Strategy Co-pilot + Universal Brief
- **v0.2 (Presencia, $10/mo):** Website Builder + CMS + Lead Capture

Together, these create the first complete value loop: **Idea → Brief → Website → Leads**.

**The architecture is non-trivial.** Getting the foundation right (Event Backbone, Brief schema, orchestration layer) is the gate to everything else. We are building load-bearing infrastructure, not just features.

### What Makes This Special

**The differentiator is not "AI" or "all-in-one."** Every competitor is adding AI. Every competitor claims to be all-in-one.

**Xentri's differentiation:**
- We use AI to generate **clarity and structure**, not just content
- We start with a **free entry point** that delivers real value before asking for money
- We offer **personalized bundles** based on who you are, not fixed tiers for everyone
- We surface **one calm view** of what matters today, not a flood of notifications

> **The emotional job Xentri solves:** Turn chronic, background anxiety into a manageable, visible list of responsibilities—so founders and owners feel caught up instead of constantly behind.

### Innovation & Validation Approach

- **Innovation thread:** Conversation-first Universal Brief that auto-orchestrates downstream modules (website, CMS, leads) plus visible automation log via the Event Backbone.
- **Validation loop:** Every AI proposal is user-confirmed; all AI outputs log `ai_proposal_*` events; Client Zero runs the same Brief → Website → Leads loop to prove orchestration works.
- **Fallbacks:** Guided forms mirror the conversational path; overrides never mutate the Brief (source of truth stays intact).
- **Measurement:** Success criteria below map to epics (Epic 1 foundation, Epic 2 Brief, Epic 3 website, Epic 4 leads, Epic 5 brand, Epic 6 data controls).

### The Core Value: Orchestration, Not Modules

**Any individual module can be "good enough" elsewhere.** Wix builds websites. Jobber manages jobs. Jane handles appointments. Each does their thing adequately.

**What doesn't exist is the orchestration.**

The real value of Xentri is not that it has a CRM, or a website builder, or invoicing. It's that:
- The **Universal Brief** informs everything—your website pulls from it, your CRM structures around it, your co-pilots reference it
- The **Event Backbone** connects everything—`lead_created` triggers follow-up logic, `quote_accepted` can auto-generate invoice, every action is traceable
- The **Shell** unifies everything—one workspace, one navigation, one "what needs attention" view across all capabilities

**Xentri is the connective tissue.** The modules are table stakes; the integration is the moat.

### Validation Model: Client Zero

Until v1.0, **Xentri is its own primary customer.**

- Xentri's public website is built with Xentri Website Builder
- Xentri's content is managed by Xentri CMS
- Xentri's leads are captured by Xentri Lead Capture
- Xentri's goals are tracked in Xentri Strategy module

External customers before v1.0 are a bonus, not a success criterion. The validation question is: **"Can Xentri run Xentri?"** If yes, it can run any business.

This is not dogfooding as QA. This is existence proof as strategy.

---

## Project Classification

**Technical Type:** SaaS B2B + Web App (PWA)
**Domain:** General Business Software
**Complexity:** Medium

### Classification Details

**Project Type Signals Detected:**
- Multi-tenant architecture from day one
- Subscription-based pricing model with tiered bundles
- Dashboard-centric experience with modular capabilities
- Progressive Web App targeting browser + mobile
- AI co-pilot as core differentiator (not bolt-on)

**Domain Classification:**
- Standard business operations software (CRM, website, lead capture)
- No specialized regulatory domain (healthcare, fintech, govtech)
- Locale-specific compliance (CFDI/SII) deferred to v0.4+
- General software best practices apply

**Complexity Rationale:**

| Dimension | Level | Notes |
|-----------|-------|-------|
| Regulatory | Low | No external approval gates; standard web security/privacy |
| Architectural | Medium-High | Event Backbone as source of truth; Universal Brief as "DNA" powering all modules; multi-tenant from day zero |
| Feature | Low-Medium | Standard SaaS patterns (forms, CMS, lead capture) built on sophisticated foundation |

**Why This Matters:**
The foundational architecture (Event Backbone, Brief schema, multi-tenancy) requires careful design—these are load-bearing walls. However, the feature-level complexity is standard. Getting the foundation right enables rapid feature development later; getting it wrong creates compounding technical debt.

### Primary Competitive Threat

**Wix/Squarespace—not vertical SaaS—is the primary threat.**

| Competitor Type | Threat Level | Why |
|-----------------|--------------|-----|
| **Wix/Squarespace** | High | Same entry point ("I need a website"). Massive reach. Adding CRM/invoicing features. If they add a "business clarity" AI, they have distribution we don't. |
| **Vertical SaaS** (Jobber, Jane) | Medium | Different entry point ("I need job software"). Users who find them already know what they need. We capture earlier in the journey. |
| **All-in-one platforms** (GoHighLevel, Odoo) | Low-Medium | Overwhelming complexity. We win on "calm." They assume expert admins; we assume busy founders. |

**Strategic implication:** Xentri must differentiate on *orchestration and operational brain*, not just "pretty website." Wix can match pretty. Wix can't match "your Brief powers your CRM powers your invoicing."

---

## Readiness Criteria

**These are technical quality gates, not customer validation targets.**

External customers before v1.0 are not the success metric. The question is: **"Is the system ready to run a real business (starting with Xentri itself)?"**

### v0.1 Readiness (Strategy Co-pilot + Brief)

| Criterion | Gate | How We Know |
|-----------|------|-------------|
| **Brief completion works** | Pass/Fail | A user can go from sign-up to completed Brief in <15 minutes via conversation |
| **Co-pilot conversation quality** | Qualitative | Conversation feels natural, not robotic. Follow-ups are relevant. Fallback to guided form works gracefully. |
| **Brief schema is stable** | Pass/Fail | Schema supports all 7 sections (Identity, Audience, Offerings, Positioning, Operations, Goals, Proof). Versioning strategy defined. |
| **Event Backbone logs reliably** | Pass/Fail | `brief_created`, `brief_updated` events fire correctly. Events are queryable. |
| **Multi-tenancy is airtight** | Pass/Fail | Every query includes `org_id`. RLS enforced. No data leaks in testing. |
| **Shell loads fast** | <2s on 3G | First meaningful paint under 2 seconds. |

**Epic linkage:** Epic 1 (foundation/auth/events) satisfies these gates; Epic 2 ensures Brief creation; Epic 3 leverages Brief for website; Epic 4 validates lead capture wiring; Epic 6 guards data controls.

### v0.2 Readiness (Presencia: Website + CMS + Leads)

| Criterion | Gate | How We Know |
|-----------|------|-------------|
| **Website publishes from Brief** | Pass/Fail | A user can generate a live website that pulls business name, services, positioning from their Brief |
| **Custom domain works** | Pass/Fail | User can connect their own domain. SSL provisioned automatically. |
| **Lead capture fires events** | Pass/Fail | `lead_created` event logged. Notification delivered (email + in-app). |
| **CMS content is editable** | Pass/Fail | User can create/edit blog posts, service pages, portfolio items. |
| **Brief → Website flow is seamless** | Qualitative | Content auto-populated from Brief feels right, not robotic. User can override. |
| **Xentri runs on Xentri** | Pass/Fail | Xentri's own public site, content, and lead capture are powered by v0.2. |

### Orchestration Readiness (Cross-Cutting)

| Criterion | Gate | How We Know |
|-----------|------|-------------|
| **Events flow across modules** | Pass/Fail | `brief_updated` can trigger website content refresh prompt. `lead_created` appears in unified timeline. |
| **Brief is live source of truth** | Pass/Fail | Changing Brief updates downstream consumers (website pulls new business name). |
| **Shell navigation is stable** | Pass/Fail | Switching between Strategy and Brand categories feels like changing panels, not loading new apps. |

---

## Key Risks

### Critical Risks (Must Mitigate)

| Risk | Severity | Mitigation |
|------|----------|------------|
| **AI quality dependency** | Critical | The entire "clarity-first" differentiation depends on the Strategy Co-pilot being *good*. If conversations feel clunky or outputs are generic, positioning collapses. **Mitigation:** Graceful fallback to guided forms. Constrained scope (produce Brief, not run the business). Logged proposals for iteration. Quality benchmarks before launch. |
| **Architectural foundation failure** | Critical | Event Backbone and Brief schema are load-bearing. Getting them wrong creates compounding debt. **Mitigation:** Foundation is a gated milestone. No feature work until Event Backbone is proven. Schema versioning strategy defined upfront. |
| **Multi-tenant data leak** | Critical | One leak = catastrophic trust loss. **Mitigation:** RLS enforced in Postgres. Every query includes `org_id`. Paranoid testing. Code review checklist. |

### High Risks (Active Monitoring)

| Risk | Severity | Mitigation |
|------|----------|------------|
| **Wix/Squarespace adds clarity AI** | High | If incumbents copy "conversation-first onboarding," we lose differentiation. **Mitigation:** Orchestration is the moat, not the entry point. Brief → everything is hard to replicate. Move fast. |
| **Co-pilot hallucination** | High | AI generates plausible but wrong content. **Mitigation:** Scaffolding only—AI proposes, user confirms. No auto-publish. All proposals logged. |
| **Scope creep on Website Builder** | Medium-High | Website builders are infinite scope sinks. **Mitigation:** Evaluate GrapesJS/Craft.js instead of building from scratch. Launch with 3-4 quality templates, not infinite customization. |

### Accepted Risks (Proceed Anyway)

| Risk | Severity | Rationale |
|------|----------|-----------|
| **No external customers until v1.0** | Accepted | Client Zero validation is sufficient. External customers are bonus. |
| **PWA instead of native mobile** | Accepted | PWA is sufficient for MVP. Native can come later if needed. |
| **No CFDI/SII compliance** | Accepted | Deferred to v0.4+. English-speaking markets first. |

---

## Product Scope

### MVP - Minimum Viable Product (v0.1-v0.2)

**The first complete value loop: Idea → Brief → Website → Leads**

MVP is not "feature complete." MVP is "orchestration proven." The question isn't "does each module work?" but "does the Brief power the Website power the Lead Capture, with events flowing through?"

#### v0.1: Foundation + Strategy (Free Tier)

**Category: Management & Strategy**

| Component | What It Does | Orchestration Role |
|-----------|--------------|-------------------|
| **Strategy Co-pilot** | Conversational onboarding that produces the Universal Brief | Entry point; creates the DNA that powers everything |
| **Universal Brief** | Living document with 7 sections: Identity, Audience, Offerings, Positioning, Operations, Goals, Proof | Source of truth consumed by all downstream modules |
| **Shell Infrastructure** | Astro shell with header + collapsible sidebar, 7 category navigation | Unified workspace; modules feel like panels, not apps |
| **Event Backbone v0.1** | Postgres `system_events` table; `brief_created`, `brief_updated` events | Audit trail; foundation for cross-module intelligence |
| **Multi-tenant Core** | Every table has `org_id`; RLS enforced | Security foundation; non-negotiable from day zero |
| **Auth** | Supabase Auth or similar | User management; organization creation |

**v0.1 proves:** The conversation-to-Brief flow works. Events log reliably. Multi-tenancy is airtight.

#### v0.2: Presencia (Website + CMS + Leads) — $10/mo, 3 modules

**Category: Brand & Marketing**

| Module | What It Does | Orchestration Role |
|--------|--------------|-------------------|
| **Website Builder** | Drag-and-drop page builder with responsive templates | Consumes Brief (business name, services, positioning auto-populate) |
| **CMS / Portfolio** | Blog, service pages, photo galleries | Content layer; feeds Website Builder |
| **Lead Capture** | Contact form, lead notification, basic lead list | First external data entering the system; fires `lead_created` events |
| **Brand Co-pilot** | AI specialized for Brand & Marketing tasks | Reads Brief for context; suggests copy, reviews content |

**v0.2 proves:** Brief → Website flow is seamless. Events flow across modules (`lead_created` appears in timeline). Xentri can run Xentri.

#### What's Explicitly NOT in MVP

| Feature | Why Deferred |
|---------|--------------|
| CRM / Client Management | v0.3 (Sales category) |
| Quotes / Pipeline | v0.3 (Sales category) |
| Invoicing / Payments | v0.4 (Finance category) |
| Multi-user / Roles | v0.4 (Business in Motion tier) |
| WhatsApp Bridge | v0.3 (strategic, but requires Sales context) |
| Custom automations | Post-MVP (Open Loops view in v0.4 is the first step) |

---

### Growth Features (v0.3-v0.4)

**The full operational backbone: Leads → Quotes → Invoices → Payments**

These releases extend orchestration into revenue-generating workflows. Still focused on Client Zero validation.

#### v0.3: Light Ops (Sales & Pipeline) — $30/mo, 8 modules

| Module | Orchestration Role |
|--------|-------------------|
| **Client Management** | Clients linked to leads, quotes, invoices; unified timeline |
| **Quote Builder** | Pulls from Brief (services, pricing); fires `quote_created`, `quote_sent` |
| **Pipeline View** | Visual funnel; `deal_stage_changed` events |
| **Follow-up System** | Scheduled reminders; `followup_scheduled`, `followup_completed` events |
| **WhatsApp Bridge** | "Magic Copy" flow; bridges where users live to structured data |
| **Sales Co-pilot** | Reads client history, suggests follow-ups, analyzes pipeline |

**v0.3 proves:** The CRM layer integrates with Brief and Website. Quote creation pulls from Brief. Events chain across Lead → Client → Quote.

#### v0.4: Business in Motion (Finance & Accounting) — $90/mo, ~24 modules

| Module | Orchestration Role |
|--------|-------------------|
| **Invoicing** | Can auto-generate from accepted quotes; `invoice_issued` events |
| **Payment Tracking** | Marks invoices paid; `payment_received` events |
| **Open Loops View** | Daily "what needs attention" across all categories—the Calm Prompt |
| **Tax Pack Export** | Clean CSV/Excel for accountants; data portability |
| **Finance Co-pilot** | Analyzes revenue, flags overdue, suggests pricing |
| **Multi-User Access** | Invite team members; category-specific access; role assignments |

**v0.4 proves:** Full revenue loop works (Lead → Quote → Invoice → Payment). Open Loops view surfaces what matters. Multi-user doesn't break multi-tenancy.

---

### Vision Features (v0.5+)

**The full Business OS: Every category, every co-pilot, complete orchestration**

| Phase | Category | Key Capabilities |
|-------|----------|------------------|
| v0.5-v0.6 | Operations & Delivery | Jobs, Projects, Scheduling, Dispatching |
| v0.5-v0.6 | Team & Leadership | Roles, SOPs, Knowledge Base, Onboarding |
| v0.5+ | Secondary Geo | CFDI (Mexico), SII (Spain) compliance |
| v0.5+ | Payments | Stripe, MercadoPago integration |
| v0.7+ | Legal & Compliance | Contracts, Licenses, Policies |
| v0.7+ | WhatsApp Full API | Beyond Magic Copy; automated responses |
| v1.0+ | External Customers | Go-to-market beyond Client Zero |
| v1.0+ | Advanced | Voice-to-Intent, AI pricing suggestions, cross-business intelligence |

**Vision success:** Any business type can run their complete operation in Xentri—from first idea to recurring revenue—with one Brief, one Event Backbone, one calm workspace.

---

## SaaS B2B Specific Requirements

### API & Auth Contract (v0.1-v0.2)

| Area | Expectation |
|------|-------------|
| Auth | Supabase Auth (email/password + Google/GitHub). HTTP-only cookies preferred; short-lived access tokens with refresh rotation. |
| Tenancy | Server resolves `org_id` from session/context—never from client input. Every request enforced by RLS. |
| Core endpoints | `POST /api/briefs` (create), `PATCH /api/briefs/:id` (update section), `GET /api/briefs/:id`, `POST /api/events` (append-only), `GET /api/events?type=&since=`, `POST /api/websites/:id/publish`, `POST /api/leads` (public form, domain-bound), `GET /api/leads`. |
| Event payloads | Include `org_id`, `user_id` (nullable for public lead), `event_type`, `payload`, `timestamp`, `source`. |
| Publish guardrails | Website publish validates Brief `schema_version` and content source map before firing `website_published`. |
| Lead intake | Public endpoint resolves org from domain/site id; applies rate limiting + honeypot; strips PII from events as needed. |

**Response shapes (examples):**
- `GET /api/briefs/:id` → `{ id, org_id, schema_version, sections: {...}, completion_status, updated_at }`
- `POST /api/events` → `{ event_id, acknowledged: true }`
- `POST /api/leads` → `{ lead_id, status: "received" }` (never echo raw message body)

**Error handling:**
- Auth/tenancy errors → `401/403` with no sensitive detail.
- Validation errors → `422` with field-specific messages.
- Rate limits (lead intake) → `429` with retry-after header.
- Server faults → `500` with correlation id (aligns with NFR24 logging).

### Multi-Tenancy Model

**Architecture:** Single-schema with `org_id` column + Row-Level Security (RLS).

| Requirement | Specification |
|-------------|---------------|
| **Tenant isolation** | Every table includes `org_id` column. Row-Level Security (RLS) enforced at database level. |
| **Tenant creation** | New organization created on sign-up. User becomes Owner of that org. |
| **Data boundaries** | No query can return data across orgs. Even admin tools operate within org context. |
| **Tenant deletion** | Soft delete with 30-day recovery window. Hard delete purges all org data. |

**Critical constraint:** Multi-tenancy is not a feature—it's a security property. Any RLS bypass is a critical bug.

### Permission Model (RBAC)

**MVP (v0.1-v0.2):** Single-user only. One Owner per org.

**v0.4+ (Multi-user):**

| Role | Access | Use Case |
|------|--------|----------|
| **Owner** | Full access to all categories and settings | Business founder/owner |
| **Admin** | Full access to assigned categories; can invite Members | Operations manager, spouse/admin |
| **Member** | Access to specific modules within assigned categories | Accountant (Finance only), marketer (Brand only) |

**Permission boundaries:**
- Roles are category-scoped, not module-scoped (simpler mental model)
- Owner can assign categories to Admins/Members
- No cross-org access under any circumstances

### Subscription Tiers

| Tier | Price | Modules | Target User |
|------|-------|---------|-------------|
| **Free** | $0/mo | 1 (Strategy Co-pilot + Brief) | Anyone starting out |
| **Presencia** | $10/mo | 3 (personalized bundle) | Founders, solo practitioners needing web presence |
| **Light Ops** | $30/mo | 8 (personalized bundle) | Owners running daily operations |
| **Business in Motion** | $90/mo | ~24 + multi-user | Growing teams needing full revenue loop |
| **Professional** | $270/mo | ~72 + advanced | Scaled teams with specialists per category |
| **Enterprise** | $500+/mo | 135+ + custom | Large organizations with dedicated support |

**Tier mechanics:**
- Bundles are personalized based on Universal Brief (a plumber's $10 ≠ a founder's $10)
- À la carte: Any module can be added individually at $5/mo
- Upgrade/downgrade: Prorated, effective immediately
- Bundle savings: ~25-33% vs à la carte equivalent

### Integration Requirements (MVP Scope)

**v0.1-v0.2 integrations:**

| Integration | Type | Purpose |
|-------------|------|---------|
| **Supabase Auth** | Core | User authentication, session management |
| **Transactional Email** (Resend/Postmark) | Core | Lead notifications, password reset, system emails |
| **DNS Provider API** | v0.2 | Custom domain connection for websites |
| **SSL Provider** (Let's Encrypt) | v0.2 | Automatic SSL for custom domains |

**Deferred integrations:**
- Payment gateway (Stripe) → v0.4+
- WhatsApp Business API → v0.3+ (Magic Copy is copy/paste, not API)
- Calendar sync → v0.5+
- Accounting export (QuickBooks, Xero) → v0.5+

### Compliance Requirements (MVP Scope)

| Requirement | Scope | Implementation |
|-------------|-------|----------------|
| **GDPR basics** | MVP | Data export on request; deletion on request; privacy policy |
| **Cookie consent** | MVP | Consent banner for analytics (if any) |
| **Terms of Service** | MVP | Standard SaaS ToS |
| **Data retention** | MVP | Event logs retained indefinitely; user data per org policy |
| **CFDI (Mexico)** | v0.4+ | Electronic invoicing via SAT-authorized PAC |
| **SII (Spain)** | v0.4+ | Real-time invoice reporting |

**Compliance stance:** MVP targets English-speaking markets with standard SaaS compliance. Locale-specific invoicing compliance is a Phase 2 expansion concern.

---

## User Experience Requirements

**Philosophy:** Light touch. Define the feel, not the pixels. Detailed interactions belong in the UX Design phase.

### Core UX Principles

| Principle | Requirement |
|-----------|-------------|
| **Calm, not noisy** | Maximum 3-5 items in any "attention needed" view. No notification floods. |
| **One shell, many panels** | Switching categories/modules feels like changing tabs, not loading new apps. Target: <500ms transition. |
| **Brief as context** | Any module that can use Brief data should auto-populate from it. User can override. |
| **Visible automation** | Every automated action shows what happened and why. "Xentri did X because Y." |
| **Mobile-responsive** | All interfaces must work on mobile viewport. Not mobile-first, but mobile-capable. |
| **Accessibility baseline** | WCAG 2.1 AA compliance for core flows (sign-up, Brief creation, website editing). |

### Key Interaction Requirements

| Interaction | Requirement |
|-------------|-------------|
| **Onboarding** | Conversation-first (Co-pilot), not form-first. Fallback to guided form if AI fails. |
| **Navigation** | Sidebar shows 7 categories. Only subscribed categories are active. One category expanded at a time. |
| **Module switching** | Tab-based within category SPA. No full page reload. |
| **Data entry** | Prefer progressive disclosure over long forms. Ask for minimum, expand as needed. |
| **Feedback** | All actions confirm success/failure. No silent failures. |
| **Dark mode** | Supported from v0.1. User preference stored. |

---

## Functional Requirements

**This section is the capability contract for all downstream work.**

- UX designers will design what's listed here
- Architects will support what's listed here
- Epic breakdown will implement what's listed here
- If a capability is missing from FRs, it will NOT exist in the final product

### FR Organization

FRs are organized by **capability area** (what users/system can do), not by technology layer.

Scope: **v0.1-v0.2 only** (MVP). Growth features (v0.3-v0.4) noted as [FUTURE] for architectural awareness.

---

### User Account & Access

| FR# | Priority | Requirement |
|-----|----------|-------------|
| FR1 | MVP | Users can create an account with email/password |
| FR2 | MVP | Users can sign in with social authentication (Google, GitHub) |
| FR3 | MVP | Users can reset password via email verification |
| FR4 | MVP | Users can update their profile (name, email, avatar) |
| FR5 | MVP | Users can delete their account and all associated data |
| FR6 | MVP | System creates a new Organization when user signs up (user becomes Owner) |
| FR7 | Future | [FUTURE v0.4] Owners can invite team members to their organization |
| FR8 | Future | [FUTURE v0.4] Owners can assign roles (Admin, Member) to team members |
| FR9 | Future | [FUTURE v0.4] Owners can revoke access for team members |

---

### Universal Brief

| FR# | Priority | Requirement |
|-----|----------|-------------|
| FR10 | MVP | Users can create their Universal Brief via conversation with Strategy Co-pilot |
| FR11 | MVP | Users can create their Universal Brief via guided form (fallback) |
| FR12 | MVP | Users can view their complete Brief at any time |
| FR13 | MVP | Users can edit any section of their Brief |
| FR14 | MVP | Brief updates fire `brief_updated` event to Event Backbone |
| FR15 | MVP | Brief contains 7 sections: Identity, Audience, Offerings, Positioning, Operations, Goals, Proof |
| FR16 | MVP | Brief data is stored as structured JSON (BrandBrief, OpsModel, OfferCatalog schemas) |
| FR17 | MVP | Brief can be exported as PDF or Markdown |

---

### Strategy Co-pilot

| FR# | Priority | Requirement |
|-----|----------|-------------|
| FR18 | MVP | Co-pilot conducts conversational interview to understand the business |
| FR19 | MVP | Co-pilot asks context-aware follow-up questions based on previous answers |
| FR20 | MVP | Co-pilot can handle short/unclear responses gracefully (re-ask or infer) |
| FR21 | MVP | Co-pilot generates Brief sections from conversation content |
| FR22 | MVP | User must confirm/edit Co-pilot-generated content before it's saved |
| FR23 | MVP | Co-pilot conversation can be paused and resumed |
| FR24 | MVP | Co-pilot logs all proposals as events (`ai_proposal_generated`) |
| FR25 | MVP | If Co-pilot fails or user opts out, system falls back to guided form |

---

### Shell & Navigation

| FR# | Priority | Requirement |
|-----|----------|-------------|
| FR26 | MVP | Shell displays stable header with user menu and notifications |
| FR27 | MVP | Shell displays collapsible sidebar with 7 category icons |
| FR28 | MVP | Only subscribed/active categories are interactable in sidebar |
| FR29 | MVP | Clicking a category expands its subcategories; other categories collapse |
| FR30 | MVP | Switching between categories does not trigger full page reload |
| FR31 | MVP | Shell supports light and dark mode; preference persisted per user |
| FR32 | MVP | Shell is responsive; sidebar collapses to icons on mobile |

---

### Event Backbone

| FR# | Priority | Requirement |
|-----|----------|-------------|
| FR33 | MVP | All significant actions write to `system_events` table |
| FR34 | MVP | Events include: `org_id`, `user_id`, `event_type`, `payload`, `timestamp` |
| FR35 | MVP | Events are immutable (append-only log) |
| FR36 | MVP | Events can be queried by org, type, and time range |
| FR37 | MVP | v0.1 event types: `brief_created`, `brief_updated`, `user_signup`, `user_login` |
| FR38 | MVP | v0.2 event types: `website_published`, `page_updated`, `content_published`, `lead_created` |
| FR39 | Future | [FUTURE] Events power cross-module projections (e.g., `open_loops` view) |

---

### Website Builder (v0.2)

| FR# | Priority | Requirement |
|-----|----------|-------------|
| FR40 | MVP | Users can create a website with drag-and-drop page builder |
| FR41 | MVP | Website Builder offers 3-4 pre-built templates for target segments (founders, trades, clinics) |
| FR42 | MVP | Website content auto-populates from Universal Brief (business name, services, tagline) |
| FR43 | MVP | Users can override any auto-populated content |
| FR44 | MVP | Users can add/remove/reorder pages |
| FR45 | MVP | Users can add/remove/configure page sections (hero, services, about, contact, etc.) |
| FR46 | MVP | Website is mobile-responsive by default |
| FR47 | MVP | Users can preview website before publishing |
| FR48 | MVP | Users can publish website to Xentri subdomain (orgname.xentri.app) |
| FR49 | MVP | Users can connect custom domain to their website |
| FR50 | MVP | Custom domains receive automatic SSL certificate |
| FR51 | MVP | Website publish fires `website_published` event |
| FR52 | MVP | Page updates fire `page_updated` event |

---

### CMS / Portfolio (v0.2)

| FR# | Priority | Requirement |
|-----|----------|-------------|
| FR53 | MVP | Users can create, edit, and delete blog posts |
| FR54 | MVP | Users can create, edit, and delete service pages |
| FR55 | MVP | Users can upload and manage images (photo gallery / portfolio) |
| FR56 | MVP | Content supports rich text editing (headings, lists, links, images) |
| FR57 | MVP | Content can be tagged and categorized |
| FR58 | MVP | Content publish fires `content_published` event |
| FR59 | MVP | Published content appears on user's website (blog section, service pages) |

---

### Lead Capture (v0.2)

| FR# | Priority | Requirement |
|-----|----------|-------------|
| FR60 | MVP | Users can add a contact form to their website |
| FR61 | MVP | Contact form fields are customizable (name, email, phone, message, custom fields) |
| FR62 | MVP | Form submissions create a Lead record in the system |
| FR63 | MVP | Lead creation fires `lead_created` event |
| FR64 | MVP | Users receive notification when new lead is captured (email + in-app) |
| FR65 | MVP | Users can view list of all captured leads |
| FR66 | MVP | Users can view individual lead details (submitted info, timestamp, source page) |
| FR67 | MVP | Users can mark leads as contacted/archived |
| FR68 | Future | [FUTURE v0.3] Leads can be converted to Clients |

---

### Brand Co-pilot (v0.2)

| FR# | Priority | Requirement |
|-----|----------|-------------|
| FR69 | Growth | Brand Co-pilot is available when user has Brand & Marketing modules |
| FR70 | Growth | Brand Co-pilot can suggest website copy based on Brief |
| FR71 | Growth | Brand Co-pilot can review and improve user-written content |
| FR72 | Growth | Brand Co-pilot can suggest SEO improvements for pages |
| FR73 | Growth | All Brand Co-pilot suggestions require user confirmation before applying |
| FR74 | Growth | Brand Co-pilot reads Universal Brief for context |

---

### Notifications & Communication

| FR# | Priority | Requirement |
|-----|----------|-------------|
| FR75 | MVP | System sends transactional emails (welcome, password reset, lead notification) |
| FR76 | MVP | Users can view in-app notifications |
| FR77 | MVP | Users can mark notifications as read |
| FR78 | MVP | Users can configure notification preferences (email on/off per type) |

---

### Data & Privacy

| FR# | Priority | Requirement |
|-----|----------|-------------|
| FR79 | MVP | Users can export all their data (Brief, leads, content) as JSON/CSV |
| FR80 | MVP | Users can request account deletion (soft delete with 30-day recovery) |
| FR81 | MVP | After 30 days, deleted account data is permanently purged |
| FR82 | MVP | All data access is scoped to user's organization (RLS enforced) |

---

### Subscription & Billing

| FR# | Priority | Requirement |
|-----|----------|-------------|
| FR83 | Future | [FUTURE v0.4] Users can view available subscription tiers |
| FR84 | Future | [FUTURE v0.4] Users can upgrade from Free to Presencia tier |
| FR85 | Future | [FUTURE v0.4] Subscription management handled via Stripe Customer Portal (or equivalent) |
| FR86 | Future | [FUTURE v0.4] Users can view their current subscription status and billing history |
| FR87 | Future | [FUTURE v0.4] Downgrade/cancellation takes effect at end of billing period |

**Note:** For MVP (v0.1-v0.2), Xentri operates in Client Zero mode. Billing/payment infrastructure is deferred to v0.4 when external customers are targeted.

---

**Total FRs: 82 in-scope** (v0.1-v0.2) + **5 [FUTURE]** = 87 total

---

## Non-Functional Requirements

### Performance

| NFR# | Requirement | Target | Rationale |
|------|-------------|--------|-----------|
| NFR1 | Initial shell load time | <2s on 3G | First impression; SMB users often on slower connections |
| NFR2 | Module/category switch time | <500ms | Must feel like changing tabs, not loading apps |
| NFR3 | Co-pilot response time | <3s for first token | Conversation must feel responsive |
| NFR4 | Website page load (published sites) | <3s on 3G | User's customers judge their professionalism |
| NFR5 | Event write latency | <100ms | Every action should feel instant |
| NFR6 | Brief-to-Website generation | <30s | Auto-population must not feel like waiting |

### Security

| NFR# | Requirement | Implementation |
|------|-------------|----------------|
| NFR7 | All data encrypted in transit | TLS 1.3 for all connections |
| NFR8 | All data encrypted at rest | Postgres encryption; encrypted backups |
| NFR9 | Multi-tenant isolation enforced | RLS policies on all tables; `org_id` in every query |
| NFR10 | Authentication tokens secure | HTTP-only cookies; short-lived JWTs; refresh token rotation |
| NFR11 | No sensitive data in logs | PII scrubbed from application logs |
| NFR12 | SQL injection prevention | Parameterized queries only; no string concatenation |
| NFR13 | XSS prevention | Content Security Policy; output encoding |

### Scalability

| NFR# | Requirement | Target |
|------|-------------|--------|
| NFR14 | Concurrent users per org | 10 (MVP); 100 (v0.4+) |
| NFR15 | Total organizations supported | 10,000 (MVP infrastructure) |
| NFR16 | Event Backbone throughput | 1,000 events/second |
| NFR17 | Website hosting capacity | 10,000 published sites |
| NFR18 | Stateless services | All backend services horizontally scalable |

### Reliability

| NFR# | Requirement | Target |
|------|-------------|--------|
| NFR19 | System availability | 99.5% uptime (MVP); 99.9% (v1.0) |
| NFR20 | Data durability | Zero data loss; point-in-time recovery |
| NFR21 | Backup frequency | Daily full backup; continuous WAL archiving |
| NFR22 | Recovery time objective (RTO) | <4 hours (MVP); <1 hour (v1.0) |
| NFR23 | Recovery point objective (RPO) | <1 hour (MVP); <5 minutes (v1.0) |

### Observability

| NFR# | Requirement | Implementation |
|------|-------------|----------------|
| NFR24 | Application logging | Structured JSON logs; correlation IDs |
| NFR25 | Error tracking | Exception capture with stack traces and context |
| NFR26 | Performance monitoring | Response time percentiles; slow query detection |
| NFR27 | Event Backbone monitoring | Event throughput; queue depth; processing lag |
| NFR28 | Alerting | PagerDuty/Slack alerts for critical issues |

### Maintainability

| NFR# | Requirement | Implementation |
|------|-------------|----------------|
| NFR29 | Code coverage | >70% unit test coverage for core modules |
| NFR30 | API documentation | OpenAPI spec for all backend endpoints |
| NFR31 | Schema versioning | Brief schema versioning with migration support |
| NFR32 | Feature flags | New features deployable behind flags |
| NFR33 | Zero-downtime deploys | Rolling deployments; database migrations backward-compatible |

**Total NFRs: 33**

---

## Reference Documents

### Product Brief
**Path:** `docs/product-brief-Xentri-2025-11-24.md`

The Product Brief serves as the strategic foundation for this PRD. Key sections referenced:
- Core Vision and Problem Statement
- Target Users and Personas
- MVP Scope (v0.1-v0.4 progressive release)
- Technical Preferences and Architecture Direction
- Pricing Model and Go-to-Market Strategy

### Research Documents
| Document | Path | Key Insights |
|----------|------|--------------|
| Market Research | `docs/bmm-research-market-2025-11-24.md` | "Business OS" category validation; Service Trades & Clinics as best wedge; pricing ladder competitive |
| Competitive Research | `docs/bmm-research-competitive-2025-11-24.md` | Gap analysis: competitors force choice between "pretty website" OR "functional logic"; none offer unified "calm view" |
| Customer Research | `docs/bmm-research-customer-2025-11-24.md` | Pain points around fragmentation, manual glue work, invisible uncertainty |
| Industry Research | `docs/bmm-research-industry-2025-11-24.md` | Market timing factors; AI expectation shift; post-COVID digital acceleration |
| Technical Research | `docs/bmm-research-technical-2025-11-24.md` | Stack direction and architecture patterns |

### Domain Brief
**Path:** N/A (General domain—no specialized domain brief required)

---

## Document Summary

| Metric | Count |
|--------|-------|
| **Functional Requirements (in-scope)** | 82 |
| **Functional Requirements [FUTURE]** | 5 |
| **Non-Functional Requirements** | 33 |
| **Total Requirements** | 120 |
| **MVP Scope** | v0.1-v0.2 |
| **Primary Persona** | Founders (building a business) |
| **Validation Model** | Client Zero (Xentri runs Xentri) |

### What This PRD Delivers

1. **Strategic Foundation** — Executive Summary, Core Value (orchestration), Validation Model (Client Zero)
2. **Technical Context** — Project Classification, Complexity Rationale, Primary Competitive Threat
3. **Quality Gates** — Readiness Criteria for v0.1, v0.2, and cross-cutting orchestration
4. **Risk Management** — Critical, High, and Accepted risks with mitigations
5. **Scope Definition** — MVP, Growth, and Vision features with orchestration framing
6. **SaaS Requirements** — Multi-tenancy, RBAC, subscription tiers, integrations, compliance
7. **UX Principles** — Light touch defining feel, not pixels
8. **Functional Requirements** — 87 capability-level requirements for v0.1-v0.2
9. **Non-Functional Requirements** — Performance, security, scalability, reliability, observability, maintainability

### Next Steps

| Phase | Workflow | Owner |
|-------|----------|-------|
| **Epic Index (v0.1-v0.2)** | `epic-1` Foundation & Access (MVP), `epic-2` Strategy & Clarity (MVP), `epic-3` Digital Presence (MVP), `epic-4` Lead Capture (MVP), `epic-5` Brand Intelligence (Growth), `epic-6` Data Privacy (MVP), `epic-7` Roles & Subscription (Future) | PM |
| **UX Design** | `create-ux-design` | UX Designer |
| **Architecture** | `create-architecture` | Architect |
| **Epic Breakdown** | `create-epics-and-stories` | PM |
| **Implementation Readiness** | `implementation-readiness` | Architect |
| **Sprint Planning** | `sprint-planning` | Scrum Master |

---

_This PRD was created for Xentri using the BMad Method PRD workflow._

_Author: Carlo | Date: 2025-11-25 | Version: 1.0_
