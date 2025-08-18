/**
 * Image Service
 *
 * Handles image upload, processing, and EXIF data extraction.
 * Integrates with exifr library for GPS coordinate extraction from photos.
 *
 * Features:
 * - Image upload and validation
 * - EXIF data extraction (GPS, camera info, date)
 * - Image resizing and optimization
 * - File format conversion
 */

import axios from 'axios'
import { parse as parseExif } from 'exifr'
import mockApiResponses from '@/mocks/api-responses.json'

// =============================================================================
// CONFIGURATION
// =============================================================================

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.pin-a-tree.com'
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA !== 'false'

// Supported image formats
const SUPPORTED_FORMATS = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const MAX_DIMENSION = 4096 // Max width/height in pixels

// =============================================================================
// FILE VALIDATION
// =============================================================================

/**
 * Validate image file before upload
 * @param {File} file - Image file to validate
 * @returns {Object} Validation result with success boolean and error message
 */
export function validateImageFile(file) {
  // Check if file exists
  if (!file) {
    return { success: false, error: 'No file provided' }
  }

  // Check file type
  if (!SUPPORTED_FORMATS.includes(file.type)) {
    return {
      success: false,
      error: `Unsupported file format. Supported formats: ${SUPPORTED_FORMATS.join(', ')}`,
    }
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      success: false,
      error: `File size too large. Maximum size: ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
    }
  }

  return { success: true }
}

// =============================================================================
// EXIF DATA EXTRACTION
// =============================================================================

/**
 * Extract EXIF data from image file, including GPS coordinates
 * @param {File} file - Image file to process
 * @returns {Promise<Object>} EXIF data including GPS, camera info, and metadata
 */
export async function extractExifData(file) {
  try {
    // Validate file first
    const validation = validateImageFile(file)
    if (!validation.success) {
      throw new Error(validation.error)
    }

    // Parse EXIF data using exifr
    const exifData = await parseExif(file, {
      gps: true, // Extract GPS data
      ifd0: true, // Camera make/model
      exif: true, // Date/time and camera settings
      ifd1: false, // Thumbnail data (not needed)
      iptc: false, // IPTC metadata (not needed)
      icc: false, // Color profile (not needed)
      jfif: false, // JFIF data (not needed)
      ihdr: false, // PNG header (not needed)
      multiSegment: true, // Handle large files
      mergeOutput: true, // Merge all EXIF sections
      sanitize: true, // Remove potentially dangerous data
      reviveValues: true, // Convert binary values to readable format
      translateKeys: true, // Use human-readable property names
      translateValues: true, // Convert coded values to readable text
    })

    if (!exifData) {
      return {
        hasExif: false,
        gps: null,
        camera: null,
        datetime: null,
        error: 'No EXIF data found in image',
      }
    }

    // Extract GPS coordinates
    let gpsData = null
    if (exifData.latitude && exifData.longitude) {
      gpsData = {
        latitude: parseFloat(exifData.latitude),
        longitude: parseFloat(exifData.longitude),
        altitude: exifData.altitude || null,
        accuracy: exifData.gpsHPositioningError || null,
      }
    }

    // Extract camera information
    let cameraData = null
    if (exifData.make || exifData.model) {
      cameraData = {
        make: exifData.make || 'Unknown',
        model: exifData.model || 'Unknown',
        software: exifData.software || null,
        lens: exifData.lensModel || null,
        settings: {
          fNumber: exifData.fNumber || null,
          exposureTime: exifData.exposureTime || null,
          iso: exifData.iso || null,
          focalLength: exifData.focalLength || null,
          flash: exifData.flash || null,
        },
      }
    }

    // Extract date/time information
    let datetimeData = null
    if (exifData.dateTimeOriginal || exifData.createDate || exifData.modifyDate) {
      const originalDate = exifData.dateTimeOriginal || exifData.createDate || exifData.modifyDate
      datetimeData = {
        original: originalDate ? originalDate.toISOString() : null,
        digitized: exifData.createDate ? exifData.createDate.toISOString() : null,
        modified: exifData.modifyDate ? exifData.modifyDate.toISOString() : null,
      }
    }

    return {
      hasExif: true,
      gps: gpsData,
      camera: cameraData,
      datetime: datetimeData,
      dimensions: {
        width: exifData.imageWidth || null,
        height: exifData.imageHeight || null,
      },
      orientation: exifData.orientation || null,
      colorSpace: exifData.colorSpace || null,
    }
  } catch (error) {
    console.error('EXIF extraction error:', error)
    return {
      hasExif: false,
      gps: null,
      camera: null,
      datetime: null,
      error: error.message,
    }
  }
}

/**
 * Extract GPS coordinates from image EXIF data
 * @param {File} file - Image file to process
 * @returns {Promise<Object|null>} GPS data object or null if not found
 */
export async function extractGpsFromImage(file) {
  try {
    const exifData = await extractExifData(file)
    return exifData.gps || null
  } catch (error) {
    console.error('GPS extraction error:', error)
    return null
  }
}

// =============================================================================
// IMAGE PROCESSING
// =============================================================================

/**
 * Create a preview/thumbnail of the image
 * @param {File} file - Image file
 * @param {number} maxWidth - Maximum width in pixels
 * @param {number} maxHeight - Maximum height in pixels
 * @param {number} quality - JPEG quality (0-1)
 * @returns {Promise<string>} Data URL of the resized image
 */
export async function createImagePreview(file, maxWidth = 300, maxHeight = 300, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      // Calculate new dimensions maintaining aspect ratio
      let { width, height } = img
      const aspectRatio = width / height

      if (width > maxWidth) {
        width = maxWidth
        height = width / aspectRatio
      }

      if (height > maxHeight) {
        height = maxHeight
        width = height * aspectRatio
      }

      // Set canvas dimensions
      canvas.width = width
      canvas.height = height

      // Draw and resize image
      ctx.drawImage(img, 0, 0, width, height)

      // Convert to data URL
      const dataUrl = canvas.toDataURL('image/jpeg', quality)
      resolve(dataUrl)
    }

    img.onerror = () => {
      reject(new Error('Failed to load image for preview'))
    }

    img.src = URL.createObjectURL(file)
  })
}

/**
 * Get image dimensions without loading the full image
 * @param {File} file - Image file
 * @returns {Promise<Object>} Width and height dimensions
 */
export async function getImageDimensions(file) {
  return new Promise((resolve, reject) => {
    const img = new Image()

    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
      })
      URL.revokeObjectURL(img.src)
    }

    img.onerror = () => {
      reject(new Error('Failed to load image'))
    }

    img.src = URL.createObjectURL(file)
  })
}

// =============================================================================
// UPLOAD OPERATIONS
// =============================================================================

/**
 * Upload image file to server
 * @param {File} file - Image file to upload
 * @param {Object} options - Upload options
 * @param {Function} options.onProgress - Progress callback function
 * @param {string} options.token - Authentication token
 * @returns {Promise<Object>} Upload response with file URL and metadata
 */
export async function uploadImage(file, options = {}) {
  // Validate file
  const validation = validateImageFile(file)
  if (!validation.success) {
    throw new Error(validation.error)
  }

  if (USE_MOCK_DATA) {
    // Simulate upload progress
    if (options.onProgress) {
      for (let progress = 0; progress <= 100; progress += 20) {
        setTimeout(() => options.onProgress(progress), progress * 10)
      }
    }

    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Extract EXIF data for mock response
    const exifData = await extractExifData(file)

    return {
      url: `/uploads/trees/mock-${Date.now()}-${file.name}`,
      filename: file.name,
      originalName: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
      exifData: exifData.hasExif
        ? {
            gps: exifData.gps,
            camera: exifData.camera,
            datetime: exifData.datetime,
          }
        : null,
    }
  }

  try {
    // Create FormData for multipart upload
    const formData = new FormData()
    formData.append('image', file)
    formData.append('type', 'tree-photo')

    // Upload with progress tracking
    const response = await axios.post(`${API_BASE_URL}/upload/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(options.token && { Authorization: `Bearer ${options.token}` }),
      },
      onUploadProgress: (progressEvent) => {
        if (options.onProgress) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          options.onProgress(percentCompleted)
        }
      },
    })

    return response.data
  } catch (error) {
    if (error.response?.status === 413) {
      throw new Error('File too large')
    }
    if (error.response?.status === 415) {
      throw new Error('Unsupported file type')
    }
    throw new Error(`Upload failed: ${error.message}`)
  }
}

/**
 * Delete uploaded image
 * @param {string} imageUrl - URL or ID of image to delete
 * @param {string} token - Authentication token
 * @returns {Promise<boolean>} Success status
 */
export async function deleteImage(imageUrl, token) {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return true
  }

  try {
    await axios.delete(`${API_BASE_URL}/upload/image`, {
      data: { url: imageUrl },
      headers: { Authorization: `Bearer ${token}` },
    })
    return true
  } catch (error) {
    throw new Error(`Failed to delete image: ${error.message}`)
  }
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Convert coordinates from DMS (Degrees, Minutes, Seconds) to decimal
 * @param {Array} dms - Array of [degrees, minutes, seconds]
 * @param {string} ref - Reference (N, S, E, W)
 * @returns {number} Decimal degrees
 */
export function dmsToDecimal(dms, ref) {
  let decimal = dms[0] + dms[1] / 60 + dms[2] / 3600
  if (ref === 'S' || ref === 'W') {
    decimal = decimal * -1
  }
  return decimal
}

/**
 * Format file size in human-readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted size string
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}
