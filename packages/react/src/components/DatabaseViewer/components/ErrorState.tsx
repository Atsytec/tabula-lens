import React from 'react';
import { mergeStyle } from '../utils/styleHelpers';
import { defaultStyles } from '../styles/defaultStyles';
import type { ClassNames, Styles } from '../DatabaseViewer.types';

export interface ErrorStateProps {
  error: Error;
  onRetry: () => void;
  customComponent?: React.FC<{ error: Error; retry: () => void }>;
  className?: string;
  classNames?: ClassNames;
  style?: React.CSSProperties;
  styles?: Styles;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  error,
  onRetry,
  customComponent,
  className,
  classNames = {},
  style,
  styles = {},
}) => {
  if (customComponent) {
    return React.createElement(customComponent, { error, retry: onRetry });
  }

  return (
    <div
      style={mergeStyle(defaultStyles.error, styles.error, style)}
      className={className || classNames.error}
    >
      <p>Error loading data: {error.message}</p>
      <button onClick={onRetry} style={mergeStyle(defaultStyles.retry, styles.retry)}>
        Retry
      </button>
    </div>
  );
};
