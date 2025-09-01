import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

// Lazy load views for better performance
const HomeView = () => import('@/views/HomeView.vue')
const TreeFormView = () => import('@/views/TreeFormView.vue')
const MapView = () => import('@/views/MapView.vue')
const LoginView = () => import('@/views/LoginView.vue')
const RegisterView = () => import('@/views/RegisterView.vue')

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: {
      title: 'Pin-a-Tree - Digital Forest Community'
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: {
      title: 'Sign In - Pin-a-Tree',
      requiresGuest: true // Only accessible when not logged in
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView,
    meta: {
      title: 'Sign Up - Pin-a-Tree',
      requiresGuest: true // Only accessible when not logged in
    }
  },
  {
    path: '/add-tree',
    name: 'AddTree',
    component: TreeFormView,
    meta: {
      title: 'Add a Tree - Pin-a-Tree',
      requiresAuth: true // Requires authentication
    }
  },
  {
    path: '/map',
    name: 'Map',
    component: MapView,
    meta: {
      title: 'Tree Map - Pin-a-Tree'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Update document title and handle authentication guards
router.beforeEach(async (to, from, next) => {
  // Update document title
  if (to.meta.title) {
    document.title = to.meta.title
  }

  // Get user store
  const userStore = useUserStore()
  
  // Check authentication status on first navigation
  if (!userStore.isAuthenticated && !userStore.currentUser) {
    await userStore.restoreAuthState()
  }

  // Handle authentication guards
  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    // Redirect to login if authentication required
    next({ name: 'Login', query: { redirect: to.fullPath } })
    return
  }

  if (to.meta.requiresGuest && userStore.isAuthenticated) {
    // Redirect to home if already logged in
    next({ name: 'Home' })
    return
  }

  next()
})

export default router
