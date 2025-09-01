# 🔄 Frontend Integration Guide

## Overview
This guide outlines the changes needed to integrate the real backend APIs with the existing frontend.

## 1. Environment Configuration

Create `.env` file in the frontend root:

```env
# Backend API URL
VITE_API_URL=http://localhost:3001/api

# Environment
VITE_NODE_ENV=development
```

## 2. API Service Updates

### Update `src/services/api.ts`:

```typescript
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
})

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('authToken')
      localStorage.removeItem('currentUser')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
```

### Update `src/services/treeService.ts`:

```typescript
import { api } from './api'

export interface CreateTreeDto {
  name: string
  species?: string
  description?: string
  datePlanted?: string
  latitude: number
  longitude: number
  address?: string
  imageUrl: string
  tags?: string[]
}

export const treeService = {
  // Get all trees
  async getAllTrees() {
    try {
      const response = await api.get('/trees')
      return response.data
    } catch (error) {
      console.error('Failed to fetch trees:', error)
      throw error
    }
  },

  // Create new tree
  async createTree(treeData: CreateTreeDto) {
    try {
      const response = await api.post('/trees', treeData)
      return response.data
    } catch (error) {
      console.error('Failed to create tree:', error)
      throw error
    }
  },

  // Upload image
  async uploadImage(file: File): Promise<{ imageUrl: string; filename: string }> {
    try {
      const formData = new FormData()
      formData.append('image', file)
      
      const response = await api.post('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      return response.data
    } catch (error) {
      console.error('Failed to upload image:', error)
      throw error
    }
  }
}
```

### Create `src/services/authService.ts`:

```typescript
import { api } from './api'

export interface LoginDto {
  email: string
  password: string
}

export interface RegisterDto {
  email: string
  username: string
  password: string
  firstName?: string
  lastName?: string
}

export interface User {
  id: string
  email: string
  username: string
  firstName?: string
  lastName?: string
  avatar?: string
  createdAt: string
}

export interface AuthResponse {
  user: User
  token: string
}

export const authService = {
  // Login
  async login(credentials: LoginDto): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/login', credentials)
      const { user, token } = response.data
      
      // Store token and user in localStorage
      localStorage.setItem('authToken', token)
      localStorage.setItem('currentUser', JSON.stringify(user))
      
      return response.data
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  },

  // Register
  async register(userData: RegisterDto): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/register', userData)
      const { user, token } = response.data
      
      // Store token and user in localStorage
      localStorage.setItem('authToken', token)
      localStorage.setItem('currentUser', JSON.stringify(user))
      
      return response.data
    } catch (error) {
      console.error('Registration failed:', error)
      throw error
    }
  },

  // Logout
  logout() {
    localStorage.removeItem('authToken')
    localStorage.removeItem('currentUser')
  },

  // Get current user from localStorage
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('currentUser')
    return userStr ? JSON.parse(userStr) : null
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken')
  }
}
```

## 3. Store Updates

### Update `src/stores/userStore.js`:

```javascript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/authService'

export const useUserStore = defineStore('user', () => {
  // State
  const currentUser = ref(null)
  const isLoading = ref(false)
  const error = ref(null)

  // Getters
  const isAuthenticated = computed(() => !!currentUser.value)
  const userInitials = computed(() => {
    if (!currentUser.value) return 'G'
    const first = currentUser.value.firstName?.[0] || ''
    const last = currentUser.value.lastName?.[0] || ''
    return (first + last) || currentUser.value.username?.[0]?.toUpperCase() || 'U'
  })

  // Actions
  const login = async (credentials) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await authService.login(credentials)
      currentUser.value = response.user
      return response
    } catch (err) {
      error.value = err.response?.data?.error || 'Login failed'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const register = async (userData) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await authService.register(userData)
      currentUser.value = response.user
      return response
    } catch (err) {
      error.value = err.response?.data?.error || 'Registration failed'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    authService.logout()
    currentUser.value = null
  }

  const initializeAuth = () => {
    const user = authService.getCurrentUser()
    if (user) {
      currentUser.value = user
    }
  }

  return {
    // State
    currentUser,
    isLoading,
    error,
    
    // Getters
    isAuthenticated,
    userInitials,
    
    // Actions
    login,
    register,
    logout,
    initializeAuth
  }
})
```

### Update `src/stores/treeStore.js`:

```javascript
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { treeService } from '@/services/treeService'

export const useTreeStore = defineStore('tree', () => {
  // State
  const trees = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  // Actions
  const fetchTrees = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      const data = await treeService.getAllTrees()
      trees.value = data
    } catch (err) {
      error.value = err.response?.data?.error || 'Failed to fetch trees'
      console.error('Error fetching trees:', err)
    } finally {
      isLoading.value = false
    }
  }

  const addTree = async (treeData) => {
    isLoading.value = true
    error.value = null
    
    try {
      // First upload the image if it's a File object
      let imageUrl = treeData.imageUrl
      if (treeData.imageFile instanceof File) {
        const uploadResult = await treeService.uploadImage(treeData.imageFile)
        imageUrl = uploadResult.imageUrl
      }
      
      // Create tree with uploaded image URL
      const newTreeData = {
        ...treeData,
        imageUrl,
        imageFile: undefined // Remove file object
      }
      
      const newTree = await treeService.createTree(newTreeData)
      trees.value.unshift(newTree) // Add to beginning of array
      return newTree
    } catch (err) {
      error.value = err.response?.data?.error || 'Failed to add tree'
      console.error('Error adding tree:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // State
    trees,
    isLoading,
    error,
    
    // Actions
    fetchTrees,
    addTree,
    clearError
  }
})
```

## 4. Component Updates

### Update `src/views/TreeFormView.vue`:

Key changes needed:
1. **Import auth store** and check authentication
2. **Update image handling** to work with file upload API
3. **Add error handling** for API calls
4. **Show loading states** during API operations

```javascript
// Add to script setup
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()

// Check authentication
onMounted(() => {
  if (!userStore.isAuthenticated) {
    router.push('/login') // Redirect to login if not authenticated
  }
})

// Update handleImageUpload to store file for later upload
const handleImageUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  // Create preview
  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value = e.target.result
  }
  reader.readAsDataURL(file)

  // Store file for later upload (don't upload immediately)
  formData.imageFile = file

  // Extract EXIF data
  try {
    await extractExifData(file)
    if (hasGpsData.value) {
      formData.location.latitude = gpsData.value.latitude
      formData.location.longitude = gpsData.value.longitude
      formData.location.address = `${gpsData.value.latitude.toFixed(4)}, ${gpsData.value.longitude.toFixed(4)}`
    }
  } catch (error) {
    console.warn('Failed to extract GPS data:', error)
  }
}

// Update handleSubmit to use real API
const handleSubmit = async () => {
  if (!isFormValid.value) return

  isSubmitting.value = true

  try {
    const treeData = {
      name: formData.name.trim(),
      species: formData.species.trim(),
      datePlanted: formData.datePlanted,
      description: formData.description.trim(),
      latitude: formData.location.latitude,
      longitude: formData.location.longitude,
      address: formData.location.address.trim(),
      imageFile: formData.imageFile, // Pass file for upload
      tags: [] // Add tags if implemented
    }

    await treeStore.addTree(treeData)
    router.push('/map')
  } catch (error) {
    console.error('Failed to add tree:', error)
    // Show error message to user
  } finally {
    isSubmitting.value = false
  }
}
```

## 5. Authentication Views

You'll need to create:
- `src/views/LoginView.vue`
- `src/views/RegisterView.vue`

And add routes for authentication in `src/router/index.js`.

## 6. App Initialization

Update `src/main.js` to initialize authentication:

```javascript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useUserStore } from './stores/userStore'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Initialize authentication state
const userStore = useUserStore()
userStore.initializeAuth()

app.mount('#app')
```

## 7. Testing the Integration

1. Start backend: `cd backend && npm run dev`
2. Start frontend: `npm run dev`
3. Test user registration/login
4. Test tree creation with image upload
5. Verify trees appear on map

## 8. Error Handling

Implement proper error handling throughout:
- Network errors
- Authentication errors
- Validation errors
- File upload errors

Consider adding:
- Toast notifications for errors
- Loading spinners
- Retry mechanisms
- Offline state detection
