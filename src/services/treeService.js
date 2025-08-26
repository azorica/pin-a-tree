/**
 * Tree Service
 *
 * Service layer for tree-related API operations.
 * Handles HTTP requests for tree data, CRUD operations, and data transformation.
 * For MVP, uses mock data instead of real API endpoints.
 */

// import axios from 'axios' // Commented out for MVP
import mockTrees from '@/mocks/trees.json'

// Configuration
const USE_MOCK_DATA = true // Always true for MVP

// Simulated delay for mock API calls
const MOCK_DELAY = 800

// Helper function to simulate API delay
const simulateApiDelay = () => new Promise(resolve => setTimeout(resolve, MOCK_DELAY))

class TreeService {
  /**
   * Get all trees
   * @returns {Promise<Array>} Array of tree objects
   */
  async getAllTrees() {
    await simulateApiDelay()
    return [...mockTrees]
  }

  /**
   * Get a specific tree by ID
   * @param {string} treeId - Tree identifier
   * @returns {Promise<Object>} Tree object
   */
  async getTreeById(treeId) {
    await simulateApiDelay()
    const tree = mockTrees.find(t => t.id === treeId)
    if (!tree) {
      throw new Error('Tree not found')
    }
    return tree
  }

  /**
   * Create a new tree entry
   * @param {Object} treeData - Tree data object
   * @returns {Promise<Object>} Created tree object
   */
  async createTree(treeData) {
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
    
    return newTree
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
