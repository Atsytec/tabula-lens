import React, { useState } from 'react';
import { mergeStyle } from '../utils/styleHelpers';
import { defaultStyles } from '../styles/defaultStyles';
import type { ClassNames, Styles } from '../DatabaseViewer.types';

/**
 * Props for the Pagination component
 * @interface PaginationProps
 */
export interface PaginationProps {
  /**
   * Current page index (0-based)
   */
  pageIndex: number;
  /**
   * Total number of pages
   */
  pageCount: number;
  /**
   * Number of records per page
   */
  pageSize: number;
  /**
   * Whether previous page navigation is available
   */
  canPreviousPage: boolean;
  /**
   * Whether next page navigation is available
   */
  canNextPage: boolean;
  /**
   * Available page size options
   */
  pageSizeOptions: number[];
  /**
   * Whether to show the page size selector
   */
  showPageSizeSelector: boolean;
  /**
   * Callback function when page changes
   */
  onPageChange: (pageIndex: number) => void;
  /**
   * Callback function when page size changes
   */
  onPageSizeChange: (pageSize: number) => void;
  /**
   * Custom pagination component
   * @example
   * ```tsx
   * const CustomPagination = ({
   *   pageIndex, pageCount, pageSize,
   *   canPreviousPage, canNextPage,
   *   previousPage, nextPage, firstPage, lastPage,
   *   setPageSize
   * }) => (
   *   <div className="custom-pagination">
   *     <button onClick={firstPage} disabled={!canPreviousPage}>First</button>
   *     <button onClick={previousPage} disabled={!canPreviousPage}>Prev</button>
   *     <span>Page {pageIndex + 1} of {pageCount}</span>
   *     <button onClick={nextPage} disabled={!canNextPage}>Next</button>
   *     <button onClick={lastPage} disabled={!canNextPage}>Last</button>
   *     <select onChange={(e) => setPageSize(Number(e.target.value))}>
   *       {[10, 25, 50, 100].map(size => (
   *         <option key={size} value={size}>{size}</option>
   *       ))}
   *     </select>
   *   </div>
   * );
   * <Pagination customComponent={CustomPagination} {...otherProps} />
   * ```
   */
  customComponent?: React.FC<{
    pageIndex: number;
    pageCount: number;
    pageSize: number;
    canPreviousPage: boolean;
    canNextPage: boolean;
    previousPage: () => void;
    nextPage: () => void;
    firstPage: () => void;
    lastPage: () => void;
    setPageSize: (size: number) => void;
  }>;
  /**
   * Custom className for the pagination container
   */
  className?: string;
  /**
   * Custom classNames for specific elements
   */
  classNames?: ClassNames;
  /**
   * Custom styles for the pagination container
   */
  style?: React.CSSProperties;
  /**
   * Custom styles for specific elements
   */
  styles?: Styles;
}

export const Pagination: React.FC<PaginationProps> = React.memo(
  ({
    pageIndex,
    pageCount,
    pageSize,
    canPreviousPage,
    canNextPage,
    pageSizeOptions,
    showPageSizeSelector,
    onPageChange,
    onPageSizeChange,
    customComponent,
    className,
    classNames = {},
    style,
    styles = {},
  }) => {
    // State for page number input
    const [pageInput, setPageInput] = useState<string>((pageIndex + 1).toString());

    // Update input when pageIndex changes externally
    React.useEffect(() => {
      setPageInput((pageIndex + 1).toString());
    }, [pageIndex]);

    // Handle page input change
    const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setPageInput(e.target.value);
    };

    // Handle page input submission (Enter key or blur)
    const handlePageInputSubmit = () => {
      const pageNum = parseInt(pageInput, 10);
      if (pageNum >= 1 && pageNum <= pageCount) {
        onPageChange(pageNum - 1); // Convert to 0-indexed
      } else {
        // Reset to current page if invalid
        setPageInput((pageIndex + 1).toString());
      }
    };

    // Handle Enter key
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handlePageInputSubmit();
      }
    };

    // Helper function to merge button styles with disabled state
    const getButtonStyle = (disabled: boolean) => {
      if (disabled) {
        return mergeStyle(
          defaultStyles.paginationButton,
          styles.paginationButton,
          defaultStyles.paginationButtonDisabled,
          styles.paginationButtonDisabled
        );
      }
      return mergeStyle(defaultStyles.paginationButton, styles.paginationButton);
    };

    if (customComponent) {
      return React.createElement(customComponent, {
        pageIndex,
        pageCount,
        pageSize,
        canPreviousPage,
        canNextPage,
        previousPage: () => onPageChange(pageIndex - 1),
        nextPage: () => onPageChange(pageIndex + 1),
        firstPage: () => onPageChange(0),
        lastPage: () => onPageChange(pageCount - 1),
        setPageSize: onPageSizeChange,
      });
    }

    return (
      <div
        style={mergeStyle(defaultStyles.pagination, styles.pagination, style)}
        className={className || classNames.pagination}
      >
        <button
          onClick={() => onPageChange(0)}
          disabled={!canPreviousPage}
          style={getButtonStyle(!canPreviousPage)}
          className={`${classNames.paginationButton} tlens-pagination-button`}
          aria-label="First page"
        >
          {'<<'}
        </button>
        <button
          onClick={() => onPageChange(pageIndex - 1)}
          disabled={!canPreviousPage}
          style={getButtonStyle(!canPreviousPage)}
          className={`${classNames.paginationButton} tlens-pagination-button`}
          aria-label="Previous page"
        >
          {'<'}
        </button>
        <input
          type="number"
          min="1"
          max={pageCount}
          value={pageInput}
          onChange={handlePageInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handlePageInputSubmit}
          aria-label="Go to page"
          style={mergeStyle(defaultStyles.paginationInput, styles.paginationInput)}
          className={classNames.paginationInfo}
        />
        <span
          style={mergeStyle(defaultStyles.paginationInfo, styles.paginationInfo)}
          className={classNames.paginationInfo}
        >
          of {pageCount}
        </span>
        <button
          onClick={() => onPageChange(pageIndex + 1)}
          disabled={!canNextPage}
          style={getButtonStyle(!canNextPage)}
          className={`${classNames.paginationButton} tlens-pagination-button`}
          aria-label="Next page"
        >
          {'>'}
        </button>
        <button
          onClick={() => onPageChange(pageCount - 1)}
          disabled={!canNextPage}
          style={getButtonStyle(!canNextPage)}
          className={`${classNames.paginationButton} tlens-pagination-button`}
          aria-label="Last page"
        >
          {'>>'}
        </button>
        {showPageSizeSelector && (
          <select
            value={pageSize}
            onChange={(e) => {
              onPageSizeChange(Number(e.target.value));
            }}
            style={mergeStyle(defaultStyles.pageSize, styles.pageSize)}
            className={classNames.pageSize}
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                Show {size}
              </option>
            ))}
          </select>
        )}
      </div>
    );
  }
);
Pagination.displayName = 'Pagination';
