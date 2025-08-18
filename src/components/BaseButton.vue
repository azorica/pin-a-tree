<script setup>
/**
 * BaseButton Component
 *
 * A reusable button component that follows WAI-ARIA button patterns
 * and provides consistent styling across the application.
 *
 * Features:
 * - Multiple variants (primary, secondary, ghost)
 * - Multiple sizes (small, medium, large)
 * - Loading and disabled states
 * - Icon support (left and right positioning)
 * - Full keyboard accessibility
 * - ARIA attributes for screen readers
 *
 * Props:
 * @prop {String} variant - Button style variant (primary, secondary, ghost)
 * @prop {String} size - Button size (small, medium, large)
 * @prop {Boolean} disabled - Whether button is disabled
 * @prop {Boolean} loading - Whether button is in loading state
 * @prop {String} type - HTML button type (button, submit, reset)
 * @prop {String} href - If provided, renders as link instead of button
 * @prop {String} target - Link target (when href is provided)
 * @prop {String} ariaLabel - Accessible label for screen readers
 *
 * Events:
 * @emits {Event} click - Emitted when button is clicked
 *
 * Slots:
 * @slot default - Button content
 * @slot icon-left - Icon positioned before text
 * @slot icon-right - Icon positioned after text
 */

import { computed } from 'vue'
import { Loader2 } from 'lucide-vue-next'

// ============================================================================
// PROPS & EMITS
// ============================================================================

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'ghost'].includes(value),
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: 'button',
    validator: (value) => ['button', 'submit', 'reset'].includes(value),
  },
  href: {
    type: String,
    default: null,
  },
  target: {
    type: String,
    default: null,
  },
  ariaLabel: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(['click'])

// ============================================================================
// COMPUTED PROPERTIES
// ============================================================================

const isDisabled = computed(() => props.disabled || props.loading)

const buttonClasses = computed(() => [
  'base-button',
  `base-button--${props.variant}`,
  `base-button--${props.size}`,
  {
    'base-button--disabled': isDisabled.value,
    'base-button--loading': props.loading,
  },
])

const componentType = computed(() => (props.href ? 'a' : 'button'))

const componentProps = computed(() => {
  const baseProps = {
    class: buttonClasses.value,
    'aria-label': props.ariaLabel,
    'aria-disabled': isDisabled.value,
  }

  if (props.href) {
    return {
      ...baseProps,
      href: props.href,
      target: props.target,
      role: 'button',
    }
  } else {
    return {
      ...baseProps,
      type: props.type,
      disabled: isDisabled.value,
    }
  }
})

// ============================================================================
// EVENT HANDLERS
// ============================================================================

const handleClick = (event) => {
  if (isDisabled.value) {
    event.preventDefault()
    return
  }
  emit('click', event)
}
</script>

<template>
  <component :is="componentType" v-bind="componentProps" @click="handleClick">
    <!-- Loading spinner -->
    <Loader2
      v-if="loading"
      class="base-button__spinner"
      :size="size === 'small' ? 14 : size === 'large' ? 20 : 16"
    />

    <!-- Left icon slot -->
    <span v-if="$slots['icon-left'] && !loading" class="base-button__icon base-button__icon--left">
      <slot name="icon-left" />
    </span>

    <!-- Button content -->
    <span v-if="$slots.default" class="base-button__content">
      <slot />
    </span>

    <!-- Right icon slot -->
    <span
      v-if="$slots['icon-right'] && !loading"
      class="base-button__icon base-button__icon--right"
    >
      <slot name="icon-right" />
    </span>
  </component>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as variables;
@use '@/styles/colors' as colors;
@use '@/styles/mixins' as mixins;

.base-button {
  @include mixins.button-base;

  // Ensure consistent display for both button and anchor elements
  display: inline-flex;
  text-decoration: none;

  // -------------------------------------------------------------------------
  // VARIANTS
  // -------------------------------------------------------------------------

  &--primary {
    background-color: colors.$primary-green;
    color: colors.$white;
    border: 2px solid colors.$primary-green;

    &:hover:not(:disabled) {
      background-color: colors.$primary-green-light;
      border-color: colors.$primary-green-light;
    }

    &:active:not(:disabled) {
      background-color: colors.$primary-green-dark;
      border-color: colors.$primary-green-dark;
    }
  }

  &--secondary {
    background-color: transparent;
    color: colors.$primary-green;
    border: 2px solid colors.$primary-green;

    &:hover:not(:disabled) {
      background-color: colors.$primary-green;
      color: colors.$white;
    }

    &:active:not(:disabled) {
      background-color: colors.$primary-green-dark;
      border-color: colors.$primary-green-dark;
      color: colors.$white;
    }
  }

  &--ghost {
    background-color: transparent;
    color: colors.$primary-green;
    border: 2px solid transparent;

    &:hover:not(:disabled) {
      background-color: rgba(colors.$primary-green, 0.1);
    }

    &:active:not(:disabled) {
      background-color: rgba(colors.$primary-green, 0.2);
    }
  }

  // -------------------------------------------------------------------------
  // SIZES
  // -------------------------------------------------------------------------

  &--small {
    padding: variables.$spacing-1 variables.$spacing-2;
    font-size: variables.$font-size-small;
    gap: variables.$spacing-0_5;
    min-height: 3.2rem;
  }

  &--medium {
    padding: variables.$spacing-1_5 variables.$spacing-3;
    font-size: variables.$font-size-body;
    gap: variables.$spacing-1;
    min-height: 4.4rem;
  }

  &--large {
    padding: variables.$spacing-2 variables.$spacing-4;
    font-size: variables.$font-size-large;
    gap: variables.$spacing-1_5;
    min-height: 5.2rem;
  }

  // -------------------------------------------------------------------------
  // STATES
  // -------------------------------------------------------------------------

  &--disabled {
    opacity: 0.6;
    cursor: not-allowed;

    &:hover,
    &:active {
      transform: none;
    }
  }

  &--loading {
    cursor: wait;

    .base-button__content {
      opacity: 0.7;
    }
  }

  // -------------------------------------------------------------------------
  // ELEMENTS
  // -------------------------------------------------------------------------

  &__spinner {
    animation: spin 1s linear infinite;
  }

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;

    &--left {
      margin-left: calc(-1 * variables.$spacing-0_5);
    }

    &--right {
      margin-right: calc(-1 * variables.$spacing-0_5);
    }
  }

  &__content {
    display: flex;
    align-items: center;
    white-space: nowrap;
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
  .base-button {
    border-width: 3px;
  }
}

// Reduced motion support
@media (prefers-reduced-motion: reduce) {
  .base-button {
    transition: none;

    &__spinner {
      animation: none;
    }
  }
}
</style>
