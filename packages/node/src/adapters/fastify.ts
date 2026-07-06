import type { FastifyRequest, FastifyReply } from 'fastify';
import { TabulaLens, RequestContext } from '../TabulaLens';

export function fastifyAdapter(
  tabulaLens: TabulaLens
): (request: FastifyRequest, reply: FastifyReply) => Promise<void> {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const requestContext: RequestContext = {
      method: request.method,
      path: request.url.split('?')[0],
      query: request.query as Record<string, string>,
      body: request.body,
    };

    const responseContext = await tabulaLens.handle(requestContext);

    reply.code(responseContext.status);

    Object.entries(responseContext.headers).forEach(([key, value]) => {
      reply.header(key, value);
    });

    reply.send(responseContext.body);
  };
}
