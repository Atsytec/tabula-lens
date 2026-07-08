# Feasibility Study — shadcn/UI + Tailwind CSS for `@tabula-lens/react`

> Study date: 2026-07-08  
> Package version: 0.2.1

---

## Table of Contents

1. [What Are We Evaluating](#what-are-we-evaluating)
2. [Technology Overview](#technology-overview)
3. [The Core Tension: Library vs. Application Tooling](#the-core-tension-library-vs-application-tooling)
4. [Bundle Size Analysis](#bundle-size-analysis)
5. [Developer Experience Analysis](#developer-experience-analysis)
6. [UX/UI Quality Analysis](#uxui-quality-analysis)
7. [Integration Approaches](#integration-approaches)
8. [Alternatives](#alternatives)
9. [Recommendation](#recommendation)
10. [Suggested Roadmap](#suggested-roadmap)

---

## What Are We Evaluating

Can `@tabula-lens/react` adopt **shadcn/UI** (using either Radix UI or Base UI primitives) and **Tailwind CSS v4** as its primary styling and component layer? And would doing so improve the developer experience, UX/UI quality, and bundle size trade-offs enough to justify the change?

---

## Technology Overview

### Tailwind CSS

Tailwind is a utility-first CSS framework. It works by scanning your source files for class names and generating only the CSS you use — a "just-in-time" (JIT) compilation approach. Tailwind v4 (released 2025) moves configuration from `tailwind.config.js` into a CSS `@theme` directive and is significantly faster to compile.

**Key characteristic**: Tailwind is a **build-time tool**, not a runtime library. The CSS it generates must be included in the final bundle. Class names in library code require the library's source paths to be included in the consuming app's Tailwind content scan.

### shadcn/UI

shadcn/UI is **not a component library** in the traditional sense. It is a **component registry** — a CLI tool that copies component source code into your project. You own the code after installation. Components are built on top of:

- **Radix UI** (default): Headless, accessible UI primitives for dropdowns, dialogs, checkboxes, etc.
- **Base UI** (new option): Meta's headless primitive library, a spiritual successor to MUI's core

shadcn/UI components are styled with Tailwind CSS. They use CSS custom properties (variables like `--primary`, `--background`, `--border`, `--radius`) defined in the app's global CSS for theming.

### What This Package Currently Uses

| Layer         | Current                                                       |
| ------------- | ------------------------------------------------------------- |
| Styling       | Inline `React.CSSProperties` objects (defaultStyles.ts)       |
| Primitives    | None (raw HTML: `<button>`, `<select>`, `<input>`, `<table>`) |
| Table logic   | `@tanstack/react-table` v8                                    |
| Data fetching | `@tanstack/react-query` v5                                    |
| Accessibility | Minimal (mostly missing, see audit)                           |

---

## The Core Tension: Library vs. Application Tooling

This is the fundamental issue. Both Tailwind CSS and shadcn/UI are designed for **application code**, not **published library packages**. This creates structural problems when adopted in a distributed npm package.

### Problem 1: Tailwind Requires Build-Time Access to Source

Tailwind scans source files for class names and purges unused CSS. For a library:

```
Consumer App (no Tailwind)
└── installs @tabula-lens/react
    └── contains Tailwind class names in JSX
        └── NO Tailwind build step → classes generate no CSS → component is unstyled
```

To fix this, consumers must either:

- **Add Tailwind to their project** (a major infrastructure requirement the library currently avoids)
- **Or** the library must ship a pre-generated CSS file that consumers import

Shipping a pre-generated CSS file is doable but introduces other issues: the CSS may conflict with the consumer's Tailwind config, CSS reset, or custom theme.

### Problem 2: shadcn/UI Is a Copy-Paste System, Not a Distributable Package

shadcn/UI explicitly states it is not meant to be imported as a dependency. The components are meant to live inside your project. If `@tabula-lens/react` were to "embed" shadcn components, it would:

1. **Vendor the component source code**, leading to version drift (shadcn's components update frequently)
2. **Create a hard dependency on Radix UI or Base UI**, adding ~20–80KB of primitives to the library's peer dependency tree
3. **Not benefit from the consumer's shadcn setup** — a consumer using shadcn in their own app would have duplicate, potentially differently-configured instances of the same primitives

### Problem 3: CSS Custom Property Dependency

shadcn's theming uses CSS variables like `--primary`, `--card`, `--border`, etc. defined in the app's global CSS. If `@tabula-lens/react` uses shadcn components, it silently depends on these variables being present in the consumer's app. Without them:

- Components render with zero color (fallback is `transparent` or `inherit`)
- The component looks broken with no obvious error message
- The consumer must trace the issue to CSS variable inheritance

---

## Bundle Size Analysis

### Current State

| Dependency                 | Approx. min+gzip | Notes                     |
| -------------------------- | ---------------- | ------------------------- |
| `@tanstack/react-query` v5 | ~13 KB           | Already a peer dependency |
| `@tanstack/react-table` v8 | ~14 KB           | Already a dependency      |
| `react` (peer)             | —                | Consumer provides         |
| **Component code**         | ~12 KB           | TSup-bundled              |
| **Inline styles**          | ~3 KB            | Embedded in JS            |
| **Total package**          | ~42 KB           |                           |

### With Tailwind + shadcn (Radix UI) Added

| Addition                   | Approx. min+gzip | Notes                        |
| -------------------------- | ---------------- | ---------------------------- |
| `@radix-ui/react-dialog`   | ~6 KB            | FilterColumnSelector panel   |
| `@radix-ui/react-checkbox` | ~3 KB            | FilterColumnSelector items   |
| `@radix-ui/react-select`   | ~8 KB            | Table selector dropdown      |
| `@radix-ui/react-popover`  | ~5 KB            | Filter column dropdown       |
| `class-variance-authority` | ~1.5 KB          | shadcn's variant system      |
| `clsx`                     | ~0.5 KB          | Class merging                |
| `tailwind-merge`           | ~2.5 KB          | Tailwind class deduplication |
| Pre-generated Tailwind CSS | ~8–15 KB         | Scoped CSS file              |
| **Added overhead**         | ~35–45 KB        |                              |
| **Total package**          | ~77–87 KB        | ~2× current size             |

This is a **roughly 2× increase** in bundle size — a significant cost for a component that currently needs none of this infrastructure.

**Important context:** If the consuming application already uses Tailwind + Radix UI (many React apps do), the added cost is lower because dependencies are shared. But if the consumer is using Vue, Svelte, or plain React without Tailwind, they bear the full cost.

### With Tailwind + shadcn (Base UI) Added

Base UI is more lightweight than Radix UI:

| Addition                    | Approx. min+gzip | Notes                        |
| --------------------------- | ---------------- | ---------------------------- |
| `@base-ui-components/react` | ~15–25 KB        | Depending on used components |
| Tailwind CSS + variants     | ~12 KB           | Styles + runtime utilities   |
| **Added overhead**          | ~27–37 KB        |                              |
| **Total package**           | ~69–79 KB        | ~1.7× current size           |

Slightly better, but still a significant increase.

---

## Developer Experience Analysis

### For Consumers Who Already Use Tailwind + shadcn

**Rating: Excellent**

- Styles automatically match their app's theme via CSS variables
- They can use `cn()` to extend component classes
- They already have Radix UI installed — no extra dependencies
- The component looks native to their UI from day one

This is a **strong positive use case**.

### For Consumers Who Do NOT Use Tailwind

**Rating: Poor**

- Must add Tailwind to their project or import a pre-generated CSS file
- Must define CSS custom properties (`--primary`, `--background`, etc.) or the component renders unstyled
- Cannot simply override styles with `style={{}}` props as today
- The learning curve is steeper than the current "just install and use" approach

**This represents a regression** for the significant portion of consumers using plain React, Emotion, styled-components, MUI, or other CSS solutions.

### For the Library Maintainer

**Rating: Mixed**

- **Pro:** Components become more visually coherent and accessible with far less custom code
- **Pro:** FilterColumnSelector (currently the weakest UI element) becomes clean and accessible via Radix Popover + Checkbox primitives
- **Con:** The library now has a Tailwind build pipeline to maintain
- **Con:** shadcn component updates require manual re-vendoring or version pinning
- **Con:** The CSS output must be carefully scoped to avoid conflicts
- **Con:** TypeScript types from Radix/Base UI are well-maintained but add surface area

---

## UX/UI Quality Analysis

### What Tailwind Improves

Tailwind itself doesn't directly improve UX — it's a styling tool. But it enables faster iteration on visually polished defaults because:

- Spacing, typography, and color scales are systematic
- Responsive utilities are built in
- Dark mode via `dark:` variants or CSS variables is trivial to add

### What Radix/Base UI Genuinely Improves

The accessibility improvements from replacing raw HTML elements with Radix/Base UI primitives are **substantial and immediate**:

| Component                     | Current State                                   | With Radix UI                                                        |
| ----------------------------- | ----------------------------------------------- | -------------------------------------------------------------------- |
| FilterColumnSelector dropdown | `<div>` with no ARIA                            | `Popover.Root` with `role="dialog"`, focus trapping, Escape-to-close |
| Filter column checkboxes      | Raw `<input type="checkbox">`                   | `Checkbox.Root` with proper checked state, keyboard support          |
| Table selector `<select>`     | Native `<select>` (accessible but un-styleable) | `Select.Root` with custom styling + full keyboard nav                |
| Pagination buttons            | `<button>` with no aria-label                   | Can add labels easily, focus ring managed                            |

**Radix/Base UI's primitives solve the accessibility audit findings** (A1–A8 in the audit report) far more reliably than hand-rolling ARIA attributes.

### UX Verdict

Using Radix/Base UI primitives would lift the UX quality significantly. The question is whether that improvement justifies the dependency cost.

---

## Integration Approaches

Here are four viable strategies, ordered from lowest to highest disruption:

### Approach A: Radix/Base UI Primitives Only (No Tailwind) — **Recommended for v1**

Adopt only the headless primitives for specific components where accessibility is critical (`FilterColumnSelector`, `TableSelector`, pagination). Continue using inline styles for visual styling.

**Impact:**

- `FilterColumnSelector` becomes accessible with zero CSS changes
- Bundle size increases by ~8–15 KB (only the primitives used)
- No build tooling changes
- Zero impact on consumers who don't use Tailwind

**Example:**

```tsx
import * as Popover from '@radix-ui/react-popover';
import * as Checkbox from '@radix-ui/react-checkbox';

// FilterColumnSelector using Radix Popover:
<Popover.Root open={isOpen} onOpenChange={setIsOpen}>
  <Popover.Trigger asChild>
    <button>Filter Columns: {summary}</button>
  </Popover.Trigger>
  <Popover.Content>
    {/* Properly trapped focus, Escape to close, proper ARIA */}
    {columns.map((col) => (
      <Checkbox.Root key={col} />
    ))}
  </Popover.Content>
</Popover.Root>;
```

### Approach B: CSS Custom Property Theming Layer (No Tailwind, No Radix) — **Recommended parallel track**

Replace hardcoded color values in `defaultStyles.ts` with CSS custom properties. This allows theming without any new dependencies.

```ts
// Replace:
backgroundColor: '#3498db';

// With:
backgroundColor: 'var(--tlens-primary, #3498db)';
```

Consumers using Tailwind can override `--tlens-primary` via their Tailwind theme. Consumers not using Tailwind can override it in their global CSS. Dark mode becomes a `@media (prefers-color-scheme: dark)` block.

**Zero new dependencies. Maximum compatibility.**

### Approach C: Separate Optional Style Package — **Recommended for v2**

Create a separate `@tabula-lens/react-shadcn` package (or `@tabula-lens/react-tailwind`) that exports the same `DatabaseViewer` with shadcn-based components pre-wired.

```bash
npm install @tabula-lens/react-shadcn
# Requires: tailwind, @tabula-lens/react, shadcn setup in your project
```

This preserves the core package as a zero-config, zero-dependency experience while giving Tailwind/shadcn users a premium styled variant.

**Precedent:** This is how TanStack works — `@tanstack/react-query` is the core, with optional `@tanstack/react-query-devtools` as a separate package.

### Approach D: Full Tailwind + shadcn Adoption — **Not recommended for core package**

Rewrite all components using Tailwind classes and shadcn primitives. Ship a pre-generated CSS file alongside the JS bundle. Require consumers to either use Tailwind or import the CSS file.

This approach delivers the best visual quality but:

- Breaks the "zero config" promise
- Doubles bundle size for consumers who don't use Tailwind
- Creates a maintainability dependency on the shadcn ecosystem
- Is not reversible once adopted

---

## Alternatives

### CSS Modules

CSS Modules provide locally scoped class names compiled at build time. The library would ship both a JS bundle and a CSS file. Consumers import the CSS file once:

```ts
import '@tabula-lens/react/styles.css';
```

- **Pro:** No Tailwind dependency, clean theming via CSS variables
- **Pro:** No inline style specificity wars
- **Pro:** Full `:hover`, `:focus-visible`, `:disabled` support
- **Con:** One additional import step for consumers

### vanilla-extract

Type-safe CSS-in-JS that generates CSS at build time (zero runtime cost). Generates a `.css` file that consumers import. Used by MUI v6 and other major libraries.

- **Pro:** Type-safe styles, zero runtime CSS-in-JS overhead
- **Pro:** Works with Tailwind environments
- **Con:** Build tooling complexity

### PigmentCSS / Linaria

Similar to vanilla-extract — zero-runtime CSS-in-JS. Good alternatives if vanilla-extract's API is too verbose.

---

## Recommendation

> **TL;DR: Do NOT adopt Tailwind CSS or shadcn/UI in the core package. DO adopt Radix UI (or Base UI) primitives selectively, and DO migrate default styles to CSS custom properties.**

### What to Do

**Phase 1: Fix Accessibility (Now)**

Add `@radix-ui/react-popover` and `@radix-ui/react-checkbox` as dependencies. Use them inside `FilterColumnSelector` to replace the bare `<div>` dropdown with a proper, accessible Popover. This adds ~9 KB gzipped but eliminates the most egregious accessibility failure in the package.

Also add `aria-label` and `aria-sort` attributes manually to pagination buttons and table headers — these are zero-dependency fixes.

**Phase 2: CSS Custom Property Theming (Next release)**

Replace hardcoded colors in `defaultStyles.ts` with CSS custom properties using `--tlens-*` prefixes and reasonable fallbacks. Document the CSS variable API so consumers using Tailwind, CSS-in-JS, or plain CSS can all theme the component with a few variable overrides:

```css
:root {
  --tlens-primary: #3498db; /* button/link color */
  --tlens-border: #ddd; /* table/input borders */
  --tlens-bg-header: #f8f9fa; /* table header background */
  --tlens-bg-hover: #f1f5f9; /* row hover background */
  --tlens-error: #dc2626; /* error state color */
  --tlens-radius: 6px; /* border radius */
  --tlens-font: inherit; /* use consumer's font by default */
}

@media (prefers-color-scheme: dark) {
  :root {
    --tlens-border: #374151;
    --tlens-bg-header: #1f2937;
    --tlens-bg-hover: #374151;
    /* ... */
  }
}
```

**Phase 3: Headless Core + Style Packages (Future roadmap)**

Once the core is stable and headless-compatible:

- Extract a `@tabula-lens/react-styles-default` package with the current CSS variable defaults shipped as a CSS file
- Create `@tabula-lens/react-styles-shadcn` that exports a Tailwind-compatible CSS layer for shadcn users

### What NOT to Do

- Do not add Tailwind as a peer dependency or build requirement for the core package
- Do not embed shadcn component source code into the library
- Do not add CSS custom property theming that silently depends on the consumer defining variables (always provide fallback values in the `var()` calls)

---

## Suggested Roadmap

```
Now         v0.3.x
├── Add @radix-ui/react-popover + @radix-ui/react-checkbox for FilterColumnSelector
├── Add aria-label, aria-sort, label-for fixes (zero deps)
├── Fix sanitizeColumnData double-escaping
└── Remove dead filterColumnSelectorPosition/filterColumnSelectorComponent props

v0.4.x
├── Migrate defaultStyles.ts to CSS custom properties (--tlens-* prefix)
├── Add dark mode via prefers-color-scheme in CSS variables
├── Improve EmptyState with context-aware messaging
├── Add formatHeader prop (column name humanization)
└── Add formatCell prop (custom cell renderer callback)

v1.0.x (optional style packages)
├── @tabula-lens/react → headless core, Radix UI primitives, CSS variables
├── @tabula-lens/react-styles → default CSS file (import once)
└── @tabula-lens/react-shadcn → shadcn/Tailwind preset (for Tailwind users)
```

---

## Summary Scorecard

| Criterion                         | Tailwind + shadcn (full) | Radix UI primitives only  | CSS Custom Props only     |
| --------------------------------- | ------------------------ | ------------------------- | ------------------------- |
| Accessibility improvement         | ★★★★★                    | ★★★★☆                     | ★★☆☆☆                     |
| UX/UI quality                     | ★★★★★                    | ★★★☆☆                     | ★★★☆☆                     |
| Bundle size cost                  | ★★☆☆☆                    | ★★★★☆                     | ★★★★★                     |
| Zero-config promise kept          | ★★☆☆☆                    | ★★★★★                     | ★★★★★                     |
| Theming flexibility               | ★★★★★                    | ★★★☆☆                     | ★★★★☆                     |
| Maintenance burden                | ★★★☆☆                    | ★★★★☆                     | ★★★★★                     |
| Compatible with non-Tailwind apps | ★★☆☆☆                    | ★★★★★                     | ★★★★★                     |
| **Overall fit for this library**  | **Not recommended**      | **Recommended (Phase 1)** | **Recommended (Phase 2)** |
