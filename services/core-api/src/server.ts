import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import healthRoutes from './routes/health.js';

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

// Routes
await server.register(healthRoutes);

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
