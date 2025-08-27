/**
 * User Store
 *
 * Manages user authentication, profile data, and user-related state.
 * Handles user authentication workflow and profile management.
 *
 * Features:
 * - User authentication with JWT tokens
 * - User profile management
 * - User statistics tracking
 * - Authentication state management
 *
 * State:
 * @state {Object|null} currentUser - Currently authenticated user
 * @state {Boolean} isAuthenticated - Authentication status
 * @state {Boolean} isLoading - Loading state for auth operations
 * @state {String|null} error - Error message if auth fails
 * @state {Array} users - All users (for MVP mock data)
 *
 * Actions:
 * @action login - Authenticate user with backend API
 * @action register - Register new user with backend API
 * @action logout - Sign out current user
 * @action fetchUserProfile - Get user profile data
 * @action updateProfile - Update user profile information
 */

import { defineStore } from 'pinia'
import { userService } from '@/services/userService'

export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    users: []
  }),

  getters: {
    userInitials: (state) => {
      if (!state.currentUser) return ''
      const name = state.currentUser.firstName && state.currentUser.lastName 
        ? `${state.currentUser.firstName} ${state.currentUser.lastName}`
        : state.currentUser.username || state.currentUser.email || ''
      
      return name
        .split(' ')
        .map(word => word.charAt(0).toUpperCase())
        .join('')
        .slice(0, 2)
    },

    userDisplayName: (state) => {
      if (!state.currentUser) return ''
      if (state.currentUser.firstName && state.currentUser.lastName) {
        return `${state.currentUser.firstName} ${state.currentUser.lastName}`
      }
      return state.currentUser.username || state.currentUser.email || ''
    },

    userStats: (state) => {
      if (!state.currentUser) return null
      
      return {
        treesPlanted: state.currentUser.treesPlanted || 0,
        badges: state.currentUser.badges || [],
        joinDate: state.currentUser.joinDate,
        memberSince: state.currentUser.joinDate ? 
          new Date(state.currentUser.joinDate).getFullYear() : null
      }
    }
  },

  actions: {
    async fetchUsers() {
      this.isLoading = true
      this.error = null

      try {
        const users = await userService.getAllUsers()
        this.users = users
      } catch (error) {
        this.error = 'Failed to fetch users: ' + error.message
        console.error('Error fetching users:', error)
      } finally {
        this.isLoading = false
      }
    },

    async login(email, password) {
      this.isLoading = true
      this.error = null

      try {
        // Authenticate with backend API
        const response = await userService.authenticateUser(email, password)
        
        // Response should contain user data and token
        this.currentUser = response.user || response
        this.isAuthenticated = true
        
        console.log('✅ Login successful:', this.currentUser)
        
        return this.currentUser
      } catch (error) {
        this.error = 'Login failed: ' + error.message
        console.error('Login error:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async register(userData) {
      this.isLoading = true
      this.error = null

      try {
        // Register with backend API
        const response = await userService.registerUser(userData)
        
        // Response should contain user data and token
        this.currentUser = response.user || response
        this.isAuthenticated = true
        
        console.log('✅ Registration successful:', this.currentUser)
        
        return this.currentUser
      } catch (error) {
        this.error = 'Registration failed: ' + error.message
        console.error('Registration error:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async checkAuthStatus() {
      // Check if user is already authenticated (e.g., on app start)
      if (userService.isAuthenticated()) {
        try {
          this.isLoading = true
          const user = await userService.getCurrentUser()
          this.currentUser = user
          this.isAuthenticated = true
        } catch (error) {
          // Token might be expired, clear it
          this.logout()
        } finally {
          this.isLoading = false
        }
      }
    },

    logout() {
      this.currentUser = null
      this.isAuthenticated = false
      this.error = null
      
      // Clear auth token from userService
      userService.logout()
      
      console.log('🚪 User logged out')
    },

    async restoreAuthState() {
      // Check if user is already authenticated on app startup
      await this.checkAuthStatus()
    },

    async updateProfile(updates) {
      if (!this.currentUser) {
        throw new Error('No user logged in')
      }

      this.isLoading = true
      this.error = null

      try {
        const updatedUser = await userService.updateUserProfile(
          this.currentUser.id, 
          updates
        )
        
        this.currentUser = { ...this.currentUser, ...updatedUser }
        
        return this.currentUser
      } catch (error) {
        this.error = 'Failed to update profile: ' + error.message
        console.error('Profile update error:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    }
  }
})
