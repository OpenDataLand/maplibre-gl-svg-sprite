import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    threads: false,
    poolOptions: {
      threads: {
        singleThread: true
      }
    },
    environment: 'happy-dom',
    testTimeout: 10000,
    include: ['src/**/*.test.ts'],
    exclude: ['svg-icons/**/*'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'dist/**',
        'docs/**',
        'examples/**',
        'tools/**',
        'svg-icons/**',
        '**/*.config.*',
        '**/types/**'
      ]
    }
  }
});
