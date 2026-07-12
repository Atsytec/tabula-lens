# Documentation Restructuring Plan

## Overview

This document outlines the comprehensive restructuring plan for the Tabula Lens documentation, based on extensive analysis and grilling sessions about the current structure and content organization.

## Guiding Principles

1. **User Guides = Configuration and Usage Only** - Only what users can configure and use
2. **Contributor Docs = Implementation and Architecture** - Internal technical details
3. **Library Documentation Scope** - Focus on library integration, not app deployment/operations
4. **Logical Organization** - Group related concepts together (e.g., Authentication with Auth Providers)
5. **Simplified Navigation** - Flatten structure, remove overview pages that just list other pages

## New Navigation Structure

```javascript
sidebar: [
  {
    label: 'Quick Start',
    items: [{ label: 'Getting Started', slug: 'quick-start/getting-started' }],
  },
  {
    label: 'User Guides',
    items: [
      { label: 'Frontend Setup', slug: 'user-guides/frontend-setup' },
      { label: 'Backend Setup', slug: 'user-guides/backend-setup' },
      {
        label: 'Authentication',
        items: [
          { label: 'Overview', slug: 'user-guides/authentication' },
          { label: 'Auth.js', slug: 'user-guides/authjs' },
          { label: 'Auth0', slug: 'user-guides/auth0' },
          { label: 'Better Auth', slug: 'user-guides/better-auth' },
          { label: 'Clerk', slug: 'user-guides/clerk' },
          { label: 'Firebase Auth', slug: 'user-guides/firebase-auth' },
          { label: 'Kinde', slug: 'user-guides/kinde' },
          { label: 'Lucia Auth', slug: 'user-guides/lucia' },
          { label: 'Supabase Auth', slug: 'user-guides/supabase-auth' },
        ],
      },
      {
        label: 'Database Providers',
        items: [
          { label: 'PostgreSQL', slug: 'user-guides/postgresql' },
          { label: 'MySQL', slug: 'user-guides/mysql' },
          { label: 'SQLite', slug: 'user-guides/sqlite' },
          { label: 'SQL Server', slug: 'user-guides/mssql' },
        ],
      },
      { label: 'Best Practices', slug: 'user-guides/best-practices' },
    ],
  },
  {
    label: 'API Reference',
    items: [
      { label: 'React API', slug: 'api/react' },
      { label: 'Node API', slug: 'api/node' },
      { label: 'HTTP API', slug: 'api/http' },
    ],
  },
  {
    label: 'Contributor Docs',
    items: [
      { label: 'Overview', slug: 'contributor-docs' },
      { label: 'Onboarding', slug: 'contributor-docs/onboarding' },
      { label: 'Contributing to Documentation', slug: 'contributing' },
      {
        label: 'Architecture',
        items: [
          { label: 'Architecture Overview', slug: 'contributor-docs/architecture/architecture' },
          {
            label: 'Backend Architecture',
            slug: 'contributor-docs/architecture/backend-architecture',
          },
          {
            label: 'Backend Adapter Implementation',
            slug: 'contributor-docs/architecture/backend-implementation',
          },
          {
            label: 'Database Architecture',
            slug: 'contributor-docs/architecture/database-architecture',
          },
          {
            label: 'Architecture Decision Records',
            slug: 'contributor-docs/architecture/architecture-decisions',
          },
        ],
      },
      {
        label: 'Component Architecture',
        items: [
          {
            label: 'React Component Architecture',
            slug: 'contributor-docs/component-architecture/react-component-architecture',
          },
        ],
      },
      {
        label: 'Internal Systems',
        items: [
          { label: 'Design System', slug: 'contributor-docs/internal-systems/design-system' },
          { label: 'Error Handling', slug: 'contributor-docs/internal-systems/error-handling' },
          { label: 'Logging System', slug: 'contributor-docs/internal-systems/logging-system' },
        ],
      },
      {
        label: 'Performance & Scaling',
        items: [
          {
            label: 'Performance Characteristics',
            slug: 'contributor-docs/performance-scaling/performance-characteristics',
          },
          {
            label: 'Caching Strategies',
            slug: 'contributor-docs/performance-scaling/caching-strategies',
          },
          { label: 'Scalability', slug: 'contributor-docs/performance-scaling/scalability' },
        ],
      },
      {
        label: 'Security',
        items: [{ label: 'Security Model', slug: 'contributor-docs/security/security' }],
      },
      {
        label: 'Testing',
        items: [
          { label: 'Testing Guide', slug: 'contributor-docs/testing' },
          { label: 'Advanced Testing', slug: 'contributor-docs/testing-advanced' },
        ],
      },
    ],
  },
  {
    label: 'About',
    items: [{ label: 'Accessibility', slug: 'accessibility' }],
  },
];
```

## Implementation Phases

### Phase 1: Link Audit & Content Preparation ✅ COMPLETED

**1.1 Comprehensive Link Audit** ✅

- [x] Search for all internal links in `.mdx` files
- [x] Document all links to files that will be moved/deleted
- [x] Create mapping of old paths → new paths
- [x] Identify links to overview pages that will be deleted
- [x] Identify links to production files that will be removed

**1.2 Extract User-Facing Logging Content** ✅

- [x] Read `user-guides/backend/logging-system.mdx`
- [x] Extract user-facing configuration instructions
- [x] Create user guide section for logging configuration
- [x] Move internal implementation details to contributor docs content

**1.3 Create New Database Support File** ✅

- [x] Read all 4 database support files (PostgreSQL, MySQL, SQLite, MSSQL)
- [x] Read Supabase and Neon integration files
- [x] Create new `user-guides/postgresql.mdx` with sections:
  - Self-hosted PostgreSQL
  - Supabase (hosted PostgreSQL)
  - Neon (hosted PostgreSQL)
- [x] Create `user-guides/mysql.mdx` from MySQL support file
- [x] Create `user-guides/sqlite.mdx` from SQLite support file
- [x] Create `user-guides/mssql.mdx` from SQL Server support file
- [x] Ensure consistent structure across all database guides

**1.4 Create Best Practices Guide** ✅

- [x] Extract security best practices from performance-optimization.mdx
- [x] Extract performance tips from relevant files
- [x] Create `user-guides/best-practices.mdx` with sections:
  - Security best practices
  - Performance optimization
  - Error handling patterns
  - Common pitfalls to avoid

**1.5 Prepare Authentication File** ✅

- [x] Read `user-guides/integrations/authentication.mdx`
- [x] Ensure content is appropriate for top-level authentication guide
- [x] Update any internal links that will change
- [x] Prepare for move to `user-guides/authentication.mdx`

### Phase 2: File Operations

**2.1 Update Internal Links**

- [ ] Update all links to `user-guides/integrations/authentication.mdx` → `user-guides/authentication.mdx`
- [ ] Update all links to database support files → new consolidated files
- [ ] Update all links to production/testing files → contributor docs locations
- [ ] Remove or update links to deleted overview pages
- [ ] Update links to moved logging system content
- [ ] Verify no broken internal links remain

**2.2 Move Files to New Locations**

- [ ] Move `user-guides/integrations/authentication.mdx` → `user-guides/authentication.mdx`
- [ ] Move `user-guides/production/testing.mdx` → `contributor-docs/testing.mdx`
- [ ] Move `user-guides/production/testing-advanced.mdx` → `contributor-docs/testing-advanced.mdx`
- [ ] Move `user-guides/backend/logging-system.mdx` → `contributor-docs/internal-systems/logging-system.mdx`
- [ ] Move `accessibility.mdx` → `about/accessibility.mdx` (if creating about section)

**2.3 Create New Directory Structure**

- [ ] Create `user-guides/authentication/` directory for auth providers
- [ ] Move auth provider files into `user-guides/authentication/`:
  - `authjs.mdx`
  - `auth0.mdx`
  - `better-auth.mdx`
  - `clerk.mdx`
  - `firebase-auth.mdx`
  - `kinde.mdx`
  - `lucia.mdx`
  - `supabase-auth.mdx`
- [ ] Create `contributor-docs/implementation/` directory
- [ ] Create `about/` directory (if implementing)

**2.4 Delete Overview Pages**

- [ ] Delete `index.mdx` (root overview)
- [ ] Delete `user-guides/index.mdx`
- [ ] Delete `user-guides/frontend/index.mdx`
- [ ] Delete `user-guides/backend/index.mdx`
- [ ] Delete `user-guides/integrations/index.mdx`
- [ ] Delete `user-guides/production/index.mdx`
- [ ] Delete `contributor-docs/architecture/index.mdx`
- [ ] Delete `contributor-docs/component-architecture/index.mdx`
- [ ] Delete `contributor-docs/internal-systems/index.mdx`
- [ ] Delete `contributor-docs/performance-scaling/index.mdx`
- [ ] Delete `contributor-docs/security/index.mdx`

**2.5 Delete Operations Content**

- [ ] Delete `user-guides/production/deployment.mdx`
- [ ] Delete `user-guides/production/monitoring-observability.mdx`
- [ ] Delete `user-guides/production/performance-optimization.mdx`
- [ ] Delete `user-guides/production/` directory (if empty)

**2.6 Delete Old Database Files**

- [ ] Delete `user-guides/backend/postgresql-support.mdx`
- [ ] Delete `user-guides/backend/mysql-support.mdx`
- [ ] Delete `user-guides/backend/sqlite-support.mdx`
- [ ] Delete `user-guides/backend/mssql-support.mdx`
- [ ] Delete `user-guides/integrations/supabase.mdx`
- [ ] Delete `user-guides/integrations/neon.mdx`

**2.7 Delete Old Integrations Directory**

- [ ] Delete `user-guides/integrations/` directory (if empty after moves)
- [ ] Delete `user-guides/backend/database-integration.mdx` (if content moved to database guides)

**2.8 Place New Files**

- [ ] Place new `user-guides/postgresql.mdx`
- [ ] Place new `user-guides/mysql.mdx`
- [ ] Place new `user-guides/sqlite.mdx`
- [ ] Place new `user-guides/mssql.mdx`
- [ ] Place new `user-guides/best-practices.mdx`
- [ ] Place logging configuration content in appropriate user guide

### Phase 3: Configuration Updates

**3.1 Update astro.config.mjs**

- [ ] Update sidebar configuration with new structure
- [ ] Remove old "Production" section
- [ ] Update "User Guides" section with new organization
- [ ] Add "Authentication" nested structure
- [ ] Add "Database Providers" nested structure
- [ ] Move "Contributing to Documentation" into "Contributor Docs"
- [ ] Add "Testing" section to "Contributor Docs"
- [ ] Add "Logging System" to "Internal Systems"
- [ ] Verify all slugs match actual file paths

**3.2 Update navigation.test.ts**

- [ ] Remove tests for "Production" section
- [ ] Update tests for "User Guides" structure
- [ ] Add tests for "Authentication" nested structure
- [ ] Add tests for "Database Providers" nested structure
- [ ] Update file structure tests to match new directories
- [ ] Remove tests for deleted overview pages
- [ ] Add tests for new files (best-practices, etc.)
- [ ] Update expected files list
- [ ] Remove tests for deleted directories

**3.3 Update Content Configuration**

- [ ] Update `src/content.config.ts` if needed
- [ ] Verify all collections are properly configured
- [ ] Check for any hardcoded path references

### Phase 4: Verification

**4.1 Build Verification**

- [ ] Run `npm run build`
- [ ] Fix any build errors
- [ ] Verify build completes successfully
- [ ] Check for missing file references

**4.2 Link Verification**

- [ ] Run `npm run dev` and check for broken links
- [ ] Manually verify key navigation paths
- [ ] Test internal links between pages
- [ ] Verify all auth provider links work
- [ ] Verify all database provider links work

**4.3 Navigation Verification**

- [ ] Test sidebar navigation in development
- [ ] Verify all sections are accessible
- [ ] Check nested structures work correctly
- [ ] Verify breadcrumb navigation
- [ ] Test search functionality

**4.4 Content Verification**

- [ ] Verify authentication guide content is appropriate
- [ ] Verify database guides have all necessary information
- [ ] Verify best practices guide is comprehensive
- [ ] Verify logging configuration is accessible to users
- [ ] Verify contributor docs have all implementation details

**4.5 Test Verification**

- [ ] Run `npm run test`
- [ ] Verify all navigation tests pass
- [ ] Fix any failing tests
- [ ] Ensure test coverage is maintained

## Key Decisions Made

1. **Authentication Organization**: Auth providers nested under Authentication (general concept + specific implementations)
2. **Database Consolidation**: PostgreSQL, MySQL, SQLite, SQL Server as separate files; Supabase/Neon as sections in PostgreSQL
3. **Operations Content Removal**: Deployment, monitoring, performance optimization removed (library scope)
4. **Logging System Split**: User configuration in user guides, implementation in contributor docs
5. **Testing Location**: Moved to contributor docs (implementation concern)
6. **Best Practices**: New guide created for user-facing security/performance guidance
7. **Overview Pages**: All removed (navigation clutter)
8. **Contributing Section**: Nested under Contributor Docs
9. **About Section**: Keep minimal (Accessibility only for now)

## Files to be Deleted

### Overview Pages (10 files)

- `index.mdx` (root overview)
- `user-guides/index.mdx`
- `user-guides/frontend/index.mdx`
- `user-guides/backend/index.mdx`
- `user-guides/integrations/index.mdx`
- `user-guides/production/index.mdx`
- `contributor-docs/architecture/index.mdx`
- `contributor-docs/component-architecture/index.mdx`
- `contributor-docs/internal-systems/index.mdx`
- `contributor-docs/performance-scaling/index.mdx`
- `contributor-docs/security/index.mdx`

### Operations Content (3 files)

- `user-guides/production/deployment.mdx`
- `user-guides/production/monitoring-observability.mdx`
- `user-guides/production/performance-optimization.mdx`

### Database Files to Consolidate (6 files)

- `user-guides/backend/postgresql-support.mdx`
- `user-guides/backend/mysql-support.mdx`
- `user-guides/backend/sqlite-support.mdx`
- `user-guides/backend/mssql-support.mdx`
- `user-guides/integrations/supabase.mdx`
- `user-guides/integrations/neon.mdx`

## Files to be Moved

- `user-guides/integrations/authentication.mdx` → `user-guides/authentication.mdx`
- `user-guides/production/testing.mdx` → `contributor-docs/testing.mdx`
- `user-guides/production/testing-advanced.mdx` → `contributor-docs/testing-advanced.mdx`
- `user-guides/backend/logging-system.mdx` → `contributor-docs/internal-systems/logging-system.mdx`
- Auth provider files → `user-guides/authentication/` directory
- `accessibility.mdx` → `about/accessibility.mdx` (if creating about section)

## Files to be Created

- `user-guides/postgresql.mdx` (with Supabase/Neon sections)
- `user-guides/mysql.mdx`
- `user-guides/sqlite.mdx`
- `user-guides/mssql.mdx`
- `user-guides/best-practices.mdx`
- User-facing logging configuration content

## Risk Assessment

### High Risk

- **Database file consolidation**: Complex merge operation, risk of losing important information
- **Internal link updates**: Many links to update, risk of broken links
- **Navigation test updates**: Major changes to test suite

### Medium Risk

- **File moves**: Standard operation but many files involved
- **Content extraction**: Risk of extracting wrong content or missing important details

### Low Risk

- **Overview page deletion**: Straightforward removal
- **Operations content deletion**: Clear scope decision
- **Configuration updates**: Well-defined changes

## Success Criteria

1. All navigation tests pass
2. No broken internal links
3. Build completes successfully
4. All user-facing content is accessible
5. All contributor docs are preserved
6. Navigation structure matches agreed plan
7. Content is appropriately scoped (user vs contributor)
