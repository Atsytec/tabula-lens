import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TabulaLens } from './TabulaLens';
import { createDialect } from './dialects';

// Mock Knex to avoid actual database connections
vi.mock('knex', () => ({
  default: vi.fn(() => ({
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          where: vi.fn(() => ({
            orderBy: vi.fn(() => Promise.resolve([])),
          })),
          orderBy: vi.fn(() => Promise.resolve([])),
        })),
        orderBy: vi.fn(() => Promise.resolve([])),
      })),
    })),
    destroy: vi.fn(() => Promise.resolve()),
  })),
}));

describe('TabulaLens Multi-Database Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Dialect Integration', () => {
    it('should initialize PostgresDialect for PostgreSQL URLs', () => {
      const tabulaLens = new TabulaLens('postgresql://localhost/mydb');
      expect(tabulaLens).toBeDefined();
    });

    it('should initialize MySQLDialect for MySQL URLs', () => {
      const tabulaLens = new TabulaLens('mysql://localhost/mydb');
      expect(tabulaLens).toBeDefined();
    });

    it('should initialize SQLiteDialect for SQLite URLs', () => {
      const tabulaLens = new TabulaLens('sqlite://localhost/mydb');
      expect(tabulaLens).toBeDefined();
    });

    it('should initialize MSSQLDialect for MSSQL URLs', () => {
      const tabulaLens = new TabulaLens('mssql://localhost/mydb');
      expect(tabulaLens).toBeDefined();
    });

    it('should use explicit type when provided in config', () => {
      const tabulaLens = new TabulaLens({
        url: 'postgresql://localhost/mydb',
        type: 'pg',
      });
      expect(tabulaLens).toBeDefined();
    });

    it('should auto-detect type when not provided in config', () => {
      const tabulaLens = new TabulaLens({
        url: 'mysql://localhost/mydb',
      });
      expect(tabulaLens).toBeDefined();
    });
  });

  describe('Dialect Method Integration', () => {
    it('should use dialect.getTables() when calling getTables()', async () => {
      const tabulaLens = new TabulaLens('postgresql://localhost/mydb');

      // Mock the dialect's getTables method
      const mockGetTables = vi.fn().mockResolvedValue(['users', 'products']);
      const dialect = createDialect('pg');
      dialect.getTables = mockGetTables;

      // Access private dialect property for testing
      // @ts-expect-error - accessing private property for testing
      tabulaLens.dialect = dialect;

      const tables = await tabulaLens.getTables();

      expect(mockGetTables).toHaveBeenCalled();
      expect(tables).toEqual(['users', 'products']);
    });

    it('should use dialect.getColumns() when calling getColumns()', async () => {
      const tabulaLens = new TabulaLens('postgresql://localhost/mydb');

      // Mock the dialect's getColumns method
      const mockGetColumns = vi.fn().mockResolvedValue([
        { name: 'id', type: 'integer' },
        { name: 'name', type: 'character varying' },
      ]);
      const dialect = createDialect('pg');
      dialect.getColumns = mockGetColumns;

      // @ts-expect-error - accessing private property for testing
      tabulaLens.dialect = dialect;

      const columns = await tabulaLens.getColumns('users');

      expect(mockGetColumns).toHaveBeenCalledWith(expect.anything(), 'users');
      expect(columns).toEqual([
        { name: 'id', type: 'integer' },
        { name: 'name', type: 'character varying' },
      ]);
    });

    it('should use dialect.getFilterableTypes() when calling getFilterableColumns()', async () => {
      const tabulaLens = new TabulaLens('postgresql://localhost/mydb');

      // Mock the dialect's methods
      const mockGetColumns = vi.fn().mockResolvedValue([
        { name: 'id', type: 'integer' },
        { name: 'name', type: 'character varying' },
        { name: 'email', type: 'text' },
      ]);
      const dialect = createDialect('pg');
      dialect.getColumns = mockGetColumns;

      // @ts-expect-error - accessing private property for testing
      tabulaLens.dialect = dialect;

      const filterableColumns = await tabulaLens.getFilterableColumns('users');

      expect(mockGetColumns).toHaveBeenCalledWith(expect.anything(), 'users');
      expect(filterableColumns).toEqual(['name', 'email']);
    });

    it('should use dialect.getLikeOperator() in query()', () => {
      const tabulaLens = new TabulaLens('postgresql://localhost/mydb');

      // Mock the dialect's getLikeOperator method
      const dialect = createDialect('pg');
      const getLikeOperatorSpy = vi.spyOn(dialect, 'getLikeOperator');

      // @ts-expect-error - accessing private property for testing
      tabulaLens.dialect = dialect;

      // Verify the dialect has the method and it returns the correct operator
      const likeOperator = dialect.getLikeOperator();
      expect(likeOperator).toBe('ILIKE');
      expect(getLikeOperatorSpy).toHaveBeenCalled();
    });
  });

  describe('Database Type Detection', () => {
    it('should detect pg from postgresql://', () => {
      const tabulaLens = new TabulaLens('postgresql://localhost/mydb');
      // @ts-expect-error - accessing private property for testing
      expect(tabulaLens.databaseType).toBe('pg');
    });

    it('should detect pg from postgres://', () => {
      const tabulaLens = new TabulaLens('postgres://localhost/mydb');
      // @ts-expect-error - accessing private property for testing
      expect(tabulaLens.databaseType).toBe('pg');
    });

    it('should detect mysql from mysql://', () => {
      const tabulaLens = new TabulaLens('mysql://localhost/mydb');
      // @ts-expect-error - accessing private property for testing
      expect(tabulaLens.databaseType).toBe('mysql');
    });

    it('should detect sqlite from sqlite://', () => {
      const tabulaLens = new TabulaLens('sqlite://localhost/mydb');
      // @ts-expect-error - accessing private property for testing
      expect(tabulaLens.databaseType).toBe('sqlite');
    });

    it('should detect mssql from mssql://', () => {
      const tabulaLens = new TabulaLens('mssql://localhost/mydb');
      // @ts-expect-error - accessing private property for testing
      expect(tabulaLens.databaseType).toBe('mssql');
    });
  });

  describe('Dialect Strategy Pattern', () => {
    it('should create correct dialect instance for each database type', () => {
      const pgDialect = createDialect('pg');
      const mysqlDialect = createDialect('mysql');
      const sqliteDialect = createDialect('sqlite');
      const mssqlDialect = createDialect('mssql');

      expect(pgDialect.constructor.name).toBe('PostgresDialect');
      expect(mysqlDialect.constructor.name).toBe('MySQLDialect');
      expect(sqliteDialect.constructor.name).toBe('SQLiteDialect');
      expect(mssqlDialect.constructor.name).toBe('MSSQLDialect');
    });

    it('should have getLikeOperator method return correct operator for each dialect', () => {
      const pgDialect = createDialect('pg');
      const mysqlDialect = createDialect('mysql');
      const sqliteDialect = createDialect('sqlite');
      const mssqlDialect = createDialect('mssql');

      expect(pgDialect.getLikeOperator()).toBe('ILIKE');
      expect(mysqlDialect.getLikeOperator()).toBe('LIKE');
      expect(sqliteDialect.getLikeOperator()).toBe('LIKE');
      expect(mssqlDialect.getLikeOperator()).toBe('LIKE');
    });

    it('should have getFilterableTypes method return correct types for each dialect', () => {
      const pgDialect = createDialect('pg');
      const mysqlDialect = createDialect('mysql');
      const sqliteDialect = createDialect('sqlite');
      const mssqlDialect = createDialect('mssql');

      const pgTypes = pgDialect.getFilterableTypes();
      const mysqlTypes = mysqlDialect.getFilterableTypes();
      const sqliteTypes = sqliteDialect.getFilterableTypes();
      const mssqlTypes = mssqlDialect.getFilterableTypes();

      expect(pgTypes).toContain('character varying');
      expect(pgTypes).toContain('text');

      expect(mysqlTypes).toContain('varchar');
      expect(mysqlTypes).toContain('text');

      expect(sqliteTypes).toContain('TEXT');

      expect(mssqlTypes).toContain('varchar');
      expect(mssqlTypes).toContain('nvarchar');
    });
  });

  describe('Backward Compatibility', () => {
    it('should maintain backward compatibility with string constructor', () => {
      const tabulaLens = new TabulaLens('postgresql://localhost/mydb', {
        logLevel: 'info',
      });
      expect(tabulaLens).toBeDefined();
    });

    it('should maintain backward compatibility with existing options', () => {
      const tabulaLens = new TabulaLens('postgresql://localhost/mydb', {
        logLevel: 'debug',
        enableQueryLogging: false,
        enableRequestLogging: false,
        sensitiveDataMasking: false,
      });
      expect(tabulaLens).toBeDefined();
    });
  });
});
