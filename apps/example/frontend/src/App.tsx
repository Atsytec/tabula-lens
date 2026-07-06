import { useState, useEffect } from 'react';
import { DatabaseViewerWithProvider } from '@tabula-lens/react';

function App() {
  const [tables, setTables] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch available tables
    fetch('http://localhost:3001/api/tables')
      .then((res) => res.json())
      .then((data) => {
        setTables(data.tables || []);
        if (data.tables && data.tables.length > 0) {
          setSelectedTable(data.tables[0]);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to fetch tables: ' + err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div style={{ padding: '2rem' }}>Loading available tables...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: '2rem' }}>
        <h1>Tabula Lens Example</h1>
        <p style={{ color: 'red' }}>{error}</p>
        <p>Make sure the backend server is running on http://localhost:3001</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Tabula Lens Example</h1>
      <p>This example demonstrates the Tabula Lens component library.</p>

      {tables.length === 0 ? (
        <div
          style={{
            marginTop: '2rem',
            padding: '1rem',
            backgroundColor: '#fff3cd',
            borderRadius: '4px',
          }}
        >
          <h3>No tables found</h3>
          <p>Your database doesn&apos;t have any tables yet. Create some tables to get started.</p>
        </div>
      ) : (
        <>
          <div style={{ marginTop: '2rem' }}>
            <h2>Select a table to view:</h2>
            <select
              value={selectedTable}
              onChange={(e) => setSelectedTable(e.target.value)}
              style={{ padding: '0.5rem', fontSize: '1rem', minWidth: '200px' }}
            >
              {tables.map((table) => (
                <option key={table} value={table}>
                  {table}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <h2>Database Viewer: {selectedTable}</h2>
            <DatabaseViewerWithProvider
              key={selectedTable}
              endpoint="http://localhost:3001/api/data"
              initialTable={selectedTable}
              pageSize={10}
            />
          </div>
        </>
      )}

      <div
        style={{
          marginTop: '2rem',
          padding: '1rem',
          backgroundColor: '#f5f5f5',
          borderRadius: '4px',
        }}
      >
        <h3>Setup Instructions</h3>
        <ol>
          <li>
            Start the backend server: <code>cd apps/example/backend &amp;&amp; pnpm dev</code>
          </li>
          <li>
            Set the <code>DATABASE_URL</code> environment variable for your PostgreSQL database
          </li>
          <li>
            Start this frontend: <code>cd apps/example/frontend &amp;&amp; pnpm dev</code>
          </li>
          <li>Open your browser to the frontend URL</li>
        </ol>
      </div>
    </div>
  );
}

export default App;
