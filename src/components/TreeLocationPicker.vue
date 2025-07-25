<script setup>
/**
 * TreeLocationPicker Component
 *
 * A component for selecting a tree location on a map.
 *
 * Features:
 * - Interactive Google Map
 * - Draggable marker
 * - Address display
 * - Error handling
 * - Loading state
 * - Full keyboard navigation
 * - Screen reader support
 * - ARIA live regions for status updates
 *
 * Props:
 * @prop {Object} location - Current location (lat/lng)
 * @prop {String} error - Error message
 *
 * Events:
 * @emits {Object} update:location - When location is updated
 * @emits {String} update:address - When address is resolved
 */

// Vue imports
import { computed, watch, ref } from 'vue';
import { MapPin } from 'lucide-vue-next';

// Composables
import { useLeafletMap } from '@/composables/useLeafletMap';

const props = defineProps({
  location: {
    type: Object,
    default: () => ({ lat: null, lng: null })
  },
  error: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:location', 'update:address']);

// Local state to prevent recursive updates
const isInternalUpdate = ref(false);
const addressError = ref(null);

const { mapContainer, loading, error: mapError, addMarker, clearMarkers } = useLeafletMap({
  clickable: true,
  draggableMarker: true,
  centerOnMarker: true,
  onClick: handleLocationSelect
});

const displayError = computed(() => props.error || mapError.value || addressError.value);

// Debounce function to prevent rapid requests
function debounce(fn, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), wait);
  };
}

const getAddressFromCoordinates = debounce(async (lat, lon) => {
  try {
    addressError.value = null;
    // For development, we'll use a simpler approach - just use coordinates as address
    // This avoids rate limits and API key requirements during development
    const address = `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
    return address;
  } catch (err) {
    console.error('Error getting address:', err);
    addressError.value = 'Failed to get address. You can still save the location.';
    return null;
  }
}, 1000); // 1 second debounce

async function handleLocationSelect(location) {
  if (!location || !Array.isArray(location) || location.length !== 2) return;

  clearMarkers();
  addMarker(location, {
    draggable: true,
    onDragEnd: handleLocationSelect
  });
  
  const [lat, lng] = location;
  
  // Set flag to prevent watch from triggering
  isInternalUpdate.value = true;
  emit('update:location', { lat, lng });
  
  try {
    const address = await getAddressFromCoordinates(lat, lng);
    if (address) {
      emit('update:address', address);
    }
  } catch (err) {
    console.error('Failed to get address:', err);
  } finally {
    // Reset flag after all updates are done
    isInternalUpdate.value = false;
  }
}

// Watch for external location updates
watch(() => props.location, (newLocation) => {
  // Only process external updates
  if (!isInternalUpdate.value && newLocation && typeof newLocation.lat === 'number' && typeof newLocation.lng === 'number') {
    handleLocationSelect([newLocation.lat, newLocation.lng]);
  }
}, { immediate: true });
</script>

<template>
  <div class="tree-location-picker">
    <div class="tree-location-picker__header">
      <div class="tree-location-picker__title">
        <MapPin
          class="tree-location-picker__icon"
          aria-hidden="true"
        />
        <h2 id="location-picker-title">Select Location</h2>
      </div>

      <p
        class="tree-location-picker__help"
        id="location-picker-instructions"
      >
        Click on the map to place a marker, or drag the marker to adjust the location
      </p>
    </div>

    <div
      ref="mapContainer"
      class="tree-location-picker__map"
      :class="{ 'is-loading': loading }"
      role="application"
      aria-labelledby="location-picker-title"
      aria-describedby="location-picker-instructions"
      tabindex="0"
    >
      <div
        v-if="loading"
        class="tree-location-picker__loading"
        role="status"
        aria-live="polite"
        aria-label="Loading map..."
      >
        <span class="tree-location-picker__loading-text">Loading map...</span>
      </div>
    </div>

    <p
      v-if="displayError"
      class="tree-location-picker__error"
      role="alert"
    >
      {{ displayError }}
    </p>

    <div
      class="tree-location-picker__status"
      role="status"
      aria-live="polite"
    >
      {{ mapStatus }}
    </div>
  </div>
</template>

<style scoped lang="scss">
.tree-location-picker {
  display: grid;
  gap: $spacing-2;

  &__header {
    display: grid;
    gap: $spacing-1;
  }

  &__title {
    @include flex-center;
    justify-content: flex-start;
    gap: $spacing-1;
    color: $white;

    h2 {
      margin: 0;
      font-size: $font-size-h3;
    }
  }

  &__icon {
    width: 2.4rem;
    height: 2.4rem;
    color: $primary-green;
  }

  &__help {
    color: rgba($white, 0.7);
    font-size: 1.4rem;
  }

  &__map {
    position: relative;
    width: 100%;
    height: 40rem;
    border-radius: $border-radius-lg;
    overflow: hidden;
    background-color: rgba($dark-background, 0.5);

    &.is-loading {
      pointer-events: none;
    }

    &:focus {
      outline: none;
      box-shadow: 0 0 0 2px $primary-green;
    }

    &:focus:not(:focus-visible) {
      box-shadow: none;
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
    color: $error;
    font-size: 1.4rem;
  }

  &__status {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
}
</style> 