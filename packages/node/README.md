# @tabula-lens/node

[![npm version](https://badge.fury.io/js/%40tabula-lens%2Fnode.svg)](https://www.npmjs.com/package/@tabula-lens/node)
[![Downloads](https://img.shields.io/npm/dm/@tabula-lens/node)](https://www.npmjs.com/package/@tabula-lens/node)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

A secure, backend-agnostic Node.js SDK for database queries with framework adapters. Tabula Lens keeps your database credentials safe on the backend while providing a clean API for frontend data visualization.

## 📑 Table of Contents

- [Features](#-features)
- [Installation](#-installation)
- [Peer Dependencies](#-peer-dependencies)
- [Quick Start](#-quick-start)
- [API Reference](#-api-reference)
- [Framework Adapters](#-framework-adapters)
- [Advanced Usage](#-advanced-usage)
- [Error Handling](#-error-handling)
- [Testing](#-testing)
- [Troubleshooting](#-troubleshooting)
- [Security Considerations](#-security-considerations)

## 🎯 Features

- **Security First**: Database credentials never leave the backend
- **Backend-Agnostic**: Works with 15+ Node.js frameworks via adapters
- **Type Safe**: Full TypeScript support with strict type checking
- **Framework Adapters**: Pre-built adapters for Express, Fastify, Koa, Hapi, Restify, Next.js, TanStack Start, Remix, SvelteKit, Hono, Elysia, Fresh, and native Node.js HTTP
- **Query Capabilities**: Built-in pagination, sorting, and filtering
- **PostgreSQL Support**: Optimized for PostgreSQL with Knex.js
- **Zero Config**: Minimal setup required

## 📦 Installation

```bash
npm install @tabula-lens/node
# or
pnpm add @tabula-lens/node
# or
yarn add @tabula-lens/node
```

## 🔗 Peer Dependencies

This package requires framework-specific peer dependencies. Install the appropriate package for your framework:

- **Express**: `npm install express@^4.18.0 || ^5.0.0`
- **Fastify**: `npm install fastify@^4.0.0`
- **Koa**: `npm install koa@^2.14.0`
- **Hapi**: `npm install @hapi/hapi@^21.0.0`
- **Restify**: `npm install restify@^11.0.0`
- **Next.js**: No additional peer dependencies
- **TanStack Start**: `npm install @tanstack/react-start@^1.0.0`
- **Remix**: `npm install remix@^2.0.0`
- **SvelteKit**: `npm install @sveltejs/kit@^2.0.0`
- **Hono**: `npm install hono@^4.0.0`
- **Elysia**: `npm install elysia@^1.0.0`
- **Fresh**: No additional peer dependencies (Deno native)

## �🚀 Quick Start

### Basic Setup

```typescript
import { TabulaLens } from '@tabula-lens/node';

const tabulaLens = new TabulaLens(process.env.DATABASE_URL);

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

### Using with Fastify

```typescript
import Fastify from 'fastify';
import { TabulaLens, fastifyAdapter } from '@tabula-lens/node';

const fastify = Fastify();
const tabulaLens = new TabulaLens(process.env.DATABASE_URL);

// Create API endpoint
fastify.all('/api/tabula-lens/*', fastifyAdapter(tabulaLens));

fastify.listen({ port: 3000 });
```

### Using with Next.js

```typescript
// app/api/tabula-lens/route.ts
import { TabulaLens, createNextRouteHandler } from '@tabula-lens/node';

const tabulaLens = new TabulaLens(process.env.DATABASE_URL);
const handler = createNextRouteHandler(tabulaLens);

export { handler as GET, handler as POST, handler as PUT, handler as DELETE };
```

## 📖 API Reference

### TabulaLens Class

#### Constructor

```typescript
constructor(databaseUrl: string, options?: TabulaLensOptions)
```

Creates a new TabulaLens instance with a PostgreSQL database connection.

**Parameters:**

- `databaseUrl` - PostgreSQL connection string (e.g., `postgresql://user:password@host:port/database`)
- `options` - Optional configuration object

**TabulaLensOptions:**

```typescript
interface TabulaLensOptions {
  logger?: Logger;
  logLevel?: 'error' | 'warn' | 'info' | 'debug' | 'silent';
  enableQueryLogging?: boolean;
  enableRequestLogging?: boolean;
  sensitiveDataMasking?: boolean;
  logFormat?: 'json' | 'text' | 'pretty';
}
```

**Logging Configuration:**

The package includes a built-in logging system with configurable log levels:

- **Default Log Levels** (based on environment):
  - `production`: `'error'` - Only error messages
  - `test`: `'silent'` - No logging
  - `development`: `'debug'` - All log levels

- **Log Level Hierarchy** (most to least verbose):
  - `debug` - All messages including debug info
  - `info` - Info, warnings, and errors
  - `warn` - Warnings and errors only
  - `error` - Errors only
  - `silent` - No output

**Logging Examples:**

```typescript
import { TabulaLens, createLogger } from '@tabula-lens/node';

// Basic usage with default logging
const tabulaLens = new TabulaLens(process.env.DATABASE_URL);

// Custom log level
const tabulaLens = new TabulaLens(process.env.DATABASE_URL, {
  logLevel: 'info', // or 'error', 'warn', 'debug', 'silent'
});

// Custom logger with full configuration
const tabulaLens = new TabulaLens(process.env.DATABASE_URL, {
  logger: createLogger({
    level: 'debug',
    includeTimestamp: true,
    colorize: true,
    format: 'pretty', // or 'json', 'text'
  }),
});

// Disable query/request logging
const tabulaLens = new TabulaLens(process.env.DATABASE_URL, {
  enableQueryLogging: false,
  enableRequestLogging: false,
});

// Production configuration
const tabulaLens = new TabulaLens(process.env.DATABASE_URL, {
  logLevel: 'error',
  logFormat: 'json',
  sensitiveDataMasking: true,
});
```

#### query()

```typescript
async query(options: QueryOptions): Promise<QueryResult>
```

Executes a database query with pagination, sorting, and filtering.

**Parameters:**

- `options.table` - Table name to query (default: `'users'`)
- `options.page` - Page number (default: `1`)
- `options.limit` - Records per page (default: `10`)
- `options.sort` - Sort string (e.g., `'name:asc,email:desc'`)
- `options.filter` - Text filter for searching
- `options.columns` - Array of column names to select

**Returns:**

```typescript
{
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

#### getTables()

```typescript
async getTables(): Promise<string[]>
```

Returns a list of all tables in the database.

#### getColumns()

```typescript
async getColumns(table: string): Promise<{ name: string; type: string }[]>
```

Returns column information for a specific table.

#### getTableMetadata()

```typescript
async getTableMetadata(table: string): Promise<{
  name: string;
  columns: { name: string; type: string }[];
}>
```

Returns complete metadata for a table including name and columns.

#### handle()

```typescript
async handle(request: RequestContext): Promise<ResponseContext>
```

Handles HTTP requests and returns appropriate responses. Used internally by adapters.

#### close()

```typescript
async close(): Promise<void>
```

Closes the database connection.

## 🔌 Framework Adapters

### Express

```typescript
import { expressAdapter } from '@tabula-lens/node';

app.use('/api/tabula-lens', expressAdapter(tabulaLens));
```

### Fastify

```typescript
import { fastifyAdapter } from '@tabula-lens/node';

fastify.all('/api/tabula-lens/*', fastifyAdapter(tabulaLens));
```

### Koa

```typescript
import { koaAdapter } from '@tabula-lens/node';

router.all('/api/tabula-lens', koaAdapter(tabulaLens));
```

### Hapi

```typescript
import { hapiAdapter } from '@tabula-lens/node';

server.route({
  method: '*',
  path: '/api/tabula-lens/{p*}',
  handler: hapiAdapter(tabulaLens),
});
```

### Restify

```typescript
import { restifyAdapter } from '@tabula-lens/node';

server.all('/api/tabula-lens', restifyAdapter(tabulaLens));
```

### Next.js

```typescript
import { createNextRouteHandler } from '@tabula-lens/node';

const handler = createNextRouteHandler(tabulaLens, { parseBody: true });
export { handler as GET, handler as POST };
```

### TanStack Start

```typescript
import { createTanStackStartHandler } from '@tabula-lens/node';

export const handler = createTanStackStartHandler(tabulaLens);
```

### Remix

```typescript
import { createRemixHandler } from '@tabula-lens/node';

export const loader = createRemixHandler(tabulaLens);
export const action = createRemixHandler(tabulaLens);
```

### SvelteKit

```typescript
import { createSvelteKitHandler } from '@tabula-lens/node';

export const GET = createSvelteKitHandler(tabulaLens);
export const POST = createSvelteKitHandler(tabulaLens);
```

### Hono

```typescript
import { createHonoMiddleware } from '@tabula-lens/node';

app.all('/api/tabula-lens/*', createHonoMiddleware(tabulaLens));
```

### Elysia

```typescript
import { createElysiaHandler } from '@tabula-lens/node';

app.all('/api/tabula-lens/*', createElysiaHandler(tabulaLens));
```

### Fresh

```typescript
import { createFreshHandler } from '@tabula-lens/node';

app.get('/api/tabula-lens/*', createFreshHandler(tabulaLens));
```

### Native Node.js HTTP

```typescript
import { nativeAdapter } from '@tabula-lens/node';
import http from 'http';

const server = http.createServer(async (req, res) => {
  if (req.url?.startsWith('/api/tabula-lens')) {
    await nativeAdapter(tabulaLens)(req, res);
  }
});
```

## 🌐 API Endpoints

When using an adapter, the following endpoints are automatically available:

### GET /tables

Returns a list of all tables in the database.

**Response:**

```json
["users", "posts", "comments", "products"]
```

### GET /tables/:tableName

Returns metadata for a specific table.

**Response:**

```json
{
  "name": "users",
  "columns": [
    { "name": "id", "type": "integer" },
    { "name": "name", "type": "character varying" },
    { "name": "email", "type": "character varying" }
  ]
}
```

### GET /query

Executes a database query with query parameters.

**Query Parameters:**

- `table` - Table name to query
- `page` - Page number (default: 1)
- `limit` - Records per page (default: 10)
- `sort` - Sort string (e.g., `name:asc,email:desc`)
- `filter` - Text filter for searching
- `columns` - Comma-separated column names

**Response:**

```json
{
  "data": [{ "id": 1, "name": "John", "email": "john@example.com" }],
  "columns": ["id", "name", "email"],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

## 🔒 Security

Tabula Lens is designed with security in mind:

- **Credentials Stay on Backend**: Database credentials are never exposed to the frontend
- **No Direct Database Access**: Frontend communicates through your API endpoints
- **Framework Integration**: Leverages your existing authentication and authorization
- **Input Validation**: Built-in validation for query parameters

### Adding Authentication

Since Tabula Lens uses your existing framework, you can add authentication using your framework's middleware:

```typescript
// Express example
import authMiddleware from './auth-middleware';

app.use('/api/tabula-lens', authMiddleware, expressAdapter(tabulaLens));
```

## 📝 Advanced Usage

### Logging Configuration

The logging system provides detailed insights into database operations, query execution, and request handling.

**Log Levels:**

```typescript
import { TabulaLens, createLogger } from '@tabula-lens/node';

// Development - verbose logging
const devTabulaLens = new TabulaLens(databaseUrl, {
  logLevel: 'debug',
  enableQueryLogging: true,
  enableRequestLogging: true,
});

// Production - minimal logging
const prodTabulaLens = new TabulaLens(databaseUrl, {
  logLevel: 'error',
  logFormat: 'json',
  sensitiveDataMasking: true,
});

// Testing - no logging
const testTabulaLens = new TabulaLens(databaseUrl, {
  logLevel: 'silent',
});
```

**Custom Logger:**

```typescript
import { createLogger, type Logger } from '@tabula-lens/node';

// Create a custom logger with specific configuration
const customLogger = createLogger({
  level: 'info',
  includeTimestamp: true,
  colorize: true,
  format: 'pretty',
});

const tabulaLens = new TabulaLens(databaseUrl, {
  logger: customLogger,
});

// Or implement your own logger
const customLogger: Logger = {
  error(message, context) {
    // Custom error handling
    console.error('[CUSTOM]', message, context);
    // Send to external service, etc.
  },
  warn(message, context) {
    console.warn('[CUSTOM]', message, context);
  },
  info(message, context) {
    console.log('[CUSTOM]', message, context);
  },
  debug(message, context) {
    console.debug('[CUSTOM]', message, context);
  },
};

const tabulaLens = new TabulaLens(databaseUrl, {
  logger: customLogger,
});
```

**Accessing the Logger:**

```typescript
// Get the logger instance for direct use
const logger = tabulaLens.getLogger();

// Log custom messages
logger.info('Application started', { version: '1.0.0' });
logger.debug('Processing request', { requestId: 'abc-123' });
logger.warn('High memory usage', { memoryUsage: '85%' });
logger.error('Database connection failed', { error: err });
```

**Log Formats:**

```typescript
// Pretty format (default, human-readable)
const tabulaLens = new TabulaLens(databaseUrl, {
  logFormat: 'pretty',
});

// JSON format (structured logging for log aggregation)
const tabulaLens = new TabulaLens(databaseUrl, {
  logFormat: 'json',
});

// Text format (simple text output)
const tabulaLens = new TabulaLens(databaseUrl, {
  logFormat: 'text',
});
```

### Custom Query Options

```typescript
const result = await tabulaLens.query({
  table: 'users',
  page: 2,
  limit: 25,
  sort: 'name:asc,created_at:desc',
  filter: 'john',
  columns: ['id', 'name', 'email'],
});
```

### Error Handling

```typescript
import { TabulaLensError } from '@tabula-lens/node';

try {
  const result = await tabulaLens.query({ table: 'users' });
} catch (error) {
  if (error instanceof TabulaLensError) {
    console.error(`Error ${error.statusCode}: ${error.code}`);
    console.error(error.message);
    console.error(error.details);
  }
}
```

### Connection Management

```typescript
// Close connection when done
await tabulaLens.close();

// Or use with cleanup in frameworks
process.on('SIGTERM', async () => {
  await tabulaLens.close();
  process.exit(0);
});
```

## 🧪 Testing

```typescript
import { describe, it, expect } from 'vitest';
import { TabulaLens } from '@tabula-lens/node';

describe('TabulaLens', () => {
  it('should query data', async () => {
    const tabulaLens = new TabulaLens('test-database-url');
    const result = await tabulaLens.query({ table: 'users' });

    expect(result.data).toBeInstanceOf(Array);
    expect(result.columns).toBeInstanceOf(Array);
    expect(result.pagination).toBeDefined();

    await tabulaLens.close();
  });
});
```

## � Troubleshooting

### Database Connection Issues

**Problem**: "Connection refused" or "Connection timeout" errors

**Solutions**:

- Verify your `DATABASE_URL` is correct and accessible
- Check that your database server is running
- Ensure your firewall allows connections to the database
- Verify the database user has necessary permissions

### Query Performance Issues

**Problem**: Slow query performance

**Solutions**:

- Use the `columns` parameter to select only needed columns
- Add appropriate indexes to your database tables
- Use pagination to limit result sets
- Enable query logging to identify slow queries

### Adapter Integration Issues

**Problem**: Adapter not working with your framework

**Solutions**:

- Ensure you have installed the required peer dependencies
- Check that your framework version matches the peer dependency requirements
- Verify the adapter is being used correctly according to the framework's patterns
- Check framework-specific logs for additional error details

## 🔒 Security Considerations

### Database Credentials

- Never commit database credentials to version control
- Use environment variables for sensitive data
- Rotate database credentials regularly
- Use read-only database users when possible

### API Security

- Always use HTTPS in production
- Implement proper authentication/authorization
- Validate and sanitize all user inputs
- Use rate limiting to prevent abuse
- Keep dependencies updated

### Logging Security

- Enable `sensitiveDataMasking` in production
- Avoid logging sensitive data (passwords, tokens)
- Use appropriate log levels (`error` in production)
- Secure log files with appropriate file permissions

### Best Practices

```typescript
// Production configuration example
const tabulaLens = new TabulaLens(process.env.DATABASE_URL, {
  logLevel: 'error',
  logFormat: 'json',
  sensitiveDataMasking: true,
  enableQueryLogging: false, // Disable query logging in production
  enableRequestLogging: true, // Keep request logging for monitoring
});
```

## 📝 License

Currently no license. All rights reserved.

## 🤝 Contributing

Contributions will be allowed soon.

## 🔗 Links

<!-- - [Main Repository](https://github.com/yourusername/tabula-lens) -->
<!-- - [Node Package](https://www.npmjs.com/package/@tabula-lens/node) -->
<!-- - [Documentation](https://tabula-lens.dev) -->
<!-- - [Issues](https://github.com/yourusername/tabula-lens/issues) -->

## 🙏 Acknowledgments

Built with [Knex.js](https://knexjs.org/) for database queries and supports PostgreSQL databases.
