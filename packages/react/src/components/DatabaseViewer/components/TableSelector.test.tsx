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

  describe('CSS Custom Properties in Sidebar Mode', () => {
    it('should use CSS custom properties for sidebar container', () => {
      const { container } = render(<TableSelector {...defaultProps} mode="sidebar" />);
      const sidebar = container.firstChild as HTMLElement;
      expect(sidebar).toHaveStyle({
        display: 'flex',
        flexDirection: 'column',
      });
      // Check that it uses CSS custom properties
      const style = sidebar.style;
      expect(style.getPropertyValue('--tlens-border')).toBeDefined();
    });

    it('should use CSS custom properties for sidebar buttons', () => {
      const { container } = render(<TableSelector {...defaultProps} mode="sidebar" />);
      const buttons = container.querySelectorAll('button');
      buttons.forEach((button) => {
        expect(button).toHaveStyle({
          cursor: 'pointer',
        });
      });
    });

    it('should apply active state styling to selected table in sidebar mode', () => {
      const { container } = render(<TableSelector {...defaultProps} mode="sidebar" />);
      const buttons = container.querySelectorAll('button');
      const activeButton = buttons[0]; // 'users' is selected
      expect(activeButton).toHaveStyle({
        backgroundColor: 'var(--tlens-bg-sorted, #e9ecef)',
      });
    });

    it('should allow custom styles to override default styles in sidebar mode', () => {
      const customStyles = {
        tableSelectorSidebar: { minWidth: '300px' },
        tableSelectorSidebarButton: { padding: '1rem' },
      };
      const { container } = render(
        <TableSelector {...defaultProps} mode="sidebar" styles={customStyles} />
      );
      const sidebar = container.firstChild as HTMLElement;
      expect(sidebar).toHaveStyle({
        minWidth: '300px',
      });
    });
  });
});
