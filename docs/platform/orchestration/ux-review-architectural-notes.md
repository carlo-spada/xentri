# UX Review: Architectural Implications

**Date:** 2025-12-01
**Context:** UX Design validation and revision session with Sally (UX Designer)
**For Review By:** Winston (Architect), Carlo (Owner)

---

## Summary

During the UX design direction workshop, several decisions were made that have architectural implications not fully captured in the current `architecture.md` or `prd.md`. This document captures those decisions for integration.

---

## 1. Hierarchical Pulse Views (NEW REQUIREMENT)

**Decision:** Every Category, Sub-category, and Module must expose a Pulse view.

**Current State:** Architecture mentions "Operational Pulse" as a concept but doesn't specify that it exists at every level of the hierarchy.

**New Requirement:**

| Level | Pulse View | Content |
|-------|------------|---------|
| Strategy | Strategy Pulse | What survived all 4 layers of filtering (CEO briefing) |
| Category | Category Pulse | What's happening in that category |
| Sub-category | Sub-category Pulse | What's happening in that sub-category |
| Module | Module Pulse | What's happening in that specific module |

**Landing Logic:**
- User lands on their **highest-level available** Pulse based on permissions
- Multi-scope users land on **most recently used** scope
- Owner lands on Strategy Pulse

**Architectural Implications:**
- Each agent level needs to produce a Pulse output
- Pulse data structure needs to be defined in `ts-schema`
- API endpoints needed: `GET /api/v1/pulse/{scope}` (with scope = strategy | category.{name} | subcategory.{name} | module.{name})
- User session needs to track "last used scope" for landing logic

---

## 2. Context-Aware Copilot Widget

**Decision:** A draggable widget that summons the context-relevant copilot.

**Behavior:**
- Collapsed: Small icon + notification badge, user-positionable on screen
- Expanded: Can take small panel (right/bottom) OR full main section (replacing SPA content)
- Context: Shows the copilot relevant to current view (Category/Sub-category/Module level)

**Architectural Implications:**
- Each level has its own copilot (already in architecture)
- Frontend needs copilot routing based on current navigation context
- Widget state (position, expanded/collapsed) persisted per user
- Copilot responses need to support both "quick answer" and "full interaction" modes

---

## 3. No-Scroll Design Constraint

**Decision:** The entire application should be a full-screen experience with zero scrolling.

**Implications:**
- Sidebar: Only one category expanded at a time, collapsible to icons
- Content density must fit viewport without scroll
- Module tabs need overflow handling (what if 10+ modules?)
- Mobile requires fundamentally different layout (separate design needed)
- All Pulse views, forms, and content must respect this constraint

---

## 4. Sidebar Behavior

**Decision:**
- Categories only in sidebar (7 items max)
- Click category → sub-categories expand inline (only recommended + owned)
- Click sub-category → SPA loads with module tabs at top
- Only ONE category can be expanded at a time
- Sidebar can collapse to icon-only mode for maximum SPA space

---

## 5. Brief-Aware Deep Personalization

**Decision:** Copilots don't just change labels — they structurally configure the system based on the Brief.

**What copilots can create/configure:**
- Pipeline stages (different for doctor vs. hotel vs. startup)
- Database columns / flexible fields
- Role suggestions (Chef, Server for restaurant; Sales Rep, Closer for startup)
- Module and sub-category recommendations
- Default settings and workflows

**Architectural Implications:**
- Flexible entity schemas already mentioned in PRD (JSON columns, configurable fields)
- Need "Brief → Module Config" mapping system
- Copilot tools must include schema modification capabilities
- User override always available (intelligent defaults, not locked constraints)

---

---

## 6. Narrative Continuity (CORE UX PHILOSOPHY)

**Decision:** The default experience is narrative-first (Chronicle View), with an efficiency toggle for power users.

### Chronicle View (Default)

The Pulse isn't a dashboard — it's a **journal/chronicle** that tells the user's business story:

| Element | Description |
|---------|-------------|
| **Session Greeting** | Copilot narrates: "Good morning. Since yesterday..." |
| **Story Arcs** | Persistent threads that evolve across sessions (e.g., "Acme Proposal - Day 3/5") |
| **Inline Copilot** | Copilot comments appear within the narrative, not in a separate widget |
| **Developments** | Items framed as "what developed" not "notifications" |
| **Session Bridging** | When returning after absence: "Here's what happened in your story" |

### Efficiency View (Toggle)

Conventional cards/lists for power users who need density and quick scanning.

### Copilot as Human-in-the-Loop

| Chatbot Pattern (NOT this) | Human-in-the-Loop (THIS) |
|----------------------------|--------------------------|
| Lives in widget, appears when called | Present in narrative, comments inline |
| "How can I help you?" | "I noticed this — here's what I think" |
| Reactive | Proactive (but not intrusive) |
| Separate from content | Part of the content |

### Architectural Implications

**Memory Architecture (supports Narrative Continuity):**
- Semantic Memory (Brief) — already defined
- Episodic Memory (Journal) — time-series log for "what happened since yesterday"
- Synthetic Memory (Persona) — patterns like "they typically respond in 3 days"

**New Requirements:**
- Story Arc data structure — persistent threads with status, progress, timeline
- Session bridging logic — detect absence duration, generate narrative recap
- Chronicle vs Efficiency view state — persisted per user preference
- Inline copilot rendering — copilot responses embedded in Pulse content, not separate

**API Implications:**
- `GET /api/v1/pulse/{scope}` needs to return narrative-formatted content
- Story arcs need CRUD endpoints: `GET/POST/PATCH /api/v1/arcs`
- Session bridging: `GET /api/v1/pulse/{scope}/recap?since={timestamp}`

**Language/Copy Requirements:**
- All system copy should use narrative framing
- "Chapter" not "session"
- "Developing" not "pending"
- "Story arc" not "ongoing task"

---

## 7. View Toggle Pattern

**Decision:** Chronicle ⟷ Efficiency toggle available on all Pulse views.

| View | Default? | Use Case |
|------|----------|----------|
| Chronicle | ✅ Yes | Daily review, understanding context, narrative flow |
| Efficiency | Toggle | Power users, quick scanning, known actions |

**Persistence:** User's toggle preference saved per scope (Strategy Pulse might be Chronicle, Finance Pulse might be Efficiency).

---

## Action Items

1. [ ] Winston: Review and integrate Hierarchical Pulse requirement into architecture.md
2. [ ] Winston: Define Pulse data structure in ts-schema (including narrative fields)
3. [ ] Winston: Define Story Arc data structure in ts-schema
4. [ ] Winston: Add session bridging / recap logic to architecture
5. [ ] Carlo: Review and confirm these decisions align with product vision
6. [ ] Update PRD "User Experience Principles" section with:
   - No-scroll constraint
   - Chronicle-first philosophy
   - Narrative Continuity as core differentiator
7. [ ] Add Pulse API endpoints to platform integration requirements
8. [ ] Add Story Arc API endpoints to platform integration requirements

---

## 8. Theme Architecture

**Decision:** Multiple themes with dark/light modes, implemented via CSS custom properties.

### MVP Themes

| Theme | Modes | Description |
|-------|-------|-------------|
| **Modern** | Dark, Light | Conversational, gradient accents, immersive, chat-like copilot |
| **Power** | Dark, Light | Dense, high-contrast, minimal chrome, speed-focused |

### Future Themes

| Theme | Modes | Description |
|-------|-------|-------------|
| **Traditional** | Dark, Light | Professional clarity, balanced, warm but businesslike |

### Implementation Approach

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

### User Preference Storage

- Theme preference stored in user settings table
- Default: Modern Dark
- Brief-aware suggestion: Copilot can recommend theme based on business type
  - Tech startups → Modern
  - Professional services → Traditional (when available)
  - Power users (based on usage patterns) → Power

### Architectural Implications

- All UI components must use theme tokens, never hardcoded colors
- Tailwind config extends with theme-aware utilities
- Theme switcher component in Settings
- Theme persisted per user (not per org - personal preference)

---

## Action Items (Updated)

1. [ ] Winston: Review and integrate Hierarchical Pulse requirement into architecture.md
2. [ ] Winston: Define Pulse data structure in ts-schema (including narrative fields)
3. [ ] Winston: Define Story Arc data structure in ts-schema
4. [ ] Winston: Add session bridging / recap logic to architecture
5. [ ] Winston: Add theme token architecture to frontend patterns
6. [ ] Carlo: Review and confirm these decisions align with product vision
7. [ ] Update PRD "User Experience Principles" section with:
   - No-scroll constraint
   - Chronicle-first philosophy
   - Narrative Continuity as core differentiator
   - Theme options (Modern, Power, Traditional-future)
8. [ ] Add Pulse API endpoints to platform integration requirements
9. [ ] Add Story Arc API endpoints to platform integration requirements
10. [ ] Define theme token system in packages/ui

---

*This document was generated during the UX Design Direction Workshop (2025-12-01) and should be archived after integration.*
