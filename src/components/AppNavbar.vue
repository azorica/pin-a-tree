<template>
  <nav class="navbar">
    <div class="navbar__container">
      <!-- Logo/Brand -->
      <router-link to="/" class="navbar__brand">
        🌳 Pin-a-Tree
      </router-link>

      <!-- Navigation Links -->
      <div class="navbar__nav">
        <router-link to="/" class="navbar__link">Home</router-link>
        <router-link to="/map" class="navbar__link">Map</router-link>
        
        <!-- Authenticated User Menu -->
        <template v-if="userStore.isAuthenticated">
          <router-link to="/add-tree" class="navbar__link">Add Tree</router-link>
          <div class="navbar__user">
            <span class="navbar__user-name">{{ userStore.userDisplayName }}</span>
            <button @click="handleLogout" class="navbar__logout">Logout</button>
          </div>
        </template>

        <!-- Guest Menu -->
        <template v-else>
          <router-link to="/login" class="navbar__link">Sign In</router-link>
          <router-link to="/register" class="navbar__link navbar__link--primary">Sign Up</router-link>
        </template>
      </div>
    </div>
  </nav>
</template>

<script>
import { useUserStore } from '@/stores/userStore'
import { useRouter } from 'vue-router'

export default {
  name: 'AppNavbar',
  setup() {
    const userStore = useUserStore()
    const router = useRouter()

    const handleLogout = () => {
      userStore.logout()
      router.push('/')
    }

    return {
      userStore,
      handleLogout
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables';

.navbar {
  background: white;
  border-bottom: 1px solid $color-border;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navbar__container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.navbar__brand {
  font-size: 1.25rem;
  font-weight: 700;
  color: $color-primary;
  text-decoration: none;
  
  &:hover {
    color: $color-primary-dark;
  }
}

.navbar__nav {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.navbar__link {
  color: $color-text-secondary;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease;

  &:hover {
    color: $color-primary;
    background: $color-background-light;
  }

  &.router-link-active {
    color: $color-primary;
    background: $color-primary-light;
  }

  &--primary {
    background: $color-primary;
    color: white;

    &:hover {
      background: $color-primary-dark;
      color: white;
    }
  }
}

.navbar__user {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.navbar__user-name {
  font-weight: 600;
  color: $color-text-primary;
}

.navbar__logout {
  background: none;
  border: 1px solid $color-border;
  color: $color-text-secondary;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: $color-error;
    color: white;
    border-color: $color-error;
  }
}

@media (max-width: 768px) {
  .navbar__nav {
    gap: 1rem;
  }

  .navbar__link {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
  }

  .navbar__user-name {
    display: none;
  }
}
</style>
