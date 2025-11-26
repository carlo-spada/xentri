# Xentri - Epic Breakdown

**Author:** Carlo
**Date:** 2025-11-25
**Project Level:** MVP (v0.1-v0.2)
**Target Scale:** Client Zero Validation

---

## Overview

This document provides the complete epic and story breakdown for Xentri, decomposing the requirements from the [PRD](./PRD.md) into implementable stories.

**Living Document Notice:** This is the initial version. It will be updated after UX Design and Architecture workflows add interaction and technical details to stories.

### Epic Summary

- **Epic 1: Foundation & Access** - Establish the secure, multi-tenant shell, event backbone, and complete user access flow (Auth, Signup, Org Creation).
- **Epic 2: Strategy & Clarity Engine** - Implement the Strategy Co-pilot and Universal Brief generation.
- **Epic 3: Digital Presence Builder** - Build the Website Builder and CMS populated by the Brief.
- **Epic 4: Lead Capture & Growth** - Implement lead capture forms and management.
- **Epic 5: Brand Intelligence** - Integrate the Brand Co-pilot for content assistance.
- **Epic 6: Data Privacy & Compliance** - Implement data export, account deletion, and retention policies.

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
- **Deferred / Future Scope**
  - FR7-9 (Team/Roles), FR39 (Open Loops), FR68 (Lead->Client), FR83-87 (Subscription)

---

## Epic 1: Foundation & Access

**Goal:** Establish the secure, multi-tenant shell, event backbone, and complete user access flow.
**Value:** Users can securely sign up, get their own isolated workspace, and navigate the application shell. The system reliably logs all core events.

### Story 1.1: Project Initialization & Infrastructure
**As a** Developer,
**I want** the core repository and build system set up,
**So that** we have a stable foundation for development.

**Acceptance Criteria:**
- **Given** a fresh clone, **When** `npm install && npm run dev` is run, **Then** the Astro shell loads locally.
- **Given** the project structure, **When** inspected, **Then** it follows the monorepo structure (apps/shell, packages/ui, services/core-api).
- **Given** the database, **When** initialized, **Then** it runs a local Postgres instance via Docker.
- **Given** the CI/CD pipeline, **When** code is pushed, **Then** it builds and runs basic linting.

**Technical Notes:**
- Stack: Astro (Shell), React (Islands), Node.js (Backend), Postgres (DB).
- Setup Turborepo for workspace management.

### Story 1.2: Event Backbone & Database Schema
**As a** System,
**I want** a centralized `system_events` table and RLS policies,
**So that** we have an immutable audit trail and secure multi-tenancy.

**Acceptance Criteria:**
- **Given** the database schema, **When** applied, **Then** `system_events` table exists with `org_id`, `event_type`, `payload`.
- **Given** a request running under an authenticated DB role, **When** a query is executed, **Then** RLS enforces `org_id` scoping automatically.
- **Given** User A, **When** attempting to read User B's org rows, **Then** the query returns 0 rows or an RLS error (cross-org queries are impossible).
- **Given** an event, **When** written, **Then** it is immutable (cannot be updated/deleted).
- **Traceability:** Covers FR33, FR34, FR35, FR36, FR82.

**Technical Notes:**
- Implement Postgres RLS policies.
- Create shared `ts-schema` package for event types.

### Story 1.3: User Authentication & Signup
**As a** Founder,
**I want** to sign up with email/password or social auth,
**So that** I can securely access the platform.

**Acceptance Criteria:**
- **Given** the login page, **When** I enter valid email/password, **Then** I am authenticated and redirected to the shell.
- **Given** the signup page, **When** I choose "Sign in with Google", **Then** I am authenticated via OAuth.
- **Given** a successful signup, **When** completed, **Then** a `user_signup` event is logged to the Event Backbone.
- **Given** a successful login, **When** completed, **Then** a `user_login` event is logged.
- **Traceability:** Covers FR1, FR2, FR37.

**Technical Notes:**
- Use Supabase Auth or similar provider.
- Ensure auth tokens are secure (HTTP-only cookies preferred).

### Story 1.4: Organization Creation & Provisioning
**As a** New User,
**I want** an Organization created for me automatically upon signup,
**So that** I have a private workspace for my business data.

**Acceptance Criteria:**
- **Given** a new user signup, **When** the account is created, **Then** a new Organization record is automatically created.
- **Given** the new Organization, **When** created, **Then** the user is assigned as "Owner".
- **Given** the provisioning process, **When** complete, **Then** an `org_created` event is logged (adding to v0.1 event taxonomy).
- **Traceability:** Covers FR6, FR37 (partial).

**Technical Notes:**
- Trigger logic: On `auth.users` insert -> create `public.organizations` -> create `public.members`.

### Story 1.5: Application Shell & Navigation
**As a** User,
**I want** a stable sidebar and header,
**So that** I can navigate between Strategy, Brand, and other categories.

**Acceptance Criteria:**
- **Given** the shell, **When** loaded, **Then** I see the 7 category icons in the sidebar.
- **Given** the sidebar, **When** I click "Management & Strategy", **Then** it expands to show sub-items.
- **Given** the navigation, **When** I switch categories, **Then** the page content updates without a full browser reload (SPA feel).
- **Given** the user menu, **When** clicked, **Then** I can toggle Light/Dark mode (persisted).
- **Traceability:** Covers FR26, FR27, FR28, FR29, FR30, FR31, FR32.

**Technical Notes:**
- Astro View Transitions for smooth navigation.
- Sidebar state management (expanded/collapsed) persisted in local storage.

---

## Epic 2: Strategy & Clarity Engine

**Goal:** Implement the Strategy Co-pilot and Universal Brief generation.
**Value:** Users can articulate their business vision via conversation and generate a structured Universal Brief that powers the rest of the system.

### Story 2.1: Universal Brief Schema & Storage
**As a** System,
**I want** a structured, versioned JSON schema for the Universal Brief,
**So that** we can store business DNA securely and validate data quality while allowing drafts.

**Acceptance Criteria:**
- **Given** the database, **When** schema is applied, **Then** a `briefs` table exists with `schema_version` and `org_id`.
- **Given** a new brief, **When** first saved, **Then** a `brief_created` event is logged.
- **Given** a brief update, **When** saved, **Then** a `brief_updated` event is logged.
- **Given** the JSON schema, **When** validated, **Then** it enforces structure but allows partial data if section status is `draft`.
- **Given** a section, **When** saved, **Then** it tracks `completion_status` (draft vs ready).
- **Traceability:** Covers FR14, FR15, FR16.

**Technical Notes:**
- Define TypeScript interfaces for `BrandBrief`, `OpsModel`, `OfferCatalog`.
- Use Postgres JSONB column.
- Validation logic: Zod schema with "loose" mode for drafts.

### Story 2.2: Strategy Co-pilot Interface (Chat UI)
**As a** Founder,
**I want** a secure conversational interface to talk to the Strategy Co-pilot,
**So that** I can explain my business in natural language without fear of data leaks.

**Acceptance Criteria:**
- **Given** the Strategy module, **When** accessed, **Then** I see a chat interface (not a form).
- **Given** a conversation, **When** persisted, **Then** rows are stored in `conversations` table, strictly scoped by `org_id` with RLS enforcement.
- **Given** chat history, **When** I choose "Clear History", **Then** transcripts are deleted but the generated Brief data remains (decoupled storage).
- **Given** I type a message, **When** sent, **Then** I see a typing indicator and receive a response.
- **Traceability:** Covers FR10, FR23, FR26 (Strategy category).

**Technical Notes:**
- Implement streaming responses for low latency (NFR3).
- Persist raw transcript separate from extracted facts/brief data.

### Story 2.3: Co-pilot Intelligence & Context Management
**As a** User,
**I want** the Co-pilot to ask relevant follow-up questions and propose content,
**So that** we can build a complete picture of my business efficiently.

**Acceptance Criteria:**
- **Given** I provide a short answer, **When** processed, **Then** the Co-pilot asks a probing follow-up (FR19, FR20).
- **Given** the Co-pilot makes a suggestion, **When** generated, **Then** an `ai_proposal_generated` event is logged.
- **Given** I accept a proposal, **When** saved to Brief, **Then** the `brief_updated` event payload includes `source: 'ai_proposal'` (auditability).
- **Traceability:** Covers FR18, FR19, FR20, FR24, FR22.

**Technical Notes:**
- Use LLM with system prompt focused on "Investigative Product Strategist".
- Maintain context window of recent turns + extracted facts.

### Story 2.4: Brief Generation & Editing
**As a** User,
**I want** to see and edit the Brief sections generated from our conversation,
**So that** I ensure the "DNA" of my business is accurate.

**Acceptance Criteria:**
- **Given** the conversation produces structured data, **When** the Co-pilot proposes a section, **Then** I can review and edit it (FR22).
- **Given** the Brief view, **When** I make manual edits, **Then** the changes are saved and `brief_updated` fires with `source: 'manual'`.
- **Given** the Co-pilot fails, **When** I choose, **Then** I can switch to a manual guided form (FR11, FR25).
- **Traceability:** Covers FR11, FR12, FR13, FR21, FR22, FR25.

**Technical Notes:**
- UI: Split view (Chat on left/right, Live Brief on the other side) or "Review Proposal" modal.

### Story 2.5: Brief Export
**As a** User,
**I want** to export my Universal Brief,
**So that** I can share it or keep a local copy.

**Acceptance Criteria:**
- **Given** a completed Brief, **When** I click "Export", **Then** I can download a PDF or Markdown version.
- **Traceability:** Covers FR17.

**Technical Notes:**
- Use a library like `react-pdf` or server-side generation.

---

## Epic 3: Digital Presence Builder

**Goal:** Build the Website Builder and CMS populated by the Brief.
**Value:** Users can instantly generate a professional website from their Brief and manage content without technical skills.

### Story 3.1: Website Builder Engine & Templates
**As a** User,
**I want** to choose a section-based template and customize my site layout,
**So that** I have a professional presence without needing design skills.

**Acceptance Criteria:**
- **Given** the Website Builder, **When** accessed, **Then** I can select from 3-4 templates (Founder, Trade, Clinic).
- **Given** the editor, **When** used, **Then** I can reorder pre-defined sections (Hero, Services, About, Contact) but cannot perform freeform layout.
- **Given** the editor, **When** I make changes, **Then** I can preview the site responsively (Mobile/Desktop).
- **Scope Constraint:** Custom CSS, component marketplace, and complex animations are explicitly **out of scope** for v0.2.
- **Traceability:** Covers FR40, FR41, FR44, FR45, FR46, FR47.

**Technical Notes:**
- Evaluate GrapesJS or Craft.js (constrained mode).
- Templates defined as JSON section lists.

### Story 3.2: Brief-to-Website Auto-population (The Magic)
**As a** User,
**I want** my website to automatically pull content from my Universal Brief,
**So that** I don't have to re-type my business name, services, or tagline.

**Acceptance Criteria:**
- **Given** a Brief, **When** auto-populating, **Then** system validates `schema_version` and `completion_status` before pulling data.
- **Given** the Brief's Offerings section, **When** loaded, **Then** the Services section populates with my actual services.
- **Given** auto-populated content, **When** I edit it on the site, **Then** the override is saved to `website_content` (never modifying the Brief).
- **Given** an overridden section, **When** I click "Reset to Brief", **Then** the override is cleared and Brief content returns.
- **Traceability:** Covers FR42, FR43.

**Technical Notes:**
- Orchestration: Website service reads `briefs` table via internal API.
- Data flow: Brief -> Default Content -> User Overrides.

### Story 3.3: CMS Core (Service Pages & Portfolio)
**As a** User,
**I want** to manage my blog posts, service pages, and portfolio items,
**So that** I can showcase my work and attract customers.

**Acceptance Criteria:**
- **Given** the CMS, **When** I create an item, **Then** I must provide: `title`, `slug`, `status` (draft/published), `published_at`, `hero_image`, `tags`.
- **Given** a draft item, **When** saved, **Then** a `content_updated` event is logged.
- **Given** an item, **When** published, **Then** a `content_published` event is logged and it becomes visible on the site.
- **Traceability:** Covers FR53, FR54, FR55, FR56, FR57, FR58, FR59.

**Technical Notes:**
- Store content in `cms_items` table.
- Rich text: Use Tiptap or similar headless editor.

### Story 3.4: Custom Domain & Publishing
**As a** User,
**I want** to publish my site to a custom domain or subdomain,
**So that** customers can find me online.

**Acceptance Criteria:**
- **Given** a draft site, **When** I click "Publish", **Then** it is live at `[orgname].xentri.app`.
- **Given** a publish action, **When** completed, **Then** `website_published` fires with payload including: `brief_schema_version`, `brief_updated_at`, and `content_source_map` (brief vs override).
- **Given** a custom domain request, **When** I provide a domain, **Then** system provides DNS instructions (CNAME/A record).
- **Given** DNS verification, **When** successful, **Then** system provisions SSL automatically.
- **Traceability:** Covers FR48, FR49, FR50, FR51, FR52.

**Technical Notes:**
- Architecture: Dynamic rendering with tenant routing (or ISR) for instant updates.
- Use Caddy or Vercel Platforms approach for domain management.

---

## Epic 4: Lead Capture & Growth

**Goal:** Implement lead capture forms and management.
**Value:** Users can capture demand from their website and manage incoming leads in a central list.

### Story 4.1: Lead Capture Form Builder & Security
**As a** User,
**I want** to add a secure contact form to my website,
**So that** visitors can contact me without me receiving a flood of spam.

**Acceptance Criteria:**
- **Given** the Website Builder, **When** I add a Contact section, **Then** I can configure the form fields.
- **Given** the form, **When** submitted, **Then** it includes anti-spam protection (Honeypot fields, Rate limiting per IP, Optional CAPTCHA toggle).
- **Given** a submission, **When** processed, **Then** the server validates field types/lengths and CORS headers.
- **Given** a submission, **When** processed, **Then** the `org_id` is resolved securely from the `website_id` or domain (never trusted from client input).
- **Traceability:** Covers FR60, FR61, FR62.

**Technical Notes:**
- Form schema stored in `website_content`.
- Submission endpoint must handle CORS and validation.

### Story 4.2: Lead Management & List View
**As a** User,
**I want** to view and manage my incoming leads,
**So that** I don't lose track of potential customers.

**Acceptance Criteria:**
- **Given** the Leads module, **When** accessed, **Then** I see a list of all leads sorted by date (newest first).
- **Given** the database, **When** schema applied, **Then** `leads` table includes: `id`, `org_id`, `source_page_url`, `referrer`, `created_at`, `status`, `payload` (JSONB).
- **Given** a lead, **When** managing, **Then** I can transition status: `New` <-> `Contacted` <-> `Archived` (Unarchive allowed).
- **Given** a status change, **When** saved, **Then** a `lead_status_changed` event is logged.
- **Traceability:** Covers FR65, FR66, FR67.

**Technical Notes:**
- Optional: Simple dedupe logic (flag if same email within 24h).
- Pagination for list view.

### Story 4.3: Lead Notifications & Events
**As a** User,
**I want** to be notified immediately when a new lead arrives,
**So that** I can respond quickly.

**Acceptance Criteria:**
- **Given** a new lead submission, **When** processed, **Then** a `lead_created` event is logged (Payload: `lead_id`, `org_id`, `source_url`; NO raw message body).
- **Given** a `lead_created` event, **When** processed, **Then** an email notification is sent to the Org Owner (idempotent, no spam on retry).
- **Given** notification settings, **When** configured, **Then** I can toggle email notifications on/off (FR78).
- **Traceability:** Covers FR63, FR64, FR75, FR78.

**Technical Notes:**
- Use transactional email service (Resend/Postmark).
- Ensure idempotency key based on `lead_id`.

---

## Epic 5: Brand Intelligence

**Goal:** Integrate the Brand Co-pilot for content assistance.
**Value:** Users get AI-powered help with writing website copy and improving their brand voice, ensuring consistency with their Brief.

### Story 5.1: Brand Co-pilot Integration & Context
**As a** User,
**I want** the Brand Co-pilot to understand my Universal Brief,
**So that** its suggestions sound like my business, not a generic AI.

**Acceptance Criteria:**
- **Given** the Brand Co-pilot, **When** invoked, **Then** it retrieves the active Universal Brief (Identity, Positioning, Audience).
- **Given** a request, **When** processing, **Then** context is strictly limited to: Brief + current page/field + optional CMS item (No cross-org retrieval).
- **Given** the system prompt, **When** configured, **Then** it explicitly forbids training on user content.
- **Traceability:** Covers FR69, FR74.

**Technical Notes:**
- Shared context retrieval service.
- Zero-retention policy on model provider side (if applicable).

### Story 5.2: Content Suggestions (Website Copy)
**As a** User,
**I want** the Co-pilot to suggest copy for my website sections,
**So that** I don't get stuck with writer's block.

**Acceptance Criteria:**
- **Given** a website section, **When** I click "Suggest Copy", **Then** the Co-pilot generates 3 options based on my Brief.
- **Given** a suggestion, **When** generated, **Then** an `ai_proposal_generated` event is logged (Payload includes: `model_id`, `prompt_version`, `inputs_hash`).
- **Given** a suggestion, **When** I click "Apply", **Then** it populates the field and logs `ai_proposal_applied`.
- **Given** a suggestion, **When** I dismiss it, **Then** it logs `ai_proposal_rejected` (for quality tuning).
- **Safety Gate:** All AI writes require explicit user confirmation; no auto-publishing.
- **Traceability:** Covers FR70, FR73.

**Technical Notes:**
- UI: "Magic Wand" icon on text fields.

### Story 5.3: Content Review & SEO Improvements
**As a** User,
**I want** the Co-pilot to review my drafts and suggest improvements,
**So that** my content is polished and SEO-friendly.

**Acceptance Criteria:**
- **Given** a draft blog post or service page, **When** I click "Review", **Then** the Co-pilot analyzes it for clarity and SEO.
- **Given** the analysis, **When** complete, **Then** it provides specific actionable suggestions (e.g., "Add a meta description", "Shorten this sentence").
- **Traceability:** Covers FR71, FR72.

**Technical Notes:**
- Use LLM for text analysis and SEO heuristics.

---

## Epic 6: Data Privacy & Compliance

**Goal:** Implement data export, account deletion, and retention policies.
**Value:** Users have full control over their data, ensuring trust and compliance with privacy standards.

### Story 6.1: Data Export (Takeout)
**As a** User,
**I want** to export all my data,
**So that** I am not locked into the platform.

**Acceptance Criteria:**
- **Given** the Account Settings, **When** I click "Export Data", **Then** the system generates a downloadable ZIP package.
- **Given** the export package, **When** inspected, **Then** it includes: Universal Brief, Leads, Website Content, CMS Items, and a redacted Event Timeline.
- **Given** the export file, **When** generated, **Then** it includes a version header `xentri-export-v1`.
- **Traceability:** Covers FR79.

**Technical Notes:**
- Async job for large exports.
- Event timeline should exclude internal system logs, focusing on user-visible actions.

### Story 6.2: Account Deletion & Recovery
**As a** User,
**I want** to delete my account with a safety net,
**So that** I can leave the platform securely but recover if it was a mistake.

**Acceptance Criteria:**
- **Given** the Account Settings, **When** I request deletion, **Then** my account is "soft deleted" (inactive, not visible).
- **Given** a soft-deleted account, **When** I log in within 30 days, **Then** I can restore my account.
- **Given** a soft-deleted account, **When** 30 days pass, **Then** a background job permanently purges all PII and data.
- **Given** the purge job, **When** executed, **Then** it removes: Org tables, Media assets, Auth identities, and revokes Domains/SSL.
- **Given** the purge job, **When** handling events, **Then** it anonymizes/tombstones PII in the Event Backbone (rows remain for metrics, but `user_id` -> `deleted_user`).
- **Traceability:** Covers FR5, FR80, FR81.

**Technical Notes:**
- `deleted_at` column on `organizations` and `users`.
- Cron job for permanent purge with verification step.

---
