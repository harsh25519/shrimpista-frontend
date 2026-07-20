import { apiClient } from './client'
import type { AuthResponse, MessageResponse } from '@/types/api'

export const authApi = {
  signup: (email: string, password: string) =>
    apiClient.post<MessageResponse>('/auth/signup', { email, password }).then((r) => r.data),

  login: (email: string, password: string) =>
    apiClient.post<AuthResponse>('/auth/login', { email, password }).then((r) => r.data),

  refresh: (refreshToken: string) =>
    apiClient.post<AuthResponse>('/auth/refresh', { refreshToken }).then((r) => r.data),

  logout: () => apiClient.post<void>('/auth/logout').then((r) => r.data),

  resendVerification: (email: string) =>
    apiClient.post<MessageResponse>('/auth/resend-verification', { email }).then((r) => r.data),

  forgotPassword: (email: string) =>
    apiClient.post<MessageResponse>('/auth/forgot-password', { email }).then((r) => r.data),
}
