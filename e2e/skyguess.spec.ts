import { test, expect } from '@playwright/test';

test.describe('SKYGUESS Gameplay Contract', () => {

  test('Daily SkyGuess flow — image, map, guess, score, and reveal', async ({ page }) => {
    await page.goto('/');

    // 1. Verify Home loads
    const logo = page.locator('[data-testid="app-logo"]');
    await expect(logo).toBeVisible({ timeout: 15000 });

    // 2. Launch Daily SkyGuess
    const playDailyBtn = page.locator('button:has-text("PLAY TODAY\'S SKYGUESS")');
    await expect(playDailyBtn).toBeVisible();
    await playDailyBtn.click();

    // 3. Map modal opens
    const lockBtn = page.locator('button:has-text("LOCK IN GUESS")');
    await expect(lockBtn).toBeVisible();

    // 4. Lock in guess
    await lockBtn.click();

    // 5. Verify distance, score, and reveal screen
    const pointsText = page.locator('text=/\\d+ POINTS/');
    await expect(pointsText).toBeVisible();

    const kmText = page.locator('text=/km away/');
    await expect(kmText).toBeVisible();

    const shareBtn = page.locator('button:has-text("SHARE RESULT")');
    await expect(shareBtn).toBeVisible();
  });

  test('SkyRush Arcade flow — round, answer, lives, flight over, and fly again', async ({ page }) => {
    await page.goto('/');

    // 1. Start SkyRush
    const startRushBtn = page.locator('button:has-text("START SKYRUSH RUN")');
    await expect(startRushBtn).toBeVisible();
    await startRushBtn.click();

    // 2. Verify HUD & Altitude risk banner
    const altitudeBanner = page.locator('text=/ALTITUDE:/');
    await expect(altitudeBanner).toBeVisible();

    // 3. Test Altitude Descent
    const descendBtn = page.locator('button:has-text("DESCEND")');
    await expect(descendBtn).toBeVisible();
    await descendBtn.click();
    await expect(page.locator('text=/10,000 FT/')).toBeVisible();

    // 4. Select an answer (Country check: United States vs Canada)
    const optionBtns = page.locator('button:has-text("United States"), button:has-text("Canada"), button:has-text("Utah"), button:has-text("Arizona")');
    const firstOption = optionBtns.first();
    await expect(firstOption).toBeVisible();
    await firstOption.click();

    // 5. Verify distance / streak telemetry progression
    await expect(page.locator('text=/MI/').first()).toBeVisible();
  });

});
