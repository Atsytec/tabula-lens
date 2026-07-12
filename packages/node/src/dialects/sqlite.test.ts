import { describe, it, expect, vi } from 'vitest';
import { SQLiteDialect } from './sqlite';

// Mock Knex instance
const mockKnex = {
  select: vi.fn(),
  from: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
  raw: vi.fn(),
} as any; // eslint-disable-line @typescript-eslint/no-explicit-any

describe('SQLiteDialect', () => {
  let dialect: SQLiteDialect;

  beforeEach(() => {
    dialect = new SQLiteDialect();
    vi.clearAllMocks();
  });

  describe('getTables', () => {
    it('should return table names from sqlite_master', async () => {
      const mockTables = [{ name: 'users' }, { name: 'products' }, { name: 'orders' }];

      const mockChain = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockResolvedValue(mockTables),
      };
      mockKnex.select.mockReturnValue(mockChain);

      const result = await dialect.getTables(mockKnex);

      expect(result).toEqual(['users', 'products', 'orders']);
      expect(mockKnex.select).toHaveBeenCalledWith('name');
    });

    it('should exclude SQLite system tables', async () => {
      const mockTables = [
        { name: 'users' },
        { name: 'sqlite_sequence' },
        { name: 'products' },
        { name: 'sqlite_master' },
      ];

      const mockChain = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockResolvedValue(mockTables),
      };
      mockKnex.select.mockReturnValue(mockChain);

      const result = await dialect.getTables(mockKnex);

      // System tables should be filtered out
      expect(result).toEqual(['users', 'products']);
    });

    it('should return empty array when no tables exist', async () => {
      const mockChain = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockResolvedValue([]),
      };
      mockKnex.select.mockReturnValue(mockChain);

      const result = await dialect.getTables(mockKnex);

      expect(result).toEqual([]);
    });

    it('should handle database errors gracefully', async () => {
      const mockError = new Error('Database connection failed');
      const mockChain = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockRejectedValue(mockError),
      };
      mockKnex.select.mockReturnValue(mockChain);

      await expect(dialect.getTables(mockKnex)).rejects.toThrow('Database connection failed');
    });
  });

  describe('getColumns', () => {
    it('should return column information from PRAGMA table_info', async () => {
      const mockColumns = [
        { cid: 0, name: 'id', type: 'INTEGER', notnull: 1, dflt_value: null, pk: 1 },
        { cid: 1, name: 'email', type: 'TEXT', notnull: 0, dflt_value: null, pk: 0 },
        { cid: 2, name: 'created_at', type: 'TEXT', notnull: 0, dflt_value: null, pk: 0 },
      ];

      mockKnex.raw.mockResolvedValue(mockColumns);

      const result = await dialect.getColumns(mockKnex, 'users');

      expect(result).toEqual([
        { name: 'id', type: 'INTEGER' },
        { name: 'email', type: 'TEXT' },
        { name: 'created_at', type: 'TEXT' },
      ]);
      expect(mockKnex.raw).toHaveBeenCalledWith('PRAGMA table_info(?)', ['users']);
    });

    it('should handle columns without type (default to TEXT)', async () => {
      const mockColumns = [
        { cid: 0, name: 'id', type: null, notnull: 1, dflt_value: null, pk: 1 },
        { cid: 1, name: 'email', type: '', notnull: 0, dflt_value: null, pk: 0 },
      ];

      mockKnex.raw.mockResolvedValue(mockColumns);

      const result = await dialect.getColumns(mockKnex, 'users');

      expect(result).toEqual([
        { name: 'id', type: 'TEXT' },
        { name: 'email', type: 'TEXT' },
      ]);
    });

    it('should return empty array when table has no columns', async () => {
      mockKnex.raw.mockResolvedValue([]);

      const result = await dialect.getColumns(mockKnex, 'nonexistent');

      expect(result).toEqual([]);
    });

    it('should handle database errors gracefully', async () => {
      const mockError = new Error('Table not found');
      mockKnex.raw.mockRejectedValue(mockError);

      await expect(dialect.getColumns(mockKnex, 'nonexistent')).rejects.toThrow('Table not found');
    });
  });

  describe('getFilterableTypes', () => {
    it('should return SQLite text type names', () => {
      const types = dialect.getFilterableTypes();

      expect(types).toEqual(['TEXT', 'text', 'VARCHAR', 'varchar', 'CHAR', 'char', 'CLOB', 'clob']);
    });

    it('should include both uppercase and lowercase type names', () => {
      const types = dialect.getFilterableTypes();

      expect(types).toContain('TEXT');
      expect(types).toContain('text');
      expect(types).toContain('VARCHAR');
      expect(types).toContain('varchar');
      expect(types).toContain('CHAR');
      expect(types).toContain('char');
      expect(types).toContain('CLOB');
      expect(types).toContain('clob');
    });
  });

  describe('getLikeOperator', () => {
    it('should return LIKE for SQLite', () => {
      const operator = dialect.getLikeOperator();

      expect(operator).toBe('LIKE');
    });
  });
});
