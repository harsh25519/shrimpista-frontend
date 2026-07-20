import { useCallback, useEffect, useState } from 'react'
import { Link2, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import { CreateLinkForm } from '@/components/CreateLinkForm'
import { LinkCard } from '@/components/LinkCard'
import { EmptyState } from '@/components/EmptyState'
import { Pagination } from '@/components/Pagination'
import { FullPageSpinner } from '@/components/Spinner'
import { urlsApi } from '@/api/urls'
import { extractErrorMessage } from '@/api/client'
import type { Page, UrlDashboardResponse } from '@/types/api'

const PAGE_SIZE = 10

export default function Dashboard() {
  const [data, setData] = useState<Page<UrlDashboardResponse> | null>(null)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async (p: number) => {
    setLoading(true)
    try {
      const result = await urlsApi.listMine(p, PAGE_SIZE)
      setData(result)
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Could not load your links.'))
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial load when the dashboard mounts
  useEffect(() => {
    load(page)
  }, [page, load])

  function handleCreated() {
    if (page === 0) {
      load(0)
    } else {
      setPage(0)
    }
  }

  function handleChanged(updated: UrlDashboardResponse) {
    setData((prev) =>
      prev ? { ...prev, content: prev.content.map((l) => (l.urlId === updated.urlId ? updated : l)) } : prev
    )
  }

  function handleDeleted(urlId: number) {
    setData((prev) => (prev ? { ...prev, content: prev.content.filter((l) => l.urlId !== urlId) } : prev))
  }

  // Handler for the new side button
  function handleRefresh() {
    setPage(0)
    load(0)
    toast.success('Link list refreshed')
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      
      {/* Header section with the new Refresh/Get Links button on the right */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold">Your links</h1>
          <p className="mt-1 text-sm text-[#8c9fab]">Create, manage, and track every link you've shortened.</p>
        </div>
        
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-teal-500/10 text-teal-400 hover:bg-teal-500/20 border border-teal-500/20 rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Loading...' : 'Refresh Links'}
        </button>
      </div>

      <div className="mb-8">
        <CreateLinkForm onCreated={handleCreated} />
      </div>

      {loading && !data ? (
        <FullPageSpinner />
      ) : data && data.content.length > 0 ? (
        <div className="space-y-3">
          {data.content.map((link) => (
            <LinkCard 
              key={link.urlId} 
              link={link} 
              onChanged={handleChanged} 
              onDeleted={handleDeleted} 
            />
          ))}
          <Pagination page={data.number} totalPages={data.totalPages} onChange={setPage} />
        </div>
      ) : (
        <EmptyState
          icon={Link2}
          title="No links yet"
          description="Shorten your first link above — it'll show up here with full analytics and management controls."
        />
      )}
    </div>
  )
}