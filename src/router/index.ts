import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ExamView from '../views/ExamView.vue'
import UpsertView from '@/views/UpsertView.vue'
import LoginView from '@/views/LoginView.vue'
import GradeView from '@/views/GradeView.vue'
import UnauthorizedView from '@/views/UnauthorizedView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'HomeView',
      component: HomeView,
    },
    {
      path: '/exam/:id',
      name: 'ExamView',
      component: ExamView,
      meta: { requiresAuth: true },
    },
    {
      path: '/upsert/:courseTeacherId',
      name: 'UpsertView',
      component: UpsertView,
      meta: { requiresAuth: true, requiresPermission: 'TEACHER' },
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
      meta: { requiresAuth: true, requiresPermission: 'TEACHER' },
    },
    {
      path: '/unauthorized',
      name: 'UnauthorizedView',
      component: UnauthorizedView,
    },
    {
      path: '/:pathMatch(.*)*', // ← catch-all syntax
      name: 'not-found',
      component: NotFoundView,
    },
  ],
})

// 403 and 401 redirect
router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    return { name: 'LoginView' }
  }

  if (to.meta.requiresPermission) {
    const perm = to.meta.requiresPermission

    if (authStore.user?.role !== perm) {
      return { name: 'UnauthorizedView' }
    }
  }
})

export default router
