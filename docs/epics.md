# Xentri - Epic Breakdown

**Author:** Carlo
**Date:** 2025-11-25
**Project Level:** MVP (v0.1-v0.2)
**Target Scale:** Client Zero Validation

---

## Overview

This document provides the complete epic and story breakdown for Xentri, decomposing the requirements from the [PRD](./prd.md) into implementable stories.

**Living Document Notice:** This is the initial version. It will be updated after UX Design and Architecture workflows add interaction and technical details to stories.

### Epic Summary

- **Epic 1: Foundation & Access (MVP)** - Establish the secure, multi-tenant shell, event backbone, and complete user access flow (Auth, Signup, Org Creation).
- **Epic 2: Strategy & Clarity Engine (MVP)** - Implement the Strategy Co-pilot and Universal Brief generation.
- **Epic 3: Digital Presence Builder (MVP)** - Build the Website Builder and CMS populated by the Brief.
- **Epic 4: Lead Capture & Growth (MVP)** - Implement lead capture forms and management.
- **Epic 5: Brand Intelligence (Growth)** - Integrate the Brand Co-pilot for content assistance.
- **Epic 6: Data Privacy & Compliance (MVP)** - Implement data export, account deletion, and retention policies.
- **Epic 7: Roles, Subscription, and Conversion (Future)** - Multi-user roles, subscription lifecycle, and lead-to-client conversion.

---

## Functional Requirements Inventory

- **FR1:** Users can create an account with email/password
- **FR2:** Users can sign in with social authentication (Google, GitHub)
- **FR3:** Users can reset password via email verification
- **FR4:** Users can update their profile (name, email, avatar)
- **FR5:** Users can delete their account and all associated data
- **FR6:** System creates a new Organization when user signs up (user becomes Owner)
- **FR7:** [FUTURE v0.4] Owners can invite team members to their organization
- **FR8:** [FUTURE v0.4] Owners can assign roles (Admin, Member) to team members
- **FR9:** [FUTURE v0.4] Owners can revoke access for team members
- **FR10:** Users can create their Universal Brief via conversation with Strategy Co-pilot
- **FR11:** Users can create their Universal Brief via guided form (fallback)
- **FR12:** Users can view their complete Brief at any time
- **FR13:** Users can edit any section of their Brief
- **FR14:** Brief updates fire `brief_updated` event to Event Backbone
- **FR15:** Brief contains 7 sections: Identity, Audience, Offerings, Positioning, Operations, Goals, Proof
- **FR16:** Brief data is stored as structured JSON (BrandBrief, OpsModel, OfferCatalog schemas)
- **FR17:** Brief can be exported as PDF or Markdown
- **FR18:** Co-pilot conducts conversational interview to understand the business
- **FR19:** Co-pilot asks context-aware follow-up questions based on previous answers
- **FR20:** Co-pilot can handle short/unclear responses gracefully (re-ask or infer)
- **FR21:** Co-pilot generates Brief sections from conversation content
- **FR22:** User must confirm/edit Co-pilot-generated content before it's saved
- **FR23:** Co-pilot conversation can be paused and resumed
- **FR24:** Co-pilot logs all proposals as events (`ai_proposal_generated`)
- **FR25:** If Co-pilot fails or user opts out, system falls back to guided form
- **FR26:** Shell displays stable header with user menu and notifications
- **FR27:** Shell displays collapsible sidebar with 7 category icons
- **FR28:** Only subscribed/active categories are interactable in sidebar
- **FR29:** Clicking a category expands its subcategories; other categories collapse
- **FR30:** Switching between categories does not trigger full page reload
- **FR31:** Shell supports light and dark mode; preference persisted per user
- **FR32:** Shell is responsive; sidebar collapses to icons on mobile
- **FR33:** All significant actions write to `system_events` table
- **FR34:** Events include: `org_id`, `user_id`, `event_type`, `payload`, `timestamp`
- **FR35:** Events are immutable (append-only log)
- **FR36:** Events can be queried by org, type, and time range
- **FR37:** v0.1 event types: `brief_created`, `brief_updated`, `user_signup`, `user_login`
- **FR38:** v0.2 event types: `website_published`, `page_updated`, `content_published`, `lead_created`
- **FR39:** [FUTURE] Events power cross-module projections (e.g., `open_loops` view)
- **FR40:** Users can create a website with drag-and-drop page builder
- **FR41:** Website Builder offers 3-4 pre-built templates for target segments (founders, trades, clinics)
- **FR42:** Website content auto-populates from Universal Brief (business name, services, tagline)
- **FR43:** Users can override any auto-populated content
- **FR44:** Users can add/remove/reorder pages
- **FR45:** Users can add/remove/configure page sections (hero, services, about, contact, etc.)
- **FR46:** Website is mobile-responsive by default
- **FR47:** Users can preview website before publishing
- **FR48:** Users can publish website to Xentri subdomain (orgname.xentri.app)
- **FR49:** Users can connect custom domain to their website
- **FR50:** Custom domains receive automatic SSL certificate
- **FR51:** Website publish fires `website_published` event
- **FR52:** Page updates fire `page_updated` event
- **FR53:** Users can create, edit, and delete blog posts
- **FR54:** Users can create, edit, and delete service pages
- **FR55:** Users can upload and manage images (photo gallery / portfolio)
- **FR56:** Content supports rich text editing (headings, lists, links, images)
- **FR57:** Content can be tagged and categorized
- **FR58:** Content publish fires `content_published` event
- **FR59:** Published content appears on user's website (blog section, service pages)
- **FR60:** Users can add a contact form to their website
- **FR61:** Contact form fields are customizable (name, email, phone, message, custom fields)
- **FR62:** Form submissions create a Lead record in the system
- **FR63:** Lead creation fires `lead_created` event
- **FR64:** Users receive notification when new lead is captured (email + in-app)
- **FR65:** Users can view list of all captured leads
- **FR66:** Users can view individual lead details (submitted info, timestamp, source page)
- **FR67:** Users can mark leads as contacted/archived
- **FR68:** [FUTURE v0.3] Leads can be converted to Clients
- **FR69:** Brand Co-pilot is available when user has Brand & Marketing modules
- **FR70:** Brand Co-pilot can suggest website copy based on Brief
- **FR71:** Brand Co-pilot can review and improve user-written content
- **FR72:** Brand Co-pilot can suggest SEO improvements for pages
- **FR73:** All Brand Co-pilot suggestions require user confirmation before applying
- **FR74:** Brand Co-pilot reads Universal Brief for context
- **FR75:** System sends transactional emails (welcome, password reset, lead notification)
- **FR76:** Users can view in-app notifications
- **FR77:** Users can mark notifications as read
- **FR78:** Users can configure notification preferences (email on/off per type)
- **FR79:** Users can export all their data (Brief, leads, content) as JSON/CSV
- **FR80:** Users can request account deletion (soft delete with 30-day recovery)
- **FR81:** After 30 days, deleted account data is permanently purged
- **FR82:** All data access is scoped to user's organization (RLS enforced)
- **FR83:** [FUTURE v0.4] Users can view available subscription tiers
- **FR84:** [FUTURE v0.4] Users can upgrade from Free to Presencia tier
- **FR85:** [FUTURE v0.4] Subscription management handled via Stripe Customer Portal (or equivalent)
- **FR86:** [FUTURE v0.4] Users can view their current subscription status and billing history
- **FR87:** [FUTURE v0.4] Downgrade/cancellation takes effect at end of billing period

---

## FR Coverage Map

- **Epic 1: Foundation & Access**
  - Covers: FR1-4, FR6, FR26-37, FR75-78, FR82
  - *Note: Includes Auth, Signup, Org Creation, Shell, Event Backbone, RLS, and Notifications infrastructure.*
- **Epic 2: Strategy & Clarity Engine**
  - Covers: FR10-25
- **Epic 3: Digital Presence Builder**
  - Covers: FR40-59, FR38
- **Epic 4: Lead Capture & Growth**
  - Covers: FR60-67
- **Epic 5: Brand Intelligence**
  - Covers: FR69-74
- **Epic 6: Data Privacy & Compliance**
  - Covers: FR5, FR79-81
- **Epic 7: Roles, Subscription, Conversion (Future)**
  - Covers: FR7-9 (roles), FR68 (lead→client), FR83-87 (subscription lifecycle)
- **Deferred / Future Scope**
  - FR39 (Open Loops) remains deferred; added as future acceptance criteria in Epic 1.2 extension

---

## Epic 1: Foundation & Access (MVP)

**Goal:** Establish the secure, multi-tenant shell, event backbone, and complete user access flow.  
**Value:** Users can securely sign up, get their own isolated workspace, and navigate the application shell. The system reliably logs all core events.  
**Sequence:** 1.1 → 1.2 → 1.3 → 1.4 → 1.5 → 1.6 → 1.7  
**Differentiator hook:** Event-first, multi-tenant foundation so orchestration is trustworthy.  
**Critical path:** 1.1 → 1.2 → 1.3 → 1.4 → 1.5 → 1.6; 1.7 runs in parallel after 1.1.  
**Risks/Unknowns:** Infra story breadth (1.1) could hide blockers; ensure minimal viable slice (dev env + RLS) before extras.

### Story 1.1: Project Initialization & Infrastructure
**As a** Developer,
**I want** the core repository and build system set up,
**So that** we have a stable foundation for development.

**Acceptance Criteria:**
1. **Given** a fresh clone, **When** `npm install && npm run dev` runs, **Then** the Astro shell loads locally (MVP baseline).
2. **Given** the project structure, **When** inspected, **Then** it follows the monorepo layout (apps/shell, packages/ui, services/core-api).
3. **Given** the database, **When** initialized, **Then** it runs a local Postgres instance via Docker with RLS enabled.
4. **Given** CI/CD, **When** code is pushed, **Then** lint/test/build run headless.
5. **Given** the smoke script, **When** executed, **Then** it seeds org A/B and confirms cross-org read is blocked while shell still loads.

**Technical Notes:**
- Stack: Astro (Shell), React (Islands), Node.js (Backend), Postgres (DB).
- Setup Turborepo for workspace management; include .env.example and bootstrap script.
- Traceability: FR26-FR32 foundations, supports FR33-FR36 bootstrap.
- Dependencies: none (entry point).
- Edge cases: Apple Silicon/local Docker quirks; ensure docs for env prerequisites.

### Story 1.2: Event Backbone & Database Schema
**As a** System,
**I want** a centralized `system_events` table and RLS policies,
**So that** we have an immutable audit trail and secure multi-tenancy.

**Acceptance Criteria:**
1. `system_events` table exists with `org_id`, `event_type`, `payload`, `timestamp` (append-only).
2. Queries under an authenticated role enforce RLS automatically; cross-org reads return 0 rows or RLS error.
3. Events are immutable (no updates/deletes) and include `user_id` when present.
4. Event types for v0.1/v0.2 registered: `brief_created`, `brief_updated`, `user_signup`, `user_login`, `website_published`, `page_updated`, `content_published`, `lead_created`.
5. Future hook recorded for `open_loops` projection (FR39) without implementing logic.
6. Traceability: FR33, FR34, FR35, FR36, FR37, FR38, FR82.

**Technical Notes:**
- Implement Postgres RLS policies and migrations.
- Create shared `ts-schema` package for event types and payload validation (research/NFR: performance + auditability).
- Dependencies: after 1.1 (infra) for database availability.
- Edge cases: Backfill guard to prevent legacy rows without `org_id`; migration safety.

### Story 1.3: User Authentication & Signup
**As a** Founder,
**I want** to sign up with email/password or social auth,
**So that** I can securely access the platform.

**Acceptance Criteria:**
1. Email/password login redirects to shell on success.
2. Google OAuth login succeeds and redirects to shell.
3. `user_signup` and `user_login` events log with `org_id` + `user_id`.
4. Sessions use HTTP-only cookies; refresh rotation in place.
5. Traceability: FR1, FR2, FR37.

**Technical Notes:**
- Use Supabase Auth or similar provider; align with API/auth contract in PRD.
- Dependencies: after 1.1 (infra) and 1.2 (events/RLS).
- Edge cases: OAuth callback state; refresh token rotation failures; lockout handling.

### Story 1.4: Organization Creation & Provisioning
**As a** New User,
**I want** an Organization created for me automatically upon signup,
**So that** I have a private workspace for my business data.

**Acceptance Criteria:**
1. On new user signup, an Organization record is automatically created.
2. New user is assigned as "Owner" of that org.
3. `org_created` event is logged (extend v0.1 taxonomy).
4. Traceability: FR6, FR37 (partial).

**Technical Notes:**
- Trigger logic: On `auth.users` insert -> create `public.organizations` -> create `public.members`.
- Dependencies: after 1.3 (auth) and 1.2 (events).
- Edge cases: Retry/idempotency on org creation; roll back member insert on failure.

### Story 1.5: Application Shell & Navigation
**As a** User,
**I want** a stable sidebar and header,
**So that** I can navigate between Strategy, Brand, and other categories.

**Acceptance Criteria:**
1. Shell shows 7 category icons in the sidebar.
2. Sidebar expands active category and collapses others on click.
3. Navigation switches panels without full page reload; state preserved.
4. User menu allows Light/Dark toggle persisted per user.
5. Traceability: FR26, FR27, FR28, FR29, FR30, FR31, FR32.

**Technical Notes:**
- Astro View Transitions for smooth navigation.
- Sidebar state management (expanded/collapsed) persisted in local storage.
- Dependencies: after 1.1 (infra) and 1.3 (auth) for signed-in shell.
- Edge cases: Mobile viewport menu behavior; persist collapse state per user.

### Story 1.6: Thin Vertical Slice (Signup → Brief → Event)
**As a** User,
**I want** a working end-to-end slice from signup to Brief creation,
**So that** I see the product delivering value, not just infrastructure.

**Acceptance Criteria:**
1. From a fresh environment, a user can sign up, land in shell, open Strategy, and create a Brief draft (FR1, FR6, FR10, FR11).
2. `brief_created` event is written and visible via org-scoped event query (FR33-FR37).
3. Shell shows Brief summary tile post-creation (ties FR26-FR32 to FR10-17).
4. Slice runs in dev and CI environment; uses production-like RLS.
5. Traceability: Integrates FR1, FR6, FR10-17, FR33-37.
6. Dependencies: after 1.3 (auth), 1.2 (events), 1.5 (shell).
- Edge cases: Event write failures should surface visibly; fallback to form if chat fails.

### Story 1.7: DevOps, Observability, and Test Readiness
**As a** Developer,
**I want** baseline pipelines, monitoring hooks, and test harness,
**So that** the MVP can ship safely and be observed.

**Acceptance Criteria:**
1. CI runs lint + unit tests + type checks on PRs; fails gate merges.
2. Logging uses structured JSON with correlation IDs; error tracking hooked (NFR24-NFR28).
3. Minimal load test or smoke test script for shell/Brief slice; artifacts tracked.
4. Deployment pipeline supports zero-downtime deploys (feature flags allowed); rollback plan documented.
5. Traceability: NFR24-NFR33; supports enterprise readiness.
6. Dependencies: after 1.1 (infra) and 1.2 (events) to emit logs/events.
- Edge cases: Log PII scrubbing; ensure secrets not logged in CI.

---

## Epic 2: Strategy & Clarity Engine (MVP)

**Goal:** Implement the Strategy Co-pilot and Universal Brief generation.  
**Value:** Users can articulate their business vision via conversation and generate a structured Universal Brief that powers the rest of the system.  
**Sequence:** 2.1 → 2.2 → 2.3 → 2.4 → 2.5  
**Differentiator hook:** Conversation-first Brief that powers downstream orchestration.  
**Critical path:** 2.1 → 2.2 → 2.3 → 2.4; 2.5 optional export after.  
**Research/NFR hooks:** Pull context from product brief/research docs; respect NFR3 (latency) and NFR11 (no sensitive data in logs).

### Story 2.1: Universal Brief Schema & Storage
**As a** System,
**I want** a structured, versioned JSON schema for the Universal Brief,
**So that** we can store business DNA securely and validate data quality while allowing drafts.

**Acceptance Criteria:**
1. `briefs` table exists with `schema_version` and `org_id`.
2. Creating a brief logs `brief_created`.
3. Updating a brief logs `brief_updated`.
4. Schema validation enforces structure; allows partial data when section status is `draft`.
5. Each section tracks `completion_status` (draft vs ready).
6. Schema includes 7 sections matching product brief research (Identity, Audience, Offerings, Positioning, Operations, Goals, Proof).
7. Traceability: FR14, FR15, FR16.

**Technical Notes:**
- Define TypeScript interfaces for `BrandBrief`, `OpsModel`, `OfferCatalog`.
- Use Postgres JSONB column.
- Validation logic: Zod schema with "loose" mode for drafts.
- Dependencies: after 1.2 (events) and 1.3 (auth/RLS).
- Edge cases: Partial saves allowed; enforce section-level status to avoid blocking flow.

### Story 2.2: Strategy Co-pilot Interface (Chat UI)
**As a** Founder,
**I want** a secure conversational interface to talk to the Strategy Co-pilot,
**So that** I can explain my business in natural language without fear of data leaks.

**Acceptance Criteria:**
1. Strategy module shows chat interface (not a form) on access.
2. Conversations persist to `conversations` table with org-scoped RLS.
3. Clearing history deletes transcripts but retains Brief data.
4. Sending a message shows typing indicator and returns a response.
5. Traceability: FR10, FR23, FR26 (Strategy category).

**Technical Notes:**
- Implement streaming responses for low latency (NFR3).
- Persist raw transcript separate from extracted facts/brief data.
- Dependencies: after 2.1 (schema), 1.3 (auth), 1.2 (events/RLS).
- Edge cases: Conversation truncation; profanity/safety filters; handle session timeouts gracefully.

### Story 2.3: Co-pilot Intelligence & Context Management
**As a** User,
**I want** the Co-pilot to ask relevant follow-up questions and propose content,
**So that** we can build a complete picture of my business efficiently.

**Acceptance Criteria:**
1. Short answers trigger probing follow-ups (FR19, FR20).
2. Each suggestion logs `ai_proposal_generated`.
3. Accepting a proposal logs `brief_updated` with `source: 'ai_proposal'`.
4. Traceability: FR18, FR19, FR20, FR24, FR22.

**Technical Notes:**
- Use LLM with system prompt focused on "Investigative Product Strategist".
- Maintain context window of recent turns + extracted facts.
- Dependencies: after 2.2 (chat) and 1.2 (events).
- Edge cases: Conflicting user input vs prior facts—log suggestion but require user confirm.

### Story 2.4: Brief Generation & Editing
**As a** User,
**I want** to see and edit the Brief sections generated from our conversation,
**So that** I ensure the "DNA" of my business is accurate.

**Acceptance Criteria:**
1. Co-pilot proposals can be reviewed and edited (FR22).
2. Manual edits save and fire `brief_updated` with `source: 'manual'`.
3. Manual guided form is available if Co-pilot fails or user opts out (FR11, FR25).
4. Traceability: FR11, FR12, FR13, FR21, FR22, FR25.

**Technical Notes:**
- UI: Split view (Chat on left/right, Live Brief on the other side) or "Review Proposal" modal.
- Dependencies: after 2.3 (intelligence) and 2.2 (chat).
- Edge cases: Merge conflicts between manual edits and proposals; clearly show sources.

### Story 2.5: Brief Export
**As a** User,
**I want** to export my Universal Brief,
**So that** I can share it or keep a local copy.

**Acceptance Criteria:**
1. Completed Brief can be exported as PDF or Markdown.
2. Traceability: FR17.

**Technical Notes:**
- Use a library like `react-pdf` or server-side generation.
- Dependencies: after 2.4 (brief editing).
- Edge cases: Redact sensitive fields in exports if needed; maintain schema version header.

---

## Epic 3: Digital Presence Builder (MVP)

**Goal:** Build the Website Builder and CMS populated by the Brief.  
**Value:** Users can instantly generate a professional website from their Brief and manage content without technical skills.  
**Sequence:** 3.1 → 3.2 → 3.3 → 3.4  
**Differentiator hook:** Brief-powered default content and visible publish events.  
**Critical path:** 3.1 → 3.2 → 3.3 → 3.4.  
**Research/NFR hooks:** Ensure performance targets (NFR4) and align content auto-fill with Brief structure; apply security (CSP/XSS) for page rendering.

### Story 3.1: Website Builder Engine & Templates
**As a** User,
**I want** to choose a section-based template and customize my site layout,
**So that** I have a professional presence without needing design skills.

**Acceptance Criteria:**
1. Website Builder offers 3-4 templates (Founder, Trade, Clinic).
2. Editor allows reordering predefined sections (Hero, Services, About, Contact) but no freeform layout.
3. Editor supports responsive preview (Mobile/Desktop).
4. Scope constraint: Custom CSS/component marketplace/complex animations are out of scope for v0.2.
5. Traceability: FR40, FR41, FR44, FR45, FR46, FR47.

**Technical Notes:**
- Evaluate GrapesJS or Craft.js (constrained mode).
- Templates defined as JSON section lists.
- Dependencies: after 2.x (Brief exists) and 1.5 (shell).
- Edge cases: Template switching should preserve user overrides or warn before reset.

### Story 3.2: Brief-to-Website Auto-population (The Magic)
**As a** User,
**I want** my website to automatically pull content from my Universal Brief,
**So that** I don't have to re-type my business name, services, or tagline.

**Acceptance Criteria:**
1. Auto-population validates `schema_version` and `completion_status` before pulling data.
2. Offerings section populates Services automatically.
3. Overrides save to `website_content` without mutating the Brief.
4. "Reset to Brief" restores Brief content.
5. Initial page render meets performance target (<3s on 3G) with Brief defaults applied (NFR4).
6. Traceability: FR42, FR43.

**Technical Notes:**
- Orchestration: Website service reads `briefs` table via internal API.
- Data flow: Brief -> Default Content -> User Overrides.
- Dependencies: after 3.1 (builder) and 2.4 (brief data).
- Edge cases: Missing Brief fields should gracefully fallback; avoid blank hero.

### Story 3.3: CMS Core (Service Pages & Portfolio)
**As a** User,
**I want** to manage my blog posts, service pages, and portfolio items,
**So that** I can showcase my work and attract customers.

**Acceptance Criteria:**
1. Creating an item requires `title`, `slug`, `status` (draft/published), `published_at`, `hero_image`, `tags`.
2. Draft save logs `content_updated`.
3. Publish logs `content_published` and surfaces on site.
4. Traceability: FR53, FR54, FR55, FR56, FR57, FR58, FR59.

**Technical Notes:**
- Store content in `cms_items` table.
- Rich text: Use Tiptap or similar headless editor.
- Dependencies: after 3.1 (builder shell) and 1.2 (events).
- Edge cases: Media upload failures; draft vs published visibility.

### Story 3.4: Custom Domain & Publishing
**As a** User,
**I want** to publish my site to a custom domain or subdomain,
**So that** customers can find me online.

**Acceptance Criteria:**
1. Publishing makes the site live at `[orgname].xentri.app`.
2. Publish fires `website_published` with `brief_schema_version`, `brief_updated_at`, `content_source_map`.
3. Custom domain flow returns DNS instructions (CNAME/A).
4. DNS verification triggers automatic SSL provisioning.
5. Traceability: FR48, FR49, FR50, FR51, FR52.

**Technical Notes:**
- Architecture: Dynamic rendering with tenant routing (or ISR) for instant updates.
- Use Caddy or Vercel Platforms approach for domain management.
- Dependencies: after 3.2 (content wiring) and 3.3 (CMS), infra DNS/SSL available.
- Edge cases: DNS verification retries; SSL issuance failure paths; rollback on failed publish.

---

## Epic 4: Lead Capture & Growth (MVP)

**Goal:** Implement lead capture forms and management.  
**Value:** Users can capture demand from their website and manage incoming leads in a central list.  
**Sequence:** 4.1 → 4.2 → 4.3  
**Differentiator hook:** Events-first, privacy-safe lead intake with visible notifications.  
**Critical path:** 4.1 → 4.2 → 4.3.  
**Research/NFR hooks:** Anti-spam, PII minimization (NFR11), event latency (NFR5), and email delivery reliability.

### Story 4.1: Lead Capture Form Builder & Security
**As a** User,
**I want** to add a secure contact form to my website,
**So that** visitors can contact me without me receiving a flood of spam.

**Acceptance Criteria:**
1. Contact section allows configuring form fields.
2. Submissions include anti-spam (honeypot, rate limiting per IP, optional CAPTCHA).
3. Server validates field types/lengths and enforces CORS.
4. `org_id` resolved securely from `website_id` or domain (never client-supplied).
5. Submission payload stored without PII leakage in events (aligns NFR11).
6. Traceability: FR60, FR61, FR62.

**Technical Notes:**
- Form schema stored in `website_content`.
- Submission endpoint must handle CORS and validation.
- Dependencies: after 3.1 (builder) and 1.2 (events).
- Edge cases: Bot floods; enforce rate limiting; ensure payload scrubbed before logging.

### Story 4.2: Lead Management & List View
**As a** User,
**I want** to view and manage my incoming leads,
**So that** I don't lose track of potential customers.

**Acceptance Criteria:**
1. Leads list shows all leads sorted by newest first.
2. `leads` table includes `id`, `org_id`, `source_page_url`, `referrer`, `created_at`, `status`, `payload` (JSONB).
3. Lead status transitions: New ↔ Contacted ↔ Archived (with unarchive).
4. Status changes log `lead_status_changed`.
5. Lead list respects org scoping and hides message body from list view for privacy.
6. Traceability: FR65, FR66, FR67.

**Technical Notes:**
- Optional: Simple dedupe logic (flag if same email within 24h).
- Pagination for list view.
- Dependencies: after 4.1 (intake) and 1.2 (events).
- Edge cases: Duplicate leads; status transitions idempotent.

### Story 4.3: Lead Notifications & Events
**As a** User,
**I want** to be notified immediately when a new lead arrives,
**So that** I can respond quickly.

**Acceptance Criteria:**
1. New lead submission logs `lead_created` (payload excludes raw message body).
2. `lead_created` triggers an email notification to Org Owner (idempotent).
3. Notification settings allow toggling email on/off (FR78).
4. Email content includes link to lead detail but not full message body.
5. Traceability: FR63, FR64, FR75, FR78.

**Technical Notes:**
- Use transactional email service (Resend/Postmark).
- Ensure idempotency key based on `lead_id`.
- Dependencies: after 4.1 (intake) and 4.2 (lead records) and 1.2 (events).
- Edge cases: Email failures retried idempotently; notification preferences honored.

---

## Epic 5: Brand Intelligence (Growth)

**Goal:** Integrate the Brand Co-pilot for content assistance.  
**Value:** Users get AI-powered help with writing website copy and improving their brand voice, ensuring consistency with their Brief.  
**Sequence:** 5.1 → 5.2 → 5.3  
**Differentiator hook:** AI suggestions bound to the Brief, never generic.  
**Critical path:** 5.1 → 5.2 → 5.3.  
**Research/NFR hooks:** Model prompts stay within org context; enforce zero-retention; measure response time (NFR3).

### Story 5.1: Brand Co-pilot Integration & Context
**As a** User,
**I want** the Brand Co-pilot to understand my Universal Brief,
**So that** its suggestions sound like my business, not a generic AI.

**Acceptance Criteria:**
1. Brand Co-pilot retrieves the active Universal Brief (Identity, Positioning, Audience).
2. Context limited to Brief + current page/field + optional CMS item (no cross-org retrieval).
3. System prompt forbids training on user content.
4. Traceability: FR69, FR74.

**Technical Notes:**
- Shared context retrieval service.
- Zero-retention policy on model provider side (if applicable).
- Dependencies: after 2.4 (brief), 3.3 (content), 1.2 (events/RLS).

### Story 5.2: Content Suggestions (Website Copy)
**As a** User,
**I want** the Co-pilot to suggest copy for my website sections,
**So that** I don't get stuck with writer's block.

**Acceptance Criteria:**
1. Clicking "Suggest Copy" generates 3 options based on the Brief.
2. Each suggestion logs `ai_proposal_generated` (payload: `model_id`, `prompt_version`, `inputs_hash`).
3. Applying a suggestion populates the field and logs `ai_proposal_applied`.
4. Dismissing logs `ai_proposal_rejected`.
5. Safety gate: all AI writes require explicit user confirmation; no auto-publishing.
6. Traceability: FR70, FR73.

**Technical Notes:**
- UI: "Magic Wand" icon on text fields.
- Dependencies: after 5.1 (context) and 3.1 (builder UI).

### Story 5.3: Content Review & SEO Improvements
**As a** User,
**I want** the Co-pilot to review my drafts and suggest improvements,
**So that** my content is polished and SEO-friendly.

**Acceptance Criteria:**
1. Clicking "Review" on a draft triggers analysis for clarity and SEO.
2. Analysis returns actionable suggestions (e.g., meta description, concise copy).
3. Traceability: FR71, FR72.

**Technical Notes:**
- Use LLM for text analysis and SEO heuristics.
- Dependencies: after 5.1 (context) and 3.3 (content).

---

## Epic 6: Data Privacy & Compliance (MVP)

**Goal:** Implement data export, account deletion, and retention policies.  
**Value:** Users have full control over their data, ensuring trust and compliance with privacy standards.  
**Sequence:** 6.1 → 6.2  
**Differentiator hook:** Visible data controls reinforce trust for orchestration model.  
**Critical path:** 6.1 → 6.2.  
**Research/NFR hooks:** Privacy (NFR11), durability/recovery (NFR20-23).

### Story 6.1: Data Export (Takeout)
**As a** User,
**I want** to export all my data,
**So that** I am not locked into the platform.

**Acceptance Criteria:**
1. Export Data generates a downloadable ZIP package.
2. Package includes: Universal Brief, Leads, Website Content, CMS Items, and a redacted Event Timeline.
3. Export file includes version header `xentri-export-v1`.
4. Traceability: FR79.

**Technical Notes:**
- Async job for large exports.
- Event timeline excludes internal system logs; focus on user-visible actions.
- Dependencies: after data domains exist (epics 2-4) and 1.2 (events).
- Edge cases: Large media; chunked downloads; ensure redaction consistency.

### Story 6.2: Account Deletion & Recovery
**As a** User,
**I want** to delete my account with a safety net,
**So that** I can leave the platform securely but recover if it was a mistake.

**Acceptance Criteria:**
1. Deletion request soft-deletes account (inactive, not visible).
2. Logging in within 30 days restores the account.
3. After 30 days, purge job permanently deletes Org tables, media, auth identities, revokes domains/SSL.
4. Purge job tombstones PII in Event Backbone (`user_id` -> `deleted_user`).
5. Traceability: FR5, FR80, FR81.

**Technical Notes:**
- `deleted_at` column on `organizations` and `users`.
- Cron job for permanent purge with verification step.
- Dependencies: after 6.1 (export) and 1.2 (events/RLS).
- Edge cases: Domain/SSL teardown idempotency; ensure backups pruned of org data.

---

## Epic 7: Roles, Subscription, and Conversion (Future)

**Goal:** Prepare for multi-user access, subscription lifecycle, and lead-to-client conversion for post-MVP releases.  
**Value:** Ensures future growth work is grounded in requirements without blocking MVP.
**Differentiator hook:** Future growth features planned without compromising current orchestration or RLS safety.

### Story 7.1: Roles and Permission Model
**As a** PM/Architect,  
**I want** a scoped plan for roles and permissions,  
**So that** future multi-user support aligns with RBAC and org isolation.

**Acceptance Criteria:**
1. Document category-scoped roles (Owner/Admin/Member) with sample org policies.
2. Identify DB tables needing role context (memberships, invites) and RLS adjustments.
3. Define event types for role changes (`member_invited`, `role_changed`).
4. Traceability: FR7, FR8, FR9.

**Technical Notes:**
- Dependencies: after Epic 1 (RLS/events) for modeling; executed in Future/Growth phase.

### Story 7.2: Subscription Lifecycle (Future v0.4)
**As a** Product team,  
**I want** subscription flows outlined,  
**So that** billing can be added without reworking core flows.

**Acceptance Criteria:**
1. Define tier matrix (Free, Presencia, Light Ops, Business in Motion) with module toggles.
2. Map API flow: upgrade/downgrade/cancel via Stripe Customer Portal (or equivalent).
3. Event types drafted: `subscription_upgraded`, `subscription_downgraded`, `subscription_canceled`.
4. Traceability: FR83, FR84, FR85, FR86, FR87.

**Technical Notes:**
- Dependencies: after payment integration exists (future v0.4); keep in design backlog until then.

### Story 7.3: Lead to Client Conversion (Future v0.3)
**As a** Sales user,  
**I want** to convert a lead into a client record,  
**So that** sales pipeline can start without re-entry.

**Acceptance Criteria:**
1. Define minimal data carried from lead → client (contact info, source, tags).
2. Event type drafted: `lead_converted` with `lead_id` and `client_id`.
3. Traceability: FR68.

**Technical Notes:**
- Dependencies: after Epics 3-4 (leads, website) and future CRM data model.

### Sequence
7.1 → 7.2 → 7.3 (executed when entering Growth/Business in Motion tiers)
