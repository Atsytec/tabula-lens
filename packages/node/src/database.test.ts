import { describe, it, expect } from 'vitest';
import { detectDatabaseType, validateDatabaseType } from './database';
import { TabulaLensError } from './TabulaLens';

describe('detectDatabaseType', () => {
  describe('PostgreSQL detection', () => {
    it('should detect postgresql:// URLs', () => {
      expect(detectDatabaseType('postgresql://localhost/mydb')).toBe('pg');
      expect(detectDatabaseType('postgresql://user:pass@host:5432/db')).toBe('pg');
    });

    it('should detect postgres:// URLs', () => {
      expect(detectDatabaseType('postgres://localhost/mydb')).toBe('pg');
      expect(detectDatabaseType('postgres://user:pass@host:5432/db')).toBe('pg');
    });

    it('should detect pgsql:// URLs', () => {
      expect(detectDatabaseType('pgsql://localhost/mydb')).toBe('pg');
    });

    it('should detect hosted PostgreSQL services', () => {
      // Neon (direct + pooled)
      expect(
        detectDatabaseType(
          'postgresql://user:pass@ep-cool-rain-123456.us-east-2.aws.neon.tech/neondb?sslmode=require'
        )
      ).toBe('pg');
      expect(
        detectDatabaseType(
          'postgresql://user:pass@ep-cool-rain-123456-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require'
        )
      ).toBe('pg');

      // Supabase (direct + pooler)
      expect(
        detectDatabaseType(
          'postgresql://postgres.project-ref:password@db.project-id.supabase.co:5432/postgres'
        )
      ).toBe('pg');
      expect(
        detectDatabaseType(
          'postgresql://postgres.project-ref:password@aws-us-east-1.pooler.supabase.com:5432/postgres'
        )
      ).toBe('pg');

      // AWS RDS PostgreSQL
      expect(
        detectDatabaseType(
          'postgresql://user:password@mydb.abc123xyz.us-east-1.rds.amazonaws.com:5432/postgres'
        )
      ).toBe('pg');

      // Heroku Postgres
      expect(
        detectDatabaseType(
          'postgres://user:password@ec2-123-45-67-89.compute-1.amazonaws.com:5432/dbname'
        )
      ).toBe('pg');

      // Railway
      expect(
        detectDatabaseType(
          'postgresql://user:password@containers-us-west-123.railway.app:5432/railway'
        )
      ).toBe('pg');

      // TimescaleDB
      expect(detectDatabaseType('postgresql://user:password@abc123.timescale.io:5432/tsdb')).toBe(
        'pg'
      );

      // Azure Database for PostgreSQL
      expect(
        detectDatabaseType(
          'postgresql://user:password@myserver.postgres.database.azure.com:5432/postgres'
        )
      ).toBe('pg');

      // DigitalOcean Managed PostgreSQL
      expect(
        detectDatabaseType(
          'postgresql://user:password@mydb-do-user-123-0.db.ondigitalocean.com:25060/defaultdb'
        )
      ).toBe('pg');

      // CockroachDB
      expect(
        detectDatabaseType(
          'postgresql://user:password@mycluster.cockroachlabs.cloud:26257/defaultdb'
        )
      ).toBe('pg');

      // Google Cloud SQL
      expect(
        detectDatabaseType(
          'postgresql://user:password@/dbname?host=/cloudsql/project:region:instance'
        )
      ).toBe('pg');
    });
  });

  describe('MySQL detection', () => {
    it('should detect mysql:// URLs', () => {
      expect(detectDatabaseType('mysql://localhost/mydb')).toBe('mysql');
      expect(detectDatabaseType('mysql://user:pass@host:3306/db')).toBe('mysql');
    });

    it('should detect mysql2:// URLs', () => {
      expect(detectDatabaseType('mysql2://localhost/mydb')).toBe('mysql');
    });

    it('should detect mysqlx:// URLs', () => {
      expect(detectDatabaseType('mysqlx://localhost/mydb')).toBe('mysql');
    });

    it('should detect mariadb:// URLs', () => {
      expect(detectDatabaseType('mariadb://localhost/mydb')).toBe('mysql');
      expect(detectDatabaseType('mariadb://user:pass@host:3306/db')).toBe('mysql');
    });

    it('should detect hosted MySQL/MariaDB services', () => {
      // PlanetScale
      expect(
        detectDatabaseType('mysql://user:password@aws.connect.pscale.cloud/mydb?sslaccept=strict')
      ).toBe('mysql');

      // AWS RDS MySQL
      expect(
        detectDatabaseType(
          'mysql://user:password@mydb.abc123xyz.us-east-1.rds.amazonaws.com:3306/mysql'
        )
      ).toBe('mysql');

      // AWS RDS MariaDB
      expect(
        detectDatabaseType(
          'mysql://user:password@mydb.abc123xyz.us-east-1.rds.amazonaws.com:3306/mariadb'
        )
      ).toBe('mysql');

      // Azure Database for MySQL
      expect(
        detectDatabaseType('mysql://user:password@myserver.mysql.database.azure.com:3306/mydb')
      ).toBe('mysql');

      // DigitalOcean Managed MySQL
      expect(
        detectDatabaseType(
          'mysql://user:password@mydb-do-user-123-0.db.ondigitalocean.com:25060/defaultdb'
        )
      ).toBe('mysql');

      // Google Cloud SQL MySQL
      expect(
        detectDatabaseType('mysql://user:password@/mydb?host=/cloudsql/project:region:instance')
      ).toBe('mysql');
    });
  });

  describe('SQLite detection', () => {
    it('should detect sqlite:// URLs', () => {
      expect(detectDatabaseType('sqlite://./database.db')).toBe('sqlite');
      expect(detectDatabaseType('sqlite:///absolute/path/database.db')).toBe('sqlite');
    });

    it('should detect sqlite: URLs', () => {
      expect(detectDatabaseType('sqlite:./database.db')).toBe('sqlite');
      expect(detectDatabaseType('sqlite:/absolute/path/database.db')).toBe('sqlite');
    });

    it('should detect sqlite3:// URLs', () => {
      expect(detectDatabaseType('sqlite3://./database.db')).toBe('sqlite');
    });

    it('should detect .db file paths', () => {
      expect(detectDatabaseType('./database.db')).toBe('sqlite');
      expect(detectDatabaseType('/absolute/path/database.db')).toBe('sqlite');
      expect(detectDatabaseType('database.db')).toBe('sqlite');
    });

    it('should detect .sqlite file paths', () => {
      expect(detectDatabaseType('./database.sqlite')).toBe('sqlite');
      expect(detectDatabaseType('/absolute/path/database.sqlite')).toBe('sqlite');
      expect(detectDatabaseType('database.sqlite')).toBe('sqlite');
    });

    it('should detect .sqlite3 file paths', () => {
      expect(detectDatabaseType('./database.sqlite3')).toBe('sqlite');
      expect(detectDatabaseType('/absolute/path/database.sqlite3')).toBe('sqlite');
      expect(detectDatabaseType('database.sqlite3')).toBe('sqlite');
    });

    it('should detect .db3 file paths', () => {
      expect(detectDatabaseType('./database.db3')).toBe('sqlite');
      expect(detectDatabaseType('/absolute/path/database.db3')).toBe('sqlite');
      expect(detectDatabaseType('database.db3')).toBe('sqlite');
    });

    it('should detect in-memory SQLite', () => {
      expect(detectDatabaseType(':memory:')).toBe('sqlite');
      expect(detectDatabaseType(':MEMORY:')).toBe('sqlite');
    });

    it('should detect file: SQLite URLs', () => {
      expect(detectDatabaseType('file:./database.db')).toBe('sqlite');
      expect(detectDatabaseType('file:/absolute/path/database.db')).toBe('sqlite');
    });
  });

  describe('MSSQL detection', () => {
    it('should detect mssql:// URLs', () => {
      expect(detectDatabaseType('mssql://localhost/mydb')).toBe('mssql');
      expect(detectDatabaseType('mssql://user:pass@host:1433/db')).toBe('mssql');
    });

    it('should detect sqlserver:// URLs', () => {
      expect(detectDatabaseType('sqlserver://localhost/mydb')).toBe('mssql');
      expect(detectDatabaseType('sqlserver://user:pass@host:1433/db')).toBe('mssql');
    });

    it('should detect mssql+tcp:// and mssql+udp:// URLs', () => {
      expect(detectDatabaseType('mssql+tcp://localhost/mydb')).toBe('mssql');
      expect(detectDatabaseType('mssql+udp://localhost/mydb')).toBe('mssql');
    });

    it('should detect hosted SQL Server services', () => {
      // Azure SQL Database
      expect(
        detectDatabaseType('mssql://user:password@myserver.database.windows.net:1433/mydb')
      ).toBe('mssql');

      // AWS RDS SQL Server
      expect(
        detectDatabaseType(
          'mssql://user:password@mydb.abc123xyz.us-east-1.rds.amazonaws.com:1433/master'
        )
      ).toBe('mssql');
    });
  });

  describe('Error handling', () => {
    it('should throw TabulaLensError for empty string', () => {
      expect(() => detectDatabaseType('')).toThrow(TabulaLensError);
      expect(() => detectDatabaseType('')).toThrow('Database URL must be a non-empty string');
    });

    it('should throw TabulaLensError for non-string input', () => {
      expect(() => detectDatabaseType(null as never)).toThrow(TabulaLensError);
      expect(() => detectDatabaseType(undefined as never)).toThrow(TabulaLensError);
      expect(() => detectDatabaseType(123 as never)).toThrow(TabulaLensError);
    });

    it('should throw TabulaLensError for unknown URL schemes', () => {
      expect(() => detectDatabaseType('oracle://localhost/mydb')).toThrow(TabulaLensError);
      expect(() => detectDatabaseType('mongodb://localhost/mydb')).toThrow(TabulaLensError);
      expect(() => detectDatabaseType('redis://localhost/mydb')).toThrow(TabulaLensError);
    });

    it('should throw TabulaLensError with correct error message for unknown schemes', () => {
      try {
        detectDatabaseType('oracle://localhost/mydb');
        expect.fail('Should have thrown TabulaLensError');
      } catch (error) {
        expect(error).toBeInstanceOf(TabulaLensError);
        expect((error as TabulaLensError).message).toContain(
          'Unable to detect database type from URL'
        );
        expect((error as TabulaLensError).message).toContain(
          'Valid types: pg, mysql, sqlite, mssql'
        );
        expect((error as TabulaLensError).code).toBe('AUTO_DETECTION_FAILED');
      }
    });

    it('should handle whitespace-only strings', () => {
      expect(() => detectDatabaseType('   ')).toThrow(TabulaLensError);
    });
  });

  describe('Edge cases', () => {
    it('should handle URLs with query parameters', () => {
      expect(detectDatabaseType('postgresql://localhost/mydb?sslmode=require')).toBe('pg');
      expect(detectDatabaseType('mysql://localhost/mydb?charset=utf8mb4')).toBe('mysql');
    });

    it('should handle URLs with fragments', () => {
      expect(detectDatabaseType('postgresql://localhost/mydb#fragment')).toBe('pg');
    });

    it('should handle case sensitivity in URL schemes', () => {
      expect(detectDatabaseType('POSTGRESQL://localhost/mydb')).toBe('pg');
      expect(detectDatabaseType('MYSQL://localhost/mydb')).toBe('mysql');
      expect(detectDatabaseType('MSSQL://localhost/mydb')).toBe('mssql');
      expect(detectDatabaseType('SQLITE://./database.db')).toBe('sqlite');
    });

    it('should handle relative paths with .db extension', () => {
      expect(detectDatabaseType('../data/database.db')).toBe('sqlite');
      expect(detectDatabaseType('../../data/database.sqlite')).toBe('sqlite');
    });

    it('should handle complex file paths', () => {
      expect(detectDatabaseType('/var/data/my-app.db')).toBe('sqlite');
      expect(detectDatabaseType('C:\\Users\\data\\database.db')).toBe('sqlite');
    });
  });
});

describe('validateDatabaseType', () => {
  describe('Valid types', () => {
    it('should accept valid database types', () => {
      expect(validateDatabaseType('pg')).toBe('pg');
      expect(validateDatabaseType('mysql')).toBe('mysql');
      expect(validateDatabaseType('sqlite')).toBe('sqlite');
      expect(validateDatabaseType('mssql')).toBe('mssql');
    });
  });

  describe('Invalid types', () => {
    it('should throw TabulaLensError for invalid types', () => {
      expect(() => validateDatabaseType('oracle')).toThrow(TabulaLensError);
      expect(() => validateDatabaseType('mongodb')).toThrow(TabulaLensError);
      expect(() => validateDatabaseType('postgres')).toThrow(TabulaLensError);
      expect(() => validateDatabaseType('')).toThrow(TabulaLensError);
    });

    it('should throw TabulaLensError with correct error message', () => {
      try {
        validateDatabaseType('oracle');
        expect.fail('Should have thrown TabulaLensError');
      } catch (error) {
        expect(error).toBeInstanceOf(TabulaLensError);
        expect((error as TabulaLensError).message).toContain('Invalid database type');
        expect((error as TabulaLensError).message).toContain(
          'Valid types: pg, mysql, sqlite, mssql'
        );
        expect((error as TabulaLensError).code).toBe('INVALID_DATABASE_TYPE');
      }
    });
  });
});
