import { Link, NavLink, useNavigate } from 'react-router-dom'
import { LogOut, ShieldCheck } from 'lucide-react'
import { Logo } from './Logo'
import { useAuthStore } from '@/store/authStore'
import { authApi } from '@/api/auth'
import toast from 'react-hot-toast'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `relative py-1 text-sm font-medium transition-colors ${
    isActive ? 'text-(--color-foam)' : 'text-(--color-mist) hover:text-(--color-foam)'
  }`

export function Navbar() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const isAdmin = useAuthStore((s) => s.isAdmin)
  const clearSession = useAuthStore((s) => s.clearSession)
  const navigate = useNavigate()

  async function handleLogout() {
    try {
      await authApi.logout()
    } catch {
      // logout is best-effort client-side regardless of server outcome
    } finally {
      clearSession()
      toast.success('Signed out')
      navigate('/login')
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-(--color-line) bg-(--color-abyss)/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
        <Link to={isAuthenticated ? '/dashboard' : '/'}>
          <Logo />
        </Link>

        <nav className="hidden items-center gap-7 sm:flex">
          {isAuthenticated && (
            <NavLink to="/dashboard" className={navLinkClass}>
              {({ isActive }) => (
                <span>
                  Dashboard
                  {isActive && <span className="current-underline absolute -bottom-2 left-0 right-0" />}
                </span>
              )}
            </NavLink>
          )}
          {isAdmin && (
            <NavLink to="/admin" className={navLinkClass}>
              {({ isActive }) => (
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck size={14} /> Admin
                  {isActive && <span className="current-underline absolute -bottom-2 left-0 right-0" />}
                </span>
              )}
            </NavLink>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <button onClick={handleLogout} className="btn-ghost inline-flex items-center gap-1.5 text-sm">
              <LogOut size={15} /> Sign out
            </button>
          ) : (
            <>
              <Link to="/login" className="btn-ghost text-sm">
                Sign in
              </Link>
              <Link to="/signup" className="btn-primary text-sm">
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
