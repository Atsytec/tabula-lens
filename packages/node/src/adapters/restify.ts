import type { Request, Response, Next } from 'restify';
import { TabulaLens, RequestContext } from '../TabulaLens';
import { generateId } from '../logger';

export function restifyAdapter(
  tabulaLens: TabulaLens
): (req: Request, res: Response, next: Next) => Promise<void> {
  return async (req: Request, res: Response, next: Next) => {
    const adapterRequestId = generateId();
    const logger = tabulaLens.getLogger();

    logger.debug('Restify adapter received request', {
      adapterRequestId,
      method: req.method,
      path: (req.getPath() as string) || (req.url as string) || '/',
      ip: (req as unknown as { connection?: { remoteAddress?: string } }).connection?.remoteAddress,
    });

    try {
      const requestContext: RequestContext = {
        method: req.method,
        path: (req.getPath() as string) || (req.url as string) || '/',
        query: req.query as Record<string, string>,
        body: req.body,
      };

      const responseContext = await tabulaLens.handle(requestContext);

      logger.debug('Restify adapter sending response', {
        adapterRequestId,
        status: responseContext.status,
        contentType: responseContext.headers['Content-Type'],
      });

      res.status(responseContext.status);

      Object.entries(responseContext.headers).forEach(([key, value]) => {
        res.header(key, value);
      });

      res.send(responseContext.body);
      next();
    } catch (error) {
      logger.error('Restify adapter error', {
        adapterRequestId,
        method: req.method,
        path: (req.getPath() as string) || (req.url as string) || '/',
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      (next as (err?: Error) => void)(error instanceof Error ? error : new Error(String(error)));
    }
  };
}
