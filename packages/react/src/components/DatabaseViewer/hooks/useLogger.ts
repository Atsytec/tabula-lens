import { useEffect } from 'react';
import { createLogger, generateId, type LogLevel } from '../../../logger';
import type { Logger } from '../../../logger';

export interface UseLoggerOptions {
  logger?: Logger;
  enableLogging?: boolean;
  logLevel?: LogLevel;
}

export interface UseLoggerResult {
  logger: Logger | null;
  componentId: string;
}

/**
 * Custom hook for logger initialization and component lifecycle logging
 *
 * @param options - Logger configuration options
 * @returns Logger instance and component ID
 */
export const useLogger = (options: UseLoggerOptions = {}): UseLoggerResult => {
  const { logger: propLogger, enableLogging = false, logLevel } = options;
  const componentId = generateId();
  const logger = propLogger || createLogger({ level: logLevel || 'silent' });

  useEffect(() => {
    if (enableLogging && logger) {
      logger.info('DatabaseViewer mounted', { componentId });
    }
    return () => {
      if (enableLogging && logger) {
        logger.info('DatabaseViewer unmounted', { componentId });
      }
    };
  }, [componentId, enableLogging, logger]);

  return {
    logger: enableLogging ? logger : null,
    componentId,
  };
};
