import knex from 'knex';
import { Logger, createLogger, LogLevel, generateId, maskSensitiveData } from './logger';

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

  constructor(databaseUrl: string, options: TabulaLensOptions = {}) {
    this.db = knex({
      client: 'pg',
      connection: databaseUrl,
    });

    this.logger =
      options.logger ||
      createLogger({
        level: options.logLevel,
        format: options.logFormat,
      });
    this.enableQueryLogging = options.enableQueryLogging ?? true;
    this.enableRequestLogging = options.enableRequestLogging ?? true;
    this.sensitiveDataMasking = options.sensitiveDataMasking ?? true;

    this.logger.info('TabulaLens initialized', {
      databaseUrl: this.sensitiveDataMasking ? maskSensitiveData(databaseUrl) : databaseUrl,
    });
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
          columnsToSearch = filterColumns;
        } else {
          columnsToSearch = await this.getFilterableColumns(table);
        }

        if (columnsToSearch.length > 0) {
          query = query.where(function () {
            columnsToSearch.forEach((column) => {
              this.orWhere(column, 'ilike', `%${filter}%`);
            });
          });
        }
      }

      // Get total count before pagination
      let columnsToSearch: string[] = [];
      if (filter) {
        if (filterColumns && filterColumns.length > 0) {
          columnsToSearch = filterColumns;
        } else {
          columnsToSearch = await this.getFilterableColumns(table);
        }
      }

      const countResult = await this.db(table)
        .modify(function (qb) {
          if (filter && columnsToSearch.length > 0) {
            qb.where(function () {
              columnsToSearch.forEach((column) => {
                this.orWhere(column, 'ilike', `%${filter}%`);
              });
            });
          }
        })
        .count('* as count')
        .first();

      const total = countResult ? Number((countResult as { count: string | number }).count) : 0;

      // Apply sorting
      if (sort) {
        const sortOptions = this.parseSort(sort);
        sortOptions.forEach(({ column, direction }) => {
          query = query.orderBy(column, direction);
        });
      } else {
        query = query.orderBy('id', 'asc');
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
      const tables = await this.db
        .select('table_name')
        .from('information_schema.tables')
        .where('table_schema', 'public')
        .where('table_type', 'BASE TABLE');

      const tableNames = tables.map((t: { table_name: string }) => t.table_name);

      this.logger.debug('Tables list fetched', {
        operationId,
        tableCount: tableNames.length,
        tables: tableNames,
      });

      return tableNames;
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
      const columns = await this.db
        .select('column_name as name', 'data_type as type')
        .from('information_schema.columns')
        .where('table_schema', 'public')
        .where('table_name', table)
        .orderBy('ordinal_position');

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

  private async getFilterableColumns(table: string): Promise<string[]> {
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

      const textTypes = ['character varying', 'varchar', 'text', 'char', 'character', 'uuid'];

      const filterableColumns = columns
        .filter((col) => textTypes.includes(col.type.toLowerCase()))
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
