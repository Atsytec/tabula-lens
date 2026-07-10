# Support

## Documentation

Before asking for help, please check our documentation:

- **[Main README](README.md)** - Quick start guide and overview
- **[@tabula-lens/node README](packages/node/README.md)** - Backend SDK documentation, framework adapters, API reference
- **[@tabula-lens/react README](packages/react/README.md)** - React component documentation, props reference, advanced usage

## Getting Help

### Quick Questions

For quick questions about usage, configuration, or examples:

- **GitHub Issues** - Open an issue with the "question" label
- **GitHub Discussions** - Start a discussion for broader topics (coming soon)

### Bug Reports

If you found a bug or unexpected behavior:

- Open a GitHub Issue using the [Bug Report template](.github/ISSUE_TEMPLATE/bug_report.yml)
- Include reproduction steps, environment details, and minimal example if possible

### Feature Requests

If you have an idea for improvement:

- Open a GitHub Issue using the [Feature Request template](.github/ISSUE_TEMPLATE/feature_request.yml)
- Describe the use case and proposed solution

### Security Issues

For security vulnerabilities:

- **Do not** open a public issue
- Email us at info@tabula-lens.dev
- See [SECURITY.md](SECURITY.md) for details

## Response Times

- **GitHub Issues**: We respond as soon as possible, typically within a few business days
- **Security Issues**: We acknowledge within 5 business days (see [SECURITY.md](SECURITY.md))
- **Email**: We respond within 5 business days

## Self-Help Resources

### Common Issues

**"Cannot read properties of undefined (reading 'get')"**

- This is a known issue in the test environment
- Check if you're running tests or in production
- See [AGENTS.md](AGENTS.md) for known test failures

**Database connection errors**

- Verify your DATABASE_URL is correct
- Check database credentials in your backend
- Enable logging in the backend SDK for detailed error messages

**Data not displaying**

- Check your API endpoint path
- Verify the backend adapter is configured correctly
- Check browser console for errors
- Ensure getAuthHeaders is returning valid authentication

### Search First

Before opening an issue:

1. Search [existing issues](https://github.com/Atsytec/tabula-lens/issues)
2. Check the [documentation](#documentation)
3. Review the [example app](apps/example-vite/) for implementation patterns

## Community

- **GitHub**: [Atsytec/tabula-lens](https://github.com/Atsytec/tabula-lens)
- **Email**: info@tabula-lens.dev

## Contributing

Want to help improve Tabula Lens? See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.
