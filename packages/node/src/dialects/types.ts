import type { Knex } from 'knex';

/**
 * Column metadata returned by dialect implementations
 */
export interface ColumnInfo {
  name: string;
  type: string;
}

/**
 * Dialect strategy interface for database-specific operations
 *
 * This interface defines the contract that all database dialect implementations must follow.
 * Each dialect handles the specific SQL syntax and metadata queries required for its database type.
 *
 * @example
 * ```ts
 * import { PostgresDialect } from './dialects/postgres';
 *
 * const dialect = new PostgresDialect();
 * const tables = await dialect.getTables(knexInstance);
 * const columns = await dialect.getColumns(knexInstance, 'users');
 * const filterableTypes = dialect.getFilterableTypes();
 * const likeOperator = dialect.getLikeOperator(); // 'ILIKE' for PostgreSQL
 * ```
 */
export interface DialectStrategy {
  /**
   * Get a list of all table names in the database
   *
   * This method should return only base tables (not views, system tables, etc.)
   * and should use the appropriate metadata query for the database type.
   *
   * @param db - Knex instance configured for the database
   * @returns Promise resolving to an array of table names
   *
   * @example
   * ```ts
   * const tables = await dialect.getTables(knexInstance);
   * // ['users', 'products', 'orders', ...]
   * ```
   */
  getTables(db: Knex): Promise<string[]>;

  /**
   * Get column metadata for a specific table
   *
   * This method should return column information including name and data type.
   * The columns should be ordered by their ordinal position in the table.
   *
   * @param db - Knex instance configured for the database
   * @param table - Name of the table to get columns for
   * @returns Promise resolving to an array of column information objects
   *
   * @example
   * ```ts
   * const columns = await dialect.getColumns(knexInstance, 'users');
   * // [
   * //   { name: 'id', type: 'integer' },
   * //   { name: 'email', type: 'character varying' },
   * //   { name: 'created_at', type: 'timestamp without time zone' }
   * // ]
   * ```
   */
  getColumns(db: Knex, table: string): Promise<ColumnInfo[]>;

  /**
   * Get the list of data type names that are considered filterable (text-based)
   *
   * These are the types that support LIKE/ILIKE operations for text search.
   * The type names should match the exact strings returned by the database's
   * information schema or PRAGMA queries.
   *
   * @returns Array of type names that support text filtering
   *
   * @example
   * ```ts
   * const filterableTypes = dialect.getFilterableTypes();
   * // PostgreSQL: ['character varying', 'text', 'varchar', 'char', 'character', 'uuid']
   * // MySQL: ['varchar', 'text', 'tinytext', 'mediumtext', 'longtext', 'char']
   * // SQLite: ['TEXT', 'text']
   * // MSSQL: ['varchar', 'nvarchar', 'text', 'char', 'nchar']
   * ```
   */
  getFilterableTypes(): string[];

  /**
   * Get the LIKE operator for case-insensitive text matching
   *
   * Some databases support ILIKE for case-insensitive matching (PostgreSQL),
   * while others use LIKE which is case-insensitive by default (MySQL, SQLite, MSSQL).
   *
   * @returns Either 'LIKE' or 'ILIKE' based on database capabilities
   *
   * @example
   * ```ts
   * const likeOperator = dialect.getLikeOperator();
   * // PostgreSQL: 'ILIKE'
   * // MySQL: 'LIKE'
   * // SQLite: 'LIKE'
   * // MSSQL: 'LIKE'
   * ```
   */
  getLikeOperator(): 'LIKE' | 'ILIKE';
}
