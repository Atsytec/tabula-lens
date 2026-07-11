# Tabula Lens Design System

## Overview

The Tabula Lens design system is built on CSS custom properties (CSS variables) to enable theming, dark mode support, and consistent styling across all components. The design system is currently implemented in the React package and serves as the source of truth for all design tokens.

## Design Tokens

### Colors

#### Primary Colors

- **Primary**: `#3498db` (light mode), `#5dade2` (dark mode)
- **Primary Hover**: `#2980b9` (light mode), `#3498db` (dark mode)

#### Text Colors

- **Text**: `#333` (light mode), `#e0e0e0` (dark mode)
- **Text Primary**: `#333` (light mode), `#e0e0e0` (dark mode)
- **Text Secondary**: `#666` (light mode), `#b0b0b0` (dark mode)

#### Background Colors

- **Background White**: `#ffffff` (light mode), `#1e1e1e` (dark mode)
- **Background Header**: `#f8f9fa` (light mode), `#2d2d2d` (dark mode)
- **Background Hover**: `#f8f9fa` (light mode), `#3d3d3d` (dark mode)
- **Background Sorted**: `#e9ecef` (light mode), `#4d4d4d` (dark mode)
- **Background Error**: `#fee` (light mode), `#3d1a1a` (dark mode)
- **Background Spinner Track**: `#f3f3f3` (light mode), `#2d2d2d` (dark mode)

#### Border Colors

- **Border**: `#ddd` (light mode), `#4d4d4d` (dark mode)
- **Border Error**: `#fcc` (light mode), `#8b3a3a` (dark mode)

#### Error Colors

- **Error**: `#c33` (light mode), `#e74c3c` (dark mode)
- **Error Hover**: `#a33` (light mode), `#c0392b` (dark mode)

### Spacing

- **Radius**: `4px`
- **Spacing XS**: `0.5rem` (8px)
- **Spacing SM**: `0.75rem` (12px)
- **Spacing MD**: `1rem` (16px)
- **Spacing LG**: `2rem` (32px)

### Typography

- **Font Size Base**: `1rem` (16px)
- **Font Size SM**: `0.875rem` (14px)

### Animation

- **Animation Duration**: `1s`

## CSS Custom Properties

The design system uses CSS custom properties with the `--tlens-` prefix to ensure uniqueness and prevent conflicts with other libraries.

### Variable Naming Convention

All CSS custom properties follow the pattern: `--tlens-{category}-{property}`

Categories:

- `primary`: Primary action colors
- `text`: Typography colors
- `bg`: Background colors
- `border`: Border colors
- `error`: Error state colors
- `spacing`: Spacing values
- `font-size`: Typography sizes
- `animation`: Animation durations

### Fallback Values

All CSS custom properties include fallback values to ensure graceful degradation:

```css
color: var(--tlens-text-primary, #333);
```

This ensures that if the custom property is not defined, the component will still render with the specified fallback value.

## Dark Mode Support

Dark mode is implemented using CSS media queries with automatic system preference detection:

```css
@media (prefers-color-scheme: dark) {
  :root {
    /* Dark mode color overrides */
  }
}
```

### Dark Mode Implementation

The dark mode implementation overrides all color-related custom properties while maintaining the same spacing, typography, and animation values. This ensures consistent layout and behavior across light and dark modes.

### Manual Dark Mode Control

Currently, dark mode is controlled by system preferences. Future implementations may include manual dark mode toggles for user control.

## Component Styling

### Inline Styles with CSS Variables

Components use inline styles that reference CSS custom properties:

```typescript
const container = {
  color: 'var(--tlens-text-primary, #333)',
  padding: 'var(--tlens-spacing-md, 1rem)',
  borderRadius: 'var(--tlens-radius, 4px)',
};
```

This approach allows for:

- Runtime theming without JavaScript
- Consistent styling across components
- Easy customization through CSS variable overrides
- Dark mode support through media queries

### Global Styles

Global styles are defined in `global.css` and include:

- Animations (spinner)
- Interactive states (hover, focus)
- Component-specific styles (table rows, pagination buttons)

## Theming

### Custom Theming

Users can customize the design system by overriding CSS custom properties in their application:

```css
:root {
  --tlens-primary: #your-color;
  --tlens-text-primary: #your-color;
  /* ... other overrides */
}
```

### Brand Colors

The default brand colors use a blue palette:

- Primary: Blue (#3498db)
- Accent: Error red (#c33)
- Neutral: Grays for text and backgrounds

## Design Principles

### 1. High Contrast Data Readability

The design system prioritizes high contrast for data readability, especially in table components. Text colors and background colors are carefully chosen to meet WCAG AA standards.

### 2. Subtle Depth

Subtle depth is achieved through:

- Box shadows on dropdowns
- Background color changes on hover states
- Border color variations for different states

### 3. Rounded Corners

Consistent rounded corners (4px) are used throughout to create a modern, approachable feel while maintaining sharpness for data-heavy interfaces.

### 4. Generous Whitespace

Whitespace is used generously to improve readability and reduce cognitive load:

- Consistent padding using spacing tokens
- Gap properties for flex layouts
- Margin spacing between related elements

## Accessibility

### Color Contrast

All color combinations meet WCAG 2.1 AA standards for contrast ratios. Text colors are carefully chosen against background colors to ensure readability.

### Focus States

Focus states are clearly defined with:

- 2px solid outlines
- Outline offset for better visibility
- Primary color for focus indicators

### Keyboard Navigation

All interactive elements support keyboard navigation with visible focus states.

## Responsive Design

The design system uses responsive units (rem) for spacing and typography to ensure consistent scaling across different screen sizes. Components use flexible layouts with flexbox to adapt to different viewport sizes.

## Performance

CSS custom properties are performant and:

- Do not require JavaScript for theming
- Have minimal runtime overhead
- Support browser-native optimizations
- Enable efficient style updates

## Browser Support

CSS custom properties are supported in all modern browsers. Fallback values ensure graceful degradation in older browsers.

## Future Enhancements

Planned enhancements to the design system include:

1. **Manual Dark Mode Toggle**: Allow users to manually switch between light and dark modes
2. **Additional Color Themes**: Support for multiple color themes (e.g., green, purple)
3. **Typography Scale**: Expanded typography scale with more font sizes
4. **Spacing Scale**: More granular spacing options
5. **Animation Library**: Reusable animation patterns
6. **Component Variants**: Pre-built component style variants

## Implementation Files

- **CSS Variables**: `packages/react/src/components/DatabaseViewer/styles/variables.css`
- **Global Styles**: `packages/react/src/components/DatabaseViewer/styles/global.css`
- **Default Styles**: `packages/react/src/components/DatabaseViewer/styles/defaultStyles.ts`

## Design System Governance

The React package CSS files serve as the source of truth for the design system. Any changes to design tokens should be made in these files first, then propagated to other consuming applications (such as the documentation site).

### Decision: No Shared Styles Directory

After evaluation, it was determined that a shared `styles/` directory is not needed. The React package CSS files are the authoritative source for design tokens, and other applications (like the documentation site) should reference and consume these design tokens rather than duplicate them.

This approach:

- Maintains a single source of truth
- Reduces duplication
- Ensures consistency across all Tabula Lens applications
- Simplifies maintenance and updates
