# Multi-Database Support — Design & Implementation Plan

## Context

Tabula Lens currently supports only PostgreSQL, with the database client hardcoded to `'pg'`
inside `TabulaLens.ts`. This document records all design decisions made during the grilling session
on 2026-07-12 and outlines the phased implementation plan.

---

## Design Decisions

### 1. Query Layer: Keep Knex.js (do NOT replace with Drizzle)

**Decision:** Extend Knex.js with additional drivers rather than switching to Drizzle ORM.

**Rationale:** Drizzle requires the database schema to be defined upfront in TypeScript
(`pgTable(...)`, etc.). Tabula Lens is a schema-agnostic viewer — it queries any user database
without prior knowledge of its structure. Drizzle's query builder cannot work without a schema
definition; its `sql.raw()` escape hatch would surrender all benefits of using Drizzle. Knex, on
the other hand, is schema-agnostic and builds queries dynamically from string table/column names —
exactly how Tabula Lens works today.

---

### 2. Scope: SQL Engines Only (not managed/serverless platforms)

**Decision:** Support the four major SQL engine families. Do NOT attempt to add managed/serverless
platform support (Neon, Turso, Cloudflare D1, Supabase, PlanetScale, etc.) in this feature.

**Supported databases (v1):**

| Database                 | Knex client | Driver package   |
| ------------------------ | ----------- | ---------------- |
| PostgreSQL / CockroachDB | `pg`        | `pg`             |
| MySQL / MariaDB          | `mysql2`    | `mysql2`         |
| SQLite                   | `sqlite3`   | `better-sqlite3` |
| SQL Server (MSSQL)       | `mssql`     | `tedious`        |

**Rationale:** Managed platforms require provider-specific HTTP/WebSocket drivers that cannot be
made schema-agnostic through Knex. This is a separate, larger effort. The four engine families above
cover the vast majority of real-world deployments.

---

### 3. API Design: Flat Config Object + String Overload

**Decision:** Accept either a plain string (existing behaviour) or a flat config object.

```ts
// Existing string form — still works, no changes needed
const tabulaLens = new TabulaLens(process.env.DATABASE_URL);

// New config-object form
const tabulaLens = new TabulaLens({
  url: process.env.DATABASE_URL,
  type: 'mysql', // optional — auto-detected from URL if omitted
  logLevel: 'info', // all existing TabulaLensOptions inline (flat)
  sensitiveDataMasking: true,
  enableQueryLogging: true,
  // ...
});
```

**TypeScript signature:**

```ts
new TabulaLens(config: string | TabulaLensConfig, options?: TabulaLensOptions)
```

Where `TabulaLensConfig` is:

```ts
interface TabulaLensConfig extends TabulaLensOptions {
  url: string;
  type?: DatabaseType;
}

type DatabaseType = 'pg' | 'mysql' | 'sqlite' | 'mssql';
```

**Rationale:** Flat config avoids a nested `options: {}` key with no naming conflicts. TypeScript
overloads keep both call forms valid and fully typed.

---

### 4. `type` Field: Optional with Auto-Detection

**Decision:** `type` is optional in both the string and config-object forms.
Auto-detection reads the URL prefix:

| URL prefix / pattern                                                                                                                                                          | Detected type |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| `postgresql://` / `postgres://` / `pgsql://` (also covers Neon, Supabase, AWS RDS, Heroku Postgres, Railway, TimescaleDB, Azure, DigitalOcean, CockroachDB, Google Cloud SQL) | `pg`          |
| `mysql://` / `mysql2://` / `mysqlx://` / `mariadb://` (also covers PlanetScale, AWS RDS MySQL/MariaDB, Azure, DigitalOcean, Google Cloud SQL, Upstash)                        | `mysql`       |
| `sqlite:` / `sqlite://` / `sqlite3://` / `file:` / `:memory:` / relative or absolute path ending `.db` / `.sqlite` / `.sqlite3` / `.db3`                                      | `sqlite`      |
| `mssql://` / `sqlserver://` / `mssql+tcp://` / `mssql+udp://` (also covers Azure SQL Database, AWS RDS SQL Server)                                                            | `mssql`       |

**On detection failure:** throw a clear `TabulaLensError` with a list of valid type values and
instructions. Never silently default to `pg`.

**Error message format:** Use consistent error message format: `"Unable to detect database type from URL. Please specify the 'type' field in the config. Valid types: pg, mysql, sqlite, mssql"`

---

### 5. Backward Compatibility: Zero Breaking Changes

**Decision:** The existing `new TabulaLens(string, options?)` signature must continue to work
without any modification by existing users.

**Rationale:** This is a non-breaking minor/patch addition. Existing PostgreSQL users are
unaffected.

---

### 6. Dialect Differences: Strategy Classes in `src/dialects/`

**Decision:** Create a `DialectStrategy` interface and one implementation per database, housed
in a new `packages/node/src/dialects/` folder.

**Interface:**

```ts
interface DialectStrategy {
  getTables(db: Knex): Promise<string[]>;
  getColumns(db: Knex, table: string): Promise<{ name: string; type: string }[]>;
  getFilterableTypes(): string[];
  getLikeOperator(): 'LIKE' | 'ILIKE';
}
```

**Implementations:**

- `src/dialects/postgres.ts` — `PostgresDialect`
- `src/dialects/mysql.ts` — `MySQLDialect`
- `src/dialects/sqlite.ts` — `SQLiteDialect`
- `src/dialects/mssql.ts` — `MSSQLDialect`
- `src/dialects/index.ts` — factory function `createDialect(type: DatabaseType): DialectStrategy`

**Key dialect differences handled:**

| Feature               | PostgreSQL                                                  | MySQL                                                           | SQLite                                              | MSSQL                                                         |
| --------------------- | ----------------------------------------------------------- | --------------------------------------------------------------- | --------------------------------------------------- | ------------------------------------------------------------- |
| Case-insensitive LIKE | `ILIKE`                                                     | `LIKE` (case-insensitive by default)                            | `LIKE`                                              | `LIKE`                                                        |
| List tables query     | `information_schema.tables` where `table_schema = 'public'` | `information_schema.tables` where `table_schema = DATABASE()`   | `SELECT name FROM sqlite_master WHERE type='table'` | `information_schema.tables` where `table_type = 'BASE TABLE'` |
| List columns query    | `information_schema.columns`                                | `information_schema.columns`                                    | `PRAGMA table_info(?)`                              | `information_schema.columns`                                  |
| Text type names       | `character varying`, `text`, `varchar`, `char`, `uuid`      | `varchar`, `text`, `tinytext`, `mediumtext`, `longtext`, `char` | `TEXT`, `text`                                      | `varchar`, `nvarchar`, `text`, `char`, `nchar`                |

---

### 7. Dependency Management: peerDependencies

**Decision:** All database drivers are `peerDependencies`. Users install only the driver for their
chosen database. `pg` is moved from `dependencies` to `peerDependencies`.

**Install commands:**

```sh
# PostgreSQL / CockroachDB
npm install @tabula-lens/node pg

# MySQL / MariaDB
npm install @tabula-lens/node mysql2

# SQLite
npm install @tabula-lens/node better-sqlite3

# SQL Server
npm install @tabula-lens/node tedious
```

**Rationale:** Follows the same pattern as Knex.js itself. Keeps the package lean — nobody using
PostgreSQL downloads the SQLite driver.

---

### 8. Testing: Mocked Unit Tests (same approach as today)

**Decision:** New dialect tests use mocked Knex instances (no real database required). One test
file per dialect.

**Rationale:** Keeps CI fast with no Docker/infra dependency. Integration tests can be added as a
separate future effort.

---

## Implementation Guidelines & Best Practices

### Code Organization Principles

- **Barrel Exports**: Use `index.ts` files for clean public APIs (e.g., `src/dialects/index.ts` exports all dialects and factory)
- **File Naming**: Follow existing patterns - use PascalCase for class files, lowercase for utilities
- **Module Structure**: Keep related functionality together - dialect implementations should be self-contained

### DRY (Don't Repeat Yourself) Principles

- **Shared Utilities**: Extract common dialect operations into shared utility functions in `src/dialects/utils.ts`
- **Type Reuse**: Leverage existing types from `TabulaLens.ts` where applicable
- **Query Building**: Consider shared query building patterns for information_schema queries across dialects
- **Error Messages**: Use centralized error message constants for consistency

### Clean Code Practices

- **Function Size**: Keep dialect methods focused and small (single responsibility)
- **Early Returns**: Use early returns for error handling to avoid nested conditionals
- **Descriptive Names**: Use clear, self-documenting names for dialect-specific operations
- **Avoid Magic Strings**: Define constants for SQL keywords, schema names, etc.

### Separation of Concerns

- **Dialect Layer**: Only handles database-specific SQL generation and metadata queries
- **Detection Logic**: Auto-detection is a pure function with no side effects
- **Error Handling**: Centralized error creation with consistent `TabulaLensError` usage
- **Configuration**: Config parsing/validation is separate from business logic

### Error Handling Patterns

- **Consistent Error Types**: Always throw `TabulaLensError` with appropriate status codes
- **Error Context**: Include relevant context in error details (URL, detected type, etc.)
- **Validation First**: Validate inputs before database operations
- **Graceful Degradation**: Provide helpful error messages for common mistakes

### Logging Consistency

- **Structured Logging**: Use existing logger from `logger.ts` throughout dialect implementations
- **Contextual Information**: Include database type, table name, operation in log context
- **Performance Logging**: Log slow dialect operations (e.g., metadata queries)
- **Error Logging**: Log errors with full context for debugging

### Testing Best Practices

- **Test Isolation**: Each dialect test file should be independent
- **Mock Consistency**: Use consistent mock patterns across dialect tests
- **Edge Cases**: Test URL detection edge cases (malformed URLs, unknown schemes, etc.)
- **Error Paths**: Test error handling in each dialect method
- **Type Safety**: Ensure TypeScript types are tested (e.g., invalid type inputs)

### Type Safety

- **Strict Typing**: Use explicit return types on all dialect methods
- **Type Guards**: Consider type guards for database-specific type checking
- **Generic Constraints**: Leverage TypeScript generics where appropriate for reuse
- **No `any`**: Avoid `any` types - use `unknown` with proper type guards

### Performance Considerations

- **Memoization**: Consider memoizing expensive operations like type lists
- **Connection Pooling**: Ensure Knex configuration respects connection pooling
- **Query Optimization**: Use efficient queries for metadata operations
- **Lazy Loading**: Only initialize dialect when needed

### Security Considerations

- **SQL Injection**: Ensure all user input is properly parameterized in dialect queries
- **URL Validation**: Validate database URLs before connection
- **Error Information**: Avoid exposing sensitive information in error messages
- **Credential Masking**: Use existing `maskSensitiveData` utility for logging

### Documentation Standards

- **JSDoc Comments**: Add JSDoc to all public dialect methods
- **Usage Examples**: Include examples in dialect implementation comments
- **Type Documentation**: Document complex types with comments
- **Inline Comments**: Explain non-obvious dialect-specific SQL logic

---

## Implementation Phases

### Phase 1 — Foundation: Types, Config, and Auto-Detection

- [x] Define `DatabaseType` union type (`'pg' | 'mysql' | 'sqlite' | 'mssql'`)
- [x] Define `TabulaLensConfig` interface (extends `TabulaLensOptions`, adds `url` and optional `type`)
- [x] Implement `detectDatabaseType(url: string): DatabaseType` utility function (pure function, no side effects)
- [x] Add URL validation and error handling with consistent `TabulaLensError` usage
- [x] Update `TabulaLens` constructor to accept `string | TabulaLensConfig` with TypeScript overloads
- [x] Throw `TabulaLensError` with specified error message format when auto-detection fails
- [x] Update `packages/node/src/index.ts` to export new types (barrel export pattern)
- [x] Write unit tests for `detectDatabaseType` (edge cases: malformed URLs, unknown schemes, file paths)
- [x] Add JSDoc comments to new types and functions

### Phase 2 — Dialect Strategy Layer

- [x] Create `src/dialects/` folder with proper module structure
- [x] Define `DialectStrategy` interface in `src/dialects/types.ts` with JSDoc documentation
- [x] Create `src/dialects/utils.ts` for shared dialect utilities (DRY principle)
- [x] Implement `PostgresDialect` in `src/dialects/postgres.ts` (extract existing logic from TabulaLens)
- [x] Implement `MySQLDialect` in `src/dialects/mysql.ts` (reuse shared utilities where possible)
- [x] Implement `SQLiteDialect` in `src/dialects/sqlite.ts` (handle PRAGMA queries specifically)
- [x] Implement `MSSQLDialect` in `src/dialects/mssql.ts` (handle MSSQL-specific syntax)
- [x] Implement `createDialect(type: DatabaseType): DialectStrategy` factory in `src/dialects/index.ts`
- [x] Create barrel export in `src/dialects/index.ts` for clean public API
- [x] Write unit tests for each dialect (mocked Knex, test error paths and edge cases)
- [x] Add integration tests for dialect factory function

### Phase 3 — Wire Dialects into TabulaLens

- [x] Replace the hardcoded `client: 'pg'` Knex initialisation with dynamic client selection
- [x] Store `dialect` instance on `TabulaLens` class (private property with proper typing)
- [x] Replace `getTables()` body with `this.dialect.getTables(this.db)` (maintain error handling)
- [x] Replace `getColumns()` body with `this.dialect.getColumns(this.db, table)` (preserve caching logic)
- [x] Replace `getFilterableColumns()` text-type list with `this.dialect.getFilterableTypes()`
- [x] Replace `ILIKE` usage in `query()` with `this.dialect.getLikeOperator()` (note: dialect strategy handles operator selection dynamically)
- [x] Add logging for dialect initialization and database type detection
- [x] Ensure all error handling uses consistent `TabulaLensError` patterns
- [x] Run and fix all existing tests (verify backward compatibility)
- [x] Add integration test for multi-database functionality

### Phase 4 — Dependency Management

- [x] Move `pg` from `dependencies` to `peerDependencies` in `packages/node/package.json`
- [x] Add `mysql2`, `better-sqlite3`, `tedious` to `peerDependencies` with appropriate version ranges
- [x] Add `@types/better-sqlite3` type package to `devDependencies`
- [x] Investigate and make sure all the database dependecies versions are up to date. Read official documentation from each one.
- [x] Update package.json keywords to include MySQL, SQLite, MSSQL
- [x] Verify build still passes with `npm run build`
- [x] Verify type check still passes with `npm run check-types`

**Note:** Testing build with each database driver individually should be done during integration testing or in separate test environments to ensure peer dependency resolution works correctly.

**Note:** During implementation, we discovered that:

- `mysql2` includes built-in TypeScript types, so `@types/mysql2` is not needed
- `tedious` includes built-in TypeScript types, so `@types/tedious` is not needed
- Only `better-sqlite3` requires `@types/better-sqlite3` for TypeScript support

**Latest versions as of 2026-07-12:**

- `pg`: ^8.22.0
- `mysql2`: ^3.22.6
- `better-sqlite3`: ^12.11.1
- `tedious`: ^20.0.0
- `@types/better-sqlite3`: ^7.6.13

### Phase 5 — Documentation

#### Package Documentation

- [x] Update `packages/node/README.md` with new API, install commands, and examples per database
- [x] Add migration guide for existing PostgreSQL users (emphasize backward compatibility)
- [x] Update package.json keywords to include MySQL, SQLite, MSSQL

#### API Documentation Updates

- [x] Update `apps/docs/src/content/docs/api/node.mdx`:
  - Update constructor signature to show `string | TabulaLensConfig` overload
  - Add `TabulaLensConfig` interface documentation
  - Add `DatabaseType` union type documentation
  - Update constructor examples to show both string and config forms
  - Add `detectDatabaseType` function documentation
  - Update installation instructions to include database-specific driver installation
  - Add database-specific connection string examples

#### User Guides - Backend Integration

- [x] Restructure `apps/docs/src/content/docs/user-guides/backend/database-integration.mdx`:
  - Rename from "PostgreSQL Support" to "Database Support"
  - Add overview section for multi-database support
  - Create subsections for each database type (PostgreSQL, MySQL, SQLite, MSSQL)
  - Keep existing PostgreSQL content as a subsection
  - Add MySQL-specific connection strings, setup, and examples
  - Add SQLite-specific connection strings, setup, and examples
  - Add MSSQL-specific connection strings, setup, and examples
  - Add database selection guide (when to use which database)
  - Add auto-detection documentation
  - Update all code examples to show new API patterns
  - Add migration notes for existing PostgreSQL users

#### Architecture Documentation Updates

- [x] Update `apps/docs/src/content/docs/contributor-docs/architecture/database-architecture.mdx`:
  - Update "Database Support" section to reflect current multi-database support
  - Remove "Future Database Support" section (now implemented)
  - Add "Dialect Strategy Pattern" section explaining the architecture
  - Add "Database-Specific Behaviors" section
  - Update connection architecture to show dynamic client selection
  - Add auto-detection architecture explanation
  - Update query architecture to show dialect-specific query building
  - Add database driver dependency management section
  - Update type mapping tables for each database type

#### New Documentation Pages

- [x] Create `apps/docs/src/content/docs/user-guides/backend/mysql-support.mdx`:
  - Follow same structure as existing PostgreSQL guide
  - MySQL-specific connection strings and parameters
  - MySQL setup and configuration
  - MySQL-specific features and limitations
  - MySQL user permissions and security
  - Code examples specific to MySQL

- [x] Create `apps/docs/src/content/docs/user-guides/backend/sqlite-support.mdx`:
  - Follow same structure as existing PostgreSQL guide
  - SQLite-specific connection strings (file paths, in-memory)
  - SQLite setup and configuration
  - SQLite-specific features and limitations
  - SQLite file permissions and security
  - Code examples specific to SQLite

- [x] Create `apps/docs/src/content/docs/user-guides/backend/mssql-support.mdx`:
  - Follow same structure as existing PostgreSQL guide
  - MSSQL-specific connection strings and parameters
  - MSSQL setup and configuration
  - MSSQL-specific features and limitations
  - MSSQL user permissions and security
  - Code examples specific to MSSQL

#### Contributor Documentation

- [x] Update `apps/docs/src/content/docs/contributor-docs/architecture/architecture-decisions.mdx`:
  - Add ADR for multi-database support decision
  - Document the decision to use Knex.js over Drizzle
  - Document the dialect strategy pattern decision
  - Document the peer dependency approach

#### Integration Guides

- [x] Update relevant integration guides to mention database driver requirements
- [x] Update deployment guides to include database-specific considerations

#### AGENTS.md Updates

- [x] Update `AGENTS.md` with any new build/test notes
- [x] Add multi-database testing instructions
- [x] Add database driver installation notes for development

#### Troubleshooting Documentation

- [x] Add troubleshooting section for common multi-database issues:
  - Auto-detection failures
  - Driver installation problems
  - Database-specific connection issues
  - Type mapping issues
  - Dialect-specific query problems

### Phase 6 — Final Verification

- [ ] Run full test suite: `npm run test` in `packages/node`
- [ ] Run type check: `npm run check-types` in `packages/node`
- [ ] Run lint: `npm run lint` in `packages/node`
- [ ] Manually verify backward compatibility (existing string-form tests still pass)
- [ ] Test with each database driver individually (PostgreSQL, MySQL, SQLite, MSSQL)
- [ ] Verify error messages match specified format and are helpful
- [ ] Check code follows implementation guidelines (DRY, clean code, separation of concerns)
- [ ] Ensure all new code has appropriate JSDoc documentation
- [ ] Verify logging is consistent and includes proper context
- [ ] Update `AGENTS.md` with completed phase notes

---

## Post-Implementation Notes

### Version Bump Consideration

This feature adds new API surface area (`TabulaLensConfig`, `DatabaseType`) while maintaining 100% backward compatibility. Consider bumping the version from `0.3.2` to `0.4.0` (minor version) to reflect the API expansion, even though no breaking changes are introduced. This follows semantic versioning principles where minor versions add new functionality in a backward-compatible manner.
