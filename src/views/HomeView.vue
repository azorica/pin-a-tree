<script setup>
/**
 * HomeView Component
 *
 * Landing page for the Pin-a-Tree application.
 * Showcases the app's purpose and encourages user engagement.
 *
 * Features:
 * - Hero section with call-to-action
 * - Feature highlights
 * - Recent community activity
 * - Getting started guide
 */

import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTreeStore } from '@/stores/treeStore'
import { useUserStore } from '@/stores/userStore'
import { MapPin, Camera, Users, TreePine } from 'lucide-vue-next'

import BaseButton from '@/components/BaseButton.vue'
import BaseCard from '@/components/BaseCard.vue'

// ============================================================================
// COMPOSABLES
// ============================================================================

const router = useRouter()
const treeStore = useTreeStore()
const userStore = useUserStore()

// ============================================================================
// COMPUTED PROPERTIES
// ============================================================================

const features = computed(() => [
  {
    icon: Camera,
    title: 'Upload Tree Photos',
    description: "Share photos of trees you've planted or admire with the community.",
    action: 'Start Sharing',
  },
  {
    icon: MapPin,
    title: 'Pin to Map',
    description: 'Your tree appears on our interactive map with GPS coordinates from your photo.',
    action: 'Explore Map',
  },
  {
    icon: Users,
    title: 'Join Community',
    description: 'Connect with fellow tree enthusiasts and environmental advocates worldwide.',
    action: 'Get Started',
  },
])

const stats = computed(() => ({
  trees: treeStore.treeStats.total,
  species: treeStore.treeStats.species,
  community: treeStore.treeStats.plantersCount,
}))

// ============================================================================
// EVENT HANDLERS
// ============================================================================

const handleGetStarted = () => {
  if (userStore.isLoggedIn) {
    router.push('/add-tree')
  } else {
    router.push('/register')
  }
}

const handleExploreMap = () => {
  router.push('/map')
}

// ============================================================================
// LIFECYCLE
// ============================================================================

onMounted(async () => {
  // Load initial tree data for stats
  if (treeStore.trees.length === 0) {
    await treeStore.fetchTrees({ limit: 10 })
  }
})
</script>

<template>
  <div class="home-view">
    <!-- Hero Section -->
    <section class="home-view__hero">
      <div class="container">
        <div class="home-view__hero-content">
          <div class="home-view__hero-text">
            <h1 class="home-view__hero-title">
              Building a Digital Forest,
              <span class="home-view__hero-accent">One Tree at a Time</span>
            </h1>

            <p class="home-view__hero-description">
              Join our community of environmental enthusiasts and help create a living map of trees
              around the world. Share your tree planting stories and inspire others to make a
              positive impact on our planet.
            </p>

            <div class="home-view__hero-actions">
              <BaseButton variant="primary" size="large" @click="handleGetStarted">
                <template #icon-left>
                  <TreePine :size="20" />
                </template>
                {{ userStore.isLoggedIn ? 'Add Your Tree' : 'Get Started' }}
              </BaseButton>

              <BaseButton variant="secondary" size="large" @click="handleExploreMap">
                <template #icon-left>
                  <MapPin :size="20" />
                </template>
                Explore Map
              </BaseButton>
            </div>
          </div>

          <div class="home-view__hero-image">
            <img
              src="@/assets/imagery/illustrations/planting-a-tree.png"
              alt="Person planting a tree illustration"
              class="home-view__hero-img"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Statistics Section -->
    <section class="home-view__stats">
      <div class="container">
        <div class="home-view__stats-grid">
          <div class="home-view__stat">
            <div class="home-view__stat-number">{{ stats.trees.toLocaleString() }}</div>
            <div class="home-view__stat-label">Trees Shared</div>
          </div>

          <div class="home-view__stat">
            <div class="home-view__stat-number">{{ stats.species }}</div>
            <div class="home-view__stat-label">Species</div>
          </div>

          <div class="home-view__stat">
            <div class="home-view__stat-number">{{ stats.community }}</div>
            <div class="home-view__stat-label">Community Members</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="home-view__features">
      <div class="container">
        <div class="home-view__features-header">
          <h2 class="home-view__features-title">How Pin-a-Tree Works</h2>
          <p class="home-view__features-description">
            Simple steps to join our growing digital forest community
          </p>
        </div>

        <div class="home-view__features-grid">
          <BaseCard
            v-for="(feature, index) in features"
            :key="feature.title"
            variant="elevated"
            class="home-view__feature-card"
          >
            <div class="home-view__feature-icon">
              <component :is="feature.icon" :size="32" />
            </div>

            <h3 class="home-view__feature-title">
              {{ feature.title }}
            </h3>

            <p class="home-view__feature-description">
              {{ feature.description }}
            </p>

            <template #actions>
              <BaseButton
                variant="ghost"
                size="small"
                @click="index === 1 ? handleExploreMap() : handleGetStarted()"
              >
                {{ feature.action }}
              </BaseButton>
            </template>
          </BaseCard>
        </div>
      </div>
    </section>

    <!-- Call-to-Action Section -->
    <section class="home-view__cta">
      <div class="container">
        <BaseCard variant="elevated" class="home-view__cta-card">
          <div class="home-view__cta-content">
            <h2 class="home-view__cta-title">Ready to Make an Impact?</h2>

            <p class="home-view__cta-description">
              Join thousands of environmental advocates who are already sharing their tree stories
              and building a greener future together.
            </p>

            <BaseButton variant="primary" size="large" @click="handleGetStarted">
              <template #icon-left>
                <TreePine :size="20" />
              </template>
              {{ userStore.isLoggedIn ? 'Share Your First Tree' : 'Join the Community' }}
            </BaseButton>
          </div>
        </BaseCard>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as variables;
@use '@/styles/colors' as colors;
@use '@/styles/mixins' as mixins;

.home-view {
  // -------------------------------------------------------------------------
  // HERO SECTION
  // -------------------------------------------------------------------------

  &__hero {
    padding: variables.$spacing-6 0 variables.$spacing-8;
    background: linear-gradient(
      135deg,
      colors.$bg-primary 0%,
      rgba(colors.$primary-green, 0.05) 100%
    );
  }

  &__hero-content {
    display: grid;
    gap: variables.$spacing-6;
    align-items: center;

    @include mixins.width-at-least('large') {
      grid-template-columns: 1.2fr 1fr;
      gap: variables.$spacing-8;
    }
  }

  &__hero-text {
    display: flex;
    flex-direction: column;
    gap: variables.$spacing-3;
  }

  &__hero-title {
    font-size: variables.$font-size-h2;
    line-height: variables.$line-height-tight;
    margin: 0;

    @include mixins.width-at-least('medium') {
      font-size: variables.$font-size-hero;
    }
  }

  &__hero-accent {
    color: colors.$primary-green;
  }

  &__hero-description {
    font-size: variables.$font-size-large;
    line-height: variables.$line-height-relaxed;
    color: colors.$text-muted;
    margin: 0;
    max-width: 55rem;
  }

  &__hero-actions {
    display: flex;
    gap: variables.$spacing-2;
    flex-wrap: wrap;

    @include mixins.width-less-than('small') {
      flex-direction: column;
      align-items: stretch;
    }
  }

  &__hero-image {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &__hero-img {
    max-width: 100%;
    height: auto;
    border-radius: variables.$border-radius-large;
    box-shadow: variables.$shadow-large;
  }

  // -------------------------------------------------------------------------
  // STATISTICS SECTION
  // -------------------------------------------------------------------------

  &__stats {
    padding: variables.$spacing-6 0;
    background: rgba(colors.$primary-green, 0.03);
    border-top: 1px solid rgba(colors.$primary-green, 0.1);
    border-bottom: 1px solid rgba(colors.$primary-green, 0.1);
  }

  &__stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: variables.$spacing-4;
    text-align: center;
  }

  &__stat {
    display: flex;
    flex-direction: column;
    gap: variables.$spacing-1;
  }

  &__stat-number {
    font-size: variables.$font-size-h2;
    font-weight: variables.$font-weight-bold;
    color: colors.$primary-green;

    @include mixins.width-at-least('medium') {
      font-size: variables.$font-size-hero;
    }
  }

  &__stat-label {
    font-size: variables.$font-size-body;
    color: colors.$text-muted;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: variables.$font-weight-medium;
  }

  // -------------------------------------------------------------------------
  // FEATURES SECTION
  // -------------------------------------------------------------------------

  &__features {
    padding: variables.$spacing-8 0;
  }

  &__features-header {
    text-align: center;
    margin-bottom: variables.$spacing-6;

    @include mixins.width-at-least('medium') {
      margin-bottom: variables.$spacing-8;
    }
  }

  &__features-title {
    font-size: variables.$font-size-h2;
    margin: 0 0 variables.$spacing-2;

    @include mixins.width-at-least('medium') {
      font-size: variables.$font-size-h1;
    }
  }

  &__features-description {
    font-size: variables.$font-size-large;
    color: colors.$text-muted;
    margin: 0;
    max-width: 60rem;
    margin-left: auto;
    margin-right: auto;
  }

  &__features-grid {
    display: grid;
    gap: variables.$spacing-4;

    @include mixins.width-at-least('medium') {
      grid-template-columns: repeat(3, 1fr);
      gap: variables.$spacing-6;
    }
  }

  &__feature-card {
    text-align: center;
    height: 100%;

    .base-card__content {
      display: flex;
      flex-direction: column;
      gap: variables.$spacing-2;
      flex: 1;
    }
  }

  &__feature-icon {
    @include mixins.flex-center;
    width: 6rem;
    height: 6rem;
    background: rgba(colors.$primary-green, 0.1);
    border-radius: variables.$border-radius-full;
    color: colors.$primary-green;
    margin: 0 auto;
  }

  &__feature-title {
    font-size: variables.$font-size-h5;
    margin: 0;
    color: colors.$text-secondary;
  }

  &__feature-description {
    color: colors.$text-muted;
    line-height: variables.$line-height-relaxed;
    margin: 0;
    flex: 1;
  }

  // -------------------------------------------------------------------------
  // CALL-TO-ACTION SECTION
  // -------------------------------------------------------------------------

  &__cta {
    padding: variables.$spacing-8 0;
    background: linear-gradient(
      135deg,
      rgba(colors.$primary-green, 0.03) 0%,
      rgba(colors.$secondary-green, 0.05) 100%
    );
  }

  &__cta-card {
    max-width: 80rem;
    margin: 0 auto;

    .base-card__content {
      text-align: center;
      padding: variables.$spacing-6;

      @include mixins.width-at-least('medium') {
        padding: variables.$spacing-8;
      }
    }
  }

  &__cta-content {
    display: flex;
    flex-direction: column;
    gap: variables.$spacing-3;
    align-items: center;
  }

  &__cta-title {
    font-size: variables.$font-size-h3;
    margin: 0;
    color: colors.$text-secondary;

    @include mixins.width-at-least('medium') {
      font-size: variables.$font-size-h2;
    }
  }

  &__cta-description {
    font-size: variables.$font-size-large;
    color: colors.$text-muted;
    line-height: variables.$line-height-relaxed;
    margin: 0;
    max-width: 60rem;
  }
}

// -------------------------------------------------------------------------
// RESPONSIVE ADJUSTMENTS
// -------------------------------------------------------------------------

@include mixins.width-less-than('medium') {
  .home-view {
    &__hero {
      padding: variables.$spacing-4 0 variables.$spacing-6;
    }

    &__stats {
      padding: variables.$spacing-4 0;
    }

    &__features {
      padding: variables.$spacing-6 0;
    }

    &__cta {
      padding: variables.$spacing-6 0;
    }

    &__stats-grid {
      gap: variables.$spacing-2;
    }

    &__stat-number {
      font-size: variables.$font-size-h3;
    }

    &__stat-label {
      font-size: variables.$font-size-small;
    }
  }
}
</style>
