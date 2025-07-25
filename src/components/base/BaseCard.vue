<script setup>
/**
 * BaseCard Component
 *
 * A reusable card component for displaying content in a contained area.
 *
 * Features:
 * - Flexible content areas (header, body, footer)
 * - Optional hover effect
 * - Customizable padding
 * - Shadow and border radius
 *
 * Props:
 * @prop {Boolean} hoverable - Whether to show hover effect
 * @prop {Boolean} noPadding - Whether to remove padding
 *
 * Slots:
 * @slot header - Card header content
 * @slot default - Main card content
 * @slot footer - Card footer content
 */

// Props
defineProps({
  hoverable: {
    type: Boolean,
    default: false
  },
  noPadding: {
    type: Boolean,
    default: false
  }
});
</script>

<template>
  <div
    class="base-card"
    :class="{
      'base-card--hoverable': hoverable,
      'base-card--no-padding': noPadding
    }"
  >
    <div v-if="$slots.header" class="base-card__header">
      <slot name="header" />
    </div>

    <div class="base-card__body">
      <slot />
    </div>

    <div v-if="$slots.footer" class="base-card__footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.base-card {
  background-color: $card-bg;
  border-radius: $border-radius-lg;
  box-shadow: $shadow-md;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &--hoverable {
    cursor: pointer;

    &:hover {
      transform: translateY(-2px);
      box-shadow: $shadow-lg;
    }
  }

  &:not(&--no-padding) {
    .base-card__header {
      padding: $spacing-2;
      border-bottom: 1px solid rgba($dark-text, 0.1);
    }

    .base-card__body {
      padding: $spacing-2;
    }

    .base-card__footer {
      padding: $spacing-2;
      border-top: 1px solid rgba($dark-text, 0.1);
    }
  }
}
</style> 