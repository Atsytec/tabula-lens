# @tabula-lens/node

## 0.3.2

### Patch Changes

- 594fa12: Implement comprehensive npm package publishing best practices and fix critical configuration issues.

  Changes:

  - Add required package.json fields (author, license, repository, bugs, homepage, engines)
  - Fix exports field configuration for proper TypeScript resolution (types → import → default order)
  - Add sideEffects field for tree-shaking optimization
  - Create .npmignore files for proper package publishing
  - Add LICENSE files to package directories
  - Configure .npmrc for public access to scoped packages
  - Update GitHub Actions workflow for trusted publishing with OIDC
  - Enable package provenance generation for supply chain security
  - Update READMEs with correct license information, contributing guidelines, and support links
  - Fix React badge to reflect React 19+ requirement

## 0.3.0

### Minor Changes

- Add dynamic column filtering for database queries
- Improve package documentation with troubleshooting, security, and performance sections
- Add comprehensive logging documentation with configuration examples

### Patch Changes

- Fix sorting and filtering errors when switching tables
- Add table switching guardrails and column validation
- Use first available column as fallback for sorting
- Improve error handling and type safety

## 0.2.1

### Patch Changes

- Add UX/UI improvement roadmap and feasibility study documentation

## 0.2.0

### Minor Changes

- Convert to pure ESM format for better modern JavaScript support
- Add Express 5 support with version-specific adapters
- Add Hono, Elysia, and Fresh edge framework adapters
- Add Next.js, TanStack Start, Remix, and SvelteKit adapters
- Add Fastify, Koa, Hapi, Restify, and native HTTP adapters

### Patch Changes

- Improve type safety and framework integration

## 0.1.2

### Patch Changes

- Add comprehensive README files for npm packages with complete documentation, API reference, and usage examples.

## 0.1.1

### Patch Changes

- Initial public release

## 0.1.0

### Minor Changes

- Initial release of Tabula Lens - a React component library for viewing database data.

  Features:
  - Backend SDK with pagination, sorting, and filtering
  - React component with TanStack Table integration
  - TanStack Query for data fetching
  - PostgreSQL support (read-only)
