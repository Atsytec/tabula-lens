import { describe, it, expect, vi } from 'vitest';
import { MSSQLDialect } from './mssql';

// Mock Knex instance
const mockKnex = {
  select: vi.fn(),
  from: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
  raw: vi.fn(),
} as any; // eslint-disable-line @typescript-eslint/no-explicit-any

describe('MSSQLDialect', () => {
  let dialect: MSSQLDialect;

  beforeEach(() => {
    dialect = new MSSQLDialect();
    vi.clearAllMocks();
  });

  describe('getTables', () => {
    it('should return table names from information_schema', async () => {
      const mockTables = [
        { table_name: 'users' },
        { table_name: 'products' },
        { table_name: 'orders' },
      ];

      const mockChain = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValue(mockTables),
      };
      mockKnex.select.mockReturnValue(mockChain);

      const result = await dialect.getTables(mockKnex);

      expect(result).toEqual(['users', 'products', 'orders']);
      expect(mockKnex.select).toHaveBeenCalledWith('table_name');
    });

    it('should return empty array when no tables exist', async () => {
      const mockChain = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValue([]),
      };
      mockKnex.select.mockReturnValue(mockChain);

      const result = await dialect.getTables(mockKnex);

      expect(result).toEqual([]);
    });

    it('should handle database errors gracefully', async () => {
      const mockError = new Error('Database connection failed');
      const mockChain = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockRejectedValue(mockError),
      };
      mockKnex.select.mockReturnValue(mockChain);

      await expect(dialect.getTables(mockKnex)).rejects.toThrow('Database connection failed');
    });
  });

  describe('getColumns', () => {
    it('should return column information from information_schema', async () => {
      const mockColumns = [
        { name: 'id', type: 'int' },
        { name: 'email', type: 'nvarchar' },
        { name: 'created_at', type: 'datetime' },
      ];

      const mockChain = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockResolvedValue(mockColumns),
      };
      mockKnex.select.mockReturnValue(mockChain);

      const result = await dialect.getColumns(mockKnex, 'users');

      expect(result).toEqual([
        { name: 'id', type: 'int' },
        { name: 'email', type: 'nvarchar' },
        { name: 'created_at', type: 'datetime' },
      ]);
      expect(mockKnex.select).toHaveBeenCalledWith('column_name as name', 'data_type as type');
    });

    it('should return empty array when table has no columns', async () => {
      const mockChain = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockResolvedValue([]),
      };
      mockKnex.select.mockReturnValue(mockChain);

      const result = await dialect.getColumns(mockKnex, 'nonexistent');

      expect(result).toEqual([]);
    });

    it('should handle database errors gracefully', async () => {
      const mockError = new Error('Table not found');
      const mockChain = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockRejectedValue(mockError),
      };
      mockKnex.select.mockReturnValue(mockChain);

      await expect(dialect.getColumns(mockKnex, 'nonexistent')).rejects.toThrow('Table not found');
    });
  });

  describe('getFilterableTypes', () => {
    it('should return SQL Server text type names', () => {
      const types = dialect.getFilterableTypes();

      expect(types).toEqual(['varchar', 'nvarchar', 'text', 'ntext', 'char', 'nchar']);
    });

    it('should include both ASCII and Unicode text types', () => {
      const types = dialect.getFilterableTypes();

      expect(types).toContain('varchar');
      expect(types).toContain('nvarchar');
      expect(types).toContain('text');
      expect(types).toContain('ntext');
      expect(types).toContain('char');
      expect(types).toContain('nchar');
    });
  });

  describe('getLikeOperator', () => {
    it('should return LIKE for SQL Server', () => {
      const operator = dialect.getLikeOperator();

      expect(operator).toBe('LIKE');
    });
  });
});
