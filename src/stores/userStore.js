/**
 * User Store
 *
 * Manages user authentication, profile data, and user-related state.
 * Handles user authentication workflow and profile management.
 *
 * Features:
 * - User authentication (mock for MVP)
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
 * @action login - Authenticate user (mock implementation)
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
      if (!state.currentUser?.name) return ''
      return state.currentUser.name
        .split(' ')
        .map(word => word.charAt(0).toUpperCase())
        .join('')
        .slice(0, 2)
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
        // Mock authentication - in real app, this would validate credentials
        const user = await userService.authenticateUser(email, password)
        this.currentUser = user
        this.isAuthenticated = true
        
        // Store auth state in localStorage for persistence
        localStorage.setItem('pin-a-tree-user', JSON.stringify(user))
        
        return user
      } catch (error) {
        this.error = 'Login failed: ' + error.message
        console.error('Login error:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async loginAsGuest(userData) {
      // Quick guest login for MVP - creates temporary user
      this.isLoading = true
      this.error = null

      try {
        const guestUser = await userService.createGuestUser(userData)
        this.currentUser = guestUser
        this.isAuthenticated = true
        
        localStorage.setItem('pin-a-tree-user', JSON.stringify(guestUser))
        
        return guestUser
      } catch (error) {
        this.error = 'Guest login failed: ' + error.message
        console.error('Guest login error:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    logout() {
      this.currentUser = null
      this.isAuthenticated = false
      this.error = null
      
      // Clear stored auth state
      localStorage.removeItem('pin-a-tree-user')
    },

    async restoreAuthState() {
      // Restore authentication state from localStorage on app init
      try {
        const storedUser = localStorage.getItem('pin-a-tree-user')
        if (storedUser) {
          const user = JSON.parse(storedUser)
          this.currentUser = user
          this.isAuthenticated = true
        }
      } catch (error) {
        console.error('Failed to restore auth state:', error)
        this.logout()
      }
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
        
        // Update stored user data
        localStorage.setItem('pin-a-tree-user', JSON.stringify(this.currentUser))
        
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
