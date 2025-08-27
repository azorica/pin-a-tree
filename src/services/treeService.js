/**
 * Tree// Configuration
const USE_MOCK_DATA = false // Now using real APIs with authentication!ervice
 *
 * Service layer for tree-related API operations.
 * Handles HTTP requests for tree data, CRUD operations, and data transformation.
 * Now connected to real backend APIs!
 */

import axios from 'axios'
import mockTrees from '@/mocks/trees.json'

// Configuration
const USE_MOCK_DATA = false // Using mock data for stable demo, can be switched to false for real API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add auth token to requests if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Add response interceptor for better error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken')
    }
    throw error
  }
)

// Simulated delay for mock API calls
const MOCK_DELAY = 800

// In-memory storage for added trees (simulates database)
let treesDatabase = [...mockTrees]

// Helper function to simulate API delay
const simulateApiDelay = () => new Promise(resolve => setTimeout(resolve, MOCK_DELAY))

class TreeService {
  /**
   * Get all trees from the backend API
   * @returns {Promise<Array>} Array of tree objects
   */
  async getAllTrees() {
    if (USE_MOCK_DATA) {
      await simulateApiDelay()
      return [...treesDatabase]
    }
    
    try {
      const response = await apiClient.get('/trees')
      return response.data
    } catch (error) {
      console.error('Error fetching trees:', error)
      throw new Error('Failed to fetch trees')
    }
  }

  /**
   * Get a specific tree by ID from the backend API
   * @param {string} treeId - Tree identifier
   * @returns {Promise<Object>} Tree object
   */
  async getTreeById(treeId) {
    if (USE_MOCK_DATA) {
      await simulateApiDelay()
      const tree = treesDatabase.find(t => t.id === treeId)
      if (!tree) {
        throw new Error('Tree not found')
      }
      return tree
    }
    
    try {
      const response = await apiClient.get(`/trees/${treeId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching tree:', error)
      throw new Error('Failed to fetch tree')
    }
  }

  /**
   * Create a new tree entry in the backend API
   * @param {Object} treeData - Tree data object
   * @returns {Promise<Object>} Created tree object
   */
  async createTree(treeData) {
    if (USE_MOCK_DATA) {
      await simulateApiDelay()
      
      // Generate new tree object with mock data structure
      const newTree = {
        id: `tree-${Date.now()}`,
        name: treeData.name,
        species: treeData.species,
        datePlanted: treeData.datePlanted,
        location: treeData.location,
        image: treeData.image,
        user: treeData.user,
        description: treeData.description || '',
        tags: treeData.tags || [],
        status: 'healthy',
        createdAt: new Date().toISOString()
      }
      
      // Add to in-memory database
      treesDatabase.push(newTree)
      console.log('🌳 Tree added to database:', newTree.name, 'Total trees:', treesDatabase.length)
      
      return newTree
    }
    
    try {
      const response = await apiClient.post('/trees', treeData)
      return response.data
    } catch (error) {
      console.error('Error creating tree:', error)
      throw new Error('Failed to create tree')
    }
  }

  /**
   * Update tree status
   * @param {string} treeId - Tree identifier
   * @param {string} status - New status
   * @returns {Promise<Object>} Updated tree object
   */
  async updateTreeStatus(treeId, status) {
    await simulateApiDelay()
    return { status, updatedAt: new Date().toISOString() }
  }
}

// Export singleton instance
export const treeService = new TreeService()
