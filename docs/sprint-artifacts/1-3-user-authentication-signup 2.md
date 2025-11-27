# Story 1.3: User Authentication & Signup

Status: ready-for-dev

## Story

As a **Founder**,
I want **to sign up with email/password or social auth**,
so that **I can securely access the platform**.

## Acceptance Criteria

1. **AC1:** Email/password signup creates user and redirects to shell on success (FR1)
2. **AC2:** Email/password login authenticates user and redirects to shell on success (FR1)
3. **AC3:** Google OAuth login succeeds and redirects to shell (FR2)
4. **AC4:** `xentri.user.signup.v1` event logged with `org_id` + `user_id` on new user registration (FR37)
5. **AC5:** `xentri.user.login.v1` event logged with `org_id` + `user_id` on successful login (FR37)
6. **AC6:** Sessions use HTTP-only cookies with secure flags; access tokens are short-lived (FR1, FR2)
7. **AC7:** Refresh token rotation is implemented; old tokens are invalidated on use (FR1, FR2)
8. **AC8:** JWT claims include `sub` (user_id), `org_id`, and `role`; middleware validates these before setting RLS context (ADR-003)

## Tasks / Subtasks

- [ ] **Task 1: Configure Supabase Auth project** (AC: 1, 2, 3)
  - [ ] 1.1 Create Supabase project or configure existing project for auth
  - [ ] 1.2 Enable email/password authentication provider
  - [ ] 1.3 Configure Google OAuth provider with client ID/secret
  - [ ] 1.4 Set redirect URLs for local dev and production
  - [ ] 1.5 Configure JWT claims to include custom `org_id` and `role` via hook or function

- [ ] **Task 2: Implement auth service layer in core-api** (AC: 1, 2, 3, 6, 7)
  - [ ] 2.1 Create `services/core-api/src/domain/auth/AuthService.ts`
  - [ ] 2.2 Implement `signup(email, password, name)` method:
    - Create user via Supabase Auth
    - Trigger org creation (deferred to Story 1.4 or via DB trigger)
    - Return session with access_token
  - [ ] 2.3 Implement `login(email, password)` method:
    - Authenticate via Supabase Auth
    - Return session with access_token
  - [ ] 2.4 Implement `loginWithOAuth(provider, code)` for Google OAuth callback
  - [ ] 2.5 Implement `refreshSession(refresh_token)` with rotation
  - [ ] 2.6 Implement `logout()` to invalidate session
  - [ ] 2.7 Write unit tests for AuthService methods

- [ ] **Task 3: Create auth API routes** (AC: 1, 2, 3, 6, 7)
  - [ ] 3.1 Create `POST /api/v1/auth/signup` route
  - [ ] 3.2 Create `POST /api/v1/auth/login` route
  - [ ] 3.3 Create `GET /api/v1/auth/oauth/google` for OAuth initiation
  - [ ] 3.4 Create `GET /api/v1/auth/oauth/callback` for OAuth callback handling
  - [ ] 3.5 Create `POST /api/v1/auth/refresh` route
  - [ ] 3.6 Create `POST /api/v1/auth/logout` route
  - [ ] 3.7 Set HTTP-only cookie with `access_token` on successful auth
  - [ ] 3.8 Return Problem Details format for errors (400, 401, 403)
  - [ ] 3.9 Write integration tests for all auth routes

- [ ] **Task 4: Implement JWT-backed auth middleware** (AC: 8)
  - [ ] 4.1 Update `services/core-api/src/middleware/authMiddleware.ts`:
    - Extract and verify JWT from cookie or Authorization header
    - Decode claims: `sub`, `org_id`, `role`
    - Attach `user` object to request context
  - [ ] 4.2 Update `services/core-api/src/middleware/orgContext.ts`:
    - Verify `user.org_id` from JWT matches `x-org-id` header (if provided)
    - Reject requests where user is not a member of the requested org
    - Set `app.current_org_id` from verified JWT claim, NOT from header
  - [ ] 4.3 Apply auth middleware to protected routes (events, users, etc.)
  - [ ] 4.4 Write tests for auth middleware with valid/invalid/expired tokens
  - [ ] 4.5 Write tests for org context with JWT-backed validation

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

- [ ] **Task 6: Shell auth integration** (AC: 1, 2, 3)
  - [ ] 6.1 Create `apps/shell/src/pages/login.astro` with login form
  - [ ] 6.2 Create `apps/shell/src/pages/signup.astro` with signup form
  - [ ] 6.3 Add "Sign in with Google" button using Supabase OAuth flow
  - [ ] 6.4 Create `apps/shell/src/middleware/auth.ts` for route protection
  - [ ] 6.5 Redirect unauthenticated users to `/login`
  - [ ] 6.6 Redirect authenticated users from `/login` to shell homepage
  - [ ] 6.7 Style auth pages with Xentri design tokens from packages/ui

- [ ] **Task 7: Password reset flow** (AC: 1)
  - [ ] 7.1 Create `POST /api/v1/auth/reset-password` route to initiate reset
  - [ ] 7.2 Create `POST /api/v1/auth/reset-password/confirm` route to complete reset
  - [ ] 7.3 Create `apps/shell/src/pages/reset-password.astro` page
  - [ ] 7.4 Configure Supabase email templates for password reset
  - [ ] 7.5 Write integration tests for reset flow

- [ ] **Task 8: Testing and validation** (AC: 1-8)
  - [ ] 8.1 Write E2E test: signup with email → redirects to shell
  - [ ] 8.2 Write E2E test: login with email → redirects to shell
  - [ ] 8.3 Write E2E test: Google OAuth flow (mock or real depending on CI)
  - [ ] 8.4 Write integration test: auth events are logged correctly
  - [ ] 8.5 Write security test: expired token returns 401
  - [ ] 8.6 Write security test: invalid org_id in header vs JWT returns 403
  - [ ] 8.7 Verify all tests pass: `pnpm run test`

## Dev Notes

### Architecture Constraints

- **Auth Provider:** Supabase Auth (GoTrue) per architecture decision [Source: docs/architecture.md#Decision-Summary-Table]
- **JWT Pattern:** Access token includes `sub`, `org_id`, `role`; verified by middleware [Source: docs/architecture.md#ADR-003]
- **RLS Integration:** `app.current_org_id` MUST be set from verified JWT claim, not from untrusted headers [Source: docs/architecture.md#ADR-003]
- **Cookie Security:** HTTP-only, Secure, SameSite=Lax for access tokens [Source: docs/sprint-artifacts/tech-spec-epic-1.md#Security]
- **Event Naming:** `xentri.user.signup.v1`, `xentri.user.login.v1` per event naming convention [Source: docs/architecture.md#Naming-Location-Patterns]

### Technical Specifications

**Auth API Endpoints:**
| Method | Path | Request | Response | Events |
|--------|------|---------|----------|--------|
| POST | `/api/v1/auth/signup` | `{email, password, name}` | `{user, org, access_token}` | `xentri.user.signup.v1` |
| POST | `/api/v1/auth/login` | `{email, password}` | `{user, access_token}` | `xentri.user.login.v1` |
| GET | `/api/v1/auth/oauth/google` | - | Redirect to Google | - |
| GET | `/api/v1/auth/oauth/callback` | OAuth code | `{user, access_token}` | `xentri.user.signup.v1` or `xentri.user.login.v1` |
| POST | `/api/v1/auth/refresh` | Refresh token cookie | `{access_token}` | - |
| POST | `/api/v1/auth/logout` | - | `{success: true}` | - |
| POST | `/api/v1/auth/reset-password` | `{email}` | `{success: true}` | - |

[Source: docs/sprint-artifacts/tech-spec-epic-1.md#APIs-and-Interfaces]

**JWT Claims Structure:**
```typescript
interface JWTClaims {
  sub: string;        // user_id (UUID)
  org_id: string;     // primary organization ID (UUID)
  role: 'owner' | 'admin' | 'member';
  email: string;
  iat: number;
  exp: number;
}
```
[Source: docs/architecture.md#Auth-Patterns]

### Project Structure Notes

**Files to create/modify:**
```
services/core-api/
├── src/
│   ├── domain/
│   │   └── auth/
│   │       ├── AuthService.ts
│   │       └── AuthService.test.ts
│   ├── routes/
│   │   ├── auth.ts
│   │   └── auth.test.ts
│   └── middleware/
│       ├── authMiddleware.ts (new)
│       └── orgContext.ts (modify - JWT validation)

apps/shell/
├── src/
│   ├── pages/
│   │   ├── login.astro
│   │   ├── signup.astro
│   │   └── reset-password.astro
│   └── middleware/
│       └── auth.ts

packages/ts-schema/src/
├── auth.ts (extend with JWT claims types)
└── index.ts (re-export)
```

### Learnings from Previous Story

**From Story 1-2-event-backbone-database-schema (Status: review)**

- **Critical Security Gap Identified**: Story 1.2 review found that org/user validation trusts headers without JWT binding. This story MUST fix that by implementing proper JWT-backed authentication.
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
  - This story directly addresses this by implementing proper auth middleware

- **Prisma Adapter Pattern**: Story 1.2 established `@prisma/adapter-pg` + `pg` pattern for Prisma 7.0 client initialization. Follow same pattern.
  [Source: docs/sprint-artifacts/1-2-event-backbone-database-schema.md#Debug-Log-References]

- **OrgContext Middleware Location**: `services/core-api/src/middleware/orgContext.ts` exists but needs JWT validation added
  [Source: docs/sprint-artifacts/1-2-event-backbone-database-schema.md#File-List]

### Edge Cases

- OAuth callback state validation to prevent CSRF
- Refresh token rotation failures: ensure old token is invalidated even if new token generation fails
- Account lockout after N failed login attempts (consider for security)
- Email verification flow (may defer to future story)
- User with multiple orgs: determine primary org for JWT claim

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

**2025-11-26 - Task 1 Plan:**
- Add `@supabase/supabase-js@^2.49.0`, `@fastify/cookie@^11.0.1` dependencies
- Create `services/core-api/src/infra/supabase.ts` client utility
- Create `.env.example` with required Supabase env vars
- Document manual Supabase dashboard configuration steps
- JWT claims require Supabase Auth Hook for custom claims (`org_id`, `role`)

### Completion Notes List

### File List

---

## Change Log

| Date | Author | Change |
|------|--------|--------|
| 2025-11-26 | SM Agent (Bob) | Initial draft created from Epic 1 tech spec, epics.md, architecture.md, and Story 1.2 learnings |
