---
entity_type: constitution
document_type: ux-design
title: "Xentri System UX Design"
description: "System-wide UX principles, design system foundations, and interaction patterns that all categories must follow."
version: "2.2"
status: approved
created: 2025-11-25
updated: 2025-12-03
---

# Xentri UX Design Specification (System Constitution)

_Created: 2025-11-25_
_Major Revision: 2025-12-01 (v2.0 - Narrative Continuity & Theme Architecture)_
_Level: System (applies to ALL categories)_
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
| **Soul-Aware** | Deep personalization — structure adapts, not just labels |

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
> **Brewing:** Strategy Soul suggests revisiting pricing"

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
- Soul-aware suggestion: Copilot can recommend theme based on business type
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

## 7. Soul-Aware Personalization

### 7.1 Deep Personalization

Copilots don't just change labels — they **structurally configure** the system based on the Universal Soul:

| What Copilots Configure | Example |
|-------------------------|---------|
| **Pipeline stages** | Doctor: Inquiry → Consultation → Treatment → Care |
| **Database columns** | Hotel: Room Type, Check-in Date, Guest Preferences |
| **Role suggestions** | Restaurant: Chef, Server, Host |
| **Module recommendations** | Agency: Project Management surfaces first |
| **Workflows & defaults** | Startup: Fast follow-up cadence |

### 7.2 "One Question, Not Fifty"

Instead of asking users to configure everything:

> *"Based on your Soul, I've set up your CRM with these stages: Inquiry → Consultation → Treatment Plan → Ongoing Care. Does this match how you work?"*

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

**Version:** shadcn/ui with Tailwind v4 + Radix UI primitives (latest stable as of 2025-01)

**Rationale:**
- Tailwind integration matches Xentri's stack (Astro Shell + React Islands)
- Full customization control (no vendor CSS overrides)
- Accessible by default via Radix primitives
- Strong community, excellent documentation
- AI-friendly (v0, Bolt, Cursor all understand it)

### 8.2 Component Inventory

**From shadcn/ui (used as-is or lightly customized):**

| Component | Usage | Customization |
|-----------|-------|---------------|
| Button | All actions | Theme colors, density variants |
| Card | Exception cards, content panels | Left border status indicator |
| Dialog | Confirmations, detail views | Surface+ background |
| Dropdown Menu | Context menus, actions | Theme styling |
| Input | Form fields | Validation states |
| Label | Form labels | Typography scale |
| Select | Dropdowns | Theme styling |
| Sheet | Mobile/tablet slide-overs | Side positioning |
| Slider | Policy adjusters | Custom track styling |
| Switch | Toggles | Theme colors |
| Tabs | Module navigation | Active state styling |
| Toast | Undo-first feedback | Green accent, undo action |
| Tooltip | Contextual help | Theme styling |

**Custom Components (Xentri-specific):**

| Component | Purpose | Specification Section |
|-----------|---------|----------------------|
| Exception Card | Status-aware action cards | 9.1 |
| Autonomy Badge | Autopilot health indicator | 9.3 |
| Policy Slider | 3-position autonomy control | 9.4 |
| Chronicle View | Narrative landing experience | 2.2 |
| Efficiency View | Dense alternative landing | 2.3 |
| Story Arc | Progress visualization | 2.4 |
| Copilot Widget | Draggable AI assistant | 4.3 |
| Pulse Header | Scope-aware greeting + summary | 3.3 |

### 8.3 Color System

#### 8.3.1 4-Layer Neutral System

| Layer | Purpose |
|-------|---------|
| **Base** | App background, deepest layer |
| **Chrome** | Navigation, sidebars, headers |
| **Surface** | Content cards, panels |
| **Surface+** | Elevated, focused, hover states |

#### 8.3.2 Theme Color Palettes

**Modern Theme (Dark):**

| Token | Value | Usage |
|-------|-------|-------|
| `--color-base` | `#0a0a0f` | App background |
| `--color-chrome` | `#12121a` | Sidebar, header |
| `--color-surface` | `#1c1921` | Cards, panels |
| `--color-surface-plus` | `#252330` | Hover, elevated |
| `--color-primary` | `#e879f9` | Primary actions, links |
| `--color-primary-hover` | `#f0abfc` | Primary hover state |
| `--color-text` | `#fafafa` | Primary text |
| `--color-text-muted` | `#a1a1aa` | Secondary text |
| `--color-border` | `#27272a` | Dividers, borders |
| `--color-focus` | `#e879f9` | Focus ring |

**Modern Theme (Light):**

| Token | Value | Usage |
|-------|-------|-------|
| `--color-base` | `#fafafa` | App background |
| `--color-chrome` | `#f4f4f5` | Sidebar, header |
| `--color-surface` | `#ffffff` | Cards, panels |
| `--color-surface-plus` | `#f4f4f5` | Hover, elevated |
| `--color-primary` | `#c026d3` | Primary actions, links |
| `--color-primary-hover` | `#a21caf` | Primary hover state |
| `--color-text` | `#18181b` | Primary text |
| `--color-text-muted` | `#71717a` | Secondary text |
| `--color-border` | `#e4e4e7` | Dividers, borders |
| `--color-focus` | `#c026d3` | Focus ring |

**Power Theme (Dark):**

| Token | Value | Usage |
|-------|-------|-------|
| `--color-base` | `#09090b` | App background |
| `--color-chrome` | `#0f0f12` | Sidebar, header |
| `--color-surface` | `#18181b` | Cards, panels |
| `--color-surface-plus` | `#27272a` | Hover, elevated |
| `--color-primary` | `#06b6d4` | Primary actions, links |
| `--color-primary-hover` | `#22d3ee` | Primary hover state |
| `--color-text` | `#fafafa` | Primary text |
| `--color-text-muted` | `#a1a1aa` | Secondary text |
| `--color-border` | `#3f3f46` | Dividers, borders |
| `--color-focus` | `#06b6d4` | Focus ring |

**Power Theme (Light):**

| Token | Value | Usage |
|-------|-------|-------|
| `--color-base` | `#fafafa` | App background |
| `--color-chrome` | `#f4f4f5` | Sidebar, header |
| `--color-surface` | `#ffffff` | Cards, panels |
| `--color-surface-plus` | `#e4e4e7` | Hover, elevated |
| `--color-primary` | `#0891b2` | Primary actions, links |
| `--color-primary-hover` | `#0e7490` | Primary hover state |
| `--color-text` | `#18181b` | Primary text |
| `--color-text-muted` | `#52525b` | Secondary text |
| `--color-border` | `#d4d4d8` | Dividers, borders |
| `--color-focus` | `#0891b2` | Focus ring |

#### 8.3.3 Semantic Colors

These colors have consistent meaning across all themes:

| Token | Dark Mode | Light Mode | Usage |
|-------|-----------|------------|-------|
| `--color-success` | `#22c55e` | `#16a34a` | Success states, positive actions |
| `--color-success-bg` | `#052e16` | `#dcfce7` | Success background |
| `--color-warning` | `#eab308` | `#ca8a04` | Warnings, caution states |
| `--color-warning-bg` | `#422006` | `#fef9c3` | Warning background |
| `--color-error` | `#ef4444` | `#dc2626` | Errors, destructive actions |
| `--color-error-bg` | `#450a0a` | `#fee2e2` | Error background |
| `--color-info` | `#3b82f6` | `#2563eb` | Informational, neutral alerts |
| `--color-info-bg` | `#172554` | `#dbeafe` | Info background |

#### 8.3.4 CSS Implementation

```css
/* Modern Dark Theme (Default) */
:root, [data-theme="modern-dark"] {
  /* Neutrals */
  --color-base: #0a0a0f;
  --color-chrome: #12121a;
  --color-surface: #1c1921;
  --color-surface-plus: #252330;

  /* Brand */
  --color-primary: #e879f9;
  --color-primary-hover: #f0abfc;

  /* Text */
  --color-text: #fafafa;
  --color-text-muted: #a1a1aa;

  /* UI */
  --color-border: #27272a;
  --color-focus: #e879f9;

  /* Semantic */
  --color-success: #22c55e;
  --color-success-bg: #052e16;
  --color-warning: #eab308;
  --color-warning-bg: #422006;
  --color-error: #ef4444;
  --color-error-bg: #450a0a;
  --color-info: #3b82f6;
  --color-info-bg: #172554;
}

[data-theme="modern-light"] {
  --color-base: #fafafa;
  --color-chrome: #f4f4f5;
  --color-surface: #ffffff;
  --color-surface-plus: #f4f4f5;
  --color-primary: #c026d3;
  --color-primary-hover: #a21caf;
  --color-text: #18181b;
  --color-text-muted: #71717a;
  --color-border: #e4e4e7;
  --color-focus: #c026d3;
  --color-success: #16a34a;
  --color-success-bg: #dcfce7;
  --color-warning: #ca8a04;
  --color-warning-bg: #fef9c3;
  --color-error: #dc2626;
  --color-error-bg: #fee2e2;
  --color-info: #2563eb;
  --color-info-bg: #dbeafe;
}

[data-theme="power-dark"] {
  --color-base: #09090b;
  --color-chrome: #0f0f12;
  --color-surface: #18181b;
  --color-surface-plus: #27272a;
  --color-primary: #06b6d4;
  --color-primary-hover: #22d3ee;
  --color-text: #fafafa;
  --color-text-muted: #a1a1aa;
  --color-border: #3f3f46;
  --color-focus: #06b6d4;
}

[data-theme="power-light"] {
  --color-base: #fafafa;
  --color-chrome: #f4f4f5;
  --color-surface: #ffffff;
  --color-surface-plus: #e4e4e7;
  --color-primary: #0891b2;
  --color-primary-hover: #0e7490;
  --color-text: #18181b;
  --color-text-muted: #52525b;
  --color-border: #d4d4d8;
  --color-focus: #0891b2;
}
```

### 8.4 Typography System

**Font Families:**

| Role | Modern Theme | Power Theme | Fallback |
|------|--------------|-------------|----------|
| **Heading** | Cal Sans | Inter | system-ui, sans-serif |
| **Body** | Inter | Inter | system-ui, sans-serif |
| **Monospace** | JetBrains Mono | JetBrains Mono | ui-monospace, monospace |

**Type Scale (rem-based, 1rem = 16px):**

| Token | Size | Line Height | Weight | Usage |
|-------|------|-------------|--------|-------|
| `--text-xs` | 0.75rem (12px) | 1.5 | 400 | Captions, timestamps |
| `--text-sm` | 0.875rem (14px) | 1.5 | 400 | Secondary text, labels |
| `--text-base` | 1rem (16px) | 1.5 | 400 | Body text, inputs |
| `--text-lg` | 1.125rem (18px) | 1.5 | 500 | Emphasized body |
| `--text-xl` | 1.25rem (20px) | 1.4 | 600 | Card titles, section headers |
| `--text-2xl` | 1.5rem (24px) | 1.3 | 600 | Page section titles |
| `--text-3xl` | 1.875rem (30px) | 1.25 | 700 | Page titles |
| `--text-4xl` | 2.25rem (36px) | 1.2 | 700 | Hero text (Chronicle greeting) |

**Font Weights:**

| Weight | Token | Usage |
|--------|-------|-------|
| 400 | `--font-normal` | Body text, secondary content |
| 500 | `--font-medium` | Labels, emphasized body, buttons |
| 600 | `--font-semibold` | Headings, card titles |
| 700 | `--font-bold` | Page titles, strong emphasis |

**Theme Density Adjustments:**

| Theme | Body Size | Heading Adjustment | Line Height |
|-------|-----------|-------------------|-------------|
| Modern | 16px | Standard scale | 1.5 (relaxed) |
| Power | 14px | -1 step (smaller) | 1.4 (tighter) |

```css
/* Typography tokens */
:root {
  --font-heading: 'Cal Sans', 'Inter', system-ui, sans-serif;
  --font-body: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;
}

[data-theme="power-dark"], [data-theme="power-light"] {
  --font-heading: 'Inter', system-ui, sans-serif;
  --text-base: 0.875rem; /* 14px for density */
}
```

### 8.5 Content Canvas Pattern

To avoid "card-on-card" ambiguity:

1. **Base** background for the viewport
2. **One bordered Surface panel** for the content canvas
3. **Cards inside** sit directly on Surface (no extra border, or very subtle)
4. **Modals/sheets** use Surface+ with shadow

### 8.6 Spacing System

**Base Unit:** 4px

All spacing derives from this base unit, creating visual rhythm and consistency across the interface.

**Spacing Scale:**

| Token | Value | Usage |
|-------|-------|-------|
| `--space-0` | 0px | Reset, no spacing |
| `--space-1` | 4px | Tight inline spacing (icon-text gap) |
| `--space-2` | 8px | Default inline spacing, input padding |
| `--space-3` | 12px | Compact component padding |
| `--space-4` | 16px | Default component padding, form gaps |
| `--space-5` | 20px | Card padding (compact) |
| `--space-6` | 24px | Card padding (default), section gaps |
| `--space-8` | 32px | Large section gaps |
| `--space-10` | 40px | Page section separation |
| `--space-12` | 48px | Major layout gaps |
| `--space-16` | 64px | Hero/feature spacing |

**Layout Grid:**

| Breakpoint | Columns | Gutter | Margin |
|------------|---------|--------|--------|
| Mobile (<768px) | 4 | 16px | 16px |
| Tablet (768-1023px) | 8 | 24px | 24px |
| Desktop (≥1024px) | 12 | 24px | 32px |

**Usage Guidelines:**

| Context | Recommended Spacing |
|---------|---------------------|
| Button padding (horizontal) | `--space-4` to `--space-6` |
| Button padding (vertical) | `--space-2` to `--space-3` |
| Card padding | `--space-5` (compact) or `--space-6` (default) |
| Form field gap | `--space-4` |
| Section gap (within card) | `--space-6` |
| Section gap (page level) | `--space-10` or `--space-12` |
| Inline icon-text | `--space-1` or `--space-2` |

**Density Adjustments:**

| Theme | Spacing Multiplier | Effect |
|-------|-------------------|--------|
| Modern | 1.0x (default) | Comfortable, breathing room |
| Power | 0.75x | Tighter, more information density |

```css
/* Spacing tokens */
:root {
  --space-unit: 4px;
  --space-1: calc(var(--space-unit) * 1);   /* 4px */
  --space-2: calc(var(--space-unit) * 2);   /* 8px */
  --space-3: calc(var(--space-unit) * 3);   /* 12px */
  --space-4: calc(var(--space-unit) * 4);   /* 16px */
  --space-5: calc(var(--space-unit) * 5);   /* 20px */
  --space-6: calc(var(--space-unit) * 6);   /* 24px */
  --space-8: calc(var(--space-unit) * 8);   /* 32px */
  --space-10: calc(var(--space-unit) * 10); /* 40px */
  --space-12: calc(var(--space-unit) * 12); /* 48px */
  --space-16: calc(var(--space-unit) * 16); /* 64px */
}

[data-theme*="power"] {
  --space-unit: 3px; /* 0.75x density */
}
```

---

## 9. UX Patterns & Components

### 9.1 Exception Cards

Cards for items needing user attention. Visual status via left border.

**Status Types:**

| Border Color | Status | Meaning | Icon |
|--------------|--------|---------|------|
| Warning (yellow) | Needs Review | Draft ready for approval | ⏳ |
| Error (red) | Blocked | Requires action to proceed | ⚠️ |
| Success (green) | Auto-executed | FYI, completed automatically | ✓ |
| Info (blue) | Quarantine | Needs classification | ❓ |

**Card Structure:**

```
┌────┬────────────────────────────────────────────────────────────┐
│ ▌  │ [Icon] Title                                    [Timestamp]│
│ ▌  │ Description or preview text                                │
│ ▌  │                                                            │
│ ▌  │                        [Secondary Action]  [Primary Action]│
└────┴────────────────────────────────────────────────────────────┘
  ↑
  Status border (4px)
```

**Card States:**

| State | Visual Treatment |
|-------|------------------|
| Default | Standard appearance |
| Hover | Subtle background shift, shadow increase |
| Selected | Primary color border highlight |
| Expanded | Full content visible, actions prominent |
| Collapsed | Preview only, actions hidden |
| Loading | Content shimmer, actions disabled |
| Disabled | 50% opacity, no interactions |

**Card Variants:**

| Variant | Use Case | Behavior |
|---------|----------|----------|
| **Compact** | Lists, mobile | Single line, minimal info |
| **Standard** | Default | Title + description + actions |
| **Expanded** | Detail view | Full content, all metadata |
| **Inline** | Within Chronicle | No card chrome, embedded |

**Accessibility:**
- `role="article"` for semantic grouping
- Status announced via `aria-label`
- Actions have descriptive labels
- Focus visible on card and actions separately

### 9.2 Toast Pattern (Undo-First)

```
┌─────────────────────────────────────────┐
│ ✓  Sent reply to Sarah.            Undo │
└─────────────────────────────────────────┘
```

**Toast Types:**

| Type | Icon | Border | Duration | Use Case |
|------|------|--------|----------|----------|
| Success | ✓ | Green | 5s | Action completed |
| Error | ✗ | Red | Persistent | Action failed |
| Warning | ⚠ | Yellow | 8s | Action needs attention |
| Info | ℹ | Blue | 5s | Informational |
| Loading | ⟳ | None | Until complete | In progress |

**Toast States:**

| State | Behavior |
|-------|----------|
| Entering | Slide in from bottom-right, fade in |
| Visible | Static, timer counting |
| Hovering | Timer paused, undo button highlighted |
| Exiting | Fade out, slide down |
| Dismissed | Immediate removal (via X or undo) |

**Toast Variants:**

| Variant | Description |
|---------|-------------|
| **With Undo** | Shows Undo button, action reversible |
| **With Action** | Custom action button (e.g., "View") |
| **Simple** | Message only, no actions |
| **Persistent** | No auto-dismiss, requires manual close |

**Stacking Behavior:**
- Max 3 visible toasts
- Newest at bottom
- Older toasts compress/fade
- Overflow: Show count badge "+2 more"

**Accessibility:**
- `role="status"` for non-urgent, `role="alert"` for errors
- `aria-live="polite"` (or `assertive` for errors)
- Focus moves to toast on error
- Undo actionable via keyboard

### 9.3 Autonomy Badge

Shows current autopilot status in header.

**Badge States:**

| State | Color | Label | Icon | Meaning |
|-------|-------|-------|------|---------|
| Healthy | Green | "High" / "Balanced" | ● | All systems operational |
| Degraded | Yellow | "Degraded" | ◐ | Some features limited |
| Limited | Red | "Limited" | ○ | Manual mode required |

**Badge Structure:**

```
┌─────────────────────┐
│ ●  Balanced    ▾   │
└─────────────────────┘
```

**Interactions:**
- **Hover:** Tooltip with current policy summary
- **Click:** Opens Autonomy Settings panel
- **Dropdown (▾):** Quick-switch between presets

**Badge Variants:**

| Variant | Use Case |
|---------|----------|
| **Full** | Desktop header, shows label |
| **Compact** | Mobile/tablet, icon only |
| **Inline** | Within settings, expanded info |

**Accessibility:**
- `role="status"` for live updates
- Color + icon + label (never color alone)
- Focusable, activates dropdown

### 9.4 Policy Sliders

For adjusting autonomy levels.

**Slider Structure:**

```
Autonomy Level                    Auto-send
├────────────────────────────────●────┤
Suggest       Auto-draft       Auto-send
   ↑              ↑                ↑
 Position 1   Position 2      Position 3
```

**Slider States:**

| State | Visual Treatment |
|-------|------------------|
| Default | Track visible, thumb at current position |
| Hover | Track highlighted, cursor changes |
| Active/Dragging | Thumb enlarged, position label visible |
| Focus | Focus ring around thumb |
| Disabled | 50% opacity, no interaction |

**Slider Types:**

| Type | Positions | Use Case |
|------|-----------|----------|
| **Autonomy** | 3 (Conservative, Balanced, Autonomous) | Global preset |
| **Action-Level** | 3 (Suggest, Auto-draft, Auto-send) | Per-action type |
| **Continuous** | 0-100 | Percentage thresholds |

**Keyboard Navigation:**
- Left/Right arrows move between positions
- Home/End jump to min/max
- Step-by-step announcements

**Accessibility:**
- `role="slider"` with `aria-valuemin`, `aria-valuemax`, `aria-valuenow`
- `aria-valuetext` for human-readable position (e.g., "Balanced")
- Labels visible and linked

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

**Button Variants:**

| Variant | Appearance | Usage | Example |
|---------|------------|-------|---------|
| **Primary** | Solid fill, high contrast | Main action per context | "Send Reply", "Save" |
| **Secondary** | Outline/border only | Supporting actions | "Cancel", "View Details" |
| **Tertiary** | Text only, no border | Inline/low-emphasis actions | "Learn more", "Skip" |
| **Destructive** | Red fill or outline | Dangerous/irreversible actions | "Delete", "Remove" |
| **Ghost** | Transparent, icon-only | Toolbar actions, compact UI | Icon buttons in header |

**Button States:**

| State | Visual Treatment |
|-------|------------------|
| Default | Standard appearance |
| Hover | Subtle brightness/opacity shift |
| Active/Pressed | Darker shade, slight scale reduction |
| Focus | 2px ring using `--color-focus` (visible focus indicator) |
| Disabled | 50% opacity, cursor: not-allowed |
| Loading | Spinner replaces text or icon, disabled state |

**Button Sizes (follows density):**

| Size | Height | Padding | Font Size | Usage |
|------|--------|---------|-----------|-------|
| `sm` | 32px | 12px 16px | 14px | Inline, compact areas |
| `md` | 40px | 16px 24px | 16px | Default for most contexts |
| `lg` | 48px | 20px 32px | 18px | Primary CTAs, mobile |

**Usage Rules:**
- One primary button per visible context
- Destructive actions always require confirmation (see 9.11)
- Icon-only buttons require tooltip
- Loading state shows spinner; never double-submit

### 9.8 Form Patterns

**Form Layout:**

```
┌─────────────────────────────────────────────────────────────┐
│ Label *                                                      │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Input value                                             │ │
│ └─────────────────────────────────────────────────────────┘ │
│ Helper text or validation message                            │
└─────────────────────────────────────────────────────────────┘
```

**Form Field Structure:**
1. **Label** — Always above input, never floating
2. **Required indicator** — Asterisk (*) after label
3. **Input** — Full width within container
4. **Helper text** — Below input, muted color
5. **Validation message** — Replaces helper text on error

**Validation States:**

| State | Border Color | Icon | Message Color |
|-------|--------------|------|---------------|
| Default | `--color-border` | None | N/A |
| Focus | `--color-primary` | None | N/A |
| Valid | `--color-success` | ✓ (optional) | Green |
| Error | `--color-error` | ✗ | Red |
| Warning | `--color-warning` | ⚠ | Yellow |

**Validation Timing:**
- Validate on blur (not on every keystroke)
- Show errors immediately after first blur
- Clear errors as user types valid input
- Validate entire form on submit attempt

**Form Accessibility:**
- Labels linked to inputs via `htmlFor`/`id`
- Error messages linked via `aria-describedby`
- Required fields use `aria-required="true"`
- Invalid fields use `aria-invalid="true"`
- Focus moves to first error on submit failure

**Common Form Patterns:**

| Pattern | Behavior |
|---------|----------|
| **Inline edit** | Click to edit, blur to save, Escape to cancel |
| **Auto-save** | Save on blur with debounce, show "Saved" toast |
| **Multi-step** | Progress indicator, back/next buttons, validation per step |
| **Confirmation field** | Match against original (passwords, emails) |

### 9.9 Modal Pattern

**Modal Types:**

| Type | Size | Use Case | Close Behavior |
|------|------|----------|----------------|
| **Alert** | sm (400px) | Simple messages, errors | Click outside, Escape, X |
| **Confirm** | sm (400px) | Destructive action confirmation | Explicit button only |
| **Dialog** | md (560px) | Forms, detail views | Escape, X (warn if unsaved) |
| **Panel** | lg (800px) | Complex editing, previews | Escape, X (warn if unsaved) |
| **Fullscreen** | 100% | Immersive tasks (on mobile) | Explicit close button |

**Modal Structure:**

```
┌─────────────────────────────────────────────────────────────┐
│ Title                                                    [X] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                     Modal Content                           │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                              [Secondary]  [Primary Action]   │
└─────────────────────────────────────────────────────────────┘
```

**Modal Behavior:**
- Backdrop: Semi-transparent overlay, click dismisses (except Confirm)
- Focus trap: Tab cycles within modal
- Focus return: Return focus to trigger element on close
- Scroll lock: Body scroll disabled while open
- Stacking: Max 2 modals deep (avoid modal-from-modal)
- Animation: Fade in + slight scale (respect prefers-reduced-motion)

**Modal Accessibility:**
- `role="dialog"` with `aria-modal="true"`
- `aria-labelledby` pointing to title
- Focus moves to first focusable element (or close button)
- Escape key closes (announce action)

### 9.10 Search Pattern

**Search Trigger:**
- Header search icon opens command palette (Cmd/Ctrl + K)
- Inline search fields for scoped searches (within tables, lists)

**Global Search (Command Palette):**

```
┌─────────────────────────────────────────────────────────────┐
│ 🔍  Search Xentri...                                        │
├─────────────────────────────────────────────────────────────┤
│ RECENT                                                      │
│   📄 Acme Corp                                    Contact   │
│   📊 Q4 Revenue                                  Story Arc  │
├─────────────────────────────────────────────────────────────┤
│ ACTIONS                                                     │
│   ➕ Create new contact                          Cmd + N    │
│   📋 Go to Chronicles                            Cmd + H    │
└─────────────────────────────────────────────────────────────┘
```

**Search Behavior:**
- Instant results (debounced 150ms)
- Category grouping (Contacts, Arcs, Actions, Settings)
- Keyboard navigation (arrows, Enter to select)
- Result type icons for visual scanning
- No results: Show "No results for '[query]'" + suggestions

**Inline Search (Tables/Lists):**

```
┌─────────────────────────────────────────────────────────────┐
│ 🔍  Filter contacts...                              [Clear] │
└─────────────────────────────────────────────────────────────┘
```

- Filter as you type
- Clear button appears when input has value
- Show result count: "Showing 5 of 42"
- Persist filter in URL for shareability

### 9.11 Confirmation Pattern

**When to Confirm:**

| Action Type | Confirmation Required |
|-------------|----------------------|
| Delete/Remove | Always |
| Bulk operations (>5 items) | Always |
| Send external communication | If not auto-send policy |
| Payment/financial | Always (high-risk) |
| Permission changes | Always |
| Publish/make public | Always |
| Undo-able actions | Never (use toast with undo) |

**Confirmation Dialog:**

```
┌─────────────────────────────────────────────────────────────┐
│ Delete Contact                                           [X] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Are you sure you want to delete "Acme Corp"?                │
│                                                             │
│ This will remove all associated history and cannot be       │
│ undone.                                                     │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                   [Cancel]  [Delete]        │
└─────────────────────────────────────────────────────────────┘
```

**Confirmation Rules:**
- Title states the action clearly
- Body explains consequences
- Primary button matches action verb ("Delete", not "Confirm")
- Destructive actions use red primary button
- Cancel is always available
- No click-outside dismiss for destructive confirmations
- Double-confirm for critical actions (type to confirm)

### 9.12 Date/Time Pattern

**Date Formats:**

| Context | Format | Example |
|---------|--------|---------|
| **Display (relative)** | Smart relative | "Today", "Yesterday", "3 days ago" |
| **Display (absolute)** | MMM D, YYYY | "Dec 1, 2025" |
| **Display (with time)** | MMM D, YYYY h:mm A | "Dec 1, 2025 2:30 PM" |
| **Input** | YYYY-MM-DD | "2025-12-01" (ISO for parsing) |
| **Timestamp** | Relative + absolute on hover | "2 hours ago" → "Dec 1, 2025 10:30 AM" |

**Relative Time Thresholds:**

| Elapsed | Display |
|---------|---------|
| <1 min | "Just now" |
| 1-59 min | "X minutes ago" |
| 1-23 hours | "X hours ago" |
| 1-6 days | "X days ago" / "Yesterday" |
| 7-30 days | "Last week" / "2 weeks ago" |
| >30 days | Absolute date |

**Date Picker:**
- Calendar view with month navigation
- Today highlighted
- Range selection for reports/filters
- Quick presets: Today, Yesterday, Last 7 days, Last 30 days, Custom

**Timezone Handling:**
- Store all times in UTC
- Display in user's local timezone (detected or configured)
- Show timezone indicator for ambiguous times
- Chronicle greeting uses local time for "Good morning/afternoon/evening"

### 9.13 Empty State Pattern

Empty states communicate when there's no data to display and guide users toward meaningful action.

**Empty State Structure:**

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                         [Illustration]                      │
│                                                             │
│                     Primary Message                         │
│              Secondary explanatory text                     │
│                                                             │
│                    [Primary Action]                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Empty State Types:**

| Type | When Used | Tone | Example |
|------|-----------|------|---------|
| **First Use** | User hasn't created anything yet | Encouraging, welcoming | "No contacts yet. Add your first contact to get started." |
| **No Results** | Search/filter returned nothing | Helpful, suggestive | "No matches for 'acme'. Try a different search or clear filters." |
| **All Clear** | Work queue is empty | Celebratory, calm | "You're all caught up. Your story continues tomorrow." |
| **Error** | Data failed to load | Apologetic, actionable | "Couldn't load your invoices. Check your connection and try again." |
| **Permission** | User lacks access | Informative, helpful | "You don't have access to this area. Contact your admin for access." |

**Empty State Components:**

| Component | Requirement | Notes |
|-----------|-------------|-------|
| **Illustration** | Optional | Simple, on-brand graphic. 64-128px. |
| **Primary Message** | Required | Short, specific. What's missing. |
| **Secondary Text** | Recommended | Why it's empty or what to do. |
| **Primary Action** | Required (except All Clear) | Clear CTA to resolve the state. |
| **Secondary Action** | Optional | Alternative path (e.g., "Learn more"). |

**Empty State Guidelines:**

1. **Be specific** — "No invoices" not "Nothing here"
2. **Be helpful** — Always suggest what to do next
3. **Match the tone** — First Use = welcoming, Error = apologetic
4. **Don't blame** — "No results found" not "You didn't find anything"
5. **Use narrative language** — "Your story continues tomorrow" not "Queue empty"

**Accessibility:**

- Primary message uses `<h2>` or appropriate heading level
- Illustration has `alt=""` (decorative) or descriptive alt text if meaningful
- Action buttons follow button hierarchy
- Color not used alone to convey state

### 9.14 Notification Pattern

Notifications inform users of events, updates, and actions that occurred. This pattern defines the UI component; notification budgets are defined in section 6.4.

**Notification Types:**

| Type | Icon | Visual | Sound | Use Case |
|------|------|--------|-------|----------|
| **Interrupt** | 🔔 | Modal/Push | Optional | Urgent: payment failed, security alert |
| **Badge** | Dot/Count | Indicator on icon | None | Medium: drafts ready, messages received |
| **Toast** | Per status | Bottom-right overlay | None | Action feedback (see 9.2) |
| **Timeline** | Per event | Chronicle entry | None | FYI: auto-handled items |

**Notification Badge:**

```
┌──────────┐
│  🔔  ●3  │  ← Badge with count
└──────────┘
```

**Badge States:**

| Count | Display |
|-------|---------|
| 0 | No badge visible |
| 1-9 | Exact number |
| 10-99 | Exact number (smaller font) |
| 100+ | "99+" |

**Notification Center (Dropdown):**

```
┌─────────────────────────────────────────────────────────────┐
│ Notifications                               [Mark all read] │
├─────────────────────────────────────────────────────────────┤
│ ● Acme Corp responded to your proposal        2 hours ago   │
│   They want to discuss pricing.                             │
├─────────────────────────────────────────────────────────────┤
│ ○ Invoice #247 was paid                      Yesterday      │
│   $2,500 received from Beta Inc.                            │
├─────────────────────────────────────────────────────────────┤
│                     View all notifications                   │
└─────────────────────────────────────────────────────────────┘
```

**Notification Item Structure:**

| Element | Description |
|---------|-------------|
| **Read indicator** | ● unread, ○ read |
| **Title** | Event summary (max 60 chars) |
| **Description** | Additional context (optional, max 100 chars) |
| **Timestamp** | Relative time |
| **Actions** | Inline quick actions (optional) |

**Notification States:**

| State | Visual Treatment |
|-------|------------------|
| Unread | Bold title, filled indicator (●), subtle background |
| Read | Normal weight, hollow indicator (○), no background |
| Hover | Subtle highlight, show quick actions |
| Dismissed | Fade out animation |

**Notification Behavior:**

- **Grouping:** Similar notifications group (e.g., "3 new messages from Acme")
- **Auto-dismiss:** Read notifications auto-archive after 7 days
- **Persistence:** Unread notifications persist until read or dismissed
- **Overflow:** Beyond budget (5), shows "+X more in archive"

**Accessibility:**

- Notification count announced to screen readers on change
- `aria-live="polite"` for new notifications
- Notification center has `role="dialog"` when open
- Each notification is focusable and actionable via keyboard

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

**Compliance Target:** WCAG 2.1 AA

#### 10.4.1 Focus Management

**Focus Indicators:**
- All interactive elements have visible focus state
- Focus ring: 2px solid `--color-focus` with 2px offset
- Focus ring color meets 3:1 contrast against background
- Never remove focus outline without visible alternative

```css
:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}

/* High contrast mode */
@media (forced-colors: active) {
  :focus-visible {
    outline: 3px solid CanvasText;
  }
}
```

**Focus Order:**
- Logical tab order follows visual layout (left-to-right, top-to-bottom)
- Skip links: "Skip to main content" as first focusable element
- Focus trapped within modals/dialogs
- Focus returns to trigger element when modal closes

#### 10.4.2 Keyboard Navigation

**Global Shortcuts:**

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + K` | Open command palette |
| `Escape` | Close modal/menu, cancel action |
| `Tab` / `Shift+Tab` | Navigate forward/backward |
| `Enter` / `Space` | Activate button/link |
| `Arrow keys` | Navigate within menus, sliders |

**Component-Specific:**

| Component | Keys |
|-----------|------|
| Dropdown/Menu | Arrows navigate, Enter selects, Escape closes |
| Tabs | Left/Right arrows switch tabs |
| Modal | Tab trapped, Escape closes |
| Slider | Left/Right adjust value |
| Date Picker | Arrows navigate calendar, Enter selects |

#### 10.4.3 Screen Reader Support

**Semantic Structure:**
- Use semantic HTML (`<nav>`, `<main>`, `<article>`, `<aside>`)
- Heading hierarchy (h1 → h2 → h3) without skipping levels
- Landmark regions for major sections
- Lists for groups of related items

**ARIA Usage:**

| Element | ARIA Attributes |
|---------|-----------------|
| Modal | `role="dialog"`, `aria-modal="true"`, `aria-labelledby` |
| Toast | `role="status"`, `aria-live="polite"` |
| Error message | `role="alert"`, `aria-live="assertive"` |
| Loading | `aria-busy="true"`, `aria-live="polite"` |
| Expandable | `aria-expanded`, `aria-controls` |
| Tabs | `role="tablist"`, `role="tab"`, `role="tabpanel"` |

**Live Regions:**

| Priority | Attribute | Use Case |
|----------|-----------|----------|
| Polite | `aria-live="polite"` | Success messages, status updates |
| Assertive | `aria-live="assertive"` | Errors, urgent alerts |

**Screen Reader Announcements:**
- Form errors announced immediately
- Loading states announced ("Loading...", "Complete")
- Toast messages announced
- Navigation changes announced ("Navigated to Finance")

#### 10.4.4 Visual Accessibility

**Color Contrast:**

| Element | Minimum Ratio |
|---------|---------------|
| Body text | 4.5:1 |
| Large text (18px+ or 14px bold) | 3:1 |
| UI components (borders, icons) | 3:1 |
| Focus indicators | 3:1 |

**Color Independence:**
- Never use color alone to convey meaning
- Status indicators use icon + color + text
- Links use underline + color
- Form errors use icon + color + message

**Alt Text Strategy:**

| Image Type | Alt Text |
|------------|----------|
| Decorative | `alt=""` (empty, not omitted) |
| Informative | Describe content and purpose |
| Functional (button/link) | Describe action |
| Complex (charts/graphs) | Brief alt + detailed description nearby |
| User avatar | "[Name]'s avatar" or decorative if name shown |
| Logo | "Xentri logo" (or decorative if in header) |

#### 10.4.5 Form Accessibility

**Labels and Instructions:**
- Every input has visible label
- Required fields marked with * and `aria-required`
- Group related fields with `<fieldset>` and `<legend>`
- Helper text linked via `aria-describedby`

**Error Handling:**
- Error messages linked to inputs via `aria-describedby`
- Invalid inputs use `aria-invalid="true"`
- Error summary at top of form on submit
- Focus moves to first error
- Errors announced to screen readers

**Accessible Form Example:**
```html
<div class="form-field">
  <label for="email">Email address *</label>
  <input
    type="email"
    id="email"
    aria-required="true"
    aria-invalid="true"
    aria-describedby="email-error email-hint"
  />
  <span id="email-hint" class="hint">We'll never share your email</span>
  <span id="email-error" class="error" role="alert">
    Please enter a valid email address
  </span>
</div>
```

#### 10.4.6 Motion and Animation

**Reduced Motion:**
- Respect `prefers-reduced-motion: reduce`
- Essential animations (loading spinners) → reduce duration
- Non-essential animations → disable entirely
- No auto-playing video/animation
- Provide pause controls for any motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

#### 10.4.7 Testing Strategy

**Automated Testing:**
- ESLint plugin: `eslint-plugin-jsx-a11y`
- CI integration: axe-core via `@axe-core/react` or Playwright
- Lighthouse accessibility audit (target: 90+)
- Color contrast checker in design tools

**Manual Testing Checklist:**

| Test | Method |
|------|--------|
| Keyboard navigation | Tab through entire page without mouse |
| Screen reader | Test with VoiceOver (Mac) or NVDA (Windows) |
| Zoom | Test at 200% zoom, ensure no horizontal scroll |
| Color contrast | Verify with browser DevTools |
| Focus visibility | Ensure focus ring always visible |
| Touch targets | Verify 44px minimum on mobile |

**Testing Frequency:**
- Every PR: Automated checks
- Weekly: Manual keyboard navigation review
- Sprint: Full screen reader test of new features
- Quarterly: External accessibility audit

---

## 11. User Journey Flows

### 11.1 Journey 1: First-Time User

**Goal:** "Consent once, stay calm" — smart defaults + single Autopilot Setup + Training Wheels.

**Flow:**
```
Sign Up → Strategy Co-pilot → Build Soul → Autopilot Setup → Training Wheels → Chronicle
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

## 13. Inheritance Guidelines

This section defines what child entities (Infrastructure Modules, Strategic Containers, Coordination Units, Business Modules) can and cannot customize when implementing UX for their scope.

### 13.1 Immutable (Cannot Override)

These elements are system-wide constants. Child entities MUST use them exactly as specified:

| Element | Rationale |
|---------|-----------|
| **Color System** | Brand consistency, accessibility compliance |
| **Typography Scale** | Visual hierarchy, readability |
| **Font Families** | Brand identity, performance (font loading) |
| **Spacing Base Unit** (4px) | Visual rhythm, component alignment |
| **Accessibility Standards** | Legal/ethical compliance (WCAG 2.1 AA) |
| **Focus Indicators** | Accessibility, consistency |
| **Toast Pattern** | Undo-first philosophy, user expectation |
| **Modal Behavior** | Accessibility, focus management |
| **Button Hierarchy** | Action clarity, consistency |
| **Confirmation Pattern** | Preventing destructive errors |

### 13.2 Constrained (Can Extend, Cannot Contradict)

These elements can be extended with domain-specific additions, but the base definitions must remain intact:

| Element | What Children Can Do | What They Cannot Do |
|---------|---------------------|---------------------|
| **Exception Card Statuses** | Add domain-specific statuses | Remove or rename core statuses (warning, error, success, info) |
| **Form Validation States** | Add custom validation messages | Change validation timing or visual patterns |
| **Search Behavior** | Add domain-specific result types | Change keyboard navigation or result grouping pattern |
| **Date/Time Formats** | Add domain-specific formats | Override relative time thresholds |
| **Microcopy Voice** | Adapt terminology to domain | Contradict narrative-first tone |

### 13.3 Customizable (Full Child Control)

These elements are expected to vary by domain and are fully customizable within the constraints:

| Element | Customization Scope |
|---------|---------------------|
| **Story Arc Types** | Define domain-specific arcs (deals, projects, goals) |
| **Empty State Content** | Domain-specific messaging and CTAs |
| **Notification Content** | Domain-specific event descriptions |
| **Chronicle Greeting** | Domain-contextualized welcome messages |
| **Copilot Suggestions** | Domain-specific inline comments |
| **Quick Actions** | Domain-specific action buttons |
| **Data Visualizations** | Domain-specific charts, metrics, graphs |

### 13.4 Extension Points

Child entities can introduce new patterns not covered by this Constitution, provided they:

1. **Follow the Design System** — Use shadcn/ui components as base
2. **Respect Spacing/Typography** — Use defined tokens
3. **Meet Accessibility** — Maintain WCAG 2.1 AA compliance
4. **Document Thoroughly** — Add to their module's `ux-design.md`
5. **Avoid Conflicts** — Not contradict any immutable or constrained element

**Extension Registration:**

When a child entity creates a new pattern that could benefit siblings, they should:
1. Document it in their `ux-design.md`
2. Flag it to the Constitution maintainer for potential promotion
3. If promoted, it becomes part of the Constitution and applies system-wide

### 13.5 Theme Customization

| What Children Can Do | What They Cannot Do |
|----------------------|---------------------|
| Use any defined theme (Modern, Power) | Create new themes |
| Set default theme for their module | Override user's global preference |
| Suggest theme based on domain | Force a specific theme |

### 13.6 Inheritance Chain

```
Constitution (this document)
    ↓ INHERITS
Infrastructure Module / Strategic Container
    ↓ INHERITS
Coordination Unit (for Strategic Containers only)
    ↓ INHERITS
Business Module
```

Each level can ADD but never CONTRADICT its parent. When in doubt, the parent wins.

---

## Appendix

### Related Documents

- Product Requirements: [prd.md](./prd.md)
- Product Soul: [product-soul.md](./product-soul.md)
- Epics: [epics.md](./epics.md)
- Architecture: [architecture.md](./architecture.md)

### Interactive Deliverables

| Artifact | Path | Contents |
|----------|------|----------|
| **MVP Themes** | [ux-themes-mvp.html](./ux/ux-themes-mvp.html) | Modern + Power themes in dark/light (interactive) |
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
| 2025-12-01 | **2.0** | **Major revision:** Narrative Continuity philosophy, Chronicle-first default, Hierarchical Pulse, Story Arcs, Theme Architecture (Modern/Power/Traditional), No-scroll constraint, CEO mental model, Copilot as human-in-the-loop, Soul-aware deep personalization | Carlo + Sally (UX Designer) |
| 2025-12-01 | **2.1** | **Implementation readiness:** Added complete Typography system (fonts, scale, weights, line heights), Component Inventory with shadcn/ui version, Button Hierarchy, Form Patterns, Modal Pattern, Search Pattern, Confirmation Pattern, Date/Time Pattern, expanded Accessibility section (focus management, keyboard nav, screen reader support, alt text strategy, form a11y, testing strategy), full component state specifications (Exception Cards, Toast, Autonomy Badge, Policy Sliders) | Carlo + Sally (UX Designer) |
| 2025-12-02 | **2.2** | **Validation compliance:** Fixed frontmatter (entity_type, version, status, dates), added complete Spacing System (4px base, 11-token scale, layout grid), added Inheritance Guidelines (immutable/constrained/customizable rules, extension points), fixed visual artifact paths, added Empty State Pattern (5 types, components, guidelines), added Notification Pattern (types, badge, notification center), added concrete Color Palette values (4 themes with hex values, semantic colors, CSS implementation) | Carlo + Sally (UX Designer) |

---

_This UX Design Specification was created through collaborative design facilitation. All decisions were made with user input and are documented with rationale._
