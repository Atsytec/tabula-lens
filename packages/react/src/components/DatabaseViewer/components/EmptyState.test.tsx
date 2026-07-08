import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EmptyState } from './EmptyState';

describe('EmptyState Component - Phase 2 Enhancements', () => {
  describe('V4: Context-aware messaging', () => {
    it('should show "This table is empty" when no active filter', () => {
      render(<EmptyState />);
      expect(screen.getByText('This table is empty')).toBeInTheDocument();
    });

    it('should show filter-related message when active filter exists', () => {
      render(<EmptyState hasActiveFilter={true} />);
      expect(
        screen.getByText('No records match your filter — try clearing it')
      ).toBeInTheDocument();
    });

    it('should display appropriate icon for empty table', () => {
      render(<EmptyState />);
      expect(screen.getByText('📭')).toBeInTheDocument();
    });

    it('should display search icon when filter is active', () => {
      render(<EmptyState hasActiveFilter={true} />);
      expect(screen.getByText('🔍')).toBeInTheDocument();
    });
  });

  describe('V4: Clear filter button', () => {
    it('should not show clear button when no active filter', () => {
      render(<EmptyState hasActiveFilter={false} />);
      expect(screen.queryByText('Clear Filter')).not.toBeInTheDocument();
    });

    it('should show clear button when active filter exists', () => {
      render(<EmptyState hasActiveFilter={true} onClearFilter={() => {}} />);
      expect(screen.getByText('Clear Filter')).toBeInTheDocument();
    });

    it('should call onClearFilter when button is clicked', () => {
      const mockClearFilter = vi.fn();
      render(<EmptyState hasActiveFilter={true} onClearFilter={mockClearFilter} />);

      const clearButton = screen.getByText('Clear Filter');
      clearButton.click();

      expect(mockClearFilter).toHaveBeenCalledTimes(1);
    });

    it('should not show clear button when hasActiveFilter but no onClearFilter', () => {
      render(<EmptyState hasActiveFilter={true} />);
      expect(screen.queryByText('Clear Filter')).not.toBeInTheDocument();
    });
  });

  describe('Backward compatibility', () => {
    it('should work without new props (hasActiveFilter, onClearFilter)', () => {
      render(<EmptyState />);
      expect(screen.getByText('This table is empty')).toBeInTheDocument();
      expect(screen.getByText('📭')).toBeInTheDocument();
    });

    it('should still support customComponent', () => {
      const CustomComponent = () => <div>Custom Empty State</div>;
      render(<EmptyState customComponent={CustomComponent} />);
      expect(screen.getByText('Custom Empty State')).toBeInTheDocument();
    });

    it('should still support custom styles', () => {
      render(
        <EmptyState style={{ backgroundColor: 'red' }} styles={{ empty: { color: 'blue' } }} />
      );
      const emptyDiv = screen.getByText('This table is empty').parentElement;
      // Check that the element exists and has a style attribute
      expect(emptyDiv).toBeInTheDocument();
      expect(emptyDiv?.getAttribute('style')).toBeTruthy();
    });

    it('should still support custom classNames', () => {
      render(<EmptyState className="custom-class" />);
      const emptyDiv = screen.getByText('This table is empty').parentElement;
      expect(emptyDiv).toHaveClass('custom-class');
    });
  });
});
