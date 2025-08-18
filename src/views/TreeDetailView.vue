<script setup>
/**
 * TreeDetailView Component
 *
 * Detailed view of a single tree with photo, information,
 * location map, and community interactions.
 *
 * Features:
 * - Tree photo gallery
 * - Detailed tree information
 * - Location display
 * - Planter information
 * - Edit capabilities (for tree owner)
 * - Responsive design
 */

import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTreeStore } from '@/stores/treeStore'
import { useUserStore } from '@/stores/userStore'
import { MapPin, Calendar, User, Edit, ArrowLeft, TreePine } from 'lucide-vue-next'

import BaseButton from '@/components/BaseButton.vue'
import BaseCard from '@/components/BaseCard.vue'
import BaseMap from '@/components/BaseMap.vue'

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

const treeId = route.params.id
const isLoading = ref(true)
const error = ref(null)

// ============================================================================
// COMPUTED PROPERTIES
// ============================================================================

const tree = computed(() => treeStore.currentTree)

const canEdit = computed(() => {
  if (!tree.value || !userStore.isLoggedIn) return false
  return tree.value.plantedBy.userId === userStore.user?.id
})

const formattedDate = computed(() => {
  if (!tree.value?.datePlanted) return ''

  try {
    const date = new Date(tree.value.datePlanted)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return tree.value.datePlanted
  }
})

const formattedCoordinates = computed(() => {
  if (!tree.value?.location) return ''

  const { latitude, longitude } = tree.value.location
  return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
})

// ============================================================================
// METHODS
// ============================================================================

const goBack = () => {
  router.go(-1)
}

const editTree = () => {
  router.push(`/tree/${treeId}/edit`)
}

const viewOnMap = () => {
  router.push({
    name: 'Map',
    query: {
      lat: tree.value.location.latitude,
      lng: tree.value.location.longitude,
      zoom: 15,
    },
  })
}

const viewPlanter = () => {
  if (tree.value?.plantedBy?.userId) {
    router.push(`/profile/${tree.value.plantedBy.userId}`)
  }
}

// ============================================================================
// LIFECYCLE
// ============================================================================

onMounted(async () => {
  try {
    isLoading.value = true
    await treeStore.fetchTreeById(treeId)
  } catch (err) {
    error.value = err.message || 'Failed to load tree details'
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="tree-detail-view">
    <div class="container">
      <!-- Loading state -->
      <div v-if="isLoading" class="tree-detail-view__loading">
        <TreePine :size="48" class="tree-detail-view__loading-icon" />
        <p>Loading tree details...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="tree-detail-view__error">
        <BaseCard variant="outlined">
          <div class="tree-detail-view__error-content">
            <h2>Tree Not Found</h2>
            <p>{{ error }}</p>
            <BaseButton variant="primary" @click="goBack"> Go Back </BaseButton>
          </div>
        </BaseCard>
      </div>

      <!-- Tree details -->
      <div v-else-if="tree" class="tree-detail-view__content">
        <!-- Header with navigation -->
        <header class="tree-detail-view__header">
          <BaseButton variant="ghost" @click="goBack" aria-label="Go back">
            <template #icon-left>
              <ArrowLeft :size="20" />
            </template>
            Back
          </BaseButton>

          <div class="tree-detail-view__header-actions">
            <BaseButton v-if="canEdit" variant="secondary" @click="editTree">
              <template #icon-left>
                <Edit :size="16" />
              </template>
              Edit Tree
            </BaseButton>

            <BaseButton variant="primary" @click="viewOnMap">
              <template #icon-left>
                <MapPin :size="16" />
              </template>
              View on Map
            </BaseButton>
          </div>
        </header>

        <!-- Main content grid -->
        <div class="tree-detail-view__grid">
          <!-- Photo section -->
          <BaseCard class="tree-detail-view__photo-section">
            <div class="tree-detail-view__photo-container">
              <img
                v-if="tree.photos && tree.photos.length > 0"
                :src="tree.photos[0]"
                :alt="tree.name"
                class="tree-detail-view__photo"
              />
              <div v-else class="tree-detail-view__no-photo">
                <TreePine :size="64" />
                <p>No photo available</p>
              </div>
            </div>
          </BaseCard>

          <!-- Tree information -->
          <BaseCard class="tree-detail-view__info-section">
            <template #header>
              <h1 class="tree-detail-view__title">{{ tree.name }}</h1>
            </template>

            <div class="tree-detail-view__info-content">
              <!-- Species -->
              <div class="tree-detail-view__info-item">
                <strong class="tree-detail-view__info-label">Species:</strong>
                <span class="tree-detail-view__info-value">{{ tree.species }}</span>
              </div>

              <!-- Date planted -->
              <div class="tree-detail-view__info-item">
                <Calendar :size="16" class="tree-detail-view__info-icon" />
                <strong class="tree-detail-view__info-label">Planted:</strong>
                <span class="tree-detail-view__info-value">{{ formattedDate }}</span>
              </div>

              <!-- Location -->
              <div class="tree-detail-view__info-item">
                <MapPin :size="16" class="tree-detail-view__info-icon" />
                <strong class="tree-detail-view__info-label">Location:</strong>
                <span class="tree-detail-view__info-value">
                  {{ tree.location.address || formattedCoordinates }}
                </span>
              </div>

              <!-- Status -->
              <div v-if="tree.status" class="tree-detail-view__info-item">
                <strong class="tree-detail-view__info-label">Status:</strong>
                <span
                  class="tree-detail-view__status-badge"
                  :class="`tree-detail-view__status-badge--${tree.status}`"
                >
                  {{ tree.status }}
                </span>
              </div>

              <!-- Description -->
              <div v-if="tree.description" class="tree-detail-view__description">
                <strong class="tree-detail-view__info-label">Description:</strong>
                <p class="tree-detail-view__description-text">{{ tree.description }}</p>
              </div>

              <!-- Tags -->
              <div v-if="tree.tags && tree.tags.length > 0" class="tree-detail-view__tags">
                <strong class="tree-detail-view__info-label">Tags:</strong>
                <div class="tree-detail-view__tag-list">
                  <span v-for="tag in tree.tags" :key="tag" class="tree-detail-view__tag">
                    {{ tag }}
                  </span>
                </div>
              </div>
            </div>
          </BaseCard>

          <!-- Location section -->
          <BaseCard class="tree-detail-view__location-section">
            <template #header>
              <h2>Location Details</h2>
            </template>

            <div class="tree-detail-view__location-content">
              <!-- Coordinates -->
              <div class="tree-detail-view__coordinates">
                <strong>Coordinates:</strong>
                <code>{{ formattedCoordinates }}</code>
              </div>

              <!-- Address -->
              <div v-if="tree.location.address" class="tree-detail-view__address">
                <strong>Address:</strong>
                <span>{{ tree.location.address }}</span>
              </div>

              <!-- Interactive map -->
              <BaseMap
                v-if="tree"
                :trees="[tree]"
                :center="{ lat: tree.location.latitude, lng: tree.location.longitude }"
                :zoom="15"
                height="250px"
                :interactive="false"
                :show-controls="false"
              />
            </div>
          </BaseCard>

          <!-- Planter information -->
          <BaseCard class="tree-detail-view__planter-section">
            <template #header>
              <h2>Planted By</h2>
            </template>

            <div class="tree-detail-view__planter-content">
              <div class="tree-detail-view__planter-info">
                <div class="tree-detail-view__planter-avatar">
                  {{ tree.plantedBy.initials }}
                </div>

                <div class="tree-detail-view__planter-details">
                  <h3 class="tree-detail-view__planter-name">
                    {{ tree.plantedBy.name }}
                  </h3>

                  <p class="tree-detail-view__planter-stats">
                    Trees planted: {{ tree.plantedBy.treesPlanted || 1 }}
                  </p>
                </div>
              </div>

              <BaseButton variant="secondary" size="small" @click="viewPlanter">
                <template #icon-left>
                  <User :size="16" />
                </template>
                View Profile
              </BaseButton>
            </div>
          </BaseCard>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as variables;
@use '@/styles/colors' as colors;
@use '@/styles/mixins' as mixins;

.tree-detail-view {
  padding: variables.$spacing-4 0 variables.$spacing-8;
  min-height: calc(100vh - 8rem);

  // -------------------------------------------------------------------------
  // LOADING & ERROR STATES
  // -------------------------------------------------------------------------

  &__loading {
    @include mixins.flex-center;
    flex-direction: column;
    min-height: 40rem;
    color: colors.$text-muted;

    p {
      margin-top: variables.$spacing-2;
      font-size: variables.$font-size-large;
    }
  }

  &__loading-icon {
    color: colors.$primary-green;
    animation: pulse 2s ease-in-out infinite;
  }

  &__error {
    max-width: 60rem;
    margin: 0 auto;
  }

  &__error-content {
    text-align: center;
    padding: variables.$spacing-6;

    h2 {
      margin: 0 0 variables.$spacing-2;
      color: colors.$text-secondary;
    }

    p {
      color: colors.$text-muted;
      margin: 0 0 variables.$spacing-4;
    }
  }

  // -------------------------------------------------------------------------
  // HEADER
  // -------------------------------------------------------------------------

  &__header {
    @include mixins.flex-between;
    margin-bottom: variables.$spacing-6;
    gap: variables.$spacing-3;

    @include mixins.width-less-than('medium') {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  &__header-actions {
    display: flex;
    gap: variables.$spacing-2;

    @include mixins.width-less-than('medium') {
      width: 100%;
      justify-content: space-between;
    }

    @include mixins.width-less-than('small') {
      flex-direction: column;
    }
  }

  // -------------------------------------------------------------------------
  // CONTENT GRID
  // -------------------------------------------------------------------------

  &__grid {
    display: grid;
    gap: variables.$spacing-4;

    @include mixins.width-at-least('large') {
      grid-template-columns: 1fr 1fr;
      grid-template-rows: auto auto auto;
    }
  }

  &__photo-section {
    @include mixins.width-at-least('large') {
      grid-row: 1 / 3;
    }
  }

  &__info-section {
    @include mixins.width-at-least('large') {
      grid-row: 1 / 2;
    }
  }

  &__location-section {
    @include mixins.width-at-least('large') {
      grid-row: 2 / 3;
    }
  }

  &__planter-section {
    @include mixins.width-at-least('large') {
      grid-column: 1 / -1;
    }
  }

  // -------------------------------------------------------------------------
  // PHOTO SECTION
  // -------------------------------------------------------------------------

  &__photo-container {
    @include mixins.flex-center;
    min-height: 40rem;
  }

  &__photo {
    max-width: 100%;
    max-height: 60rem;
    border-radius: variables.$border-radius-large;
    box-shadow: variables.$shadow-medium;
  }

  &__no-photo {
    @include mixins.flex-center;
    flex-direction: column;
    color: colors.$text-muted;
    min-height: 30rem;

    svg {
      margin-bottom: variables.$spacing-2;
    }

    p {
      margin: 0;
    }
  }

  // -------------------------------------------------------------------------
  // TREE INFORMATION
  // -------------------------------------------------------------------------

  &__title {
    margin: 0;
    color: colors.$text-secondary;
  }

  &__info-content {
    display: flex;
    flex-direction: column;
    gap: variables.$spacing-3;
  }

  &__info-item {
    display: flex;
    align-items: center;
    gap: variables.$spacing-1;
    flex-wrap: wrap;
  }

  &__info-icon {
    color: colors.$primary-green;
    flex-shrink: 0;
  }

  &__info-label {
    color: colors.$text-secondary;
    font-weight: variables.$font-weight-medium;
  }

  &__info-value {
    color: colors.$text-muted;
  }

  &__status-badge {
    padding: variables.$spacing-0_5 variables.$spacing-1;
    border-radius: variables.$border-radius-small;
    font-size: variables.$font-size-small;
    font-weight: variables.$font-weight-medium;
    text-transform: capitalize;

    &--healthy {
      background: rgba(colors.$success, 0.1);
      color: colors.$success;
    }

    &--growing {
      background: rgba(colors.$primary-green, 0.1);
      color: colors.$primary-green;
    }

    &--needs-care {
      background: rgba(colors.$warning, 0.1);
      color: colors.$warning;
    }
  }

  &__description {
    margin-top: variables.$spacing-1;

    .tree-detail-view__info-label {
      display: block;
      margin-bottom: variables.$spacing-1;
    }
  }

  &__description-text {
    color: colors.$text-muted;
    line-height: variables.$line-height-relaxed;
    margin: 0;
  }

  &__tags {
    margin-top: variables.$spacing-1;

    .tree-detail-view__info-label {
      display: block;
      margin-bottom: variables.$spacing-1;
    }
  }

  &__tag-list {
    display: flex;
    flex-wrap: wrap;
    gap: variables.$spacing-1;
  }

  &__tag {
    padding: variables.$spacing-0_5 variables.$spacing-1;
    background: rgba(colors.$primary-green, 0.1);
    color: colors.$primary-green;
    border-radius: variables.$border-radius-small;
    font-size: variables.$font-size-small;
  }

  // -------------------------------------------------------------------------
  // LOCATION SECTION
  // -------------------------------------------------------------------------

  &__location-content {
    display: flex;
    flex-direction: column;
    gap: variables.$spacing-3;
  }

  &__coordinates,
  &__address {
    display: flex;
    flex-direction: column;
    gap: variables.$spacing-0_5;

    strong {
      color: colors.$text-secondary;
      font-weight: variables.$font-weight-medium;
    }

    code {
      font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
      background: rgba(colors.$text-muted, 0.1);
      padding: variables.$spacing-0_5;
      border-radius: variables.$border-radius-small;
      font-size: variables.$font-size-small;
    }

    span {
      color: colors.$text-muted;
    }
  }

  // -------------------------------------------------------------------------
  // PLANTER SECTION
  // -------------------------------------------------------------------------

  &__planter-content {
    @include mixins.flex-between;
    gap: variables.$spacing-3;

    @include mixins.width-less-than('medium') {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  &__planter-info {
    display: flex;
    align-items: center;
    gap: variables.$spacing-2;
  }

  &__planter-avatar {
    @include mixins.flex-center;
    width: 5rem;
    height: 5rem;
    background: colors.$primary-green;
    color: colors.$white;
    border-radius: 50%;
    font-weight: variables.$font-weight-bold;
    font-size: variables.$font-size-large;
  }

  &__planter-details {
    display: flex;
    flex-direction: column;
    gap: variables.$spacing-0_5;
  }

  &__planter-name {
    margin: 0;
    color: colors.$text-secondary;
    font-size: variables.$font-size-large;
  }

  &__planter-stats {
    color: colors.$text-muted;
    font-size: variables.$font-size-small;
    margin: 0;
  }

  // -------------------------------------------------------------------------
  // ANIMATIONS
  // -------------------------------------------------------------------------

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  // -------------------------------------------------------------------------
  // RESPONSIVE ADJUSTMENTS
  // -------------------------------------------------------------------------

  @include mixins.width-less-than('medium') {
    padding: variables.$spacing-3 0 variables.$spacing-6;

    &__photo-container {
      min-height: 25rem;
    }

    &__no-photo {
      min-height: 20rem;
    }

    &__map-placeholder {
      min-height: 15rem;
      padding: variables.$spacing-3;
    }
  }
}
</style>
