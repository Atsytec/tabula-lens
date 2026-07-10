import React, { useState, useEffect } from 'react';
import { Popover } from '@base-ui/react/popover';
import { Checkbox } from '@base-ui/react/checkbox';
import { mergeStyle } from '../utils/styleHelpers';
import { defaultStyles } from '../styles/defaultStyles';
import type { ClassNames, Styles } from '../DatabaseViewer.types';

export interface FilterColumnSelectorProps {
  availableColumns: string[];
  selectedColumns: string[];
  defaultColumns: string[];
  onSelectionChange: (columns: string[]) => void;
  onResetToDefault: () => void;
  className?: string;
  classNames?: ClassNames;
  styles?: Styles;
}

export const FilterColumnSelector: React.FC<FilterColumnSelectorProps> = React.memo(
  ({
    availableColumns,
    selectedColumns,
    defaultColumns,
    onSelectionChange,
    onResetToDefault,
    className = '',
    classNames = {},
    styles = {},
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

    // Helper function to merge button styles with disabled state
    const getActionButtonStyle = (disabled: boolean) => {
      if (disabled) {
        return mergeStyle(
          defaultStyles.filterColumnSelectorAction,
          styles.filterColumnSelectorAction,
          defaultStyles.filterColumnSelectorActionDisabled,
          styles.filterColumnSelectorActionDisabled
        );
      }
      return mergeStyle(
        defaultStyles.filterColumnSelectorAction,
        styles.filterColumnSelectorAction
      );
    };

    // Helper function to merge checkbox styles with checked state
    const getCheckboxStyle = (checked: boolean) => {
      if (checked) {
        return mergeStyle(
          defaultStyles.filterColumnSelectorCheckbox,
          styles.filterColumnSelectorCheckbox,
          defaultStyles.filterColumnSelectorCheckboxChecked,
          styles.filterColumnSelectorCheckboxChecked
        );
      }
      return mergeStyle(
        defaultStyles.filterColumnSelectorCheckbox,
        styles.filterColumnSelectorCheckbox
      );
    };

    // Helper function to merge apply button styles with disabled state
    const getApplyButtonStyle = (disabled: boolean) => {
      if (disabled) {
        return mergeStyle(
          defaultStyles.filterColumnSelectorApply,
          styles.filterColumnSelectorApply,
          defaultStyles.filterColumnSelectorApplyDisabled,
          styles.filterColumnSelectorApplyDisabled
        );
      }
      return mergeStyle(defaultStyles.filterColumnSelectorApply, styles.filterColumnSelectorApply);
    };

    return (
      <div className={`filter-column-selector ${className || classNames.filterColumnSelector}`}>
        <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
          <Popover.Trigger
            className={`filter-column-selector-button ${classNames.filterColumnSelectorButton}`}
            style={mergeStyle(
              defaultStyles.filterColumnSelectorButton,
              styles.filterColumnSelectorButton
            )}
          >
            <span>
              Filter Columns: {selectedColumns.length > 0 ? selectedColumns.join(', ') : 'All'}
            </span>
            <span className={`arrow ${isOpen ? 'open' : ''}`}>▼</span>
          </Popover.Trigger>

          <Popover.Portal>
            <Popover.Positioner sideOffset={8}>
              <Popover.Popup
                className={`filter-column-selector-dropdown ${classNames.filterColumnSelectorDropdown}`}
                style={mergeStyle(
                  defaultStyles.filterColumnSelectorDropdown,
                  styles.filterColumnSelectorDropdown
                )}
              >
                <div
                  className={`filter-column-selector-header ${classNames.filterColumnSelectorHeader}`}
                  style={mergeStyle(
                    defaultStyles.filterColumnSelectorHeader,
                    styles.filterColumnSelectorHeader
                  )}
                >
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className={`filter-column-selector-action ${classNames.filterColumnSelectorAction}`}
                    style={getActionButtonStyle(tempSelected.length === availableColumns.length)}
                    disabled={tempSelected.length === availableColumns.length}
                  >
                    Select All
                  </button>
                  <button
                    type="button"
                    onClick={handleDeselectAll}
                    className={`filter-column-selector-action ${classNames.filterColumnSelectorAction}`}
                    style={getActionButtonStyle(tempSelected.length === 0)}
                    disabled={tempSelected.length === 0}
                  >
                    Deselect All
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className={`filter-column-selector-action ${classNames.filterColumnSelectorAction}`}
                    style={getActionButtonStyle(isResetDisabled())}
                    disabled={isResetDisabled()}
                  >
                    Reset to Default
                  </button>
                </div>

                <div
                  className={`filter-column-selector-list ${classNames.filterColumnSelectorList}`}
                  style={mergeStyle(
                    defaultStyles.filterColumnSelectorList,
                    styles.filterColumnSelectorList
                  )}
                  role="group"
                  aria-label="Available columns"
                >
                  {availableColumns.map((column) => (
                    <label
                      key={column}
                      className={`filter-column-selector-item ${classNames.filterColumnSelectorItem}`}
                      style={mergeStyle(
                        defaultStyles.filterColumnSelectorItem,
                        styles.filterColumnSelectorItem
                      )}
                    >
                      <Checkbox.Root
                        checked={tempSelected.includes(column)}
                        onCheckedChange={(checked) => handleToggleColumn(column, checked === true)}
                        className={`filter-column-selector-checkbox ${classNames.filterColumnSelectorCheckbox}`}
                        style={getCheckboxStyle(tempSelected.includes(column))}
                      >
                        <Checkbox.Indicator
                          className={`filter-column-selector-checkbox-indicator ${classNames.filterColumnSelectorCheckboxIndicator}`}
                          style={mergeStyle(
                            defaultStyles.filterColumnSelectorCheckboxIndicator,
                            styles.filterColumnSelectorCheckboxIndicator
                          )}
                        >
                          ✓
                        </Checkbox.Indicator>
                      </Checkbox.Root>
                      <span
                        className={`column-name ${isDefault(column) ? 'default' : ''} ${classNames.filterColumnSelectorColumnName}`}
                        style={mergeStyle(
                          defaultStyles.filterColumnSelectorColumnName,
                          styles.filterColumnSelectorColumnName,
                          isDefault(column)
                            ? defaultStyles.filterColumnSelectorColumnNameDefault
                            : {},
                          isDefault(column) ? styles.filterColumnSelectorColumnNameDefault : {}
                        )}
                      >
                        {column}
                        {isDefault(column) && (
                          <span
                            className={`default-badge ${classNames.filterColumnSelectorDefaultBadge}`}
                            style={mergeStyle(
                              defaultStyles.filterColumnSelectorDefaultBadge,
                              styles.filterColumnSelectorDefaultBadge
                            )}
                          >
                            default
                          </span>
                        )}
                      </span>
                    </label>
                  ))}
                </div>

                <div
                  className={`filter-column-selector-footer ${classNames.filterColumnSelectorFooter}`}
                  style={mergeStyle(
                    defaultStyles.filterColumnSelectorFooter,
                    styles.filterColumnSelectorFooter
                  )}
                >
                  <button
                    type="button"
                    onClick={handleCancel}
                    className={`filter-column-selector-cancel ${classNames.filterColumnSelectorCancel}`}
                    style={mergeStyle(
                      defaultStyles.filterColumnSelectorCancel,
                      styles.filterColumnSelectorCancel
                    )}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleApply}
                    className={`filter-column-selector-apply ${classNames.filterColumnSelectorApply}`}
                    style={getApplyButtonStyle(tempSelected.length === 0)}
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
  }
);
FilterColumnSelector.displayName = 'FilterColumnSelector';
