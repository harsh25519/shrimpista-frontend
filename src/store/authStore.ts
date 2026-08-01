import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthResponse } from '@/types/api'

interface DecodedToken {
  sub?: string
  userId?: string
  roles?: string[]
  authorities?: string[]
  exp?: number
}

function decodeJwt(token: string): DecodedToken | null {
  try {
    const payload = token.split('.')[1]
    if (!payload) return null
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=')
    const json = decodeURIComponent(
      atob(padded)
        .split('')
        .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('')
    )
    return JSON.parse(json)
  } catch {
    return null
  }
}

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  userId: string | null
  roles: string[]
  isAuthenticated: boolean
  isAdmin: boolean
  setSession: (auth: AuthResponse) => void
  markAuthenticated: () => void
  clearSession: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      userId: null,
      roles: [],
      isAuthenticated: false,
      isAdmin: false,
      setSession: (auth) => {
        const decoded = decodeJwt(auth.accessToken)
        const roles = decoded?.roles ?? decoded?.authorities ?? []
        set({
          accessToken: auth.accessToken,
          refreshToken: auth.refreshToken,
          userId: decoded?.userId ?? decoded?.sub ?? null,
          roles,
          isAuthenticated: true,
          isAdmin: roles.some((r) => r === 'ADMIN' || r === 'ROLE_ADMIN'),
        })
      },
      markAuthenticated: () =>
        set({
          accessToken: null,
          refreshToken: null,
          userId: null,
          roles: [],
          isAuthenticated: true,
          isAdmin: false,
        }),
      clearSession: () =>
        set({
          accessToken: null,
          refreshToken: null,
          userId: null,
          roles: [],
          isAuthenticated: false,
          isAdmin: false,
        }),
    }),
    {
      name: 'shrimpista-auth',
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        userId: state.userId,
        roles: state.roles,
        isAuthenticated: state.isAuthenticated,
        isAdmin: state.isAdmin,
      }),
    }
  )
)
