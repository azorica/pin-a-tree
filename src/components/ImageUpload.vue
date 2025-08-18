<script setup>
/**
 * ImageUpload Component
 *
 * Reusable image upload component with drag & drop, preview, and EXIF extraction.
 * Integrates with the useImageUpload composable for functionality.
 *
 * Features:
 * - Drag and drop upload
 * - Click to select files
 * - Image preview
 * - EXIF GPS data extraction
 * - Upload progress
 * - Error handling
 * - Accessibility support
 */

import { watch } from 'vue'
import { Camera, Upload, X, MapPin, AlertCircle, Check } from 'lucide-vue-next'
import { useImageUpload } from '@/composables/useImageUpload'

import BaseButton from '@/components/BaseButton.vue'

// ============================================================================
// PROPS
// ============================================================================

const props = defineProps({
  modelValue: {
    type: File,
    default: null,
  },
  accept: {
    type: String,
    default: 'image/*',
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  required: {
    type: Boolean,
    default: false,
  },
  showPreview: {
    type: Boolean,
    default: true,
  },
  showGpsInfo: {
    type: Boolean,
    default: true,
  },
  autoUpload: {
    type: Boolean,
    default: false,
  },
  uploadOptions: {
    type: Object,
    default: () => ({}),
  },
})

// ============================================================================
// EMITS
// ============================================================================

const emit = defineEmits([
  'update:modelValue',
  'file-selected',
  'gps-extracted',
  'upload-complete',
  'upload-error',
  'file-removed',
])

// ============================================================================
// COMPOSABLES
// ============================================================================

const {
  selectedFile,
  previewUrl,
  gpsData,
  uploadResult,
  isUploading,
  uploadProgress,
  errors,
  handleFileSelect,
  handleFileDrop,
  uploadFile,
  removeFile,
  hasFile,
  hasPreview,
  hasGpsData,
  hasErrors,
  fileSize,
  fileName,
} = useImageUpload()

// ============================================================================
// METHODS
// ============================================================================

const onFileSelect = async (event) => {
  if (props.disabled) return

  const result = await handleFileSelect(event)

  if (result.success) {
    emit('update:modelValue', selectedFile.value)
    emit('file-selected', {
      file: selectedFile.value,
      preview: previewUrl.value,
      gps: gpsData.value,
    })

    if (gpsData.value) {
      emit('gps-extracted', gpsData.value)
    }

    // Auto upload if enabled
    if (props.autoUpload) {
      try {
        const uploadResult = await uploadFile(props.uploadOptions)
        emit('upload-complete', uploadResult)
      } catch (error) {
        emit('upload-error', error)
      }
    }
  }
}

const onFileDrop = async (event) => {
  if (props.disabled) return

  const result = await handleFileDrop(event)

  if (result.success) {
    emit('update:modelValue', selectedFile.value)
    emit('file-selected', {
      file: selectedFile.value,
      preview: previewUrl.value,
      gps: gpsData.value,
    })

    if (gpsData.value) {
      emit('gps-extracted', gpsData.value)
    }

    // Auto upload if enabled
    if (props.autoUpload) {
      try {
        const uploadResult = await uploadFile(props.uploadOptions)
        emit('upload-complete', uploadResult)
      } catch (error) {
        emit('upload-error', error)
      }
    }
  }
}

const onFileRemove = () => {
  removeFile()
  emit('update:modelValue', null)
  emit('file-removed')
}

const onDragOver = (event) => {
  event.preventDefault()
}

const onDragEnter = (event) => {
  event.preventDefault()
}

const onDragLeave = (event) => {
  event.preventDefault()
}

// ============================================================================
// WATCHERS
// ============================================================================

watch(
  () => props.modelValue,
  (newValue) => {
    if (!newValue && hasFile()) {
      removeFile()
    }
  },
)

// ============================================================================
// EXPOSE METHODS
// ============================================================================

defineExpose({
  uploadFile,
  removeFile,
  hasFile,
  hasGpsData,
  gpsData,
  selectedFile,
  previewUrl,
})
</script>

<template>
  <div class="image-upload">
    <!-- Upload area -->
    <div
      v-if="!hasFile()"
      class="image-upload__drop-zone"
      :class="{ 'image-upload__drop-zone--disabled': disabled }"
      @click="!disabled && $refs.fileInput.click()"
      @drop="onFileDrop"
      @dragover="onDragOver"
      @dragenter="onDragEnter"
      @dragleave="onDragLeave"
    >
      <Camera :size="48" class="image-upload__icon" />
      <h3 class="image-upload__title">Upload Image</h3>
      <p class="image-upload__description">Drop an image here or click to select</p>
      <p v-if="showGpsInfo" class="image-upload__gps-hint">
        Images with GPS data will automatically set location
      </p>

      <input
        ref="fileInput"
        type="file"
        :accept="accept"
        :multiple="multiple"
        :disabled="disabled"
        :required="required"
        style="display: none"
        @change="onFileSelect"
      />
    </div>

    <!-- Preview area -->
    <div v-else class="image-upload__preview">
      <!-- Image preview -->
      <div v-if="showPreview && hasPreview()" class="image-upload__preview-container">
        <img :src="previewUrl" :alt="fileName()" class="image-upload__preview-image" />

        <!-- Remove button -->
        <BaseButton
          variant="ghost"
          size="small"
          class="image-upload__remove-button"
          @click="onFileRemove"
          aria-label="Remove image"
        >
          <template #icon-left>
            <X :size="16" />
          </template>
        </BaseButton>
      </div>

      <!-- File info -->
      <div class="image-upload__file-info">
        <h4 class="image-upload__file-name">{{ fileName() }}</h4>
        <p class="image-upload__file-size">{{ fileSize() }}</p>

        <!-- GPS info -->
        <div v-if="showGpsInfo && hasGpsData()" class="image-upload__gps-info">
          <div class="image-upload__gps-indicator">
            <MapPin :size="16" />
            <span>GPS coordinates detected</span>
            <Check :size="16" class="image-upload__gps-check" />
          </div>
          <p class="image-upload__gps-coords">
            {{ gpsData.latitude.toFixed(6) }}, {{ gpsData.longitude.toFixed(6) }}
          </p>
        </div>

        <!-- Upload progress -->
        <div v-if="isUploading" class="image-upload__progress">
          <div class="image-upload__progress-bar">
            <div class="image-upload__progress-fill" :style="{ width: `${uploadProgress}%` }"></div>
          </div>
          <span class="image-upload__progress-text">{{ uploadProgress }}%</span>
        </div>
      </div>
    </div>

    <!-- Errors -->
    <div v-if="hasErrors()" class="image-upload__errors">
      <div v-if="errors.validation" class="image-upload__error">
        <AlertCircle :size="16" />
        <span>{{ errors.validation }}</span>
      </div>
      <div v-if="errors.upload" class="image-upload__error">
        <AlertCircle :size="16" />
        <span>{{ errors.upload }}</span>
      </div>
      <div v-if="errors.exif" class="image-upload__error">
        <AlertCircle :size="16" />
        <span>{{ errors.exif }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as variables;
@use '@/styles/colors' as colors;
@use '@/styles/mixins' as mixins;

.image-upload {
  width: 100%;

  // -------------------------------------------------------------------------
  // DROP ZONE
  // -------------------------------------------------------------------------

  &__drop-zone {
    border: 3px dashed colors.$border-light;
    border-radius: variables.$border-radius-large;
    padding: variables.$spacing-6;
    text-align: center;
    cursor: pointer;
    transition: all variables.$transition-normal;
    background: colors.$bg-card;
    min-height: 20rem;
    @include mixins.flex-center;
    flex-direction: column;

    &:hover:not(&--disabled) {
      border-color: colors.$primary-green;
      background: rgba(colors.$primary-green, 0.05);
    }

    &--disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  &__icon {
    color: colors.$text-muted;
    margin-bottom: variables.$spacing-2;
  }

  &__title {
    font-size: variables.$font-size-large;
    color: colors.$text-secondary;
    margin: 0 0 variables.$spacing-1;
    font-weight: variables.$font-weight-medium;
  }

  &__description {
    color: colors.$text-muted;
    margin: 0 0 variables.$spacing-2;
  }

  &__gps-hint {
    color: colors.$text-muted;
    font-size: variables.$font-size-small;
    margin: 0;
    font-style: italic;
  }

  // -------------------------------------------------------------------------
  // PREVIEW
  // -------------------------------------------------------------------------

  &__preview {
    display: flex;
    flex-direction: column;
    gap: variables.$spacing-3;
  }

  &__preview-container {
    position: relative;
    display: inline-block;
    align-self: center;
  }

  &__preview-image {
    max-width: 100%;
    max-height: 30rem;
    border-radius: variables.$border-radius-large;
    box-shadow: variables.$shadow-medium;
    display: block;
  }

  &__remove-button {
    position: absolute;
    top: variables.$spacing-1;
    right: variables.$spacing-1;
    background: rgba(colors.$bg-card, 0.9);
    backdrop-filter: blur(4px);
    border: 1px solid colors.$border-light;
  }

  // -------------------------------------------------------------------------
  // FILE INFO
  // -------------------------------------------------------------------------

  &__file-info {
    text-align: center;
  }

  &__file-name {
    font-size: variables.$font-size-body;
    color: colors.$text-secondary;
    margin: 0 0 variables.$spacing-0_5;
    word-break: break-word;
  }

  &__file-size {
    font-size: variables.$font-size-small;
    color: colors.$text-muted;
    margin: 0 0 variables.$spacing-2;
  }

  // -------------------------------------------------------------------------
  // GPS INFO
  // -------------------------------------------------------------------------

  &__gps-info {
    background: rgba(colors.$primary-green, 0.1);
    border: 1px solid rgba(colors.$primary-green, 0.2);
    border-radius: variables.$border-radius-medium;
    padding: variables.$spacing-2;
    margin-bottom: variables.$spacing-2;
  }

  &__gps-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: variables.$spacing-0_5;
    color: colors.$primary-green;
    font-weight: variables.$font-weight-medium;
    font-size: variables.$font-size-small;
  }

  &__gps-check {
    color: colors.$success;
  }

  &__gps-coords {
    font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
    font-size: variables.$font-size-small;
    color: colors.$primary-green;
    margin: variables.$spacing-0_5 0 0;
  }

  // -------------------------------------------------------------------------
  // UPLOAD PROGRESS
  // -------------------------------------------------------------------------

  &__progress {
    display: flex;
    align-items: center;
    gap: variables.$spacing-2;
  }

  &__progress-bar {
    flex: 1;
    height: 0.6rem;
    background: colors.$border-light;
    border-radius: variables.$border-radius-small;
    overflow: hidden;
  }

  &__progress-fill {
    height: 100%;
    background: colors.$primary-green;
    transition: width variables.$transition-normal;
  }

  &__progress-text {
    font-size: variables.$font-size-small;
    color: colors.$text-muted;
    font-weight: variables.$font-weight-medium;
    min-width: 3rem;
  }

  // -------------------------------------------------------------------------
  // ERRORS
  // -------------------------------------------------------------------------

  &__errors {
    margin-top: variables.$spacing-2;
  }

  &__error {
    display: flex;
    align-items: center;
    gap: variables.$spacing-0_5;
    color: colors.$error;
    font-size: variables.$font-size-small;
    margin-bottom: variables.$spacing-1;

    &:last-child {
      margin-bottom: 0;
    }
  }

  // -------------------------------------------------------------------------
  // RESPONSIVE ADJUSTMENTS
  // -------------------------------------------------------------------------

  @include mixins.width-less-than('medium') {
    &__drop-zone {
      min-height: 15rem;
      padding: variables.$spacing-4;
    }

    &__preview-image {
      max-height: 20rem;
    }

    &__icon {
      width: 4rem;
      height: 4rem;
    }
  }

  // -------------------------------------------------------------------------
  // ACCESSIBILITY
  // -------------------------------------------------------------------------

  @media (prefers-reduced-motion: reduce) {
    &__drop-zone,
    &__progress-fill {
      transition: none;
    }
  }

  // High contrast mode
  @media (prefers-contrast: high) {
    &__drop-zone {
      border-width: 4px;
    }

    &__preview-image {
      border: 2px solid colors.$border-dark;
    }
  }
}
</style>
