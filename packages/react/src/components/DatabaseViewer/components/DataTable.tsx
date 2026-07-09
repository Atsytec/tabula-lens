import React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  PaginationState,
} from '@tanstack/react-table';
import { mergeStyle } from '../utils/styleHelpers';
import { defaultStyles } from '../styles/defaultStyles';
import type { ClassNames, Styles } from '../DatabaseViewer.types';
import { EmptyState } from './EmptyState';

/**
 * Default header formatter that humanizes column names
 * Converts snake_case to Title Case and handles common acronyms
 */
const defaultHeaderFormatter = (columnName: string): string => {
  if (!columnName) return '';

  const words = columnName.split('_');

  return words
    .map((word) => {
      // Handle common acronyms (including 'id' when it's part of a compound word)
      const acronyms = ['api', 'url', 'html', 'css', 'js', 'xml', 'json', 'sql', 'db'];
      if (acronyms.includes(word.toLowerCase())) {
        return word.toUpperCase();
      }
      // Handle 'id' - uppercase when it's part of a compound word, title case when alone
      if (word.toLowerCase() === 'id' && words.length > 1) {
        return 'ID';
      }
      // Capitalize first letter, lowercase the rest for regular words
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
};

export interface DataTableProps {
  data: Record<string, unknown>[];
  columns: ColumnDef<Record<string, unknown>>[];
  sorting: SortingState;
  onSortingChange: (sorting: SortingState) => void;
  pagination: PaginationState;
  onPaginationChange: (pagination: PaginationState) => void;
  pageCount: number;
  enableSorting: boolean;
  multiSort?: boolean;
  sortIcon?: React.FC<{ direction: 'asc' | 'desc' | null }>;
  className?: string;
  classNames?: ClassNames;
  style?: React.CSSProperties;
  styles?: Styles;
  emptyComponent?: React.FC;
  hasActiveFilter?: boolean;
  onClearFilter?: () => void;
  formatHeader?: ((columnName: string) => string) | null;
  formatCell?: (value: unknown, column: string) => React.ReactNode;
}

export const DataTable: React.FC<DataTableProps> = React.memo(
  ({
    data,
    columns,
    sorting,
    onSortingChange,
    pagination,
    onPaginationChange,
    pageCount,
    enableSorting,
    multiSort = false,
    sortIcon,
    className,
    classNames = {},
    style,
    styles = {},
    emptyComponent,
    hasActiveFilter = false,
    onClearFilter,
    formatHeader,
    formatCell,
  }) => {
    // Default sort icon component
    const DefaultSortIcon: React.FC<{ direction: 'asc' | 'desc' | null }> = ({ direction }) => {
      if (direction === 'asc') return <span> ↑</span>;
      if (direction === 'desc') return <span> ↓</span>;
      return null;
    };

    const SortIcon = sortIcon || DefaultSortIcon;

    // Apply header formatting to columns
    const formattedColumns = React.useMemo(() => {
      return columns.map((col) => {
        const headerValue = col.header as string;
        let formattedHeader = headerValue;

        // Apply header formatting if formatHeader is provided or use default
        if (formatHeader === undefined) {
          // Use default formatter
          formattedHeader = defaultHeaderFormatter(headerValue);
        } else if (formatHeader !== null) {
          // Use custom formatter
          formattedHeader = formatHeader(headerValue);
        }
        // If formatHeader is null, use original header value

        return {
          ...col,
          header: formattedHeader,
        };
      });
    }, [columns, formatHeader]);

    // Create table instance
    const table = useReactTable({
      data,
      columns: formattedColumns,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      state: {
        sorting,
        pagination,
      },
      onSortingChange: (updater) => {
        const newSorting = typeof updater === 'function' ? updater(sorting) : updater;
        onSortingChange(newSorting);
      },
      onPaginationChange: (updater) => {
        const newPagination = typeof updater === 'function' ? updater(pagination) : updater;
        onPaginationChange(newPagination);
      },
      pageCount,
      manualPagination: true,
      manualSorting: true,
      enableMultiSort: multiSort,
      enableSorting,
    });

    return (
      <div
        style={mergeStyle(defaultStyles.tableWrapper, styles.tableWrapper, style)}
        // className prop takes precedence over classNames.tableWrapper for backward compatibility
        className={className || classNames.tableWrapper}
      >
        <table
          style={mergeStyle(defaultStyles.table, styles.table)}
          className={classNames.table}
          role="table"
        >
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const sortDirection = header.column.getIsSorted();
                  const ariaSortValue =
                    sortDirection === 'asc'
                      ? 'ascending'
                      : sortDirection === 'desc'
                        ? 'descending'
                        : 'none';

                  return (
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
                      aria-sort={enableSorting ? ariaSortValue : undefined}
                      scope="col"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                      <SortIcon direction={header.column.getIsSorted() as 'asc' | 'desc' | null} />
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>
                  <EmptyState
                    customComponent={emptyComponent}
                    className={classNames.empty}
                    classNames={classNames}
                    style={styles.empty}
                    styles={styles}
                    hasActiveFilter={hasActiveFilter}
                    onClearFilter={onClearFilter}
                  />
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="tlens-table-row">
                  {row.getVisibleCells().map((cell) => {
                    const columnName = cell.column.id;
                    const cellValue = cell.getValue();

                    // Apply cell formatting if formatCell is provided
                    const renderedContent = formatCell
                      ? formatCell(cellValue, columnName)
                      : flexRender(cell.column.columnDef.cell, cell.getContext());

                    return (
                      <td
                        key={cell.id}
                        style={mergeStyle(defaultStyles.td, styles.td, styles.cell)}
                        className={classNames.cell}
                      >
                        {renderedContent}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  }
);
DataTable.displayName = 'DataTable';
