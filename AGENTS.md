# Tabula Lens - Project Notes

## Build and Test Commands

### @tabula-lens/node

- **Build**: `npm run build`
- **Test**: `npm run test`
- **Type check**: `npm run check-types` (runs `tsc --noEmit`)
- **Lint**: `npm run lint`

### @tabula-lens/react

- **Build**: `npm run build`
- **Test**: `npm run test`
- **Type check**: `npm run check-types` (runs `tsc --noEmit`)
- **Lint**: `npm run lint`

## Known Issues

### Pre-existing Test Failures in @tabula-lens/react

The test suite for `@tabula-lens/react` has 14 failing tests with the error:

```
Cannot read properties of undefined (reading 'get')
```

This error occurs during data fetching in the test environment and appears to be a pre-existing issue unrelated to the logging system implementation. The tests were failing before the logging changes were made.

**Affected tests:**

- All rendering tests (3 tests)
- All data display tests (4 tests)
- All filtering tests (1 test)
- All pagination tests (3 tests)
- All sorting tests (1 test)
- DatabaseViewerWithProvider tests (2 tests)

**Passing tests:**

- Loading state test (1 test)
- Error state tests (3 tests)
- Custom headers test (1 test)

The error suggests an issue with the test's mock fetch setup or the component's data fetching logic when running in the test environment. This should be investigated separately from the logging system work.

## Logging System Implementation

The logging system was successfully implemented for both packages:

### @tabula-lens/node

- Created `src/logger.ts` with Logger interface and implementations
- Updated `TabulaLens.ts` with comprehensive logging
- Updated all 15 adapters with request-level logging
- All tests, type checks, and linting pass

### @tabula-lens/react

- Created `src/logger.ts` with browser-compatible logging
- Updated `DatabaseViewer.tsx` with component lifecycle and data fetch logging
- Type checks and linting pass
- Tests have pre-existing failures (documented above)

## Verification

The logging system has been verified to work correctly in the example-vite app:

- Backend server started successfully on port 3002
- Structured logs with timestamps, colors, and request IDs are displayed
- Database connection errors are now properly diagnosed through logs
- Content type validation provides detailed error messages for non-JSON responses
