# Link Audit for Documentation Restructuring

## Internal Links Found

### Links to Files Being Moved

| Source File                                         | Current Link                               | New Link                                            | Action Required |
| --------------------------------------------------- | ------------------------------------------ | --------------------------------------------------- | --------------- |
| contributor-docs/security/security.mdx              | `/user-guides/integrations/authentication` | `/user-guides/authentication`                       | Update          |
| user-guides/integrations/authentication.mdx         | `/contributor-docs/security/security`      | `/contributor-docs/security/security`               | No change       |
| user-guides/production/monitoring-observability.mdx | `/user-guides/backend/logging-system`      | `/contributor-docs/internal-systems/logging-system` | Update          |
| user-guides/production/deployment.mdx               | `/user-guides/backend/logging-system`      | `/contributor-docs/internal-systems/logging-system` | Update          |
| user-guides/production/testing.mdx                  | `/user-guides/production/testing-advanced` | `/contributor-docs/testing-advanced`                | Update          |
| user-guides/production/testing-advanced.mdx         | `/user-guides/production/testing`          | `/contributor-docs/testing`                         | Update          |

### Links to Files Being Deleted

| Source File                                         | Current Link                                       | Action Required   |
| --------------------------------------------------- | -------------------------------------------------- | ----------------- |
| contributor-docs/security/security.mdx              | `/user-guides/production/deployment`               | Remove or replace |
| user-guides/production/monitoring-observability.mdx | `/user-guides/production/performance-optimization` | Remove or replace |
| user-guides/production/monitoring-observability.mdx | `/user-guides/production/deployment`               | Remove or replace |
| user-guides/production/deployment.mdx               | `/user-guides/production/performance-optimization` | Remove or replace |
| user-guides/production/testing.mdx                  | `/user-guides/production/monitoring-observability` | Remove or replace |
| user-guides/production/testing.mdx                  | `/user-guides/production/performance-optimization` | Remove or replace |
| user-guides/production/testing-advanced.mdx         | `/user-guides/production/monitoring-observability` | Remove or replace |

### Links to Database Files Being Consolidated

| Source File                                  | Current Link                                | New Link                                   | Action Required |
| -------------------------------------------- | ------------------------------------------- | ------------------------------------------ | --------------- |
| user-guides/backend/database-integration.mdx | `./mysql-support`                           | `/user-guides/mysql`                       | Update          |
| user-guides/backend/database-integration.mdx | `./sqlite-support`                          | `/user-guides/sqlite`                      | Update          |
| user-guides/backend/database-integration.mdx | `./mssql-support`                           | `/user-guides/mssql`                       | Update          |
| user-guides/backend/postgresql-support.mdx   | `/user-guides/integrations/supabase`        | Section in `/user-guides/postgresql`       | Update          |
| user-guides/backend/mysql-support.mdx        | `./database-integration`                    | `/user-guides/postgresql` (or remove)      | Update          |
| user-guides/backend/mysql-support.mdx        | `./postgresql-support`                      | `/user-guides/postgresql`                  | Update          |
| user-guides/backend/mysql-support.mdx        | `./sqlite-support`                          | `/user-guides/sqlite`                      | Update          |
| user-guides/backend/mysql-support.mdx        | `./mssql-support`                           | `/user-guides/mssql`                       | Update          |
| user-guides/backend/sqlite-support.mdx       | `./database-integration`                    | `/user-guides/postgresql` (or remove)      | Update          |
| user-guides/backend/sqlite-support.mdx       | `./postgresql-support`                      | `/user-guides/postgresql`                  | Update          |
| user-guides/backend/sqlite-support.mdx       | `./mysql-support`                           | `/user-guides/mysql`                       | Update          |
| user-guides/backend/sqlite-support.mdx       | `./mssql-support`                           | `/user-guides/mssql`                       | Update          |
| user-guides/backend/mssql-support.mdx        | `./database-integration`                    | `/user-guides/postgresql` (or remove)      | Update          |
| user-guides/backend/mssql-support.mdx        | `./postgresql-support`                      | `/user-guides/postgresql`                  | Update          |
| user-guides/backend/mssql-support.mdx        | `./mysql-support`                           | `/user-guides/mysql`                       | Update          |
| user-guides/backend/mssql-support.mdx        | `./sqlite-support`                          | `/user-guides/sqlite`                      | Update          |
| user-guides/production/deployment.mdx        | `/user-guides/backend/database-integration` | `/user-guides/postgresql` (or specific DB) | Update          |

### Links to Overview Pages Being Deleted

| Source File        | Current Link            | Action Required  |
| ------------------ | ----------------------- | ---------------- |
| (To be identified) | Various index.mdx files | Remove or update |

### Links to Production Files Being Deleted

| Source File                                         | Current Link                                       | Action Required |
| --------------------------------------------------- | -------------------------------------------------- | --------------- |
| contributor-docs/security/security.mdx              | `/user-guides/production/deployment`               | Remove          |
| user-guides/production/monitoring-observability.mdx | `/user-guides/production/performance-optimization` | Remove          |
| user-guides/production/monitoring-observability.mdx | `/user-guides/production/deployment`               | Remove          |
| user-guides/production/deployment.mdx               | `/user-guides/production/performance-optimization` | Remove          |
| user-guides/production/testing.mdx                  | `/user-guides/production/monitoring-observability` | Remove          |
| user-guides/production/testing-advanced.mdx         | `/user-guides/production/monitoring-observability` | Remove          |

## Summary

### Files That Need Link Updates

1. contributor-docs/security/security.mdx (2 links)
2. user-guides/production/monitoring-observability.mdx (3 links)
3. user-guides/production/deployment.mdx (3 links)
4. user-guides/production/testing.mdx (3 links)
5. user-guides/production/testing-advanced.mdx (1 link)
6. user-guides/backend/database-integration.mdx (3 links)
7. user-guides/backend/postgresql-support.mdx (1 link)
8. user-guides/backend/mysql-support.mdx (4 links)
9. user-guides/backend/sqlite-support.mdx (4 links)
10. user-guides/backend/mssql-support.mdx (4 links)

### Total Link Updates Required: 28 links

### Priority Actions

1. Update links to moved files (authentication, testing, logging-system)
2. Update links to database consolidation files
3. Remove or replace links to deleted production files
4. Handle overview page links
