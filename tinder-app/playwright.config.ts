import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 15_000,
  expect: { timeout: 5_000 },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: 'http://localhost:5173',
    headless: true,
  },
});
