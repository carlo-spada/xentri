import { test, expect } from '@playwright/test'

test.describe('Xentri Shell', () => {
  test('loads successfully', async ({ page }) => {
    await page.goto('/')

    // Shell should load and display Xentri
    await expect(page.locator('h1')).toContainText('Xentri')
  })

  test('has correct title', async ({ page }) => {
    await page.goto('/')

    await expect(page).toHaveTitle(/Xentri/)
  })

  test('applies stored theme from localStorage on load', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => {
      localStorage.setItem('xentri-theme', 'light')
    })
    await page.reload()

    const hasLightClass = await page.evaluate(() =>
      document.documentElement.classList.contains('light')
    )
    expect(hasLightClass).toBeTruthy()
  })

  test('shows offline banner when offline', async ({ page, context }) => {
    await page.goto('/')
    await context.setOffline(true)
    await expect(page.getByText("You're offline. Some features may be limited.")).toBeVisible()
    await context.setOffline(false)
  })
})
