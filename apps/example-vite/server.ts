import express from 'express';
import { TabulaLens, expressAdapter } from '@tabula-lens/node';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Initialize TabulaLens with a database URL
// In production, this should come from environment variables
const tabulaLens = new TabulaLens(
  process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/mydb'
);

// Create API endpoint
app.use('/api/tabula-lens', expressAdapter(tabulaLens));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Tabula Lens API available at http://localhost:${PORT}/api/tabula-lens`);
});
