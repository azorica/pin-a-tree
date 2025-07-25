<script setup>
/**
 * TreePhotoUpload Component
 *
 * A component for uploading tree photos with preview and EXIF data extraction.
 *
 * Features:
 * - Photo upload with preview
 * - EXIF GPS data extraction
 * - Drag and drop support
 * - Error handling
 * - Loading state
 * - Full keyboard navigation
 * - Screen reader support
 * - ARIA live regions for status updates
 *
 * Events:
 * @emits {Object} update:photo - When a photo is uploaded (file object)
 * @emits {Object} update:location - When GPS data is extracted (lat/lng object)
 */

// Vue imports
import { ref } from 'vue';
import { Camera } from 'lucide-vue-next';
import exifr from 'exifr';

const emit = defineEmits(['update:photo', 'update:location']);

const file = ref(null);
const preview = ref('');
const loading = ref(false);
const uploadError = ref(null);

const handleFileUpload = async (event) => {
  const uploadedFile = event.target.files?.[0];
  if (!uploadedFile) return;

  loading.value = true;
  uploadError.value = null;

  try {
    // Create preview
    file.value = uploadedFile;
    preview.value = URL.createObjectURL(uploadedFile);
    emit('update:photo', uploadedFile);

    // Extract GPS coordinates from EXIF data
    const gps = await exifr.gps(uploadedFile);
    if (gps?.latitude && gps?.longitude) {
      emit('update:location', {
        lat: gps.latitude,
        lng: gps.longitude
      });
    }
  } catch (err) {
    console.error('Error processing file:', err);
    uploadError.value = 'Failed to process image file';
  } finally {
    loading.value = false;
  }
};

const handleDrop = async (event) => {
  event.preventDefault();
  const droppedFile = event.dataTransfer?.files?.[0];
  if (droppedFile?.type.startsWith('image/')) {
    const fakeEvent = { target: { files: [droppedFile] } };
    await handleFileUpload(fakeEvent);
  }
};

const handleDragOver = (event) => {
  event.preventDefault();
};

const handleReset = () => {
  if (preview.value) {
    URL.revokeObjectURL(preview.value);
  }
  file.value = null;
  preview.value = '';
  uploadError.value = null;
  emit('update:photo', null);
  emit('update:location', { lat: null, lng: null });
};

const handleKeyPress = (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.target.click();
  }
};
</script>

<template>
  <div
    class="tree-photo-upload"
    :class="{
      'has-preview': preview,
      'has-error': uploadError,
      'is-loading': loading
    }"
    @drop="handleDrop"
    @dragover="handleDragOver"
  >
    <label
      class="tree-photo-upload__label"
      tabindex="0"
      role="button"
      :aria-label="preview ? 'Click to change photo' : 'Click to upload photo'"
      @keypress="handleKeyPress"
    >
      <input
        type="file"
        accept="image/*"
        class="tree-photo-upload__input"
        aria-label="Upload tree photo"
        @change="handleFileUpload"
      />

      <div
        v-if="!preview"
        class="tree-photo-upload__placeholder"
        aria-hidden="true"
      >
        <Camera class="tree-photo-upload__icon" />
        <span class="tree-photo-upload__text">
          Drop your photo here or click to upload
        </span>
        <span class="tree-photo-upload__subtext">
          Supports: JPG, PNG (max 10MB)
        </span>
      </div>

      <img
        v-else
        :src="preview"
        :alt="'Uploaded tree photo'"
        class="tree-photo-upload__preview"
      />

      <div
        v-if="loading"
        class="tree-photo-upload__loading"
        role="status"
        aria-live="polite"
        aria-label="Uploading photo..."
      >
        <span class="tree-photo-upload__loading-text">Processing...</span>
      </div>
    </label>

    <p
      v-if="uploadError"
      class="tree-photo-upload__error"
      role="alert"
    >
      {{ uploadError }}
    </p>

    <div
      v-if="preview"
      class="tree-photo-upload__status"
      role="status"
      aria-live="polite"
    >
      Photo uploaded successfully
    </div>

    <button
      v-if="preview"
      type="button"
      class="tree-photo-upload__reset"
      aria-label="Remove uploaded photo"
      @click="handleReset"
    >
      Remove photo
    </button>
  </div>
</template>

<style scoped lang="scss">
.tree-photo-upload {
  position: relative;
  width: 100%;
  min-height: 30rem;
  border: 2px dashed $primary-green;
  border-radius: $border-radius-lg;
  overflow: hidden;
  transition: all 0.2s ease;

  &.has-preview {
    border-style: solid;
  }

  &.has-error {
    border-color: $error;
  }

  &.is-loading {
    opacity: 0.7;
    pointer-events: none;
  }

  &__label {
    display: block;
    width: 100%;
    height: 100%;
    min-height: inherit;
    cursor: pointer;

    &:focus {
      outline: none;
      box-shadow: inset 0 0 0 2px $primary-green;
    }

    &:focus:not(:focus-visible) {
      box-shadow: none;
    }
  }

  &__input {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  &__placeholder {
    @include flex-center;
    flex-direction: column;
    height: 100%;
    min-height: inherit;
    padding: $spacing-3;
    gap: $spacing-2;
    color: $primary-green;
    text-align: center;
  }

  &__icon {
    width: 4rem;
    height: 4rem;
  }

  &__text {
    font-size: $font-size-h4;
    font-weight: 500;
  }

  &__subtext {
    font-size: 1.4rem;
    color: rgba($primary-green, 0.7);
  }

  &__preview {
    width: 100%;
    height: 100%;
    min-height: inherit;
    object-fit: cover;
  }

  &__loading {
    @include flex-center;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba($dark-background, 0.7);
    color: $white;
  }

  &__loading-text {
    font-size: $font-size-h4;
    font-weight: 500;
  }

  &__error {
    margin-top: $spacing-1;
    color: $error;
    font-size: 1.4rem;
  }

  &__status {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  &__reset {
    position: absolute;
    top: $spacing-2;
    right: $spacing-2;
    padding: $spacing-1 $spacing-2;
    background-color: rgba($dark-background, 0.7);
    color: $white;
    border-radius: $border-radius-md;
    font-size: 1.4rem;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: rgba($dark-background, 0.9);
    }

    &:focus {
      outline: none;
      box-shadow: 0 0 0 2px $primary-green;
    }

    &:focus:not(:focus-visible) {
      box-shadow: none;
    }
  }
}
</style> 