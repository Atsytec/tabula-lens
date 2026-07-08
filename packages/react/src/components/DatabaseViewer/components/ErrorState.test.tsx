import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ErrorState } from './ErrorState';

describe('ErrorState Component - Phase 2 Enhancements', () => {
  const mockError = new Error('Test error message');
  const mockRetry = vi.fn();

  beforeEach(() => {
    mockRetry.mockClear();
    // Mock console.error to avoid cluttering test output
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('V5: Visual hierarchy with icons', () => {
    it('should display warning icon for recoverable errors', () => {
      render(<ErrorState error={mockError} onRetry={mockRetry} isRecoverable={true} />);
      expect(screen.getByText('⚠️')).toBeInTheDocument();
    });

    it('should display error icon for fatal errors', () => {
      render(<ErrorState error={mockError} onRetry={mockRetry} isRecoverable={false} />);
      expect(screen.getByText('❌')).toBeInTheDocument();
    });

    it('should display "Unable to Load Data" for recoverable errors', () => {
      render(<ErrorState error={mockError} onRetry={mockRetry} isRecoverable={true} />);
      expect(screen.getByText('Unable to Load Data')).toBeInTheDocument();
    });

    it('should display "Fatal Error" for non-recoverable errors', () => {
      render(<ErrorState error={mockError} onRetry={mockRetry} isRecoverable={false} />);
      expect(screen.getByText('Fatal Error')).toBeInTheDocument();
    });
  });

  describe('V5: Human-friendly error messages', () => {
    it('should show network error message for network-related errors', () => {
      const networkError = new Error('Network request failed');
      render(<ErrorState error={networkError} onRetry={mockRetry} />);
      expect(
        screen.getByText('Unable to connect to the server. Please check your internet connection.')
      ).toBeInTheDocument();
    });

    it('should show timeout message for timeout errors', () => {
      const timeoutError = new Error('Request timeout');
      render(<ErrorState error={timeoutError} onRetry={mockRetry} />);
      expect(screen.getByText('The request took too long. Please try again.')).toBeInTheDocument();
    });

    it('should show unauthorized message for 401 errors', () => {
      const authError = new Error('Unauthorized access');
      render(<ErrorState error={authError} onRetry={mockRetry} />);
      expect(
        screen.getByText("You don't have permission to access this data.")
      ).toBeInTheDocument();
    });

    it('should show not found message for 404 errors', () => {
      const notFoundError = new Error('Resource not found');
      render(<ErrorState error={notFoundError} onRetry={mockRetry} />);
      expect(screen.getByText('The requested data was not found.')).toBeInTheDocument();
    });

    it('should show server error message for 500 errors', () => {
      const serverError = new Error('Internal server error');
      render(<ErrorState error={serverError} onRetry={mockRetry} />);
      expect(
        screen.getByText('Something went wrong on our end. Please try again later.')
      ).toBeInTheDocument();
    });

    it('should show default message for unknown errors', () => {
      const unknownError = new Error('Some unknown error');
      render(<ErrorState error={unknownError} onRetry={mockRetry} />);
      expect(
        screen.getByText('An unexpected error occurred while loading the data.')
      ).toBeInTheDocument();
    });
  });

  describe('V5: Recoverable vs fatal error distinction', () => {
    it('should show retry button for recoverable errors', () => {
      render(<ErrorState error={mockError} onRetry={mockRetry} isRecoverable={true} />);
      expect(screen.getByText('Retry')).toBeInTheDocument();
    });

    it('should not show retry button for fatal errors', () => {
      render(<ErrorState error={mockError} onRetry={mockRetry} isRecoverable={false} />);
      expect(screen.queryByText('Retry')).not.toBeInTheDocument();
    });

    it('should call onRetry when retry button is clicked', () => {
      render(<ErrorState error={mockError} onRetry={mockRetry} isRecoverable={true} />);

      const retryButton = screen.getByText('Retry');
      retryButton.click();

      expect(mockRetry).toHaveBeenCalledTimes(1);
    });
  });

  describe('V5: Technical error logging', () => {
    it('should log error details to console', () => {
      render(<ErrorState error={mockError} onRetry={mockRetry} />);
      expect(console.error).toHaveBeenCalledWith('[Tabula Lens Error]', {
        message: 'Test error message',
        stack: mockError.stack,
        timestamp: expect.any(String),
      });
    });
  });

  describe('Backward compatibility', () => {
    it('should work without isRecoverable prop (defaults to true)', () => {
      render(<ErrorState error={mockError} onRetry={mockRetry} />);
      expect(screen.getByText('⚠️')).toBeInTheDocument();
      expect(screen.getByText('Unable to Load Data')).toBeInTheDocument();
      expect(screen.getByText('Retry')).toBeInTheDocument();
    });

    it('should still support customComponent', () => {
      const CustomComponent = () => <div>Custom Error State</div>;
      render(
        <ErrorState error={mockError} onRetry={mockRetry} customComponent={CustomComponent} />
      );
      expect(screen.getByText('Custom Error State')).toBeInTheDocument();
    });

    it('should still support custom styles', () => {
      render(
        <ErrorState
          error={mockError}
          onRetry={mockRetry}
          style={{ backgroundColor: 'red' }}
          styles={{ error: { color: 'blue' } }}
        />
      );
      const errorDiv = screen.getByText('Unable to Load Data').parentElement?.parentElement;
      // Check that the element exists and has a style attribute
      expect(errorDiv).toBeInTheDocument();
      expect(errorDiv?.getAttribute('style')).toBeTruthy();
    });

    it('should still support custom classNames', () => {
      const { container } = render(
        <ErrorState error={mockError} onRetry={mockRetry} className="custom-class" />
      );
      const errorDiv = container.querySelector('.custom-class');
      expect(errorDiv).toBeInTheDocument();
    });
  });
});
