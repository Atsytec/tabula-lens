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
}

export const EmptyState: React.FC<EmptyStateProps> = React.memo(
  ({ customComponent, className, classNames = {}, style, styles = {} }) => {
    if (customComponent) {
      return React.createElement(customComponent);
    }

    return (
      <div
        style={mergeStyle(defaultStyles.empty, styles.empty, style)}
        className={className || classNames.empty}
      >
        No data available
      </div>
    );
  }
);
EmptyState.displayName = 'EmptyState';
