import { test, expect } from '@playwright/test'

test('displays login form with all required elements', async ({ page }) => {
  await page.goto('/login')

  // Check page title and subtitle
  await expect(page.getByRole('heading', { name: 'Welcome Back' })).toBeVisible()
  await expect(page.getByText('Sign in to your Pin-a-Tree account')).toBeVisible()

  // Check form fields
  await expect(page.locator('#email')).toBeVisible()
  await expect(page.locator('#password')).toBeVisible()
  await expect(page.locator('#sign-in-button')).toBeVisible()

  // Check demo credentials hint
  await expect(page.getByText('Demo Account:')).toBeVisible()
  await expect(page.getByText('Email: alice@example.com')).toBeVisible()
  await expect(page.getByText('Password: demo123')).toBeVisible()
})

test('shows validation errors for empty form submission', async ({ page }) => {
  await page.goto('/login')

  // Try to submit empty form
  await page.locator('#sign-in-button').click()

  // Should show validation errors
  await expect(page.getByText('Email is required')).toBeVisible()
  await expect(page.getByText('Password is required')).toBeVisible()
})

test('shows validation error for invalid email format', async ({ page }) => {
  await page.goto('/login')

  // Fill in invalid email format
  await page.locator('#email').fill('invalid-email')
  await page.locator('#password').fill('password123')

  // Submit the form
  await page.locator('#sign-in-button').click()

  // Wait for any error to appear
  await page.waitForSelector('.login-view__error', { timeout: 5000 })

  // Check that some error is visible
  const errors = await page.locator('.login-view__error').all()
  expect(errors.length).toBeGreaterThan(0)

  // Check that one of the errors contains email-related text
  const hasEmailError = await Promise.any(
    errors.map(async (error) => {
      const text = await error.textContent()
      return text?.toLowerCase().includes('email') || false
    }),
  )

  expect(hasEmailError).toBe(true)
})

test('password visibility toggle works', async ({ page }) => {
  await page.goto('/login')

  const passwordInput = page.locator('#password')
  const toggleButton = page.locator('#password-toggle')

  // Fill in some password text
  await passwordInput.fill('testpassword')

  // Initially password should be hidden
  await expect(passwordInput).toHaveAttribute('type', 'password')

  // Click toggle to show password
  await toggleButton.click()
  await expect(passwordInput).toHaveAttribute('type', 'text')
  await expect(toggleButton).toHaveAttribute('aria-label', 'Hide password')

  // Click toggle to hide password again
  await toggleButton.click()
  await expect(passwordInput).toHaveAttribute('type', 'password')
  await expect(toggleButton).toHaveAttribute('aria-label', 'Show password')
})

test('successful login with demo credentials redirects to home', async ({ page }) => {
  await page.goto('/login')

  // Fill in demo credentials
  await page.locator('#email').fill('alice@example.com')
  await page.locator('#password').fill('demo123')

  // Submit the form
  await page.locator('#sign-in-button').click()

  // Should redirect to home page
  await expect(page).toHaveURL('/')
})

test('failed login shows error message', async ({ page }) => {
  await page.goto('/login')

  // Fill in incorrect credentials
  await page.locator('#email').fill('wrong@email.com')
  await page.locator('#password').fill('wrongpassword')

  // Submit the form
  await page.locator('#sign-in-button').click()

  // Should show error message
  await expect(page.getByText(/Login failed|Invalid credentials/)).toBeVisible()
})

test('form is disabled during submission', async ({ page }) => {
  await page.goto('/login')

  // Fill in valid credentials
  await page.locator('#email').fill('alice@example.com')
  await page.locator('#password').fill('demo123')

  const submitButton = page.locator('#sign-in-button')

  // Submit the form
  await submitButton.click()

  // Form should be disabled during submission
  await expect(page.locator('#email')).toBeDisabled()
  await expect(page.locator('#password')).toBeDisabled()
  await expect(submitButton).toBeDisabled()
})

test('register link navigates to registration page', async ({ page }) => {
  await page.goto('/login')

  // Click the create account button
  await page.locator('#create-account-button').click()

  // Should navigate to registration page
  await expect(page).toHaveURL('/register')
})

test('redirects to intended page after login', async ({ page }) => {
  // Navigate to a protected page first
  await page.goto('/add-tree')

  // Should redirect to login with redirect query
  await expect(page).toHaveURL(/\/login\?redirect=\/add-tree/)

  // Login with demo credentials
  await page.locator('#email').fill('alice@example.com')
  await page.locator('#password').fill('demo123')
  await page.locator('#sign-in-button').click()

  // Should redirect back to intended page
  await expect(page).toHaveURL('/add-tree')
})
