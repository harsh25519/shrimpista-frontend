import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/store/authStore'
import type { AuthResponse, ErrorResponse } from '@/types/api'

declare global {
  interface Window {
    __APP_CONFIG__?: { API_BASE_URL?: string; APP_ORIGIN?: string }
  }
}

/**
 * Resolves the backend base URL. Runtime config (window.__APP_CONFIG__, injected by
 * docker-entrypoint.sh from container env vars) takes precedence over the build-time
 * VITE_API_BASE_URL, so a single built image can be pointed at different backends
 * per environment without rebuilding.
 */
export const API_BASE_URL =
  (typeof window !== 'undefined' && window.__APP_CONFIG__?.API_BASE_URL) || import.meta.env.VITE_API_BASE_URL

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

apiClient.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState()
  // Axios headers is a plain object. Don't use `.set` which exists on Fetch Headers.
  config.headers = config.headers || {}
  if (accessToken) {
    ;(config.headers as Record<string, string>)['Authorization'] = `Bearer ${accessToken}`
  }
  return config
})

// A dedicated, interceptor-free client for the refresh call itself,
// so a failed refresh never re-triggers the refresh flow.
const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

let refreshPromise: Promise<string | null> | null = null

async function refreshAccessToken(): Promise<string | null> {
  const { setSession, clearSession } = useAuthStore.getState()

  if (!refreshPromise) {
    // Try a cookie-based refresh first: backend can read the HttpOnly refresh cookie.
    refreshPromise = refreshClient
      .post<AuthResponse>('/auth/refresh')
      .then((res) => {
        setSession(res.data)
        return res.data.accessToken
      })
      .catch(() => {
        clearSession()
        return null
      })
      .finally(() => {
        refreshPromise = null
      })
  }
  return refreshPromise
}

interface RetryableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ErrorResponse>) => {
    const original = error.config as RetryableConfig | undefined

    if (error.response?.status === 401 && original && !original._retry && original.url !== '/auth/refresh') {
      original._retry = true
      const newToken = await refreshAccessToken()
      if (newToken) {
        original.headers.set('Authorization', `Bearer ${newToken}`)
        return apiClient(original)
      }
    }

    return Promise.reject(error)
  }
)

/** Extracts a human-readable message from the standard ErrorResponse shape, falling back gracefully. */
export function extractErrorMessage(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ErrorResponse | undefined
    if (data?.message) return data.message
    if (error.code === 'ERR_NETWORK') return 'Could not reach the server. Check your connection and try again.'
  }
  return fallback
}
