/**
 * useImageUpload Composable
 *
 * Handles image upload, preview generation, and EXIF data extraction.
 * Provides reusable functionality for image handling across components.
 *
 * Features:
 * - Image file validation
 * - Preview generation
 * - EXIF GPS data extraction
 * - Upload progress tracking
 * - Error handling
 */

import { ref, reactive, readonly } from 'vue'
import { uploadImage, extractGpsFromImage, createImagePreview } from '@/services/imageService'

export function useImageUpload() {
  // ============================================================================
  // REACTIVE STATE
  // ============================================================================

  const isUploading = ref(false)
  const uploadProgress = ref(0)
  const selectedFile = ref(null)
  const previewUrl = ref(null)
  const errors = reactive({
    validation: null,
    upload: null,
    exif: null,
  })

  const gpsData = ref(null)
  const uploadResult = ref(null)

  // ============================================================================
  // METHODS
  // ============================================================================

  /**
   * Validates an image file for upload
   * @param {File} file - The file to validate
   * @returns {Object} Validation result with success flag and error message
   */
  const validateFile = (file) => {
    const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    const maxSize = 10 * 1024 * 1024 // 10MB

    if (!file) {
      return { success: false, error: 'No file provided' }
    }

    if (!supportedTypes.includes(file.type)) {
      return {
        success: false,
        error: `Unsupported file type. Supported: ${supportedTypes.join(', ')}`,
      }
    }

    if (file.size > maxSize) {
      return {
        success: false,
        error: `File too large. Maximum size: ${Math.round(maxSize / (1024 * 1024))}MB`,
      }
    }

    return { success: true }
  }

  /**
   * Selects and processes an image file
   * @param {File} file - The image file to process
   * @returns {Promise<Object>} Processing result with GPS data if available
   */
  const selectFile = async (file) => {
    try {
      // Clear previous state
      clearState()

      // Validate file
      const validation = validateFile(file)
      if (!validation.success) {
        errors.validation = validation.error
        return { success: false, error: validation.error }
      }

      selectedFile.value = file

      // Generate preview
      previewUrl.value = await createImagePreview(file, 400, 400, 0.8)

      // Extract EXIF GPS data
      try {
        const extractedGps = await extractGpsFromImage(file)
        if (extractedGps) {
          gpsData.value = extractedGps
          console.log('GPS data extracted:', extractedGps)
        }
      } catch (error) {
        errors.exif = 'Failed to extract GPS data from image'
        console.warn('EXIF extraction failed:', error)
      }

      return {
        success: true,
        file,
        preview: previewUrl.value,
        gps: gpsData.value,
      }
    } catch (error) {
      errors.validation = 'Failed to process image file'
      console.error('File selection failed:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Handles file input change event
   * @param {Event} event - The file input change event
   * @returns {Promise<Object>} Processing result
   */
  const handleFileSelect = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return { success: false, error: 'No file selected' }

    return await selectFile(file)
  }

  /**
   * Handles drag and drop file selection
   * @param {DragEvent} event - The drop event
   * @returns {Promise<Object>} Processing result
   */
  const handleFileDrop = async (event) => {
    event.preventDefault()
    const file = event.dataTransfer.files?.[0]
    if (!file) return { success: false, error: 'No file dropped' }

    return await selectFile(file)
  }

  /**
   * Uploads the selected file to the server
   * @param {Object} options - Upload options (token, onProgress, etc.)
   * @returns {Promise<Object>} Upload result
   */
  const uploadFile = async (options = {}) => {
    if (!selectedFile.value) {
      throw new Error('No file selected for upload')
    }

    try {
      isUploading.value = true
      uploadProgress.value = 0
      errors.upload = null

      const result = await uploadImage(selectedFile.value, {
        ...options,
        onProgress: (progress) => {
          uploadProgress.value = progress
          if (options.onProgress) {
            options.onProgress(progress)
          }
        },
      })

      uploadResult.value = result
      return result
    } catch (error) {
      errors.upload = error.message
      console.error('Upload failed:', error)
      throw error
    } finally {
      isUploading.value = false
    }
  }

  /**
   * Clears all state and resets the composable
   */
  const clearState = () => {
    selectedFile.value = null
    previewUrl.value = null
    gpsData.value = null
    uploadResult.value = null
    uploadProgress.value = 0
    isUploading.value = false

    // Clear errors
    Object.keys(errors).forEach((key) => {
      errors[key] = null
    })
  }

  /**
   * Removes the currently selected file
   */
  const removeFile = () => {
    if (previewUrl.value && previewUrl.value.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl.value)
    }
    clearState()
  }

  /**
   * Gets formatted file size string
   * @param {number} bytes - File size in bytes
   * @returns {string} Formatted file size
   */
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  // ============================================================================
  // COMPUTED HELPERS
  // ============================================================================

  const hasFile = () => selectedFile.value !== null
  const hasPreview = () => previewUrl.value !== null
  const hasGpsData = () => gpsData.value !== null
  const hasErrors = () => Object.values(errors).some((error) => error !== null)
  const fileSize = () => (selectedFile.value ? formatFileSize(selectedFile.value.size) : '')
  const fileName = () => selectedFile.value?.name || ''

  // ============================================================================
  // RETURN PUBLIC API
  // ============================================================================

  return {
    // State
    selectedFile: readonly(selectedFile),
    previewUrl: readonly(previewUrl),
    gpsData: readonly(gpsData),
    uploadResult: readonly(uploadResult),
    isUploading: readonly(isUploading),
    uploadProgress: readonly(uploadProgress),
    errors: readonly(errors),

    // Methods
    selectFile,
    handleFileSelect,
    handleFileDrop,
    uploadFile,
    removeFile,
    clearState,
    validateFile,

    // Computed helpers
    hasFile,
    hasPreview,
    hasGpsData,
    hasErrors,
    fileSize,
    fileName,
    formatFileSize,
  }
}
