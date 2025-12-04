/**
 * Tracing Middleware - NFR24
 *
 * Adds correlation IDs to every request:
 * - trace_id: From header or generated
 * - org_id: From org context (after auth)
 * - user_id: From Clerk auth (after auth)
 *
 * Also sets trace_id in response headers for debugging.
 */

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { extractTraceId, createRequestLogger, logger } from '../lib/logger.js'
import crypto from 'crypto'

// Extend Fastify types for our custom properties
declare module 'fastify' {
  interface FastifyRequest {
    traceId: string
    // Note: Fastify already has 'log' property, we just enrich it with context
  }
}

/**
 * Register tracing plugin with Fastify
 * This should be registered BEFORE routes but AFTER auth plugins
 */
export async function tracingPlugin(fastify: FastifyInstance): Promise<void> {
  // Add trace_id to every request
  fastify.addHook('onRequest', async (request: FastifyRequest, reply: FastifyReply) => {
    // Extract or generate trace ID
    const traceId = extractTraceId(request)
    request.traceId = traceId

    // Set trace_id in response headers for client debugging
    reply.header('x-trace-id', traceId)
  })

  // Enrich Fastify's request logger with correlation context
  // Using serializers to add context to every log entry
  fastify.addHook('preHandler', async (request: FastifyRequest) => {
    // Get auth context if available
    const auth = (request as unknown as { auth?: { userId: string } }).auth
    const orgContext = (request as unknown as { orgContext?: { orgId: string } }).orgContext

    // Bind correlation IDs to request logger
    request.log = request.log.child({
      trace_id: request.traceId,
      org_id: orgContext?.orgId,
      user_id: auth?.userId,
    })
  })

  // Log request completion with timing
  fastify.addHook('onResponse', async (request: FastifyRequest, reply: FastifyReply) => {
    const responseLogger = request.log.child({ trace_id: request.traceId })
    responseLogger.info(
      {
        method: request.method,
        url: request.url,
        statusCode: reply.statusCode,
        responseTime: reply.elapsedTime,
      },
      'request completed'
    )
  })

  // Log errors with context
  fastify.addHook(
    'onError',
    async (request: FastifyRequest, _reply: FastifyReply, error: Error) => {
      const errorLogger = request.log.child({ trace_id: request.traceId })
      errorLogger.error(
        {
          method: request.method,
          url: request.url,
          err: {
            message: error.message,
            stack: error.stack,
            name: error.name,
          },
        },
        'request error'
      )
    }
  )

  logger.info('Tracing middleware registered')
}

/**
 * Generate a W3C traceparent header value
 * Format: {version}-{trace-id}-{parent-id}-{trace-flags}
 */
export function generateTraceparent(traceId?: string): string {
  const version = '00'
  const trace = traceId || crypto.randomUUID().replace(/-/g, '')
  const parentId = crypto.randomBytes(8).toString('hex')
  const flags = '01' // sampled

  return `${version}-${trace}-${parentId}-${flags}`
}

export default tracingPlugin
