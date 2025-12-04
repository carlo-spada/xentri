---
entity_type: infrastructure_module
document_type: epics
module: ui
title: 'UI Module Epics'
description: 'Implementation stories for the UI Design System module.'
version: '1.0'
status: draft
created: '2025-12-03'
updated: '2025-12-03'
inherits_from:
  - 'docs/platform/epics.md'
---

# UI Module - Epics & Stories

> **Entity Type:** Infrastructure Module
> **Module:** ui
> **Inherits From:** Constitution Epics (docs/platform/epics.md)

---

## Overview

This document contains implementation stories specific to the UI Design System module. These stories establish the visual foundation that all micro-apps build upon.

**Key Principle:** Stories here implement FR-UI-xxx requirements. The UI module is foundational — other modules depend on it.

---

## Epic Alignment

| Constitution Epic      | UI Contribution                          | Status  |
| ---------------------- | ---------------------------------------- | ------- |
| Epic 1: Foundation     | Base components, tokens, Tailwind config | Planned |
| Epic 2: Soul System    | Copilot Widget component                 | Planned |
| Epic 3: Tool Framework | Module-specific component patterns       | Planned |

---

## UI Stories

### Story UI-1.1: Package Setup & Tailwind Configuration

**Implements:** FR-UI-010
**Traces To:** Constitution Epic 1

**Acceptance Criteria:**

- [ ] Package scaffolded at `packages/ui`
- [ ] Tailwind CSS 4.x configured
- [ ] Shared `tailwind.config.ts` exported
- [ ] CSS variables for tokens defined
- [ ] `pnpm run build` produces dist/
- [ ] Consumer packages can import config

**Technical Notes:**

- Use Tailwind preset pattern for sharing
- CSS custom properties for runtime theming

---

### Story UI-1.2: Design Token System

**Implements:** FR-UI-002, FR-UI-003
**Traces To:** ADR-013, Constitution Epic 1

**Acceptance Criteria:**

- [ ] Color tokens defined (semantic, surface, text, state)
- [ ] Typography tokens defined (font families, sizes)
- [ ] Spacing tokens defined (consistent scale)
- [ ] Light mode token values
- [ ] Dark mode token values
- [ ] CSS variables exported in base styles

**Technical Notes:**

- `:root` for light mode
- `.dark` class for dark mode
- Use HSL for color manipulation

---

### Story UI-1.3: Base Components (shadcn/ui)

**Implements:** FR-UI-001, FR-UI-009
**Traces To:** Constitution Epic 1

**Acceptance Criteria:**

- [ ] Button component (primary, secondary, ghost, destructive)
- [ ] Input component with validation states
- [ ] Select component (dropdown)
- [ ] Dialog component (modal)
- [ ] Card component
- [ ] All components are pure (props in, events out)
- [ ] All components export types

**Technical Notes:**

- Based on shadcn/ui primitives
- Radix UI for accessibility
- cn() utility for class merging

---

### Story UI-1.4: Skeleton Loader Components

**Implements:** FR-UI-005
**Traces To:** Constitution UX §Loading States, Constitution Epic 1

**Acceptance Criteria:**

- [ ] `Skeleton` base component with pulse animation
- [ ] `SkeletonText` for text placeholders
- [ ] `SkeletonCard` for card placeholders
- [ ] `SkeletonTable` for table placeholders
- [ ] Animation respects `prefers-reduced-motion`
- [ ] Matches expected content shape

**Technical Notes:**

- Subtle pulse animation (1500ms linear loop)
- No spinners (they create anxiety)

---

### Story UI-1.5: Error Boundary Components

**Implements:** FR-UI-006
**Traces To:** PR-007, Constitution Epic 1

**Acceptance Criteria:**

- [ ] `ErrorBoundary` wrapper component
- [ ] `ErrorDisplay` UI component
- [ ] Shows: icon, title, message, retry button
- [ ] "The rest of Xentri is still working" messaging
- [ ] Report issue link
- [ ] Doesn't expose technical details to users

**Technical Notes:**

- Contained error state
- Shell chrome remains functional
- Log error internally for debugging

---

### Story UI-1.6: Accessibility Foundation

**Implements:** FR-UI-008, FR-UI-011
**Traces To:** Constitution UX §Accessibility, Constitution Epic 1

**Acceptance Criteria:**

- [ ] All interactive elements keyboard accessible
- [ ] Focus indicators visible on all focusable elements
- [ ] ARIA labels on all interactive elements
- [ ] Color contrast meets WCAG AA (4.5:1 for text)
- [ ] `prefers-reduced-motion` reduces/removes animations
- [ ] Screen reader testing documented

**Technical Notes:**

- Radix UI provides accessibility primitives
- Test with VoiceOver, NVDA

---

### Story UI-1.7: Layout Components

**Implements:** FR-UI-001
**Traces To:** Constitution Epic 1

**Acceptance Criteria:**

- [ ] `Sidebar` component (collapsed/expanded states)
- [ ] `Header` component
- [ ] `MainContent` container
- [ ] Responsive breakpoint handling
- [ ] Sidebar accordion behavior

**Technical Notes:**

- Used by shell for persistent chrome
- Nano Stores for collapsed/expanded state

---

### Story UI-2.1: Theme Variants

**Implements:** FR-UI-004
**Traces To:** ADR-013, Constitution Epic 2

**Acceptance Criteria:**

- [ ] Modern theme (conversational, gradient accents)
- [ ] Power theme (high density, high contrast)
- [ ] Traditional theme (professional, balanced)
- [ ] Theme switcher component
- [ ] Theme persisted in user preferences
- [ ] System preference detection as default

**Technical Notes:**

- CSS class-based theme switching
- Tokens override per theme

---

### Story UI-2.2: Copilot Widget Component

**Implements:** FR-UI-007
**Traces To:** ADR-012, Constitution Epic 2

**Acceptance Criteria:**

- [ ] Collapsed state (48px circle with badge)
- [ ] Panel state (400px sidebar)
- [ ] Full state (replaces main content)
- [ ] Draggable in collapsed state
- [ ] Position persisted in localStorage
- [ ] Notification badge logic
- [ ] Smooth state transitions

**Technical Notes:**

- Widget is shell-hosted but component lives in UI
- Context passed from shell for copilot resolution

---

### Story UI-3.1: Form Components

**Implements:** FR-UI-012
**Traces To:** Constitution Epic 3

**Acceptance Criteria:**

- [ ] Form wrapper with validation context
- [ ] Label component
- [ ] FormError component
- [ ] FormDescription component
- [ ] Integration with react-hook-form
- [ ] Validation state styling (error, success)

**Technical Notes:**

- Composable form primitives
- Zod integration for validation schemas

---

### Story UI-3.2: Advanced Components

**Implements:** FR-UI-001
**Traces To:** Constitution Epic 3

**Acceptance Criteria:**

- [ ] Badge component (status indicators)
- [ ] Avatar component (user images)
- [ ] Tooltip component
- [ ] Popover component
- [ ] Tabs component
- [ ] Command palette component

**Technical Notes:**

- Build as needed by micro-apps
- Radix primitives for accessibility

---

## Traceability Matrix

| Story  | FR-UI-xxx | Constitution Trace  | Status  |
| ------ | --------- | ------------------- | ------- |
| UI-1.1 | 010       | Epic 1              | Planned |
| UI-1.2 | 002, 003  | ADR-013, Epic 1     | Planned |
| UI-1.3 | 001, 009  | Epic 1              | Planned |
| UI-1.4 | 005       | UX §Loading, Epic 1 | Planned |
| UI-1.5 | 006       | PR-007, Epic 1      | Planned |
| UI-1.6 | 008, 011  | UX §Accessibility   | Planned |
| UI-1.7 | 001       | Epic 1              | Planned |
| UI-2.1 | 004       | ADR-013, Epic 2     | Planned |
| UI-2.2 | 007       | ADR-012, Epic 2     | Planned |
| UI-3.1 | 012       | Epic 3              | Planned |
| UI-3.2 | 001       | Epic 3              | Planned |

---

## Document History

| Version | Date       | Author              | Changes                                        |
| ------- | ---------- | ------------------- | ---------------------------------------------- |
| 1.0     | 2025-12-03 | Winston (Architect) | Initial scaffold for entity document structure |

---

_Stories in this module implement UI-specific requirements (FR-UI-xxx) and contribute to Constitution-level epic outcomes._
