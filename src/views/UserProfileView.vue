<script setup>
/**
 * UserProfileView Component
 *
 * Public profile view for viewing other users' profiles.
 * Shows public information, statistics, and tree contributions.
 *
 * Features:
 * - Public profile information
 * - User statistics
 * - Tree contributions
 * - Responsive design
 */

import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { useTreeStore } from '@/stores/treeStore'
import { User, TreePine, MapPin, Calendar, ArrowLeft } from 'lucide-vue-next'

import BaseButton from '@/components/BaseButton.vue'
import BaseCard from '@/components/BaseCard.vue'

// ============================================================================
// COMPOSABLES
// ============================================================================

const route = useRoute()
const userStore = useUserStore()
const treeStore = useTreeStore()

// ============================================================================
// PROPS
// ============================================================================

const props = defineProps({
  userId: {
    type: String,
    required: true,
  },
})

// ============================================================================
// REACTIVE STATE
// ============================================================================

const profileUser = ref(null)
const userStats = ref(null)
const isLoading = ref(true)
const error = ref(null)

// ============================================================================
// COMPUTED PROPERTIES
// ============================================================================

const userTrees = computed(() => {
  if (!profileUser.value) return []
  return treeStore.trees.filter((tree) => tree.plantedBy.userId === profileUser.value.id)
})

const userInitials = computed(() => {
  if (!profileUser.value?.name) return '?'
  return profileUser.value.name
    .split(' ')
    .map((name) => name[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

const formattedJoinDate = computed(() => {
  if (!profileUser.value?.joinDate) return ''

  try {
    const date = new Date(profileUser.value.joinDate)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    })
  } catch {
    return profileUser.value.joinDate
  }
})

const userLevel = computed(() => {
  if (!userStats.value) return 'Beginner'

  const treesPlanted = userStats.value.treesPlanted || 0

  if (treesPlanted >= 100) return 'Expert'
  if (treesPlanted >= 50) return 'Advanced'
  if (treesPlanted >= 20) return 'Intermediate'
  if (treesPlanted >= 5) return 'Novice'
  return 'Beginner'
})

// ============================================================================
// METHODS
// ============================================================================

const goBack = () => {
  history.back()
}

// ============================================================================
// LIFECYCLE
// ============================================================================

onMounted(async () => {
  try {
    isLoading.value = true

    // Load user profile and stats
    const [profile, stats] = await Promise.all([
      userStore.fetchProfile(props.userId),
      userStore.fetchStats(props.userId),
    ])

    profileUser.value = profile
    userStats.value = stats

    // Load trees to get user's contributions
    if (treeStore.trees.length === 0) {
      await treeStore.fetchTrees()
    }
  } catch (err) {
    error.value = err.message || 'Failed to load user profile'
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="user-profile-view">
    <div class="container">
      <!-- Loading state -->
      <div v-if="isLoading" class="user-profile-view__loading">
        <User :size="48" class="user-profile-view__loading-icon" />
        <p>Loading profile...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="user-profile-view__error">
        <BaseCard variant="outlined">
          <div class="user-profile-view__error-content">
            <h2>Profile Not Found</h2>
            <p>{{ error }}</p>
            <BaseButton variant="primary" @click="goBack"> Go Back </BaseButton>
          </div>
        </BaseCard>
      </div>

      <!-- Profile content -->
      <div v-else-if="profileUser" class="user-profile-view__content">
        <!-- Header with navigation -->
        <header class="user-profile-view__header">
          <BaseButton variant="ghost" @click="goBack" aria-label="Go back">
            <template #icon-left>
              <ArrowLeft :size="20" />
            </template>
            Back
          </BaseButton>
        </header>

        <!-- Main grid -->
        <div class="user-profile-view__grid">
          <!-- Profile information -->
          <BaseCard class="user-profile-view__info-section">
            <div class="user-profile-view__info-header">
              <div class="user-profile-view__avatar">
                {{ userInitials }}
              </div>
              <div class="user-profile-view__basic-info">
                <h1 class="user-profile-view__name">
                  {{ profileUser.name || 'Anonymous User' }}
                </h1>

                <div v-if="profileUser.joinDate" class="user-profile-view__join-date">
                  <Calendar :size="14" />
                  <span>Member since {{ formattedJoinDate }}</span>
                </div>

                <div class="user-profile-view__level">
                  <strong>Level:</strong>
                  <span class="user-profile-view__level-badge">
                    {{ userLevel }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Bio section -->
            <div v-if="profileUser.bio" class="user-profile-view__bio-section">
              <h3>About</h3>
              <p class="user-profile-view__bio">{{ profileUser.bio }}</p>
            </div>

            <!-- Location section -->
            <div
              v-if="profileUser.location && profileUser.preferences?.shareLocation"
              class="user-profile-view__location-section"
            >
              <h3>Location</h3>
              <div class="user-profile-view__location">
                <MapPin :size="16" />
                <span>
                  {{
                    [
                      profileUser.location.city,
                      profileUser.location.state,
                      profileUser.location.country,
                    ]
                      .filter(Boolean)
                      .join(', ')
                  }}
                </span>
              </div>
            </div>
          </BaseCard>

          <!-- Statistics -->
          <BaseCard class="user-profile-view__stats-section">
            <template #header>
              <h2>{{ profileUser.name }}'s Impact</h2>
            </template>

            <div class="user-profile-view__stats-grid">
              <div class="user-profile-view__stat">
                <TreePine :size="24" class="user-profile-view__stat-icon" />
                <div class="user-profile-view__stat-content">
                  <div class="user-profile-view__stat-number">
                    {{ userStats?.treesPlanted || userTrees.length || 0 }}
                  </div>
                  <div class="user-profile-view__stat-label">Trees Planted</div>
                </div>
              </div>

              <div class="user-profile-view__stat">
                <User :size="24" class="user-profile-view__stat-icon" />
                <div class="user-profile-view__stat-content">
                  <div class="user-profile-view__stat-number">
                    {{ userStats?.treesAdopted || 0 }}
                  </div>
                  <div class="user-profile-view__stat-label">Trees Adopted</div>
                </div>
              </div>

              <div class="user-profile-view__stat">
                <Calendar :size="24" class="user-profile-view__stat-icon" />
                <div class="user-profile-view__stat-content">
                  <div class="user-profile-view__stat-number">
                    {{ userStats?.communityEvents || 0 }}
                  </div>
                  <div class="user-profile-view__stat-label">Events Joined</div>
                </div>
              </div>
            </div>
          </BaseCard>

          <!-- Trees contributed -->
          <BaseCard class="user-profile-view__trees-section">
            <template #header>
              <h2>Trees by {{ profileUser.name }}</h2>
            </template>

            <div v-if="userTrees.length === 0" class="user-profile-view__no-trees">
              <TreePine :size="48" />
              <p>No trees shared yet</p>
            </div>

            <div v-else class="user-profile-view__trees-grid">
              <div
                v-for="tree in userTrees.slice(0, 6)"
                :key="tree.id"
                class="user-profile-view__tree-card"
              >
                <div class="user-profile-view__tree-info">
                  <TreePine :size="20" />
                  <div>
                    <h4>{{ tree.name }}</h4>
                    <p>{{ tree.species }}</p>
                    <small v-if="tree.location.address">
                      {{ tree.location.address }}
                    </small>
                  </div>
                </div>
                <BaseButton variant="ghost" size="small" :href="`/tree/${tree.id}`">
                  View
                </BaseButton>
              </div>

              <div v-if="userTrees.length > 6" class="user-profile-view__more-trees">
                <p>And {{ userTrees.length - 6 }} more trees...</p>
              </div>
            </div>
          </BaseCard>

          <!-- Badges section -->
          <BaseCard
            v-if="profileUser.badges && profileUser.badges.length > 0"
            class="user-profile-view__badges-section"
          >
            <template #header>
              <h2>Achievements</h2>
            </template>

            <div class="user-profile-view__badges-grid">
              <div
                v-for="badge in profileUser.badges"
                :key="badge"
                class="user-profile-view__badge"
              >
                <TreePine :size="20" />
                <span>{{ badge }}</span>
              </div>
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

.user-profile-view {
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
    margin-bottom: variables.$spacing-6;
  }

  // -------------------------------------------------------------------------
  // CONTENT GRID
  // -------------------------------------------------------------------------

  &__grid {
    display: grid;
    gap: variables.$spacing-4;

    @include mixins.width-at-least('large') {
      grid-template-columns: 1fr 1fr;
    }
  }

  &__info-section {
    @include mixins.width-at-least('large') {
      grid-column: 1 / -1;
    }
  }

  // -------------------------------------------------------------------------
  // PROFILE INFORMATION
  // -------------------------------------------------------------------------

  &__info-header {
    display: flex;
    align-items: center;
    gap: variables.$spacing-3;
    margin-bottom: variables.$spacing-4;
  }

  &__avatar {
    @include mixins.flex-center;
    width: 8rem;
    height: 8rem;
    background: colors.$primary-green;
    color: colors.$white;
    border-radius: 50%;
    font-weight: variables.$font-weight-bold;
    font-size: variables.$font-size-h3;
    flex-shrink: 0;
  }

  &__basic-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: variables.$spacing-1;
  }

  &__name {
    margin: 0;
    color: colors.$text-secondary;
    font-size: variables.$font-size-h4;
  }

  &__join-date {
    display: flex;
    align-items: center;
    gap: variables.$spacing-0_5;
    color: colors.$text-muted;
    font-size: variables.$font-size-small;

    svg {
      color: colors.$primary-green;
    }
  }

  &__level {
    display: flex;
    align-items: center;
    gap: variables.$spacing-1;

    strong {
      color: colors.$text-secondary;
      font-size: variables.$font-size-small;
    }
  }

  &__level-badge {
    padding: variables.$spacing-0_5 variables.$spacing-1;
    background: colors.$primary-green;
    color: colors.$white;
    border-radius: variables.$border-radius-small;
    font-size: variables.$font-size-small;
    font-weight: variables.$font-weight-medium;
  }

  // Bio and location sections
  &__bio-section,
  &__location-section {
    margin-top: variables.$spacing-3;

    h3 {
      margin: 0 0 variables.$spacing-2;
      color: colors.$text-secondary;
      font-size: variables.$font-size-large;
    }
  }

  &__bio {
    margin: 0;
    color: colors.$text-muted;
    line-height: variables.$line-height-relaxed;
  }

  &__location {
    display: flex;
    align-items: center;
    gap: variables.$spacing-1;
    color: colors.$text-muted;

    svg {
      color: colors.$primary-green;
    }
  }

  // -------------------------------------------------------------------------
  // STATISTICS SECTION
  // -------------------------------------------------------------------------

  &__stats-grid {
    display: grid;
    gap: variables.$spacing-3;

    @include mixins.width-at-least('medium') {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  &__stat {
    display: flex;
    align-items: center;
    gap: variables.$spacing-2;
    padding: variables.$spacing-2;
    background: rgba(colors.$primary-green, 0.05);
    border-radius: variables.$border-radius-medium;
  }

  &__stat-icon {
    color: colors.$primary-green;
    flex-shrink: 0;
  }

  &__stat-content {
    display: flex;
    flex-direction: column;
  }

  &__stat-number {
    font-size: variables.$font-size-h4;
    font-weight: variables.$font-weight-bold;
    color: colors.$text-secondary;
    line-height: 1;
  }

  &__stat-label {
    font-size: variables.$font-size-small;
    color: colors.$text-muted;
  }

  // -------------------------------------------------------------------------
  // TREES SECTION
  // -------------------------------------------------------------------------

  &__no-trees {
    @include mixins.flex-center;
    flex-direction: column;
    padding: variables.$spacing-6;
    color: colors.$text-muted;

    svg {
      color: colors.$primary-green;
      margin-bottom: variables.$spacing-2;
    }

    p {
      margin: 0;
    }
  }

  &__trees-grid {
    display: grid;
    gap: variables.$spacing-2;
  }

  &__tree-card {
    @include mixins.flex-between;
    padding: variables.$spacing-2;
    border: 1px solid colors.$border-light;
    border-radius: variables.$border-radius-medium;
    background: colors.$bg-card;
  }

  &__tree-info {
    display: flex;
    align-items: flex-start;
    gap: variables.$spacing-2;
    flex: 1;

    svg {
      color: colors.$primary-green;
      margin-top: 0.2rem;
      flex-shrink: 0;
    }

    h4 {
      margin: 0 0 variables.$spacing-0_5;
      color: colors.$text-secondary;
      font-size: variables.$font-size-body;
    }

    p {
      margin: 0 0 variables.$spacing-0_5;
      color: colors.$text-muted;
      font-size: variables.$font-size-small;
      font-style: italic;
    }

    small {
      color: colors.$text-muted;
      font-size: variables.$font-size-small;
    }
  }

  &__more-trees {
    text-align: center;
    color: colors.$text-muted;
    font-style: italic;
    padding: variables.$spacing-2;

    p {
      margin: 0;
    }
  }

  // -------------------------------------------------------------------------
  // BADGES SECTION
  // -------------------------------------------------------------------------

  &__badges-grid {
    display: grid;
    gap: variables.$spacing-2;
    grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
  }

  &__badge {
    display: flex;
    align-items: center;
    gap: variables.$spacing-1;
    padding: variables.$spacing-2;
    background: rgba(colors.$primary-green, 0.1);
    border-radius: variables.$border-radius-medium;
    color: colors.$primary-green;
    font-weight: variables.$font-weight-medium;

    svg {
      flex-shrink: 0;
    }
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

    &__info-header {
      flex-direction: column;
      text-align: center;
    }

    &__avatar {
      width: 6rem;
      height: 6rem;
      font-size: variables.$font-size-h4;
    }

    &__stats-grid {
      grid-template-columns: 1fr;
    }

    &__badges-grid {
      grid-template-columns: 1fr;
    }
  }
}
</style>
