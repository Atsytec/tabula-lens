import 'dotenv/config';
import express from 'express';
import { TabulaLens, expressAdapter } from '@tabula-lens/node';
import cors from 'cors';

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

// Validate DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error('ERROR: DATABASE_URL environment variable is not set');
  console.error('Please set DATABASE_URL in your .env file or environment');
  process.exit(1);
}

// Initialize TabulaLens with a database URL
const tabulaLens = new TabulaLens(process.env.DATABASE_URL);

// Create API endpoint
app.use('/api/tabula-lens', expressAdapter(tabulaLens));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Tabula Lens API available at http://localhost:${PORT}/api/tabula-lens`);
});
