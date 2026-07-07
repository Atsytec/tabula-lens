import type { Context } from 'hono';
import { TabulaLens, RequestContext } from '../TabulaLens';

export interface HonoAdapterOptions {
  parseBody?: boolean;
}

export function createHonoMiddleware(tabulaLens: TabulaLens, options?: HonoAdapterOptions) {
  return async (c: Context) => {
    const body = options?.parseBody ? await c.req.json().catch(() => undefined) : undefined;

    const requestContext: RequestContext = {
      method: c.req.method,
      path: c.req.path,
      query: c.req.query() as Record<string, string>,
      body,
    };

    const responseContext = await tabulaLens.handle(requestContext);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    c.status(responseContext.status as any);

    Object.entries(responseContext.headers).forEach(([key, value]) => {
      c.header(key, value);
    });

    return c.json(responseContext.body);
  };
}
