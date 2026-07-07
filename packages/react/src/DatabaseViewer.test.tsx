import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DatabaseViewer, DatabaseViewerWithProvider } from './DatabaseViewer';

// Mock fetch
global.fetch = vi.fn();

const mockQueryResult = {
  data: [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  ],
  columns: ['id', 'name', 'email'],
  pagination: {
    page: 1,
    limit: 10,
    total: 2,
    totalPages: 1,
  },
};

describe('DatabaseViewer', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          retry: false,
        },
      },
    });
    vi.clearAllMocks();
  });

  afterEach(() => {
    queryClient.clear();
  });

  const renderWithProvider = (component: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        {React.cloneElement(component, { enableLogging: false } as Record<string, unknown>)}
      </QueryClientProvider>
    );
  };

  describe('rendering', () => {
    it('should render with required props', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => mockQueryResult,
      });

      renderWithProvider(<DatabaseViewer path="http://localhost:3000/api" />);

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Filter records...')).toBeInTheDocument();
      });
    });

    it('should render with custom initial table', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => mockQueryResult,
      });

      renderWithProvider(<DatabaseViewer path="http://localhost:3000/api" initialTable="posts" />);

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Filter records...')).toBeInTheDocument();
      });
    });

    it('should render with custom page size', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => mockQueryResult,
      });

      renderWithProvider(<DatabaseViewer path="http://localhost:3000/api" pageSize={20} />);

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Filter records...')).toBeInTheDocument();
      });
    });
  });

  describe('loading state', () => {
    it('should show loading spinner while fetching', () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockImplementation(() => new Promise(() => {}));

      renderWithProvider(<DatabaseViewer path="http://localhost:3000/api" />);

      expect(screen.getByText('Loading data...')).toBeInTheDocument();
    });
  });

  describe('error state', () => {
    it('should show error message on fetch failure', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Network error'));

      renderWithProvider(<DatabaseViewer path="http://localhost:3000/api" />);

      await waitFor(() => {
        expect(screen.getByText(/Error loading data/)).toBeInTheDocument();
      });
    });

    it('should show retry button on error', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (global.fetch as any).mockRejectedValue(new Error('Network error'));

      renderWithProvider(<DatabaseViewer path="http://localhost:3000/api" />);

      await waitFor(() => {
        expect(screen.getByText('Retry')).toBeInTheDocument();
      });
    });

    it('should retry on button click', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (global.fetch as any)
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockQueryResult,
        });

      renderWithProvider(<DatabaseViewer path="http://localhost:3000/api" />);

      await waitFor(() => {
        expect(screen.getByText('Retry')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Retry'));

      await waitFor(() => {
        expect(screen.queryByText('Error loading data')).not.toBeInTheDocument();
      });
    });
  });

  describe('data display', () => {
    it('should render table with data', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => mockQueryResult,
      });

      renderWithProvider(<DatabaseViewer path="http://localhost:3000/api" />);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      });
    });

    it('should render column headers', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => mockQueryResult,
      });

      renderWithProvider(<DatabaseViewer path="http://localhost:3000/api" />);

      await waitFor(() => {
        expect(screen.getByText('id')).toBeInTheDocument();
        expect(screen.getByText('name')).toBeInTheDocument();
        expect(screen.getByText('email')).toBeInTheDocument();
      });
    });

    it('should show empty state when no data', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => ({
          data: [],
          columns: ['id', 'name'],
          pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
        }),
      });

      renderWithProvider(<DatabaseViewer path="http://localhost:3000/api" />);

      await waitFor(() => {
        expect(screen.getByText('No data available')).toBeInTheDocument();
      });
    });

    it('should show total records count', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => mockQueryResult,
      });

      renderWithProvider(<DatabaseViewer path="http://localhost:3000/api" />);

      await waitFor(() => {
        expect(screen.getByText('Total records: 2')).toBeInTheDocument();
      });
    });
  });

  describe('filtering', () => {
    it('should update filter input on change', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => mockQueryResult,
      });

      renderWithProvider(<DatabaseViewer path="http://localhost:3000/api" />);

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Filter records...')).toBeInTheDocument();
      });

      const filterInput = screen.getByPlaceholderText('Filter records...');
      fireEvent.change(filterInput, { target: { value: 'test' } });

      expect(filterInput).toHaveValue('test');
    });
  });

  describe('pagination', () => {
    it('should render pagination controls', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => mockQueryResult,
      });

      renderWithProvider(<DatabaseViewer path="http://localhost:3000/api" />);

      await waitFor(() => {
        expect(screen.getByText('<<')).toBeInTheDocument();
        expect(screen.getByText('<')).toBeInTheDocument();
        expect(screen.getByText('>')).toBeInTheDocument();
        expect(screen.getByText('>>')).toBeInTheDocument();
      });
    });

    it('should show current page info', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => mockQueryResult,
      });

      renderWithProvider(<DatabaseViewer path="http://localhost:3000/api" />);

      await waitFor(() => {
        expect(screen.getByText(/Page 1 of 1/)).toBeInTheDocument();
      });
    });

    it('should have page size selector', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => mockQueryResult,
      });

      renderWithProvider(<DatabaseViewer path="http://localhost:3000/api" />);

      await waitFor(() => {
        expect(screen.getByText('Show 10')).toBeInTheDocument();
      });
    });
  });

  describe('sorting', () => {
    it('should render sortable column headers', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => mockQueryResult,
      });

      renderWithProvider(<DatabaseViewer path="http://localhost:3000/api" enableSorting={true} />);

      await waitFor(() => {
        const nameHeader = screen.getByText('name');
        expect(nameHeader).toBeInTheDocument();
      });
    });
  });

  describe('authentication', () => {
    it('should include custom headers when provided', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => mockQueryResult,
      });

      renderWithProvider(
        <DatabaseViewer
          path="http://localhost:3000/api"
          headers={{ 'X-Custom-Header': 'test-value' }}
        />
      );

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('http://localhost:3000/api'),
          expect.objectContaining({
            headers: expect.objectContaining({
              'X-Custom-Header': 'test-value',
            }),
          })
        );
      });
    });
  });
});

describe('DatabaseViewerWithProvider', () => {
  it('should render with default query client', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockQueryResult,
    });

    render(<DatabaseViewerWithProvider path="http://localhost:3000/api" enableLogging={false} />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Filter records...')).toBeInTheDocument();
    });
  });

  it('should render with custom query client', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockQueryResult,
    });

    const customClient = new QueryClient();
    render(
      <DatabaseViewerWithProvider
        path="http://localhost:3000/api"
        queryClient={customClient}
        enableLogging={false}
      />
    );

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Filter records...')).toBeInTheDocument();
    });
  });
});
