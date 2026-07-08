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

export const LoadingState: React.FC<LoadingStateProps> = ({
  customComponent,
  className,
  classNames = {},
  style,
  styles = {},
}) => {
  if (customComponent) {
    return React.createElement(customComponent);
  }

  return (
    <div
      style={mergeStyle(defaultStyles.loading, styles.loading, style)}
      className={className || classNames.loading}
    >
      <div style={mergeStyle(defaultStyles.spinner, styles.spinner)} />
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      <p>Loading data...</p>
    </div>
  );
};
