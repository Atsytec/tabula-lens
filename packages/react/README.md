# @tabula-lens/react

[![npm version](https://badge.fury.io/js/%40tabula-lens%2Freact.svg)](https://www.npmjs.com/package/@tabula-lens/react)
[![Downloads](https://img.shields.io/npm/dm/@tabula-lens/react)](https://www.npmjs.com/package/@tabula-lens/react)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18+-61DAFB.svg)](https://reactjs.org/)

A powerful React component for viewing database data with built-in pagination, sorting, and filtering. Designed to work seamlessly with the `@tabula-lens/node` backend SDK for a secure, full-stack database viewing solution.

## 📑 Table of Contents

- [Features](#-features)
- [Installation](#-installation)
- [Peer Dependencies](#-peer-dependencies)
- [Dependencies](#-dependencies)
- [Quick Start](#-quick-start)
- [Architecture](#-architecture)
- [API Reference](#-api-reference)
- [Advanced Usage](#-advanced-usage)
- [Custom Hooks](#-custom-hooks)
- [Sub-Components](#-sub-components)
- [Utility Functions](#-utility-functions)
- [Migration Guide](#-migration-guide)
- [Troubleshooting](#-troubleshooting)
- [Performance](#-performance)
- [Browser Support](#-browser-support)

## 🎯 Features

- **Security First**: Database credentials stay on the backend
- **Feature Rich**: Built-in pagination, sorting, and filtering
- **Type Safe**: Full TypeScript support with comprehensive type definitions
- **Customizable**: Extensive styling and component customization options
- **Framework Agnostic**: Works with React, Next.js, TanStack Start, Remix, SvelteKit, and more
- **Responsive**: Mobile-friendly design with responsive table layouts
- **Performance**: Powered by TanStack Query for efficient data fetching and caching
- **Zero Config**: Minimal setup required for basic usage
- **Modular Architecture**: Component-based design with reusable sub-components, custom hooks, and utility functions
- **Optimized**: React.memo implementation for performance optimization

## 📦 Installation

```bash
npm install @tabula-lens/react
# or
pnpm add @tabula-lens/react
# or
yarn add @tabula-lens/react
```

### Peer Dependencies

This package requires React 18+ and React DOM 18+:

```bash
npm install react react-dom
```

## � Dependencies

This package includes the following dependencies:

- **@tanstack/react-query@^5.0.0** - Data fetching and caching
- **@tanstack/react-table@^8.0.0** - Table functionality
- **@base-ui/react@^1.6.0** - Base UI components

These are bundled with the package, so you don't need to install them separately.

## �🚀 Quick Start

### Basic Usage

```tsx
import { DatabaseViewer } from '@tabula-lens/react';

function App() {
  return <DatabaseViewer path="/api/tabula-lens" />;
}
```

### With Authentication

```tsx
import { DatabaseViewer } from '@tabula-lens/react';

function App() {
  const getAuthHeaders = async () => {
    const token = localStorage.getItem('authToken');
    return { Authorization: `Bearer ${token}` };
  };

  return <DatabaseViewer path="/api/tabula-lens" getAuthHeaders={getAuthHeaders} />;
}
```

### With Table Selector

```tsx
import { DatabaseViewer } from '@tabula-lens/react';

function App() {
  return <DatabaseViewer path="/api/tabula-lens" tableSelector="dropdown" initialTable="users" />;
}
```

## 🏗️ Architecture

The `@tabula-lens/react` package follows a modular architecture with clear separation of concerns:

### Component Structure

```
src/
├── DatabaseViewer.tsx              # Main orchestrator component
├── components/
│   └── DatabaseViewer/
│       ├── index.ts                # Public API exports
│       ├── DatabaseViewer.tsx      # Main component implementation
│       ├── DatabaseViewer.types.ts # Type definitions
│       ├── hooks/                  # Custom React hooks
│       │   ├── useLogger.ts       # Logging functionality
│       │   ├── useTableState.ts   # Table state management
│       │   ├── buildQueryParams.ts # Query parameter building
│       │   └── useDatabaseData.ts # Data fetching logic
│       ├── components/             # Reusable sub-components
│       │   ├── LoadingState.tsx   # Loading state display
│       │   ├── ErrorState.tsx     # Error state display
│       │   ├── EmptyState.tsx     # Empty state display
│       │   ├── TableSelector.tsx  # Table selection UI
│       │   ├── FilterInput.tsx    # Filter input component
│       │   ├── Pagination.tsx    # Pagination controls
│       │   └── DataTable.tsx      # Data table rendering
│       ├── utils/                 # Utility functions
│       │   ├── fetchHelpers.ts    # Fetch-related utilities
│       │   ├── validationHelpers.ts # Validation utilities
│       │   └── styleHelpers.ts    # Style merging utilities
│       └── styles/                # Default styles
│           └── defaultStyles.ts  # Default style definitions
```

### Key Design Principles

1. **Single Responsibility**: Each module has a clear, focused purpose
2. **Reusability**: Sub-components and hooks can be used independently
3. **Performance**: All components use React.memo to prevent unnecessary re-renders
4. **Type Safety**: Comprehensive TypeScript types throughout
5. **Testability**: Modular design enables easier unit testing

## 📖 API Reference

### DatabaseViewer Component

The main component for displaying database data with a full-featured table interface.

#### Core Props

| Prop           | Type     | Default    | Description                       |
| -------------- | -------- | ---------- | --------------------------------- |
| `path`         | `string` | _required_ | API endpoint path for the backend |
| `initialTable` | `string` | `'users'`  | Default table to load on mount    |

#### Table Selection Props

| Prop                     | Type                                | Default          | Description                     |
| ------------------------ | ----------------------------------- | ---------------- | ------------------------------- |
| `tableSelector`          | `'dropdown' \| 'sidebar' \| 'none'` | `'none'`         | Table selector UI mode          |
| `tableSelectorLabel`     | `string`                            | `'Select Table'` | Label for table selector        |
| `tableSelectorComponent` | `React.FC`                          | `undefined`      | Custom table selector component |

#### Authentication Props

| Prop             | Type                                    | Default     | Description                           |
| ---------------- | --------------------------------------- | ----------- | ------------------------------------- |
| `getAuthHeaders` | `() => Promise<Record<string, string>>` | `undefined` | Async function to get auth headers    |
| `headers`        | `Record<string, string>`                | `undefined` | Static headers to include in requests |

#### Filtering Props

| Prop                | Type                          | Default               | Description                         |
| ------------------- | ----------------------------- | --------------------- | ----------------------------------- |
| `showFilter`        | `boolean`                     | `true`                | Show/hide filter input              |
| `filterPlaceholder` | `string`                      | `'Filter records...'` | Placeholder text for filter input   |
| `filterPosition`    | `'top' \| 'bottom' \| 'both'` | `'top'`               | Position of filter input            |
| `filterDebounceMs`  | `number`                      | `300`                 | Debounce time for filter input (ms) |
| `filterComponent`   | `React.FC`                    | `undefined`           | Custom filter component             |

#### Pagination Props

| Prop                   | Type                          | Default                 | Description                     |
| ---------------------- | ----------------------------- | ----------------------- | ------------------------------- |
| `showPagination`       | `boolean`                     | `true`                  | Show/hide pagination controls   |
| `pageSize`             | `number`                      | `10`                    | Default page size               |
| `pageSizeOptions`      | `number[]`                    | `[10, 20, 30, 50, 100]` | Available page size options     |
| `showPageSizeSelector` | `boolean`                     | `true`                  | Show/hide page size selector    |
| `paginationPosition`   | `'top' \| 'bottom' \| 'both'` | `'bottom'`              | Position of pagination controls |
| `paginationComponent`  | `React.FC`                    | `undefined`             | Custom pagination component     |

#### Sorting Props

| Prop              | Type                                               | Default     | Description                              |
| ----------------- | -------------------------------------------------- | ----------- | ---------------------------------------- |
| `enableSorting`   | `boolean`                                          | `true`      | Enable/disable column sorting            |
| `sortableColumns` | `string[]`                                         | `undefined` | Array of column names that can be sorted |
| `defaultSort`     | `{ column: string; direction: 'asc' \| 'desc' }`   | `undefined` | Default sort configuration               |
| `multiSort`       | `boolean`                                          | `false`     | Enable multiple column sorting           |
| `sortIcon`        | `React.FC<{ direction: 'asc' \| 'desc' \| null }>` | `undefined` | Custom sort icon component               |

#### Styling Props

| Prop         | Type                  | Default     | Description                                       |
| ------------ | --------------------- | ----------- | ------------------------------------------------- |
| `className`  | `string`              | `undefined` | CSS class name for the container                  |
| `classNames` | `ClassNames`          | `undefined` | Object with CSS class names for specific elements |
| `style`      | `React.CSSProperties` | `undefined` | Inline styles for the container                   |
| `styles`     | `Styles`              | `undefined` | Object with inline styles for specific elements   |

#### Custom Components Props

| Prop               | Type                                            | Default     | Description                  |
| ------------------ | ----------------------------------------------- | ----------- | ---------------------------- |
| `loadingComponent` | `React.FC`                                      | `undefined` | Custom loading component     |
| `errorComponent`   | `React.FC<{ error: Error; retry: () => void }>` | `undefined` | Custom error component       |
| `emptyComponent`   | `React.FC`                                      | `undefined` | Custom empty state component |

#### Query Options Props

| Prop              | Type           | Default     | Description                              |
| ----------------- | -------------- | ----------- | ---------------------------------------- |
| `queryOptions`    | `QueryOptions` | `undefined` | TanStack Query options for data fetching |
| `refetchInterval` | `number`       | `undefined` | Auto-refresh interval in milliseconds    |

#### Error Handling Props

| Prop      | Type                     | Default     | Description                          |
| --------- | ------------------------ | ----------- | ------------------------------------ |
| `onError` | `(error: Error) => void` | `undefined` | Callback function for error handling |

#### Logging Props

| Prop                    | Type                                     | Default                                  | Description             |
| ----------------------- | ---------------------------------------- | ---------------------------------------- | ----------------------- |
| `logger`                | `Logger`                                 | `undefined`                              | Custom logger instance  |
| `enableLogging`         | `boolean`                                | `process.env.NODE_ENV === 'development'` | Enable/disable logging  |
| `logLevel`              | `'debug' \| 'info' \| 'warn' \| 'error'` | `'info'`                                 | Logging level           |
| `logFetchErrors`        | `boolean`                                | `true`                                   | Log fetch errors        |
| `logQueryErrors`        | `boolean`                                | `true`                                   | Log query errors        |
| `logPerformanceMetrics` | `boolean`                                | `true`                                   | Log performance metrics |

**Logging Configuration:**

The DatabaseViewer component includes a built-in logging system for debugging and monitoring:

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

```tsx
import { DatabaseViewer, createLogger } from '@tabula-lens/react';

// Basic usage with default logging (enabled in development)
<DatabaseViewer path="/api/tabula-lens" />

// Explicitly enable logging
<DatabaseViewer
  path="/api/tabula-lens"
  enableLogging={true}
  logLevel="debug"
/>

// Disable logging
<DatabaseViewer
  path="/api/tabula-lens"
  enableLogging={false}
/>

// Custom log level
<DatabaseViewer
  path="/api/tabula-lens"
  enableLogging={true}
  logLevel="info" // or 'error', 'warn', 'debug'
/>

// Disable specific logging types
<DatabaseViewer
  path="/api/tabula-lens"
  enableLogging={true}
  logFetchErrors={false}
  logQueryErrors={false}
  logPerformanceMetrics={false}
/>
```

## 🎨 Customization Examples

### Custom Styling

```tsx
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

### Custom Components

```tsx
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

### Advanced Configuration

```tsx
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

## 🔧 Advanced Usage

### Logging Configuration

The logging system provides detailed insights into component lifecycle, data fetching, and user interactions.

**Custom Logger:**

```tsx
import { DatabaseViewer, createLogger } from '@tabula-lens/react';

// Create a custom logger with specific configuration
const customLogger = createLogger({
  level: 'debug',
  includeTimestamp: true,
  colorize: true,
  format: 'pretty',
});

function App() {
  return <DatabaseViewer path="/api/tabula-lens" logger={customLogger} enableLogging={true} />;
}
```

**Custom Logger Implementation:**

```tsx
import { DatabaseViewer, type Logger } from '@tabula-lens/react';

// Implement your own logger for custom integrations
const customLogger: Logger = {
  error(message, context) {
    // Send to error tracking service
    console.error('[CUSTOM ERROR]', message, context);
    // Sentry.captureException(new Error(message), { extra: context });
  },
  warn(message, context) {
    console.warn('[CUSTOM WARN]', message, context);
  },
  info(message, context) {
    console.log('[CUSTOM INFO]', message, context);
    // Send to analytics service
    // analytics.track('database_viewer_event', { message, ...context });
  },
  debug(message, context) {
    console.debug('[CUSTOM DEBUG]', message, context);
  },
};

function App() {
  return (
    <DatabaseViewer
      path="/api/tabula-lens"
      logger={customLogger}
      enableLogging={true}
      logLevel="debug"
    />
  );
}
```

**Using the useLogger Hook:**

```tsx
import { useLogger } from '@tabula-lens/react';

function CustomComponent() {
  const { logger } = useLogger({
    enableLogging: true,
    logLevel: 'debug',
  });

  const handleClick = () => {
    logger.info('Button clicked', { component: 'CustomComponent' });
  };

  return <button onClick={handleClick}>Click me</button>;
}
```

**Log Formats:**

```tsx
import { createLogger } from '@tabula-lens/react';

// Pretty format (default, human-readable with colors)
const prettyLogger = createLogger({
  level: 'info',
  format: 'pretty',
  colorize: true,
});

// JSON format (structured logging for log aggregation)
const jsonLogger = createLogger({
  level: 'info',
  format: 'json',
});

// Text format (simple text output)
const textLogger = createLogger({
  level: 'info',
  format: 'text',
});
```

**Environment-Specific Logging:**

```tsx
import { DatabaseViewer } from '@tabula-lens/react';

function App() {
  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <DatabaseViewer
      path="/api/tabula-lens"
      enableLogging={isDevelopment}
      logLevel={isDevelopment ? 'debug' : 'error'}
      logPerformanceMetrics={isDevelopment}
    />
  );
}
```

### Using Custom Hooks

The package exports custom hooks that can be used independently for advanced use cases:

```tsx
import { useDatabaseData, useTableState, useLogger, buildQueryParams } from '@tabula-lens/react';

function CustomDatabaseViewer({ path }) {
  const { logger } = useLogger({ enableLogging: true, logLevel: 'debug' });
  const tableState = useTableState({
    initialTable: 'users',
    pageSize: 20,
  });

  const queryParams = buildQueryParams({
    selectedTable: tableState.selectedTable,
    pagination: tableState.pagination,
    sorting: tableState.sorting,
    filter: tableState.debouncedFilter,
  });

  const { data, tables, isLoading, error, refetch } = useDatabaseData({
    path,
    selectedTable: tableState.selectedTable,
    queryParams,
  });

  // Log custom events
  const handleTableChange = (table) => {
    logger.info('Table changed', { from: tableState.selectedTable, to: table });
    tableState.setSelectedTable(table);
  };

  // Custom implementation using the hooks
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{/* Your custom UI implementation */}</div>;
}
```

### Using Utility Functions

Utility functions are available for data validation and fetch operations:

```tsx
import {
  isQueryResult,
  validatePagination,
  sanitizeColumnData,
  createAuthenticatedHeaders,
  validateResponse,
  createLogger,
} from '@tabula-lens/react';

// Type guard for query results
if (isQueryResult(data)) {
  console.log('Valid query result:', data);
}

// Validate pagination parameters
const pagination = validatePagination({ page: 1, limit: 10 });

// Sanitize column data for safe rendering
const safeData = sanitizeColumnData(rawData);

// Create authenticated headers
const headers = await createAuthenticatedHeaders({
  staticHeaders: { 'Content-Type': 'application/json' },
  getAuthHeaders: async () => ({
    Authorization: `Bearer ${token}`,
  }),
});

// Validate API response
const isValid = await validateResponse(response);

// Create a logger for utility functions
const logger = createLogger({ level: 'debug' });
logger.info('Data validation complete', { isValid, recordCount: data.length });
```

### Using Sub-Components

Individual sub-components can be used for custom implementations:

```tsx
import {
  LoadingState,
  ErrorState,
  EmptyState,
  TableSelector,
  FilterInput,
  Pagination,
  DataTable,
} from '@tabula-lens/react';

function CustomViewer() {
  return (
    <div>
      <LoadingState isLoading={isLoading} />
      <ErrorState error={error} onRetry={retry} />
      <EmptyState isEmpty={isEmpty} />
      <TableSelector
        mode="dropdown"
        tables={['users', 'posts', 'comments']}
        selectedTable={selectedTable}
        onSelectTable={setSelectedTable}
      />
      <FilterInput value={filter} onChange={setFilter} placeholder="Search..." />
      <DataTable data={data} columns={columns} sorting={sorting} onSort={setSorting} />
      <Pagination
        pageIndex={pageIndex}
        pageCount={pageCount}
        pageSize={pageSize}
        onPageChange={setPageIndex}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
}
```

### Custom Table Selector

```tsx
import { DatabaseViewer } from '@tabula-lens/react';

const CustomTableSelector = ({ tables, selectedTable, onSelectTable }) => (
  <div className="flex gap-2 mb-4">
    {tables.map((table) => (
      <button
        key={table}
        onClick={() => onSelectTable(table)}
        className={`px-4 py-2 rounded ${
          selectedTable === table ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
        }`}
      >
        {table}
      </button>
    ))}
  </div>
);

function App() {
  return <DatabaseViewer path="/api/tabula-lens" tableSelectorComponent={CustomTableSelector} />;
}
```

### Custom Filter Component

```tsx
import { DatabaseViewer } from '@tabula-lens/react';

const CustomFilter = ({ value, onChange }) => (
  <div className="relative">
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="🔍 Search..."
      className="w-full pl-10 pr-4 py-2 border rounded-lg"
    />
    <span className="absolute left-3 top-2.5">🔍</span>
  </div>
);

function App() {
  return <DatabaseViewer path="/api/tabula-lens" filterComponent={CustomFilter} />;
}
```

### Custom Pagination Component

```tsx
import { DatabaseViewer } from '@tabula-lens/react';

const CustomPagination = ({
  pageIndex,
  pageCount,
  pageSize,
  canPreviousPage,
  canNextPage,
  previousPage,
  nextPage,
  firstPage,
  lastPage,
  setPageSize,
}) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <button
        onClick={firstPage}
        disabled={!canPreviousPage}
        className="px-3 py-1 rounded disabled:opacity-50"
      >
        ««
      </button>
      <button
        onClick={previousPage}
        disabled={!canPreviousPage}
        className="px-3 py-1 rounded disabled:opacity-50"
      >
        «
      </button>
      <span>
        Page {pageIndex + 1} of {pageCount}
      </span>
      <button
        onClick={nextPage}
        disabled={!canNextPage}
        className="px-3 py-1 rounded disabled:opacity-50"
      >
        »
      </button>
      <button
        onClick={lastPage}
        disabled={!canNextPage}
        className="px-3 py-1 rounded disabled:opacity-50"
      >
        »»
      </button>
    </div>
    <select
      value={pageSize}
      onChange={(e) => setPageSize(Number(e.target.value))}
      className="px-3 py-1 rounded"
    >
      {[10, 25, 50, 100].map((size) => (
        <option key={size} value={size}>
          {size} per page
        </option>
      ))}
    </select>
  </div>
);

function App() {
  return <DatabaseViewer path="/api/tabula-lens" paginationComponent={CustomPagination} />;
}
```

## 🔒 Authentication

### Using Auth Headers

```tsx
import { DatabaseViewer } from '@tabula-lens/react';

function App() {
  const getAuthHeaders = async () => {
    const token = localStorage.getItem('authToken');
    return { Authorization: `Bearer ${token}` };
  };

  return <DatabaseViewer path="/api/tabula-lens" getAuthHeaders={getAuthHeaders} />;
}
```

### Using Static Headers

```tsx
import { DatabaseViewer } from '@tabula-lens/react';

function App() {
  return (
    <DatabaseViewer
      path="/api/tabula-lens"
      headers={{
        'X-API-Key': 'your-api-key',
        'X-Custom-Header': 'custom-value',
      }}
    />
  );
}
```

## 🔄 Migration Guide

### From Previous Versions

If you're upgrading from a previous version of `@tabula-lens/react`, the API remains fully backward compatible. All existing props and functionality work exactly as before.

### New Features in v0.2.0

Version 0.2.0 introduced a major refactoring to improve code organization and performance:

**What Changed:**

- Internal component structure is now modular with sub-components
- Custom hooks are now available for advanced use cases
- Utility functions are exported for reuse
- All components now use React.memo for performance optimization
- Better TypeScript type definitions

**What Didn't Change:**

- All public APIs remain the same
- All props work exactly as before
- No breaking changes to existing implementations
- Drop-in replacement for previous versions

### Using New Features

While the main component API remains unchanged, you can now take advantage of the new modular structure:

**Before (still works):**

```tsx
import { DatabaseViewer } from '@tabula-lens/react';
<DatabaseViewer path="/api/database" />;
```

**After (with new modular options):**

```tsx
// Use custom hooks for advanced scenarios
import { useDatabaseData, useTableState } from '@tabula-lens/react';

// Use utility functions
import { sanitizeColumnData, validateResponse } from '@tabula-lens/react';

// Use individual sub-components
import { DataTable, Pagination, FilterInput } from '@tabula-lens/react';
```

### Performance Improvements

The refactoring includes automatic performance optimizations:

- All sub-components are memoized with React.memo
- Render functions are optimized to prevent unnecessary re-renders
- Style calculations use useMemo for efficiency
- Pagination calculations are memoized

No code changes are needed to benefit from these improvements.

## 🎯 Type Definitions

### ClassNames Interface

```typescript
interface ClassNames {
  container?: string;
  tableWrapper?: string;
  table?: string;
  header?: string;
  cell?: string;
  filter?: string;
  filterInput?: string;
  pagination?: string;
  paginationButton?: string;
  paginationInfo?: string;
  pageSize?: string;
  tableSelector?: string;
  tableSelectorDropdown?: string;
  tableSelectorSidebar?: string;
  empty?: string;
  loading?: string;
  error?: string;
  info?: string;
}
```

### Styles Interface

```typescript
interface Styles {
  container?: React.CSSProperties;
  tableWrapper?: React.CSSProperties;
  table?: React.CSSProperties;
  th?: React.CSSProperties;
  td?: React.CSSProperties;
  header?: React.CSSProperties;
  cell?: React.CSSProperties;
  sortable?: React.CSSProperties;
  sorted?: React.CSSProperties;
  filter?: React.CSSProperties;
  filterInput?: React.CSSProperties;
  pagination?: React.CSSProperties;
  paginationButton?: React.CSSProperties;
  paginationInfo?: React.CSSProperties;
  pageSize?: React.CSSProperties;
  tableSelector?: React.CSSProperties;
  tableSelectorDropdown?: React.CSSProperties;
  tableSelectorSidebar?: React.CSSProperties;
  empty?: React.CSSProperties;
  loading?: React.CSSProperties;
  spinner?: React.CSSProperties;
  error?: React.CSSProperties;
  retry?: React.CSSProperties;
  info?: React.CSSProperties;
}
```

### QueryOptions Interface

```typescript
interface QueryOptions {
  staleTime?: number;
  cacheTime?: number;
  retry?: number | boolean;
  retryDelay?: number;
  refetchOnWindowFocus?: boolean;
  refetchOnReconnect?: boolean;
  refetchOnMount?: boolean;
}
```

## 🧪 Testing

```tsx
import { render, screen } from '@testing-library/react';
import { DatabaseViewer } from '@tabula-lens/react';

describe('DatabaseViewer', () => {
  it('renders loading state initially', () => {
    render(<DatabaseViewer path="/api/tabula-lens" />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders table with data', async () => {
    render(<DatabaseViewer path="/api/tabula-lens" />);
    // Wait for data to load
    const table = await screen.findByRole('table');
    expect(table).toBeInTheDocument();
  });
});
```

## 🚀 Performance Optimization

### Query Caching

```tsx
import { DatabaseViewer } from '@tabula-lens/react';

function App() {
  return (
    <DatabaseViewer
      path="/api/tabula-lens"
      queryOptions={{
        staleTime: 5 * 60 * 1000, // 5 minutes
        cacheTime: 10 * 60 * 1000, // 10 minutes
        refetchOnWindowFocus: false,
      }}
    />
  );
}
```

### Auto-refresh

```tsx
import { DatabaseViewer } from '@tabula-lens/react';

function App() {
  return (
    <DatabaseViewer
      path="/api/tabula-lens"
      refetchInterval={30000} // Refresh every 30 seconds
    />
  );
}
```

## 🎨 Styling with CSS

```css
/* Custom table styling */
.custom-db-viewer {
  font-family: 'Inter', sans-serif;
}

.custom-table {
  border-collapse: separate;
  border-spacing: 0;
  width: 100%;
}

.custom-header {
  background-color: #1a1a1a;
  color: white;
  font-weight: 600;
}

.custom-cell {
  padding: 12px;
  border-bottom: 1px solid #e5e7eb;
}
```

## 🔄 Framework Integration

### Next.js

```tsx
// app/page.jsx
'use client';
import { DatabaseViewer } from '@tabula-lens/react';

export default function Page() {
  return <DatabaseViewer path="/api/tabula-lens" />;
}
```

### TanStack Start

```tsx
// routes/index.tsx
import { DatabaseViewer } from '@tabula-lens/react';

export default function Index() {
  return <DatabaseViewer path="/api/tabula-lens" />;
}
```

### Remix

```tsx
// app/routes/dashboard.tsx
import { DatabaseViewer } from '@tabula-lens/react';

export default function Dashboard() {
  return <DatabaseViewer path="/api/tabula-lens" />;
}
```

## � Troubleshooting

### Component Not Rendering Data

**Problem**: Table shows no data or loading state

**Solutions**:

- Verify the `path` prop points to a valid backend endpoint
- Check browser console for network errors
- Ensure your backend is running and accessible
- Verify the backend returns valid JSON responses

### Styling Issues

**Problem**: Component looks unstyled or broken

**Solutions**:

- Ensure you're using React 18+
- Check that CSS is not being overridden by other styles
- Use the `classNames` or `styles` props to customize styling
- Verify your CSS framework isn't conflicting with default styles

### Data Fetching Issues

**Problem**: Data not updating or stale data shown

**Solutions**:

- Check `queryOptions` configuration (staleTime, refetchOnWindowFocus)
- Verify `refetchInterval` is set if you need auto-refresh
- Ensure `getAuthHeaders` is working if using authentication
- Check browser network tab for failed requests

### Performance Issues

**Problem**: Component renders slowly or causes lag

**Solutions**:

- Use `pageSize` to limit the number of records rendered
- Enable `filterDebounceMs` to reduce API calls during typing
- Use `sortableColumns` to limit sorting to specific columns
- Check that you're not causing unnecessary re-renders in parent components

## ⚡ Performance

### Built-in Optimizations

- All components use `React.memo` to prevent unnecessary re-renders
- Render functions are memoized for expensive computations
- Pagination calculations are cached
- TanStack Query provides intelligent data caching

### Best Practices

- Use `queryOptions.staleTime` to reduce unnecessary refetches
- Set appropriate `pageSize` to balance performance and UX
- Use `sortableColumns` to limit sorting to specific columns
- Enable `filterDebounceMs` to reduce API calls during typing
- Consider `refetchInterval` for real-time data vs. manual refresh

### Bundle Size

The package is optimized for tree-shaking. Import only what you need:

```typescript
// Good - Tree-shakeable
import { DatabaseViewer } from '@tabula-lens/react';

// Also available for advanced use cases
import { useDatabaseData, LoadingState, ErrorState } from '@tabula-lens/react';
```

## 🌐 Browser Support

This package supports all modern browsers:

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

**Required Browser Features**:

- ES2020+ JavaScript support
- CSS Grid and Flexbox support
- Fetch API support

**Internet Explorer**: Not supported

## 📝 License

## �📝 License

Currently no license. All rights reserved.

## 🤝 Contributing

Contributions will be allowed soon.

## 🔗 Links

<!-- - [Main Repository](https://github.com/yourusername/tabula-lens) -->
<!-- - [Node Package](https://www.npmjs.com/package/@tabula-lens/node) -->
<!-- - [Documentation](https://tabula-lens.dev) -->
<!-- - [Issues](https://github.com/yourusername/tabula-lens/issues) -->

## 🙏 Acknowledgments

Built with [React](https://reactjs.org/), [TanStack Query](https://tanstack.com/query/latest), and [TanStack Table](https://tanstack.com/table/latest).
