# @tabula-lens/react

[![npm version](https://badge.fury.io/js/%40tabula-lens%2Freact.svg)](https://www.npmjs.com/package/@tabula-lens/react)
[![Downloads](https://img.shields.io/npm/dm/@tabula-lens/react)](https://www.npmjs.com/package/@tabula-lens/react)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19+-61DAFB.svg)](https://reactjs.org/)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

> 📚 **[Full Documentation](https://docs.tabula-lens.dev)** - Comprehensive guides, API reference, and examples

A powerful React component for viewing database data with built-in pagination, sorting, and filtering. Designed to work seamlessly with the `@tabula-lens/node` backend SDK for a secure, full-stack database viewing solution.

## 📦 Installation

```bash
npm install @tabula-lens/react
# or
pnpm add @tabula-lens/react
# or
yarn add @tabula-lens/react
```

### Peer Dependencies

This package requires React 19.2.7+ and React DOM 19.2.7+:

```bash
npm install react react-dom
```

## 🚀 Quick Start

### Basic Usage

```tsx
import { DatabaseViewer } from '@tabula-lens/react';

function App() {
  return <DatabaseViewer path="/api/tabula-lens" />;
}
```

### With Authentication

```tsx
import { DatabaseViewer } from '@tabula-lens/react';

function App() {
  const getAuthHeaders = async () => {
    const token = localStorage.getItem('authToken');
    return { Authorization: `Bearer ${token}` };
  };

  return <DatabaseViewer path="/api/tabula-lens" getAuthHeaders={getAuthHeaders} />;
}
```

### With Table Selector

```tsx
import { DatabaseViewer } from '@tabula-lens/react';

function App() {
  return <DatabaseViewer path="/api/tabula-lens" tableSelector="dropdown" initialTable="users" />;
}
```

## 📖 Full Documentation

For comprehensive guides, API reference, advanced configurations, TanStack Query/Table integrations, and custom component patterns, visit our [full documentation](https://docs.tabula-lens.dev).

## 🎯 Features

- **Security First**: Database credentials stay on the backend
- **Feature Rich**: Built-in pagination, sorting, and filtering
- **Type Safe**: Full TypeScript support with comprehensive type definitions
- **Customizable**: Extensive styling and component customization options
- **Framework Agnostic**: Works with React, Next.js, TanStack Start, Remix, SvelteKit, and more
- **Responsive**: Mobile-friendly design with responsive table layouts
- **Performance**: Powered by TanStack Query for efficient data fetching and caching
- **Zero Config**: Minimal setup required for basic usage
- **Modular Architecture**: Component-based design with reusable sub-components, custom hooks, and utility functions
- **Optimized**: React.memo implementation for performance optimization
