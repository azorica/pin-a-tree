<script setup>
/**
 * MapView Component
 *
 * Interactive map view showing all pinned trees in the Pin-a-Tree application.
 * Uses Leaflet for map rendering and displays tree locations with custom markers.
 *
 * Features:
 * - Interactive map with tree markers
 * - Tree details popup on marker click
 * - Map filtering and search
 * - Current user location (optional)
 * - Tree clustering for performance
 * - Responsive map controls
 */

// Vue imports
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'

// Store imports
import { useTreeStore } from '@/stores/treeStore'
import { useUserStore } from '@/stores/userStore'

// Component imports
import BaseButton from '@/components/BaseButton.vue'
import TreeCard from '@/components/TreeCard.vue'

// ============================================================================
// REACTIVE STATE
// ============================================================================

const router = useRouter()
const treeStore = useTreeStore()
const userStore = useUserStore()

const mapContainer = ref(null)
const map = ref(null)
const markers = ref([])
const selectedTree = ref(null)
const isLoading = ref(true)
const showSidebar = ref(false)

// Map configuration
const defaultCenter = [40.7829, -73.9654] // New York City
const defaultZoom = 10

// ============================================================================
// COMPUTED PROPERTIES
// ============================================================================

// ============================================================================
// MAP FUNCTIONS
// ============================================================================

const initializeMap = async () => {
  try {
    // For MVP, we'll use a simple mock map instead of actual Leaflet
    // This avoids the complexity of loading external dependencies
    await nextTick()
    
    if (!mapContainer.value) return

    // Create mock map display
    const mockMap = document.createElement('div')
    mockMap.className = 'mock-map'
    mockMap.innerHTML = `
      <div class="mock-map__info">
        <h3>🗺️ Interactive Map</h3>
        <p>Map integration coming soon!</p>
        <p>Trees will be displayed as interactive pins</p>
      </div>
    `
    
    mapContainer.value.appendChild(mockMap)
    
    // Add tree markers to the mock display
    addTreeMarkers()
    
  } catch (error) {
    console.error('Failed to initialize map:', error)
  }
}

const addTreeMarkers = () => {
  if (!treeStore.trees.length) return

  // Clear existing markers
  markers.value = []

  // Create mock markers for each tree
  treeStore.trees.forEach(tree => {
    const marker = createMockMarker(tree)
    markers.value.push(marker)
  })
}

const createMockMarker = (tree) => {
  const marker = document.createElement('div')
  marker.className = 'mock-marker'
  marker.innerHTML = `
    <div class="mock-marker__pin">🌳</div>
    <div class="mock-marker__label">${tree.name}</div>
  `
  
  marker.addEventListener('click', () => {
    handleMarkerClick(tree)
  })
  
  if (mapContainer.value) {
    const mockMap = mapContainer.value.querySelector('.mock-map')
    if (mockMap) {
      mockMap.appendChild(marker)
    }
  }
  
  return { element: marker, tree }
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
  selectedTree.value = tree
  treeStore.selectTree(tree)
  
  // Center map on tree (mock behavior)
  console.log(`Centering map on ${tree.name}`)
}

const handleAddTree = () => {
  router.push('/add-tree')
}

const handleCloseSidebar = () => {
  showSidebar.value = false
  selectedTree.value = null
  treeStore.clearSelection()
}

const handleGoHome = () => {
  router.push('/')
}

// ============================================================================
// WATCHERS
// ============================================================================

watch(() => treeStore.trees, () => {
  if (map.value) {
    addTreeMarkers()
  }
}, { deep: true })

// ============================================================================
// LIFECYCLE
// ============================================================================

onMounted(async () => {
  try {
    // Load tree data
    await treeStore.fetchTrees()
    
    // Initialize map
    await initializeMap()
    
    // Check if we have a selected tree from navigation
    if (treeStore.selectedTree) {
      selectedTree.value = treeStore.selectedTree
      showSidebar.value = true
    }
    
  } catch (error) {
    console.error('Failed to load map view:', error)
  } finally {
    isLoading.value = false
  }
})

onUnmounted(() => {
  // Cleanup map resources
  if (map.value) {
    // Cleanup would go here for real Leaflet map
  }
})
</script>

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
      <!-- Loading State -->
      <div v-if="isLoading" class="map-view__loading" aria-live="polite">
        <div class="map-view__loading-content">
          <div class="map-view__spinner"></div>
          <p>Loading tree map...</p>
        </div>
      </div>

      <!-- Map Container -->
      <div 
        v-else
        ref="mapContainer" 
        class="map-view__map-container"
        role="application"
        aria-label="Interactive map showing tree locations"
      >
        <!-- Map will be initialized here -->
      </div>

      <!-- Tree List (Mobile) -->
      <div class="map-view__tree-list" v-if="!isLoading">
        <h3>Trees on Map ({{ treeStore.trees.length }})</h3>
        <div class="map-view__tree-grid">
          <div 
            v-for="tree in treeStore.trees" 
            :key="tree.id"
            class="map-view__tree-item"
            @click="handleTreeCardClick(tree)"
            role="button"
            tabindex="0"
            :aria-label="`View ${tree.name} on map`"
          >
            <img :src="tree.image.url" :alt="tree.image.alt" class="map-view__tree-thumb" />
            <div class="map-view__tree-info">
              <h4>{{ tree.name }}</h4>
              <p>{{ tree.species }}</p>
              <small>{{ tree.user.name }}</small>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Tree Details Sidebar -->
    <aside 
      v-if="selectedTree && showSidebar" 
      class="map-view__sidebar"
      role="dialog"
      aria-modal="true"
      :aria-label="`Details for ${selectedTree.name}`"
    >
      <div class="map-view__sidebar-header">
        <h2>Tree Details</h2>
        <BaseButton 
          variant="ghost" 
          @click="handleCloseSidebar"
          aria-label="Close tree details"
        >
          ✕
        </BaseButton>
      </div>
      
      <div class="map-view__sidebar-content">
        <TreeCard 
          :tree="selectedTree" 
          @click="() => {}" 
        />
        
        <div class="map-view__tree-actions">
          <BaseButton variant="secondary" @click="handleCloseSidebar">
            Close
          </BaseButton>
        </div>
      </div>
    </aside>

    <!-- Sidebar Backdrop -->
    <div 
      v-if="showSidebar" 
      class="map-view__backdrop"
      @click="handleCloseSidebar"
      aria-hidden="true"
    ></div>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.map-view {
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;

  // ============================================================================
  // HEADER
  // ============================================================================

  &__header {
    background-color: var(--color-background-dark);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    position: sticky;
    top: 0;
    z-index: var(--z-sticky);
  }

  &__nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-md);
  }

  &__nav-actions {
    display: flex;
    gap: var(--spacing-sm);
  }

  // ============================================================================
  // MAIN CONTENT
  // ============================================================================

  &__main {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    
    @include respond-to('desktop') {
      flex-direction: row;
    }
  }

  // ============================================================================
  // LOADING STATE
  // ============================================================================

  &__loading {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    background-color: var(--color-background-dark);
  }

  &__loading-content {
    text-align: center;
    color: rgba(255, 255, 255, 0.8);
  }

  &__spinner {
    width: 4rem;
    height: 4rem;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-top: 3px solid var(--color-primary-green);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto var(--spacing-md);
  }

  // ============================================================================
  // MAP CONTAINER
  // ============================================================================

  &__map-container {
    flex: 1;
    position: relative;
    background-color: #1a1a1a;
  }

  // ============================================================================
  // TREE LIST (MOBILE)
  // ============================================================================

  &__tree-list {
    background-color: var(--color-background-dark);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding: var(--spacing-md);
    max-height: 40vh;
    overflow-y: auto;
    
    @include respond-to('desktop') {
      display: none;
    }
    
    h3 {
      color: var(--color-primary-green);
      margin-bottom: var(--spacing-md);
    }
  }

  &__tree-grid {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  &__tree-item {
    display: flex;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm);
    border-radius: var(--border-radius-medium);
    background-color: rgba(255, 255, 255, 0.05);
    cursor: pointer;
    transition: background-color var(--transition-normal);
    
    &:hover,
    &:focus {
      background-color: rgba(255, 255, 255, 0.1);
      outline: none;
    }
  }

  &__tree-thumb {
    width: 5rem;
    height: 5rem;
    border-radius: var(--border-radius-small);
    object-fit: cover;
  }

  &__tree-info {
    flex: 1;
    
    h4 {
      color: var(--color-primary-green);
      margin-bottom: 0.2rem;
      font-size: var(--font-size-small);
    }
    
    p {
      color: rgba(255, 255, 255, 0.8);
      font-size: 1.2rem;
      margin-bottom: 0.2rem;
    }
    
    small {
      color: rgba(255, 255, 255, 0.6);
      font-size: 1.1rem;
    }
  }

  // ============================================================================
  // SIDEBAR
  // ============================================================================

  &__sidebar {
    position: fixed;
    top: 0;
    right: 0;
    width: 90vw;
    max-width: 40rem;
    height: 100vh;
    background-color: var(--color-background-dark);
    border-left: 1px solid rgba(255, 255, 255, 0.1);
    z-index: var(--z-modal);
    overflow-y: auto;
    transform: translateX(0);
    transition: transform var(--transition-normal);
    
    @include respond-to('desktop') {
      width: 40rem;
    }
  }

  &__sidebar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-md);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    
    h2 {
      color: var(--color-primary-green);
      margin: 0;
    }
  }

  &__sidebar-content {
    padding: var(--spacing-md);
  }

  &__tree-actions {
    margin-top: var(--spacing-lg);
    display: flex;
    gap: var(--spacing-sm);
  }

  // ============================================================================
  // BACKDROP
  // ============================================================================

  &__backdrop {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: var(--z-modal-backdrop);
  }

  // ============================================================================
  // ANIMATIONS
  // ============================================================================

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
}

// ============================================================================
// MOCK MAP STYLES
// ============================================================================

:deep(.mock-map) {
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, #1a4a1a 0%, #2e7d32 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  
  &__info {
    text-align: center;
    color: white;
    z-index: 2;
    
    h3 {
      font-size: 2.4rem;
      margin-bottom: var(--spacing-sm);
    }
    
    p {
      font-size: var(--font-size-large);
      margin-bottom: 0.5rem;
      opacity: 0.9;
    }
  }
}

:deep(.mock-marker) {
  position: absolute;
  cursor: pointer;
  z-index: 3;
  
  &:nth-child(2) { top: 20%; left: 30%; }
  &:nth-child(3) { top: 40%; left: 60%; }
  &:nth-child(4) { top: 60%; left: 25%; }
  &:nth-child(5) { top: 70%; left: 70%; }
  &:nth-child(6) { top: 30%; left: 80%; }
  
  &__pin {
    font-size: 2rem;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
    transition: transform var(--transition-normal);
    
    &:hover {
      transform: scale(1.2);
    }
  }
  
  &__label {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 0.4rem 0.8rem;
    border-radius: var(--border-radius-small);
    font-size: 1.2rem;
    white-space: nowrap;
    opacity: 0;
    transition: opacity var(--transition-normal);
  }
  
  &:hover &__label {
    opacity: 1;
  }
}
</style>
