import { test, expect } from '@playwright/test';

test('Home page shows logo', async ({ page }) => {
  // Navigate to the root of the Expo web app
  await page.goto('/');
  // Verify the logo element is visible
  const logo = page.locator('[data-testid="app-logo"]');
  await expect(logo).toBeVisible({ timeout: 10000 });
});
