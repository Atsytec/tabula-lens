import type { Request, Response, Next } from 'restify';
import { TabulaLens, RequestContext } from '../TabulaLens';

export function restifyAdapter(
  tabulaLens: TabulaLens
): (req: Request, res: Response, next: Next) => Promise<void> {
  return async (req: Request, res: Response, next: Next) => {
    const requestContext: RequestContext = {
      method: req.method,
      path: (req.getPath() as string) || (req.url as string) || '/',
      query: req.query as Record<string, string>,
      body: req.body,
    } as RequestContext;

    const responseContext = await tabulaLens.handle(requestContext);

    res.status(responseContext.status);

    Object.entries(responseContext.headers).forEach(([key, value]) => {
      res.header(key, value);
    });

    res.send(responseContext.body);
    next();
  };
}
