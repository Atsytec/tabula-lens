import React, { useState, useEffect } from 'react';
import { Popover } from '@base-ui/react/popover';
import { Checkbox } from '@base-ui/react/checkbox';

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

  // Sync tempSelected with selectedColumns when it changes (e.g., table switch)
  useEffect(() => {
    setTempSelected(selectedColumns);
  }, [selectedColumns]);

  const handleToggleColumn = (column: string, checked: boolean) => {
    setTempSelected((prev) => (checked ? [...prev, column] : prev.filter((c) => c !== column)));
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
      <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
        <Popover.Trigger className="filter-column-selector-button">
          <span>
            Filter Columns: {selectedColumns.length > 0 ? selectedColumns.join(', ') : 'All'}
          </span>
          <span className={`arrow ${isOpen ? 'open' : ''}`}>▼</span>
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Positioner sideOffset={8}>
            <Popover.Popup className="filter-column-selector-dropdown">
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

              <div
                className="filter-column-selector-list"
                role="group"
                aria-label="Available columns"
              >
                {availableColumns.map((column) => (
                  <label key={column} className="filter-column-selector-item">
                    <Checkbox.Root
                      checked={tempSelected.includes(column)}
                      onCheckedChange={(checked) => handleToggleColumn(column, checked === true)}
                      className="filter-column-selector-checkbox"
                    >
                      <Checkbox.Indicator className="filter-column-selector-checkbox-indicator">
                        ✓
                      </Checkbox.Indicator>
                    </Checkbox.Root>
                    <span className={`column-name ${isDefault(column) ? 'default' : ''}`}>
                      {column}
                      {isDefault(column) && <span className="default-badge">default</span>}
                    </span>
                  </label>
                ))}
              </div>

              <div className="filter-column-selector-footer">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="filter-column-selector-cancel"
                >
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
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
};
