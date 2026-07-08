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
import { createLogger, generateId } from './logger';
import type {
  DatabaseViewerProps,
  QueryResult,
} from './components/DatabaseViewer/DatabaseViewer.types';
import { mergeClassName, mergeStyle } from './components/DatabaseViewer/utils/styleHelpers';
import { defaultStyles } from './components/DatabaseViewer/styles/defaultStyles';

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
  initialTable,
  tableSelector = 'dropdown',
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

  const [selectedTable, setSelectedTable] = useState<string | undefined>(initialTable);
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
  const queryParams = new URLSearchParams();
  if (selectedTable) {
    queryParams.set('table', selectedTable);
  }
  queryParams.set('page', String(pagination.pageIndex + 1));
  queryParams.set('limit', String(pagination.pageSize));
  if (sorting.length > 0) {
    queryParams.set('sort', sorting.map((s) => `${s.id}:${s.desc ? 'desc' : 'asc'}`).join(','));
  }
  if (debouncedFilter) {
    queryParams.set('filter', debouncedFilter);
  }

  const url = `${path}/query?${queryParams.toString()}`;

  // Fetch data with TanStack Query
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['databaseData', url],
    enabled: !!selectedTable,
    queryFn: async () => {
      const fetchId = generateId();
      const startTime = Date.now();

      if (enableLogging && logger) {
        logger.debug('Fetching data started', {
          componentId,
          fetchId,
          url,
          table: selectedTable || 'none',
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
            table: selectedTable || 'none',
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
          table: selectedTable || 'none',
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
      <div style={mergeStyle(defaultStyles.loading, styles.loading)} className={classNames.loading}>
        <div style={mergeStyle(defaultStyles.spinner, styles.spinner)} />
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
      <div style={mergeStyle(defaultStyles.error, styles.error)} className={classNames.error}>
        <p>Error loading data: {(error as Error).message}</p>
        <button onClick={() => refetch()} style={mergeStyle(defaultStyles.retry, styles.retry)}>
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
        <div
          style={mergeStyle(defaultStyles.filter, styles.filter)}
          className={classNames.tableSelectorDropdown}
        >
          <label style={{ marginRight: '0.5rem', fontWeight: 500 }}>{tableSelectorLabel}:</label>
          <select
            value={selectedTable || ''}
            onChange={(e) => {
              if (enableLogging && logger) {
                logger.debug('Table selection changed', {
                  componentId,
                  previousTable: selectedTable || 'none',
                  newTable: e.target.value,
                });
              }
              setSelectedTable(e.target.value);
              setPagination({ pageIndex: 0, pageSize });
            }}
            style={mergeStyle(defaultStyles.filterInput, styles.filterInput)}
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
      <div style={mergeStyle(defaultStyles.filter, styles.filter)} className={classNames.filter}>
        <input
          type="text"
          placeholder={filterPlaceholder}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={mergeStyle(defaultStyles.filterInput, styles.filterInput)}
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
      <div
        style={mergeStyle(defaultStyles.pagination, styles.pagination)}
        className={classNames.pagination}
      >
        <button
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
          style={mergeStyle(defaultStyles.paginationButton, styles.paginationButton)}
          className={classNames.paginationButton}
        >
          {'<<'}
        </button>
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          style={mergeStyle(defaultStyles.paginationButton, styles.paginationButton)}
          className={classNames.paginationButton}
        >
          {'<'}
        </button>
        <span
          style={mergeStyle(defaultStyles.paginationInfo, styles.paginationInfo)}
          className={classNames.paginationInfo}
        >
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </span>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          style={mergeStyle(defaultStyles.paginationButton, styles.paginationButton)}
          className={classNames.paginationButton}
        >
          {'>'}
        </button>
        <button
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
          style={mergeStyle(defaultStyles.paginationButton, styles.paginationButton)}
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
            style={mergeStyle(defaultStyles.pageSize, styles.pageSize)}
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
    defaultStyles.container || {},
    tableSelector === 'sidebar' ? { display: 'flex', flexDirection: 'row' as const } : undefined,
    style,
    styles.container
  );

  return (
    <div style={containerStyle} className={mergeClassName('', className || '')}>
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
        <div
          style={mergeStyle(defaultStyles.tableWrapper, styles.tableWrapper)}
          className={classNames.tableWrapper}
        >
          <table style={mergeStyle(defaultStyles.table, styles.table)} className={classNames.table}>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      style={mergeStyle(
                        header.column.getIsSorted() ? defaultStyles.sorted : defaultStyles.sortable,
                        defaultStyles.header,
                        styles.header,
                        header.column.getIsSorted() ? styles.sorted : styles.sortable
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
                  <td
                    colSpan={columns.length}
                    style={mergeStyle(defaultStyles.empty, styles.empty)}
                    className={classNames.empty}
                  >
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
                      <td
                        key={cell.id}
                        style={mergeStyle(defaultStyles.td, styles.td, styles.cell)}
                        className={classNames.cell}
                      >
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
          <div style={mergeStyle(defaultStyles.info, styles.info)} className={classNames.info}>
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
