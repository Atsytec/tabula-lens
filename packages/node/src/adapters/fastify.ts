import type { FastifyRequest, FastifyReply } from 'fastify';
import { TabulaLens, RequestContext } from '../TabulaLens';
import { generateId } from '../logger';

export function fastifyAdapter(
  tabulaLens: TabulaLens
): (request: FastifyRequest, reply: FastifyReply) => Promise<void> {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const adapterRequestId = generateId();
    const logger = tabulaLens.getLogger();

    logger.debug('Fastify adapter received request', {
      adapterRequestId,
      method: request.method,
      path: request.url.split('?')[0],
      ip: (request as unknown as { ip?: string }).ip,
    });

    try {
      const requestContext: RequestContext = {
        method: request.method,
        path: request.url.split('?')[0],
        query: request.query as Record<string, string>,
        body: request.body,
      };

      const responseContext = await tabulaLens.handle(requestContext);

      logger.debug('Fastify adapter sending response', {
        adapterRequestId,
        status: responseContext.status,
        contentType: responseContext.headers['Content-Type'],
      });

      reply.code(responseContext.status);

      Object.entries(responseContext.headers).forEach(([key, value]) => {
        reply.header(key, value);
      });

      reply.send(responseContext.body);
    } catch (error) {
      logger.error('Fastify adapter error', {
        adapterRequestId,
        method: request.method,
        path: request.url.split('?')[0],
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      throw error;
    }
  };
}
