import type { Knex } from 'knex';
import type { DialectStrategy, ColumnInfo } from './types';
import { extractTableNames, extractColumnNames } from './utils';

/**
 * PostgreSQL dialect implementation
 *
 * This dialect handles PostgreSQL-specific SQL syntax and metadata queries.
 * It uses the information_schema for metadata and supports ILIKE for case-insensitive matching.
 *
 * @example
 * ```ts
 * import { PostgresDialect } from './dialects/postgres';
 *
 * const dialect = new PostgresDialect();
 * const tables = await dialect.getTables(knexInstance);
 * const columns = await dialect.getColumns(knexInstance, 'users');
 * ```
 */
export class PostgresDialect implements DialectStrategy {
  /**
   * Get all base tables from the PostgreSQL database
   *
   * Queries information_schema.tables for tables in the 'public' schema
   * with table_type = 'BASE TABLE' (excludes views and system tables).
   *
   * @param db - Knex instance configured for PostgreSQL
   * @returns Promise resolving to an array of table names
   */
  async getTables(db: Knex): Promise<string[]> {
    const tables = await db
      .select('table_name')
      .from('information_schema.tables')
      .where('table_schema', 'public')
      .where('table_type', 'BASE TABLE');

    return extractTableNames(tables, 'table_name');
  }

  /**
   * Get column metadata for a specific table
   *
   * Queries information_schema.columns for column information including
   * name and data type. Results are ordered by ordinal_position.
   *
   * @param db - Knex instance configured for PostgreSQL
   * @param table - Name of the table to get columns for
   * @returns Promise resolving to an array of column information objects
   */
  async getColumns(db: Knex, table: string): Promise<ColumnInfo[]> {
    const columns = await db
      .select('column_name as name', 'data_type as type')
      .from('information_schema.columns')
      .where('table_schema', 'public')
      .where('table_name', table)
      .orderBy('ordinal_position');

    return extractColumnNames(columns, 'name', 'type');
  }

  /**
   * Get PostgreSQL text-based data types that support LIKE/ILIKE operations
   *
   * PostgreSQL uses specific type names for character data:
   * - character varying / varchar: Variable-length character strings
   * - text: Variable-length character strings (no length limit)
   * - char / character: Fixed-length character strings
   * - uuid: UUID type (supports text operations)
   *
   * @returns Array of PostgreSQL text type names
   */
  getFilterableTypes(): string[] {
    return ['character varying', 'varchar', 'text', 'char', 'character', 'uuid'];
  }

  /**
   * Get the LIKE operator for PostgreSQL
   *
   * PostgreSQL supports ILIKE for case-insensitive matching,
   * which is preferred over LIKE for user-facing search.
   *
   * @returns 'ILIKE' for case-insensitive matching
   */
  getLikeOperator(): 'LIKE' | 'ILIKE' {
    return 'ILIKE';
  }
}
