import type { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from 'fastify';
import { isUserOrgMember } from './clerkAuth.js';

/**
 * Problem Details error response per RFC 7807
 */
export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail?: string;
  trace_id?: string;
}

/**
 * Creates a Problem Details error response
 */
export function problemDetails(
  status: number,
  title: string,
  detail?: string,
  traceId?: string
): ProblemDetails {
  const typeMap: Record<number, string> = {
    400: 'https://xentri.app/errors/bad-request',
    401: 'https://xentri.app/errors/unauthorized',
    403: 'https://xentri.app/errors/forbidden',
    404: 'https://xentri.app/errors/not-found',
    422: 'https://xentri.app/errors/validation',
    500: 'https://xentri.app/errors/internal',
  };

  return {
    type: typeMap[status] || 'https://xentri.app/errors/unknown',
    title,
    status,
    detail,
    trace_id: traceId,
  };
}

/**
 * Augment FastifyRequest with org context
 */
declare module 'fastify' {
  interface FastifyRequest {
    orgId?: string;
    userId?: string;
  }
}

// UUID validation regex
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// Clerk ID format (e.g., 'org_2abc123...')
const CLERK_ID_REGEX = /^(org|user)_[a-zA-Z0-9]+$/;

/**
 * Validates if a string is a valid org ID (UUID or Clerk format).
 */
function isValidOrgId(id: string): boolean {
  return UUID_REGEX.test(id) || CLERK_ID_REGEX.test(id);
}

/**
 * Middleware to extract and validate org context from Clerk JWT claims.
 *
 * SECURITY: This middleware MUST run AFTER clerkAuthMiddleware.
 * It uses the verified Clerk session claims, NOT untrusted headers.
 *
 * The x-org-id header is only used for org-switching when a user
 * belongs to multiple organizations. In that case, we verify the
 * user actually has access to the requested org via Clerk's API.
 *
 * Per ADR-003: `app.current_org_id` MUST be set from verified JWT claim,
 * not from untrusted headers.
 */
export async function orgContextMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  // Primary source: Clerk session claims (set by clerkAuthMiddleware)
  const clerkOrgId = request.clerkOrgId;
  const clerkUserId = request.clerkUserId;

  // Set user ID from verified Clerk session
  if (clerkUserId) {
    request.userId = clerkUserId;
  }

  // Check for x-org-id header (org-switching)
  const headerOrgId = request.headers['x-org-id'];

  // Determine which org ID to use
  let effectiveOrgId: string | undefined = clerkOrgId;

  if (headerOrgId && typeof headerOrgId === 'string') {
    if (!isValidOrgId(headerOrgId)) {
      return reply
        .status(400)
        .header('content-type', 'application/problem+json')
        .send(
          problemDetails(
            400,
            'Bad Request',
            'x-org-id must be a valid organization ID',
            request.id
          )
        );
    }

    // If header differs from session, verify membership via Clerk
    if (headerOrgId !== clerkOrgId) {
      if (!clerkUserId) {
        return reply
          .status(401)
          .header('content-type', 'application/problem+json')
          .send(
            problemDetails(
              401,
              'Unauthorized',
              'Authentication required for org-switching',
              request.id
            )
          );
      }

      const isMember = await isUserOrgMember(clerkUserId, headerOrgId);
      if (!isMember) {
        return reply
          .status(403)
          .header('content-type', 'application/problem+json')
          .send(
            problemDetails(
              403,
              'Forbidden',
              'You do not have access to the requested organization',
              request.id
            )
          );
      }
    }

    effectiveOrgId = headerOrgId;
  }

  if (!effectiveOrgId) {
    return reply
      .status(403)
      .header('content-type', 'application/problem+json')
      .send(
        problemDetails(
          403,
          'Forbidden',
          'No active organization. Please select or create an organization.',
          request.id
        )
      );
  }

  // Set org context on request
  request.orgId = effectiveOrgId;
}

/**
 * Async middleware that verifies org membership when x-org-id header
 * differs from Clerk session org.
 *
 * Use this when you need strict org-switching validation.
 * Note: This makes an API call to Clerk, so use sparingly.
 */
export async function orgContextMiddlewareAsync(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const clerkOrgId = request.clerkOrgId;
  const clerkUserId = request.clerkUserId;
  const headerOrgId = request.headers['x-org-id'];

  // Set user ID from verified Clerk session
  if (clerkUserId) {
    request.userId = clerkUserId;
  }

  // If no header or header matches session, use session org
  if (!headerOrgId || headerOrgId === clerkOrgId) {
    request.orgId = clerkOrgId;
    return;
  }

  // Validate header format
  if (typeof headerOrgId !== 'string' || !isValidOrgId(headerOrgId)) {
    return reply
      .status(400)
      .header('content-type', 'application/problem+json')
      .send(
        problemDetails(
          400,
          'Bad Request',
          'x-org-id must be a valid organization ID',
          request.id
        )
      );
  }

  // Header differs from session - verify user has access to requested org
  if (!clerkUserId) {
    return reply
      .status(401)
      .header('content-type', 'application/problem+json')
      .send(
        problemDetails(
          401,
          'Unauthorized',
          'Authentication required for org-switching',
          request.id
        )
      );
  }

  // Check membership via Clerk API
  const isMember = await isUserOrgMember(clerkUserId, headerOrgId);

  if (!isMember) {
    return reply
      .status(403)
      .header('content-type', 'application/problem+json')
      .send(
        problemDetails(
          403,
          'Forbidden',
          'You do not have access to the requested organization',
          request.id
        )
      );
  }

  // User is verified member of requested org
  request.orgId = headerOrgId;
}

/**
 * Legacy middleware for backwards compatibility.
 *
 * @deprecated Use orgContextMiddleware with clerkAuthMiddleware instead.
 * This middleware trusts headers without JWT verification.
 */
export function legacyOrgContextMiddleware(
  request: FastifyRequest,
  reply: FastifyReply,
  done: HookHandlerDoneFunction
): void {
  const orgId = request.headers['x-org-id'];

  if (!orgId || typeof orgId !== 'string') {
    reply
      .status(403)
      .header('content-type', 'application/problem+json')
      .send(
        problemDetails(
          403,
          'Forbidden',
          'Missing or invalid x-org-id header',
          request.id
        )
      );
    return;
  }

  if (!isValidOrgId(orgId)) {
    reply
      .status(400)
      .header('content-type', 'application/problem+json')
      .send(
        problemDetails(
          400,
          'Bad Request',
          'x-org-id must be a valid organization ID',
          request.id
        )
      );
    return;
  }

  request.orgId = orgId;

  const userId = request.headers['x-user-id'];
  if (userId && typeof userId === 'string') {
    request.userId = userId;
  }

  done();
}
