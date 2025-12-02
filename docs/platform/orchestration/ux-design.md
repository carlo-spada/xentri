# Xentri UX Design Specification

_Created: 2025-11-25_
_Major Revision: 2025-12-01 (v2.0 - Narrative Continuity & Theme Architecture)_
_Generated using BMad Method - Create UX Design Workflow v1.0_

---

## Executive Summary

Xentri is a **Fractal Business Operating System** orchestrated by AI agents. The user — whether an Owner supervising the entire organization or a Specialist managing their domain — experiences Xentri as a **narrative-first interface** where their business story unfolds.

**The defining experience:** Open your Chronicle → see what developed since yesterday → handle what needs you → understand your story arcs → close feeling caught up.

**Mental Models:**

| User Type | Mental Model | Primary Experience |
|-----------|--------------|-------------------|
| **Owner** | CEO supervising a fractal organization | Strategy Pulse → full hierarchy access |
| **Specialist** | Domain expert within their scope | Category/Module Pulse → scoped access |

**Emotional goal:** "I know my story." Narrative awareness, not dashboard anxiety.

---

## 1. Design Philosophy

### 1.1 Core Principles

| Principle | Meaning |
|-----------|---------|
| **Narrative First** | Every session is a chapter; the system tells your business story |
| **No-Scroll** | Full-screen experience; everything visible without scrolling |
| **Chronicle Default** | Journal-like view is primary; efficiency mode is toggle |
| **Human-in-the-Loop** | Copilot is a colleague in the narrative, not a chatbot |
| **Brief-Aware** | Deep personalization — structure adapts, not just labels |

### 1.2 The Fractal Mental Model

Users don't "check dashboards." They:

1. **Read their chapter** — What developed since yesterday?
2. **Understand their arcs** — What ongoing threads are progressing?
3. **Handle what matters** — Intervene on exceptions only
4. **Trust the agents** — The fractal org runs beneath the surface

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

> **Nudges are policy upgrades only — never requests for permission on individual actions.**

When Xentri suggests increased automation:
- It proposes a **policy change** ("Auto-send all lead replies using Warm Welcome template")
- It's **not** asking "Can I send this specific email?"
- Accepting a nudge **updates the policy** — future similar actions just happen

### 1.5 Platform Split

| Platform | Role | Mental Model |
|----------|------|--------------|
| **Desktop** | Workshop | Configure, adjust policies, dive deep, full Chronicle |
| **Mobile** | Cockpit | Scan, approve, handle exceptions, quick actions |

---

## 2. Narrative Continuity

### 2.1 The Core Innovation

Every session is a **chapter** of an ongoing story, not a transaction. The system maintains narrative awareness:

> *"Good morning, Carlo. Since yesterday: Acme Corp responded to your proposal — they want to discuss pricing. Invoice #247 hit 30 days, but Beta Inc has a clean history. Based on past patterns, one pricing discussion usually closes these deals."*

This is not a notification. It's **narrative awareness**.

### 2.2 Chronicle View (Default)

The default landing experience is a journal-like Chronicle:

```
┌─────────────────────────────────────────────────────────────────┐
│ TODAY'S CHAPTER                                    Dec 1, 2025  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Good morning, Carlo.                                            │
│                                                                 │
│ SINCE YESTERDAY                                                 │
│ ─────────────────────────────────────────────────────────────── │
│                                                                 │
│ 📬 Acme Corp responded to your proposal                         │
│    They want to discuss pricing. This is positive.              │
│                                                                 │
│    💬 "Based on your past negotiations, they usually            │
│       accept after one pricing discussion. I've drafted         │
│       a reply using your standard approach."                    │
│       [View Draft] [Edit] [Skip]                                │
│                                                                 │
│ STORY ARCS                                                      │
│ ─────────────────────────────────────────────────────────────── │
│                                                                 │
│ 📖 Acme Corp Proposal ━━━━━━━━━━━━━━━━━●━━ Day 3/5              │
│ 📖 Q4 Revenue ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 70%           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.3 Efficiency View (Toggle)

Same information, conventional presentation for power users:

```
┌─────────────────────────────────────────────────────────────────┐
│ NEEDS ATTENTION (2)                              [Chronicle ⟷ ●]│
├─────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ 📬 Acme Corp — Proposal Response         [View] [Draft Reply]│ │
│ └─────────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ ⏰ Invoice #247 — 30 days overdue         [View] [Send Nudge]│ │
│ └─────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│ ARCS: Acme (Day 3/5) • Q4 Revenue (70%) • Concentration (40%)  │
└─────────────────────────────────────────────────────────────────┘
```

### 2.4 Story Arcs

Story arcs are **first-class UI elements** — persistent threads that evolve across sessions:

| Arc Type | Example | Visualization |
|----------|---------|---------------|
| **Deal** | Acme Corp Proposal | Progress bar with day count |
| **Goal** | Q4 Revenue Target | Percentage with timeline |
| **Improvement** | Client Diversification | Current vs target |
| **Project** | Website Redesign | Phase indicator |

Arcs persist in the sidebar/header and show progress over time.

### 2.5 Session Bridging

When user returns after absence:

> *"Welcome back, Carlo. You've been away 3 days. Here's the story:*
>
> **Resolved:** Invoice #247 was paid
> **Developed:** Acme Corp wants to proceed
> **New:** Two leads came in, one looks strong
> **Brewing:** Strategy Brief suggests revisiting pricing"

### 2.6 Copilot as Human-in-the-Loop

The copilot is **woven into the narrative**, not a separate chatbot:

| Chatbot Pattern (NOT this) | Human-in-the-Loop (THIS) |
|----------------------------|--------------------------|
| Lives in widget, appears when called | Present in narrative, comments inline |
| "How can I help you?" | "I noticed this — here's what I think" |
| Reactive | Proactive (but not intrusive) |
| Separate from content | Part of the content |

Copilot suggestions appear as `💬` inline in the Chronicle, offering perspective and actions.

### 2.7 Narrative Language

All system copy uses narrative framing:

| Instead of... | Say... |
|---------------|--------|
| "Task completed" | "Resolved" or "Done" |
| "New notification" | "Something developed" |
| "Overdue" | "This thread needs attention" |
| "Dashboard" | "Your story today" |
| "History" | "Past chapters" |

---

## 3. Hierarchical Pulse

### 3.1 Core Concept

Every level of the hierarchy has its own Pulse view — a narrative summary of what's happening at that scope:

| Level | Pulse Shows | Who Sees It |
|-------|-------------|-------------|
| **Strategy Pulse** | What survived all 4 layers of filtering | Owner (landing page) |
| **Category Pulse** | What's happening in that category | Owner + Category specialists |
| **Sub-category Pulse** | What's happening in that sub-category | SPA header section |
| **Module Pulse** | What's happening in that module | Tab header or inline |

### 3.2 Landing Logic

| User Type | Permissions | Lands On |
|-----------|-------------|----------|
| Owner | Full access | Strategy Pulse |
| Marketing Lead | `view+edit+configure:marketing` | Marketing Pulse |
| Sales + Finance | `view:sales`, `view:finance` | Last used (Sales or Finance Pulse) |
| Invoicing Specialist | `view+edit:finance.invoicing` | Invoicing Pulse (sub-category) |

### 3.3 Pulse Structure

Each Pulse contains:

1. **Greeting** — Personalized, time-aware
2. **Developments** — What changed since last visit
3. **Inline Copilot** — Suggestions and context
4. **Story Arcs** — Ongoing threads at this scope
5. **Toggle** — Chronicle ↔ Efficiency switch

---

## 4. Navigation Architecture

### 4.1 No-Scroll Constraint

**The entire application is a full-screen experience with zero scrolling.**

This constraint forces:
- Disciplined information architecture
- Content density that fits viewport
- Progressive disclosure via navigation, not scroll
- Mobile requires fundamentally different layout

### 4.2 Sidebar Behavior

```
┌─────────────────────────────────────────────────────────────────────┐
│ HEADER: Logo | Search | [Copilot Widget] | [Settings] | [Profile]   │
├──────────┬──────────────────────────────────────────────────────────┤
│ SIDEBAR  │  SPA CONTENT AREA (80-90% of screen)                     │
│          │ ┌──────────────────────────────────────────────────────┐ │
│ Strategy │ │ [Tab: Invoicing] [Tab: Ledger] [Tab: Payroll] ...    │ │
│ ─────────│ ├──────────────────────────────────────────────────────┤ │
│ Marketing│ │                                                      │ │
│ ─────────│ │                                                      │ │
│ Sales    │ │           MODULE CONTENT (NO SCROLLING)              │ │
│ ─────────│ │                                                      │ │
│ Finance ←│ │                                                      │ │
│   └ Ops  │ │                                                      │ │
│   └ Tax  │ │                                                      │ │
│ ─────────│ │                                                      │ │
│ Ops      │ └──────────────────────────────────────────────────────┘ │
│ Team     │                                                          │
│ Legal    │                                                          │
└──────────┴──────────────────────────────────────────────────────────┘
```

**Rules:**
- **Categories only** in sidebar (7 items max)
- **Click category** → Sub-categories expand inline (only recommended + owned)
- **Click sub-category** → SPA loads in content area
- **Only ONE category expanded** at a time
- **Collapsible to icons** for maximum SPA space
- **Module tabs** at top of SPA (only recommended + owned)

### 4.3 Copilot Widget

A draggable widget that summons the context-relevant copilot:

**Collapsed State:**
- Small icon + notification badge
- User can drag/position anywhere on screen
- Context-aware (shows copilot relevant to current view)

**Expanded States:**
- **Panel mode:** Small section on right or bottom
- **Full mode:** Takes over main SPA content area

**Context Awareness:**
- In Finance SPA → Finance Copilot
- In Strategy Pulse → Strategy Copilot
- Each category/sub-category/module has its own copilot

---

## 5. Theme Architecture

### 5.1 Design Philosophy

Aesthetics drive initial adoption. Different users prefer different visual styles. Xentri offers multiple themes to match user preferences.

### 5.2 MVP Themes

| Theme | Modes | Description | Target User |
|-------|-------|-------------|-------------|
| **Modern** | Dark, Light | Conversational, gradient accents, immersive, chat-like copilot | Solo founders, younger users |
| **Power** | Dark, Light | Dense, high-contrast, minimal chrome, speed-focused | Power users, hours-in-app |

### 5.3 Future Themes

| Theme | Modes | Description | Target User |
|-------|-------|-------------|-------------|
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

### 5.5 Implementation

```css
/* Theme tokens - one source, multiple themes */
:root {
  /* Base tokens (theme-agnostic) */
  --radius-sm: 6px;
  --radius-md: 12px;

  /* Theme-specific tokens (overridden per theme) */
  --color-primary: var(--theme-primary);
  --color-surface: var(--theme-surface);
  --color-text: var(--theme-text);
  --font-body: var(--theme-font-body);
  --density: var(--theme-density); /* compact | comfortable */
}

[data-theme="modern-dark"] {
  --theme-primary: #e879f9;
  --theme-surface: #1c1921;
  --theme-density: comfortable;
}

[data-theme="power-dark"] {
  --theme-primary: #06b6d4;
  --theme-surface: #09090b;
  --theme-density: compact;
}
```

### 5.6 User Preference

- Theme preference stored per user (not per org)
- Default: Modern Dark
- Brief-aware suggestion: Copilot can recommend theme based on business type
- Toggle available in Settings

---

## 6. The Autonomy Policy Model

### 6.1 Core Concept: "Consent Once, Not Per-Action"

Traditional AI tools ask permission for every action. Xentri uses an **Autonomy Policy** model:
- User sets their comfort level once
- System operates within those boundaries
- User reviews exceptions, not every action

### 6.2 Three Presets

| Preset | Description | Behavior |
|--------|-------------|----------|
| **Conservative** | Xentri prepares, you approve | Auto-capture, auto-classify, auto-draft. Never auto-send. |
| **Balanced** (Default) | Auto-execute safe actions, batch review rest | Auto internal actions, batch review external, block risky |
| **Autonomous** | Maximum automation with undo window | Auto-execute low-risk external, 5-min undo window, block high-risk |

### 6.3 Risk Classification

| Risk Level | Examples | Behavior |
|------------|----------|----------|
| **Low** | Tagging, classifying, scheduling, internal notes | Auto-execute in Balanced+ |
| **Medium** | Lead replies (templated), follow-up emails | Auto-draft, or auto-send with undo in Autonomous |
| **High** | Payments, publishing, deletes, custom messages | Always requires approval |

### 6.4 Notification Budgets

| Channel | When Used | Example |
|---------|-----------|---------|
| **Interrupt** (Push) | High-risk actions needing approval | Payment failed, urgent lead |
| **Badge/Digest** | Medium-priority items | Drafts ready for review |
| **Timeline Only** | Low-priority, FYI | Auto-handled routine items |

Default budget: **5 high-priority items** in "Needs You" queue. Overflow goes to separate bucket.

### 6.5 Undo-First Execution

All actions follow the pattern: **Do → Toast → Undo window**

```
"Sent. Undo" (5 seconds)
```

---

## 7. Brief-Aware Personalization

### 7.1 Deep Personalization

Copilots don't just change labels — they **structurally configure** the system based on the Universal Brief:

| What Copilots Configure | Example |
|-------------------------|---------|
| **Pipeline stages** | Doctor: Inquiry → Consultation → Treatment → Care |
| **Database columns** | Hotel: Room Type, Check-in Date, Guest Preferences |
| **Role suggestions** | Restaurant: Chef, Server, Host |
| **Module recommendations** | Agency: Project Management surfaces first |
| **Workflows & defaults** | Startup: Fast follow-up cadence |

### 7.2 "One Question, Not Fifty"

Instead of asking users to configure everything:

> *"Based on your Brief, I've set up your CRM with these stages: Inquiry → Consultation → Treatment Plan → Ongoing Care. Does this match how you work?"*

The system proposes intelligent defaults; the user adjusts.

### 7.3 Role Suggestions

When a new organization is created, the Strategy Copilot suggests roles tailored to that business type:

- Restaurant → Chef, Server, Host, Manager
- Startup → Sales Rep, Developer, Designer
- Agency → Account Manager, Creative, Strategist

---

## 8. Design System Foundation

### 8.1 Design System Choice

**shadcn/ui** — Tailwind-native, copy-paste components built on Radix primitives.

**Rationale:**
- Tailwind integration matches Xentri's stack (Astro Shell + React Islands)
- Full customization control (no vendor CSS overrides)
- Accessible by default via Radix primitives
- Strong community, excellent documentation
- AI-friendly (v0, Bolt, Cursor all understand it)

### 8.2 4-Layer Neutral System

| Layer | Purpose |
|-------|---------|
| **Base** | App background, deepest layer |
| **Chrome** | Navigation, sidebars, headers |
| **Surface** | Content cards, panels |
| **Surface+** | Elevated, focused, hover states |

Exact colors defined per theme in CSS variables.

### 8.3 Content Canvas Pattern

To avoid "card-on-card" ambiguity:

1. **Base** background for the viewport
2. **One bordered Surface panel** for the content canvas
3. **Cards inside** sit directly on Surface (no extra border, or very subtle)
4. **Modals/sheets** use Surface+ with shadow

---

## 9. UX Patterns & Components

### 9.1 Exception Cards

Cards for items needing user attention. Visual status via left border:

| Border Color | Status | Meaning |
|--------------|--------|---------|
| Warning (yellow) | Needs Review | Draft ready for approval |
| Error (red) | Blocked | Requires action to proceed |
| Success (green) | Auto-executed | FYI, completed automatically |
| Info (blue) | Quarantine | Needs classification |

### 9.2 Toast Pattern (Undo-First)

```
┌─────────────────────────────────────────┐
│ ✓  Sent reply to Sarah.            Undo │
└─────────────────────────────────────────┘
```

- Duration: 5 seconds
- Always shows undo option
- Success state with green left accent

### 9.3 Autonomy Badge

Shows current autopilot status in header:

| State | Color | Label |
|-------|-------|-------|
| Healthy | Green | "High" or "Balanced" |
| Degraded | Yellow | "Degraded" |
| Limited | Red | "Limited" |

### 9.4 Policy Sliders

For adjusting autonomy levels:

```
Autonomy Level                    Auto-send
├────────────────────────────────●────┤
Suggest       Auto-draft       Auto-send
```

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

---

## 10. Responsive Strategy

### 10.1 Desktop (≥1024px)

- **Layout:** Collapsible sidebar + Content canvas (no scroll)
- **Navigation:** Full nav tree, one category expanded at a time
- **Detail Panel:** Inline (master-detail pattern)
- **Copilot:** Widget or inline in narrative

### 10.2 Tablet (768-1023px)

- **Layout:** Icon sidebar + Content
- **Navigation:** Tap category to expand
- **Detail Panel:** Slide-over sheet
- **Copilot:** Widget only

### 10.3 Mobile (<768px)

- **Layout:** Full-width content, bottom nav
- **Navigation:** Bottom sheet
- **Detail Panel:** Full-screen modal
- **Copilot:** Bottom-right widget
- **Note:** Different information architecture required (separate design)

### 10.4 Accessibility

- WCAG 2.1 AA compliance target
- Radix primitives handle keyboard navigation, focus management, ARIA
- Color contrast ratios: 4.5:1 minimum for text
- Touch targets: 44px minimum
- Motion: Respect prefers-reduced-motion

---

## 11. User Journey Flows

### 11.1 Journey 1: First-Time User

**Goal:** "Consent once, stay calm" — smart defaults + single Autopilot Setup + Training Wheels.

**Flow:**
```
Sign Up → Strategy Co-pilot → Build Brief → Autopilot Setup → Training Wheels → Chronicle
```

**Training Wheels Mode:**
- Duration: First 24 hours OR first 10 actions (whichever comes later)
- All actions = Draft + Review
- Auto-exit after 24h + 10 actions with <80% edit rate

### 11.2 Journey 2: The Daily Loop

**Goal:** "I know my story" — read your chapter, handle what matters, trust the rest.

**Core Loop:**
```
Open Chronicle → Read "Since Yesterday" → Handle exceptions → Check Story Arcs → Close
```

**States:**
1. **Calm State** — Nothing needs you, agents healthy
2. **Active State** — Exceptions need attention
3. **Degraded State** — Agents running in safe mode
4. **Overflow State** — More items than budget allows

### 11.3 Journey 3: Lead Capture (Deferred)

> **Status:** Deferred pending Epic 2+ definition.

---

## 12. Microcopy Guide

### 12.1 Voice & Tone

- **Calm, not cold** — Professional behavior, warm personality
- **Narrative, not transactional** — Tell the story, don't list facts
- **Confident, not arrogant** — "Xentri handled this" not "AI magic"

### 12.2 Key Copy

| Context | Copy |
|---------|------|
| Tagline | "Your business, finally visible." |
| Chronicle greeting | "Good morning, Carlo. Here's your story today." |
| Empty state | "You're all caught up. Your story continues tomorrow." |
| Session bridge | "Welcome back. Here's what developed while you were away." |
| Story arc label | "Ongoing threads" or "Active arcs" |
| Copilot inline | 💬 prefix, conversational tone |

---

## Appendix

### Related Documents

- Product Requirements: [prd.md](./prd.md)
- Product Brief: [product-brief.md](./product-brief.md)
- Epics: [epics.md](./epics.md)
- Architecture: [architecture.md](./architecture.md)
- Architectural Notes (pending integration): [ux-review-architectural-notes.md](./ux-review-architectural-notes.md)

### Interactive Deliverables

| Artifact | Path | Contents |
|----------|------|----------|
| **Design Directions** | [ux-design-directions.html](./ux/ux-design-directions.html) | 7 visual direction explorations |
| Color Themes | [ux-color-themes-v2.html](./ux/ux-color-themes-v2.html) | Blue options on Dusk base |
| Daily Loop Wireframes | [ux-daily-loop-wireframes-v2.html](./ux/ux-daily-loop-wireframes-v2.html) | 4-layer system + 6 specs |
| First-Time User Journey | [ux-journey-1-ftu.html](./ux/ux-journey-1-ftu.html) | Complete FTU flow |

### Design Decisions Log

| Decision | Chosen | Rationale |
|----------|--------|-----------|
| Default View | Chronicle (narrative) | Differentiator; story > dashboard |
| Toggle | Chronicle ↔ Efficiency | Power users need density option |
| Copilot Pattern | Human-in-the-loop (inline) | Colleague, not chatbot |
| Navigation | Categories → Sub-cats → Tabs | No-scroll constraint |
| Sidebar | Collapsible, one expanded | Maximum SPA space |
| Themes (MVP) | Modern + Power (dark/light) | Different user preferences |
| Theme Default | Modern Dark | Immersive, differentiated |
| Story Arcs | First-class UI element | Narrative continuity |
| Design System | shadcn/ui | Tailwind-native, customizable |
| Default Preset | Balanced | Auto-execute safe, review external |

### Version History

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2025-11-25 | 1.0 | Initial UX Design Specification | UX Designer + PM |
| 2025-11-25 | 1.1 | Tightened specs for Notification Hell prevention | UX Designer + PM |
| 2025-11-26 | 1.2 | Changed default preset to Balanced; confirmed shadcn/ui | Carlo + Winston |
| 2025-11-28 | 1.3 | Marked Journey 3 deferred; fixed paths | Carlo |
| 2025-12-01 | **2.0** | **Major revision:** Narrative Continuity philosophy, Chronicle-first default, Hierarchical Pulse, Story Arcs, Theme Architecture (Modern/Power/Traditional), No-scroll constraint, CEO mental model, Copilot as human-in-the-loop, Brief-aware deep personalization | Carlo + Sally (UX Designer) |

---

_This UX Design Specification was created through collaborative design facilitation. All decisions were made with user input and are documented with rationale._
