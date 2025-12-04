---
entity_type: infrastructure_module
document_type: ux-design
module: shell
title: 'Shell Module UX Design'
description: 'Layout specifications, navigation patterns, sidebar behavior, and Copilot Widget for the Shell module.'
version: '2.0'
status: draft
created: '2025-12-03'
updated: '2025-12-03'
inherits_from:
  - 'docs/platform/ux-design.md'
---

# Shell Module - UX Design Specification

> **Entity Type:** Infrastructure Module
> **Module:** shell
> **Inherits From:** Constitution UX Design (docs/platform/ux-design.md)

---

## Overview

This document specifies UX patterns specific to the Shell module. The Shell provides the persistent chrome (header, sidebar) and orchestrates the no-scroll, full-screen experience.

**What this module defines:**

- Full-screen layout specifications
- Sidebar interaction patterns
- Header component specifications
- Copilot Widget integration
- Chronicle and Efficiency view layouts
- Responsive breakpoint behavior

**What this module inherits:**

- Design tokens (colors, typography, spacing) from ui module
- Core principles (Narrative First, No-Scroll, Chronicle Default)
- Theme architecture (Modern, Power, Traditional)

---

## Full-Screen Layout Specification

> **Migrated from Constitution UX Design §4**

### No-Scroll Constraint

**The entire application is a full-screen experience with zero scrolling.**

This constraint forces:

- Disciplined information architecture
- Content density that fits viewport
- Progressive disclosure via navigation, not scroll
- Mobile requires fundamentally different layout

### Layout Grid

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

### Dimension Constraints

| Element        | Collapsed             | Expanded     | Notes               |
| -------------- | --------------------- | ------------ | ------------------- |
| Header         | 48px                  | 56px         | Responsive          |
| Sidebar        | 64px (icons)          | 240px (full) | Animated transition |
| Main Content   | calc(100vw - sidebar) | —            | Fluid               |
| Copilot Widget | 48px icon             | 400px panel  | Draggable           |

---

## Sidebar Specification

> **Migrated from Constitution UX Design §4.2**

### Sidebar Rules

1. **Categories only** in sidebar (7 items max)
2. **Click category** → Sub-categories expand inline (only recommended + owned)
3. **Click sub-category** → SPA loads in content area
4. **Only ONE category expanded** at a time (accordion pattern)
5. **Collapsible to icons** for maximum SPA space
6. **Module tabs** at top of SPA (only recommended + owned)

### States

| State               | Appearance                            | Behavior                               |
| ------------------- | ------------------------------------- | -------------------------------------- |
| **Collapsed**       | Icon-only (64px)                      | Hover shows tooltip with category name |
| **Expanded**        | Full width (240px)                    | Shows category labels and sub-items    |
| **Category Active** | Highlighted icon + expanded sub-items | Only one category expanded at a time   |

### Interaction Patterns

| Action                | Result                                |
| --------------------- | ------------------------------------- |
| Click category icon   | Expand that category, collapse others |
| Click collapse button | Toggle sidebar width                  |
| Hover on collapsed    | Show tooltip with category name       |
| Click sub-item        | Navigate to that view, highlight      |

### Visual Hierarchy

```
┌──────────────────────┐
│ [Logo]               │  ← Brand mark
├──────────────────────┤
│ ● Strategy           │  ← Active category (expanded)
│   ├─ Pulse           │  ← Sub-items visible
│   ├─ Soul            │
│   └─ War Room        │
├──────────────────────┤
│ ○ Marketing          │  ← Inactive category (collapsed)
│ ○ Sales              │
│ ○ Finance            │
│ ○ Operations         │
│ ○ Team               │
│ ○ Legal              │
├──────────────────────┤
│ [Settings] [Collapse]│  ← Bottom actions
└──────────────────────┘
```

---

## Header Specification

### Layout

```
┌─────────────────────────────────────────────────────────────┐
│ [☰] [Breadcrumb / Current View]           [🔔] [🌙] [User] │
└─────────────────────────────────────────────────────────────┘
```

| Element       | Position    | Purpose                   |
| ------------- | ----------- | ------------------------- |
| Menu toggle   | Left        | Mobile: show/hide sidebar |
| Breadcrumb    | Left-center | Current location context  |
| Notifications | Right       | Unread count badge        |
| Theme toggle  | Right       | Light/dark switch         |
| User avatar   | Right       | Profile menu dropdown     |

### Responsive Behavior

| Breakpoint          | Sidebar                   | Header  |
| ------------------- | ------------------------- | ------- |
| Desktop (>1024px)   | Visible, collapsible      | Full    |
| Tablet (768-1024px) | Collapsed by default      | Full    |
| Mobile (<768px)     | Hidden, overlay on toggle | Compact |

---

## Copilot Widget Specification

> **Migrated from Constitution UX Design §4.3**

A draggable widget that summons the context-relevant copilot.

### Widget States

| State         | Size           | Behavior                            |
| ------------- | -------------- | ----------------------------------- |
| **Collapsed** | 48px circle    | Draggable, shows notification badge |
| **Panel**     | 400px sidebar  | Shares screen with main content     |
| **Full**      | 100% main area | Replaces main content temporarily   |

### Context Awareness

The widget shows the copilot relevant to the current view:

| Current View     | Copilot Shown       |
| ---------------- | ------------------- |
| Strategy Pulse   | Strategy Copilot    |
| Finance SPA      | Finance Copilot     |
| Invoicing Module | Invoicing Sub-agent |

### Position Persistence

- Collapsed position stored in localStorage
- Default: bottom-right corner
- Constraints: 48px from edges minimum

### Badge Logic

- Shows count of: pending recommendations + unread suggestions
- Clears on widget open
- Red dot for critical items

---

## Chronicle View Layout

> **Migrated from Constitution UX Design §2.2**

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

### Chronicle Components

| Component      | Purpose                               |
| -------------- | ------------------------------------- |
| Greeting       | Personalized, time-aware opening      |
| Developments   | What changed since last visit         |
| Inline Copilot | `💬` suggestions woven into narrative |
| Story Arcs     | Progress bars for ongoing threads     |
| View Toggle    | Chronicle ↔ Efficiency switch        |

---

## Efficiency View Layout

> **Migrated from Constitution UX Design §2.3**

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

### Efficiency View Characteristics

| Aspect     | Modern Theme | Power Theme         |
| ---------- | ------------ | ------------------- |
| Card style | Full cards   | Minimal borders     |
| Density    | Comfortable  | Maximum density     |
| Icons      | Decorative   | Status indicators   |
| Actions    | Labeled      | Icon-only (tooltip) |

---

## Island Container Specification

### Loading State

```
┌─────────────────────────────────────────────────────────────┐
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
└─────────────────────────────────────────────────────────────┘
```

- Skeleton loader matching expected content shape
- Subtle pulse animation (from ui module)
- No spinners (they create anxiety)

### Error State

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                    ⚠️ Something went wrong                   │
│                                                             │
│         This section encountered an error.                  │
│         The rest of Xentri is still working.               │
│                                                             │
│                    [Try Again]  [Report]                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

- Contained within island boundary
- Shell chrome remains functional
- Clear recovery actions

---

## Animation Specifications

| Element                 | Animation               | Duration | Easing      |
| ----------------------- | ----------------------- | -------- | ----------- |
| Sidebar expand/collapse | Width + content fade    | 200ms    | ease-out    |
| Category accordion      | Height + rotate chevron | 150ms    | ease-in-out |
| Page transition         | Fade + slide            | 150ms    | ease-out    |
| Copilot expand          | Scale + fade            | 200ms    | spring      |
| Skeleton pulse          | Opacity                 | 1500ms   | linear loop |

---

## Accessibility

| Requirement         | Implementation                               |
| ------------------- | -------------------------------------------- |
| Keyboard navigation | Tab through sidebar, Enter to select         |
| Screen reader       | ARIA labels on all interactive elements      |
| Focus indicators    | Visible focus ring on all focusable elements |
| Reduced motion      | Respect `prefers-reduced-motion`             |
| Color contrast      | WCAG AA minimum (4.5:1 for text)             |

---

## Document History

| Version | Date       | Author              | Changes                                                                       |
| ------- | ---------- | ------------------- | ----------------------------------------------------------------------------- |
| 1.0     | 2025-12-03 | Winston (Architect) | Initial scaffold for entity document structure                                |
| 2.0     | 2025-12-03 | Winston (Architect) | Migrated content from Constitution UX Design: layout, sidebar, copilot, views |

---

_This module inherits design tokens and principles from the Constitution (docs/platform/ux-design.md) and UI module (docs/platform/ui/ux-design.md). Specifications here are Shell-specific implementations._
