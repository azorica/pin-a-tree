/**
 * Geolocation Service
 *
 * Handles geolocation operations including GPS retrieval,
 * address geocoding, and location-based utilities.
 *
 * Features:
 * - Current location detection
 * - Address geocoding and reverse geocoding
 * - Location validation and formatting
 * - Distance calculations
 */

// =============================================================================
// CONFIGURATION
// =============================================================================

// Default coordinates (fallback location)
const DEFAULT_LOCATION = {
  latitude: 40.7128,
  longitude: -74.006,
  accuracy: null,
}

const GEOLOCATION_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 10000, // 10 seconds
  maximumAge: 300000, // 5 minutes
}

// =============================================================================
// CURRENT LOCATION
// =============================================================================

/**
 * Get user's current location using browser geolocation API
 * @param {Object} options - Geolocation options
 * @returns {Promise<Object>} Location object with lat/lng and accuracy
 */
export async function getCurrentLocation(options = {}) {
  const geoOptions = { ...GEOLOCATION_OPTIONS, ...options }

  return new Promise((resolve, reject) => {
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords
        resolve({
          latitude: parseFloat(latitude.toFixed(6)),
          longitude: parseFloat(longitude.toFixed(6)),
          accuracy: accuracy ? Math.round(accuracy) : null,
          timestamp: new Date(position.timestamp).toISOString(),
        })
      },
      (error) => {
        let errorMessage = 'Location access denied'

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable'
            break
          case error.TIMEOUT:
            errorMessage = 'Location request timed out'
            break
          default:
            errorMessage = 'An unknown error occurred while retrieving location'
            break
        }

        reject(new Error(errorMessage))
      },
      geoOptions,
    )
  })
}

/**
 * Watch user's location for continuous updates
 * @param {Function} onLocationUpdate - Callback for location updates
 * @param {Function} onError - Callback for errors
 * @param {Object} options - Geolocation options
 * @returns {number} Watch ID for clearing the watch
 */
export function watchLocation(onLocationUpdate, onError, options = {}) {
  const geoOptions = { ...GEOLOCATION_OPTIONS, ...options }

  if (!navigator.geolocation) {
    onError(new Error('Geolocation is not supported by this browser'))
    return null
  }

  return navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude, accuracy } = position.coords
      onLocationUpdate({
        latitude: parseFloat(latitude.toFixed(6)),
        longitude: parseFloat(longitude.toFixed(6)),
        accuracy: accuracy ? Math.round(accuracy) : null,
        timestamp: new Date(position.timestamp).toISOString(),
      })
    },
    (error) => {
      let errorMessage = 'Location watch failed'

      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'Location access denied by user'
          break
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'Location information unavailable'
          break
        case error.TIMEOUT:
          errorMessage = 'Location request timed out'
          break
        default:
          errorMessage = 'An unknown error occurred while watching location'
          break
      }

      onError(new Error(errorMessage))
    },
    geoOptions,
  )
}

/**
 * Clear location watch
 * @param {number} watchId - Watch ID returned by watchLocation
 */
export function clearLocationWatch(watchId) {
  if (watchId && navigator.geolocation) {
    navigator.geolocation.clearWatch(watchId)
  }
}

// =============================================================================
// GEOCODING (Mock Implementation)
// =============================================================================

/**
 * Convert address to coordinates (geocoding)
 * @param {string} address - Address to geocode
 * @returns {Promise<Object>} Location object with coordinates and formatted address
 */
export async function geocodeAddress(address) {
  // Mock implementation - in a real app, you'd use a geocoding service
  // like Google Maps Geocoding API, OpenCage, or Nominatim

  if (!address || address.trim() === '') {
    throw new Error('Address is required')
  }

  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Mock geocoding results for common locations
  const mockResults = {
    'central park, new york': {
      latitude: 40.7829,
      longitude: -73.9654,
      formattedAddress: 'Central Park, New York, NY, USA',
      components: {
        streetNumber: null,
        route: null,
        locality: 'New York',
        administrativeAreaLevel1: 'NY',
        country: 'USA',
        postalCode: null,
      },
    },
    'golden gate park, san francisco': {
      latitude: 37.7694,
      longitude: -122.4862,
      formattedAddress: 'Golden Gate Park, San Francisco, CA, USA',
      components: {
        streetNumber: null,
        route: null,
        locality: 'San Francisco',
        administrativeAreaLevel1: 'CA',
        country: 'USA',
        postalCode: null,
      },
    },
    'millennium park, chicago': {
      latitude: 41.8826,
      longitude: -87.6226,
      formattedAddress: 'Millennium Park, Chicago, IL, USA',
      components: {
        streetNumber: null,
        route: null,
        locality: 'Chicago',
        administrativeAreaLevel1: 'IL',
        country: 'USA',
        postalCode: null,
      },
    },
  }

  const normalizedAddress = address.toLowerCase().trim()
  const result = mockResults[normalizedAddress]

  if (result) {
    return result
  }

  // If no exact match, return a generic location with some variation
  const baseLatitude = 40.7128 + (Math.random() - 0.5) * 0.1
  const baseLongitude = -74.006 + (Math.random() - 0.5) * 0.1

  return {
    latitude: parseFloat(baseLatitude.toFixed(6)),
    longitude: parseFloat(baseLongitude.toFixed(6)),
    formattedAddress: address,
    components: {
      streetNumber: null,
      route: null,
      locality: 'Unknown',
      administrativeAreaLevel1: 'Unknown',
      country: 'Unknown',
      postalCode: null,
    },
    confidence: 'low',
  }
}

/**
 * Convert coordinates to address (reverse geocoding)
 * @param {number} latitude - Latitude coordinate
 * @param {number} longitude - Longitude coordinate
 * @returns {Promise<Object>} Address information
 */
export async function reverseGeocode(latitude, longitude) {
  // Mock implementation - in a real app, you'd use a reverse geocoding service

  if (!latitude || !longitude) {
    throw new Error('Latitude and longitude are required')
  }

  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 400))

  // Mock reverse geocoding based on approximate locations
  let locality = 'Unknown City'
  let administrativeAreaLevel1 = 'Unknown State'
  let country = 'Unknown Country'

  if (latitude > 40.5 && latitude < 41.0 && longitude > -74.5 && longitude < -73.5) {
    locality = 'New York'
    administrativeAreaLevel1 = 'NY'
    country = 'USA'
  } else if (latitude > 37.5 && latitude < 38.0 && longitude > -122.7 && longitude < -122.2) {
    locality = 'San Francisco'
    administrativeAreaLevel1 = 'CA'
    country = 'USA'
  } else if (latitude > 41.5 && latitude < 42.0 && longitude > -87.9 && longitude < -87.3) {
    locality = 'Chicago'
    administrativeAreaLevel1 = 'IL'
    country = 'USA'
  }

  const formattedAddress = `${locality}, ${administrativeAreaLevel1}, ${country}`

  return {
    formattedAddress,
    components: {
      streetNumber: null,
      route: null,
      locality,
      administrativeAreaLevel1,
      country,
      postalCode: null,
    },
    coordinates: {
      latitude: parseFloat(latitude.toFixed(6)),
      longitude: parseFloat(longitude.toFixed(6)),
    },
  }
}

// =============================================================================
// LOCATION UTILITIES
// =============================================================================

/**
 * Calculate distance between two points using Haversine formula
 * @param {number} lat1 - First point latitude
 * @param {number} lng1 - First point longitude
 * @param {number} lat2 - Second point latitude
 * @param {number} lng2 - Second point longitude
 * @param {string} unit - Unit of measurement ('km' or 'miles')
 * @returns {number} Distance between points
 */
export function calculateDistance(lat1, lng1, lat2, lng2, unit = 'km') {
  const R = unit === 'miles' ? 3959 : 6371 // Earth's radius in miles or km

  const dLat = toRadians(lat2 - lat1)
  const dLng = toRadians(lng2 - lng1)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c

  return parseFloat(distance.toFixed(2))
}

/**
 * Convert degrees to radians
 * @param {number} degrees - Degrees to convert
 * @returns {number} Radians
 */
function toRadians(degrees) {
  return degrees * (Math.PI / 180)
}

/**
 * Validate coordinate values
 * @param {number} latitude - Latitude to validate
 * @param {number} longitude - Longitude to validate
 * @returns {Object} Validation result
 */
export function validateCoordinates(latitude, longitude) {
  const errors = []

  if (typeof latitude !== 'number' || isNaN(latitude)) {
    errors.push('Latitude must be a valid number')
  } else if (latitude < -90 || latitude > 90) {
    errors.push('Latitude must be between -90 and 90 degrees')
  }

  if (typeof longitude !== 'number' || isNaN(longitude)) {
    errors.push('Longitude must be a valid number')
  } else if (longitude < -180 || longitude > 180) {
    errors.push('Longitude must be between -180 and 180 degrees')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Format coordinates for display
 * @param {number} latitude - Latitude coordinate
 * @param {number} longitude - Longitude coordinate
 * @param {number} precision - Decimal places (default: 4)
 * @returns {string} Formatted coordinate string
 */
export function formatCoordinates(latitude, longitude, precision = 4) {
  if (!validateCoordinates(latitude, longitude).isValid) {
    return 'Invalid coordinates'
  }

  const lat = latitude.toFixed(precision)
  const lng = longitude.toFixed(precision)
  const latDir = latitude >= 0 ? 'N' : 'S'
  const lngDir = longitude >= 0 ? 'E' : 'W'

  return `${Math.abs(lat)}°${latDir}, ${Math.abs(lng)}°${lngDir}`
}

/**
 * Get default/fallback location
 * @returns {Object} Default location object
 */
export function getDefaultLocation() {
  return { ...DEFAULT_LOCATION }
}

/**
 * Check if browser supports geolocation
 * @returns {boolean} Support status
 */
export function isGeolocationSupported() {
  return 'geolocation' in navigator
}

/**
 * Get readable error message for geolocation errors
 * @param {GeolocationPositionError} error - Geolocation error
 * @returns {string} Human-readable error message
 */
export function getLocationErrorMessage(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return 'Location access was denied. Please enable location permissions and try again.'
    case error.POSITION_UNAVAILABLE:
      return 'Your location could not be determined. Please check your device settings.'
    case error.TIMEOUT:
      return 'Location request timed out. Please try again.'
    default:
      return 'An error occurred while accessing your location.'
  }
}
