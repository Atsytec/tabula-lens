import React from 'react';
import { mergeStyle } from '../utils/styleHelpers';
import { defaultStyles } from '../styles/defaultStyles';
import type { ClassNames, Styles } from '../DatabaseViewer.types';

export interface FilterInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  customComponent?: React.FC<{
    value: string;
    onChange: (value: string) => void;
  }>;
  className?: string;
  classNames?: ClassNames;
  style?: React.CSSProperties;
  styles?: Styles;
}

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
