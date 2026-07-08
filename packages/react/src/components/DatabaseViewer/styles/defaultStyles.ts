import { Styles } from './styleTypes';

/**
 * Default inline styles for the DatabaseViewer component
 * These styles provide a clean, modern look out of the box
 * Uses CSS custom properties for theming and dark mode support
 */
export const defaultStyles: Styles = {
  container: {
    color: 'var(--tlens-text-primary, #333)',
    maxWidth: '100%',
    margin: 0,
    padding: 'var(--tlens-spacing-md, 1rem)',
  },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'var(--tlens-spacing-lg, 2rem)',
    gap: 'var(--tlens-spacing-md, 1rem)',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid var(--tlens-bg-spinner-track, #f3f3f3)',
    borderTop: '4px solid var(--tlens-primary, #3498db)',
    borderRadius: '50%',
    animation: 'spin var(--tlens-animation-duration, 1s) linear infinite',
  },
  error: {
    padding: 'var(--tlens-spacing-md, 1rem)',
    backgroundColor: 'var(--tlens-bg-error, #fee)',
    border: '1px solid var(--tlens-border-error, #fcc)',
    borderRadius: 'var(--tlens-radius, 4px)',
    color: 'var(--tlens-error, #c33)',
  },
  retry: {
    marginTop: 'var(--tlens-spacing-xs, 0.5rem)',
    padding: 'var(--tlens-spacing-xs, 0.5rem) var(--tlens-spacing-md, 1rem)',
    backgroundColor: 'var(--tlens-error, #c33)',
    color: 'white',
    border: 'none',
    borderRadius: 'var(--tlens-radius, 4px)',
    cursor: 'pointer',
  },
  filter: {
    marginBottom: 'var(--tlens-spacing-md, 1rem)',
  },
  filterInput: {
    width: '100%',
    padding: 'var(--tlens-spacing-xs, 0.5rem)',
    border: '1px solid var(--tlens-border, #ddd)',
    borderRadius: 'var(--tlens-radius, 4px)',
    fontSize: 'var(--tlens-font-size-base, 1rem)',
  },
  tableWrapper: {
    overflowX: 'auto',
    border: '1px solid var(--tlens-border, #ddd)',
    borderRadius: 'var(--tlens-radius, 4px)',
    marginBottom: 'var(--tlens-spacing-md, 1rem)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: 'var(--tlens-bg-white, white)',
  },
  th: {
    padding: 'var(--tlens-spacing-sm, 0.75rem)',
    textAlign: 'left',
    borderBottom: '1px solid var(--tlens-border, #ddd)',
    backgroundColor: 'var(--tlens-bg-header, #f8f9fa)',
    fontWeight: 600,
    position: 'sticky',
    top: 0,
  },
  td: {
    padding: 'var(--tlens-spacing-sm, 0.75rem)',
    textAlign: 'left',
    borderBottom: '1px solid var(--tlens-border, #ddd)',
  },
  empty: {
    textAlign: 'center',
    padding: 'var(--tlens-spacing-lg, 2rem)',
    color: 'var(--tlens-text-secondary, #666)',
  },
  sortable: {
    cursor: 'pointer',
    userSelect: 'none',
  },
  sorted: {
    cursor: 'pointer',
    userSelect: 'none',
    backgroundColor: 'var(--tlens-bg-sorted, #e9ecef)',
  },
  pagination: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--tlens-spacing-xs, 0.5rem)',
    marginBottom: 'var(--tlens-spacing-md, 1rem)',
    flexWrap: 'wrap',
  },
  paginationButton: {
    padding: 'var(--tlens-spacing-xs, 0.5rem) var(--tlens-spacing-md, 1rem)',
    backgroundColor: 'var(--tlens-primary, #3498db)',
    color: 'white',
    border: 'none',
    borderRadius: 'var(--tlens-radius, 4px)',
    cursor: 'pointer',
  },
  paginationInfo: {
    padding: '0 var(--tlens-spacing-md, 1rem)',
    fontWeight: 500,
  },
  pageSize: {
    padding: 'var(--tlens-spacing-xs, 0.5rem)',
    border: '1px solid var(--tlens-border, #ddd)',
    borderRadius: 'var(--tlens-radius, 4px)',
    cursor: 'pointer',
  },
  info: {
    textAlign: 'center',
    color: 'var(--tlens-text-secondary, #666)',
    fontSize: 'var(--tlens-font-size-sm, 0.875rem)',
  },
  srOnly: {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: 0,
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    border: 0,
  },
};
