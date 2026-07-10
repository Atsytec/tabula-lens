# @tabula-lens/react

[![npm version](https://badge.fury.io/js/%40tabula-lens%2Freact.svg)](https://www.npmjs.com/package/@tabula-lens/react)
[![Downloads](https://img.shields.io/npm/dm/@tabula-lens/react)](https://www.npmjs.com/package/@tabula-lens/react)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19+-61DAFB.svg)](https://reactjs.org/)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

A powerful React component for viewing database data with built-in pagination, sorting, and filtering. Designed to work seamlessly with the `@tabula-lens/node` backend SDK for a secure, full-stack database viewing solution.

## 📑 Table of Contents

- [Features](#-features)
- [Installation](#-installation)
- [Peer Dependencies](#-peer-dependencies)
- [Quick Start](#-quick-start)
- [API Reference](#-api-reference)
- [Usage Examples](#-usage-examples)
- [Styling](#-styling)
- [Troubleshooting](#-troubleshooting)
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

## 🚀 Quick Start

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

## Authentication

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

## 🎨 Styling

import { DatabaseViewer } from '@tabula-lens/react';

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

## 🔧 Troubleshooting

### Data Not Loading

**Problem**: Component shows loading state indefinitely

**Solutions**:

- Verify the `path` prop points to the correct API endpoint
- Check that your backend is running and accessible
- Ensure the backend returns valid JSON responses
- Check browser console for network errors
- Verify authentication headers are correctly configured

### Table Not Displaying Data

**Problem**: Table loads but shows no data

**Solutions**:

- Verify the table exists in your database
- Check that the table has data
- Ensure column names match between backend and frontend
- Verify filtering isn't hiding all results
- Check browser console for JavaScript errors

### Styling Issues

**Problem**: Component looks unstyled or broken

**Solutions**:

- Ensure you're not using CSS-in-JS libraries that conflict
- Check that custom class names are correctly applied
- Verify custom styles don't conflict with existing styles
- Try removing custom styles to see if default styles work

### Performance Issues

**Problem**: Component is slow or unresponsive

**Solutions**:

- Reduce `pageSize` to show fewer rows per page
- Use the `columns` parameter to select only needed columns
- Enable query caching with appropriate `staleTime`
- Disable features you don't need (filtering, sorting, etc.)
- Consider server-side pagination for large datasets
  }

````

## 🎨 Styling

### CSS Classes

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
````

### Inline Styles

```tsx
import { DatabaseViewer } from '@tabula-lens/react';

function App() {
  return (
    <DatabaseViewer
      path="/api/tabula-lens"
      style={{ maxWidth: '1200px', margin: '0 auto' }}
      styles={{
        table: { borderCollapse: 'separate', borderSpacing: '0' },
        th: { backgroundColor: '#1a1a1a', color: 'white' },
      }}
    />
  );
}
```

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📝 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please see our [contributing guidelines](https://github.com/Atsytec/tabula-lens/blob/main/CONTRIBUTING.md) for details.

## 🔒 Security

For security vulnerabilities, please see our [security policy](https://github.com/Atsytec/tabula-lens/blob/main/SECURITY.md).

## 💬 Support

Need help? Check our [support documentation](https://github.com/Atsytec/tabula-lens/blob/main/SUPPORT.md) or open an issue on GitHub.

## 🔗 Links

- [Main Repository](https://github.com/Atsytec/tabula-lens)
- [React Package](https://www.npmjs.com/package/@tabula-lens/react)
- [Issues](https://github.com/Atsytec/tabula-lens/issues)

## 🙏 Acknowledgments

Built with [React](https://reactjs.org/), [TanStack Query](https://tanstack.com/query/latest), and [TanStack Table](https://tanstack.com/table/latest).
