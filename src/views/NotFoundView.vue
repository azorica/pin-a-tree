<script setup>
/**
 * NotFoundView Component
 *
 * 404 error page displayed when a route is not found.
 * Provides helpful navigation options and maintains app consistency.
 *
 * Features:
 * - Friendly 404 message
 * - Navigation suggestions
 * - Back to home option
 * - Consistent styling
 */

import { useRouter } from 'vue-router'
import { Home, ArrowLeft, Search, TreePine } from 'lucide-vue-next'

import BaseButton from '@/components/BaseButton.vue'
import BaseCard from '@/components/BaseCard.vue'

// ============================================================================
// COMPOSABLES
// ============================================================================

const router = useRouter()

// ============================================================================
// METHODS
// ============================================================================

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  router.go(-1)
}

const goToMap = () => {
  router.push('/map')
}

const goToSearch = () => {
  router.push('/search')
}
</script>

<template>
  <div class="not-found-view">
    <div class="container">
      <div class="not-found-view__content">
        <!-- Main 404 message -->
        <BaseCard variant="elevated" class="not-found-view__main-card">
          <div class="not-found-view__main-content">
            <div class="not-found-view__error-code">404</div>
            <h1 class="not-found-view__title">Oops! Page Not Found</h1>
            <p class="not-found-view__description">
              The page you're looking for seems to have wandered off into the digital forest. Don't
              worry, we'll help you find your way back!
            </p>

            <!-- Primary actions -->
            <div class="not-found-view__primary-actions">
              <BaseButton variant="primary" size="large" @click="goHome">
                <template #icon-left>
                  <Home :size="20" />
                </template>
                Go Home
              </BaseButton>

              <BaseButton variant="secondary" size="large" @click="goBack">
                <template #icon-left>
                  <ArrowLeft :size="20" />
                </template>
                Go Back
              </BaseButton>
            </div>
          </div>
        </BaseCard>

        <!-- Navigation suggestions -->
        <div class="not-found-view__suggestions">
          <h2 class="not-found-view__suggestions-title">
            Maybe you were looking for one of these?
          </h2>

          <div class="not-found-view__suggestions-grid">
            <BaseCard class="not-found-view__suggestion-card" clickable @click="goToMap">
              <div class="not-found-view__suggestion-content">
                <TreePine :size="32" class="not-found-view__suggestion-icon" />
                <h3>Explore the Tree Map</h3>
                <p>Discover trees planted by our community around the world</p>
              </div>
            </BaseCard>

            <BaseCard class="not-found-view__suggestion-card" clickable @click="goToSearch">
              <div class="not-found-view__suggestion-content">
                <Search :size="32" class="not-found-view__suggestion-icon" />
                <h3>Search Trees & Users</h3>
                <p>Find specific trees, species, or community members</p>
              </div>
            </BaseCard>

            <BaseCard
              class="not-found-view__suggestion-card"
              clickable
              @click="router.push('/add-tree')"
            >
              <div class="not-found-view__suggestion-content">
                <TreePine :size="32" class="not-found-view__suggestion-icon" />
                <h3>Add Your Tree</h3>
                <p>Share your tree planting story with the community</p>
              </div>
            </BaseCard>

            <BaseCard
              class="not-found-view__suggestion-card"
              clickable
              @click="router.push('/about')"
            >
              <div class="not-found-view__suggestion-content">
                <TreePine :size="32" class="not-found-view__suggestion-icon" />
                <h3>About Pin-a-Tree</h3>
                <p>Learn more about our mission and community</p>
              </div>
            </BaseCard>
          </div>
        </div>

        <!-- Fun fact -->
        <BaseCard class="not-found-view__fun-fact">
          <div class="not-found-view__fun-fact-content">
            <h3>🌳 Did you know?</h3>
            <p>
              While you're here, did you know that a single tree can absorb up to 22kg of CO₂ per
              year? Every tree in our digital forest represents real environmental impact!
            </p>
          </div>
        </BaseCard>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as variables;
@use '@/styles/colors' as colors;
@use '@/styles/mixins' as mixins;

.not-found-view {
  min-height: calc(100vh - 8rem);
  @include mixins.flex-center;
  padding: variables.$spacing-4 0;
  background: linear-gradient(
    135deg,
    rgba(colors.$primary-green, 0.05) 0%,
    rgba(colors.$secondary-green, 0.02) 100%
  );

  // -------------------------------------------------------------------------
  // CONTENT LAYOUT
  // -------------------------------------------------------------------------

  &__content {
    width: 100%;
    max-width: 90rem;
    display: flex;
    flex-direction: column;
    gap: variables.$spacing-6;
  }

  // -------------------------------------------------------------------------
  // MAIN CARD
  // -------------------------------------------------------------------------

  &__main-card {
    max-width: 70rem;
    margin: 0 auto;
    text-align: center;
  }

  &__main-content {
    padding: variables.$spacing-8;

    @include mixins.width-less-than('medium') {
      padding: variables.$spacing-6;
    }
  }

  &__error-code {
    font-size: 12rem;
    font-weight: variables.$font-weight-bold;
    color: colors.$primary-green;
    line-height: 1;
    margin-bottom: variables.$spacing-3;
    text-shadow: 0 0.4rem 0.8rem rgba(colors.$primary-green, 0.2);

    @include mixins.width-less-than('medium') {
      font-size: 8rem;
    }
  }

  &__title {
    font-size: variables.$font-size-h2;
    margin: 0 0 variables.$spacing-3;
    color: colors.$text-secondary;

    @include mixins.width-at-least('medium') {
      font-size: variables.$font-size-h1;
    }
  }

  &__description {
    font-size: variables.$font-size-large;
    color: colors.$text-muted;
    line-height: variables.$line-height-relaxed;
    margin: 0 0 variables.$spacing-6;
    max-width: 60rem;
    margin-left: auto;
    margin-right: auto;
  }

  &__primary-actions {
    display: flex;
    gap: variables.$spacing-3;
    justify-content: center;

    @include mixins.width-less-than('medium') {
      flex-direction: column;
      align-items: center;
    }
  }

  // -------------------------------------------------------------------------
  // SUGGESTIONS SECTION
  // -------------------------------------------------------------------------

  &__suggestions {
    text-align: center;
  }

  &__suggestions-title {
    font-size: variables.$font-size-h3;
    color: colors.$text-secondary;
    margin: 0 0 variables.$spacing-4;

    @include mixins.width-at-least('medium') {
      font-size: variables.$font-size-h2;
    }
  }

  &__suggestions-grid {
    display: grid;
    gap: variables.$spacing-3;
    grid-template-columns: repeat(auto-fit, minmax(25rem, 1fr));

    @include mixins.width-at-least('large') {
      grid-template-columns: repeat(4, 1fr);
    }

    @include mixins.width-less-than('medium') {
      grid-template-columns: 1fr;
    }
  }

  &__suggestion-card {
    height: 100%;
    transition: transform variables.$transition-normal;

    &:hover {
      transform: translateY(-0.2rem);
    }

    .base-card__content {
      height: 100%;
      padding: variables.$spacing-3;
    }
  }

  &__suggestion-content {
    @include mixins.flex-center;
    flex-direction: column;
    text-align: center;
    height: 100%;
    gap: variables.$spacing-2;
  }

  &__suggestion-icon {
    color: colors.$primary-green;
    margin-bottom: variables.$spacing-1;
  }

  &__suggestion-card {
    h3 {
      font-size: variables.$font-size-h6;
      margin: 0;
      color: colors.$text-secondary;
    }

    p {
      font-size: variables.$font-size-small;
      color: colors.$text-muted;
      line-height: variables.$line-height-relaxed;
      margin: 0;
    }
  }

  // -------------------------------------------------------------------------
  // FUN FACT SECTION
  // -------------------------------------------------------------------------

  &__fun-fact {
    max-width: 60rem;
    margin: 0 auto;
    background: linear-gradient(
      135deg,
      rgba(colors.$primary-green, 0.1) 0%,
      rgba(colors.$secondary-green, 0.05) 100%
    );
    border: 1px solid rgba(colors.$primary-green, 0.2);
  }

  &__fun-fact-content {
    padding: variables.$spacing-4;
    text-align: center;

    h3 {
      font-size: variables.$font-size-h5;
      margin: 0 0 variables.$spacing-2;
      color: colors.$text-secondary;
    }

    p {
      font-size: variables.$font-size-body;
      color: colors.$text-muted;
      line-height: variables.$line-height-relaxed;
      margin: 0;
    }
  }

  // -------------------------------------------------------------------------
  // RESPONSIVE ADJUSTMENTS
  // -------------------------------------------------------------------------

  @include mixins.width-less-than('medium') {
    padding: variables.$spacing-3 0;

    &__content {
      gap: variables.$spacing-4;
      margin: 0 variables.$spacing-2;
    }

    &__main-content {
      padding: variables.$spacing-4;
    }

    &__description {
      font-size: variables.$font-size-body;
    }

    &__suggestions-title {
      font-size: variables.$font-size-h4;
    }

    &__fun-fact-content {
      padding: variables.$spacing-3;
    }
  }

  // -------------------------------------------------------------------------
  // ACCESSIBILITY
  // -------------------------------------------------------------------------

  @media (prefers-reduced-motion: reduce) {
    &__suggestion-card {
      transition: none;

      &:hover {
        transform: none;
      }
    }
  }

  // High contrast mode support
  @media (prefers-contrast: high) {
    &__error-code {
      text-shadow: none;
    }

    &__main-card,
    &__suggestion-card,
    &__fun-fact {
      border: 3px solid colors.$border-dark;
    }
  }
}
</style>
