import type { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from 'fastify';

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

/**
 * Middleware to extract and validate org context from x-org-id header.
 *
 * For MVP, we skip full JWT validation and trust the header.
 * TODO: Story 1.3 will implement proper JWT validation.
 */
export function orgContextMiddleware(
  request: FastifyRequest,
  reply: FastifyReply,
  done: HookHandlerDoneFunction
): void {
  const orgId = request.headers['x-org-id'];

  if (!orgId || typeof orgId !== 'string') {
    reply.status(403).send(
      problemDetails(
        403,
        'Forbidden',
        'Missing or invalid x-org-id header',
        request.id
      )
    );
    return;
  }

  // Validate UUID format
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(orgId)) {
    reply.status(400).send(
      problemDetails(
        400,
        'Bad Request',
        'x-org-id must be a valid UUID',
        request.id
      )
    );
    return;
  }

  // Set org context on request
  request.orgId = orgId;

  // TODO: Story 1.3 - Extract user_id from JWT
  // For now, accept optional x-user-id header for testing
  const userId = request.headers['x-user-id'];
  if (userId && typeof userId === 'string' && uuidRegex.test(userId)) {
    request.userId = userId;
  }

  done();
}
