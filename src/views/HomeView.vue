<script setup>
/**
 * HomeView Component
 *
 * The main landing page for Pin-a-Tree application.
 * Displays the welcome message, feature highlights, and call-to-action buttons.
 *
 * Features:
 * - Hero section with main call-to-action
 * - Feature cards highlighting app capabilities
 * - Recent trees preview
 * - Navigation to main app functions
 * - Community statistics display
 */

// Vue imports
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// Store imports
import { useTreeStore } from '@/stores/treeStore'
import { useUserStore } from '@/stores/userStore'

// Component imports
import BaseButton from '@/components/BaseButton.vue'
import TreeCard from '@/components/TreeCard.vue'
import StatsCard from '@/components/StatsCard.vue'

// ============================================================================
// REACTIVE STATE
// ============================================================================

const router = useRouter()
const treeStore = useTreeStore()
const userStore = useUserStore()

const isLoading = ref(true)

// ============================================================================
// COMPUTED PROPERTIES
// ============================================================================

// ============================================================================
// EVENT HANDLERS
// ============================================================================

const handleGetStarted = () => {
  router.push('/add-tree')
}

const handleViewMap = () => {
  router.push('/map')
}

const handleTreeClick = (tree) => {
  treeStore.selectTree(tree)
  router.push('/map')
}

// ============================================================================
// LIFECYCLE
// ============================================================================

onMounted(async () => {
  try {
    await Promise.all([
      treeStore.fetchTrees(),
      userStore.fetchUsers()
    ])
  } catch (error) {
    console.error('Failed to load data:', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="home-view">
    <!-- Skip Link for Accessibility -->
    <a href="#main-content" class="skip-link">Skip to main content</a>
    
    <!-- Navigation Header -->
    <header class="home-view__header">
      <nav class="home-view__nav container">
        <div class="home-view__logo">
          <h1>🌳 Pin-a-Tree</h1>
        </div>
        <div class="home-view__nav-actions">
          <BaseButton 
            variant="ghost" 
            @click="handleViewMap"
            aria-label="View tree map"
          >
            View Map
          </BaseButton>
          <BaseButton 
            variant="primary" 
            @click="handleGetStarted"
            aria-label="Get started with Pin-a-Tree"
          >
            Get Started
          </BaseButton>
        </div>
      </nav>
    </header>

    <!-- Main Content -->
    <main id="main-content" class="home-view__main">
      <!-- Hero Section -->
      <section class="home-view__hero">
        <div class="container">
          <div class="home-view__hero-content">
            <h2 class="home-view__hero-title">
              Create a Digital Forest
            </h2>
            <p class="home-view__hero-subtitle">
              Join our community in building a living, growing map that celebrates 
              positive environmental actions. Pin trees you plant or admire and 
              watch our global green network grow.
            </p>
            <div class="home-view__hero-actions">
              <BaseButton 
                variant="primary" 
                size="large"
                @click="handleGetStarted"
                aria-label="Start adding trees to the map"
              >
                Add Your First Tree
              </BaseButton>
              <BaseButton 
                variant="secondary" 
                size="large"
                @click="handleViewMap"
                aria-label="Explore the community tree map"
              >
                Explore the Map
              </BaseButton>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="home-view__features" aria-labelledby="features-heading">
        <div class="container">
          <h3 id="features-heading" class="home-view__section-title">
            What You Can Do
          </h3>
          <div class="home-view__features-grid">
            <div class="home-view__feature-card">
              <div class="home-view__feature-icon" aria-hidden="true">📸</div>
              <h4>Upload Tree Photos</h4>
              <p>Take or upload photos of trees you've planted or admire in your community.</p>
            </div>
            <div class="home-view__feature-card">
              <div class="home-view__feature-icon" aria-hidden="true">📍</div>
              <h4>Auto-detect Location</h4>
              <p>We'll extract GPS coordinates from your photos or let you pin the location manually.</p>
            </div>
            <div class="home-view__feature-card">
              <div class="home-view__feature-icon" aria-hidden="true">🗺️</div>
              <h4>View on Map</h4>
              <p>See your trees and others' contributions on our collaborative world map.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Community Stats -->
      <section class="home-view__stats" aria-labelledby="stats-heading" v-if="!isLoading">
        <div class="container">
          <h3 id="stats-heading" class="home-view__section-title">
            Our Growing Community
          </h3>
          <div class="home-view__stats-grid">
            <StatsCard 
              :value="treeStore.treeCount"
              label="Trees Pinned"
              icon="🌳"
            />
            <StatsCard 
              :value="userStore.users.length"
              label="Community Members"
              icon="👥"
            />
            <StatsCard 
              :value="treeStore.healthyTreesCount"
              label="Healthy Trees"
              icon="💚"
            />
          </div>
        </div>
      </section>

      <!-- Recent Trees -->
      <section class="home-view__recent-trees" aria-labelledby="recent-trees-heading" v-if="!isLoading && treeStore.recentTrees.length > 0">
        <div class="container">
          <h3 id="recent-trees-heading" class="home-view__section-title">
            Recently Added Trees
          </h3>
          <div class="home-view__trees-grid">
            <TreeCard 
              v-for="tree in treeStore.recentTrees.slice(0, 3)"
              :key="tree.id"
              :tree="tree"
              @click="handleTreeClick(tree)"
            />
          </div>
          <div class="home-view__view-all">
            <BaseButton 
              variant="secondary" 
              @click="handleViewMap"
              aria-label="View all trees on the map"
            >
              View All Trees
            </BaseButton>
          </div>
        </div>
      </section>

      <!-- Loading State -->
      <section v-if="isLoading" class="home-view__loading" aria-live="polite">
        <div class="container">
          <p>Loading community data...</p>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="home-view__footer">
      <div class="container">
        <p>&copy; 2025 Pin-a-Tree. Building a greener future together.</p>
      </div>
    </footer>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.home-view {
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  // ============================================================================
  // HEADER & NAVIGATION
  // ============================================================================

  &__header {
    background-color: $background-dark;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    position: sticky;
    top: 0;
    z-index: $z-sticky;
  }

  &__nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: $spacing-md $spacing-md;
    
    @include width-at-least('medium') {
      padding: $spacing-md $spacing-lg;
    }
  }

  &__logo h1 {
    font-size: $font-size-heading-3;
    color: $primary-green;
    margin: 0;
  }

  &__nav-actions {
    display: flex;
    gap: $spacing-sm;
    align-items: center;
  }

  // ============================================================================
  // MAIN CONTENT
  // ============================================================================

  &__main {
    flex: 1;
  }

  &__section-title {
    text-align: center;
    margin-bottom: $spacing-lg;
    font-size: $font-size-heading-2;
    color: $text-primary;
  }

  // ============================================================================
  // HERO SECTION
  // ============================================================================

  &__hero {
    background: linear-gradient(135deg, $background-dark 0%, #1a4a1a 100%);
    padding: $spacing-xl 0;
    text-align: center;
  }

  &__hero-content {
    max-width: 80rem;
    margin: 0 auto;
  }

  &__hero-title {
    font-size: $font-size-heading-1;
    margin-bottom: $spacing-md;
    color: $text-primary;
    
    @include width-less-than('small') {
      font-size: 2.8rem;
    }
  }

  &__hero-subtitle {
    font-size: $font-size-large;
    line-height: 1.6;
    margin-bottom: $spacing-lg;
    color: rgba(255, 255, 255, 0.9);
    max-width: 60rem;
    margin-left: auto;
    margin-right: auto;
  }

  &__hero-actions {
    display: flex;
    gap: $spacing-md;
    justify-content: center;
    flex-wrap: wrap;
  }

  // ============================================================================
  // FEATURES SECTION
  // ============================================================================

  &__features {
    padding: $spacing-xl 0;
    background-color: rgba(255, 255, 255, 0.02);
  }

  &__features-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: $spacing-lg;
    
    @include width-at-least('medium') {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  &__feature-card {
    @include card-base;
    text-align: center;
    background-color: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    
    h4 {
      color: $primary-green;
      margin-bottom: $spacing-sm;
    }
    
    p {
      color: rgba(255, 255, 255, 0.8);
      line-height: 1.6;
    }
  }

  &__feature-icon {
    font-size: 4rem;
    margin-bottom: $spacing-md;
  }

  // ============================================================================
  // STATS SECTION
  // ============================================================================

  &__stats {
    padding: $spacing-xl 0;
  }

  &__stats-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: $spacing-md;
    
    @include width-at-least('medium') {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  // ============================================================================
  // RECENT TREES SECTION
  // ============================================================================

  &__recent-trees {
    padding: $spacing-xl 0;
    background-color: rgba(255, 255, 255, 0.02);
  }

  &__trees-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: $spacing-md;
    margin-bottom: $spacing-lg;
    
    @include width-at-least('medium') {
      grid-template-columns: repeat(2, 1fr);
    }
    
    @include width-at-least('large') {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  &__view-all {
    text-align: center;
  }

  // ============================================================================
  // LOADING STATE
  // ============================================================================

  &__loading {
    padding: $spacing-xl 0;
    text-align: center;
    
    p {
      color: rgba(255, 255, 255, 0.7);
      font-size: $font-size-large;
    }
  }

  // ============================================================================
  // FOOTER
  // ============================================================================

  &__footer {
    background-color: rgba(0, 0, 0, 0.3);
    padding: $spacing-lg 0;
    text-align: center;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    
    p {
      color: rgba(255, 255, 255, 0.7);
      margin: 0;
    }
  }
}
</style>
