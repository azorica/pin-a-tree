import { createRouter, createWebHistory } from 'vue-router'

// Lazy load views for better performance
const HomeView = () => import('@/views/HomeView.vue')
const TreeFormView = () => import('@/views/TreeFormView.vue')
const MapView = () => import('@/views/MapView.vue')

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
    path: '/add-tree',
    name: 'AddTree',
    component: TreeFormView,
    meta: {
      title: 'Add a Tree - Pin-a-Tree'
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

// Update document title based on route meta
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

export default router
