// e2e/factory.spec.ts
import { test, expect } from '@playwright/test';

const USER_EMAIL = process.env.E2E_USER_EMAIL;
const USER_PASSWORD = process.env.E2E_USER_PASSWORD;

if (!USER_EMAIL || !USER_PASSWORD) {
  console.warn('⚠️ E2E credentials not set – login‑required tests will be skipped');
}

test.describe('Factory web app E2E flow', () => {
  test('App launch', async ({ page }) => {
    await page.goto('/');
    const logo = page.locator('[data-testid="app-logo"]');
    await expect(logo).toBeVisible({ timeout: 15000 });
  });

  test('Unauthenticated protected route redirects to login', async ({ page }) => {
    await page.goto('/profile');
    const loginForm = page.locator('[data-testid="login-form"]');
    await expect(loginForm).toBeVisible();
  });

  test('Login flow', async ({ page }) => {
    test.skip(!USER_EMAIL || !USER_PASSWORD, 'E2E credentials not provided');
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', USER_EMAIL);
    await page.fill('[data-testid="password-input"]', USER_PASSWORD);
    await Promise.all([
      page.waitForNavigation({ url: /\/profile/ }),
      page.click('button[type="submit"]'),
    ]);
    await expect(page).toHaveURL(/\/profile/);
  });

  test('Session navigation persists', async ({ page }) => {
    test.skip(!USER_EMAIL || !USER_PASSWORD, 'E2E credentials not provided');
    await page.goto('/login');
    await page.fill('input[name="email"]', USER_EMAIL);
    await page.fill('input[name="password"]', USER_PASSWORD);
    await Promise.all([
      page.waitForNavigation({ url: /\/profile/ }),
      page.click('button[type="submit"]'),
    ]);
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/dashboard/);
    const logoutBtn = page.locator('button[data-testid="logout"]');
    await expect(logoutBtn).toBeVisible();
  });

  test('Profile edit and restore', async ({ page }) => {
    test.skip(!USER_EMAIL || !USER_PASSWORD, 'E2E credentials not provided');
    await page.goto('/login');
    await page.fill('input[name="email"]', USER_EMAIL);
    await page.fill('input[name="password"]', USER_PASSWORD);
    await Promise.all([
      page.waitForNavigation({ url: /\/profile/ }),
      page.click('button[type="submit"]'),
    ]);
    const nameInput = page.locator('input[name="displayName"]');
    const original = await nameInput.inputValue();
    const newValue = original + '_e2e';
    await nameInput.fill(newValue);
    await page.click('button[data-testid="save-profile"]');
    await expect(page.locator('text=Profile updated')).toBeVisible();
    await page.reload();
    await expect(nameInput).toHaveValue(newValue);
    // restore
    await nameInput.fill(original);
    await page.click('button[data-testid="save-profile"]');
    await expect(page.locator('text=Profile updated')).toBeVisible();
  });

  test('Logout flow', async ({ page }) => {
    test.skip(!USER_EMAIL || !USER_PASSWORD, 'E2E credentials not provided');
    await page.goto('/login');
    await page.fill('input[name="email"]', USER_EMAIL);
    await page.fill('input[name="password"]', USER_PASSWORD);
    await Promise.all([
      page.waitForNavigation({ url: /\/profile/ }),
      page.click('button[type="submit"]'),
    ]);
    await page.click('button[data-testid="logout"]');
    await expect(page).toHaveURL(/\/login/);
    await page.goto('/profile');
    const loginForm = page.locator('form');
    await expect(loginForm).toBeVisible();
  });
});
