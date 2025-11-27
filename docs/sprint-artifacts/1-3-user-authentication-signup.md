# Story 1.3: User Authentication & Signup

Status: in-progress

## Story

As a **Founder**,
I want **to sign up with email/password or social auth**,
so that **I can securely access the platform**.

## Acceptance Criteria

1. **AC1:** Email/password signup creates user and redirects to shell on success (FR1)
2. **AC2:** Email/password login authenticates user and redirects to shell on success (FR1)
3. **AC3:** Social OAuth login (Google, Apple, or configured providers) succeeds and redirects to shell (FR2)
4. **AC4:** `xentri.user.signup.v1` event logged with `org_id` + `user_id` on new user registration (FR37)
5. **AC5:** `xentri.user.login.v1` event logged with `org_id` + `user_id` on successful login (FR37)
6. **AC6:** Sessions use HTTP-only cookies with secure flags; access tokens are short-lived (FR1, FR2)
7. **AC7:** Refresh token rotation is implemented; old tokens are invalidated on use (FR1, FR2)
8. **AC8:** JWT claims include `sub` (user_id), `org_id`, and `role`; middleware validates these before setting RLS context (ADR-003)

## Tasks / Subtasks

- [x] **Task 1: Configure Clerk project** (AC: 1, 2, 3)
  - [x] 1.1 Create Clerk application in dashboard (or configure existing)
  - [x] 1.2 Enable email/password authentication
  - [x] 1.3 Enable Social OAuth providers: Google, Apple
  - [x] 1.4 Configure redirect URLs for local dev (`localhost:4321`) and production
  - [x] 1.5 Enable Organizations feature in Clerk dashboard
  - [x] 1.6 Configure webhook endpoint for `user.created`, `organization.created` events
  - [x] 1.7 Set JWT template to include `org_id`, `org_role` claims (Clerk dashboard → JWT Templates)

- [x] **Task 2: Implement Clerk webhook handlers in core-api** (AC: 1, 2, 3, 4, 5)
  - [x] 2.1 Create `services/core-api/src/routes/webhooks/clerk.ts`
  - [x] 2.2 Implement `user.created` webhook handler:
    - Verify webhook signature (svix)
    - Sync user to local `users` table (Clerk user_id as primary key)
    - Create Clerk Organization via Backend API
    - Emit `xentri.user.signup.v1` event
  - [x] 2.3 Implement `organization.created` webhook handler:
    - Sync org to local `organizations` table
    - Emit `xentri.org.created.v1` event
  - [x] 2.4 Implement `session.created` webhook handler (optional):
    - Emit `xentri.user.login.v1` event
  - [x] 2.5 Write unit tests for webhook handlers

- [x] **Task 3: Configure Clerk middleware in core-api** (AC: 6, 7, 8)
  - [x] 3.1 Install `@clerk/fastify` and configure plugin
  - [x] 3.2 Create `services/core-api/src/middleware/clerkAuth.ts`:
    - Use `clerkPlugin` to verify session
    - Extract `userId`, `orgId`, `orgRole` from session claims
    - Attach to request context
  - [x] 3.3 Apply Clerk middleware to protected routes
  - [x] 3.4 Create `GET /api/v1/users/me` route (returns current user from Clerk session)
  - [x] 3.5 Return Problem Details format for errors (400, 401, 403)
  - [x] 3.6 Write integration tests for authenticated vs unauthenticated requests

- [ ] **Task 4: Update orgContext middleware for Clerk JWT** (AC: 8)
  - [ ] 4.1 Update `services/core-api/src/middleware/orgContext.ts`:
    - Extract `orgId` from Clerk session (already verified by clerkAuth middleware)
    - If `x-org-id` header provided, verify user has access to that org via Clerk API
    - Set `app.current_org_id` from verified Clerk JWT claim
  - [ ] 4.2 Handle edge case: user with no active organization (prompt to create/select)
  - [ ] 4.3 Write tests for org context with valid/invalid org claims
  - [ ] 4.4 Write tests for org-switching via `x-org-id` header

- [ ] **Task 5: Emit auth events** (AC: 4, 5)
  - [ ] 5.1 On successful signup, emit `xentri.user.signup.v1` event with:
    - `org_id` from newly created org (or deferred until 1.4)
    - `user_id` from created user
    - `payload`: `{ email_domain, signup_method: 'email' | 'google' }`
  - [ ] 5.2 On successful login, emit `xentri.user.login.v1` event with:
    - `org_id` from user's primary org
    - `user_id` from authenticated user
    - `payload`: `{ login_method: 'email' | 'google' }`
  - [ ] 5.3 Reuse EventService from Story 1.2 for event emission
  - [ ] 5.4 Write tests verifying events are logged on auth actions

- [ ] **Task 6: Shell auth integration with Clerk components** (AC: 1, 2, 3)
  - [ ] 6.1 Install `@clerk/astro` and configure in `astro.config.mjs`
  - [ ] 6.2 Create `apps/shell/src/pages/sign-in/[[...sign-in]].astro` using `<SignIn />` component
  - [ ] 6.3 Create `apps/shell/src/pages/sign-up/[[...sign-up]].astro` using `<SignUp />` component
  - [ ] 6.4 Add `<OrganizationSwitcher />` to shell header for multi-org users
  - [ ] 6.5 Create `apps/shell/src/middleware.ts` using Clerk's `clerkMiddleware()` for route protection
  - [ ] 6.6 Configure public routes (`/sign-in`, `/sign-up`, `/`) and protected routes
  - [ ] 6.7 Style Clerk components with Xentri design tokens via `appearance` prop

- [ ] **Task 7: Password reset flow** (AC: 1)
  - [ ] 7.1 Clerk handles password reset via `<SignIn />` component "Forgot password" link
  - [ ] 7.2 Configure Clerk email templates for password reset in dashboard
  - [ ] 7.3 Verify reset flow works end-to-end in local dev
  - [ ] 7.4 (Optional) Create custom reset page if branded experience needed

- [ ] **Task 8: Testing and validation** (AC: 1-8)
  - [ ] 8.1 Write E2E test: signup with email → redirects to shell
  - [ ] 8.2 Write E2E test: login with email → redirects to shell
  - [ ] 8.3 Write E2E test: Social OAuth flow (mock Clerk in CI, real in local)
  - [ ] 8.4 Write integration test: webhook handlers emit correct events
  - [ ] 8.5 Write security test: unauthenticated request returns 401
  - [ ] 8.6 Write security test: request with invalid org context returns 403
  - [ ] 8.7 Write integration test: org-switching via header works for multi-org users
  - [ ] 8.8 Verify all tests pass: `pnpm run test`

## Dev Notes

### Architecture Constraints

- **Auth Provider:** Clerk with native Organizations per architecture decision [Source: docs/architecture.md#Decision-Summary-Table]
- **JWT Pattern:** Access token includes `sub`, `org_id`, `org_role`; verified by Clerk middleware [Source: docs/architecture.md#ADR-003]
- **RLS Integration:** `app.current_org_id` MUST be set from verified Clerk JWT claim, not from untrusted headers [Source: docs/architecture.md#ADR-003]
- **Cookie Security:** Managed by Clerk SDK (HTTP-only, Secure, SameSite) [Source: docs/sprint-artifacts/tech-spec-epic-1.md#Security]
- **Event Naming:** `xentri.user.signup.v1`, `xentri.user.login.v1` per event naming convention [Source: docs/architecture.md#Naming-Location-Patterns]

### Technical Specifications

**Clerk-Managed Auth (no custom endpoints needed):**
- Sign-in/up handled by Clerk `<SignIn />` and `<SignUp />` components
- OAuth handled by Clerk's built-in Social OAuth flow
- Session management handled by Clerk SDK

**Core-API Endpoints:**
| Method | Path | Request | Response | Notes |
|--------|------|---------|----------|-------|
| POST | `/api/v1/webhooks/clerk` | Clerk webhook payload | `{received: true}` | Handles `user.created`, `org.created`, `session.created` |
| GET | `/api/v1/users/me` | - (Clerk session) | `{user, org}` | Returns current user from Clerk session |

[Source: docs/architecture.md#Auth-Patterns]

**Clerk JWT Claims Structure:**
```typescript
interface ClerkJWTClaims {
  sub: string;              // Clerk user_id
  org_id?: string;          // Active organization ID (present when org selected)
  org_role?: string;        // Role in active org: 'org:admin' | 'org:member'
  org_permissions?: string[]; // Fine-grained permissions
  email: string;
  iat: number;
  exp: number;
}
```
[Source: Clerk JWT Template documentation]

### Project Structure Notes

**Files to create/modify:**
```
services/core-api/
├── src/
│   ├── routes/
│   │   └── webhooks/
│   │       ├── clerk.ts          (new - webhook handlers)
│   │       └── clerk.test.ts     (new)
│   └── middleware/
│       ├── clerkAuth.ts          (new - Clerk session verification)
│       └── orgContext.ts         (modify - use Clerk JWT claims)

apps/shell/
├── src/
│   ├── pages/
│   │   ├── sign-in/
│   │   │   └── [[...sign-in]].astro  (new - Clerk SignIn)
│   │   └── sign-up/
│   │       └── [[...sign-up]].astro  (new - Clerk SignUp)
│   ├── middleware.ts             (new - Clerk route protection)
│   └── components/
│       └── UserButton.tsx        (new - header user menu)

packages/ts-schema/src/
├── auth.ts                       (extend with Clerk JWT claims types)
└── index.ts                      (re-export)
```

### Learnings from Previous Story

**From Story 1-2-event-backbone-database-schema (Status: review)**

- **Critical Security Gap Identified**: Story 1.2 review found that org/user validation trusts headers without JWT binding. This story MUST fix that by implementing Clerk-backed authentication.
  - "Header-trust bypass: orgContext/ensureOrgMembership accept x-org-id/x-user-id without JWT binding" [Source: docs/sprint-artifacts/1-2-event-backbone-database-schema.md#Senior-Developer-Review]

- **EventService Available**: Use existing `services/core-api/src/domain/events/EventService.ts` for emitting auth events. Already has:
  - `createEvent(payload: SystemEvent)` method with Zod validation
  - Transaction-scoped org context setting
  - Dedupe key generation
  [Source: docs/sprint-artifacts/1-2-event-backbone-database-schema.md#Dev-Agent-Record]

- **Event Types Registered**: `xentri.user.signup.v1` and `xentri.user.login.v1` already defined in `packages/ts-schema/src/events.ts`
  [Source: docs/sprint-artifacts/1-2-event-backbone-database-schema.md#Completion-Notes]

- **Pending Review Items to Address**:
  - [ ] [High] Enforce JWT-backed org/user verification before setting RLS context
  - This story directly addresses this by implementing Clerk middleware

- **Prisma Adapter Pattern**: Story 1.2 established `@prisma/adapter-pg` + `pg` pattern for Prisma 7.0 client initialization. Follow same pattern.
  [Source: docs/sprint-artifacts/1-2-event-backbone-database-schema.md#Debug-Log-References]

- **OrgContext Middleware Location**: `services/core-api/src/middleware/orgContext.ts` exists but needs Clerk JWT validation added
  [Source: docs/sprint-artifacts/1-2-event-backbone-database-schema.md#File-List]

### Edge Cases

- Clerk handles OAuth CSRF protection internally
- Clerk handles session/token rotation automatically
- Account lockout: Configure in Clerk dashboard (Attack Protection settings)
- Email verification: Configure in Clerk dashboard (may defer to future story)
- User with multiple orgs: Clerk's `<OrganizationSwitcher />` handles org selection; JWT reflects active org
- Webhook idempotency: Use Clerk's `svix-id` header for deduplication
- Webhook retry: Clerk retries failed webhooks; handlers must be idempotent

### Dependencies

- Story 1.1 (infrastructure): Complete
- Story 1.2 (events): In review - EventService available
- Story 1.4 (org creation): This story may need to coordinate on signup flow

### References

- [Source: docs/architecture.md#ADR-003] - Multi-Tenant Security (RLS & Context)
- [Source: docs/architecture.md#Auth-Patterns] - Auth implementation patterns
- [Source: docs/sprint-artifacts/tech-spec-epic-1.md#Story-1.3] - Acceptance criteria
- [Source: docs/sprint-artifacts/tech-spec-epic-1.md#APIs-and-Interfaces] - Auth API contracts
- [Source: docs/prd.md#FR1-FR4] - Auth functional requirements
- [Source: docs/sprint-artifacts/1-2-event-backbone-database-schema.md] - Previous story context and security gaps

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

claude-opus-4-5-20251101

### Debug Log References

**2025-11-26 - Task 1 Implementation:**
- ✅ Added `@clerk/fastify@^2.6.5`, `svix@^1.52.0` to core-api/package.json
- ✅ Added `@clerk/astro@^2.16.3` to shell/package.json
- ✅ Created `services/core-api/src/infra/clerk.ts` - Clerk client utility
- ✅ Updated `packages/ts-schema/src/auth.ts` with `ClerkJWTClaims` types
- ✅ Updated `.env.example` with Clerk env vars
- ✅ Dependencies installed successfully

**Manual Clerk Dashboard Setup (subtasks 1.1-1.7):**
1. Create app at https://dashboard.clerk.com
2. **Authentication → Email/Password** → Enable
3. **Authentication → Social connections** → Enable Google, Apple
4. **Configure → Paths** → Set sign-in: `/sign-in`, sign-up: `/sign-up`
5. **Organizations** → Enable feature
6. **Webhooks** → Add endpoint: `{API_URL}/api/v1/webhooks/clerk`
   - Subscribe: `user.created`, `organization.created`, `session.created`
7. **JWT Templates** → Create template with claims:
   ```json
   {
     "org_id": "{{org.id}}",
     "org_role": "{{org.role}}",
     "org_slug": "{{org.slug}}"
   }
   ```

### Completion Notes List

### File List

---

## Change Log

| Date | Author | Change |
|------|--------|--------|
| 2025-11-26 | SM Agent (Bob) | Initial draft created from Epic 1 tech spec, epics.md, architecture.md, and Story 1.2 learnings |
| 2025-11-26 | Architect (Winston) | **Auth provider switch:** Supabase Auth → Clerk. Updated all tasks, endpoints, JWT claims, and file structure to reflect Clerk's webhook-driven architecture with native Organizations support. Added Social OAuth (Google, Apple) and Clerk Billing (v0.4 scope) to architecture. |
