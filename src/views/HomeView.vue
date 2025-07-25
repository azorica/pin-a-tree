<script setup>
/**
 * HomeView Component
 *
 * Main view showing the map with pinned trees.
 *
 * Features:
 * - Google Maps integration
 * - Tree markers display
 * - Interactive map navigation
 * - Tree details on marker click
 */

// Vue imports
import { onMounted } from 'vue';
import { useTreeStore } from '@/stores/tree-store';
import TreeMap from '@/components/TreeMap.vue';

const treeStore = useTreeStore();

onMounted(async () => {
  await treeStore.fetchTrees();
});
</script>

<template>
  <div class="home-view">
    <TreeMap :trees="treeStore.trees" />
  </div>
</template>

<style scoped lang="scss">
.home-view {
  height: 100vh;
  width: 100%;
  
  :deep(.tree-map) {
    height: 100%;
    width: 100%;
  }
}
</style> 