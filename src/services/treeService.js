/**
 * Tree Service
 *
 * Handles all tree-related API operations including fetching, creating,
 * updating, and deleting tree records. Uses mock data during MVP development.
 *
 * Features:
 * - CRUD operations for trees
 * - Search and filtering
 * - Image upload with EXIF extraction
 * - Location-based queries
 */

import axios from 'axios'
// Mock data imports
import mockTrees from '@/mocks/trees.json'
import mockApiResponses from '@/mocks/api-responses.json'

// =============================================================================
// CONFIGURATION
// =============================================================================

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.pin-a-tree.com'
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA !== 'false' // Default to true

// =============================================================================
// TREE CRUD OPERATIONS
// =============================================================================

/**
 * Fetch all trees with optional pagination and filters
 * @param {Object} options - Query options
 * @param {number} options.page - Page number (default: 1)
 * @param {number} options.limit - Items per page (default: 20)
 * @param {string} options.species - Filter by species
 * @param {string} options.search - Search term
 * @param {Object} options.bounds - Map bounds for location filtering
 * @returns {Promise<Array>} Array of tree objects
 */
export async function fetchTrees(options = {}) {
  if (USE_MOCK_DATA) {
    // Simulate async operation
    await new Promise((resolve) => setTimeout(resolve, 300))

    let filteredTrees = [...mockTrees]

    // Apply search filter
    if (options.search) {
      const searchTerm = options.search.toLowerCase()
      filteredTrees = filteredTrees.filter(
        (tree) =>
          tree.name.toLowerCase().includes(searchTerm) ||
          tree.species.toLowerCase().includes(searchTerm) ||
          tree.description.toLowerCase().includes(searchTerm),
      )
    }

    // Apply species filter
    if (options.species) {
      filteredTrees = filteredTrees.filter((tree) =>
        tree.species.toLowerCase().includes(options.species.toLowerCase()),
      )
    }

    // Apply bounds filter (simplified)
    if (options.bounds) {
      filteredTrees = filteredTrees.filter((tree) => {
        const { latitude, longitude } = tree.location
        return (
          latitude >= options.bounds.south &&
          latitude <= options.bounds.north &&
          longitude >= options.bounds.west &&
          longitude <= options.bounds.east
        )
      })
    }

    // Apply pagination
    const page = options.page || 1
    const limit = options.limit || 20
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedTrees = filteredTrees.slice(startIndex, endIndex)

    return {
      trees: paginatedTrees,
      total: filteredTrees.length,
      page,
      limit,
      totalPages: Math.ceil(filteredTrees.length / limit),
    }
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/trees`, {
      params: options,
    })
    return response.data
  } catch (error) {
    throw new Error(`Failed to fetch trees: ${error.message}`)
  }
}

/**
 * Fetch a single tree by ID
 * @param {string} treeId - Unique tree identifier
 * @returns {Promise<Object>} Tree object
 */
export async function fetchTreeById(treeId) {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 200))

    const tree = mockTrees.find((t) => t.id === treeId)
    if (!tree) {
      throw new Error('Tree not found')
    }
    return tree
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/trees/${treeId}`)
    return response.data.tree
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('Tree not found')
    }
    throw new Error(`Failed to fetch tree: ${error.message}`)
  }
}

/**
 * Create a new tree record
 * @param {Object} treeData - Tree data object
 * @param {string} treeData.name - Tree name
 * @param {string} treeData.species - Tree species
 * @param {string} treeData.datePlanted - Date planted (ISO string)
 * @param {Object} treeData.location - Location object with lat/lng
 * @param {string} treeData.description - Tree description
 * @param {Object} treeData.image - Image data
 * @returns {Promise<Object>} Created tree object
 */
export async function createTree(treeData) {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const newTree = {
      id: `tree-${Date.now()}`,
      ...treeData,
      dateAdded: new Date().toISOString(),
      plantedBy: {
        userId: 'user-current', // Would come from auth context
        name: 'Current User',
        initials: 'CU',
      },
      status: 'healthy',
      tags: [],
    }

    // In a real app, this would be stored on the server
    // For mock purposes, we'll just return the created tree
    return newTree
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/trees`, treeData)
    return response.data.tree
  } catch (error) {
    if (error.response?.status === 400) {
      throw new Error('Validation failed: Required fields are missing')
    }
    throw new Error(`Failed to create tree: ${error.message}`)
  }
}

/**
 * Update an existing tree record
 * @param {string} treeId - Tree ID to update
 * @param {Object} updateData - Fields to update
 * @returns {Promise<Object>} Updated tree object
 */
export async function updateTree(treeId, updateData) {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 400))

    const existingTree = mockTrees.find((t) => t.id === treeId)
    if (!existingTree) {
      throw new Error('Tree not found')
    }

    const updatedTree = {
      ...existingTree,
      ...updateData,
      dateModified: new Date().toISOString(),
    }

    return updatedTree
  }

  try {
    const response = await axios.put(`${API_BASE_URL}/trees/${treeId}`, updateData)
    return response.data.tree
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('Tree not found')
    }
    if (error.response?.status === 403) {
      throw new Error('Permission denied')
    }
    throw new Error(`Failed to update tree: ${error.message}`)
  }
}

/**
 * Delete a tree record
 * @param {string} treeId - Tree ID to delete
 * @returns {Promise<boolean>} Success status
 */
export async function deleteTree(treeId) {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 300))

    const treeExists = mockTrees.some((t) => t.id === treeId)
    if (!treeExists) {
      throw new Error('Tree not found')
    }

    return true
  }

  try {
    await axios.delete(`${API_BASE_URL}/trees/${treeId}`)
    return true
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('Tree not found')
    }
    if (error.response?.status === 403) {
      throw new Error('Permission denied')
    }
    throw new Error(`Failed to delete tree: ${error.message}`)
  }
}

// =============================================================================
// SEARCH AND FILTERING
// =============================================================================

/**
 * Search trees by various criteria
 * @param {string} query - Search query
 * @param {Object} filters - Additional filters
 * @returns {Promise<Object>} Search results
 */
export async function searchTrees(query, filters = {}) {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 250))

    let results = mockTrees

    if (query) {
      const searchTerm = query.toLowerCase()
      results = results.filter(
        (tree) =>
          tree.name.toLowerCase().includes(searchTerm) ||
          tree.species.toLowerCase().includes(searchTerm) ||
          tree.description.toLowerCase().includes(searchTerm) ||
          tree.tags.some((tag) => tag.toLowerCase().includes(searchTerm)),
      )
    }

    return {
      results,
      total: results.length,
      query,
      filters,
    }
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/trees/search`, {
      params: { query, ...filters },
    })
    return response.data
  } catch (error) {
    throw new Error(`Search failed: ${error.message}`)
  }
}

/**
 * Get trees near a specific location
 * @param {number} latitude - Latitude coordinate
 * @param {number} longitude - Longitude coordinate
 * @param {number} radius - Search radius in kilometers (default: 10)
 * @returns {Promise<Array>} Nearby trees
 */
export async function getTreesNearLocation(latitude, longitude, radius = 10) {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 200))

    // Simple distance calculation (not precise, for demo purposes)
    const nearbyTrees = mockTrees.filter((tree) => {
      const latDiff = Math.abs(tree.location.latitude - latitude)
      const lngDiff = Math.abs(tree.location.longitude - longitude)
      const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff)

      // Rough approximation: 1 degree ≈ 111km
      return distance * 111 <= radius
    })

    return nearbyTrees
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/trees/nearby`, {
      params: { latitude, longitude, radius },
    })
    return response.data.trees
  } catch (error) {
    throw new Error(`Failed to fetch nearby trees: ${error.message}`)
  }
}
