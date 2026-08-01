import { } from 'react'
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
import { AuthProvider } from '@/context/AuthContext'

export default function App() {
  return (
    <AuthProvider>
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
    </AuthProvider>
  )
}