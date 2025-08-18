<script setup>
/**
 * BaseCard Component
 *
 * A reusable card component that provides consistent styling and
 * structure for content containers throughout the application.
 *
 * Features:
 * - Multiple variants (default, elevated, outlined)
 * - Optional header and footer sections
 * - Clickable cards with proper ARIA attributes
 * - Loading state support
 * - Responsive design
 * - Accessible focus management
 *
 * Props:
 * @prop {String} variant - Card style variant (default, elevated, outlined)
 * @prop {Boolean} clickable - Whether the card is clickable
 * @prop {Boolean} loading - Whether card is in loading state
 * @prop {String} ariaLabel - Accessible label for screen readers
 * @prop {String} role - ARIA role for the card element
 *
 * Events:
 * @emits {Event} click - Emitted when clickable card is clicked
 *
 * Slots:
 * @slot header - Card header content
 * @slot default - Main card content
 * @slot footer - Card footer content
 * @slot actions - Action buttons or controls
 */

import { computed } from 'vue'
import { Loader2 } from 'lucide-vue-next'

// ============================================================================
// PROPS & EMITS
// ============================================================================

const props = defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'elevated', 'outlined'].includes(value),
  },
  clickable: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  ariaLabel: {
    type: String,
    default: null,
  },
  role: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(['click'])

// ============================================================================
// COMPUTED PROPERTIES
// ============================================================================

const cardClasses = computed(() => [
  'base-card',
  `base-card--${props.variant}`,
  {
    'base-card--clickable': props.clickable,
    'base-card--loading': props.loading,
  },
])

const cardAttributes = computed(() => {
  const attrs = {
    class: cardClasses.value,
    'aria-label': props.ariaLabel,
  }

  if (props.role) {
    attrs.role = props.role
  } else if (props.clickable) {
    attrs.role = 'button'
    attrs.tabindex = '0'
  }

  return attrs
})

// ============================================================================
// EVENT HANDLERS
// ============================================================================

const handleClick = (event) => {
  if (props.clickable && !props.loading) {
    emit('click', event)
  }
}

const handleKeydown = (event) => {
  if (props.clickable && !props.loading) {
    // Handle Enter and Space key presses for accessibility
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      emit('click', event)
    }
  }
}
</script>

<template>
  <div v-bind="cardAttributes" @click="handleClick" @keydown="handleKeydown">
    <!-- Loading overlay -->
    <div v-if="loading" class="base-card__loading" aria-live="polite" aria-label="Loading content">
      <Loader2 class="base-card__spinner" :size="24" />
    </div>

    <!-- Card header -->
    <header v-if="$slots.header" class="base-card__header">
      <slot name="header" />
    </header>

    <!-- Card content -->
    <div v-if="$slots.default" class="base-card__content">
      <slot />
    </div>

    <!-- Card footer -->
    <footer v-if="$slots.footer" class="base-card__footer">
      <slot name="footer" />
    </footer>

    <!-- Card actions -->
    <div v-if="$slots.actions" class="base-card__actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as variables;
@use '@/styles/colors' as colors;
@use '@/styles/mixins' as mixins;

.base-card {
  position: relative;
  border-radius: variables.$border-radius-large;
  overflow: hidden;
  transition: all variables.$transition-normal;

  // -------------------------------------------------------------------------
  // VARIANTS
  // -------------------------------------------------------------------------

  &--default {
    background: colors.$bg-card;
    box-shadow: variables.$shadow-small;
  }

  &--elevated {
    background: colors.$bg-card;
    box-shadow: variables.$shadow-medium;

    &:hover {
      box-shadow: variables.$shadow-large;
    }
  }

  &--outlined {
    background: colors.$bg-card;
    border: 2px solid colors.$border-light;
    box-shadow: none;

    &:hover {
      border-color: colors.$border-accent;
    }
  }

  // -------------------------------------------------------------------------
  // STATES
  // -------------------------------------------------------------------------

  &--clickable {
    cursor: pointer;

    &:hover {
      transform: translateY(-1px);
      box-shadow: variables.$shadow-large;
    }

    &:active {
      transform: translateY(0);
    }

    &:focus {
      outline: 2px solid colors.$primary-green;
      outline-offset: 2px;
    }

    &:focus-visible {
      outline: 2px solid colors.$primary-green;
      outline-offset: 2px;
    }
  }

  &--loading {
    pointer-events: none;

    .base-card__content,
    .base-card__header,
    .base-card__footer,
    .base-card__actions {
      opacity: 0.6;
    }
  }

  // -------------------------------------------------------------------------
  // ELEMENTS
  // -------------------------------------------------------------------------

  &__loading {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(colors.$bg-card, 0.8);
    @include mixins.flex-center;
    z-index: 1;
  }

  &__spinner {
    animation: spin 1s linear infinite;
    color: colors.$primary-green;
  }

  &__header {
    padding: variables.$spacing-2;
    border-bottom: 1px solid colors.$border-light;

    // Remove bottom padding if followed by content
    + .base-card__content {
      padding-top: variables.$spacing-2;
    }
  }

  &__content {
    padding: variables.$spacing-2;
    flex: 1;
  }

  &__footer {
    padding: variables.$spacing-2;
    border-top: 1px solid colors.$border-light;
    background: rgba(colors.$border-light, 0.3);

    // Remove top padding if preceded by content
    .base-card__content + & {
      padding-top: variables.$spacing-2;
    }
  }

  &__actions {
    padding: variables.$spacing-2;
    border-top: 1px solid colors.$border-light;
    @include mixins.flex-between;
    gap: variables.$spacing-1;

    // Align actions to the right by default
    justify-content: flex-end;

    // If only one action, center it
    &:has(:only-child) {
      justify-content: center;
    }
  }

  // -------------------------------------------------------------------------
  // LAYOUT COMBINATIONS
  // -------------------------------------------------------------------------

  // Header + Content (no gap)
  &__header + &__content {
    padding-top: variables.$spacing-2;
  }

  // Content + Footer (no gap)
  &__content + &__footer {
    padding-top: variables.$spacing-2;
  }

  // Content + Actions (no gap)
  &__content + &__actions {
    padding-top: variables.$spacing-2;
  }

  // Footer + Actions (no gap)
  &__footer + &__actions {
    padding-top: variables.$spacing-1;
  }
}

// -------------------------------------------------------------------------
// RESPONSIVE DESIGN
// -------------------------------------------------------------------------

@include mixins.width-less-than('medium') {
  .base-card {
    &__header,
    &__content,
    &__footer,
    &__actions {
      padding: variables.$spacing-1_5;
    }

    &__actions {
      flex-direction: column;
      align-items: stretch;

      &:has(:only-child) {
        align-items: center;
      }
    }
  }
}

// -------------------------------------------------------------------------
// ANIMATIONS
// -------------------------------------------------------------------------

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

// -------------------------------------------------------------------------
// ACCESSIBILITY
// -------------------------------------------------------------------------

// High contrast mode support
@media (prefers-contrast: high) {
  .base-card {
    &--outlined {
      border-width: 3px;
    }
  }
}

// Reduced motion support
@media (prefers-reduced-motion: reduce) {
  .base-card {
    transition: none;

    &--clickable:hover {
      transform: none;
    }

    &__spinner {
      animation: none;
    }
  }
}
</style>
