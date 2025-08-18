/**
 * User Service
 *
 * Handles all user-related API operations including authentication,
 * profile management, and user statistics. Uses mock data during MVP development.
 *
 * Features:
 * - User authentication (login/register/logout)
 * - Profile management
 * - User statistics and achievements
 * - Search and discovery
 */

import axios from 'axios'
// Mock data imports
import mockUsers from '@/mocks/users.json'
import mockApiResponses from '@/mocks/api-responses.json'

// =============================================================================
// CONFIGURATION
// =============================================================================

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.pin-a-tree.com'
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA !== 'false' // Default to true

// =============================================================================
// AUTHENTICATION
// =============================================================================

/**
 * Authenticate user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} Authentication response with user data and token
 */
export async function loginUser(email, password) {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Simple mock validation
    const user = mockUsers.find((u) => u.email === email)
    if (!user || password !== 'demo123') {
      throw new Error('Invalid credentials')
    }

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        initials: user.initials,
        avatar: user.avatar,
        preferences: user.preferences,
      },
      token: `mock-jwt-token-${user.id}`,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
    }
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email,
      password,
    })
    return response.data
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error('Invalid credentials')
    }
    throw new Error(`Login failed: ${error.message}`)
  }
}

/**
 * Register a new user account
 * @param {Object} userData - User registration data
 * @param {string} userData.name - User's full name
 * @param {string} userData.email - User's email address
 * @param {string} userData.password - User's password
 * @returns {Promise<Object>} Registration response with user data
 */
export async function registerUser(userData) {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check if email already exists
    const existingUser = mockUsers.find((u) => u.email === userData.email)
    if (existingUser) {
      throw new Error('Email already exists')
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name: userData.name,
      email: userData.email,
      initials: userData.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase(),
      avatar: null,
      joinDate: new Date().toISOString(),
      location: {
        city: '',
        state: '',
        country: '',
      },
      bio: '',
      stats: {
        treesPlanted: 0,
        treesAdopted: 0,
        communityEvents: 0,
      },
      preferences: {
        notifications: true,
        publicProfile: true,
        shareLocation: false,
      },
      badges: [],
    }

    return {
      user: newUser,
      token: `mock-jwt-token-${newUser.id}`,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    }
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, userData)
    return response.data
  } catch (error) {
    if (error.response?.status === 400) {
      throw new Error('Registration failed: Invalid data provided')
    }
    if (error.response?.status === 409) {
      throw new Error('Email already exists')
    }
    throw new Error(`Registration failed: ${error.message}`)
  }
}

/**
 * Logout current user
 * @param {string} token - Authentication token
 * @returns {Promise<boolean>} Success status
 */
export async function logoutUser(token) {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 200))
    return true
  }

  try {
    await axios.post(
      `${API_BASE_URL}/auth/logout`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
    return true
  } catch (error) {
    // Logout should generally succeed even if the server call fails
    console.warn('Logout server call failed:', error.message)
    return true
  }
}

/**
 * Verify authentication token
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} User data if token is valid
 */
export async function verifyToken(token) {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 300))

    if (!token || !token.startsWith('mock-jwt-token-')) {
      throw new Error('Invalid token')
    }

    const userId = token.replace('mock-jwt-token-', '')
    const user = mockUsers.find((u) => u.id === userId)

    if (!user) {
      throw new Error('User not found')
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      initials: user.initials,
      avatar: user.avatar,
      preferences: user.preferences,
    }
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/auth/verify`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data.user
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error('Invalid or expired token')
    }
    throw new Error(`Token verification failed: ${error.message}`)
  }
}

// =============================================================================
// PROFILE MANAGEMENT
// =============================================================================

/**
 * Get user profile by ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User profile data
 */
export async function getUserProfile(userId) {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 250))

    const user = mockUsers.find((u) => u.id === userId)
    if (!user) {
      throw new Error('User not found')
    }

    return user
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/users/${userId}`)
    return response.data.user
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('User not found')
    }
    throw new Error(`Failed to fetch user profile: ${error.message}`)
  }
}

/**
 * Update user profile
 * @param {string} userId - User ID
 * @param {Object} updateData - Profile fields to update
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} Updated user profile
 */
export async function updateUserProfile(userId, updateData, token) {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 400))

    const user = mockUsers.find((u) => u.id === userId)
    if (!user) {
      throw new Error('User not found')
    }

    const updatedUser = {
      ...user,
      ...updateData,
      lastModified: new Date().toISOString(),
    }

    return updatedUser
  }

  try {
    const response = await axios.put(`${API_BASE_URL}/users/${userId}`, updateData, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data.user
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('User not found')
    }
    if (error.response?.status === 403) {
      throw new Error('Permission denied')
    }
    throw new Error(`Failed to update profile: ${error.message}`)
  }
}

// =============================================================================
// USER STATISTICS
// =============================================================================

/**
 * Get user statistics and achievements
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User statistics
 */
export async function getUserStats(userId) {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 200))

    const user = mockUsers.find((u) => u.id === userId)
    if (!user) {
      throw new Error('User not found')
    }

    return {
      stats: user.stats,
      badges: user.badges,
      ranking: Math.floor(Math.random() * 100) + 1, // Mock ranking
      joinDate: user.joinDate,
      recentActivity: [
        {
          type: 'tree_planted',
          date: '2024-02-08T14:30:00Z',
          description: 'Planted an Oak tree in Central Park',
        },
        {
          type: 'badge_earned',
          date: '2024-02-05T10:15:00Z',
          description: 'Earned "Tree Planter" badge',
        },
      ],
    }
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/users/${userId}/stats`)
    return response.data
  } catch (error) {
    throw new Error(`Failed to fetch user stats: ${error.message}`)
  }
}

// =============================================================================
// SEARCH AND DISCOVERY
// =============================================================================

/**
 * Search users by name or location
 * @param {string} query - Search query
 * @param {Object} filters - Additional filters
 * @returns {Promise<Object>} Search results
 */
export async function searchUsers(query, filters = {}) {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 300))

    let results = mockUsers.filter((user) => user.preferences.publicProfile)

    if (query) {
      const searchTerm = query.toLowerCase()
      results = results.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm) ||
          user.bio.toLowerCase().includes(searchTerm) ||
          user.location.city.toLowerCase().includes(searchTerm),
      )
    }

    // Remove sensitive information
    results = results.map((user) => ({
      id: user.id,
      name: user.name,
      initials: user.initials,
      avatar: user.avatar,
      location: user.preferences.shareLocation ? user.location : null,
      bio: user.bio,
      stats: user.stats,
      badges: user.badges,
    }))

    return {
      results,
      total: results.length,
      query,
    }
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/users/search`, {
      params: { query, ...filters },
    })
    return response.data
  } catch (error) {
    throw new Error(`User search failed: ${error.message}`)
  }
}
