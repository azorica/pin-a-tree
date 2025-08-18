<script setup>
/**
 * AppFooter Component
 *
 * Footer component for the Pin-a-Tree application.
 * Provides secondary navigation, social links, and legal information.
 *
 * Features:
 * - Company information and branding
 * - Secondary navigation links
 * - Social media links
 * - Legal and policy links
 * - Responsive layout
 */

import { computed } from 'vue'
import { Heart, Github, Twitter, Mail } from 'lucide-vue-next'

// ============================================================================
// COMPUTED PROPERTIES
// ============================================================================

const currentYear = computed(() => new Date().getFullYear())

const navigationLinks = computed(() => [
  {
    title: 'Product',
    links: [
      { name: 'How it Works', href: '/about' },
      { name: 'Tree Map', href: '/map' },
      { name: 'Add Tree', href: '/add-tree' },
      { name: 'Search', href: '/search' },
    ],
  },
  {
    title: 'Community',
    links: [
      { name: 'Blog', href: '#' },
      { name: 'Events', href: '#' },
      { name: 'Partners', href: '#' },
      { name: 'Education', href: '#' },
    ],
  },
  {
    title: 'Support',
    links: [
      { name: 'Help Center', href: '#' },
      { name: 'Contact Us', href: '#' },
      { name: 'Bug Reports', href: '#' },
      { name: 'Feature Requests', href: '#' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
      { name: 'Cookie Policy', href: '#' },
      { name: 'Accessibility', href: '#' },
    ],
  },
])

const socialLinks = computed(() => [
  {
    name: 'GitHub',
    href: 'https://github.com/pin-a-tree',
    icon: Github,
    label: 'Follow us on GitHub',
  },
  {
    name: 'Twitter',
    href: 'https://twitter.com/pinatree',
    icon: Twitter,
    label: 'Follow us on Twitter',
  },
  {
    name: 'Email',
    href: 'mailto:hello@pin-a-tree.com',
    icon: Mail,
    label: 'Send us an email',
  },
])
</script>

<template>
  <footer class="app-footer">
    <div class="container">
      <!-- Main footer content -->
      <div class="app-footer__content">
        <!-- Brand section -->
        <div class="app-footer__brand">
          <div class="app-footer__logo-section">
            <img
              src="@/assets/branding/logo/logo-icon.png"
              alt="Pin-a-Tree"
              class="app-footer__logo"
            />
            <span class="app-footer__brand-name">Pin-a-Tree</span>
          </div>

          <p class="app-footer__tagline">
            Building a digital forest, one tree at a time. Join our community of environmental
            enthusiasts making a positive impact on the planet.
          </p>

          <!-- Social links -->
          <div class="app-footer__social">
            <span class="app-footer__social-label">Connect with us:</span>
            <ul class="app-footer__social-list">
              <li v-for="social in socialLinks" :key="social.name" class="app-footer__social-item">
                <a
                  :href="social.href"
                  :aria-label="social.label"
                  class="app-footer__social-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <component :is="social.icon" :size="20" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <!-- Navigation links -->
        <div class="app-footer__navigation">
          <div
            v-for="section in navigationLinks"
            :key="section.title"
            class="app-footer__nav-section"
          >
            <h3 class="app-footer__nav-title">{{ section.title }}</h3>
            <ul class="app-footer__nav-list">
              <li v-for="link in section.links" :key="link.name" class="app-footer__nav-item">
                <a :href="link.href" class="app-footer__nav-link">
                  {{ link.name }}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Footer bottom -->
      <div class="app-footer__bottom">
        <div class="app-footer__bottom-content">
          <!-- Copyright -->
          <p class="app-footer__copyright">© {{ currentYear }} Pin-a-Tree. All rights reserved.</p>

          <!-- Made with love message -->
          <p class="app-footer__love">
            Made with
            <Heart :size="16" class="app-footer__heart" aria-label="love" />
            for the planet
          </p>

          <!-- Additional legal links -->
          <div class="app-footer__legal-links">
            <a href="#" class="app-footer__legal-link">Status</a>
            <a href="#" class="app-footer__legal-link">Security</a>
            <a href="#" class="app-footer__legal-link">Sitemap</a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as variables;
@use '@/styles/colors' as colors;
@use '@/styles/mixins' as mixins;

.app-footer {
  background: colors.$bg-primary;
  border-top: 1px solid colors.$border-light;
  margin-top: auto;

  // -------------------------------------------------------------------------
  // MAIN CONTENT
  // -------------------------------------------------------------------------

  &__content {
    padding: variables.$spacing-6 0 variables.$spacing-4;
    display: grid;
    gap: variables.$spacing-6;

    @include mixins.width-at-least('large') {
      grid-template-columns: 1fr 2fr;
      gap: variables.$spacing-8;
    }
  }

  // -------------------------------------------------------------------------
  // BRAND SECTION
  // -------------------------------------------------------------------------

  &__brand {
    display: flex;
    flex-direction: column;
    gap: variables.$spacing-3;
  }

  &__logo-section {
    display: flex;
    align-items: center;
    gap: variables.$spacing-1_5;
  }

  &__logo {
    width: 4rem;
    height: 4rem;
    border-radius: variables.$border-radius-medium;
  }

  &__brand-name {
    font-size: variables.$font-size-h4;
    font-weight: variables.$font-weight-bold;
    color: colors.$text-primary;
  }

  &__tagline {
    color: colors.$text-muted;
    line-height: variables.$line-height-relaxed;
    margin: 0;
    max-width: 40rem;
  }

  // -------------------------------------------------------------------------
  // SOCIAL LINKS
  // -------------------------------------------------------------------------

  &__social {
    display: flex;
    flex-direction: column;
    gap: variables.$spacing-1_5;
  }

  &__social-label {
    color: colors.$text-muted;
    font-size: variables.$font-size-small;
    font-weight: variables.$font-weight-medium;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  &__social-list {
    @include mixins.list-reset;
    display: flex;
    gap: variables.$spacing-2;
  }

  &__social-item {
    position: relative;
  }

  &__social-link {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 4rem;
    height: 4rem;
    color: colors.$text-muted;
    border: 1px solid colors.$border-light;
    border-radius: variables.$border-radius-medium;
    transition: all variables.$transition-normal;
    text-decoration: none;

    &:hover {
      color: colors.$primary-green;
      border-color: colors.$primary-green;
      background: rgba(colors.$primary-green, 0.1);
    }

    &:focus {
      outline: 2px solid colors.$primary-green;
      outline-offset: 2px;
    }
  }

  // -------------------------------------------------------------------------
  // NAVIGATION
  // -------------------------------------------------------------------------

  &__navigation {
    display: grid;
    gap: variables.$spacing-4;

    @include mixins.width-at-least('small') {
      grid-template-columns: repeat(2, 1fr);
    }

    @include mixins.width-at-least('medium') {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  &__nav-section {
    display: flex;
    flex-direction: column;
    gap: variables.$spacing-2;
  }

  &__nav-title {
    margin: 0;
    font-size: variables.$font-size-body;
    font-weight: variables.$font-weight-semibold;
    color: colors.$text-primary;
  }

  &__nav-list {
    @include mixins.list-reset;
    display: flex;
    flex-direction: column;
    gap: variables.$spacing-1;
  }

  &__nav-item {
    position: relative;
  }

  &__nav-link {
    color: colors.$text-muted;
    text-decoration: none;
    transition: color variables.$transition-normal;
    font-size: variables.$font-size-small;

    &:hover {
      color: colors.$primary-green;
    }

    &:focus {
      outline: 2px solid colors.$primary-green;
      outline-offset: 2px;
      border-radius: variables.$border-radius-small;
    }
  }

  // -------------------------------------------------------------------------
  // BOTTOM SECTION
  // -------------------------------------------------------------------------

  &__bottom {
    padding: variables.$spacing-3 0;
    border-top: 1px solid colors.$border-light;
  }

  &__bottom-content {
    display: flex;
    flex-direction: column;
    gap: variables.$spacing-2;
    align-items: center;
    text-align: center;

    @include mixins.width-at-least('medium') {
      flex-direction: row;
      justify-content: space-between;
      text-align: left;
    }
  }

  &__copyright {
    margin: 0;
    color: colors.$text-muted;
    font-size: variables.$font-size-small;
  }

  &__love {
    margin: 0;
    display: flex;
    align-items: center;
    gap: variables.$spacing-0_5;
    color: colors.$text-muted;
    font-size: variables.$font-size-small;
  }

  &__heart {
    color: #e74c3c;
    animation: heartbeat 2s ease-in-out infinite;
  }

  &__legal-links {
    display: flex;
    gap: variables.$spacing-3;

    @include mixins.width-less-than('medium') {
      justify-content: center;
    }
  }

  &__legal-link {
    color: colors.$text-muted;
    text-decoration: none;
    font-size: variables.$font-size-small;
    transition: color variables.$transition-normal;

    &:hover {
      color: colors.$primary-green;
    }

    &:focus {
      outline: 2px solid colors.$primary-green;
      outline-offset: 2px;
      border-radius: variables.$border-radius-small;
    }
  }
}

// -------------------------------------------------------------------------
// ANIMATIONS
// -------------------------------------------------------------------------

@keyframes heartbeat {
  0%,
  50%,
  100% {
    transform: scale(1);
  }
  25%,
  75% {
    transform: scale(1.1);
  }
}

// -------------------------------------------------------------------------
// ACCESSIBILITY
// -------------------------------------------------------------------------

// High contrast mode support
@media (prefers-contrast: high) {
  .app-footer {
    border-top-width: 3px;

    &__social-link {
      border-width: 2px;
    }

    &__bottom {
      border-top-width: 3px;
    }
  }
}

// Reduced motion support
@media (prefers-reduced-motion: reduce) {
  .app-footer {
    &__social-link {
      transition: none;
    }

    &__nav-link,
    &__legal-link {
      transition: none;
    }

    &__heart {
      animation: none;
    }
  }
}
</style>
