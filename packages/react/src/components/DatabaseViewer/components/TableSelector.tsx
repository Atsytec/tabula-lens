import React from 'react';
import { mergeStyle } from '../utils/styleHelpers';
import { defaultStyles } from '../styles/defaultStyles';
import type { ClassNames, Styles, TableSelectorMode } from '../DatabaseViewer.types';

/**
 * Props for the TableSelector component
 * @interface TableSelectorProps
 */
export interface TableSelectorProps {
  /**
   * Display mode for the table selector
   * @example
   * ```tsx
   * // Dropdown mode (default)
   * <TableSelector mode="dropdown" />
   *
   * // Sidebar mode
   * <TableSelector mode="sidebar" />
   *
   * // No selector
   * <TableSelector mode="none" />
   * ```
   */
  mode: TableSelectorMode;
  /**
   * Array of available table names
   */
  tables: string[];
  /**
   * Currently selected table name
   */
  selectedTable: string | undefined;
  /**
   * Label for the table selector
   */
  label: string;
  /**
   * Callback function when a table is selected
   */
  onSelectTable: (table: string) => void;
  /**
   * Custom table selector component
   * @example
   * ```tsx
   * const CustomTableSelector = ({ tables, selectedTable, onSelectTable }) => (
   *   <div className="custom-table-selector">
   *     <h3>Select a Table</h3>
   *     <div className="table-grid">
   *       {tables.map(table => (
   *         <button
   *           key={table}
   *           onClick={() => onSelectTable(table)}
   *           className={selectedTable === table ? 'active' : ''}
   *         >
   *           {table}
   *         </button>
   *       ))}
   *     </div>
   *   </div>
   * );
   * <TableSelector customComponent={CustomTableSelector} {...otherProps} />
   * ```
   */
  customComponent?: React.FC<{
    tables: string[];
    selectedTable: string | undefined;
    onSelectTable: (table: string) => void;
  }>;
  /**
   * Custom className for the table selector container
   */
  className?: string;
  /**
   * Custom classNames for specific elements
   */
  classNames?: ClassNames;
  /**
   * Custom styles for the table selector container
   */
  style?: React.CSSProperties;
  /**
   * Custom styles for specific elements
   */
  styles?: Styles;
  /**
   * Logger instance for debugging
   */
  logger?: {
    debug: (message: string, data?: Record<string, unknown>) => void;
  };
  /**
   * Component ID for logging purposes
   */
  componentId?: string;
}

/**
 * TableSelector component - allows users to select which database table to view
 *
 * @component
 * @example
 * ```tsx
 * // Dropdown mode (default)
 * <TableSelector
 *   mode="dropdown"
 *   tables={['users', 'products', 'orders']}
 *   selectedTable="users"
 *   label="Select Table"
 *   onSelectTable={(table) => setSelectedTable(table)}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Sidebar mode
 * <TableSelector
 *   mode="sidebar"
 *   tables={['users', 'products', 'orders']}
 *   selectedTable="users"
 *   label="Tables"
 *   onSelectTable={(table) => setSelectedTable(table)}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // With custom styling
 * <TableSelector
 *   mode="dropdown"
 *   tables={['users', 'products', 'orders']}
 *   selectedTable="users"
 *   label="Select Table"
 *   onSelectTable={(table) => setSelectedTable(table)}
 *   style={{ marginBottom: '1.5rem' }}
 *   styles={{
 *     filterInput: {
 *       padding: '0.75rem',
 *       fontSize: '1rem',
 *       borderRadius: '8px',
 *     },
 *   }}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // With custom component
 * const MyCustomTableSelector = ({ tables, selectedTable, onSelectTable }) => (
 *   <div className="my-table-selector">
 *     <h3>Choose a Table</h3>
 *     <div className="table-list">
 *       {tables.map(table => (
 *         <div
 *           key={table}
 *           onClick={() => onSelectTable(table)}
 *           className={`table-item ${selectedTable === table ? 'selected' : ''}`}
 *         >
 *           <span className="table-icon">📊</span>
 *           <span className="table-name">{table}</span>
 *         </div>
 *       ))}
 *     </div>
 *   </div>
 * );
 * <TableSelector customComponent={MyCustomTableSelector} {...otherProps} />
 * ```
 */
export const TableSelector: React.FC<TableSelectorProps> = React.memo(
  ({
    mode,
    tables,
    selectedTable,
    label,
    onSelectTable,
    customComponent,
    className,
    classNames = {},
    style,
    styles = {},
    logger,
    componentId,
  }) => {
    if (mode === 'none' || !tables || !Array.isArray(tables)) {
      return null;
    }

    if (customComponent) {
      return React.createElement(customComponent, {
        tables,
        selectedTable,
        onSelectTable,
      });
    }

    const handleTableSelect = (table: string) => {
      if (logger) {
        logger.debug('Table selection changed', {
          componentId,
          previousTable: selectedTable || 'none',
          newTable: table,
        });
      }
      onSelectTable(table);
    };

    if (mode === 'dropdown') {
      return (
        <div
          style={mergeStyle(defaultStyles.filter, styles.filter, style)}
          className={className || classNames.tableSelectorDropdown}
        >
          <label htmlFor="table-selector" style={{ marginRight: '0.5rem', fontWeight: 500 }}>
            {label}:
          </label>
          <select
            id="table-selector"
            value={selectedTable || ''}
            onChange={(e) => {
              handleTableSelect(e.target.value);
            }}
            style={mergeStyle(defaultStyles.filterInput, styles.filterInput)}
            className={classNames.filterInput}
          >
            {tables.map((table) => (
              <option key={table} value={table}>
                {table}
              </option>
            ))}
          </select>
        </div>
      );
    }

    if (mode === 'sidebar') {
      return (
        <div
          style={mergeStyle(defaultStyles.tableSelectorSidebar, styles.tableSelectorSidebar, style)}
          className={className || classNames.tableSelectorSidebar}
        >
          <div
            style={mergeStyle(
              defaultStyles.tableSelectorSidebarLabel,
              styles.tableSelectorSidebarLabel
            )}
          >
            {label}
          </div>
          {tables.map((table) => (
            <button
              key={table}
              onClick={() => handleTableSelect(table)}
              style={mergeStyle(
                defaultStyles.tableSelectorSidebarButton,
                styles.tableSelectorSidebarButton,
                selectedTable === table
                  ? mergeStyle(
                      defaultStyles.tableSelectorSidebarButtonActive,
                      styles.tableSelectorSidebarButtonActive
                    )
                  : {}
              )}
            >
              {table}
            </button>
          ))}
        </div>
      );
    }

    return null;
  }
);
TableSelector.displayName = 'TableSelector';
