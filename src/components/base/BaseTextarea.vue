<script setup>
/**
 * BaseTextarea Component
 *
 * A reusable textarea component for multi-line text input.
 *
 * Features:
 * - Auto-growing height
 * - Label and placeholder
 * - Error state and message
 * - Helper text
 * - Full accessibility support
 *
 * Props:
 * @prop {String} modelValue - v-model value
 * @prop {String} label - Textarea label
 * @prop {String} placeholder - Textarea placeholder
 * @prop {String} error - Error message
 * @prop {String} helper - Helper text
 * @prop {Boolean} required - Whether the textarea is required
 * @prop {Boolean} disabled - Whether the textarea is disabled
 * @prop {Number} rows - Initial number of rows
 * @prop {Number} maxRows - Maximum number of rows before scrolling
 *
 * Events:
 * @emits {String} update:modelValue - When textarea value changes
 */

// Vue imports
import { computed, ref, onMounted, nextTick } from 'vue';

// Props
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  error: {
    type: String,
    default: ''
  },
  helper: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  rows: {
    type: Number,
    default: 3
  },
  maxRows: {
    type: Number,
    default: 10
  }
});

// Emits
const emit = defineEmits(['update:modelValue']);

// Refs
const textarea = ref(null);

// Computed
const textareaId = computed(() => `textarea-${Math.random().toString(36).substr(2, 9)}`);

const textareaClasses = computed(() => ({
  'base-textarea__field': true,
  'base-textarea__field--error': props.error,
  'base-textarea__field--disabled': props.disabled
}));

// Methods
const handleInput = (event) => {
  emit('update:modelValue', event.target.value);
  adjustHeight();
};

const adjustHeight = async () => {
  if (!textarea.value) return;

  await nextTick();
  const el = textarea.value;
  const lineHeight = parseInt(getComputedStyle(el).lineHeight);
  const maxHeight = lineHeight * props.maxRows;

  el.style.height = 'auto';
  el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
};

// Lifecycle hooks
onMounted(() => {
  adjustHeight();
});
</script>

<template>
  <div class="base-textarea">
    <label v-if="label" :for="textareaId" class="base-textarea__label">
      {{ label }}
      <span v-if="required" class="base-textarea__required">*</span>
    </label>

    <textarea
      ref="textarea"
      :id="textareaId"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :rows="rows"
      :class="textareaClasses"
      :aria-invalid="!!error"
      :aria-describedby="error ? `${textareaId}-error` : undefined"
      @input="handleInput"
    />

    <p
      v-if="error"
      :id="`${textareaId}-error`"
      class="base-textarea__error"
      role="alert"
    >
      {{ error }}
    </p>

    <p v-if="helper && !error" class="base-textarea__helper">
      {{ helper }}
    </p>
  </div>
</template>

<style scoped lang="scss">
.base-textarea {
  display: grid;
  gap: $spacing-1;

  &__label {
    color: $white;
    font-weight: 500;
  }

  &__required {
    color: $error;
    margin-left: 0.2rem;
  }

  &__field {
    width: 100%;
    min-height: 6rem;
    padding: $spacing-1 $spacing-2;
    border: 1px solid $input-border;
    border-radius: $border-radius-md;
    background-color: $white;
    color: $dark-text;
    transition: all 0.2s ease;
    resize: none;
    overflow-y: auto;

    &::placeholder {
      color: rgba($dark-text, 0.5);
    }

    &:focus {
      outline: none;
      border-color: $input-focus;
      box-shadow: 0 0 0 2px rgba($input-focus, 0.2);
    }

    &--error {
      border-color: $error;

      &:focus {
        box-shadow: 0 0 0 2px rgba($error, 0.2);
      }
    }

    &--disabled {
      background-color: rgba($white, 0.9);
      cursor: not-allowed;
    }
  }

  &__error {
    color: $error;
    font-size: 1.4rem;
  }

  &__helper {
    color: rgba($white, 0.7);
    font-size: 1.4rem;
  }
}
</style> 