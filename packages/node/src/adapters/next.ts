import { TabulaLens, RequestContext } from '../TabulaLens';

export interface NextAdapterOptions {
  parseBody?: boolean;
}

export function createNextRouteHandler(tabulaLens: TabulaLens, options?: NextAdapterOptions) {
  return async (request: Request): Promise<Response> => {
    const url = new URL(request.url);

    const body = options?.parseBody ? await request.json().catch(() => undefined) : undefined;

    const requestContext: RequestContext = {
      method: request.method,
      path: url.pathname,
      query: Object.fromEntries(url.searchParams.entries()) as Record<string, string>,
      body,
    };

    const responseContext = await tabulaLens.handle(requestContext);

    return new Response(JSON.stringify(responseContext.body), {
      status: responseContext.status,
      headers: responseContext.headers,
    });
  };
}
