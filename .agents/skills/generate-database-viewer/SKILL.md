---
name: generate-database-viewer
version: 1.0.0
description: Generate React DatabaseViewer components with specific configurations for Tabula Lens. Use when creating database viewer components with custom props, styling, or behavior.
author: viti-mg <victormargon@yahoo.es>
license: Apache-2.0
repository: https://github.com/Atsytec/tabula-lens
tags:
  [tabula-lens, react, component-generation, database-viewer, table, sorting, filtering, pagination]
triggers:
  - generate database viewer
  - create database viewer component
  - add database viewer
  - tabula lens component
  - database table component
  - create table viewer
  - generate data table
  - add database table
negative_triggers:
  - setup tabula lens
  - install tabula lens
  - tabula lens backend
  - tabula lens authentication
  - tabula lens deployment
compatibility:
  - claude-code
  - openai-codex
  - gemini-cli
  - vscode-copilot
  - cursor
  - jetbrains
---

# Generate Database Viewer

Generate React DatabaseViewer components with custom configurations for Tabula Lens, including styling, sorting, filtering, and pagination options.

## Description

This skill generates React DatabaseViewer components from @tabula-lens/react with specific configurations. It helps you:

- Create DatabaseViewer components with custom props
- Configure table selector modes (sidebar, dropdown, none)
- Set up filter and pagination positions
- Configure sortable columns and default sorting
- Add custom styling with CSS custom properties or style objects
- Implement authentication headers
- Add custom error handling
- Configure page size and page size options

The skill generates production-ready React components that integrate with Tabula Lens backend APIs.

## Usage

Use this skill when you want to:

1. Create a new DatabaseViewer component with specific configuration
2. Add a database viewer to an existing React application
3. Customize the appearance and behavior of a database viewer
4. Configure sorting, filtering, or pagination for a table
5. Add authentication to a database viewer component

## Component Configuration

### Basic Props

```typescript
interface DatabaseViewerProps {
  path: string; // Required: API endpoint path
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

### Table Selector Modes

- **sidebar**: Table list in left sidebar (default for complex apps)
- **dropdown**: Table selector in dropdown menu (compact UI)
- **none**: No table selector (single table view)

### Filter & Pagination Positions

- **header**: Controls in table header area
- **footer**: Controls in table footer area
- **none**: Disable the feature

## Examples

### Example 1: Basic Database Viewer

```typescript
import { DatabaseViewer } from '@tabula-lens/react';

function UsersTable() {
  return (
    <DatabaseViewer
      path="http://localhost:3000/api/database"
      tableSelector="dropdown"
      filterPosition="header"
      paginationPosition="footer"
    />
  );
}
```

### Example 2: Custom Sorting

```typescript
function ProductsTable() {
  return (
    <DatabaseViewer
      path="http://localhost:3000/api/database"
      sortableColumns={['name', 'price', 'category', 'created_at']}
      defaultSort={{ column: 'created_at', direction: 'desc' }}
      pageSize={50}
    />
  );
}
```

### Example 3: With Authentication

```typescript
function SecureTable() {
  const getToken = async () => {
    const token = localStorage.getItem('authToken');
    return { Authorization: `Bearer ${token}` };
  };

  return (
    <DatabaseViewer
      path="http://localhost:3000/api/database"
      getAuthHeaders={getToken}
      onError={(error) => console.error('Database error:', error)}
    />
  );
}
```

### Example 4: Custom Styling

```typescript
function StyledTable() {
  return (
    <DatabaseViewer
      path="http://localhost:3000/api/database"
      styles={{
        container: { borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
        header: { backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' },
        table: { fontSize: '14px' },
      }}
      classNames={{
        container: 'custom-database-viewer',
        table: 'custom-table',
      }}
    />
  );
}
```

### Example 5: Compact View

```typescript
function CompactTable() {
  return (
    <DatabaseViewer
      path="http://localhost:3000/api/database"
      tableSelector="none"
      filterPosition="none"
      paginationPosition="header"
      pageSize={10}
      pageSizeOptions={[5, 10, 25]}
    />
  );
}
```

### Example 6: Full-Featured Table

```typescript
function FullFeaturedTable() {
  return (
    <DatabaseViewer
      path="http://localhost:3000/api/database"
      tableSelector="sidebar"
      filterPosition="header"
      paginationPosition="footer"
      pageSize={25}
      pageSizeOptions={[10, 25, 50, 100]}
      sortableColumns={['id', 'name', 'email', 'status', 'created_at']}
      defaultSort={{ column: 'id', direction: 'asc' }}
      getAuthHeaders={async () => ({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      })}
      onError={(error) => {
        // Custom error handling
        if (error.message.includes('401')) {
          window.location.href = '/login';
        }
      }}
      styles={{
        container: { maxHeight: '800px', overflow: 'auto' },
      }}
    />
  );
}
```

## Styling Options

### CSS Custom Properties

```css
:root {
  --tlens-primary: #0ea5e9;
  --tlens-primary-hover: #0284c7;
  --tlens-background: #ffffff;
  --tlens-surface: #f8fafc;
  --tlens-text: #0f172a;
  --tlens-text-secondary: #64748b;
  --tlens-border: #e2e8f0;
  --tlens-radius: 8px;
  --tlens-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
```

### Style Object

```typescript
interface Styles {
  container?: React.CSSProperties;
  header?: React.CSSProperties;
  table?: React.CSSProperties;
  tableRow?: React.CSSProperties;
  tableCell?: React.CSSProperties;
  tableHeader?: React.CSSProperties;
  // ... more style properties
}
```

### Class Names

```typescript
interface ClassNames {
  container?: string;
  header?: string;
  table?: string;
  tableRow?: string;
  tableCell?: string;
  tableHeader?: string;
  // ... more class name properties
}
```

## Advanced Features

### Custom Components

You can override default components with custom implementations:

```typescript
import { DatabaseViewer, LoadingState, ErrorState } from '@tabula-lens/react';

function CustomLoading() {
  return <div className="custom-loader">Loading data...</div>;
}

function CustomError({ error }: { error: Error }) {
  return <div className="custom-error">Error: {error.message}</div>;
}

// Note: Custom component integration is available through the component's modular architecture
// See documentation for advanced composition patterns
```

### TanStack Query Integration

For advanced data fetching with TanStack Query:

```typescript
import { useQuery } from '@tanstack/react-query';
import { useDatabaseData } from '@tabula-lens/react';

function CustomTable() {
  const { data, isLoading, error } = useDatabaseData({
    path: 'http://localhost:3000/api/database',
    table: 'users',
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  // Custom rendering with data
  return <div>{/* Custom table implementation */}</div>;
}
```

## Requirements

- React 19+
- @tabula-lens/react installed
- Tabula Lens backend API running
- TypeScript (recommended)

## Best Practices

1. **Path Configuration**: Always use the full API endpoint path
2. **Authentication**: Use `getAuthHeaders` for secured APIs
3. **Error Handling**: Implement `onError` for user feedback
4. **Performance**: Use appropriate `pageSize` for large datasets
5. **UX**: Choose table selector mode based on app complexity
6. **Styling**: Use CSS custom properties for consistent theming
7. **Sorting**: Only specify columns that should be sortable
8. **Pagination**: Provide sensible `pageSizeOptions` for your use case

## Troubleshooting

### Component Not Rendering

**Problem**: DatabaseViewer doesn't appear in the UI

**Solutions**:

1. Verify `path` prop is correct and API is accessible
2. Check browser console for errors
3. Ensure @tabula-lens/react is properly installed
4. Verify React 19+ is installed

### Data Not Loading

**Problem**: Table shows loading state indefinitely

**Solutions**:

1. Check API endpoint is responding
2. Verify CORS configuration on backend
3. Check network tab in browser dev tools
4. Verify authentication headers are correct

### Styling Not Applied

**Problem**: Custom styles not working

**Solutions**:

1. Ensure CSS custom properties are defined in :root
2. Check style object syntax is correct
3. Verify CSS specificity
4. Check that styles are imported in your app

### Sorting Not Working

**Problem**: Column headers not sortable

**Solutions**:

1. Verify column names in `sortableColumns` match database
2. Check that backend supports sorting
3. Ensure column names are case-sensitive
4. Verify `defaultSort` configuration

## References

- [Tabula Lens React Documentation](https://github.com/Atsytec/tabula-lens/tree/main/packages/react)
- [DatabaseViewer API Reference](https://github.com/Atsytec/tabula-lens/tree/main/packages/react/src/components/DatabaseViewer)
- [TanStack Table Documentation](https://tanstack.com/table/latest)
- [TanStack Query Documentation](https://tanstack.com/query/latest)

## Changelog

### 1.0.0

- Initial release
- Support for all DatabaseViewer props
- Comprehensive configuration examples
- Styling customization guidance
- Authentication integration examples
- Best practices and troubleshooting
