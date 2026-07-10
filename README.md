# Tabula Lens

[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Build Status](https://github.com/Atsytec/tabula-lens/workflows/CI/badge.svg)](https://github.com/Atsytec/tabula-lens/actions)
[![npm version](https://badge.fury.io/js/%40tabula-lens%2Freact.svg)](https://www.npmjs.com/package/@tabula-lens/react)
[![npm version](https://badge.fury.io/js/%40tabula-lens%2Fnode.svg)](https://www.npmjs.com/package/@tabula-lens/node)
[![Code of Conduct](https://img.shields.io/badge/Code%20of%20Conduct-2.0.0-4BAAAA.svg)](CODE_OF_CONDUCT.md)

A component library for viewing database data with secure, backend-agnostic architecture.

## 🎯 Project Goal

Create a lightweight, open-source React component that allows developers to easily visualize database tables without exposing database credentials to the frontend.

## 🔑 Key Features

- **Security First**: Database credentials never leave the backend
- **Backend-Agnostic**: Works with any Node.js backend framework
- **Framework Agnostic**: Compatible with React, Next.js, TanStack Start, etc.
- **Feature Rich**: Built-in pagination, sorting, and filtering
- **Type Safe**: Full TypeScript support with strict type checking
- **Zero Config**: Minimal setup required for users
- **15+ Framework Adapters**: Pre-built adapters for popular Node.js frameworks

## 📦 Packages

This monorepo contains the following packages:

- **@tabula-lens/react**: React component for displaying database data
- **@tabula-lens/node**: Node.js backend SDK for database queries with framework adapters

## 🚀 Quick Start

### Backend Setup

```bash
npm install @tabula-lens/node
```

```javascript
import { TabulaLens, expressAdapter } from '@tabula-lens/node';

const tabulaLens = new TabulaLens(process.env.DATABASE_URL);

// Create an API endpoint using the Express adapter
app.use('/api/tabula-lens', expressAdapter(tabulaLens));
```

### Frontend Setup

```bash
npm install @tabula-lens/react
```

```tsx
import { DatabaseViewer } from '@tabula-lens/react';

function App() {
  return <DatabaseViewer path="/api/tabula-lens" />;
}
```

## 📖 Documentation

For detailed documentation, see the package-specific READMEs:

- **[@tabula-lens/node README](packages/node/README.md)** - Backend SDK documentation with framework adapters, API reference, and security considerations
- **[@tabula-lens/react README](packages/react/README.md)** - React component documentation with props reference, advanced usage, and performance optimization

### Key Features

**@tabula-lens/node**:

- 15+ framework adapters (Express, Fastify, Next.js, etc.)
- Built-in logging system with configurable levels
- Comprehensive error handling
- Security-first design with credential protection

**@tabula-lens/react**:

- Built-in pagination, sorting, and filtering
- Customizable styling and components
- Performance optimized with React.memo
- TanStack Query integration for efficient data fetching

## 🛠️ Tech Stack

- **Frontend**: React, TanStack Table, TanStack Query
- **Backend SDK**: Knex.js, PostgreSQL
- **Build**: tsup, Turborepo
- **Testing**: Vitest, React Testing Library
- **Docs**: Astro, Starlight
- **Code Quality**: ESLint, Prettier, Husky

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

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please see our [contributing guidelines](CONTRIBUTING.md) for details.

## 🌟 Community

### Contributors

We thank all the contributors who have helped make Tabula Lens better. See our [CONTRIBUTORS](CONTRIBUTORS) file for a full list.

### Getting Involved

- **Report bugs**: Open an issue using our [bug report template](.github/ISSUE_TEMPLATE/bug_report.yml)
- **Suggest features**: Use our [feature request template](.github/ISSUE_TEMPLATE/feature_request.yml)
- **Answer questions**: Help other users in GitHub issues
- **Improve documentation**: Submit documentation updates via pull requests
- **Write code**: Fix bugs or implement new features

### Recognition

Contributors are recognized in our [CONTRIBUTORS](CONTRIBUTORS) file and on GitHub. We value every contribution, whether it's code, documentation, testing, or community support.

## 🔒 Security

For security vulnerabilities, please see our [security policy](SECURITY.md).

## 💬 Support

Need help? Check our [support documentation](SUPPORT.md) or open an issue on GitHub.

## 📜 Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md).
