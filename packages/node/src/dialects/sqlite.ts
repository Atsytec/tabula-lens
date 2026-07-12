import type { Knex } from 'knex';
import type { DialectStrategy, ColumnInfo } from './types';

/**
 * SQLite dialect implementation
 *
 * This dialect handles SQLite-specific SQL syntax and metadata queries.
 * SQLite doesn't use information_schema - instead it uses PRAGMA commands
 * and sqlite_master for metadata queries.
 *
 * @example
 * ```ts
 * import { SQLiteDialect } from './dialects/sqlite';
 *
 * const dialect = new SQLiteDialect();
 * const tables = await dialect.getTables(knexInstance);
 * const columns = await dialect.getColumns(knexInstance, 'users');
 * ```
 */
export class SQLiteDialect implements DialectStrategy {
  /**
   * Get all tables from the SQLite database
   *
   * Queries sqlite_master for all tables (type = 'table').
   * This excludes system tables and views.
   *
   * @param db - Knex instance configured for SQLite
   * @returns Promise resolving to an array of table names
   */
  async getTables(db: Knex): Promise<string[]> {
    const tables = await db
      .select('name')
      .from('sqlite_master')
      .where('type', 'table')
      .orderBy('name');

    // Filter out SQLite system tables
    return tables
      .map((t: { name: string }) => t.name)
      .filter((name) => !name.startsWith('sqlite_'));
  }

  /**
   * Get column metadata for a specific table
   *
   * Uses PRAGMA table_info(?) to get column information.
   * This is SQLite-specific and returns different column names than information_schema.
   *
   * @param db - Knex instance configured for SQLite
   * @param table - Name of the table to get columns for
   * @returns Promise resolving to an array of column information objects
   */
  async getColumns(db: Knex, table: string): Promise<ColumnInfo[]> {
    // PRAGMA table_info returns: cid, name, type, notnull, dflt_value, pk
    const columns = await db.raw(`PRAGMA table_info(?)`, [table]);

    // Map PRAGMA result to standard ColumnInfo format
    return columns.map((col: { name: string; type: string }) => ({
      name: col.name,
      type: col.type || 'TEXT', // SQLite columns without type default to TEXT
    }));
  }

  /**
   * Get SQLite text-based data types that support LIKE operations
   *
   * SQLite uses dynamic typing - any column can store any type, but it does
   * declare type affinity. The TEXT type affinity is used for text storage.
   * SQLite returns type names in various cases, so we include both.
   *
   * @returns Array of SQLite text type names
   */
  getFilterableTypes(): string[] {
    return ['TEXT', 'text', 'VARCHAR', 'varchar', 'CHAR', 'char', 'CLOB', 'clob'];
  }

  /**
   * Get the LIKE operator for SQLite
   *
   * SQLite LIKE is case-insensitive for ASCII characters by default,
   * so we use LIKE instead of ILIKE (which SQLite doesn't support).
   *
   * @returns 'LIKE' for case-insensitive matching
   */
  getLikeOperator(): 'LIKE' | 'ILIKE' {
    return 'LIKE';
  }
}
