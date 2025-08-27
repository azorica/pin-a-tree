/**
 * EXIF Composable
 *
 * Vue composable for extracting EXIF data from images including GPS coordinates.
 * Uses multiple libraries for better compatibility and GPS extraction.
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
   * Extract EXIF data from an image file
   * @param {File} imageFile - Image file to process
   * @returns {Promise<Object>} EXIF data including GPS coordinates
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

      console.log('Extracting EXIF data from:', imageFile.name, imageFile.type)

      // Try piexifjs first (better for GPS data)
      let extractedData = await tryPiexifExtraction(imageFile)
      
      // If piexifjs didn't find GPS data, try exif-reader as fallback
      if (!extractedData || !extractedData.hasGps) {
        console.log('Trying exif-reader as fallback...')
        const fallbackData = await tryExifReaderExtraction(imageFile)
        if (fallbackData && fallbackData.hasGps) {
          extractedData = fallbackData
        }
      }

      if (extractedData) {
        exifData.value = extractedData.exif
        gpsData.value = extractedData.gps
      } else {
        // No EXIF data found
        exifData.value = {
          Make: null,
          Model: null,
          DateTime: new Date().toISOString(),
          hasGps: false
        }
      }

      console.log('Final GPS data:', gpsData.value)

      return {
        exif: exifData.value,
        gps: gpsData.value,
        hasGps: hasGpsData.value
      }

    } catch (err) {
      error.value = err.message || 'Failed to extract EXIF data'
      console.error('EXIF extraction error:', err)
      
      // Return empty data on error
      exifData.value = {
        Make: null,
        Model: null,
        DateTime: new Date().toISOString(),
        hasGps: false
      }
      
      return {
        exif: exifData.value,
        gps: gpsData.value,
        hasGps: hasGpsData.value
      }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Try extracting EXIF data using piexifjs
   * @param {File} imageFile - Image file to process
   * @returns {Promise<Object>} Extracted data or null
   */
  const tryPiexifExtraction = async (imageFile) => {
    try {
      const piexif = (await import('piexifjs')).default
      
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const exifData = piexif.load(e.target.result)
            console.log('Piexif extracted data:', exifData)
            
            let gpsData = null
            let hasGps = false

            // Check for GPS data
            if (exifData.GPS && Object.keys(exifData.GPS).length > 0) {
              const gps = exifData.GPS
              
              if (gps[piexif.GPSIFD.GPSLatitude] && gps[piexif.GPSIFD.GPSLongitude] &&
                  gps[piexif.GPSIFD.GPSLatitudeRef] && gps[piexif.GPSIFD.GPSLongitudeRef]) {
                
                const latitude = convertPiexifDMSToDD(
                  gps[piexif.GPSIFD.GPSLatitude], 
                  gps[piexif.GPSIFD.GPSLatitudeRef]
                )
                const longitude = convertPiexifDMSToDD(
                  gps[piexif.GPSIFD.GPSLongitude], 
                  gps[piexif.GPSIFD.GPSLongitudeRef]
                )

                gpsData = {
                  latitude: latitude,
                  longitude: longitude,
                  altitude: gps[piexif.GPSIFD.GPSAltitude] || null,
                  timestamp: new Date().toISOString()
                }
                hasGps = true
                
                console.log('GPS data found with piexif:', gpsData)
              }
            }

            const result = {
              exif: {
                Make: exifData['0th'][piexif.ImageIFD.Make] || null,
                Model: exifData['0th'][piexif.ImageIFD.Model] || null,
                DateTime: exifData['0th'][piexif.ImageIFD.DateTime] || new Date().toISOString(),
                hasGps: hasGps
              },
              gps: gpsData,
              hasGps: hasGps
            }
            
            resolve(result)
          } catch (error) {
            console.warn('Piexif parsing error:', error)
            resolve(null)
          }
        }
        reader.onerror = () => resolve(null)
        reader.readAsDataURL(imageFile)
      })
    } catch (error) {
      console.warn('Piexif import error:', error)
      return null
    }
  }

  /**
   * Convert piexif DMS coordinates to decimal degrees
   * @param {Array} dms - Array of rational numbers [degrees, minutes, seconds]
   * @param {string} ref - Reference (N/S for latitude, E/W for longitude)
   * @returns {number} Decimal degrees
   */
  const convertPiexifDMSToDD = (dms, ref) => {
    if (!Array.isArray(dms) || dms.length < 3) return 0
    
    // Convert rational numbers to decimal
    const degrees = dms[0][0] / dms[0][1]
    const minutes = dms[1][0] / dms[1][1]
    const seconds = dms[2][0] / dms[2][1]
    
    let dd = degrees + minutes/60 + seconds/3600
    if (ref === 'S' || ref === 'W') {
      dd = dd * -1
    }
    return dd
  }

  /**
   * Try extracting EXIF data using exif-reader as fallback
   * @param {File} imageFile - Image file to process
   * @returns {Promise<Object>} Extracted data or null
   */
  const tryExifReaderExtraction = async (imageFile) => {
    try {
      const arrayBuffer = await imageFile.arrayBuffer()
      const dataView = new DataView(arrayBuffer)
      
      // Check if it's a JPEG file and has EXIF data
      if (dataView.getUint16(0) !== 0xFFD8) {
        return null
      }

      const exifData_raw = await extractExifFromJpeg(arrayBuffer)
      
      if (exifData_raw && exifData_raw.gps) {
        const gps = exifData_raw.gps
        
        // Convert GPS coordinates if available
        if (gps.GPSLatitude && gps.GPSLongitude && 
            gps.GPSLatitudeRef && gps.GPSLongitudeRef) {
          
          const latitude = convertDMSToDD(gps.GPSLatitude, gps.GPSLatitudeRef)
          const longitude = convertDMSToDD(gps.GPSLongitude, gps.GPSLongitudeRef)

          const gpsData = {
            latitude: latitude,
            longitude: longitude,
            altitude: gps.GPSAltitude || null,
            timestamp: gps.GPSDateStamp || new Date().toISOString()
          }

          return {
            exif: {
              Make: exifData_raw?.image?.Make || null,
              Model: exifData_raw?.image?.Model || null,
              DateTime: exifData_raw?.image?.DateTime || new Date().toISOString(),
              hasGps: true
            },
            gps: gpsData,
            hasGps: true
          }
        }
      }

      return null
    } catch (error) {
      console.warn('Exif-reader extraction error:', error)
      return null
    }
  }

  /**
   * Extract EXIF data from JPEG using basic parsing
   * @param {ArrayBuffer} buffer - Image data buffer
   * @returns {Promise<Object>} Raw EXIF data
   */
  const extractExifFromJpeg = async (buffer) => {
    try {
      const { default: ExifReader } = await import('exif-reader')
      const dataView = new DataView(buffer)
      
      // Find APP1 segment with EXIF data
      let offset = 2 // Skip SOI marker
      
      while (offset < buffer.byteLength) {
        const marker = dataView.getUint16(offset)
        
        if (marker === 0xFFE1) { // APP1 marker
          const segmentLength = dataView.getUint16(offset + 2)
          const segmentData = buffer.slice(offset + 4, offset + 2 + segmentLength)
          
          // Check for EXIF signature
          const signature = new TextDecoder().decode(segmentData.slice(0, 4))
          if (signature === 'Exif') {
            // Parse EXIF data
            const exifBuffer = segmentData.slice(6) // Skip "Exif\0\0"
            return ExifReader(exifBuffer)
          }
        }
        
        // Move to next segment
        if ((marker & 0xFF00) !== 0xFF00) break
        offset += 2 + dataView.getUint16(offset + 2)
      }
      
      return null
    } catch (error) {
      console.warn('Failed to parse EXIF data:', error)
      return null
    }
  }

  /**
   * Convert GPS coordinates from DMS (Degrees, Minutes, Seconds) to decimal degrees
   * @param {Array} dms - Array of [degrees, minutes, seconds]
   * @param {string} ref - Reference (N/S for latitude, E/W for longitude)
   * @returns {number} Decimal degrees
   */
  const convertDMSToDD = (dms, ref) => {
    if (!Array.isArray(dms) || dms.length < 3) return 0
    
    let dd = dms[0] + dms[1]/60 + dms[2]/3600
    if (ref === 'S' || ref === 'W') {
      dd = dd * -1
    }
    return dd
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
