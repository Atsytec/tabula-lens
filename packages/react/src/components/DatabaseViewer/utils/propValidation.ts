import type {
  DatabaseViewerProps,
  TableSelectorMode,
  FilterPosition,
  PaginationPosition,
} from '../DatabaseViewer.types';

/**
 * Runtime prop validation for DatabaseViewer component
 * Provides helpful error messages for invalid props
 */
export function validateProps(
  props: DatabaseViewerProps,
  componentName: string = 'DatabaseViewer'
): void {
  const errors: string[] = [];

  // Validate required props
  if (!props.path || typeof props.path !== 'string') {
    errors.push('prop "path" is required and must be a string');
  }

  // Validate tableSelector mode
  if (props.tableSelector !== undefined) {
    const validModes: TableSelectorMode[] = ['dropdown', 'sidebar', 'none'];
    if (!validModes.includes(props.tableSelector)) {
      errors.push(`prop "tableSelector" must be one of: ${validModes.join(', ')}`);
    }
  }

  // Validate filterPosition
  if (props.filterPosition !== undefined) {
    const validPositions: FilterPosition[] = ['top', 'bottom', 'both'];
    if (!validPositions.includes(props.filterPosition)) {
      errors.push(`prop "filterPosition" must be one of: ${validPositions.join(', ')}`);
    }
  }

  // Validate paginationPosition
  if (props.paginationPosition !== undefined) {
    const validPositions: PaginationPosition[] = ['top', 'bottom', 'both'];
    if (!validPositions.includes(props.paginationPosition)) {
      errors.push(`prop "paginationPosition" must be one of: ${validPositions.join(', ')}`);
    }
  }

  // Validate pageSize
  if (props.pageSize !== undefined) {
    if (typeof props.pageSize !== 'number' || props.pageSize < 1) {
      errors.push('prop "pageSize" must be a positive number');
    }
  }

  // Validate pageSizeOptions
  if (props.pageSizeOptions !== undefined) {
    if (!Array.isArray(props.pageSizeOptions)) {
      errors.push('prop "pageSizeOptions" must be an array');
    } else if (props.pageSizeOptions.some((size) => typeof size !== 'number' || size < 1)) {
      errors.push('prop "pageSizeOptions" must contain only positive numbers');
    }
  }

  // Validate filterDebounceMs
  if (props.filterDebounceMs !== undefined) {
    if (typeof props.filterDebounceMs !== 'number' || props.filterDebounceMs < 0) {
      errors.push('prop "filterDebounceMs" must be a non-negative number');
    }
  }

  // Validate refetchInterval
  if (props.refetchInterval !== undefined) {
    if (typeof props.refetchInterval !== 'number' || props.refetchInterval < 0) {
      errors.push('prop "refetchInterval" must be a non-negative number');
    }
  }

  // Validate custom components
  if (
    props.tableSelectorComponent !== undefined &&
    typeof props.tableSelectorComponent !== 'function'
  ) {
    errors.push('prop "tableSelectorComponent" must be a React component');
  }

  if (props.filterComponent !== undefined && typeof props.filterComponent !== 'function') {
    errors.push('prop "filterComponent" must be a React component');
  }

  if (props.paginationComponent !== undefined && typeof props.paginationComponent !== 'function') {
    errors.push('prop "paginationComponent" must be a React component');
  }

  if (props.loadingComponent !== undefined && typeof props.loadingComponent !== 'function') {
    errors.push('prop "loadingComponent" must be a React component');
  }

  if (props.errorComponent !== undefined && typeof props.errorComponent !== 'function') {
    errors.push('prop "errorComponent" must be a React component');
  }

  if (props.emptyComponent !== undefined && typeof props.emptyComponent !== 'function') {
    errors.push('prop "emptyComponent" must be a React component');
  }

  // Validate callbacks
  if (props.getAuthHeaders !== undefined && typeof props.getAuthHeaders !== 'function') {
    errors.push('prop "getAuthHeaders" must be a function');
  }

  if (props.onError !== undefined && typeof props.onError !== 'function') {
    errors.push('prop "onError" must be a function');
  }

  // Validate logger
  if (props.logger !== undefined && typeof props.logger !== 'object') {
    errors.push('prop "logger" must be an object with debug, info, warn, error methods');
  }

  // Validate headers
  if (props.headers !== undefined && typeof props.headers !== 'object') {
    errors.push('prop "headers" must be an object');
  }

  // Validate defaultFilterColumns
  if (props.defaultFilterColumns !== undefined) {
    if (typeof props.defaultFilterColumns !== 'object') {
      errors.push('prop "defaultFilterColumns" must be an object');
    } else {
      Object.entries(props.defaultFilterColumns).forEach(([table, columns]) => {
        if (!Array.isArray(columns)) {
          errors.push(`prop "defaultFilterColumns.${table}" must be an array`);
        } else if (columns.some((col) => typeof col !== 'string')) {
          errors.push(`prop "defaultFilterColumns.${table}" must contain only strings`);
        }
      });
    }
  }

  // Validate sortableColumns
  if (props.sortableColumns !== undefined) {
    if (!Array.isArray(props.sortableColumns)) {
      errors.push('prop "sortableColumns" must be an array');
    } else if (props.sortableColumns.some((col) => typeof col !== 'string')) {
      errors.push('prop "sortableColumns" must contain only strings');
    }
  }

  // Validate defaultSort
  if (props.defaultSort !== undefined) {
    if (typeof props.defaultSort !== 'object') {
      errors.push('prop "defaultSort" must be an object with column and direction');
    } else {
      if (!props.defaultSort.column || typeof props.defaultSort.column !== 'string') {
        errors.push('prop "defaultSort.column" must be a string');
      }
      if (
        !props.defaultSort.direction ||
        (props.defaultSort.direction !== 'asc' && props.defaultSort.direction !== 'desc')
      ) {
        errors.push('prop "defaultSort.direction" must be "asc" or "desc"');
      }
    }
  }

  // Log errors if any
  if (errors.length > 0) {
    console.error(
      `[${componentName}] Invalid props:\n`,
      errors.map((err) => `  - ${err}`).join('\n')
    );
    throw new Error(`Invalid props passed to ${componentName}`);
  }
}
