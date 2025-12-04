import type { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from 'fastify'
import { clerkClient, getAuth } from '@clerk/fastify'
import { problemDetails } from './orgContext.js'
import type { ClerkJWTClaims, ClerkOrgRole } from '@xentri/ts-schema'

// ===================
// Type Augmentation
// ===================

declare module 'fastify' {
  interface FastifyRequest {
    /** Clerk user ID from verified session */
    clerkUserId?: string
    /** Active organization ID from Clerk session */
    clerkOrgId?: string
    /** Role in active organization */
    clerkOrgRole?: ClerkOrgRole
    /** Full Clerk session claims */
    clerkClaims?: ClerkJWTClaims
  }
}

// ===================
// Middleware
// ===================

/**
 * Clerk authentication middleware.
 *
 * Verifies the Clerk session and extracts user/org context from JWT claims.
 * Attaches verified claims to request for downstream use.
 *
 * This middleware should be applied to protected routes after the Clerk plugin
 * has been registered on the Fastify instance.
 *
 * @throws 401 Unauthorized if no valid session
 */
export function clerkAuthMiddleware(
  request: FastifyRequest,
  reply: FastifyReply,
  done: HookHandlerDoneFunction
): void {
  const auth = getAuth(request)

  if (!auth.userId) {
    reply
      .status(401)
      .header('content-type', 'application/problem+json')
      .send(
        problemDetails(
          401,
          'Unauthorized',
          'Valid authentication required. Please sign in.',
          request.id
        )
      )
    return
  }

  // Extract claims from session
  request.clerkUserId = auth.userId
  request.clerkOrgId = auth.orgId || undefined
  request.clerkOrgRole = auth.orgRole as ClerkOrgRole | undefined

  // Build claims object for downstream use
  request.clerkClaims = {
    sub: auth.userId,
    email: '', // Will be populated from session claims if needed
    org_id: auth.orgId || undefined,
    org_role: auth.orgRole as ClerkOrgRole | undefined,
    org_slug: auth.orgSlug || undefined,
    iss: '', // Not needed for internal use
    iat: 0,
    exp: 0,
  }

  done()
}

/**
 * Middleware that requires an active organization context.
 *
 * Use after clerkAuthMiddleware for routes that require org context
 * (e.g., events, org-scoped resources).
 *
 * @throws 403 Forbidden if no active organization
 */
export function requireOrgContext(
  request: FastifyRequest,
  reply: FastifyReply,
  done: HookHandlerDoneFunction
): void {
  if (!request.clerkOrgId) {
    reply
      .status(403)
      .header('content-type', 'application/problem+json')
      .send(
        problemDetails(
          403,
          'Forbidden',
          'No active organization. Please select or create an organization.',
          request.id
        )
      )
    return
  }

  done()
}

/**
 * Middleware that allows optional authentication.
 *
 * Use for routes that work both authenticated and unauthenticated
 * (e.g., public endpoints with optional user context).
 */
export function optionalClerkAuth(
  request: FastifyRequest,
  _reply: FastifyReply,
  done: HookHandlerDoneFunction
): void {
  const auth = getAuth(request)

  if (auth.userId) {
    request.clerkUserId = auth.userId
    request.clerkOrgId = auth.orgId || undefined
    request.clerkOrgRole = auth.orgRole as ClerkOrgRole | undefined
  }

  done()
}

// ===================
// Utility Functions
// ===================

/**
 * Fetches full user details from Clerk Backend API.
 *
 * Use sparingly - this makes an API call to Clerk.
 * Prefer session claims for most use cases.
 */
export async function getClerkUser(userId: string) {
  return clerkClient.users.getUser(userId)
}

/**
 * Fetches organization details from Clerk Backend API.
 */
export async function getClerkOrganization(orgId: string) {
  return clerkClient.organizations.getOrganization({ organizationId: orgId })
}

/**
 * Checks if user is a member of the specified organization.
 *
 * Used for validating x-org-id header against user's actual memberships.
 */
export async function isUserOrgMember(userId: string, orgId: string): Promise<boolean> {
  try {
    const memberships = await clerkClient.users.getOrganizationMembershipList({
      userId,
    })

    return memberships.data.some((m) => m.organization.id === orgId)
  } catch {
    return false
  }
}
