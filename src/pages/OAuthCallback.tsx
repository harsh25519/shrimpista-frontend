import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { AlertTriangle } from 'lucide-react'
import { oauthApi } from '@/api/oauth'
import { extractErrorMessage } from '@/api/client'
import { useAuthStore } from '@/store/authStore'
import { FullPageSpinner } from '@/components/Spinner'
import toast from 'react-hot-toast'

/**
 * NOTE: API.md documents `GET /oauth/callback` on the Spring Boot backend as returning
 * `AuthResponse` JSON directly (not a redirect). For a browser-based SPA flow, this page
 * assumes mtAuth's provider redirect is configured to land the browser back on this
 * frontend route (`/oauth/callback?code=...`), which then calls the backend endpoint
 * to exchange the bridge code for tokens. If your mtAuth/provider configuration instead
 * redirects straight to the backend, update the redirect URI registered with mtAuth to
 * point here instead.
 */
export default function OAuthCallback() {
  const [searchParams] = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const setSession = useAuthStore((s) => s.setSession)
  const navigate = useNavigate()
  const exchanged = useRef(false)

  useEffect(() => {
    const code = searchParams.get('code')
    if (!code) {
      setError('No authorization code was returned by the provider.')
      return
    }
    if (exchanged.current) return
    exchanged.current = true

    oauthApi
      .exchangeCallback(code)
      .then((auth) => {
        setSession(auth)
        toast.success('Signed in')
        navigate('/dashboard', { replace: true })
      })
      .catch((err) => {
        setError(extractErrorMessage(err, 'Could not complete sign-in with that provider.'))
      })
  }, [searchParams, setSession, navigate])

  if (error) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-4 px-5 text-center">
        <AlertTriangle size={28} className="text-(--color-danger)" />
        <p className="text-sm text-(--color-foam)">{error}</p>
        <Link to="/login" className="btn-secondary text-sm">
          Back to sign in
        </Link>
      </div>
    )
  }

  return <FullPageSpinner />
}
