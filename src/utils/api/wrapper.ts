import { useAuthStore } from '@/stores/auth'

const baseUrl = import.meta.env.VITE_BASE_URL
const fetchTimeout = +import.meta.env.VITE_FETCH_TIMEOUT

export async function fetchWithAuth(
  input: RequestInfo | URL,
  init: RequestInit = {},
  originalFetch: typeof window.fetch,
): Promise<Response> {
  const store = useAuthStore()
  await store.ensureToken()

  let response = await originalFetch(`${baseUrl}/${input}`, {
    ...init,
    headers: {
      ...(init.headers ?? {}),
      ...(store.accessToken ? { Authorization: `Bearer ${store.accessToken}` } : {}),
      ...{ 'Content-Type': 'application/json' },
    },
    signal: AbortSignal.timeout(fetchTimeout),
  })

  if (response.status === 401) {
    await store.refresh()
    response = await originalFetch(`${baseUrl}/${input}`, {
      ...init,
      headers: {
        ...(init.headers ?? {}),
        Authorization: `Bearer ${store.accessToken}`,
      },
      signal: AbortSignal.timeout(fetchTimeout),
    })
  }

  if (response.status == 400) throw new Error('Bad Request')
  if (response.status == 500) throw new Error('Internal Server Error')
  if (!response.ok) throw new Error(`Unspecified HTTP error`)

  return response
}
