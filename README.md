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
  return <DatabaseViewer path="/api/tabula-lens" />;
}
```

## 📖 React Component Documentation

### DatabaseViewer Component

The `DatabaseViewer` component provides a full-featured table interface for viewing database data with built-in pagination, sorting, and filtering.

#### Basic Usage

```jsx
import { DatabaseViewer } from '@tabula-lens/react';

function App() {
  return <DatabaseViewer path="/api/tabula-lens" />;
}
```

#### With Authentication

```jsx
import { DatabaseViewer } from '@tabula-lens/react';

function App() {
  const getAuthHeaders = async () => {
    const token = localStorage.getItem('authToken');
    return { Authorization: `Bearer ${token}` };
  };

  return <DatabaseViewer path="/api/tabula-lens" getAuthHeaders={getAuthHeaders} />;
}
```

#### With Table Selector

```jsx
import { DatabaseViewer } from '@tabula-lens/react';

function App() {
  return <DatabaseViewer path="/api/tabula-lens" tableSelector="dropdown" initialTable="users" />;
}
```

#### Custom Styling

```jsx
import { DatabaseViewer } from '@tabula-lens/react';

function App() {
  return (
    <DatabaseViewer
      path="/api/tabula-lens"
      className="custom-db-viewer"
      style={{ maxWidth: '1200px', margin: '0 auto' }}
      classNames={{
        table: 'custom-table',
        header: 'custom-header',
        cell: 'custom-cell',
      }}
      styles={{
        table: { borderCollapse: 'separate', borderSpacing: '0' },
        th: { backgroundColor: '#1a1a1a', color: 'white' },
      }}
    />
  );
}
```

#### Custom Components

```jsx
import { DatabaseViewer } from '@tabula-lens/react';

const CustomLoading = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
  </div>
);

const CustomError = ({ error, retry }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
    <p className="text-red-800">Error: {error.message}</p>
    <button onClick={retry} className="mt-2 px-4 py-2 bg-red-600 text-white rounded">
      Retry
    </button>
  </div>
);

function App() {
  return (
    <DatabaseViewer
      path="/api/tabula-lens"
      loadingComponent={CustomLoading}
      errorComponent={CustomError}
    />
  );
}
```

#### Advanced Configuration

```jsx
import { DatabaseViewer } from '@tabula-lens/react';

function App() {
  return (
    <DatabaseViewer
      path="/api/tabula-lens"
      initialTable="users"
      // Table selection
      tableSelector="sidebar"
      tableSelectorLabel="Choose Table"
      // Filtering
      showFilter={true}
      filterPlaceholder="Search records..."
      filterPosition="top"
      filterDebounceMs={500}
      // Pagination
      showPagination={true}
      pageSize={25}
      pageSizeOptions={[10, 25, 50, 100]}
      showPageSizeSelector={true}
      paginationPosition="both"
      // Sorting
      enableSorting={true}
      sortableColumns={['name', 'email', 'created_at']}
      defaultSort={{ column: 'created_at', direction: 'desc' }}
      multiSort={true}
      // Query options
      queryOptions={{
        staleTime: 30000,
        retry: 3,
        refetchOnWindowFocus: false,
      }}
      refetchInterval={60000} // Auto-refresh every minute
    />
  );
}
```

### Props Reference

#### Core Props

| Prop           | Type     | Default    | Description                       |
| -------------- | -------- | ---------- | --------------------------------- |
| `path`         | `string` | _required_ | API endpoint path for the backend |
| `initialTable` | `string` | `'users'`  | Default table to load on mount    |

#### Table Selection

| Prop                     | Type                                | Default          | Description                     |
| ------------------------ | ----------------------------------- | ---------------- | ------------------------------- |
| `tableSelector`          | `'dropdown' \| 'sidebar' \| 'none'` | `'none'`         | Table selector UI mode          |
| `tableSelectorLabel`     | `string`                            | `'Select Table'` | Label for table selector        |
| `tableSelectorComponent` | `React.FC`                          | `undefined`      | Custom table selector component |

#### Authentication

| Prop             | Type                                    | Default     | Description                           |
| ---------------- | --------------------------------------- | ----------- | ------------------------------------- |
| `getAuthHeaders` | `() => Promise<Record<string, string>>` | `undefined` | Async function to get auth headers    |
| `headers`        | `Record<string, string>`                | `undefined` | Static headers to include in requests |

#### Filtering

| Prop                | Type                          | Default               | Description                         |
| ------------------- | ----------------------------- | --------------------- | ----------------------------------- |
| `showFilter`        | `boolean`                     | `true`                | Show/hide filter input              |
| `filterPlaceholder` | `string`                      | `'Filter records...'` | Placeholder text for filter input   |
| `filterPosition`    | `'top' \| 'bottom' \| 'both'` | `'top'`               | Position of filter input            |
| `filterDebounceMs`  | `number`                      | `300`                 | Debounce time for filter input (ms) |
| `filterComponent`   | `React.FC`                    | `undefined`           | Custom filter component             |

#### Pagination

| Prop                   | Type                          | Default                 | Description                     |
| ---------------------- | ----------------------------- | ----------------------- | ------------------------------- |
| `showPagination`       | `boolean`                     | `true`                  | Show/hide pagination controls   |
| `pageSize`             | `number`                      | `10`                    | Default page size               |
| `pageSizeOptions`      | `number[]`                    | `[10, 20, 30, 50, 100]` | Available page size options     |
| `showPageSizeSelector` | `boolean`                     | `true`                  | Show/hide page size selector    |
| `paginationPosition`   | `'top' \| 'bottom' \| 'both'` | `'bottom'`              | Position of pagination controls |
| `paginationComponent`  | `React.FC`                    | `undefined`             | Custom pagination component     |

#### Sorting

| Prop              | Type                                               | Default     | Description                         |
| ----------------- | -------------------------------------------------- | ----------- | ----------------------------------- |
| `enableSorting`   | `boolean`                                          | `true`      | Enable/disable column sorting       |
| `sortableColumns` | `string[]`                                         | `undefined` | Specific columns that can be sorted |
| `defaultSort`     | `{ column: string; direction: 'asc' \| 'desc' }`   | `undefined` | Default sort on mount               |
| `multiSort`       | `boolean`                                          | `false`     | Enable multi-column sorting         |
| `sortIcon`        | `React.FC<{ direction: 'asc' \| 'desc' \| null }>` | `undefined` | Custom sort icon component          |

#### UI Customization

| Prop         | Type                  | Default     | Description                         |
| ------------ | --------------------- | ----------- | ----------------------------------- |
| `className`  | `string`              | `undefined` | CSS class for container             |
| `classNames` | `ClassNames`          | `{}`        | CSS classes for specific elements   |
| `style`      | `React.CSSProperties` | `undefined` | Inline styles for container         |
| `styles`     | `Styles`              | `{}`        | Inline styles for specific elements |

#### Custom Components

| Prop               | Type                                            | Default     | Description                  |
| ------------------ | ----------------------------------------------- | ----------- | ---------------------------- |
| `loadingComponent` | `React.FC`                                      | `undefined` | Custom loading component     |
| `errorComponent`   | `React.FC<{ error: Error; retry: () => void }>` | `undefined` | Custom error component       |
| `emptyComponent`   | `React.FC`                                      | `undefined` | Custom empty state component |
| `onError`          | `(error: Error) => void`                        | `undefined` | Error callback handler       |

#### Query Options

| Prop              | Type     | Default     | Description                |
| ----------------- | -------- | ----------- | -------------------------- |
| `queryOptions`    | `object` | `{}`        | TanStack Query options     |
| `refetchInterval` | `number` | `undefined` | Auto-refetch interval (ms) |

### DatabaseViewerWithProvider

For applications that already have a QueryClientProvider, use `DatabaseViewerWithProvider` to avoid nested providers:

```jsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DatabaseViewerWithProvider } from '@tabula-lens/react';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DatabaseViewerWithProvider path="/api/tabula-lens" />
    </QueryClientProvider>
  );
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

Contributions will be allowed soon.

## 📧 Contact

For questions or support, please open an issue on GitHub.
