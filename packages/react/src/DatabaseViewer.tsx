import React, { useEffect, useMemo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import type {
  DatabaseViewerProps,
  QueryResult,
} from './components/DatabaseViewer/DatabaseViewer.types';
import { mergeClassName, mergeStyle } from './components/DatabaseViewer/utils/styleHelpers';
import { defaultStyles } from './components/DatabaseViewer/styles/defaultStyles';
import { useLogger } from './components/DatabaseViewer/hooks/useLogger';
import { useTableState } from './components/DatabaseViewer/hooks/useTableState';
import { useQueryParams } from './components/DatabaseViewer/hooks/useQueryParams';
import { useDatabaseData } from './components/DatabaseViewer/hooks/useDatabaseData';
import {
  LoadingState,
  ErrorState,
  TableSelector,
  FilterInput,
  Pagination,
  DataTable,
} from './components/DatabaseViewer/components';

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
  // Initialize logger with lifecycle logging
  const { logger, componentId } = useLogger({
    logger: propLogger,
    enableLogging,
    logLevel,
  });

  // Initialize table state
  const tableState = useTableState({
    initialTable,
    pageSize,
    defaultSort,
    filterDebounceMs,
  });

  // Build query parameters
  const queryParams = useQueryParams({
    selectedTable: tableState.selectedTable,
    pagination: tableState.pagination,
    sorting: tableState.sorting,
    filter: tableState.debouncedFilter,
  });

  // Fetch data and tables
  const { data, tables, isLoading, error, refetch } = useDatabaseData({
    path,
    selectedTable: tableState.selectedTable,
    queryParams,
    getAuthHeaders,
    headers,
    logger,
    componentId,
    logFetchErrors,
    logPerformanceMetrics,
    queryOptions,
    refetchInterval,
    tableSelectorMode: tableSelector,
  });

  // Handle errors
  useEffect(() => {
    if (error) {
      if (logQueryErrors && logger) {
        logger.error('Query error state', {
          componentId,
          error: error.message,
          stack: error.stack,
          table: tableState.selectedTable || 'none',
          timestamp: new Date().toISOString(),
        });
      }

      if (onError) {
        onError(error);
      }
    }
  }, [error, onError, componentId, tableState.selectedTable, logQueryErrors, logger]);

  // Define columns dynamically based on the data
  const columns = useMemo<ColumnDef<Record<string, unknown>>[]>(() => {
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

  if (isLoading) {
    return (
      <LoadingState
        customComponent={loadingComponent}
        className={classNames.loading}
        classNames={classNames}
        style={styles.loading}
        styles={styles}
      />
    );
  }

  if (error) {
    return (
      <ErrorState
        error={error as Error}
        onRetry={() => refetch()}
        customComponent={errorComponent}
        className={classNames.error}
        classNames={classNames}
        style={styles.error}
        styles={styles}
      />
    );
  }

  // Render table selector
  const renderTableSelector = () => {
    return (
      <TableSelector
        mode={tableSelector}
        tables={tables as string[]}
        selectedTable={tableState.selectedTable}
        label={tableSelectorLabel}
        onSelectTable={(table) => {
          tableState.setSelectedTable(table);
          tableState.setPagination({ pageIndex: 0, pageSize });
        }}
        customComponent={tableSelectorComponent}
        classNames={classNames}
        styles={styles}
        logger={logger || undefined}
        componentId={componentId}
      />
    );
  };

  // Render filter
  const renderFilter = (position: 'top' | 'bottom') => {
    if (!showFilter || (filterPosition !== 'both' && filterPosition !== position)) return null;

    return (
      <FilterInput
        value={tableState.filter}
        onChange={tableState.setFilter}
        placeholder={filterPlaceholder}
        customComponent={filterComponent}
        classNames={classNames}
        styles={styles}
      />
    );
  };

  // Render pagination
  const renderPagination = (position: 'top' | 'bottom') => {
    if (!showPagination || (paginationPosition !== 'both' && paginationPosition !== position))
      return null;

    return (
      <Pagination
        pageIndex={tableState.pagination.pageIndex}
        pageCount={(data as QueryResult | undefined)?.pagination?.totalPages ?? 0}
        pageSize={tableState.pagination.pageSize}
        canPreviousPage={tableState.pagination.pageIndex > 0}
        canNextPage={
          tableState.pagination.pageIndex <
          ((data as QueryResult | undefined)?.pagination?.totalPages ?? 0) - 1
        }
        pageSizeOptions={pageSizeOptions}
        showPageSizeSelector={showPageSizeSelector}
        onPageChange={(pageIndex) =>
          tableState.setPagination({ ...tableState.pagination, pageIndex })
        }
        onPageSizeChange={(pageSize) =>
          tableState.setPagination({ ...tableState.pagination, pageSize })
        }
        customComponent={paginationComponent}
        classNames={classNames}
        styles={styles}
      />
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
        <DataTable
          data={(data as QueryResult | undefined)?.data || []}
          columns={columns}
          sorting={tableState.sorting}
          onSortingChange={tableState.setSorting}
          pagination={tableState.pagination}
          onPaginationChange={tableState.setPagination}
          pageCount={(data as QueryResult | undefined)?.pagination?.totalPages ?? 0}
          enableSorting={enableSorting}
          multiSort={multiSort}
          sortIcon={sortIcon}
          classNames={classNames}
          styles={styles}
          emptyComponent={emptyComponent}
        />

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
