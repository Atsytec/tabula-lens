import { SortingState, PaginationState } from '@tanstack/react-table';

export interface BuildQueryParamsOptions {
  selectedTable: string | undefined;
  pagination: PaginationState;
  sorting: SortingState;
  filter: string;
  filterColumns?: string[];
}

/**
 * Pure function for building query parameters from table state
 *
 * @param options - Table state options
 * @returns Query string for URL
 */
export const buildQueryParams = (options: BuildQueryParamsOptions): string => {
  const { selectedTable, pagination, sorting, filter, filterColumns } = options;

  const queryParams = new URLSearchParams();

  if (selectedTable) {
    queryParams.set('table', selectedTable);
  }

  queryParams.set('page', String(pagination.pageIndex + 1));
  queryParams.set('limit', String(pagination.pageSize));

  if (sorting.length > 0) {
    queryParams.set('sort', sorting.map((s) => `${s.id}:${s.desc ? 'desc' : 'asc'}`).join(','));
  }

  if (filter) {
    queryParams.set('filter', filter);
  }

  if (filterColumns && filterColumns.length > 0) {
    queryParams.set('filterColumns', filterColumns.join(','));
  }

  return queryParams.toString();
};
