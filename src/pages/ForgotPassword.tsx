import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Mail, Loader2, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { AuthLayout } from '@/components/AuthLayout'
import { authApi } from '@/api/auth'
import { extractErrorMessage } from '@/api/client'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await authApi.forgotPassword(email)
      setSent(true)
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Could not start the password reset.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Reset your password" subtitle="We'll email you a link to choose a new one.">
      {sent ? (
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <CheckCircle2 size={28} className="text-(--color-bio)" />
          <p className="text-sm text-(--color-foam)">
            If an account exists for <span className="font-medium">{email}</span>, a reset link is on its way.
          </p>
          <Link to="/login" className="btn-secondary mt-2 text-sm">
            Back to sign in
          </Link>
        </div>
      ) : (
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
          <button type="submit" disabled={loading} className="btn-primary flex w-full items-center justify-center gap-2">
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} />}
            Send reset link
          </button>
          <p className="text-center text-sm text-(--color-mist)">
            Remembered it?{' '}
            <Link to="/login" className="text-(--color-bio) hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      )}
    </AuthLayout>
  )
}
