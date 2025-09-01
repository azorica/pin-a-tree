<template>
  <div class="map-view">
    <!-- Header -->
    <header class="map-view__header">
      <div class="map-view__nav">
        <BaseButton variant="ghost" @click="handleGoHome" aria-label="Go to home page">
          🌳 Pin-a-Tree
        </BaseButton>
        
        <div class="map-view__nav-actions">
          <BaseButton variant="secondary" @click="handleAddTree" aria-label="Add a new tree">
            Add Tree
          </BaseButton>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="map-view__main">
      <!-- Map Container -->
      <div 
        ref="mapContainer" 
        class="map-view__map-container"
        role="application"
        aria-label="Interactive map showing tree locations"
      >
        <!-- Loading overlay -->
        <div v-if="isLoading" class="map-view__loading-overlay">
          <div class="map-view__spinner"></div>
          <p>Loading map...</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix Leaflet default marker icons in Webpack/Vite
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png'
})

// Import stores and components
import { useTreeStore } from '@/stores/treeStore'
import BaseButton from '@/components/BaseButton.vue'

// ============================================================================
// COMPOSABLES & STORES
// ============================================================================

const router = useRouter()
const treeStore = useTreeStore()

// ============================================================================
// REACTIVE STATE
// ============================================================================

const mapContainer = ref(null)
const map = ref(null)
const markers = ref([])
const isLoading = ref(true)
const selectedTree = ref(null)
const showSidebar = ref(false)

const defaultTreeImage = '/images/default-tree.png'

// ============================================================================
// LEAFLET MAP INTEGRATION
// ============================================================================

const initializeMap = async () => {
  try {
    console.log('🗺️ Starting map initialization...')
    
    // Wait for DOM to be ready
    await nextTick()
    
    if (!mapContainer.value) {
      console.error('❌ Map container not found!')
      isLoading.value = false
      return
    }

    console.log('✅ Map container found:', {
      width: mapContainer.value.offsetWidth,
      height: mapContainer.value.offsetHeight
    })

    // Create the map
    map.value = L.map(mapContainer.value, {
      center: [40.7829, -73.9654], // NYC coordinates
      zoom: 10,
      zoomControl: true,
      attributionControl: true
    })

    console.log('✅ Map instance created')

    // Add OpenStreetMap tiles
    const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })

    tileLayer.addTo(map.value)
    console.log('✅ Tile layer added')

    // Wait for map to be ready, then add trees
    map.value.whenReady(() => {
      console.log('✅ Map is ready!')
      setTimeout(() => {
        addTreeMarkers()
        isLoading.value = false
        console.log('✅ Map initialization complete')
      }, 100)
    })

  } catch (error) {
    console.error('❌ Map initialization failed:', error)
    isLoading.value = false
  }
}

const addTreeMarkers = () => {
  console.log('🔍 addTreeMarkers called:', {
    mapExists: !!map.value,
    treesCount: treeStore.trees.length,
    trees: treeStore.trees.map(t => ({ id: t.id, name: t.name, lat: t.location?.latitude, lng: t.location?.longitude }))
  })

  if (!map.value || !treeStore.trees.length) {
    console.log('❌ Cannot add markers: map exists:', !!map.value, 'trees count:', treeStore.trees.length)
    return
  }

  console.log('🌳 Adding tree markers to map:', treeStore.trees.length)

  // Clear existing markers
  console.log('🧹 Clearing existing markers:', markers.value.length)
  markers.value.forEach(marker => {
    map.value.removeLayer(marker.leafletMarker)
  })
  markers.value = []

  // Create custom tree icon
  const treeIcon = L.divIcon({
    html: '🌳',
    className: 'tree-marker',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20]
  })

  // Add markers for each tree
  let markersAdded = 0
  treeStore.trees.forEach(tree => {
    console.log('🔍 Processing tree:', tree.name, {
      hasLocation: !!tree.location,
      lat: tree.location?.latitude,
      lng: tree.location?.longitude
    })

    if (tree.location?.latitude && tree.location?.longitude) {
      const leafletMarker = L.marker([tree.location.latitude, tree.location.longitude], {
        icon: treeIcon
      }).addTo(map.value)

      // Create popup content
      const popupContent = `
        <div class="tree-popup">
          <img src="${tree.image?.url || defaultTreeImage}" alt="${tree.image?.alt || tree.species}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 4px; margin-bottom: 8px;">
          <h4 style="margin: 0 0 4px 0; font-size: 16px;">${tree.name}</h4>
          <p style="margin: 0 0 4px 0; color: #666; font-size: 14px;">${tree.species}</p>
          <p style="margin: 0 0 8px 0; color: #888; font-size: 12px;">Planted by ${tree.user?.name || 'Anonymous'}</p>
          <button onclick="window.showTreeDetails('${tree.id}')" style="background: #2E7D32; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">View Details</button>
        </div>
      `

      leafletMarker.bindPopup(popupContent, {
        maxWidth: 250,
        className: 'tree-popup-container'
      })

      // Add click event
      leafletMarker.on('click', () => {
        handleMarkerClick(tree)
      })

      markers.value.push({
        tree,
        leafletMarker
      })
      markersAdded++
      console.log(`✅ Added marker ${markersAdded} for ${tree.name}`)
    } else {
      console.log('⚠️ Skipping tree (no coordinates):', tree.name)
    }
  })

  // Fit map to show all markers if there are any
  if (markers.value.length > 0) {
    const group = new L.featureGroup(markers.value.map(m => m.leafletMarker))
    map.value.fitBounds(group.getBounds().pad(0.1))
  }

  console.log('Added', markers.value.length, 'tree markers to map')
}

// ============================================================================
// GLOBAL FUNCTION FOR POPUP BUTTONS
// ============================================================================

// Make function globally available for popup buttons
if (typeof window !== 'undefined') {
  window.showTreeDetails = (treeId) => {
    const tree = treeStore.trees.find(t => t.id === treeId)
    if (tree) {
      handleMarkerClick(tree)
    }
  }
}

// ============================================================================
// EVENT HANDLERS
// ============================================================================

const handleMarkerClick = (tree) => {
  selectedTree.value = tree
  treeStore.selectTree(tree)
  showSidebar.value = true
}

const handleTreeCardClick = (tree) => {
  // Zoom to tree on map and show details
  if (tree.location?.latitude && tree.location?.longitude && map.value) {
    map.value.setView([tree.location.latitude, tree.location.longitude], 15)
    
    // Find and open the marker popup
    const marker = markers.value.find(m => m.tree.id === tree.id)
    if (marker) {
      marker.leafletMarker.openPopup()
    }
  }
  
  handleMarkerClick(tree)
}

const handleCloseSidebar = () => {
  showSidebar.value = false
  selectedTree.value = null
  treeStore.selectTree(null)
}

const handleGoHome = () => {
  router.push('/')
}

const handleAddTree = () => {
  router.push('/add-tree')
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const formatDate = (dateString) => {
  if (!dateString) return 'Unknown'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// ============================================================================
// LIFECYCLE HOOKS
// ============================================================================

onMounted(async () => {
  console.log('🚀 MapView component mounted')
  
  try {
    // Only fetch trees if we don't have any (first load)
    if (treeStore.trees.length === 0) {
      console.log('📦 Fetching trees for first time...')
      await treeStore.fetchTrees()
    } else {
      console.log('📦 Using existing trees from store:', treeStore.trees.length)
    }
    
    console.log(`✅ Working with ${treeStore.trees.length} trees`)
    
    // Initialize map
    await initializeMap()
    
  } catch (error) {
    console.error('❌ Error in onMounted:', error)
    isLoading.value = false
  }
})

// Watch for changes in the trees array to update markers
watch(() => treeStore.trees, (newTrees, oldTrees) => {
  console.log('🔄 Trees watcher triggered!', {
    newCount: newTrees?.length || 0,
    oldCount: oldTrees?.length || 0,
    mapExists: !!map.value,
    isClient: import.meta.env.SSR === false
  })
  
  if (map.value && newTrees && newTrees.length > 0) {
    console.log('🎯 Calling addTreeMarkers from watcher')
    addTreeMarkers()
  }
}, { deep: true, immediate: false })

onUnmounted(() => {
  // Clean up map
  if (map.value) {
    map.value.remove()
  }
  
  // Clean up global function
  if (typeof window !== 'undefined') {
    delete window.showTreeDetails
  }
})
</script>

<style lang="scss" scoped>
@use '../styles/variables' as *;
@use '../styles/base' as *;

.map-view {
  height: 100vh;
  overflow: hidden;
  background-color: $background-dark;
  display: flex;
  flex-direction: column;

  &__header {
    background-color: $background-dark;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding: $spacing-md;
    flex-shrink: 0;
  }

  &__nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: $max-content-width;
    margin: 0 auto;
  }

  &__nav-actions {
    display: flex;
    gap: $spacing-sm;
    align-items: center;
  }

  &__main {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: $spacing-md;
    overflow: hidden;
  }

  &__map-container {
    flex: 1;
    position: relative;
    overflow: hidden;
    border-radius: $border-radius;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    min-height: 400px;
  }

  &__loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: $background-dark;
    color: $text-primary;
    z-index: 1000;
  }

  &__spinner {
    width: 40px;
    height: 40px;
    border: 3px solid $primary-light;
    border-top: 3px solid $primary-color;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: $spacing-sm;
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

// Global styles for tree markers and map popup (not scoped)
:global(.tree-marker) {
  font-size: 32px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.1);
  }
}

:global(.tree-popup-container) {
  .leaflet-popup-content-wrapper {
    padding: 0;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  .leaflet-popup-content {
    margin: 0;
    line-height: 1.4;
  }
  
  .tree-popup {
    padding: 12px;
    
    h4 {
      color: #333;
      font-weight: 600;
    }
    
    button:hover {
      background: #1B5E20 !important;
      transform: translateY(-1px);
    }
  }
  
  .leaflet-popup-tip {
    background: white;
  }
}
</style>
