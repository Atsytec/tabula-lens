import express, { RequestHandler } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { TabulaLens, expressAdapter } from '@tabula-lens/node';

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());

// Initialize TabulaLens with your database connection
// In production, use environment variables for security
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/mydb';

const tabulaLens = new TabulaLens(DATABASE_URL);

// Use TabulaLens Express adapter for REST API
app.use('/api/tabula-lens', expressAdapter(tabulaLens) as unknown as RequestHandler);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Example backend server running on http://localhost:${PORT}`);
  console.log('TabulaLens API available at /api/tabula-lens');
  console.log('Make sure to set DATABASE_URL environment variable');
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('Shutting down gracefully...');
  await tabulaLens.close();
  process.exit(0);
});
