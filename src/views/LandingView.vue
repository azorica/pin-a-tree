<script setup>
import { useRouter } from 'vue-router';
import { Users, TreePine, Map } from 'lucide-vue-next';
import BaseButton from '@/components/base/BaseButton.vue';
import { logo, plantingIllustration, mapPreview } from '@/assets';

const router = useRouter();

const handleGetStarted = () => {
  router.push('/map');
};
</script>

<template>
  <div class="landing-view">
    <header class="landing-view__header">
      <div class="container">
        <div class="landing-view__nav">
          <div class="landing-view__logo">
            <img :src="logo" alt="Pin-a-Tree.org" class="landing-view__logo-img" />
            <span class="landing-view__logo-text">Pin-a-Tree.org</span>
          </div>
          <BaseButton variant="secondary" @click="router.push('/upload')">
            Sign up
          </BaseButton>
        </div>
      </div>
    </header>

    <main>
      <section class="landing-view__hero">
        <div class="container">
          <div class="landing-view__hero-content">
            <div class="landing-view__hero-text">
              <h1 class="landing-view__title">Pin-a-Tree.org</h1>
              <p class="landing-view__subtitle">
                Plant a tree and pin it on the map to share your impact!
              </p>
              <BaseButton @click="handleGetStarted">
                Get Started
              </BaseButton>
            </div>
            <div class="landing-view__hero-image">
              <img :src="plantingIllustration" alt="Person planting a tree" />
            </div>
          </div>
        </div>
      </section>

      <section class="landing-view__features">
        <div class="container">
          <div class="landing-view__cards">
            <div class="landing-view__card">
              <Users class="landing-view__card-icon" />
              <h2>Create An Account</h2>
              <p>Join our community and contribute your trees.</p>
            </div>

            <div class="landing-view__card">
              <TreePine class="landing-view__card-icon" />
              <h2>Add a Tree</h2>
              <p>Provide details like site, species, and location of your tree.</p>
            </div>

            <div class="landing-view__card">
              <Map class="landing-view__card-icon" />
              <h2>View the Map</h2>
              <p>Explore a map of trees planted around world by fellow users.</p>
            </div>
          </div>
        </div>
      </section>

      <section class="landing-view__map-preview">
        <div class="container">
          <h2>See Your Trees on the Map</h2>
          <p>Join others in planting trees and visualize your collective efforts with an interactive map displaying all the trees pinned.</p>
          <div class="landing-view__map-container">
            <img :src="mapPreview" alt="World map preview with tree pins" class="landing-view__map-image" />
          </div>
        </div>
      </section>
    </main>

    <footer class="landing-view__footer">
      <div class="container">
        <p>Learn more about how you can make a difference with Pin-a-Tree.org</p>
      </div>
    </footer>
  </div>
</template>

<style scoped lang="scss">
.landing-view {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: $dark-background;
  color: $white;

  &__header {
    padding: $spacing-2 0;
    border-bottom: 1px solid rgba($white, 0.1);
  }

  &__nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__logo {
    display: flex;
    align-items: center;
    gap: $spacing-2;
  }

  &__logo-img {
    height: 4rem;
    width: auto;
  }

  &__logo-text {
    font-size: 2.4rem;
    font-weight: 600;
    color: $white;
  }

  &__hero {
    padding: $spacing-4 0;
  }

  &__hero-content {
    display: grid;
    gap: $spacing-4;
    align-items: center;

    @include width-at-least('large') {
      grid-template-columns: 1fr 1fr;
    }
  }

  &__hero-text {
    display: grid;
    gap: $spacing-3;
  }

  &__title {
    font-size: 4.8rem;
    font-weight: 700;
    color: $primary-green;
    line-height: 1.2;
  }

  &__subtitle {
    font-size: 2.4rem;
    color: $white;
    opacity: 0.9;
    margin-bottom: $spacing-2;
  }

  &__hero-image {
    display: flex;
    justify-content: center;
    
    img {
      max-width: 100%;
      height: auto;
    }
  }

  &__features {
    padding: $spacing-4 0;
    background-color: rgba($white, 0.02);
  }

  &__cards {
    display: grid;
    gap: $spacing-3;
    
    @include width-at-least('medium') {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  &__card {
    background-color: rgba($white, 0.05);
    padding: $spacing-3;
    border-radius: $border-radius-lg;
    text-align: center;
    display: grid;
    gap: $spacing-2;
    transition: transform 0.2s ease;

    &:hover {
      transform: translateY(-4px);
    }

    h2 {
      color: $primary-green;
      font-size: 2rem;
    }

    p {
      color: $white;
      opacity: 0.8;
      font-size: 1.6rem;
    }
  }

  &__card-icon {
    width: 4rem;
    height: 4rem;
    color: $primary-green;
    margin: 0 auto;
  }

  &__map-preview {
    padding: $spacing-4 0;
    text-align: center;

    h2 {
      color: $primary-green;
      font-size: 3.2rem;
      margin-bottom: $spacing-2;
    }

    p {
      color: $white;
      opacity: 0.9;
      font-size: 1.8rem;
      max-width: 80rem;
      margin: 0 auto $spacing-4;
    }
  }

  &__map-container {
    background-color: rgba($white, 0.05);
    border-radius: $border-radius-lg;
    overflow: hidden;
    aspect-ratio: 16 / 9;
    margin: 0 auto;
    max-width: 100%;
  }

  &__map-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
  }

  &__footer {
    margin-top: auto;
    padding: $spacing-3 0;
    background-color: rgba($white, 0.02);
    text-align: center;
    color: $white;
    opacity: 0.7;
  }
}

// Global container class (as per UI/UX guidelines)
.container {
  width: 100%;
  max-width: 120rem;
  margin: 0 auto;
  padding: 0 $spacing-2;

  @include width-at-least('medium') {
    padding: 0 $spacing-3;
  }
}
</style> 