import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Pagination } from './Pagination';

describe('Pagination Phase 4 Features', () => {
  const defaultProps = {
    pageIndex: 0,
    pageCount: 5,
    pageSize: 10,
    canPreviousPage: false,
    canNextPage: true,
    pageSizeOptions: [10, 25, 50, 100],
    showPageSizeSelector: true,
    onPageChange: vi.fn(),
    onPageSizeChange: vi.fn(),
  };

  describe('I3 - Page Number Input Field', () => {
    it('should render page number input field', () => {
      render(<Pagination {...defaultProps} />);

      const pageInput = screen.getByRole('spinbutton', { name: /go to page/i });
      expect(pageInput).toBeInTheDocument();
    });

    it('should have correct initial value', () => {
      render(<Pagination {...defaultProps} pageIndex={2} />);

      const pageInput = screen.getByRole('spinbutton', { name: /go to page/i });
      expect(pageInput).toHaveValue(3); // pageIndex 2 = page 3 (1-indexed)
    });

    it('should navigate to entered page on valid input', () => {
      const onPageChange = vi.fn();
      render(<Pagination {...defaultProps} onPageChange={onPageChange} />);

      const pageInput = screen.getByRole('spinbutton', { name: /go to page/i });
      fireEvent.change(pageInput, { target: { value: '3' } });
      fireEvent.keyDown(pageInput, { key: 'Enter' });

      expect(onPageChange).toHaveBeenCalledWith(2); // page 3 = pageIndex 2
    });

    it('should not navigate on invalid page number', () => {
      const onPageChange = vi.fn();
      render(<Pagination {...defaultProps} onPageChange={onPageChange} />);

      const pageInput = screen.getByRole('spinbutton', { name: /go to page/i });
      fireEvent.change(pageInput, { target: { value: '10' } }); // beyond pageCount
      fireEvent.keyDown(pageInput, { key: 'Enter' });

      expect(onPageChange).not.toHaveBeenCalled();
    });

    it('should not navigate on negative page number', () => {
      const onPageChange = vi.fn();
      render(<Pagination {...defaultProps} onPageChange={onPageChange} />);

      const pageInput = screen.getByRole('spinbutton', { name: /go to page/i });
      fireEvent.change(pageInput, { target: { value: '-1' } });
      fireEvent.keyDown(pageInput, { key: 'Enter' });

      expect(onPageChange).not.toHaveBeenCalled();
    });

    it('should not navigate on zero page number', () => {
      const onPageChange = vi.fn();
      render(<Pagination {...defaultProps} onPageChange={onPageChange} />);

      const pageInput = screen.getByRole('spinbutton', { name: /go to page/i });
      fireEvent.change(pageInput, { target: { value: '0' } });
      fireEvent.keyDown(pageInput, { key: 'Enter' });

      expect(onPageChange).not.toHaveBeenCalled();
    });

    it('should have min and max attributes', () => {
      render(<Pagination {...defaultProps} pageCount={5} />);

      const pageInput = screen.getByRole('spinbutton', { name: /go to page/i });
      expect(pageInput).toHaveAttribute('min', '1');
      expect(pageInput).toHaveAttribute('max', '5');
    });

    it('should have aria-label for accessibility', () => {
      render(<Pagination {...defaultProps} />);

      const pageInput = screen.getByRole('spinbutton', { name: /go to page/i });
      expect(pageInput).toHaveAttribute('aria-label', 'Go to page');
    });

    it('should handle blur event for page change', () => {
      const onPageChange = vi.fn();
      render(<Pagination {...defaultProps} onPageChange={onPageChange} />);

      const pageInput = screen.getByRole('spinbutton', { name: /go to page/i });
      fireEvent.change(pageInput, { target: { value: '2' } });
      fireEvent.blur(pageInput);

      expect(onPageChange).toHaveBeenCalledWith(1); // page 2 = pageIndex 1
    });
  });

  describe('A7 - Visual Disabled State for Pagination Buttons', () => {
    it('should have disabled attribute on first and previous buttons when on first page', () => {
      render(<Pagination {...defaultProps} pageIndex={0} canPreviousPage={false} />);

      const firstButton = screen.getByLabelText('First page');
      const previousButton = screen.getByLabelText('Previous page');

      expect(firstButton).toBeDisabled();
      expect(previousButton).toBeDisabled();
    });

    it('should have disabled attribute on next and last buttons when on last page', () => {
      render(<Pagination {...defaultProps} pageIndex={4} pageCount={5} canNextPage={false} />);

      const nextButton = screen.getByLabelText('Next page');
      const lastButton = screen.getByLabelText('Last page');

      expect(nextButton).toBeDisabled();
      expect(lastButton).toBeDisabled();
    });

    it('should have all buttons enabled when not on first or last page', () => {
      render(
        <Pagination
          {...defaultProps}
          pageIndex={2}
          pageCount={5}
          canPreviousPage={true}
          canNextPage={true}
        />
      );

      const firstButton = screen.getByLabelText('First page');
      const previousButton = screen.getByLabelText('Previous page');
      const nextButton = screen.getByLabelText('Next page');
      const lastButton = screen.getByLabelText('Last page');

      expect(firstButton).not.toBeDisabled();
      expect(previousButton).not.toBeDisabled();
      expect(nextButton).not.toBeDisabled();
      expect(lastButton).not.toBeDisabled();
    });
  });
});
