import { IncomingMessage, ServerResponse } from 'http';
import { TabulaLens, RequestContext } from '../TabulaLens';

export interface NativeAdapterOptions {
  parseBody?: (req: IncomingMessage) => Promise<unknown>;
}

export function nativeAdapter(tabulaLens: TabulaLens, options?: NativeAdapterOptions) {
  return async (req: IncomingMessage, res: ServerResponse) => {
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

      res.statusCode = responseContext.status;

      Object.entries(responseContext.headers).forEach(([key, value]) => {
        res.setHeader(key, value);
      });

      res.end(JSON.stringify(responseContext.body));
    } catch (error) {
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
