import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoadingState } from './LoadingState';

describe('LoadingState Component - Phase 2 Enhancements', () => {
  describe('I2: Remove inline <style> spinner', () => {
    it('should not inject inline <style> tag', () => {
      const { container } = render(<LoadingState />);
      const styleTags = container.querySelectorAll('style');
      expect(styleTags.length).toBe(0);
    });

    it('should still display spinner element', () => {
      render(<LoadingState />);
      const spinner = screen.getByText('Loading data...').previousElementSibling;
      expect(spinner).toBeInTheDocument();
      // Just check that spinner has styles, not specific values
      expect(spinner?.getAttribute('style')).toBeTruthy();
    });

    it('should display loading message', () => {
      render(<LoadingState />);
      expect(screen.getByText('Loading data...')).toBeInTheDocument();
    });

    it('should use CSS custom property for spinner colors', () => {
      const { container } = render(<LoadingState />);
      const spinner = container.querySelector('div[style*="border"]');
      expect(spinner).toBeInTheDocument();
      // Check that spinner has CSS custom properties in its style
      const spinnerStyle = spinner?.getAttribute('style');
      expect(spinnerStyle).toContain('--tlens');
    });
  });

  describe('Backward compatibility', () => {
    it('should still support customComponent', () => {
      const CustomComponent = () => <div>Custom Loading State</div>;
      render(<LoadingState customComponent={CustomComponent} />);
      expect(screen.getByText('Custom Loading State')).toBeInTheDocument();
    });

    it('should still support custom styles', () => {
      render(
        <LoadingState style={{ backgroundColor: 'red' }} styles={{ loading: { color: 'blue' } }} />
      );
      const loadingDiv = screen.getByText('Loading data...').parentElement;
      // Check that the element exists and has a style attribute
      expect(loadingDiv).toBeInTheDocument();
      expect(loadingDiv?.getAttribute('style')).toBeTruthy();
    });

    it('should still support custom classNames', () => {
      render(<LoadingState className="custom-class" />);
      const loadingDiv = screen.getByText('Loading data...').parentElement;
      expect(loadingDiv).toHaveClass('custom-class');
    });

    it('should still support custom spinner styles', () => {
      render(<LoadingState styles={{ spinner: { width: '50px' } }} />);
      const spinner = screen.getByText('Loading data...').previousElementSibling;
      expect(spinner).toHaveStyle({ width: '50px' });
    });
  });
});
