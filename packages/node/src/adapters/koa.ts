import type { Context } from 'koa';
import { TabulaLens, RequestContext } from '../TabulaLens';

export function koaAdapter(tabulaLens: TabulaLens) {
  return async (ctx: Context) => {
    const requestContext: RequestContext = {
      method: ctx.method,
      path: ctx.path,
      query: ctx.query as Record<string, string>,
      body: (ctx.request as unknown as { body?: unknown }).body,
    };

    const responseContext = await tabulaLens.handle(requestContext);

    ctx.status = responseContext.status;

    Object.entries(responseContext.headers).forEach(([key, value]) => {
      ctx.set(key, value);
    });

    ctx.body = responseContext.body;
  };
}
