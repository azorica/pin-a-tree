/**
 * EXIF Composable (MVP Mock Version)
 *
 * Vue composable for simulating EXIF data extraction from images.
 * For MVP, this provides mock GPS coordinates instead of real extraction.
 */

import { ref, computed } from 'vue'

export function useExifData() {
  // ============================================================================
  // REACTIVE STATE
  // ============================================================================

  const isLoading = ref(false)
  const error = ref(null)
  const exifData = ref(null)
  const gpsData = ref(null)

  // ============================================================================
  // COMPUTED PROPERTIES
  // ============================================================================

  const hasGpsData = computed(() => {
    return gpsData.value && 
           gpsData.value.latitude !== null && 
           gpsData.value.longitude !== null
  })

  const coordinates = computed(() => {
    if (!hasGpsData.value) return null
    
    return {
      lat: gpsData.value.latitude,
      lng: gpsData.value.longitude
    }
  })

  // ============================================================================
  // MAIN FUNCTIONS
  // ============================================================================

  /**
   * Extract EXIF data from an image file (Mock implementation for MVP)
   * @param {File} imageFile - Image file to process
   * @returns {Promise<Object>} Mock EXIF data
   */
  const extractExifData = async (imageFile) => {
    isLoading.value = true
    error.value = null
    exifData.value = null
    gpsData.value = null

    try {
      if (!imageFile || !imageFile.type.startsWith('image/')) {
        throw new Error('Invalid image file')
      }

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Mock EXIF data - simulate 50% chance of having GPS data
      const hasGps = Math.random() > 0.5

      if (hasGps) {
        // Generate mock GPS coordinates (roughly in continental US)
        const mockLatitude = 39.8283 + (Math.random() - 0.5) * 10  // ~35-45°N
        const mockLongitude = -98.5795 + (Math.random() - 0.5) * 40 // ~-120 to -80°W

        gpsData.value = {
          latitude: mockLatitude,
          longitude: mockLongitude,
          altitude: Math.random() * 1000,
          timestamp: new Date().toISOString()
        }
      }

      exifData.value = {
        Make: 'Mock Camera',
        Model: 'Demo Model',
        DateTime: new Date().toISOString(),
        hasGps
      }

      return {
        exif: exifData.value,
        gps: gpsData.value,
        hasGps: hasGpsData.value
      }

    } catch (err) {
      error.value = err.message || 'Failed to extract EXIF data'
      console.error('EXIF extraction error:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Reset all state
   */
  const reset = () => {
    isLoading.value = false
    error.value = null
    exifData.value = null
    gpsData.value = null
  }

  // ============================================================================
  // RETURN COMPOSABLE API
  // ============================================================================

  return {
    // State
    isLoading,
    error,
    exifData,
    gpsData,
    
    // Computed
    hasGpsData,
    coordinates,
    
    // Methods
    extractExifData,
    reset
  }
}
