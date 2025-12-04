---
entity_type: infrastructure_module
document_type: ux-design
module: ui
title: 'UI Module UX Design'
description: 'Component specifications, design tokens, color palettes, typography, and spacing for the UI Design System.'
version: '2.0'
status: draft
created: '2025-12-03'
updated: '2025-12-03'
inherits_from:
  - 'docs/platform/ux-design.md'
---

# UI Module - UX Design Specification

> **Entity Type:** Infrastructure Module
> **Module:** ui
> **Inherits From:** Constitution UX Design (docs/platform/ux-design.md)

---

## Overview

This document specifies the component design system, color palettes, typography scales, and spacing systems for the UI module. These are the **implementation details** of the Constitution's design principles.

**What this module defines:**

- Complete color palettes (Modern, Power themes, Dark/Light modes)
- Typography scales and font families
- Spacing system and layout grid
- Component specifications (Button, Card, Dialog, etc.)
- Animation specifications
- Accessibility requirements

**What this module inherits (constraints):**

- Design principles (Narrative First, No-Scroll, Chronicle Default)
- Theme architecture philosophy (Modern, Power, Traditional)
- Autonomy Policy Model patterns
- Soul-Aware Personalization patterns

---

## Design System Foundation

> **Migrated from Constitution UX Design §8.1**

**shadcn/ui** — Tailwind-native, copy-paste components built on Radix primitives.

**Version:** shadcn/ui with Tailwind v4 + Radix UI primitives (latest stable as of 2025-01)

**Rationale:**

- Tailwind integration matches Xentri's stack (Astro Shell + React Islands)
- Full customization control (no vendor CSS overrides)
- Accessible by default via Radix primitives
- Strong community, excellent documentation
- AI-friendly (v0, Bolt, Cursor all understand it)

---

## Color System

> **Migrated from Constitution UX Design §8.3**

### 4-Layer Neutral System

| Layer        | Purpose                         |
| ------------ | ------------------------------- |
| **Base**     | App background, deepest layer   |
| **Chrome**   | Navigation, sidebars, headers   |
| **Surface**  | Content cards, panels           |
| **Surface+** | Elevated, focused, hover states |

### Modern Theme (Dark)

| Token                   | Value     | Usage                  |
| ----------------------- | --------- | ---------------------- |
| `--color-base`          | `#0a0a0f` | App background         |
| `--color-chrome`        | `#12121a` | Sidebar, header        |
| `--color-surface`       | `#1c1921` | Cards, panels          |
| `--color-surface-plus`  | `#252330` | Hover, elevated        |
| `--color-primary`       | `#e879f9` | Primary actions, links |
| `--color-primary-hover` | `#f0abfc` | Primary hover state    |
| `--color-text`          | `#fafafa` | Primary text           |
| `--color-text-muted`    | `#a1a1aa` | Secondary text         |
| `--color-border`        | `#27272a` | Dividers, borders      |
| `--color-focus`         | `#e879f9` | Focus ring             |

### Modern Theme (Light)

| Token                   | Value     | Usage                  |
| ----------------------- | --------- | ---------------------- |
| `--color-base`          | `#fafafa` | App background         |
| `--color-chrome`        | `#f4f4f5` | Sidebar, header        |
| `--color-surface`       | `#ffffff` | Cards, panels          |
| `--color-surface-plus`  | `#f4f4f5` | Hover, elevated        |
| `--color-primary`       | `#c026d3` | Primary actions, links |
| `--color-primary-hover` | `#a21caf` | Primary hover state    |
| `--color-text`          | `#18181b` | Primary text           |
| `--color-text-muted`    | `#71717a` | Secondary text         |
| `--color-border`        | `#e4e4e7` | Dividers, borders      |
| `--color-focus`         | `#c026d3` | Focus ring             |

### Power Theme (Dark)

| Token                   | Value     | Usage                  |
| ----------------------- | --------- | ---------------------- |
| `--color-base`          | `#09090b` | App background         |
| `--color-chrome`        | `#0f0f12` | Sidebar, header        |
| `--color-surface`       | `#18181b` | Cards, panels          |
| `--color-surface-plus`  | `#27272a` | Hover, elevated        |
| `--color-primary`       | `#06b6d4` | Primary actions, links |
| `--color-primary-hover` | `#22d3ee` | Primary hover state    |
| `--color-text`          | `#fafafa` | Primary text           |
| `--color-text-muted`    | `#a1a1aa` | Secondary text         |
| `--color-border`        | `#3f3f46` | Dividers, borders      |
| `--color-focus`         | `#06b6d4` | Focus ring             |

### Power Theme (Light)

| Token                   | Value     | Usage                  |
| ----------------------- | --------- | ---------------------- |
| `--color-base`          | `#fafafa` | App background         |
| `--color-chrome`        | `#f4f4f5` | Sidebar, header        |
| `--color-surface`       | `#ffffff` | Cards, panels          |
| `--color-surface-plus`  | `#e4e4e7` | Hover, elevated        |
| `--color-primary`       | `#0891b2` | Primary actions, links |
| `--color-primary-hover` | `#0e7490` | Primary hover state    |
| `--color-text`          | `#18181b` | Primary text           |
| `--color-text-muted`    | `#52525b` | Secondary text         |
| `--color-border`        | `#d4d4d8` | Dividers, borders      |
| `--color-focus`         | `#0891b2` | Focus ring             |

### Semantic Colors

These colors have consistent meaning across all themes:

| Token                | Dark Mode | Light Mode | Usage                            |
| -------------------- | --------- | ---------- | -------------------------------- |
| `--color-success`    | `#22c55e` | `#16a34a`  | Success states, positive actions |
| `--color-success-bg` | `#052e16` | `#dcfce7`  | Success background               |
| `--color-warning`    | `#eab308` | `#ca8a04`  | Warnings, caution states         |
| `--color-warning-bg` | `#422006` | `#fef9c3`  | Warning background               |
| `--color-error`      | `#ef4444` | `#dc2626`  | Errors, destructive actions      |
| `--color-error-bg`   | `#450a0a` | `#fee2e2`  | Error background                 |
| `--color-info`       | `#3b82f6` | `#2563eb`  | Informational, neutral alerts    |
| `--color-info-bg`    | `#172554` | `#dbeafe`  | Info background                  |

### CSS Implementation

```css
/* Modern Dark Theme (Default) */
:root,
[data-theme='modern-dark'] {
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

[data-theme='modern-light'] {
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

[data-theme='power-dark'] {
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

[data-theme='power-light'] {
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

---

## Typography System

> **Migrated from Constitution UX Design §8.4**

### Font Families

| Role          | Modern Theme   | Power Theme    | Fallback                |
| ------------- | -------------- | -------------- | ----------------------- |
| **Heading**   | Cal Sans       | Inter          | system-ui, sans-serif   |
| **Body**      | Inter          | Inter          | system-ui, sans-serif   |
| **Monospace** | JetBrains Mono | JetBrains Mono | ui-monospace, monospace |

### Type Scale (rem-based, 1rem = 16px)

| Token         | Size            | Line Height | Weight | Usage                          |
| ------------- | --------------- | ----------- | ------ | ------------------------------ |
| `--text-xs`   | 0.75rem (12px)  | 1.5         | 400    | Captions, timestamps           |
| `--text-sm`   | 0.875rem (14px) | 1.5         | 400    | Secondary text, labels         |
| `--text-base` | 1rem (16px)     | 1.5         | 400    | Body text, inputs              |
| `--text-lg`   | 1.125rem (18px) | 1.5         | 500    | Emphasized body                |
| `--text-xl`   | 1.25rem (20px)  | 1.4         | 600    | Card titles, section headers   |
| `--text-2xl`  | 1.5rem (24px)   | 1.3         | 600    | Page section titles            |
| `--text-3xl`  | 1.875rem (30px) | 1.25        | 700    | Page titles                    |
| `--text-4xl`  | 2.25rem (36px)  | 1.2         | 700    | Hero text (Chronicle greeting) |

### Font Weights

| Weight | Token             | Usage                            |
| ------ | ----------------- | -------------------------------- |
| 400    | `--font-normal`   | Body text, secondary content     |
| 500    | `--font-medium`   | Labels, emphasized body, buttons |
| 600    | `--font-semibold` | Headings, card titles            |
| 700    | `--font-bold`     | Page titles, strong emphasis     |

### Theme Density Adjustments

| Theme  | Body Size | Heading Adjustment | Line Height   |
| ------ | --------- | ------------------ | ------------- |
| Modern | 16px      | Standard scale     | 1.5 (relaxed) |
| Power  | 14px      | -1 step (smaller)  | 1.4 (tighter) |

```css
/* Typography tokens */
:root {
  --font-heading: 'Cal Sans', 'Inter', system-ui, sans-serif;
  --font-body: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;
}

[data-theme='power-dark'],
[data-theme='power-light'] {
  --font-heading: 'Inter', system-ui, sans-serif;
  --text-base: 0.875rem; /* 14px for density */
}
```

---

## Spacing System

> **Migrated from Constitution UX Design §8.6**

**Base Unit:** 4px

### Spacing Scale

| Token        | Value | Usage                                 |
| ------------ | ----- | ------------------------------------- |
| `--space-0`  | 0px   | Reset, no spacing                     |
| `--space-1`  | 4px   | Tight inline spacing (icon-text gap)  |
| `--space-2`  | 8px   | Default inline spacing, input padding |
| `--space-3`  | 12px  | Compact component padding             |
| `--space-4`  | 16px  | Default component padding, form gaps  |
| `--space-5`  | 20px  | Card padding (compact)                |
| `--space-6`  | 24px  | Card padding (default), section gaps  |
| `--space-8`  | 32px  | Large section gaps                    |
| `--space-10` | 40px  | Page section separation               |
| `--space-12` | 48px  | Major layout gaps                     |
| `--space-16` | 64px  | Hero/feature spacing                  |

### Layout Grid

| Breakpoint          | Columns | Gutter | Margin |
| ------------------- | ------- | ------ | ------ |
| Mobile (<768px)     | 4       | 16px   | 16px   |
| Tablet (768-1023px) | 8       | 24px   | 24px   |
| Desktop (≥1024px)   | 12      | 24px   | 32px   |

### Usage Guidelines

| Context                     | Recommended Spacing                            |
| --------------------------- | ---------------------------------------------- |
| Button padding (horizontal) | `--space-4` to `--space-6`                     |
| Button padding (vertical)   | `--space-2` to `--space-3`                     |
| Card padding                | `--space-5` (compact) or `--space-6` (default) |
| Form field gap              | `--space-4`                                    |
| Section gap (within card)   | `--space-6`                                    |
| Section gap (page level)    | `--space-10` or `--space-12`                   |
| Inline icon-text            | `--space-1` or `--space-2`                     |

### Density Adjustments

| Theme  | Spacing Multiplier | Effect                            |
| ------ | ------------------ | --------------------------------- |
| Modern | 1.0x (default)     | Comfortable, breathing room       |
| Power  | 0.75x              | Tighter, more information density |

```css
/* Spacing tokens */
:root {
  --space-unit: 4px;
  --space-1: calc(var(--space-unit) * 1); /* 4px */
  --space-2: calc(var(--space-unit) * 2); /* 8px */
  --space-3: calc(var(--space-unit) * 3); /* 12px */
  --space-4: calc(var(--space-unit) * 4); /* 16px */
  --space-5: calc(var(--space-unit) * 5); /* 20px */
  --space-6: calc(var(--space-unit) * 6); /* 24px */
  --space-8: calc(var(--space-unit) * 8); /* 32px */
  --space-10: calc(var(--space-unit) * 10); /* 40px */
  --space-12: calc(var(--space-unit) * 12); /* 48px */
  --space-16: calc(var(--space-unit) * 16); /* 64px */
}

[data-theme*='power'] {
  --space-unit: 3px; /* 0.75x density */
}
```

---

## Component Inventory

> **Migrated from Constitution UX Design §8.2**

### From shadcn/ui (used as-is or lightly customized)

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

### Custom Components (Xentri-specific)

| Component       | Purpose                      | Status  |
| --------------- | ---------------------------- | ------- |
| Exception Card  | Status-aware action cards    | Planned |
| Autonomy Badge  | Autopilot health indicator   | Planned |
| Policy Slider   | 3-position autonomy control  | Planned |
| Chronicle View  | Narrative landing experience | Planned |
| Efficiency View | Dense alternative landing    | Planned |
| Story Arc       | Progress visualization       | Planned |
| Copilot Widget  | Draggable AI assistant       | Planned |
| Pulse Header    | Scope-aware greeting         | Planned |

---

## Exception Cards

> **Migrated from Constitution UX Design §9.1**

Cards for items needing user attention. Visual status via left border.

### Status Types

| Border Color     | Status        | Meaning                      | Icon |
| ---------------- | ------------- | ---------------------------- | ---- |
| Warning (yellow) | Needs Review  | Draft ready for approval     | ⏳   |
| Error (red)      | Blocked       | Requires action to proceed   | ⚠️   |
| Success (green)  | Auto-executed | FYI, completed automatically | ✓    |
| Info (blue)      | Quarantine    | Needs classification         | ❓   |

### Card Structure

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

### Card States

| State     | Visual Treatment                         |
| --------- | ---------------------------------------- |
| Default   | Standard appearance                      |
| Hover     | Subtle background shift, shadow increase |
| Selected  | Primary color border highlight           |
| Expanded  | Full content visible, actions prominent  |
| Collapsed | Preview only, actions hidden             |
| Loading   | Content shimmer, actions disabled        |
| Disabled  | 50% opacity, no interactions             |

### Card Variants

| Variant      | Use Case         | Behavior                      |
| ------------ | ---------------- | ----------------------------- |
| **Compact**  | Lists, mobile    | Single line, minimal info     |
| **Standard** | Default          | Title + description + actions |
| **Expanded** | Detail view      | Full content, all metadata    |
| **Inline**   | Within Chronicle | No card chrome, embedded      |

### Accessibility

- `role="article"` for semantic grouping
- Status announced via `aria-label`
- Actions have descriptive labels
- Focus visible on card and actions separately

---

## Toast Pattern (Undo-First)

> **Migrated from Constitution UX Design §9.2**

All actions follow the pattern: **Do → Toast → Undo window**

```
┌─────────────────────────────────────────┐
│ ✓  Sent reply to Sarah.            Undo │
└─────────────────────────────────────────┘
```

### Toast Variants

| Type        | Color   | Icon | Duration | Use Case                    |
| ----------- | ------- | ---- | -------- | --------------------------- |
| **Action**  | Success | ✓    | 5s       | Successful action with undo |
| **Info**    | Blue    | ℹ   | 3s       | Informational feedback      |
| **Warning** | Yellow  | ⚠   | 6s       | Warning with potential undo |
| **Error**   | Red     | ✕    | Dismiss  | Error requiring action      |

### Positioning

- Desktop: Bottom-right corner
- Mobile: Bottom-center, full-width
- Multiple toasts stack vertically

---

## Button Specifications

### Variants

| Variant     | Background        | Text           | Border | Use Case          |
| ----------- | ----------------- | -------------- | ------ | ----------------- |
| Primary     | `--color-primary` | White          | None   | Main actions      |
| Secondary   | `--color-surface` | `--color-text` | Border | Secondary actions |
| Ghost       | Transparent       | `--color-text` | None   | Tertiary actions  |
| Destructive | `--color-error`   | White          | None   | Delete, cancel    |
| Outline     | Transparent       | `--color-text` | Border | Alternative       |

### States

| State    | Visual Change                 |
| -------- | ----------------------------- |
| Hover    | Slight darken (5%)            |
| Focus    | Ring outline (`--color-ring`) |
| Active   | Slight darken (10%)           |
| Disabled | 50% opacity, no pointer       |
| Loading  | Spinner replaces text         |

### Sizes

| Size         | Height | Padding   | Font Size |
| ------------ | ------ | --------- | --------- |
| sm           | 32px   | 12px 16px | 14px      |
| md (default) | 40px   | 16px 24px | 16px      |
| lg           | 48px   | 20px 32px | 18px      |

---

## Animation Specifications

| Animation      | Duration | Easing      | Notes            |
| -------------- | -------- | ----------- | ---------------- |
| Button hover   | 100ms    | ease-out    | Background color |
| Button active  | 50ms     | ease-in     | Scale down 98%   |
| Dialog open    | 200ms    | spring      | Scale + fade     |
| Dialog close   | 150ms    | ease-in     | Fade out         |
| Skeleton pulse | 1500ms   | linear      | Opacity loop     |
| Focus ring     | 100ms    | ease-out    | Ring appears     |
| Toast enter    | 200ms    | slide-in    | From right       |
| Toast exit     | 150ms    | slide-out   | To right         |
| Sidebar toggle | 200ms    | ease-out    | Width transition |
| Sheet slide    | 300ms    | ease-in-out | Side slide       |

### Reduced Motion

All animations should check `prefers-reduced-motion: reduce` and either:

- Skip animation entirely
- Use instant transition (0ms)

---

## Accessibility Requirements

| Requirement          | Implementation                          |
| -------------------- | --------------------------------------- |
| Keyboard navigation  | Tab order, arrow keys for lists         |
| Focus indicators     | 2px ring, offset 2px                    |
| Screen reader        | ARIA labels on all interactive elements |
| Color contrast       | WCAG AA minimum (4.5:1 for text)        |
| Touch targets        | 44px minimum on mobile                  |
| Error identification | Color + icon + text                     |
| Reduced motion       | Check media query, respect it           |

---

## Content Canvas Pattern

> **Migrated from Constitution UX Design §8.5**

To avoid "card-on-card" ambiguity:

1. **Base** background for the viewport
2. **One bordered Surface panel** for the content canvas
3. **Cards inside** sit directly on Surface (no extra border, or very subtle)
4. **Modals/sheets** use Surface+ with shadow

---

## Document History

| Version | Date       | Author              | Changes                                                                             |
| ------- | ---------- | ------------------- | ----------------------------------------------------------------------------------- |
| 1.0     | 2025-12-03 | Winston (Architect) | Initial scaffold for entity document structure                                      |
| 2.0     | 2025-12-03 | Winston (Architect) | Migrated content from Constitution UX Design: colors, typography, spacing, patterns |

---

_This module inherits design principles from the Constitution (docs/platform/ux-design.md). Specifications here are UI-specific implementations of those principles._
