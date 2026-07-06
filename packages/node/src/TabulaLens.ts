import knex from 'knex'

export interface QueryOptions {
  table?: string
  page?: number
  limit?: number
  sort?: string
  filter?: string
}

export class TabulaLens {
  private db: knex.Knex

  constructor(databaseUrl: string) {
    this.db = knex({
      client: 'pg',
      connection: databaseUrl,
    })
  }

  async query(options: QueryOptions = {}): Promise<{
    data: unknown[]
    pagination: {
      page: number
      limit: number
      total: number
    }
  }> {
    const { table = 'users', page = 1, limit = 10, sort, filter } = options

    let query = this.db(table)

    if (filter) {
      query = query.where('name', 'like', `%${filter}%`)
    }

    if (sort) {
      const [column, direction] = sort.split(':')
      query = query.orderBy(column || 'id', direction || 'asc')
    }

    const offset = (page - 1) * limit
    query = query.limit(limit).offset(offset)

    const data = await query.select('*')

    return {
      data,
      pagination: {
        page,
        limit,
        total: data.length, // This should be a count query in production
      },
    }
  }

  async close(): Promise<void> {
    await this.db.destroy()
  }
}
