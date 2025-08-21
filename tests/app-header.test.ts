import { test, expect } from '@playwright/test'

test('should display the app header', async ({ page }) => {
  await page.goto('/')
  const brand = page
    .getByRole('navigation', { name: 'Main navigation' })
    .getByRole('link', { name: 'Pin-a-Tree Pin-a-Tree' })
  await expect(brand).toBeVisible()
})

test('app logo link is clickable', async ({ page }) => {
  await page.goto('/')
  const appHeaderBrand = page.getByRole('link', { name: 'Pin-a-Tree Pin-a-Tree' })
  await expect(appHeaderBrand).toBeVisible()
  await appHeaderBrand.click()
  await expect(page).toHaveURL('/')
})
