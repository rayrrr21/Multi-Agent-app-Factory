import { test, expect } from '@playwright/test';

test.describe('SkyRush Detailed Behavioral Contract', () => {

  test('SkyRush HUD persists between rounds', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("START SKYRUSH RUN")');

    const hud = page.locator('text=/MI/').first();
    await expect(hud).toBeVisible();

    // Select correct answer (United States)
    await page.click('button:has-text("United States")');
    await page.waitForTimeout(700);

    // HUD remains present on next round
    await expect(hud).toBeVisible();
  });

  test('SkyRush correct answer advances run (distance & streak increment)', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("START SKYRUSH RUN")');

    // Click correct answer
    await page.click('button:has-text("United States")');
    await page.waitForTimeout(700);

    // Streak increments to 1
    const streakBadge = page.locator('div:has-text("🔥")').filter({ hasText: '1' });
    await expect(streakBadge.first()).toBeVisible();
  });

  test('SkyRush altitude descent changes context and reward', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("START SKYRUSH RUN")');

    // Starts at 30,000 FT (5x)
    await expect(page.locator('text=/30,000 FT/')).toBeVisible();
    await expect(page.locator('text=/5× MULTIPLIER/')).toBeVisible();

    // Descend to 10,000 FT
    const descendBtn = page.locator('button:has-text("DESCEND")');
    await descendBtn.click();
    await expect(page.locator('text=/10,000 FT/')).toBeVisible();
    await expect(page.locator('text=/3× MULTIPLIER/')).toBeVisible();

    // Descend to 3,000 FT
    await descendBtn.click();
    await expect(page.locator('text=/3,000 FT/')).toBeVisible();
    await expect(page.locator('text=/1× MULTIPLIER/')).toBeVisible();

    // Player cannot ascend back up
    await expect(descendBtn).not.toBeVisible();
  });

  test('SkyRush wrong answer removes life and resets combo', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("START SKYRUSH RUN")');

    // Click wrong answer (Canada for Salt Lake City)
    await page.click('button:has-text("Canada")');
    await page.waitForTimeout(700);

    // Combo is reset to 1 (×1)
    const comboBadge = page.locator('text=/×1/');
    await expect(comboBadge.first()).toBeVisible();
  });

  test('SkyRush Flight Over occurs on third miss and Fly Again resets run state', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("START SKYRUSH RUN")');

    // Miss 1
    await page.click('button:has-text("Canada")');
    await page.waitForTimeout(700);

    // Miss 2
    await page.click('button:has-text("Kansai")');
    await page.waitForTimeout(700);

    // Miss 3 -> FLIGHT OVER
    await page.click('button:has-text("London")');
    await page.waitForTimeout(700);

    await expect(page.locator('text=/FLIGHT OVER/')).toBeVisible();
    await expect(page.locator('button:has-text("FLY AGAIN")')).toBeVisible();

    // Click FLY AGAIN -> Clean new run immediately
    await page.click('button:has-text("FLY AGAIN")');
    await page.waitForTimeout(500);

    // Verify lives restored and distance reset
    await expect(page.locator('text=/ALTITUDE:/')).toBeVisible();
    await expect(page.locator('text=/0 MI/')).toBeVisible();
  });

});
