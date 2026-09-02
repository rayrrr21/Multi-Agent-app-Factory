import { test, expect } from '@playwright/test';

test('Login flow shows logo', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[data-testid="email-input"]', process.env.E2E_USER_EMAIL ?? '');
 await page.fill('[data-testid="password-input"]', process.env.E2E_USER_PASSWORD ?? '');
 await page.click('button:has-text("Log In")');
 await page.waitForURL(/\/profile|\//);
 const logo = page.locator('[data-testid="app-logo"]');
 await expect(logo).toBeVisible({ timeout: 10000 });
});
