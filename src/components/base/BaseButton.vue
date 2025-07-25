<script setup>
/**
 * BaseButton Component
 *
 * A reusable button component with various styles and states.
 *
 * Features:
 * - Primary and secondary variants
 * - Icon support (left or right)
 * - Loading state
 * - Disabled state
 * - Full accessibility support
 *
 * Props:
 * @prop {String} variant - Button style variant ('primary' or 'secondary')
 * @prop {Boolean} loading - Whether the button is in a loading state
 * @prop {Boolean} disabled - Whether the button is disabled
 * @prop {Boolean} fullWidth - Whether the button should take full width
 * @prop {String} type - HTML button type ('button', 'submit', 'reset')
 *
 * Events:
 * @emits {Event} click - When the button is clicked
 *
 * Slots:
 * @slot default - Button content
 * @slot icon-left - Icon to show before content
 * @slot icon-right - Icon to show after content
 */

// Vue imports
import { computed } from 'vue';

// Props
const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary'].includes(value)
  },
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  fullWidth: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'button',
    validator: (value) => ['button', 'submit', 'reset'].includes(value)
  }
});

// Emits
const emit = defineEmits(['click']);

// Computed
const buttonClasses = computed(() => ({
  'base-button': true,
  [`base-button--${props.variant}`]: true,
  'base-button--loading': props.loading,
  'base-button--full-width': props.fullWidth
}));

// Methods
const handleClick = (event) => {
  if (!props.loading && !props.disabled) {
    emit('click', event);
  }
};
</script>

<template>
  <button
    :class="buttonClasses"
    :type="type"
    :disabled="disabled || loading"
    :aria-busy="loading"
    @click="handleClick"
  >
    <slot name="icon-left" />
    <slot />
    <slot name="icon-right" />
  </button>
</template>

<style scoped lang="scss">
.base-button {
  @include button-base;
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-1;
  min-width: 12rem;
  transition: all 0.2s ease;

  &--primary {
    background-color: $button-primary-bg;
    color: $button-primary-text;

    &:hover:not(:disabled) {
      background-color: $secondary-green;
    }
  }

  &--secondary {
    background-color: $button-secondary-bg;
    color: $button-secondary-text;
    border: 1px solid $button-secondary-border;

    &:hover:not(:disabled) {
      background-color: rgba($primary-green, 0.1);
    }
  }

  &--loading {
    cursor: wait;
    opacity: 0.7;

    &::after {
      content: '';
      position: absolute;
      width: 1.6rem;
      height: 1.6rem;
      border: 2px solid transparent;
      border-top-color: currentColor;
      border-radius: 50%;
      animation: button-loading 0.8s linear infinite;
    }
  }

  &--full-width {
    width: 100%;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  @include focus-visible;
}

@keyframes button-loading {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style> 