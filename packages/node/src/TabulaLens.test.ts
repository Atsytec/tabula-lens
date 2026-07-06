import { describe, it, expect } from 'vitest';
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
});
