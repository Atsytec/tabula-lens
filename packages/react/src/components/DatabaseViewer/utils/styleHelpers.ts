/**
 * Utility functions for merging styles and class names
 */

/**
 * Merges a base class name with a custom class name
 * @param base - The base class name
 * @param custom - The custom class name to append
 * @returns The merged class name
 */
export const mergeClassName = (base: string, custom?: string): string => {
  if (!custom) return base;
  return `${base} ${custom}`;
};

/**
 * Merges base CSS properties with custom CSS properties
 * Supports multiple style objects for flexible merging
 * @param base - The base CSS properties
 * @param custom - The custom CSS properties to override (can be multiple)
 * @returns The merged CSS properties
 */
export const mergeStyle = (
  base: React.CSSProperties | undefined,
  ...custom: (React.CSSProperties | undefined)[]
): React.CSSProperties => {
  const merged: React.CSSProperties = base ? { ...base } : {};
  for (const style of custom) {
    if (style) {
      Object.assign(merged, style);
    }
  }
  return merged;
};
