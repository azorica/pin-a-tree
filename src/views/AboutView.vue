<script setup>
/**
 * AboutView Component
 *
 * Information page about Pin-a-Tree's mission, team, and impact.
 * Includes statistics, team information, and call-to-action sections.
 *
 * Features:
 * - Mission statement
 * - Impact statistics
 * - Team information
 * - Community highlights
 * - Contact information
 */

import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { TreePine, Users, MapPin, Heart, Mail, Github, Twitter } from 'lucide-vue-next'

import BaseButton from '@/components/BaseButton.vue'
import BaseCard from '@/components/BaseCard.vue'

// ============================================================================
// COMPOSABLES
// ============================================================================

const router = useRouter()

// ============================================================================
// REACTIVE STATE
// ============================================================================

const impactStats = ref([
  { icon: TreePine, number: '10,000+', label: 'Trees Shared' },
  { icon: Users, number: '5,000+', label: 'Community Members' },
  { icon: MapPin, number: '50+', label: 'Countries' },
  { icon: Heart, number: '1M+', label: 'Environmental Actions' },
])

const teamMembers = ref([
  {
    name: 'Alex Green',
    role: 'Founder & CEO',
    bio: 'Environmental advocate with 10+ years in reforestation projects.',
    avatar: 'AG',
  },
  {
    name: 'Sarah Forest',
    role: 'Lead Developer',
    bio: 'Full-stack developer passionate about using technology for environmental good.',
    avatar: 'SF',
  },
  {
    name: 'Michael Tree',
    role: 'Community Manager',
    bio: 'Building connections between tree enthusiasts around the world.',
    avatar: 'MT',
  },
  {
    name: 'Emma Nature',
    role: 'UX Designer',
    bio: 'Designing intuitive experiences that inspire environmental action.',
    avatar: 'EN',
  },
])

const socialLinks = ref([
  { name: 'GitHub', icon: Github, href: 'https://github.com/pin-a-tree' },
  { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/pinatree' },
  { name: 'Email', icon: Mail, href: 'mailto:hello@pin-a-tree.com' },
])

// ============================================================================
// METHODS
// ============================================================================

const goToRegister = () => {
  router.push('/register')
}

const goToMap = () => {
  router.push('/map')
}
</script>

<template>
  <div class="about-view">
    <!-- Hero section -->
    <section class="about-view__hero">
      <div class="container">
        <div class="about-view__hero-content">
          <h1 class="about-view__title">About Pin-a-Tree</h1>
          <p class="about-view__subtitle">
            Building a digital forest that celebrates environmental action and connects tree
            enthusiasts around the world.
          </p>
        </div>
      </div>
    </section>

    <!-- Mission section -->
    <section class="about-view__mission">
      <div class="container">
        <BaseCard variant="elevated" class="about-view__mission-card">
          <div class="about-view__mission-content">
            <TreePine :size="64" class="about-view__mission-icon" />
            <div class="about-view__mission-text">
              <h2>Our Mission</h2>
              <p>
                Pin-a-Tree is more than just a platform – it's a movement. We believe that every
                tree planted, every environmental action taken, and every story shared contributes
                to a greener, more sustainable future for our planet.
              </p>
              <p>
                By creating a digital forest where people can share their tree planting experiences,
                we're building a global community of environmental advocates who inspire and support
                each other in making a positive impact.
              </p>
            </div>
          </div>
        </BaseCard>
      </div>
    </section>

    <!-- Impact statistics -->
    <section class="about-view__impact">
      <div class="container">
        <h2 class="about-view__section-title">Our Impact</h2>
        <div class="about-view__stats-grid">
          <BaseCard v-for="stat in impactStats" :key="stat.label" class="about-view__stat-card">
            <div class="about-view__stat-content">
              <component :is="stat.icon" :size="32" class="about-view__stat-icon" />
              <div class="about-view__stat-number">{{ stat.number }}</div>
              <div class="about-view__stat-label">{{ stat.label }}</div>
            </div>
          </BaseCard>
        </div>
      </div>
    </section>

    <!-- How it works -->
    <section class="about-view__how-it-works">
      <div class="container">
        <h2 class="about-view__section-title">How It Works</h2>
        <div class="about-view__steps-grid">
          <BaseCard class="about-view__step-card">
            <div class="about-view__step-number">1</div>
            <h3>Plant a Tree</h3>
            <p>
              Plant a tree in your garden, neighborhood, or participate in community planting
              events.
            </p>
          </BaseCard>

          <BaseCard class="about-view__step-card">
            <div class="about-view__step-number">2</div>
            <h3>Share Your Story</h3>
            <p>
              Upload a photo and tell us about your tree. Our platform automatically detects GPS
              coordinates from your photo.
            </p>
          </BaseCard>

          <BaseCard class="about-view__step-card">
            <div class="about-view__step-number">3</div>
            <h3>Join the Forest</h3>
            <p>
              Your tree appears on our interactive map, becoming part of our growing digital forest.
            </p>
          </BaseCard>

          <BaseCard class="about-view__step-card">
            <div class="about-view__step-number">4</div>
            <h3>Inspire Others</h3>
            <p>
              Connect with fellow tree enthusiasts and inspire others to take environmental action.
            </p>
          </BaseCard>
        </div>
      </div>
    </section>

    <!-- Team section -->
    <section class="about-view__team">
      <div class="container">
        <h2 class="about-view__section-title">Meet Our Team</h2>
        <div class="about-view__team-grid">
          <BaseCard v-for="member in teamMembers" :key="member.name" class="about-view__team-card">
            <div class="about-view__team-content">
              <div class="about-view__team-avatar">
                {{ member.avatar }}
              </div>
              <h3 class="about-view__team-name">{{ member.name }}</h3>
              <p class="about-view__team-role">{{ member.role }}</p>
              <p class="about-view__team-bio">{{ member.bio }}</p>
            </div>
          </BaseCard>
        </div>
      </div>
    </section>

    <!-- Values section -->
    <section class="about-view__values">
      <div class="container">
        <h2 class="about-view__section-title">Our Values</h2>
        <div class="about-view__values-grid">
          <BaseCard class="about-view__value-card">
            <h3>🌱 Sustainability</h3>
            <p>
              We're committed to promoting sustainable practices and environmental stewardship in
              everything we do.
            </p>
          </BaseCard>

          <BaseCard class="about-view__value-card">
            <h3>🤝 Community</h3>
            <p>
              Building connections between people who care about the environment and want to make a
              difference.
            </p>
          </BaseCard>

          <BaseCard class="about-view__value-card">
            <h3>📚 Education</h3>
            <p>
              Sharing knowledge about trees, environmental conservation, and sustainable living
              practices.
            </p>
          </BaseCard>

          <BaseCard class="about-view__value-card">
            <h3>💚 Inspiration</h3>
            <p>
              Every tree shared on our platform has the power to inspire someone else to take
              environmental action.
            </p>
          </BaseCard>
        </div>
      </div>
    </section>

    <!-- Call to action -->
    <section class="about-view__cta">
      <div class="container">
        <BaseCard variant="elevated" class="about-view__cta-card">
          <div class="about-view__cta-content">
            <h2>Ready to Join Our Forest?</h2>
            <p>
              Become part of our growing community of environmental advocates. Share your tree
              planting stories and help inspire positive change.
            </p>
            <div class="about-view__cta-actions">
              <BaseButton variant="primary" size="large" @click="goToRegister">
                <template #icon-left>
                  <TreePine :size="20" />
                </template>
                Get Started
              </BaseButton>
              <BaseButton variant="secondary" size="large" @click="goToMap">
                <template #icon-left>
                  <MapPin :size="20" />
                </template>
                Explore the Map
              </BaseButton>
            </div>
          </div>
        </BaseCard>
      </div>
    </section>

    <!-- Contact section -->
    <section class="about-view__contact">
      <div class="container">
        <h2 class="about-view__section-title">Get in Touch</h2>
        <div class="about-view__contact-content">
          <p class="about-view__contact-text">
            Have questions, suggestions, or want to collaborate? We'd love to hear from you!
          </p>
          <div class="about-view__social-links">
            <a
              v-for="social in socialLinks"
              :key="social.name"
              :href="social.href"
              class="about-view__social-link"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="`Contact us on ${social.name}`"
            >
              <component :is="social.icon" :size="24" />
              <span>{{ social.name }}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as variables;
@use '@/styles/colors' as colors;
@use '@/styles/mixins' as mixins;

.about-view {
  // -------------------------------------------------------------------------
  // HERO SECTION
  // -------------------------------------------------------------------------

  &__hero {
    padding: variables.$spacing-8 0 variables.$spacing-6;
    background: linear-gradient(
      135deg,
      rgba(colors.$primary-green, 0.1) 0%,
      rgba(colors.$secondary-green, 0.05) 100%
    );
    text-align: center;
  }

  &__hero-content {
    max-width: 80rem;
    margin: 0 auto;
  }

  &__title {
    font-size: variables.$font-size-h1;
    margin: 0 0 variables.$spacing-3;
    color: colors.$text-primary;

    @include mixins.width-at-least('medium') {
      font-size: variables.$font-size-hero;
    }
  }

  &__subtitle {
    font-size: variables.$font-size-large;
    color: colors.$text-muted;
    margin: 0;
    line-height: variables.$line-height-relaxed;

    @include mixins.width-at-least('medium') {
      font-size: variables.$font-size-xl;
    }
  }

  // -------------------------------------------------------------------------
  // MISSION SECTION
  // -------------------------------------------------------------------------

  &__mission {
    padding: variables.$spacing-8 0;
  }

  &__mission-card {
    max-width: 100rem;
    margin: 0 auto;
  }

  &__mission-content {
    @include mixins.flex-center;
    gap: variables.$spacing-6;
    text-align: center;

    @include mixins.width-at-least('large') {
      flex-direction: row;
      text-align: left;
    }
  }

  &__mission-icon {
    color: colors.$primary-green;
    flex-shrink: 0;
  }

  &__mission-text {
    h2 {
      font-size: variables.$font-size-h2;
      margin: 0 0 variables.$spacing-3;
      color: colors.$text-secondary;
    }

    p {
      font-size: variables.$font-size-large;
      line-height: variables.$line-height-relaxed;
      color: colors.$text-muted;
      margin: 0 0 variables.$spacing-3;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  // -------------------------------------------------------------------------
  // IMPACT SECTION
  // -------------------------------------------------------------------------

  &__impact {
    padding: variables.$spacing-8 0;
    background: colors.$bg-secondary;
  }

  &__section-title {
    text-align: center;
    font-size: variables.$font-size-h2;
    margin: 0 0 variables.$spacing-6;
    color: colors.$text-secondary;

    @include mixins.width-at-least('medium') {
      font-size: variables.$font-size-h1;
    }
  }

  &__stats-grid {
    display: grid;
    gap: variables.$spacing-4;
    grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
  }

  &__stat-card {
    text-align: center;
  }

  &__stat-content {
    @include mixins.flex-center;
    flex-direction: column;
    gap: variables.$spacing-2;
  }

  &__stat-icon {
    color: colors.$primary-green;
  }

  &__stat-number {
    font-size: variables.$font-size-h2;
    font-weight: variables.$font-weight-bold;
    color: colors.$text-secondary;

    @include mixins.width-at-least('medium') {
      font-size: variables.$font-size-h1;
    }
  }

  &__stat-label {
    font-size: variables.$font-size-large;
    color: colors.$text-muted;
  }

  // -------------------------------------------------------------------------
  // HOW IT WORKS SECTION
  // -------------------------------------------------------------------------

  &__how-it-works {
    padding: variables.$spacing-8 0;
  }

  &__steps-grid {
    display: grid;
    gap: variables.$spacing-4;
    grid-template-columns: repeat(auto-fit, minmax(25rem, 1fr));

    @include mixins.width-at-least('large') {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  &__step-card {
    text-align: center;
  }

  &__step-number {
    @include mixins.flex-center;
    width: 6rem;
    height: 6rem;
    background: colors.$primary-green;
    color: colors.$white;
    border-radius: 50%;
    font-size: variables.$font-size-h3;
    font-weight: variables.$font-weight-bold;
    margin: 0 auto variables.$spacing-3;
  }

  &__step-card {
    h3 {
      font-size: variables.$font-size-h5;
      margin: 0 0 variables.$spacing-2;
      color: colors.$text-secondary;
    }

    p {
      color: colors.$text-muted;
      line-height: variables.$line-height-relaxed;
      margin: 0;
    }
  }

  // -------------------------------------------------------------------------
  // TEAM SECTION
  // -------------------------------------------------------------------------

  &__team {
    padding: variables.$spacing-8 0;
    background: colors.$bg-secondary;
  }

  &__team-grid {
    display: grid;
    gap: variables.$spacing-4;
    grid-template-columns: repeat(auto-fit, minmax(25rem, 1fr));

    @include mixins.width-at-least('large') {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  &__team-card {
    text-align: center;
  }

  &__team-content {
    @include mixins.flex-center;
    flex-direction: column;
    gap: variables.$spacing-2;
  }

  &__team-avatar {
    @include mixins.flex-center;
    width: 8rem;
    height: 8rem;
    background: colors.$primary-green;
    color: colors.$white;
    border-radius: 50%;
    font-size: variables.$font-size-h3;
    font-weight: variables.$font-weight-bold;
  }

  &__team-name {
    font-size: variables.$font-size-h5;
    margin: 0;
    color: colors.$text-secondary;
  }

  &__team-role {
    color: colors.$primary-green;
    font-weight: variables.$font-weight-medium;
    margin: 0;
  }

  &__team-bio {
    color: colors.$text-muted;
    line-height: variables.$line-height-relaxed;
    margin: 0;
    font-size: variables.$font-size-small;
  }

  // -------------------------------------------------------------------------
  // VALUES SECTION
  // -------------------------------------------------------------------------

  &__values {
    padding: variables.$spacing-8 0;
  }

  &__values-grid {
    display: grid;
    gap: variables.$spacing-4;
    grid-template-columns: repeat(auto-fit, minmax(25rem, 1fr));

    @include mixins.width-at-least('large') {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  &__value-card {
    h3 {
      font-size: variables.$font-size-h5;
      margin: 0 0 variables.$spacing-2;
      color: colors.$text-secondary;
    }

    p {
      color: colors.$text-muted;
      line-height: variables.$line-height-relaxed;
      margin: 0;
    }
  }

  // -------------------------------------------------------------------------
  // CALL TO ACTION SECTION
  // -------------------------------------------------------------------------

  &__cta {
    padding: variables.$spacing-8 0;
    background: linear-gradient(
      135deg,
      rgba(colors.$primary-green, 0.1) 0%,
      rgba(colors.$secondary-green, 0.05) 100%
    );
  }

  &__cta-card {
    max-width: 80rem;
    margin: 0 auto;
    text-align: center;
  }

  &__cta-content {
    h2 {
      font-size: variables.$font-size-h2;
      margin: 0 0 variables.$spacing-3;
      color: colors.$text-secondary;
    }

    p {
      font-size: variables.$font-size-large;
      color: colors.$text-muted;
      margin: 0 0 variables.$spacing-4;
      line-height: variables.$line-height-relaxed;
    }
  }

  &__cta-actions {
    display: flex;
    gap: variables.$spacing-3;
    justify-content: center;

    @include mixins.width-less-than('medium') {
      flex-direction: column;
      align-items: center;
    }
  }

  // -------------------------------------------------------------------------
  // CONTACT SECTION
  // -------------------------------------------------------------------------

  &__contact {
    padding: variables.$spacing-8 0;
    text-align: center;
  }

  &__contact-content {
    max-width: 60rem;
    margin: 0 auto;
  }

  &__contact-text {
    font-size: variables.$font-size-large;
    color: colors.$text-muted;
    margin: 0 0 variables.$spacing-4;
    line-height: variables.$line-height-relaxed;
  }

  &__social-links {
    display: flex;
    gap: variables.$spacing-3;
    justify-content: center;

    @include mixins.width-less-than('medium') {
      flex-direction: column;
      align-items: center;
    }
  }

  &__social-link {
    display: flex;
    align-items: center;
    gap: variables.$spacing-1;
    padding: variables.$spacing-2 variables.$spacing-3;
    border: 2px solid colors.$primary-green;
    border-radius: variables.$border-radius-large;
    color: colors.$primary-green;
    text-decoration: none;
    font-weight: variables.$font-weight-medium;
    transition: all variables.$transition-normal;

    &:hover {
      background: colors.$primary-green;
      color: colors.$white;
    }

    &:focus {
      outline: 2px solid colors.$primary-green;
      outline-offset: 2px;
    }
  }

  // -------------------------------------------------------------------------
  // RESPONSIVE ADJUSTMENTS
  // -------------------------------------------------------------------------

  @include mixins.width-less-than('medium') {
    &__hero {
      padding: variables.$spacing-6 0 variables.$spacing-4;
    }

    &__mission,
    &__impact,
    &__how-it-works,
    &__team,
    &__values,
    &__cta,
    &__contact {
      padding: variables.$spacing-6 0;
    }

    &__mission-content {
      flex-direction: column;
      text-align: center;
    }

    &__stats-grid,
    &__steps-grid,
    &__team-grid,
    &__values-grid {
      grid-template-columns: 1fr;
    }
  }
}
</style>
