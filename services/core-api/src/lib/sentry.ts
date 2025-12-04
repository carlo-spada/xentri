/**
 * Sentry Error Tracking - NFR25
 *
 * Features:
 * - Exception capture with stack traces
 * - Context injection (org_id, user_id, trace_id)
 * - Environment-based configuration
 * - PII scrubbing for privacy compliance
 */

import * as Sentry from '@sentry/node'
import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify'
import { logger } from './logger.js'

// Sentry DSN from environment - if not set, Sentry is disabled
const SENTRY_DSN = process.env.SENTRY_DSN

/**
 * Initialize Sentry SDK
 * Call this early in the application startup
 */
export function initSentry(): void {
  if (!SENTRY_DSN) {
    logger.info('Sentry DSN not configured - error tracking disabled')
    return
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    release: process.env.APP_VERSION || 'unknown',

    // Sample rate for performance monitoring (0-1)
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

    // Don't send PII to Sentry
    sendDefaultPii: false,

    // Before sending, scrub sensitive data
    beforeSend(event) {
      // Remove sensitive headers
      if (event.request?.headers) {
        delete event.request.headers['authorization']
        delete event.request.headers['cookie']
        delete event.request.headers['x-api-key']
      }

      // Scrub user data except id
      if (event.user) {
        event.user = {
          id: event.user.id,
          // Remove email, name, etc.
        }
      }

      return event
    },

    // Ignore common non-error events
    ignoreErrors: [
      // Network errors that are expected
      'Network request failed',
      'Failed to fetch',
      // User-initiated navigation
      'AbortError',
    ],
  })

  logger.info({ dsn: SENTRY_DSN.substring(0, 20) + '...' }, 'Sentry initialized')
}

/**
 * Set user context for error tracking
 * Call this after authentication succeeds
 */
export function setSentryUser(userId?: string, orgId?: string): void {
  if (!SENTRY_DSN) return

  Sentry.setUser(userId ? { id: userId } : null)

  if (orgId) {
    Sentry.setTag('org_id', orgId)
  }
}

/**
 * Set trace context for error correlation
 */
export function setSentryTrace(traceId: string): void {
  if (!SENTRY_DSN) return

  Sentry.setTag('trace_id', traceId)
}

/**
 * Capture an exception with context
 */
export function captureException(
  error: Error,
  context?: {
    traceId?: string
    orgId?: string
    userId?: string
    extra?: Record<string, unknown>
  }
): string | undefined {
  if (!SENTRY_DSN) {
    logger.error({ err: error, context }, 'Error captured (Sentry disabled)')
    return undefined
  }

  return Sentry.captureException(error, {
    tags: {
      ...(context?.traceId && { trace_id: context.traceId }),
      ...(context?.orgId && { org_id: context.orgId }),
    },
    user: context?.userId ? { id: context.userId } : undefined,
    extra: context?.extra,
  })
}

/**
 * Capture a message for debugging
 */
export function captureMessage(
  message: string,
  level: 'info' | 'warning' | 'error' = 'info'
): string | undefined {
  if (!SENTRY_DSN) {
    logger.info({ message, level }, 'Message captured (Sentry disabled)')
    return undefined
  }

  return Sentry.captureMessage(message, level)
}

/**
 * Fastify plugin for Sentry error handling
 * Registers hooks to capture errors with request context
 */
export async function sentryPlugin(fastify: FastifyInstance): Promise<void> {
  if (!SENTRY_DSN) {
    logger.info('Sentry plugin skipped - DSN not configured')
    return
  }

  // Add request context to Sentry scope
  fastify.addHook('preHandler', async (request: FastifyRequest) => {
    const traceId = (request as unknown as { traceId?: string }).traceId
    const auth = (request as unknown as { auth?: { userId: string } }).auth
    const orgContext = (request as unknown as { orgContext?: { orgId: string } }).orgContext

    // Set tags on current scope (Sentry v8+ API)
    if (traceId) Sentry.setTag('trace_id', traceId)
    if (orgContext?.orgId) Sentry.setTag('org_id', orgContext.orgId)
    if (auth?.userId) Sentry.setUser({ id: auth.userId })

    Sentry.setExtra('request', {
      method: request.method,
      url: request.url,
      headers: {
        'user-agent': request.headers['user-agent'],
        'content-type': request.headers['content-type'],
      },
    })
  })

  // Capture unhandled errors
  fastify.addHook(
    'onError',
    async (request: FastifyRequest, _reply: FastifyReply, error: Error) => {
      const traceId = (request as unknown as { traceId?: string }).traceId
      const auth = (request as unknown as { auth?: { userId: string } }).auth
      const orgContext = (request as unknown as { orgContext?: { orgId: string } }).orgContext

      captureException(error, {
        traceId,
        orgId: orgContext?.orgId,
        userId: auth?.userId,
        extra: {
          method: request.method,
          url: request.url,
        },
      })
    }
  )

  // Clear scope after request (Sentry v8+ API)
  fastify.addHook('onResponse', async () => {
    Sentry.setUser(null)
    Sentry.setTag('trace_id', undefined)
    Sentry.setTag('org_id', undefined)
    Sentry.setExtra('request', undefined)
  })

  logger.info('Sentry plugin registered')
}

/**
 * Flush Sentry events before shutdown
 */
export async function closeSentry(): Promise<void> {
  if (!SENTRY_DSN) return

  await Sentry.close(2000)
  logger.info('Sentry closed')
}

export default {
  initSentry,
  setSentryUser,
  setSentryTrace,
  captureException,
  captureMessage,
  sentryPlugin,
  closeSentry,
}
