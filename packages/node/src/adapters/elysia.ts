import { TabulaLens, RequestContext } from '../TabulaLens';
import { generateId } from '../logger';

export interface ElysiaAdapterOptions {
  parseBody?: boolean;
}

export function createElysiaHandler(tabulaLens: TabulaLens, options?: ElysiaAdapterOptions) {
  return async (ctx: {
    request: Request;
    path: string;
    query: Record<string, string>;
    body?: unknown;
    set: { headers: Record<string, string>; status?: number };
  }) => {
    const adapterRequestId = generateId();
    const logger = tabulaLens.getLogger();

    logger.debug('Elysia adapter received request', {
      adapterRequestId,
      method: ctx.request.method,
      path: ctx.path,
    });

    try {
      const requestBody = options?.parseBody ? ctx.body : undefined;

      const requestContext: RequestContext = {
        method: ctx.request.method,
        path: ctx.path,
        query: ctx.query,
        body: requestBody,
      };

      const responseContext = await tabulaLens.handle(requestContext);

      logger.debug('Elysia adapter sending response', {
        adapterRequestId,
        status: responseContext.status,
        contentType: responseContext.headers['Content-Type'],
      });

      ctx.set.status = responseContext.status;
      ctx.set.headers = responseContext.headers;

      return responseContext.body;
    } catch (error) {
      logger.error('Elysia adapter error', {
        adapterRequestId,
        method: ctx.request.method,
        path: ctx.path,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      throw error;
    }
  };
}
