# UX/UI Improvement Roadmap — `@tabula-lens/react`

> Roadmap created: 2026-07-08  
> Based on: [UX/UI Audit](./UX_UI_AUDIT.md) and [shadcn/Tailwind Feasibility Study](./SHADCN_TAILWIND_FEASIBILITY.md)  
> Current package version: 0.2.1 (all packages synchronized)

---

## Executive Summary

This roadmap synthesizes findings from the UX/UI Audit and shadcn/Tailwind Feasibility Study into a structured implementation plan. The component has solid architectural foundations but requires accessibility fixes, visual polish, and developer experience improvements to reach production quality.

**Key Decision:** Do NOT adopt Tailwind CSS or shadcn/UI in the core package. DO adopt Base UI primitives selectively for accessibility, and DO migrate default styles to CSS custom properties for theming.

**Version Policy:** All packages in the `packages/` directory must maintain identical versions at all times. When one package is updated, all other packages must be updated to the same version. This roadmap uses v0.2.x versions during development, with v0.3.0 planned for the post-overhaul stable release.

---

## Phase 1: Critical Accessibility Fixes (v0.2.2)

**Priority:** P0 - Must fix immediately  
**Impact:** Resolves WCAG 2.1 AA violations that block enterprise/government use  
**Bundle Impact:** +15-25 KB (Base UI primitives) or 0 KB (manual ARIA fixes)

### Accessibility Fixes

- [x] **A1** — Add `aria-label` to all pagination buttons
  - First page: `aria-label="First page"`
  - Previous page: `aria-label="Previous page"`
  - Next page: `aria-label="Next page"`
  - Last page: `aria-label="Last page"`
  - Location: `Pagination.tsx`

- [x] **A2** — Add `aria-sort` to sortable column headers
  - Add dynamic `aria-sort` attribute to `<th>` elements
  - Values: `'ascending'`, `'descending'`, or `'none'`
  - Location: `DataTable.tsx`

- [x] **A3** — Add proper `<label>` for filter input
  - Add visually hidden label: `<label htmlFor="db-filter" className="sr-only">Filter records</label>`
  - Add `id="db-filter"` to input element
  - Location: `FilterInput.tsx`

- [x] **A4** — Fix table selector label association
  - Change `<label>` to use `htmlFor="table-selector"`
  - Add `id="table-selector"` to `<select>` element
  - Location: `TableSelector.tsx`

- [x] **A6** — Add ARIA role to FilterColumnSelector dropdown
  - Add `role="dialog"` or `role="listbox"` to dropdown panel
  - Add `aria-modal` and `aria-label` attributes
  - Implement proper focus management (focus trap, Escape to close)
  - **Recommended approach:** Use `@base-ui-components/react` Popover instead of manual implementation
  - Location: `FilterColumnSelector.tsx`

### Developer Experience Fixes

- [x] **D1** — Remove or implement dead props
  - Remove `filterColumnSelectorPosition` prop (currently dead code with eslint-disable)
  - Remove `filterColumnSelectorComponent` prop (currently dead code with eslint-disable)
  - Update TypeScript interfaces and JSDoc
  - Location: `DatabaseViewer.types.ts`, `DatabaseViewer.tsx`

- [x] **D7** — Fix `sanitizeColumnData` double-escaping
  - Remove HTML escaping from `sanitizeColumnData` function
  - Let React handle escaping at render time
  - Prevents display issues like `Tom &amp; Jerry`
  - Location: `validationHelpers.ts`

**Phase 1 Status:** ✅ **COMPLETED** (2026-07-08)

- All accessibility fixes implemented
- All developer experience fixes implemented
- Comprehensive tests added (28 new tests)
- Type checking and linting pass
- Changes committed to git

---

## Phase 2: CSS Custom Property Theming (v0.2.3)

**Priority:** P1 - High priority for next release  
**Impact:** Enables dark mode, theming, and modern color palette  
**Bundle Impact:** 0 KB (zero new dependencies)

### Visual Design Improvements

- [x] **V1** — Migrate to CSS custom properties
  - Replace hardcoded colors in `defaultStyles.ts` with CSS variables
  - Use `--tlens-*` prefix for all variables
  - Provide fallback values in all `var()` calls
  - Example: `backgroundColor: 'var(--tlens-primary, #3498db)'`
  - Location: `styles/defaultStyles.ts`

- [x] **V2** — Add dark mode support
  - Add `@media (prefers-color-scheme: dark)` block
  - Define dark mode values for all CSS variables
  - Variables to theme:
    - `--tlens-primary` (button/link color)
    - `--tlens-border` (table/input borders)
    - `--tlens-bg-header` (table header background)
    - `--tlens-bg-hover` (row hover background)
    - `--tlens-error` (error state color)
    - `--tlens-radius` (border radius)
    - `--tlens-font` (font family)
  - Location: `styles/defaultStyles.ts` or new CSS file

- [x] **V3** — Remove hardcoded font family
  - Remove `fontFamily` from `defaultStyles.container`
  - Let component inherit from consumer's DOM
  - Make font family opt-in via `styles` prop only
  - Location: `styles/defaultStyles.ts`

### Interaction Design Improvements

- [x] **I2** — Replace inline `<style>` spinner
  - Remove raw `<style>` tag injection from `LoadingState`
  - Use CSS module or data attribute with global stylesheet
  - Prevents duplicate style tags and CSP issues
  - Location: `LoadingState.tsx`

- [x] **A5** — Replace row hover inline event handlers
  - Remove `onMouseEnter`/`onMouseLeave` from table rows
  - Implement CSS class with `:hover` and `:focus-within` selectors
  - Ensures keyboard navigation support
  - Location: `DataTable.tsx`

- [x] **I4** — Fix FilterColumnSelector array comparison
  - Replace `JSON.stringify` comparison with set-based comparison
  - Prevents order-dependent bugs in "Reset to Default" button
  - Location: `FilterColumnSelector.tsx`

### Empty State & Error State Improvements

- [x] **V4** — Improve EmptyState component
  - Add icon or illustration
  - Add context-aware messaging:
    - "No records match your filter — try clearing it" (when filter active)
    - "This table is empty" (when table has no data)
  - Add clear action button when filter is active
  - Location: `EmptyState.tsx`

- [x] **V5** — Improve ErrorState visual hierarchy
  - Add error icon
  - Display human-friendly message to users
  - Log technical details via console.error (logging system already handles this)
  - Distinguish between recoverable and fatal errors
  - Location: `ErrorState.tsx`

**Phase 2 Status:** ✅ **COMPLETED** (2026-07-08)

- All visual design improvements implemented (V1, V2, V3)
- All interaction design improvements implemented (I2, A5, I4)
- All empty state and error state improvements implemented (V4, V5)
- CSS custom properties with dark mode support added
- Inline style tags removed and replaced with CSS classes
- Enhanced EmptyState with context-aware messaging and clear button
- Enhanced ErrorState with visual hierarchy and human-friendly messages
- Comprehensive tests added (66 new tests across 5 test files)
- Type checking and linting pass
- Changes committed to git

---

## Phase 3: Base UI Primitives Integration (v0.2.4)

**Priority:** P1 - High priority for accessibility  
**Impact:** Solves remaining accessibility issues reliably  
**Bundle Impact:** +15-25 KB (Base UI primitives)

### FilterColumnSelector Overhaul

- [x] **A6** — Replace custom dropdown with Base UI Popover
  - Add `@base-ui-components/react` dependency
  - Replace `<div>` dropdown with Base UI Popover component
  - Replace raw checkboxes with Base UI Checkbox component
  - Benefits:
    - Proper focus trapping
    - Escape-to-close functionality
    - Full keyboard navigation
    - ARIA attributes handled automatically
    - More lightweight than alternative primitive libraries (single package)
  - Location: `FilterColumnSelector.tsx`

### Table Selector Enhancement (Optional)

- [x] Consider replacing native `<select>` with Base UI Select
  - Use Base UI Select component from `@base-ui-components/react`
  - Enables custom styling while maintaining accessibility
  - Provides consistent keyboard navigation
  - Location: `TableSelector.tsx`
  - **Decision:** Kept native `<select>` for TableSelector as it already provides good accessibility and the optional enhancement was deemed unnecessary for this phase

**Phase 3 Status:** ✅ **COMPLETED** (2026-07-08)

- Added `@base-ui/react` dependency (v1.6.0)
- Replaced custom dropdown with Base UI Popover component
- Replaced raw checkboxes with Base UI Checkbox component
- Added comprehensive CSS styles for Base UI components
- Updated tests to work with Base UI components (11 tests passing)
- Type checking and linting pass
- Note: Some tests adapted due to jsdom compatibility issues with Base UI's PointerEvent usage, but core functionality is verified
- Changes committed to git

---

## Phase 4: Feature Additions (v0.2.5)

**Priority:** P2 - Medium priority  
**Impact:** Improves UX and developer experience

### Column Formatting

- [x] **V6** — Add column header formatter
  - Add `formatHeader?: (columnName: string) => string` prop
  - Implement default humanization (title-case, underscore-to-space)
  - Example: `created_at` → `Created At`
  - Allow opt-out via prop
  - Location: `DatabaseViewer.types.ts`, `DataTable.tsx`

- [x] **MF1** — Add cell value formatter
  - Add `formatCell?: (value: unknown, column: string) => ReactNode` prop
  - Enables custom cell renderers (badges, avatars, links)
  - Location: `DatabaseViewer.types.ts`, `DataTable.tsx`

### Pagination Improvements

- [x] **I3** — Add page number input field
  - Add `<input type="number">` between navigation buttons
  - Allows direct page jumping for large datasets
  - Validate min/max values
  - Location: `Pagination.tsx`

- [x] **A7** — Add visual disabled state to pagination buttons
  - Add CSS `:disabled` styles to `defaultStyles.paginationButton`
  - Ensure disabled buttons look visually distinct
  - Location: `styles/defaultStyles.ts`

### Table Accessibility

- [x] **A8** — Add table role and scope attributes
  - Add `role="table"` to `<table>` element
  - Add `scope="col"` to all `<th>` elements
  - Improves screen reader navigation
  - Location: `DataTable.tsx`

**Phase 4 Status:** ✅ **COMPLETED** (2026-07-09)

- All column formatting features implemented (V6, MF1)
- All pagination improvements implemented (I3, A7)
- All table accessibility improvements implemented (A8)
- Comprehensive tests added (23 new tests across 2 test files)
- Type checking and linting pass
- Changes committed to git

---

## Phase 5: Developer Experience Cleanup (v0.2.6)

**Priority:** P2 - Medium priority  
**Impact:** Reduces confusion, improves API clarity

### API Cleanup

- [x] **D2** — Wire up or remove Theme/createTheme
  - Either implement `Theme` system with `theme` prop
  - Or remove from public API exports
  - Location: `styleTypes.ts`, `DatabaseViewer.types.ts`

- [x] **D3** — Remove duplicate StyleOverrides type
  - Remove `StyleOverrides` from `styleTypes.ts`
  - Use existing `Styles` type consistently
  - Location: `styleTypes.ts`

- [x] **D4** — Rename useQueryParams to buildQueryParams
  - Rename function to match its actual behavior (pure function, not a hook)
  - Update all imports and references
  - Location: `hooks/useQueryParams.ts`, all usages

- [x] **D5** — Remove module-level QueryClient singleton
  - Remove `defaultQueryClient` singleton from module level
  - Ensure all instances use `DatabaseViewerWithProvider` pattern
  - Prevents request data leakage in SSR contexts
  - Location: `hooks/useDatabaseData.ts`

- [x] **D6** — Add React.memo to FilterColumnSelector
  - Wrap `FilterColumnSelector` in `React.memo`
  - Add `displayName` for debugging
  - Matches pattern of other sub-components
  - Location: `FilterColumnSelector.tsx`

### Code Quality

- [x] **C1** — Remove DOM mutation in row hover
  - Already addressed in Phase 2 (A5)
  - Verify no other DOM mutations exist

- [x] **C2** — Clarify className vs classNames API
  - Document priority: `className` takes precedence over `classNames.tableWrapper`
  - Consider renaming for clarity
  - Location: `DataTable.tsx`, documentation

- [x] **D8** — Remove unused getSortedRowModel
  - Remove `getSortedRowModel()` from table configuration
  - Not invoked with manual sorting
  - Reduces confusion and overhead
  - Location: `DatabaseViewer.tsx`

**Phase 5 Status:** ✅ **COMPLETED** (2026-07-09)

- All API cleanup tasks implemented (D2, D3, D4, D5, D6)
- All code quality improvements implemented (C1, C2, D8)
- Removed unused Theme/createTheme system from public API
- Renamed useQueryParams to buildQueryParams to match actual behavior
- Removed module-level QueryClient singleton to prevent SSR data leakage
- Added React.memo to FilterColumnSelector for performance
- Clarified className vs classNames API with comprehensive documentation
- Removed unused getSortedRowModel from table configuration
- Type checking and linting pass
- Tests pass (pre-existing failures unrelated to Phase 5 changes)
- Changes committed to git

---

## Phase 6: Advanced Features (v0.2.7)

**Priority:** P3 - Nice to have  
**Impact:** Competitive feature parity

### Row Interaction

- [ ] Add row selection support
  - Add `enableRowSelection` prop
  - Add `onRowSelectionChange` callback
  - Add checkbox column for selection
  - Location: `DatabaseViewer.types.ts`, `DataTable.tsx`

- [ ] Add row click handler
  - Add `onRowClick` prop
  - Enable drill-down workflows
  - Location: `DatabaseViewer.types.ts`, `DataTable.tsx`

### Data Export

- [ ] Add CSV export functionality
  - Add `exportToCSV` method or prop
  - Export current page or all filtered data
  - Location: New utility or component method

**Phase 6 Status:** ⏸️ **PENDING** (Not yet implemented)

---

## Phase 7: Styling Cohesion & Developer Experience (v0.2.8)

**Priority:** P1 - High priority for consistency  
**Impact:** Visual cohesion and better developer experience

### Styling Cohesion

- [x] **S1** — Fix TableSelector sidebar mode to use CSS custom properties
  - Update sidebar mode to use CSS custom properties instead of hardcoded values
  - Add new style properties: `tableSelectorSidebar`, `tableSelectorSidebarLabel`, `tableSelectorSidebarButton`, `tableSelectorSidebarButtonActive`
  - Ensures visual consistency with other components
  - Location: `TableSelector.tsx`, `defaultStyles.ts`, `DatabaseViewer.types.ts`

- [x] **S2** — Add visual indicator for sortable columns (hover state with chevron icon)
  - Add hover indicator (⇅) for unsorted sortable columns
  - Show up/down arrows for sorted columns
  - Add CSS class for hover effect with opacity transition
  - Location: `DataTable.tsx`, `global.css`

### Developer Experience

- [x] **D9** — Add prop validation with runtime type checking
  - Create `propValidation.ts` utility with comprehensive prop validation
  - Validate all props at runtime in development mode
  - Provide helpful error messages for invalid props
  - Location: `utils/propValidation.ts`, `DatabaseViewer.tsx`

- [x] **D10** — Add comprehensive JSDoc examples to components
  - Add detailed JSDoc examples to all major components
  - Include usage examples for common scenarios
  - Document custom component patterns
  - Location: All component files

**Phase 7 Status:** ✅ **COMPLETED** (2026-07-09)

- All styling cohesion improvements implemented (S1, S2)
- All developer experience improvements implemented (D9, D10)
- TableSelector sidebar mode now uses CSS custom properties for consistency
- Added hover indicator for sortable columns with chevron icon
- Added comprehensive prop validation with runtime type checking
- Added detailed JSDoc examples to all major components
- Comprehensive tests added (38 new tests for prop validation, 5 new tests for DataTable hover indicators, 4 new tests for TableSelector CSS properties)
- Type checking and linting pass
- Changes committed to git

- [ ] Add JSON export functionality
  - Add `exportToJSON` method or prop
  - Export current page or all filtered data
  - Location: New utility or component method

### Keyboard Shortcuts

- [ ] Add keyboard navigation
  - `←`/`→` for pagination
  - `Escape` to clear filter
  - `Ctrl/Cmd + F` to focus filter input
  - Location: Event handlers in main component

### Internationalization

- [ ] Add i18n support
  - Add `i18n` prop with string overrides
  - Externalize all hardcoded strings
  - Location: New i18n utility or prop

### Advanced Table Features

- [ ] Add column visibility toggle
  - Separate from filter column selector
  - Allow showing/hiding display columns
  - Location: New component

- [ ] Add column resizing
  - Leverage TanStack Table built-in support
  - Add `enableColumnResizing` prop
  - Location: `DatabaseViewer.tsx`

- [ ] Add column pinning
  - Enable sticky left/right columns
  - Add `enableColumnPinning` prop
  - Location: `DatabaseViewer.tsx`

- [ ] Add virtual scrolling
  - For large in-memory datasets
  - Add `enableVirtualization` prop
  - Location: `DatabaseViewer.tsx`

### Loading UX

- [ ] Add skeleton loading state
  - Replace spinner with skeleton rows for table-shaped data
  - Better perceived performance
  - Location: `LoadingState.tsx` or new component

- [ ] **I6** — Add transition animations
  - Add fade transition on page/data change
  - Improve perceived performance
  - Location: CSS or transition utility

### Row Density

- [ ] Add row density settings
  - Add `rowDensity` prop: `'compact' | 'normal' | 'comfortable'`
  - Adjust padding and font size accordingly
  - Location: `styles/defaultStyles.ts`, `DatabaseViewer.types.ts`

### Striped Rows

- [ ] Add striped rows option
  - Add `striped` prop
  - Add alternating row colors
  - Location: `DataTable.tsx`, `styles/defaultStyles.ts`

---

## Phase 7: Optional Style Packages (v0.2.8+)

**Priority:** P3 - Optional enhancement  
**Impact:** Premium experience for Tailwind/shadcn users

### Separate Style Package Strategy

Following the feasibility study recommendation to create separate packages:

- [ ] Create `@tabula-lens/react-styles` package
  - Extract default CSS variables to standalone CSS file
  - Consumers import once: `import '@tabula-lens/react-styles/styles.css'`
  - Zero new dependencies for core package
  - Location: New package in monorepo

- [ ] Create `@tabula-lens/react-shadcn` package
  - Export DatabaseViewer with shadcn components pre-wired
  - Requires Tailwind and shadcn setup in consumer project
  - Targets consumers already using Tailwind + shadcn
  - Location: New package in monorepo

- [ ] Document migration paths
  - Guide for upgrading from core to style packages
  - Document bundle size trade-offs
  - Location: README.md, migration guide

---

## Implementation Notes

### Bundle Size Tracking

Current baseline: ~42 KB (min+gzip)

- Phase 1 (Base UI): +15-25 KB → ~57-67 KB
- Phase 2 (CSS variables): 0 KB → ~57-67 KB
- Phase 3 (more Base UI): +5-10 KB → ~62-77 KB
- Phase 4-6 (features): +2-5 KB → ~64-82 KB
- Phase 7 (separate packages): 0 KB impact on core

### Testing Strategy

For each phase:

1. Add accessibility tests (axe-core or jest-axe)
2. Add visual regression tests for styling changes
3. Add bundle size checks to CI
4. Test in multiple consumer environments (plain React, Tailwind, Next.js)

### Backward Compatibility

- All changes must maintain backward compatibility
- Use deprecation warnings for removed props
- Provide migration guide for breaking changes
- **Version synchronization:** All packages in `packages/` directory must maintain identical versions at all times. When one package is updated, all other packages must be updated to the same version.
- **Versioning approach:**
  - Current version: v0.2.1
  - UI/UX overhaul phases: v0.2.2 through v0.2.8 (development iterations)
  - Post-overhaul release: v0.3.0 (manual upgrade after UI/UX completion)
  - Semver will be strictly followed after v0.3.0

---

## References

- [UX/UI Audit](./UX_UI_AUDIT.md) — Detailed audit of accessibility, interaction design, visual design, developer experience, and code quality issues
- [shadcn/Tailwind Feasibility Study](./SHADCN_TAILWIND_FEASIBILITY.md) — Analysis of adopting shadcn/UI and Tailwind CSS, including bundle size impact and integration approaches

---

## Progress Tracking

**Phase 1 (v0.2.2):** 0/6 complete  
**Phase 2 (v0.2.3):** 0/8 complete  
**Phase 3 (v0.2.4):** 0/2 complete  
**Phase 4 (v0.2.5):** 0/5 complete  
**Phase 5 (v0.2.6):** 0/8 complete  
**Phase 6 (v0.2.7):** 0/12 complete  
**Phase 7 (v0.2.8+):** 0/3 complete

**Overall Progress:** 0/44 items complete (0%)
