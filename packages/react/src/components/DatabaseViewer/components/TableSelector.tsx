import React from 'react';
import { mergeStyle } from '../utils/styleHelpers';
import { defaultStyles } from '../styles/defaultStyles';
import type { ClassNames, Styles, TableSelectorMode } from '../DatabaseViewer.types';

export interface TableSelectorProps {
  mode: TableSelectorMode;
  tables: string[];
  selectedTable: string | undefined;
  label: string;
  onSelectTable: (table: string) => void;
  customComponent?: React.FC<{
    tables: string[];
    selectedTable: string | undefined;
    onSelectTable: (table: string) => void;
  }>;
  className?: string;
  classNames?: ClassNames;
  style?: React.CSSProperties;
  styles?: Styles;
  logger?: {
    debug: (message: string, data?: Record<string, unknown>) => void;
  };
  componentId?: string;
}

export const TableSelector: React.FC<TableSelectorProps> = ({
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
        <label style={{ marginRight: '0.5rem', fontWeight: 500 }}>{label}:</label>
        <select
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
        style={{
          display: 'flex',
          flexDirection: 'column' as const,
          gap: '0.5rem',
          padding: '1rem',
          borderRight: '1px solid #ddd',
          minWidth: '200px',
          ...style,
        }}
        className={className || classNames.tableSelectorSidebar}
      >
        <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>{label}</div>
        {tables.map((table) => (
          <button
            key={table}
            onClick={() => handleTableSelect(table)}
            style={{
              padding: '0.5rem',
              textAlign: 'left',
              backgroundColor: selectedTable === table ? '#e9ecef' : 'white',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {table}
          </button>
        ))}
      </div>
    );
  }

  return null;
};
