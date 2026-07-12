import type { ColumnInfo } from './types';

/**
 * Normalizes a database type name for case-insensitive comparison
 *
 * Different databases return type names in different cases (e.g., 'TEXT' vs 'text').
 * This utility normalizes them to lowercase for consistent comparison.
 *
 * @param typeName - The type name to normalize
 * @returns Lowercase type name
 *
 * @example
 * ```ts
 * normalizeTypeName('VARCHAR') // 'varchar'
 * normalizeTypeName('text') // 'text'
 * normalizeTypeName('Character Varying') // 'character varying'
 * ```
 */
export function normalizeTypeName(typeName: string): string {
  return typeName.toLowerCase().trim();
}

/**
 * Checks if a column type is in a list of filterable types
 *
 * This performs a case-insensitive comparison by normalizing both the column type
 * and the filterable types before checking.
 *
 * @param columnType - The column type to check
 * @param filterableTypes - Array of filterable type names
 * @returns True if the column type is filterable
 *
 * @example
 * ```ts
 * const filterableTypes = ['varchar', 'text', 'char'];
 * isFilterableType('VARCHAR', filterableTypes) // true
 * isFilterableType('integer', filterableTypes) // false
 * ```
 */
export function isFilterableType(columnType: string, filterableTypes: string[]): boolean {
  const normalized = normalizeTypeName(columnType);
  return filterableTypes.some((type) => normalizeTypeName(type) === normalized);
}

/**
 * Filters an array of columns to only include filterable (text-based) columns
 *
 * @param columns - Array of column information
 * @param filterableTypes - Array of filterable type names
 * @returns Array of filterable column names
 *
 * @example
 * ```ts
 * const columns = [
 *   { name: 'id', type: 'integer' },
 *   { name: 'email', type: 'VARCHAR' },
 *   { name: 'name', type: 'TEXT' }
 * ];
 * const filterableTypes = ['varchar', 'text', 'char'];
 * const filterable = filterFilterableColumns(columns, filterableTypes);
 * // ['email', 'name']
 * ```
 */
export function filterFilterableColumns(
  columns: ColumnInfo[],
  filterableTypes: string[]
): string[] {
  return columns
    .filter((col) => isFilterableType(col.type, filterableTypes))
    .map((col) => col.name);
}

/**
 * Extracts table names from a query result
 *
 * This is a helper for dialect implementations that return table metadata
 * in different formats (e.g., { table_name: string } vs { name: string }).
 *
 * @param rows - Query result rows
 * @param columnName - Name of the column containing the table name
 * @returns Array of table names
 *
 * @example
 * ```ts
 * const result = await db.select('table_name').from('information_schema.tables');
 * const tables = extractTableNames(result, 'table_name');
 * // ['users', 'products', 'orders']
 * ```
 */
export function extractTableNames(rows: Record<string, unknown>[], columnName: string): string[] {
  return rows
    .map((row) => row[columnName])
    .filter((value) => value !== null && value !== undefined && value !== '')
    .map((value) => String(value));
}

/**
 * Extracts column information from a query result
 *
 * This is a helper for dialect implementations that return column metadata
 * in different formats. It maps the result rows to a consistent ColumnInfo format.
 *
 * @param rows - Query result rows
 * @param nameColumn - Name of the column containing the column name
 * @param typeColumn - Name of the column containing the data type
 * @returns Array of column information
 *
 * @example
 * ```ts
 * const result = await db
 *   .select('column_name as name', 'data_type as type')
 *   .from('information_schema.columns');
 * const columns = extractColumnNames(result, 'name', 'type');
 * // [
 * //   { name: 'id', type: 'integer' },
 * //   { name: 'email', type: 'character varying' }
 * // ]
 * ```
 */
export function extractColumnNames(
  rows: Record<string, unknown>[],
  nameColumn: string,
  typeColumn: string
): ColumnInfo[] {
  return rows
    .map((row) => ({
      name: row[nameColumn],
      type: row[typeColumn],
    }))
    .filter(
      (col) =>
        col.name !== null &&
        col.name !== undefined &&
        col.name !== '' &&
        col.type !== null &&
        col.type !== undefined &&
        col.type !== ''
    )
    .map((col) => ({
      name: String(col.name),
      type: String(col.type),
    }));
}
