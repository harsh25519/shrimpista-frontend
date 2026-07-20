import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LogIn, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { AuthLayout } from '@/components/AuthLayout'
import { OAuthButtons } from '@/components/OAuthButtons'
import { authApi } from '@/api/auth'
import { extractErrorMessage } from '@/api/client'
import { useAuthStore } from '@/store/authStore'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const setSession = useAuthStore((s) => s.setSession)
  const navigate = useNavigate()
  const location = useLocation()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const auth = await authApi.login(email, password)
      setSession(auth)
      toast.success('Welcome back')
      const from = (location.state as { from?: Location })?.from?.pathname ?? '/dashboard'
      navigate(from, { replace: true })
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Could not sign you in. Check your email and password.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Sign in" subtitle="Welcome back to Shrimpista.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Email</label>
          <input
            required
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label className="label">Password</label>
            <Link to="/forgot-password" className="text-xs text-(--color-bio) hover:underline">
              Forgot password?
            </Link>
          </div>
          <input
            required
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            placeholder="••••••••"
          />
        </div>
        <button type="submit" disabled={loading} className="btn-primary flex w-full items-center justify-center gap-2">
          {loading ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} />}
          Sign in
        </button>
      </form>

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-(--color-line)" />
        <span className="text-xs text-(--color-mist)">or continue with</span>
        <div className="h-px flex-1 bg-(--color-line)" />
      </div>

      <OAuthButtons />

      <p className="mt-6 text-center text-sm text-(--color-mist)">
        Don't have an account?{' '}
        <Link to="/signup" className="text-(--color-bio) hover:underline">
          Sign up
        </Link>
      </p>
    </AuthLayout>
  )
}
