import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FilterInput } from './FilterInput';

describe('FilterInput Accessibility', () => {
  const defaultProps = {
    value: '',
    onChange: () => {},
  };

  describe('proper label association (A3)', () => {
    it('should have a visually hidden label with htmlFor="db-filter"', () => {
      const { container } = render(<FilterInput {...defaultProps} />);
      const label = container.querySelector('label');
      expect(label).toBeInTheDocument();
      expect(label).toHaveTextContent('Filter records');
      // Check that the label has the for attribute (htmlFor in JSX, for in HTML)
      expect(label.getAttribute('for')).toBe('db-filter');
    });

    it('should have id="db-filter" on the input element', () => {
      render(<FilterInput {...defaultProps} />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('id', 'db-filter');
    });

    it('should associate label with input correctly', () => {
      const { container } = render(<FilterInput {...defaultProps} />);
      const label = container.querySelector('label');
      const input = screen.getByRole('textbox');

      expect(label.getAttribute('for')).toBe('db-filter');
      expect(input).toHaveAttribute('id', 'db-filter');
    });

    it('should have sr-only styles for visually hidden label', () => {
      const { container } = render(<FilterInput {...defaultProps} />);
      const label = container.querySelector('label');
      // React 19 may handle style properties differently, so check computed styles
      const style = window.getComputedStyle(label);
      expect(style.position).toBe('absolute');
      expect(style.width).toBe('1px');
      expect(style.height).toBe('1px');
      expect(style.padding).toBe('0px');
      expect(style.margin).toBe('-1px');
      expect(style.overflow).toBe('hidden');
      // border property may be computed as full shorthand in React 19
      expect(style.border).toMatch(/0px/);
      // clip property format may vary between browsers/React versions
      expect(style.clip).toContain('rect');
      expect(style.whiteSpace).toBe('nowrap');
    });

    it('should maintain label association with custom placeholder', () => {
      const { container } = render(<FilterInput {...defaultProps} placeholder="Search data..." />);
      const label = container.querySelector('label');
      const input = screen.getByPlaceholderText('Search data...');

      expect(label.getAttribute('for')).toBe('db-filter');
      expect(input).toHaveAttribute('id', 'db-filter');
    });
  });
});
