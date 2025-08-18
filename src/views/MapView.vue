<script setup>
/**
 * MapView Component
 *
 * Interactive map displaying all trees planted by the community.
 * Features zooming, clustering, search, and filtering capabilities.
 *
 * Features:
 * - Interactive Leaflet map with OpenStreetMap tiles
 * - Tree markers with popup details
 * - Search and filter functionality
 * - Responsive design
 * - Accessibility support
 */

import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTreeStore } from '@/stores/treeStore'
import { Search, Filter, MapPin, TreePine } from 'lucide-vue-next'

import BaseButton from '@/components/BaseButton.vue'
import BaseCard from '@/components/BaseCard.vue'
import BaseMap from '@/components/BaseMap.vue'

// ============================================================================
// COMPOSABLES
// ============================================================================

const router = useRouter()
const treeStore = useTreeStore()

// ============================================================================
// REACTIVE STATE
// ============================================================================

const searchQuery = ref('')
const showFilters = ref(false)
const selectedSpecies = ref('')
const selectedTreeId = ref(null)
const mapCenter = ref({ lat: 40.7128, lng: -74.006 })
const mapZoom = ref(10)

// ============================================================================
// COMPUTED PROPERTIES
// ============================================================================

const filteredTrees = computed(() => {
  let trees = treeStore.trees

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    trees = trees.filter(
      (tree) =>
        tree.name.toLowerCase().includes(query) ||
        tree.species.toLowerCase().includes(query) ||
        tree.description.toLowerCase().includes(query),
    )
  }

  if (selectedSpecies.value) {
    trees = trees.filter((tree) =>
      tree.species.toLowerCase().includes(selectedSpecies.value.toLowerCase()),
    )
  }

  return trees
})

const availableSpecies = computed(() => treeStore.availableSpecies)

// ============================================================================
// METHODS
// ============================================================================

const handleSearch = () => {
  treeStore.setSearchFilter(searchQuery.value)
}

const clearSearch = () => {
  searchQuery.value = ''
  selectedSpecies.value = ''
  treeStore.clearFilters()
}

const handleTreeClick = (tree) => {
  if (tree.id) {
    router.push(`/tree/${tree.id}`)
  }
}

const handleMapClick = (coordinates) => {
  console.log('Map clicked at:', coordinates)
  // Could be used for adding new trees at clicked location
}

const handleBoundsChange = (bounds) => {
  // Could be used to load trees within visible bounds
  console.log('Map bounds changed:', bounds)
}

// ============================================================================
// LIFECYCLE
// ============================================================================

onMounted(async () => {
  // Load trees if not already loaded
  if (treeStore.trees.length === 0) {
    await treeStore.fetchTrees()
  }
})
</script>

<template>
  <div class="map-view">
    <!-- Header section -->
    <section class="map-view__header">
      <div class="container">
        <div class="map-view__header-content">
          <div class="map-view__title-section">
            <h1 class="map-view__title">Tree Map</h1>
            <p class="map-view__subtitle">
              Explore trees planted by our community around the world
            </p>
          </div>

          <!-- Search and filters -->
          <div class="map-view__search-section">
            <div class="map-view__search-bar">
              <Search :size="20" class="map-view__search-icon" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search trees, species, or locations..."
                class="map-view__search-input"
                @input="handleSearch"
              />
              <BaseButton
                v-if="searchQuery || selectedSpecies"
                variant="ghost"
                size="small"
                @click="clearSearch"
              >
                Clear
              </BaseButton>
            </div>

            <BaseButton variant="secondary" size="small" @click="showFilters = !showFilters">
              <template #icon-left>
                <Filter :size="16" />
              </template>
              Filters
            </BaseButton>
          </div>

          <!-- Filter panel -->
          <div v-if="showFilters" class="map-view__filters">
            <BaseCard>
              <div class="map-view__filter-content">
                <h3>Filter by Species</h3>
                <select
                  v-model="selectedSpecies"
                  class="map-view__species-select"
                  @change="handleSearch"
                >
                  <option value="">All Species</option>
                  <option v-for="species in availableSpecies" :key="species" :value="species">
                    {{ species }}
                  </option>
                </select>
              </div>
            </BaseCard>
          </div>
        </div>
      </div>
    </section>

    <!-- Map container -->
    <section class="map-view__map-section">
      <div class="map-view__map-container">
        <BaseMap
          :trees="filteredTrees"
          :center="mapCenter"
          :zoom="mapZoom"
          :selected-tree-id="selectedTreeId"
          height="60vh"
          @tree-click="handleTreeClick"
          @map-click="handleMapClick"
          @bounds-change="handleBoundsChange"
        />
      </div>
    </section>

    <!-- Tree list sidebar (mobile fallback) -->
    <section class="map-view__tree-list">
      <div class="container">
        <h2>Trees on Map</h2>
        <div class="map-view__tree-grid">
          <BaseCard
            v-for="tree in filteredTrees.slice(0, 6)"
            :key="tree.id"
            variant="outlined"
            clickable
            class="map-view__tree-card"
            @click="selectedTreeId = tree.id"
          >
            <div class="map-view__tree-info">
              <TreePine :size="24" class="map-view__tree-icon" />
              <div>
                <h4>{{ tree.name }}</h4>
                <p class="map-view__tree-species">{{ tree.species }}</p>
                <p class="map-view__tree-location">
                  {{
                    tree.location.address ||
                    `${tree.location.latitude.toFixed(4)}, ${tree.location.longitude.toFixed(4)}`
                  }}
                </p>
              </div>
            </div>
          </BaseCard>
        </div>

        <div v-if="filteredTrees.length > 6" class="map-view__more-trees">
          <p>And {{ filteredTrees.length - 6 }} more trees...</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as variables;
@use '@/styles/colors' as colors;
@use '@/styles/mixins' as mixins;

.map-view {
  min-height: calc(100vh - 8rem); // Account for header
  display: flex;
  flex-direction: column;

  // -------------------------------------------------------------------------
  // HEADER SECTION
  // -------------------------------------------------------------------------

  &__header {
    background: linear-gradient(
      135deg,
      rgba(colors.$primary-green, 0.1) 0%,
      rgba(colors.$secondary-green, 0.05) 100%
    );
    padding: variables.$spacing-4 0;
    border-bottom: 1px solid colors.$border-light;
  }

  &__header-content {
    display: flex;
    flex-direction: column;
    gap: variables.$spacing-3;

    @include mixins.width-at-least('large') {
      flex-direction: row;
      justify-content: space-between;
      align-items: flex-start;
    }
  }

  &__title-section {
    flex: 1;
  }

  &__title {
    font-size: variables.$font-size-h2;
    margin: 0 0 variables.$spacing-1;
    color: colors.$text-primary;

    @include mixins.width-at-least('medium') {
      font-size: variables.$font-size-h1;
    }
  }

  &__subtitle {
    color: colors.$text-muted;
    font-size: variables.$font-size-large;
    margin: 0;
  }

  // -------------------------------------------------------------------------
  // SEARCH SECTION
  // -------------------------------------------------------------------------

  &__search-section {
    display: flex;
    flex-direction: column;
    gap: variables.$spacing-2;

    @include mixins.width-at-least('medium') {
      flex-direction: row;
      align-items: center;
    }
  }

  &__search-bar {
    display: flex;
    align-items: center;
    background: colors.$bg-card;
    border: 2px solid colors.$border-light;
    border-radius: variables.$border-radius-large;
    padding: variables.$spacing-1 variables.$spacing-2;
    transition: border-color variables.$transition-normal;
    min-width: 30rem;

    &:focus-within {
      border-color: colors.$primary-green;
    }
  }

  &__search-icon {
    color: colors.$text-muted;
    margin-right: variables.$spacing-1;
  }

  &__search-input {
    flex: 1;
    border: none;
    background: transparent;
    font-size: variables.$font-size-body;
    color: colors.$text-secondary;
    padding: variables.$spacing-1;

    &:focus {
      outline: none;
    }

    &::placeholder {
      color: colors.$text-muted;
    }
  }

  &__filters {
    grid-column: 1 / -1;
  }

  &__filter-content {
    padding: variables.$spacing-3;

    h3 {
      margin: 0 0 variables.$spacing-2;
      color: colors.$text-secondary;
    }
  }

  &__species-select {
    width: 100%;
    padding: variables.$spacing-1_5;
    border: 2px solid colors.$border-light;
    border-radius: variables.$border-radius-medium;
    background: colors.$bg-card;
    color: colors.$text-secondary;
    font-size: variables.$font-size-body;

    &:focus {
      outline: none;
      border-color: colors.$primary-green;
    }
  }

  // -------------------------------------------------------------------------
  // MAP SECTION
  // -------------------------------------------------------------------------

  &__map-section {
    flex: 1;
    position: relative;
  }

  &__map-container {
    height: 60vh;
    min-height: 40rem;
    position: relative;
    background: colors.$bg-secondary;
  }

  // -------------------------------------------------------------------------
  // TREE LIST SECTION
  // -------------------------------------------------------------------------

  &__tree-list {
    padding: variables.$spacing-6 0;
    background: colors.$bg-secondary;

    h2 {
      margin: 0 0 variables.$spacing-4;
      color: colors.$text-secondary;
    }
  }

  &__tree-grid {
    display: grid;
    gap: variables.$spacing-3;
    margin-bottom: variables.$spacing-4;

    @include mixins.width-at-least('medium') {
      grid-template-columns: repeat(2, 1fr);
    }

    @include mixins.width-at-least('large') {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  &__tree-card {
    .base-card__content {
      padding: variables.$spacing-2;
    }
  }

  &__tree-info {
    display: flex;
    align-items: flex-start;
    gap: variables.$spacing-2;

    h4 {
      margin: 0 0 variables.$spacing-0_5;
      font-size: variables.$font-size-body;
      color: colors.$text-secondary;
    }
  }

  &__tree-icon {
    color: colors.$primary-green;
    flex-shrink: 0;
    margin-top: 0.2rem;
  }

  &__tree-species {
    font-size: variables.$font-size-small;
    color: colors.$text-muted;
    margin: 0 0 variables.$spacing-0_5;
    font-style: italic;
  }

  &__tree-location {
    font-size: variables.$font-size-small;
    color: colors.$text-muted;
    margin: 0;
  }

  &__more-trees {
    text-align: center;
    color: colors.$text-muted;
    font-style: italic;

    p {
      margin: 0;
    }
  }

  // -------------------------------------------------------------------------
  // RESPONSIVE ADJUSTMENTS
  // -------------------------------------------------------------------------

  @include mixins.width-less-than('medium') {
    &__search-bar {
      min-width: auto;
    }

    &__map-container {
      height: 50vh;
      min-height: 30rem;
    }

    &__tree-list {
      padding: variables.$spacing-4 0;
    }
  }
}
</style>
