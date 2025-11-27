import type { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify';
import { ZodError } from 'zod';
import { EventService } from '../domain/events/EventService.js';
import {
  clerkAuthMiddleware,
  requireOrgContext,
} from '../middleware/clerkAuth.js';
import {
  orgContextMiddleware,
  problemDetails,
} from '../middleware/orgContext.js';
import {
  CreateEventSchema,
  EventTypeSchema,
  type EventType,
} from '@xentri/ts-schema';

/**
 * Events API Routes
 *
 * AC6: POST /api/v1/events accepts SystemEvent payloads, validates via Zod schema,
 *      and returns {event_id, acknowledged: true}
 *
 * AC7: GET /api/v1/events returns org-scoped events with query params:
 *      ?type=, ?since=, ?limit=; supports cursor-based pagination
 */
const eventsRoutes: FastifyPluginAsync = async (fastify) => {
  const eventService = new EventService();

  // Apply authentication and org context middleware to all routes
  // Order matters: clerkAuth first (verifies JWT), then orgContext (sets org_id)
  fastify.addHook('preHandler', clerkAuthMiddleware);
  fastify.addHook('preHandler', orgContextMiddleware);

  /**
   * POST /api/v1/events
   *
   * Creates a new system event.
   *
   * Request Body: CreateEventInput (SystemEvent without id/created_at)
   * Response: { event_id: string, acknowledged: true }
   *
   * Errors:
   * - 400: Invalid request body
   * - 403: Missing/invalid x-org-id header
   * - 422: Zod validation error
   * - 500: Internal server error
   */
  fastify.post('/api/v1/events', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // Auth and org context already verified by preHandler hooks
      const orgId = request.orgId!;
      const body = request.body as Record<string, unknown>;

      // Validate input
      const input = CreateEventSchema.parse(body);

      // Verify org_id in body matches header
      if (input.org_id !== orgId) {
        return reply.status(403).send(
          problemDetails(
            403,
            'Forbidden',
            'org_id in body must match x-org-id header',
            request.id
          )
        );
      }

      // Verify user_id aligns with authenticated user (if provided)
      if (input.user_id && request.userId && input.user_id !== request.userId) {
        return reply.status(403).send(
          problemDetails(
            403,
            'Forbidden',
            'user_id in body must match authenticated user',
            request.id
          )
        );
      }

      // Create event
      const result = await eventService.createEvent(input, orgId);

      reply.status(201).send(result);
    } catch (error) {
      if (error instanceof ZodError) {
        return reply.status(422).send(
          problemDetails(
            422,
            'Validation Error',
            error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('; '),
            request.id
          )
        );
      }

      fastify.log.error(error, 'Failed to create event');
      return reply.status(500).send(
        problemDetails(
          500,
          'Internal Server Error',
          'Failed to create event',
          request.id
        )
      );
    }
  });

  /**
   * GET /api/v1/events
   *
   * Lists events for the authenticated organization.
   *
   * Query Parameters:
   * - type: Filter by event type (optional)
   * - since: Filter events after this ISO8601 timestamp (optional)
   * - limit: Number of events to return, max 100, default 20 (optional)
   * - cursor: Pagination cursor from previous response (optional)
   *
   * Response: { data: SystemEvent[], meta: { cursor?: string, has_more: boolean } }
   *
   * Errors:
   * - 400: Invalid query parameters
   * - 403: Missing/invalid x-org-id header
   * - 500: Internal server error
   */
  fastify.get('/api/v1/events', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // Auth and org context already verified by preHandler hooks
      const orgId = request.orgId!;
      const query = request.query as Record<string, string | undefined>;

      // Parse query parameters
      let eventType: EventType | undefined;
      if (query.type) {
        const typeResult = EventTypeSchema.safeParse(query.type);
        if (!typeResult.success) {
          return reply.status(400).send(
            problemDetails(
              400,
              'Bad Request',
              `Invalid event type: ${query.type}`,
              request.id
            )
          );
        }
        eventType = typeResult.data;
      }

      let since: Date | undefined;
      if (query.since) {
        const parsedDate = new Date(query.since);
        if (isNaN(parsedDate.getTime())) {
          return reply.status(400).send(
            problemDetails(
              400,
              'Bad Request',
              'Invalid since parameter: must be ISO8601 timestamp',
              request.id
            )
          );
        }
        since = parsedDate;
      }

      let limit = 20;
      if (query.limit) {
        const parsedLimit = parseInt(query.limit, 10);
        if (isNaN(parsedLimit) || parsedLimit < 1 || parsedLimit > 100) {
          return reply.status(400).send(
            problemDetails(
              400,
              'Bad Request',
              'Invalid limit: must be integer between 1 and 100',
              request.id
            )
          );
        }
        limit = parsedLimit;
      }

      // List events
      const result = await eventService.listEvents(orgId, {
        type: eventType,
        since,
        limit,
        cursor: query.cursor,
      });

      reply.send(result);
    } catch (error) {
      fastify.log.error(error, 'Failed to list events');
      return reply.status(500).send(
        problemDetails(
          500,
          'Internal Server Error',
          'Failed to list events',
          request.id
        )
      );
    }
  });
};

export default eventsRoutes;
