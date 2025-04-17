import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ExamView from '../views/ExamView.vue'
import UpsertView from '@/views/UpsertView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/exam/:id',
      name: 'ExamView',
      component: ExamView,
    },
    {
      path: '/upsert',
      name: 'UpsertView',
      component: UpsertView,
    },
  ],
})

export default router
