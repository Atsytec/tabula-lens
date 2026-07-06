import { TabulaLens, RequestContext } from '../TabulaLens';

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
    const requestBody = options?.parseBody ? ctx.body : undefined;

    const requestContext: RequestContext = {
      method: ctx.request.method,
      path: ctx.path,
      query: ctx.query,
      body: requestBody,
    };

    const responseContext = await tabulaLens.handle(requestContext);

    ctx.set.status = responseContext.status;
    ctx.set.headers = responseContext.headers;

    return responseContext.body;
  };
}
