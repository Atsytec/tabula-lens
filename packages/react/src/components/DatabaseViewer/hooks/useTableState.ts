import { useState, useEffect } from 'react';
import { SortingState, PaginationState } from '@tanstack/react-table';

export interface UseTableStateOptions {
  initialTable?: string;
  pageSize?: number;
  defaultSort?: { column: string; direction: 'asc' | 'desc' };
  filterDebounceMs?: number;
}

export interface UseTableStateResult {
  selectedTable: string | undefined;
  setSelectedTable: (table: string) => void;
  sorting: SortingState;
  setSorting: (sorting: SortingState) => void;
  pagination: PaginationState;
  setPagination: (pagination: PaginationState) => void;
  filter: string;
  setFilter: (filter: string) => void;
  debouncedFilter: string;
}

/**
 * Custom hook for managing table state including sorting, pagination, and filtering
 *
 * @param options - Initial state configuration
 * @returns Table state and state setters
 */
export const useTableState = (options: UseTableStateOptions = {}): UseTableStateResult => {
  const { initialTable, pageSize = 10, defaultSort, filterDebounceMs = 300 } = options;

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

  return {
    selectedTable,
    setSelectedTable,
    sorting,
    setSorting,
    pagination,
    setPagination,
    filter,
    setFilter,
    debouncedFilter,
  };
};
