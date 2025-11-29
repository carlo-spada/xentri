# Xentri UX Design Specification

_Created on 2025-11-25_
_Generated using BMad Method - Create UX Design Workflow v1.0_

---

## Executive Summary

Xentri is a **clarity-first Business OS** that makes invisible commitments visible. Instead of being another tool requiring constant attention, Xentri runs your business while you watch — capturing, organizing, and acting on your behalf so nothing slips through the cracks.

**The defining experience:** Open "Today" → scan what changed → handle exceptions → close. The user is a pilot monitoring autopilot, intervening only when needed.

**Emotional goal:** "I feel caught up." Quiet competence, not heroic firefighting.

---

## 1. Design Philosophy

### 1.1 The Primary Enemy

**Invisible commitments** — not just anxiety or overwhelm. The things you promised (explicitly or implicitly) that you can't see, track, or remember. Xentri makes these visible and handles them.

### 1.2 The Cockpit Model

Users don't "do work inside Xentri." They:

1. **Verify** autopilot is running correctly
2. **Intervene** on exceptions only
3. **Trust** the system for routine operations

This is fundamentally different from task management apps. Xentri is about **observability and control**, not productivity theater.

### 1.3 Design Principles

| Principle | Meaning |
|-----------|---------|
| **Clarity First** | Universal Brief before tools; AI generates structure, not just content |
| **Calm UX** | One daily view of what matters; no notification flood |
| **Visible, Not Magical** | Every automation logged with explanation |
| **No Surprises** | User should never be surprised by system actions |
| **Earned Trust** | Autonomy ramps via real experience, not promises |

### 1.5 Resolving "No Surprises" vs "Gradual Autonomy"

These principles coexist via one **hard rule**:

> **Nudges are policy upgrades only — never requests for permission on individual actions.**

When Xentri suggests increased automation:
- It's proposing a **policy change** ("Auto-send all lead replies using Warm Welcome template")
- It's **not** asking "Can I send this specific email?"
- The nudge includes a **preview** of what would change (see §5.7)
- Accepting a nudge **updates the policy** — future similar actions just happen

This prevents "AI intern asking permission every 3 minutes" while still giving users control over their automation boundaries.

### 1.4 Platform Split

| Platform | Role | Mental Model |
|----------|------|--------------|
| **Desktop** | Workshop | Where you configure, adjust policies, dive deep |
| **Mobile** | Cockpit | Where you scan, approve, handle exceptions |

---

## 2. The Autonomy Policy Model

### 2.1 Core Concept: "Consent Once, Not Per-Action"

Traditional AI tools ask permission for every action. This creates **permission fatigue** — the opposite of automation that reduces cognitive load.

Xentri uses an **Autonomy Policy** model:
- User sets their comfort level once
- System operates within those boundaries
- User reviews exceptions, not every action

### 2.2 Three Presets

| Preset | Description | Behavior |
|--------|-------------|----------|
| **Conservative** (Default) | Xentri prepares, you approve | Auto-capture, auto-classify, auto-draft. Never auto-send. |
| **Balanced** | Auto-execute safe actions, batch review rest | Auto internal actions, batch review external, block risky |
| **Autonomous** | Maximum automation with undo window | Auto-execute low-risk external, 5-min undo window, block high-risk |

### 2.3 Risk Classification

| Risk Level | Examples | Behavior |
|------------|----------|----------|
| **Low** | Tagging, classifying, scheduling, internal notes | Auto-execute in Balanced+ |
| **Medium** | Lead replies (templated), follow-up emails | Auto-draft, or auto-send with undo in Autonomous |
| **High** | Payments, publishing, deletes, custom messages | Always requires approval |

### 2.4 Notification Budgets

| Channel | When Used | Example |
|---------|-----------|---------|
| **Interrupt** (Push) | High-risk actions needing approval | Payment failed, urgent lead |
| **Badge/Digest** | Medium-priority items | Drafts ready for review |
| **Timeline Only** | Low-priority, FYI | Auto-handled routine items |

Default budget: **5 high-priority items** in "Needs You" queue. Overflow goes to separate bucket.

### 2.5 Undo-First Execution

All actions follow the pattern: **Do → Toast → Undo window**

```
"Sent. Undo" (5 seconds)
```

This enables confident automation — mistakes are easily reversible.

---

## 3. Design System Foundation

### 3.1 Design System Choice

**shadcn/ui** — Tailwind-native, copy-paste components built on Radix primitives.

**Rationale:**
- Tailwind integration matches Xentri's stack (Astro Shell + React Islands)
- Full customization control (no vendor CSS overrides)
- Accessible by default via Radix primitives
- Strong community, excellent documentation
- AI-friendly (v0, Bolt, Cursor all understand it)

### 3.2 4-Layer Neutral System

| Layer | Hex (Dark) | Hex (Light) | Purpose |
|-------|------------|-------------|---------|
| **Base** | `#0d0b12` | `#f8f7fa` | App background, deepest layer |
| **Chrome** | `#16131e` | `#efedf2` | Navigation, sidebars, headers |
| **Surface** | `#1e1a28` | `#ffffff` | Content cards, panels |
| **Surface+** | `#2d2840` | `#f5f3f8` | Elevated, focused, hover states |

**Surface+ Enhancement:** Add `box-shadow: inset 0 1px 0 rgba(255,255,255,0.04)` for subtle top highlight.

### 3.3 Color System

```css
:root {
  /* Primary (Trust + Action) */
  --primary: #38bdf8;        /* Dark mode: Sky Blue */
  --primary-light: #0284c7;  /* Light mode */

  /* Secondary (AI + Insight) */
  --secondary: #a78bfa;      /* Dark mode: Violet */
  --secondary-light: #7c3aed; /* Light mode */

  /* Semantic */
  --success: #34d399;
  --warning: #fbbf24;
  --error: #f87171;
  --info: #60a5fa;

  /* Borders */
  --border-subtle: #2a2538;   /* Subtle separation */
  --border-default: #352f45;  /* Default borders */
  --border-strong: #453d5a;   /* Strong separation */

  /* Text */
  --text: #f0ecf7;
  --text-secondary: #b8b0c8;
  --text-muted: #7a7289;
  --text-dim: #5a5368;
}
```

### 3.4 Content Canvas Pattern

To avoid "card-on-card" ambiguity:

1. **Base** background for the viewport
2. **One bordered Surface panel** for the content canvas
3. **Cards inside** sit directly on Surface (no extra border, or very subtle)
4. **Modals/sheets** use Surface+ with shadow

---

## 4. User Journey Flows

### 4.1 Journey 1: First-Time User

**Goal:** "Consent once, stay calm" — smart defaults + single Autopilot Setup moment + Training Wheels Mode.

**Flow:**
```
Sign Up → Strategy Co-pilot → Build Brief → Autopilot Setup → Training Wheels → Today View
```

**Day-0 Guardrails (Non-negotiable):**
- No sending emails, SMS, or WhatsApp
- No publishing to real domains
- No money movement (payments, refunds)
- No permanent deletes

Until user has explicit opt-in moment, autopilot can **prepare** but never **send/publish/spend**.

**Training Wheels Mode:**
- Duration: First 24 hours OR first 10 actions (whichever comes later)
- All actions = Draft + Review (even if preset is Balanced/Autonomous)
- Every card shows: Why + Undo + "Tune Policy"
- System watches approvals/edits to calibrate
- Auto-exit after 24h + 10 actions with <80% edit rate

**Progressive Autonomy:**
- System observes usage patterns
- Nudges when user is ready for more automation
- "You approved 8/8 lead replies. Auto-send these?"
- Max 1 nudge per week per domain

**Wireframes:** [ux-journey-1-ftu.html](./ux-journey-1-ftu.html)

### 4.2 Journey 2: The Daily Loop

**Goal:** "I feel caught up" — scan exceptions, handle what needs attention, trust the rest.

**Core Loop:**
```
Open Today → Scan "Needs You" (exceptions) → Handle/Approve/Skip → Check "What Changed" → Close
```

**States:**
1. **Calm State** — Nothing needs you, autopilot healthy
2. **Active State** — Exceptions need attention, clear queue
3. **Degraded State** — Autopilot running in safe mode
4. **Overflow State** — More items than notification budget allows

**Key Specs:**
- **Autopilot Degraded Mode** — See §5.7 for operational definition
- **Needs-Classification Quarantine** — Items that couldn't be auto-classified
- **Batch Approve/Undo** — See §5.9 for constraints
- **Overflow Triage** — See §5.10 for deterministic sort order
- **Policy Change Preview** — See §5.8 for diff + blast radius format
- **Quick Feedback** — See §5.11 for passive-only rules

**Wireframes:** [ux-daily-loop-wireframes-v2.html](./ux-daily-loop-wireframes-v2.html)

### 4.3 Journey 3: Lead Capture (Deferred)

> **Status:** Deferred pending Epic 2+ definition. Will be detailed after PRD and Architecture revision.

Entry points: Website form → WhatsApp → Email → Manual

---

## 5. UX Patterns & Components

### 5.1 Exception Cards

Cards for items needing user attention. Visual status via left border:

| Border Color | Status | Meaning |
|--------------|--------|---------|
| Warning (yellow) | Needs Review | Draft ready for approval |
| Error (red) | Blocked | Requires action to proceed |
| Success (green) | Auto-executed | FYI, completed automatically |
| Info (blue) | Quarantine | Needs classification |

**Card Anatomy:**
```
┌─────────────────────────────────────┐
│ ▌ What happened                [Badge]
│   Why it needs you
│   ─────────────────────────────────
│   [Primary Action] [Secondary] [Skip]
│   ─────────────────────────────────
│   Why: reason · Template · Tune policy
└─────────────────────────────────────┘
```

### 5.2 Toast Pattern (Undo-First)

```
┌─────────────────────────────────────┐
│ ✓  Sent reply to Sarah.        Undo │
└─────────────────────────────────────┘
```

- Duration: 5 seconds
- Always shows undo option
- Success state with green left accent

### 5.3 Autonomy Badge

Shows current autopilot status in header:

| State | Color | Label |
|-------|-------|-------|
| Healthy | Green | "High" or "Balanced" |
| Degraded | Yellow | "Degraded" |
| Limited | Red | "Limited" |

### 5.4 Navigation with Left Rail

Active nav items get:
- Background: `var(--active-bg)` (primary @ 8% opacity)
- 3px primary-colored left border/rail
- Text color elevated to `--text`

### 5.5 Policy Sliders

For adjusting autonomy levels:

```
Autonomy Level                    Auto-send
├────────────────────────────────●────┤
Suggest       Auto-draft       Auto-send
```

### 5.6 Feedback Buttons

Lightweight mechanism to train the system:

```
[👍 Good] [👎 Wrong] [✏️ Could be better]
```

- Good: Strengthens pattern
- Wrong: Opens follow-up question
- Could be better: Direction right, details off

### 5.7 Autopilot Degraded Mode (Operational Definition)

Degraded Mode is not just a label — it's a **deterministic state change** with clear rules.

**Triggers (any one activates Degraded Mode):**

| Trigger | Example | Detection |
|---------|---------|-----------|
| **Provider Outage** | Email API down, AI service unavailable | Health check fails 3x in 5 min |
| **Confidence Drop** | System-wide confidence below 60% | Rolling 24h average |
| **Rate Limits** | External API throttling | 429 response or quota exhausted |
| **Error Threshold** | 3+ consecutive failures in same domain | Error counter per domain |
| **Missing Integration** | Required connection expired/revoked | OAuth token invalid |

**What Changes:**

| Normal Behavior | Degraded Behavior |
|-----------------|-------------------|
| Auto-send (Autonomous preset) | → Auto-draft only |
| Auto-execute low-risk | → Queue for review |
| Confidence-based routing | → Conservative fallback |

**Where It Appears:**

1. **Header badge:** "Autopilot: High" → "Degraded" (yellow)
2. **One timeline entry:** "Autopilot entered degraded mode: [reason]"
3. **Inline on affected cards:** "Would auto-send, but degraded mode active"

**No pop-ups. No interrupts.** User discovers it naturally when they open Today.

**Recovery:**
- **Auto-recovery:** When trigger condition clears (e.g., API comes back)
- **Manual recovery:** User clicks "Resume autopilot" after reviewing

### 5.8 Policy Change Preview (Diff + Blast Radius)

Policy changes are **not scary modals** — they're inline previews that build confidence.

**Required Elements:**

```
┌─────────────────────────────────────────────────────┐
│ LEAD RESPONSE POLICY                                │
├─────────────────────────────────────────────────────┤
│ Before: Auto-draft lead replies                     │
│ After:  Auto-send with 5-min undo window            │
├─────────────────────────────────────────────────────┤
│ EXPECTED IMPACT                                     │
│ ~12 actions/week will become auto-executed          │
│ Based on your last 30 days of activity              │
├─────────────────────────────────────────────────────┤
│ GUARDRAILS UNCHANGED                                │
│ ✓ Payments still require approval                   │
│ ✓ Publishing still require approval                 │
│ ✓ Deletes still require approval                    │
├─────────────────────────────────────────────────────┤
│ [Save Changes]                    [Cancel]          │
│ You can undo this from Timeline                     │
└─────────────────────────────────────────────────────┘
```

**Blast Radius Calculation:**
- Look back 30 days of historical data
- Count items that would have been handled differently
- Show as "~X actions/week" (rounded, not precise)

**Guardrails Reminder:**
- Always show which high-risk actions are **unchanged** by this policy
- Reassures user they're not opening floodgates

### 5.9 Batch Approve/Undo (Constrained)

Batch operations are powerful but dangerous. **Constraints prevent foot-guns.**

**Batching Requirements (ALL must match):**

| Constraint | Rationale |
|------------|-----------|
| Same template | Ensures consistent quality |
| Same policy | Ensures same risk level |
| Same channel | Email batch ≠ WhatsApp batch |

**UI Pattern:**

```
┌─────────────────────────────────────────────────────┐
│ BATCH APPROVE                                       │
├─────────────────────────────────────────────────────┤
│ Preview (1 of 8):                                   │
│ ┌─────────────────────────────────────────────────┐ │
│ │ To: Sarah Martinez                              │ │
│ │ "Hi Sarah, thanks for reaching out..."          │ │
│ └─────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────┤
│ Apply to 8 similar items                            │
│ All using: Warm Welcome template                    │
│ All via: Email                                      │
├─────────────────────────────────────────────────────┤
│ [Send All 8]                      [Review Each]     │
└─────────────────────────────────────────────────────┘
```

**Hard Rules:**
- Always show **1-item preview** before batch action
- Always show **count** ("Apply to 8 similar items")
- Always show **what makes them similar** (template, channel)
- **Never batch across different templates or channels**
- Batch undo follows same pattern: "Undo all 8? [Yes] [No, pick individually]"

### 5.10 Overflow Triage (Deterministic Sort Order)

When items exceed notification budget, they're sorted by a **stable, predictable recipe** — not arbitrary AI judgment.

**Priority Recipe (in order):**

```
1. Risk Level        (High > Medium > Low)
2. Time Sensitivity  (SLA timer active > deadline today > this week > none)
3. Revenue Impact    ($ amount > no $ attached)
4. Staleness         (Newer > Older, as tie-breaker only)
```

**Overflow Bucket Header:**

Always explain **why** items were moved:

```
┌─────────────────────────────────────────────────────┐
│ OVERFLOW (14 items)                                 │
│ Moved 14 low-risk FYIs to protect your interrupt    │
│ budget. Nothing here needs immediate action.        │
├─────────────────────────────────────────────────────┤
│ [Review Overflow]           [Adjust Budget]         │
└─────────────────────────────────────────────────────┘
```

**Transparency Rules:**
- User can always see **why** an item is in overflow vs "Needs You"
- Each overflow item shows its priority score breakdown on tap
- User can **pin** specific contacts/types to "always show in Needs You"

### 5.11 Quick Feedback (Passive-Only Rules)

Feedback buttons are essential for training, but must **never create notification sludge**.

**When Feedback Prompts Appear:**

| Condition | Appears | Rationale |
|-----------|---------|-----------|
| User **undid** an auto-action | ✅ Yes | User disagreed with the action |
| User **edited** a draft before sending | ✅ Yes | Draft wasn't quite right |
| Item was **quarantined** (low confidence) | ✅ Yes | System explicitly uncertain |
| Auto-action completed successfully | ❌ No | Assume correct unless told otherwise |
| Draft was approved without edits | ❌ No | Silence = consent |

**Display Rules:**
- **Passive only:** Feedback buttons appear inline on cards, never as push notifications
- **No nag:** If user ignores feedback prompt, it disappears after 7 days
- **No reminder:** Never send "You haven't given feedback on..." messages
- **Aggregate learning:** System learns from implicit signals (approvals, edits, undos) even without explicit feedback

**Implicit Feedback Signals:**
- Approved without edit → Positive signal
- Edited before approve → "Could be better" signal
- Undone → Strong negative signal
- Ignored for 24h+ → Neutral (don't count)

---

## 6. Responsive Strategy

### 6.1 Desktop (≥1024px)

- **Layout:** Chrome sidebar (320px) + Content canvas
- **Navigation:** Full nav tree visible
- **Detail Panel:** Inline (master-detail pattern)
- **Interaction:** Click/hover, keyboard shortcuts available but not required

### 6.2 Tablet (768-1023px)

- **Layout:** Collapsible sidebar + Content
- **Navigation:** Hamburger menu
- **Detail Panel:** Slide-over sheet
- **Interaction:** Touch-first

### 6.3 Mobile (<768px)

- **Layout:** Full-width content, bottom nav for primary actions
- **Navigation:** Bottom sheet / hamburger
- **Detail Panel:** Full-screen modal
- **Interaction:** Tap-first, obvious affordances

### 6.4 Accessibility

- WCAG 2.1 AA compliance target
- Radix primitives handle keyboard navigation, focus management, ARIA
- Color contrast ratios: 4.5:1 minimum for text
- Touch targets: 44px minimum
- Motion: Respect prefers-reduced-motion

---

## 7. Implementation Guidance

### 7.1 Component Priority

| Priority | Components | Rationale |
|----------|------------|-----------|
| **P0** | Exception Card, Toast, Autonomy Badge | Core daily loop |
| **P1** | Nav with Rail, Policy Sliders, Feedback Buttons | Policy management |
| **P2** | Batch Selection, Quarantine Banner, Degraded Banner | Edge states |
| **P3** | Timeline, Search, Charts | Activity views |

### 7.2 CSS Variables Setup

```css
/* In global.css or tailwind config */
@layer base {
  :root {
    --base: 270 25% 4%;
    --chrome: 265 22% 9%;
    --surface: 262 20% 13%;
    --surface-plus: 260 21% 20%;
    /* ... rest of system */
  }

  .dark {
    /* Dark mode is default */
  }

  .light {
    --base: 270 15% 98%;
    --chrome: 265 12% 93%;
    --surface: 0 0% 100%;
    --surface-plus: 270 15% 97%;
  }
}
```

### 7.3 shadcn/ui Customization

Extend the default theme in `components.json`:

```json
{
  "style": "default",
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/styles/globals.css",
    "baseColor": "neutral",
    "cssVariables": true
  }
}
```

---

## 8. Microcopy Guide

### 8.1 Voice & Tone

- **Calm, not cold** — Professional behavior, warm personality
- **Confident, not arrogant** — "Xentri handled this" not "AI magic"
- **Helpful, not condescending** — Assume intelligence, explain why not how

### 8.2 Key Copy

| Context | Copy |
|---------|------|
| Tagline | "Your business, finally visible." |
| Sub-tagline | "Xentri captures, organizes, and acts — so nothing slips." |
| Empty state (calm) | "You're all caught up" |
| Training Wheels | "For the next 24 hours, Xentri will draft everything for your review. No surprises." |
| Autonomy nudge | "You approved 8 of 8 lead replies this week. Xentri could auto-send these for you." |
| Decline button | "Not yet" (never "No thanks" or dismissive) |
| Undo toast | "Sent. Undo" |

---

## Appendix

### Related Documents

- Product Requirements: [prd.md](./prd.md)
- Product Brief: [product-brief.md](./product-brief.md)
- Epics: [epics.md](./epics.md)
- Architecture: [architecture.md](./architecture.md)

### Interactive Deliverables

| Artifact | Path | Contents |
|----------|------|----------|
| Color Themes v1 | [ux-color-themes.html](./ux-color-themes.html) | Initial 4 theme exploration |
| Color Themes v2 | [ux-color-themes-v2.html](./ux-color-themes-v2.html) | Blue options on Dusk base |
| Daily Loop v1 | [ux-daily-loop-wireframes.html](./ux-daily-loop-wireframes.html) | Initial 7 states |
| Daily Loop v2 | [ux-daily-loop-wireframes-v2.html](./ux-daily-loop-wireframes-v2.html) | 4-layer system + 6 specs |
| Journey 1: FTU | [ux-journey-1-ftu.html](./ux-journey-1-ftu.html) | Complete FTU flow |

### Design Decisions Log

| Decision | Chosen | Rationale |
|----------|--------|-----------|
| Design System | shadcn/ui | Tailwind-native, customizable, accessible |
| Primary Color | Sky Blue (#38bdf8) | Trust, action, calm — not "startup blue" |
| Secondary Color | Violet (#a78bfa) | AI, insight, premium feel |
| Neutral Base | Warm Dusk | Less corporate than pure gray |
| Interaction Model | Click/tap-first | Target users not tech-savvy |
| Default Preset | Balanced | Auto-execute safe actions, batch review external — faster workflow for busy founders |
| Training Wheels | 24h + 10 actions | Enough to calibrate, not annoying |

### Version History

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2025-11-25 | 1.0 | Initial UX Design Specification | UX Designer + PM |
| 2025-11-25 | 1.1 | Tightened specs to prevent Notification Hell: §1.5 philosophy hard rule, §5.7-5.11 operational constraints | UX Designer + PM |
| 2025-11-26 | 1.2 | Changed default preset from Conservative to Balanced; confirmed shadcn/ui colors-only approach | Carlo + Winston |
| 2025-11-28 | 1.3 | Marked Journey 3 as deferred; fixed document paths; aligned with revised Product Brief | Carlo |

---

_This UX Design Specification was created through collaborative design facilitation. All decisions were made with user input and are documented with rationale._
