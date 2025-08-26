/**
 * User Service (MVP Mock Version)
 *
 * Service layer for user-related operations including authentication,
 * profile management, and user data handling.
 * For MVP, uses mock data and simulated authentication.
 */

// import axios from 'axios' // Commented out for MVP
import mockUsers from '@/mocks/users.json'

// Configuration
const USE_MOCK_DATA = true // Always true for MVP

// Simulated delay for mock API calls
const MOCK_DELAY = 600

// Helper function to simulate API delay
const simulateApiDelay = () => new Promise(resolve => setTimeout(resolve, MOCK_DELAY))

class UserService {
  /**
   * Get all users (for displaying community members)
   * @returns {Promise<Array>} Array of user objects
   */
  async getAllUsers() {
    await simulateApiDelay()
    return [...mockUsers]
  }

  /**
   * Authenticate user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} Authenticated user object
   */
  async authenticateUser(email, password) {
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
