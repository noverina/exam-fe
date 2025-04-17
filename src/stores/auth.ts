// stores/auth.ts
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    role: localStorage.getItem('userRole') || (null as string | null),
    // ... other auth-related state like token, user info, etc.
  }),
  actions: {
    setRole(role: string) {
      this.role = role
      localStorage.setItem('userRole', role)
    },
    // ... other actions like login, logout, etc.
  },
})
