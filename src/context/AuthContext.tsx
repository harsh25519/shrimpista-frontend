import React, { createContext, useContext, useEffect, useState } from 'react'
import { urlsApi } from '@/api/urls'
import { useAuthStore } from '@/store/authStore'
import { FullPageSpinner } from '@/components/Spinner'

interface AuthContextValue {
  loading: boolean
  checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true)
  const markAuthenticated = useAuthStore((s) => s.markAuthenticated)

  const checkAuth = async () => {
    try {
      await urlsApi.listMine(0, 1)
      markAuthenticated()
    } catch (err) {
      // not authenticated or request failed
      // console.debug('Auth check failed', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) return <FullPageSpinner />

  return <AuthContext.Provider value={{ loading, checkAuth }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export default AuthContext
