import { useQuery } from '@tanstack/react-query';
import { generateId } from '../../../logger';
import type { Logger } from '../../../logger';
import type { QueryResult } from '../DatabaseViewer.types';
import {
  authenticatedFetch,
  logPerformanceMetrics as logFetchPerformanceMetrics,
} from '../utils/fetchHelpers';

export interface UseDatabaseDataOptions {
  path: string;
  selectedTable: string | undefined;
  queryParams: string;
  getAuthHeaders?: () => Promise<Record<string, string>>;
  headers?: Record<string, string>;
  logger?: Logger | null;
  componentId?: string;
  logFetchErrors?: boolean;
  logPerformanceMetrics?: boolean;
  queryOptions?: object;
  refetchInterval?: number;
  tableSelectorMode?: 'dropdown' | 'sidebar' | 'none';
}

export interface UseDatabaseDataResult {
  data: QueryResult | undefined;
  tables: string[] | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Custom hook for fetching database data and tables list
 *
 * @param options - Data fetching configuration
 * @returns Data, tables, loading state, error, and refetch function
 */
export const useDatabaseData = (options: UseDatabaseDataOptions): UseDatabaseDataResult => {
  const {
    path,
    selectedTable,
    queryParams,
    getAuthHeaders,
    headers,
    logger,
    componentId = '',
    logFetchErrors = true,
    logPerformanceMetrics = true,
    queryOptions = {},
    refetchInterval,
    tableSelectorMode = 'dropdown',
  } = options;

  const url = `${path}/query?${queryParams}`;

  // Fetch data with TanStack Query
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['databaseData', url],
    enabled: !!selectedTable,
    queryFn: async () => {
      const fetchId = generateId();

      if (logger) {
        logger.debug('Fetching data started', {
          componentId,
          fetchId,
          url,
          table: selectedTable || 'none',
        });
      }

      const result = await authenticatedFetch<QueryResult>({
        url,
        headers,
        getAuthHeaders,
        logger,
        componentId,
        fetchId,
        logFetchErrors,
      });

      // Log performance metrics for slow requests
      if (logPerformanceMetrics) {
        logFetchPerformanceMetrics(
          result.duration,
          2000,
          {
            url,
            recordCount: result.data.data?.length || 0,
          },
          { logger, componentId, fetchId }
        );
      }

      if (logger) {
        logger.debug('Fetch completed successfully', {
          componentId,
          fetchId,
          recordCount: result.data.data?.length || 0,
          duration: result.duration,
        });
      }

      return result.data;
    },
    ...queryOptions,
    refetchInterval,
  });

  // Fetch tables list
  const { data: tablesData } = useQuery({
    queryKey: ['tables', path],
    queryFn: async () => {
      const fetchId = generateId();

      if (logger) {
        logger.debug('Fetching tables list started', {
          componentId,
          fetchId,
          url: `${path}/tables`,
        });
      }

      const result = await authenticatedFetch<string[]>({
        url: `${path}/tables`,
        headers,
        getAuthHeaders,
        logger,
        componentId,
        fetchId,
        logFetchErrors,
      });

      if (logger) {
        logger.debug('Tables list fetch completed', {
          componentId,
          fetchId,
          tableCount: result.data.length || 0,
          duration: result.duration,
        });
      }

      return result.data;
    },
    enabled: tableSelectorMode !== 'none',
  });

  return {
    data,
    tables: tablesData,
    isLoading,
    error: error as Error | null,
    refetch,
  };
};
