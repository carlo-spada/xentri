import type { FastifyPluginAsync } from 'fastify';
import { getPrisma } from '../infra/db.js';

const healthRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/health', async () => {
    return { status: 'ok' };
  });

  fastify.get('/health/ready', async () => {
    const prisma = getPrisma();

    try {
      await prisma.$queryRaw`SELECT 1`;
      return {
        status: 'ok',
        checks: {
          database: 'ok',
        },
      };
    } catch (error) {
      fastify.log.error(error, 'Database readiness check failed');
      return {
        status: 'degraded',
        checks: {
          database: 'error',
        },
      };
    }
  });
};

export default healthRoutes;
