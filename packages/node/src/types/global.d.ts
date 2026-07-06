declare module 'fastify' {
  export interface FastifyRequest {
    method: string;
    url: string;
    query: Record<string, string>;
    body: unknown;
  }
  export interface FastifyReply {
    code(status: number): FastifyReply;
    header(key: string, value: string): FastifyReply;
    send(body: unknown): void;
  }
}

declare module '@hapi/hapi' {
  export interface Request {
    method: string;
    path: string;
    query: Record<string, string>;
    payload: unknown;
  }
  export interface ResponseToolkit {
    response(body: unknown): ResponseObject;
  }
  export interface ResponseObject {
    code(status: number): ResponseObject;
    header(key: string, value: string): ResponseObject;
  }
}

declare module 'koa' {
  export interface Context {
    method: string;
    path: string;
    query: Record<string, string>;
    set(key: string, value: string): void;
    body: unknown;
    status: number;
    request: { body?: unknown };
  }
}

declare module 'restify' {
  export interface Request {
    method: string;
    url: string;
    getPath(): string;
    query: Record<string, string>;
    body: unknown;
  }
  export interface Response {
    status(status: number): Response;
    header(key: string, value: string): Response;
    send(body: unknown): void;
  }
  export type Next = () => void;
}
