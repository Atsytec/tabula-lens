import type { RequestHandler } from 'express';
import { TabulaLens, RequestContext } from '../TabulaLens';
import { generateId } from '../logger';

/**
 * Express adapter for Express 5.0+
 * For Express 4.x support, use express4Adapter instead
 */
export function expressAdapter(tabulaLens: TabulaLens): RequestHandler {
  return async (req, res, next) => {
    const adapterRequestId = generateId();
    const logger = tabulaLens.getLogger();

    logger.debug('Express adapter received request', {
      adapterRequestId,
      method: req.method,
      path: req.path,
      ip: req.ip,
      userAgent: req.get('user-agent'),
    });

    try {
      const requestContext: RequestContext = {
        method: req.method,
        path: req.path,
        query: req.query as Record<string, string>,
        body: req.body,
      };

      const responseContext = await tabulaLens.handle(requestContext);

      logger.debug('Express adapter sending response', {
        adapterRequestId,
        status: responseContext.status,
        contentType: responseContext.headers['Content-Type'],
      });

      res.status(responseContext.status);

      Object.entries(responseContext.headers).forEach(([key, value]) => {
        res.setHeader(key, value);
      });

      res.json(responseContext.body);
    } catch (error) {
      logger.error('Express adapter error', {
        adapterRequestId,
        method: req.method,
        path: req.path,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      next(error);
    }
  };
}
