<script setup>
/**
 * StatsCard Component
 *
 * Displays a statistic value with an icon and label in a card format.
 * Used for showing community metrics and achievements.
 *
 * Features:
 * - Large number display with formatting
 * - Icon and label support
 * - Accessible design
 * - Animated number counting (optional)
 * - Responsive layout
 *
 * Props:
 * @prop {Number} value - The numeric value to display
 * @prop {String} label - Descriptive label for the statistic
 * @prop {String} icon - Icon to display (emoji or symbol)
 * @prop {Boolean} animated - Whether to animate the number counting
 */

// Vue imports
import { ref, computed, onMounted, watch } from 'vue'

// ============================================================================
// PROPS & EMITS
// ============================================================================

const props = defineProps({
  value: {
    type: Number,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: '📊'
  },
  animated: {
    type: Boolean,
    default: true
  }
})

// ============================================================================
// REACTIVE STATE
// ============================================================================

const displayValue = ref(0)
const isVisible = ref(false)

// ============================================================================
// COMPUTED PROPERTIES
// ============================================================================

const formattedValue = computed(() => {
  const value = Math.floor(displayValue.value)
  
  // Format large numbers with commas
  if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + 'M'
  } else if (value >= 1000) {
    return (value / 1000).toFixed(1) + 'K'
  } else {
    return value.toLocaleString()
  }
})

// ============================================================================
// ANIMATION FUNCTIONS
// ============================================================================

const animateValue = (start, end, duration = 1500) => {
  if (!props.animated) {
    displayValue.value = end
    return
  }

  const startTime = Date.now()
  const difference = end - start

  const step = () => {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / duration, 1)
    
    // Easing function for smooth animation
    const easeOut = 1 - Math.pow(1 - progress, 3)
    
    displayValue.value = start + (difference * easeOut)

    if (progress < 1) {
      requestAnimationFrame(step)
    } else {
      displayValue.value = end
    }
  }

  requestAnimationFrame(step)
}

// ============================================================================
// WATCHERS
// ============================================================================

watch(() => props.value, (newValue, oldValue) => {
  if (isVisible.value && props.animated) {
    animateValue(oldValue || 0, newValue)
  } else {
    displayValue.value = newValue
  }
})

// ============================================================================
// LIFECYCLE
// ============================================================================

onMounted(() => {
  // Use Intersection Observer for animation trigger
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !isVisible.value) {
        isVisible.value = true
        animateValue(0, props.value)
      }
    })
  }, {
    threshold: 0.5
  })

  const element = document.querySelector('.stats-card')
  if (element) {
    observer.observe(element)
  }

  // Cleanup on unmount
  return () => {
    if (element) {
      observer.unobserve(element)
    }
  }
})
</script>

<template>
  <div class="stats-card" role="region" :aria-label="`Statistic: ${formattedValue} ${label}`">
    <div class="stats-card__icon" aria-hidden="true">
      {{ icon }}
    </div>
    
    <div class="stats-card__content">
      <div class="stats-card__value" :aria-label="`${value} ${label}`">
        {{ formattedValue }}
      </div>
      <div class="stats-card__label">
        {{ label }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.stats-card {
  @include card-base;
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  transition: all var(--transition-normal);
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    border-color: var(--color-primary-green);
    box-shadow: var(--shadow-large);
  }

  // ============================================================================
  // ICON
  // ============================================================================

  &__icon {
    font-size: 4rem;
    margin-bottom: var(--spacing-md);
    line-height: 1;
    
    @include respond-to('mobile') {
      font-size: 3rem;
      margin-bottom: var(--spacing-sm);
    }
  }

  // ============================================================================
  // CONTENT
  // ============================================================================

  &__content {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  &__value {
    font-size: var(--font-size-heading-1);
    font-weight: var(--font-weight-bold);
    color: var(--color-primary-green);
    line-height: 1;
    
    @include respond-to('mobile') {
      font-size: var(--font-size-heading-2);
    }
  }

  &__label {
    font-size: var(--font-size-base);
    color: rgba(255, 255, 255, 0.8);
    font-weight: var(--font-weight-medium);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    
    @include respond-to('mobile') {
      font-size: var(--font-size-small);
    }
  }

  // ============================================================================
  // BACKGROUND DECORATION
  // ============================================================================

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 100%;
    height: 100%;
    background: radial-gradient(
      circle,
      rgba(46, 125, 50, 0.1) 0%,
      transparent 70%
    );
    opacity: 0;
    transition: opacity var(--transition-normal);
  }

  &:hover::before {
    opacity: 1;
  }

  // ============================================================================
  // RESPONSIVE DESIGN
  // ============================================================================

  @include respond-to('mobile') {
    padding: var(--spacing-md);
  }
}
</style>
