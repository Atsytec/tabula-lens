import { Styles } from './styleTypes';

/**
 * Default inline styles for the DatabaseViewer component
 * These styles provide a clean, modern look out of the box
 */
export const defaultStyles: Styles = {
  container: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    color: '#333',
    maxWidth: '100%',
    margin: 0,
    padding: '1rem',
  },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    gap: '1rem',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #3498db',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  error: {
    padding: '1rem',
    backgroundColor: '#fee',
    border: '1px solid #fcc',
    borderRadius: '4px',
    color: '#c33',
  },
  retry: {
    marginTop: '0.5rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#c33',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  filter: {
    marginBottom: '1rem',
  },
  filterInput: {
    width: '100%',
    padding: '0.5rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
  },
  tableWrapper: {
    overflowX: 'auto',
    border: '1px solid #ddd',
    borderRadius: '4px',
    marginBottom: '1rem',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: 'white',
  },
  th: {
    padding: '0.75rem',
    textAlign: 'left',
    borderBottom: '1px solid #ddd',
    backgroundColor: '#f8f9fa',
    fontWeight: 600,
    position: 'sticky',
    top: 0,
  },
  td: {
    padding: '0.75rem',
    textAlign: 'left',
    borderBottom: '1px solid #ddd',
  },
  empty: {
    textAlign: 'center',
    padding: '2rem',
    color: '#666',
  },
  sortable: {
    cursor: 'pointer',
    userSelect: 'none',
  },
  sorted: {
    cursor: 'pointer',
    userSelect: 'none',
    backgroundColor: '#e9ecef',
  },
  pagination: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    marginBottom: '1rem',
    flexWrap: 'wrap',
  },
  paginationButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  paginationInfo: {
    padding: '0 1rem',
    fontWeight: 500,
  },
  pageSize: {
    padding: '0.5rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  info: {
    textAlign: 'center',
    color: '#666',
    fontSize: '0.875rem',
  },
};
