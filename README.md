# Tabula Lens

A React component library for viewing database data with a secure, backend-agnostic architecture.

## 🎯 Project Goal

Create a lightweight, open-source React component that allows developers to easily visualize database tables without exposing database credentials to the frontend.

## 🔑 Key Features

- **Security First**: Database credentials never leave the backend
- **Backend-Agnostic**: Works with any Node.js backend framework
- **Framework Agnostic**: Compatible with React, Next.js, TanStack Start, etc.
- **Feature Rich**: Built-in pagination, sorting, and filtering
- **Type Safe**: Full TypeScript support with strict type checking
- **Zero Config**: Minimal setup required for users

## 📦 Packages

This monorepo contains the following packages:

- **@tabula-lens/react**: React component for displaying database data
- **@tabula-lens/node**: Node.js backend SDK for database queries
- **@tabula-lens/docs**: Documentation site (Astro + Starlight)

## 🚀 Quick Start

### Backend Setup

```bash
npm install @tabula-lens/node
```

```javascript
import TabulaLens from '@tabula-lens/node';

const tabulaLens = new TabulaLens(process.env.DATABASE_URL);

// Create an API endpoint
app.get('/api/tabula-lens', async (req, res) => {
  const data = await tabulaLens.query(req.query);
  res.json(data);
});
```

### Frontend Setup

```bash
npm install @tabula-lens/react
```

```jsx
import { DatabaseViewer } from '@tabula-lens/react';

function App() {
  return <DatabaseViewer endpoint="/api/tabula-lens" authToken={userToken} />;
}
```

## 🛠️ Tech Stack

- **Frontend**: React, TanStack Table, TanStack Query
- **Backend SDK**: Knex.js, PostgreSQL
- **Build**: tsup, Turborepo
- **Testing**: Vitest, React Testing Library
- **Docs**: Astro, Starlight
- **Code Quality**: ESLint, Prettier, Husky

## 📖 Documentation

Full documentation is available at [docs.tabula-lens.com](https://docs.tabula-lens.com) (coming soon).

## 🔧 Development

```bash
# Install dependencies
pnpm install

# Run development mode
pnpm dev

# Build all packages
pnpm build

# Run tests
pnpm test

# Lint code
pnpm lint

# Format code
pnpm format
```

## 📝 License

Currently no license. All rights reserved.

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## 📧 Contact

For questions or support, please open an issue on GitHub.
