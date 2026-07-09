import React from 'react';
import { mergeStyle } from '../utils/styleHelpers';
import { defaultStyles } from '../styles/defaultStyles';
import type { ClassNames, Styles } from '../DatabaseViewer.types';

/**
 * Props for the LoadingState component
 * @interface LoadingStateProps
 */
export interface LoadingStateProps {
  /**
   * Custom loading component to render instead of the default
   * @example
   * ```tsx
   * const CustomLoading = () => (
   *   <div className="flex items-center justify-center">
   *     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
   *   </div>
   * );
   * <LoadingState customComponent={CustomLoading} />
   * ```
   */
  customComponent?: React.FC;
  /**
   * Custom className for the loading container
   */
  className?: string;
  /**
   * Custom classNames for specific elements
   */
  classNames?: ClassNames;
  /**
   * Custom styles for the loading container
   */
  style?: React.CSSProperties;
  /**
   * Custom styles for specific elements
   */
  styles?: Styles;
}

/**
 * LoadingState component - displays a loading spinner while data is being fetched
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <LoadingState />
 * ```
 *
 * @example
 * ```tsx
 * // With custom styling
 * <LoadingState
 *   style={{ padding: '3rem' }}
 *   styles={{
 *     spinner: { width: '60px', height: '60px' },
 *   }}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // With custom component
 * const MyCustomLoader = () => (
 *   <div className="my-custom-loader">
 *     <div className="spinner" />
 *     <p>Please wait...</p>
 *   </div>
 * );
 * <LoadingState customComponent={MyCustomLoader} />
 * ```
 */
export const LoadingState: React.FC<LoadingStateProps> = React.memo(
  ({ customComponent, className, classNames = {}, style, styles = {} }) => {
    if (customComponent) {
      return React.createElement(customComponent);
    }

    return (
      <div
        style={mergeStyle(defaultStyles.loading, styles.loading, style)}
        className={className || classNames.loading}
      >
        <div style={mergeStyle(defaultStyles.spinner, styles.spinner)} />
        <p>Loading data...</p>
      </div>
    );
  }
);
LoadingState.displayName = 'LoadingState';
