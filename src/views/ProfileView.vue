<script setup>
/**
 * ProfileView Component
 *
 * User profile page showing personal information, statistics,
 * and tree contributions. Allows editing profile information.
 *
 * Features:
 * - User profile information
 * - Statistics and achievements
 * - Tree contributions list
 * - Profile editing
 * - Settings management
 */

import { ref, onMounted, computed } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useTreeStore } from '@/stores/treeStore'
import { User, Edit, TreePine, MapPin, Calendar, Settings } from 'lucide-vue-next'

import BaseButton from '@/components/BaseButton.vue'
import BaseCard from '@/components/BaseCard.vue'

// ============================================================================
// COMPOSABLES
// ============================================================================

const userStore = useUserStore()
const treeStore = useTreeStore()

// ============================================================================
// REACTIVE STATE
// ============================================================================

const isEditing = ref(false)
const isLoading = ref(true)
const editForm = ref({
  name: '',
  bio: '',
  location: {
    city: '',
    state: '',
    country: '',
  },
})

// ============================================================================
// COMPUTED PROPERTIES
// ============================================================================

const user = computed(() => userStore.user)
const userProfile = computed(() => userStore.fullProfile)
const userStats = computed(() => userStore.stats)

const userTrees = computed(() => {
  if (!user.value) return []
  return treeStore.trees.filter((tree) => tree.plantedBy.userId === user.value.id)
})

const formattedJoinDate = computed(() => {
  if (!user.value?.joinDate) return ''

  try {
    const date = new Date(user.value.joinDate)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    })
  } catch {
    return user.value.joinDate
  }
})

// ============================================================================
// METHODS
// ============================================================================

const startEditing = () => {
  if (userProfile.value) {
    editForm.value = {
      name: user.value.name || '',
      bio: userProfile.value.bio || '',
      location: {
        city: userProfile.value.location?.city || '',
        state: userProfile.value.location?.state || '',
        country: userProfile.value.location?.country || '',
      },
    }
  }
  isEditing.value = true
}

const cancelEditing = () => {
  isEditing.value = false
  editForm.value = {
    name: '',
    bio: '',
    location: { city: '', state: '', country: '' },
  }
}

const saveProfile = async () => {
  try {
    await userStore.updateProfile({
      name: editForm.value.name,
      bio: editForm.value.bio,
      location: editForm.value.location,
    })
    isEditing.value = false
  } catch (error) {
    console.error('Failed to update profile:', error)
    // TODO: Show error message to user
  }
}

// ============================================================================
// LIFECYCLE
// ============================================================================

onMounted(async () => {
  try {
    isLoading.value = true

    // Load user profile and stats
    if (user.value?.id) {
      await Promise.all([
        userStore.fetchProfile(),
        userStore.fetchStats(),
        treeStore.fetchTrees(), // To get user's trees
      ])
    }
  } catch (error) {
    console.error('Failed to load profile data:', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="profile-view">
    <div class="container">
      <!-- Loading state -->
      <div v-if="isLoading" class="profile-view__loading">
        <User :size="48" class="profile-view__loading-icon" />
        <p>Loading profile...</p>
      </div>

      <!-- Profile content -->
      <div v-else class="profile-view__content">
        <!-- Header -->
        <header class="profile-view__header">
          <h1 class="profile-view__title">My Profile</h1>
          <BaseButton v-if="!isEditing" variant="secondary" @click="startEditing">
            <template #icon-left>
              <Edit :size="16" />
            </template>
            Edit Profile
          </BaseButton>
        </header>

        <!-- Main grid -->
        <div class="profile-view__grid">
          <!-- Profile information -->
          <BaseCard class="profile-view__info-section">
            <template #header>
              <div class="profile-view__info-header">
                <div class="profile-view__avatar">
                  {{ userStore.userInitials }}
                </div>
                <div class="profile-view__basic-info">
                  <h2 v-if="!isEditing" class="profile-view__name">
                    {{ user?.name || 'Anonymous User' }}
                  </h2>
                  <input
                    v-else
                    v-model="editForm.name"
                    type="text"
                    class="profile-view__name-input"
                    placeholder="Your name"
                  />

                  <p class="profile-view__email">{{ user?.email }}</p>

                  <div v-if="user?.joinDate" class="profile-view__join-date">
                    <Calendar :size="14" />
                    <span>Member since {{ formattedJoinDate }}</span>
                  </div>
                </div>
              </div>
            </template>

            <!-- Bio section -->
            <div class="profile-view__bio-section">
              <h3>About</h3>
              <div v-if="!isEditing" class="profile-view__bio">
                <p v-if="userProfile?.bio">{{ userProfile.bio }}</p>
                <p v-else class="profile-view__no-bio">
                  Share something about yourself and your passion for trees!
                </p>
              </div>
              <textarea
                v-else
                v-model="editForm.bio"
                class="profile-view__bio-input"
                placeholder="Tell us about yourself and your passion for trees..."
                rows="4"
              ></textarea>
            </div>

            <!-- Location section -->
            <div class="profile-view__location-section">
              <h3>Location</h3>
              <div v-if="!isEditing" class="profile-view__location">
                <MapPin :size="16" />
                <span
                  v-if="
                    userProfile?.location?.city ||
                    userProfile?.location?.state ||
                    userProfile?.location?.country
                  "
                >
                  {{
                    [
                      userProfile.location.city,
                      userProfile.location.state,
                      userProfile.location.country,
                    ]
                      .filter(Boolean)
                      .join(', ')
                  }}
                </span>
                <span v-else class="profile-view__no-location"> Location not set </span>
              </div>
              <div v-else class="profile-view__location-inputs">
                <input
                  v-model="editForm.location.city"
                  type="text"
                  placeholder="City"
                  class="profile-view__location-input"
                />
                <input
                  v-model="editForm.location.state"
                  type="text"
                  placeholder="State/Province"
                  class="profile-view__location-input"
                />
                <input
                  v-model="editForm.location.country"
                  type="text"
                  placeholder="Country"
                  class="profile-view__location-input"
                />
              </div>
            </div>

            <!-- Edit actions -->
            <div v-if="isEditing" class="profile-view__edit-actions">
              <BaseButton variant="ghost" @click="cancelEditing"> Cancel </BaseButton>
              <BaseButton variant="primary" @click="saveProfile"> Save Changes </BaseButton>
            </div>
          </BaseCard>

          <!-- Statistics -->
          <BaseCard class="profile-view__stats-section">
            <template #header>
              <h2>Your Impact</h2>
            </template>

            <div class="profile-view__stats-grid">
              <div class="profile-view__stat">
                <TreePine :size="24" class="profile-view__stat-icon" />
                <div class="profile-view__stat-content">
                  <div class="profile-view__stat-number">
                    {{ userStats?.treesPlanted || userTrees.length || 0 }}
                  </div>
                  <div class="profile-view__stat-label">Trees Planted</div>
                </div>
              </div>

              <div class="profile-view__stat">
                <User :size="24" class="profile-view__stat-icon" />
                <div class="profile-view__stat-content">
                  <div class="profile-view__stat-number">
                    {{ userStats?.treesAdopted || 0 }}
                  </div>
                  <div class="profile-view__stat-label">Trees Adopted</div>
                </div>
              </div>

              <div class="profile-view__stat">
                <Calendar :size="24" class="profile-view__stat-icon" />
                <div class="profile-view__stat-content">
                  <div class="profile-view__stat-number">
                    {{ userStats?.communityEvents || 0 }}
                  </div>
                  <div class="profile-view__stat-label">Events Joined</div>
                </div>
              </div>
            </div>

            <!-- User level -->
            <div class="profile-view__level">
              <strong>Level:</strong>
              <span class="profile-view__level-badge">
                {{ userStore.userLevel }}
              </span>
            </div>
          </BaseCard>

          <!-- Trees contributed -->
          <BaseCard class="profile-view__trees-section">
            <template #header>
              <h2>Your Trees</h2>
            </template>

            <div v-if="userTrees.length === 0" class="profile-view__no-trees">
              <TreePine :size="48" />
              <p>You haven't added any trees yet</p>
              <BaseButton variant="primary" href="/add-tree"> Add Your First Tree </BaseButton>
            </div>

            <div v-else class="profile-view__trees-grid">
              <div v-for="tree in userTrees" :key="tree.id" class="profile-view__tree-card">
                <div class="profile-view__tree-info">
                  <TreePine :size="20" />
                  <div>
                    <h4>{{ tree.name }}</h4>
                    <p>{{ tree.species }}</p>
                  </div>
                </div>
                <BaseButton variant="ghost" size="small" :href="`/tree/${tree.id}`">
                  View
                </BaseButton>
              </div>
            </div>
          </BaseCard>

          <!-- Settings -->
          <BaseCard class="profile-view__settings-section">
            <template #header>
              <h2>Settings</h2>
            </template>

            <div class="profile-view__settings-content">
              <div class="profile-view__setting-item">
                <div class="profile-view__setting-info">
                  <strong>Public Profile</strong>
                  <p>Allow others to see your profile and tree contributions</p>
                </div>
                <input
                  v-model="userStore.preferences.publicProfile"
                  type="checkbox"
                  class="profile-view__setting-toggle"
                />
              </div>

              <div class="profile-view__setting-item">
                <div class="profile-view__setting-info">
                  <strong>Share Location</strong>
                  <p>Show your general location to other users</p>
                </div>
                <input
                  v-model="userStore.preferences.shareLocation"
                  type="checkbox"
                  class="profile-view__setting-toggle"
                />
              </div>

              <div class="profile-view__setting-item">
                <div class="profile-view__setting-info">
                  <strong>Notifications</strong>
                  <p>Receive updates about community activities</p>
                </div>
                <input
                  v-model="userStore.preferences.notifications"
                  type="checkbox"
                  class="profile-view__setting-toggle"
                />
              </div>
            </div>

            <template #actions>
              <BaseButton variant="secondary" size="small">
                <template #icon-left>
                  <Settings :size="16" />
                </template>
                Advanced Settings
              </BaseButton>
            </template>
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

.profile-view {
  padding: variables.$spacing-4 0 variables.$spacing-8;
  min-height: calc(100vh - 8rem);

  // -------------------------------------------------------------------------
  // LOADING STATE
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

  &__title {
    font-size: variables.$font-size-h2;
    margin: 0;
    color: colors.$text-primary;

    @include mixins.width-at-least('medium') {
      font-size: variables.$font-size-h1;
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
    gap: variables.$spacing-0_5;
  }

  &__name {
    margin: 0;
    color: colors.$text-secondary;
    font-size: variables.$font-size-h4;
  }

  &__name-input {
    font-size: variables.$font-size-h4;
    font-weight: variables.$font-weight-semibold;
    color: colors.$text-secondary;
    background: colors.$bg-card;
    border: 2px solid colors.$border-light;
    border-radius: variables.$border-radius-medium;
    padding: variables.$spacing-1;

    &:focus {
      outline: none;
      border-color: colors.$primary-green;
    }
  }

  &__email {
    color: colors.$text-muted;
    margin: 0;
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

  // Bio section
  &__bio-section,
  &__location-section {
    margin-top: variables.$spacing-4;

    h3 {
      margin: 0 0 variables.$spacing-2;
      color: colors.$text-secondary;
      font-size: variables.$font-size-large;
    }
  }

  &__bio {
    p {
      margin: 0;
      color: colors.$text-muted;
      line-height: variables.$line-height-relaxed;
    }
  }

  &__no-bio {
    font-style: italic;
    color: colors.$text-muted;
  }

  &__bio-input {
    width: 100%;
    padding: variables.$spacing-1_5;
    border: 2px solid colors.$border-light;
    border-radius: variables.$border-radius-medium;
    background: colors.$bg-card;
    color: colors.$text-secondary;
    font-family: inherit;
    resize: vertical;

    &:focus {
      outline: none;
      border-color: colors.$primary-green;
    }
  }

  // Location section
  &__location {
    display: flex;
    align-items: center;
    gap: variables.$spacing-1;
    color: colors.$text-muted;

    svg {
      color: colors.$primary-green;
    }
  }

  &__no-location {
    font-style: italic;
  }

  &__location-inputs {
    display: grid;
    gap: variables.$spacing-2;

    @include mixins.width-at-least('medium') {
      grid-template-columns: 1fr 1fr 1fr;
    }
  }

  &__location-input {
    padding: variables.$spacing-1_5;
    border: 2px solid colors.$border-light;
    border-radius: variables.$border-radius-medium;
    background: colors.$bg-card;
    color: colors.$text-secondary;

    &:focus {
      outline: none;
      border-color: colors.$primary-green;
    }
  }

  // Edit actions
  &__edit-actions {
    margin-top: variables.$spacing-4;
    @include mixins.flex-between;
    gap: variables.$spacing-2;
    padding-top: variables.$spacing-3;
    border-top: 1px solid colors.$border-light;

    @include mixins.width-less-than('medium') {
      flex-direction: column;
    }
  }

  // -------------------------------------------------------------------------
  // STATISTICS SECTION
  // -------------------------------------------------------------------------

  &__stats-grid {
    display: grid;
    gap: variables.$spacing-3;
    margin-bottom: variables.$spacing-4;

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

  &__level {
    display: flex;
    align-items: center;
    gap: variables.$spacing-1;
    padding: variables.$spacing-2;
    background: rgba(colors.$primary-green, 0.1);
    border-radius: variables.$border-radius-medium;

    strong {
      color: colors.$text-secondary;
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
      margin: 0 0 variables.$spacing-3;
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
    align-items: center;
    gap: variables.$spacing-2;

    svg {
      color: colors.$primary-green;
    }

    h4 {
      margin: 0;
      color: colors.$text-secondary;
      font-size: variables.$font-size-body;
    }

    p {
      margin: 0;
      color: colors.$text-muted;
      font-size: variables.$font-size-small;
    }
  }

  // -------------------------------------------------------------------------
  // SETTINGS SECTION
  // -------------------------------------------------------------------------

  &__settings-content {
    display: flex;
    flex-direction: column;
    gap: variables.$spacing-3;
  }

  &__setting-item {
    @include mixins.flex-between;
    gap: variables.$spacing-3;
    padding: variables.$spacing-2;
    border: 1px solid colors.$border-light;
    border-radius: variables.$border-radius-medium;

    @include mixins.width-less-than('medium') {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  &__setting-info {
    flex: 1;

    strong {
      display: block;
      color: colors.$text-secondary;
      margin-bottom: variables.$spacing-0_5;
    }

    p {
      margin: 0;
      color: colors.$text-muted;
      font-size: variables.$font-size-small;
    }
  }

  &__setting-toggle {
    width: 2rem;
    height: 2rem;
    accent-color: colors.$primary-green;
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
  }
}
</style>
