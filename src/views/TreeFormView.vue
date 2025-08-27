<script setup>
/**
 * TreeFormView Component
 *
 * View for adding a new tree to the Pin-a-Tree application.
 * Handles tree photo upload, metadata input, and GPS extraction.
 *
 * Features:
 * - Photo upload with preview
 * - EXIF GPS extraction
 * - Manual location pinning
 * - Tree metadata form
 * - Validation and error handling
 * - Progress indicators
 */

// Vue imports
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// Store imports
import { useTreeStore } from '@/stores/treeStore'
import { useUserStore } from '@/stores/userStore'

// Composable imports
import { useExifData } from '@/composables/useExifData'

// Component imports
import BaseButton from '@/components/BaseButton.vue'

// ============================================================================
// REACTIVE STATE
// ============================================================================

const router = useRouter()
const treeStore = useTreeStore()
const userStore = useUserStore()
const { extractExifData, gpsData, hasGpsData, isLoading: exifLoading } = useExifData()

const isSubmitting = ref(false)
const selectedImage = ref(null)
const imagePreview = ref(null)

const formData = reactive({
  name: '',
  species: '',
  datePlanted: '',
  description: '',
  location: {
    latitude: null,
    longitude: null,
    address: ''
  }
})

const errors = reactive({
  name: '',
  species: '',
  image: '',
  location: ''
})

// ============================================================================
// COMPUTED PROPERTIES
// ============================================================================

const isFormValid = computed(() => {
  return formData.name.trim() &&
         formData.species.trim() &&
         selectedImage.value &&
         (hasGpsData.value || formData.location.address.trim())
})

const currentStep = ref(1)
const totalSteps = 3

// ============================================================================
// EVENT HANDLERS
// ============================================================================

const handleImageUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  // Validate file type
  if (!file.type.startsWith('image/')) {
    errors.image = 'Please select a valid image file'
    return
  }

  // Validate file size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    errors.image = 'Image file must be less than 10MB'
    return
  }

  selectedImage.value = file
  errors.image = ''

  // Create preview
  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value = e.target.result
  }
  reader.readAsDataURL(file)

  // Extract EXIF data
  try {
    await extractExifData(file)
    if (hasGpsData.value) {
      formData.location.latitude = gpsData.value.latitude
      formData.location.longitude = gpsData.value.longitude
      formData.location.address = `${gpsData.value.latitude.toFixed(4)}, ${gpsData.value.longitude.toFixed(4)}`
    }
  } catch (error) {
    console.warn('Failed to extract GPS data:', error)
  }
}

const handleSubmit = async () => {
  if (!isFormValid.value) return

  isSubmitting.value = true

  try {
    // Create tree data object
    const treeData = {
      name: formData.name.trim(),
      species: formData.species.trim(),
      datePlanted: formData.datePlanted,
      description: formData.description.trim(),
      location: {
        latitude: formData.location.latitude,
        longitude: formData.location.longitude,
        address: formData.location.address.trim()
      },
      image: {
        url: imagePreview.value, // In real app, this would be uploaded URL
        alt: `Photo of ${formData.name}`
      },
      user: userStore.currentUser || {
        id: 'guest-001',
        name: 'Guest User',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      }
    }

    // Submit to store
    await treeStore.addTree(treeData)

    // Navigate to map view with success message
    router.push('/map')
  } catch (error) {
    console.error('Failed to add tree:', error)
    // Handle error display
  } finally {
    isSubmitting.value = false
  }
}

const handleCancel = () => {
  router.push('/')
}

const nextStep = () => {
  if (currentStep.value < totalSteps) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

// ============================================================================
// LIFECYCLE
// ============================================================================

onMounted(() => {
  // Set today's date as default
  const today = new Date().toISOString().split('T')[0]
  formData.datePlanted = today
})
</script>

<template>
  <div class="tree-form-view">
    <!-- Header -->
    <header class="tree-form-view__header">
      <div class="container">
        <h1 class="tree-form-view__title">Add Your Tree</h1>
        <p class="tree-form-view__subtitle">
          Share a tree you've planted or one you admire with our community
        </p>
        
        <!-- Progress Indicator -->
        <div class="tree-form-view__progress">
          <div 
            v-for="step in totalSteps" 
            :key="step"
            class="tree-form-view__progress-step"
            :class="{ 
              'tree-form-view__progress-step--active': step === currentStep,
              'tree-form-view__progress-step--completed': step < currentStep
            }"
          >
            {{ step }}
          </div>
        </div>
      </div>
    </header>

    <!-- Main Form -->
    <main class="tree-form-view__main">
      <div class="container">
        <form @submit.prevent="handleSubmit" class="tree-form-view__form">
          
          <!-- Step 1: Photo Upload -->
          <section v-if="currentStep === 1" class="tree-form-view__step">
            <h2>Upload Tree Photo</h2>
            
            <div class="tree-form-view__upload-area">
              <input
                type="file"
                id="tree-image"
                accept="image/*"
                @change="handleImageUpload"
                class="tree-form-view__file-input"
              />
              
              <label 
                for="tree-image" 
                class="tree-form-view__upload-label"
                :class="{ 'tree-form-view__upload-label--has-image': imagePreview }"
              >
                <div v-if="!imagePreview" class="tree-form-view__upload-prompt">
                  <span class="tree-form-view__upload-icon">📸</span>
                  <span>Click to upload tree photo</span>
                  <small>JPEG, PNG up to 10MB</small>
                </div>
                
                <div v-else class="tree-form-view__preview">
                  <img :src="imagePreview" alt="Tree preview" class="tree-form-view__preview-image" />
                  <div class="tree-form-view__preview-overlay">
                    <span>Click to change photo</span>
                  </div>
                </div>
              </label>
            </div>
            
            <div v-if="errors.image" class="tree-form-view__error">
              {{ errors.image }}
            </div>
            
            <!-- GPS Status -->
            <div v-if="selectedImage" class="tree-form-view__gps-status">
              <div v-if="exifLoading" class="tree-form-view__gps-loading">
                Extracting location data...
              </div>
              <div v-else-if="hasGpsData" class="tree-form-view__gps-success">
                ✅ Location found in photo: {{ gpsData.latitude.toFixed(4) }}, {{ gpsData.longitude.toFixed(4) }}
              </div>
              <div v-else class="tree-form-view__gps-none">
                ℹ️ No GPS data found. You'll be able to set location manually in the next step.
              </div>
            </div>
            
            <div class="tree-form-view__actions">
              <BaseButton type="button" variant="secondary" @click="handleCancel">
                Cancel
              </BaseButton>
              <BaseButton 
                type="button" 
                variant="primary" 
                @click="nextStep"
                :disabled="!selectedImage"
              >
                Next Step
              </BaseButton>
            </div>
          </section>

          <!-- Step 2: Tree Details -->
          <section v-if="currentStep === 2" class="tree-form-view__step">
            <h2>Tree Details</h2>
            
            <div class="tree-form-view__fields">
              <div class="tree-form-view__field">
                <label for="tree-name" class="tree-form-view__label">Tree Name *</label>
                <input
                  id="tree-name"
                  v-model="formData.name"
                  type="text"
                  class="tree-form-view__input"
                  placeholder="e.g., Oak Tree in Central Park"
                  required
                />
                <div v-if="errors.name" class="tree-form-view__error">{{ errors.name }}</div>
              </div>
              
              <div class="tree-form-view__field">
                <label for="tree-species" class="tree-form-view__label">Species *</label>
                <input
                  id="tree-species"
                  v-model="formData.species"
                  type="text"
                  class="tree-form-view__input"
                  placeholder="e.g., Quercus alba, Cherry Blossom"
                  required
                />
                <div v-if="errors.species" class="tree-form-view__error">{{ errors.species }}</div>
              </div>
              
              <div class="tree-form-view__field">
                <label for="date-planted" class="tree-form-view__label">Date Planted</label>
                <input
                  id="date-planted"
                  v-model="formData.datePlanted"
                  type="date"
                  class="tree-form-view__input"
                />
              </div>
              
              <div class="tree-form-view__field">
                <label for="description" class="tree-form-view__label">Description</label>
                <textarea
                  id="description"
                  v-model="formData.description"
                  class="tree-form-view__textarea"
                  placeholder="Tell us about this tree..."
                  rows="4"
                ></textarea>
              </div>
            </div>
            
            <div class="tree-form-view__actions">
              <BaseButton type="button" variant="secondary" @click="prevStep">
                Previous
              </BaseButton>
              <BaseButton 
                type="button" 
                variant="primary" 
                @click="nextStep"
                :disabled="!formData.name.trim() || !formData.species.trim()"
              >
                Next Step
              </BaseButton>
            </div>
          </section>

          <!-- Step 3: Location -->
          <section v-if="currentStep === 3" class="tree-form-view__step">
            <h2>Location</h2>
            
            <div v-if="hasGpsData" class="tree-form-view__location-found">
              <h3>Location from Photo</h3>
              <p>Coordinates: {{ gpsData.latitude.toFixed(4) }}, {{ gpsData.longitude.toFixed(4) }}</p>
            </div>
            
            <div v-else class="tree-form-view__location-manual">
              <h3>Manual Location</h3>
              <div class="tree-form-view__field">
                <label for="location-address" class="tree-form-view__label">Address or Description *</label>
                <input
                  id="location-address"
                  v-model="formData.location.address"
                  type="text"
                  class="tree-form-view__input"
                  placeholder="e.g., Central Park, New York, NY"
                  required
                />
                <div v-if="errors.location" class="tree-form-view__error">{{ errors.location }}</div>
              </div>
            </div>
            
            <div class="tree-form-view__actions">
              <BaseButton type="button" variant="secondary" @click="prevStep">
                Previous
              </BaseButton>
              <BaseButton 
                type="submit" 
                variant="primary"
                :loading="isSubmitting"
                :disabled="!isFormValid"
              >
                Add Tree to Map
              </BaseButton>
            </div>
          </section>
        </form>
      </div>
    </main>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.tree-form-view {
  min-height: 100vh;
  background-color: $background-dark;

  // ============================================================================
  // HEADER
  // ============================================================================

  &__header {
    background: linear-gradient(135deg, $background-dark 0%, #1a4a1a 100%);
    padding: $spacing-lg 0;
    text-align: center;
  }

  &__title {
    font-size: $font-size-heading-1;
    color: $text-primary;
    margin-bottom: $spacing-sm;
  }

  &__subtitle {
    font-size: $font-size-large;
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: $spacing-lg;
  }

  // ============================================================================
  // PROGRESS INDICATOR
  // ============================================================================

  &__progress {
    display: flex;
    justify-content: center;
    gap: $spacing-md;
    margin-top: $spacing-lg;
  }

  &__progress-step {
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: $font-weight-bold;
    color: rgba(255, 255, 255, 0.6);
    
    &--active {
      background-color: $primary-green;
      color: white;
    }
    
    &--completed {
      background-color: $secondary-green;
      color: white;
    }
  }

  // ============================================================================
  // MAIN FORM
  // ============================================================================

  &__main {
    padding: $spacing-xl 0;
  }

  &__form {
    max-width: 60rem;
    margin: 0 auto;
  }

  &__step {
    @include card-base;
    background-color: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);

    h2 {
      color: $primary-green;
      margin-bottom: $spacing-lg;
      text-align: center;
    }
  }

  // ============================================================================
  // FILE UPLOAD
  // ============================================================================

  &__file-input {
    @include visually-hidden;
  }

  &__upload-area {
    margin-bottom: $spacing-md;
  }

  &__upload-label {
    display: block;
    border: 2px dashed rgba(255, 255, 255, 0.3);
    border-radius: $border-radius-large;
    padding: $spacing-lg;
    text-align: center;
    cursor: pointer;
    transition: all $transition-normal;
    
    &:hover {
      border-color: $primary-green;
      background-color: rgba(46, 125, 50, 0.1);
    }

    &--has-image {
      padding: 0;
      border: none;
    }
  }

  &__upload-prompt {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $spacing-sm;
    color: rgba(255, 255, 255, 0.8);
  }

  &__upload-icon {
    font-size: 4rem;
  }

  &__preview {
    position: relative;
    border-radius: $border-radius-large;
    overflow: hidden;
  }

  &__preview-image {
    width: 100%;
    height: 30rem;
    object-fit: cover;
  }

  &__preview-overlay {
    position: absolute;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    opacity: 0;
    transition: opacity $transition-normal;
  }

  &__preview:hover &__preview-overlay {
    opacity: 1;
  }

  // ============================================================================
  // GPS STATUS
  // ============================================================================

  &__gps-status {
    margin-top: $spacing-md;
    padding: $spacing-md;
    border-radius: $border-radius-medium;
    text-align: center;
  }

  &__gps-loading {
    color: rgba(255, 255, 255, 0.8);
  }

  &__gps-success {
    background-color: rgba(76, 175, 80, 0.2);
    color: #4CAF50;
  }

  &__gps-none {
    background-color: rgba(33, 150, 243, 0.2);
    color: #2196F3;
  }

  // ============================================================================
  // FORM FIELDS
  // ============================================================================

  &__fields {
    display: flex;
    flex-direction: column;
    gap: $spacing-lg;
    margin-bottom: $spacing-lg;
  }

  &__field {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  &__label {
    font-weight: $font-weight-medium;
    color: $text-primary;
  }

  &__input,
  &__textarea {
    padding: 1.2rem;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: $border-radius-medium;
    background-color: rgba(255, 255, 255, 0.05);
    color: $text-primary;
    font-size: $font-size-base;
    
    &:focus {
      outline: none;
      border-color: $primary-green;
      box-shadow: 0 0 0 2px rgba(46, 125, 50, 0.2);
    }
    
    &::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }
  }

  &__textarea {
    resize: vertical;
    min-height: 10rem;
  }

  // ============================================================================
  // LOCATION SECTIONS
  // ============================================================================

  &__location-found,
  &__location-manual {
    margin-bottom: $spacing-lg;
    padding: $spacing-md;
    border-radius: $border-radius-medium;
    background-color: rgba(255, 255, 255, 0.05);
    
    h3 {
      color: $primary-green;
      margin-bottom: $spacing-sm;
    }
  }

  // ============================================================================
  // ACTIONS
  // ============================================================================

  &__actions {
    display: flex;
    justify-content: space-between;
    gap: $spacing-md;
    margin-top: $spacing-lg;
    
    @include width-less-than('small') {
      flex-direction: column;
    }
  }

  // ============================================================================
  // ERROR STATES
  // ============================================================================

  &__error {
    color: $error;
    font-size: $font-size-small;
    margin-top: 0.5rem;
  }
}
</style>
