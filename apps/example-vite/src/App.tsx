import { DatabaseViewerWithProvider } from '@tabula-lens/react';

function App() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Vite + React + Tabula Lens Example</h1>
      <p>This example demonstrates the integration of Tabula Lens packages with Vite + React.</p>
      <DatabaseViewerWithProvider path="/api/tabula-lens" tableSelector="sidebar" />
    </div>
  );
}

export default App;
