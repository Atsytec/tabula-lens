import { describe, it, expect, vi } from 'vitest';
import { MySQLDialect } from './mysql';

// Mock Knex instance
const mockKnex = {
  select: vi.fn(),
  from: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
  raw: vi.fn(),
} as any; // eslint-disable-line @typescript-eslint/no-explicit-any

describe('MySQLDialect', () => {
  let dialect: MySQLDialect;

  beforeEach(() => {
    dialect = new MySQLDialect();
    vi.clearAllMocks();
  });

  describe('getTables', () => {
    it('should return table names from information_schema using DATABASE()', async () => {
      const mockTables = [
        { table_name: 'users' },
        { table_name: 'products' },
        { table_name: 'orders' },
      ];

      let callCount = 0;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const whereMock = vi.fn(function (this: any) {
        callCount++;
        if (callCount === 2) {
          return Promise.resolve(mockTables);
        }
        return this;
      });

      const mockChain = {
        from: vi.fn().mockReturnThis(),
        where: whereMock,
      };

      mockKnex.select.mockReturnValue(mockChain);

      const result = await dialect.getTables(mockKnex);

      expect(result).toEqual(['users', 'products', 'orders']);
      expect(mockKnex.select).toHaveBeenCalledWith('table_name');
    });

    it('should return empty array when no tables exist', async () => {
      let callCount = 0;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const whereMock = vi.fn(function (this: any) {
        callCount++;
        if (callCount === 2) {
          return Promise.resolve([]);
        }
        return this;
      });

      const mockChain = {
        from: vi.fn().mockReturnThis(),
        where: whereMock,
      };

      mockKnex.select.mockReturnValue(mockChain);

      const result = await dialect.getTables(mockKnex);

      expect(result).toEqual([]);
    });

    it('should handle database errors gracefully', async () => {
      const mockError = new Error('Database connection failed');
      let callCount = 0;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const whereMock = vi.fn(function (this: any) {
        callCount++;
        if (callCount === 2) {
          return Promise.reject(mockError);
        }
        return this;
      });

      const mockChain = {
        from: vi.fn().mockReturnThis(),
        where: whereMock,
      };

      mockKnex.select.mockReturnValue(mockChain);

      await expect(dialect.getTables(mockKnex)).rejects.toThrow('Database connection failed');
    });
  });

  describe('getColumns', () => {
    it('should return column information from information_schema using DATABASE()', async () => {
      const mockColumns = [
        { name: 'id', type: 'int' },
        { name: 'email', type: 'varchar' },
        { name: 'created_at', type: 'timestamp' },
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
        { name: 'email', type: 'varchar' },
        { name: 'created_at', type: 'timestamp' },
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
    it('should return MySQL text type names', () => {
      const types = dialect.getFilterableTypes();

      expect(types).toEqual(['varchar', 'text', 'tinytext', 'mediumtext', 'longtext', 'char']);
    });

    it('should include all expected MySQL text types', () => {
      const types = dialect.getFilterableTypes();

      expect(types).toContain('varchar');
      expect(types).toContain('text');
      expect(types).toContain('tinytext');
      expect(types).toContain('mediumtext');
      expect(types).toContain('longtext');
      expect(types).toContain('char');
    });
  });

  describe('getLikeOperator', () => {
    it('should return LIKE for MySQL', () => {
      const operator = dialect.getLikeOperator();

      expect(operator).toBe('LIKE');
    });
  });
});
