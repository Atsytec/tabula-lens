import { describe, it, expect } from 'vitest';
import { createDialect } from './index';
import { PostgresDialect } from './postgres';
import { MySQLDialect } from './mysql';
import { SQLiteDialect } from './sqlite';
import { MSSQLDialect } from './mssql';
import type { DatabaseType } from '../database';

describe('dialects/index', () => {
  describe('createDialect', () => {
    it('should create PostgresDialect for pg type', () => {
      const dialect = createDialect('pg');
      expect(dialect).toBeInstanceOf(PostgresDialect);
      expect(dialect.getLikeOperator()).toBe('ILIKE');
    });

    it('should create MySQLDialect for mysql type', () => {
      const dialect = createDialect('mysql');
      expect(dialect).toBeInstanceOf(MySQLDialect);
      expect(dialect.getLikeOperator()).toBe('LIKE');
    });

    it('should create SQLiteDialect for sqlite type', () => {
      const dialect = createDialect('sqlite');
      expect(dialect).toBeInstanceOf(SQLiteDialect);
      expect(dialect.getLikeOperator()).toBe('LIKE');
    });

    it('should create MSSQLDialect for mssql type', () => {
      const dialect = createDialect('mssql');
      expect(dialect).toBeInstanceOf(MSSQLDialect);
      expect(dialect.getLikeOperator()).toBe('LIKE');
    });

    it('should throw error for invalid database type', () => {
      // This test verifies runtime safety for invalid types
      // TypeScript should prevent this at compile time, but we test runtime behavior
      expect(() => {
        createDialect('invalid' as DatabaseType);
      }).toThrow('Unknown database type: invalid');
    });

    it('should create new instance each time (no singleton)', () => {
      const dialect1 = createDialect('pg');
      const dialect2 = createDialect('pg');

      expect(dialect1).not.toBe(dialect2);
      expect(dialect1).toBeInstanceOf(PostgresDialect);
      expect(dialect2).toBeInstanceOf(PostgresDialect);
    });

    it('should return dialects with correct filterable types', () => {
      const pgDialect = createDialect('pg');
      const mysqlDialect = createDialect('mysql');
      const sqliteDialect = createDialect('sqlite');
      const mssqlDialect = createDialect('mssql');

      expect(pgDialect.getFilterableTypes()).toContain('character varying');
      expect(pgDialect.getFilterableTypes()).toContain('uuid');

      expect(mysqlDialect.getFilterableTypes()).toContain('varchar');
      expect(mysqlDialect.getFilterableTypes()).toContain('longtext');

      expect(sqliteDialect.getFilterableTypes()).toContain('TEXT');
      expect(sqliteDialect.getFilterableTypes()).toContain('text');

      expect(mssqlDialect.getFilterableTypes()).toContain('nvarchar');
      expect(mssqlDialect.getFilterableTypes()).toContain('ntext');
    });
  });

  describe('exports', () => {
    it('should export all dialect classes', () => {
      expect(typeof PostgresDialect).toBe('function');
      expect(typeof MySQLDialect).toBe('function');
      expect(typeof SQLiteDialect).toBe('function');
      expect(typeof MSSQLDialect).toBe('function');
    });

    it('should export createDialect factory', () => {
      expect(typeof createDialect).toBe('function');
    });
  });
});
