<script setup>
/**
 * LoginView Component
 *
 * User login form with email and password fields.
 * Includes form validation, error handling, and redirect functionality.
 *
 * Features:
 * - Email and password form
 * - Form validation
 * - Loading states
 * - Error handling
 * - Redirect after login
 * - Link to registration
 */

import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { LogIn, Eye, EyeOff, AlertCircle } from 'lucide-vue-next'

import BaseButton from '@/components/BaseButton.vue'
import BaseCard from '@/components/BaseCard.vue'

// ============================================================================
// COMPOSABLES
// ============================================================================

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

// ============================================================================
// REACTIVE STATE
// ============================================================================

const formData = ref({
  email: '',
  password: '',
})

const errors = ref({})
const isSubmitting = ref(false)
const showPassword = ref(false)

// ============================================================================
// METHODS
// ============================================================================

const validateForm = () => {
  const newErrors = {}

  // Email validation
  if (!formData.value.email.trim()) {
    newErrors.email = 'Email is required'
  } else if (!isValidEmail(formData.value.email)) {
    newErrors.email = 'Please enter a valid email address'
  }

  // Password validation
  if (!formData.value.password) {
    newErrors.password = 'Password is required'
  }

  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const handleSubmit = async () => {
  if (!validateForm()) return

  isSubmitting.value = true
  errors.value = {}

  try {
    await userStore.login(formData.value.email, formData.value.password)

    // Redirect to the intended page or home
    const redirectTo = route.query.redirect || '/'
    router.push(redirectTo)
  } catch (error) {
    errors.value.submit = error.message || 'Login failed. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const goToRegister = () => {
  router.push('/register')
}

// ============================================================================
// LIFECYCLE
// ============================================================================

onMounted(() => {
  // Clear any existing errors when component mounts
  userStore.clearErrors()
})
</script>

<template>
  <div class="login-view">
    <div class="container">
      <div class="login-view__content">
        <!-- Header -->
        <header class="login-view__header">
          <h1 class="login-view__title">Welcome Back</h1>
          <p class="login-view__subtitle">Sign in to your Pin-a-Tree account</p>
        </header>

        <!-- Login form -->
        <BaseCard class="login-view__form-card" variant="elevated">
          <form @submit.prevent="handleSubmit" class="login-view__form">
            <!-- Email field -->
            <div class="login-view__field">
              <label for="email" class="login-view__label">Email Address</label>
              <input
                id="email"
                v-model="formData.email"
                type="email"
                class="login-view__input"
                :class="{ 'login-view__input--error': errors.email }"
                placeholder="Enter your email"
                autocomplete="email"
                :disabled="isSubmitting"
              />
              <span v-if="errors.email" class="login-view__error">
                <AlertCircle :size="16" />
                {{ errors.email }}
              </span>
            </div>

            <!-- Password field -->
            <div class="login-view__field">
              <label for="password" class="login-view__label">Password</label>
              <div class="login-view__password-field">
                <input
                  id="password"
                  v-model="formData.password"
                  :type="showPassword ? 'text' : 'password'"
                  class="login-view__input"
                  :class="{ 'login-view__input--error': errors.password }"
                  placeholder="Enter your password"
                  autocomplete="current-password"
                  :disabled="isSubmitting"
                />
                <button
                  id="password-toggle"
                  type="button"
                  class="login-view__password-toggle"
                  @click="togglePasswordVisibility"
                  :aria-label="showPassword ? 'Hide password' : 'Show password'"
                >
                  <Eye v-if="!showPassword" :size="20" />
                  <EyeOff v-else :size="20" />
                </button>
              </div>
              <span v-if="errors.password" class="login-view__error">
                <AlertCircle :size="16" />
                {{ errors.password }}
              </span>
            </div>

            <!-- Submit error -->
            <div v-if="errors.submit" class="login-view__submit-error">
              <AlertCircle :size="20" />
              <span>{{ errors.submit }}</span>
            </div>

            <!-- Submit button -->
            <BaseButton
              id="sign-in-button"
              type="submit"
              variant="primary"
              size="large"
              :loading="isSubmitting"
              :disabled="isSubmitting"
              class="login-view__submit-button"
            >
              <template #icon-left>
                <LogIn :size="20" />
              </template>
              Sign In
            </BaseButton>

            <!-- Demo credentials hint -->
            <div class="login-view__demo-hint">
              <p><strong>Demo Account:</strong></p>
              <p>Email: alice@example.com</p>
              <p>Password: demo123</p>
            </div>
          </form>
        </BaseCard>

        <!-- Register link -->
        <div class="login-view__register-section">
          <p class="login-view__register-text">Don't have an account yet?</p>
          <BaseButton id="create-account-button" variant="secondary" @click="goToRegister">
            Create Account
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as variables;
@use '@/styles/colors' as colors;
@use '@/styles/mixins' as mixins;

.login-view {
  min-height: calc(100vh - 8rem);
  @include mixins.flex-center;
  padding: variables.$spacing-4 0;
  background: linear-gradient(
    135deg,
    rgba(colors.$primary-green, 0.05) 0%,
    rgba(colors.$secondary-green, 0.02) 100%
  );

  // -------------------------------------------------------------------------
  // CONTENT LAYOUT
  // -------------------------------------------------------------------------

  &__content {
    width: 100%;
    max-width: 45rem;
    display: flex;
    flex-direction: column;
    gap: variables.$spacing-4;
  }

  // -------------------------------------------------------------------------
  // HEADER
  // -------------------------------------------------------------------------

  &__header {
    text-align: center;
  }

  &__title {
    font-size: variables.$font-size-h2;
    margin: 0 0 variables.$spacing-2;
    color: colors.$text-primary;

    @include mixins.width-at-least('medium') {
      font-size: variables.$font-size-h1;
    }
  }

  &__subtitle {
    font-size: variables.$font-size-large;
    color: colors.$text-muted;
    margin: 0;
  }

  // -------------------------------------------------------------------------
  // FORM CARD
  // -------------------------------------------------------------------------

  &__form-card {
    .base-card__content {
      padding: variables.$spacing-6;

      @include mixins.width-less-than('medium') {
        padding: variables.$spacing-4;
      }
    }
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: variables.$spacing-4;
  }

  // -------------------------------------------------------------------------
  // FORM FIELDS
  // -------------------------------------------------------------------------

  &__field {
    display: flex;
    flex-direction: column;
    gap: variables.$spacing-1;
  }

  &__label {
    font-weight: variables.$font-weight-medium;
    color: colors.$text-secondary;
    font-size: variables.$font-size-body;
  }

  &__input {
    padding: variables.$spacing-1_5;
    border: 2px solid colors.$border-light;
    border-radius: variables.$border-radius-medium;
    font-size: variables.$font-size-body;
    background: colors.$bg-card;
    color: colors.$text-secondary;
    transition: border-color variables.$transition-normal;
    width: 100%;

    &:focus {
      outline: none;
      border-color: colors.$primary-green;
    }

    &--error {
      border-color: colors.$error;
    }

    &::placeholder {
      color: colors.$text-muted;
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  &__password-field {
    position: relative;
    display: flex;
    align-items: center;
  }

  &__password-toggle {
    position: absolute;
    right: variables.$spacing-1_5;
    background: none;
    border: none;
    color: colors.$text-muted;
    cursor: pointer;
    @include mixins.flex-center;
    padding: variables.$spacing-0_5;
    border-radius: variables.$border-radius-small;
    transition: color variables.$transition-normal;

    &:hover {
      color: colors.$primary-green;
    }

    &:focus {
      outline: 2px solid colors.$primary-green;
      outline-offset: 2px;
    }
  }

  &__error {
    color: colors.$error;
    font-size: variables.$font-size-small;
    display: flex;
    align-items: center;
    gap: variables.$spacing-0_5;
  }

  &__submit-error {
    display: flex;
    align-items: center;
    gap: variables.$spacing-1;
    color: colors.$error;
    background: rgba(colors.$error, 0.1);
    padding: variables.$spacing-2;
    border-radius: variables.$border-radius-medium;
    border: 1px solid rgba(colors.$error, 0.2);
  }

  // -------------------------------------------------------------------------
  // SUBMIT BUTTON
  // -------------------------------------------------------------------------

  &__submit-button {
    width: 100%;
    margin-top: variables.$spacing-2;
  }

  // -------------------------------------------------------------------------
  // DEMO HINT
  // -------------------------------------------------------------------------

  &__demo-hint {
    background: rgba(colors.$primary-green, 0.1);
    padding: variables.$spacing-3;
    border-radius: variables.$border-radius-medium;
    border: 1px solid rgba(colors.$primary-green, 0.2);
    text-align: center;

    p {
      margin: 0;
      color: colors.$text-secondary;
      font-size: variables.$font-size-small;

      &:first-child {
        font-weight: variables.$font-weight-medium;
        margin-bottom: variables.$spacing-1;
      }

      &:not(:first-child) {
        font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
        color: colors.$primary-green;
      }
    }
  }

  // -------------------------------------------------------------------------
  // REGISTER SECTION
  // -------------------------------------------------------------------------

  &__register-section {
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: variables.$spacing-2;
    padding: variables.$spacing-4;
    border-radius: variables.$border-radius-large;
    background: rgba(colors.$bg-card, 0.8);
    border: 1px solid colors.$border-light;
  }

  &__register-text {
    color: colors.$text-muted;
    margin: 0;
    font-size: variables.$font-size-body;
  }

  // -------------------------------------------------------------------------
  // RESPONSIVE ADJUSTMENTS
  // -------------------------------------------------------------------------

  @include mixins.width-less-than('medium') {
    padding: variables.$spacing-3 0;

    &__content {
      max-width: none;
      margin: 0 variables.$spacing-2;
    }

    &__title {
      font-size: variables.$font-size-h3;
    }

    &__subtitle {
      font-size: variables.$font-size-body;
    }
  }

  // -------------------------------------------------------------------------
  // ACCESSIBILITY
  // -------------------------------------------------------------------------

  @media (prefers-reduced-motion: reduce) {
    &__input,
    &__password-toggle {
      transition: none;
    }
  }

  // High contrast mode support
  @media (prefers-contrast: high) {
    &__form-card {
      border: 3px solid colors.$border-dark;
    }

    &__input {
      border-width: 3px;

      &:focus {
        border-color: colors.$primary-green;
        box-shadow: 0 0 0 2px rgba(colors.$primary-green, 0.3);
      }
    }

    &__submit-error,
    &__demo-hint {
      border-width: 2px;
    }
  }
}
</style>
