import knex from 'knex';
import { Logger, createLogger, LogLevel, generateId, maskSensitiveData } from './logger';
import { TabulaLensConfig, DatabaseType, detectDatabaseType } from './database';
import { createDialect, type DialectStrategy } from './dialects';

export interface TabulaLensOptions {
  logger?: Logger;
  logLevel?: LogLevel;
  enableQueryLogging?: boolean;
  enableRequestLogging?: boolean;
  sensitiveDataMasking?: boolean;
  logFormat?: 'json' | 'text' | 'pretty';
}

export class TabulaLensError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'TabulaLensError';
  }
}

export interface QueryOptions {
  table?: string;
  page?: number;
  limit?: number;
  sort?: string;
  filter?: string;
  columns?: string[];
  filterColumns?: string[];
}

export interface SortOption {
  column: string;
  direction: 'asc' | 'desc';
}

export interface FilterOption {
  column: string;
  operator: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'like' | 'ilike';
  value: string | number;
}

export interface QueryResult {
  data: Record<string, unknown>[];
  columns: string[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface RequestContext {
  method: string;
  path: string;
  query: Record<string, string>;
  body?: unknown;
}

export interface ResponseContext {
  status: number;
  headers: Record<string, string>;
  body: unknown;
}

export class TabulaLens {
  private db: knex.Knex;
  private logger: Logger;
  private enableQueryLogging: boolean;
  private enableRequestLogging: boolean;
  private sensitiveDataMasking: boolean;
  private columnCache: Map<string, string[]> = new Map();
  private databaseType: DatabaseType;
  private dialect: DialectStrategy;

  /**
   * Constructor overloads for backward compatibility
   *
   * @param config - Either a database URL string or a TabulaLensConfig object
   * @param options - Optional TabulaLensOptions (only used when config is a string)
   *
   * @example
   * ```ts
   * // String form (existing behavior)
   * const tabulaLens = new TabulaLens('postgresql://localhost/mydb', { logLevel: 'info' });
   *
   * // Config object form (new)
   * const tabulaLens = new TabulaLens({
   *   url: 'mysql://localhost/mydb',
   *   type: 'mysql',
   *   logLevel: 'info'
   * });
   * ```
   */
  constructor(config: string, options?: TabulaLensOptions);
  constructor(config: TabulaLensConfig);
  constructor(config: string | TabulaLensConfig, options?: TabulaLensOptions) {
    // Determine if config is a string or object
    const isStringConfig = typeof config === 'string';

    // Extract URL and options based on config type
    const databaseUrl = isStringConfig ? config : config.url;
    const explicitType = isStringConfig ? undefined : config.type;
    const mergedOptions = isStringConfig
      ? options || {}
      : {
          logger: config.logger,
          logLevel: config.logLevel,
          enableQueryLogging: config.enableQueryLogging,
          enableRequestLogging: config.enableRequestLogging,
          sensitiveDataMasking: config.sensitiveDataMasking,
          logFormat: config.logFormat,
        };

    // Detect or validate database type
    let detectedType: DatabaseType;
    if (explicitType) {
      detectedType = explicitType;
    } else {
      try {
        detectedType = detectDatabaseType(databaseUrl);
      } catch (error) {
        if (error instanceof TabulaLensError) {
          throw error;
        }
        throw new TabulaLensError(
          400,
          'AUTO_DETECTION_FAILED',
          "Unable to detect database type from URL. Please specify the 'type' field in the config. Valid types: pg, mysql, sqlite, mssql"
        );
      }
    }

    this.databaseType = detectedType;

    // Map database type to Knex client
    const knexClient = this.getKnexClient(detectedType);

    this.db = knex({
      client: knexClient,
      connection: databaseUrl,
    });

    this.logger =
      mergedOptions.logger ||
      createLogger({
        level: mergedOptions.logLevel,
        format: mergedOptions.logFormat,
      });
    this.enableQueryLogging = mergedOptions.enableQueryLogging ?? true;
    this.enableRequestLogging = mergedOptions.enableRequestLogging ?? true;
    this.sensitiveDataMasking = mergedOptions.sensitiveDataMasking ?? true;

    // Initialize dialect strategy for database-specific operations
    this.dialect = createDialect(detectedType);
    this.logger.info('Dialect strategy initialized', {
      databaseType: this.databaseType,
      dialect: this.dialect.constructor.name,
    });

    this.logger.info('TabulaLens initialized', {
      databaseUrl: this.sensitiveDataMasking ? maskSensitiveData(databaseUrl) : databaseUrl,
      databaseType: this.databaseType,
    });
  }

  /**
   * Maps database type to Knex client name
   *
   * @param type - Database type
   * @returns Knex client name
   */
  private getKnexClient(type: DatabaseType): string {
    const clientMap: Record<DatabaseType, string> = {
      pg: 'pg',
      mysql: 'mysql2',
      sqlite: 'better-sqlite3',
      mssql: 'tedious',
    };
    return clientMap[type];
  }

  getLogger(): Logger {
    return this.logger;
  }

  async query(options: QueryOptions = {}): Promise<QueryResult> {
    const { table = 'users', page = 1, limit = 10, sort, filter, columns, filterColumns } = options;
    const queryId = generateId();
    const startTime = Date.now();

    if (this.enableQueryLogging) {
      this.logger.debug('Query started', {
        queryId,
        table,
        page,
        limit,
        sort,
        filter,
        columns,
      });
    }

    try {
      // Build the main query
      let query = this.db(table);

      // Apply column selection if specified
      if (columns && columns.length > 0) {
        query = query.select(columns);
      } else {
        query = query.select('*');
      }

      // Apply filtering
      if (filter) {
        let columnsToSearch: string[];

        if (filterColumns && filterColumns.length > 0) {
          // Validate that provided filter columns are actually filterable (text-based)
          const filterableColumns = await this.getFilterableColumns(table);
          const validFilterColumns = filterColumns.filter((col) => filterableColumns.includes(col));

          if (validFilterColumns.length !== filterColumns.length) {
            const invalidColumns = filterColumns.filter((col) => !filterableColumns.includes(col));
            this.logger.warn('Some filter columns are not text-based and will be ignored', {
              queryId,
              table,
              invalidColumns,
              validColumns: validFilterColumns,
            });
          }

          columnsToSearch = validFilterColumns;
        } else {
          columnsToSearch = await this.getFilterableColumns(table);
        }

        if (columnsToSearch.length > 0) {
          const likeOperator = this.dialect.getLikeOperator();
          query = query.where(function () {
            columnsToSearch.forEach((column) => {
              // @ts-expect-error - Knex query builder context
              this.orWhere(column, likeOperator, `%${filter}%`);
            });
          });
        }
      }

      // Get total count before pagination
      let columnsToSearch: string[] = [];
      if (filter) {
        if (filterColumns && filterColumns.length > 0) {
          // Validate that provided filter columns are actually filterable (text-based)
          const filterableColumns = await this.getFilterableColumns(table);
          const validFilterColumns = filterColumns.filter((col) => filterableColumns.includes(col));
          columnsToSearch = validFilterColumns;
        } else {
          columnsToSearch = await this.getFilterableColumns(table);
        }
      }

      const likeOperator = this.dialect.getLikeOperator();
      const countResult = await this.db(table)
        .modify(function (qb) {
          if (filter && columnsToSearch.length > 0) {
            qb.where(function () {
              columnsToSearch.forEach((column) => {
                // @ts-expect-error - Knex query builder context
                this.orWhere(column, likeOperator, `%${filter}%`);
              });
            });
          }
        })
        .count('* as count')
        .first();

      const total = countResult ? Number((countResult as { count: string | number }).count) : 0;

      // Get table columns for sorting validation and fallback
      const tableColumns = await this.getFilterableColumns(table);
      const defaultSortColumn = tableColumns.length > 0 ? tableColumns[0] : null;

      // Apply sorting with column validation
      if (sort) {
        const sortOptions = this.parseSort(sort);

        let hasValidSortColumn = false;
        sortOptions.forEach(({ column, direction }) => {
          // Only apply sorting if column exists in table
          if (tableColumns.includes(column)) {
            query = query.orderBy(column, direction);
            hasValidSortColumn = true;
          } else {
            this.logger.warn('Sort column does not exist in table, skipping', {
              queryId,
              table,
              column,
              availableColumns: tableColumns,
            });
          }
        });

        // Fallback to first available column if no valid sort columns
        if (!hasValidSortColumn) {
          if (defaultSortColumn) {
            this.logger.warn('No valid sort columns found, using first available column', {
              queryId,
              table,
              requestedSort: sortOptions,
              fallbackColumn: defaultSortColumn,
            });
            query = query.orderBy(defaultSortColumn, 'asc');
          } else {
            this.logger.warn('No columns available for sorting', {
              queryId,
              table,
            });
          }
        }
      } else {
        // Use first available column as default sort when no sort specified
        if (defaultSortColumn) {
          query = query.orderBy(defaultSortColumn, 'asc');
        } else {
          this.logger.warn('No columns available for default sorting', {
            queryId,
            table,
          });
        }
      }

      // Apply pagination
      const offset = (page - 1) * limit;
      query = query.limit(limit).offset(offset);

      const data = await query;

      // Get column names from the data
      const resultColumns =
        data.length > 0 ? Object.keys(data[0]) : columns || ['id', 'name', 'email', 'created_at'];

      const totalPages = Math.ceil(total / limit);
      const duration = Date.now() - startTime;

      if (this.enableQueryLogging) {
        this.logger.debug('Query completed', {
          queryId,
          table,
          recordCount: data.length,
          total,
          duration,
        });

        // Performance warning for slow queries
        if (duration > 1000) {
          this.logger.warn('Slow query detected', {
            queryId,
            table,
            duration,
            threshold: 1000,
            recordCount: data.length,
          });
        }

        // Warning for large result sets
        if (total > 10000) {
          this.logger.warn('Large result set may impact performance', {
            queryId,
            table,
            total,
            limit,
            recordCount: data.length,
          });
        }
      }

      return {
        data,
        columns: resultColumns,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.error('Query failed', {
        queryId,
        table,
        page,
        limit,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        duration,
      });
      throw error;
    }
  }

  async getTables(): Promise<string[]> {
    const operationId = generateId();

    this.logger.debug('Fetching tables list', { operationId });

    try {
      const tables = await this.dialect.getTables(this.db);

      this.logger.debug('Tables list fetched', {
        operationId,
        tableCount: tables.length,
        tables: tables,
      });

      return tables;
    } catch (error) {
      this.logger.error('Failed to fetch tables list', {
        operationId,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      throw error;
    }
  }

  async getColumns(table: string): Promise<{ name: string; type: string }[]> {
    const operationId = generateId();

    this.logger.debug('Fetching columns for table', { operationId, table });

    try {
      const columns = await this.dialect.getColumns(this.db, table);

      this.logger.debug('Columns fetched for table', {
        operationId,
        table,
        columnCount: columns.length,
        columns: columns.map((c) => c.name),
      });

      return columns;
    } catch (error) {
      this.logger.error('Failed to fetch columns for table', {
        operationId,
        table,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      throw error;
    }
  }

  async getTableMetadata(table: string): Promise<{
    name: string;
    columns: { name: string; type: string }[];
  }> {
    const operationId = generateId();

    this.logger.debug('Fetching table metadata', { operationId, table });

    try {
      const columns = await this.getColumns(table);
      const metadata = { name: table, columns };

      this.logger.debug('Table metadata fetched', {
        operationId,
        table,
        columnCount: columns.length,
      });

      return metadata;
    } catch (error) {
      this.logger.error('Failed to fetch table metadata', {
        operationId,
        table,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      throw error;
    }
  }

  /**
   * Get filterable (text-based) columns for a table
   * This is a public method that can be used by frontend components to validate filter column selection
   */
  async getFilterableColumns(table: string): Promise<string[]> {
    const operationId = generateId();

    this.logger.debug('Fetching filterable columns for table', { operationId, table });

    try {
      if (this.columnCache.has(table)) {
        const cachedColumns = this.columnCache.get(table)!;
        this.logger.debug('Using cached filterable columns', {
          operationId,
          table,
          columnCount: cachedColumns.length,
        });
        return cachedColumns;
      }

      const columns = await this.getColumns(table);

      const filterableTypes = this.dialect.getFilterableTypes();

      const filterableColumns = columns
        .filter((col) => filterableTypes.includes(col.type.toLowerCase()))
        .map((col) => col.name);

      this.columnCache.set(table, filterableColumns);

      this.logger.debug('Filterable columns fetched and cached', {
        operationId,
        table,
        columnCount: filterableColumns.length,
        columns: filterableColumns,
      });

      return filterableColumns;
    } catch (error) {
      this.logger.error('Failed to fetch filterable columns', {
        operationId,
        table,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      throw error;
    }
  }

  private parseSort(sortString: string): SortOption[] {
    return sortString.split(',').map((sort) => {
      const [column, direction] = sort.split(':');
      return {
        column: column || 'id',
        direction: (direction as 'asc' | 'desc') || 'asc',
      };
    });
  }

  async close(): Promise<void> {
    this.logger.info('Closing database connection');

    try {
      await this.db.destroy();
      this.logger.info('Database connection closed');
    } catch (error) {
      this.logger.error('Failed to close database connection', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      throw error;
    }
  }

  async handle(request: RequestContext): Promise<ResponseContext> {
    const requestId = generateId();
    const startTime = Date.now();

    if (this.enableRequestLogging) {
      this.logger.info('Request received', {
        requestId,
        method: request.method,
        path: request.path,
        query: request.query,
      });
    }

    try {
      const { method, path, query } = request;

      if (method === 'GET' && path === '/tables') {
        const tables = await this.getTables();
        const duration = Date.now() - startTime;

        if (this.enableRequestLogging) {
          this.logger.info('Request completed', {
            requestId,
            method,
            path,
            status: 200,
            duration,
            tableCount: tables.length,
          });
        }

        return {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
          body: tables,
        };
      }

      if (method === 'GET' && path.match(/^\/tables\/[^/]+$/)) {
        const table = path.split('/')[2];
        const metadata = await this.getTableMetadata(table);
        const duration = Date.now() - startTime;

        if (this.enableRequestLogging) {
          this.logger.info('Request completed', {
            requestId,
            method,
            path,
            status: 200,
            duration,
            table,
            columnCount: metadata.columns.length,
          });
        }

        return {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
          body: metadata,
        };
      }

      if (method === 'GET' && path === '/query') {
        const options: QueryOptions = {
          table: query.table,
          page: query.page ? parseInt(query.page, 10) : undefined,
          limit: query.limit ? parseInt(query.limit, 10) : undefined,
          sort: query.sort,
          filter: query.filter,
          columns: query.columns ? query.columns.split(',') : undefined,
          filterColumns: query.filterColumns ? query.filterColumns.split(',') : undefined,
        };
        const result = await this.query(options);
        const duration = Date.now() - startTime;

        if (this.enableRequestLogging) {
          this.logger.info('Request completed', {
            requestId,
            method,
            path,
            status: 200,
            duration,
            table: options.table,
            recordCount: result.data.length,
          });
        }

        return {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
          body: result,
        };
      }

      const duration = Date.now() - startTime;
      this.logger.warn('Route not found', {
        requestId,
        method,
        path,
        duration,
      });

      throw new TabulaLensError(404, 'NOT_FOUND', 'Route not found');
    } catch (error) {
      const duration = Date.now() - startTime;

      if (error instanceof TabulaLensError) {
        this.logger.error('Request failed with TabulaLensError', {
          requestId,
          method: request.method,
          path: request.path,
          status: error.statusCode,
          code: error.code,
          message: error.message,
          details: error.details,
          duration,
        });

        return {
          status: error.statusCode,
          headers: { 'Content-Type': 'application/json' },
          body: {
            error: error.code,
            message: error.message,
            details: error.details,
          },
        };
      }

      this.logger.error('Request failed with unexpected error', {
        requestId,
        method: request.method,
        path: request.path,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        duration,
      });

      return {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
        body: {
          error: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred',
        },
      };
    }
  }
}
