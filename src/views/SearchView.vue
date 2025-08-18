<script setup>
/**
 * SearchView Component
 *
 * Search interface for finding trees, users, and locations.
 * Includes advanced filtering and result display.
 *
 * Features:
 * - Tree search
 * - User search
 * - Location-based search
 * - Advanced filters
 * - Search results display
 */

import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTreeStore } from '@/stores/treeStore'
import { useUserStore } from '@/stores/userStore'
import { Search, Filter, MapPin, TreePine, User, Calendar } from 'lucide-vue-next'

import BaseButton from '@/components/BaseButton.vue'
import BaseCard from '@/components/BaseCard.vue'

// ============================================================================
// COMPOSABLES
// ============================================================================

const route = useRoute()
const router = useRouter()
const treeStore = useTreeStore()
const userStore = useUserStore()

// ============================================================================
// REACTIVE STATE
// ============================================================================

const searchQuery = ref('')
const searchType = ref('trees') // 'trees', 'users', 'all'
const showFilters = ref(false)
const isLoading = ref(false)

// Filters
const filters = ref({
  species: '',
  dateRange: {
    start: '',
    end: '',
  },
  location: '',
})

const searchResults = ref({
  trees: [],
  users: [],
  total: 0,
})

// ============================================================================
// COMPUTED PROPERTIES
// ============================================================================

const hasActiveFilters = computed(() => {
  return (
    filters.value.species ||
    filters.value.dateRange.start ||
    filters.value.dateRange.end ||
    filters.value.location
  )
})

const filteredTrees = computed(() => {
  let trees = searchResults.value.trees

  if (filters.value.species) {
    trees = trees.filter((tree) =>
      tree.species.toLowerCase().includes(filters.value.species.toLowerCase()),
    )
  }

  if (filters.value.dateRange.start || filters.value.dateRange.end) {
    trees = trees.filter((tree) => {
      const treeDate = new Date(tree.datePlanted)
      const startDate = filters.value.dateRange.start
        ? new Date(filters.value.dateRange.start)
        : null
      const endDate = filters.value.dateRange.end ? new Date(filters.value.dateRange.end) : null

      if (startDate && treeDate < startDate) return false
      if (endDate && treeDate > endDate) return false
      return true
    })
  }

  if (filters.value.location) {
    trees = trees.filter((tree) =>
      tree.location.address?.toLowerCase().includes(filters.value.location.toLowerCase()),
    )
  }

  return trees
})

const availableSpecies = computed(() => treeStore.availableSpecies)

// ============================================================================
// METHODS
// ============================================================================

const performSearch = async () => {
  if (!searchQuery.value.trim()) return

  isLoading.value = true

  try {
    const results = { trees: [], users: [], total: 0 }

    if (searchType.value === 'trees' || searchType.value === 'all') {
      const treeResults = await treeStore.searchTrees(searchQuery.value)
      results.trees = treeResults.results || []
    }

    if (searchType.value === 'users' || searchType.value === 'all') {
      const userResults = await userStore.searchUsers(searchQuery.value)
      results.users = userResults.results || []
    }

    results.total = results.trees.length + results.users.length
    searchResults.value = results

    // Update URL with search query
    router.replace({
      query: {
        q: searchQuery.value,
        type: searchType.value,
        ...route.query,
      },
    })
  } catch (error) {
    console.error('Search failed:', error)
  } finally {
    isLoading.value = false
  }
}

const clearSearch = () => {
  searchQuery.value = ''
  searchResults.value = { trees: [], users: [], total: 0 }
  clearFilters()
  router.replace({ query: {} })
}

const clearFilters = () => {
  filters.value = {
    species: '',
    dateRange: { start: '', end: '' },
    location: '',
  }
}

const handleKeyPress = (event) => {
  if (event.key === 'Enter') {
    performSearch()
  }
}

const selectSearchType = (type) => {
  searchType.value = type
  if (searchQuery.value.trim()) {
    performSearch()
  }
}

const viewTree = (treeId) => {
  router.push(`/tree/${treeId}`)
}

const viewUser = (userId) => {
  router.push(`/profile/${userId}`)
}

// ============================================================================
// WATCHERS
// ============================================================================

watch(
  [filters],
  () => {
    // Re-filter results when filters change
  },
  { deep: true },
)

// ============================================================================
// LIFECYCLE
// ============================================================================

onMounted(async () => {
  // Load trees for filtering
  if (treeStore.trees.length === 0) {
    await treeStore.fetchTrees()
  }

  // Check for initial search query from URL
  const initialQuery = route.query.q
  const initialType = route.query.type || 'trees'

  if (initialQuery) {
    searchQuery.value = initialQuery
    searchType.value = initialType
    await performSearch()
  }
})
</script>

<template>
  <div class="search-view">
    <div class="container">
      <!-- Header -->
      <header class="search-view__header">
        <h1 class="search-view__title">Search</h1>
        <p class="search-view__subtitle">Find trees, users, and locations in our community</p>
      </header>

      <!-- Search interface -->
      <section class="search-view__search-section">
        <BaseCard class="search-view__search-card">
          <!-- Search bar -->
          <div class="search-view__search-bar">
            <Search :size="20" class="search-view__search-icon" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search for trees, species, users, or locations..."
              class="search-view__search-input"
              @keypress="handleKeyPress"
            />
            <BaseButton v-if="searchQuery" variant="ghost" size="small" @click="clearSearch">
              Clear
            </BaseButton>
            <BaseButton variant="primary" @click="performSearch" :loading="isLoading">
              Search
            </BaseButton>
          </div>

          <!-- Search type tabs -->
          <div class="search-view__search-types">
            <button
              v-for="type in [
                { key: 'all', label: 'All' },
                { key: 'trees', label: 'Trees' },
                { key: 'users', label: 'Users' },
              ]"
              :key="type.key"
              class="search-view__type-tab"
              :class="{ 'search-view__type-tab--active': searchType === type.key }"
              @click="selectSearchType(type.key)"
            >
              {{ type.label }}
            </button>
          </div>

          <!-- Advanced filters -->
          <div class="search-view__filter-controls">
            <BaseButton variant="secondary" size="small" @click="showFilters = !showFilters">
              <template #icon-left>
                <Filter :size="16" />
              </template>
              Filters
              <span v-if="hasActiveFilters" class="search-view__filter-badge"></span>
            </BaseButton>

            <BaseButton v-if="hasActiveFilters" variant="ghost" size="small" @click="clearFilters">
              Clear Filters
            </BaseButton>
          </div>

          <!-- Filter panel -->
          <div v-if="showFilters" class="search-view__filters">
            <div class="search-view__filter-grid">
              <!-- Species filter -->
              <div class="search-view__filter-field">
                <label for="species-filter" class="search-view__filter-label"> Species </label>
                <select
                  id="species-filter"
                  v-model="filters.species"
                  class="search-view__filter-select"
                >
                  <option value="">All Species</option>
                  <option v-for="species in availableSpecies" :key="species" :value="species">
                    {{ species }}
                  </option>
                </select>
              </div>

              <!-- Date range filter -->
              <div class="search-view__filter-field">
                <label for="date-start" class="search-view__filter-label"> Date Planted </label>
                <div class="search-view__date-range">
                  <input
                    id="date-start"
                    v-model="filters.dateRange.start"
                    type="date"
                    class="search-view__filter-input"
                    placeholder="From"
                  />
                  <input
                    v-model="filters.dateRange.end"
                    type="date"
                    class="search-view__filter-input"
                    placeholder="To"
                  />
                </div>
              </div>

              <!-- Location filter -->
              <div class="search-view__filter-field">
                <label for="location-filter" class="search-view__filter-label"> Location </label>
                <input
                  id="location-filter"
                  v-model="filters.location"
                  type="text"
                  class="search-view__filter-input"
                  placeholder="City, state, or country"
                />
              </div>
            </div>
          </div>
        </BaseCard>
      </section>

      <!-- Search results -->
      <section v-if="searchQuery" class="search-view__results-section">
        <!-- Results summary -->
        <div class="search-view__results-summary">
          <h2>
            {{ isLoading ? 'Searching...' : `${searchResults.total} results for "${searchQuery}"` }}
          </h2>
        </div>

        <!-- Tree results -->
        <div v-if="(searchType === 'trees' || searchType === 'all') && filteredTrees.length > 0">
          <h3 class="search-view__results-heading">
            <TreePine :size="20" />
            Trees ({{ filteredTrees.length }})
          </h3>
          <div class="search-view__results-grid">
            <BaseCard
              v-for="tree in filteredTrees"
              :key="tree.id"
              class="search-view__result-card"
              clickable
              @click="viewTree(tree.id)"
            >
              <div class="search-view__tree-result">
                <TreePine :size="24" class="search-view__result-icon" />
                <div class="search-view__result-content">
                  <h4>{{ tree.name }}</h4>
                  <p class="search-view__result-species">{{ tree.species }}</p>
                  <div class="search-view__result-meta">
                    <span class="search-view__result-location">
                      <MapPin :size="14" />
                      {{
                        tree.location.address ||
                        `${tree.location.latitude.toFixed(4)}, ${tree.location.longitude.toFixed(4)}`
                      }}
                    </span>
                    <span class="search-view__result-date">
                      <Calendar :size="14" />
                      {{ new Date(tree.datePlanted).toLocaleDateString() }}
                    </span>
                  </div>
                  <p v-if="tree.description" class="search-view__result-description">
                    {{ tree.description.slice(0, 100)
                    }}{{ tree.description.length > 100 ? '...' : '' }}
                  </p>
                </div>
              </div>
            </BaseCard>
          </div>
        </div>

        <!-- User results -->
        <div
          v-if="(searchType === 'users' || searchType === 'all') && searchResults.users.length > 0"
        >
          <h3 class="search-view__results-heading">
            <User :size="20" />
            Users ({{ searchResults.users.length }})
          </h3>
          <div class="search-view__results-grid">
            <BaseCard
              v-for="user in searchResults.users"
              :key="user.id"
              class="search-view__result-card"
              clickable
              @click="viewUser(user.id)"
            >
              <div class="search-view__user-result">
                <div class="search-view__user-avatar">
                  {{ user.initials }}
                </div>
                <div class="search-view__result-content">
                  <h4>{{ user.name }}</h4>
                  <p v-if="user.bio" class="search-view__result-description">
                    {{ user.bio.slice(0, 100) }}{{ user.bio.length > 100 ? '...' : '' }}
                  </p>
                  <div class="search-view__user-stats">
                    <span>{{ user.stats?.treesPlanted || 0 }} trees planted</span>
                  </div>
                </div>
              </div>
            </BaseCard>
          </div>
        </div>

        <!-- No results -->
        <div v-if="!isLoading && searchResults.total === 0 && searchQuery">
          <BaseCard class="search-view__no-results">
            <div class="search-view__no-results-content">
              <Search :size="48" />
              <h3>No results found</h3>
              <p>Try adjusting your search terms or filters.</p>
            </div>
          </BaseCard>
        </div>
      </section>

      <!-- Empty state -->
      <section v-else class="search-view__empty-state">
        <BaseCard class="search-view__empty-card">
          <div class="search-view__empty-content">
            <Search :size="64" />
            <h2>Start Your Search</h2>
            <p>Enter a search term above to find trees, users, and locations in our community.</p>
            <div class="search-view__search-suggestions">
              <h3>Try searching for:</h3>
              <div class="search-view__suggestion-tags">
                <button
                  v-for="suggestion in ['Oak trees', 'Cherry blossom', 'Central Park', 'Maple']"
                  :key="suggestion"
                  class="search-view__suggestion-tag"
                  @click="
                    searchQuery = suggestion
                    performSearch()
                  "
                >
                  {{ suggestion }}
                </button>
              </div>
            </div>
          </div>
        </BaseCard>
      </section>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as variables;
@use '@/styles/colors' as colors;
@use '@/styles/mixins' as mixins;

.search-view {
  padding: variables.$spacing-4 0 variables.$spacing-8;
  min-height: calc(100vh - 8rem);

  // -------------------------------------------------------------------------
  // HEADER
  // -------------------------------------------------------------------------

  &__header {
    text-align: center;
    margin-bottom: variables.$spacing-6;
  }

  &__title {
    font-size: variables.$font-size-h2;
    margin: 0 0 variables.$spacing-2;
    color: colors.$text-primary;

    @include mixins.width-at-least('medium') {
      font-size: variables.$font-size-h1;
    }
  }

  &__subtitle {
    font-size: variables.$font-size-large;
    color: colors.$text-muted;
    margin: 0;
  }

  // -------------------------------------------------------------------------
  // SEARCH INTERFACE
  // -------------------------------------------------------------------------

  &__search-section {
    margin-bottom: variables.$spacing-6;
  }

  &__search-card {
    max-width: 80rem;
    margin: 0 auto;
  }

  &__search-bar {
    display: flex;
    align-items: center;
    gap: variables.$spacing-2;
    padding: variables.$spacing-1;
    border: 2px solid colors.$border-light;
    border-radius: variables.$border-radius-large;
    background: colors.$bg-card;
    transition: border-color variables.$transition-normal;

    &:focus-within {
      border-color: colors.$primary-green;
    }

    @include mixins.width-less-than('medium') {
      flex-direction: column;
      gap: variables.$spacing-2;
      padding: variables.$spacing-2;
    }
  }

  &__search-icon {
    color: colors.$text-muted;
    margin-left: variables.$spacing-1;

    @include mixins.width-less-than('medium') {
      display: none;
    }
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

    @include mixins.width-less-than('medium') {
      width: 100%;
    }
  }

  &__search-types {
    display: flex;
    gap: variables.$spacing-1;
    margin-top: variables.$spacing-3;
    padding-top: variables.$spacing-3;
    border-top: 1px solid colors.$border-light;
  }

  &__type-tab {
    padding: variables.$spacing-1 variables.$spacing-2;
    border: 1px solid colors.$border-light;
    border-radius: variables.$border-radius-medium;
    background: colors.$bg-card;
    color: colors.$text-muted;
    cursor: pointer;
    transition: all variables.$transition-normal;

    &:hover {
      border-color: colors.$primary-green;
      color: colors.$primary-green;
    }

    &--active {
      background: colors.$primary-green;
      color: colors.$white;
      border-color: colors.$primary-green;
    }
  }

  &__filter-controls {
    display: flex;
    align-items: center;
    gap: variables.$spacing-2;
    margin-top: variables.$spacing-3;
    padding-top: variables.$spacing-3;
    border-top: 1px solid colors.$border-light;
  }

  &__filter-badge {
    width: 0.8rem;
    height: 0.8rem;
    background: colors.$primary-green;
    border-radius: 50%;
    margin-left: variables.$spacing-0_5;
  }

  &__filters {
    margin-top: variables.$spacing-3;
    padding: variables.$spacing-3;
    background: rgba(colors.$bg-secondary, 0.5);
    border-radius: variables.$border-radius-medium;
  }

  &__filter-grid {
    display: grid;
    gap: variables.$spacing-3;

    @include mixins.width-at-least('medium') {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  &__filter-field {
    display: flex;
    flex-direction: column;
    gap: variables.$spacing-1;
  }

  &__filter-label {
    font-weight: variables.$font-weight-medium;
    color: colors.$text-secondary;
    font-size: variables.$font-size-small;
  }

  &__filter-input,
  &__filter-select {
    padding: variables.$spacing-1;
    border: 1px solid colors.$border-light;
    border-radius: variables.$border-radius-medium;
    background: colors.$bg-card;
    color: colors.$text-secondary;
    font-size: variables.$font-size-small;

    &:focus {
      outline: none;
      border-color: colors.$primary-green;
    }
  }

  &__date-range {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: variables.$spacing-1;
  }

  // -------------------------------------------------------------------------
  // SEARCH RESULTS
  // -------------------------------------------------------------------------

  &__results-section {
    max-width: 100rem;
    margin: 0 auto;
  }

  &__results-summary {
    margin-bottom: variables.$spacing-4;

    h2 {
      font-size: variables.$font-size-h3;
      color: colors.$text-secondary;
      margin: 0;
    }
  }

  &__results-heading {
    display: flex;
    align-items: center;
    gap: variables.$spacing-1;
    font-size: variables.$font-size-h4;
    color: colors.$text-secondary;
    margin: 0 0 variables.$spacing-3 0;

    svg {
      color: colors.$primary-green;
    }
  }

  &__results-grid {
    display: grid;
    gap: variables.$spacing-3;
    margin-bottom: variables.$spacing-6;

    @include mixins.width-at-least('medium') {
      grid-template-columns: repeat(2, 1fr);
    }

    @include mixins.width-at-least('large') {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  &__result-card {
    .base-card__content {
      padding: variables.$spacing-2;
    }
  }

  &__tree-result,
  &__user-result {
    display: flex;
    align-items: flex-start;
    gap: variables.$spacing-2;
  }

  &__result-icon {
    color: colors.$primary-green;
    margin-top: 0.2rem;
    flex-shrink: 0;
  }

  &__user-avatar {
    @include mixins.flex-center;
    width: 4rem;
    height: 4rem;
    background: colors.$primary-green;
    color: colors.$white;
    border-radius: 50%;
    font-weight: variables.$font-weight-bold;
    flex-shrink: 0;
  }

  &__result-content {
    flex: 1;
    min-width: 0;

    h4 {
      margin: 0 0 variables.$spacing-0_5;
      color: colors.$text-secondary;
      font-size: variables.$font-size-body;
    }
  }

  &__result-species {
    color: colors.$text-muted;
    font-style: italic;
    font-size: variables.$font-size-small;
    margin: 0 0 variables.$spacing-1;
  }

  &__result-meta {
    display: flex;
    flex-direction: column;
    gap: variables.$spacing-0_5;
    margin-bottom: variables.$spacing-1;

    span {
      display: flex;
      align-items: center;
      gap: variables.$spacing-0_5;
      font-size: variables.$font-size-small;
      color: colors.$text-muted;

      svg {
        color: colors.$primary-green;
      }
    }
  }

  &__result-location,
  &__result-date {
    font-size: variables.$font-size-small;
  }

  &__result-description {
    font-size: variables.$font-size-small;
    color: colors.$text-muted;
    line-height: variables.$line-height-relaxed;
    margin: 0;
  }

  &__user-stats {
    font-size: variables.$font-size-small;
    color: colors.$text-muted;
  }

  // -------------------------------------------------------------------------
  // EMPTY STATES
  // -------------------------------------------------------------------------

  &__no-results,
  &__empty-state {
    max-width: 60rem;
    margin: 0 auto;
  }

  &__no-results-content,
  &__empty-content {
    @include mixins.flex-center;
    flex-direction: column;
    text-align: center;
    padding: variables.$spacing-6;
    color: colors.$text-muted;

    svg {
      color: colors.$primary-green;
      margin-bottom: variables.$spacing-3;
    }

    h2,
    h3 {
      margin: 0 0 variables.$spacing-2;
      color: colors.$text-secondary;
    }

    p {
      margin: 0;
      line-height: variables.$line-height-relaxed;
    }
  }

  &__search-suggestions {
    margin-top: variables.$spacing-4;
    text-align: center;

    h3 {
      font-size: variables.$font-size-body;
      margin: 0 0 variables.$spacing-2;
      color: colors.$text-secondary;
    }
  }

  &__suggestion-tags {
    display: flex;
    flex-wrap: wrap;
    gap: variables.$spacing-1;
    justify-content: center;
  }

  &__suggestion-tag {
    padding: variables.$spacing-1 variables.$spacing-2;
    background: rgba(colors.$primary-green, 0.1);
    color: colors.$primary-green;
    border: 1px solid rgba(colors.$primary-green, 0.2);
    border-radius: variables.$border-radius-medium;
    cursor: pointer;
    transition: all variables.$transition-normal;
    font-size: variables.$font-size-small;

    &:hover {
      background: colors.$primary-green;
      color: colors.$white;
    }
  }

  // -------------------------------------------------------------------------
  // RESPONSIVE ADJUSTMENTS
  // -------------------------------------------------------------------------

  @include mixins.width-less-than('medium') {
    padding: variables.$spacing-3 0 variables.$spacing-6;

    &__results-grid {
      grid-template-columns: 1fr;
    }

    &__filter-grid {
      grid-template-columns: 1fr;
    }
  }
}
</style>
