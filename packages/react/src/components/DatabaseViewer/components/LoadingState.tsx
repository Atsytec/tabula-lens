import React from 'react';
import { mergeStyle } from '../utils/styleHelpers';
import { defaultStyles } from '../styles/defaultStyles';
import type { ClassNames, Styles } from '../DatabaseViewer.types';

export interface LoadingStateProps {
  customComponent?: React.FC;
  className?: string;
  classNames?: ClassNames;
  style?: React.CSSProperties;
  styles?: Styles;
}

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
