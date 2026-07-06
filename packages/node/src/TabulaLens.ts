import knex from 'knex';

export interface QueryOptions {
  table?: string;
  page?: number;
  limit?: number;
  sort?: string;
  filter?: string;
  columns?: string[];
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

export class TabulaLens {
  private db: knex.Knex;

  constructor(databaseUrl: string) {
    this.db = knex({
      client: 'pg',
      connection: databaseUrl,
    });
  }

  async query(options: QueryOptions = {}): Promise<QueryResult> {
    const { table = 'users', page = 1, limit = 10, sort, filter, columns } = options;

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
      // Simple text filter - search across all string columns
      query = query.where(function () {
        this.where('name', 'ilike', `%${filter}%`)
          .orWhere('email', 'ilike', `%${filter}%`)
          .orWhere('description', 'ilike', `%${filter}%`);
      });
    }

    // Get total count before pagination
    const countResult = await this.db(table)
      .modify(function (qb) {
        if (filter) {
          qb.where(function () {
            this.where('name', 'ilike', `%${filter}%`)
              .orWhere('email', 'ilike', `%${filter}%`)
              .orWhere('description', 'ilike', `%${filter}%`);
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
  }

  async getTables(): Promise<string[]> {
    const tables = await this.db
      .select('table_name')
      .from('information_schema.tables')
      .where('table_schema', 'public')
      .where('table_type', 'BASE TABLE');

    return tables.map((t: { table_name: string }) => t.table_name);
  }

  async getColumns(table: string): Promise<{ name: string; type: string }[]> {
    const columns = await this.db
      .select('column_name as name', 'data_type as type')
      .from('information_schema.columns')
      .where('table_schema', 'public')
      .where('table_name', table)
      .orderBy('ordinal_position');

    return columns;
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
    await this.db.destroy();
  }
}
