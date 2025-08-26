<template>
  <article class="tree-card" @click="$emit('click', tree)">
    <div class="tree-card__image-container">
      <img 
        :src="tree.image || defaultTreeImage"
        :alt="`${tree.species} planted by ${tree.planterName}`"
        class="tree-card__image"
        loading="lazy"
      />
      <div class="tree-card__date">
        {{ formatDate(tree.datePlanted) }}
      </div>
    </div>
    
    <div class="tree-card__content">
      <header class="tree-card__header">
        <h3 class="tree-card__title">{{ tree.species }}</h3>
        <p class="tree-card__subtitle">📍 {{ tree.location }}</p>
      </header>

      <div class="tree-card__meta">
        <div class="tree-card__planter">
          <img 
            :src="tree.planterAvatar || defaultAvatarImage"
            :alt="tree.planterName"
            class="tree-card__planter-avatar"
          />
          <span class="tree-card__planter-name">{{ tree.planterName }}</span>
        </div>
      </div>

      <p v-if="tree.description" class="tree-card__description">
        {{ truncateText(tree.description, 120) }}
      </p>
    </div>
  </article>
</template>

<script setup>
const props = defineProps({
  tree: {
    type: Object,
    required: true
  }
})

defineEmits(['click'])

const defaultTreeImage = 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop'
const defaultAvatarImage = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face'

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const diffDays = Math.ceil(Math.abs(now - date) / (1000 * 60 * 60 * 24))
  
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
  if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`
  return `${Math.ceil(diffDays / 365)} years ago`
}

const truncateText = (text, length) => {
  if (!text || text.length <= length) return text
  return text.slice(0, length) + '...'
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables';

.tree-card {
  background: var(--surface);
  border-radius: var(--border-radius-lg);
  border: 1px solid var(--border-light);
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
    border-color: var(--primary-light);
  }
}

.tree-card__image-container {
  position: relative;
  height: 240px;
  overflow: hidden;
}

.tree-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  
  .tree-card:hover & {
    transform: scale(1.05);
  }
}

.tree-card__date {
  position: absolute;
  bottom: var(--spacing-sm);
  left: var(--spacing-sm);
  padding: var(--spacing-xs) var(--spacing-sm);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border-radius: var(--border-radius);
  font-size: var(--font-size-xs);
}

.tree-card__content {
  padding: var(--spacing-md);
}

.tree-card__header {
  margin-bottom: var(--spacing-sm);
}

.tree-card__title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin: 0 0 var(--spacing-xs) 0;
  line-height: 1.3;
}

.tree-card__subtitle {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin: 0;
}

.tree-card__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-sm);
}

.tree-card__planter {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.tree-card__planter-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--border-light);
}

.tree-card__planter-name {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  font-weight: var(--font-weight-medium);
}

.tree-card__description {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: 1.5;
  margin: 0;
}

// Responsive design
@media (max-width: 768px) {
  .tree-card__image-container {
    height: 200px;
  }
  
  .tree-card__content {
    padding: var(--spacing-sm);
  }
  
  .tree-card__meta {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-xs);
  }
}
</style>
