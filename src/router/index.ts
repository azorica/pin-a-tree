import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

// =============================================================================
// ROUTE DEFINITIONS
// =============================================================================

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue'),
    meta: {
      title: 'Pin-a-Tree - Digital Forest Community',
      description: 'Join our community of tree enthusiasts and help build a digital forest',
    },
  },
  {
    path: '/map',
    name: 'Map',
    component: () => import('@/views/MapView.vue'),
    meta: {
      title: 'Tree Map - Pin-a-Tree',
      description: 'Explore trees planted by our community around the world',
    },
  },
  {
    path: '/add-tree',
    name: 'AddTree',
    component: () => import('@/views/AddTreeView.vue'),
    meta: {
      title: 'Add a Tree - Pin-a-Tree',
      description: 'Share your tree planting story with the community',
      requiresAuth: true,
    },
  },
  {
    path: '/tree/:id',
    name: 'TreeDetail',
    component: () => import('@/views/TreeDetailView.vue'),
    props: true,
    meta: {
      title: 'Tree Details - Pin-a-Tree',
      description: 'View detailed information about this tree',
    },
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/ProfileView.vue'),
    meta: {
      title: 'My Profile - Pin-a-Tree',
      description: 'View and edit your profile information',
      requiresAuth: true,
    },
  },
  {
    path: '/profile/:userId',
    name: 'UserProfile',
    component: () => import('@/views/UserProfileView.vue'),
    props: true,
    meta: {
      title: 'User Profile - Pin-a-Tree',
      description: 'View user profile and their tree contributions',
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: {
      title: 'Login - Pin-a-Tree',
      description: 'Sign in to your Pin-a-Tree account',
      guestOnly: true,
    },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/RegisterView.vue'),
    meta: {
      title: 'Sign Up - Pin-a-Tree',
      description: 'Join the Pin-a-Tree community',
      guestOnly: true,
    },
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/AboutView.vue'),
    meta: {
      title: 'About Pin-a-Tree',
      description: 'Learn more about our mission to build a digital forest',
    },
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('@/views/SearchView.vue'),
    meta: {
      title: 'Search Trees - Pin-a-Tree',
      description: 'Search for trees and users in our community',
    },
  },
  // Catch-all route for 404 errors
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue'),
    meta: {
      title: 'Page Not Found - Pin-a-Tree',
      description: 'The page you are looking for does not exist',
    },
  },
]

// =============================================================================
// ROUTER CONFIGURATION
// =============================================================================

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Always scroll to top when navigating to a new route
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

// =============================================================================
// NAVIGATION GUARDS
// =============================================================================

// Global before guard for authentication and meta handling
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()

  // Initialize user store if not already done
  if (!userStore.isAuthenticated && !userStore.user) {
    await userStore.initialize()
  }

  // Check authentication requirements
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    // Redirect to login page with return URL
    next({
      name: 'Login',
      query: { redirect: to.fullPath },
    })
    return
  }

  // Check guest-only routes (login/register)
  if (to.meta.guestOnly && userStore.isLoggedIn) {
    // Redirect authenticated users away from login/register
    next({ name: 'Home' })
    return
  }

  next()
})

// Global after guard for setting page title and meta
router.afterEach((to) => {
  // Set page title
  if (to.meta.title) {
    document.title = to.meta.title
  }

  // Set meta description
  if (to.meta.description) {
    let metaDescription = document.querySelector('meta[name="description"]')
    if (!metaDescription) {
      metaDescription = document.createElement('meta')
      metaDescription.setAttribute('name', 'description')
      document.head.appendChild(metaDescription)
    }
    metaDescription.setAttribute('content', to.meta.description)
  }
})

export default router
