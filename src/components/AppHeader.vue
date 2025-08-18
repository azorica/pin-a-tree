<script setup>
/**
 * AppHeader Component
 *
 * Main navigation header for the Pin-a-Tree application.
 * Provides primary navigation links and user authentication controls.
 *
 * Features:
 * - Responsive navigation menu
 * - User authentication status
 * - Mobile menu toggle
 * - Logo and branding
 * - Accessible navigation patterns
 */

import { ref, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { Menu, X, User, LogOut, MapPin, Plus } from 'lucide-vue-next'

import BaseButton from '@/components/BaseButton.vue'

// ============================================================================
// REACTIVE STATE
// ============================================================================

const isMobileMenuOpen = ref(false)

// ============================================================================
// COMPOSABLES
// ============================================================================

const router = useRouter()
const userStore = useUserStore()

// ============================================================================
// COMPUTED PROPERTIES
// ============================================================================

const navigationItems = computed(() => [
  {
    name: 'Map',
    path: '/map',
    icon: MapPin,
    description: 'Explore the tree map',
  },
  {
    name: 'Add Tree',
    path: '/add-tree',
    icon: Plus,
    description: 'Share your tree',
    requiresAuth: true,
  },
  {
    name: 'About',
    path: '/about',
    description: 'Learn about Pin-a-Tree',
  },
])

const visibleNavItems = computed(() => {
  return navigationItems.value.filter((item) => {
    if (item.requiresAuth) {
      return userStore.isLoggedIn
    }
    return true
  })
})

// ============================================================================
// EVENT HANDLERS
// ============================================================================

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const handleLogout = async () => {
  try {
    await userStore.logout()
    router.push('/')
    closeMobileMenu()
  } catch (error) {
    console.error('Logout failed:', error)
  }
}

const navigateToProfile = () => {
  router.push('/profile')
  closeMobileMenu()
}
</script>

<template>
  <header class="app-header">
    <nav class="app-header__nav container" role="navigation" aria-label="Main navigation">
      <!-- Logo and brand -->
      <RouterLink to="/" class="app-header__brand" @click="closeMobileMenu">
        <img src="@/assets/branding/logo/logo-icon.png" alt="Pin-a-Tree" class="app-header__logo" />
        <span class="app-header__brand-text">Pin-a-Tree</span>
      </RouterLink>

      <!-- Desktop navigation -->
      <ul class="app-header__nav-list app-header__nav-list--desktop">
        <li v-for="item in visibleNavItems" :key="item.path" class="app-header__nav-item">
          <RouterLink :to="item.path" class="app-header__nav-link" :title="item.description">
            <component :is="item.icon" v-if="item.icon" :size="18" class="app-header__nav-icon" />
            <span>{{ item.name }}</span>
          </RouterLink>
        </li>
      </ul>

      <!-- User actions -->
      <div class="app-header__actions">
        <!-- Authenticated user menu -->
        <div v-if="userStore.isLoggedIn" class="app-header__user-menu">
          <!-- Desktop user actions -->
          <div class="app-header__user-actions app-header__user-actions--desktop">
            <BaseButton
              variant="ghost"
              size="small"
              :aria-label="`View profile for ${userStore.user?.name}`"
              @click="navigateToProfile"
            >
              <template #icon-left>
                <User :size="16" />
              </template>
              {{ userStore.userInitials }}
            </BaseButton>

            <BaseButton variant="ghost" size="small" aria-label="Sign out" @click="handleLogout">
              <template #icon-left>
                <LogOut :size="16" />
              </template>
              Sign Out
            </BaseButton>
          </div>
        </div>

        <!-- Guest user actions -->
        <div v-else class="app-header__auth-actions app-header__auth-actions--desktop">
          <BaseButton variant="ghost" size="small" href="/login"> Sign In </BaseButton>

          <BaseButton variant="primary" size="small" href="/register"> Sign Up </BaseButton>
        </div>

        <!-- Mobile menu toggle -->
        <button
          class="app-header__mobile-toggle"
          type="button"
          :aria-expanded="isMobileMenuOpen"
          aria-controls="mobile-menu"
          aria-label="Toggle navigation menu"
          @click="toggleMobileMenu"
        >
          <Menu v-if="!isMobileMenuOpen" :size="24" />
          <X v-else :size="24" />
        </button>
      </div>

      <!-- Mobile navigation menu -->
      <div
        id="mobile-menu"
        class="app-header__mobile-menu"
        :class="{ 'app-header__mobile-menu--open': isMobileMenuOpen }"
      >
        <!-- Mobile navigation links -->
        <ul class="app-header__nav-list app-header__nav-list--mobile">
          <li v-for="item in visibleNavItems" :key="item.path" class="app-header__nav-item">
            <RouterLink :to="item.path" class="app-header__nav-link" @click="closeMobileMenu">
              <component :is="item.icon" v-if="item.icon" :size="20" class="app-header__nav-icon" />
              <span>{{ item.name }}</span>
            </RouterLink>
          </li>
        </ul>

        <!-- Mobile user actions -->
        <div class="app-header__mobile-actions">
          <!-- Authenticated user actions -->
          <div
            v-if="userStore.isLoggedIn"
            class="app-header__user-actions app-header__user-actions--mobile"
          >
            <BaseButton variant="ghost" @click="navigateToProfile">
              <template #icon-left>
                <User :size="18" />
              </template>
              My Profile
            </BaseButton>

            <BaseButton variant="secondary" @click="handleLogout">
              <template #icon-left>
                <LogOut :size="18" />
              </template>
              Sign Out
            </BaseButton>
          </div>

          <!-- Guest user actions -->
          <div v-else class="app-header__auth-actions app-header__auth-actions--mobile">
            <BaseButton variant="ghost" href="/login" @click="closeMobileMenu">
              Sign In
            </BaseButton>

            <BaseButton variant="primary" href="/register" @click="closeMobileMenu">
              Sign Up
            </BaseButton>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as variables;
@use '@/styles/colors' as colors;
@use '@/styles/mixins' as mixins;

.app-header {
  background: colors.$bg-primary;
  border-bottom: 1px solid colors.$border-light;
  position: sticky;
  top: 0;
  z-index: variables.$z-index-sticky;

  &__nav {
    @include mixins.flex-between;
    padding-top: variables.$spacing-2;
    padding-bottom: variables.$spacing-2;
    position: relative;
  }

  // -------------------------------------------------------------------------
  // BRAND & LOGO
  // -------------------------------------------------------------------------

  &__brand {
    display: flex;
    align-items: center;
    gap: variables.$spacing-1;
    text-decoration: none;
    color: colors.$text-primary;
    font-weight: variables.$font-weight-bold;
    font-size: variables.$font-size-large;

    &:hover {
      color: colors.$primary-green;
    }
  }

  &__logo {
    width: 3.2rem;
    height: 3.2rem;
    border-radius: variables.$border-radius-medium;
  }

  &__brand-text {
    @include mixins.width-less-than('small') {
      display: none;
    }
  }

  // -------------------------------------------------------------------------
  // DESKTOP NAVIGATION
  // -------------------------------------------------------------------------

  &__nav-list {
    @include mixins.list-reset;
    display: flex;
    align-items: center;
    gap: variables.$spacing-3;

    &--desktop {
      @include mixins.width-less-than('medium') {
        display: none;
      }
    }

    &--mobile {
      flex-direction: column;
      align-items: stretch;
      gap: variables.$spacing-1;

      @include mixins.width-at-least('medium') {
        display: none;
      }
    }
  }

  &__nav-item {
    position: relative;
  }

  &__nav-link {
    display: flex;
    align-items: center;
    gap: variables.$spacing-1;
    padding: variables.$spacing-1 variables.$spacing-1_5;
    color: colors.$text-primary;
    text-decoration: none;
    border-radius: variables.$border-radius-medium;
    transition: all variables.$transition-normal;
    font-weight: variables.$font-weight-medium;

    &:hover {
      background: rgba(colors.$primary-green, 0.1);
      color: colors.$primary-green;
    }

    &.router-link-active {
      background: colors.$primary-green;
      color: colors.$white;
    }

    // Mobile styles
    .app-header__nav-list--mobile & {
      padding: variables.$spacing-2;
      font-size: variables.$font-size-body;
      justify-content: flex-start;
    }
  }

  &__nav-icon {
    flex-shrink: 0;
  }

  // -------------------------------------------------------------------------
  // USER ACTIONS
  // -------------------------------------------------------------------------

  &__actions {
    display: flex;
    align-items: center;
    gap: variables.$spacing-2;
  }

  &__user-menu {
    display: flex;
    align-items: center;
  }

  &__user-actions {
    display: flex;
    align-items: center;
    gap: variables.$spacing-1;

    &--desktop {
      @include mixins.width-less-than('medium') {
        display: none;
      }
    }

    &--mobile {
      flex-direction: column;
      align-items: stretch;
      gap: variables.$spacing-2;

      @include mixins.width-at-least('medium') {
        display: none;
      }
    }
  }

  &__auth-actions {
    display: flex;
    align-items: center;
    gap: variables.$spacing-1;

    &--desktop {
      @include mixins.width-less-than('medium') {
        display: none;
      }
    }

    &--mobile {
      flex-direction: column;
      align-items: stretch;
      gap: variables.$spacing-2;

      @include mixins.width-at-least('medium') {
        display: none;
      }
    }
  }

  // -------------------------------------------------------------------------
  // MOBILE MENU
  // -------------------------------------------------------------------------

  &__mobile-toggle {
    @include mixins.button-reset;
    @include mixins.flex-center;
    width: 4rem;
    height: 4rem;
    color: colors.$text-primary;
    border-radius: variables.$border-radius-medium;
    transition: all variables.$transition-normal;

    &:hover {
      background: rgba(colors.$primary-green, 0.1);
      color: colors.$primary-green;
    }

    &:focus {
      outline: 2px solid colors.$primary-green;
      outline-offset: 2px;
    }

    @include mixins.width-at-least('medium') {
      display: none;
    }
  }

  &__mobile-menu {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: colors.$bg-primary;
    border-bottom: 1px solid colors.$border-light;
    padding: variables.$spacing-2;
    transform: translateY(-100%);
    opacity: 0;
    visibility: hidden;
    transition: all variables.$transition-normal;

    &--open {
      transform: translateY(0);
      opacity: 1;
      visibility: visible;
    }

    @include mixins.width-at-least('medium') {
      display: none;
    }
  }

  &__mobile-actions {
    margin-top: variables.$spacing-3;
    padding-top: variables.$spacing-3;
    border-top: 1px solid colors.$border-light;
  }
}

// -------------------------------------------------------------------------
// ACCESSIBILITY
// -------------------------------------------------------------------------

// High contrast mode support
@media (prefers-contrast: high) {
  .app-header {
    border-bottom-width: 3px;

    &__nav-link {
      &.router-link-active {
        outline: 2px solid colors.$white;
        outline-offset: -2px;
      }
    }
  }
}

// Reduced motion support
@media (prefers-reduced-motion: reduce) {
  .app-header {
    &__nav-link,
    &__mobile-toggle,
    &__mobile-menu {
      transition: none;
    }
  }
}
</style>
