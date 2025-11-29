import type { FastifyPluginAsync } from 'fastify';
import os from 'os';

// Minimal metrics endpoint for smoke/ops checks
const metricsRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/api/v1/metrics', async () => {
    return {
      status: 'ok',
      uptime_seconds: process.uptime(),
      memory: process.memoryUsage(),
      load: os.loadavg(),
      pid: process.pid,
    };
  });
};

export default metricsRoutes;
