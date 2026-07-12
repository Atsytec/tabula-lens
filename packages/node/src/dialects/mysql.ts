import type { Knex } from 'knex';
import type { DialectStrategy, ColumnInfo } from './types';
import { extractTableNames, extractColumnNames } from './utils';

/**
 * MySQL dialect implementation
 *
 * This dialect handles MySQL-specific SQL syntax and metadata queries.
 * It uses the information_schema for metadata and LIKE for case-insensitive matching
 * (MySQL LIKE is case-insensitive by default for most collations).
 *
 * @example
 * ```ts
 * import { MySQLDialect } from './dialects/mysql';
 *
 * const dialect = new MySQLDialect();
 * const tables = await dialect.getTables(knexInstance);
 * const columns = await dialect.getColumns(knexInstance, 'users');
 * ```
 */
export class MySQLDialect implements DialectStrategy {
  /**
   * Get all base tables from the MySQL database
   *
   * Queries information_schema.tables for tables in the current database
   * (using DATABASE() function) with table_type = 'BASE TABLE'.
   *
   * @param db - Knex instance configured for MySQL
   * @returns Promise resolving to an array of table names
   */
  async getTables(db: Knex): Promise<string[]> {
    const tables = await db
      .select('table_name')
      .from('information_schema.tables')
      .where('table_schema', db.raw('DATABASE()'))
      .where('table_type', 'BASE TABLE');

    return extractTableNames(tables, 'table_name');
  }

  /**
   * Get column metadata for a specific table
   *
   * Queries information_schema.columns for column information including
   * name and data type. Results are ordered by ordinal_position.
   *
   * @param db - Knex instance configured for MySQL
   * @param table - Name of the table to get columns for
   * @returns Promise resolving to an array of column information objects
   */
  async getColumns(db: Knex, table: string): Promise<ColumnInfo[]> {
    const columns = await db
      .select('column_name as name', 'data_type as type')
      .from('information_schema.columns')
      .where('table_schema', db.raw('DATABASE()'))
      .where('table_name', table)
      .orderBy('ordinal_position');

    return extractColumnNames(columns, 'name', 'type');
  }

  /**
   * Get MySQL text-based data types that support LIKE operations
   *
   * MySQL supports several text types with different storage limits:
   * - varchar: Variable-length character strings (up to 65,535 bytes)
   * - text: Variable-length character strings (up to 65,535 bytes)
   * - tinytext: Variable-length character strings (up to 255 bytes)
   * - mediumtext: Variable-length character strings (up to 16MB)
   * - longtext: Variable-length character strings (up to 4GB)
   * - char: Fixed-length character strings
   *
   * @returns Array of MySQL text type names
   */
  getFilterableTypes(): string[] {
    return ['varchar', 'text', 'tinytext', 'mediumtext', 'longtext', 'char'];
  }

  /**
   * Get the LIKE operator for MySQL
   *
   * MySQL LIKE is case-insensitive by default for most collations,
   * so we use LIKE instead of ILIKE (which MySQL doesn't support).
   *
   * @returns 'LIKE' for case-insensitive matching
   */
  getLikeOperator(): 'LIKE' | 'ILIKE' {
    return 'LIKE';
  }
}
