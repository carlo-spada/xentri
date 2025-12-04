import type { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify'
import { ZodError } from 'zod'
import { BriefService } from '../domain/briefs/BriefService.js'
import { clerkAuthMiddleware, requireOrgContext } from '../middleware/clerkAuth.js'
import { orgContextMiddleware, problemDetails } from '../middleware/orgContext.js'
import { CreateBriefInputSchema, UpdateBriefInputSchema } from '@xentri/ts-schema'

/**
 * Briefs API Routes
 *
 * Story 1.6: Create Brief API endpoints for Universal Brief feature
 *
 * AC1: Users can create a Brief draft
 * AC2: brief_created event is emitted on creation
 * AC6: Event write failures surface visibly with retry option
 */
const briefsRoutes: FastifyPluginAsync = async (fastify) => {
  const briefService = new BriefService()

  // Apply authentication and org context middleware to all routes
  fastify.addHook('preHandler', clerkAuthMiddleware)
  fastify.addHook('preHandler', orgContextMiddleware)

  /**
   * POST /api/v1/briefs
   *
   * Creates a new Brief draft for the organization.
   *
   * Request Body: CreateBriefInput { sections?: BriefSections, schemaVersion?: string }
   * Response: Brief
   *
   * Errors:
   * - 401: Unauthorized
   * - 403: Missing/invalid org context
   * - 422: Validation error
   * - 500: Internal server error (event write failure surfaced per AC6)
   */
  fastify.post('/api/v1/briefs', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const orgId = request.orgId!
      const userId = request.userId!
      const body = request.body as Record<string, unknown>

      // Validate input
      const input = CreateBriefInputSchema.parse(body)

      // Create Brief (BriefService handles event emission)
      const brief = await briefService.createBrief({
        orgId,
        userId,
        input,
      })

      reply.status(201).send({ data: brief })
    } catch (error) {
      if (error instanceof ZodError) {
        return reply
          .status(422)
          .send(
            problemDetails(
              422,
              'Validation Error',
              error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('; '),
              request.id
            )
          )
      }

      // AC6: Surface event write failures visibly
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      fastify.log.error(error, 'Failed to create brief')

      return reply
        .status(500)
        .send(
          problemDetails(
            500,
            'Brief Creation Failed',
            `Failed to create brief: ${errorMessage}. Please retry.`,
            request.id
          )
        )
    }
  })

  /**
   * GET /api/v1/briefs/current
   *
   * Gets the current organization's Brief (most recent).
   *
   * Response: { data: Brief | null }
   *
   * Errors:
   * - 401: Unauthorized
   * - 403: Missing/invalid org context
   * - 500: Internal server error
   */
  fastify.get('/api/v1/briefs/current', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const orgId = request.orgId!

      const brief = await briefService.getCurrentBrief({ orgId })

      reply.send({ data: brief })
    } catch (error) {
      fastify.log.error(error, 'Failed to get current brief')
      return reply
        .status(500)
        .send(
          problemDetails(500, 'Internal Server Error', 'Failed to get current brief', request.id)
        )
    }
  })

  /**
   * GET /api/v1/briefs/:id
   *
   * Gets a Brief by ID.
   *
   * Response: { data: Brief }
   *
   * Errors:
   * - 401: Unauthorized
   * - 403: Missing/invalid org context
   * - 404: Brief not found
   * - 500: Internal server error
   */
  fastify.get<{
    Params: { id: string }
  }>('/api/v1/briefs/:id', async (request, reply) => {
    try {
      const orgId = request.orgId!
      const briefId = request.params.id

      const brief = await briefService.getBrief({ briefId, orgId })

      if (!brief) {
        return reply
          .status(404)
          .send(problemDetails(404, 'Not Found', `Brief not found: ${briefId}`, request.id))
      }

      reply.send({ data: brief })
    } catch (error) {
      fastify.log.error(error, 'Failed to get brief')
      return reply
        .status(500)
        .send(problemDetails(500, 'Internal Server Error', 'Failed to get brief', request.id))
    }
  })

  /**
   * PATCH /api/v1/briefs/:id
   *
   * Updates a Brief's sections.
   *
   * Request Body: UpdateBriefInput { sections?: Partial<BriefSections>, sectionStatus?: ... }
   * Response: { data: Brief }
   *
   * Errors:
   * - 401: Unauthorized
   * - 403: Missing/invalid org context
   * - 404: Brief not found
   * - 422: Validation error
   * - 500: Internal server error
   */
  fastify.patch<{
    Params: { id: string }
  }>('/api/v1/briefs/:id', async (request, reply) => {
    try {
      const orgId = request.orgId!
      const userId = request.userId!
      const briefId = request.params.id
      const body = request.body as Record<string, unknown>

      // Validate input
      const input = UpdateBriefInputSchema.parse(body)

      // Update Brief
      const brief = await briefService.updateBrief({
        briefId,
        orgId,
        userId,
        input,
      })

      reply.send({ data: brief })
    } catch (error) {
      if (error instanceof ZodError) {
        return reply
          .status(422)
          .send(
            problemDetails(
              422,
              'Validation Error',
              error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('; '),
              request.id
            )
          )
      }

      const errorMessage = error instanceof Error ? error.message : 'Unknown error'

      // Check if it's a not found error
      if (errorMessage.includes('Brief not found')) {
        return reply.status(404).send(problemDetails(404, 'Not Found', errorMessage, request.id))
      }

      fastify.log.error(error, 'Failed to update brief')
      return reply
        .status(500)
        .send(
          problemDetails(
            500,
            'Internal Server Error',
            `Failed to update brief: ${errorMessage}`,
            request.id
          )
        )
    }
  })
}

export default briefsRoutes
