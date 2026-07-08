import React, { useEffect, useMemo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import type {
  DatabaseViewerProps,
  QueryResult,
  ClassNames,
  Styles,
} from './components/DatabaseViewer/DatabaseViewer.types';
import { mergeClassName, mergeStyle } from './components/DatabaseViewer/utils/styleHelpers';
import { defaultStyles } from './components/DatabaseViewer/styles/defaultStyles';
import { useLogger } from './components/DatabaseViewer/hooks/useLogger';
import { useTableState } from './components/DatabaseViewer/hooks/useTableState';
import { useQueryParams } from './components/DatabaseViewer/hooks/useQueryParams';
import { useDatabaseData } from './components/DatabaseViewer/hooks/useDatabaseData';
import { sanitizeColumnData } from './components/DatabaseViewer/utils/validationHelpers';
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

/**
 * Memoized component for rendering the table selector
 */
const TableSelectorRenderer = React.memo<{
  mode: DatabaseViewerProps['tableSelector'];
  tables: string[] | undefined;
  selectedTable: string | undefined;
  label: string;
  onSelectTable: (table: string) => void;
  customComponent?: React.FC<{
    tables: string[];
    selectedTable: string | undefined;
    onSelectTable: (table: string) => void;
  }>;
  onTableChange: (table: string) => void;
  pageSize: number;
  classNames: ClassNames;
  styles: Styles;
  logger?: ReturnType<typeof useLogger>['logger'];
  componentId: string;
}>(
  ({
    mode,
    tables,
    selectedTable,
    label,
    onSelectTable,
    customComponent,
    onTableChange,
    pageSize: _pageSize,
    classNames,
    styles,
    logger,
    componentId,
  }) => {
    return (
      <TableSelector
        mode={mode || 'dropdown'}
        tables={tables as string[]}
        selectedTable={selectedTable}
        label={label}
        onSelectTable={(table) => {
          onSelectTable(table);
          onTableChange(table);
        }}
        customComponent={customComponent}
        classNames={classNames}
        styles={styles}
        logger={logger || undefined}
        componentId={componentId}
      />
    );
  }
);
TableSelectorRenderer.displayName = 'TableSelectorRenderer';

/**
 * Memoized component for rendering the filter input
 */
const FilterRenderer = React.memo<{
  showFilter: boolean;
  filterPosition: DatabaseViewerProps['filterPosition'];
  position: 'top' | 'bottom';
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  customComponent?: React.FC<{
    value: string;
    onChange: (value: string) => void;
  }>;
  classNames: ClassNames;
  styles: Styles;
}>(
  ({
    showFilter,
    filterPosition,
    position,
    value,
    onChange,
    placeholder,
    customComponent,
    classNames,
    styles,
  }) => {
    if (!showFilter || (filterPosition !== 'both' && filterPosition !== position)) return null;

    return (
      <FilterInput
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        customComponent={customComponent}
        classNames={classNames}
        styles={styles}
      />
    );
  }
);
FilterRenderer.displayName = 'FilterRenderer';

/**
 * Memoized component for rendering pagination
 */
const PaginationRenderer = React.memo<{
  showPagination: boolean;
  paginationPosition: DatabaseViewerProps['paginationPosition'];
  position: 'top' | 'bottom';
  pageIndex: number;
  pageCount: number;
  pageSize: number;
  canPreviousPage: boolean;
  canNextPage: boolean;
  pageSizeOptions: number[];
  showPageSizeSelector: boolean;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  customComponent?: React.FC<{
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
  classNames: ClassNames;
  styles: Styles;
}>(
  ({
    showPagination,
    paginationPosition,
    position,
    pageIndex,
    pageCount,
    pageSize,
    canPreviousPage,
    canNextPage,
    pageSizeOptions,
    showPageSizeSelector,
    onPageChange,
    onPageSizeChange,
    customComponent,
    classNames,
    styles,
  }) => {
    if (!showPagination || (paginationPosition !== 'both' && paginationPosition !== position))
      return null;

    return (
      <Pagination
        pageIndex={pageIndex}
        pageCount={pageCount}
        pageSize={pageSize}
        canPreviousPage={canPreviousPage}
        canNextPage={canNextPage}
        pageSizeOptions={pageSizeOptions}
        showPageSizeSelector={showPageSizeSelector}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        customComponent={customComponent}
        classNames={classNames}
        styles={styles}
      />
    );
  }
);
PaginationRenderer.displayName = 'PaginationRenderer';

/**
 * Main DatabaseViewer component - displays database tables with filtering, sorting, and pagination
 *
 * @component
 * @example
 * ```tsx
 * <DatabaseViewer path="/api/database" initialTable="users" />
 * ```
 */
export const DatabaseViewer: React.FC<DatabaseViewerProps> = React.memo(
  ({
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
        cell: (info: { getValue: () => unknown }) => sanitizeColumnData(info.getValue()),
        ...(enableSorting &&
          (!sortableColumns || sortableColumns.includes(columnName)) && {
            enableSorting: true,
          }),
      }));
    }, [data, enableSorting, sortableColumns]);

    // Memoize pagination calculations
    const paginationData = useMemo(() => {
      const queryResult = data as QueryResult | undefined;
      const totalPages = queryResult?.pagination?.totalPages ?? 0;
      return {
        totalPages,
        canPreviousPage: tableState.pagination.pageIndex > 0,
        canNextPage: tableState.pagination.pageIndex < totalPages - 1,
      };
    }, [data, tableState.pagination.pageIndex]);

    // Memoize container style
    const containerStyle = useMemo(() => {
      return mergeStyle(
        defaultStyles.container || {},
        tableSelector === 'sidebar'
          ? { display: 'flex', flexDirection: 'row' as const }
          : undefined,
        style,
        styles.container
      );
    }, [tableSelector, style, styles.container]);

    // Handle table change with pagination reset
    const handleTableChange = (_table: string) => {
      tableState.setPagination({ pageIndex: 0, pageSize });
    };

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

    const queryResult = data as QueryResult | undefined;

    return (
      <div style={containerStyle} className={mergeClassName('', className || '')}>
        {/* Table Selector Sidebar */}
        {tableSelector === 'sidebar' && (
          <TableSelectorRenderer
            mode={tableSelector}
            tables={tables}
            selectedTable={tableState.selectedTable}
            label={tableSelectorLabel}
            onSelectTable={tableState.setSelectedTable}
            customComponent={tableSelectorComponent}
            onTableChange={handleTableChange}
            pageSize={pageSize}
            classNames={classNames}
            styles={styles}
            logger={logger || undefined}
            componentId={componentId}
          />
        )}

        {/* Main Content */}
        <div style={{ flex: 1 }}>
          {/* Table Selector Dropdown */}
          {tableSelector === 'dropdown' && (
            <TableSelectorRenderer
              mode={tableSelector}
              tables={tables}
              selectedTable={tableState.selectedTable}
              label={tableSelectorLabel}
              onSelectTable={tableState.setSelectedTable}
              customComponent={tableSelectorComponent}
              onTableChange={handleTableChange}
              pageSize={pageSize}
              classNames={classNames}
              styles={styles}
              logger={logger || undefined}
              componentId={componentId}
            />
          )}

          {/* Top Filter */}
          <FilterRenderer
            showFilter={showFilter}
            filterPosition={filterPosition}
            position="top"
            value={tableState.filter}
            onChange={tableState.setFilter}
            placeholder={filterPlaceholder}
            customComponent={filterComponent}
            classNames={classNames}
            styles={styles}
          />

          {/* Top Pagination */}
          <PaginationRenderer
            showPagination={showPagination}
            paginationPosition={paginationPosition}
            position="top"
            pageIndex={tableState.pagination.pageIndex}
            pageCount={paginationData.totalPages}
            pageSize={tableState.pagination.pageSize}
            canPreviousPage={paginationData.canPreviousPage}
            canNextPage={paginationData.canNextPage}
            pageSizeOptions={pageSizeOptions}
            showPageSizeSelector={showPageSizeSelector}
            onPageChange={(pageIndex) =>
              tableState.setPagination({ ...tableState.pagination, pageIndex })
            }
            onPageSizeChange={(newPageSize) =>
              tableState.setPagination({ ...tableState.pagination, pageSize: newPageSize })
            }
            customComponent={paginationComponent}
            classNames={classNames}
            styles={styles}
          />

          {/* Table */}
          <DataTable
            data={queryResult?.data || []}
            columns={columns}
            sorting={tableState.sorting}
            onSortingChange={tableState.setSorting}
            pagination={tableState.pagination}
            onPaginationChange={tableState.setPagination}
            pageCount={paginationData.totalPages}
            enableSorting={enableSorting}
            multiSort={multiSort}
            sortIcon={sortIcon}
            classNames={classNames}
            styles={styles}
            emptyComponent={emptyComponent}
          />

          {/* Bottom Pagination */}
          <PaginationRenderer
            showPagination={showPagination}
            paginationPosition={paginationPosition}
            position="bottom"
            pageIndex={tableState.pagination.pageIndex}
            pageCount={paginationData.totalPages}
            pageSize={tableState.pagination.pageSize}
            canPreviousPage={paginationData.canPreviousPage}
            canNextPage={paginationData.canNextPage}
            pageSizeOptions={pageSizeOptions}
            showPageSizeSelector={showPageSizeSelector}
            onPageChange={(pageIndex) =>
              tableState.setPagination({ ...tableState.pagination, pageIndex })
            }
            onPageSizeChange={(newPageSize) =>
              tableState.setPagination({ ...tableState.pagination, pageSize: newPageSize })
            }
            customComponent={paginationComponent}
            classNames={classNames}
            styles={styles}
          />

          {/* Bottom Filter */}
          <FilterRenderer
            showFilter={showFilter}
            filterPosition={filterPosition}
            position="bottom"
            value={tableState.filter}
            onChange={tableState.setFilter}
            placeholder={filterPlaceholder}
            customComponent={filterComponent}
            classNames={classNames}
            styles={styles}
          />

          {/* Info */}
          {queryResult?.pagination && (
            <div style={mergeStyle(defaultStyles.info, styles.info)} className={classNames.info}>
              Total records: {queryResult.pagination.total}
            </div>
          )}
        </div>
      </div>
    );
  }
);
DatabaseViewer.displayName = 'DatabaseViewer';

// Export a provider-wrapped version for easier usage
export const DatabaseViewerWithProvider: React.FC<
  DatabaseViewerProps & { queryClient?: QueryClient }
> = React.memo(({ queryClient = defaultQueryClient, ...props }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <DatabaseViewer {...props} />
    </QueryClientProvider>
  );
});
DatabaseViewerWithProvider.displayName = 'DatabaseViewerWithProvider';
