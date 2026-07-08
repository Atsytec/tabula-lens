import React, { useEffect } from 'react';
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
  isRecoverable?: boolean;
}

export const ErrorState: React.FC<ErrorStateProps> = React.memo(
  ({
    error,
    onRetry,
    customComponent,
    className,
    classNames = {},
    style,
    styles = {},
    isRecoverable = true,
  }) => {
    // Log technical details to console for debugging
    useEffect(() => {
      console.error('[Tabula Lens Error]', {
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });
    }, [error]);
    if (customComponent) {
      return React.createElement(customComponent, { error, retry: onRetry });
    }

    // Generate human-friendly error message
    const getHumanFriendlyMessage = (error: Error): string => {
      const message = error.message.toLowerCase();

      if (message.includes('network') || message.includes('fetch')) {
        return 'Unable to connect to the server. Please check your internet connection.';
      }
      if (message.includes('timeout')) {
        return 'The request took too long. Please try again.';
      }
      if (message.includes('unauthorized') || message.includes('401')) {
        return "You don't have permission to access this data.";
      }
      if (message.includes('not found') || message.includes('404')) {
        return 'The requested data was not found.';
      }
      if (message.includes('500') || message.includes('server')) {
        return 'Something went wrong on our end. Please try again later.';
      }

      // Default message for unknown errors
      return 'An unexpected error occurred while loading the data.';
    };

    const friendlyMessage = getHumanFriendlyMessage(error);

    return (
      <div
        style={mergeStyle(defaultStyles.error, styles.error, style)}
        className={className || classNames.error}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1rem',
          }}
        >
          <div
            style={{
              fontSize: '2rem',
              opacity: 0.8,
            }}
          >
            {isRecoverable ? '⚠️' : '❌'}
          </div>
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: '1.1rem',
                fontWeight: 600,
                color: 'var(--tlens-error, #c33)',
              }}
            >
              {isRecoverable ? 'Unable to Load Data' : 'Fatal Error'}
            </h3>
            <p
              style={{
                margin: '0.5rem 0 0 0',
                fontSize: '0.95rem',
                lineHeight: 1.5,
              }}
            >
              {friendlyMessage}
            </p>
          </div>
        </div>

        {isRecoverable && (
          <button onClick={onRetry} style={mergeStyle(defaultStyles.retry, styles.retry)}>
            Retry
          </button>
        )}
      </div>
    );
  }
);
ErrorState.displayName = 'ErrorState';
