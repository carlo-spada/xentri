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

const server = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
    transport:
      process.env.NODE_ENV === 'development'
        ? {
            target: 'pino-pretty',
            options: { colorize: true },
          }
        : undefined,
  },
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
  await disconnectDb();
});

const start = async () => {
  try {
    const port = parseInt(process.env.PORT || '3000', 10);
    const host = process.env.HOST || '0.0.0.0';

    await server.listen({ port, host });
    console.log(`Server listening on http://${host}:${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();

export default server;
