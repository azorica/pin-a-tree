<script setup>
/**
 * BaseMap Component
 *
 * Interactive Leaflet map component for displaying trees and locations.
 * Provides a reusable map interface with customizable features.
 *
 * Features:
 * - Leaflet map with OpenStreetMap tiles
 * - Tree markers with popups
 * - Clustering for better performance
 * - Responsive design
 * - Accessibility support
 * - Custom styling
 */

import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default markers in Leaflet with Vite
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import markerIconRetina from 'leaflet/dist/images/marker-icon-2x.png'

// ============================================================================
// PROPS
// ============================================================================

const props = defineProps({
  trees: {
    type: Array,
    default: () => [],
  },
  center: {
    type: Object,
    default: () => ({ lat: 40.7128, lng: -74.006 }), // Default to NYC
  },
  zoom: {
    type: Number,
    default: 10,
  },
  height: {
    type: String,
    default: '400px',
  },
  interactive: {
    type: Boolean,
    default: true,
  },
  showControls: {
    type: Boolean,
    default: true,
  },
  clustered: {
    type: Boolean,
    default: true,
  },
  selectedTreeId: {
    type: String,
    default: null,
  },
})

// ============================================================================
// EMITS
// ============================================================================

const emit = defineEmits(['tree-click', 'map-click', 'bounds-change'])

// ============================================================================
// REACTIVE STATE
// ============================================================================

const mapContainer = ref(null)
const map = ref(null)
const treeMarkers = ref([])
const markerGroup = ref(null)

// ============================================================================
// METHODS
// ============================================================================

const initializeMap = () => {
  if (!mapContainer.value) return

  // Fix Leaflet default marker icons
  delete L.Icon.Default.prototype._getIconUrl
  L.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIconRetina,
    shadowUrl: markerShadow,
  })

  // Create map instance
  map.value = L.map(mapContainer.value, {
    center: [props.center.lat, props.center.lng],
    zoom: props.zoom,
    zoomControl: props.showControls,
    dragging: props.interactive,
    touchZoom: props.interactive,
    doubleClickZoom: props.interactive,
    scrollWheelZoom: props.interactive,
    boxZoom: props.interactive,
    keyboard: props.interactive,
    attributionControl: props.showControls,
  })

  // Add OpenStreetMap tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 18,
  }).addTo(map.value)

  // Create marker group for clustering
  markerGroup.value = L.layerGroup().addTo(map.value)

  // Add event listeners
  map.value.on('click', handleMapClick)
  map.value.on('moveend', handleBoundsChange)
  map.value.on('zoomend', handleBoundsChange)

  // Add trees to map
  updateTreeMarkers()
}

const createTreeMarker = (tree) => {
  // Create custom tree icon
  const treeIcon = L.divIcon({
    className: 'tree-marker',
    html: `
      <div class="tree-marker__pin ${tree.id === props.selectedTreeId ? 'tree-marker__pin--selected' : ''}">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L13.09 8.26L21 9L13.09 9.74L12 16L10.91 9.74L3 9L10.91 8.26L12 2Z"/>
        </svg>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  })

  // Create marker
  const marker = L.marker([tree.location.latitude, tree.location.longitude], {
    icon: treeIcon,
    alt: `Tree: ${tree.name}`,
  })

  // Create popup content
  const popupContent = `
    <div class="tree-popup">
      <div class="tree-popup__header">
        <h3 class="tree-popup__title">${tree.name}</h3>
        <p class="tree-popup__species">${tree.species}</p>
      </div>
      ${tree.description ? `<p class="tree-popup__description">${tree.description}</p>` : ''}
      <div class="tree-popup__meta">
        <p class="tree-popup__date">Planted: ${new Date(tree.datePlanted).toLocaleDateString()}</p>
        <p class="tree-popup__planter">By: ${tree.plantedBy.name}</p>
      </div>
      <div class="tree-popup__actions">
        <button class="tree-popup__button" onclick="window.dispatchEvent(new CustomEvent('tree-popup-click', { detail: { treeId: '${tree.id}' } }))">
          View Details
        </button>
      </div>
    </div>
  `

  // Bind popup
  marker.bindPopup(popupContent, {
    maxWidth: 300,
    className: 'tree-popup-container',
  })

  // Add click handler
  marker.on('click', () => {
    emit('tree-click', tree)
  })

  return marker
}

const updateTreeMarkers = () => {
  if (!map.value || !markerGroup.value) return

  // Clear existing markers
  markerGroup.value.clearLayers()
  treeMarkers.value = []

  // Add new markers
  props.trees.forEach((tree) => {
    if (tree.location && tree.location.latitude && tree.location.longitude) {
      const marker = createTreeMarker(tree)
      markerGroup.value.addLayer(marker)
      treeMarkers.value.push({ tree, marker })
    }
  })

  // Fit bounds if we have trees
  if (props.trees.length > 0) {
    fitBoundsToTrees()
  }
}

const fitBoundsToTrees = () => {
  if (!map.value || props.trees.length === 0) return

  const group = new L.FeatureGroup(treeMarkers.value.map((tm) => tm.marker))
  const bounds = group.getBounds()

  if (bounds.isValid()) {
    map.value.fitBounds(bounds, { padding: [20, 20] })
  }
}

const centerOnTree = (treeId) => {
  const treeMarker = treeMarkers.value.find((tm) => tm.tree.id === treeId)
  if (treeMarker && map.value) {
    const { latitude, longitude } = treeMarker.tree.location
    map.value.setView([latitude, longitude], 16)
    treeMarker.marker.openPopup()
  }
}

const handleMapClick = (event) => {
  emit('map-click', {
    lat: event.latlng.lat,
    lng: event.latlng.lng,
  })
}

const handleBoundsChange = () => {
  if (!map.value) return

  const bounds = map.value.getBounds()
  emit('bounds-change', {
    north: bounds.getNorth(),
    south: bounds.getSouth(),
    east: bounds.getEast(),
    west: bounds.getWest(),
  })
}

// ============================================================================
// WATCHERS
// ============================================================================

watch(() => props.trees, updateTreeMarkers, { deep: true })

watch(
  () => props.selectedTreeId,
  (newTreeId) => {
    if (newTreeId) {
      centerOnTree(newTreeId)
    }
  },
)

watch(
  () => props.center,
  (newCenter) => {
    if (map.value && newCenter) {
      map.value.setView([newCenter.lat, newCenter.lng], props.zoom)
    }
  },
)

// ============================================================================
// LIFECYCLE
// ============================================================================

onMounted(async () => {
  await nextTick()
  initializeMap()

  // Listen for popup events
  window.addEventListener('tree-popup-click', (event) => {
    emit('tree-click', { id: event.detail.treeId })
  })
})

onUnmounted(() => {
  if (map.value) {
    map.value.remove()
  }

  // Remove popup event listener
  window.removeEventListener('tree-popup-click', () => {})
})

// ============================================================================
// EXPOSE METHODS
// ============================================================================

defineExpose({
  fitBoundsToTrees,
  centerOnTree,
})
</script>

<template>
  <div class="base-map" :style="{ height: height }">
    <div
      ref="mapContainer"
      class="base-map__container"
      role="application"
      aria-label="Interactive tree map"
    ></div>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as variables;
@use '@/styles/colors' as colors;
@use '@/styles/mixins' as mixins;

.base-map {
  position: relative;
  width: 100%;
  border-radius: variables.$border-radius-large;
  overflow: hidden;
  box-shadow: variables.$shadow-medium;

  &__container {
    width: 100%;
    height: 100%;
    border-radius: inherit;
  }
}

// ============================================================================
// GLOBAL STYLES FOR LEAFLET COMPONENTS
// ============================================================================

:global(.tree-marker) {
  &__pin {
    @include mixins.flex-center;
    width: 3.2rem;
    height: 3.2rem;
    background: colors.$primary-green;
    color: colors.$white;
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    box-shadow: variables.$shadow-medium;
    transition: all variables.$transition-normal;
    cursor: pointer;

    svg {
      transform: rotate(45deg);
    }

    &:hover {
      background: colors.$secondary-green;
      transform: rotate(-45deg) scale(1.1);
    }

    &--selected {
      background: colors.$secondary-green;
      transform: rotate(-45deg) scale(1.2);
      z-index: 1000;
    }
  }
}

:global(.tree-popup-container) {
  .leaflet-popup-content-wrapper {
    background: colors.$bg-card;
    border-radius: variables.$border-radius-large;
    box-shadow: variables.$shadow-large;
    border: 1px solid colors.$border-light;
  }

  .leaflet-popup-content {
    margin: 0;
    font-family: inherit;
  }

  .leaflet-popup-tip {
    background: colors.$bg-card;
    border: 1px solid colors.$border-light;
    border-top: none;
    border-right: none;
  }

  .leaflet-popup-close-button {
    color: colors.$text-muted;
    font-size: 2rem;
    padding: variables.$spacing-1;

    &:hover {
      color: colors.$primary-green;
      background: rgba(colors.$primary-green, 0.1);
    }
  }
}

:global(.tree-popup) {
  padding: variables.$spacing-3;
  min-width: 20rem;

  &__header {
    margin-bottom: variables.$spacing-2;
  }

  &__title {
    margin: 0 0 variables.$spacing-0_5;
    font-size: variables.$font-size-large;
    font-weight: variables.$font-weight-semibold;
    color: colors.$text-secondary;
  }

  &__species {
    margin: 0;
    font-size: variables.$font-size-small;
    color: colors.$text-muted;
    font-style: italic;
  }

  &__description {
    margin: 0 0 variables.$spacing-2;
    font-size: variables.$font-size-small;
    color: colors.$text-muted;
    line-height: variables.$line-height-relaxed;
  }

  &__meta {
    margin-bottom: variables.$spacing-2;

    p {
      margin: 0;
      font-size: variables.$font-size-small;
      color: colors.$text-muted;
    }
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
  }

  &__button {
    padding: variables.$spacing-1 variables.$spacing-2;
    background: colors.$primary-green;
    color: colors.$white;
    border: none;
    border-radius: variables.$border-radius-medium;
    font-size: variables.$font-size-small;
    font-weight: variables.$font-weight-medium;
    cursor: pointer;
    transition: background-color variables.$transition-normal;

    &:hover {
      background: colors.$secondary-green;
    }

    &:focus {
      outline: 2px solid colors.$primary-green;
      outline-offset: 2px;
    }
  }
}

// ============================================================================
// LEAFLET CONTROL CUSTOMIZATION
// ============================================================================

:global(.leaflet-control-zoom) {
  border: none !important;
  box-shadow: variables.$shadow-medium !important;

  a {
    background: colors.$bg-card !important;
    color: colors.$text-secondary !important;
    border: 1px solid colors.$border-light !important;
    width: 3rem !important;
    height: 3rem !important;
    line-height: 2.8rem !important;
    font-size: variables.$font-size-large !important;
    font-weight: variables.$font-weight-bold !important;

    &:hover {
      background: colors.$primary-green !important;
      color: colors.$white !important;
      border-color: colors.$primary-green !important;
    }

    &:first-child {
      border-radius: variables.$border-radius-medium variables.$border-radius-medium 0 0 !important;
    }

    &:last-child {
      border-radius: 0 0 variables.$border-radius-medium variables.$border-radius-medium !important;
      border-top: none !important;
    }
  }
}

:global(.leaflet-control-attribution) {
  background: rgba(colors.$bg-card, 0.9) !important;
  color: colors.$text-muted !important;
  font-size: variables.$font-size-small !important;
  border-radius: variables.$border-radius-medium !important;
  box-shadow: variables.$shadow-small !important;
  border: 1px solid colors.$border-light !important;

  a {
    color: colors.$primary-green !important;
  }
}

// ============================================================================
// RESPONSIVE ADJUSTMENTS
// ============================================================================

@include mixins.width-less-than('medium') {
  :global(.tree-popup) {
    min-width: 15rem;
    padding: variables.$spacing-2;

    &__title {
      font-size: variables.$font-size-body;
    }
  }

  :global(.tree-marker) {
    &__pin {
      width: 2.8rem;
      height: 2.8rem;

      svg {
        width: 1.6rem;
        height: 1.6rem;
      }
    }
  }
}

// ============================================================================
// ACCESSIBILITY
// ============================================================================

@media (prefers-reduced-motion: reduce) {
  :global(.tree-marker) {
    &__pin {
      transition: none;

      &:hover {
        transform: rotate(-45deg);
      }

      &--selected {
        transform: rotate(-45deg);
      }
    }
  }

  :global(.tree-popup) {
    &__button {
      transition: none;
    }
  }
}

// High contrast mode
@media (prefers-contrast: high) {
  .base-map {
    border: 3px solid colors.$border-dark;
  }

  :global(.tree-marker) {
    &__pin {
      border: 2px solid colors.$white;
    }
  }

  :global(.tree-popup-container) {
    .leaflet-popup-content-wrapper {
      border: 2px solid colors.$border-dark;
    }
  }
}
</style>
