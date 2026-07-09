import React from 'react';
import { mergeStyle } from '../utils/styleHelpers';
import { defaultStyles } from '../styles/defaultStyles';
import type { ClassNames, Styles } from '../DatabaseViewer.types';

/**
 * Props for the FilterInput component
 * @interface FilterInputProps
 */
export interface FilterInputProps {
  /**
   * Current filter value
   */
  value: string;
  /**
   * Callback function when filter value changes
   */
  onChange: (value: string) => void;
  /**
   * Placeholder text for the filter input
   * @default 'Filter records...'
   */
  placeholder?: string;
  /**
   * Custom filter input component
   * @example
   * ```tsx
   * const CustomFilter = ({ value, onChange }) => (
   *   <div className="custom-filter">
   *     <input
   *       type="text"
   *       value={value}
   *       onChange={(e) => onChange(e.target.value)}
   *       placeholder="Search..."
   *     />
   *     <button onClick={() => onChange('')}>Clear</button>
   *   </div>
   * );
   * <FilterInput customComponent={CustomFilter} value={filter} onChange={setFilter} />
   * ```
   */
  customComponent?: React.FC<{
    value: string;
    onChange: (value: string) => void;
  }>;
  /**
   * Custom className for the filter container
   */
  className?: string;
  /**
   * Custom classNames for specific elements
   */
  classNames?: ClassNames;
  /**
   * Custom styles for the filter container
   */
  style?: React.CSSProperties;
  /**
   * Custom styles for specific elements
   */
  styles?: Styles;
}

/**
 * FilterInput component - provides a text input for filtering table data
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <FilterInput value={filter} onChange={setFilter} />
 * ```
 *
 * @example
 * ```tsx
 * // With custom placeholder
 * <FilterInput
 *   value={filter}
 *   onChange={setFilter}
 *   placeholder="Search records..."
 * />
 * ```
 *
 * @example
 * ```tsx
 * // With custom styling
 * <FilterInput
 *   value={filter}
 *   onChange={setFilter}
 *   style={{ marginBottom: '1.5rem' }}
 *   styles={{
 *     filterInput: {
 *       padding: '0.75rem',
 *       fontSize: '1.1rem',
 *       borderRadius: '8px',
 *     },
 *   }}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // With custom component
 * const MyCustomFilter = ({ value, onChange }) => (
 *   <div className="my-filter">
 *     <span className="filter-icon">🔍</span>
 *     <input
 *       type="text"
 *       value={value}
 *       onChange={(e) => onChange(e.target.value)}
 *       placeholder="Type to search..."
 *     />
 *     {value && (
 *       <button onClick={() => onChange('')}>✕</button>
 *     )}
 *   </div>
 * );
 * <FilterInput customComponent={MyCustomFilter} value={filter} onChange={setFilter} />
 * ```
 */
export const FilterInput: React.FC<FilterInputProps> = React.memo(
  ({
    value,
    onChange,
    placeholder = 'Filter records...',
    customComponent,
    className,
    classNames = {},
    style,
    styles = {},
  }) => {
    if (customComponent) {
      return React.createElement(customComponent, {
        value,
        onChange,
      });
    }

    return (
      <div
        style={mergeStyle(defaultStyles.filter, styles.filter, style)}
        className={className || classNames.filter}
      >
        <label
          htmlFor="db-filter"
          style={mergeStyle(defaultStyles.srOnly, styles.srOnly)}
          className={classNames.srOnly}
        >
          Filter records
        </label>
        <input
          id="db-filter"
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={mergeStyle(defaultStyles.filterInput, styles.filterInput)}
          className={classNames.filterInput}
        />
      </div>
    );
  }
);
FilterInput.displayName = 'FilterInput';
