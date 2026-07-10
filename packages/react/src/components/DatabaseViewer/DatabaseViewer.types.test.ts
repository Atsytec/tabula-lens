import { describe, it, expect } from 'vitest';
import type { DatabaseViewerProps } from './DatabaseViewer.types';

describe('DatabaseViewer.types', () => {
  describe('dead props removal (D1)', () => {
    it('should maintain all required props', () => {
      const props: DatabaseViewerProps = {
        path: '/api',
      };

      expect(props.path).toBe('/api');
    });

    it('should not have filterColumnSelectorPosition in type definition', () => {
      const props: Partial<DatabaseViewerProps> = {};

      // @ts-expect-error - This prop should not exist after removal
      const _invalidProp = props.filterColumnSelectorPosition;
      expect(_invalidProp).toBeUndefined();
    });

    it('should not have filterColumnSelectorComponent in type definition', () => {
      const props: Partial<DatabaseViewerProps> = {};

      // @ts-expect-error - This prop should not exist after removal
      const _invalidProp = props.filterColumnSelectorComponent;
      expect(_invalidProp).toBeUndefined();
    });
  });
});
