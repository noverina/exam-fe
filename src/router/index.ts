import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ExamView from '../views/ExamView.vue'
import UpsertView from '@/views/UpsertView.vue'
import TestView from '@/views/TestView.vue'
import LoginView from '@/views/LoginView.vue'
import GradeView from '@/views/GradeView.vue'

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
      path: '/upsert/:courseTeacherId',
      name: 'UpsertView',
      component: UpsertView,
    },
    {
      path: '/test',
      name: 'TestView',
      component: TestView,
    },
    {
      path: '/auth',
      name: 'LoginView',
      component: LoginView,
    },
    {
      path: '/grade',
      name: 'GradeView',
      component: GradeView,
    },
  ],
})

export default router
