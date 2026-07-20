import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { Navbar } from '@/components/Navbar'
import { ProtectedRoute, AdminRoute } from '@/components/RouteGuards'
import Landing from '@/pages/Landing'
import Login from '@/pages/Login'
import Signup from '@/pages/Signup'
import ForgotPassword from '@/pages/ForgotPassword'
import Dashboard from '@/pages/Dashboard'
import LinkDetail from '@/pages/LinkDetail'
import AdminPanel from '@/pages/AdminPanel'
import NotFound from '@/pages/NotFound'
import { useAuthStore } from '@/store/authStore'
import { FullPageSpinner } from '@/components/Spinner'

export default function App() {
  const [isInitializing, setIsInitializing] = useState(true)
  const setSession = useAuthStore((s) => s.setSession)

  // 1. Intercept the app load and check for backend cookies
  useEffect(() => {
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`
      const parts = value.split(`; ${name}=`)
      if (parts.length === 2) return parts.pop()?.split(';').shift()
      return null
    }

    const token = getCookie('accessToken')
    
    if (token) {
      // 2. We found a token! Save it to global state so <ProtectedRoute> allows us in
      setSession({ accessToken: token } as any) 
      
      // 3. Delete the cookie for security
      document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    }
    
    // 4. Initialization complete, allow the router to render
    setIsInitializing(false)
  }, [setSession])

  // 5. Show a spinner while checking cookies
  if (isInitializing) {
    return <FullPageSpinner />
  }

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0f2635',
            color: '#eaf6f3',
            border: '1px solid #eaf6f314',
            fontSize: '0.875rem',
          },
          success: { iconTheme: { primary: '#4ff0c7', secondary: '#0f2635' } },
          error: { iconTheme: { primary: '#ff5470', secondary: '#0f2635' } },
        }}
      />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Note: You can safely delete the OAuthCallback component and file now, 
              as the backend is handling the OAuth exchange directly! */}
              
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/links/:shortCode"
            element={
              <ProtectedRoute>
                <LinkDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}