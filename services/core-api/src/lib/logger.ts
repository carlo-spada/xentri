/**
 * Structured logging with Pino - NFR24
 *
 * Features:
 * - JSON format for production, pretty print for development
 * - Correlation IDs: trace_id, org_id, user_id
 * - PII scrubbing (NFR11): email, name redacted
 * - Log levels: error, warn, info, debug (debug only in dev)
 */

import pino, { Logger, LoggerOptions } from 'pino';
import { FastifyRequest } from 'fastify';
import crypto from 'crypto';

// PII fields to redact from logs (NFR11)
const PII_REDACT_PATHS = [
  'req.headers.authorization',
  'req.headers.cookie',
  'email',
  'name',
  'firstName',
  'lastName',
  'user.email',
  'user.name',
  'body.email',
  'body.name',
  'body.firstName',
  'body.lastName',
];

// Base logger configuration
const baseConfig: LoggerOptions = {
  level: process.env.LOG_LEVEL || 'info',
  formatters: {
    level: (label) => ({ level: label }),
    bindings: () => ({}), // Don't include pid/hostname by default
  },
  redact: {
    paths: PII_REDACT_PATHS,
    censor: '[REDACTED]',
  },
  timestamp: pino.stdTimeFunctions.isoTime,
};

// Create the base logger
const isDevelopment = process.env.NODE_ENV === 'development';

export const logger: Logger = isDevelopment
  ? pino({
      ...baseConfig,
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      },
    })
  : pino(baseConfig);

/**
 * Request context for correlation IDs
 */
export interface RequestContext {
  trace_id: string;
  org_id?: string;
  user_id?: string;
  request_id: string;
}

/**
 * Extract or generate trace_id from request headers
 * Supports W3C Trace Context (traceparent) and custom x-trace-id header
 */
export function extractTraceId(request: FastifyRequest): string {
  // Check for W3C traceparent header first
  const traceparent = request.headers['traceparent'] as string | undefined;
  if (traceparent) {
    // traceparent format: {version}-{trace-id}-{parent-id}-{trace-flags}
    const parts = traceparent.split('-');
    if (parts.length >= 2 && parts[1].length === 32) {
      return parts[1];
    }
  }

  // Fall back to custom x-trace-id header
  const customTraceId = request.headers['x-trace-id'] as string | undefined;
  if (customTraceId) {
    return customTraceId;
  }

  // Generate new trace ID if none provided
  return crypto.randomUUID().replace(/-/g, '');
}

/**
 * Create a child logger with request context
 * Use this in route handlers for correlated logging
 */
export function createRequestLogger(
  request: FastifyRequest,
  additionalContext?: Record<string, unknown>
): Logger {
  const context: RequestContext = {
    trace_id: extractTraceId(request),
    request_id: request.id,
    // These will be populated from Clerk auth and org context middleware
    org_id: (request as unknown as { orgContext?: { orgId: string } }).orgContext?.orgId,
    user_id: (request as unknown as { auth?: { userId: string } }).auth?.userId,
  };

  return logger.child({
    ...context,
    ...additionalContext,
  });
}

/**
 * Log levels explanation:
 * - error: Application errors requiring immediate attention
 * - warn: Potentially harmful situations (degraded state, deprecations)
 * - info: General operational messages (requests, state changes)
 * - debug: Detailed debugging info (only in development)
 */
export const LogLevel = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug',
} as const;

/**
 * Fastify logger options - use this when configuring Fastify server
 * Replaces the default logger with our structured Pino logger
 */
export function createFastifyLoggerConfig(): LoggerOptions | boolean {
  if (isDevelopment) {
    return {
      ...baseConfig,
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      },
    };
  }
  return baseConfig;
}

export default logger;
