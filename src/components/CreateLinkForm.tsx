import { useState, type FormEvent } from 'react'
import { Link2, Loader2 } from 'lucide-react'
import { urlsApi } from '@/api/urls'
import { extractErrorMessage } from '@/api/client'
import type { UrlResponse } from '@/types/api'
import toast from 'react-hot-toast'

interface CreateLinkFormProps {
  onCreated: (url: UrlResponse) => void
  compact?: boolean
}

export function CreateLinkForm({ onCreated, compact }: CreateLinkFormProps) {
  const [longUrl, setLongUrl] = useState('')
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!longUrl.trim()) return
    setLoading(true)
    try {
      const result = await urlsApi.create({ longUrl: longUrl.trim(), title: title.trim() || undefined })
      toast.success('Short link created')
      onCreated(result)
      setLongUrl('')
      setTitle('')
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Could not shorten that link.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={compact ? 'space-y-3' : 'card space-y-4 p-6'}>
      {!compact && (
        <div className="flex items-center gap-2">
          <Link2 size={18} className="text-(--color-bio)" />
          <h2 className="font-display text-lg font-semibold">Shorten a link</h2>
        </div>
      )}
      <div className={compact ? 'flex flex-col gap-3 sm:flex-row' : 'grid gap-3 sm:grid-cols-[2fr_1fr]'}>
        <div className="flex-1">
          {!compact && <label className="label">Destination URL</label>}
          <input
            required
            type="url"
            placeholder="https://example.com/some/very/long/path"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            className="input"
          />
        </div>
        <div className="flex-1">
          {!compact && <label className="label">Title (optional)</label>}
          <input
            type="text"
            placeholder="Title (optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input"
            maxLength={120}
          />
        </div>
      </div>
      <button type="submit" disabled={loading} className="btn-primary inline-flex items-center gap-2">
        {loading ? <Loader2 size={16} className="animate-spin" /> : <Link2 size={16} />}
        Shorten link
      </button>
    </form>
  )
}
