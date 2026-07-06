import React, { useState } from 'react';
import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  PaginationState,
} from '@tanstack/react-table';

// Inline styles for simplicity in bundling
const styles = {
  container: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    color: '#333',
    maxWidth: '100%',
    margin: 0,
    padding: '1rem',
  },
  loading: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    gap: '1rem',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #3498db',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  error: {
    padding: '1rem',
    backgroundColor: '#fee',
    border: '1px solid #fcc',
    borderRadius: '4px',
    color: '#c33',
  },
  retry: {
    marginTop: '0.5rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#c33',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  filter: {
    marginBottom: '1rem',
  },
  filterInput: {
    width: '100%',
    padding: '0.5rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
  },
  tableWrapper: {
    overflowX: 'auto' as const,
    border: '1px solid #ddd',
    borderRadius: '4px',
    marginBottom: '1rem',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    backgroundColor: 'white',
  },
  th: {
    padding: '0.75rem',
    textAlign: 'left' as const,
    borderBottom: '1px solid #ddd',
    backgroundColor: '#f8f9fa',
    fontWeight: 600,
    position: 'sticky' as const,
    top: 0,
  },
  td: {
    padding: '0.75rem',
    textAlign: 'left' as const,
    borderBottom: '1px solid #ddd',
  },
  empty: {
    textAlign: 'center' as const,
    padding: '2rem',
    color: '#666',
  },
  sortable: {
    cursor: 'pointer',
    userSelect: 'none' as const,
  },
  sorted: {
    cursor: 'pointer',
    userSelect: 'none' as const,
    backgroundColor: '#e9ecef',
  },
  pagination: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    marginBottom: '1rem',
    flexWrap: 'wrap' as const,
  },
  paginationButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  paginationInfo: {
    padding: '0 1rem',
    fontWeight: 500,
  },
  pageSize: {
    padding: '0.5rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  info: {
    textAlign: 'center' as const,
    color: '#666',
    fontSize: '0.875rem',
  },
};

// Types matching the backend response
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

interface DatabaseViewerProps {
  endpoint: string;
  authToken?: string;
  initialTable?: string;
  pageSize?: number;
}

// Create a default query client
const defaultQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export const DatabaseViewer: React.FC<DatabaseViewerProps> = ({
  endpoint,
  authToken,
  initialTable = 'users',
  pageSize = 10,
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  });
  const [filter, setFilter] = useState('');

  // Build query parameters
  const queryParams = new URLSearchParams({
    table: initialTable,
    page: String(pagination.pageIndex + 1),
    limit: String(pagination.pageSize),
    ...(sorting.length > 0 && {
      sort: sorting.map((s) => `${s.id}:${s.desc ? 'desc' : 'asc'}`).join(','),
    }),
    ...(filter && { filter }),
  });

  const url = `${endpoint}?${queryParams.toString()}`;

  // Fetch data with TanStack Query
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['databaseData', url],
    queryFn: async () => {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const response = await fetch(url, { headers });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json() as Promise<QueryResult>;
    },
  });

  // Define columns dynamically based on the data
  const columns = React.useMemo<ColumnDef<Record<string, unknown>>[]>(() => {
    if (!data?.columns) return [];
    return data.columns.map((columnName: string) => ({
      accessorKey: columnName,
      header: columnName,
      cell: (info: { getValue: () => unknown }) => String(info.getValue() ?? ''),
    }));
  }, [data?.columns]);

  // Create table instance
  const table = useReactTable({
    data: data?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    pageCount: data?.pagination.totalPages ?? 0,
    manualPagination: true,
  });

  if (isLoading) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner} />
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        <p>Loading data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.error}>
        <p>Error loading data: {(error as Error).message}</p>
        <button onClick={() => refetch()} style={styles.retry}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Filter Input */}
      <div style={styles.filter}>
        <input
          type="text"
          placeholder="Filter records..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={styles.filterInput}
        />
      </div>

      {/* Table */}
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    style={{
                      ...styles.th,
                      ...(header.column.getIsSorted() ? styles.sorted : styles.sortable),
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getIsSorted() === 'asc' ? ' ↑' : null}
                    {header.column.getIsSorted() === 'desc' ? ' ↓' : null}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} style={styles.empty}>
                  No data available
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8f9fa')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} style={styles.td}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div style={styles.pagination}>
        <button
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
          style={styles.paginationButton}
        >
          {'<<'}
        </button>
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          style={styles.paginationButton}
        >
          {'<'}
        </button>
        <span style={styles.paginationInfo}>
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </span>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          style={styles.paginationButton}
        >
          {'>'}
        </button>
        <button
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
          style={styles.paginationButton}
        >
          {'>>'}
        </button>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
          style={styles.pageSize}
        >
          {[10, 20, 30, 50, 100].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>

      {/* Info */}
      {data && <div style={styles.info}>Total records: {data.pagination.total}</div>}
    </div>
  );
};

// Export a provider-wrapped version for easier usage
export const DatabaseViewerWithProvider: React.FC<
  DatabaseViewerProps & { queryClient?: QueryClient }
> = ({ queryClient = defaultQueryClient, ...props }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <DatabaseViewer {...props} />
    </QueryClientProvider>
  );
};
