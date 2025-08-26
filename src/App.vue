<script setup>
/**
 * App Component
 *
 * The root Vue application component for Pin-a-Tree.
 * Provides the main application layout and router-view container.
 *
 * Features:
 * - Main application container
 * - Router view integration
 * - Global styling application
 */

// Vue imports
import { RouterView } from 'vue-router'
</script>

<template>
  <div id="app" class="app">
    <RouterView />
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
</style>
