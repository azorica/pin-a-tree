<script setup>
/**
 * TreeDetailsView Component
 *
 * Displays detailed information about a specific tree.
 *
 * Features:
 * - Large tree photo
 * - Detailed tree information
 * - Location map
 * - Date information
 * - Loading and error states
 */

// Vue imports
import { computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { TreePine, MapPin, Calendar } from 'lucide-vue-next';

// Store imports
import { useTreeStore } from '@/stores/tree-store';

// Composables
import { useLeafletMap } from '@/composables/useLeafletMap';

const route = useRoute();
const router = useRouter();
const treeStore = useTreeStore();

const { mapContainer, loading: mapLoading, error: mapError, addMarker } = useLeafletMap({
  zoom: 15,
  centerOnMarker: true
});

const tree = computed(() => treeStore.getTreeById(route.params.id));

const formattedDate = computed(() => {
  if (!tree.value?.dateAdded) return '';
  return new Date(tree.value.dateAdded).toLocaleDateString();
});

const locationText = computed(() => {
  if (!tree.value?.location) return 'Location not available';
  if (tree.value.location.address) return tree.value.location.address;
  return `${tree.value.location.lat.toFixed(6)}, ${tree.value.location.lng.toFixed(6)}`;
});

onMounted(async () => {
  await treeStore.fetchTrees();
  
  if (!tree.value) {
    router.push('/'); // Redirect if tree not found
  } else if (tree.value.location && typeof tree.value.location.lat === 'number' && typeof tree.value.location.lng === 'number') {
    // Add marker for the tree
    addMarker([tree.value.location.lat, tree.value.location.lng], {
      color: '#A5D6A7',
      popup: `
        <div style="padding: 8px;">
          <h3 style="margin: 0 0 8px; font-size: 16px;">${tree.value.name}</h3>
          <p style="margin: 0; font-size: 14px;">${tree.value.species}</p>
        </div>
      `
    });
  }
});

// Clean up object URLs when component is unmounted
onUnmounted(() => {
  if (tree.value) {
    treeStore.cleanupPhotoUrl(tree.value);
  }
});
</script>

<template>
  <div v-if="tree" class="tree-details">
    <div class="tree-details__container container">
      <div class="tree-details__photo-section">
        <img :src="tree.photo" :alt="tree.name" class="tree-details__photo" />
      </div>
      
      <div class="tree-details__info">
        <h1 class="tree-details__title">{{ tree.name }}</h1>
        
        <div class="tree-details__meta">
          <div class="tree-details__meta-item">
            <TreePine class="tree-details__meta-icon" aria-hidden="true" />
            <span>{{ tree.species }}</span>
          </div>
          <div class="tree-details__meta-item">
            <MapPin class="tree-details__meta-icon" aria-hidden="true" />
            <span>{{ locationText }}</span>
          </div>
          <div class="tree-details__meta-item">
            <Calendar class="tree-details__meta-icon" aria-hidden="true" />
            <span>{{ formattedDate }}</span>
          </div>
        </div>

        <p v-if="tree.description" class="tree-details__description">
          {{ tree.description }}
        </p>

        <div v-if="tree.location" class="tree-details__map-section">
          <h2>Location</h2>
          <div
            ref="mapContainer"
            class="tree-details__map"
            :class="{ 'is-loading': mapLoading }"
          >
            <div v-if="mapLoading" class="tree-details__map-loading">
              <span>Loading map...</span>
            </div>
          </div>
          <p v-if="mapError" class="tree-details__error" role="alert">
            {{ mapError }}
          </p>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="tree-details__not-found">
    <div class="container">
      <h1>Tree not found</h1>
      <p>The tree you're looking for doesn't exist or has been removed.</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.tree-details {
  padding: $spacing-4 0;

  &__container {
    max-width: 120rem;
    display: grid;
    gap: $spacing-4;
  }

  &__photo-section {
    width: 100%;
    border-radius: $border-radius-lg;
    overflow: hidden;
  }

  &__photo {
    width: 100%;
    height: auto;
    display: block;
  }

  &__info {
    display: grid;
    gap: $spacing-3;
  }

  &__title {
    color: $primary-green;
    margin: 0;
  }

  &__meta {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-2;
  }

  &__meta-item {
    display: flex;
    align-items: center;
    gap: $spacing-1;
    color: $white;
    font-size: 1.4rem;
  }

  &__meta-icon {
    width: 2rem;
    height: 2rem;
    color: $primary-green;
  }

  &__description {
    font-size: 1.6rem;
    line-height: 1.6;
    color: $white;
    opacity: 0.9;
  }

  &__map-section {
    h2 {
      margin-bottom: $spacing-2;
      color: $primary-green;
    }
  }

  &__map {
    width: 100%;
    height: 40rem;
    border-radius: $border-radius-lg;
    overflow: hidden;
    position: relative;
    background-color: $dark-background;

    &.is-loading {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  &__map-loading {
    padding: $spacing-2;
    background-color: rgba($dark-background, 0.8);
    border-radius: $border-radius-sm;
    color: $white;
  }

  &__error {
    color: $error;
    margin-top: $spacing-2;
  }

  &__not-found {
    padding: $spacing-4 0;
    text-align: center;

    h1 {
      color: $primary-green;
      margin-bottom: $spacing-2;
    }

    p {
      color: $white;
      opacity: 0.9;
    }
  }

  @include width-at-least('large') {
    &__container {
      grid-template-columns: 1fr 1fr;
      align-items: start;
    }
  }
}
</style> 