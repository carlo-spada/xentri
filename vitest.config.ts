import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['**/*.test.ts', '**/*.test.tsx'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/e2e/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'json-summary', 'html'],
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/*.test.ts',
        '**/*.test.tsx',
        '**/e2e/**',
        '**/*.config.ts',
        '**/*.config.js',
        '**/scripts/**',
      ],
      // NFR29: Coverage thresholds enforced per-package in package vitest.config.ts
      // Target: 70% for core modules (services/core-api)
      // Schema packages (ts-schema) exempt - primarily type definitions
    },
    testTimeout: 10000,
    hookTimeout: 10000,
  },
});
