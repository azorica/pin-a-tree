<script setup>
/**
 * TreeMap Component
 *
 * A component for displaying multiple trees on a map.
 *
 * Features:
 * - Interactive Google Map
 * - Tree markers with info windows
 * - Clustering for multiple markers
 * - Click to view tree details
 *
 * Props:
 * @prop {Array} trees - Array of tree objects
 */

// Vue imports
import { watch } from 'vue';
import { useRouter } from 'vue-router';

// Composables
import { useLeafletMap } from '@/composables/useLeafletMap';

const props = defineProps({
  trees: {
    type: Array,
    default: () => [],
  }
});

const router = useRouter();

const { mapContainer, map, loading, error, addMarker, clearMarkers } = useLeafletMap({
  zoom: 12,
  onMapLoad: () => {
    // Add markers when map is loaded
    addTreeMarkers();
  }
});

const addTreeMarkers = () => {
  if (!map.value || !props.trees || !props.trees.length) return;

  clearMarkers(); // Clear existing markers

  props.trees.forEach(tree => {
    if (!tree.location || !tree.location.lat || !tree.location.lng) return;

    addMarker(
      [tree.location.lat, tree.location.lng],
      {
        id: tree.id,
        color: '#A5D6A7', // Light green from our color palette
        popup: `
          <div style="padding: 8px;">
            <h3 style="margin: 0 0 8px; font-size: 16px;">${tree.name}</h3>
            <p style="margin: 0; font-size: 14px;">${tree.species}</p>
          </div>
        `,
        onClick: () => router.push(`/tree/${tree.id}`)
      }
    );
  });
};

// Watch for changes in trees prop
watch(() => props.trees, () => {
  addTreeMarkers();
}, { deep: true });
</script>

<template>
  <div class="tree-map">
    <div
      ref="mapContainer"
      class="tree-map__container"
      :class="{ 'is-loading': loading }"
    >
      <div
        v-if="loading"
        class="tree-map__loading"
        role="status"
        aria-label="Loading map..."
      >
        <span class="tree-map__loading-text">Loading map...</span>
      </div>
    </div>

    <p
      v-if="error"
      class="tree-map__error"
      role="alert"
    >
      {{ error }}
    </p>
  </div>
</template>

<style scoped lang="scss">
.tree-map {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: calc(100vh - 6rem); // Subtract nav height

  &__container {
    width: 100%;
    height: 100%;
    min-height: inherit;
    background-color: rgba($dark-background, 0.5);

    &.is-loading {
      pointer-events: none;
    }
  }

  &__loading {
    @include flex-center;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba($dark-background, 0.7);
    color: $white;
    z-index: 1;
  }

  &__loading-text {
    font-size: $font-size-h4;
    font-weight: 500;
  }

  &__error {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: $spacing-2;
    background-color: rgba($error, 0.9);
    color: $white;
    border-radius: $border-radius-md;
    font-size: 1.4rem;
    text-align: center;
  }
}
</style> 