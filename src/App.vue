<script setup>
/**
 * Main App Component
 *
 * Root component that provides the main layout structure including
 * navigation header, main content area, and footer.
 *
 * Features:
 * - Global navigation
 * - Route-based content rendering
 * - User authentication state
 * - Responsive layout
 */

import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'

// ============================================================================
// COMPOSABLES
// ============================================================================

const userStore = useUserStore()

// ============================================================================
// LIFECYCLE
// ============================================================================

onMounted(async () => {
  // Initialize user store (restore authentication state)
  await userStore.initialize()
})
</script>

<template>
  <div id="app" class="app">
    <!-- Skip link for accessibility -->
    <a href="#main-content" class="skip-link">Skip to main content</a>

    <!-- Header Navigation -->
    <AppHeader />

    <!-- Main Content -->
    <main id="main-content" class="app__main">
      <RouterView />
    </main>

    <!-- Footer -->
    <AppFooter />
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as variables;
@use '@/styles/colors' as colors;

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: colors.$bg-primary;
  color: colors.$text-primary;

  &__main {
    flex: 1;
    width: 100%;
  }
}
</style>
