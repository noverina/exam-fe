import { createPinia } from 'pinia'
import { useAuthStore } from './stores/auth'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

export const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

export function login() {
  const auth = useAuthStore()
  return auth.ensureToken()
}
