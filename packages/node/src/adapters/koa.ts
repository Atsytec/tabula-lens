import type { Context } from 'koa';
import { TabulaLens, RequestContext } from '../TabulaLens';
import { generateId } from '../logger';

export function koaAdapter(tabulaLens: TabulaLens): (ctx: Context) => Promise<void> {
  return async (ctx: Context) => {
    const adapterRequestId = generateId();
    const logger = tabulaLens.getLogger();

    logger.debug('Koa adapter received request', {
      adapterRequestId,
      method: ctx.method,
      path: ctx.path,
      ip: (ctx as unknown as { ip?: string }).ip,
    });

    try {
      const requestContext: RequestContext = {
        method: ctx.method,
        path: ctx.path,
        query: ctx.query as Record<string, string>,
        body: (ctx.request as unknown as { body?: unknown }).body,
      };

      const responseContext = await tabulaLens.handle(requestContext);

      logger.debug('Koa adapter sending response', {
        adapterRequestId,
        status: responseContext.status,
        contentType: responseContext.headers['Content-Type'],
      });

      ctx.status = responseContext.status;

      Object.entries(responseContext.headers).forEach(([key, value]) => {
        ctx.set(key, value);
      });

      ctx.body = responseContext.body;
    } catch (error) {
      logger.error('Koa adapter error', {
        adapterRequestId,
        method: ctx.method,
        path: ctx.path,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      throw error;
    }
  };
}
