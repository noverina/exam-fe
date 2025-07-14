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
export const originalFetch = window.fetch.bind(window)
window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  const url = input instanceof URL ? input.toString() : (input as string)
  if (whitelist.some((prefix) => url.startsWith(prefix))) {
    return originalFetch(input, init)
  }
  return fetchWithAuth(input, init, originalFetch)
}

app.use(router)
app.use(pinia)

app.mount('#app')
