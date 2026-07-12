import { TabulaLensError } from './TabulaLens';

/**
 * Supported database types for Tabula Lens
 */
export type DatabaseType = 'pg' | 'mysql' | 'sqlite' | 'mssql';

/**
 * Configuration object for Tabula Lens initialization
 * Extends TabulaLensOptions to include database connection details
 */
export interface TabulaLensConfig {
  /** Database connection URL */
  url: string;
  /** Database type (optional - auto-detected from URL if not provided) */
  type?: DatabaseType;
  /** Logger instance */
  logger?: import('./logger').Logger;
  /** Log level */
  logLevel?: import('./logger').LogLevel;
  /** Enable query logging */
  enableQueryLogging?: boolean;
  /** Enable request logging */
  enableRequestLogging?: boolean;
  /** Mask sensitive data in logs */
  sensitiveDataMasking?: boolean;
  /** Log format */
  logFormat?: 'json' | 'text' | 'pretty';
}

/**
 * Error message constants for consistent error reporting
 */
const ERROR_MESSAGES = {
  AUTO_DETECTION_FAILED:
    "Unable to detect database type from URL. Please specify the 'type' field in the config. Valid types: pg, mysql, sqlite, mssql",
  INVALID_DATABASE_TYPE: 'Invalid database type. Valid types: pg, mysql, sqlite, mssql',
} as const;

/**
 * Detects the database type from a connection URL or file path
 *
 * @param url - Database connection URL or file path
 * @returns The detected database type
 * @throws TabulaLensError if the database type cannot be detected
 *
 * @example
 * ```ts
 * detectDatabaseType('postgresql://localhost/mydb') // returns 'pg'
 * detectDatabaseType('mysql://localhost/mydb') // returns 'mysql'
 * detectDatabaseType('./database.db') // returns 'sqlite'
 * detectDatabaseType('mssql://localhost/mydb') // returns 'mssql'
 * ```
 */
/**
 * Extracts the URL scheme, handling protocol-relative (//) URLs gracefully.
 *
 * @param url - URL string
 * @returns Lowercase scheme or undefined
 */
function getUrlScheme(url: string): string | undefined {
  const trimmedUrl = url.trim();
  if (trimmedUrl.length === 0) {
    return undefined;
  }

  // Protocol-relative URLs like //example.com have no scheme
  if (trimmedUrl.startsWith('//')) {
    return undefined;
  }

  const match = trimmedUrl.match(/^([a-z][a-z0-9+.-]*):/i);
  return match ? match[1].toLowerCase() : undefined;
}

/**
 * Detects the database type from a connection URL or file path.
 *
 * Supports standard connection strings plus common hosted service variations:
 * - PostgreSQL/CockroachDB: postgresql://, postgres://, pgsql://
 *   (covers Neon, Supabase, AWS RDS, Heroku Postgres, Railway, TimescaleDB,
 *   Azure Database for PostgreSQL, Google Cloud SQL, CockroachDB, DigitalOcean)
 * - MySQL/MariaDB: mysql://, mariadb://, mysql2://, mysqlx://
 *   (covers PlanetScale, AWS RDS MariaDB, Azure Database for MySQL, Google Cloud SQL MySQL,
 *    DigitalOcean Managed MySQL, Upstash)
 * - SQLite: sqlite://, sqlite:, file paths ending in .db/.sqlite/.sqlite3/.db3, :memory:
 *   (covers Turso local files; managed platforms like Turso Cloud/LibSQL are intentionally
 *    out of scope for v1 because they require the libsql driver, not a standard SQLite driver)
 * - SQL Server: mssql://, sqlserver://, mssql+tcp://, mssql+udp://
 *   (covers Azure SQL Database, AWS RDS SQL Server)
 *
 * @param url - Database connection URL or file path
 * @returns The detected database type
 * @throws TabulaLensError if the database type cannot be detected
 *
 * @example
 * ```ts
 * detectDatabaseType('postgresql://localhost/mydb') // returns 'pg'
 * detectDatabaseType('mysql://localhost/mydb')       // returns 'mysql'
 * detectDatabaseType('./database.db')                 // returns 'sqlite'
 * detectDatabaseType('mssql://localhost/mydb')       // returns 'mssql'
 * detectDatabaseType(':memory:')                     // returns 'sqlite'
 * ```
 */
export function detectDatabaseType(url: string): DatabaseType {
  if (!url || typeof url !== 'string') {
    throw new TabulaLensError(400, 'INVALID_URL', 'Database URL must be a non-empty string');
  }

  const trimmedUrl = url.trim();

  // Empty/whitespace-only URLs are invalid; file-like strings like ":memory:" must be handled before this
  if (trimmedUrl.length === 0) {
    throw new TabulaLensError(400, 'INVALID_URL', 'Database URL must be a non-empty string');
  }

  const lowerUrl = trimmedUrl.toLowerCase();
  const scheme = getUrlScheme(trimmedUrl);

  // Check for PostgreSQL URLs
  if (scheme === 'postgresql' || scheme === 'postgres' || scheme === 'pgsql') {
    return 'pg';
  }

  // Check for MySQL/MariaDB URLs
  if (scheme === 'mysql' || scheme === 'mysql2' || scheme === 'mysqlx' || scheme === 'mariadb') {
    return 'mysql';
  }

  // Check for MSSQL URLs
  if (
    scheme === 'mssql' ||
    scheme === 'sqlserver' ||
    scheme === 'mssql+tcp' ||
    scheme === 'mssql+udp'
  ) {
    return 'mssql';
  }

  // Check for SQLite
  // - sqlite:// or sqlite: protocol
  // - in-memory SQLite
  // - file paths with SQLite extensions
  if (
    scheme === 'sqlite' ||
    scheme === 'sqlite3' ||
    lowerUrl === ':memory:' ||
    lowerUrl.startsWith('file:') ||
    lowerUrl.endsWith('.db') ||
    lowerUrl.endsWith('.sqlite') ||
    lowerUrl.endsWith('.sqlite3') ||
    lowerUrl.endsWith('.db3')
  ) {
    return 'sqlite';
  }

  // If no pattern matches, throw an error
  throw new TabulaLensError(400, 'AUTO_DETECTION_FAILED', ERROR_MESSAGES.AUTO_DETECTION_FAILED);
}

/**
 * Validates that a database type is supported
 *
 * @param type - The database type to validate
 * @throws TabulaLensError if the type is invalid
 *
 * @example
 * ```ts
 * validateDatabaseType('pg') // valid, no error
 * validateDatabaseType('oracle') // throws TabulaLensError
 * ```
 */
export function validateDatabaseType(type: string): DatabaseType {
  const validTypes: DatabaseType[] = ['pg', 'mysql', 'sqlite', 'mssql'];

  if (!validTypes.includes(type as DatabaseType)) {
    throw new TabulaLensError(400, 'INVALID_DATABASE_TYPE', ERROR_MESSAGES.INVALID_DATABASE_TYPE);
  }

  return type as DatabaseType;
}
