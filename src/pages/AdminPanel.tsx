import { useCallback, useEffect, useState } from 'react'
import { ShieldAlert, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { EmptyState } from '@/components/EmptyState'
import { Pagination } from '@/components/Pagination'
import { FullPageSpinner } from '@/components/Spinner'
import { adminApi } from '@/api/admin'
import { extractErrorMessage } from '@/api/client'
import { formatDate, shortLinkUrl, truncateMiddle } from '@/lib/format'
import type { AdminUrlResponse, Page } from '@/types/api'

const PAGE_SIZE = 50

export default function AdminPanel() {
  const [data, setData] = useState<Page<AdminUrlResponse> | null>(null)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<number | null>(null)

  const load = useCallback(async (p: number) => {
    setLoading(true)
    try {
      const result = await adminApi.listAll(p, PAGE_SIZE)
      setData(result)
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Could not load the system-wide link list.'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load(page)
  }, [page, load])

  async function handleTakedown(urlId: number) {
    if (!confirm('Force-takedown this link for every owner? This cannot be undone.')) return
    setBusyId(urlId)
    try {
      await adminApi.takedown(urlId)
      toast.success('Link taken down')
      setData((prev) => (prev ? { ...prev, content: prev.content.filter((u) => u.id !== urlId) } : prev))
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Could not take down this link.'))
    } finally {
      setBusyId(null)
    }
  }

  if (loading && !data) return <FullPageSpinner />

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <div className="mb-8 flex items-center gap-2.5">
        <ShieldAlert size={22} className="text-(--color-coral)" />
        <div>
          <h1 className="font-display text-2xl font-semibold">Admin</h1>
          <p className="text-sm text-(--color-mist)">Every short link in the system, across every owner.</p>
        </div>
      </div>

      {data && data.content.length > 0 ? (
        <div className="card overflow-x-auto p-2">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-(--color-line) text-xs uppercase tracking-wide text-(--color-mist)">
                <th className="px-4 py-3 font-medium">Short code</th>
                <th className="px-4 py-3 font-medium">Destination</th>
                <th className="px-4 py-3 font-medium">Owner</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Created</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {data.content.map((u) => (
                <tr key={u.id} className="border-b border-(--color-line) last:border-0">
                  <td className="px-4 py-3">
                    <a
                      href={shortLinkUrl(u.shortCode)}
                      target="_blank"
                      rel="noreferrer"
                      className="code-chip"
                    >
                      <span className="code-chip__dot" />
                      {u.shortCode}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-(--color-mist)">{truncateMiddle(u.longUrl, 40)}</td>
                  <td className="px-4 py-3 font-mono text-xs text-(--color-mist)">
                    {u.ownerId ? truncateMiddle(u.ownerId, 14) : 'Anonymous'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge ${u.isDeleted ? 'badge-expired' : u.isActive ? 'badge-active' : 'badge-inactive'}`}>
                      {u.isDeleted ? 'Deleted' : u.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-(--color-mist)">{formatDate(u.createdAt)}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleTakedown(u.id)}
                      disabled={u.isDeleted || busyId === u.id}
                      className="btn-danger inline-flex items-center gap-1.5 px-3 py-1.5 text-xs disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Trash2 size={13} /> Take down
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-2">
            <Pagination page={data.number} totalPages={data.totalPages} onChange={setPage} />
          </div>
        </div>
      ) : (
        <EmptyState icon={ShieldAlert} title="No links in the system" description="Once users start shortening links, they'll show up here." />
      )}
    </div>
  )
}
