import { describe, it, expect } from 'vitest';
import {
  normalizeTypeName,
  isFilterableType,
  filterFilterableColumns,
  extractTableNames,
  extractColumnNames,
} from './utils';
import type { ColumnInfo } from './types';

describe('dialects/utils', () => {
  describe('normalizeTypeName', () => {
    it('should convert type name to lowercase', () => {
      expect(normalizeTypeName('VARCHAR')).toBe('varchar');
      expect(normalizeTypeName('TEXT')).toBe('text');
      expect(normalizeTypeName('CHARACTER VARYING')).toBe('character varying');
    });

    it('should trim whitespace', () => {
      expect(normalizeTypeName('  VARCHAR  ')).toBe('varchar');
      expect(normalizeTypeName(' TEXT ')).toBe('text');
    });

    it('should handle already lowercase names', () => {
      expect(normalizeTypeName('varchar')).toBe('varchar');
      expect(normalizeTypeName('text')).toBe('text');
    });

    it('should handle mixed case', () => {
      expect(normalizeTypeName('VarChar')).toBe('varchar');
      expect(normalizeTypeName('TeXT')).toBe('text');
    });
  });

  describe('isFilterableType', () => {
    it('should return true for matching types (case-insensitive)', () => {
      const filterableTypes = ['varchar', 'text', 'char'];
      expect(isFilterableType('VARCHAR', filterableTypes)).toBe(true);
      expect(isFilterableType('varchar', filterableTypes)).toBe(true);
      expect(isFilterableType('TEXT', filterableTypes)).toBe(true);
      expect(isFilterableType('text', filterableTypes)).toBe(true);
    });

    it('should return false for non-matching types', () => {
      const filterableTypes = ['varchar', 'text', 'char'];
      expect(isFilterableType('integer', filterableTypes)).toBe(false);
      expect(isFilterableType('boolean', filterableTypes)).toBe(false);
      expect(isFilterableType('timestamp', filterableTypes)).toBe(false);
    });

    it('should handle empty filterable types array', () => {
      expect(isFilterableType('varchar', [])).toBe(false);
    });

    it('should handle type names with extra whitespace', () => {
      const filterableTypes = ['varchar', 'text'];
      expect(isFilterableType('  VARCHAR  ', filterableTypes)).toBe(true);
    });
  });

  describe('filterFilterableColumns', () => {
    it('should filter columns to only include filterable types', () => {
      const columns: ColumnInfo[] = [
        { name: 'id', type: 'integer' },
        { name: 'email', type: 'VARCHAR' },
        { name: 'name', type: 'TEXT' },
        { name: 'age', type: 'integer' },
        { name: 'description', type: 'text' },
      ];
      const filterableTypes = ['varchar', 'text', 'char'];
      const result = filterFilterableColumns(columns, filterableTypes);
      expect(result).toEqual(['email', 'name', 'description']);
    });

    it('should handle case-insensitive type matching', () => {
      const columns: ColumnInfo[] = [
        { name: 'email', type: 'VARCHAR' },
        { name: 'name', type: 'Text' },
        { name: 'bio', type: 'CHARACTER VARYING' },
      ];
      const filterableTypes = ['varchar', 'text', 'character varying'];
      const result = filterFilterableColumns(columns, filterableTypes);
      expect(result).toEqual(['email', 'name', 'bio']);
    });

    it('should return empty array when no columns match', () => {
      const columns: ColumnInfo[] = [
        { name: 'id', type: 'integer' },
        { name: 'created_at', type: 'timestamp' },
      ];
      const filterableTypes = ['varchar', 'text'];
      const result = filterFilterableColumns(columns, filterableTypes);
      expect(result).toEqual([]);
    });

    it('should return empty array for empty input', () => {
      expect(filterFilterableColumns([], ['varchar', 'text'])).toEqual([]);
    });
  });

  describe('extractTableNames', () => {
    it('should extract table names from query result', () => {
      const rows = [{ table_name: 'users' }, { table_name: 'products' }, { table_name: 'orders' }];
      const result = extractTableNames(rows, 'table_name');
      expect(result).toEqual(['users', 'products', 'orders']);
    });

    it('should handle different column names', () => {
      const rows = [{ name: 'users' }, { name: 'products' }, { name: 'orders' }];
      const result = extractTableNames(rows, 'name');
      expect(result).toEqual(['users', 'products', 'orders']);
    });

    it('should filter out empty or null values', () => {
      const rows = [
        { table_name: 'users' },
        { table_name: '' },
        { table_name: null },
        { table_name: 'products' },
      ];
      const result = extractTableNames(rows, 'table_name');
      // String(null) becomes "null", so we need to handle that
      expect(result).toEqual(['users', 'products']);
    });

    it('should return empty array for empty input', () => {
      expect(extractTableNames([], 'table_name')).toEqual([]);
    });
  });

  describe('extractColumnNames', () => {
    it('should extract column information from query result', () => {
      const rows = [
        { name: 'id', type: 'integer' },
        { name: 'email', type: 'character varying' },
        { name: 'created_at', type: 'timestamp without time zone' },
      ];
      const result = extractColumnNames(rows, 'name', 'type');
      expect(result).toEqual([
        { name: 'id', type: 'integer' },
        { name: 'email', type: 'character varying' },
        { name: 'created_at', type: 'timestamp without time zone' },
      ]);
    });

    it('should handle different column names', () => {
      const rows = [
        { column_name: 'id', data_type: 'integer' },
        { column_name: 'email', data_type: 'varchar' },
      ];
      const result = extractColumnNames(rows, 'column_name', 'data_type');
      expect(result).toEqual([
        { name: 'id', type: 'integer' },
        { name: 'email', type: 'varchar' },
      ]);
    });

    it('should filter out columns with missing name or type', () => {
      const rows = [
        { name: 'id', type: 'integer' },
        { name: '', type: 'varchar' },
        { name: 'email', type: '' },
        { name: null, type: 'text' },
        { name: 'name', type: null },
      ];
      const result = extractColumnNames(rows, 'name', 'type');
      expect(result).toEqual([{ name: 'id', type: 'integer' }]);
    });

    it('should return empty array for empty input', () => {
      expect(extractColumnNames([], 'name', 'type')).toEqual([]);
    });
  });
});
