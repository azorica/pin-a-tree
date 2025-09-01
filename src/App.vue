<script setup>
/**
 * App Component
 *
 * The root Vue application component for Pin-a-Tree.
 * Provides the main application layout and router-view container.
 *
 * Features:
 * - Main application container
 * - Navigation bar
 * - Router view integration
 * - Global styling application
 * - Authentication state management
 */

// Vue imports
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'

// Components
import AppNavbar from '@/components/AppNavbar.vue'

// Store
import { useUserStore } from '@/stores/userStore'

// Setup authentication state on app start
const userStore = useUserStore()

onMounted(() => {
  // Restore authentication state if user was previously logged in
  userStore.restoreAuthState()
})
</script>

<template>
  <div id="app" class="app">
    <AppNavbar />
    <main class="app__content">
      <RouterView />
    </main>
  </div>
</template>

<style lang="scss">
@use '@/styles/variables' as *;
@use '@/styles/base' as *;

.app {
  min-height: 100vh;
  background-color: var(--color-background-dark);
  color: var(--color-text-primary);
}

.app__content {
  min-height: calc(100vh - 64px); // Account for navbar height
}
</style>
