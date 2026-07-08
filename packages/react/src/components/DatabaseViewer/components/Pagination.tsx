import React from 'react';
import { mergeStyle } from '../utils/styleHelpers';
import { defaultStyles } from '../styles/defaultStyles';
import type { ClassNames, Styles } from '../DatabaseViewer.types';

export interface PaginationProps {
  pageIndex: number;
  pageCount: number;
  pageSize: number;
  canPreviousPage: boolean;
  canNextPage: boolean;
  pageSizeOptions: number[];
  showPageSizeSelector: boolean;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
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
  className?: string;
  classNames?: ClassNames;
  style?: React.CSSProperties;
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
          style={mergeStyle(defaultStyles.paginationButton, styles.paginationButton)}
          className={classNames.paginationButton}
          aria-label="First page"
        >
          {'<<'}
        </button>
        <button
          onClick={() => onPageChange(pageIndex - 1)}
          disabled={!canPreviousPage}
          style={mergeStyle(defaultStyles.paginationButton, styles.paginationButton)}
          className={classNames.paginationButton}
          aria-label="Previous page"
        >
          {'<'}
        </button>
        <span
          style={mergeStyle(defaultStyles.paginationInfo, styles.paginationInfo)}
          className={classNames.paginationInfo}
        >
          Page {pageIndex + 1} of {pageCount}
        </span>
        <button
          onClick={() => onPageChange(pageIndex + 1)}
          disabled={!canNextPage}
          style={mergeStyle(defaultStyles.paginationButton, styles.paginationButton)}
          className={classNames.paginationButton}
          aria-label="Next page"
        >
          {'>'}
        </button>
        <button
          onClick={() => onPageChange(pageCount - 1)}
          disabled={!canNextPage}
          style={mergeStyle(defaultStyles.paginationButton, styles.paginationButton)}
          className={classNames.paginationButton}
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
