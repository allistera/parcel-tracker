import { createRouter, createWebHistory } from 'vue-router'
import ParcelTracker from '../views/ParcelTracker.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: ParcelTracker
  },
  {
    path: '/track/:id?',
    name: 'track',
    component: ParcelTracker,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
