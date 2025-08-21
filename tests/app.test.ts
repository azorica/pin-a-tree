import { test, expect } from '@playwright/test'

test('app has Skip to main content link that is clickable', async ({ page }) => {
  await page.goto('/')
  const skipToMainContentLink = page.getByRole('link', { name: 'Skip to main content' })
  await skipToMainContentLink.focus()
  await page.keyboard.press('Enter')
})
