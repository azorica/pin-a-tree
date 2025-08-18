<script setup>
/**
 * AddTreeView Component
 *
 * Form for adding a new tree to the community map.
 * Includes photo upload, EXIF GPS extraction, manual location entry,
 * and tree details form.
 *
 * Features:
 * - Photo upload with drag & drop
 * - EXIF GPS coordinate extraction
 * - Manual GPS coordinate entry
 * - Tree information form
 * - Form validation
 * - Progress feedback
 */

import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTreeStore } from '@/stores/treeStore'
import { useUserStore } from '@/stores/userStore'
import * as imageService from '@/services/imageService'
import { Camera, MapPin, TreePine, Upload, AlertCircle } from 'lucide-vue-next'

import BaseButton from '@/components/BaseButton.vue'
import BaseCard from '@/components/BaseCard.vue'
import BaseMap from '@/components/BaseMap.vue'
import ImageUpload from '@/components/ImageUpload.vue'

// ============================================================================
// COMPOSABLES
// ============================================================================

const router = useRouter()
const treeStore = useTreeStore()
const userStore = useUserStore()

// ============================================================================
// REACTIVE STATE
// ============================================================================

const formData = ref({
  name: '',
  species: '',
  description: '',
  datePlanted: '',
  photo: null,
  location: {
    latitude: null,
    longitude: null,
    address: '',
    method: 'auto', // 'auto' (EXIF) or 'manual'
  },
})

const errors = ref({})
const isSubmitting = ref(false)
const uploadProgress = ref(0)

// ============================================================================
// COMPUTED PROPERTIES
// ============================================================================

const isFormValid = computed(() => {
  return (
    formData.value.name.trim() &&
    formData.value.species.trim() &&
    formData.value.datePlanted &&
    formData.value.location.latitude !== null &&
    formData.value.location.longitude !== null
  )
})

const hasLocationData = computed(() => {
  return formData.value.location.latitude !== null && formData.value.location.longitude !== null
})

// ============================================================================
// METHODS
// ============================================================================

const handleFileSelected = ({ file, gps }) => {
  formData.value.photo = file

  if (gps) {
    formData.value.location.latitude = gps.latitude
    formData.value.location.longitude = gps.longitude
    formData.value.location.method = 'auto'
    formData.value.location.address = `${gps.latitude.toFixed(4)}, ${gps.longitude.toFixed(4)}`
    delete errors.value.location
  }
}

const handleFileRemoved = () => {
  formData.value.photo = null
  // Reset location if it was from EXIF
  if (formData.value.location.method === 'auto') {
    formData.value.location.latitude = null
    formData.value.location.longitude = null
    formData.value.location.address = ''
  }
}

const getCurrentLocation = async () => {
  if (!navigator.geolocation) {
    errors.value.location = 'Geolocation is not supported by your browser'
    return
  }

  try {
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject)
    })

    formData.value.location.latitude = position.coords.latitude
    formData.value.location.longitude = position.coords.longitude
    formData.value.location.method = 'manual'
    formData.value.location.address = `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`

    delete errors.value.location
  } catch (error) {
    errors.value.location = 'Unable to get your current location'
  }
}

const handleMapClick = (coordinates) => {
  formData.value.location.latitude = coordinates.lat
  formData.value.location.longitude = coordinates.lng
  formData.value.location.method = 'manual'
  formData.value.location.address = `${coordinates.lat.toFixed(4)}, ${coordinates.lng.toFixed(4)}`
  delete errors.value.location
}

const validateForm = () => {
  const newErrors = {}

  if (!formData.value.name.trim()) {
    newErrors.name = 'Tree name is required'
  }

  if (!formData.value.species.trim()) {
    newErrors.species = 'Species is required'
  }

  if (!formData.value.datePlanted) {
    newErrors.datePlanted = 'Date planted is required'
  }

  if (!hasLocationData.value) {
    newErrors.location = 'Location coordinates are required'
  }

  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return

  isSubmitting.value = true

  try {
    let photoUrl = null

    // Upload photo if one was selected
    if (formData.value.photo) {
      try {
        const uploadResult = await imageService.uploadImage(formData.value.photo, {
          token: userStore.token,
          onProgress: (progress) => {
            uploadProgress.value = progress
          },
        })
        photoUrl = uploadResult.url
      } catch (uploadError) {
        console.warn('Photo upload failed, proceeding without photo:', uploadError)
        // Continue with tree creation even if photo upload fails
      }
    }

    const treeData = {
      name: formData.value.name.trim(),
      species: formData.value.species.trim(),
      description: formData.value.description.trim(),
      datePlanted: formData.value.datePlanted,
      location: {
        latitude: formData.value.location.latitude,
        longitude: formData.value.location.longitude,
        address:
          formData.value.location.address ||
          `${formData.value.location.latitude.toFixed(4)}, ${formData.value.location.longitude.toFixed(4)}`,
      },
      // Use actual uploaded photo URL or empty array if no photo
      photos: photoUrl ? [photoUrl] : [],
    }

    await treeStore.createTree(treeData)

    // Redirect to map or tree detail
    router.push('/map')
  } catch (error) {
    errors.value.submit = error.message || 'Failed to add tree'
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = () => {
  formData.value = {
    name: '',
    species: '',
    description: '',
    datePlanted: '',
    photo: null,
    location: {
      latitude: null,
      longitude: null,
      address: '',
      method: 'auto',
    },
  }
  errors.value = {}
  photoPreview.value = null
  uploadProgress.value = 0
}
</script>

<template>
  <div class="add-tree-view">
    <div class="container">
      <!-- Header -->
      <header class="add-tree-view__header">
        <h1 class="add-tree-view__title">Add Your Tree</h1>
        <p class="add-tree-view__subtitle">Share your tree planting story with the community</p>
      </header>

      <!-- Main form -->
      <form @submit.prevent="handleSubmit" class="add-tree-view__form">
        <div class="add-tree-view__form-grid">
          <!-- Photo upload section -->
          <BaseCard class="add-tree-view__photo-section">
            <template #header>
              <h2>Tree Photo</h2>
            </template>

            <ImageUpload
              v-model="formData.photo"
              @file-selected="handleFileSelected"
              @file-removed="handleFileRemoved"
              show-gps-info
            />
          </BaseCard>

          <!-- Tree information section -->
          <BaseCard class="add-tree-view__info-section">
            <template #header>
              <h2>Tree Information</h2>
            </template>

            <div class="add-tree-view__form-fields">
              <!-- Tree name -->
              <div class="add-tree-view__field">
                <label for="tree-name" class="add-tree-view__label"> Tree Name * </label>
                <input
                  id="tree-name"
                  v-model="formData.name"
                  type="text"
                  class="add-tree-view__input"
                  :class="{ 'add-tree-view__input--error': errors.name }"
                  placeholder="e.g., My Backyard Oak"
                />
                <span v-if="errors.name" class="add-tree-view__error">
                  {{ errors.name }}
                </span>
              </div>

              <!-- Species -->
              <div class="add-tree-view__field">
                <label for="tree-species" class="add-tree-view__label"> Species * </label>
                <input
                  id="tree-species"
                  v-model="formData.species"
                  type="text"
                  class="add-tree-view__input"
                  :class="{ 'add-tree-view__input--error': errors.species }"
                  placeholder="e.g., Quercus robur (English Oak)"
                />
                <span v-if="errors.species" class="add-tree-view__error">
                  {{ errors.species }}
                </span>
              </div>

              <!-- Date planted -->
              <div class="add-tree-view__field">
                <label for="date-planted" class="add-tree-view__label"> Date Planted * </label>
                <input
                  id="date-planted"
                  v-model="formData.datePlanted"
                  type="date"
                  class="add-tree-view__input"
                  :class="{ 'add-tree-view__input--error': errors.datePlanted }"
                />
                <span v-if="errors.datePlanted" class="add-tree-view__error">
                  {{ errors.datePlanted }}
                </span>
              </div>

              <!-- Description -->
              <div class="add-tree-view__field">
                <label for="tree-description" class="add-tree-view__label"> Description </label>
                <textarea
                  id="tree-description"
                  v-model="formData.description"
                  class="add-tree-view__textarea"
                  placeholder="Tell us about this tree..."
                  rows="4"
                ></textarea>
              </div>
            </div>
          </BaseCard>

          <!-- Location section -->
          <BaseCard class="add-tree-view__location-section">
            <template #header>
              <h2>Location</h2>
            </template>

            <div class="add-tree-view__location-content">
              <div v-if="!hasLocationData" class="add-tree-view__location-empty">
                <MapPin :size="32" />
                <p>No location data yet</p>
                <p class="add-tree-view__location-hint">
                  Upload a photo with GPS data or use current location
                </p>

                <BaseButton variant="secondary" @click="getCurrentLocation">
                  <template #icon-left>
                    <MapPin :size="16" />
                  </template>
                  Use Current Location
                </BaseButton>
              </div>

              <div v-else class="add-tree-view__location-data">
                <div class="add-tree-view__coordinates">
                  <strong>Coordinates:</strong>
                  {{ formData.location.latitude.toFixed(6) }},
                  {{ formData.location.longitude.toFixed(6) }}
                </div>

                <div class="add-tree-view__location-method">
                  <small>
                    {{
                      formData.location.method === 'auto'
                        ? 'From photo EXIF data'
                        : 'Manual location'
                    }}
                  </small>
                </div>

                <!-- Manual coordinate entry -->
                <!-- Interactive map for location selection -->
                <div class="add-tree-view__location-map">
                  <h4>Click on the map to set location:</h4>
                  <BaseMap
                    :trees="[]"
                    :center="{
                      lat: formData.location.latitude || 40.7128,
                      lng: formData.location.longitude || -74.006,
                    }"
                    :zoom="10"
                    height="300px"
                    @map-click="handleMapClick"
                  />
                </div>

                <details class="add-tree-view__manual-coords">
                  <summary>Edit coordinates manually</summary>
                  <div class="add-tree-view__coord-inputs">
                    <div class="add-tree-view__field">
                      <label for="latitude">Latitude</label>
                      <input
                        id="latitude"
                        v-model.number="formData.location.latitude"
                        type="number"
                        step="any"
                        class="add-tree-view__input"
                        placeholder="e.g., 40.7128"
                      />
                    </div>
                    <div class="add-tree-view__field">
                      <label for="longitude">Longitude</label>
                      <input
                        id="longitude"
                        v-model.number="formData.location.longitude"
                        type="number"
                        step="any"
                        class="add-tree-view__input"
                        placeholder="e.g., -74.0060"
                      />
                    </div>
                  </div>
                </details>
              </div>

              <span v-if="errors.location" class="add-tree-view__error">
                <AlertCircle :size="16" />
                {{ errors.location }}
              </span>
            </div>
          </BaseCard>
        </div>

        <!-- Form actions -->
        <div class="add-tree-view__actions">
          <BaseButton type="button" variant="ghost" @click="resetForm" :disabled="isSubmitting">
            Reset Form
          </BaseButton>

          <BaseButton
            type="submit"
            variant="primary"
            size="large"
            :loading="isSubmitting"
            :disabled="!isFormValid"
          >
            <template #icon-left>
              <TreePine :size="20" />
            </template>
            Add Tree to Map
          </BaseButton>
        </div>

        <!-- Submit error -->
        <div v-if="errors.submit" class="add-tree-view__submit-error">
          <AlertCircle :size="20" />
          <span>{{ errors.submit }}</span>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as variables;
@use '@/styles/colors' as colors;
@use '@/styles/mixins' as mixins;

.add-tree-view {
  padding: variables.$spacing-4 0 variables.$spacing-8;
  min-height: calc(100vh - 8rem);

  // -------------------------------------------------------------------------
  // HEADER
  // -------------------------------------------------------------------------

  &__header {
    text-align: center;
    margin-bottom: variables.$spacing-6;
  }

  &__title {
    font-size: variables.$font-size-h2;
    margin: 0 0 variables.$spacing-2;
    color: colors.$text-primary;

    @include mixins.width-at-least('medium') {
      font-size: variables.$font-size-h1;
    }
  }

  &__subtitle {
    color: colors.$text-muted;
    font-size: variables.$font-size-large;
    margin: 0;
  }

  // -------------------------------------------------------------------------
  // FORM LAYOUT
  // -------------------------------------------------------------------------

  &__form {
    max-width: 100rem;
    margin: 0 auto;
  }

  &__form-grid {
    display: grid;
    gap: variables.$spacing-4;
    margin-bottom: variables.$spacing-6;

    @include mixins.width-at-least('large') {
      grid-template-columns: 1fr 1fr;
      grid-template-rows: auto auto;
    }
  }

  &__photo-section {
    @include mixins.width-at-least('large') {
      grid-row: 1 / 3;
    }
  }

  // -------------------------------------------------------------------------
  // FORM FIELDS
  // -------------------------------------------------------------------------

  &__form-fields {
    display: flex;
    flex-direction: column;
    gap: variables.$spacing-3;
  }

  &__field {
    display: flex;
    flex-direction: column;
    gap: variables.$spacing-1;
  }

  &__label {
    font-weight: variables.$font-weight-medium;
    color: colors.$text-secondary;
    font-size: variables.$font-size-body;
  }

  &__input,
  &__textarea {
    padding: variables.$spacing-1_5;
    border: 2px solid colors.$border-light;
    border-radius: variables.$border-radius-medium;
    font-size: variables.$font-size-body;
    background: colors.$bg-card;
    color: colors.$text-secondary;
    transition: border-color variables.$transition-normal;

    &:focus {
      outline: none;
      border-color: colors.$primary-green;
    }

    &--error {
      border-color: colors.$error;
    }

    &::placeholder {
      color: colors.$text-muted;
    }
  }

  &__textarea {
    resize: vertical;
    min-height: 10rem;
    font-family: inherit;
  }

  &__error {
    color: colors.$error;
    font-size: variables.$font-size-small;
    display: flex;
    align-items: center;
    gap: variables.$spacing-0_5;
  }

  // -------------------------------------------------------------------------
  // LOCATION SECTION
  // -------------------------------------------------------------------------

  &__location-content {
    display: flex;
    flex-direction: column;
    gap: variables.$spacing-3;
  }

  &__location-empty {
    text-align: center;
    padding: variables.$spacing-4;
    color: colors.$text-muted;

    svg {
      color: colors.$text-muted;
      margin-bottom: variables.$spacing-2;
    }

    p {
      margin: 0 0 variables.$spacing-1;

      &:first-of-type {
        font-weight: variables.$font-weight-medium;
        color: colors.$text-secondary;
      }
    }
  }

  &__location-hint {
    font-size: variables.$font-size-small;
    margin-bottom: variables.$spacing-3;
  }

  &__location-data {
    padding: variables.$spacing-2;
    background: rgba(colors.$primary-green, 0.1);
    border-radius: variables.$border-radius-medium;
  }

  &__coordinates {
    font-family: monospace;
    margin-bottom: variables.$spacing-1;
    color: colors.$text-secondary;
  }

  &__location-method {
    color: colors.$text-muted;
    font-size: variables.$font-size-small;
    margin-bottom: variables.$spacing-2;
  }

  &__location-map {
    margin-top: variables.$spacing-3;

    h4 {
      margin: 0 0 variables.$spacing-2;
      color: colors.$text-secondary;
      font-size: variables.$font-size-body;
    }
  }

  &__manual-coords {
    margin-top: variables.$spacing-2;

    summary {
      cursor: pointer;
      color: colors.$primary-green;
      font-weight: variables.$font-weight-medium;
      margin-bottom: variables.$spacing-2;
    }
  }

  &__coord-inputs {
    display: grid;
    gap: variables.$spacing-2;

    @include mixins.width-at-least('medium') {
      grid-template-columns: 1fr 1fr;
    }
  }

  // -------------------------------------------------------------------------
  // FORM ACTIONS
  // -------------------------------------------------------------------------

  &__actions {
    @include mixins.flex-between;
    gap: variables.$spacing-3;
    padding-top: variables.$spacing-4;
    border-top: 1px solid colors.$border-light;

    @include mixins.width-less-than('medium') {
      flex-direction: column;
      align-items: stretch;
    }
  }

  &__submit-error {
    display: flex;
    align-items: center;
    gap: variables.$spacing-1;
    color: colors.$error;
    background: rgba(colors.$error, 0.1);
    padding: variables.$spacing-2;
    border-radius: variables.$border-radius-medium;
    margin-top: variables.$spacing-3;
  }

  // -------------------------------------------------------------------------
  // RESPONSIVE ADJUSTMENTS
  // -------------------------------------------------------------------------

  @include mixins.width-less-than('medium') {
    padding: variables.$spacing-3 0 variables.$spacing-6;
  }
}
</style>
