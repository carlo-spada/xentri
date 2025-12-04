---
entity_type: infrastructure_module
document_type: ux-design
module: ui
title: "UI Module UX Design"
description: "Component specifications and design system documentation for the UI module."
version: "1.0"
status: draft
created: "2025-12-03"
updated: "2025-12-03"
inherits_from:
  - "docs/platform/ux-design.md"
---

# UI Module - UX Design Specification

> **Entity Type:** Infrastructure Module
> **Module:** ui
> **Inherits From:** Constitution UX Design (docs/platform/ux-design.md)

---

## Overview

This document specifies the component design and visual language for the UI Design System. It defines how Constitution-level design principles are implemented as reusable components.

**What this module defines:**
- Component visual specifications
- Interaction patterns
- Animation specifications
- Theme variant details

**What this module inherits:**
- Design principles (Narrative First, No-Scroll, etc.)
- Accessibility requirements (WCAG AA)
- Theme architecture (Modern, Power, Traditional)

---

## Component Specifications

### Button

| Variant | Background | Text | Border | Use Case |
|---------|------------|------|--------|----------|
| Primary | `--color-primary` | White | None | Main actions |
| Secondary | `--color-secondary` | `--color-foreground` | None | Secondary actions |
| Ghost | Transparent | `--color-foreground` | None | Tertiary actions |
| Destructive | `--color-error` | White | None | Delete, cancel |
| Outline | Transparent | `--color-foreground` | `--color-border` | Alternative |

**States:**

| State | Visual Change |
|-------|---------------|
| Hover | Slight darken (5%) |
| Focus | Ring outline (`--color-ring`) |
| Active | Slight darken (10%) |
| Disabled | 50% opacity, no pointer events |
| Loading | Spinner replaces text |

**Sizes:**

| Size | Height | Padding | Font Size |
|------|--------|---------|-----------|
| sm | 32px | 12px 16px | 14px |
| md (default) | 40px | 16px 24px | 16px |
| lg | 48px | 20px 32px | 18px |

---

### Input

| State | Border Color | Background | Notes |
|-------|--------------|------------|-------|
| Default | `--color-border` | `--color-background` | — |
| Focus | `--color-ring` | `--color-background` | Ring outline |
| Error | `--color-error` | `--color-background` | Red border |
| Disabled | `--color-muted` | `--color-muted` | 50% opacity |

**Anatomy:**

```
┌─────────────────────────────────────┐
│ Label                               │
├─────────────────────────────────────┤
│ [Icon] Placeholder text...          │
├─────────────────────────────────────┤
│ Helper text or error message        │
└─────────────────────────────────────┘
```

---

### Dialog (Modal)

**Anatomy:**

```
┌─────────────────────────────────────┐
│ Title                           [X] │
├─────────────────────────────────────┤
│                                     │
│ Content area                        │
│                                     │
├─────────────────────────────────────┤
│               [Cancel] [Confirm]    │
└─────────────────────────────────────┘
```

**Behavior:**
- Backdrop: `rgba(0, 0, 0, 0.5)` with blur
- Focus trapped within dialog
- Escape key closes dialog
- Click outside closes (optional)
- Animates in: scale + fade (200ms)

---

### Card

| Element | Value |
|---------|-------|
| Background | `--color-surface` |
| Border | `--color-border` (1px) |
| Border radius | 8px |
| Shadow | `0 1px 3px rgba(0,0,0,0.1)` |
| Padding | 16px (default) |

---

### Skeleton Loader

| Property | Value |
|----------|-------|
| Background | `--color-muted` |
| Animation | Pulse (opacity 0.5 → 1.0) |
| Duration | 1500ms |
| Easing | Linear |
| Border radius | Matches content shape |

**Reduced Motion:**
- No animation
- Static `--color-muted` background

---

### Error Display

**Visual:**

```
┌─────────────────────────────────────┐
│                                     │
│            ⚠️                        │
│    Something went wrong            │
│                                     │
│  This section encountered an error. │
│  The rest of Xentri is still       │
│  working.                          │
│                                     │
│       [Try Again]  [Report]         │
│                                     │
└─────────────────────────────────────┘
```

| Element | Specification |
|---------|---------------|
| Icon | Warning triangle, `--color-warning` |
| Title | 18px, bold |
| Message | 14px, `--color-muted-foreground` |
| Buttons | Ghost variant |

---

## Theme Variants

### Modern (Default)

| Aspect | Value |
|--------|-------|
| Feeling | Conversational, immersive |
| Gradients | Subtle on cards, buttons |
| Corners | 8px radius |
| Shadows | Soft, diffuse |
| Accents | Vibrant primary color |
| Animation | Smooth, playful |

### Power

| Aspect | Value |
|--------|-------|
| Feeling | Dense, efficient |
| Gradients | None |
| Corners | 4px radius |
| Shadows | Minimal |
| Accents | High contrast |
| Animation | Instant (50ms max) |

### Traditional

| Aspect | Value |
|--------|-------|
| Feeling | Professional, balanced |
| Gradients | None |
| Corners | 6px radius |
| Shadows | Subtle |
| Accents | Muted, business-like |
| Animation | Standard (150ms) |

---

## Animation Specifications

| Animation | Duration | Easing | Notes |
|-----------|----------|--------|-------|
| Button hover | 100ms | ease-out | Background color |
| Button active | 50ms | ease-in | Scale down 98% |
| Dialog open | 200ms | spring | Scale + fade |
| Dialog close | 150ms | ease-in | Fade out |
| Skeleton pulse | 1500ms | linear | Opacity loop |
| Focus ring | 100ms | ease-out | Ring appears |
| Toast enter | 200ms | slide-in | From right |
| Toast exit | 150ms | slide-out | To right |

**Reduced Motion:**
All animations should check `prefers-reduced-motion: reduce` and either:
- Skip animation entirely
- Use instant transition (0ms)

---

## Color Palette

### Light Mode

| Token | HSL Value | Hex | Usage |
|-------|-----------|-----|-------|
| background | 0 0% 100% | #FFFFFF | Page background |
| foreground | 222 47% 11% | #0F172A | Primary text |
| primary | 222 47% 30% | #2563EB | Primary actions |
| secondary | 210 40% 96% | #F1F5F9 | Secondary surfaces |
| muted | 210 40% 90% | #E2E8F0 | Muted elements |
| muted-foreground | 215 16% 47% | #64748B | Secondary text |
| accent | 210 40% 96% | #F1F5F9 | Accent surfaces |
| destructive | 0 84% 60% | #EF4444 | Error/delete |
| success | 142 76% 36% | #22C55E | Success states |
| warning | 38 92% 50% | #F59E0B | Warning states |
| border | 214 32% 91% | #E2E8F0 | Borders |
| ring | 222 47% 30% | #2563EB | Focus rings |

### Dark Mode

| Token | HSL Value | Hex | Usage |
|-------|-----------|-----|-------|
| background | 222 47% 11% | #0F172A | Page background |
| foreground | 210 40% 98% | #F8FAFC | Primary text |
| primary | 217 91% 60% | #3B82F6 | Primary actions |
| secondary | 217 33% 17% | #1E293B | Secondary surfaces |
| muted | 217 33% 25% | #334155 | Muted elements |
| muted-foreground | 215 20% 65% | #94A3B8 | Secondary text |
| destructive | 0 63% 31% | #B91C1C | Error/delete |
| success | 142 69% 58% | #4ADE80 | Success states |
| warning | 38 92% 50% | #F59E0B | Warning states |
| border | 217 33% 25% | #334155 | Borders |
| ring | 217 91% 60% | #3B82F6 | Focus rings |

---

## Typography Scale

| Name | Size | Line Height | Weight | Usage |
|------|------|-------------|--------|-------|
| xs | 12px | 16px | 400 | Captions, labels |
| sm | 14px | 20px | 400 | Secondary text |
| base | 16px | 24px | 400 | Body text |
| lg | 18px | 28px | 400 | Large body |
| xl | 20px | 28px | 600 | Small headings |
| 2xl | 24px | 32px | 600 | Section headings |
| 3xl | 30px | 36px | 700 | Page headings |
| 4xl | 36px | 40px | 700 | Hero headings |

---

## Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| 0 | 0 | No spacing |
| 1 | 4px | Tight elements |
| 2 | 8px | Related elements |
| 3 | 12px | Component padding |
| 4 | 16px | Standard spacing |
| 5 | 20px | Comfortable spacing |
| 6 | 24px | Section spacing |
| 8 | 32px | Large gaps |
| 10 | 40px | Very large gaps |
| 12 | 48px | Section breaks |
| 16 | 64px | Major sections |

---

## Accessibility Checklist

| Requirement | Implementation |
|-------------|----------------|
| Keyboard navigation | Tab order, arrow keys for lists |
| Focus indicators | 2px ring, offset 2px |
| Screen reader labels | aria-label, aria-describedby |
| Color contrast | 4.5:1 minimum for text |
| Touch targets | 44px minimum on mobile |
| Error identification | Color + icon + text |
| Reduced motion | Check media query, respect it |

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-12-03 | Winston (Architect) | Initial scaffold for entity document structure |

---

_This module inherits design principles from the Constitution (docs/platform/ux-design.md). Specifications here are UI-specific implementations of those principles._
