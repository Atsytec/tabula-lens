import { describe, it, expect, vi } from 'vitest';
import { validateProps } from './propValidation';
import type {
  DatabaseViewerProps,
  TableSelectorMode,
  FilterPosition,
  PaginationPosition,
} from '../DatabaseViewer.types';

describe('propValidation', () => {
  const defaultProps = {
    path: '/api/data',
  };

  describe('required props', () => {
    it('should throw error when path is missing', () => {
      expect(() => validateProps({} as DatabaseViewerProps)).toThrow(
        'Invalid props passed to DatabaseViewer'
      );
    });

    it('should throw error when path is not a string', () => {
      expect(() => validateProps({ path: 123 } as unknown as DatabaseViewerProps)).toThrow(
        'Invalid props passed to DatabaseViewer'
      );
    });

    it('should not throw error for valid path', () => {
      expect(() => validateProps(defaultProps)).not.toThrow();
    });
  });

  describe('tableSelector validation', () => {
    it('should throw error for invalid tableSelector mode', () => {
      expect(() =>
        validateProps({ ...defaultProps, tableSelector: 'invalid' as TableSelectorMode })
      ).toThrow('Invalid props passed to DatabaseViewer');
    });

    it('should not throw error for valid tableSelector modes', () => {
      (['dropdown', 'sidebar', 'none'] as TableSelectorMode[]).forEach((mode) => {
        expect(() => validateProps({ ...defaultProps, tableSelector: mode })).not.toThrow();
      });
    });
  });

  describe('filterPosition validation', () => {
    it('should throw error for invalid filterPosition', () => {
      expect(() =>
        validateProps({ ...defaultProps, filterPosition: 'invalid' as FilterPosition })
      ).toThrow('Invalid props passed to DatabaseViewer');
    });

    it('should not throw error for valid filterPosition values', () => {
      (['top', 'bottom', 'both'] as FilterPosition[]).forEach((position) => {
        expect(() => validateProps({ ...defaultProps, filterPosition: position })).not.toThrow();
      });
    });
  });

  describe('paginationPosition validation', () => {
    it('should throw error for invalid paginationPosition', () => {
      expect(() =>
        validateProps({ ...defaultProps, paginationPosition: 'invalid' as PaginationPosition })
      ).toThrow('Invalid props passed to DatabaseViewer');
    });

    it('should not throw error for valid paginationPosition values', () => {
      (['top', 'bottom', 'both'] as PaginationPosition[]).forEach((position) => {
        expect(() =>
          validateProps({ ...defaultProps, paginationPosition: position })
        ).not.toThrow();
      });
    });
  });

  describe('pageSize validation', () => {
    it('should throw error for negative pageSize', () => {
      expect(() => validateProps({ ...defaultProps, pageSize: -1 })).toThrow(
        'Invalid props passed to DatabaseViewer'
      );
    });

    it('should throw error for zero pageSize', () => {
      expect(() => validateProps({ ...defaultProps, pageSize: 0 })).toThrow(
        'Invalid props passed to DatabaseViewer'
      );
    });

    it('should not throw error for positive pageSize', () => {
      expect(() => validateProps({ ...defaultProps, pageSize: 25 })).not.toThrow();
    });
  });

  describe('pageSizeOptions validation', () => {
    it('should throw error for non-array pageSizeOptions', () => {
      expect(() =>
        validateProps({ ...defaultProps, pageSizeOptions: 'invalid' as unknown as number[] })
      ).toThrow('Invalid props passed to DatabaseViewer');
    });

    it('should throw error for pageSizeOptions with negative numbers', () => {
      expect(() => validateProps({ ...defaultProps, pageSizeOptions: [10, -5, 50] })).toThrow(
        'Invalid props passed to DatabaseViewer'
      );
    });

    it('should not throw error for valid pageSizeOptions', () => {
      expect(() =>
        validateProps({ ...defaultProps, pageSizeOptions: [10, 25, 50, 100] })
      ).not.toThrow();
    });
  });

  describe('filterDebounceMs validation', () => {
    it('should throw error for negative filterDebounceMs', () => {
      expect(() => validateProps({ ...defaultProps, filterDebounceMs: -100 })).toThrow(
        'Invalid props passed to DatabaseViewer'
      );
    });

    it('should not throw error for valid filterDebounceMs', () => {
      expect(() => validateProps({ ...defaultProps, filterDebounceMs: 300 })).not.toThrow();
    });
  });

  describe('refetchInterval validation', () => {
    it('should throw error for negative refetchInterval', () => {
      expect(() => validateProps({ ...defaultProps, refetchInterval: -1000 })).toThrow(
        'Invalid props passed to DatabaseViewer'
      );
    });

    it('should not throw error for valid refetchInterval', () => {
      expect(() => validateProps({ ...defaultProps, refetchInterval: 5000 })).not.toThrow();
    });
  });

  describe('custom component validation', () => {
    it('should throw error for invalid tableSelectorComponent', () => {
      expect(() =>
        validateProps({ ...defaultProps, tableSelectorComponent: 'invalid' as unknown as React.FC })
      ).toThrow('Invalid props passed to DatabaseViewer');
    });

    it('should throw error for invalid filterComponent', () => {
      expect(() =>
        validateProps({ ...defaultProps, filterComponent: 'invalid' as unknown as React.FC })
      ).toThrow('Invalid props passed to DatabaseViewer');
    });

    it('should throw error for invalid paginationComponent', () => {
      expect(() =>
        validateProps({ ...defaultProps, paginationComponent: 'invalid' as unknown as React.FC })
      ).toThrow('Invalid props passed to DatabaseViewer');
    });

    it('should not throw error for valid custom components', () => {
      const mockComponent = () => null;
      expect(() =>
        validateProps({
          ...defaultProps,
          tableSelectorComponent: mockComponent,
          filterComponent: mockComponent,
          paginationComponent: mockComponent,
        })
      ).not.toThrow();
    });
  });

  describe('callback validation', () => {
    it('should throw error for invalid getAuthHeaders', () => {
      expect(() =>
        validateProps({
          ...defaultProps,
          getAuthHeaders: 'invalid' as unknown as () => Promise<Record<string, string>>,
        })
      ).toThrow('Invalid props passed to DatabaseViewer');
    });

    it('should throw error for invalid onError', () => {
      expect(() =>
        validateProps({ ...defaultProps, onError: 'invalid' as unknown as (error: Error) => void })
      ).toThrow('Invalid props passed to DatabaseViewer');
    });

    it('should not throw error for valid callbacks', () => {
      expect(() =>
        validateProps({
          ...defaultProps,
          getAuthHeaders: async () => ({}),
          onError: () => {},
        })
      ).not.toThrow();
    });
  });

  describe('defaultFilterColumns validation', () => {
    it('should throw error for non-object defaultFilterColumns', () => {
      expect(() =>
        validateProps({
          ...defaultProps,
          defaultFilterColumns: 'invalid' as unknown as Record<string, string[]>,
        })
      ).toThrow('Invalid props passed to DatabaseViewer');
    });

    it('should throw error for non-array column list', () => {
      expect(() =>
        validateProps({
          ...defaultProps,
          defaultFilterColumns: { users: 'invalid' as unknown as string[] },
        })
      ).toThrow('Invalid props passed to DatabaseViewer');
    });

    it('should throw error for non-string column names', () => {
      expect(() =>
        validateProps({
          ...defaultProps,
          defaultFilterColumns: { users: [123, 456] as unknown as string[] },
        })
      ).toThrow('Invalid props passed to DatabaseViewer');
    });

    it('should not throw error for valid defaultFilterColumns', () => {
      expect(() =>
        validateProps({
          ...defaultProps,
          defaultFilterColumns: {
            users: ['name', 'email'],
            products: ['title', 'description'],
          },
        })
      ).not.toThrow();
    });
  });

  describe('sortableColumns validation', () => {
    it('should throw error for non-array sortableColumns', () => {
      expect(() =>
        validateProps({ ...defaultProps, sortableColumns: 'invalid' as unknown as string[] })
      ).toThrow('Invalid props passed to DatabaseViewer');
    });

    it('should throw error for non-string column names', () => {
      expect(() =>
        validateProps({ ...defaultProps, sortableColumns: [123, 456] as unknown as string[] })
      ).toThrow('Invalid props passed to DatabaseViewer');
    });

    it('should not throw error for valid sortableColumns', () => {
      expect(() =>
        validateProps({ ...defaultProps, sortableColumns: ['name', 'email'] })
      ).not.toThrow();
    });
  });

  describe('defaultSort validation', () => {
    it('should throw error for non-object defaultSort', () => {
      expect(() =>
        validateProps({
          ...defaultProps,
          defaultSort: 'invalid' as unknown as { column: string; direction: 'asc' | 'desc' },
        })
      ).toThrow('Invalid props passed to DatabaseViewer');
    });

    it('should throw error for missing column', () => {
      expect(() =>
        validateProps({
          ...defaultProps,
          defaultSort: { direction: 'asc' } as unknown as {
            column: string;
            direction: 'asc' | 'desc';
          },
        })
      ).toThrow('Invalid props passed to DatabaseViewer');
    });

    it('should throw error for invalid direction', () => {
      expect(() =>
        validateProps({
          ...defaultProps,
          defaultSort: { column: 'name', direction: 'invalid' as 'asc' | 'desc' },
        })
      ).toThrow('Invalid props passed to DatabaseViewer');
    });

    it('should not throw error for valid defaultSort', () => {
      expect(() =>
        validateProps({ ...defaultProps, defaultSort: { column: 'name', direction: 'asc' } })
      ).not.toThrow();
    });
  });

  describe('multiple validation errors', () => {
    it('should report all validation errors', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error');
      expect(() =>
        validateProps({
          path: 123 as unknown as string,
          tableSelector: 'invalid' as TableSelectorMode,
          pageSize: -1,
        })
      ).toThrow('Invalid props passed to DatabaseViewer');

      expect(consoleErrorSpy).toHaveBeenCalled();
      const errorMessage = consoleErrorSpy.mock.calls[0][1];
      expect(errorMessage).toContain('prop "path" is required and must be a string');
      expect(errorMessage).toContain('prop "tableSelector" must be one of');
      expect(errorMessage).toContain('prop "pageSize" must be a positive number');

      consoleErrorSpy.mockRestore();
    });
  });
});
