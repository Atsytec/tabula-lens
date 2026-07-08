import React from 'react';

/**
 * Re-export Styles from the main types file for convenience
 * This allows importing style types directly from the styles directory
 */
export type { Styles, ClassNames } from '../DatabaseViewer.types';

/**
 * Style override interface for partial style customization
 * Allows overriding specific style properties while keeping defaults
 */
export interface StyleOverrides {
  container?: React.CSSProperties;
  tableWrapper?: React.CSSProperties;
  table?: React.CSSProperties;
  th?: React.CSSProperties;
  td?: React.CSSProperties;
  header?: React.CSSProperties;
  cell?: React.CSSProperties;
  sortable?: React.CSSProperties;
  sorted?: React.CSSProperties;
  filter?: React.CSSProperties;
  filterInput?: React.CSSProperties;
  pagination?: React.CSSProperties;
  paginationButton?: React.CSSProperties;
  paginationInfo?: React.CSSProperties;
  pageSize?: React.CSSProperties;
  tableSelector?: React.CSSProperties;
  tableSelectorDropdown?: React.CSSProperties;
  tableSelectorSidebar?: React.CSSProperties;
  empty?: React.CSSProperties;
  loading?: React.CSSProperties;
  spinner?: React.CSSProperties;
  error?: React.CSSProperties;
  retry?: React.CSSProperties;
  info?: React.CSSProperties;
}

/**
 * Theme configuration for consistent styling across components
 */
export interface Theme {
  /** Color palette */
  colors: {
    primary: string;
    secondary: string;
    error: string;
    success: string;
    warning: string;
    background: string;
    foreground: string;
    border: string;
  };
  /** Spacing scale */
  spacing: {
    small: string;
    medium: string;
    large: string;
    xlarge: string;
  };
  /** Typography settings */
  fonts: {
    primary: string;
    mono: string;
  };
  /** Border radius values */
  borderRadius: {
    small: string;
    medium: string;
    large: string;
  };
}

/**
 * Default theme configuration
 */
export const defaultTheme: Theme = {
  colors: {
    primary: '#3498db',
    secondary: '#6c757d',
    error: '#c33',
    success: '#28a745',
    warning: '#ffc107',
    background: '#ffffff',
    foreground: '#333333',
    border: '#dddddd',
  },
  spacing: {
    small: '0.5rem',
    medium: '1rem',
    large: '1.5rem',
    xlarge: '2rem',
  },
  fonts: {
    primary:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: 'Monaco, Consolas, "Courier New", monospace',
  },
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '12px',
  },
};

/**
 * Creates a custom theme by merging with the default theme
 * @param customizations - Partial theme customizations
 * @returns A complete theme object
 */
export const createTheme = (customizations: Partial<Theme>): Theme => {
  return {
    colors: { ...defaultTheme.colors, ...customizations.colors },
    spacing: { ...defaultTheme.spacing, ...customizations.spacing },
    fonts: { ...defaultTheme.fonts, ...customizations.fonts },
    borderRadius: { ...defaultTheme.borderRadius, ...customizations.borderRadius },
  };
};
