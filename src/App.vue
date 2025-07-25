<script setup>
/**
 * App Component
 *
 * Root component of the Pin-a-Tree application.
 * Provides the main layout structure and navigation.
 *
 * Features:
 * - Responsive layout with navigation
 * - Router view for content
 * - Dark theme by default
 */

// Component imports
import AppNavigation from '@/components/AppNavigation.vue';
</script>

<template>
  <div class="app">
    <AppNavigation />
    <main class="app__main">
      <router-view />
    </main>
  </div>
</template>

<style scoped lang="scss">
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  &__main {
    flex: 1;
    padding: $spacing-2;

    @include width-at-least('medium') {
      padding: $spacing-3;
    }
  }
}
</style> 