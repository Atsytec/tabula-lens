import type { RequestHandler } from 'express';
import { TabulaLens, RequestContext } from '../TabulaLens';

export function expressAdapter(tabulaLens: TabulaLens): RequestHandler {
  return async (req, res, next) => {
    try {
      const requestContext: RequestContext = {
        method: req.method,
        path: req.path,
        query: req.query as Record<string, string>,
        body: req.body,
      };

      const responseContext = await tabulaLens.handle(requestContext);

      res.status(responseContext.status);

      Object.entries(responseContext.headers).forEach(([key, value]) => {
        res.setHeader(key, value);
      });

      res.json(responseContext.body);
    } catch (error) {
      next(error);
    }
  };
}
