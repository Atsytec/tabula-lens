# @tabula-lens/node

[![npm version](https://badge.fury.io/js/%40tabula-lens%2Fnode.svg)](https://www.npmjs.com/package/@tabula-lens/node)
[![Downloads](https://img.shields.io/npm/dm/@tabula-lens/node)](https://www.npmjs.com/package/@tabula-lens/node)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

> 📚 **[Full Documentation](https://docs.tabula-lens.dev)** - Comprehensive guides, API reference, and examples

A secure, backend-agnostic Node.js SDK for database queries with framework adapters. Tabula Lens keeps your database credentials safe on the backend while providing a clean API for frontend data visualization.

## 📦 Installation

```bash
npm install @tabula-lens/node
# or
pnpm add @tabula-lens/node
# or
yarn add @tabula-lens/node
```

### Peer Dependencies

You must install the database driver for your chosen database:

- **PostgreSQL / CockroachDB**: `npm install pg@^8.22.0`
- **MySQL / MariaDB**: `npm install mysql2@^3.22.6`
- **SQLite**: `npm install better-sqlite3@^12.11.1`
- **SQL Server**: `npm install tedious@^20.0.0`

**Example installation for PostgreSQL:**

```bash
npm install @tabula-lens/node pg
```

## 🚀 Quick Start

### Basic Setup

```typescript
import { TabulaLens } from '@tabula-lens/node';

// String form (auto-detects database type from URL)
const tabulaLens = new TabulaLens(process.env.DATABASE_URL);

// Config object form (explicit database type)
const tabulaLens = new TabulaLens({
  url: process.env.DATABASE_URL,
  type: 'mysql', // optional - auto-detected from URL if omitted
  logLevel: 'info',
});

// Query data
const result = await tabulaLens.query({
  table: 'users',
  page: 1,
  limit: 10,
});

console.log(result.data);
// => [{ id: 1, name: 'John', email: 'john@example.com' }, ...]
```

### Using with Express

```typescript
import express from 'express';
import { TabulaLens, expressAdapter } from '@tabula-lens/node';

const app = express();
const tabulaLens = new TabulaLens(process.env.DATABASE_URL);

// Create API endpoint
app.use('/api/tabula-lens', expressAdapter(tabulaLens));

app.listen(3000);
```

### Using with Next.js

```typescript
// app/api/tabula-lens/route.ts
import { TabulaLens, createNextRouteHandler } from '@tabula-lens/node';

const tabulaLens = new TabulaLens(process.env.DATABASE_URL);
const handler = createNextRouteHandler(tabulaLens);

export { handler as GET, handler as POST, handler as PUT, handler as DELETE };
```

## 📖 Full Documentation

For comprehensive guides, API reference, advanced configurations, and integration examples for all 15+ framework adapters, visit our [full documentation](https://docs.tabula-lens.dev).

## 🎯 Features

- **Security First**: Database credentials never leave the backend
- **Backend-Agnostic**: Works with 15+ Node.js frameworks via adapters
- **Type Safe**: Full TypeScript support with strict type checking
- **Framework Adapters**: Pre-built adapters for Express, Fastify, Koa, Hapi, Restify, Next.js, TanStack Start, Remix, SvelteKit, Hono, Elysia, Fresh, and native Node.js HTTP
- **Query Capabilities**: Built-in pagination, sorting, and filtering
- **Multi-Database Support**: PostgreSQL, MySQL, SQLite, and SQL Server support with auto-detection
- **Zero Config**: Minimal setup required
