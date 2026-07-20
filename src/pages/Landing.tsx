import { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Copy, Check, Zap, LineChart, ShieldCheck } from 'lucide-react'
import { CreateLinkForm } from '@/components/CreateLinkForm'
import type { UrlResponse } from '@/types/api'
import { shortLinkUrl, copyToClipboard } from '@/lib/format'
import toast from 'react-hot-toast'

const features = [
  {
    icon: Zap,
    title: 'Instant redirects',
    description: 'Redis-cached routing keeps redirects fast even under heavy traffic, with Postgres as the source of truth.',
  },
  {
    icon: LineChart,
    title: 'Real click analytics',
    description: 'Total clicks and unique visitors, kept fresh between hourly rollups with a live HyperLogLog read.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure by delegation',
    description: 'Identity is handled by mtAuth — Shrimpista never stores credentials, only validates JWTs locally.',
  },
]

export default function Landing() {
  const [created, setCreated] = useState<UrlResponse | null>(null)
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    if (!created) return
    const ok = await copyToClipboard(shortLinkUrl(created.shortCode))
    if (ok) {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } else {
      toast.error('Could not copy to clipboard')
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <section className="mx-auto max-w-2xl text-center">
        <span className="code-chip mx-auto mb-6 w-fit">
          <span className="code-chip__dot" /> b7F3q
        </span>
        <h1 className="font-display text-4xl font-semibold leading-tight sm:text-5xl">
          Long links, <span className="text-(--color-coral)">shortened</span>.
          <br />
          Every click, <span className="text-(--color-bio)">tracked</span>.
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-(--color-mist)">
          Shrimpista turns unwieldy URLs into short, shareable ones — no account required to start,
          sign up to unlock dashboards, click history, and analytics.
        </p>
      </section>

      <section className="mx-auto mt-10 max-w-2xl">
        <CreateLinkForm onCreated={setCreated} />
        {created && (
          <div className="card mt-4 flex flex-col items-center gap-3 p-5 text-center sm:flex-row sm:justify-between sm:text-left">
            <div>
              <p className="text-xs uppercase tracking-wide text-(--color-mist)">Your short link</p>
              <p className="font-mono text-(--color-bio)">{shortLinkUrl(created.shortCode)}</p>
            </div>
            <button onClick={handleCopy} className="btn-secondary inline-flex items-center gap-1.5 text-sm">
              {copied ? <Check size={15} className="text-(--color-bio)" /> : <Copy size={15} />}
              {copied ? 'Copied' : 'Copy link'}
            </button>
          </div>
        )}
        <p className="mt-3 text-center text-xs text-(--color-mist)">
          Shortening anonymously? {' '}
          <RouterLink to="/signup" className="text-(--color-bio) hover:underline">
            Create an account
          </RouterLink>{' '}
          to manage this link later.
        </p>
      </section>

      <section className="mx-auto mt-24 grid max-w-4xl gap-6 sm:grid-cols-3">
        {features.map(({ icon: Icon, title, description }) => (
          <div key={title} className="card p-5">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-(--color-bio-dim)">
              <Icon size={17} className="text-(--color-bio)" />
            </div>
            <h3 className="font-display font-semibold">{title}</h3>
            <p className="mt-1.5 text-sm text-(--color-mist)">{description}</p>
          </div>
        ))}
      </section>
    </div>
  )
}
