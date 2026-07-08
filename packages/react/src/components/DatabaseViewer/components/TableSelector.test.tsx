import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TableSelector } from './TableSelector';

describe('TableSelector Accessibility', () => {
  const defaultProps = {
    mode: 'dropdown' as const,
    tables: ['users', 'products', 'orders'],
    selectedTable: 'users',
    label: 'Select Table',
    onSelectTable: () => {},
  };

  describe('label association (A4)', () => {
    it('should have label with htmlFor="table-selector" in dropdown mode', () => {
      const { container } = render(<TableSelector {...defaultProps} />);
      const label = container.querySelector('label');
      expect(label).toBeInTheDocument();
      expect(label).toHaveTextContent('Select Table:');
      expect(label.getAttribute('for')).toBe('table-selector');
    });

    it('should have id="table-selector" on select element in dropdown mode', () => {
      render(<TableSelector {...defaultProps} />);
      const select = screen.getByRole('combobox');
      expect(select).toHaveAttribute('id', 'table-selector');
    });

    it('should associate label with select correctly in dropdown mode', () => {
      const { container } = render(<TableSelector {...defaultProps} />);
      const label = container.querySelector('label');
      const select = screen.getByRole('combobox');

      expect(label.getAttribute('for')).toBe('table-selector');
      expect(select).toHaveAttribute('id', 'table-selector');
    });

    it('should not render label in sidebar mode (different UI pattern)', () => {
      render(<TableSelector {...defaultProps} mode="sidebar" />);
      const label = screen.queryByText('Select Table:');
      // In sidebar mode, it's a div, not a label
      const header = screen.getByText('Select Table');
      expect(header.tagName).toBe('DIV');
      expect(label).not.toBeInTheDocument();
    });

    it('should not render anything in none mode', () => {
      const { container } = render(<TableSelector {...defaultProps} mode="none" />);
      expect(container.firstChild).toBeNull();
    });
  });
});
