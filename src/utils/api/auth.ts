import { useAuthStore } from '@/stores/auth'
import type { HttpResponse, Auth, User } from '@/types/types'
import { pinia } from '@/pinia'

const fetchTimeout = +import.meta.env.VITE_FETCH_TIMEOUT
const baseUrl = import.meta.env.VITE_BASE_URL

export async function auth(
  data: Auth,
  fetchFn: typeof window.fetch = window.fetch,
): Promise<HttpResponse<string>> {
  const response = await fetchFn(`${baseUrl}/auth`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    credentials: 'include',
    signal: AbortSignal.timeout(fetchTimeout),
  })
  if (response.status == 400) throw new Error('Bad Request')
  if (response.status == 500) throw new Error('Internal Server Error')
  if (!response.ok) throw new Error(`Unspecified HTTP error`)
  return await response.json()
}

export async function refresh(
  fetchFn: typeof window.fetch = window.fetch,
): Promise<HttpResponse<string>> {
  const response = await fetchFn(`${baseUrl}/auth/refresh`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    signal: AbortSignal.timeout(fetchTimeout),
  })
  if (response.status == 400) throw new Error('Bad Request')
  if (response.status == 500) throw new Error('Internal Server Error')
  if (!response.ok) throw new Error(`Unspecified HTTP error`)
  return await response.json()
}

export async function fetchUser(
  fetchFn: typeof window.fetch = window.fetch,
): Promise<HttpResponse<User>> {
  const authStore = useAuthStore(pinia)
  const response = await fetchFn(`${baseUrl}/auth/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authStore.accessToken}`,
    },
    credentials: 'include',
    signal: AbortSignal.timeout(fetchTimeout),
  })
  if (response.status == 400) throw new Error('Bad Request')
  if (response.status == 500) throw new Error('Internal Server Error')
  if (!response.ok) throw new Error(`Unspecified HTTP error`)
  return await response.json()
}

export async function logout(fetchFn: typeof window.fetch = window.fetch): Promise<void> {
  const authStore = useAuthStore(pinia)
  const response = await fetchFn(`${baseUrl}/auth/invalidate`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authStore.accessToken}`,
    },
    credentials: 'include',
    signal: AbortSignal.timeout(fetchTimeout),
  })
  if (response.status == 400) throw new Error('Bad Request')
  if (response.status == 500) throw new Error('Internal Server Error')
  if (!response.ok) throw new Error(`Unspecified HTTP error`)
}
