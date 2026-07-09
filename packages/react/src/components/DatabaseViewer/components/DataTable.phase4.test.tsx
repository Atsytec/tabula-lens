import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DataTable } from './DataTable';

describe('DataTable Phase 4 Features', () => {
  const mockData = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  ];

  const mockColumns = [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'email', header: 'Email' },
  ];

  const mockDataWithAcronyms = [
    { name: 'John Doe', api_key: 'abc123', user_id: 1 },
    { name: 'Jane Smith', api_key: 'def456', user_id: 2 },
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

  describe('V6 - Column Header Formatter', () => {
    it('should use custom formatHeader function when provided', () => {
      const formatHeader = (columnName: string) => `Custom: ${columnName.toUpperCase()}`;
      render(<DataTable {...defaultProps} formatHeader={formatHeader} />);

      const headers = screen.getAllByRole('columnheader');
      expect(headers[0]).toHaveTextContent('Custom: ID');
      expect(headers[1]).toHaveTextContent('Custom: NAME');
      expect(headers[2]).toHaveTextContent('Custom: EMAIL');
    });

    it('should apply default humanization when formatHeader is not provided', () => {
      const columnsWithRawHeaders = [
        { accessorKey: 'id', header: 'id' },
        { accessorKey: 'user_name', header: 'user_name' },
        { accessorKey: 'created_at', header: 'created_at' },
      ];

      render(<DataTable {...defaultProps} columns={columnsWithRawHeaders} />);

      const headers = screen.getAllByRole('columnheader');
      expect(headers[0]).toHaveTextContent('Id');
      expect(headers[1]).toHaveTextContent('User Name');
      expect(headers[2]).toHaveTextContent('Created At');
    });

    it('should allow opt-out of default formatting with null formatHeader', () => {
      const columnsWithRawHeaders = [
        { accessorKey: 'id', header: 'id' },
        { accessorKey: 'user_name', header: 'user_name' },
      ];

      render(<DataTable {...defaultProps} columns={columnsWithRawHeaders} formatHeader={null} />);

      const headers = screen.getAllByRole('columnheader');
      expect(headers[0]).toHaveTextContent('id');
      expect(headers[1]).toHaveTextContent('user_name');
    });

    it('should handle acronyms correctly in default humanization', () => {
      const columnsWithAcronyms = [
        { accessorKey: 'name', header: 'name' },
        { accessorKey: 'api_key', header: 'api_key' },
        { accessorKey: 'user_id', header: 'user_id' },
      ];

      render(
        <DataTable {...defaultProps} data={mockDataWithAcronyms} columns={columnsWithAcronyms} />
      );

      const headers = screen.getAllByRole('columnheader');
      expect(headers[0]).toHaveTextContent('Name');
      expect(headers[1]).toHaveTextContent('API Key');
      expect(headers[2]).toHaveTextContent('User ID');
    });
  });

  describe('MF1 - Cell Value Formatter', () => {
    it('should use custom formatCell function when provided', () => {
      const formatCell = (value: unknown, column: string) => {
        if (column === 'email' && typeof value === 'string') {
          return <a href={`mailto:${value}`}>{value}</a>;
        }
        return value;
      };

      render(<DataTable {...defaultProps} formatCell={formatCell} />);

      const emailLinks = screen.getAllByRole('link');
      expect(emailLinks).toHaveLength(2);
      expect(emailLinks[0]).toHaveAttribute('href', 'mailto:john@example.com');
      expect(emailLinks[1]).toHaveAttribute('href', 'mailto:jane@example.com');
    });

    it('should render badges for status columns using formatCell', () => {
      const statusData = [
        { id: 1, name: 'John', status: 'active' },
        { id: 2, name: 'Jane', status: 'inactive' },
      ];

      const statusColumns = [
        { accessorKey: 'id', header: 'ID' },
        { accessorKey: 'name', header: 'Name' },
        { accessorKey: 'status', header: 'Status' },
      ];

      const formatCell = (value: unknown, column: string) => {
        if (column === 'status' && typeof value === 'string') {
          const color = value === 'active' ? 'green' : 'gray';
          return (
            <span style={{ backgroundColor: color, padding: '2px 8px', borderRadius: '4px' }}>
              {value}
            </span>
          );
        }
        return value;
      };

      render(
        <DataTable
          {...defaultProps}
          data={statusData}
          columns={statusColumns}
          formatCell={formatCell}
        />
      );

      const statusCells = screen.getAllByText(/active|inactive/);
      expect(statusCells).toHaveLength(2);
    });

    it('should handle null values in formatCell', () => {
      const dataWithNulls = [
        { id: 1, name: 'John', email: null },
        { id: 2, name: 'Jane', email: 'jane@example.com' },
      ];

      const formatCell = (value: unknown) => {
        if (value === null) return <em>Not provided</em>;
        return value;
      };

      render(<DataTable {...defaultProps} data={dataWithNulls} formatCell={formatCell} />);

      expect(screen.getByText('Not provided')).toBeInTheDocument();
      expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    });

    it('should render original value when formatCell is not provided', () => {
      render(<DataTable {...defaultProps} />);

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
    });
  });

  describe('A8 - Table Role and Scope Attributes', () => {
    it('should have role="table" on table element', () => {
      render(<DataTable {...defaultProps} />);
      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
    });

    it('should have scope="col" on all header cells', () => {
      render(<DataTable {...defaultProps} />);
      const headers = screen.getAllByRole('columnheader');
      headers.forEach((header) => {
        expect(header).toHaveAttribute('scope', 'col');
      });
    });

    it('should maintain role and scope with custom classNames', () => {
      render(
        <DataTable
          {...defaultProps}
          classNames={{ table: 'custom-table', header: 'custom-header' }}
        />
      );

      const table = screen.getByRole('table');
      expect(table).toHaveClass('custom-table');

      const headers = screen.getAllByRole('columnheader');
      headers.forEach((header) => {
        expect(header).toHaveAttribute('scope', 'col');
        expect(header).toHaveClass('custom-header');
      });
    });
  });
});
