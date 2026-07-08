import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FilterColumnSelector } from './FilterColumnSelector';

describe('FilterColumnSelector Accessibility', () => {
  const defaultProps = {
    availableColumns: ['id', 'name', 'email', 'created_at'],
    selectedColumns: ['id', 'name', 'email'],
    defaultColumns: ['id', 'name'],
    onSelectionChange: () => {},
    onResetToDefault: () => {},
  };

  describe('ARIA role and attributes (A6)', () => {
    it('should have role="listbox" on dropdown panel when open', () => {
      render(<FilterColumnSelector {...defaultProps} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      const dropdown = screen.queryByRole('listbox');
      expect(dropdown).toBeInTheDocument();
    });

    it('should have aria-modal="true" on dropdown panel when open', () => {
      render(<FilterColumnSelector {...defaultProps} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      const dropdown = screen.queryByRole('listbox');
      expect(dropdown).toHaveAttribute('aria-modal', 'true');
    });

    it('should have aria-label on dropdown panel when open', () => {
      render(<FilterColumnSelector {...defaultProps} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      const dropdown = screen.queryByRole('listbox');
      expect(dropdown).toHaveAttribute('aria-label');
    });

    it('should have aria-expanded on trigger button', () => {
      render(<FilterColumnSelector {...defaultProps} />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-expanded', 'false');

      fireEvent.click(button);
      expect(button).toHaveAttribute('aria-expanded', 'true');
    });

    it('should have aria-haspopup on trigger button', () => {
      render(<FilterColumnSelector {...defaultProps} />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-haspopup', 'true');
    });

    it('should close dropdown when Escape key is pressed', () => {
      render(<FilterColumnSelector {...defaultProps} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      const dropdown = screen.queryByRole('listbox');
      expect(dropdown).toBeInTheDocument();

      fireEvent.keyDown(document, { key: 'Escape' });

      // Wait for the state to update
      const closedDropdown = screen.queryByRole('listbox');
      expect(closedDropdown).not.toBeInTheDocument();
    });

    it('should have proper role on checkbox items', () => {
      render(<FilterColumnSelector {...defaultProps} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes.length).toBeGreaterThan(0);
    });

    it('should use set-based comparison for Reset to Default button (I4)', () => {
      render(
        <FilterColumnSelector
          {...defaultProps}
          selectedColumns={['name', 'id']}
          defaultColumns={['id', 'name']}
        />
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      const resetButton = screen.getByText('Reset to Default');
      // Should be disabled because the sets are the same, regardless of order
      expect(resetButton).toBeDisabled();
    });
  });
});
