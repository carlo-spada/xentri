import type { MiddlewareHandler } from 'astro';
import crypto from 'crypto';
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  formatters: { level: (label) => ({ level: label }) },
  redact: ['headers.cookie', 'headers.authorization'],
});

export const onRequest: MiddlewareHandler = async ({ request }, next) => {
  const traceId = request.headers.get('x-trace-id') ?? crypto.randomUUID();
  const start = performance.now();

  const response = await next();
  const duration = performance.now() - start;

  logger.info(
    {
      trace_id: traceId,
      method: request.method,
      url: request.url,
      status: response.status,
      duration_ms: Number(duration.toFixed(2)),
    },
    'shell request'
  );

  response.headers.set('x-trace-id', traceId);
  return response;
};
