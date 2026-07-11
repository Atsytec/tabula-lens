---
name: setup-tabula-lens
version: 1.0.0
description: Full-stack setup guidance for Tabula Lens with backend (Node/Express) and frontend (React) implementation. Use when setting up a new Tabula Lens project or integrating Tabula Lens into an existing application.
author: viti-mg <victormargon@yahoo.es>
license: Apache-2.0
repository: https://github.com/Atsytec/tabula-lens
tags: [tabula-lens, database, postgresql, full-stack, setup, installation, backend, frontend]
triggers:
  - setup tabula lens
  - install tabula lens
  - configure tabula lens
  - tabula lens setup
  - integrate tabula lens
  - add tabula lens to project
  - tabula lens full stack
  - tabula lens backend setup
  - tabula lens frontend setup
negative_triggers:
  - tabula lens component generation
  - tabula lens styling
  - tabula lens deployment
  - tabula lens testing
  - tabula lens troubleshooting
compatibility:
  - claude-code
  - openai-codex
  - gemini-cli
  - vscode-copilot
  - cursor
  - jetbrains
---

# Setup Tabula Lens

Comprehensive guidance for setting up Tabula Lens in a full-stack application with PostgreSQL database, Node.js backend, and React frontend.

## Description

This skill provides step-by-step guidance for setting up Tabula Lens, a database viewing and management system. It covers:

- Backend setup with @tabula-lens/node package
- Frontend setup with @tabula-lens/react package
- PostgreSQL database configuration
- Framework adapter selection and configuration
- Authentication setup
- Styling and customization
- Testing and verification

The skill guides you through creating a complete full-stack application where the backend exposes database data through a REST API and the frontend provides an interactive table viewer with sorting, filtering, and pagination.

## Usage

### Basic Usage

Use this skill when you want to:

1. Set up a new Tabula Lens project from scratch
2. Integrate Tabula Lens into an existing Node.js/React application
3. Configure Tabula Lens with a specific framework (Express, Fastify, Next.js, etc.)
4. Set up authentication for Tabula Lens
5. Customize the styling and behavior of Tabula Lens components

### Prerequisites

Before using this skill, ensure you have:

- Node.js 18+ installed
- PostgreSQL database running (local or remote)
- npm or yarn package manager
- Basic knowledge of TypeScript
- React 19+ for frontend (if using @tabula-lens/react)

## Setup Steps

### Step 1: Install Packages

Install the required Tabula Lens packages:

```bash
# Backend package
npm install @tabula-lens/node

# Frontend package
npm install @tabula-lens/react
```

### Step 2: Backend Setup

Choose and install your preferred framework adapter:

**Express (4.x or 5.x):**

```bash
npm install express
```

**Fastify:**

```bash
npm install fastify
```

**Next.js:**

```bash
npm install next
```

**Other supported frameworks:** Koa, Hapi, Restify, TanStack Start, Remix, SvelteKit, Hono, Elysia, Fresh

### Step 3: Database Configuration

Configure your PostgreSQL database connection:

```typescript
import { TabulaLens } from '@tabula-lens/node';

const tabulaLens = new TabulaLens({
  database: {
    host: 'localhost',
    port: 5432,
    database: 'your_database',
    user: 'your_user',
    password: 'your_password',
  },
  logger: {
    level: 'info',
    format: 'pretty',
  },
});
```

### Step 4: Backend Integration

Integrate TabulaLens with your chosen framework:

**Express Example:**

```typescript
import express from 'express';
import { createExpressAdapter } from '@tabula-lens/node';

const app = express();
const adapter = createExpressAdapter(tabulaLens);

app.use('/api/database', adapter);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

**Fastify Example:**

```typescript
import Fastify from 'fastify';
import { createFastifyAdapter } from '@tabula-lens/node';

const fastify = Fastify();
const adapter = createFastifyAdapter(tabulaLens);

fastify.register(adapter, { prefix: '/api/database' });

fastify.listen({ port: 3000 });
```

### Step 5: Frontend Setup

Add the DatabaseViewer component to your React application:

```typescript
import { DatabaseViewer } from '@tabula-lens/react';

function App() {
  return (
    <DatabaseViewer
      path="http://localhost:3000/api/database"
      tableSelector="sidebar"
      filterPosition="header"
      paginationPosition="footer"
    />
  );
}
```

### Step 6: Authentication (Optional)

Add authentication to secure your API:

```typescript
const tabulaLens = new TabulaLens({
  database: {/* your config */},
  getAuthHeaders: async (req) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    return {
      Authorization: `Bearer ${token}`,
    };
  },
});
```

### Step 7: Styling Customization (Optional)

Customize the appearance using CSS custom properties:

```css
:root {
  --tlens-primary: #0ea5e9;
  --tlens-primary-hover: #0284c7;
  --tlens-background: #ffffff;
  --tlens-text: #0f172a;
  --tlens-border: #e2e8f0;
}
```

## Configuration Options

### Backend Configuration

```typescript
interface TabulaLensConfig {
  database: {
    host: string;
    port: number;
    database: string;
    user: string;
    password: string;
  };
  logger?: {
    level?: 'debug' | 'info' | 'warn' | 'error' | 'silent';
    format?: 'json' | 'text' | 'pretty';
  };
  getAuthHeaders?: (req: any) => Promise<Record<string, string>>;
}
```

### Frontend Configuration

```typescript
interface DatabaseViewerProps {
  path: string; // API endpoint path
  tableSelector?: 'sidebar' | 'dropdown' | 'none';
  filterPosition?: 'header' | 'footer' | 'none';
  paginationPosition?: 'header' | 'footer' | 'none';
  pageSize?: number; // Default: 20
  pageSizeOptions?: number[]; // Default: [10, 20, 50, 100]
  sortableColumns?: string[]; // Columns that can be sorted
  defaultSort?: { column: string; direction: 'asc' | 'desc' };
  getAuthHeaders?: () => Promise<Record<string, string>>;
  onError?: (error: Error) => void;
  classNames?: ClassNames;
  styles?: Styles;
}
```

## Examples

### Example 1: Minimal Setup

```bash
npm install @tabula-lens/node @tabula-lens/react express
```

```typescript
// Backend (server.ts)
import express from 'express';
import { TabulaLens } from '@tabula-lens/node';
import { createExpressAdapter } from '@tabula-lens/node';

const app = express();
const tabulaLens = new TabulaLens({
  database: {
    host: 'localhost',
    port: 5432,
    database: 'mydb',
    user: 'postgres',
    password: 'password',
  },
});
app.use('/api', createExpressAdapter(tabulaLens));
app.listen(3000);
```

```typescript
// Frontend (App.tsx)
import { DatabaseViewer } from '@tabula-lens/react';
export default function App() {
  return <DatabaseViewer path="http://localhost:3000/api" />;
}
```

### Example 2: Next.js with Auth

```typescript
// app/api/database/route.ts
import { TabulaLens } from '@tabula-lens/node';
import { createNextjsAdapter } from '@tabula-lens/node';

const tabulaLens = new TabulaLens({
  database: {
    host: process.env.DB_HOST!,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME!,
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
  },
  getAuthHeaders: async (req) => ({ Authorization: req.headers.authorization }),
});
export const { GET, POST, PUT, DELETE } = createNextjsAdapter(tabulaLens);
```

### Example 3: Custom Styling

```css
:root {
  --tlens-primary: #6366f1;
  --tlens-background: #f8fafc;
}
```

```typescript
<DatabaseViewer path="http://localhost:3000/api" styles={{ container: { background: 'var(--tlens-background)' } }} />
```

## Framework-Specific Guidance

Supported frameworks: Express (4.x/5.x), Fastify, Next.js, TanStack Start, Remix, SvelteKit, Hono, Elysia, Fresh, Koa, Hapi, Restify. Each has a dedicated adapter function (e.g., `createExpressAdapter()`, `createFastifyAdapter()`).

## Requirements

### System Requirements

- Node.js 18 or higher
- PostgreSQL 12 or higher
- npm 9+ or yarn 1.22+
- TypeScript 5+ (recommended)

### Package Dependencies

**@tabula-lens/node:**

- knex: ^3.0.0
- pg: ^8.11.0

**@tabula-lens/react:**

- react: ^19.2.7
- react-dom: ^19.2.7
- @tanstack/react-query: ^5.0.0
- @tanstack/react-table: ^8.0.0
- @base-ui/react: ^1.6.0

### Peer Dependencies

Install the peer dependency for your chosen framework:

```bash
# Express
npm install express

# Fastify
npm install fastify

# Next.js
npm install next

# etc.
```

## Troubleshooting

### Database Connection Issues

**Problem:** Cannot connect to PostgreSQL database

**Solutions:**

1. Verify PostgreSQL is running: `pg_isready`
2. Check database credentials in configuration
3. Ensure database exists: `psql -U postgres -l`
4. Check firewall/network settings
5. Verify connection string format

### CORS Errors

**Problem:** Frontend cannot connect to backend API

**Solutions:**

1. Enable CORS on backend:

```typescript
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);
```

2. Verify API endpoint URL in frontend
3. Check browser console for specific error

### Authentication Failures

**Problem:** Requests return 401 Unauthorized

**Solutions:**

1. Verify `getAuthHeaders` implementation
2. Check token format and validity
3. Ensure headers are passed correctly
4. Verify authentication logic

### Styling Issues

**Problem:** Custom styles not applying

**Solutions:**

1. Ensure CSS custom properties are defined
2. Check CSS file is imported in application
3. Verify style object syntax
4. Check for CSS specificity conflicts

### Build Errors

**Problem:** TypeScript compilation errors

**Solutions:**

1. Ensure TypeScript 5+ is installed
2. Check tsconfig.json configuration
3. Verify all dependencies are installed
4. Run `npm run check-types` for detailed errors

## Testing Your Setup

### Backend Testing

```bash
# Start backend server
npm run dev

# Test API endpoint
curl http://localhost:3000/api/tables
```

### Frontend Testing

```bash
# Start frontend dev server
npm run dev

# Open browser to http://localhost:5173
# Verify DatabaseViewer component loads
```

### Integration Testing

1. Verify backend returns table list
2. Verify frontend displays table selector
3. Test data loading and pagination
4. Test sorting and filtering
5. Verify authentication flow (if configured)

## References

- [Tabula Lens Documentation](https://github.com/Atsytec/tabula-lens)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Express Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [TanStack Table Documentation](https://tanstack.com/table/latest)

## Changelog

### 1.0.0

- Initial release
- Support for 15 framework adapters
- Comprehensive setup guidance
- Authentication examples
- Styling customization examples
- Troubleshooting guide
