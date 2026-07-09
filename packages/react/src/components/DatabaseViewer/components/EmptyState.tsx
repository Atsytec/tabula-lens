import React from 'react';
import { mergeStyle } from '../utils/styleHelpers';
import { defaultStyles } from '../styles/defaultStyles';
import type { ClassNames, Styles } from '../DatabaseViewer.types';

/**
 * Props for the EmptyState component
 * @interface EmptyStateProps
 */
export interface EmptyStateProps {
  /**
   * Custom empty state component to render instead of the default
   * @example
   * ```tsx
   * const CustomEmpty = () => (
   *   <div className="empty-state">
   *     <p>No data available</p>
   *   </div>
   * );
   * <EmptyState customComponent={CustomEmpty} />
   * ```
   */
  customComponent?: React.FC;
  /**
   * Custom className for the empty state container
   */
  className?: string;
  /**
   * Custom classNames for specific elements
   */
  classNames?: ClassNames;
  /**
   * Custom styles for the empty state container
   */
  style?: React.CSSProperties;
  /**
   * Custom styles for specific elements
   */
  styles?: Styles;
  /**
   * Whether a filter is currently active (affects message and icon)
   * @default false
   */
  hasActiveFilter?: boolean;
  /**
   * Callback function to clear the active filter
   */
  onClearFilter?: () => void;
}

/**
 * EmptyState component - displays a message when no data is available
 *
 * @component
 * @example
 * ```tsx
 * // Default usage (no filter)
 * <EmptyState />
 * ```
 *
 * @example
 * ```tsx
 * // With active filter
 * <EmptyState
 *   hasActiveFilter={true}
 *   onClearFilter={() => setFilter('')}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // With custom styling
 * <EmptyState
 *   style={{ padding: '3rem' }}
 *   styles={{
 *     empty: { backgroundColor: '#f9f9f9' },
 *   }}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // With custom component
 * const MyCustomEmpty = ({ hasActiveFilter, onClearFilter }) => (
 *   <div className="my-empty-state">
 *     <div className="icon">{hasActiveFilter ? '🔍' : '📭'}</div>
 *     <p>
 *       {hasActiveFilter
 *         ? 'No results found'
 *         : 'No data available'}
 *     </p>
 *     {hasActiveFilter && (
 *       <button onClick={onClearFilter}>Clear Filter</button>
 *     )}
 *   </div>
 * );
 * <EmptyState customComponent={MyCustomEmpty} hasActiveFilter={true} onClearFilter={clearFilter} />
 * ```
 */
export const EmptyState: React.FC<EmptyStateProps> = React.memo(
  ({
    customComponent,
    className,
    classNames = {},
    style,
    styles = {},
    hasActiveFilter = false,
    onClearFilter,
  }) => {
    if (customComponent) {
      return React.createElement(customComponent);
    }

    const message = hasActiveFilter
      ? 'No records match your filter — try clearing it'
      : 'This table is empty';

    return (
      <div
        style={mergeStyle(defaultStyles.empty, styles.empty, style)}
        className={className || classNames.empty}
      >
        <div
          style={{
            fontSize: '3rem',
            marginBottom: '1rem',
            opacity: 0.5,
          }}
        >
          {hasActiveFilter ? '🔍' : '📭'}
        </div>
        <p>{message}</p>
        {hasActiveFilter && onClearFilter && (
          <button
            onClick={onClearFilter}
            style={mergeStyle(defaultStyles.emptyStateButton, styles.emptyStateButton)}
          >
            Clear Filter
          </button>
        )}
      </div>
    );
  }
);
EmptyState.displayName = 'EmptyState';
