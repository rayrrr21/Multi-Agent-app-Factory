import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  use: {
    // The base URL will be the same as the webServer URL.
    // It will be set to the actual Expo web URL discovered by the webServer.
    baseURL: 'http://localhost:12345',
    headless: true,
  },
  webServer: {
    // Use the Expo start command within the template-mobile workspace.
    command: 'npm --prefix apps/template-mobile run web',
    url: 'http://localhost:12345',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
