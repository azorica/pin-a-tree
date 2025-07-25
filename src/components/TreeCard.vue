<script setup>
/**
 * TreeCard Component
 *
 * A card component for displaying tree information.
 *
 * Features:
 * - Tree photo display
 * - Basic tree info
 * - Location info
 * - Date added
 * - Click to view details
 * - Full keyboard navigation
 * - Screen reader support
 *
 * Props:
 * @prop {Object} tree - Tree data object
 */

// Vue imports
import { computed } from 'vue';
import { useRouter } from 'vue-router';

// Component imports
import BaseCard from '@/components/base/BaseCard.vue';
import { TreePine, MapPin, Calendar } from 'lucide-vue-next';

// Props
const props = defineProps({
  tree: {
    type: Object,
    required: true,
    validator: (value) => {
      return value && value.id && value.name && value.photo && value.location;
    }
  }
});

// Router setup
const router = useRouter();

// Computed
const formattedDate = computed(() => {
  if (!props.tree.dateAdded) return '';
  return new Date(props.tree.dateAdded).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Methods
const handleClick = () => {
  router.push(`/tree/${props.tree.id}`);
};

const handleKeyPress = (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    handleClick();
  }
};
</script>

<template>
  <BaseCard
    class="tree-card"
    hoverable
    no-padding
    role="article"
    tabindex="0"
    :aria-label="`Tree: ${tree.name}`"
    @click="handleClick"
    @keypress="handleKeyPress"
  >
    <img
      :src="tree.photo"
      :alt="`Photo of ${tree.name}`"
      class="tree-card__photo"
    />

    <div class="tree-card__content">
      <h3 class="tree-card__title">{{ tree.name }}</h3>

      <div class="tree-card__meta">
        <div class="tree-card__meta-item" role="group" aria-label="Tree species">
          <TreePine
            class="tree-card__meta-icon"
            aria-hidden="true"
          />
          <span>{{ tree.species }}</span>
        </div>

        <div class="tree-card__meta-item" role="group" aria-label="Tree location">
          <MapPin
            class="tree-card__meta-icon"
            aria-hidden="true"
          />
          <span>{{ tree.location.address }}</span>
        </div>

        <div class="tree-card__meta-item" role="group" aria-label="Date added">
          <Calendar
            class="tree-card__meta-icon"
            aria-hidden="true"
          />
          <span>{{ formattedDate }}</span>
        </div>
      </div>

      <p
        v-if="tree.description"
        class="tree-card__description"
        aria-label="Tree description"
      >
        {{ tree.description }}
      </p>
    </div>
  </BaseCard>
</template>

<style scoped lang="scss">
.tree-card {
  height: 100%;
  background-color: $card-bg;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px $primary-green;
  }

  &__photo {
    width: 100%;
    height: 20rem;
    object-fit: cover;
  }

  &__content {
    padding: $spacing-2;
  }

  &__title {
    margin: 0 0 $spacing-2;
    color: $dark-text;
    font-size: $font-size-h3;
  }

  &__meta {
    display: grid;
    gap: $spacing-1;
    margin-bottom: $spacing-2;
  }

  &__meta-item {
    @include flex-center;
    justify-content: flex-start;
    gap: $spacing-1;
    color: $dark-text;
    font-size: 1.4rem;
  }

  &__meta-icon {
    width: 1.6rem;
    height: 1.6rem;
    color: $primary-green;
  }

  &__description {
    color: rgba($dark-text, 0.7);
    font-size: 1.4rem;
    line-height: 1.6;
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}
</style> 