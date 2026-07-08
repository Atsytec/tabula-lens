import { describe, it, expect } from 'vitest';
import { defaultStyles } from './defaultStyles';

describe('defaultStyles - Phase 2 CSS Custom Properties Migration', () => {
  describe('V1: CSS custom properties with --tlens-* prefix', () => {
    it('should use CSS custom property for primary color', () => {
      expect(defaultStyles.paginationButton?.backgroundColor).toBe('var(--tlens-primary, #3498db)');
    });

    it('should use CSS custom property for border color', () => {
      expect(defaultStyles.filterInput?.border).toBe('1px solid var(--tlens-border, #ddd)');
      expect(defaultStyles.tableWrapper?.border).toBe('1px solid var(--tlens-border, #ddd)');
    });

    it('should use CSS custom property for header background', () => {
      expect(defaultStyles.th?.backgroundColor).toBe('var(--tlens-bg-header, #f8f9fa)');
    });

    it('should use CSS custom property for error background', () => {
      expect(defaultStyles.error?.backgroundColor).toBe('var(--tlens-bg-error, #fee)');
    });

    it('should use CSS custom property for error color', () => {
      expect(defaultStyles.error?.color).toBe('var(--tlens-error, #c33)');
      expect(defaultStyles.retry?.backgroundColor).toBe('var(--tlens-error, #c33)');
    });

    it('should use CSS custom property for border radius', () => {
      expect(defaultStyles.filterInput?.borderRadius).toBe('var(--tlens-radius, 4px)');
      expect(defaultStyles.tableWrapper?.borderRadius).toBe('var(--tlens-radius, 4px)');
      expect(defaultStyles.paginationButton?.borderRadius).toBe('var(--tlens-radius, 4px)');
    });

    it('should use CSS custom property for text colors', () => {
      expect(defaultStyles.container?.color).toBe('var(--tlens-text-primary, #333)');
      expect(defaultStyles.empty?.color).toBe('var(--tlens-text-secondary, #666)');
      expect(defaultStyles.info?.color).toBe('var(--tlens-text-secondary, #666)');
    });

    it('should use CSS custom property for background colors', () => {
      expect(defaultStyles.table?.backgroundColor).toBe('var(--tlens-bg-white, white)');
    });

    it('should use CSS custom property for spacing', () => {
      expect(defaultStyles.container?.padding).toBe('var(--tlens-spacing-md, 1rem)');
      expect(defaultStyles.loading?.padding).toBe('var(--tlens-spacing-lg, 2rem)');
      expect(defaultStyles.th?.padding).toBe('var(--tlens-spacing-sm, 0.75rem)');
    });

    it('should use CSS custom property for font sizes', () => {
      expect(defaultStyles.filterInput?.fontSize).toBe('var(--tlens-font-size-base, 1rem)');
      expect(defaultStyles.info?.fontSize).toBe('var(--tlens-font-size-sm, 0.875rem)');
    });

    it('should provide fallback values in all var() calls', () => {
      // Check that all CSS custom properties have fallback values
      const stylesWithVars = [
        defaultStyles.container?.color,
        defaultStyles.paginationButton?.backgroundColor,
        defaultStyles.filterInput?.border,
        defaultStyles.th?.backgroundColor,
        defaultStyles.error?.backgroundColor,
        defaultStyles.error?.color,
        defaultStyles.filterInput?.borderRadius,
      ];

      stylesWithVars.forEach((style) => {
        if (style && typeof style === 'string' && style.includes('var(')) {
          expect(style).toMatch(/var\(--[^,]+,\s*[^)]+\)/);
        }
      });
    });
  });

  describe('V3: Remove hardcoded font family', () => {
    it('should not have fontFamily in container style', () => {
      expect(defaultStyles.container?.fontFamily).toBeUndefined();
    });

    it('should allow font family to be inherited from consumer DOM', () => {
      // This is tested by the absence of fontFamily in container
      expect(defaultStyles.container).toBeDefined();
      expect(defaultStyles.container?.fontFamily).toBeUndefined();
    });
  });

  describe('Backward compatibility', () => {
    it('should maintain all existing style properties', () => {
      expect(defaultStyles.container).toBeDefined();
      expect(defaultStyles.loading).toBeDefined();
      expect(defaultStyles.spinner).toBeDefined();
      expect(defaultStyles.error).toBeDefined();
      expect(defaultStyles.retry).toBeDefined();
      expect(defaultStyles.filter).toBeDefined();
      expect(defaultStyles.filterInput).toBeDefined();
      expect(defaultStyles.tableWrapper).toBeDefined();
      expect(defaultStyles.table).toBeDefined();
      expect(defaultStyles.th).toBeDefined();
      expect(defaultStyles.td).toBeDefined();
      expect(defaultStyles.empty).toBeDefined();
      expect(defaultStyles.sortable).toBeDefined();
      expect(defaultStyles.sorted).toBeDefined();
      expect(defaultStyles.pagination).toBeDefined();
      expect(defaultStyles.paginationButton).toBeDefined();
      expect(defaultStyles.paginationInfo).toBeDefined();
      expect(defaultStyles.pageSize).toBeDefined();
      expect(defaultStyles.info).toBeDefined();
      expect(defaultStyles.srOnly).toBeDefined();
    });

    it('should maintain the same structure as before', () => {
      const styleKeys = Object.keys(defaultStyles);
      const expectedKeys = [
        'container',
        'loading',
        'spinner',
        'error',
        'retry',
        'filter',
        'filterInput',
        'tableWrapper',
        'table',
        'th',
        'td',
        'empty',
        'sortable',
        'sorted',
        'pagination',
        'paginationButton',
        'paginationInfo',
        'pageSize',
        'info',
        'srOnly',
      ];

      expect(styleKeys).toEqual(expect.arrayContaining(expectedKeys));
      expect(styleKeys.length).toBe(expectedKeys.length);
    });
  });
});
