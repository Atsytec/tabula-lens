import React, { useState, useEffect, useRef } from 'react';

export interface FilterColumnSelectorProps {
  availableColumns: string[];
  selectedColumns: string[];
  defaultColumns: string[];
  onSelectionChange: (columns: string[]) => void;
  onResetToDefault: () => void;
  className?: string;
}

export const FilterColumnSelector: React.FC<FilterColumnSelectorProps> = ({
  availableColumns,
  selectedColumns,
  defaultColumns,
  onSelectionChange,
  onResetToDefault,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempSelected, setTempSelected] = useState<string[]>(selectedColumns);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync tempSelected with selectedColumns when it changes (e.g., table switch)
  useEffect(() => {
    setTempSelected(selectedColumns);
  }, [selectedColumns]);

  // Handle Escape key to close dropdown
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setTempSelected(selectedColumns);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, selectedColumns]);

  const handleToggleColumn = (column: string) => {
    setTempSelected((prev) =>
      prev.includes(column) ? prev.filter((c) => c !== column) : [...prev, column]
    );
  };

  const handleSelectAll = () => {
    setTempSelected(availableColumns);
  };

  const handleDeselectAll = () => {
    setTempSelected([]);
  };

  const handleApply = () => {
    onSelectionChange(tempSelected);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempSelected(selectedColumns);
    setIsOpen(false);
  };

  const handleReset = () => {
    setTempSelected(defaultColumns);
    onResetToDefault();
  };

  const isDefault = (column: string) => defaultColumns.includes(column);

  // Use set-based comparison for "Reset to Default" button
  const isResetDisabled = () => {
    const tempSet = new Set(tempSelected);
    const defaultSet = new Set(defaultColumns);
    if (tempSet.size !== defaultSet.size) return false;
    for (const item of tempSet) {
      if (!defaultSet.has(item)) return false;
    }
    return true;
  };

  return (
    <div className={`filter-column-selector ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="filter-column-selector-button"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span>
          Filter Columns: {selectedColumns.length > 0 ? selectedColumns.join(', ') : 'All'}
        </span>
        <span className={`arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="filter-column-selector-dropdown"
          role="listbox"
          aria-modal="true"
          aria-label="Filter columns"
        >
          <div className="filter-column-selector-header">
            <button
              type="button"
              onClick={handleSelectAll}
              className="filter-column-selector-action"
              disabled={tempSelected.length === availableColumns.length}
            >
              Select All
            </button>
            <button
              type="button"
              onClick={handleDeselectAll}
              className="filter-column-selector-action"
              disabled={tempSelected.length === 0}
            >
              Deselect All
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="filter-column-selector-action"
              disabled={isResetDisabled()}
            >
              Reset to Default
            </button>
          </div>

          <div className="filter-column-selector-list" role="group" aria-label="Available columns">
            {availableColumns.map((column) => (
              <label key={column} className="filter-column-selector-item">
                <input
                  type="checkbox"
                  checked={tempSelected.includes(column)}
                  onChange={() => handleToggleColumn(column)}
                  className="filter-column-selector-checkbox"
                />
                <span className={`column-name ${isDefault(column) ? 'default' : ''}`}>
                  {column}
                  {isDefault(column) && <span className="default-badge">default</span>}
                </span>
              </label>
            ))}
          </div>

          <div className="filter-column-selector-footer">
            <button type="button" onClick={handleCancel} className="filter-column-selector-cancel">
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="filter-column-selector-apply"
              disabled={tempSelected.length === 0}
            >
              Apply ({tempSelected.length})
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
