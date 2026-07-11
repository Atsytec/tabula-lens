# Contributing to Tabula Lens

Thank you for your interest in contributing! We welcome contributions from everyone.

## Getting Started

### Prerequisites

- Node.js 22.x or higher
- pnpm 9.x or higher
- Git

### Development Setup

1. **Fork the repository** on GitHub
2. **Clone your fork:**

   ```bash
   git clone https://github.com/YOUR_USERNAME/tabula-lens.git
   cd tabula-lens
   ```

3. **Install dependencies:**

   ```bash
   pnpm install
   ```

4. **Run development mode:**
   ```bash
   pnpm dev
   ```

## Development Workflow

### Branch Naming

Use descriptive branch names:

- `feat/` - New features (e.g., `feat/add-dark-mode`)
- `fix/` - Bug fixes (e.g., `fix/pagination-bug`)
- `docs/` - Documentation changes (e.g., `docs/update-readme`)
- `chore/` - Maintenance tasks (e.g., `chore/update-dependencies`)

### Making Changes

1. **Create a new branch:**

   ```bash
   git checkout -b feat/your-feature-name
   ```

2. **Make your changes** and test them:

   ```bash
   # Run tests
   pnpm test

   # Run linting
   pnpm lint

   # Check formatting
   pnpm format
   ```

3. **Commit your changes** with a clear message:

   ```bash
   git commit -m "feat: add dark mode support"
   ```

4. **Push to your fork:**

   ```bash
   git push origin feat/your-feature-name
   ```

5. **Create a Pull Request** on GitHub

## Pull Request Process

### Before Submitting

- [ ] All tests pass (`pnpm test`)
- [ ] Code passes linting (`pnpm lint`)
- [ ] Code is properly formatted (`pnpm format`)
- [ ] Changes are tested (add tests for new features)
- [ ] Documentation is updated (if needed)

### Creating a PR

1. Go to the "Pull Requests" tab on GitHub
2. Click "New Pull Request"
3. Select your branch from your fork
4. Fill in the PR template
5. Submit the PR

### What Happens Next

- We will review your PR as soon as possible
- We may request changes or ask questions
- Once approved, we will merge your PR
- Your contribution will be included in the next release

## Code Style

We use:

- **ESLint** for code quality
- **Prettier** for code formatting
- **TypeScript** for type safety

Please run `pnpm lint` and `pnpm format` before committing.

## Testing

We use **Vitest** for testing. Please:

- Write tests for new features
- Ensure all tests pass before submitting
- Keep tests focused and readable

## Adding Changesets

If your change affects the public API or requires a version bump:

1. Run `pnpm changeset` to create a changeset
2. Follow the prompts to describe your change
3. Commit the changeset file

## Questions?

Feel free to:

- Open an issue for questions
- Start a discussion in an existing PR
- Contact us at info@tabula-lens.dev

## Documentation

Documentation is a first-class citizen in this project. We follow the **docs-as-code** principle: no feature is considered complete without documentation.

For detailed guidance on contributing to documentation, see our [Documentation Contributing Guide](https://docs.tabula-lens.dev/contributing).

### Documentation Principles

- **Diataxis Framework**: We organize content into tutorials, how-to guides, explanations, and reference
- **Quality Standards**: All documentation must be accurate, clear, and accessible
- **Testing**: Code examples must be tested and verified
- **Accessibility**: Documentation must meet WCAG 2.1 AA standards
- **Maintenance**: Documentation is reviewed and updated with each release

### Documentation Tasks

Documentation improvements include:

- New guides and tutorials
- Content updates and corrections
- Code example improvements
- Accessibility enhancements
- Translation contributions

See the [Documentation Contributing Guide](https://docs.tabula-lens.dev/contributing) for detailed instructions on writing, testing, and submitting documentation changes.

## Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md).
