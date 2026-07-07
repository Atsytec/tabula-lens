import { IncomingMessage, ServerResponse } from 'http';
import { TabulaLens, RequestContext } from '../TabulaLens';
import { generateId } from '../logger';

export interface NativeAdapterOptions {
  parseBody?: (req: IncomingMessage) => Promise<unknown>;
}

export function nativeAdapter(tabulaLens: TabulaLens, options?: NativeAdapterOptions) {
  return async (req: IncomingMessage, res: ServerResponse) => {
    const adapterRequestId = generateId();
    const logger = tabulaLens.getLogger();

    logger.debug('Native HTTP adapter received request', {
      adapterRequestId,
      method: req.method || 'GET',
      path: req.url || '/',
      ip: req.socket.remoteAddress,
    });

    try {
      const host = req.headers.host || 'localhost';
      const url = new URL(req.url || '/', `http://${host}`);

      const body = options?.parseBody ? await options.parseBody(req) : undefined;

      const requestContext: RequestContext = {
        method: req.method || 'GET',
        path: url.pathname,
        query: Object.fromEntries(url.searchParams.entries()) as Record<string, string>,
        body,
      };

      const responseContext = await tabulaLens.handle(requestContext);

      logger.debug('Native HTTP adapter sending response', {
        adapterRequestId,
        status: responseContext.status,
        contentType: responseContext.headers['Content-Type'],
      });

      res.statusCode = responseContext.status;

      Object.entries(responseContext.headers).forEach(([key, value]) => {
        res.setHeader(key, value);
      });

      res.end(JSON.stringify(responseContext.body));
    } catch (error) {
      logger.error('Native HTTP adapter error', {
        adapterRequestId,
        method: req.method || 'GET',
        path: req.url || '/',
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });

      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          error: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred',
        })
      );
    }
  };
}
