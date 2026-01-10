import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e/specs',
  timeout: 30000,
  retries: 0,
  workers: 1, // Electron apps typically run as a single instance during tests
  reporter: 'list',
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
});
