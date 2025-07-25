<script setup>
/**
 * BaseInput Component
 *
 * A reusable input component with various types and states.
 *
 * Features:
 * - Support for different input types
 * - Label and placeholder
 * - Error state and message
 * - Helper text
 * - Full accessibility support
 *
 * Props:
 * @prop {String} modelValue - v-model value
 * @prop {String} type - Input type (text, email, password, etc.)
 * @prop {String} label - Input label
 * @prop {String} placeholder - Input placeholder
 * @prop {String} error - Error message
 * @prop {String} helper - Helper text
 * @prop {Boolean} required - Whether the input is required
 * @prop {Boolean} disabled - Whether the input is disabled
 *
 * Events:
 * @emits {String} update:modelValue - When input value changes
 */

// Vue imports
import { computed } from 'vue';

// Props
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
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
  }
});

// Emits
const emit = defineEmits(['update:modelValue']);

// Computed
const inputId = computed(() => `input-${Math.random().toString(36).substr(2, 9)}`);

const inputClasses = computed(() => ({
  'base-input__field': true,
  'base-input__field--error': props.error,
  'base-input__field--disabled': props.disabled
}));

// Methods
const handleInput = (event) => {
  emit('update:modelValue', event.target.value);
};
</script>

<template>
  <div class="base-input">
    <label v-if="label" :for="inputId" class="base-input__label">
      {{ label }}
      <span v-if="required" class="base-input__required">*</span>
    </label>

    <input
      :id="inputId"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :class="inputClasses"
      :aria-invalid="!!error"
      :aria-describedby="error ? `${inputId}-error` : undefined"
      @input="handleInput"
    />

    <p
      v-if="error"
      :id="`${inputId}-error`"
      class="base-input__error"
      role="alert"
    >
      {{ error }}
    </p>

    <p v-if="helper && !error" class="base-input__helper">
      {{ helper }}
    </p>
  </div>
</template>

<style scoped lang="scss">
.base-input {
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
    padding: $spacing-1 $spacing-2;
    border: 1px solid $input-border;
    border-radius: $border-radius-md;
    background-color: $white;
    color: $dark-text;
    transition: all 0.2s ease;

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