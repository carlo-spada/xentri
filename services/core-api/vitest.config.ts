import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/*.integration.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'json-summary', 'html'],
      reportsDirectory: './coverage',
      include: ['src/**/*.ts'],
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/*.test.ts',
        '**/__tests__/**',
        '**/globals.d.ts',
      ],
      // NFR29: >70% test coverage for core modules
      // Current thresholds based on unit tests only (container tests skipped in CI without RUN_TESTCONTAINERS=1)
      // Roadmap: Increase to 70% when container-gated tests run in CI
      // See: docs/testing-strategy.md for coverage improvement plan
      thresholds: {
        lines: 20,
        branches: 30,
        functions: 30,
        statements: 20,
      },
    },
    testTimeout: 10000,
    hookTimeout: 10000,
  },
});
