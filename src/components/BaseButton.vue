<script setup>
/**
 * BaseButton Component
 *
 * A reusable button component that follows WAI-ARIA button patterns.
 * Provides consistent styling and behavior for all buttons in the application.
 *
 * Features:
 * - Multiple variants (primary, secondary, ghost)
 * - Different sizes (small, medium, large)
 * - Loading state support
 * - Disabled state handling
 * - Keyboard accessibility
 * - ARIA support
 *
 * Props:
 * @prop {String} variant - Button style variant ('primary', 'secondary', 'ghost')
 * @prop {String} size - Button size ('small', 'medium', 'large')
 * @prop {Boolean} disabled - Whether button is disabled
 * @prop {Boolean} loading - Whether button is in loading state
 * @prop {String} type - Button type ('button', 'submit', 'reset')
 * @prop {String} ariaLabel - Accessible label for screen readers
 *
 * Events:
 * @emits click - When button is clicked
 *
 * Slots:
 * @slot default - Button content
 */

// Vue imports
import { computed } from 'vue'

// ============================================================================
// PROPS & EMITS
// ============================================================================

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'ghost'].includes(value)
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'button',
    validator: (value) => ['button', 'submit', 'reset'].includes(value)
  },
  ariaLabel: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['click'])

// ============================================================================
// COMPUTED PROPERTIES
// ============================================================================

const buttonClasses = computed(() => [
  'base-button',
  `base-button--${props.variant}`,
  `base-button--${props.size}`,
  {
    'base-button--disabled': props.disabled || props.loading,
    'base-button--loading': props.loading
  }
])

const isClickable = computed(() => !props.disabled && !props.loading)

// ============================================================================
// EVENT HANDLERS
// ============================================================================

const handleClick = (event) => {
  if (isClickable.value) {
    emit('click', event)
  }
}

const handleKeydown = (event) => {
  // Handle Enter and Space key activation
  if ((event.key === 'Enter' || event.key === ' ') && isClickable.value) {
    event.preventDefault()
    emit('click', event)
  }
}
</script>

<template>
  <button
    :class="buttonClasses"
    :type="type"
    :disabled="disabled || loading"
    :aria-label="ariaLabel"
    :aria-disabled="disabled || loading"
    @click="handleClick"
    @keydown="handleKeydown"
  >
    <span v-if="loading" class="base-button__spinner" aria-hidden="true"></span>
    <span class="base-button__content" :class="{ 'base-button__content--hidden': loading }">
      <slot />
    </span>
  </button>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.base-button {
  @include button-base;
  position: relative;
  overflow: hidden;

  // ============================================================================
  // VARIANTS
  // ============================================================================

  &--primary {
    background-color: $primary-green;
    color: $text-primary;
    
    &:hover:not(:disabled) {
      background-color: $secondary-green;
      transform: translateY(-1px);
    }
    
    &:active:not(:disabled) {
      transform: translateY(0);
      background-color: #1b5e20;
    }
  }

  &--secondary {
    background-color: transparent;
    color: $primary-green;
    border: 2px solid $primary-green;
    
    &:hover:not(:disabled) {
      background-color: $primary-green;
      color: $text-primary;
    }
    
    &:active:not(:disabled) {
      background-color: $secondary-green;
    }
  }

  &--ghost {
    background-color: transparent;
    color: $text-primary;
    border: none;
    
    &:hover:not(:disabled) {
      background-color: rgba(255, 255, 255, 0.1);
    }
    
    &:active:not(:disabled) {
      background-color: rgba(255, 255, 255, 0.2);
    }
  }

  // ============================================================================
  // SIZES
  // ============================================================================

  &--small {
    padding: 0.8rem 1.6rem;
    font-size: 1.4rem;
  }

  &--medium {
    padding: 1.2rem 2.4rem;
    font-size: $font-size-button;
  }

  &--large {
    padding: 1.6rem 3.2rem;
    font-size: $font-size-large;
  }

  // ============================================================================
  // STATES
  // ============================================================================

  &--disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
  }

  &--loading {
    cursor: wait;
  }

  // ============================================================================
  // LOADING SPINNER
  // ============================================================================

  &__spinner {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 1.6rem;
    height: 1.6rem;
    border: 2px solid transparent;
    border-top: 2px solid currentColor;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  &__content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    transition: opacity $transition-normal;

    &--hidden {
      opacity: 0;
    }
  }

  // ============================================================================
  // ANIMATIONS
  // ============================================================================

  @keyframes spin {
    0% { transform: translate(-50%, -50%) rotate(0deg); }
    100% { transform: translate(-50%, -50%) rotate(360deg); }
  }
}
</style>
