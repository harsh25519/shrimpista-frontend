import { API_BASE_URL, apiClient } from './client'
import type { AuthResponse, OAuthProvider } from '@/types/api'

export const oauthApi = {
  /** Full URL to kick off the browser redirect to /oauth/{provider}/start */
  startUrl: (provider: OAuthProvider) => `${API_BASE_URL}/oauth/${provider.toUpperCase()}/start`,

  /** Exchanges the burn-after-read bridge code for a real token pair. */
  exchangeCallback: (code: string) =>
    apiClient.get<AuthResponse>('/oauth/callback', { params: { code } }).then((r) => r.data),
}
