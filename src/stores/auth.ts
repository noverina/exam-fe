import { defineStore } from 'pinia'
import { jwtDecode } from 'jwt-decode'
import router from '@/router'
import type { JwtPayload } from 'jwt-decode'
import { auth, refresh as refreshToken, fetchUser, logout } from '@/utils/api/auth'
import { handleError } from '@/utils/error'
import type { User, Auth, HttpResponse } from '@/types/types.ts'

let hydrated = false

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
    async getExpiry(token: string) {
      try {
        const { exp } = jwtDecode<JwtPayload>(token)
        this.tokenExpiry = exp ?? -1 * 1000
        if (this.tokenExpiry < 0) throw new Error('Invalid token expiry')
      } catch (err) {
        this.logout()
        if (err instanceof Error) handleError(err)
      }
    },
    async login(data: Auth, fetchFn: typeof window.fetch = window.fetch) {
      try {
        const response = await auth(data, fetchFn)
        this.accessToken = response.data
        await this.getExpiry(response.data)
        await this.me(fetchFn)
      } catch (err) {
        this.logout()
        if (err instanceof Error) handleError(err)
      }
    },
    async refresh(fetchFn: typeof window.fetch = window.fetch) {
      try {
        const response = (await refreshToken(fetchFn)) as HttpResponse<string>
        this.accessToken = response.data
        await this.getExpiry(response.data)
        if (!this.user) {
          await this.me(fetchFn)
        }
      } catch (err) {
        this.logout()
        if (err instanceof Error) handleError(err)
      }
    },
    async me(fetchFn: typeof window.fetch = window.fetch) {
      try {
        const response = (await fetchUser(fetchFn)) as HttpResponse<User>
        this.user = response.data
        await this.getExpiry(this.accessToken!)
      } catch (err) {
        this.logout()
        if (err instanceof Error) handleError(err)
      }
    },
    async ensureToken(fetchFn: typeof window.fetch = window.fetch) {
      try {
        if (!this.accessToken || this.tokenExpiry - Math.floor(Date.now() / 1000) < 60)
          await this.refresh(fetchFn)
      } catch (err) {
        this.logout()
        if (err instanceof Error) handleError(err)
      }
    },
    async logout(fetchFn: typeof window.fetch = window.fetch) {
      try {
        await logout(fetchFn)
        this.clear()
        router.push({ name: 'LoginView' })
      } catch (err) {
        if (err instanceof Error) handleError(err)
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
      if (hydrated) return
      hydrated = true
      const store = useAuthStore()
      await store.ensureToken()
    },
  },
})
