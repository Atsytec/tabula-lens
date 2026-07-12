# Logging Content Extraction

## User-Facing Configuration Content (for User Guides)

This content should be added to the Backend Setup guide as a "Logging Configuration" section.

### Basic Configuration

```typescript
import { TabulaLens } from '@tabula-lens/node';

// Basic usage with default logging
const tabulaLens = new TabulaLens({
  url: process.env.DATABASE_URL,
  // type is auto-detected from the connection string
});

// Custom log level
const tabulaLensWithLogLevel = new TabulaLens({
  url: process.env.DATABASE_URL,
  logLevel: 'info',
});

// Production configuration
const tabulaLensProduction = new TabulaLens({
  url: process.env.DATABASE_URL,
  logLevel: 'error',
  logFormat: 'json',
  sensitiveDataMasking: true,
});
```

### Log Levels

The logging system supports five log levels:

| Level    | Description                           | Use Case                              |
| -------- | ------------------------------------- | ------------------------------------- |
| `debug`  | Detailed debugging information        | Development and troubleshooting       |
| `info`   | General informational messages        | Normal operation monitoring           |
| `warn`   | Warning messages for potential issues | Non-critical issues and deprecations  |
| `error`  | Error messages for failures           | Critical errors and exceptions        |
| `silent` | Disable all logging                   | Production when logging is not needed |

### Environment-Specific Configuration

```typescript
const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

const tabulaLens = new TabulaLens(process.env.DATABASE_URL, {
  logLevel: isDevelopment ? 'debug' : 'error',
  logFormat: isProduction ? 'json' : 'pretty',
  enableRequestLogging: isDevelopment,
  enableQueryLogging: isDevelopment,
  sensitiveDataMasking: isProduction,
});
```

### Log Formats

- **JSON Format**: Structured logging for production and log aggregation
- **Text Format**: Simple text logs for staging environments
- **Pretty Format**: Human-readable logs with emojis for development

### React Component Logging

```typescript
import { DatabaseViewer } from '@tabula-lens/react';

function App() {
  return (
    <DatabaseViewer
      path="/api/tabula-lens"
      logLevel="info"
    />
  );
}
```

### Best Practices

- **Development**: Use `debug` level with `pretty` format
- **Staging**: Use `info` level with `text` format
- **Production**: Use `error` level with `json` format
- Always enable `sensitiveDataMasking` in production
- Use `silent` level for testing to avoid log pollution

## Implementation Content (for Contributor Docs)

This content should be moved to contributor-docs/internal-systems/logging-system.mdx

### Log Aggregation Integration

- ELK Stack Integration
- CloudWatch Integration
- Datadog Integration
- Custom logger integration patterns

### Performance Considerations

- Logging overhead analysis
- Synchronous vs asynchronous logging
- Buffer strategies
- Log rotation and management

### Advanced Implementation Details

- Request ID tracking implementation
- Structured logging architecture
- Error handling in logging system
- Logger interface design and extensibility

### Testing and Debugging

- Logging system testing strategies
- Debugging logging issues
- Performance profiling for logging
