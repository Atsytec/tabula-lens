# Tabula Lens Example Application

This example demonstrates how to use the Tabula Lens component library in a real application.

## Structure

- `backend/` - Express.js server using @tabula-lens/node
- `frontend/` - React application using @tabula-lens/react

## Prerequisites

- PostgreSQL database (for full testing)
- Node.js 18+
- pnpm

## Quick Start (Without Database)

To test the React component without a database, you can use a mock API:

1. **Install dependencies:**

   ```bash
   cd apps/example
   pnpm install
   ```

2. **Start the frontend:**

   ```bash
   cd frontend
   pnpm dev
   ```

3. **Create a simple mock API** (optional):
   You can create a simple mock server or use the component with mock data for testing.

## Full Setup (With Database)

1. **Set up your database:**
   Create a PostgreSQL database and add a sample table:

   ```sql
   CREATE TABLE users (
     id SERIAL PRIMARY KEY,
     name VARCHAR(255),
     email VARCHAR(255),
     created_at TIMESTAMP DEFAULT NOW()
   );

   INSERT INTO users (name, email) VALUES
     ('John Doe', 'john@example.com'),
     ('Jane Smith', 'jane@example.com');
   ```

2. **Configure environment variables:**
   Create a `.env` file in the backend directory:

   ```
   DATABASE_URL=postgresql://user:password@localhost:5432/your_database
   ```

3. **Start the backend:**

   ```bash
   cd backend
   pnpm dev
   ```

4. **Start the frontend:**

   ```bash
   cd frontend
   pnpm dev
   ```

5. **Open your browser:**
   Navigate to the frontend URL (usually http://localhost:5173)

## Features Demonstrated

- **Backend SDK**: Using @tabula-lens/node to query PostgreSQL
- **React Component**: Using @tabula-lens/react with TanStack Table
- **Pagination**: Server-side pagination
- **Sorting**: Multi-column sorting
- **Filtering**: Text-based filtering
- **API Integration**: RESTful API pattern

## Note

The example apps use workspace dependencies (`@tabula-lens/node` and `@tabula-lens/react`). Make sure to run `pnpm install` from the root of the monorepo to properly link the packages.
