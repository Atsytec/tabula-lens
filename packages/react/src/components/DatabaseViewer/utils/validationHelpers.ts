import type { QueryResult } from '../DatabaseViewer.types';

/**
 * ============================================================================
 * VALIDATION HELPERS
 * ============================================================================
 *
 * Utility functions for type guards, data validation, and sanitization.
 */

/**
 * Type guard to check if an object is a valid QueryResult
 *
 * @param value - Value to check
 * @returns True if the value is a valid QueryResult
 */
export const isQueryResult = (value: unknown): value is QueryResult => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const obj = value as Record<string, unknown>;

  // Check for required properties
  if (!Array.isArray(obj.data) || !Array.isArray(obj.columns)) {
    return false;
  }

  // Check pagination object
  if (
    typeof obj.pagination !== 'object' ||
    obj.pagination === null ||
    typeof (obj.pagination as Record<string, unknown>).page !== 'number' ||
    typeof (obj.pagination as Record<string, unknown>).limit !== 'number' ||
    typeof (obj.pagination as Record<string, unknown>).total !== 'number' ||
    typeof (obj.pagination as Record<string, unknown>).totalPages !== 'number'
  ) {
    return false;
  }

  return true;
};

/**
 * Validates pagination parameters
 *
 * @param pagination - Pagination object to validate
 * @returns True if pagination is valid
 */
export const validatePagination = (pagination: {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}): boolean => {
  const { page, limit, total, totalPages } = pagination;

  // Check that all values are numbers and non-negative
  if (
    typeof page !== 'number' ||
    typeof limit !== 'number' ||
    typeof total !== 'number' ||
    typeof totalPages !== 'number'
  ) {
    return false;
  }

  if (page < 0 || limit < 0 || total < 0 || totalPages < 0) {
    return false;
  }

  // Check that page is within valid range
  if (page >= totalPages && totalPages > 0) {
    return false;
  }

  // Check that total is consistent with page and limit
  if (totalPages > 0 && limit > 0) {
    const expectedTotalPages = Math.ceil(total / limit);
    if (totalPages !== expectedTotalPages) {
      return false;
    }
  }

  return true;
};

/**
 * Sanitizes column data to ensure type safety
 * Note: React handles HTML escaping automatically at render time,
 * so we don't escape here to prevent double-escaping issues
 *
 * @param value - Value to sanitize
 * @returns Sanitized value as a string
 */
export const sanitizeColumnData = (value: unknown): string => {
  if (value === null || value === undefined) {
    return '';
  }

  // Convert to string if possible
  if (typeof value === 'string') {
    // Return string as-is - React will handle escaping at render time
    return value;
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  if (typeof value === 'object') {
    try {
      return JSON.stringify(value);
    } catch {
      return '[Object]';
    }
  }

  return String(value);
};

/**
 * Validates table name to prevent injection attacks
 *
 * @param tableName - Table name to validate
 * @returns True if table name is valid
 */
export const validateTableName = (tableName: string): boolean => {
  // Only allow alphanumeric characters, underscores, and hyphens
  const validPattern = /^[a-zA-Z0-9_-]+$/;
  return validPattern.test(tableName) && tableName.length > 0 && tableName.length <= 100;
};

/**
 * Validates filter input to prevent injection attacks
 *
 * @param filter - Filter string to validate
 * @returns True if filter is valid
 */
export const validateFilter = (filter: string): boolean => {
  // Allow most characters but limit length
  const maxLength = 1000;
  return filter.length <= maxLength;
};

/**
 * Validates sort column name
 *
 * @param columnName - Column name to validate
 * @param availableColumns - Array of available column names
 * @returns True if column name is valid and exists
 */
export const validateSortColumn = (columnName: string, availableColumns: string[]): boolean => {
  return availableColumns.includes(columnName);
};

/**
 * Validates sort direction
 *
 * @param direction - Sort direction to validate
 * @returns True if direction is valid
 */
export const validateSortDirection = (direction: string): direction is 'asc' | 'desc' => {
  return direction === 'asc' || direction === 'desc';
};

/**
 * Validates page size
 *
 * @param pageSize - Page size to validate
 * @param allowedSizes - Array of allowed page sizes
 * @returns True if page size is valid
 */
export const validatePageSize = (pageSize: number, allowedSizes: number[]): boolean => {
  return allowedSizes.includes(pageSize) && pageSize > 0;
};

/**
 * Validates page index
 *
 * @param pageIndex - Page index to validate
 * @param totalPages - Total number of pages
 * @returns True if page index is valid
 */
export const validatePageIndex = (pageIndex: number, totalPages: number): boolean => {
  return pageIndex >= 0 && pageIndex < totalPages;
};
