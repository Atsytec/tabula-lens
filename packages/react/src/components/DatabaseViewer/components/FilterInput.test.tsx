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
      expect(label).toHaveStyle({
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: 0,
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        border: 0,
      });
      // whiteSpace may be handled differently in React 19, so check it separately
      const style = window.getComputedStyle(label);
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
