import type { DatabaseType } from '../database';
import type { DialectStrategy } from './types';
import { PostgresDialect } from './postgres';
import { MySQLDialect } from './mysql';
import { SQLiteDialect } from './sqlite';
import { MSSQLDialect } from './mssql';

/**
 * Factory function to create a dialect strategy instance based on database type
 *
 * This factory centralizes dialect creation and provides type-safe instantiation
 * of the appropriate dialect implementation.
 *
 * @param type - The database type (pg, mysql, sqlite, mssql)
 * @returns A dialect strategy instance for the specified database type
 * @throws Error if an invalid database type is provided
 *
 * @example
 * ```ts
 * import { createDialect } from './dialects';
 * import { DatabaseType } from './database';
 *
 * const dialect = createDialect('mysql');
 * const tables = await dialect.getTables(knexInstance);
 * ```
 */
export function createDialect(type: DatabaseType): DialectStrategy {
  switch (type) {
    case 'pg':
      return new PostgresDialect();
    case 'mysql':
      return new MySQLDialect();
    case 'sqlite':
      return new SQLiteDialect();
    case 'mssql':
      return new MSSQLDialect();
    default:
      // This should never happen due to TypeScript's type checking,
      // but we include it for runtime safety
      throw new Error(`Unknown database type: ${type}`);
  }
}

// Re-export all dialect implementations for direct use if needed
export { PostgresDialect } from './postgres';
export { MySQLDialect } from './mysql';
export { SQLiteDialect } from './sqlite';
export { MSSQLDialect } from './mssql';

// Re-export types for convenience
export type { DialectStrategy, ColumnInfo } from './types';
