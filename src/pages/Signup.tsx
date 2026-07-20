import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserPlus, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { AuthLayout } from '@/components/AuthLayout'
import { OAuthButtons } from '@/components/OAuthButtons'
import { authApi } from '@/api/auth'
import { extractErrorMessage } from '@/api/client'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      await authApi.signup(email, password)
      toast.success('Account created — check your email to verify it.')
      navigate('/login')
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Could not create your account.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Create your account" subtitle="Start shortening and tracking links in seconds.">
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
          <label className="label">Password</label>
          <input
            required
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            placeholder="••••••••"
            minLength={8}
          />
        </div>
        <div>
          <label className="label">Confirm password</label>
          <input
            required
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input"
            placeholder="••••••••"
            minLength={8}
          />
        </div>
        <button type="submit" disabled={loading} className="btn-primary flex w-full items-center justify-center gap-2">
          {loading ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
          Create account
        </button>
      </form>

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-(--color-line)" />
        <span className="text-xs text-(--color-mist)">or continue with</span>
        <div className="h-px flex-1 bg-(--color-line)" />
      </div>

      <OAuthButtons />

      <p className="mt-6 text-center text-sm text-(--color-mist)">
        Already have an account?{' '}
        <Link to="/login" className="text-(--color-bio) hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  )
}
