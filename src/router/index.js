import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/LandingView.vue')
  },
  {
    path: '/map',
    name: 'map',
    component: () => import('@/views/HomeView.vue')
  },
  {
    path: '/upload',
    name: 'upload',
    component: () => import('@/views/UploadView.vue')
  },
  {
    path: '/tree/:id',
    name: 'tree-details',
    component: () => import('@/views/TreeDetailsView.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router; 