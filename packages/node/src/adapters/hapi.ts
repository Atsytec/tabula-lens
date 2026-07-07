import type { Request, ResponseToolkit } from '@hapi/hapi';
import { TabulaLens, RequestContext } from '../TabulaLens';
import { generateId } from '../logger';

export function hapiAdapter(
  tabulaLens: TabulaLens
): (request: Request, h: ResponseToolkit) => Promise<ReturnType<ResponseToolkit['response']>> {
  return async (request: Request, h: ResponseToolkit) => {
    const adapterRequestId = generateId();
    const logger = tabulaLens.getLogger();

    logger.debug('Hapi adapter received request', {
      adapterRequestId,
      method: request.method,
      path: request.path,
      ip: (request as unknown as { info?: { remoteAddress?: string } }).info?.remoteAddress,
    });

    try {
      const requestContext: RequestContext = {
        method: request.method,
        path: request.path,
        query: request.query as Record<string, string>,
        body: request.payload,
      };

      const responseContext = await tabulaLens.handle(requestContext);

      logger.debug('Hapi adapter sending response', {
        adapterRequestId,
        status: responseContext.status,
        contentType: responseContext.headers['Content-Type'],
      });

      let response = h.response(responseContext.body as unknown).code(responseContext.status);

      Object.entries(responseContext.headers).forEach(([key, value]) => {
        response = response.header(key, value);
      });

      return response;
    } catch (error) {
      logger.error('Hapi adapter error', {
        adapterRequestId,
        method: request.method,
        path: request.path,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      throw error;
    }
  };
}
