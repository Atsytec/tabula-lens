import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Pagination } from './Pagination';

describe('Pagination Accessibility', () => {
  const defaultProps = {
    pageIndex: 1,
    pageCount: 5,
    pageSize: 10,
    canPreviousPage: true,
    canNextPage: true,
    pageSizeOptions: [10, 25, 50],
    showPageSizeSelector: false,
    onPageChange: () => {},
    onPageSizeChange: () => {},
  };

  describe('aria-labels (A1)', () => {
    it('should have aria-label="First page" on first page button', () => {
      render(<Pagination {...defaultProps} />);
      const firstButton = screen.getByText('<<');
      expect(firstButton).toHaveAttribute('aria-label', 'First page');
    });

    it('should have aria-label="Previous page" on previous page button', () => {
      render(<Pagination {...defaultProps} />);
      const prevButton = screen.getByText('<');
      expect(prevButton).toHaveAttribute('aria-label', 'Previous page');
    });

    it('should have aria-label="Next page" on next page button', () => {
      render(<Pagination {...defaultProps} />);
      const nextButton = screen.getByText('>');
      expect(nextButton).toHaveAttribute('aria-label', 'Next page');
    });

    it('should have aria-label="Last page" on last page button', () => {
      render(<Pagination {...defaultProps} />);
      const lastButton = screen.getByText('>>');
      expect(lastButton).toHaveAttribute('aria-label', 'Last page');
    });

    it('should have aria-labels when buttons are disabled', () => {
      render(
        <Pagination {...defaultProps} pageIndex={0} canPreviousPage={false} canNextPage={false} />
      );
      const firstButton = screen.getByText('<<');
      const prevButton = screen.getByText('<');
      const nextButton = screen.getByText('>');
      const lastButton = screen.getByText('>>');

      expect(firstButton).toHaveAttribute('aria-label', 'First page');
      expect(prevButton).toHaveAttribute('aria-label', 'Previous page');
      expect(nextButton).toHaveAttribute('aria-label', 'Next page');
      expect(lastButton).toHaveAttribute('aria-label', 'Last page');
    });
  });
});
