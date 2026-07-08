import { describe, it, expect } from 'vitest';
import { sanitizeColumnData } from './validationHelpers';

describe('validationHelpers', () => {
  describe('sanitizeColumnData double-escaping fix (D7)', () => {
    it('should not double-escape ampersands', () => {
      const result = sanitizeColumnData('Tom & Jerry');
      expect(result).toBe('Tom & Jerry');
    });

    it('should not double-escape less than signs', () => {
      const result = sanitizeColumnData('A < B');
      expect(result).toBe('A < B');
    });

    it('should not double-escape greater than signs', () => {
      const result = sanitizeColumnData('A > B');
      expect(result).toBe('A > B');
    });

    it('should not double-escape quotes', () => {
      const result = sanitizeColumnData('He said "hello"');
      expect(result).toBe('He said "hello"');
    });

    it('should not double-escape single quotes', () => {
      const result = sanitizeColumnData("It's fine");
      expect(result).toBe("It's fine");
    });

    it('should handle already escaped strings correctly', () => {
      const result = sanitizeColumnData('Tom &amp; Jerry');
      expect(result).toBe('Tom &amp; Jerry');
    });

    it('should convert null to empty string', () => {
      const result = sanitizeColumnData(null);
      expect(result).toBe('');
    });

    it('should convert undefined to empty string', () => {
      const result = sanitizeColumnData(undefined);
      expect(result).toBe('');
    });

    it('should convert numbers to string', () => {
      const result = sanitizeColumnData(42);
      expect(result).toBe('42');
    });

    it('should convert booleans to string', () => {
      const result = sanitizeColumnData(true);
      expect(result).toBe('true');
    });

    it('should convert objects to JSON string', () => {
      const result = sanitizeColumnData({ key: 'value' });
      expect(result).toBe('{"key":"value"}');
    });

    it('should handle objects with special characters', () => {
      const result = sanitizeColumnData({ name: 'Tom & Jerry' });
      expect(result).toBe('{"name":"Tom & Jerry"}');
    });

    it('should handle arrays', () => {
      const result = sanitizeColumnData([1, 2, 3]);
      expect(result).toBe('[1,2,3]');
    });

    it('should handle strings with mixed content', () => {
      const result = sanitizeColumnData('Price: $10 < $20 (20% off)');
      expect(result).toBe('Price: $10 < $20 (20% off)');
    });
  });
});
