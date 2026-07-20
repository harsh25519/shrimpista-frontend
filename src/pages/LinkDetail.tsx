import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Copy, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import { StatsCards } from '@/components/StatsCards'
import { ClickTable } from '@/components/ClickTable'
import { Pagination } from '@/components/Pagination'
import { FullPageSpinner } from '@/components/Spinner'
import { analyticsApi } from '@/api/analytics'
import { extractErrorMessage } from '@/api/client'
import { shortLinkUrl, copyToClipboard } from '@/lib/format'
import type { ClickEventResponse, Page as ApiPage, StatsResponse } from '@/types/api'

const PAGE_SIZE = 10

export default function LinkDetail() {
  const { shortCode = '' } = useParams<{ shortCode: string }>()
  const [stats, setStats] = useState<StatsResponse | null>(null)
  const [clicks, setClicks] = useState<ApiPage<ClickEventResponse> | null>(null)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  const load = useCallback(
    async (p: number) => {
      setLoading(true)
      try {
        const [statsRes, clicksRes] = await Promise.all([
          analyticsApi.getStats(shortCode),
          analyticsApi.getClicks(shortCode, p, PAGE_SIZE),
        ])
        setStats(statsRes)
        setClicks(clicksRes)
      } catch (err) {
        toast.error(extractErrorMessage(err, 'Could not load stats for this link.'))
      } finally {
        setLoading(false)
      }
    },
    [shortCode]
  )

  useEffect(() => {
    load(page)
  }, [page, load])

  async function handleCopy() {
    const ok = await copyToClipboard(shortLinkUrl(shortCode))
    if (ok) {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }
  }

  if (loading && !stats) return <FullPageSpinner />

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <Link to="/dashboard" className="btn-ghost mb-6 inline-flex items-center gap-1.5 text-sm">
        <ArrowLeft size={15} /> Back to dashboard
      </Link>

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="code-chip">
            <span className="code-chip__dot" />
            {shortCode}
          </span>
          {stats && <p className="mt-2 max-w-md truncate text-sm text-(--color-mist)">{stats.url}</p>}
        </div>
        <button onClick={handleCopy} className="btn-secondary inline-flex items-center gap-1.5 text-sm">
          {copied ? <Check size={15} className="text-(--color-bio)" /> : <Copy size={15} />}
          {copied ? 'Copied' : 'Copy short link'}
        </button>
      </div>

      {stats && <StatsCards stats={stats} />}

      <div className="card mt-8 p-5">
        <h2 className="mb-4 font-display text-lg font-semibold">Recent clicks</h2>
        {clicks && (
          <>
            <ClickTable clicks={clicks.content} />
            <Pagination page={clicks.number} totalPages={clicks.totalPages} onChange={setPage} />
          </>
        )}
      </div>
    </div>
  )
}
