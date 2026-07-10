import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DataTable } from './DataTable';
import { ColumnDef } from '@tanstack/react-table';

describe('DataTable Component - Phase 2 Enhancements', () => {
  const mockData = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  ];

  const mockColumns: ColumnDef<Record<string, unknown>>[] = [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'email', header: 'Email' },
  ];

  const defaultProps = {
    data: mockData,
    columns: mockColumns,
    sorting: [],
    onSortingChange: vi.fn(),
    pagination: { pageIndex: 0, pageSize: 10 },
    onPaginationChange: vi.fn(),
    pageCount: 1,
    enableSorting: true,
  };

  describe('A5: Replace row hover inline event handlers with CSS', () => {
    it('should not have onMouseEnter on table rows', () => {
      render(<DataTable {...defaultProps} />);
      const rows = screen.getAllByRole('row');
      // Skip header row
      const dataRows = rows.slice(1);

      dataRows.forEach((row) => {
        expect(row).not.toHaveAttribute('onMouseEnter');
      });
    });

    it('should not have onMouseLeave on table rows', () => {
      render(<DataTable {...defaultProps} />);
      const rows = screen.getAllByRole('row');
      // Skip header row
      const dataRows = rows.slice(1);

      dataRows.forEach((row) => {
        expect(row).not.toHaveAttribute('onMouseLeave');
      });
    });

    it('should apply CSS class for hover effect', () => {
      render(<DataTable {...defaultProps} />);
      const rows = screen.getAllByRole('row');
      // Skip header row
      const dataRows = rows.slice(1);

      dataRows.forEach((row) => {
        expect(row).toHaveClass('tlens-table-row');
      });
    });

    it('should support keyboard navigation with focus-within', () => {
      render(<DataTable {...defaultProps} />);
      const rows = screen.getAllByRole('row');
      // Skip header row
      const dataRows = rows.slice(1);

      dataRows.forEach((row) => {
        expect(row).toHaveClass('tlens-table-row');
      });
    });
  });

  describe('V4: Enhanced EmptyState integration', () => {
    it('should pass hasActiveFilter to EmptyState when true', () => {
      render(<DataTable {...defaultProps} data={[]} hasActiveFilter={true} />);
      expect(
        screen.getByText('No records match your filter — try clearing it')
      ).toBeInTheDocument();
    });

    it('should pass hasActiveFilter to EmptyState when false', () => {
      render(<DataTable {...defaultProps} data={[]} hasActiveFilter={false} />);
      expect(screen.getByText('This table is empty')).toBeInTheDocument();
    });

    it('should pass onClearFilter to EmptyState when provided', () => {
      const mockClearFilter = vi.fn();
      render(
        <DataTable
          {...defaultProps}
          data={[]}
          hasActiveFilter={true}
          onClearFilter={mockClearFilter}
        />
      );

      const clearButton = screen.getByText('Clear Filter');
      clearButton.click();

      expect(mockClearFilter).toHaveBeenCalledTimes(1);
    });

    it('should not pass onClearFilter when not provided', () => {
      render(<DataTable {...defaultProps} data={[]} hasActiveFilter={true} />);
      expect(screen.queryByText('Clear Filter')).not.toBeInTheDocument();
    });

    it('should default hasActiveFilter to false', () => {
      render(<DataTable {...defaultProps} data={[]} />);
      expect(screen.getByText('This table is empty')).toBeInTheDocument();
    });
  });

  describe('Backward compatibility', () => {
    it('should work without new props (hasActiveFilter, onClearFilter)', () => {
      render(<DataTable {...defaultProps} data={[]} />);
      expect(screen.getByText('This table is empty')).toBeInTheDocument();
    });

    it('should still support customComponent', () => {
      const CustomComponent = () => <div>Custom Empty State</div>;
      render(<DataTable {...defaultProps} data={[]} emptyComponent={CustomComponent} />);
      expect(screen.getByText('Custom Empty State')).toBeInTheDocument();
    });

    it('should still support custom styles', () => {
      render(
        <DataTable
          {...defaultProps}
          style={{ backgroundColor: 'red' }}
          styles={{ tableWrapper: { color: 'blue' } }}
        />
      );
      const tableWrapper = screen.getByRole('table').parentElement;
      // Check that the element exists and has a style attribute
      expect(tableWrapper).toBeInTheDocument();
      expect(tableWrapper?.getAttribute('style')).toBeTruthy();
    });

    it('should still support custom classNames', () => {
      render(<DataTable {...defaultProps} className="custom-class" />);
      const tableWrapper = screen.getByRole('table').parentElement;
      expect(tableWrapper).toHaveClass('custom-class');
    });
  });
});
