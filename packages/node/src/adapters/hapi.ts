import type { Request, ResponseToolkit } from '@hapi/hapi';
import { TabulaLens, RequestContext } from '../TabulaLens';

export function hapiAdapter(
  tabulaLens: TabulaLens
): (request: Request, h: ResponseToolkit) => Promise<ReturnType<ResponseToolkit['response']>> {
  return async (request: Request, h: ResponseToolkit) => {
    const requestContext: RequestContext = {
      method: request.method,
      path: request.path,
      query: request.query as Record<string, string>,
      body: request.payload,
    };

    const responseContext = await tabulaLens.handle(requestContext);

    let response = h.response(responseContext.body as unknown).code(responseContext.status);

    Object.entries(responseContext.headers).forEach(([key, value]) => {
      response = response.header(key, value);
    });

    return response;
  };
}
