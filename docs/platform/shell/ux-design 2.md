---
entity_type: infrastructure_module
document_type: ux-design
module: shell
title: 'Shell Module UX Design'
description: 'UX patterns and specifications for the Shell module.'
version: '1.0'
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

- Shell-specific layout and spacing
- Sidebar interaction patterns
- Header component specifications
- Island container styling

**What this module inherits:**

- Design tokens (colors, typography, spacing)
- Core principles (Narrative First, No-Scroll, Chronicle Default)
- Theme architecture (Modern, Power, Traditional)

---

## Layout Specification

### Full-Screen Constraint

Per Constitution UX-Design, the entire application fits the viewport with zero scrolling.

```
┌─────────────────────────────────────────────────────────────┐
│  Header (48-56px)                                    [User] │
├──────────────┬──────────────────────────────────────────────┤
│              │                                              │
│   Sidebar    │              Main Content Area               │
│   (64-240px) │              (React Island)                  │
│              │                                              │
│              │                                              │
│              │                                              │
│              │                                              │
├──────────────┴──────────────────────────────────────────────┤
│  [Copilot Widget - Draggable]                               │
└─────────────────────────────────────────────────────────────┘
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

### States

| State               | Appearance                            | Behavior                               |
| ------------------- | ------------------------------------- | -------------------------------------- |
| **Collapsed**       | Icon-only (64px)                      | Hover shows tooltip with category name |
| **Expanded**        | Full width (240px)                    | Shows category labels and sub-items    |
| **Category Active** | Highlighted icon + expanded sub-items | Only one category expanded at a time   |

### Interaction Patterns

1. **Click category icon** → Expand that category, collapse others (accordion)
2. **Click collapse button** → Toggle sidebar width
3. **Hover on collapsed icon** → Show tooltip
4. **Click sub-item** → Navigate to that view, highlight in sidebar

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
- Subtle pulse animation
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

## Copilot Widget Specification

### States (from ADR-012)

| State         | Size           | Behavior                            |
| ------------- | -------------- | ----------------------------------- |
| **Collapsed** | 48px circle    | Draggable, shows notification badge |
| **Panel**     | 400px sidebar  | Shares screen with main content     |
| **Full**      | 100% main area | Replaces main content temporarily   |

### Position Persistence

- Collapsed position stored in localStorage
- Default: bottom-right corner
- Constraints: 48px from edges minimum

### Badge Logic

- Shows count of: pending recommendations + unread suggestions
- Clears on widget open
- Red dot for critical items

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

| Version | Date       | Author              | Changes                                        |
| ------- | ---------- | ------------------- | ---------------------------------------------- |
| 1.0     | 2025-12-03 | Winston (Architect) | Initial scaffold for entity document structure |

---

_This module inherits design tokens and principles from the Constitution (docs/platform/ux-design.md). Specifications here are Shell-specific implementations of those principles._
