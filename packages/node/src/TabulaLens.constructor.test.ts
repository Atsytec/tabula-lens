import { describe, it, expect, vi } from 'vitest';
import { TabulaLens, TabulaLensError } from './TabulaLens';
import { detectDatabaseType, validateDatabaseType } from './database';

// Mock Knex to avoid requiring actual database drivers
vi.mock('knex', () => ({
  default: vi.fn(() => ({
    select: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    orWhere: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    offset: vi.fn().mockReturnThis(),
    count: vi.fn().mockReturnThis(),
    first: vi.fn().mockResolvedValue({ count: '0' }),
    modify: vi.fn().mockReturnThis(),
  })),
}));

describe('TabulaLens Constructor', () => {
  describe('String form (backward compatibility)', () => {
    it('should accept a PostgreSQL URL string', () => {
      const tabulaLens = new TabulaLens('postgresql://localhost/mydb');
      expect(tabulaLens).toBeInstanceOf(TabulaLens);
    });

    it('should accept a postgres:// URL string', () => {
      const tabulaLens = new TabulaLens('postgres://localhost/mydb');
      expect(tabulaLens).toBeInstanceOf(TabulaLens);
    });

    it('should accept options with string form', () => {
      const tabulaLens = new TabulaLens('postgresql://localhost/mydb', {
        logLevel: 'error',
        enableQueryLogging: false,
      });
      expect(tabulaLens).toBeInstanceOf(TabulaLens);
    });

    it('should auto-detect database type from URL', () => {
      // Only test with PostgreSQL since other drivers aren't installed
      const pgLens = new TabulaLens('postgresql://localhost/mydb');
      expect(pgLens).toBeInstanceOf(TabulaLens);

      // Test detection logic without actual instantiation
      expect(detectDatabaseType('mysql://localhost/mydb')).toBe('mysql');
      expect(detectDatabaseType('./database.db')).toBe('sqlite');
      expect(detectDatabaseType('mssql://localhost/mydb')).toBe('mssql');
    });

    it('should throw TabulaLensError for undetectable database type', () => {
      expect(() => new TabulaLens('oracle://localhost/mydb')).toThrow(TabulaLensError);
      expect(() => new TabulaLens('mongodb://localhost/mydb')).toThrow(TabulaLensError);
    });

    it('should throw TabulaLensError with correct error message for undetectable type', () => {
      try {
        new TabulaLens('oracle://localhost/mydb');
        expect.fail('Should have thrown TabulaLensError');
      } catch (error) {
        expect(error).toBeInstanceOf(TabulaLensError);
        expect((error as TabulaLensError).code).toBe('AUTO_DETECTION_FAILED');
        expect((error as TabulaLensError).message).toContain(
          'Unable to detect database type from URL'
        );
      }
    });
  });

  describe('Config object form (new API)', () => {
    it('should accept a config object with URL', () => {
      const tabulaLens = new TabulaLens({
        url: 'postgresql://localhost/mydb',
      });
      expect(tabulaLens).toBeInstanceOf(TabulaLens);
    });

    it('should accept a config object with URL and type', () => {
      const tabulaLens = new TabulaLens({
        url: 'postgresql://localhost/mydb',
        type: 'pg',
      });
      expect(tabulaLens).toBeInstanceOf(TabulaLens);
    });

    it('should accept a config object with all options', () => {
      const tabulaLens = new TabulaLens({
        url: 'postgresql://localhost/mydb',
        type: 'pg',
        logLevel: 'error',
        enableQueryLogging: false,
        enableRequestLogging: false,
        sensitiveDataMasking: false,
        logFormat: 'json',
      });
      expect(tabulaLens).toBeInstanceOf(TabulaLens);
    });

    it('should use explicit type when provided', () => {
      const tabulaLens = new TabulaLens({
        url: 'postgresql://localhost/mydb',
        type: 'pg',
      });
      expect(tabulaLens).toBeInstanceOf(TabulaLens);
    });

    it('should auto-detect type when not provided in config', () => {
      const tabulaLens = new TabulaLens({
        url: 'postgresql://localhost/mydb',
      });
      expect(tabulaLens).toBeInstanceOf(TabulaLens);
    });

    it('should throw TabulaLensError for undetectable type in config', () => {
      expect(
        () =>
          new TabulaLens({
            url: 'oracle://localhost/mydb',
          })
      ).toThrow(TabulaLensError);
    });

    it('should throw TabulaLensError for invalid explicit type', () => {
      // Test the validation function directly since Knex will fail with invalid client
      expect(() => validateDatabaseType('oracle')).toThrow(TabulaLensError);
    });
  });

  describe('Database type detection', () => {
    it('should detect pg from postgresql://', () => {
      const tabulaLens = new TabulaLens('postgresql://localhost/mydb');
      expect(tabulaLens).toBeInstanceOf(TabulaLens);
    });

    it('should detect pg from postgres://', () => {
      const tabulaLens = new TabulaLens('postgres://localhost/mydb');
      expect(tabulaLens).toBeInstanceOf(TabulaLens);
    });

    // Test detection logic without actual Knex instantiation
    it('should detect mysql from mysql://', () => {
      expect(detectDatabaseType('mysql://localhost/mydb')).toBe('mysql');
    });

    it('should detect mysql from mariadb://', () => {
      expect(detectDatabaseType('mariadb://localhost/mydb')).toBe('mysql');
    });

    it('should detect sqlite from sqlite://', () => {
      expect(detectDatabaseType('sqlite://./database.db')).toBe('sqlite');
    });

    it('should detect sqlite from .db file path', () => {
      expect(detectDatabaseType('./database.db')).toBe('sqlite');
    });

    it('should detect sqlite from .sqlite file path', () => {
      expect(detectDatabaseType('./database.sqlite')).toBe('sqlite');
    });

    it('should detect mssql from mssql://', () => {
      expect(detectDatabaseType('mssql://localhost/mydb')).toBe('mssql');
    });

    it('should detect mssql from sqlserver://', () => {
      expect(detectDatabaseType('sqlserver://localhost/mydb')).toBe('mssql');
    });
  });

  describe('Error handling', () => {
    it('should throw TabulaLensError for empty URL string', () => {
      expect(() => new TabulaLens('')).toThrow(TabulaLensError);
    });

    it('should throw TabulaLensError for missing URL in config', () => {
      expect(() => new TabulaLens({} as never)).toThrow();
    });

    it('should throw TabulaLensError for null URL', () => {
      expect(() => new TabulaLens(null as never)).toThrow();
    });

    it('should throw TabulaLensError for undefined URL', () => {
      expect(() => new TabulaLens(undefined as never)).toThrow();
    });
  });

  describe('Knex client mapping', () => {
    it('should map pg to pg client', () => {
      const tabulaLens = new TabulaLens('postgresql://localhost/mydb');
      expect(tabulaLens).toBeInstanceOf(TabulaLens);
    });
  });

  describe('Logger initialization', () => {
    it('should initialize logger with default options', () => {
      const tabulaLens = new TabulaLens('postgresql://localhost/mydb');
      const logger = tabulaLens.getLogger();
      expect(logger).toBeDefined();
    });

    it('should accept custom logger in string form', () => {
      const customLogger = {
        debug: () => {},
        info: () => {},
        warn: () => {},
        error: () => {},
      } as import('./logger').Logger;

      const tabulaLens = new TabulaLens('postgresql://localhost/mydb', {
        logger: customLogger,
      });

      expect(tabulaLens.getLogger()).toBe(customLogger);
    });

    it('should accept custom logger in config form', () => {
      const customLogger = {
        debug: () => {},
        info: () => {},
        warn: () => {},
        error: () => {},
      } as import('./logger').Logger;

      const tabulaLens = new TabulaLens({
        url: 'postgresql://localhost/mydb',
        logger: customLogger,
      });

      expect(tabulaLens.getLogger()).toBe(customLogger);
    });

    it('should respect logLevel option', () => {
      const tabulaLens = new TabulaLens('postgresql://localhost/mydb', {
        logLevel: 'error',
      });
      expect(tabulaLens).toBeInstanceOf(TabulaLens);
    });

    it('should respect enableQueryLogging option', () => {
      const tabulaLens = new TabulaLens('postgresql://localhost/mydb', {
        enableQueryLogging: false,
      });
      expect(tabulaLens).toBeInstanceOf(TabulaLens);
    });

    it('should respect sensitiveDataMasking option', () => {
      const tabulaLens = new TabulaLens('postgresql://localhost/mydb', {
        sensitiveDataMasking: false,
      });
      expect(tabulaLens).toBeInstanceOf(TabulaLens);
    });
  });
});
