import { useQuery } from '@tanstack/react-query';
import { generateId } from '../../../logger';
import type { Logger } from '../../../logger';
import type { QueryResult } from '../DatabaseViewer.types';

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
      const startTime = Date.now();

      if (logger) {
        logger.debug('Fetching data started', {
          componentId,
          fetchId,
          url,
          table: selectedTable || 'none',
        });
      }

      const requestHeaders: HeadersInit = {
        'Content-Type': 'application/json',
        ...headers,
      };

      // Add custom auth headers
      if (getAuthHeaders) {
        const authHeaders = await getAuthHeaders();
        Object.assign(requestHeaders, authHeaders);
      }

      try {
        const response = await fetch(url, {
          headers: requestHeaders,
          credentials: 'include',
        });

        if (!response.ok) {
          const errorDetails = {
            status: response.status,
            statusText: response.statusText,
            url: response.url,
            headers: Object.fromEntries(response.headers.entries()),
          };

          if (logFetchErrors && logger) {
            logger.error('HTTP request failed', {
              componentId,
              fetchId,
              ...errorDetails,
            });
          }

          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType?.includes('application/json')) {
          const text = await response.text();
          if (logFetchErrors && logger) {
            logger.error('Unexpected content type', {
              componentId,
              fetchId,
              url,
              expected: 'application/json',
              received: contentType,
              responseStart: text.substring(0, 100),
            });
          }
          throw new Error(`Expected JSON, received ${contentType}`);
        }

        const data = await response.json();
        const duration = Date.now() - startTime;

        if (logger) {
          logger.debug('Fetch completed successfully', {
            componentId,
            fetchId,
            recordCount: data.data?.length || 0,
            duration,
          });

          if (logPerformanceMetrics && duration > 2000) {
            logger.warn('Slow network response', {
              componentId,
              fetchId,
              url,
              duration,
              threshold: 2000,
              recordCount: data.data?.length || 0,
            });
          }
        }

        return data as Promise<QueryResult>;
      } catch (fetchError) {
        const duration = Date.now() - startTime;
        if (logFetchErrors && logger) {
          logger.error('Data fetch failed', {
            componentId,
            fetchId,
            error: fetchError instanceof Error ? fetchError.message : String(fetchError),
            stack: fetchError instanceof Error ? fetchError.stack : undefined,
            url,
            table: selectedTable || 'none',
            duration,
          });
        }
        throw fetchError;
      }
    },
    ...queryOptions,
    refetchInterval,
  });

  // Fetch tables list
  const { data: tablesData } = useQuery({
    queryKey: ['tables', path],
    queryFn: async () => {
      const fetchId = generateId();
      const startTime = Date.now();

      if (logger) {
        logger.debug('Fetching tables list started', {
          componentId,
          fetchId,
          url: `${path}/tables`,
        });
      }

      const requestHeaders: HeadersInit = {
        'Content-Type': 'application/json',
        ...headers,
      };

      if (getAuthHeaders) {
        const authHeaders = await getAuthHeaders();
        Object.assign(requestHeaders, authHeaders);
      }

      try {
        const response = await fetch(`${path}/tables`, {
          headers: requestHeaders,
          credentials: 'include',
        });

        if (!response.ok) {
          if (logFetchErrors && logger) {
            logger.error('Tables list fetch failed', {
              componentId,
              fetchId,
              status: response.status,
              statusText: response.statusText,
              url: `${path}/tables`,
            });
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const duration = Date.now() - startTime;

        if (logger) {
          logger.debug('Tables list fetch completed', {
            componentId,
            fetchId,
            tableCount: data.length || 0,
            duration,
          });
        }

        return data as Promise<string[]>;
      } catch (fetchError) {
        const duration = Date.now() - startTime;
        if (logFetchErrors && logger) {
          logger.error('Tables list fetch failed', {
            componentId,
            fetchId,
            error: fetchError instanceof Error ? fetchError.message : String(fetchError),
            stack: fetchError instanceof Error ? fetchError.stack : undefined,
            url: `${path}/tables`,
            duration,
          });
        }
        throw fetchError;
      }
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
