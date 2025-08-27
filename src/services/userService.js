/**
 * User Service 
 *
 * Service layer for user-related operations including authentication,
 * profile management, and user data handling.
 * Now connected to real backend APIs!
 */

import axios from 'axios'
import mockUsers from '@/mocks/users.json'

// Configuration
const USE_MOCK_DATA = true // Temporarily using mock data while testing
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

// Simulated delay for mock API calls
const MOCK_DELAY = 600

// Helper function to simulate API delay
const simulateApiDelay = () => new Promise(resolve => setTimeout(resolve, MOCK_DELAY))

class UserService {
  /**
   * Authenticate user with email and password using backend API
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} Authentication response with user and token
   */
  async authenticateUser(email, password) {
    if (USE_MOCK_DATA) {
      await simulateApiDelay()
      
      // Mock authentication - find user by email
      const user = mockUsers.find(u => u.email === email)
      
      if (!user) {
        throw new Error('User not found')
      }
      
      // In a real app, password would be validated here
      // For MVP, we'll accept any password for existing users
      return user
    }
    
    try {
      const response = await apiClient.post('/auth/login', { email, password })
      
      // Store the JWT token
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token)
      }
      
      return response.data
    } catch (error) {
      console.error('Authentication error:', error)
      throw new Error('Invalid email or password')
    }
  }

  /**
   * Register a new user using backend API
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Registration response with user and token
   */
  async registerUser(userData) {
    if (USE_MOCK_DATA) {
      await simulateApiDelay()
      
      // Check if user already exists
      const existingUser = mockUsers.find(u => u.email === userData.email)
      if (existingUser) {
        throw new Error('User already exists')
      }
      
      const newUser = {
        id: `user-${Date.now()}`,
        name: userData.name,
        email: userData.email,
        createdAt: new Date().toISOString(),
        avatar: null
      }
      
      return newUser
    }
    
    try {
      const response = await apiClient.post('/auth/register', userData)
      
      // Store the JWT token
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token)
      }
      
      return response.data
    } catch (error) {
      console.error('Registration error:', error)
      throw new Error('Failed to register user')
    }
  }

  /**
   * Get all users (for displaying community members)
   * @returns {Promise<Array>} Array of user objects
   */
  async getAllUsers() {
    if (USE_MOCK_DATA) {
      await simulateApiDelay()
      return [...mockUsers]
    }
    
    try {
      const response = await apiClient.get('/users')
      return response.data
    } catch (error) {
      console.error('Error fetching users:', error)
      throw new Error('Failed to fetch users')
    }
  }

  /**
   * Get current user profile from backend API
   * @returns {Promise<Object>} Current user object
   */
  async getCurrentUser() {
    if (USE_MOCK_DATA) {
      await simulateApiDelay()
      // Return first user as mock current user
      return mockUsers[0]
    }
    
    try {
      const response = await apiClient.get('/auth/profile')
      return response.data
    } catch (error) {
      console.error('Error fetching user profile:', error)
      throw new Error('Failed to fetch user profile')
    }
  }

  /**
   * Logout current user
   */
  logout() {
    localStorage.removeItem('authToken')
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} Authentication status
   */
  isAuthenticated() {
    return !!localStorage.getItem('authToken')
  }

  /**
   * Create a guest user for quick access
   * @param {Object} userData - Basic user data
   * @returns {Promise<Object>} Created guest user object
   */
  async createGuestUser(userData) {
    await simulateApiDelay()
    
    const guestUser = {
      id: `guest-${Date.now()}`,
      name: userData.name || 'Guest User',
      email: userData.email || `guest-${Date.now()}@pin-a-tree.app`,
      avatar: userData.avatar || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face`,
      bio: userData.bio || 'New to Pin-a-Tree community',
      location: userData.location || '',
      joinDate: new Date().toISOString().split('T')[0],
      treesPlanted: 0,
      badges: ['newcomer'],
      isGuest: true
    }
    
    return guestUser
  }

  /**
   * Update user profile
   * @param {string} userId - User identifier
   * @param {Object} updates - Profile updates
   * @returns {Promise<Object>} Updated user data
   */
  async updateUserProfile(userId, updates) {
    await simulateApiDelay()
    
    // Return the updates as if they were saved
    return {
      ...updates,
      updatedAt: new Date().toISOString()
    }
  }
}

// Export singleton instance
export const userService = new UserService()
