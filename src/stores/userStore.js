/**
 * User Store
 *
 * Manages user authentication, profile data, and user-related state
 * using Pinia. Handles login, registration, and profile management.
 *
 * Features:
 * - User authentication (login/register/logout)
 * - Profile management
 * - User preferences and settings
 * - Authentication state persistence
 */

import { defineStore } from 'pinia'
import * as userService from '@/services/userService'

export const useUserStore = defineStore('user', {
  // =============================================================================
  // STATE
  // =============================================================================
  state: () => ({
    // Authentication
    isAuthenticated: false,
    user: null,
    token: null,
    tokenExpiresAt: null,

    // Profile data
    profile: null,
    stats: null,

    // User preferences
    preferences: {
      notifications: true,
      publicProfile: true,
      shareLocation: false,
      theme: 'system', // 'light', 'dark', 'system'
      language: 'en',
    },

    // Loading states
    loading: {
      auth: false,
      profile: false,
      stats: false,
      updating: false,
    },

    // Error handling
    errors: {
      auth: null,
      profile: null,
      stats: null,
      update: null,
    },

    // User search and discovery
    searchResults: [],
    searchQuery: '',
  }),

  // =============================================================================
  // GETTERS
  // =============================================================================
  getters: {
    // Check if user is logged in and token is valid
    isLoggedIn: (state) => {
      if (!state.isAuthenticated || !state.token) return false

      // Check token expiration
      if (state.tokenExpiresAt) {
        const now = new Date()
        const expiresAt = new Date(state.tokenExpiresAt)
        return now < expiresAt
      }

      return true
    },

    // Get user initials for avatar display
    userInitials: (state) => {
      if (!state.user || !state.user.name) return ''
      return state.user.name
        .split(' ')
        .map((name) => name[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    },

    // Get user's full profile data
    fullProfile: (state) => {
      if (!state.user) return null

      return {
        ...state.user,
        ...state.profile,
        stats: state.stats,
        preferences: state.preferences,
      }
    },

    // Check if any loading state is active
    isLoading: (state) => {
      return Object.values(state.loading).some((loading) => loading)
    },

    // Check if any error exists
    hasErrors: (state) => {
      return Object.values(state.errors).some((error) => error !== null)
    },

    // Get user's achievement badges
    badges: (state) => {
      return state.profile?.badges || []
    },

    // Check if user has specific badge
    hasBadge: (state) => {
      return (badgeName) => {
        return state.profile?.badges?.includes(badgeName) || false
      }
    },

    // Get user's ranking or level
    userLevel: (state) => {
      if (!state.stats) return 1

      const treesPlanted = state.stats.treesPlanted || 0

      // Simple level calculation based on trees planted
      if (treesPlanted >= 100) return 'Expert'
      if (treesPlanted >= 50) return 'Advanced'
      if (treesPlanted >= 20) return 'Intermediate'
      if (treesPlanted >= 5) return 'Novice'
      return 'Beginner'
    },
  },

  // =============================================================================
  // ACTIONS
  // =============================================================================
  actions: {
    // -------------------------------------------------------------------------
    // AUTHENTICATION
    // -------------------------------------------------------------------------

    /**
     * Login user with email and password
     */
    async login(email, password) {
      this.loading.auth = true
      this.errors.auth = null

      try {
        const response = await userService.loginUser(email, password)

        this.isAuthenticated = true
        this.user = response.user
        this.token = response.token
        this.tokenExpiresAt = response.expiresAt
        this.preferences = { ...this.preferences, ...response.user.preferences }

        // Persist authentication state
        this.persistAuthState()

        return response.user
      } catch (error) {
        this.errors.auth = error.message
        console.error('Login failed:', error)
        throw error
      } finally {
        this.loading.auth = false
      }
    },

    /**
     * Register new user account
     */
    async register(userData) {
      this.loading.auth = true
      this.errors.auth = null

      try {
        const response = await userService.registerUser(userData)

        this.isAuthenticated = true
        this.user = response.user
        this.token = response.token
        this.tokenExpiresAt = response.expiresAt
        this.preferences = { ...this.preferences, ...response.user.preferences }

        // Persist authentication state
        this.persistAuthState()

        return response.user
      } catch (error) {
        this.errors.auth = error.message
        console.error('Registration failed:', error)
        throw error
      } finally {
        this.loading.auth = false
      }
    },

    /**
     * Logout current user
     */
    async logout() {
      try {
        if (this.token) {
          await userService.logoutUser(this.token)
        }
      } catch (error) {
        console.warn('Logout service call failed:', error)
      } finally {
        // Clear authentication state regardless of service call result
        this.clearAuthState()
      }
    },

    /**
     * Verify authentication token
     */
    async verifyToken() {
      if (!this.token) return false

      try {
        const user = await userService.verifyToken(this.token)
        this.user = user
        this.isAuthenticated = true
        return true
      } catch (error) {
        console.warn('Token verification failed:', error)
        this.clearAuthState()
        return false
      }
    },

    // -------------------------------------------------------------------------
    // PROFILE MANAGEMENT
    // -------------------------------------------------------------------------

    /**
     * Fetch user profile
     */
    async fetchProfile(userId = null) {
      const targetUserId = userId || this.user?.id
      if (!targetUserId) return

      this.loading.profile = true
      this.errors.profile = null

      try {
        const profile = await userService.getUserProfile(targetUserId)

        if (userId === null || userId === this.user?.id) {
          // Update current user's profile
          this.profile = profile
          this.preferences = { ...this.preferences, ...profile.preferences }
        }

        return profile
      } catch (error) {
        this.errors.profile = error.message
        console.error('Failed to fetch profile:', error)
        throw error
      } finally {
        this.loading.profile = false
      }
    },

    /**
     * Update user profile
     */
    async updateProfile(updateData) {
      if (!this.user?.id || !this.token) {
        throw new Error('User not authenticated')
      }

      this.loading.updating = true
      this.errors.update = null

      try {
        const updatedProfile = await userService.updateUserProfile(
          this.user.id,
          updateData,
          this.token,
        )

        // Update local state
        this.profile = updatedProfile

        // Update user object if basic info was changed
        if (updateData.name || updateData.email) {
          this.user = {
            ...this.user,
            name: updateData.name || this.user.name,
            email: updateData.email || this.user.email,
          }
        }

        // Update preferences if they were changed
        if (updateData.preferences) {
          this.preferences = { ...this.preferences, ...updateData.preferences }
        }

        // Persist updated state
        this.persistAuthState()

        return updatedProfile
      } catch (error) {
        this.errors.update = error.message
        console.error('Failed to update profile:', error)
        throw error
      } finally {
        this.loading.updating = false
      }
    },

    /**
     * Fetch user statistics
     */
    async fetchStats(userId = null) {
      const targetUserId = userId || this.user?.id
      if (!targetUserId) return

      this.loading.stats = true
      this.errors.stats = null

      try {
        const stats = await userService.getUserStats(targetUserId)

        if (userId === null || userId === this.user?.id) {
          this.stats = stats
        }

        return stats
      } catch (error) {
        this.errors.stats = error.message
        console.error('Failed to fetch stats:', error)
        throw error
      } finally {
        this.loading.stats = false
      }
    },

    // -------------------------------------------------------------------------
    // PREFERENCES
    // -------------------------------------------------------------------------

    /**
     * Update user preferences
     */
    async updatePreferences(preferences) {
      try {
        await this.updateProfile({ preferences })
      } catch (error) {
        console.error('Failed to update preferences:', error)
        throw error
      }
    },

    /**
     * Set notification preferences
     */
    setNotificationPreferences(enabled) {
      this.preferences.notifications = enabled
    },

    /**
     * Set profile visibility
     */
    setProfileVisibility(isPublic) {
      this.preferences.publicProfile = isPublic
    },

    /**
     * Set location sharing preference
     */
    setLocationSharing(enabled) {
      this.preferences.shareLocation = enabled
    },

    /**
     * Set theme preference
     */
    setTheme(theme) {
      this.preferences.theme = theme
    },

    // -------------------------------------------------------------------------
    // SEARCH AND DISCOVERY
    // -------------------------------------------------------------------------

    /**
     * Search for users
     */
    async searchUsers(query, filters = {}) {
      try {
        const response = await userService.searchUsers(query, filters)
        this.searchResults = response.results
        this.searchQuery = query
        return response
      } catch (error) {
        console.error('User search failed:', error)
        throw error
      }
    },

    // -------------------------------------------------------------------------
    // STATE MANAGEMENT
    // -------------------------------------------------------------------------

    /**
     * Clear all errors
     */
    clearErrors() {
      this.errors = {
        auth: null,
        profile: null,
        stats: null,
        update: null,
      }
    },

    /**
     * Clear authentication state
     */
    clearAuthState() {
      this.isAuthenticated = false
      this.user = null
      this.token = null
      this.tokenExpiresAt = null
      this.profile = null
      this.stats = null

      // Clear persisted state
      localStorage.removeItem('pin-a-tree-auth')
      sessionStorage.removeItem('pin-a-tree-auth')
    },

    /**
     * Persist authentication state to localStorage
     */
    persistAuthState() {
      const authData = {
        isAuthenticated: this.isAuthenticated,
        user: this.user,
        token: this.token,
        tokenExpiresAt: this.tokenExpiresAt,
        preferences: this.preferences,
      }

      localStorage.setItem('pin-a-tree-auth', JSON.stringify(authData))
    },

    /**
     * Restore authentication state from localStorage
     */
    restoreAuthState() {
      try {
        const authData = localStorage.getItem('pin-a-tree-auth')
        if (authData) {
          const parsed = JSON.parse(authData)

          // Check if token hasn't expired
          if (parsed.tokenExpiresAt) {
            const now = new Date()
            const expiresAt = new Date(parsed.tokenExpiresAt)

            if (now < expiresAt) {
              this.isAuthenticated = parsed.isAuthenticated
              this.user = parsed.user
              this.token = parsed.token
              this.tokenExpiresAt = parsed.tokenExpiresAt
              this.preferences = { ...this.preferences, ...parsed.preferences }
              return true
            }
          }
        }
      } catch (error) {
        console.warn('Failed to restore auth state:', error)
      }

      // Clear invalid state
      this.clearAuthState()
      return false
    },

    /**
     * Initialize store (restore auth state)
     */
    async initialize() {
      // Try to restore authentication state
      const restored = this.restoreAuthState()

      // If authentication was restored, verify the token
      if (restored && this.token) {
        try {
          await this.verifyToken()
        } catch (error) {
          console.warn('Token verification failed on initialization:', error)
          this.clearAuthState()
        }
      }
    },

    /**
     * Reset store to initial state
     */
    reset() {
      this.clearAuthState()
      this.$reset()
    },
  },
})
