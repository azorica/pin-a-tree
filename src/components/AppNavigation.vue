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
import { RouterLink } from 'vue-router';

// Icon imports
import { TreePine, Upload, Map } from 'lucide-vue-next';

// Component state
const isMenuOpen = ref(false);

// Event handlers
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};
</script>

<template>
  <nav class="app-navigation">
    <div class="app-navigation__container container">
      <RouterLink to="/" class="app-navigation__logo">
        <TreePine class="app-navigation__logo-icon" />
        <span class="app-navigation__logo-text">Pin-a-Tree</span>
      </RouterLink>

      <div class="app-navigation__links" :class="{ 'is-open': isMenuOpen }">
        <RouterLink to="/" class="app-navigation__link">
          <Map class="app-navigation__link-icon" />
          <span>Map</span>
        </RouterLink>

        <RouterLink to="/upload" class="app-navigation__link app-navigation__link--upload">
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

  &__container {
    @include flex-between;
  }

  &__logo {
    @include flex-center;
    color: $white;
    gap: $spacing-1;
    text-decoration: none;

    &-icon {
      color: $primary-green;
      width: 2.4rem;
      height: 2.4rem;
    }

    &-text {
      font-size: $font-size-h3;
      font-weight: bold;
    }
  }

  &__links {
    @include flex-center;
    gap: $spacing-2;

    @include width-less-than('medium') {
      position: fixed;
      top: 6rem;
      left: 0;
      right: 0;
      background-color: $dark-background;
      padding: $spacing-2;
      flex-direction: column;
      transform: translateY(-100%);
      transition: transform 0.3s ease;

      &.is-open {
        transform: translateY(0);
      }
    }
  }

  &__link {
    @include flex-center;
    gap: $spacing-1;
    color: $white;
    text-decoration: none;
    padding: $spacing-1 $spacing-2;
    border-radius: $border-radius-md;
    transition: background-color 0.2s ease;

    &-icon {
      width: 2rem;
      height: 2rem;
    }

    &:hover {
      background-color: rgba($white, 0.1);
    }

    &--upload {
      background-color: $primary-green;

      &:hover {
        background-color: $secondary-green;
      }
    }
  }
}
</style> 