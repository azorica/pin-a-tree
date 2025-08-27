<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <h1 class="auth-title">Join Pin-a-Tree!</h1>
        <p class="auth-subtitle">Create your account and start planting trees</p>
      </div>

      <form @submit.prevent="handleRegister" class="auth-form">
        <div class="form-row">
          <div class="form-group">
            <label for="firstName" class="form-label">First Name</label>
            <input
              id="firstName"
              v-model="formData.firstName"
              type="text"
              required
              class="form-input"
              :class="{ 'form-input--error': errors.firstName }"
              placeholder="John"
            />
            <span v-if="errors.firstName" class="form-error">{{ errors.firstName }}</span>
          </div>

          <div class="form-group">
            <label for="lastName" class="form-label">Last Name</label>
            <input
              id="lastName"
              v-model="formData.lastName"
              type="text"
              required
              class="form-input"
              :class="{ 'form-input--error': errors.lastName }"
              placeholder="Doe"
            />
            <span v-if="errors.lastName" class="form-error">{{ errors.lastName }}</span>
          </div>
        </div>

        <div class="form-group">
          <label for="username" class="form-label">Username</label>
          <input
            id="username"
            v-model="formData.username"
            type="text"
            required
            class="form-input"
            :class="{ 'form-input--error': errors.username }"
            placeholder="johndoe"
          />
          <span v-if="errors.username" class="form-error">{{ errors.username }}</span>
        </div>

        <div class="form-group">
          <label for="email" class="form-label">Email</label>
          <input
            id="email"
            v-model="formData.email"
            type="email"
            required
            class="form-input"
            :class="{ 'form-input--error': errors.email }"
            placeholder="john@example.com"
          />
          <span v-if="errors.email" class="form-error">{{ errors.email }}</span>
        </div>

        <div class="form-group">
          <label for="password" class="form-label">Password</label>
          <input
            id="password"
            v-model="formData.password"
            type="password"
            required
            class="form-input"
            :class="{ 'form-input--error': errors.password }"
            placeholder="Minimum 6 characters"
          />
          <span v-if="errors.password" class="form-error">{{ errors.password }}</span>
        </div>

        <div class="form-group">
          <label for="confirmPassword" class="form-label">Confirm Password</label>
          <input
            id="confirmPassword"
            v-model="formData.confirmPassword"
            type="password"
            required
            class="form-input"
            :class="{ 'form-input--error': errors.confirmPassword }"
            placeholder="Repeat your password"
          />
          <span v-if="errors.confirmPassword" class="form-error">{{ errors.confirmPassword }}</span>
        </div>

        <button
          type="submit"
          class="btn btn--primary btn--full"
          :disabled="loading"
        >
          {{ loading ? 'Creating Account...' : 'Create Account' }}
        </button>

        <div v-if="errors.general" class="auth-error">
          {{ errors.general }}
        </div>
      </form>

      <div class="auth-footer">
        <p>
          Already have an account?
          <router-link to="/login" class="auth-link">Sign in here</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

export default {
  name: 'RegisterView',
  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    
    const loading = ref(false)
    const formData = reactive({
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    })
    
    const errors = reactive({
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      general: ''
    })

    const clearErrors = () => {
      Object.keys(errors).forEach(key => {
        errors[key] = ''
      })
    }

    const validateForm = () => {
      clearErrors()
      let isValid = true

      if (!formData.firstName.trim()) {
        errors.firstName = 'First name is required'
        isValid = false
      }

      if (!formData.lastName.trim()) {
        errors.lastName = 'Last name is required'
        isValid = false
      }

      if (!formData.username.trim()) {
        errors.username = 'Username is required'
        isValid = false
      } else if (formData.username.length < 3) {
        errors.username = 'Username must be at least 3 characters'
        isValid = false
      }

      if (!formData.email) {
        errors.email = 'Email is required'
        isValid = false
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = 'Please enter a valid email'
        isValid = false
      }

      if (!formData.password) {
        errors.password = 'Password is required'
        isValid = false
      } else if (formData.password.length < 6) {
        errors.password = 'Password must be at least 6 characters'
        isValid = false
      }

      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match'
        isValid = false
      }

      return isValid
    }

    const handleRegister = async () => {
      if (!validateForm()) return

      loading.value = true
      clearErrors()

      try {
        await userStore.register({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          username: formData.username.trim(),
          email: formData.email.trim(),
          password: formData.password
        })
        
        // Redirect to home after successful registration
        router.push('/')
        
      } catch (error) {
        errors.general = error.message || 'Registration failed. Please try again.'
      } finally {
        loading.value = false
      }
    }

    return {
      formData,
      errors,
      loading,
      handleRegister
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables';

.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, $color-primary-light 0%, $color-primary 100%);
  padding: 1rem;
}

.auth-card {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  padding: 2.5rem;
  width: 100%;
  max-width: 500px;
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-title {
  font-size: 2rem;
  font-weight: 700;
  color: $color-text-primary;
  margin-bottom: 0.5rem;
}

.auth-subtitle {
  color: $color-text-secondary;
  font-size: 1rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-weight: 600;
  color: $color-text-primary;
  font-size: 0.9rem;
}

.form-input {
  padding: 0.75rem 1rem;
  border: 2px solid $color-border;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: $color-primary;
  }

  &--error {
    border-color: $color-error;
  }
}

.form-error {
  color: $color-error;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &--primary {
    background: $color-primary;
    color: white;

    &:hover:not(:disabled) {
      background: $color-primary-dark;
      transform: translateY(-1px);
    }
  }

  &--full {
    width: 100%;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.auth-error {
  background: lighten($color-error, 45%);
  color: $color-error;
  padding: 0.75rem;
  border-radius: 0.5rem;
  text-align: center;
  font-size: 0.9rem;
}

.auth-footer {
  text-align: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid $color-border;
}

.auth-link {
  color: $color-primary;
  text-decoration: none;
  font-weight: 600;

  &:hover {
    text-decoration: underline;
  }
}

@media (max-width: 480px) {
  .auth-card {
    padding: 2rem;
  }
}
</style>
