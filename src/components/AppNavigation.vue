<script setup>
/**
 * AppNavigation Component
 *
 * Main navigation bar for the Pin-a-Tree application.
 * Provides links to main sections and the upload feature.
 *
 * Features:
 * - Responsive layout
 * - Logo placement
 * - Navigation links
 * - Upload button
 * - Accessibility support
 */

// Vue imports
import { ref } from 'vue';
import { RouterLink, useRoute } from 'vue-router';

// Icon imports
import { Upload, Map } from 'lucide-vue-next';
import { logo } from '@/assets';

// Component state
const route = useRoute();
const isMenuOpen = ref(false);

// Event handlers
const isActive = (path) => {
  return route.path === path;
};
</script>

<template>
  <nav class="app-navigation">
    <div class="app-navigation__container container">
      <RouterLink to="/" class="app-navigation__logo">
        <img :src="logo" alt="Pin-a-Tree" class="app-navigation__logo-icon" />
        <span class="app-navigation__logo-text">Pin-a-Tree</span>
      </RouterLink>

      <div class="app-navigation__links" :class="{ 'is-open': isMenuOpen }">
        <RouterLink 
          to="/map" 
          class="app-navigation__link"
          :class="{ 'is-active': isActive('/map') }"
        >
          <Map class="app-navigation__link-icon" />
          <span>Map</span>
        </RouterLink>

        <RouterLink 
          to="/upload" 
          class="app-navigation__link app-navigation__link--upload"
          :class="{ 'is-active': isActive('/upload') }"
        >
          <Upload class="app-navigation__link-icon" />
          <span>Upload Tree</span>
        </RouterLink>
      </div>
    </div>
  </nav>
</template>

<style scoped lang="scss">
.app-navigation {
  background-color: $dark-background;
  border-bottom: 1px solid rgba($white, 0.1);
  padding: $spacing-2 0;
  position: sticky;
  top: 0;
  z-index: $z-index-nav;

  &__container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__logo {
    display: flex;
    align-items: center;
    gap: $spacing-2;
    text-decoration: none;
    color: $white;
    transition: opacity 0.2s ease;

    &:hover {
      opacity: 0.9;
    }
  }

  &__logo-icon {
    height: 3.2rem;
    width: auto;
  }

  &__logo-text {
    font-size: 2rem;
    font-weight: 600;
  }

  &__links {
    display: flex;
    gap: $spacing-2;
  }

  &__link {
    display: flex;
    align-items: center;
    gap: $spacing-1;
    padding: $spacing-1 $spacing-2;
    color: $white;
    text-decoration: none;
    border-radius: $border-radius-md;
    transition: all 0.2s ease;
    font-size: 1.6rem;

    &:hover {
      background-color: rgba($white, 0.05);
    }

    &.is-active {
      color: $primary-green;
      background-color: rgba($primary-green, 0.1);
    }

    &--upload {
      background-color: $primary-green;
      color: $white;

      &:hover {
        background-color: $secondary-green;
      }

      &.is-active {
        background-color: $secondary-green;
        color: $white;
      }
    }
  }

  &__link-icon {
    width: 2rem;
    height: 2rem;
  }

  @include width-less-than('medium') {
    &__links {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: $dark-background;
      padding: $spacing-2;
      border-top: 1px solid rgba($white, 0.1);
      justify-content: center;
    }

    &__logo-text {
      display: none;
    }
  }
}
</style> 