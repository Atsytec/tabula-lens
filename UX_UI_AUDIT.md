# UX/UI Audit — `@tabula-lens/react`

> Audit date: 2026-07-08  
> Package version: 0.2.1  
> Auditor: Devin (AI Engineering Assistant)

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [What Works Well](#what-works-well)
3. [Things to Improve](#things-to-improve)
   - [Accessibility](#accessibility)
   - [Interaction Design](#interaction-design)
   - [Visual Design](#visual-design)
   - [Developer Experience](#developer-experience)
   - [Code Quality](#code-quality)
4. [Missing Features](#missing-features)
5. [Priority Recommendations](#priority-recommendations)

---

## Executive Summary

`@tabula-lens/react` is a feature-rich database viewer component that has matured well architecturally (clean hook/component separation, memoization, TanStack Query integration). However, the **UX and visual quality lag behind its structural quality**. The component works but falls into the "Bootstrap v4 admin panel from 2017" aesthetic trap: flat blue buttons, `#ddd` borders, and zero personality. More critically, accessibility is incomplete in several places that would block real production use.

The customization API (both `classNames` and `styles` props on every element) is a genuine strength, but the reference implementation (the default styles) sets a poor baseline that consumers will want to override entirely.

**Rating: 6/10** — Solid bones, surface-level polish needed.

---

## What Works Well

### 1. Comprehensive Customization API

Every rendered element exposes both a `className` and a `style` override prop, plus a fully custom `React.FC` render slot. This is the right approach for a library component: opinionated defaults with total escape hatches. The API is consistent across `LoadingState`, `ErrorState`, `EmptyState`, `FilterInput`, `Pagination`, and `TableSelector`.

### 2. TanStack Query Integration

Using `@tanstack/react-query` for data fetching is the correct choice. It gives consumers caching, background refetching, stale-while-revalidate semantics, and window-focus refetch (correctly disabled by default for a data viewer). The `refetchInterval` prop is a clean addition for live-data use cases.

### 3. Debounced Filtering

A configurable `filterDebounceMs` (default 300ms) is correctly implemented using `setTimeout`/`clearTimeout` inside `useEffect`. This is the right pattern and the right default — it prevents a backend request on every keystroke.

### 4. Multi-Sort Support

Exposing `multiSort` as a prop and wiring it to `@tanstack/react-table`'s `enableMultiSort` is a thoughtful feature. Most data viewers skip this.

### 5. Table Selector Flexibility

Three modes (`dropdown`, `sidebar`, `none`) plus a fully custom component slot give consumers real flexibility. The sidebar layout correctly uses flexbox to place the selector alongside the table.

### 6. Modular Architecture

The refactored structure (hooks → utils → sub-components → orchestrator) is clean and composable. Custom hooks like `useDatabaseData`, `useTableState`, and `useQueryParams` are good public API surface for advanced consumers who want to build their own UI on top.

### 7. Query Error Handling

The error flow is complete: `ErrorState` renders with an accessible `onRetry` button that calls `refetch()`. The `onError` callback prop allows consumers to hook into errors for analytics or notifications.

### 8. TypeScript Coverage

The `DatabaseViewerProps` interface is thorough and well-documented with JSDoc. Type guards (`isQueryResult`) and validation helpers are a nice addition.

### 9. Performance Memoization

`React.memo` wrapping on all sub-components plus memoized render functions (`TableSelectorRenderer`, `FilterRenderer`, `PaginationRenderer`) is good React practice.

### 10. Logging System

The optional logging system with multiple formats (json, text, pretty), configurable log levels, and request IDs is production-grade and well-isolated.

---

## Things to Improve

### Accessibility

> These issues would cause failures in WCAG 2.1 AA audits and block use in enterprise/government contexts.

#### A1 — Missing `aria-label` on Pagination Buttons **[Critical]**

The pagination buttons (`<<`, `<`, `>`, `>>`) have no accessible label. A screen reader will announce literally "less-than less-than" or a symbol name. This is a WCAG 2.1 SC 1.1.1 violation.

```tsx
// Current (inaccessible)
<button onClick={() => onPageChange(0)} disabled={!canPreviousPage}>
  {'<<'}
</button>

// Should be
<button
  onClick={() => onPageChange(0)}
  disabled={!canPreviousPage}
  aria-label="First page"
>
  {'<<'}
</button>
```

#### A2 — Missing `aria-sort` on Sortable Column Headers **[Critical]**

The `<th>` elements have no `aria-sort` attribute. Screen readers cannot communicate the current sort direction to users. WCAG 2.1 SC 1.3.1.

```tsx
// Should add to th:
aria-sort={
  header.column.getIsSorted() === 'asc' ? 'ascending'
  : header.column.getIsSorted() === 'desc' ? 'descending'
  : 'none'
}
```

#### A3 — Missing `<label>` on Filter Input **[Critical]**

The `FilterInput` uses only a `placeholder` text (`"Filter records..."`). Placeholder text does not satisfy the WCAG SC 1.3.1 requirement for a programmatically associated label — it disappears when the user types, and screen readers do not guarantee reading it.

```tsx
// Should add a visually hidden label:
<label htmlFor="db-filter" className="sr-only">Filter records</label>
<input id="db-filter" type="text" ... />
```

#### A4 — Table Selector `<select>` Missing `<label>` **[Serious]**

The dropdown table selector renders a `<label>` element but it is not properly associated with the `<select>` via `htmlFor`:

```tsx
// Current (broken association)
<label style={{ marginRight: '0.5rem', fontWeight: 500 }}>{label}:</label>
<select ...>

// Should be
<label htmlFor="table-selector">{label}</label>
<select id="table-selector" ...>
```

#### A5 — Row Hover via Inline Event Handlers **[Serious]**

Row hover is implemented with `onMouseEnter`/`onMouseLeave` directly modifying `style.backgroundColor`. This approach:

- Does not work for keyboard focus navigation
- Does not support `:focus-visible` or `:focus-within` for keyboard users
- Bypasses any CSS custom property / dark mode overrides
- Is less performant than a CSS class toggle

Replace with a CSS class or CSS-in-JS approach that handles both hover and focus.

#### A6 — `FilterColumnSelector` Has No ARIA Role for Dropdown **[Moderate]**

The dropdown panel opened by `FilterColumnSelector` is a `<div>` with no `role`. It should be `role="dialog"` or `role="listbox"` with `aria-modal`, `aria-label`, and proper focus management (focus should move into the dropdown when opened and return to the trigger when closed).

#### A7 — Disabled Pagination Buttons Have No Visual Feedback **[Moderate]**

The `disabled` HTML attribute is set on pagination buttons, but `defaultStyles.paginationButton` applies a solid blue background regardless of state. CSS `:disabled` styles are not defined, so disabled buttons look identical to active ones. A user relying on color or visual affordance cannot determine which navigation actions are available.

#### A8 — No `role="table"` or `scope` Attributes **[Moderate]**

The rendered `<table>` lacks `role="table"` (redundant but helps in certain virtual DOM contexts) and `<th scope="col">`. The `scope` attribute on header cells is part of proper table accessibility.

---

### Interaction Design

#### I1 — No Visual State for Sorted Columns Beyond Background Color **[High]**

The sort icon is a bare Unicode arrow (`↑` / `↓`) rendered as a `<span>`. There is no visual differentiation between "sortable but not sorted" and "not sortable". Users must click to discover which columns are sortable.

**Recommendation:** Add a subtle indicator (e.g., an inactive up/down chevron icon) on hover for sortable-but-unsorted columns, so affordance is communicated before interaction.

#### I2 — Inline `<style>` Tag for Spinner Animation **[High]**

`LoadingState` injects a raw `<style>` tag:

```tsx
<style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
```

This is problematic:

1. If multiple `LoadingState` components render simultaneously, duplicate `<style>` tags are injected into the DOM
2. In a Next.js App Router or strict CSP environment, injecting raw `<style>` tags can fail or trigger security warnings
3. The keyframe cannot be customized without overriding the entire loading component

**Recommendation:** Use a CSS module, a dedicated CSS import, or a pre-defined CSS class. A data attribute with a global stylesheet entry is simpler and cleaner.

#### I3 — No Page Jump Input **[Medium]**

The pagination controls offer first/last/prev/next but no direct page input. For tables with hundreds of pages, users must click through sequentially. A simple number input (`<input type="number" min="1" max={pageCount} />`) between the navigation buttons would address this.

#### I4 — Filter Column Selector: Array Comparison Using `JSON.stringify` **[Medium]**

```tsx
disabled={JSON.stringify(tempSelected) === JSON.stringify(defaultColumns)}
```

This comparison is order-dependent. If `tempSelected` contains `['name', 'email']` and `defaultColumns` contains `['email', 'name']`, the "Reset to Default" button will remain enabled even when logically the selection matches the default. Use a set-based comparison.

#### I5 — Table Selector Dropdown Reuses `filterInput` Style **[Low]**

In `TableSelector`, the mode `'dropdown'` applies `defaultStyles.filter` and `defaultStyles.filterInput` to the wrapper and `<select>` respectively. These are semantically different UI elements that happen to share sizing, but coupling their styles creates unexpected behavior when a consumer overrides `filterInput` styles expecting to only affect the search field.

#### I6 — No Transition on Page/Data Change **[Low]**

When navigating pages or switching tables, content replaces instantly. A brief fade or skeleton placeholder during the data fetch transition would significantly improve perceived performance.

---

### Visual Design

#### V1 — Generic, Dateless Color Palette **[High]**

The default palette is generic Bootstrap-era blue:

- Primary: `#3498db` (Flat UI blue, circa 2014)
- Error: `#c33` (generic red)
- Background: `white` / `#f8f9fa`
- Border: `#ddd`

This communicates nothing distinctive about this product. Any project using these defaults will look like every other generic admin table. At minimum, the palette should use more modern tokens (OKLCH-based, slightly warmer neutrals, a primary that isn't the Flat UI default).

#### V2 — No Dark Mode Support **[High]**

All colors are hardcoded as light-mode values. In 2026, dark mode is a baseline expectation. There is no `prefers-color-scheme` media query handling in the default styles, no CSS variable layer for theming, and no `colorScheme` prop.

#### V3 — Font Family Redundancy in defaultStyles **[Low]**

`defaultStyles.container` defines the full system font stack. The example app also sets the same stack on `body`. If a consumer's app has a custom font, the component overrides it via the `fontFamily` inline style on the container.

**Recommendation:** Remove `fontFamily` from `defaultStyles.container` and let the component inherit from the DOM. Only apply it as an opt-in via the `styles` prop.

#### V4 — `EmptyState` Is Critically Underbaked **[High]**

```tsx
<div style={...}>
  No data available
</div>
```

An empty state is a primary moment of user direction. "No data available" tells the user nothing actionable:

- Why is there no data? (wrong filter? empty table? wrong table?)
- What should they do next?

A proper empty state should include:

- An icon or illustration
- A context-aware message (e.g., "No records match your filter — try clearing it" vs. "This table is empty")
- A clear action (e.g., a "Clear filter" button when a filter is active)

#### V5 — `ErrorState` Lacks Visual Hierarchy **[Medium]**

The error container is a red box with a "Retry" button. There is no error icon, no distinction between recoverable and fatal errors, and the error message exposes raw technical messages (`Error loading data: HTTP error! status: 500`). Users should see a human-friendly message; developers should see technical details in `console.error` (which the logging system already handles).

#### V6 — Column Headers Display Raw Database Field Names **[Medium]**

Headers like `id`, `created_at`, `is_active` are rendered verbatim from the database schema. A minimal default formatter should title-case and humanize these names (`ID`, `Created At`, `Is Active`). This should be the default behavior with an opt-out, not an opt-in.

#### V7 — Sticky Header Has No Box Shadow **[Low]**

The `<th>` elements are `position: sticky`, but there is no visual separator (box-shadow or border) to indicate the header is scrolled above content. When the table body scrolls behind the header, the visual separation is only a 1px border, which disappears on high-DPI displays.

---

### Developer Experience

#### D1 — `filterColumnSelectorPosition` and `filterColumnSelectorComponent` Props Are Dead Code **[Critical]**

Both props are declared in the interface, documented in JSDoc, and accepted in the component signature — but then immediately discarded with `eslint-disable-next-line @typescript-eslint/no-unused-vars`. This is API surface that does nothing.

```tsx
// eslint-disable-next-line @typescript-eslint/no-unused-vars
filterColumnSelectorPosition = 'filter',
// eslint-disable-next-line @typescript-eslint/no-unused-vars
filterColumnSelectorComponent,
```

A consumer reading the README or TypeScript types will believe these props are functional. This is a trust-breaking bug.

#### D2 — `Theme` and `createTheme` Are Exported but Never Used **[High]**

`styleTypes.ts` exports a `Theme` interface and `createTheme` function, but nothing in the component tree consumes them. The `DatabaseViewerProps` has no `theme` prop. These are published as part of the public API but have no effect. Either wire them up or remove them from the exports.

#### D3 — `StyleOverrides` Duplicates `Styles` **[Medium]**

`StyleOverrides` in `styleTypes.ts` has an identical shape to `Styles` in `DatabaseViewer.types.ts`. Two separate types with the same meaning and shape increases cognitive load for consumers.

#### D4 — `useQueryParams` Is Not a Hook **[Medium]**

`useQueryParams` contains no React hooks (`useState`, `useEffect`, `useContext`, etc.). It is a pure function that builds a query string. Naming it as a hook (`use` prefix) is a convention violation that implies it uses React internals and must follow the Rules of Hooks. Rename it to `buildQueryParams` or `buildQueryString`.

#### D5 — Module-Level Singleton `defaultQueryClient` **[Medium]**

```tsx
const defaultQueryClient = new QueryClient({ ... });
```

This singleton is created at module evaluation time and shared across all `DatabaseViewer` instances in the process. In a server-side rendering context (Next.js), this can cause request data to leak between users. The `DatabaseViewerWithProvider` pattern is the right solution; the inner `DatabaseViewer` should not create its own fallback client.

#### D6 — `FilterColumnSelector` Missing `React.memo` and `displayName` **[Low]**

Every other sub-component is wrapped in `React.memo` and has a `displayName`. `FilterColumnSelector` is not, making it the only component that re-renders on every parent render regardless of prop changes.

#### D7 — Double-Escaping Risk in `sanitizeColumnData` **[Medium]**

`sanitizeColumnData` HTML-escapes strings (`&` → `&amp;`, `<` → `&lt;`, etc.) and the resulting string is rendered via `flexRender` inside React, which then HTML-escapes it again. A database value like `Tom & Jerry` would display as `Tom &amp; Jerry` in the browser.

The correct approach is to return the raw string from `sanitizeColumnData` and let React handle escaping at render time. HTML escaping in string values is only needed when rendering with `dangerouslySetInnerHTML`, which this component never does.

#### D8 — `getSortedRowModel()` Included Despite Server-Side Sorting **[Low]**

The table uses `manualPagination: true` (server-side paging) and server-side sorting, but `getSortedRowModel()` is still registered with `useReactTable`. This model is never invoked (manual sorting bypasses it), but it adds unnecessary overhead and is confusing to developers reading the code.

---

### Code Quality

#### C1 — Row Hover Via DOM Mutation **[High]**

```tsx
onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8f9fa')}
onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
```

This bypasses React's reconciliation, is not accessible (keyboard focus does not trigger it), and hardcodes a color that cannot be overridden without removing the event handlers. Use a CSS class with `:hover` and `:focus-within` selectors, or a `data-attribute` approach.

#### C2 — `className` and `classNames` Prop Collision **[Medium]**

Many components accept both `className` (singular) and `classNames` (object). In `DataTable`, the logic is:

```tsx
className={className || classNames.tableWrapper}
```

This means `className` takes priority over `classNames.tableWrapper`, which is correct but not obvious. The API has two overlapping systems (`className` for the root element, `classNames` for all sub-elements) that are not cleanly separated for the root element itself.

#### C3 — Missing `content-type` Header Check Can Still Allow `response.json()` to Fail **[Low]**

In `validateResponse`, if content-type check fails, the function calls `response.text()` to log the response body. However, `response.body` may have already been consumed if the content type passes. If another caller had already consumed the body, `response.text()` would return an empty string. This is a minor edge case but worth noting.

---

## Missing Features

These features are absent and would be expected in a complete database viewer:

| Feature                           | Priority | Notes                                                            |
| --------------------------------- | -------- | ---------------------------------------------------------------- |
| **Dark mode**                     | High     | Essential in 2026                                                |
| **Column visibility toggle**      | High     | FilterColumnSelector handles filter columns, not display columns |
| **Cell value formatter callback** | High     | `formatCell?: (value: unknown, column: string) => ReactNode`     |
| **Column header formatter**       | High     | Auto-humanize field names + custom override                      |
| **Row click / row selection**     | Medium   | Essential for drill-down workflows                               |
| **CSV / JSON export**             | Medium   | Common need in data viewers                                      |
| **Page number input field**       | Medium   | Required for large page counts                                   |
| **Keyboard shortcuts**            | Medium   | `←`/`→` for pagination, `Escape` to clear filter                 |
| **Column resizing**               | Low      | Available in TanStack Table                                      |
| **Virtual scrolling**             | Low      | For large in-memory datasets                                     |
| **Column pinning**                | Low      | Sticky left/right columns                                        |
| **Skeleton loading**              | Low      | Better UX than spinner for table-shaped data                     |
| **Striped rows**                  | Low      | `striped` prop for alternating row colors                        |
| **Row density settings**          | Low      | Compact / Normal / Comfortable                                   |
| **i18n/l10n support**             | Medium   | All strings are hardcoded English                                |
| **Custom cell renderers**         | High     | Render badges, avatars, links in cells                           |

---

## Priority Recommendations

Listed by impact-to-effort ratio:

### P0 — Fix Immediately (accessibility violations)

1. Add `aria-label` to all pagination buttons
2. Add `aria-sort` to sortable `<th>` headers
3. Associate `<label htmlFor>` with filter input and table selector
4. Remove or implement `filterColumnSelectorPosition` / `filterColumnSelectorComponent` (dead API)

### P1 — Fix Soon (UX degradation)

5. Replace inline `<style>` spinner with CSS class / module
6. Replace row hover `onMouseEnter`/`onMouseLeave` with CSS
7. Fix `sanitizeColumnData` double-escaping bug
8. Add human-friendly column header formatting by default
9. Improve `EmptyState` with context-aware message and clear-filter action

### P2 — Plan for Next Release

10. Dark mode via CSS custom properties
11. Add visual disabled state to pagination buttons
12. Add `aria-label` / role to `FilterColumnSelector` dropdown
13. Wire up or remove `Theme` / `createTheme` from public API
14. Rename `useQueryParams` → `buildQueryParams`

### P3 — Feature Additions

15. `formatCell` prop for custom cell renderers
16. `formatHeader` prop for column header formatting
17. Row selection support
18. Page number direct-input in pagination
19. i18n string overrides prop
