import { test, expect } from '@playwright/test';

test.describe('Xentri Shell', () => {
  test('loads successfully', async ({ page }) => {
    await page.goto('/');

    // Shell should load and display Xentri
    await expect(page.locator('h1')).toContainText('Xentri');
  });

  test('has correct title', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/Xentri/);
  });
});
