import type { Context } from 'hono';
import { TabulaLens, RequestContext } from '../TabulaLens';
import { generateId } from '../logger';

export interface HonoAdapterOptions {
  parseBody?: boolean;
}

export function createHonoMiddleware(tabulaLens: TabulaLens, options?: HonoAdapterOptions) {
  return async (c: Context) => {
    const adapterRequestId = generateId();
    const logger = tabulaLens.getLogger();

    logger.debug('Hono adapter received request', {
      adapterRequestId,
      method: c.req.method,
      path: c.req.path,
    });

    try {
      const body = options?.parseBody ? await c.req.json().catch(() => undefined) : undefined;

      const requestContext: RequestContext = {
        method: c.req.method,
        path: c.req.path,
        query: c.req.query() as Record<string, string>,
        body,
      };

      const responseContext = await tabulaLens.handle(requestContext);

      logger.debug('Hono adapter sending response', {
        adapterRequestId,
        status: responseContext.status,
        contentType: responseContext.headers['Content-Type'],
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      c.status(responseContext.status as any);

      Object.entries(responseContext.headers).forEach(([key, value]) => {
        c.header(key, value);
      });

      return c.json(responseContext.body);
    } catch (error) {
      logger.error('Hono adapter error', {
        adapterRequestId,
        method: c.req.method,
        path: c.req.path,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      throw error;
    }
  };
}
