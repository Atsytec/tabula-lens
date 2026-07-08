import React from 'react';
import { Logger, LogLevel } from '../../logger';

/**
 * ============================================================================
 * DATA TYPES
 * ============================================================================
 */

/**
 * Query result from the backend API
 * @interface QueryResult
 */
export interface QueryResult {
  /** Array of data records */
  data: Record<string, unknown>[];
  /** Column names for the data */
  columns: string[];
  /** Pagination information */
  pagination: {
    /** Current page number */
    page: number;
    /** Number of records per page */
    limit: number;
    /** Total number of records */
    total: number;
    /** Total number of pages */
    totalPages: number;
  };
}

/**
 * ============================================================================
 * UI CUSTOMIZATION TYPES
 * ============================================================================
 */

/**
 * CSS class names for customizing component appearance
 * @interface ClassNames
 */
export interface ClassNames {
  /** Container wrapper class name */
  container?: string;
  /** Table wrapper class name */
  tableWrapper?: string;
  /** Table element class name */
  table?: string;
  /** Table header cell class name */
  header?: string;
  /** Table data cell class name */
  cell?: string;
  /** Filter container class name */
  filter?: string;
  /** Filter input class name */
  filterInput?: string;
  /** Pagination container class name */
  pagination?: string;
  /** Pagination button class name */
  paginationButton?: string;
  /** Pagination info text class name */
  paginationInfo?: string;
  /** Page size selector class name */
  pageSize?: string;
  /** Table selector container class name */
  tableSelector?: string;
  /** Table selector dropdown class name */
  tableSelectorDropdown?: string;
  /** Table selector sidebar class name */
  tableSelectorSidebar?: string;
  /** Empty state class name */
  empty?: string;
  /** Loading state class name */
  loading?: string;
  /** Error state class name */
  error?: string;
  /** Retry button class name */
  retry?: string;
  /** Info text class name */
  info?: string;
}

/**
 * CSS style properties for customizing component appearance
 * @interface Styles
 */
export interface Styles {
  /** Container wrapper styles */
  container?: React.CSSProperties;
  /** Table wrapper styles */
  tableWrapper?: React.CSSProperties;
  /** Table element styles */
  table?: React.CSSProperties;
  /** Table header cell styles */
  th?: React.CSSProperties;
  /** Table data cell styles */
  td?: React.CSSProperties;
  /** Table header styles (alias for th) */
  header?: React.CSSProperties;
  /** Table cell styles (alias for td) */
  cell?: React.CSSProperties;
  /** Sortable column header styles */
  sortable?: React.CSSProperties;
  /** Sorted column header styles */
  sorted?: React.CSSProperties;
  /** Filter container styles */
  filter?: React.CSSProperties;
  /** Filter input styles */
  filterInput?: React.CSSProperties;
  /** Pagination container styles */
  pagination?: React.CSSProperties;
  /** Pagination button styles */
  paginationButton?: React.CSSProperties;
  /** Pagination info text styles */
  paginationInfo?: React.CSSProperties;
  /** Page size selector styles */
  pageSize?: React.CSSProperties;
  /** Table selector container styles */
  tableSelector?: React.CSSProperties;
  /** Table selector dropdown styles */
  tableSelectorDropdown?: React.CSSProperties;
  /** Table selector sidebar styles */
  tableSelectorSidebar?: React.CSSProperties;
  /** Empty state styles */
  empty?: React.CSSProperties;
  /** Loading state styles */
  loading?: React.CSSProperties;
  /** Loading spinner styles */
  spinner?: React.CSSProperties;
  /** Error state styles */
  error?: React.CSSProperties;
  /** Retry button styles */
  retry?: React.CSSProperties;
  /** Info text styles */
  info?: React.CSSProperties;
}

/**
 * ============================================================================
 * CONFIGURATION TYPES
 * ============================================================================
 */

/**
 * Table selector display mode
 * @type {TableSelectorMode}
 */
export type TableSelectorMode = 'dropdown' | 'sidebar' | 'none';

/**
 * Filter input position
 * @type {FilterPosition}
 */
export type FilterPosition = 'top' | 'bottom' | 'both';

/**
 * Pagination controls position
 * @type {PaginationPosition}
 */
export type PaginationPosition = 'top' | 'bottom' | 'both';

/**
 * ============================================================================
 * COMPONENT PROPS
 * ============================================================================
 */

/**
 * Props for the DatabaseViewer component
 * @interface DatabaseViewerProps
 */
export interface DatabaseViewerProps {
  /**
   * API endpoint path for fetching data
   */
  path: string;

  /**
   * Initial table to select (optional)
   */
  initialTable?: string;

  /**
   * Table selector display mode
   * @default 'dropdown'
   */
  tableSelector?: TableSelectorMode;

  /**
   * Label for the table selector
   * @default 'Select Table'
   */
  tableSelectorLabel?: string;

  /**
   * Custom table selector component
   */
  tableSelectorComponent?: React.FC<{
    tables: string[];
    selectedTable: string | undefined;
    onSelectTable: (table: string) => void;
  }>;

  /**
   * Function to get authentication headers
   */
  getAuthHeaders?: () => Promise<Record<string, string>>;

  /**
   * Static headers to include in requests
   */
  headers?: Record<string, string>;

  /**
   * Whether to show the filter input
   * @default true
   */
  showFilter?: boolean;

  /**
   * Placeholder text for the filter input
   * @default 'Filter...'
   */
  filterPlaceholder?: string;

  /**
   * Position of the filter input
   * @default 'top'
   */
  filterPosition?: FilterPosition;

  /**
   * Debounce delay for filter input in milliseconds
   * @default 300
   */
  filterDebounceMs?: number;

  /**
   * Custom filter input component
   */
  filterComponent?: React.FC<{ value: string; onChange: (value: string) => void }>;

  /**
   * Whether to show pagination controls
   * @default true
   */
  showPagination?: boolean;

  /**
   * Number of records per page
   * @default 10
   */
  pageSize?: number;

  /**
   * Available page size options
   * @default [10, 25, 50, 100]
   */
  pageSizeOptions?: number[];

  /**
   * Whether to show the page size selector
   * @default true
   */
  showPageSizeSelector?: boolean;

  /**
   * Position of pagination controls
   * @default 'bottom'
   */
  paginationPosition?: PaginationPosition;

  /**
   * Custom pagination component
   */
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

  /**
   * Whether to enable column sorting
   * @default true
   */
  enableSorting?: boolean;

  /**
   * Array of column names that can be sorted
   * If not provided, all columns are sortable
   */
  sortableColumns?: string[];

  /**
   * Default sort configuration
   */
  defaultSort?: { column: string; direction: 'asc' | 'desc' };

  /**
   * Whether to enable multi-column sorting
   * @default false
   */
  multiSort?: boolean;

  /**
   * Custom sort icon component
   */
  sortIcon?: React.FC<{ direction: 'asc' | 'desc' | null }>;

  /**
   * Additional CSS class name for the container
   */
  className?: string;

  /**
   * Custom CSS class names for specific elements
   */
  classNames?: ClassNames;

  /**
   * Custom inline styles for the container
   */
  style?: React.CSSProperties;

  /**
   * Custom inline styles for specific elements
   */
  styles?: Styles;

  /**
   * Custom loading component
   */
  loadingComponent?: React.FC;

  /**
   * Custom error component
   */
  errorComponent?: React.FC<{ error: Error; retry: () => void }>;

  /**
   * Custom empty state component
   */
  emptyComponent?: React.FC;

  /**
   * Callback function for error handling
   */
  onError?: (error: Error) => void;

  /**
   * Additional options for TanStack Query
   */
  queryOptions?: {
    staleTime?: number;
    cacheTime?: number;
    retry?: number | boolean;
    retryDelay?: number;
    refetchOnWindowFocus?: boolean;
    refetchOnReconnect?: boolean;
    refetchOnMount?: boolean;
  };

  /**
   * Interval in milliseconds for automatic refetching
   */
  refetchInterval?: number;

  /**
   * Custom logger instance
   */
  logger?: Logger;

  /**
   * Whether to enable logging
   * @default false
   */
  enableLogging?: boolean;

  /**
   * Log level for filtering log messages
   * @default 'info'
   */
  logLevel?: LogLevel;

  /**
   * Whether to log fetch errors
   * @default true
   */
  logFetchErrors?: boolean;

  /**
   * Whether to log query errors
   * @default true
   */
  logQueryErrors?: boolean;

  /**
   * Whether to log performance metrics
   * @default false
   */
  logPerformanceMetrics?: boolean;
}
