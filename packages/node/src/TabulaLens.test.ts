import { describe, it, expect, vi } from 'vitest';
import { TabulaLens, QueryOptions, SortOption, FilterOption } from './TabulaLens';

describe('TabulaLens', () => {
  describe('parseSort (private method)', () => {
    it('should parse single sort option', () => {
      const tabulaLens = new TabulaLens('postgresql://test');
      const sortString = 'name:desc';

      // Access private method for testing
      const parseSort = (
        tabulaLens as unknown as { parseSort: (sortString: string) => SortOption[] }
      ).parseSort.bind(tabulaLens);
      const result = parseSort(sortString);

      expect(result).toEqual([{ column: 'name', direction: 'desc' }]);
    });

    it('should parse multiple sort options', () => {
      const tabulaLens = new TabulaLens('postgresql://test');
      const sortString = 'name:asc,id:desc';

      const parseSort = (
        tabulaLens as unknown as { parseSort: (sortString: string) => SortOption[] }
      ).parseSort.bind(tabulaLens);
      const result = parseSort(sortString);

      expect(result).toEqual([
        { column: 'name', direction: 'asc' },
        { column: 'id', direction: 'desc' },
      ]);
    });

    it('should default to asc when no direction provided', () => {
      const tabulaLens = new TabulaLens('postgresql://test');
      const sortString = 'name';

      const parseSort = (
        tabulaLens as unknown as { parseSort: (sortString: string) => SortOption[] }
      ).parseSort.bind(tabulaLens);
      const result = parseSort(sortString);

      expect(result).toEqual([{ column: 'name', direction: 'asc' }]);
    });

    it('should default to id when no column provided', () => {
      const tabulaLens = new TabulaLens('postgresql://test');
      const sortString = ':desc';

      const parseSort = (
        tabulaLens as unknown as { parseSort: (sortString: string) => SortOption[] }
      ).parseSort.bind(tabulaLens);
      const result = parseSort(sortString);

      expect(result).toEqual([{ column: 'id', direction: 'desc' }]);
    });
  });

  describe('constructor', () => {
    it('should initialize with database URL', () => {
      const tabulaLens = new TabulaLens('postgresql://test');
      expect(tabulaLens).toBeInstanceOf(TabulaLens);
    });
  });

  describe('QueryOptions interface', () => {
    it('should accept valid query options', () => {
      const options: QueryOptions = {
        table: 'users',
        page: 1,
        limit: 10,
        sort: 'name:asc',
        filter: 'test',
        columns: ['id', 'name'],
      };

      expect(options.table).toBe('users');
      expect(options.page).toBe(1);
      expect(options.limit).toBe(10);
    });

    it('should accept partial query options', () => {
      const options: QueryOptions = {
        table: 'users',
        page: 2,
      };

      expect(options.table).toBe('users');
      expect(options.page).toBe(2);
      expect(options.limit).toBeUndefined();
    });
  });

  describe('SortOption interface', () => {
    it('should accept valid sort option', () => {
      const sort: SortOption = {
        column: 'name',
        direction: 'asc',
      };

      expect(sort.column).toBe('name');
      expect(sort.direction).toBe('asc');
    });
  });

  describe('FilterOption interface', () => {
    it('should accept valid filter option', () => {
      const filter: FilterOption = {
        column: 'name',
        operator: 'like',
        value: 'test',
      };

      expect(filter.column).toBe('name');
      expect(filter.operator).toBe('like');
      expect(filter.value).toBe('test');
    });

    it('should accept numeric filter value', () => {
      const filter: FilterOption = {
        column: 'age',
        operator: 'gt',
        value: 25,
      };

      expect(filter.value).toBe(25);
    });
  });

  describe('sorting validation', () => {
    it('should parse sort options correctly', () => {
      const tabulaLens = new TabulaLens('postgresql://test');
      const sortString = 'name:asc,created_at:desc';

      const parseSort = (
        tabulaLens as unknown as { parseSort: (sortString: string) => SortOption[] }
      ).parseSort.bind(tabulaLens);
      const result = parseSort(sortString);

      expect(result).toEqual([
        { column: 'name', direction: 'asc' },
        { column: 'created_at', direction: 'desc' },
      ]);
    });

    it('should handle invalid sort format gracefully', () => {
      const tabulaLens = new TabulaLens('postgresql://test');
      const sortString = 'invalid::format';

      const parseSort = (
        tabulaLens as unknown as { parseSort: (sortString: string) => SortOption[] }
      ).parseSort.bind(tabulaLens);
      const result = parseSort(sortString);

      // Should not throw and should return some default
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle empty sort string', () => {
      const tabulaLens = new TabulaLens('postgresql://test');
      const sortString = '';

      const parseSort = (
        tabulaLens as unknown as { parseSort: (sortString: string) => SortOption[] }
      ).parseSort.bind(tabulaLens);
      const result = parseSort(sortString);

      // Should handle empty string gracefully
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should use first available column as fallback when no valid sort columns', async () => {
      const tabulaLens = new TabulaLens('postgresql://test');

      // Mock getFilterableColumns to return specific columns
      const originalGetFilterableColumns = tabulaLens['getFilterableColumns'];
      tabulaLens['getFilterableColumns'] = vi
        .fn()
        .mockResolvedValue(['email', 'name', 'created_at']);

      // Mock the database query
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        modify: vi.fn().mockReturnThis(),
        count: vi.fn().mockReturnThis(),
        first: vi.fn().mockResolvedValue({ count: 0 }),
        orderBy: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        offset: vi.fn().mockResolvedValue([]),
      };

      tabulaLens['db'] = vi.fn().mockReturnValue(mockQuery);

      const options: QueryOptions = {
        table: 'users',
        sort: 'nonexistent:asc',
      };

      await tabulaLens.query(options);

      // Should fall back to first available column ('email')
      expect(mockQuery.orderBy).toHaveBeenCalledWith('email', 'asc');

      // Restore original method
      tabulaLens['getFilterableColumns'] = originalGetFilterableColumns;
    });

    it('should use first available column as default when no sort specified', async () => {
      const tabulaLens = new TabulaLens('postgresql://test');

      // Mock getFilterableColumns to return specific columns
      const originalGetFilterableColumns = tabulaLens['getFilterableColumns'];
      tabulaLens['getFilterableColumns'] = vi.fn().mockResolvedValue(['name', 'email', 'id']);

      // Mock the database query
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        modify: vi.fn().mockReturnThis(),
        count: vi.fn().mockReturnThis(),
        first: vi.fn().mockResolvedValue({ count: 0 }),
        orderBy: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        offset: vi.fn().mockResolvedValue([]),
      };

      tabulaLens['db'] = vi.fn().mockReturnValue(mockQuery);

      const options: QueryOptions = {
        table: 'users',
        // No sort parameter
      };

      await tabulaLens.query(options);

      // Should use first available column ('name') as default
      expect(mockQuery.orderBy).toHaveBeenCalledWith('name', 'asc');

      // Restore original method
      tabulaLens['getFilterableColumns'] = originalGetFilterableColumns;
    });

    it('should handle tables with no columns gracefully', async () => {
      const tabulaLens = new TabulaLens('postgresql://test');

      // Mock getFilterableColumns to return empty array
      const originalGetFilterableColumns = tabulaLens['getFilterableColumns'];
      tabulaLens['getFilterableColumns'] = vi.fn().mockResolvedValue([]);

      // Mock the database query
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        modify: vi.fn().mockReturnThis(),
        count: vi.fn().mockReturnThis(),
        first: vi.fn().mockResolvedValue({ count: 0 }),
        orderBy: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        offset: vi.fn().mockResolvedValue([]),
      };

      tabulaLens['db'] = vi.fn().mockReturnValue(mockQuery);

      const options: QueryOptions = {
        table: 'users',
        sort: 'name:asc',
      };

      // Should not throw error
      const result = await tabulaLens.query(options);
      expect(result).toBeDefined();

      // Should not call orderBy since no columns available
      expect(mockQuery.orderBy).not.toHaveBeenCalled();

      // Restore original method
      tabulaLens['getFilterableColumns'] = originalGetFilterableColumns;
    });
  });
});
