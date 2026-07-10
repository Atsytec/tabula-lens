import type { Logger } from '../../../logger';

/**
 * ============================================================================
 * FETCH HELPERS
 * ============================================================================
 *
 * Utility functions for handling HTTP requests with authentication,
 * response validation, and error handling.
 */

/**
 * Options for authenticated fetch requests
 */
export interface AuthenticatedFetchOptions {
  /** Base URL for the request */
  url: string;
  /** Static headers to include in the request */
  headers?: Record<string, string>;
  /** Function to get authentication headers */
  getAuthHeaders?: () => Promise<Record<string, string>>;
  /** Whether to include credentials */
  credentials?: RequestCredentials;
  /** Logger instance for logging */
  logger?: Logger | null;
  /** Component ID for logging context */
  componentId?: string;
  /** Fetch ID for tracking individual requests */
  fetchId?: string;
  /** Whether to log fetch errors */
  logFetchErrors?: boolean;
}

/**
 * Result of a validated fetch response
 */
export interface ValidatedResponse<T> {
  /** Response data */
  data: T;
  /** Response duration in milliseconds */
  duration: number;
  /** Response headers */
  headers: Headers;
}

/**
 * Creates request headers with authentication
 *
 * @param options - Fetch options including headers and auth function
 * @returns Complete HeadersInit object with authentication
 */
export const createAuthenticatedHeaders = async (
  options: Pick<AuthenticatedFetchOptions, 'headers' | 'getAuthHeaders'>
): Promise<HeadersInit> => {
  const { headers, getAuthHeaders } = options;

  const requestHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...headers,
  };

  // Add custom auth headers if provided
  if (getAuthHeaders) {
    const authHeaders = await getAuthHeaders();
    Object.assign(requestHeaders, authHeaders);
  }

  return requestHeaders;
};

/**
 * Validates HTTP response and checks content type
 *
 * @param response - Fetch response object
 * @param options - Validation options including logging context
 * @throws Error if response is not OK or content type is invalid
 */
export const validateResponse = async (
  response: Response,
  options: Pick<AuthenticatedFetchOptions, 'logger' | 'componentId' | 'fetchId' | 'logFetchErrors'>
): Promise<void> => {
  const { logger, componentId, fetchId, logFetchErrors = true } = options;

  // Check HTTP status
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

  // Check content type for JSON responses
  const contentType = response.headers.get('content-type');
  if (!contentType?.includes('application/json')) {
    const text = await response.text();
    if (logFetchErrors && logger) {
      logger.error('Unexpected content type', {
        componentId,
        fetchId,
        url: response.url,
        expected: 'application/json',
        received: contentType,
        responseStart: text.substring(0, 100),
      });
    }
    throw new Error(`Expected JSON, received ${contentType}`);
  }
};

/**
 * Handles fetch errors with logging
 *
 * @param error - Error from fetch operation
 * @param context - Context information for logging
 * @param options - Error handling options
 * @throws The original error after logging
 */
export const handleFetchError = (
  error: unknown,
  context: { url: string; table?: string; duration?: number },
  options: Pick<AuthenticatedFetchOptions, 'logger' | 'componentId' | 'fetchId' | 'logFetchErrors'>
): never => {
  const { logger, componentId, fetchId, logFetchErrors = true } = options;
  const { url, table, duration } = context;

  if (logFetchErrors && logger) {
    logger.error('Fetch operation failed', {
      componentId,
      fetchId,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      url,
      table: table || 'none',
      duration,
    });
  }

  throw error;
};

/**
 * Performs an authenticated fetch request with validation and error handling
 *
 * @param options - Complete fetch options
 * @returns Validated response with data and metadata
 * @throws Error if request fails or validation fails
 */
export const authenticatedFetch = async <T = unknown>(
  options: AuthenticatedFetchOptions
): Promise<ValidatedResponse<T>> => {
  const {
    url,
    headers,
    getAuthHeaders,
    credentials = 'include',
    logger,
    componentId = '',
    fetchId,
    logFetchErrors = true,
  } = options;

  const startTime = Date.now();

  if (logger) {
    logger.debug('Fetch started', {
      componentId,
      fetchId,
      url,
    });
  }

  try {
    // Create authenticated headers
    const requestHeaders = await createAuthenticatedHeaders({ headers, getAuthHeaders });

    // Perform fetch
    const response = await fetch(url, {
      headers: requestHeaders,
      credentials,
    });

    // Validate response
    await validateResponse(response, { logger, componentId, fetchId, logFetchErrors });

    // Parse JSON response
    const data = await response.json();
    const duration = Date.now() - startTime;

    if (logger) {
      logger.debug('Fetch completed successfully', {
        componentId,
        fetchId,
        duration,
      });
    }

    return {
      data,
      duration,
      headers: response.headers,
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    handleFetchError(error, { url, duration }, { logger, componentId, fetchId, logFetchErrors });
    // This line is never reached because handleFetchError always throws
    throw error; // Type safety fallback
  }
};

/**
 * Logs performance metrics for slow requests
 *
 * @param duration - Request duration in milliseconds
 * @param threshold - Threshold for considering a request slow (default: 2000ms)
 * @param context - Context information for logging
 * @param options - Logging options
 */
export const logPerformanceMetrics = (
  duration: number,
  threshold: number = 2000,
  context: { url: string; recordCount?: number },
  options: Pick<AuthenticatedFetchOptions, 'logger' | 'componentId' | 'fetchId'>
): void => {
  const { logger, componentId, fetchId } = options;
  const { url, recordCount } = context;

  if (logger && duration > threshold) {
    logger.warn('Slow network response', {
      componentId,
      fetchId,
      url,
      duration,
      threshold,
      recordCount: recordCount || 0,
    });
  }
};
