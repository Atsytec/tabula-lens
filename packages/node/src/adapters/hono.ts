import { TabulaLens, RequestContext } from '../TabulaLens';

export interface HonoAdapterOptions {
  parseBody?: boolean;
}

export function createHonoMiddleware(tabulaLens: TabulaLens, options?: HonoAdapterOptions) {
  return async (c: {
    req: {
      method: string;
      path: string;
      query: () => Record<string, string>;
      json: () => Promise<unknown>;
    };
    status: (code: number) => unknown;
    header: (name: string, value: string) => unknown;
    json: (data: unknown) => unknown;
  }) => {
    const body = options?.parseBody ? await c.req.json().catch(() => undefined) : undefined;

    const requestContext: RequestContext = {
      method: c.req.method,
      path: c.req.path,
      query: c.req.query() as Record<string, string>,
      body,
    };

    const responseContext = await tabulaLens.handle(requestContext);

    c.status(responseContext.status);

    Object.entries(responseContext.headers).forEach(([key, value]) => {
      c.header(key, value);
    });

    return c.json(responseContext.body);
  };
}
