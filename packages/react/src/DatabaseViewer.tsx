import React, { useState, useEffect } from 'react';
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
import { Logger, createLogger, LogLevel, generateId } from './logger';

// Utility functions for style merging
const mergeClassName = (base: string, custom?: string) => {
  if (!custom) return base;
  return `${base} ${custom}`;
};

const mergeStyle = (
  base: React.CSSProperties,
  custom?: React.CSSProperties
): React.CSSProperties => {
  if (!custom) return base;
  return { ...base, ...custom };
};

// Inline styles for simplicity in bundling
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

// Style customization types
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

// Table selector types
type TableSelectorMode = 'dropdown' | 'sidebar' | 'none';

// Filter types
type FilterPosition = 'top' | 'bottom' | 'both';

// Pagination types
type PaginationPosition = 'top' | 'bottom' | 'both';

// DatabaseViewer props
interface DatabaseViewerProps {
  // Core props
  path: string;
  initialTable?: string;

  // Table selection
  tableSelector?: TableSelectorMode;
  tableSelectorLabel?: string;
  tableSelectorComponent?: React.FC<{
    tables: string[];
    selectedTable: string;
    onSelectTable: (table: string) => void;
  }>;

  // Authentication
  getAuthHeaders?: () => Promise<Record<string, string>>;
  headers?: Record<string, string>;

  // Filter customization
  showFilter?: boolean;
  filterPlaceholder?: string;
  filterPosition?: FilterPosition;
  filterDebounceMs?: number;
  filterComponent?: React.FC<{ value: string; onChange: (value: string) => void }>;

  // Pagination customization
  showPagination?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
  showPageSizeSelector?: boolean;
  paginationPosition?: PaginationPosition;
  paginationComponent?: React.FC<{
    pageIndex: number;
    pageCount: number;
    pageSize: number;
    canPreviousPage: boolean;
    canNextPage: boolean;
    previousPage: () => void;
    nextPage: () => void;
    firstPage: () => void;
    lastPage: () => void;
    setPageSize: (size: number) => void;
  }>;

  // Sorting customization
  enableSorting?: boolean;
  sortableColumns?: string[];
  defaultSort?: { column: string; direction: 'asc' | 'desc' };
  multiSort?: boolean;
  sortIcon?: React.FC<{ direction: 'asc' | 'desc' | null }>;

  // UI customization
  className?: string;
  classNames?: ClassNames;
  style?: React.CSSProperties;
  styles?: Styles;

  // Custom components
  loadingComponent?: React.FC;
  errorComponent?: React.FC<{ error: Error; retry: () => void }>;
  emptyComponent?: React.FC;
  onError?: (error: Error) => void;

  // Query options
  queryOptions?: {
    staleTime?: number;
    cacheTime?: number;
    retry?: number | boolean;
    retryDelay?: number;
    refetchOnWindowFocus?: boolean;
    refetchOnReconnect?: boolean;
    refetchOnMount?: boolean;
  };
  refetchInterval?: number;

  // Logging options
  logger?: Logger;
  enableLogging?: boolean;
  logLevel?: LogLevel;
  logFetchErrors?: boolean;
  logQueryErrors?: boolean;
  logPerformanceMetrics?: boolean;
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
  path,
  initialTable = 'users',
  tableSelector = 'none',
  tableSelectorLabel = 'Select Table',
  tableSelectorComponent,
  getAuthHeaders,
  headers,
  showFilter = true,
  filterPlaceholder = 'Filter records...',
  filterPosition = 'top',
  filterDebounceMs = 300,
  filterComponent,
  showPagination = true,
  pageSize = 10,
  pageSizeOptions = [10, 20, 30, 50, 100],
  showPageSizeSelector = true,
  paginationPosition = 'bottom',
  paginationComponent,
  enableSorting = true,
  sortableColumns,
  defaultSort,
  multiSort = false,
  sortIcon,
  className,
  classNames = {},
  style,
  styles = {},
  loadingComponent,
  errorComponent,
  emptyComponent,
  onError,
  queryOptions = {},
  refetchInterval,
  logger: propLogger,
  enableLogging = process.env.NODE_ENV === 'development',
  logLevel,
  logFetchErrors = true,
  logQueryErrors = true,
  logPerformanceMetrics = true,
}) => {
  const componentId = generateId();
  const logger = propLogger || createLogger({ level: logLevel || 'silent' });

  useEffect(() => {
    if (enableLogging && logger) {
      logger.info('DatabaseViewer mounted', { componentId, path, initialTable });
    }
    return () => {
      if (enableLogging && logger) {
        logger.info('DatabaseViewer unmounted', { componentId });
      }
    };
  }, [componentId, path, initialTable, enableLogging, logger]);

  const [selectedTable, setSelectedTable] = useState(initialTable);
  const [sorting, setSorting] = useState<SortingState>(
    defaultSort ? [{ id: defaultSort.column, desc: defaultSort.direction === 'desc' }] : []
  );
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  });
  const [filter, setFilter] = useState('');
  const [debouncedFilter, setDebouncedFilter] = useState('');

  // Debounce filter
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilter(filter);
    }, filterDebounceMs);
    return () => clearTimeout(handler);
  }, [filter, filterDebounceMs]);

  // Build query parameters
  const queryParams = new URLSearchParams({
    table: selectedTable,
    page: String(pagination.pageIndex + 1),
    limit: String(pagination.pageSize),
    ...(sorting.length > 0 && {
      sort: sorting.map((s) => `${s.id}:${s.desc ? 'desc' : 'asc'}`).join(','),
    }),
    ...(debouncedFilter && { filter: debouncedFilter }),
  });

  const url = `${path}/query?${queryParams.toString()}`;

  // Fetch data with TanStack Query
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['databaseData', url],
    queryFn: async () => {
      const fetchId = generateId();
      const startTime = Date.now();

      if (enableLogging && logger) {
        logger.debug('Fetching data started', {
          componentId,
          fetchId,
          url,
          table: selectedTable,
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
        });
      }

      const requestHeaders: HeadersInit = {
        'Content-Type': 'application/json',
        ...headers,
      };

      // Add custom auth headers
      if (getAuthHeaders) {
        const authHeaders = await getAuthHeaders();
        Object.assign(requestHeaders, authHeaders);
      }

      try {
        const response = await fetch(url, {
          headers: requestHeaders,
          credentials: 'include',
        });

        if (!response.ok) {
          const errorDetails = {
            status: response.status,
            statusText: response.statusText,
            url: response.url,
            headers: Object.fromEntries(response.headers.entries()),
          };

          if (logFetchErrors && enableLogging && logger) {
            logger.error('HTTP request failed', {
              componentId,
              fetchId,
              ...errorDetails,
            });
          }

          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType?.includes('application/json')) {
          const text = await response.text();
          if (logFetchErrors && enableLogging && logger) {
            logger.error('Unexpected content type', {
              componentId,
              fetchId,
              url,
              expected: 'application/json',
              received: contentType,
              responseStart: text.substring(0, 100),
            });
          }
          throw new Error(`Expected JSON, received ${contentType}`);
        }

        const data = await response.json();
        const duration = Date.now() - startTime;

        if (enableLogging && logger) {
          logger.debug('Fetch completed successfully', {
            componentId,
            fetchId,
            recordCount: data.data?.length || 0,
            duration,
          });

          if (logPerformanceMetrics && duration > 2000) {
            logger.warn('Slow network response', {
              componentId,
              fetchId,
              url,
              duration,
              threshold: 2000,
              recordCount: data.data?.length || 0,
            });
          }
        }

        return data as Promise<QueryResult>;
      } catch (fetchError) {
        const duration = Date.now() - startTime;
        if (logFetchErrors && enableLogging && logger) {
          logger.error('Data fetch failed', {
            componentId,
            fetchId,
            error: fetchError instanceof Error ? fetchError.message : String(fetchError),
            stack: fetchError instanceof Error ? fetchError.stack : undefined,
            url,
            table: selectedTable,
            duration,
          });
        }
        throw fetchError;
      }
    },
    ...queryOptions,
    refetchInterval,
  });

  // Fetch tables list
  const { data: tablesData } = useQuery({
    queryKey: ['tables', path],
    queryFn: async () => {
      const fetchId = generateId();
      const startTime = Date.now();

      if (enableLogging && logger) {
        logger.debug('Fetching tables list started', {
          componentId,
          fetchId,
          url: `${path}/tables`,
        });
      }

      const requestHeaders: HeadersInit = {
        'Content-Type': 'application/json',
        ...headers,
      };

      if (getAuthHeaders) {
        const authHeaders = await getAuthHeaders();
        Object.assign(requestHeaders, authHeaders);
      }

      try {
        const response = await fetch(`${path}/tables`, {
          headers: requestHeaders,
          credentials: 'include',
        });

        if (!response.ok) {
          if (logFetchErrors && enableLogging && logger) {
            logger.error('Tables list fetch failed', {
              componentId,
              fetchId,
              status: response.status,
              statusText: response.statusText,
              url: `${path}/tables`,
            });
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const duration = Date.now() - startTime;

        if (enableLogging && logger) {
          logger.debug('Tables list fetch completed', {
            componentId,
            fetchId,
            tableCount: data.length || 0,
            duration,
          });
        }

        return data as Promise<string[]>;
      } catch (fetchError) {
        const duration = Date.now() - startTime;
        if (logFetchErrors && enableLogging && logger) {
          logger.error('Tables list fetch failed', {
            componentId,
            fetchId,
            error: fetchError instanceof Error ? fetchError.message : String(fetchError),
            stack: fetchError instanceof Error ? fetchError.stack : undefined,
            url: `${path}/tables`,
            duration,
          });
        }
        throw fetchError;
      }
    },
    enabled: tableSelector !== 'none',
  });

  // Handle errors
  useEffect(() => {
    if (error) {
      if (logQueryErrors && enableLogging && logger) {
        logger.error('Query error state', {
          componentId,
          error: error.message,
          stack: error.stack,
          url,
          table: selectedTable,
          timestamp: new Date().toISOString(),
        });
      }

      if (onError) {
        onError(error as Error);
      }
    }
  }, [error, onError, componentId, url, selectedTable, logQueryErrors, enableLogging, logger]);

  // Define columns dynamically based on the data
  const columns = React.useMemo<ColumnDef<Record<string, unknown>>[]>(() => {
    const queryResult = data as QueryResult | undefined;
    if (!queryResult?.columns) return [];
    return queryResult.columns.map((columnName: string) => ({
      accessorKey: columnName,
      header: columnName,
      cell: (info: { getValue: () => unknown }) => String(info.getValue() ?? ''),
      ...(enableSorting &&
        (!sortableColumns || sortableColumns.includes(columnName)) && {
          enableSorting: true,
        }),
    }));
  }, [data, enableSorting, sortableColumns]);

  // Create table instance
  const table = useReactTable({
    data: (data as QueryResult | undefined)?.data || [],
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
    pageCount: (data as QueryResult | undefined)?.pagination?.totalPages ?? 0,
    manualPagination: true,
    enableMultiSort: multiSort,
  });

  if (isLoading) {
    if (loadingComponent) {
      return React.createElement(loadingComponent);
    }
    return (
      <div style={styles.loading} className={classNames.loading}>
        <div style={styles.spinner} />
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        <p>Loading data...</p>
      </div>
    );
  }

  if (error) {
    if (errorComponent) {
      return React.createElement(errorComponent, { error: error as Error, retry: () => refetch() });
    }
    return (
      <div style={styles.error} className={classNames.error}>
        <p>Error loading data: {(error as Error).message}</p>
        <button onClick={() => refetch()} style={styles.retry}>
          Retry
        </button>
      </div>
    );
  }

  // Default sort icon component
  const DefaultSortIcon: React.FC<{ direction: 'asc' | 'desc' | null }> = ({ direction }) => {
    if (direction === 'asc') return <span> ↑</span>;
    if (direction === 'desc') return <span> ↓</span>;
    return null;
  };

  const SortIcon = sortIcon || DefaultSortIcon;

  // Render table selector
  const renderTableSelector = () => {
    if (tableSelector === 'none' || !tablesData) return null;

    if (tableSelectorComponent) {
      return React.createElement(tableSelectorComponent, {
        tables: tablesData as string[],
        selectedTable,
        onSelectTable: setSelectedTable,
      });
    }

    if (tableSelector === 'dropdown') {
      return (
        <div style={styles.filter} className={classNames.tableSelectorDropdown}>
          <label style={{ marginRight: '0.5rem', fontWeight: 500 }}>{tableSelectorLabel}:</label>
          <select
            value={selectedTable}
            onChange={(e) => {
              if (enableLogging && logger) {
                logger.debug('Table selection changed', {
                  componentId,
                  previousTable: selectedTable,
                  newTable: e.target.value,
                });
              }
              setSelectedTable(e.target.value);
              setPagination({ pageIndex: 0, pageSize });
            }}
            style={styles.filterInput}
          >
            {(tablesData as string[]).map((table) => (
              <option key={table} value={table}>
                {table}
              </option>
            ))}
          </select>
        </div>
      );
    }

    if (tableSelector === 'sidebar') {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column' as const,
            gap: '0.5rem',
            padding: '1rem',
            borderRight: '1px solid #ddd',
            minWidth: '200px',
          }}
          className={classNames.tableSelectorSidebar}
        >
          <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>{tableSelectorLabel}</div>
          {(tablesData as string[]).map((table) => (
            <button
              key={table}
              onClick={() => {
                setSelectedTable(table);
                setPagination({ pageIndex: 0, pageSize });
              }}
              style={{
                padding: '0.5rem',
                textAlign: 'left',
                backgroundColor: selectedTable === table ? '#e9ecef' : 'white',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              {table}
            </button>
          ))}
        </div>
      );
    }

    return null;
  };

  // Render filter
  const renderFilter = (position: 'top' | 'bottom') => {
    if (!showFilter || (filterPosition !== 'both' && filterPosition !== position)) return null;

    if (filterComponent) {
      return React.createElement(filterComponent, {
        value: filter,
        onChange: setFilter,
      });
    }

    return (
      <div style={styles.filter} className={classNames.filter}>
        <input
          type="text"
          placeholder={filterPlaceholder}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={styles.filterInput}
          className={classNames.filterInput}
        />
      </div>
    );
  };

  // Render pagination
  const renderPagination = (position: 'top' | 'bottom') => {
    if (!showPagination || (paginationPosition !== 'both' && paginationPosition !== position))
      return null;

    if (paginationComponent) {
      return React.createElement(paginationComponent, {
        pageIndex: table.getState().pagination.pageIndex,
        pageCount: table.getPageCount(),
        pageSize: table.getState().pagination.pageSize,
        canPreviousPage: table.getCanPreviousPage(),
        canNextPage: table.getCanNextPage(),
        previousPage: () => table.previousPage(),
        nextPage: () => table.nextPage(),
        firstPage: () => table.setPageIndex(0),
        lastPage: () => table.setPageIndex(table.getPageCount() - 1),
        setPageSize: (size: number) => table.setPageSize(size),
      });
    }

    return (
      <div style={styles.pagination} className={classNames.pagination}>
        <button
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
          style={styles.paginationButton}
          className={classNames.paginationButton}
        >
          {'<<'}
        </button>
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          style={styles.paginationButton}
          className={classNames.paginationButton}
        >
          {'<'}
        </button>
        <span style={styles.paginationInfo} className={classNames.paginationInfo}>
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </span>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          style={styles.paginationButton}
          className={classNames.paginationButton}
        >
          {'>'}
        </button>
        <button
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
          style={styles.paginationButton}
          className={classNames.paginationButton}
        >
          {'>>'}
        </button>
        {showPageSizeSelector && (
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
            style={styles.pageSize}
            className={classNames.pageSize}
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                Show {size}
              </option>
            ))}
          </select>
        )}
      </div>
    );
  };

  // Main container style
  const containerStyle = mergeStyle(
    styles.container || {},
    tableSelector === 'sidebar' ? { display: 'flex', flexDirection: 'row' as const } : {}
  );
  const finalContainerStyle = style ? { ...containerStyle, ...style } : containerStyle;

  return (
    <div style={finalContainerStyle} className={mergeClassName('', className || '')}>
      {/* Table Selector Sidebar */}
      {tableSelector === 'sidebar' && renderTableSelector()}

      {/* Main Content */}
      <div style={{ flex: 1 }}>
        {/* Table Selector Dropdown */}
        {tableSelector === 'dropdown' && renderTableSelector()}

        {/* Top Filter */}
        {renderFilter('top')}

        {/* Top Pagination */}
        {renderPagination('top')}

        {/* Table */}
        <div style={styles.tableWrapper} className={classNames.tableWrapper}>
          <table style={styles.table} className={classNames.table}>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      style={mergeStyle(
                        header.column.getIsSorted() ? styles.sorted || {} : styles.sortable || {},
                        styles.header || {}
                      )}
                      className={classNames.header}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                      <SortIcon direction={header.column.getIsSorted() as 'asc' | 'desc' | null} />
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} style={styles.empty} className={classNames.empty}>
                    {emptyComponent ? React.createElement(emptyComponent) : 'No data available'}
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
                      <td key={cell.id} style={styles.td} className={classNames.cell}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Bottom Pagination */}
        {renderPagination('bottom')}

        {/* Bottom Filter */}
        {renderFilter('bottom')}

        {/* Info */}
        {data && (data as QueryResult).pagination && (
          <div style={styles.info} className={classNames.info}>
            Total records: {(data as QueryResult).pagination.total}
          </div>
        )}
      </div>
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
