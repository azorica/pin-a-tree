/**
 * Tree Store
 *
 * Manages tree data, including fetching, creating, and updating tree records.
 * Handles all tree-related state management for the Pin-a-Tree application.
 *
 * Features:
 * - Fetch all trees from API/mock data
 * - Add new tree entries
 * - Filter trees by various criteria
 * - Handle tree status updates
 * - Manage tree upload workflow
 *
 * State:
 * @state {Array} trees - Array of all tree objects
 * @state {Object|null} selectedTree - Currently selected tree for details
 * @state {Boolean} isLoading - Loading state for async operations
 * @state {String|null} error - Error message if any operation fails
 * @state {Object} filters - Current filter settings for tree display
 *
 * Actions:
 * @action fetchTrees - Fetch all trees from the service
 * @action addTree - Add a new tree to the collection
 * @action selectTree - Set the currently selected tree
 * @action updateTreeStatus - Update tree health status
 * @action setFilters - Update filter criteria
 */

import { defineStore } from 'pinia'
import { treeService } from '@/services/treeService'

export const useTreeStore = defineStore('tree', {
  state: () => ({
    trees: [],
    selectedTree: null,
    isLoading: false,
    error: null,
    filters: {
      species: '',
      status: '',
      user: '',
      dateRange: null
    }
  }),

  getters: {
    filteredTrees: (state) => {
      let filtered = [...state.trees]

      if (state.filters.species) {
        filtered = filtered.filter(tree => 
          tree.species.toLowerCase().includes(state.filters.species.toLowerCase())
        )
      }

      if (state.filters.status) {
        filtered = filtered.filter(tree => tree.status === state.filters.status)
      }

      if (state.filters.user) {
        filtered = filtered.filter(tree => 
          tree.user.name.toLowerCase().includes(state.filters.user.toLowerCase())
        )
      }

      return filtered
    },

    treeCount: (state) => state.trees.length,

    healthyTreesCount: (state) => 
      state.trees.filter(tree => tree.status === 'healthy').length,

    recentTrees: (state) => {
      const sortedTrees = [...state.trees].sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      )
      return sortedTrees.slice(0, 5)
    }
  },

  actions: {
    async fetchTrees() {
      this.isLoading = true
      this.error = null
      
      try {
        console.log('🔄 Fetching trees from service...')
        const trees = await treeService.getAllTrees()
        console.log(`📦 Service returned ${trees.length} trees`)
        this.trees = trees
        console.log(`✅ Store now has ${this.trees.length} trees`)
      } catch (error) {
        this.error = 'Failed to fetch trees: ' + error.message
        console.error('Error fetching trees:', error)
      } finally {
        this.isLoading = false
      }
    },

    async addTree(treeData) {
      this.isLoading = true
      this.error = null

      try {
        const newTree = await treeService.createTree(treeData)
        this.trees.push(newTree)
        return newTree
      } catch (error) {
        this.error = 'Failed to add tree: ' + error.message
        console.error('Error adding tree:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    selectTree(tree) {
      this.selectedTree = tree
    },

    clearSelection() {
      this.selectedTree = null
    },

    async updateTreeStatus(treeId, status) {
      try {
        const updatedTree = await treeService.updateTreeStatus(treeId, status)
        const index = this.trees.findIndex(tree => tree.id === treeId)
        
        if (index !== -1) {
          this.trees[index] = { ...this.trees[index], ...updatedTree }
        }
        
        return updatedTree
      } catch (error) {
        this.error = 'Failed to update tree status: ' + error.message
        console.error('Error updating tree status:', error)
        throw error
      }
    },

    setFilters(newFilters) {
      this.filters = { ...this.filters, ...newFilters }
    },

    clearFilters() {
      this.filters = {
        species: '',
        status: '',
        user: '',
        dateRange: null
      }
    }
  }
})
