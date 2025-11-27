import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rawBody from 'fastify-raw-body';
import { clerkPlugin } from '@clerk/fastify';
import healthRoutes from './routes/health.js';
import eventsRoutes from './routes/events.js';
import briefsRoutes from './routes/briefs.js';
import usersRoutes from './routes/users.js';
import orgsRoutes from './routes/orgs.js';
import clerkWebhookRoutes from './routes/webhooks/clerk.js';
import { disconnectDb } from './infra/db.js';
import { createFastifyLoggerConfig, logger } from './lib/logger.js';
import { tracingPlugin } from './middleware/tracing.js';
import { initSentry, sentryPlugin, closeSentry } from './lib/sentry.js';

// NFR25: Initialize Sentry error tracking early
initSentry();

const server = Fastify({
  // NFR24: Structured JSON logging with correlation IDs
  logger: createFastifyLoggerConfig(),
  // Generate request IDs for correlation
  genReqId: () => crypto.randomUUID(),
});

// Security middleware
await server.register(helmet);
await server.register(cors, {
  origin: process.env.CORS_ORIGIN || 'http://localhost:4321',
  credentials: true,
});

// Clerk authentication plugin
// This enables getAuth() in routes and middleware
await server.register(clerkPlugin);

// NFR24: Tracing middleware for correlation IDs (trace_id, org_id, user_id)
// Registered after auth so user context is available
await server.register(tracingPlugin);

// NFR25: Sentry error tracking with request context
await server.register(sentryPlugin);

// Raw body for webhook verification (only for routes that need it)
await server.register(rawBody, {
  field: 'rawBody',
  runFirst: true,
  global: false,
  routes: ['/api/v1/webhooks/clerk'],
});

// Routes
await server.register(healthRoutes);
await server.register(eventsRoutes);
await server.register(briefsRoutes);
await server.register(usersRoutes);
await server.register(orgsRoutes);
await server.register(clerkWebhookRoutes);

// Graceful shutdown
server.addHook('onClose', async () => {
  await closeSentry(); // Flush Sentry events
  await disconnectDb();
});

const start = async () => {
  try {
    const port = parseInt(process.env.PORT || '3000', 10);
    const host = process.env.HOST || '0.0.0.0';

    await server.listen({ port, host });
    logger.info({ port, host }, 'Server started');
  } catch (err) {
    logger.error({ err }, 'Server startup failed');
    process.exit(1);
  }
};

start();

export default server;
