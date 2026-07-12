import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { glob } from 'glob';

describe('Navigation Structure', () => {
  const configPath = resolve(__dirname, 'astro.config.mjs');
  const configContent = readFileSync(configPath, 'utf-8');

  it('should have Quick Start section', () => {
    expect(configContent).toContain("label: 'Quick Start'");
  });

  it('should have User Guides section with nested structure', () => {
    expect(configContent).toContain("label: 'User Guides'");
    expect(configContent).toContain("label: 'Authentication'");
    expect(configContent).toContain("label: 'Database Providers'");
  });

  it('should have API Reference section', () => {
    expect(configContent).toContain("label: 'API Reference'");
  });

  it('should have Contributor Docs section with nested structure', () => {
    expect(configContent).toContain("label: 'Contributor Docs'");
    expect(configContent).toContain("label: 'Architecture'");
    expect(configContent).toContain("label: 'Component Architecture'");
    expect(configContent).toContain("label: 'Internal Systems'");
    expect(configContent).toContain("label: 'Performance & Scaling'");
    expect(configContent).toContain("label: 'Security'");
  });

  it('should not have old Guides section', () => {
    // Ensure the old flat structure is removed
    const oldGuidesMatch = configContent.match(/label: 'Guides'/);
    expect(oldGuidesMatch).toBeNull();
  });

  it('should not have old Concepts section', () => {
    // Ensure the old flat structure is removed
    const oldConceptsMatch = configContent.match(/label: 'Concepts'/);
    expect(oldConceptsMatch).toBeNull();
  });
});

describe('File Structure', () => {
  const docsRoot = resolve(__dirname, 'src/content/docs');

  it('should have user-guides directory', async () => {
    const files = await glob('**/*', { cwd: resolve(docsRoot, 'user-guides') });
    expect(files.length).toBeGreaterThan(0);
  });

  it('should have contributor-docs directory', async () => {
    const files = await glob('**/*', { cwd: resolve(docsRoot, 'contributor-docs') });
    expect(files.length).toBeGreaterThan(0);
  });

  it('should have user-guides/frontend directory', async () => {
    const files = await glob('**/*', { cwd: resolve(docsRoot, 'user-guides/frontend') });
    expect(files.length).toBeGreaterThan(0);
  });

  it('should have user-guides/backend directory', async () => {
    const files = await glob('**/*', { cwd: resolve(docsRoot, 'user-guides/backend') });
    expect(files.length).toBeGreaterThan(0);
  });

  it('should have user-guides/authentication directory', async () => {
    const files = await glob('**/*', { cwd: resolve(docsRoot, 'user-guides/authentication') });
    expect(files.length).toBeGreaterThan(0);
  });

  it('should have about directory', async () => {
    const files = await glob('**/*', { cwd: resolve(docsRoot, 'about') });
    expect(files.length).toBeGreaterThan(0);
  });

  it('should have contributor-docs/architecture directory', async () => {
    const files = await glob('**/*', { cwd: resolve(docsRoot, 'contributor-docs/architecture') });
    expect(files.length).toBeGreaterThan(0);
  });

  it('should have contributor-docs/component-architecture directory', async () => {
    const files = await glob('**/*', {
      cwd: resolve(docsRoot, 'contributor-docs/component-architecture'),
    });
    expect(files.length).toBeGreaterThan(0);
  });

  it('should have contributor-docs/internal-systems directory', async () => {
    const files = await glob('**/*', {
      cwd: resolve(docsRoot, 'contributor-docs/internal-systems'),
    });
    expect(files.length).toBeGreaterThan(0);
  });

  it('should have contributor-docs/performance-scaling directory', async () => {
    const files = await glob('**/*', {
      cwd: resolve(docsRoot, 'contributor-docs/performance-scaling'),
    });
    expect(files.length).toBeGreaterThan(0);
  });

  it('should have contributor-docs/security directory', async () => {
    const files = await glob('**/*', { cwd: resolve(docsRoot, 'contributor-docs/security') });
    expect(files.length).toBeGreaterThan(0);
  });

  it('should not have old guides directory', async () => {
    const exists = await glob('**/*', { cwd: resolve(docsRoot, 'guides') }).catch(() => []);
    expect(exists.length).toBe(0);
  });

  it('should not have old concepts directory', async () => {
    const exists = await glob('**/*', { cwd: resolve(docsRoot, 'concepts') }).catch(() => []);
    expect(exists.length).toBe(0);
  });
});

describe('Referenced Files Exist', () => {
  const docsRoot = resolve(__dirname, 'src/content/docs');

  const expectedFiles = [
    'user-guides/frontend/frontend-implementation.mdx',
    'user-guides/frontend/tanstack-query-integration.mdx',
    'user-guides/frontend/tanstack-table-integration.mdx',
    'user-guides/frontend/styling-customization.mdx',
    'user-guides/backend/backend-implementation.mdx',
    'user-guides/authentication.mdx',
    'user-guides/authentication/authjs.mdx',
    'user-guides/authentication/auth0.mdx',
    'user-guides/authentication/better-auth.mdx',
    'user-guides/authentication/clerk.mdx',
    'user-guides/authentication/firebase-auth.mdx',
    'user-guides/authentication/kinde.mdx',
    'user-guides/authentication/lucia.mdx',
    'user-guides/authentication/supabase-auth.mdx',
    'user-guides/postgresql.mdx',
    'user-guides/mysql.mdx',
    'user-guides/sqlite.mdx',
    'user-guides/mssql.mdx',
    'user-guides/best-practices.mdx',
    'contributor-docs/architecture/architecture.mdx',
    'contributor-docs/architecture/backend-architecture.mdx',
    'contributor-docs/architecture/database-architecture.mdx',
    'contributor-docs/architecture/architecture-decisions.mdx',
    'contributor-docs/component-architecture/react-component-architecture.mdx',
    'contributor-docs/internal-systems/design-system.mdx',
    'contributor-docs/internal-systems/error-handling.mdx',
    'contributor-docs/internal-systems/logging-system.mdx',
    'contributor-docs/performance-scaling/performance-characteristics.mdx',
    'contributor-docs/performance-scaling/caching-strategies.mdx',
    'contributor-docs/performance-scaling/scalability.mdx',
    'contributor-docs/security/security.mdx',
    'contributor-docs/testing.mdx',
    'contributor-docs/testing-advanced.mdx',
    'about/accessibility.mdx',
  ];

  expectedFiles.forEach((file) => {
    it(`should have file: ${file}`, async () => {
      const exists = await glob(file, { cwd: docsRoot });
      expect(exists.length).toBeGreaterThan(0);
    });
  });
});

describe('Internal Links Updated', () => {
  const docsRoot = resolve(__dirname, 'src/content/docs');

  it('should not have old /guides/ links', async () => {
    const files = await glob('**/*.mdx', { cwd: docsRoot });
    let hasOldLinks = false;

    for (const file of files) {
      const content = readFileSync(resolve(docsRoot, file), 'utf-8');
      if (content.includes('](/guides/') && !content.includes('user-guides')) {
        hasOldLinks = true;
        break;
      }
    }

    expect(hasOldLinks).toBe(false);
  });

  it('should not have old /concepts/ links', async () => {
    const files = await glob('**/*.mdx', { cwd: docsRoot });
    let hasOldLinks = false;

    for (const file of files) {
      const content = readFileSync(resolve(docsRoot, file), 'utf-8');
      if (content.includes('](/concepts/') && !content.includes('contributor-docs')) {
        hasOldLinks = true;
        break;
      }
    }

    expect(hasOldLinks).toBe(false);
  });

  it('should not have old /user-guides/integrations/authentication links', async () => {
    const files = await glob('**/*.mdx', { cwd: docsRoot });
    let hasOldLinks = false;

    for (const file of files) {
      const content = readFileSync(resolve(docsRoot, file), 'utf-8');
      if (content.includes('/user-guides/integrations/authentication')) {
        hasOldLinks = true;
        break;
      }
    }

    expect(hasOldLinks).toBe(false);
  });

  it('should not have old /user-guides/backend/ links', async () => {
    const files = await glob('**/*.mdx', { cwd: docsRoot });
    let hasOldLinks = false;

    for (const file of files) {
      const content = readFileSync(resolve(docsRoot, file), 'utf-8');
      if (
        content.includes('/user-guides/backend/postgresql-support') ||
        content.includes('/user-guides/backend/mysql-support') ||
        content.includes('/user-guides/backend/sqlite-support') ||
        content.includes('/user-guides/backend/mssql-support') ||
        content.includes('/user-guides/backend/database-integration') ||
        content.includes('/user-guides/backend/logging-system')
      ) {
        hasOldLinks = true;
        break;
      }
    }

    expect(hasOldLinks).toBe(false);
  });

  it('should not have old /user-guides/production/ links', async () => {
    const files = await glob('**/*.mdx', { cwd: docsRoot });
    let hasOldLinks = false;

    for (const file of files) {
      const content = readFileSync(resolve(docsRoot, file), 'utf-8');
      if (content.includes('/user-guides/production/')) {
        hasOldLinks = true;
        break;
      }
    }

    expect(hasOldLinks).toBe(false);
  });
});
