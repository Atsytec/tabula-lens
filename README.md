# Tabula Lens

A React component library for viewing database data with a secure, backend-agnostic architecture.

## 🎯 Project Goal

Create a lightweight, open-source React component that allows developers to easily visualize database tables without exposing database credentials to the frontend.

## 🔑 Key Features

- **Security First**: Database credentials never leave the backend
- **Backend-Agnostic**: Works with any Node.js backend framework
- **Framework Agnostic**: Compatible with React, Next.js, TanStack Start, etc.
- **Feature Rich**: Built-in pagination, sorting, and filtering
- **Type Safe**: Full TypeScript support with strict type checking
- **Zero Config**: Minimal setup required for users
- **15+ Framework Adapters**: Pre-built adapters for popular Node.js frameworks

## 📦 Packages

This monorepo contains the following packages:

- **@tabula-lens/react**: React component for displaying database data
- **@tabula-lens/node**: Node.js backend SDK for database queries with framework adapters
- **@tabula-lens/docs**: Documentation site (Astro + Starlight)

## 🚀 Quick Start

### Backend Setup

```bash
npm install @tabula-lens/node
```

```javascript
import { TabulaLens, expressAdapter } from '@tabula-lens/node';

const tabulaLens = new TabulaLens(process.env.DATABASE_URL);

// Create an API endpoint using the Express adapter
app.use('/api/tabula-lens', expressAdapter(tabulaLens));
```

### Frontend Setup

```bash
npm install @tabula-lens/react
```

```jsx
import { DatabaseViewer } from '@tabula-lens/react';

function App() {
  return <DatabaseViewer endpoint="/api/tabula-lens" authToken={userToken} />;
}
```

## 📖 Backend SDK Documentation

### Core TabulaLens Class

The `TabulaLens` class provides the core database query functionality:

```typescript
import { TabulaLens } from '@tabula-lens/node';

const tabulaLens = new TabulaLens('postgresql://user:password@localhost:5432/mydb');

// Query data with options
const result = await tabulaLens.query({
  table: 'users',
  page: 1,
  limit: 10,
  sort: 'name:asc',
  filter: 'john',
  columns: ['id', 'name', 'email'],
});

// Get available tables
const tables = await tabulaLens.getTables();

// Get table metadata
const metadata = await tabulaLens.getTableMetadata('users');

// Close connection when done
await tabulaLens.close();
```

### Query Options

```typescript
interface QueryOptions {
  table?: string; // Table name (default: 'users')
  page?: number; // Page number (default: 1)
  limit?: number; // Items per page (default: 10)
  sort?: string; // Sort format: 'column:direction,column:direction'
  filter?: string; // Text filter for searching
  columns?: string[]; // Specific columns to select
}
```

### Query Result

```typescript
interface QueryResult {
  data: Record<string, unknown>[];
  columns: string[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

## 🔌 Framework Adapters

@tabula-lens/node includes pre-built adapters for 15+ popular Node.js frameworks:

### REST API Frameworks

#### Express

```typescript
import express from 'express';
import { TabulaLens, expressAdapter } from '@tabula-lens/node';

const app = express();
const tabulaLens = new TabulaLens(process.env.DATABASE_URL);

app.use('/api/tabula-lens', expressAdapter(tabulaLens));

app.listen(3000);
```

#### Fastify

```typescript
import Fastify from 'fastify';
import { TabulaLens, fastifyAdapter } from '@tabula-lens/node';

const fastify = Fastify();
const tabulaLens = new TabulaLens(process.env.DATABASE_URL);

fastify.all('/api/tabula-lens', fastifyAdapter(tabulaLens));

fastify.listen({ port: 3000 });
```

#### Koa

```typescript
import Koa from 'koa';
import { TabulaLens, koaAdapter } from '@tabula-lens/node';

const app = new Koa();
const tabulaLens = new TabulaLens(process.env.DATABASE_URL);

app.use(koaAdapter(tabulaLens));

app.listen(3000);
```

#### Hapi

```typescript
import Hapi from '@hapi/hapi';
import { TabulaLens, hapiAdapter } from '@tabula-lens/node';

const server = Hapi.server({ port: 3000 });
const tabulaLens = new TabulaLens(process.env.DATABASE_URL);

server.route({
  method: '*',
  path: '/api/tabula-lens',
  handler: hapiAdapter(tabulaLens),
});

await server.start();
```

#### Restify

```typescript
import restify from 'restify';
import { TabulaLens, restifyAdapter } from '@tabula-lens/node';

const server = restify.createServer();
const tabulaLens = new TabulaLens(process.env.DATABASE_URL);

server.use(restifyAdapter(tabulaLens));

server.listen(3000);
```

#### Native HTTP

```typescript
import http from 'http';
import { TabulaLens, nativeAdapter } from '@tabula-lens/node';

const tabulaLens = new TabulaLens(process.env.DATABASE_URL);
const handler = nativeAdapter(tabulaLens);

const server = http.createServer(handler);
server.listen(3000);
```

### Full-Stack Frameworks

#### Next.js (App Router)

```typescript
// app/api/tabula-lens/route.ts
import { TabulaLens, createNextRouteHandler } from '@tabula-lens/node';

const tabulaLens = new TabulaLens(process.env.DATABASE_URL);
const handler = createNextRouteHandler(tabulaLens);

export { handler as GET, handler as POST, handler as PUT, handler as DELETE };
```

#### TanStack Start

```typescript
import { createTanStackStartHandler } from '@tabula-lens/node';
import { TabulaLens } from '@tabula-lens/node';

const tabulaLens = new TabulaLens(process.env.DATABASE_URL);
export const handler = createTanStackStartHandler(tabulaLens);
```

#### Remix

```typescript
import { createRemixHandler } from '@tabula-lens/node';
import { TabulaLens } from '@tabula-lens/node';

const tabulaLens = new TabulaLens(process.env.DATABASE_URL);
export const loader = createRemixHandler(tabulaLens);
export const action = createRemixHandler(tabulaLens);
```

#### SvelteKit

```typescript
import { createSvelteKitHandler } from '@tabula-lens/node';
import { TabulaLens } from '@tabula-lens/node';

const tabulaLens = new TabulaLens(process.env.DATABASE_URL);
export const GET = createSvelteKitHandler(tabulaLens);
export const POST = createSvelteKitHandler(tabulaLens);
```

### Modern Web Frameworks

#### Hono

```typescript
import { Hono } from 'hono';
import { createHonoMiddleware } from '@tabula-lens/node';
import { TabulaLens } from '@tabula-lens/node';

const app = new Hono();
const tabulaLens = new TabulaLens(process.env.DATABASE_URL);

app.use('/api/tabula-lens', createHonoMiddleware(tabulaLens));
```

#### Elysia

```typescript
import { Elysia } from 'elysia';
import { createElysiaHandler } from '@tabula-lens/node';
import { TabulaLens } from '@tabula-lens/node';

const app = new Elysia();
const tabulaLens = new TabulaLens(process.env.DATABASE_URL);

app.all('/api/tabula-lens', createElysiaHandler(tabulaLens));
```

#### Fresh (Deno)

```typescript
import { createFreshHandler } from '@tabula-lens/node';
import { TabulaLens } from '@tabula-lens/node';

const tabulaLens = new TabulaLens(process.env.DATABASE_URL);
export const handler = createFreshHandler(tabulaLens);
```

## 🛠️ Tech Stack

- **Frontend**: React, TanStack Table, TanStack Query
- **Backend SDK**: Knex.js, PostgreSQL
- **Build**: tsup, Turborepo
- **Testing**: Vitest, React Testing Library
- **Docs**: Astro, Starlight
- **Code Quality**: ESLint, Prettier, Husky

## 🔧 Development

```bash
# Install dependencies
pnpm install

# Run development mode
pnpm dev

# Build all packages
pnpm build

# Run tests
pnpm test

# Lint code
pnpm lint

# Format code
pnpm format
```

## 📝 License

Currently no license. All rights reserved.

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## 📧 Contact

For questions or support, please open an issue on GitHub.
