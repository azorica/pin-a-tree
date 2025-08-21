import { test, expect } from '@playwright/test'

test('displays login form with all required elements', async ({ page }) => {
  await page.goto('/login')

  // Check page title and subtitle
  await expect(page.getByRole('heading', { name: 'Welcome Back' })).toBeVisible()
  await expect(page.getByText('Sign in to your Pin-a-Tree account')).toBeVisible()

  // Check form fields
  await expect(page.locator('#email')).toBeVisible()
  await expect(page.locator('#password')).toBeVisible()
  await expect(page.locator('#password-toggle')).toBeVisible()

  // Check demo credentials hint
  await expect(page.getByText('Demo Account:')).toBeVisible()
  await expect(page.getByText('Email: alice@example.com')).toBeVisible()
  await expect(page.getByText('Password: demo123')).toBeVisible()
})
