import React from 'react';
import { mergeStyle } from '../utils/styleHelpers';
import { defaultStyles } from '../styles/defaultStyles';
import type { ClassNames, Styles } from '../DatabaseViewer.types';

export interface EmptyStateProps {
  customComponent?: React.FC;
  className?: string;
  classNames?: ClassNames;
  style?: React.CSSProperties;
  styles?: Styles;
  hasActiveFilter?: boolean;
  onClearFilter?: () => void;
}

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
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              backgroundColor: 'var(--tlens-primary, #3498db)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--tlens-radius, 4px)',
              cursor: 'pointer',
            }}
          >
            Clear Filter
          </button>
        )}
      </div>
    );
  }
);
EmptyState.displayName = 'EmptyState';
