import type { Knex } from 'knex';
import type { DialectStrategy, ColumnInfo } from './types';
import { extractTableNames, extractColumnNames } from './utils';

/**
 * SQL Server (MSSQL) dialect implementation
 *
 * This dialect handles Microsoft SQL Server-specific SQL syntax and metadata queries.
 * It uses the information_schema for metadata and LIKE for case-insensitive matching
 * (MSSQL LIKE is case-insensitive depending on collation, typically case-insensitive).
 *
 * @example
 * ```ts
 * import { MSSQLDialect } from './dialects/mssql';
 *
 * const dialect = new MSSQLDialect();
 * const tables = await dialect.getTables(knexInstance);
 * const columns = await dialect.getColumns(knexInstance, 'users');
 * ```
 */
export class MSSQLDialect implements DialectStrategy {
  /**
   * Get all base tables from the SQL Server database
   *
   * Queries information_schema.tables for tables with table_type = 'BASE TABLE'.
   * This excludes views and system tables.
   *
   * @param db - Knex instance configured for SQL Server
   * @returns Promise resolving to an array of table names
   */
  async getTables(db: Knex): Promise<string[]> {
    const tables = await db
      .select('table_name')
      .from('information_schema.tables')
      .where('table_type', 'BASE TABLE');

    return extractTableNames(tables, 'table_name');
  }

  /**
   * Get column metadata for a specific table
   *
   * Queries information_schema.columns for column information including
   * name and data type. Results are ordered by ordinal_position.
   *
   * @param db - Knex instance configured for SQL Server
   * @param table - Name of the table to get columns for
   * @returns Promise resolving to an array of column information objects
   */
  async getColumns(db: Knex, table: string): Promise<ColumnInfo[]> {
    const columns = await db
      .select('column_name as name', 'data_type as type')
      .from('information_schema.columns')
      .where('table_name', table)
      .orderBy('ordinal_position');

    return extractColumnNames(columns, 'name', 'type');
  }

  /**
   * Get SQL Server text-based data types that support LIKE operations
   *
   * SQL Server supports both ASCII and Unicode text types:
   * - varchar: Variable-length ASCII character strings
   * - nvarchar: Variable-length Unicode character strings
   * - text: Variable-length ASCII character strings (deprecated but still supported)
   * - ntext: Variable-length Unicode character strings (deprecated but still supported)
   * - char: Fixed-length ASCII character strings
   * - nchar: Fixed-length Unicode character strings
   *
   * @returns Array of SQL Server text type names
   */
  getFilterableTypes(): string[] {
    return ['varchar', 'nvarchar', 'text', 'ntext', 'char', 'nchar'];
  }

  /**
   * Get the LIKE operator for SQL Server
   *
   * SQL Server LIKE behavior depends on collation, but most installations
   * use case-insensitive collations by default. SQL Server doesn't support ILIKE.
   *
   * @returns 'LIKE' for case-insensitive matching (depends on collation)
   */
  getLikeOperator(): 'LIKE' | 'ILIKE' {
    return 'LIKE';
  }
}
