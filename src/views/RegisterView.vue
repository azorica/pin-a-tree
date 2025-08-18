<script setup>
/**
 * RegisterView Component
 *
 * User registration form with name, email, and password fields.
 * Includes form validation, password confirmation, and error handling.
 *
 * Features:
 * - Registration form with validation
 * - Password confirmation
 * - Password strength indicator
 * - Loading states
 * - Error handling
 * - Redirect after registration
 */

import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { UserPlus, Eye, EyeOff, AlertCircle, Check } from 'lucide-vue-next'

import BaseButton from '@/components/BaseButton.vue'
import BaseCard from '@/components/BaseCard.vue'

// ============================================================================
// COMPOSABLES
// ============================================================================

const router = useRouter()
const userStore = useUserStore()

// ============================================================================
// REACTIVE STATE
// ============================================================================

const formData = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const errors = ref({})
const isSubmitting = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

// ============================================================================
// COMPUTED PROPERTIES
// ============================================================================

const passwordStrength = computed(() => {
  const password = formData.value.password
  if (!password) return { score: 0, text: '', color: '' }

  let score = 0
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  }

  score = Object.values(checks).filter(Boolean).length

  if (score <= 2) return { score, text: 'Weak', color: 'error' }
  if (score <= 3) return { score, text: 'Fair', color: 'warning' }
  if (score <= 4) return { score, text: 'Good', color: 'success' }
  return { score, text: 'Strong', color: 'success' }
})

const passwordRequirements = computed(() => [
  { text: 'At least 8 characters', met: formData.value.password.length >= 8 },
  { text: 'One lowercase letter', met: /[a-z]/.test(formData.value.password) },
  { text: 'One uppercase letter', met: /[A-Z]/.test(formData.value.password) },
  { text: 'One number', met: /\d/.test(formData.value.password) },
  { text: 'One special character', met: /[!@#$%^&*(),.?":{}|<>]/.test(formData.value.password) },
])

const isFormValid = computed(() => {
  return (
    formData.value.name.trim() &&
    isValidEmail(formData.value.email) &&
    formData.value.password.length >= 8 &&
    formData.value.password === formData.value.confirmPassword
  )
})

// ============================================================================
// METHODS
// ============================================================================

const validateForm = () => {
  const newErrors = {}

  // Name validation
  if (!formData.value.name.trim()) {
    newErrors.name = 'Name is required'
  } else if (formData.value.name.trim().length < 2) {
    newErrors.name = 'Name must be at least 2 characters'
  }

  // Email validation
  if (!formData.value.email.trim()) {
    newErrors.email = 'Email is required'
  } else if (!isValidEmail(formData.value.email)) {
    newErrors.email = 'Please enter a valid email address'
  }

  // Password validation
  if (!formData.value.password) {
    newErrors.password = 'Password is required'
  } else if (formData.value.password.length < 8) {
    newErrors.password = 'Password must be at least 8 characters'
  }

  // Confirm password validation
  if (!formData.value.confirmPassword) {
    newErrors.confirmPassword = 'Please confirm your password'
  } else if (formData.value.password !== formData.value.confirmPassword) {
    newErrors.confirmPassword = 'Passwords do not match'
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
    await userStore.register({
      name: formData.value.name.trim(),
      email: formData.value.email.trim(),
      password: formData.value.password,
    })

    // Redirect to home page after successful registration
    router.push('/')
  } catch (error) {
    errors.value.submit = error.message || 'Registration failed. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const toggleConfirmPasswordVisibility = () => {
  showConfirmPassword.value = !showConfirmPassword.value
}

const goToLogin = () => {
  router.push('/login')
}

// ============================================================================
// LIFECYCLE
// ============================================================================

onMounted(() => {
  // Clear any existing errors when component mounts
  userStore.clearAuthError()
})
</script>

<template>
  <div class="register-view">
    <div class="container">
      <div class="register-view__content">
        <!-- Header -->
        <header class="register-view__header">
          <h1 class="register-view__title">Join Pin-a-Tree</h1>
          <p class="register-view__subtitle">
            Create your account and start building our digital forest
          </p>
        </header>

        <!-- Registration form -->
        <BaseCard class="register-view__form-card" variant="elevated">
          <form @submit.prevent="handleSubmit" class="register-view__form">
            <!-- Name field -->
            <div class="register-view__field">
              <label for="name" class="register-view__label"> Full Name </label>
              <input
                id="name"
                v-model="formData.name"
                type="text"
                class="register-view__input"
                :class="{ 'register-view__input--error': errors.name }"
                placeholder="Enter your full name"
                autocomplete="name"
                :disabled="isSubmitting"
              />
              <span v-if="errors.name" class="register-view__error">
                <AlertCircle :size="16" />
                {{ errors.name }}
              </span>
            </div>

            <!-- Email field -->
            <div class="register-view__field">
              <label for="email" class="register-view__label"> Email Address </label>
              <input
                id="email"
                v-model="formData.email"
                type="email"
                class="register-view__input"
                :class="{ 'register-view__input--error': errors.email }"
                placeholder="Enter your email"
                autocomplete="email"
                :disabled="isSubmitting"
              />
              <span v-if="errors.email" class="register-view__error">
                <AlertCircle :size="16" />
                {{ errors.email }}
              </span>
            </div>

            <!-- Password field -->
            <div class="register-view__field">
              <label for="password" class="register-view__label"> Password </label>
              <div class="register-view__password-field">
                <input
                  id="password"
                  v-model="formData.password"
                  :type="showPassword ? 'text' : 'password'"
                  class="register-view__input"
                  :class="{ 'register-view__input--error': errors.password }"
                  placeholder="Create a password"
                  autocomplete="new-password"
                  :disabled="isSubmitting"
                />
                <button
                  type="button"
                  class="register-view__password-toggle"
                  @click="togglePasswordVisibility"
                  :aria-label="showPassword ? 'Hide password' : 'Show password'"
                >
                  <Eye v-if="!showPassword" :size="20" />
                  <EyeOff v-else :size="20" />
                </button>
              </div>
              <span v-if="errors.password" class="register-view__error">
                <AlertCircle :size="16" />
                {{ errors.password }}
              </span>

              <!-- Password strength indicator -->
              <div v-if="formData.password" class="register-view__password-strength">
                <div class="register-view__strength-bar">
                  <div
                    class="register-view__strength-fill"
                    :class="`register-view__strength-fill--${passwordStrength.color}`"
                    :style="{ width: `${(passwordStrength.score / 5) * 100}%` }"
                  ></div>
                </div>
                <span
                  class="register-view__strength-text"
                  :class="`register-view__strength-text--${passwordStrength.color}`"
                >
                  {{ passwordStrength.text }}
                </span>
              </div>

              <!-- Password requirements -->
              <div v-if="formData.password" class="register-view__password-requirements">
                <div
                  v-for="requirement in passwordRequirements"
                  :key="requirement.text"
                  class="register-view__requirement"
                  :class="{ 'register-view__requirement--met': requirement.met }"
                >
                  <Check v-if="requirement.met" :size="14" />
                  <span>{{ requirement.text }}</span>
                </div>
              </div>
            </div>

            <!-- Confirm password field -->
            <div class="register-view__field">
              <label for="confirm-password" class="register-view__label"> Confirm Password </label>
              <div class="register-view__password-field">
                <input
                  id="confirm-password"
                  v-model="formData.confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  class="register-view__input"
                  :class="{ 'register-view__input--error': errors.confirmPassword }"
                  placeholder="Confirm your password"
                  autocomplete="new-password"
                  :disabled="isSubmitting"
                />
                <button
                  type="button"
                  class="register-view__password-toggle"
                  @click="toggleConfirmPasswordVisibility"
                  :aria-label="showConfirmPassword ? 'Hide password' : 'Show password'"
                >
                  <Eye v-if="!showConfirmPassword" :size="20" />
                  <EyeOff v-else :size="20" />
                </button>
              </div>
              <span v-if="errors.confirmPassword" class="register-view__error">
                <AlertCircle :size="16" />
                {{ errors.confirmPassword }}
              </span>
            </div>

            <!-- Submit error -->
            <div v-if="errors.submit" class="register-view__submit-error">
              <AlertCircle :size="20" />
              <span>{{ errors.submit }}</span>
            </div>

            <!-- Submit button -->
            <BaseButton
              type="submit"
              variant="primary"
              size="large"
              :loading="isSubmitting"
              :disabled="!isFormValid || isSubmitting"
              class="register-view__submit-button"
            >
              <template #icon-left>
                <UserPlus :size="20" />
              </template>
              Create Account
            </BaseButton>
          </form>
        </BaseCard>

        <!-- Login link -->
        <div class="register-view__login-section">
          <p class="register-view__login-text">Already have an account?</p>
          <BaseButton variant="secondary" @click="goToLogin"> Sign In </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as variables;
@use '@/styles/colors' as colors;
@use '@/styles/mixins' as mixins;

.register-view {
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
    max-width: 50rem;
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
    gap: variables.$spacing-3;
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
  // PASSWORD STRENGTH
  // -------------------------------------------------------------------------

  &__password-strength {
    display: flex;
    align-items: center;
    gap: variables.$spacing-1;
    margin-top: variables.$spacing-0_5;
  }

  &__strength-bar {
    flex: 1;
    height: 0.4rem;
    background: colors.$border-light;
    border-radius: variables.$border-radius-small;
    overflow: hidden;
  }

  &__strength-fill {
    height: 100%;
    transition: width variables.$transition-normal;

    &--error {
      background: colors.$error;
    }

    &--warning {
      background: colors.$warning;
    }

    &--success {
      background: colors.$success;
    }
  }

  &__strength-text {
    font-size: variables.$font-size-small;
    font-weight: variables.$font-weight-medium;

    &--error {
      color: colors.$error;
    }

    &--warning {
      color: colors.$warning;
    }

    &--success {
      color: colors.$success;
    }
  }

  // -------------------------------------------------------------------------
  // PASSWORD REQUIREMENTS
  // -------------------------------------------------------------------------

  &__password-requirements {
    margin-top: variables.$spacing-1;
    padding: variables.$spacing-2;
    background: rgba(colors.$bg-secondary, 0.5);
    border-radius: variables.$border-radius-small;
  }

  &__requirement {
    display: flex;
    align-items: center;
    gap: variables.$spacing-0_5;
    font-size: variables.$font-size-small;
    color: colors.$text-muted;
    margin-bottom: variables.$spacing-0_5;

    &:last-child {
      margin-bottom: 0;
    }

    svg {
      color: colors.$success;
      flex-shrink: 0;
    }

    &--met {
      color: colors.$success;
    }
  }

  // -------------------------------------------------------------------------
  // SUBMIT BUTTON
  // -------------------------------------------------------------------------

  &__submit-button {
    width: 100%;
    margin-top: variables.$spacing-3;
  }

  // -------------------------------------------------------------------------
  // LOGIN SECTION
  // -------------------------------------------------------------------------

  &__login-section {
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: variables.$spacing-2;
    padding: variables.$spacing-4;
    border-radius: variables.$border-radius-large;
    background: rgba(colors.$bg-card, 0.8);
    border: 1px solid colors.$border-light;
  }

  &__login-text {
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
    &__password-toggle,
    &__strength-fill {
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
    &__password-requirements {
      border-width: 2px;
    }
  }
}
</style>
