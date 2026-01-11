import { defineConfig } from '@playwright/test';

export default defineConfig({
  timeout: 30000,
  retries: 0,
  workers: 1, // Electron needs single worker usually
  reporter: 'list',
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'app',
      testDir: './tests/e2e/app/specs',
    },
    {
      name: 'website',
      testDir: './tests/e2e/website/specs',
      use: {
        browserName: 'chromium',
        baseURL: 'http://localhost:5174',
      },
    },
  ],
  webServer: {
    command: 'npm run website:dev -- --port 5174',
    url: 'http://localhost:5174',
    reuseExistingServer: !process.env.CI,
    stdout: 'ignore',
    stderr: 'pipe',
  },
});