import { TabulaLens, RequestContext } from '../TabulaLens';
import { generateId } from '../logger';

export interface RemixAdapterOptions {
  parseBody?: boolean;
}

export function createRemixHandler(tabulaLens: TabulaLens, options?: RemixAdapterOptions) {
  return async (request: Request): Promise<Response> => {
    const adapterRequestId = generateId();
    const logger = tabulaLens.getLogger();
    const url = new URL(request.url);

    logger.debug('Remix adapter received request', {
      adapterRequestId,
      method: request.method,
      path: url.pathname,
    });

    try {
      const body = options?.parseBody ? await request.json().catch(() => undefined) : undefined;

      const requestContext: RequestContext = {
        method: request.method,
        path: url.pathname,
        query: Object.fromEntries(url.searchParams.entries()) as Record<string, string>,
        body,
      };

      const responseContext = await tabulaLens.handle(requestContext);

      logger.debug('Remix adapter sending response', {
        adapterRequestId,
        status: responseContext.status,
        contentType: responseContext.headers['Content-Type'],
      });

      return new Response(JSON.stringify(responseContext.body), {
        status: responseContext.status,
        headers: responseContext.headers,
      });
    } catch (error) {
      logger.error('Remix adapter error', {
        adapterRequestId,
        method: request.method,
        path: url.pathname,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      throw error;
    }
  };
}
