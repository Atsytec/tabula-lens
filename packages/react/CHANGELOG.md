# @tabula-lens/react

## 0.4.0

### Minor Changes

- 36309a1: Multi-Database support

## 0.3.2

### Patch Changes

- 879fd06: Docs page release

## 0.3.1

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
- Add visual hover indicators for sortable table columns
- Add runtime prop validation in development mode
- Improve accessibility with ARIA labels and roles
- Add comprehensive documentation with usage examples
- Improve performance with React.memo optimization
- Enhance styling with CSS custom properties for theming support

### Patch Changes

- Fix sorting and filtering errors when switching tables
- Add table switching guardrails and column validation
- Use first available column as fallback for sorting
- Fix data sanitization to prevent double-escaping
- Improve error handling and type safety

## 0.2.1

### Patch Changes

- Add UX/UI improvement roadmap and feasibility study documentation

## 0.2.0

### Minor Changes

- Remove default initialTable and enable tableSelector by default
- Convert to pure ESM format for better modern JavaScript support
- Add Express 5 support with version-specific adapters

### Patch Changes

- Disable colorization by default in logger for better compatibility
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
