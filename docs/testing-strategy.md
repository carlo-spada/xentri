# Xentri Testing Strategy

> Story 1.7 - NFR29: Test Coverage and Quality Gates

## Overview

This document outlines the testing strategy for Xentri, covering unit tests, integration tests, smoke tests, and coverage requirements.

## Test Categories

### 1. Unit Tests

**Location:** Co-located with source files (`*.test.ts`) or in `__tests__/` directories

**Framework:** Vitest 3.x with v8 coverage provider

**Scope:**
- Pure functions and business logic
- Schema validation (Zod schemas)
- Utility functions
- React component rendering

**Example:**
```typescript
// services/core-api/src/lib/logger.test.ts
describe('Logger Module', () => {
  it('should extract trace_id from x-trace-id header', () => {
    const request = createMockRequest({
      headers: { 'x-trace-id': 'custom-trace-123' },
    });
    expect(extractTraceId(request)).toBe('custom-trace-123');
  });
});
```

### 2. Integration Tests

**Location:** `*.integration.test.ts` files

**Requirements:** `RUN_TESTCONTAINERS=1` environment variable

**Dependencies:**
- `@testcontainers/postgresql` for PostgreSQL container
- Docker runtime (Colima on macOS)

**Scope:**
- Database operations with RLS
- API route handlers with real database
- Service interactions

**Running Integration Tests:**
```bash
# Start Docker/Colima first
colima start

# Run with testcontainers
RUN_TESTCONTAINERS=1 pnpm run test

# Or run specific integration test
RUN_TESTCONTAINERS=1 pnpm --filter @xentri/core-api exec vitest run src/routes/events.test.ts
```

### 3. Smoke Tests

**Location:** `scripts/smoke-test.ts`

**Scope:**
- RLS isolation verification
- Event immutability
- Brief creation flow
- API health with timing assertions
- Shell load with timing assertions

**Running Smoke Tests:**
```bash
# Requires running database
pnpm run test:smoke
```

### 4. E2E Tests (Planned)

**Framework:** Playwright

**Requirements:**
- `E2E_ORG_ID` - Test organization ID
- `E2E_AUTH_COOKIE` - Authenticated session cookie

**Scope:**
- Full user flows
- Cross-service integration
- Visual regression

## Coverage Requirements

### NFR29: >70% Test Coverage for Core Modules

**Current Thresholds (services/core-api):**
```typescript
// vitest.config.ts
thresholds: {
  lines: 70,
  branches: 70,
  functions: 70,
  statements: 70,
}
```

**Note:** Container-gated integration tests still require `RUN_TESTCONTAINERS=1`; coverage gate remains at 70% even when container tests are skipped. Add targeted unit/integration tests to keep coverage above threshold.

### Excluded from Coverage

- Test files (`*.test.ts`, `*.test.tsx`)
- Configuration files (`*.config.ts`)
- Scripts (`scripts/**`)
- Type definitions (`*.d.ts`)
- Schema packages (primarily type definitions)

## CI Integration

### Quality Gates (`.github/workflows/ci.yml`)

```yaml
test:
  name: Test
  runs-on: ubuntu-latest
  steps:
    - name: Run tests with coverage
      run: pnpm run test -- --coverage
    - name: Upload coverage report
      uses: actions/upload-artifact@v4
      with:
        name: coverage-report
        path: coverage/
```

### Branch Protection

PRs require passing:
- Lint check
- Type check
- Unit tests with coverage thresholds
- Build

## Test Utilities

### Auth Mocking

```typescript
// Mock Clerk authentication
const mockAuth = {
  userId: 'user_123',
  orgId: 'org_456',
  getToken: vi.fn().mockResolvedValue('mock-token'),
};
```

### Database Fixtures

```typescript
// Set RLS context for testing
await prisma.$executeRaw`SELECT set_config('app.current_org_id', ${orgId}, true)`;
```

### Request Mocking

```typescript
function createMockRequest(overrides: Partial<FastifyRequest> = {}): FastifyRequest {
  return {
    id: 'req-123',
    headers: {},
    ...overrides,
  } as unknown as FastifyRequest;
}
```

## Performance Thresholds

| Metric | Target | Test |
|--------|--------|------|
| Shell FMP | < 2s | Smoke test |
| API p95 | < 300ms | Smoke test (health endpoint) |

## Roadmap

1. **Short-term:**
   - Enable container tests in CI with Docker service
   - Add E2E test infrastructure with Playwright
   - Increase coverage thresholds to 40%

2. **Medium-term:**
   - Add visual regression tests for shell
   - Implement contract testing for API schemas
   - Target 60% coverage

3. **Long-term:**
   - Performance regression testing
   - Chaos engineering tests for resilience
   - Target 70% coverage (NFR29 compliance)

## References

- [Vitest Documentation](https://vitest.dev/)
- [Testcontainers Node](https://node.testcontainers.org/)
- [Playwright Documentation](https://playwright.dev/)
- Story 1.7: DevOps, Observability, and Test Readiness
