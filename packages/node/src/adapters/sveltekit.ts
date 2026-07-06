import { TabulaLens, RequestContext } from '../TabulaLens';

export interface SvelteKitAdapterOptions {
  parseBody?: boolean;
}

export function createSvelteKitHandler(tabulaLens: TabulaLens, options?: SvelteKitAdapterOptions) {
  return async (event: { request: Request; url: URL }): Promise<Response> => {
    const { request, url } = event;

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
