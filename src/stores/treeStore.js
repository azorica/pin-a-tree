/**
 * Tree Store
 *
 * Manages all tree-related state including tree data, filters,
 * search results, and CRUD operations using Pinia.
 *
 * Features:
 * - Tree data management
 * - Search and filtering
 * - CRUD operations
 * - Loading states and error handling
 */

import { defineStore } from 'pinia'
import * as treeService from '@/services/treeService'
import * as imageService from '@/services/imageService'

export const useTreeStore = defineStore('trees', {
  // =============================================================================
  // STATE
  // =============================================================================
  state: () => ({
    // Tree data
    trees: [],
    currentTree: null,

    // Pagination and filtering
    pagination: {
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 0,
    },

    filters: {
      search: '',
      species: '',
      bounds: null, // Map bounds for location filtering
      dateRange: {
        start: null,
        end: null,
      },
    },

    // Search results
    searchResults: [],
    searchQuery: '',

    // Loading states
    loading: {
      trees: false,
      currentTree: false,
      creating: false,
      updating: false,
      deleting: false,
      searching: false,
    },

    // Error handling
    errors: {
      trees: null,
      currentTree: null,
      create: null,
      update: null,
      delete: null,
      search: null,
    },

    // UI state
    selectedTreeIds: [],
    sortBy: 'dateAdded',
    sortOrder: 'desc', // 'asc' or 'desc'
    viewMode: 'grid', // 'grid' or 'list'
  }),

  // =============================================================================
  // GETTERS
  // =============================================================================
  getters: {
    // Get trees with current filters applied
    filteredTrees: (state) => {
      let filtered = [...state.trees]

      // Apply search filter
      if (state.filters.search) {
        const searchTerm = state.filters.search.toLowerCase()
        filtered = filtered.filter(
          (tree) =>
            tree.name.toLowerCase().includes(searchTerm) ||
            tree.species.toLowerCase().includes(searchTerm) ||
            tree.description.toLowerCase().includes(searchTerm),
        )
      }

      // Apply species filter
      if (state.filters.species) {
        filtered = filtered.filter((tree) =>
          tree.species.toLowerCase().includes(state.filters.species.toLowerCase()),
        )
      }

      // Apply date range filter
      if (state.filters.dateRange.start || state.filters.dateRange.end) {
        filtered = filtered.filter((tree) => {
          const treeDate = new Date(tree.datePlanted)
          const startDate = state.filters.dateRange.start
            ? new Date(state.filters.dateRange.start)
            : null
          const endDate = state.filters.dateRange.end ? new Date(state.filters.dateRange.end) : null

          if (startDate && treeDate < startDate) return false
          if (endDate && treeDate > endDate) return false
          return true
        })
      }

      return filtered
    },

    // Get sorted trees
    sortedTrees: (state) => {
      const trees = state.filteredTrees

      return [...trees].sort((a, b) => {
        let aValue = a[state.sortBy]
        let bValue = b[state.sortBy]

        // Handle date sorting
        if (state.sortBy === 'dateAdded' || state.sortBy === 'datePlanted') {
          aValue = new Date(aValue)
          bValue = new Date(bValue)
        }

        // Handle string sorting
        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase()
          bValue = bValue.toLowerCase()
        }

        if (state.sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1
        } else {
          return aValue < bValue ? 1 : -1
        }
      })
    },

    // Get unique species from all trees
    availableSpecies: (state) => {
      const species = state.trees.map((tree) => tree.species)
      return [...new Set(species)].sort()
    },

    // Get trees by location bounds
    treesInBounds: (state) => {
      if (!state.filters.bounds) return state.trees

      return state.trees.filter((tree) => {
        const { latitude, longitude } = tree.location
        return (
          latitude >= state.filters.bounds.south &&
          latitude <= state.filters.bounds.north &&
          longitude >= state.filters.bounds.west &&
          longitude <= state.filters.bounds.east
        )
      })
    },

    // Check if any loading state is active
    isLoading: (state) => {
      return Object.values(state.loading).some((loading) => loading)
    },

    // Check if any error exists
    hasErrors: (state) => {
      return Object.values(state.errors).some((error) => error !== null)
    },

    // Get tree statistics
    treeStats: (state) => ({
      total: state.trees.length,
      species: state.availableSpecies.length,
      plantersCount: new Set(state.trees.map((tree) => tree.plantedBy.userId)).size,
      recentlyAdded: state.trees.filter((tree) => {
        const oneWeekAgo = new Date()
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
        return new Date(tree.dateAdded) > oneWeekAgo
      }).length,
    }),
  },

  // =============================================================================
  // ACTIONS
  // =============================================================================
  actions: {
    // -------------------------------------------------------------------------
    // FETCH OPERATIONS
    // -------------------------------------------------------------------------

    /**
     * Fetch trees with current filters and pagination
     */
    async fetchTrees(options = {}) {
      this.loading.trees = true
      this.errors.trees = null

      try {
        const queryOptions = {
          page: this.pagination.page,
          limit: this.pagination.limit,
          search: this.filters.search,
          species: this.filters.species,
          bounds: this.filters.bounds,
          ...options,
        }

        const response = await treeService.fetchTrees(queryOptions)

        this.trees = response.trees
        this.pagination = {
          page: response.page,
          limit: response.limit,
          total: response.total,
          totalPages: response.totalPages,
        }
      } catch (error) {
        this.errors.trees = error.message
        console.error('Failed to fetch trees:', error)
      } finally {
        this.loading.trees = false
      }
    },

    /**
     * Fetch a single tree by ID
     */
    async fetchTreeById(treeId) {
      this.loading.currentTree = true
      this.errors.currentTree = null

      try {
        const tree = await treeService.fetchTreeById(treeId)
        this.currentTree = tree
        return tree
      } catch (error) {
        this.errors.currentTree = error.message
        console.error('Failed to fetch tree:', error)
        throw error
      } finally {
        this.loading.currentTree = false
      }
    },

    // -------------------------------------------------------------------------
    // CRUD OPERATIONS
    // -------------------------------------------------------------------------

    /**
     * Create a new tree
     */
    async createTree(treeData) {
      this.loading.creating = true
      this.errors.create = null

      try {
        const newTree = await treeService.createTree(treeData)

        // Add to local state
        this.trees.unshift(newTree)
        this.pagination.total += 1

        return newTree
      } catch (error) {
        this.errors.create = error.message
        console.error('Failed to create tree:', error)
        throw error
      } finally {
        this.loading.creating = false
      }
    },

    /**
     * Update an existing tree
     */
    async updateTree(treeId, updateData) {
      this.loading.updating = true
      this.errors.update = null

      try {
        const updatedTree = await treeService.updateTree(treeId, updateData)

        // Update in local state
        const index = this.trees.findIndex((tree) => tree.id === treeId)
        if (index !== -1) {
          this.trees[index] = updatedTree
        }

        // Update current tree if it's the same
        if (this.currentTree && this.currentTree.id === treeId) {
          this.currentTree = updatedTree
        }

        return updatedTree
      } catch (error) {
        this.errors.update = error.message
        console.error('Failed to update tree:', error)
        throw error
      } finally {
        this.loading.updating = false
      }
    },

    /**
     * Delete a tree
     */
    async deleteTree(treeId) {
      this.loading.deleting = true
      this.errors.delete = null

      try {
        await treeService.deleteTree(treeId)

        // Remove from local state
        this.trees = this.trees.filter((tree) => tree.id !== treeId)
        this.pagination.total -= 1

        // Clear current tree if it was deleted
        if (this.currentTree && this.currentTree.id === treeId) {
          this.currentTree = null
        }

        return true
      } catch (error) {
        this.errors.delete = error.message
        console.error('Failed to delete tree:', error)
        throw error
      } finally {
        this.loading.deleting = false
      }
    },

    // -------------------------------------------------------------------------
    // SEARCH AND FILTERING
    // -------------------------------------------------------------------------

    /**
     * Search trees
     */
    async searchTrees(query, filters = {}) {
      this.loading.searching = true
      this.errors.search = null
      this.searchQuery = query

      try {
        const response = await treeService.searchTrees(query, filters)
        this.searchResults = response.results
        return response
      } catch (error) {
        this.errors.search = error.message
        console.error('Failed to search trees:', error)
        throw error
      } finally {
        this.loading.searching = false
      }
    },

    /**
     * Set search filter
     */
    setSearchFilter(search) {
      this.filters.search = search
    },

    /**
     * Set species filter
     */
    setSpeciesFilter(species) {
      this.filters.species = species
    },

    /**
     * Set map bounds filter
     */
    setBoundsFilter(bounds) {
      this.filters.bounds = bounds
    },

    /**
     * Set date range filter
     */
    setDateRangeFilter(startDate, endDate) {
      this.filters.dateRange = {
        start: startDate,
        end: endDate,
      }
    },

    /**
     * Clear all filters
     */
    clearFilters() {
      this.filters = {
        search: '',
        species: '',
        bounds: null,
        dateRange: {
          start: null,
          end: null,
        },
      }
    },

    // -------------------------------------------------------------------------
    // PAGINATION AND SORTING
    // -------------------------------------------------------------------------

    /**
     * Set current page
     */
    setPage(page) {
      this.pagination.page = page
    },

    /**
     * Set items per page
     */
    setLimit(limit) {
      this.pagination.limit = limit
      this.pagination.page = 1 // Reset to first page
    },

    /**
     * Set sorting
     */
    setSorting(sortBy, sortOrder = 'desc') {
      this.sortBy = sortBy
      this.sortOrder = sortOrder
    },

    /**
     * Set view mode
     */
    setViewMode(mode) {
      this.viewMode = mode
    },

    // -------------------------------------------------------------------------
    // SELECTION
    // -------------------------------------------------------------------------

    /**
     * Select/deselect tree
     */
    toggleTreeSelection(treeId) {
      const index = this.selectedTreeIds.indexOf(treeId)
      if (index === -1) {
        this.selectedTreeIds.push(treeId)
      } else {
        this.selectedTreeIds.splice(index, 1)
      }
    },

    /**
     * Select all trees
     */
    selectAllTrees() {
      this.selectedTreeIds = this.filteredTrees.map((tree) => tree.id)
    },

    /**
     * Clear all selections
     */
    clearSelection() {
      this.selectedTreeIds = []
    },

    // -------------------------------------------------------------------------
    // UTILITY ACTIONS
    // -------------------------------------------------------------------------

    /**
     * Clear all errors
     */
    clearErrors() {
      this.errors = {
        trees: null,
        currentTree: null,
        create: null,
        update: null,
        delete: null,
        search: null,
      }
    },

    /**
     * Reset store to initial state
     */
    reset() {
      this.$reset()
    },

    /**
     * Set current tree
     */
    setCurrentTree(tree) {
      this.currentTree = tree
    },

    /**
     * Clear current tree
     */
    clearCurrentTree() {
      this.currentTree = null
    },
  },
})
