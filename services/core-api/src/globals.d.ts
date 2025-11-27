declare module 'fastify-raw-body' {
  import type { FastifyPluginCallback } from 'fastify';

  interface RawBodyPluginOptions {
    field?: string;
    runFirst?: boolean;
    global?: boolean;
    routes?: string[];
    encoding?: BufferEncoding | false;
  }

  const rawBody: FastifyPluginCallback<RawBodyPluginOptions>;
  export = rawBody;
}
