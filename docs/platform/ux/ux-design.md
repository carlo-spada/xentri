---
entity_type: constitution
document_type: ux-design
title: 'Xentri System UX Design'
description: 'System-wide UX principles, design system foundations, and interaction patterns that all categories must follow.'
version: '4.0'
status: approved
created: 2025-11-25
updated: 2025-12-03
---

<!--
CONSTITUTION DOCUMENT

This UX Design defines PRINCIPLES and PATTERNS at the system level. For implementations:
- Design tokens (colors, typography, spacing, components): docs/platform/ui/ux-design.md
- Shell layout, sidebar, navigation, Copilot Widget: docs/platform/shell/ux-design.md

Child entities inherit these principles and may extend them per Section 13.
-->

# Xentri UX Design Specification (System Constitution)

_Created: 2025-11-25_
_Major Revision: 2025-12-03 (v4.0 - Constitutional Review: Principles retained, implementations migrated)_
_Level: System (applies to ALL categories)_

---

## Executive Summary

Xentri is a **Fractal Business Operating System** orchestrated by AI agents. The user - whether an Owner supervising the entire organization or a Specialist managing their domain - experiences Xentri as a **narrative-first interface** where their business story unfolds.

**The defining experience:** Open your Chronicle -> see what developed since yesterday -> handle what needs you -> understand your story arcs -> close feeling caught up.

**Mental Models:**

| User Type      | Mental Model                           | Primary Experience                      |
| -------------- | -------------------------------------- | --------------------------------------- |
| **Owner**      | CEO supervising a fractal organization | Strategy Pulse -> full hierarchy access |
| **Specialist** | Domain expert within their scope       | Category/Module Pulse -> scoped access  |

**Emotional goal:** "I know my story." Narrative awareness, not dashboard anxiety.

---

## 1. Design Philosophy

### 1.1 Core Principles

| Principle             | Meaning                                                          |
| --------------------- | ---------------------------------------------------------------- |
| **Narrative First**   | Every session is a chapter; the system tells your business story |
| **No-Scroll**         | Full-screen experience; everything visible without scrolling     |
| **Chronicle Default** | Journal-like view is primary; efficiency mode is toggle          |
| **Human-in-the-Loop** | Copilot is a colleague in the narrative, not a chatbot           |
| **Soul-Aware**        | Deep personalization - structure adapts, not just labels         |

### 1.2 The Fractal Mental Model

Users don't "check dashboards." They:

1. **Read their chapter** - What developed since yesterday?
2. **Understand their arcs** - What ongoing threads are progressing?
3. **Handle what matters** - Intervene on exceptions only
4. **Trust the agents** - The fractal org runs beneath the surface

This replaces the "autopilot/cockpit" metaphor with a richer "CEO supervising an organization" model.

### 1.3 Two User Types

**Owner (Super-admin):**

- Sees Strategy Pulse by default (the CEO briefing)
- Full access to all categories, sub-categories, modules
- Can configure roles and permissions for others
- Copilot provides strategic-level narrative

**Specialist (Invited User):**

- Sees their highest-level available Pulse
- Access scoped by primitives (view, edit, approve, configure)
- Copilot provides domain-specific narrative
- Multi-scope users land on most recently used scope

### 1.4 Resolving Competing Concerns

**"No Surprises" vs "Gradual Autonomy":**

> **Nudges are policy upgrades only - never requests for permission on individual actions.**

When Xentri suggests increased automation:

- It proposes a **policy change** ("Auto-send all lead replies using Warm Welcome template")
- It's **not** asking "Can I send this specific email?"
- Accepting a nudge **updates the policy** - future similar actions just happen

### 1.5 Platform Split

| Platform    | Role     | Mental Model                                          |
| ----------- | -------- | ----------------------------------------------------- |
| **Desktop** | Workshop | Configure, adjust policies, dive deep, full Chronicle |
| **Mobile**  | Cockpit  | Scan, approve, handle exceptions, quick actions       |

---

## 2. Narrative Continuity

### 2.1 The Core Innovation

Every session is a **chapter** of an ongoing story, not a transaction. The system maintains narrative awareness:

> _"Good morning, Carlo. Since yesterday: Acme Corp responded to your proposal - they want to discuss pricing. Invoice #247 hit 30 days, but Beta Inc has a clean history. Based on past patterns, one pricing discussion usually closes these deals."_

This is not a notification. It's **narrative awareness**.

### 2.2 Chronicle View (Default)

The default landing experience is a journal-like Chronicle showing:

- Personalized greeting (time-aware)
- "Since Yesterday" developments with inline copilot suggestions
- Story Arcs progress visualization

> **Implementation:** See `docs/platform/shell/ux-design.md` for layout specifications.

### 2.3 Efficiency View (Toggle)

Same information, conventional presentation for power users with:

- Needs Attention queue
- Compact action cards
- Inline arc indicators

> **Implementation:** See `docs/platform/shell/ux-design.md` for layout specifications.

### 2.4 Story Arcs

Story arcs are **first-class UI elements** - persistent threads that evolve across sessions:

| Arc Type        | Example                | Visualization               |
| --------------- | ---------------------- | --------------------------- |
| **Deal**        | Acme Corp Proposal     | Progress bar with day count |
| **Goal**        | Q4 Revenue Target      | Percentage with timeline    |
| **Improvement** | Client Diversification | Current vs target           |
| **Project**     | Website Redesign       | Phase indicator             |

Arcs persist in the sidebar/header and show progress over time.

### 2.5 Session Bridging

When user returns after absence:

> _"Welcome back, Carlo. You've been away 3 days. Here's the story:_
>
> **Resolved:** Invoice #247 was paid
> **Developed:** Acme Corp wants to proceed
> **New:** Two leads came in, one looks strong
> **Brewing:** Strategy Soul suggests revisiting pricing"

### 2.6 Copilot as Human-in-the-Loop

The copilot is **woven into the narrative**, not a separate chatbot:

| Chatbot Pattern (NOT this)           | Human-in-the-Loop (THIS)               |
| ------------------------------------ | -------------------------------------- |
| Lives in widget, appears when called | Present in narrative, comments inline  |
| "How can I help you?"                | "I noticed this - here's what I think" |
| Reactive                             | Proactive (but not intrusive)          |
| Separate from content                | Part of the content                    |

Copilot suggestions appear as inline in the Chronicle, offering perspective and actions.

### 2.7 Narrative Language

All system copy uses narrative framing:

| Instead of...      | Say...                        |
| ------------------ | ----------------------------- |
| "Task completed"   | "Resolved" or "Done"          |
| "New notification" | "Something developed"         |
| "Overdue"          | "This thread needs attention" |
| "Dashboard"        | "Your story today"            |
| "History"          | "Past chapters"               |

---

## 3. Hierarchical Pulse

### 3.1 Core Concept

Every level of the hierarchy has its own Pulse view - a narrative summary of what's happening at that scope:

| Level                  | Pulse Shows                             | Who Sees It                  |
| ---------------------- | --------------------------------------- | ---------------------------- |
| **Strategy Pulse**     | What survived all 4 layers of filtering | Owner (landing page)         |
| **Category Pulse**     | What's happening in that category       | Owner + Category specialists |
| **Sub-category Pulse** | What's happening in that sub-category   | SPA header section           |
| **Module Pulse**       | What's happening in that module         | Tab header or inline         |

### 3.2 Landing Logic

| User Type            | Permissions                     | Lands On                           |
| -------------------- | ------------------------------- | ---------------------------------- |
| Owner                | Full access                     | Strategy Pulse                     |
| Marketing Lead       | `view+edit+configure:marketing` | Marketing Pulse                    |
| Sales + Finance      | `view:sales`, `view:finance`    | Last used (Sales or Finance Pulse) |
| Invoicing Specialist | `view+edit:finance.invoicing`   | Invoicing Pulse (sub-category)     |

### 3.3 Pulse Structure

Each Pulse contains:

1. **Greeting** - Personalized, time-aware
2. **Developments** - What changed since last visit
3. **Inline Copilot** - Suggestions and context
4. **Story Arcs** - Ongoing threads at this scope
5. **Toggle** - Chronicle <-> Efficiency switch

---

## 4. Navigation Architecture

### 4.1 No-Scroll Constraint

**The entire application is a full-screen experience with zero scrolling.**

This constraint forces:

- Disciplined information architecture
- Content density that fits viewport
- Progressive disclosure via navigation, not scroll
- Mobile requires fundamentally different layout

### 4.2 Sidebar Rules

- **Categories only** in sidebar (7 items max)
- **Click category** -> Sub-categories expand inline (only recommended + owned)
- **Click sub-category** -> SPA loads in content area
- **Only ONE category expanded** at a time
- **Collapsible to icons** for maximum SPA space
- **Module tabs** at top of SPA (only recommended + owned)

> **Implementation:** See `docs/platform/shell/ux-design.md` for sidebar specifications.

### 4.3 Copilot Widget Rules

A draggable widget that summons the context-relevant copilot:

**States:** Collapsed (icon + badge), Panel mode, Full mode

**Context Awareness:**

- In Finance SPA -> Finance Copilot
- In Strategy Pulse -> Strategy Copilot
- Each category/sub-category/module has its own copilot

> **Implementation:** See `docs/platform/shell/ux-design.md` for widget specifications.

---

## 5. Theme Architecture

### 5.1 Design Philosophy

Aesthetics drive initial adoption. Different users prefer different visual styles. Xentri offers multiple themes to match user preferences.

### 5.2 MVP Themes

| Theme      | Modes       | Description                                                    | Target User                  |
| ---------- | ----------- | -------------------------------------------------------------- | ---------------------------- |
| **Modern** | Dark, Light | Conversational, gradient accents, immersive, chat-like copilot | Solo founders, younger users |
| **Power**  | Dark, Light | Dense, high-contrast, minimal chrome, speed-focused            | Power users, hours-in-app    |

### 5.3 Future Themes

| Theme           | Modes       | Description                                           | Target User                  |
| --------------- | ----------- | ----------------------------------------------------- | ---------------------------- |
| **Traditional** | Dark, Light | Professional clarity, balanced, warm but businesslike | Professional firms, agencies |

### 5.4 Theme Definitions

**Modern Theme:**

- Vibe: Conversational, immersive, feels like talking to a colleague
- Typography: Friendly, slightly rounded
- Colors: Vibrant primary (cyan/pink gradients), softer surfaces
- Copilot: Prominent, chat-like bubbles, avatar visible
- Density: Comfortable spacing, breathing room

**Power Theme:**

- Vibe: Dense, fast, keyboard-friendly, information-forward
- Typography: Crisp, compact
- Colors: High contrast, muted accents, status indicators prominent
- Copilot: Minimal, inline notes, no avatars
- Density: Tight spacing, more on screen

**Traditional Theme (Future):**

- Vibe: Professional, balanced, warm but businesslike
- Typography: Classic, trustworthy
- Colors: Refined, sophisticated, less vibrant
- Copilot: Subtle suggestions, professional tone
- Density: Balanced

### 5.5 User Preference

- Theme preference stored per user (not per org)
- Default: Modern Dark
- Soul-aware suggestion: Copilot can recommend theme based on business type
- Toggle available in Settings

> **Implementation:** See `docs/platform/ui/ux-design.md` for color tokens and CSS.

---

## 6. The Autonomy Policy Model

### 6.1 Core Concept: "Consent Once, Not Per-Action"

Traditional AI tools ask permission for every action. Xentri uses an **Autonomy Policy** model:

- User sets their comfort level once
- System operates within those boundaries
- User reviews exceptions, not every action

### 6.2 Three Presets

| Preset                 | Description                                  | Behavior                                                           |
| ---------------------- | -------------------------------------------- | ------------------------------------------------------------------ |
| **Conservative**       | Xentri prepares, you approve                 | Auto-capture, auto-classify, auto-draft. Never auto-send.          |
| **Balanced** (Default) | Auto-execute safe actions, batch review rest | Auto internal actions, batch review external, block risky          |
| **Autonomous**         | Maximum automation with undo window          | Auto-execute low-risk external, 5-min undo window, block high-risk |

### 6.3 Risk Classification

| Risk Level | Examples                                         | Behavior                                         |
| ---------- | ------------------------------------------------ | ------------------------------------------------ |
| **Low**    | Tagging, classifying, scheduling, internal notes | Auto-execute in Balanced+                        |
| **Medium** | Lead replies (templated), follow-up emails       | Auto-draft, or auto-send with undo in Autonomous |
| **High**   | Payments, publishing, deletes, custom messages   | Always requires approval                         |

### 6.4 Notification Budgets

| Channel              | When Used                          | Example                     |
| -------------------- | ---------------------------------- | --------------------------- |
| **Interrupt** (Push) | High-risk actions needing approval | Payment failed, urgent lead |
| **Badge/Digest**     | Medium-priority items              | Drafts ready for review     |
| **Timeline Only**    | Low-priority, FYI                  | Auto-handled routine items  |

Default budget: **5 high-priority items** in "Needs You" queue. Overflow goes to separate bucket.

### 6.5 Undo-First Execution

All actions follow the pattern: **Do -> Toast -> Undo window**

```
"Sent. Undo" (5 seconds)
```

---

## 7. Soul-Aware Personalization

### 7.1 Deep Personalization

Copilots don't just change labels - they **structurally configure** the system based on the Universal Soul:

| What Copilots Configure    | Example                                              |
| -------------------------- | ---------------------------------------------------- |
| **Pipeline stages**        | Doctor: Inquiry -> Consultation -> Treatment -> Care |
| **Database columns**       | Hotel: Room Type, Check-in Date, Guest Preferences   |
| **Role suggestions**       | Restaurant: Chef, Server, Host                       |
| **Module recommendations** | Agency: Project Management surfaces first            |
| **Workflows & defaults**   | Startup: Fast follow-up cadence                      |

### 7.2 "One Question, Not Fifty"

Instead of asking users to configure everything:

> _"Based on your Soul, I've set up your CRM with these stages: Inquiry -> Consultation -> Treatment Plan -> Ongoing Care. Does this match how you work?"_

The system proposes intelligent defaults; the user adjusts.

### 7.3 Role Suggestions

When a new organization is created, the Strategy Copilot suggests roles tailored to that business type:

- Restaurant -> Chef, Server, Host, Manager
- Startup -> Sales Rep, Developer, Designer
- Agency -> Account Manager, Creative, Strategist

---

## 8. Design System Foundation

### 8.1 Design System Choice

**shadcn/ui** - Tailwind-native, copy-paste components built on Radix primitives.

**Version:** shadcn/ui with Tailwind v4 + Radix UI primitives (latest stable as of 2025-01)

**Rationale:**

- Tailwind integration matches Xentri's stack (Astro Shell + React Islands)
- Full customization control (no vendor CSS overrides)
- Accessible by default via Radix primitives
- Strong community, excellent documentation
- AI-friendly (v0, Bolt, Cursor all understand it)

### 8.2 Component Inventory

**From shadcn/ui (used as-is or lightly customized):**

| Component     | Usage                           | Customization                  |
| ------------- | ------------------------------- | ------------------------------ |
| Button        | All actions                     | Theme colors, density variants |
| Card          | Exception cards, content panels | Left border status indicator   |
| Dialog        | Confirmations, detail views     | Surface+ background            |
| Dropdown Menu | Context menus, actions          | Theme styling                  |
| Input         | Form fields                     | Validation states              |
| Label         | Form labels                     | Typography scale               |
| Select        | Dropdowns                       | Theme styling                  |
| Sheet         | Mobile/tablet slide-overs       | Side positioning               |
| Slider        | Policy adjusters                | Custom track styling           |
| Switch        | Toggles                         | Theme colors                   |
| Tabs          | Module navigation               | Active state styling           |
| Toast         | Undo-first feedback             | Green accent, undo action      |
| Tooltip       | Contextual help                 | Theme styling                  |

**Custom Components (Xentri-specific):**

| Component       | Purpose                        | Reference          |
| --------------- | ------------------------------ | ------------------ |
| Exception Card  | Status-aware action cards      | ui/ux-design.md    |
| Autonomy Badge  | Autopilot health indicator     | ui/ux-design.md    |
| Policy Slider   | 3-position autonomy control    | ui/ux-design.md    |
| Chronicle View  | Narrative landing experience   | shell/ux-design.md |
| Efficiency View | Dense alternative landing      | shell/ux-design.md |
| Story Arc       | Progress visualization         | ui/ux-design.md    |
| Copilot Widget  | Draggable AI assistant         | shell/ux-design.md |
| Pulse Header    | Scope-aware greeting + summary | shell/ux-design.md |

### 8.3 Design Tokens

**Color System:** 4-layer neutral system (Base, Chrome, Surface, Surface+) with semantic colors.

**Typography:** Cal Sans (headings), Inter (body), JetBrains Mono (code) with rem-based scale.

**Spacing:** 4px base unit with 11-token scale.

> **Implementation:** See `docs/platform/ui/ux-design.md` for complete token definitions, CSS variables, and theme palettes.

### 8.4 Content Canvas Pattern

To avoid "card-on-card" ambiguity:

1. **Base** background for the viewport
2. **One bordered Surface panel** for the content canvas
3. **Cards inside** sit directly on Surface (no extra border, or very subtle)
4. **Modals/sheets** use Surface+ with shadow

---

## 9. UX Patterns & Components

This section defines the behavioral patterns for components. Implementation details (sizes, states, CSS) are in `docs/platform/ui/ux-design.md`.

### 9.1 Exception Cards

Cards for items needing user attention. Visual status via left border.

**Status Types:**

| Border Color     | Status        | Meaning                      |
| ---------------- | ------------- | ---------------------------- |
| Warning (yellow) | Needs Review  | Draft ready for approval     |
| Error (red)      | Blocked       | Requires action to proceed   |
| Success (green)  | Auto-executed | FYI, completed automatically |
| Info (blue)      | Quarantine    | Needs classification         |

### 9.2 Toast Pattern (Undo-First)

All toasts follow: **Icon + Message + Undo action**

**Types:** Success, Error, Warning, Info, Loading

**Behavior:**

- Max 3 visible, newest at bottom
- 5-second default, persistent for errors
- Hover pauses timer

### 9.3 Autonomy Badge

Shows current autopilot status in header.

**States:** Healthy (green), Degraded (yellow), Limited (red)

### 9.4 Policy Sliders

3-position slider for autonomy levels: Suggest -> Auto-draft -> Auto-send

### 9.5 Batch Operations

Batch operations require ALL items to match:

- Same template
- Same policy
- Same channel

Always show 1-item preview before batch action.

### 9.6 Overflow Triage

Priority recipe (in order):

1. Risk Level (High > Medium > Low)
2. Time Sensitivity (SLA timer > deadline today > this week > none)
3. Revenue Impact ($ amount > no $ attached)
4. Staleness (Newer > Older, as tie-breaker only)

### 9.7 Button Hierarchy

**Variants:** Primary (solid), Secondary (outline), Tertiary (text), Destructive (red), Ghost (icon-only)

**Rule:** One primary button per visible context.

### 9.8 Form Patterns

- Labels always above input, never floating
- Validate on blur, not keystroke
- Focus moves to first error on submit failure

### 9.9 Modal Pattern

**Types:** Alert (sm), Confirm (sm), Dialog (md), Panel (lg), Fullscreen

**Behavior:**

- Focus trap within modal
- Escape closes (except destructive confirmations)
- Focus returns to trigger on close

### 9.10 Search Pattern

**Global:** Command palette (Cmd/Ctrl + K) with recent items and actions

**Inline:** Filter-as-you-type within tables/lists

### 9.11 Confirmation Pattern

**When Required:**

- Delete/Remove (always)
- Bulk operations >5 items (always)
- Payment/financial (always)
- Undo-able actions (never - use toast)

### 9.12 Date/Time Pattern

- Display: Smart relative ("Today", "3 days ago")
- Store: UTC always
- Display: User's local timezone

### 9.13 Empty State Pattern

**Types:** First Use (encouraging), No Results (helpful), All Clear (celebratory), Error (apologetic), Permission (informative)

**Structure:** Illustration (optional) + Primary message + Secondary text + Action

### 9.14 Notification Pattern

**Types:** Interrupt (push), Badge (indicator), Toast (overlay), Timeline (chronicle entry)

**Budget:** Max 5 high-priority items in "Needs You" queue.

---

## 10. Responsive Strategy

### 10.1 Breakpoints

| Breakpoint | Layout                        | Navigation    |
| ---------- | ----------------------------- | ------------- |
| Desktop    | Collapsible sidebar + Content | Full nav tree |
| Tablet     | Icon sidebar + Content        | Tap to expand |
| Mobile     | Full-width, bottom nav        | Bottom sheet  |

### 10.2 Accessibility Requirements

**Compliance Target:** WCAG 2.1 AA

**Non-Negotiables:**

- All interactive elements have visible focus state (2px solid ring)
- Focus order follows visual layout
- Tab trapped within modals
- Color contrast: 4.5:1 for text, 3:1 for UI components
- Never use color alone to convey meaning
- Respect `prefers-reduced-motion`

**Screen Reader Support:**

- Semantic HTML (nav, main, article, aside)
- Heading hierarchy without skipping levels
- ARIA attributes for dynamic content
- Live regions for status updates

**Keyboard Navigation:**

- `Cmd/Ctrl + K` - Command palette
- `Escape` - Close modal/cancel
- `Tab/Shift+Tab` - Navigate
- `Enter/Space` - Activate

**Testing Requirements:**

- Automated: axe-core, eslint-plugin-jsx-a11y
- Manual: Keyboard-only navigation, screen reader testing
- Lighthouse accessibility audit: 90+ target

---

## 11. User Journey Flows

### 11.1 Journey 1: First-Time User

**Goal:** "Consent once, stay calm" - smart defaults + single Autopilot Setup + Training Wheels.

**Flow:**

```
Sign Up -> Strategy Co-pilot -> Build Soul -> Autopilot Setup -> Training Wheels -> Chronicle
```

**Training Wheels Mode:**

- Duration: First 24 hours OR first 10 actions (whichever comes later)
- All actions = Draft + Review
- Auto-exit after 24h + 10 actions with <80% edit rate

### 11.2 Journey 2: The Daily Loop

**Goal:** "I know my story" - read your chapter, handle what matters, trust the rest.

**Core Loop:**

```
Open Chronicle -> Read "Since Yesterday" -> Handle exceptions -> Check Story Arcs -> Close
```

**States:**

1. **Calm State** - Nothing needs you, agents healthy
2. **Active State** - Exceptions need attention
3. **Degraded State** - Agents running in safe mode
4. **Overflow State** - More items than budget allows

---

## 12. Microcopy Guide

### 12.1 Voice & Tone

- **Calm, not cold** - Professional behavior, warm personality
- **Narrative, not transactional** - Tell the story, don't list facts
- **Confident, not arrogant** - "Xentri handled this" not "AI magic"

### 12.2 Key Copy

| Context            | Copy                                                       |
| ------------------ | ---------------------------------------------------------- |
| Tagline            | "Your business, finally visible."                          |
| Chronicle greeting | "Good morning, Carlo. Here's your story today."            |
| Empty state        | "You're all caught up. Your story continues tomorrow."     |
| Session bridge     | "Welcome back. Here's what developed while you were away." |
| Story arc label    | "Ongoing threads" or "Active arcs"                         |
| Copilot inline     | Conversational tone, proactive perspective                 |

---

## 13. Inheritance Guidelines

This section defines what child entities can and cannot customize.

### 13.1 Immutable (Cannot Override)

| Element                     | Rationale                                   |
| --------------------------- | ------------------------------------------- |
| **Color System**            | Brand consistency, accessibility compliance |
| **Typography Scale**        | Visual hierarchy, readability               |
| **Font Families**           | Brand identity, performance                 |
| **Spacing Base Unit** (4px) | Visual rhythm, component alignment          |
| **Accessibility Standards** | Legal/ethical compliance (WCAG 2.1 AA)      |
| **Focus Indicators**        | Accessibility, consistency                  |
| **Toast Pattern**           | Undo-first philosophy, user expectation     |
| **Modal Behavior**          | Accessibility, focus management             |
| **Button Hierarchy**        | Action clarity, consistency                 |
| **Confirmation Pattern**    | Preventing destructive errors               |

### 13.2 Constrained (Can Extend, Cannot Contradict)

| Element                     | What Children Can Do             | What They Cannot Do                         |
| --------------------------- | -------------------------------- | ------------------------------------------- |
| **Exception Card Statuses** | Add domain-specific statuses     | Remove or rename core statuses              |
| **Form Validation States**  | Add custom validation messages   | Change validation timing or visual patterns |
| **Search Behavior**         | Add domain-specific result types | Change keyboard navigation pattern          |
| **Date/Time Formats**       | Add domain-specific formats      | Override relative time thresholds           |
| **Microcopy Voice**         | Adapt terminology to domain      | Contradict narrative-first tone             |

### 13.3 Customizable (Full Child Control)

| Element                  | Customization Scope                                  |
| ------------------------ | ---------------------------------------------------- |
| **Story Arc Types**      | Define domain-specific arcs (deals, projects, goals) |
| **Empty State Content**  | Domain-specific messaging and CTAs                   |
| **Notification Content** | Domain-specific event descriptions                   |
| **Chronicle Greeting**   | Domain-contextualized welcome messages               |
| **Copilot Suggestions**  | Domain-specific inline comments                      |
| **Quick Actions**        | Domain-specific action buttons                       |
| **Data Visualizations**  | Domain-specific charts, metrics, graphs              |

### 13.4 Extension Points

Child entities can introduce new patterns not covered by this Constitution, provided they:

1. **Follow the Design System** - Use shadcn/ui components as base
2. **Respect Spacing/Typography** - Use defined tokens
3. **Meet Accessibility** - Maintain WCAG 2.1 AA compliance
4. **Document Thoroughly** - Add to their module's `ux-design.md`
5. **Avoid Conflicts** - Not contradict any immutable or constrained element

### 13.5 Theme Customization

| What Children Can Do                  | What They Cannot Do               |
| ------------------------------------- | --------------------------------- |
| Use any defined theme (Modern, Power) | Create new themes                 |
| Set default theme for their module    | Override user's global preference |
| Suggest theme based on domain         | Force a specific theme            |

### 13.6 Inheritance Chain

```
Constitution (this document)
    | INHERITS
Infrastructure Module / Strategic Container
    | INHERITS
Coordination Unit (for Strategic Containers only)
    | INHERITS
Business Module
```

Each level can ADD but never CONTRADICT its parent. When in doubt, the parent wins.

---

## Appendix

### Related Documents

| Document             | Path                   | Purpose                                        |
| -------------------- | ---------------------- | ---------------------------------------------- |
| Product Requirements | `./prd.md`             | System-level PR-xxx and IC-xxx definitions     |
| Product Soul         | `./product-soul.md`    | Brand identity and voice                       |
| Epics                | `./epics.md`           | System-level epic definitions                  |
| Architecture         | `./architecture.md`    | Technical architecture                         |
| UI Design Tokens     | `./ui/ux-design.md`    | Color, typography, spacing, component specs    |
| Shell Layout         | `./shell/ux-design.md` | Layout grid, sidebar, navigation, widget specs |

### Interactive Deliverables

| Artifact                | Path                                    | Contents                            |
| ----------------------- | --------------------------------------- | ----------------------------------- |
| **MVP Themes**          | `./ux/ux-themes-mvp.html`               | Modern + Power themes (interactive) |
| **Design Directions**   | `./ux/ux-design-directions.html`        | 7 visual direction explorations     |
| Daily Loop Wireframes   | `./ux/ux-daily-loop-wireframes-v2.html` | 4-layer system + 6 specs            |
| First-Time User Journey | `./ux/ux-journey-1-ftu.html`            | Complete FTU flow                   |

### Design Decisions Log

| Decision        | Chosen                         | Rationale                          |
| --------------- | ------------------------------ | ---------------------------------- |
| Default View    | Chronicle (narrative)          | Differentiator; story > dashboard  |
| Toggle          | Chronicle <-> Efficiency       | Power users need density option    |
| Copilot Pattern | Human-in-the-loop (inline)     | Colleague, not chatbot             |
| Navigation      | Categories -> Sub-cats -> Tabs | No-scroll constraint               |
| Sidebar         | Collapsible, one expanded      | Maximum SPA space                  |
| Themes (MVP)    | Modern + Power (dark/light)    | Different user preferences         |
| Theme Default   | Modern Dark                    | Immersive, differentiated          |
| Story Arcs      | First-class UI element         | Narrative continuity               |
| Design System   | shadcn/ui                      | Tailwind-native, customizable      |
| Default Preset  | Balanced                       | Auto-execute safe, review external |

### Version History

| Date       | Version | Changes                                                                                                                                                                                           | Author           |
| ---------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| 2025-11-25 | 1.0     | Initial UX Design Specification                                                                                                                                                                   | UX Designer + PM |
| 2025-11-25 | 1.1     | Tightened specs for Notification Hell prevention                                                                                                                                                  | UX Designer + PM |
| 2025-11-26 | 1.2     | Changed default preset to Balanced; confirmed shadcn/ui                                                                                                                                           | Carlo + Winston  |
| 2025-11-28 | 1.3     | Marked Journey 3 deferred; fixed paths                                                                                                                                                            | Carlo            |
| 2025-12-01 | 2.0     | Major revision: Narrative Continuity, Chronicle-first, Theme Architecture                                                                                                                         | Carlo + Sally    |
| 2025-12-01 | 2.1     | Implementation readiness: Typography, Components, Accessibility                                                                                                                                   | Carlo + Sally    |
| 2025-12-02 | 2.2     | Validation compliance: Spacing, Inheritance, Empty States, Notifications                                                                                                                          | Carlo + Sally    |
| 2025-12-03 | **4.0** | **Constitutional Review:** Migrated implementation details to module docs. Retained principles, patterns, inheritance rules. Design tokens -> ui/ux-design.md, Layout specs -> shell/ux-design.md | Carlo + Winston  |

---

_This UX Design Specification defines PRINCIPLES and PATTERNS at the Constitution level. Implementation details (design tokens, layout specs) live in module documents._
