import './assets/main.css'

import { createApp } from 'vue'
import { pinia } from './pinia'
import App from './App.vue'
import router from './router'
import { fetchWithAuth } from './utils/api/wrapper'

const app = createApp(App)

// intercept and redirect
const baseUrl = import.meta.env.VITE_BASE_URL
const whitelist = [`${baseUrl}/auth`]
const originalFetch = window.fetch.bind(window)
window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  const url = input instanceof URL ? input.toString() : (input as string)

  // Use auth-fetch wrapper for non-whitelisted URLs
  const response = whitelist.some((prefix) => url.startsWith(prefix))
    ? await originalFetch(input, init)
    : await fetchWithAuth(input, init, originalFetch)

  if (response.status === 401) router.push({ name: 'LoginView' })
  if (response.status === 403) router.push({ name: 'UnauthorizedView' })

  return response
}

app.use(router)
app.use(pinia)

app.mount('#app')
