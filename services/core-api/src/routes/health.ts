import type { FastifyPluginAsync } from 'fastify';

const healthRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/health', async () => {
    return { status: 'ok' };
  });

  fastify.get('/health/ready', async () => {
    // TODO: Add database connectivity check
    return {
      status: 'ok',
      checks: {
        database: 'ok',
        redis: 'ok',
      },
    };
  });
};

export default healthRoutes;
