import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { TabulaLens } from '../../../../packages/node/dist/index.js';

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize TabulaLens with your database connection
// In production, use environment variables for security
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/mydb';

const tabulaLens = new TabulaLens(DATABASE_URL);

// API endpoint for the frontend
app.get('/api/data', async (req, res) => {
  try {
    const { table, page, limit, sort, filter, columns } = req.query;

    const result = await tabulaLens.query({
      table: table as string,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      sort: sort as string,
      filter: filter as string,
      columns: columns ? (columns as string).split(',') : undefined,
    });

    res.json(result);
  } catch (error) {
    console.error('Error querying database:', error);
    res.status(500).json({ error: 'Failed to query database' });
  }
});

// Get available tables
app.get('/api/tables', async (req, res) => {
  try {
    const tables = await tabulaLens.getTables();
    res.json({ tables });
  } catch (error) {
    console.error('Error getting tables:', error);
    res.status(500).json({ error: 'Failed to get tables' });
  }
});

// Get columns for a table
app.get('/api/columns/:table', async (req, res) => {
  try {
    const { table } = req.params;
    const columns = await tabulaLens.getColumns(table);
    res.json({ columns });
  } catch (error) {
    console.error('Error getting columns:', error);
    res.status(500).json({ error: 'Failed to get columns' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Example backend server running on http://localhost:${PORT}`);
  console.log('Make sure to set DATABASE_URL environment variable');
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('Shutting down gracefully...');
  await tabulaLens.close();
  process.exit(0);
});
