<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <h1 class="auth-title">Welcome Back!</h1>
        <p class="auth-subtitle">Sign in to your Pin-a-Tree account</p>
      </div>

      <form @submit.prevent="handleLogin" class="auth-form">
        <div class="form-group">
          <label for="email" class="form-label">Email</label>
          <input
            id="email"
            v-model="formData.email"
            type="email"
            required
            class="form-input"
            :class="{ 'form-input--error': errors.email }"
            placeholder="your@email.com"
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
            placeholder="Enter your password"
          />
          <span v-if="errors.password" class="form-error">{{ errors.password }}</span>
        </div>

        <button
          type="submit"
          class="btn btn--primary btn--full"
          :disabled="loading"
        >
          {{ loading ? 'Signing In...' : 'Sign In' }}
        </button>

        <div v-if="errors.general" class="auth-error">
          {{ errors.general }}
        </div>
      </form>

      <div class="auth-footer">
        <p>
          Don't have an account?
          <router-link to="/register" class="auth-link">Sign up here</router-link>
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
  name: 'LoginView',
  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    
    const loading = ref(false)
    const formData = reactive({
      email: '',
      password: ''
    })
    
    const errors = reactive({
      email: '',
      password: '',
      general: ''
    })

    const clearErrors = () => {
      errors.email = ''
      errors.password = ''
      errors.general = ''
    }

    const validateForm = () => {
      clearErrors()
      let isValid = true

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

      return isValid
    }

    const handleLogin = async () => {
      if (!validateForm()) return

      loading.value = true
      clearErrors()

      try {
        await userStore.login(formData.email, formData.password)
        
        // Redirect to home or intended page
        router.push('/')
        
      } catch (error) {
        errors.general = error.message || 'Login failed. Please check your credentials.'
      } finally {
        loading.value = false
      }
    }

    return {
      formData,
      errors,
      loading,
      handleLogin
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
  max-width: 400px;
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
