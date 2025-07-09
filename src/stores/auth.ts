import { defineStore } from 'pinia'
import { jwtDecode } from 'jwt-decode'
import router from '@/router'
import type { JwtPayload } from 'jwt-decode'
import { auth, refresh, me, logout } from '@/utils/api/auth'
import { handleError } from '@/utils/error'
import type { User, Auth, HttpResponse } from '@/types/types.ts'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    accessToken: null as string | null,
    tokenExpiry: 0 as number,
  }),
  getters: {
    isLoggedIn: (state) => !!state.accessToken,
  },
  actions: {
    getExpiry(token: string) {
      try {
        const { exp } = jwtDecode<JwtPayload>(token)
        this.tokenExpiry = exp ?? -1 * 1000
        if (this.tokenExpiry < 0) throw new Error('Invalid token expiry')
      } catch (err) {
        this.logout()
        if (err instanceof Error) handleError(err, null, null)
      }
    },
    async login(data: Auth) {
      try {
        const response = await auth(data)
        this.accessToken = response.data
      } catch (err) {
        this.logout()
        if (err instanceof Error) handleError(err, null, null)
      }
    },
    async refresh() {
      try {
        const response = (await refresh()) as HttpResponse<string>
        this.accessToken = response.data
        this.getExpiry(response.data)
        if (!this.user) {
          const response = (await me()) as HttpResponse<User>

          this.user = response.data
        }
      } catch (err) {
        this.logout()
        if (err instanceof Error) handleError(err, null, null)
      }
    },
    async ensureToken() {
      try {
        // check a minute before actual expiry time
        if (!this.accessToken || this.tokenExpiry - Date.now() < 60_000) await this.refresh()
      } catch (err) {
        this.logout()
        if (err instanceof Error) handleError(err, null, null)
      }
    },
    async logout() {
      try {
        await logout()
        this.clear()
        router.push({ name: 'LoginView' })
      } catch (err) {
        if (err instanceof Error) handleError(err, null, null)
      }
    },
    clear() {
      this.user = null
      this.accessToken = null
      this.tokenExpiry = 0
    },
  },
  persist: {
    afterHydrate: async () => {
      const store = useAuthStore()
      await store.ensureToken()
    },
  },
})
