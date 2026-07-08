import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DataTable } from './DataTable';

describe('DataTable Accessibility', () => {
  const mockData = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  ];

  const mockColumns = [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'email', header: 'Email' },
  ];

  const defaultProps = {
    data: mockData,
    columns: mockColumns,
    sorting: [],
    onSortingChange: () => {},
    pagination: { pageIndex: 0, pageSize: 10 },
    onPaginationChange: () => {},
    pageCount: 1,
    enableSorting: true,
  };

  describe('aria-sort on column headers (A2)', () => {
    it('should have aria-sort="none" on unsorted column headers', () => {
      render(<DataTable {...defaultProps} />);
      const headers = screen.getAllByRole('columnheader');
      headers.forEach((header) => {
        expect(header).toHaveAttribute('aria-sort', 'none');
      });
    });

    it('should have aria-sort="ascending" on ascending sorted column', () => {
      render(<DataTable {...defaultProps} sorting={[{ id: 'name', desc: false }]} />);
      const nameHeader = screen.getByText('Name');
      expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');
    });

    it('should have aria-sort="descending" on descending sorted column', () => {
      render(<DataTable {...defaultProps} sorting={[{ id: 'name', desc: true }]} />);
      const nameHeader = screen.getByText('Name');
      expect(nameHeader).toHaveAttribute('aria-sort', 'descending');
    });

    it('should not have aria-sort when sorting is disabled', () => {
      render(<DataTable {...defaultProps} enableSorting={false} />);
      const headers = screen.getAllByRole('columnheader');
      headers.forEach((header) => {
        expect(header).not.toHaveAttribute('aria-sort');
      });
    });

    it('should handle multiple sorted columns', () => {
      render(
        <DataTable
          {...defaultProps}
          sorting={[
            { id: 'name', desc: false },
            { id: 'email', desc: true },
          ]}
        />
      );
      const nameHeader = screen.getByText('Name');
      const emailHeader = screen.getByText('Email');

      expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');
      expect(emailHeader).toHaveAttribute('aria-sort', 'descending');
    });
  });
});
