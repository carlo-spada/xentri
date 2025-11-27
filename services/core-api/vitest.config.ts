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
      include: [
        'src/lib/**/*.ts',
        'src/middleware/**/*.ts',
        'src/routes/health.ts',
      ],
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/*.test.ts',
        '**/__tests__/**',
        '**/globals.d.ts',
        'src/server.ts',
        'src/domain/**',
        'src/infra/**',
        'src/routes/**',
        'src/lib/sentry.ts',
        'src/middleware/tracing.ts',
        'src/middleware/orgContext.ts',
      ],
      // NFR29: >70% test coverage for core modules
      thresholds: {
        lines: 70,
        branches: 70,
        functions: 70,
        statements: 70,
      },
    },
    testTimeout: 10000,
    hookTimeout: 10000,
  },
});
