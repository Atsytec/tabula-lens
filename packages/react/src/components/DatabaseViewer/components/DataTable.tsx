import React from 'react';
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
import { mergeStyle } from '../utils/styleHelpers';
import { defaultStyles } from '../styles/defaultStyles';
import type { ClassNames, Styles } from '../DatabaseViewer.types';
import { EmptyState } from './EmptyState';

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
    enableSorting: _enableSorting,
    multiSort = false,
    sortIcon,
    className,
    classNames = {},
    style,
    styles = {},
    emptyComponent,
  }) => {
    // Default sort icon component
    const DefaultSortIcon: React.FC<{ direction: 'asc' | 'desc' | null }> = ({ direction }) => {
      if (direction === 'asc') return <span> ↑</span>;
      if (direction === 'desc') return <span> ↓</span>;
      return null;
    };

    const SortIcon = sortIcon || DefaultSortIcon;

    // Create table instance
    const table = useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getSortedRowModel: getSortedRowModel(),
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
      enableMultiSort: multiSort,
      enableSorting: _enableSorting,
    });

    return (
      <div
        style={mergeStyle(defaultStyles.tableWrapper, styles.tableWrapper, style)}
        className={className || classNames.tableWrapper}
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
                <td colSpan={columns.length}>
                  <EmptyState
                    customComponent={emptyComponent}
                    className={classNames.empty}
                    classNames={classNames}
                    style={styles.empty}
                    styles={styles}
                  />
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
    );
  }
);
DataTable.displayName = 'DataTable';
