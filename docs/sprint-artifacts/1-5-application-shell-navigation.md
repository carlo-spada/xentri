# Story 1.5: Application Shell & Navigation

Status: ready-for-dev

## Story

As a **Logged-in User**,
I want **a stable application shell with 7-category sidebar navigation, theme toggle, and responsive mobile layout**,
so that **I can navigate between Xentri capabilities seamlessly without page reloads and have a consistent experience across devices**.

## Acceptance Criteria

1. **AC1:** Shell displays stable header with user avatar menu and notification bell icon (FR26)
2. **AC2:** Shell displays collapsible sidebar with 7 category icons: Management & Strategy, Brand & Marketing, Sales & Relationships, Finance & Accounting, Operations & Delivery, Team & Leadership, Legal & Compliance (FR27)
3. **AC3:** Only subscribed/active categories are interactable; inactive categories show as disabled/locked (FR28)
4. **AC4:** Clicking a category expands its subcategories; other expanded categories collapse (accordion behavior) (FR29)
5. **AC5:** Switching between categories/modules does not trigger full page reload; navigation uses client-side routing (FR30)
6. **AC6:** User menu provides Light/Dark theme toggle; preference is persisted to `user_preferences` table and applied on load (FR31)
7. **AC7:** Shell is responsive: sidebar collapses to icon-only mode on mobile (<768px); touch targets are ≥44px (FR32)
8. **AC8:** Mobile displays graceful offline banner when network is unavailable; cached navigation still works (FR32, NFR PWA)
9. **AC9:** Hover prefetching enabled for sidebar items to improve perceived performance (Architecture: Islands)

## Tasks / Subtasks

- [ ] **Task 1: Implement Shell layout structure** (AC: 1, 2, 7)
  - [ ] 1.1 Create `apps/shell/src/layouts/AppShell.astro` with header + sidebar + content area slots
  - [ ] 1.2 Create `apps/shell/src/components/Header.astro` with logo, user menu trigger, notification bell
  - [ ] 1.3 Create `apps/shell/src/components/Sidebar.astro` with 7 category icons and expand/collapse logic
  - [ ] 1.4 Add responsive breakpoint handling: full sidebar (≥1024px), collapsed icons (768-1023px), mobile drawer (<768px)
  - [ ] 1.5 Ensure all touch targets are ≥44px on mobile using Tailwind classes

- [ ] **Task 2: Implement sidebar accordion navigation** (AC: 3, 4, 5)
  - [ ] 2.1 Create `apps/shell/src/components/SidebarCategory.tsx` React island for interactive expand/collapse
  - [ ] 2.2 Implement accordion behavior: clicking category expands it, collapses others
  - [ ] 2.3 Create Nano Store `apps/shell/src/stores/navigation.ts` for sidebar state (expanded category, active module)
  - [ ] 2.4 Add disabled/locked state styling for inactive categories (greyed out, lock icon)
  - [ ] 2.5 Implement hover prefetching with `client:visible` and manual prefetch on hover
  - [ ] 2.6 Write unit tests for navigation store state transitions

- [ ] **Task 3: Implement user menu with theme toggle** (AC: 1, 6)
  - [ ] 3.1 Create `apps/shell/src/components/UserMenu.tsx` React island with dropdown
  - [ ] 3.2 Add theme toggle (Light/Dark/System) using Nano Store `apps/shell/src/stores/theme.ts`
  - [ ] 3.3 Implement theme persistence: save to `user_preferences.theme` via API call on change
  - [ ] 3.4 Load theme preference on app init from user session data
  - [ ] 3.5 Apply theme class to `<html>` element using Tailwind dark mode (`dark:` prefix)
  - [ ] 3.6 Add user avatar, name display, and sign-out action to menu
  - [ ] 3.7 Write unit tests for theme store and persistence logic

- [ ] **Task 4: Create user preferences API endpoint** (AC: 6)
  - [ ] 4.1 Create `PATCH /api/v1/users/me/preferences` endpoint in `services/core-api/src/routes/users.ts`
  - [ ] 4.2 Add request validation: `{ theme?: 'light' | 'dark' | 'system', email_notifications?: object }`
  - [ ] 4.3 Implement upsert to `user_preferences` table with RLS enforcement
  - [ ] 4.4 Add `GET /api/v1/users/me` enhancement to include preferences in response
  - [ ] 4.5 Add Zod schemas to `packages/ts-schema/src/users.ts` for preferences
  - [ ] 4.6 Write integration tests for preferences endpoint

- [ ] **Task 5: Implement notification bell UI** (AC: 1)
  - [ ] 5.1 Create `apps/shell/src/components/NotificationBell.tsx` React island with badge count
  - [ ] 5.2 Implement dropdown showing recent notifications (stub data for now)
  - [ ] 5.3 Add unread count badge that updates from notifications API
  - [ ] 5.4 Create Nano Store `apps/shell/src/stores/notifications.ts` for notification state
  - [ ] 5.5 Wire to `GET /api/v1/notifications?unread_only=true` (already defined in tech spec)

- [ ] **Task 6: Implement offline banner and PWA basics** (AC: 8)
  - [ ] 6.1 Create `apps/shell/src/components/OfflineBanner.astro` component
  - [ ] 6.2 Add service worker registration in `apps/shell/src/scripts/sw-register.ts`
  - [ ] 6.3 Implement network status detection using `navigator.onLine` + `online/offline` events
  - [ ] 6.4 Cache shell HTML and critical assets for offline navigation
  - [ ] 6.5 Display banner: "You're offline. Some features may be limited." with retry button

- [ ] **Task 7: Client-side routing setup** (AC: 5, 9)
  - [ ] 7.1 Configure Astro View Transitions for smooth navigation
  - [ ] 7.2 Add `transition:animate` directives to content area for seamless switches
  - [ ] 7.3 Implement hover prefetch via `data-astro-prefetch="hover"` on sidebar links
  - [ ] 7.4 Preserve scroll position and form state across navigations
  - [ ] 7.5 Write E2E test: navigate between categories, verify no full reload (check `window.performance.navigation.type`)

- [ ] **Task 8: Integration and testing** (AC: 1-9)
  - [ ] 8.1 Write E2E test: sidebar accordion behavior (expand/collapse)
  - [ ] 8.2 Write E2E test: theme toggle persists across sessions
  - [ ] 8.3 Write E2E test: mobile responsive behavior (drawer open/close)
  - [ ] 8.4 Write E2E test: offline banner appears when network disconnected
  - [ ] 8.5 Verify shell loads in <2s on simulated 3G (NFR1)
  - [ ] 8.6 Run accessibility audit (WCAG 2.1 AA) on shell components

## Dev Notes

### Architecture Constraints

- **Astro Shell + React Islands:** Shell is Astro SSG with React islands for interactive components (sidebar, user menu, notifications) [Source: docs/architecture.md#Implementation-Patterns-B]
- **Nano Stores:** Cross-island state management for theme, navigation, notifications [Source: docs/architecture.md#Implementation-Patterns-B]
- **View Transitions:** Use Astro's built-in View Transitions API for client-side navigation [Source: docs/architecture.md#Decision-Summary-Table]
- **Tailwind v4 + shadcn/ui:** Use design system components from `packages/ui` [Source: docs/architecture.md#Project-Structure]

### Technical Specifications

**7 Categories (Sidebar):**
```typescript
const CATEGORIES = [
  { id: 'management', icon: 'Strategy', label: 'Management & Strategy', active: true },
  { id: 'brand', icon: 'Palette', label: 'Brand & Marketing', active: false },
  { id: 'sales', icon: 'Users', label: 'Sales & Relationships', active: false },
  { id: 'finance', icon: 'DollarSign', label: 'Finance & Accounting', active: false },
  { id: 'operations', icon: 'Truck', label: 'Operations & Delivery', active: false },
  { id: 'team', icon: 'UserCog', label: 'Team & Leadership', active: false },
  { id: 'legal', icon: 'Scale', label: 'Legal & Compliance', active: false },
] as const;
```

**Theme Persistence Flow:**
```
1. User clicks theme toggle → Nano Store updates
2. Store change triggers API call: PATCH /api/v1/users/me/preferences { theme: 'dark' }
3. API upserts user_preferences record
4. On next load: GET /api/v1/users/me returns { preferences: { theme: 'dark' } }
5. Shell applies theme class before first paint (avoid flash)
```

**Responsive Breakpoints:**
```css
/* Full sidebar with labels */
@media (min-width: 1024px) { .sidebar { width: 240px; } }

/* Collapsed icon-only */
@media (min-width: 768px) and (max-width: 1023px) { .sidebar { width: 64px; } }

/* Mobile drawer (hidden by default) */
@media (max-width: 767px) { .sidebar { position: fixed; transform: translateX(-100%); } }
```

[Source: docs/architecture.md#Implementation-Patterns-B]

### Project Structure Notes

**Files to create:**
```
apps/shell/
├── src/
│   ├── layouts/
│   │   └── AppShell.astro                    (new)
│   ├── components/
│   │   ├── Header.astro                      (new)
│   │   ├── Sidebar.astro                     (new)
│   │   ├── SidebarCategory.tsx               (new - React island)
│   │   ├── UserMenu.tsx                      (new - React island)
│   │   ├── NotificationBell.tsx              (new - React island)
│   │   └── OfflineBanner.astro               (new)
│   ├── stores/
│   │   ├── navigation.ts                     (new - Nano Store)
│   │   ├── theme.ts                          (new - Nano Store)
│   │   └── notifications.ts                  (new - Nano Store)
│   └── scripts/
│       └── sw-register.ts                    (new)

services/core-api/src/routes/
├── users.ts                                  (modify - add preferences endpoint)

packages/ts-schema/src/
├── users.ts                                  (modify - add UserPreferences schema)
```

**Files to modify:**
```
apps/shell/src/pages/index.astro              (use AppShell layout)
apps/shell/astro.config.mjs                   (enable View Transitions, prefetch)
packages/ts-schema/src/index.ts               (export users module)
```

### Learnings from Previous Story

**From Story 1-4-organization-creation-provisioning (Status: done)**

- **user_preferences Table Exists:** Already created with `theme` and `email_notifications` fields. Use existing schema.
  [Source: docs/sprint-artifacts/tech-spec-epic-1.md#Data-Models]

- **API Pattern:** Follow existing route structure (`/api/v1/resource`). Auth middleware from Clerk available.
  [Source: docs/sprint-artifacts/1-4-organization-creation-provisioning.md#Task-5]

- **String IDs:** Continue using Clerk text IDs (not UUIDs) for user references.
  [Source: docs/sprint-artifacts/1-4-organization-creation-provisioning.md#Learnings-from-Previous-Story]

- **RLS Context Pattern:** Use `$executeRaw(Prisma.sql\`SELECT set_config('app.current_org_id', ${orgId}, true)\`)` before queries.
  [Source: docs/sprint-artifacts/1-4-organization-creation-provisioning.md#Technical-Specifications]

- **Type Safety:** Export all new types from ts-schema; run typecheck before committing.
  [Source: docs/sprint-artifacts/1-4-organization-creation-provisioning.md#Completion-Notes]

- **Test Count:** 13 unit tests + 14 integration tests from Story 1.4. Ensure no regressions.

### Edge Cases

- **Theme Flash:** Apply theme class in `<head>` script before body renders to prevent flash of wrong theme
- **Offline State:** Cache only shell navigation; module content may fail gracefully
- **Category Permissions:** MVP has only "Management & Strategy" active; others disabled until subscription
- **Mobile Touch:** Ensure sidebar drawer has backdrop overlay and closes on outside click
- **Accessibility:** Sidebar must be navigable via keyboard; focus trap in mobile drawer

### Dependencies

- Story 1.1 (infrastructure): Complete ✓
- Story 1.2 (events): Complete ✓
- Story 1.3 (auth): Complete ✓ - Clerk session available
- Story 1.4 (orgs): Complete ✓ - user_preferences table exists
- `packages/ui`: shadcn/ui components available

### NFR Alignment

| NFR | Target | How Achieved |
|-----|--------|--------------|
| NFR1 | Shell load <2s on 3G | Astro SSG, minimal JS, lazy islands |
| NFR2 | Category switch <500ms | View Transitions, hover prefetch |
| NFR4 | WCAG 2.1 AA | Keyboard nav, focus management, contrast |

### References

- [Source: docs/architecture.md#Implementation-Patterns-B] - Frontend Islands
- [Source: docs/architecture.md#Decision-Summary-Table] - Astro 5.16.0, React 19.2.0
- [Source: docs/prd.md#FR26-FR32] - Shell & Navigation FRs
- [Source: docs/sprint-artifacts/tech-spec-epic-1.md#Story-1.5] - Acceptance criteria
- [Source: docs/sprint-artifacts/1-4-organization-creation-provisioning.md] - Previous story context

## Dev Agent Record

### Context Reference

- `docs/sprint-artifacts/1-5-application-shell-navigation.context.xml`

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

---

## Change Log

| Date | Author | Change |
|------|--------|--------|
| 2025-11-26 | SM Agent (Bob) | Initial draft created in #yolo mode from tech-spec-epic-1, architecture.md, PRD, and Story 1.4 learnings |
